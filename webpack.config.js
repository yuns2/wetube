const path = require("path");
const autoprefixer = require("autoprefixer");
const ExtractCSS = require("extract-text-webpack-plugin");

const MODE = process.env.WEBPACK_ENV;
// import path from "path"; 대신 아래의 코드를 사용한다.
// __dirname : 현재의 디렉토리 이름으로 어디서든 접근 가능한 Node.js 전역변수
const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
// "static"이라는 파일로 보내라
const OUTPUT_DIR = path.join(__dirname, "static");
const config = {
  // entry : 파일들이 어디에서 왔는가?
  entry: ["@babel/polyfill", ENTRY_FILE],
  // output : 그것을 어디에다 넣는가
  output: {
    path: OUTPUT_DIR,
    filename: "[name].js",
  },
  plugins: [new ExtractCSS("styles.css")],
  mode: MODE,
  // module을 발견할 때마다 아래 rules를 따르시오.
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        // scss 파일을 찾았을 경우 css로 형식을 바꾸고, 그 css에 해당하는 텍스트 전체를 추출해서 CSS를 변환한다.
        // 단, 먼저 어떤 조건을 알아봐라 (test) > scss로 끝나는 어떤 module을 만나게 되면
        // 해당 플러그인을 사용하시오. > 단, 이 플러그인은 내부에서 또 플러그인을 사용하고 있음 > scss 파일을 일반적인 css로 통역해야하기 때문.
        // 이를 위해 loader를 사용한다.
        test: /\.(scss)$/,
        //잘 호환되는, 순수한 CSS가 불러와지면, 우린 딱 그 부분만 텍스트를 추출해서 어딘가로 보낼거야!
        use: ExtractCSS.extract([
          {
            // webpack이 CSS를 이해할 수 있게 해준다.
            loader: "css-loader",
          },
          {
            // CSS를 받아서 플러그인을 가지고 CSS로 변환해준다.
            // 예를 들어, 현재 내가 갖고 있는 CSS를 익스플로러와 호환되게 만들고 싶을 때!
            // prefix부터 잡다한 것들까지 처리해주는 것 > CSS 호환성 관련된 걸 해결한다.
            loader: "postcss-loader",
            options: {
              // plugin은 함수이고, 이 함수가 리턴하는 것은 plugin들로 구성된 array > 이 경우에는 plugin이 하나임 (autoprefixer)
              plugins() {
                // 지금은 리턴해주는 플러그인이 하나지만, 우리가 원할 경우 추가할 수 있다.
                // autoprefixer에도 옵션을 추가해줄 수 있다 > 코드 유지보수를 위한 browserslist
                return [autoprefixer({ browsers: "cover 99.5%" })];
              },
            },
          },
          {
            // Sass or SCSS를 받아서 일반 CSS로 바꿔줄 수 있다.
            loader: "sass-loader",
          },
        ]),
      },
    ],
  },
};

module.exports = config;
