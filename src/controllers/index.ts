import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient, users } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";

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
      const token = jwt.sign({ user }, process.env.SECRET);
      res
        .cookie("access_token", token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        })
        .redirect("/profile?username=" + user.username);
    } else {
      res.redirect("/");
    }
  } catch (err) {
    res.send(`${err.message} <a href="/">Go back</a>`);
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
