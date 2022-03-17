window.addEventListener("load", function(){
    //everything is fully loaded, don't use me if you can use DOMContentLoaded
    socket.emit("dashboard_principal")

});
socket.on("dashboard_res", (data) => {
    rendertable(data)
})

function rendertable(data) {
    document.querySelectorAll(".select_area").forEach((select)=> {


    for (let i = 0; i < data.length; i++) {
        // console.log(data)
        const element = data[i];
        element.tag
        element.data_de_criação 
        select.innerHTML += `
        <option value="${element.nome}">${element.nome}</option>
        `
    }
  })
}

function addconteudo(params, classe) {
    // console.log(params.previousElementSibling.firstElementChild.firstElementChild.firstElementChild.children[1].innerHTML) //tabela
    
    const form = `
    <div class="basic-form ">
        <form class="formulario">
            <div class="form-row align-items-center">
                <div class="col-auto my-1">
                    <label class="mr-sm-2">Preference</label>
                    <select class="custom-select mr-sm-2 select_area ${classe}" id="inlineFormCustomSelect">
                        ${params.previousElementSibling.firstElementChild.firstElementChild.firstElementChild.children[1].innerHTML}
                    </select>
                </div>
            </div>
        </form>
    </div>
    `

    params.previousElementSibling.insertAdjacentHTML("afterend", form)


}

let layout = []
let w1 = {"primeira_area": [

]}
let mb = {"mais_baixados": [

]}
let mods = {"mods": [

]}
let aplicativos = {"aplicativos": [

]}
let links = {"links": [
    
]}

let download_links = {
    "scripts": "", 
    "banner_mais_baixados": "",
    "banner_mods": "",
    "banner_aplicativos": "",
    "banner_links": ""
}
function extrairdados() {


    let form_welcome = document.querySelectorAll(".form_welcome")
    w1.primeira_area = []
    for(let i = 0; i< form_welcome.length; i++){
        if(form_welcome[i].value == "Escolha o Posts..."){
        }else {  
            w1.primeira_area.push(form_welcome[i].value)
        }

      }

    let form_mais_baixados = document.querySelectorAll(".form_mais_baixados")
    mb.mais_baixados = []
    for(let i = 0; i< form_mais_baixados.length; i++){
        if(form_mais_baixados[i].value == "Escolha o Posts..." ){
        }else{
            mb.mais_baixados.push(form_mais_baixados[i].value)  
        }
  
      }
    let form_mods = document.querySelectorAll(".form_mods");
    mods.mods = []
    for (let i = 0; i < form_mods.length; i++) {
        if(form_mods[i].value == "Escolha o Posts..."){
        }else{
            mods.mods.push(form_mods[i].value)  
        }
    }
    let form_aplicativos = document.querySelectorAll(".form_aplicativos")
    aplicativos.aplicativos = []
    for (let i = 0; i < form_aplicativos.length; i++) {
        if(form_aplicativos[i].value == "Escolha o Posts..." ){
        }else{
            aplicativos.aplicativos.push(form_aplicativos[i].value) 
        }

    }
    let form_links = document.querySelectorAll(".form_links")
    links.links = []
    for (let i = 0; i < form_links.length; i++) {
        
        if(form_links[i].value == "Escolha o Posts..." ){
        }else{
            links.links.push(form_links[i].value) 
        }

    }

    // document.querySelectorAll(".form_welcome").forEach((form)=>{
    //    w1.primeira_area.push(form.value) 
    // })
    // document.querySelectorAll(".form_mais_baixados").forEach((form)=>{
    //   mb.mais_baixados.push(form.value)  
    // })
    // document.querySelectorAll(".form_mods").forEach((form)=>{
    //   mods.mods.push(form.value)  
    // })
    // document.querySelectorAll(".form_aplicativos").forEach((form)=>{
    //    aplicativos.aplicativos.push(form.value) 
    // })
    // document.querySelectorAll(".form_links").forEach((form)=>{
    //    links.links.push(form.value) 
    // })

    layout = [w1, mb, mods, aplicativos, links]

   download_links.scripts  = document.querySelector("#scripts").value
   download_links.banner_mais_baixados = document.querySelector("#banner_mais_baixados").value
   download_links.banner_mods  = document.querySelector("#banner_mods").value
   download_links.banner_aplicativos = document.querySelector("#banner_aplicativos").value
   download_links.banner_links = document.querySelector("#banner_links").value

   envia(layout)
}

function envia(layout) {
    socket.emit("dashboard_dados", layout )
    setTimeout(() => {
        socket.emit("layout", download_links) 
    }, 1000)
}

socket.on("dados_res", (a) => {
    console.log(download_links)
    socket.emit("layout", download_links)
})


socket.on("index_salvo",() => {
    alert("Salvo com sucesso")

    layout = []
    w1 = {"primeira_area": [

    ]}
    mb = {"mais_baixados": [

    ]}
    mods = {"mods": [

    ]}
    aplicativos = {"aplicativos": [

    ]}
    links = {"links": [
        
    ]}

    download_links = {
        "scripts": "", 
        "banner_mais_baixados": "",
        "banner_mods": "",
        "banner_aplicativos": "",
        "banner_links": ""
    }

})
{/* <option selected="selected">Escolha o Posts...</option> */}
