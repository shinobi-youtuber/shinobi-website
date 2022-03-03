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
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const sectionhtml = require("./dashboard/htmlsection")


// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

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

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// socket 
io.on("connect", (socket) => {
  console.info('cliente conectado')

  socket.on("dados_post", (dados_post) =>{
   let {postfixed, content} = dados_post
    // jsdom start
    let titulo_da_pagina = `${postfixed.titulo}-${Math.floor(Math.random() * 1000)}` 
    JSDOM.fromFile("./views/website/post.ejs", { runScripts: "dangerously" }).then(dom => {

 // todo things to change
    dom.window.document.querySelector("#titulo").innerHTML = postfixed.titulo // titulo
    dom.window.document.querySelector("#img_banner").innerHTML = `<img  src="data:image/jpg;base64,${postfixed.img_banner}" alt="" srcset="">`//img_banner
    dom.window.document.querySelector("#descrição_do_post").innerHTML = postfixed.post_desc //descrição
    dom.window.document.querySelector("#link_btn_download").href = postfixed.link_btn_download //btn downlaod

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    dom.window.document.querySelector("#tag").innerHTML = `<div>cor1</div>`
    dom.window.document.querySelector("#data").innerHTML = `${today}`
    // dom.window.eval(`document.querySelector("p").innerHTML = "ola mundo"`)
    console.log(content.length)
    if(content.length == 0){
      console.log(dados_post)
      socket.emit("link_pagina_criada", `Erro Pagina não criada` )
      return
// errro consertar amanha 
    }else{

    for (var i = 0; i < content.length; i++) { //inverter ordem
      // console.log(cotent)
      // console.log(content[i])

      console.log("passou aqui")
      // let el = content[i]
      // console.log(el[0])
      // console.log(el[0].video)
      // console.log(el[0].paragrafo)


      var d1 = dom.window.document.querySelector('.welcome-area');
      // EDITAR SECTION START
      let section = new JSDOM(sectionhtml)
      // 
      if(content[i].img != ""){
        section.window.document.querySelector(".content-img").innerHTML = `<img src="data:image/jpg;base64,${content[i].img}" alt="">`
      }else{
        section.window.document.querySelector(".content-img").remove()
      }
      // 
      if(content[i].video != ""){
        section.window.document.querySelector(".content-video").innerHTML = content[i].video
      }else{
        section.window.document.querySelector(".content-video").remove()
      }
      // 
      if(content[i].paragrafo != ""){
        section.window.document.querySelector(".content-text").innerHTML = `<p> ${content[i].paragrafo}</p>`
      }else{
        section.window.document.querySelector(".content-text").remove()
      }
      // EDITAR SECTION END
      dom.window.document.querySelector('.welcome-area').insertAdjacentHTML('afterend', section.serialize())
    }

  }


    // writefile start
      // Change the content of the file as you want
      // or either set fileContent to null to create an empty file
      // var fileContent = "conteudo do arquivo";
      let fileContent = dom.serialize()
      // The absolute path of the new file with its name
      var filepath = `./views/website/posts/${titulo_da_pagina}.ejs`;

      fs.writeFile(filepath, fileContent, (err) => {
          if (err) throw err;

          console.log(`The file was succesfully saved! ${filepath}`);
          socket.emit("link_pagina_criada", `/posts/${titulo_da_pagina}` )
          // console.info(process.env.PATH)
      }); 
    // writefile end
    });  
    // jsdom end
  })
  socket.on("load_busca", () => {
    let data_info = []
    fs.readdir('./views/website/posts', (err, data) => {
      if (err) throw err;
      // console.log(data);
      data.forEach((a) => {
       JSDOM.fromFile(`./views/website/posts/${a}`).then(post => {
          let tag = post.window.document.querySelector("#tag").innerHTML
          let data_de_criação = post.window.document.querySelector("#data").innerHTML 
          data_info.push({"nome":a , tag, data_de_criação})
          // console.log(data_info)
        })
      })
      
    
    });
    setTimeout(()=>{
        socket.emit("load_busca_res", data_info)
    }, 1000)
    
    console.log('enviou')
  })


  socket.on('disconnect', () => {
    console.log('cliente desconectou')
  })
  
})

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

