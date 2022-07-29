import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db";

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

export const getUserByEmail = async (req: Request, res: Response) => {
  const email = req.query.email;
  try {
    if (email && typeof email === "string") {
      const dbResponse = await findUserByEmail(email);
      res.send(dbResponse);
    } else {
      res.send("No user");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const findUserByEmail = async (email: string) => {
  const user = await prisma.users.findFirst({
    where: {
      email: email,
    },
  });
  if (user) {
    return user;
  } else {
    return "No user";
  }
};

const deleteUserByEmail = async (email: string) => {
  const deletedUser = await prisma.users.delete({
    where: {
      email,
    },
  });
  if (deletedUser)
    return `User with email ${deletedUser.email} was deleted successfully.`;
  return "No user with that email.";
};

export const deleteUserByEmailRequest = async (req: Request, res: Response) => {
  const email = req.query.email;
  try {
    if (email && typeof email === "string") {
      const deletedUser = await deleteUserByEmail(email);
      res.send(deletedUser);
    } else {
      res.send("Error with email");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
