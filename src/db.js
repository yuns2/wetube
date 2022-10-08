import mongoose from "mongoose";

// mongdb에 새로운 database를 만든다.
// mongoose.connect("mongodb://127.0.0.1:27017/(name of db) ");

mongoose.connect(process.env.DB_URL, { 
    useNewUrlParser: true, 
    useUnifiedToPology: true
});

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = () => console.log("❌ DB Error : ", error);
// 여기서 에러는 mongoose로 부터 받게됨.
// 이벤트 설정

db.on("error", handleError);
db.once("open", handleOpen);


