import mongoose from "mongoose";
// 모두가 볼 수 있는 url 대신 dotenv.config 함수를 통해 .env파일 안에 있는 정보를 가져옴
// > 찾은 모든 변수들을 process.env.key에 저장한다.
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  // 새로운 버전의 MongoDB는 다음과 같이 Configuration을 보낼 수 있음.
  useNewUrlParser: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

// connection을 열고 성공여부를 확인할 수 있는 function을 만든다.

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) =>
  console.log(`🚫 Error on DB Connection : ${error}`);

db.once("open", handleOpen);
db.on("error", handleError);
