// este arquivo precisa ter a capacidade de editar o index.ejs
let ejs = require('ejs');
const fs = require("fs")


// editar a ordem dos posts 
    // receber do dashboard as mudança nas posições.
      //client-side vai enviar as mudanças via socket.io
         //server-side vai analisar. 
    // usar o jsdom, para extrair as informações das paginas
    // editar o index.ejs com as mudanças e salvar

// criar novos posts
  //no client-side o usuario vai definir todas a variaveis e vai salvar
    //ainda no client-side uma função vai pegar as variaveis verificar e enviar pro server-side via socket.io
  //server-side vai receber as variaveis, e criar um novo arquivo html.
    // server-side vai criar uma rota, e retornar o link pro client-side
      // server-side vai adicionar a nova pagina no index de acordo com a tag e conteudo.
      