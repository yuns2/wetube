import routes from "../routes";
import Video from "../models/Video";

export const home = async (req, res) => {
  // await : 다음 과정이 끝날 때까지 잠시 기다려 달라는 의미, async 없이 쓸 수 없다.
  // Database에 있는 모든 Video를 가져오게 됨
  // 이 과정이 끝나면 videos가 정해지고, render 과정에서 쓰이게 된다.
  // = await 부분이 끝나기 전까지는 render 부분을 실행하지 않을 것이라는 걸 확실히 보여줌
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

export const search = async (req, res) => {
  //   const searchingBy = req.query.term;
  const {
    query: { term: searchingBy },
  } = req;
  let videos = [];
  try {
    // 정규 표현식을 사용하고, 여기에 옵션 추가
    // $options: "i" -> i: insensitive (대소문자를 구분하지 않음)
    // video가 없다면 빈 배열이 반환되고, 있다면 찾은 비디오가 reassign 됨.
    // > 변수를 let으로 선언한 이유
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};
export const getUpload = (req, res) =>
  res.render("upload", {
    pageTitle: "Upload",
  });

export const postUpload = async (req, res) => {
  // body를 받아온다.
  const {
    // req 안에 있는 body에서 file, title, description을 가져온다.
    body: { title, description },
    // file을 form으로부터 받을 필요 없어짐
    file: { path },
  } = req;
  const newVideo = await Video.create({
    fileUrl: path,
    title,
    description,
  });
  console.log(newVideo);
  // To Do : Upload and save video ( 비디오 업로드 및 저장 )
  // 비디오 업로드 > 비디오 생성 > id 생성 > 생성된 비디오(데이터)의 id값을 가져올 수 있다.
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  // video의 id가 출력된다. → 하지만 이건 오직 이름이 id 일때만 해당
  // console.log(req.params.id);
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    res.render("videoDetail", {
      // 비디오 변수를 템플릿에 전달해보자
      pageTitle: `${video.title}`,
      video,
    });
  } catch (error) {
    res.redirect(routes.home);
  }
  // 여기서 얻은 id는 위에서 얻은 id이다.
};

export const getEditVideo = async (req, res) => {
  // getEditVideo는 템플릿을 렌더링 하는 것이고, postEditVideo는 video를 업데이트 하는 것이다.
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
  } catch (error) {
    res.redirect(routes.home);
  }
};
export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;
  try {
    // 단순 업데이트 -> 변수를 따로 만들지 않는다.
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    // 업데이트 하고 나서 다시 해당 비디오 페이지로 이동 ( 수정사항 확인 )
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};
export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    // 해당하는 비디오 찾아서 지우기
    await Video.findOneAndRemove({ _id: id });
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};
