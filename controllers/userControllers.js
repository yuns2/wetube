import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};
//- 메서드가 post인 /join 경로에서만 작동하게 됨

// Join을 처리하는 Controller를 Middleware로 바꾼다.
export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 },
  } = req;
  if (password !== password2) {
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      // To Do : Register User ( 사용자 등록 )
      // To Do : Log user in ( 사용자 로그인 )
      const user = await User({
        name,
        email,
      });
      await User.register(user, password);
      next();
      console.log("Success Join");
    } catch (error) {
      console.log(error);
      console.log("실패!!");
      res.redirect(routes.home);
    }
    // 리다이렉트 해제 -> 사용자를 다른 페이지로 보낼 것이 아니라, 바로 로그인 시켜주기 위해서!
  }
};

// 로그인 해주는 Controller 만들기
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });

export const postLogin = passport.authenticate("local", {
  // local -> 우리가 설치해준 strategy의 이름
  // authenticate : 정보를 찾아보고, 일치 여부에 따라 successRedirect, failureRedirect의 route가 결정됨
  failureRedirect: routes.login,
  successRedirect: routes.home,
});

// 사용자를 github으로 보내기
export const githubLogin = passport.authenticate("github");
// 사용자가 github에서 돌아왔을 때 실행되는 함수
export const githubLoginCallback = async (
  // cb > passport로부터 우리에게 제공되는 것
  // 함수에 들어가는 파라미터 중에 사용하지 않는 것이 있을 때, _로 표시함
  // 아예 없애 버리면 안됨!
  _,
  __,
  profile,
  cb
) => {
  // profile._json 안에 있는 정보들을 가져올거임.
  const {
    _json: { id, avatar_url, name, email },
  } = profile;
  try {
    // passport에서 cb는 인증이 성공한 상황에서 호출이 되어야 함
    const user = await User.findOne({ email });
    if (user) {
      // 특정 이메일을 가진 사용자를 찾으면, 이 유저의 githubId(user.githubId) 깃헙에서 가져온 id로 할당할거임
      user.githubId = id;
      user.avatarUrl = avatar_url;
      user.name = name;
      user.save();
      return cb(null, user);
    }
    // 만약 사용자를 찾지 못했다면, 새로운 계정을 생성한다.
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl: avatar_url,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGithubLogIn = (req, res) => {
  res.redirect(routes.home);
};

export const facebookLogin = passport.authenticate("facebook");
export const facebookLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, name, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      // 특정 이메일을 가진 사용자를 찾으면, 이 유저의 githubId(user.githubId) 깃헙에서 가져온 id로 할당할거임
      user.facebookId = id;
      user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
      user.name = name;
      user.save();
      return cb(null, user);
    }
    // 만약 사용자를 찾지 못했다면, 새로운 계정을 생성한다.
    const newUser = await User.create({
      email,
      name,
      facebookId: id,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postFacebookLogin = (req, res) => {
  res.redirect(routes.home);
};
export const logout = (req, res) => {
  // To Do : Process Log out ( 로그아웃 처리 )
  req.logout();
  res.redirect(routes.home);
};
export const getMe = async (req, res) => {
  // user detail과 하는일 똑같음
  // 단, user를 현재 로그인 된 사용자로 전달함
  res.render("userDetail", {
    pageTitle: "User Detail",
    user: req.user,
  });
};
export const users = (req, res) =>
  res.render("users", {
    pageTitle: "Users",
  });

export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const user = await User.findById(id);
    res.render("userDetail", {
      pageTitle: "User Detail",
      user,
    });
  } catch (error) {
    res.redirect(routes.home);
  }
};
export const editProfile = (req, res) =>
  res.render("editProfile", {
    pageTitle: "Edit Profile",
  });
export const changePassword = (req, res) =>
  res.render("changePassword", {
    pageTitle: "Change Password",
  });
