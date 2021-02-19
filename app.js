// express를 불러온다.
// const express = require('express');
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";
import routes from "./routes";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";

import "./passport";

// 어플리케이션 생성 > 변수 app에 express를 실행해서 담음
const app = express();
// const PORT = 4000;
const CokieStore = MongoStore(session);
console.log(process.env.COOKIE_SECRET);

// const handleListening = () =>
//   console.log(`Listening on: http://localhost:${PORT}`);

// const handleHome = (req, res) => res.send("Hello from my ass");

// const handleProfile = (req, res) => res.send("You are on my profile");
// const betweenHome = (req, res, next) => {
//   console.log("Between");
//   next();
// };

// 코드 순서 중요함 : 위에서 아래로 > middleware 정의해준뒤 route 반환
// app.use(betweenHome);
app.use(helmet());
app.set("view engine", "pug");

// 만약 누군가 '/uploads'로 간다면, express.static()을 이용해
// (directory에서 file을 보내주는 middleware)
// 그러므로 이 경우에는 어떤 종류의 controller나 view 같은건 확인하지 않음 > file만 확인함
// '/uploads'로 간다면, express.static()을 이용해 'upload'라는 directory 안으로 들어가게 됨
app.use("/uploads", express.static("uploads"));
// static이라는 이름의 route가 존재하지 않기 때문에 추가해준다.
app.use("/static", express.static("static"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(morgan("dev"));
// 요 위치에 써 준 이유? 위에서 실행된 cookieParser로부터 쿠키가 여기까지 쭉 내려와서 passport는 초기화되고,
// passport가 쿠키를 들여다봐서, 그 쿠키 정보에 해당하는 사용자를 찾아줄거임
// 그리고 passport는 자기가 찾은 그 사용자를 요청(request)의 Object, 즉 req.user로 만들어준다.
// -> user object를 template에 추가시켜 줄 수 있다.
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUnintialized: false,
    // mongoose > 이 저장소를 데이터베이스 ( 즉, mongoDB )에 연결해줄거임
    // 서버를 재시작한다고 해도 쿠키를 계속 보존할 수 있고, 유저는 로그인 상태를 유지할 수 있다.
    store: new CokieStore({ mongooseConnection: mongoose.connection }),
  })
);
// app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(localsMiddleware);

/*미들웨어 생성하기*/
// app.use((req, res, next) => {})
// app.use(function (req, res, next) {
// })
// const localsMiddleware = (req, res, next) => {
// }
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);
// const middleware = (req, res, next) => {
//   res.send("not happening");
// };
// app.get("/", handleHome);
// app.get("/profile", handleProfile);
// use 메서드의 의미 : 누군가 /user 경로에 접속하면,
// userRouter에 있는 경로 전체를 사용하겠다는 의미
// app.use("/user", userRouter);
// 콜백함수로 handleListening 설정
// app.listen(PORT, handleListening);

export default app;
