const socket = io()
const chatForm = document.getElementById("chat-form")
const chatMessages = document.querySelector(".chat-messages")
const roomNmae = document.getElementById("room-name")
const userList = document.getElementById("users")


//QS username adn room from url query
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})


//Join
socket.emit("joinRoom", { username, room })

socket.on("roomUsers", ({ room, users})=>{
    outputRoomName(room);
    outputUsers(users)
})



socket.on("message", message => {
    console.log(message)
    outputMassage(message)

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})


chatForm.addEventListener("submit", (e)=>{
    e.preventDefault();

    const msg = e.target.elements.msg.value;    
    socket.emit("chatMessage", msg)

    e.target.elements.msg.value = "";
    e.target.elements.msg.focus()

})

function outputMassage(msg){
    const div = document.createElement("div")
    div.classList.add("message");
    div.innerHTML= `<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.text}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div)
}



function outputRoomName(room){
    roomNmae.innerText = room;
}

function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user=> `<li>${user.username}</li>`).join('')}
    `;
}