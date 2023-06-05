import { ApiResponse } from "../response";

export type Response_CreateRoom = {
  roomId: string;
}

export type Response_GetRoom = {
  creator: string;
  name: string;
  participants: string[];
  requireInvite: boolean;
  createdAt: string;
}

export interface RoomsResponses {
  "create": ApiResponse<Response_CreateRoom>;
  "[id]": ApiResponse<Response_GetRoom>;
}