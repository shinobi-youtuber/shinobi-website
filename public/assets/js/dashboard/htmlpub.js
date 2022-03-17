
let htmlpublicação = `  
<!-- primeira area start -->
<div class="col-lg-12">
    <div class="card">
        <div class="card-body">
            <h4 class="card-title">Área Principal</h4>
            <p class="text m-b-15 f-s-12">Defina aqui o titulo, banner é a descrição.</p>
            <p class="text m-b-15 f-s-12"><strong>IMPORTANTE</strong> não use  espaço.</p>
            <div class="basic-form">
                <form>
                    <div class="form-group">
                        <input id="titulo" type="text" class="form-control input-default" placeholder="Digite o Titulo">
                    </div>
                </form>
            </div>
            <div style="width: 300px;" id="img_banner_display"></div>
            <h5 class="card-title">Imagem do banner</h5>
            <p class="text m-b-15 f-s-12">Defina imagem do banner.</p>
            <div class="basic-form">
                <form>
                    <div class="form-group">
                        <input id="img_banner" onchange="imageUploaded()" type="file" class="form-control-file">
                    </div>
                </form>
            </div>
            <h5 class="card-title">Descrição</h5>
            <div class="basic-form">
                <form>
                    <div class="form-group">
                        <label>Comment:</label>
                        <textarea id="descrição" class="form-control h-150px" rows="6" id="comment" placeholder="Digite Aqui a Descrição do Post"></textarea>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
 <!-- primeira area end -->

<!-- TAG start -->
<div class="col-lg-12">
    <div class="card">
        <div class="card-body">
            <!--  -->
            <h5 class="card-title">Tag</h5>
            <p class="text m-b-15 f-s-12">Defina aqui a Tag</p>
            <div class="basic-form">
                <form>
                    <div class="form-group">
                        <input id="tag" type="text" class="form-control input-default" placeholder="Digite aqui a Tag">
                    </div>
                </form>
            </div>
                <!--  -->
          <h5 class="card-title">Cor</h5>
            <p class="text m-b-15 f-s-12">Defina aqui a cor da Tag</p>
            <div class="basic-form">
                <form>
                    <div class="form-group">
                        <input id="tag_cor" type="color" class="form-control input-default" >
                    </div>
                </form>
            </div>
            <!--  -->
            <h5 class="card-title">Cor do texto</h5>
            <p class="text m-b-15 f-s-12">Defina aqui a cor do texto</p>
            <div class="basic-form">
                <form>
                    <div class="form-group">
                        <input id="cor_texto" type="color" class="form-control input-default" >
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- TAG end -->

<!-- conteudo start -->
<div id="conteudo" class="col-lg-12">
    <div id="primeiro_card" class="card">
        <div class="card-body card-content">
            <h5 class="card-title">Imagem</h5>
            <p class="text m-b-15 f-s-12 fw-bold">Caso o campo não seja preenchido, não haver imagem nessa seção.</p>
            <div class="basic-form">
                <form>
                    <div class="form-group">
                        <input   type="file" class="form-control-file img-content">
                    </div>
                </form>
            </div>
            <h5 class="card-title">Video</h5>
            <p class="text m-b-15 f-s-12">Caso o campo não seja preenchido, não haver imagem nessa seção.</p>
            <p class="text m-b-15 f-s-12">Copie o iframe do video que gostaria de adicionar.</p>
            <div class="basic-form">
                <form>
                    <div class="form-group">
                        <label>Iframe do Video:</label>
                        <textarea  class="form-control h-150px video_iframe" rows="6" id="comment" placeholder="Digite Aqui o Iframe do video"></textarea>
                    </div>
                </form>
            </div>
            <h5 class="card-title">Paragrafo</h5>
            <div class="basic-form">
                <form>
                    <div class="form-group">
                        <label>Paragrafo:</label>
                        <textarea class="form-control h-150px paragrafo_content" rows="6" id="comment" placeholder="Digite Aqui o Paragrafo"></textarea>
                    </div>
                </form>
            </div>
            <button id="btn_plus" class="btn btn-outline-dark" onclick="addconteudo()" type="button"><i class="fa-solid fa-plus"></i></button>

        </div>

    </div>
</div>
<!-- conteudo end -->

<!-- download start -->
<div class="col-lg-12">
    <div class="card">
        <div class="card-body">
            <!--  -->
            <h4 class="card-title">Área de Download</h4>
            <p class="text m-b-15 f-s-12">Defina aqui os links de download, tipos de anuncio e outros.</p>
            <!--  -->
            <h5 class="card-title">Link do Butão de Download</h5>
            <div class="basic-form">
                <form>
                    <div class="form-group">
                        <label>Digite aqui o link do butão de download:</label>
                        <input id="download" type="text" class="form-control input-default" placeholder="Digite aqui o link do butão de download">
                    </div>
                </form>
            </div>
            <!--  -->
            <h5 class="card-title">Scripts</h5>
            <p class="text m-b-15 f-s-12"> <strong>IMPORTANTE</strong> coloque apenas os <code> < scripts > </code> </p>
            <div class="basic-form">
                <form>
                    <div class="form-group">
                        <label>Digite os Scripts Copiados:</label>
                        <textarea id="scripts" class="form-control h-150px scripts" rows="6" id="comment" placeholder="Digite Aqui os scripts"></textarea>
                    </div>
                </form>
            </div>
            <!--  -->
            <h5 class="card-title">Banners</h5>
            <p class="text m-b-15 f-s-12">Defina aqui os banners acima e abaixo do botão de download.</p>
            <p class="text m-b-15 f-s-12"> <strong>IMPORTANTE</strong> coloque apenas as <code> < div > </code> </p>
            <h6 class="card-title">Banner Acima</h6>
            <div class="basic-form">
                <form>
                    <div class="form-group">
                        <label>Defina aqui o banner acima do butão de download:</label>
                        <input id="banner_acima" type="text" class="form-control input-default" placeholder="Defina aqui os banner acima do butão de download">
                    </div>
                </form>
            </div>

            <h6 class="card-title">Banner Abaixo</h6>
            <div class="basic-form">
                <form>
                    <div class="form-group">
                        <label>Defina aqui o banner abaixo do butão de download:</label>
                        <input id="banner_abaixo" type="text" class="form-control input-default" placeholder="Defina aqui o banner acima do butão de download">
                    </div>
                </form>
            </div>
            <!--  -->
        </div>
    </div>
</div>
<!-- download end -->

<!-- save area start -->
<div class="col-lg-12">
    <div class="card">
        <div class="card-body">
            <h4 class="card-title">Salvar</h4>
            <a href="#/"><button id="edit" class="btn btn-danger btn-rounded" onclick="socket.emit("load_busca", "load_busca")"  type="button">voltar</button></a>
            <button id="save" class="btn btn-success btn-rounded" onclick="save()" type="button">Salvar</button>
        </div>
    </div>
</div>
<!-- save area end -->
`
let html_pub =  document.createElement("div").innerHTML = (htmlpublicação)

function addconteudo() {
    document.querySelector("#btn_plus").remove()
    document.querySelector("#primeiro_card").innerHTML += `
    <div class="card-body card-content">
    <h5 class="card-title">Video</h5>
    <p class="text m-b-15 f-s-12">Caso o campo não seja preenchido, não haver imagem nessa seção.</p>
    <p class="text m-b-15 f-s-12">Copie o iframe do video que gostaria de adicionar.</p>
    <div class="basic-form">
        <form>
            <div class="form-group">
                <label>Iframe do Video:</label>
                <textarea class="form-control h-150px video_iframe" rows="6" id="comment" placeholder="Digite Aqui o Iframe do video"></textarea>
            </div>
        </form>
    </div>
    <h5 class="card-title">Paragrafo</h5>
    <div class="basic-form">
        <form>
            <div class="form-group">
                <label>Paragrafo:</label>
                <textarea class="form-control h-150px paragrafo_content" rows="6" id="comment" placeholder="Digite Aqui o Paragrafo"></textarea>
            </div>
        </form>
    </div>
    <button id="btn_plus" class="btn btn-outline-dark" onclick="addconteudo()" type="button"><i class="fa-solid fa-plus"></i></button>
    </div>
    `
    contents = document.querySelectorAll(".card-content")
}

let postfixed = {
    "titulo": "",
    "img_banner": "",
    "post_desc": "", 
    // 
    "tag": {tag: "", cor: "", texto: ""},
    // 
    "link_btn_download": "",
    "scripts": "",
    "banners": {acima: "", abaixo: ""}
}
// conteudo
let content = [
    {"img": "", "video": "", "paragrafo": ""},
]
let base64String = "";
  
function imageUploaded() {
    var file = document.querySelector('#img_banner')['files'][0];
  
    var reader = new FileReader();
      
    reader.onload = function () {
        base64String = reader.result.replace("data:", "")
            .replace(/^.+,/, "");
  
        imageBase64Stringsep = base64String;
  
        // alert(imageBase64Stringsep);
        console.log(base64String);
        postfixed.img_banner = base64String
    }
    reader.readAsDataURL(file);
}


function save(nome_pagina) {  
    console.log(nome_pagina)
    postfixed.titulo = document.querySelector("#titulo").value
    postfixed.post_desc = document.querySelector("#descrição").value

    // tag
    postfixed.tag.tag = document.querySelector("#tag").value
    postfixed.tag.cor = document.querySelector("#tag_cor").value
    postfixed.tag.texto = document.querySelector("#cor_texto").value
    // area de downloads
    postfixed.link_btn_download = document.querySelector("#download").value
    postfixed.scripts = document.querySelector("#scripts").value 
    postfixed.banners.acima = document.querySelector("#banner_acima").value 
    postfixed.banners.abaixo = document.querySelector("#banner_abaixo").value

    let img =  document.querySelector(".img-content")

    if(img.files.length >= 1){
        console.log("passou aqui")
        var file = img.files[0];
        var reader = new FileReader();
        reader.onloadend = function() {
        //   console.log('RESULT', reader.result)
        //   seçao = {"img": reader.result, "video": video.value, "paragrafo": paragrafo.value }
            // content.push({"img": reader.result, "video": video.value, "paragrafo": paragrafo.value})
            content[0].img = reader.result
        }
        reader.readAsDataURL(file);
    }
    for (var i = 0; i < contents.length; i++) {
        console.log(i)
        // pula o primeiro
        if(i == 0){
            content[i].video =  document.querySelectorAll(".video_iframe")[i].value
            content[i].paragrafo =  document.querySelectorAll(".paragrafo_content")[i].value
        }else{
            let video =  document.querySelectorAll(".video_iframe")[i]
            let paragrafo =  document.querySelectorAll(".paragrafo_content")[i]
          
            content.push({"img": "", "video": video.value, "paragrafo": paragrafo.value})
        }
    }
    // envia
    console.log(`length igual a ${content.length}`)
    setTimeout(()=>{
        socket.emit("dados_post_editar", {postfixed, content}, nome_pagina)

        content = [{
            "img": "",
            "video": "",
            "paragrafo": ""
          }, ]

    }, 1000)
}



