window.onload = () => {
    addEventListener("click", () => {
        timer()
    }, {once: true})
}
function timer() {
    let btn = document.querySelector("#link_btn_download")
    let href = document.querySelector("#link_btn_download").href
    document.querySelector("#link_btn_download").href = "#/"
    let i = 16
     // numero no rimer
    let int = setInterval(() => {
        i--
        btn.firstElementChild.innerHTML = `contador ${i}`
        if(i === 0){
            clearInterval(int)
            btn.firstElementChild.innerHTML = `Baixe Agora`
            btn.href = href }
    }, 1000)

}

