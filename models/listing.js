const mongoose = require("mongoose");
const Review = require("./review.js");
const { string } = require("joi");
const Schema = mongoose.Schema; 

const listingSchema = new Schema({
    title : {
       type :String,
       required : true,
    },
    description : String,
     image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?q=80&w=1016&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(v) => v === "" ? "https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?q=80&w=1016&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    },
  },

    // image : {
    //     type : String,
    //     default :"https://unsplash.com/photos/sunflower-field-during-day-time-lk3F07BN8T8",
    //     set:(v)=>v === "" ? "https://unsplash.com/photos/sunflower-field-during-day-time-lk3F07BN8T8": v ,
    // },
    price : Number,
    location : String,
    country : String,
    reviews  :[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Review",
      }
    ],
    owner :{
      type : Schema.Types.ObjectId,
      ref:"User",
    },
    // geometry:{
    //   type: {
    //     type : String,
    //     enum :["Point"],
    //   },
    //   coordinates:[Number],
    // },
    category: {
  type: String,
  enum: [
    "trending",
    "rooms",
    "iconic-cities",
    "mountain",
    "city",
    "castles",
    "arctic",
    "camping",
    "farms",
    "pools",
    "domes",
    "ground"
  ],
}
});
listingSchema.post("findOneAndDelete", async(listing)=>{
   if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}})
   }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;


