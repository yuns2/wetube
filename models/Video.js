import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    // required로 설정하고, required가 충족되지 못하면 다음과 같은 에러 메세지를 출력한다.
    // > fileUrl 값이 없는 Video를 생성하려 한다면 다음 에러 메세지를 받는다.
    required: "File URL is required",
  },
  title: {
    type: String,
    required: "Title is required",
  },
  description: String,
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    // 생성일자
    type: Date,
    // Date.now > 현재 날짜를 받아오는 함수
    default: Date.now,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      // 어떤 object ID가 온건지, 어느 model에서 온건지 알려주기
      // reference
      ref: "Comment",
    },
  ],
});

// model 이름은 "Video", Video model의 schema는 VideoSchema가 될거임
const model = mongoose.model("Video", VideoSchema);

export default model;
