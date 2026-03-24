const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// connect to database
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
    console.log("connected to DB")
}).catch(err => { console.log(err) })
async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj, owner: "69ba9f9d2630702ed25c00bc"
    }))
    await Listing.insertMany(initData.data);
    console.log("data is initialoz");
}
initDB();