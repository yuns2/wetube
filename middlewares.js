import multer from "multer";
import routes from "./routes";
// 아래 미들웨어는 코드 사이에 들어가기 때문에 next()를 써줘야 함

const multerVideo = multer({ dest: "uploads/videos/" });
export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "WeTube";
  res.locals.routes = routes;
  res.locals.loggedUser = req.user || null;
  // middleware의 문제를 잡아보자 -> 현재 로그인한 사용자는 누구인가.
  console.log(req.user);
  next();
};

export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};
// single : 오직 하나의 파일만 업로드 할 수 있는 걸 의미함
// single 이 후의 괄호는 name part로 파일의 name을 입력한다.

export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(routes.home);
  }
};
export const uploadVideo = multerVideo.single("videoFile");
