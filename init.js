import dotenv from "dotenv";
import "./db";
import app from "./app";

dotenv.config();

import "./models/Video";
import "./models/Comment";
import "./models/User";

// dotenv에서 port 번호를 불러오되, 만일 대상을 못 찾으면 4000번으로
// 이렇게 하면 키가 다른 곳에서 보이지 않게 됨
const PORT = process.env.PORT || 4000;
const handleListening = () =>
  console.log(`✅ Listening on: http://localhost:${PORT}`);
app.listen(PORT, handleListening);
