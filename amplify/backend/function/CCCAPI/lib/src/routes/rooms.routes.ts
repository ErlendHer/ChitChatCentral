import { Router } from "express";
import * as RoomsController from "../controllers/rooms/rooms.controller";

const router = Router();

router.post("/create", RoomsController.createRoom)
router.get("/:roomId/messages", RoomsController.listMessages);
router.post("/:roomId/send", RoomsController.sendMessage);
router.post("/:roomId/toggleOpenToPublic", RoomsController.toggleOpenToPublic);
router.post("/:roomId/participants/add", RoomsController.updateParticipant("add"));
router.post("/:roomId/participants/remove", RoomsController.updateParticipant("remove"));
router.get("/:roomId/participants", RoomsController.getParticipants);
router.get("/:roomId", RoomsController.getRoomInfo);


export { router as RoomsRouter }