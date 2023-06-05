import { Router } from "express";
import * as RoomsController from "../controllers/rooms/rooms.controller";

const router = Router();

router.get("/", RoomsController.rooms);
router.post("/create", RoomsController.createRoom)

export { router as RoomsRouter }