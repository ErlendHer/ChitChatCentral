import { cccApiGET } from "$lib/client/utils/apiUtils";
import type { GraphQLSubscription } from "@aws-amplify/api";
import type { Response_GetMessages, RoomsResponses } from "@cccApi/rooms";
import { API, graphqlOperation } from "aws-amplify";
import { nanoid } from "nanoid";
import { writable, type Writable } from "svelte/store";
import type { NewMessageSubscription } from "../../../../../../API";
import { newMessage } from "../../../../../../graphql/subscriptions";

export interface Message {
  readonly id: string;
  readonly content: string;
  readonly timeSent: string;
  readonly username: string;
  readonly isAuthor: boolean;
  localOnly: boolean;
}

export type MessageSync = Writable<Message[]> & {
  addMessages: (newMessages: Response_GetMessages) => void;
  addLocalMessage: (message: string) => void;
  onNewMessageEvent: (message: MessageFromSubscription) => void;
}

export function createMessageSync(username: string) {
  const { subscribe, update } = writable<Message[]>([]);

  const addMessages = (newMessages: Response_GetMessages) => update((oldMessages) => {

    const syncedMessages: Message[] = [];

    let oldIdx = 0;
    let newIdx = newMessages.messages.length - 1;

    // Use an algorithm similar to merge sort to merge the old and new messages together
    // This is necessary because the new messages are not guaranteed to be in order and
    // There might be some messages missing locally (if an subscription event was missed)
    while (oldIdx < oldMessages.length || newIdx >= 0) {
      const curOldTimestamp = oldIdx < oldMessages.length ? new Date(oldMessages[oldIdx].timeSent).getTime() : 0;
      const curNewTimestamp = newIdx > 0 ? new Date(newMessages.messages[newIdx].time).getTime() : 0;

      if (curOldTimestamp > curNewTimestamp) {
        const oldMessage = oldMessages[oldIdx];

        // Only add message if it is not local. If the message was successfully added it should be updated here.
        if (!oldMessage.localOnly) {
          syncedMessages.push(oldMessages[oldIdx]);
          oldIdx++;
        }

      } else {
        const curUsername = newMessages.messages[newIdx].username;
        syncedMessages.push({
          id: newMessages.messages[newIdx].id,
          content: newMessages.messages[newIdx].content,
          timeSent: newMessages.messages[newIdx].time,
          username: curUsername,
          isAuthor: username === curUsername,
          localOnly: false,
        });
        newIdx--;
      }
    }

    return syncedMessages;
  });

  const addLocalMessage = (message: string) => update((oldMessages) => {
    return [...oldMessages, {
      id: nanoid(),
      content: message,
      timeSent: new Date().toISOString(),
      username,
      isAuthor: true,
      localOnly: true,
    }]

  });

  const onNewMessageEvent = (message: MessageFromSubscription) => {

    update(oldMessages => {

      // Check if the new message is already in the list of messages as a local only message.
      for (let i = 0; i < oldMessages.length; i++) {
        // If we found a local message with the same content, update localOnly to confirm the message was sent.
        if (oldMessages[i].localOnly && message.content === oldMessages[i].content) {
          oldMessages[i].localOnly = false;
          return oldMessages;
        }
      }

      return [...oldMessages, {
        id: message.id,
        content: message.content,
        timeSent: message.time,
        username: message.username,
        isAuthor: username === message.username,
        localOnly: false,
      }];

    })

  }

  return {
    subscribe,
    addMessages,
    addLocalMessage,
    onNewMessageEvent
  }

}

export type MessageFromSubscription = {
  content: string;
  time: string;
  username: string;
  id: string;
}

export async function getMessages(roomId: string, after?: string) {
  const params = new URLSearchParams();

  if (after) {
    params.set('after', after);
  }

  const url = `/rooms/${roomId}/messages?${params.toString()}`;
  return await cccApiGET<RoomsResponses["[id]/messages"]>(url);
}

export function listenForNewMessages(roomId: string, messageSync: MessageSync) {

  console.log("Subscribing to", roomId)
  // Subscribe to creation of Todo
  const sub = API.graphql<GraphQLSubscription<NewMessageSubscription>>(
    graphqlOperation(newMessage, { roomId: roomId, variables: { roomId: roomId } })
  ).subscribe({
    next: ({ provider, value }) => {
      console.log("Received sub event", value);
      if (value && value.data?.newMessage) {
        messageSync.onNewMessageEvent(value.data.newMessage);
      }
    },
    error: (error) => console.warn(error)
  });

  return sub;
}