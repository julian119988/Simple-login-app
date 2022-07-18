import express from "express";
import { router as apiRouter } from "./api";
import { router as appRouter } from "./app";
const router = express.Router();

router.use(apiRouter);
router.use(appRouter);

export { router };
