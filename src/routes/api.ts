import express from "express";
const router = express.Router();
import {
  createNewUser,
  getUserByEmail,
  deleteUserByEmailRequest,
} from "../controllers";

router.get("/api/", getUserByEmail);

router.post("/api/newUser", createNewUser);

router.delete("/api/deleteUser", deleteUserByEmailRequest);

export { router };
