const mongoose = require("mongoose");
const { Schema } = mongoose;

const VolunteerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    events: [
      {
        event: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event",
          required: true,
          index: true,
        },
        eventname: {
          type: String,
        },
        role: {
          type: String,
          required: true,
          enum: [
            "registration",
            "setup",
            "coordinator",
            "usher",
            "technical",
            "security",
            "general",
          ],
        },
        date: {
          type: String,
        },
        // Keep the original field name but change the type
        assignedTasks: {
          type: String,
          default: "",
        },
      },
    ],
    totalEventsParticipated: { type: Number, default: 0 },
  },
  { timestamps: true }
);

VolunteerSchema.pre("save", function (next) {
  if (this.isModified("events")) {
    this.totalEventsParticipated = this.events.length;
  }
  next();
});

const Volunteer = mongoose.model("Volunteer", VolunteerSchema);
module.exports = Volunteer;
