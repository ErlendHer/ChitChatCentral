import { AWSDateTime } from "lib/src/core/graphqlRequest";

export const createRoomMutation = `
mutation CreateRoom($input: CreateRoomInput!) {
  createRoom(input: $input) {
    id
    name
    participants
    requireInvite
    creator
  }
}
`;

export interface CreateRoomVariables {
  input: {
    id: string;
    name: string;
    participants: string[];
    requireInvite: boolean;
    creator: string;
    creatorSub: string;
  }
}

export const getRoomQuery = `
query GetRoom($id: ID!) {
  getRoom(id: $id) {
    id
    creator
    name
    participants
    requireInvite
    createdAt
  }
}
`;

export interface GetRoomData {
  id: string;
  creator: string;
  name: string;
  participants: string[];
  requireInvite: boolean;
  createdAt: string;
}

export interface GQL_RESPONSE_getRoom {
  getRoom?: GetRoomData
}

export interface GetRoomVariables {
  id: string;
}

export const createMessageQuery = `
mutation CreateMessage($input: CreateMessageInput!) {
  createMessage(input: $input) {
    id
  }
}
`
export interface CreateMessageVariables {
  input: {
    content: string;
    time: AWSDateTime;
    roomId: string;
    username: string;
  }
}

export interface GQL_RESPONSE_createMessage {
  createMessage?: {
    id: string;
  }
}

export const getMessagesAfterDateQuery = `
query GetMessagesByRoomId($roomId: ID!, $after: String!, $limit: Int!) {
  messagesByRoomIdAndTime(roomId: $roomId, sortDirection: DESC, time: {gt: $after}, limit: $limit) {
    items {
      content
      time
      username
      id
    }
  }
}
`;

export const getAllMessagesQuery = `
query GetMessagesByRoomId($roomId: ID!, $limit: Int!) {
  messagesByRoomIdAndTime(roomId: $roomId, sortDirection: DESC, time: {}, limit: $limit) {
    items {
      content
      time
      username
      id
    }
  }
}
`;

export interface GetAllMessagesVariables {
  roomId: string;
  limit: number;
}

export interface GetAllMessagesAfterVariables extends GetAllMessagesVariables {
  after: string;
}

export interface GQL_RESPONSE_getMessages {
  messagesByRoomIdAndTime: {
    items: {
      content: string;
      time: AWSDateTime;
      username: string;
      id: string;
    }[]
  }
}