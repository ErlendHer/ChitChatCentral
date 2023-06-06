export interface ProfileInfo {
  username: string;
  displayName: string;
  profileUrl: string;
}

export interface RoomCommand_message {
  type: "message",
  payload: {
    message: string;
    timeSent: string;
    sender: ProfileInfo;
  }
}

export interface RoomCommand_join {
  type: "join",
  payload: {
    user: ProfileInfo;
  }
}

export type RoomMessage = {
  id: string;
  command: RoomCommand_message | RoomCommand_join;
}