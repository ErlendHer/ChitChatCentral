import { writable } from "svelte/store";
import type { RoomMessage } from "../rooms.types";
import { PubSub } from "aws-amplify";

export const roomMessage = writable<RoomMessage | undefined>();

export const publishMessage = (secret: string, message: RoomMessage) => {
  PubSub.publish(`secret`, message);
};