import express from "express";
import { createComment, deleteComment } from "../controllers/videoController.js"

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete('/comments/:id([0-9a-f]{24})/comment', deleteComment);

export default apiRouter;