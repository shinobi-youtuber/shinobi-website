const express = require('express')
const app = express()
const port = process.env.PORT || 3000 ;
const http = require("http");
const server = http.createServer(app);
const cors = require('cors')
const options = { cors: { origin: ["*"], methods: ["GET", "POST"] } };
const io = require('socket.io')(server, options);
const mongo = require("mongoose")
const ejs = require("ejs")
const siteroutes = require('./router/routes')
const session = require("express-session")
const store = new session.MemoryStore();
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const sectionhtml = require("./dashboard/htmlsection");
const { param, post } = require('./router/routes');


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
    // criar post start
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

      today = dd + '/' + mm + '/' + yyyy;
        console.log(postfixed)
      dom.window.document.querySelector("#tag").innerHTML = `<div><i class="tag tag-1" style="color: ${postfixed.tag.texto}; background-color: ${postfixed.tag.cor};">${postfixed.tag.tag}</i> </div>`
      dom.window.document.querySelector("#data").innerHTML = `${today}`

      //scripts e banners
      if(postfixed.scripts != ""){
        dom.window.document.querySelector("#scripts").innerHTML = `<!-- scripts --> ${postfixed.scripts}`
      }
      if(postfixed.banners.acima != ""){
        dom.window.document.querySelector("#acima").innerHTML = `${postfixed.banners.acima}`
      }
      if(postfixed.banners.abaixo != ""){
        dom.window.document.querySelector("#abaixo").innerHTML = `${postfixed.banners.abaixo}`
      }
      


      let i = true
      content.forEach(element => {
        if(element.img == null){
          i = false
        }
      });
      i == true ? criapost() : console.log("tem null no conteudo")
      function criapost() {
        if(content.length == 0){
          socket.emit("content_vazio")
          console.log(`conteudo vazio: ${content.length}`)
          console.log(dados_post)
        }else{
        for (var i = content.length; i > 0; i--) {
          // console.log(cotent)
          // console.log(content[i])
          // console.log(dados_post)
          console.log("passou aqui")
          // let el = content[i]
          // console.log(el[0])
          // console.log(el[0].video)
          // console.log(el[0].paragrafo)


          var d1 = dom.window.document.querySelector('.welcome-area');
          // EDITAR SECTION START
          let section = new JSDOM(sectionhtml)
          // 
          if(content[i-1].img != ""){
            section.window.document.querySelector(".content-img").innerHTML = `<img src="${content[i-1].img}" alt="">`
          }else{
            section.window.document.querySelector(".content-img").remove()
          }
          // 
          if(content[i-1].video != ""){
            section.window.document.querySelector(".content-video").innerHTML = content[i-1].video
          }else{
            section.window.document.querySelector(".content-video").remove()
          }
          // 
          if(content[i-1].paragrafo != ""){
            section.window.document.querySelector(".content-text").innerHTML = `<p> ${content[i-1].paragrafo}</p>`
          }else{
            section.window.document.querySelector(".content-text").remove()
          }
          // EDITAR SECTION END
          dom.window.document.querySelector('.welcome-area').insertAdjacentHTML('afterend', section.serialize())
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

        }
      }
        });  
      // jsdom end

    })
    // criar post end

    // busca start
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
    // busca end

    // excluir start
    socket.on("excluir", (params) => {
   
        fs.unlink(`./views/website/posts/${params}`, (err) => {
          if (err) {
              throw err;
          }
          console.log("File is deleted.");
        });

    })
    // excluir end

    // editar start
    socket.on("editar", (params) => {
      console.log(params)

      JSDOM.fromFile(`./views/website/posts/${params}`).then( post => {
        let postfixed = {
          "titulo": post.window.document.querySelector("#titulo").innerHTML,
          "img_banner": post.window.document.querySelector("#img_banner").innerHTML,
          "post_desc":  post.window.document.querySelector("#descrição_do_post").innerHTML,
          "tag": {
              tag: post.window.document.querySelector(".tag").innerHTML,
              cor: post.window.document.querySelector(".tag").style.backgroundColor,
              texto: post.window.document.querySelector(".tag").style.color,
          },
          "link_btn_download": post.window.document.querySelector("#link_btn_download").href,
          "scripts": post.window.document.querySelector("#scripts").innerHTML,
          "banners": {
              acima: post.window.document.querySelector("#acima").innerHTML,
              abaixo: post.window.document.querySelector("#abaixo").innerHTML,
            }
        }
        // content start
        let content = [
          {"img": "", "video": "", "paragrafo": ""},
        ]   
        let sectionlength = post.window.document.querySelectorAll(".container-content").length
        let img = post.window.document.querySelectorAll(".content-img")
        let video = post.window.document.querySelectorAll(".content-video")
        let text =  post.window.document.querySelectorAll(".content-text")
        for (let i = sectionlength; i > 0; i--) {

          if(i === 1){  
            let image = ""
            let videos = ""
            let paragrafo = ""
            if(img[i-1].innerHTML != ""){
            image = img[i-1].innerHTML
            }
            if(video[i-1].innerHTML != ""){
            videos = video[i-1].innerHTML
            }
            if(text[i-1].innerHTML != ""){
            paragrafo = text[i-1].innerHTML  
            }
            content.push({"img": image, "video": videos, "paragrafo": paragrafo})
          }else{
            let image = ""
            let videos = ""
            let paragrafo = ""

            if(video[i-1].innerHTML != ""){
            videos = video[i-1].innerHTML
            }
            if(text[i-1].innerHTML != ""){
            paragrafo = text[i-1].innerHTML  
            }
            content.push({"img": image, "video": videos, "paragrafo": paragrafo})

          }
        }
          socket.emit("editar_res", postfixed, content, params)

      })
    })

    socket.on("dados_post_editar", (dados_post, nome_pagina) => {
      console.log("chegou aqui editar")



      let {postfixed, content} = dados_post
      console.log(postfixed)
      console.log(nome_pagina)
      console.log(content)


      // jsdom start
      // let titulo_da_pagina = `${postfixed.titulo}-${Math.floor(Math.random() * 1000)}` 
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

      today = dd + '/' + mm + '/' + yyyy;
      dom.window.document.querySelector("#tag").innerHTML = `<div><i class="tag tag-1" style="color: ${postfixed.tag.texto}; background-color: ${postfixed.tag.cor};">${postfixed.tag.tag}</i> </div>`
      dom.window.document.querySelector("#data").innerHTML = `${today}`

      //scripts e banners
      if(postfixed.scripts != ""){
        dom.window.document.querySelector("#scripts").innerHTML = `<!-- scripts --> ${postfixed.scripts}`
      }
      if(postfixed.banners.acima != ""){
        dom.window.document.querySelector("#acima").innerHTML = `${postfixed.banners.acima}`
      }
      if(postfixed.banners.abaixo != ""){
        dom.window.document.querySelector("#abaixo").innerHTML = `${postfixed.banners.abaixo}`
      }
      


      let i = true
      content.forEach(element => {
        if(element.img == null){
          i = false
        }
      });
      i == true ? criapost() : console.log("tem null no conteudo")
      function criapost() {
        if(content.length == 0){
          socket.emit("content_vazio")
          console.log(`conteudo vazio: ${content.length}`)
          console.log(dados_post)
        }else{
        for (var i = content.length; i > 0; i--) {

          console.log("passou aqui")

          var d1 = dom.window.document.querySelector('.welcome-area');
          // EDITAR SECTION START
          let section = new JSDOM(sectionhtml)
          // 
          if(content[i-1].img != ""){
            section.window.document.querySelector(".content-img").innerHTML = `<img src="${content[i-1].img}" alt="">`
          }else{
            section.window.document.querySelector(".content-img").remove()
          }
          // 
          if(content[i-1].video != ""){
            section.window.document.querySelector(".content-video").innerHTML = content[i-1].video
          }else{
            section.window.document.querySelector(".content-video").remove()
          }
          // 
          if(content[i-1].paragrafo != ""){
            section.window.document.querySelector(".content-text").innerHTML = `<p> ${content[i-1].paragrafo}</p>`
          }else{
            section.window.document.querySelector(".content-text").remove()
          }
          // EDITAR SECTION END
          dom.window.document.querySelector('.welcome-area').insertAdjacentHTML('afterend', section.serialize())
        }
        // writefile start
          // Change the content of the file as you want
          // or either set fileContent to null to create an empty file
          // var fileContent = "conteudo do arquivo";

          let fileContent = dom.serialize()
          // The absolute path of the new file with its name
          var filepath = `./views/website/posts/${nome_pagina}`;

          fs.writeFile(filepath, fileContent, (err) => {
              if (err) throw err;

              console.log(`The file was succesfully saved! ${filepath}`);
              // socket.emit("link_pagina_criada", `/posts/${titulo_da_pagina}` )
              // console.info(process.env.PATH)
          }); 
        // writefile end

        }
      }
        });  
      // jsdom end


    })
    // editar end


  socket.on('disconnect', () => {
    console.log('cliente desconectou')
  })
  
})

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

