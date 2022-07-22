import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const authorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, process.env.SECRET);
    console.log(data);
    return next();
  } catch {
    return res.sendStatus(403);
  }
};
