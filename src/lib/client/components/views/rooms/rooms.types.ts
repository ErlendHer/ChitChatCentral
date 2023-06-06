export interface ProfileInfo {
  username: string;
  displayName: string;
  profileUrl: string;
}

export interface RoomCommand_join {
  type: "join",
  payload: {
    user: ProfileInfo;
  }
}


export interface RoomCommand_leave {
  type: "leave",
  payload: {
    user: ProfileInfo;
  }
}

export interface RoomCommand_update {
  type: "update"
}

export type RoomMessage = {
  id: string;
  command: RoomCommand_leave | RoomCommand_join | RoomCommand_update;
}