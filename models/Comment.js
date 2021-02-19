import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: "Text is required",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // id = 1 에 해당하는 video를 가져와줘
  //   video: 1,
  // 이 comment는 이 video와 연결되어 있고,
  //   video: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     // 어떤 object ID가 온건지, 어느 model에서 온건지 알려주기
  //     // reference
  //     ref: "Video",
  //   },
});
const model = mongoose.model("Comment", CommentSchema);
export default model;
