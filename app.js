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
const {sectionhtml, block_post} = require("./dashboard/htmlsection");
const { param, post } = require('./router/routes');
const AWS = require('aws-sdk');
const { resolve } = require('path');
const { rejects } = require('assert');
const { stringify } = require('querystring');

process.env.AWS_ACCESS_KEY_ID="AKIA4JV5SG6BE34CY72D"
process.env.AWS_SECRET_ACCESS_KEY="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"

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

// AWS

// Set the Region 
AWS.config.update({region: 'us-west-2'});
// Create S3 service object
s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  AWS_BUCKET_REGION: "sa-east-1" ,
})
// list bucket
function listBuckets() {
// Call S3 to list the buckets
s3.listBuckets(function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Buckets);
  }
});
}
// listBuckets
function listObjects(bucketName) {

  // Create the parameters for calling listObjects
  var bucketParams = {
    Bucket : bucketName,
  };

  // Call S3 to obtain a list of the objects in the bucket
  s3.listObjects(bucketParams, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
      return data
    }
  });

}
// createBucket
function createBucket(nomeBucket) {
  // Create the parameters for calling createBucket
      var bucketParams = {
        Bucket : nomeBucket
      };

      // call S3 to create the bucket
      s3.createBucket(bucketParams, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data.Location);
        }
      });
}
// upload
function uploadfile(bucketName, fileName) {
          
        // call S3 to retrieve upload file to specified bucket
        const uploadParams = {Bucket: bucketName, Key: '', Body: ''};
        const file = fileName;
        const key = fileName.replace("./", "")

        // Configure the file stream and obtain the upload parameters
        var fileStream = fs.createReadStream(file); // ??

        fileStream.on('error', function(err) {
          console.log('File Error', err);
        });
        uploadParams.Key = key
        uploadParams.Body = fileStream;

        var path = require('path');
        // uploadParams.Key = path.basename(file);

        // call S3 to retrieve upload file to specified bucket
        s3.upload (uploadParams, function (err, data) {
          if (err) {
            console.log("Error", err);
          } if (data) {
            console.log("Upload Success", data.Location);
          }
        });
}
//delete bucket
function deleteBucket(bucketName) {

        // Create params for S3.deleteBucket
      var bucketParams = {
        Bucket : bucketName,
      };

      // Call S3 to delete the bucket
      s3.deleteBucket(bucketParams, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });

}
// obter objeto
function getObject(bucketName, filekey) {
      
  const bucketParams = {
    Bucket: bucketName,
    Key: filekey,
  };
s3.getObject(bucketParams, (err, data) => {
  if(err){
    console.error(err)
  }else{
  console.log(`objeto baixado com sucesso: ${data /*.Body.toString('utf-8')*/ }`)
  }
})


}
// delete object
function deleteObject(bucketName, filekey) {
  const bucketParams = {
    Bucket: bucketName,
    Key: filekey,
  };

  s3.deleteObject(bucketParams, (err, data) =>{
    if(err){
      console.log(err)
    }else{
      console.log(`apagado com sucesso`)
    }
  })
}



// uploadfile("shinobi-youtube", "./views/website/index.ejs")
// listObjects("shinobi-youtube")
// getObject("shinobi-youtube", "views/website/posts/Cuphead-Two-Maps-677.ejs")
// https://shinobi-youtube.s3.sa-east-1.amazonaws.com/input.txt

// deleteObject("shinobi-youtube", "input.txt")

// envia todos os arquivos da pasta posts para s3 - shinobi-youtube
// nao duplica
function enviaposts() {
  fs.readdir("./views/website/posts", (err, data) => {
    if(err){
      console.error(err)
    }else{
      // console.log(data)
      data.forEach(a => {
        const path = (`./views/website/posts/${a}`)
        uploadfile("shinobi-youtube", path)
  
      })
    }
  })
}
// obtem posts do s3 
function obtemposts(bucketName) {

  // Create the parameters for calling listObjects
  var bucketParams = {
    Bucket : bucketName,
  };

  // Call S3 to obtain a list of the objects in the bucket
  s3.listObjects(bucketParams, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      // console.log("Success", data.Contents);

      // check if directory exists
      if (fs.existsSync("./views/website/posts")) {
          fs.readdir("./views/website/posts", (err, files) => {
            if (err) throw err;
            for (const file of files) {
              fs.unlink(`./views/website/posts/${file}`, err => {
                if (err) throw err;
                console.log(`${file} apagado`)

              });
            }
          });
      } else {
        fs.mkdir("./views/website/posts",  (err) => {
          if (err) {throw err}else{
            console.log("diretorio criado")
          }});
      }


      data.Contents.forEach(a => {
        // console.log(a.Key)
        const bucketParams = {
          Bucket: bucketName,
          Key: a.Key,
        };
        s3.getObject(bucketParams, (err, data) => {
          if(err){
            console.error(err)
          }else{
          // console.log(`objeto baixado com sucesso: ${data.Body.toString('utf-8') /*data.Body */}`)
          // console.log(`key do objeto ${a.Key}`)
            fs.writeFile(`./${a.Key}`, data.Body.toString('utf-8'), (err, data) => {
              if(err){
                console.log(err)
              }else{
                console.log("gravado com sucesso")
              }
            })
              }
          })
      })
    }
  });
}
// obtemposts("shinobi-youtube")
// enviaindex


function enviaindex() {
  const path = "./views/website/index.ejs"
  if(fs.existsSync(path)){
    console.log("index existe")
    uploadfile("shinobi-youtube-index", path)
 
  }else{
    console.log("index não  existe")
  }
}
// enviaindex()
// obtemindex, atualiza index 
function obtemindex(bucketName) {
  const path = "./views/website/index.ejs"
  let Data

  const bucketParams = {
    Bucket: bucketName,
    Key: "views/website/index.ejs",
  };

  if(fs.existsSync(path)){
    console.log("index existe")
    fs.unlink(path, (err) =>{
      if(err) throw err
    s3.getObject(bucketParams, (err, Data) => {
      if(err){
        console.error(err)
      }else{
      console.log(`objeto baixado com sucesso:  /*.Body.toString('utf-8')*/ `)   
      fs.writeFile(path, Data.Body.toString('utf-8'), (err) =>{
        if(err) console.log(err);
        console.log("index gravado com sucesso")
      })
      }
    })
  }) 
  }else{
    console.log("index não existe")
    s3.getObject(bucketParams, (err, Data ) => {
      if(err){
        console.error(err)
      }else{
      // console.log(`objeto baixado com sucesso: ${ data.Body.toString('utf-8')} `)   
      fs.writeFile(path, Data.Body.toString('utf-8'), (err) =>{
        if(err) console.log(err);
        console.log("index gravado com sucesso")
      })
      }
    })
  }
}
// obtemindex("shinobi-youtube-index")

obtemindex("shinobi-youtube-index")
obtemposts("shinobi-youtube")


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
              enviaposts()
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
          enviaposts()
        });

    })
    // excluir end

    // editar start
    socket.on("editar", (params) => {

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
            if(img.length != 0){
              if(img[i-1].innerHTML != ""){image = img[i-1].innerHTML}
            }
            if(video.length != 0){
              if(video[i-1].innerHTML != ""){videos = video[i-1].innerHTML}
            }
            if(text.length != 0){
              if(text[i-1].innerHTML != ""){paragrafo = text[i-1].innerHTML }
            }
            content.push({"img": image, "video": videos, "paragrafo": paragrafo})
          }else{
            let image = ""
            let videos = ""
            let paragrafo = ""

            if(video[i-1] !==  undefined){
              if(video[i-1].innerHTML != ""){
                videos = video[i-1].innerHTML
                }
            }
            if(text[i-1] !==  undefined){
              if(text[i-1].innerHTML != ""){
                paragrafo = text[i-1].innerHTML  
                }
            }
            if(image != "" || videos != "" || paragrafo != ""){ //verifica  se o objeto esta vazio para nao mandar
            console("tem coisa")
            content.push({"img": image, "video": videos, "paragrafo": paragrafo})
            }else{
              console.log("nao tem nada ")
            }

          }
        }
          console.log(content.reverse())
          socket.emit("editar_res", postfixed, content.reverse(), params)

      })
    })

    socket.on("dados_post_editar", (dados_post, nome_pagina) => {
      console.log("chegou aqui editar")



      let {postfixed, content} = dados_post
      console.log(nome_pagina)


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
              socket.emit("link_pagina_criada_editar", `/posts/${nome_pagina}` )
              enviaposts()
              // console.info(process.env.PATH)
          }); 
        // writefile end

        }
      }
        });  
      // jsdom end


    })
    // editar end

    // layout principal start
    socket.on("layout", (download_links_var) => {
      console.log(download_links_var)
      // ler arquivos
      
      redefine_index()
      let block_card = []
    async function redefine_index() {
           // extrair ids do json
     fs.readFile('./dashboard/layout.json', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      const layout = JSON.parse(data)

      //print all database
      for (let i = 0; i < layout.length; i++) {
        const element = layout[i];
        const a = Object.values(element)
        // console.log(a[0]) //array

        switch (i) {
          case 0:
            console.log(i)
            let block_card_primeira = [[], ""]


            for (let index = 0; index < a[0].length; index++) {
              const element = a[0][index];
              
              // EXTRAIR DADOS , BANNER , TAG e ETC DAS paginas 
               JSDOM.fromFile(`./views/website/posts/${element}`, { runScripts: "dangerously" }).then(dom => {
                //criar card 
                let card = new JSDOM(block_post)
    
                card.window.document.querySelector(".img").innerHTML = dom.window.document.querySelector("#img_banner").innerHTML // //style="width: 100%;height: 100%;border-radius: 20px 0 0 20px;"
                card.window.document.querySelector(".img").children[0].style = "width: 100%;height: 100%;border-radius: 20px 0 0 20px;"
    
                card.window.document.querySelector("#titulo").innerHTML = dom.window.document.querySelector("#titulo").innerHTML 
                
                card.window.document.querySelector("#descrição").innerHTML = dom.window.document.querySelector("#descrição_do_post").innerHTML,  //descrição  // style="height: 50%;overflow-y: scroll;"
                card.window.document.querySelector("#descrição").style = "height: 50px;overflow-y: scroll;"
                
                card.window.document.querySelector("#tag").innerHTML = dom.window.document.querySelector("#tag").innerHTML //tag
                card.window.document.querySelector("#tag").style = "margin-top: 0px;margin-bottom: 0px;"
                card.window.document.querySelector("#tag").children[0].style = "margin-top: 0px;margin-bottom: 0px;"

                card.window.document.querySelector(".botao_href").setAttribute("href",`./posts/${element.replace(".ejs", "")}`)
                // 
    
              
                block_card_primeira[0].push(card.serialize())
                block_card_primeira[1] = "primeira_area"

              })
              //
              
      
    
            }
            block_card.push(block_card_primeira)

            setTimeout(() => {
              // addcard(block_card_primeira[0], block_card_primeira[1])
            }, 100)
        
            break;
        
          case 1:
            console.log(i)
            let block_card_mais = [[], ""]



            for (let index = 0; index < a[0].length; index++) {
              const element = a[0][index];
              
              // EXTRAIR DADOS , BANNER , TAG e ETC DAS paginas 
               JSDOM.fromFile(`./views/website/posts/${element}`, { runScripts: "dangerously" }).then(dom => {
                //criar card 
                let card = new JSDOM(block_post)
    
                card.window.document.querySelector(".img").innerHTML = dom.window.document.querySelector("#img_banner").innerHTML // //style="width: 100%;height: 100%;border-radius: 20px 0 0 20px;"
                card.window.document.querySelector(".img").children[0].style = "width: 100%;height: 100%;border-radius: 20px 0 0 20px;"
    
                card.window.document.querySelector("#titulo").innerHTML = dom.window.document.querySelector("#titulo").innerHTML 
                
                card.window.document.querySelector("#descrição").innerHTML = dom.window.document.querySelector("#descrição_do_post").innerHTML,  //descrição  // style="height: 50%;overflow-y: scroll;"
                card.window.document.querySelector("#descrição").style = "height: 50%;overflow-y: scroll;"
                
                card.window.document.querySelector("#tag").innerHTML = dom.window.document.querySelector("#tag").innerHTML //tag
                card.window.document.querySelector("#tag").style = "margin-top: 0px;margin-bottom: 0px;"
                card.window.document.querySelector("#tag").children[0].style = "margin-top: 0px;margin-bottom: 0px;"
    
                card.window.document.querySelector(".botao_href").setAttribute("href",`./posts/${element.replace(".ejs", "")}`)

                block_card_mais[0].push(card.serialize())
                block_card_mais[1] = "mais_baixados"

                // console.log(block_card)
              })
              //
              
      
    
            }
             
            block_card.push(block_card_mais)

            setTimeout(() => {
              // addcard(block_card_mais[0], block_card_mais[1])
            }, 100)
        
            break;
          case 2:
            console.log(i)

            let block_card_mods = [[], ""]

            for (let index = 0; index < a[0].length; index++) {
              const element = a[0][index];
              
              // EXTRAIR DADOS , BANNER , TAG e ETC DAS paginas 
               JSDOM.fromFile(`./views/website/posts/${element}`, { runScripts: "dangerously" }).then(dom => {
                //criar card 
                let card = new JSDOM(block_post)
    
                card.window.document.querySelector(".img").innerHTML = dom.window.document.querySelector("#img_banner").innerHTML // //style="width: 100%;height: 100%;border-radius: 20px 0 0 20px;"
                card.window.document.querySelector(".img").children[0].style = "width: 100%;height: 100%;border-radius: 20px 0 0 20px;"
    
                card.window.document.querySelector("#titulo").innerHTML = dom.window.document.querySelector("#titulo").innerHTML 
                
                card.window.document.querySelector("#descrição").innerHTML = dom.window.document.querySelector("#descrição_do_post").innerHTML,  //descrição  // style="height: 50%;overflow-y: scroll;"
                card.window.document.querySelector("#descrição").style = "height: 50%;overflow-y: scroll;"
                
                card.window.document.querySelector("#tag").innerHTML = dom.window.document.querySelector("#tag").innerHTML //tag
                card.window.document.querySelector("#tag").style = "margin-top: 0px;margin-bottom: 0px;"
                card.window.document.querySelector("#tag").children[0].style = "margin-top: 0px;margin-bottom: 0px;"
    
                card.window.document.querySelector(".botao_href").setAttribute("href",`./posts/${element.replace(".ejs", "")}`)

              
                block_card_mods[0].push(card.serialize())
                block_card_mods[1] = "mods"

                // console.log(block_card)
              })
              //
              
      
    
            }

            block_card.push(block_card_mods)


            setTimeout(() => {
              // addcard(block_card_mods[0], block_card_mods[1])
            }, 100)
        

            break;
          
          case 3:
            console.log(i)

            let block_card_aplicativos = [[], ""]

            for (let index = 0; index < a[0].length; index++) {
              const element = a[0][index];
              
              // EXTRAIR DADOS , BANNER , TAG e ETC DAS paginas 
               JSDOM.fromFile(`./views/website/posts/${element}`, { runScripts: "dangerously" }).then(dom => {
                //criar card 
                let card = new JSDOM(block_post)
    
                card.window.document.querySelector(".img").innerHTML = dom.window.document.querySelector("#img_banner").innerHTML // //style="width: 100%;height: 100%;border-radius: 20px 0 0 20px;"
                card.window.document.querySelector(".img").children[0].style = "width: 100%;height: 100%;border-radius: 20px 0 0 20px;"
    
                card.window.document.querySelector("#titulo").innerHTML = dom.window.document.querySelector("#titulo").innerHTML 
                
                card.window.document.querySelector("#descrição").innerHTML = dom.window.document.querySelector("#descrição_do_post").innerHTML,  //descrição  // style="height: 50%;overflow-y: scroll;"
                card.window.document.querySelector("#descrição").style = "height: 50%;overflow-y: scroll;"
                
                card.window.document.querySelector("#tag").innerHTML = dom.window.document.querySelector("#tag").innerHTML //tag
                card.window.document.querySelector("#tag").style = "margin-top: 0px;margin-bottom: 0px;"
                card.window.document.querySelector("#tag").children[0].style = "margin-top: 0px;margin-bottom: 0px;"
    
                card.window.document.querySelector(".botao_href").setAttribute("href",`./posts/${element.replace(".ejs", "")}`)

              
                block_card_aplicativos[0].push(card.serialize())
                block_card_aplicativos[1] = "aplicativos"

                // console.log(block_card)
              })
              //
              
      
    
            }

            block_card.push(block_card_aplicativos)

            setTimeout(() => {
              // addcard(block_card_aplicativos[0], block_card_aplicativos[1])
            }, 100)
        
            break;
          case 4:
            console.log(i)

            let block_card_links = [[], ""]

            for (let index = 0; index < a[0].length; index++) {
              const element = a[0][index];
              
              // EXTRAIR DADOS , BANNER , TAG e ETC DAS paginas 
               JSDOM.fromFile(`./views/website/posts/${element}`, { runScripts: "dangerously" }).then(dom => {
                //criar card 
                let card = new JSDOM(block_post)
    
                card.window.document.querySelector(".img").innerHTML = dom.window.document.querySelector("#img_banner").innerHTML // //style="width: 100%;height: 100%;border-radius: 20px 0 0 20px;"
                card.window.document.querySelector(".img").children[0].style = "width: 100%;height: 100%;border-radius: 20px 0 0 20px;"
    
                card.window.document.querySelector("#titulo").innerHTML = dom.window.document.querySelector("#titulo").innerHTML 
                
                card.window.document.querySelector("#descrição").innerHTML = dom.window.document.querySelector("#descrição_do_post").innerHTML,  //descrição  // style="height: 50%;overflow-y: scroll;"
                card.window.document.querySelector("#descrição").style = "height: 50%;overflow-y: scroll;"
                
                card.window.document.querySelector("#tag").innerHTML = dom.window.document.querySelector("#tag").innerHTML //tag
                card.window.document.querySelector("#tag").style = "margin-top: 0px;margin-bottom: 0px;"
                card.window.document.querySelector("#tag").children[0].style = "margin-top: 0px;margin-bottom: 0px;"
    
                card.window.document.querySelector(".botao_href").setAttribute("href",`./posts/${element.replace(".ejs", "")}`)

                block_card_links[0].push(card.serialize())
                block_card_links[1] = "links"

                // console.log(block_card)
              })
              //
              
      
    
            }

            setTimeout(() => {
              // addcard(block_card_links[0], block_card_links[1])
            }, 100)
        
            block_card.push(block_card_links)

            break;


          default:
            console.log("erro no linha 630")
            break;
        }
      }
    });
    setTimeout(() => {
      addcard(block_card, "block_card[1]")
    }, 100)

    }
    // adiciona os cards
    function addcard(array, area) {
      if(Array.isArray(array)){      
        let data_index // index.ejs
         fs.readFile(`./views/website/index_save.ejs`,"utf8",  (err, data) =>{

          if(err) throw err 
          data_index = data;

          tese()
          function tese() {

              let index_dom = new JSDOM(data_index)

              console.log(download_links_var)

              // injetar scripts , e links de downloads
              index_dom.window.document.querySelector("#footer").insertAdjacentHTML("afterend", download_links_var.scripts )
              index_dom.window.document.querySelector("#ad-mais-baixados").innerHTML = download_links_var.banner_mais_baixados             // banner_mais_baixados: string;
              index_dom.window.document.querySelector("#ad-mods").innerHTML = download_links_var.banner_mods              // banner_mods: string;
              index_dom.window.document.querySelector("#ad-aplicativos").innerHTML = download_links_var.banner_aplicativos              // banner_aplicativos: string;
              index_dom.window.document.querySelector("#ad-links").innerHTML = download_links_var.banner_links           // banner_links: string;

          



              for (let index = 0; index < array.length; index++) {
                const element = array[index];
                // console.log(index + "length do array na função:tem que ser 5 e == "+ array.length)
                // console.log(index + "length do array na função:tem que ser 2 e == "+ array[index].length)
                // console.log(index + "length do array na função:tem que ser 3 e == "+ array[index][0].length)

                // console.log(array[index][0][0]) //todo loop for last 0
                console.log(index)

                switch (index) {
                  case 0:
                    // primeira_area
                    for (let i = 0; i < array[index][0].length; i++) {
                                      const card = new JSDOM(array[index][0][i]) ;
                                      index_dom.window.document.querySelector("#welcome").firstElementChild.innerHTML += card.serialize()
                                    }
                    break;
                
                  case 1:
                    // mais_baixadas
                    for (let i = 0; i < array[index][0].length; i++) {
                      const card = new JSDOM(array[index][0][i]) ;
                      index_dom.window.document.querySelector("#mais_baixados").innerHTML += card.serialize()
                    }
                    break;
                
                  case 2:
                    // mods
                    for (let i = 0; i < array[index][0].length; i++) {
                      const card = new JSDOM(array[index][0][i]) ;
                      index_dom.window.document.querySelector("#mods_1").innerHTML += card.serialize()
                    }
                    break;
                
                  case 3:
                    // aplicativos
                    for (let i = 0; i < array[index][0].length; i++) {
                      const card = new JSDOM(array[index][0][i]) ;
                      index_dom.window.document.querySelector("#aplicativos_1").innerHTML += card.serialize()                     
                    }
                    break;
                
                  case 4:
                    // links
                    for (let i = 0; i < array[index][0].length; i++) {
                      const card = new JSDOM(array[index][0][i]) ;                   
                      index_dom.window.document.querySelector("#links_1").innerHTML += card.serialize()
                    }
                     break;
                                    
                  default:
                   console.log("erro length maior que 5")
                    break;
                }
                
              }



                
                
                
                
                // console.log(index_dom.serialize())
                fs.writeFile("./views/website/index.ejs", index_dom.serialize(), (err) => {
                  if(err) console.log(err)
                  console.log("index salvo")
                  socket.emit("index_salvo")
                  enviaindex()
                } )

          }

        })
      }else console.log("parametro não e um array")
    }
    })
    // layout principal end

    // dashboard tela principal start
    socket.on("dashboard_principal", () =>{
      console.log("deu load")

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
          socket.emit("dashboard_res", data_info)
          console.log('enviou')
      }, 1000)
      

    })

    socket.on("dashboard_dados", (layout) => {
      fs.writeFile("./dashboard/layout.json", JSON.stringify(layout) , "utf-8", (err) => {
        if(err)console.log(err)
        console.log("layout modificado com sucesso")
        // setTimeout(() => {
        //   socket.emit("layout", download_links_var)
        // }, 1000)
        socket.emit("dados_res")
      })
    })
    // dashboard tela principal end

  socket.on('disconnect', () => {
    console.log('cliente desconectou')
  })
  
})

setInterval(function(){ 
	console.log("Oooo Yeaaa!");
    enviaindex()
    enviaposts()

}, 60000);//run this thang every 2 seconds

setInterval(function(){ 
	console.log("Oooo Yeaaa!");
obtemindex("shinobi-youtube-index")
obtemposts("shinobi-youtube") 

}, 30000);//run this thang every 2 seconds


server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

