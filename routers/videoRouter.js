import express from "express";
import routes from "../routes";
import {
  getUpload,
  postUpload,
  videoDetail,
  getEditVideo,
  postEditVideo,
  deleteVideo,
} from "../controllers/videoControllers";
import { uploadVideo, onlyPrivate } from "../middlewares";

const videoRouter = express.Router();

// export default -> 파일로 export 한다는 의미

videoRouter.get(routes.upload, onlyPrivate, getUpload);
// 여기까지 입력했을 때, 우리가 file을 upload하면 server에 있는 folder(video/)에 file이 upload되고,
// postUpload라는 function이 해당 file에 접근할거임
videoRouter.post(routes.upload, onlyPrivate, uploadVideo, postUpload);
videoRouter.get(routes.videoDetail(), videoDetail);
videoRouter.get(routes.editVideo(), onlyPrivate, getEditVideo);
videoRouter.post(routes.editVideo(), onlyPrivate, postEditVideo);
videoRouter.get(routes.deleteVideo(), onlyPrivate, deleteVideo);

export default videoRouter;
