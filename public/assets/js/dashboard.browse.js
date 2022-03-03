
socket.emit("load_busca", "load_busca")
socket.on("load_busca_res", (data) => {
    console.info(data)
    rendertable(data)
})
function rendertable(data) {
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        let tbody = document.querySelector("tbody")
        element.nome
        element.tag
        element.data_de_criação 
        console.log(element.nome)
        tbody.innerHTML += `
        <tr>
            <th>${i}</th>
            <td><a href="#/">${element.nome}</a></td>
            <td>${element.tag}</td>
            <td>${element.data_de_criação}</td>
            <td class="color-primary">$21.56</td>
        </tr>
        `
   
    }
}

{/* <td><span class="badge badge-primary px-2">Sale</span> */}



{/* <div class="card-body">
<div class="card-title">
    <h4>Table Basic</h4>
</div>
<div class="table-responsive">
    <table class="table">
        <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Status</th>
                <th>Date</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th>1</th>
                <td>Kolor Tea Shirt For Man</td>
                <td><span class="badge badge-primary px-2">Sale</span>
                </td>
                <td>January 22</td>
                <td class="color-primary">$21.56</td>
            </tr>
            <tr>
                <th>2</th>
                <td>Kolor Tea Shirt For Women</td>
                <td><span class="badge badge-danger px-2">Tax</span>
                </td>
                <td>January 30</td>
                <td class="color-success">$55.32</td>
            </tr>
            <tr>
                <th>3</th>
                <td>Blue Backpack For Baby</td>
                <td><span class="badge badge-success px-2">Extended</span>
                </td>
                <td>January 25</td>
                <td class="color-danger">$14.85</td>
            </tr>
        </tbody>
    </table>
</div>
</div> */}