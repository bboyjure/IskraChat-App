const express = require("express")
const app = express()
const http = require("http")
const PORT = process.env.PORT || 3000
const path = require("path")
const socketio = require("socket.io")

const server = http.createServer(app)
const io = socketio(server)


const formatMessage = require("./utils/messages")
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users")


//Set static folder
app.use(express.static(path.join(__dirname, "public")))

const botName = "Josip Bros Tito"


//Run when client connects
io.on("connection", (socket) =>{  

    //join Room
    socket.on("joinRoom", ({ username, room }) => {

        const user = userJoin(socket.id, username, room)
        socket.join(user.room)


        socket.emit("message", formatMessage(botName, "Welcome to IskraChat"))
        //Client Connects
        socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} joined the chat`));

        io.to(user.room).emit(`roomUsers`, {room: user.room, users: getRoomUsers(user.room)})

    })

    
    socket.on("chatMessage", (msg)=>{
        const user = getCurrentUser(socket.id)

        io.to(user.room).emit("message", formatMessage(user.username, msg))
    })


    
    //Client Disconects
    socket.on("disconnect", ()=>{
        const user = userLeave(socket.id)

        if(user){
            io.to(user.room).emit("message", formatMessage(botName, `${user.username} left the chat`))
        }

    })


})



server.listen(PORT, () => {console.log(`Server started on port ${PORT}`)})