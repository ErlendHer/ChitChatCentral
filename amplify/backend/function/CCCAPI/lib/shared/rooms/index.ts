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
}

export type Response_GetMessages = {
  messages: {
    content: string;
    time: AWSDateTime;
    username: string;
    id: string;
  }[]
}

export interface RoomsResponses {
  "create": ApiResponse<Response_CreateRoom>;
  "[id]": ApiResponse<Response_GetRoom>;
  "[id]/messages": ApiResponse<Response_GetMessages>;
  "[id]/participants": ApiResponse<Response_Participants>;
  "[id]/send": ApiResponse<Response_SendMessage>;
}


export interface Request_SendMessage {
  message: string;
  timestamp: string;
}