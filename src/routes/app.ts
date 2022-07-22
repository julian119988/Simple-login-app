import express from "express";
const router = express.Router();
import { createNewUser, loginUser } from "../controllers";
import { authorization } from "../middlewares/auth.middlewares";

router.get("/", (req, res) => res.render("index"));

router.post("/login", loginUser);
router.get("/create", (req, res) => res.render("createUser"));
router.get("/protected", authorization, (req, res) =>
  res.send("Protected route")
);
router.post("/createAccount", createNewUser);

export { router };
