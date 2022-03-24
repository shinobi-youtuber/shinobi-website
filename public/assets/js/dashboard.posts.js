
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


let contents = document.querySelectorAll(".card-content")

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

function save() {  
    postfixed.titulo = document.querySelector("#titulo").value.replace(/[^\w\s]/gi, '_').replaceAll(" ", "-")




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
    envia()
}

function mostrartudo() {
    console.log(postfixed)
    console.log(content)
}

function envia() {
    console.log(`length igual a ${content.length}`)
    setTimeout(()=>{
        socket.emit("dados_post", {postfixed, content})

        content = [{
            "img": "",
            "video": "",
            "paragrafo": ""
          }, ]

    }, 1000)
 

}

socket.on("link_pagina_criada", (a)=> {
    console.info('chegou aqui')
    alert(`Nova Pagina Criada com sucesso link: ${a}`)
    window.open(`.${a}`, '_blank');
})

socket.on("content_vazio", ()=>{
    save()
})





