const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    venue: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    image: { type: String, required: true },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant",
      },
    ],
    volunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Volunteer",
      },
    ],
    ticketCategory: {
      type: String,
      enum: ["free", "paid"],
      required: true,
    },
    ticketPrice: {
      type: Number,
      required: function () {
        return this.ticketCategory === "paid";
      },
    },
    ticketsAvailable: { type: Number, required: true, min: 0 },
    questions:[
      {
        q :{type:String},
        answer : {type:String}
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
