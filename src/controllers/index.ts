import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createNewUser = async (req: Request, res: Response) => {
  try {
    const { email, password, username, password2 } = await req.body;
    if (!email || !password || !username || !password2)
      throw new Error("Missing data");
    if (password !== password2) throw new Error("Passwords do not match");
    const hashedPassword = await hashPassword(password);
    await prisma.users.create({
      data: { email, username, password: hashedPassword },
    });
    res.render("loggedIn", { username });
  } catch (err) {
    // Comment to force deploy
    console.log(err);
    res.send(err.message);
  }
};

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function verifyUser(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

export const getUser = async (req: Request, res: Response) => {
  const email = req.query.email;
  try {
    if (email && typeof email === "string") {
      const user = await prisma.users.findFirst({
        where: {
          email: email,
        },
      });
      console.log(user);
      if (user) {
        res.send(user);
      } else {
        res.send("No user");
      }
    } else {
      res.send("No user");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) throw new Error("Missing data");
    const user = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) throw new Error("User not found");
    const isPasswordCorrect = await verifyUser(password, user.password);
    if (isPasswordCorrect) {
      res.render("loggedIn", { username: user.username });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    res.send(`${err.message} <a href="/">Go back</a>`);
  }
};
