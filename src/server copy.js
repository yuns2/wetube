import express from "express";
/* 서버 생성 */
const PORT = 4000;
const app = express();

/* app 설정 */
// const logger  = (req, res, next) => {
//     console.log(`${req.method} ${req.url}`);
//     next();
// }

// const privateMiddleware = (req, res, next) => {
//     const url = req.url;
//     if (url === "/protected") {
//         res.send("<h1>Not allowed</h1>");
//     }
//     console.log("Allowed, you may continue.")
//     next();
// }

// const handleHome = (req, res) => {
//     return res.send("I love middleware.");
// }

// const handleProtected = (req, res) => {
//     return res.send("Welcome to the private lounge.")
// }

// app.use(logger);
// app.use(privateMiddleware);
// app.get('/', handleHome);
// app.get('/protected', handleProtected);

// handleHome({...},{...});

/* 외부에 개방 */
// const handleListening = () => {
//     console.log(`Server listening on port http://localhost:${PORT} 🚀`);
// }
const hello = (req, res) => {
    res.send("hello");
}

app.get('/', hello);

app.listen(PORT, console.log("연결되었습니다."));

// port 4000만 listening
// port : 너의 컴퓨터로의 창, 문
// 서버는 컴퓨터 전체를 listen할 수 없다.
// 해당 포트로 request를 보낸다.

