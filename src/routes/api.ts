import express from "express";
const router = express.Router();
import {
  createNewUser,
  getUserByEmail,
  deleteUserByEmailRequest,
} from "../controllers";
import { apiIsLoggedIn } from "../passport";
import passport from "passport";

router.get("/api/", getUserByEmail);
router.post(
  "/api/login",
  passport.authenticate("local"),
  (req: express.Request, res: express.Response) =>
    res.json({ message: "success", user: req.user })
);
router.post("/api/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.json({ message: "Logoued out!" });
  });
});

router.get(
  "/api/protected",
  apiIsLoggedIn,
  (req: express.Request, res: express.Response) =>
    res.json({
      // @ts-ignore
      message: "Welcome to a protected route user: " + req.user.username,
    })
);

router.post("/api/newUser", createNewUser);

router.delete("/api/deleteUser", deleteUserByEmailRequest);

export { router };
