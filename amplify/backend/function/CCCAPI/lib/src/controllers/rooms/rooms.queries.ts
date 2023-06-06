import { AWSDateTime } from "lib/src/core/graphqlRequest";


/**
 * **NOTE** All available fields in the query MUST be returned for the subscription to trigger.
 * Do not remove any of the fields, the app will break.
 * https://docs.aws.amazon.com/appsync/latest/devguide/aws-appsync-real-time-data.html
 */
export const createRoomMutation = `
mutation CreateRoom($input: CreateRoomInput!) {
  createRoom(input: $input) {
    createdAt
    creator
    creatorSub
    id
    name
    participants
    requireInvite
    secret
    updatedAt
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
    secret: string;
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
    secret
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
  secret: string;
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
    roomId
    createdAt
    username
    content
    time
    updatedAt
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
    roomId: string;
    createdAt: string;
    username: string;
    content: string;
    time: string;
    updatedAt: string;
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

export const updateRoomQuery = `
mutation ToggleOpenToPublic($input: UpdateRoomInput!) {
  updateRoom(input: $input) {
    id
    createdAt
    creator
    creatorSub
    name
    participants
    requireInvite
    updatedAt
    secret
  }
}
`;

export interface ToggleOpenToPublicVariables {
  input: {
    id: string;
    requireInvite: boolean;
  }
}


export interface UpdateParticipantsVariables {
  input: {
    id: string;
    participants: string[];
  }
}



export interface GQL_RESPONSE_UpdateRoom {
  updateRoom: {
    id: string;
    createdAt: string;
    creator: string;
    creatorSub: string;
    name: string;
    participants: string[];
    requireInvite: boolean;
    updatedAt: string;
    secret: string;
  }
}