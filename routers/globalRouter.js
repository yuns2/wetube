import express from "express";
import passport from "passport";
import routes from "../routes";
import { home, search } from "../controllers/videoControllers";
import {
  getJoin,
  getLogin,
  logout,
  postJoin,
  postLogin,
  githubLogin,
  postGithubLogIn,
  getMe,
  facebookLogin,
  postFacebookLogin,
} from "../controllers/userControllers";
import { onlyPublic, onlyPrivate } from "../middlewares";
// import { get } from "mongoose";

const globalRouter = express.Router();

globalRouter.get(routes.join, onlyPublic, getJoin);
// Middleware가 정보를 다음 것으로 넘겨준다.
// postJoin이 사용자 정보를 받아서 다음 것으로 넘겨주면 ( next middleware 이용 )
// 이를 이용해서 postLogin Controller 실행 ( 로그인 실행 )
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);
globalRouter.get(routes.logout, onlyPrivate, logout);

globalRouter.get(routes.gitHub, githubLogin);
// passport를 사용해서 로그인해준다.
globalRouter.get(
  routes.githubCallback,
  passport.authenticate("github", { failureRedirect: "/login" }),
  postGithubLogIn
);

globalRouter.get(routes.me, getMe);

globalRouter.get(routes.facebook, facebookLogin);
globalRouter.get(
  routes.facebookCallback,
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  postFacebookLogin
);

export default globalRouter;
