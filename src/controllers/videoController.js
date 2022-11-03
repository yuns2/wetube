import Video from '../models/Video.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';

export const home = async (req, res) => {
    const videos = await Video.find({}).sort({createdAt:"desc"}).populate("owner");
    // console.log(videos);
    return res.render("home", { pageTitle : "Home", videos });
}

export const search = async (req, res) => { 
    // console.log(req.query);    
    const { keyword } = req.query
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex : new RegExp(keyword, "i"),
            }
        }).populate("owner");
    }
    console.log(videos);
    return res.render("search", { pageTitle: "Search", videos });
}

export const watch = async (req, res) => {
	const { id } = req.params;
    const video = await Video.findById(id).populate("owner").populate("comments");
    // console.log(video.owner);
    if (!video) { // error 먼저 처리
        return res.render("404", { pageTitle: "Video Not Found."});
    }
    return res.render("watch", { pageTitle: video.title, video});

}

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const { user: { _id } } = req.session;
    const video = await Video.findById(id);
    // const hashtags = video.hashtags.toString().replaceAll("#", "");
    if (!video) { // error 먼저 처리
        return res.render("404", { pageTitle: "Video Not Found."});
    }
    console.log(video.owner, _id);
    if(String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    return res.render("edit", { pageTitle: video.title, video})
};

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { user: { _id } } = req.session;
    const video = await Video.exists({_id:id});
    const { title, description, hashtags } = req.body;
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video Not Found."});
    }
    if(String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags : Video.formatHashtags(hashtags)
    })
    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle : "Upload Video" });
}

export const postUpload = async (req, res) => {
    const { user: { _id } } = req.session;
    const { path: fileUrl } = req.file;
    const { title, description, hashtags } = req.body;
    try {
        const newVideo = await Video.create({
            title,
            description,
            fileUrl,
            owner: _id,
            hashtags: Video.formatHashtags(hashtags),
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect('/');
    } catch(error) {
        console.log(error);
        return res.status(400).render("upload", { pageTitle : "Upload Video", errorMessage : error._message });
    }
}

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    const { user: { _id } } = req.session;
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video Not Found."});
    }
    if(String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    return res.redirect('/');
    
}

export const createComment = async (req, res) => {
    const {
        session: { user },
        body: { text },
        params: { id }
    } = req;

    // console.log(user, text, id);
    const video = await Video.findById(id);
    const currentUser = await User.findById(user._id);
    const comment = await Comment.create({ 
        text,
        owner: user._id,
        video: id
    });

    video.comments.push(comment._id)
    video.save();
    currentUser.comments.push(comment._id)
    currentUser.save();
    user.comments.push(comment._id)
    console.log(comment.owner)
    
    return res.status(201).json({newCommentId: comment._id});
}

export const deleteComment = async (req, res) => {
    // comment id
    const { 
        params: { id:commentId },
        session: { user }
    } = req;
    const comment = await Comment.findById(commentId).populate("owner");
    const ownerId = comment.owner._id.toString();
    if(ownerId !== user._id){
        return res.sendStatus(403);
    }
    await Comment.findByIdAndRemove(commentId)
    return res.sendStatus(202);
}

export const registerView = async (req, res) => {
	const { id } = req.params;
	const video = await Video.findById(id);
	if(!video) {
		// video가 없으면
		return res.sendStatus(404);
	}
	// video가 있으면, video update
		video.meta.views = video.meta.views + 1;
		await video.save();
		return res.sendStatus(200);
	

}