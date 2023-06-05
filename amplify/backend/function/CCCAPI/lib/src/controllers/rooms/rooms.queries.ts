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
    creator
    name
    participants
    requireInvite
    createdAt
  }
}
`;

export interface GQL_RESPONSE_getRoom {
  getRoom?: {
    creator: string;
    name: string;
    participants: { S: string }[];
    requireInvite: boolean;
    createdAt: string;
  }
}

export interface GetRoomVariables {
  id: string;
}