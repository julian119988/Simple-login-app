import { Strategy, IStrategyOptions } from "passport-local";
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { prisma } from "../db";

const options: IStrategyOptions = {
  usernameField: "email",
};

const strategy = new Strategy(options, async (username, password, done) => {
  if (!username || !password)
    return done(null, false, { message: "Missing data" });
  const user = await prisma.users.findFirst({ where: { email: username } });
  if (!user) return done(null, false, { message: "No user with that email" });
  if (!(await verifyUser(password, user.password)))
    return done(null, false, { message: "Wrong password" });
  return done(null, {
    id: user.id,
    email: user.email,
    username: user.username,
  });
});

async function verifyUser(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

passport.use(strategy);

// @ts-ignore
passport.serializeUser((users, done) => done(null, users.id));

passport.deserializeUser(async (id: string | number, done) => {
  const user = await prisma.users.findUnique({ where: { id: id.toString() } });
  if (!user) return done("No user to deserialize");

  return done(null, user);
});

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();

  // Consider showing either an error, or simply redirect the user to log in page
  // res.status(401).json('You must be logged in to do this.');
  res.status(401).redirect("/");
};
export const apiIsLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) return next();

  // Consider showing either an error, or simply redirect the user to log in page
  // res.status(401).json('You must be logged in to do this.');
  res.status(401).json({ message: "You are not logged in." });
};
