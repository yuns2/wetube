import passport from "passport";
import GithubStrategy from "passport-github";
import FacebookStrategy from "passport-facebook";
import User from "./models/User";
import {
  githubLoginCallback,
  facebookLoginCallback,
} from "./controllers/userControllers";
import routes from "./routes";

passport.use(User.createStrategy());

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
      // github 페이지로 갔다가 돌아올 때, 돌아오는 페이지
      callbackURL: `http://localhost:4000${routes.githubCallback}`,
    },
    githubLoginCallback
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_ID,
      clientSecret: process.env.FB_SECRET,
      callbackURL: `https://fluffy-dragon-99.serverless.social${routes.facebookCallback}`,
      profileFields: ["id", "displayName", "photos", "email"],
      scope: ["public_profile", "email"], 
    },
    facebookLoginCallback
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
