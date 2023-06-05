import { Router } from "express";
import * as RoomsController from "../controllers/rooms/rooms.controller";

const router = Router();

router.post("/create", RoomsController.createRoom)
router.get("/:roomId", RoomsController.getRoomInfo);

export { router as RoomsRouter }