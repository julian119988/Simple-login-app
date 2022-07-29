import express from "express";
const router = express.Router();
import { createNewUser } from "../controllers";
import { authorization } from "../middlewares/auth.middlewares";
import { isLoggedIn } from "../passport";
import passport from "passport";

router.get("/", (req, res) => res.render("index"));
router.get("/profile", authorization, (req, res) => {
  const username = req.query.username;
  res.render("loggedIn", { username });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/protected",
    failureRedirect: "/",
  })
);
router.get("/create", (req, res) => res.render("createUser"));
router.get(
  "/protected",
  isLoggedIn,
  (req: express.Request, res: express.Response) => {
    console.log(req.user);
    //@ts-ignore
    res.render("loggedIn", { username: req.user.username });
  }
);
router.post("/createAccount", createNewUser);
router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

export { router };
