const socket = io("/");
const main__chat__window = document.getElementById("main__chat_window");
const videoGrids = document.getElementById("video-grids");
const myVideo = document.createElement("video");
const chat = document.getElementById("chat");
OtherUsername = "";
chat.hidden = true;
myVideo.muted = true;

window.onload = () => {
    $(document).ready(function () {
        $("#getCodeModal").modal("show");
    });
};

const peer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: "3030",
});

let myVideoStream;
const peers = {};
const getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

sendmessage = (text) => {
    if (event.key === "Enter" && text.value != "") {
        socket.emit("messagesend", myname + " : " + text.value);
        text.value = "";
        main__chat_window.scrollTop = main__chat_window.scrollHeight;
    }
};

navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream, myname);

        socket.on("user-connected", (id, username) => {
            console.log("userid:" + id);
            connectToNewUser(id, stream, username);
            socket.emit("tellName", myname);
        });

        socket.on("user-disconnected", (id) => {
            console.log(peers);
            if (peers[id]) peers[id].close();
        });
    });

peer.on("call", (call) => {
    getUserMedia(
        { video: true, audio: true },
        function (stream) {
            call.answer(stream);
            const video = document.createElement("video");
            call.on("stream", function (remoteStream) {
                addVideoStream(video, remoteStream, OtherUsername);
            });
        },
        function (err) {
            console.log("Failed to get local stream", err);
        }
    );
});

peer.on("open", (id) => {
    socket.emit("join-room", roomId, id, myname);
});

socket.on("createMessage", (message) => {
    const ul = document.getElementById("messageadd");
    const li = document.createElement("li");
    li.className = "message";
    li.appendChild(document.createTextNode(message));
    ul.appendChild(li);
});

socket.on("AddName", (username) => {
    OtherUsername = username;
    console.log(username);
});

const RemoveUnusedDivs = () => {
    const alldivs = videoGrids.getElementsByTagName("div");
    for (let i = 0; i < alldivs.length; i++) {
        const e = alldivs[i].getElementsByTagName("video").length;
        if (e === 0) {
            alldivs[i].remove();
        }
    }
};

const connectToNewUser = (userId, streams, myname) => {
    const call = peer.call(userId, streams);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream, myname);
    });
    call.on("close", () => {
        video.remove();
        RemoveUnusedDivs();
    });
    peers[userId] = call;
};

const cancel = () => {
    $("#getCodeModal").modal("hide");
};

const copy = async () => {
    const roomid = document.getElementById("roomid").innerText;
    await navigator.clipboard.writeText(
        "http://localhost:3030/join/" + roomid
    );
};

const invitebox = () => {
    $("#getCodeModal").modal("show");
};

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        document.getElementById("mic").style.color = "deeppink";
    } else {
        document.getElementById("mic").style.color = "white";
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
};

const VideomuteUnmute = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        document.getElementById("video").style.color = "deeppink";
    } else {
        document.getElementById("video").style.color = "white";
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
};

const showchat = () => {
    chat.hidden = !chat.hidden;
};

const addVideoStream = (videoEl, stream, name) => {
    videoEl.srcObject = stream;
    videoEl.addEventListener("loadedmetadata", () => {
        videoEl.play();
    });

    const h1 = document.createElement("h1");
    h1.textContent = name;
    h1.style.color = "#fff";
    h1.style.textShadow = "0 0 5px deeppink";

    const videoGrid = document.createElement("div");
    videoGrid.classList.add("video-grid");

    videoGrid.appendChild(h1);
    videoGrid.appendChild(videoEl);
    videoGrids.appendChild(videoGrid);

    RemoveUnusedDivs();

    const totalUsers = document.getElementsByTagName("video").length;
    if (totalUsers > 1) {
        const width = 100 / totalUsers + "%";
        document.querySelectorAll("video").forEach((v) => {
            v.style.width = width;
        });
    }
};
