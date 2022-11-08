import User from "../models/User.js";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => { return res.render("join", { pageTitle: "Join"}) }
export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";
    if(password !== password2) {
        return res.status(400).render("join", { pageTitle, errorMessage: "Password confirmation does not match."});
    }
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if(exists) {
        return res.status(400).render("join", { 
            pageTitle, 
            errorMessage: "This email/username already taken."
        });
    }

    try {
        await User.create({
            email,
            // avatarUrl: ""
            // socialOnly: false,
            username,
            password,
            name,
            location,
        });
        return res.redirect('/login');
    } catch(error){
        // console.log(error);
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: error._message,
        });
    }

    
} 
export const getLogin = (req, res) => { return res.render("login", { pageTitle: "Login" })}
export const postLogin = async (req, res) => {
    // '/login'으로 post 요청을 보냈을 때
    // check if account exist
    // check if password correct

    const { username, password } = req.body;
    const pageTitle = "Login"
    const user = await User.findOne({ username, socialOnly: false });
    if(!user) {
        return res.status(400).render("login", { pageTitle, errorMessage: "An account with this username does not exist."})
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) { // 비밀번호 일치 X
        return res.status(400).render("login", { pageTitle, errorMessage: "Wrong password."})
    }
    req.session.loggedIn = true;
    req.session.user = user;
    console.log(req.session.user)
    console.log("LOG USER IN, COMING SOON!");
    res.redirect('/');
}

export const startGithubLogin = (req, res) => {
    const baseUrl ="https://github.com/login/oauth/authorize";
    const config = {
        client_id : process.env.GH_CLIENT,
        allow_signup : false,
        scope : "read:user user:email"
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com"
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        console.log(userData);
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        // console.log(emailData);
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if(!emailObj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email });
        if(!user) {
            // create an account
            user = await User.create({
                email: emailObj.email,
                avatarUrl: userData.avatar_url,
                socialOnly: true,
                username:userData.login,
                password: "",
                name:userData.name,
                location: userData.location
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        console.log("created!");
        return res.redirect("/");
    } else {
        return res.redirect("/login");
    }
};

export const logout = (req, res) => { 
    req.session.loggedIn = null;
    req.session.loggedIn = false;
    req.flash("info", "Bye Bye");
    return res.redirect("/");
}

export const getEdit = (req, res) => {
    return res.render("edit-profile", {pageTitle: "Edit Profile", user:req.session.user});
}

export const postEdit = async (req, res) => {
    const pageTitle = "Edit Profile";
    const { 
        session: {
            user: { _id, avatarUrl }
        },
        body: { name, email, username, location},
        file,
    } = req;
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (exists && exists._id!=_id) {
        return res.status(400).render("edit-profile", {
            pageTitle,
            errorMessage: "This username/email is already taken."
        })
    }
    const updatedUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? file.location : avatarUrl,
        name,
        email,
        username,
        location
    }, { new: true });

    
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
}

export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly === true) {
        req.flash("error", "Can't change password.");
        return res.redirect("/")
    }
	return res.render("users/change-password", { pageTitle: "Change Password" })
}
export const postChangePassword = async (req, res) => {
	// send notification
    const {
        session : {
            user : {_id, password},
        },
        body: {
            oldPassword, 
            newPassword, 
            newPasswordConfirm 
        }
    } = req;
    const ok = await bcrypt.compare(oldPassword, password);
    if(newPassword !== newPasswordConfirm) {
        return res.status(400).render("users/change-password", { 
            pageTitle: "Change Password", 
            errorMessage: "The password does not match the confirmation."
        });
    }
    if(!ok){
        return res.status(400).render("users/change-password", { 
            pageTitle: "Change Password", 
            errorMessage: "The current password is incorrect."
        });
    }
    // Change the password here.
    const user = await User.findById(_id);
    user.password = newPassword;
    await user.save();
    req.flash("info", "Password updated");
    return res.redirect("/")
}

export const see = async (req, res) => { 
    const { id } = req.params;
    const user = await User.findById(id).populate({
        path: "videos",
        populate: {
            path: "owner",
            model: "User"
        }
    });
    if(!user){
        return res.status(404).render("404", { pageTitle: "User not found." });
    }
    return res.render("users/profile", { pageTitle: user.name, user});
}

