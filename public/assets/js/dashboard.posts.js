// converter img


let base64String = "";

// document.querySelector("#img_banner").addEventListener("change", imageUploaded)
  
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
// 

let postfixed = {
    "titulo": "",
    "img_banner": "",
    "post_desc": "", 
    // 
    "link_btn_download": ""
}


let contents = document.querySelectorAll(".card-content")
// conteudo
let content = []
function addconteudo() {
    document.querySelector("#btn_plus").remove()
    document.querySelector("#primeiro_card").innerHTML += `
    <div class="card-body card-content">
    <h5 class="card-title">Imagem</h5>
    <p class="text m-b-15 f-s-12 fw-bold">Caso o campo não seja preenchido, não haver imagem nessa seção.</p>
    <div class="basic-form">
        <form>
            <div class="form-group">
                <input type="file" class="form-control-file img-content">
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

function save() {  
    postfixed.titulo = document.querySelector("#titulo").value
    postfixed.post_desc = document.querySelector("#descrição").value
    postfixed.link_btn_download = document.querySelector("#download").value

    

    content = []
    for (var i = 0; i < contents.length; i++) {
 
          let img =  document.querySelectorAll(".img-content")[i]
          let video =  document.querySelectorAll(".video_iframe")[i]
          let paragrafo =  document.querySelectorAll(".paragrafo_content")[i]
        
          if(img.files.length >= 1){
            console.log("passou aqui")
            var file = img.files[0];
            var reader = new FileReader();
            reader.onloadend = function() {
              console.log('RESULT', reader.result)
            //   seçao = {"img": reader.result, "video": video.value, "paragrafo": paragrafo.value }
              content.push({"img": reader.result, "video": video.value, "paragrafo": paragrafo.value, "content": contents.length })
            }
            reader.readAsDataURL(file);
        }else{
            content.push({"img": "", "video": video.value, "paragrafo": paragrafo.value, "content": contents.length})
        }
    }
    // console.log(content)
    socket.emit("dados_post", {postfixed, content})

}

function mostrartudo() {
    console.log(postfixed)
    console.log(content)
}

socket.on("link_pagina_criada", (a)=> {
    console.info('chegou aqui')
    alert(`Nova Pagina Criada com sucesso link: ${a}`)
    window.open(`.${a}`, '_blank');
})