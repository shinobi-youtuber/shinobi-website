const express = require('express')
const app = express()
const port = process.env.PORT || 3000 ;
const http = require("http");
const server = http.createServer(app);
const cors = require('cors')
const options = { cors: { origin: ["http://localhost:443"], methods: ["GET", "POST"] } };
const io = require('socket.io')(server, options);
const mongo = require("mongoose")
const ejs = require("ejs")
const siteroutes = require('./router/routes')

app.use(cors()) // cors config

app.set("view engine", "ejs")

// static files 
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/assets/css"))
app.use("/js", express.static(__dirname + "public/assets/js"))
app.use("/images", express.static(__dirname + "public/assets/images"))
app.use("/fonts", express.static(__dirname + "public/assets/fonts"))


// routes
app.use("/", siteroutes)



// app.use("/", express.static('./public/website'))
 // arquivos estaticos
// app.use("/post", express.static('./public/website/Post.html'))
 // arquivos estaticos
// app.use("/dashboard", express.static('./public/dashboard')) 
// arquivos estaticos


// socket 
io.on("connect", (socket) => {
  console.info('cliente conectado')

  socket.on('disconnect', () => {
    console.log('cliente desconectou')
  })
})


server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })