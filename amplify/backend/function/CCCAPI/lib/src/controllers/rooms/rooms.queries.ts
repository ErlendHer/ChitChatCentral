export const createRoomMutation = `mutation CreateRoom($input: CreateRoomInput!) {
  createRoom(input: $input) {
    id
    name
    participants
    requireInvite
    creator
  }
}`;

export interface CreateRoomVariables {
  input: {
    id: string;
    name: string;
    participants: string[];
    requireInvite: boolean;
    creator: string;
  }
}