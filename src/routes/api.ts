import express from "express";
const router = express.Router();
import { createNewUser, getUser } from "../controllers";

router.get("/api/", getUser);

router.post("/api/newUser", createNewUser);

export { router };
