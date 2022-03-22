


socket.emit("load_busca", "load_busca")
socket.on("load_busca_res", (data) => {
    rendertable(data)
})
function rendertable(data) {

    document.querySelector("#carregando") == null ? null : document.querySelector("#carregando").remove()
    
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        let tbody = document.querySelector("tbody")
        element.nome
        element.tag
        element.data_de_criação 
        tbody.innerHTML += `
        <tr>
            <th>${i}</th>
            <td><a href="#/">${element.nome}</a></td>
            <td>${element.tag}</td>
            <td>${element.data_de_criação}</td>
            <td class="color-primary">
                <button id="delete" class="btn btn-danger btn-rounded" onclick="excluir( '${element.nome}' )" type="button">Excluir</button>
                <button id="editar" class="btn btn-success btn-rounded" onclick=" editar( '${element.nome}' )" type="button">Editar</button>
            </td>
        </tr>
        `
    }
}


function excluir(params) {
    console.log(params)
    socket.emit("excluir", params )
    document.querySelector("tbody").innerHTML = ""
    setTimeout( () => {
        socket.emit("load_busca", "load_busca")
    }, 1000)

}
function editar(params) {
    socket.emit("editar", params)
}
function render_editar(postfixed, content, nome_pagina) {
 let row  = document.querySelector("#row")   
 row.innerHTML = html_pub

 setTimeout(() => {

    document.querySelector("#titulo").value = postfixed.titulo
    document.querySelector("#descrição").value = postfixed.post_desc  
    // tag
    document.querySelector("#tag").value = postfixed.tag.tag 
    document.querySelector("#tag_cor").value = parseColor(postfixed.tag.cor).hex  
    document.querySelector("#cor_texto").value = parseColor(postfixed.tag.texto).hex
    // area de downloads
    document.querySelector("#download").value = postfixed.link_btn_download 
    document.querySelector("#scripts").value = postfixed.scripts  
    document.querySelector("#banner_acima").value = postfixed.banners.acima  
    document.querySelector("#banner_abaixo").value = postfixed.banners.abaixo 
    // img_banner
    document.querySelector("#img_banner_display").innerHTML = postfixed.img_banner
    document.querySelector("#img_banner_display").children[0].style.width = "500px"
    // conteudo start 
    // ()
    for (let i = 0; i < content.length; i++) {
    
        console.log(content.length)
        if(i === 0){
            // add display img
           let img_content_display = `
           <div id="img_content_display">
                ${content[content.length - 1].img}
           </div>
           `   
            document.querySelector(".img-content").insertAdjacentHTML('beforebegin', img_content_display );
            setTimeout(() => {
                document.querySelector("#img_content_display").children[0].style.width = "500px"
                document.querySelectorAll(".video_iframe")[i].value = content[content.length - 1].video
                document.querySelectorAll(".paragrafo_content")[i].value = content[content.length - 1].paragrafo

            }, 1000)

        }else{
            addconteudo()
            setTimeout(() => {
                document.querySelectorAll(".video_iframe")[i].value = content[i].video
                document.querySelectorAll(".paragrafo_content")[i].value = content[i].paragrafo
    
            }, 1000)
        }
        
    }
 }, 1000)
document.querySelector("#save").setAttribute('onclick', `save("${nome_pagina}")`)
}

function parseColor(color) {
    var arr=[]; color.replace(/[\d+\.]+/g, function(v) { arr.push(parseFloat(v)); });
    return {
        hex: "#" + arr.slice(0, 3).map(toHex).join(""),
        opacity: arr.length == 4 ? arr[3] : 1
    };
}
function toHex(int) {
    var hex = int.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function recarregar() {
    document.querySelector("tbody").innerHTML = ""
    setTimeout( () => {
        socket.emit("load_busca", "load_busca")
    }, 1000)

}

socket.on("editar_res",(postfixed, content, params) => {
console.log("chegou o conteudo")
render_editar(postfixed, content, params)
})

socket.on("link_pagina_criada_editar", (a)=>{
    alert(`Pagina editada com suceso`)
    window.open(`${a}`)
})
