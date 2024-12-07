let mongoose = require('mongoose');
let workerSchema = mongoose.Schema({
    email : String,
    password : String,
    name:String,
    uniqueId: { type: String, unique: true },
    phone:Number,
    pincode:Number,
    location:String,
    service_type:String,
    cost:Number,
    experience:Number,
    group_or_individual:String,
    workers:Number,
   previous_work:[{
    filename: { type: String },
    contentType: { type: String },
    uploadDate: { type: Date },
    metadata: { type: Object }
}],
    working_hours:String,
    working_days:String,
    tools_provided:String,
    description:String,
    reviews: [{
        rating: { type: Number, min: 1, max: 5 },
        description: String,
        postedBy: String,
        date: { type: Date, default: Date.now }
    }],
    profile_image: {
        filename: { type: String },
        contentType: { type: String },
        uploadDate: { type: Date},
        metadata: { type: Object }
    },
    role: { type: String, enum: ['client', 'worker'], default: 'worker'},
    
})

let workermodel = mongoose.model('workeregform', workerSchema)
module.exports = workermodel;