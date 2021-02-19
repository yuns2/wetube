import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

// 다른 소셜 계정을 통해 가입했으면, 이메일로 가입하려고 할 때 그 사실을 알려주어야 한다.
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  avatarUrl: String,
  facebookId: Number,
  githubId: Number,
});

// 어떤 field를 username으로 할 것인지 알려주어야 한다. > 우리의 경우는 email을 쓰도록 한다.
UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });
const model = mongoose.model("User", UserSchema);

export default model;
