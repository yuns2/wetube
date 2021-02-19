import express from "express";
import routes from "../routes";
import {
  userDetail,
  editProfile,
  changePassword,
} from "../controllers/userControllers";
import { onlyPrivate } from "../middlewares";

const userRouter = express.Router();

userRouter.get(routes.editProfile, onlyPrivate, editProfile);
userRouter.get(routes.changePassword, onlyPrivate, changePassword);
userRouter.get(routes.userDetail(), userDetail);

export default userRouter;

// // 기본적으로 표시되는 화면은 user index
// userRouter.get("/", (req, res) => res.send('user index'));
// userRouter.get("/edit", (req, res) => res.send('user edit'));
// userRouter.get("/password", (req, res) => res.send('user password'));

// MVC에 맞게 분리해보자 !
