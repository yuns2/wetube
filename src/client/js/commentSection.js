const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const videoComments = document.querySelector(".video__comments ul");
const deleteBtns = videoComments.querySelectorAll(".deleteBtn");

const handleDelete = async (event) => {
    const target = event.target;
    const liToDelete = target.parentElement;
    const commentId = liToDelete.dataset.id;
    videoComments.removeChild(liToDelete);

    const response = await fetch(`/api/comments/${commentId}/comment`, {
        method: "DELETE",
    })
    // console.log(response);
    if(response.status === 202) {
        liToDelete.remove();
    }
}

const addComment = (text, id) => {
	const newComment = document.createElement("li");
    newComment.dataset.id = id;
	newComment.className = "video__comment";

	const content = document.createElement("span");
	content.innerText = `${text}`;

    const deleteBtn = document.createElement("span");
    deleteBtn.innerText = "❌";
    deleteBtn.addEventListener("click", handleDelete);

	newComment.appendChild(content);
    newComment.appendChild(deleteBtn);
	videoComments.prepend(newComment);
	// element를 맨 위에 추가한다.
}

const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text }),
    });
    // console.log(response);

    if(response.status === 201) {
        textarea.value = "";
        const { newCommentId } = await response.json();
        addComment(text, newCommentId);
    }
}



if(form) { 
    form.addEventListener("submit", handleSubmit);
}

deleteBtns.forEach(item => {item.addEventListener("click", handleDelete)});


