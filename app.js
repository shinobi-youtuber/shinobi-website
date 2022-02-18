const express = require('express')
const app = express()
const port = process.env.PORT || 3000 ;
const http = require("http");
const server = http.createServer(app);
const cors = require('cors')
const options = { cors: { origin: ["http://localhost:443"], methods: ["GET", "POST"] } };
const io = require('socket.io')(server, options);

app.use(cors()) // cors config

app.use("/", express.static('./public/website')) // arquivos estaticos
app.use("/dashboard", express.static('./public/dashboard')) // arquivos estaticos


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