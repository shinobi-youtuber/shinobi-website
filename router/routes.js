const express = require("express");
const router = express.Router();
const session = require("express-session")
const store = new session.MemoryStore();

// auth
const logins = {
  "email@gmail.com": "123"
}

// Parse URL-encoded bodies (as sent by HTML forms)
router.use(express.urlencoded());

let id
router.use(session({
  secret: "some secret",
  cookie: {maxAge: 30000}, //600000
  saveUninitialized: false,
  store: store
}))

router.post("/login", (req, res)=> {
  if(req.session.authenticated){
    // ja esta logado 
    res.redirect("/dashboard")
    console.log('ja esta logado')
  }else {
      if (req.body.pass == logins[req.body.email]) {
        // logou 
        id = req.sessionID
        req.session.authenticated = true
        console.log('logou')
        res.redirect("/dashboard")
      }else {
        // senha errada
        console.log('não logou')
        res.render("./dashboard/login.ejs")
      }
  }
})
// website 
router.get("/", (req, res) => {
    res.render("./website/index")
  })
router.get("/post", (req, res) => {
    res.render("./website/post")
  })

router.get('/posts/:id', function(req , res){
    res.render('./website/posts/' + req.params.id);
    // console.log(req.params.id)
  });

  // testes ads

router.get("/teste/ad/banner", (req, res )=> {
  res.render("./website/teste/banner.ejs")
})
router.get("/teste/ad/pop", (req, res )=> {
  res.render("./website/teste/pop.ejs")
})
  router.get("/teste/ad/popunder", (req, res )=> {
    res.render("./website/teste/popunder.ejs")
  })
router.get("/teste/ad/", (req, res )=> {
  res.render("./website/teste/propeller.ejs")
})

// dashboard
router.get("/login", (req, res) => {
  if(typeof(store.sessions[id]) == typeof("string")){
    // dashboard
    res.render("./dashboard/dashboard.ejs")
    // console.log(`cliente acessado dashboard ${req.ip}`)
  }else {
    res.render("./dashboard/login.ejs")
  }
})
router.get("/login/exit", (req, res) => {
  // deslogar
  // store.clear
  delete store.sessions[id]
  res.redirect("/login")
  // console.log(req.session)
})

router.get("/dashboard", (req, res)=> {
  // console.log(JSON.parse(store.sessions[id]).authenticated)
  if(typeof(store.sessions[id]) == typeof("string")){
    // dashboard
    res.render("./dashboard/dashboard.ejs")
    // console.log(`cliente acessado dashboard ${req.ip}`)
  }else {
    res.redirect("/login")    
  }
})
router.get("/pub", (req, res)=> {
  // console.log(JSON.parse(store.sessions[id]).authenticated)
  if(typeof(store.sessions[id]) == typeof("string")){
    // dashboard
    res.render("./dashboard/dashboard-post.ejs")
    // console.log(`cliente acessado dashboard ${req.ip}`)
  }else {
    res.redirect("/login")    
  }
})

router.get("/browse", (req, res) => {
  if(typeof(store.sessions[id]) == typeof("string")){
    // dashboard
    res.render("./dashboard/dashboard-browse.ejs")
    // console.log(`cliente acessado dashboard ${req.ip}`)
  }else {
    res.redirect("/login")    
  }
})
module.exports = router