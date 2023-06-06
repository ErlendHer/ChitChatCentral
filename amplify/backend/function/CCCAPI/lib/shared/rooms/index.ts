import { AWSDateTime } from "lib/src/core/graphqlRequest";
import { ApiResponse } from "../response";

export type Response_CreateRoom = {
  roomId: string;
}

export type Response_GetRoom = {
  creator: string;
  name: string;
  requireInvite: boolean;
  createdAt: string;
  roomId: string;
  secret: string;
}

export interface UserInfo {
  username: string;
  displayName?: string;
  profileUrl?: string;
}

export type Response_Participants = {
  participants: UserInfo[];
}

export type Response_SendMessage = {
  messageId: string;
  roomId: string;
  time: string;
  username: string;
  content: string;
}

export type Response_GetMessages = {
  messages: {
    content: string;
    time: AWSDateTime;
    username: string;
    id: string;
  }[]
}

export type Response_AddParticipant = Response_GetRoom;
export type Response_RemoveParticipant = Response_GetRoom;
export type Response_ToggleOpenToPublic = Response_GetRoom
export interface RoomsResponses {
  "create": ApiResponse<Response_CreateRoom>;
  "[id]": ApiResponse<Response_GetRoom>;
  "[id]/messages": ApiResponse<Response_GetMessages>;
  "[id]/participants": ApiResponse<Response_Participants>;
  "[id]/participants/add": ApiResponse<Response_AddParticipant>;
  "[id]/participants/remove": ApiResponse<Response_RemoveParticipant>;
  "[id]/send": ApiResponse<Response_SendMessage>;
  "[id]/toggleOpenToPublic": ApiResponse<Response_ToggleOpenToPublic>;
}


export interface Request_SendMessage {
  message: string;
  timestamp: string;
}

export interface Request_ToggleOpenToPublic {
  openToPublic: boolean;
}

export interface Request_AddParticipant {
  username: string;
}
