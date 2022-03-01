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
const session = require("express-session")
const store = new session.MemoryStore();


// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// app.post("/login", (req, res) => {
//   // console.log(req.sessionID)
//   if (req.session.authenticated) {
//     // ja esta logado 
//   console.log('ja esta logado')    
//   } else {
//     if (req.body.pass == "123") {
//       // logou 
//       req.session.authenticated = true;
//       console.log('logou')
//       res.json(req.session)
//     }else {
//       // senha errada
//       console.log("senha errada")
//       // res.status(403).json({msg : "bad"})
//       res.json(req.session)
//     } 
//   }
// })

// app.get("/login/exit", (req, res) => {
//   // deslogar
//   delete req.session.authenticated;
// })

// app.get("/dashboard", (req, res)=> {
//   if(req.session.authenticated){
//     // dashboard
//     res.render("/")
//   }else {
//     res.render("./dashboard/dashboard.ejs")
//   }
// })
// router end 

// login end 


app.use(cors()) // cors config

app.set("view engine", "ejs")

// static files 
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/assets/css"))
app.use("/js", express.static(__dirname + "public/assets/js"))
app.use("/images", express.static(__dirname + "public/assets/images"))
app.use("/fonts", express.static(__dirname + "public/assets/fonts"))
app.use("/plugins", express.static(__dirname + "public/assets/plugins"))



// routes
app.use("/", siteroutes)



// app.use("/", express.static('./public/website'))
 // arquivos estaticos
// app.use("/post", express.static('./public/website/Post.html'))
 // arquivos estaticos
// app.use("/dashboard", express.static('./public/dashboard')) 
// arquivos estaticos



// Parse JSON bodies (as sent by API clients)
app.use(express.json());

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

  module.exports = app