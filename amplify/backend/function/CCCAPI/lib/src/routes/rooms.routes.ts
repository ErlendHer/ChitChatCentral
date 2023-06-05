import { Router } from "express";
import * as RoomsController from "../controllers/rooms/rooms.controller";

const router = Router();

router.post("/create", RoomsController.createRoom)
router.get("/:roomId/messages", RoomsController.listMessages);
router.post("/:roomId/send", RoomsController.sendMessage);
router.get("/:roomId/participants", RoomsController.getParticipants);
router.get("/:roomId", RoomsController.getRoomInfo);

export { router as RoomsRouter }