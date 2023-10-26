const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash")

const sessionOptions = {
    secret:"mysupersecretstring",
    resave:false,
    saveUnintialized:true,
};
app.use(session(sessionOptions));
app.use(flash());



app.get("/register", (req, res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    req.flash("success", "user registered successfully!");
    res.redirect("/hello");

});

app.get("/hello", (req, res)=>{
    res.send(`hello, ${req.session.name}`);
});
// app.use(session(sessionOptions));
// app.get("/test", (req, res)=>{
//     res.send("test successful!");
// })

app.listen(3000, ()=>{
    console.log("Server is listening to 3000");
})