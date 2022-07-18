import express from "express";
const router = express.Router();
import { createNewUser, getUser, loginUser } from "../controllers";

router.get("/", (req, res) => res.render("index"));

router.post("/login", loginUser);
router.get("/create", (req, res) => res.render("createUser"));
router.post("/createAccount", createNewUser);

export { router };
