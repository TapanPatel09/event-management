const express = require("express");
const router = express.Router();
const Participant = require("../models/participant.model");
const Event = require("../models/event.model");

router.post("/edit/:userid", async (req, res) => {
  try {
    const { userid } = req.params;
    const { name, email, phone } = req.body;

    const updatedParticipant = await Participant.findByIdAndUpdate(
      userid,
      { name, email, phone },
      { new: true, runValidators: true }
    );

    if (!updatedParticipant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    res.status(200).json({
      message: "Participant updated successfully",
      participant: updatedParticipant,
    });
  } catch (error) {
    console.error("Error updating participant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/delete", async function (req, res) {
  try {
    const { userids } = req.body;

    if (!Array.isArray(userids) || userids.length === 0) {
      return res
        .status(400)
        .json({ message: "No participants provided for deletion" });
    }

    const deletedParticipants = await Participant.find({
      _id: { $in: userids },
    });

    if (deletedParticipants.length === 0) {
      return res.status(404).json({ message: "No participants found" });
    }

    await Participant.deleteMany({ _id: { $in: userids } });

    const eventId = deletedParticipants[0].eventId;


    await Event.findByIdAndUpdate(
      eventId,
      { $pull: { participants: { $in: userids } } }
    );

    
    const event = await Event.findById(eventId);
    if (event) {
      event.ticketsAvailable += deletedParticipants.length;
      await event.save();
    }

    res.status(200).json({
      message: `${deletedParticipants.length} participants deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
