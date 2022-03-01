// converter img

let base64String = "";
  
function imageUploaded() {
    var file = document.querySelector('#img_banner')['files'][0];
  
    var reader = new FileReader();
      
    reader.onload = function () {
        base64String = reader.result.replace("data:", "")
            .replace(/^.+,/, "");
  
        imageBase64Stringsep = base64String;
  
        // alert(imageBase64Stringsep);
        // console.log(base64String);
    }
    reader.readAsDataURL(file);
}
// 

let newpost = {
    "titulo": document.querySelector("#titulo").innerHTML,
    "img_banner": base64String,
    "post_desc": document.querySelector("#descrição").innerHTML, 
    // 
    "link_btn_download": document.querySelector("#download").innerHTML
}


let content = {
    "imgs": [],
    "videos": [],
    "paragrafo": ""
}
// conteudo
function addconteudo() {
    document.querySelector("#btn_plus").remove()
    document.querySelector("#primeiro_card").innerHTML += `
    <div class="card-body card-content">
    <h5 class="card-title">Imagem</h5>
    <p class="text m-b-15 f-s-12 fw-bold">Caso o campo não seja preenchido, não haver imagem nessa seção.</p>
    <div class="basic-form">
        <form>
            <div class="form-group">
                <input type="file" class="form-control-file">
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
                <textarea class="form-control h-150px" rows="6" id="comment" placeholder="Digite Aqui o Iframe do video"></textarea>
            </div>
        </form>
    </div>
    <h5 class="card-title">Paragrafo</h5>
    <div class="basic-form">
        <form>
            <div class="form-group">
                <label>Paragrafo:</label>
                <textarea class="form-control h-150px" rows="6" id="comment" placeholder="Digite Aqui o Paragrafo"></textarea>
            </div>
        </form>
    </div>
    <button id="btn_plus" class="btn btn-outline-dark" onclick="addconteudo()" type="button"><i class="fa-solid fa-plus"></i></button>
    </div>
    `
}
const contents = document.querySelectorAll(".card-content")
for (const key in contents) {
    contents[key]
    document.querySelectorAll(".img-content")[key]
}
// 