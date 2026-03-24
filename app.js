// if(process.env.NODE_ENV != "production"){
//    require('dotenv').config();
// }
require("dotenv").config();

// require express
const express = require("express");
const app = express();
//ejs require
const path = require("path")

// require monogoose
const mongoose = require("mongoose");
// imort models listing 
// const Listing = require("./models/listing.js");
// use method-override
const methodOverride = require("method-override");
// require ejs-mate
const ejsMate = require("ejs-mate");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")

// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema ,reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
const dbUrl = process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect(dbUrl);
}

main()
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("ERROR:", err.message));


const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    collectionName: "sessions",
    ttl: 14 * 24 * 60 * 60, // 14 days
});
store.on("error",(err)=>{
    console.log("error in mongo session store",err)
})

const sessionOption = {
    store : store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { serialize } = require("v8");

// connect to database
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main().then(() => {
//     console.log("connected to DB")
// }).catch(err => { console.log(err) })
// async function main() {
//     await mongoose.connect(dburl,{family:4});
// }
// //set ejs file 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// urlencodeed data red for req.body
app.use(express.urlencoded({ extended: true }));
// method-override use
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
//require public folder
app.use(express.static(path.join(__dirname, "/public")));

// create api and route
// app.get("/", (req, res) => {
//     res.send("hii i am root");
// });
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email :"student@gmail.com",
//         username : "delta-student"
//     });
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser)
// })


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});


app.use((err, req, res, next) => {
    if(res.headersSent){
        return next(err);
    }
    let { status = 500, message = "something went worng" } = err;
    res.status(status).render("error.ejs", { message })
    // res.status(status).send(message);
});

// start server
app.listen(8080, () => {
    console.log("server is listening tp port 8080");
})


// app.get("/testListing", async (req,res)=>{
//      let sampleListing = new Listing({
//         title : "my house",
//         description : "by the betch",
//         price : 1299,
//         location : "in goa",
//         country : "india",
//      });
//      await sampleListing.save();
//      console.log("sample is saved");
//      res.send("success");
// })