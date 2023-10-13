const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fexplore&psig=AOvVaw2DLdElW6xKywESL_peJ_yL&ust=1695725280374000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCOiZ94nLxYEDFQAAAAAdAAAAABAE",
        set: (v) => v === "" ? "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fexplore&psig=AOvVaw2DLdElW6xKywESL_peJ_yL&ust=1695725280374000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCOiZ94nLxYEDFQAAAAAdAAAAABAE":v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ]

})
listingSchema.post("findOneAndDelete", async(listing) =>{
if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}});
}})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
