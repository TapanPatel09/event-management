const express = require("express");
const Volunteer = require("../models/volunteer.model");
const Event = require("../models/event.model");
const SendPassword = require("../config/SendPassword");
const bcrypt = require("bcrypt");
const QRCode = require("qrcode");

const router = express.Router();

router.post("/register", async (req, res) => {
  console.log(req.body);

  try {
    const { name, email, phone, eventId, role } = req.body;

    if (!name || !email || !phone || !eventId || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const eventExists = await Event.findById(eventId);
    if (!eventExists) {
      return res.status(404).json({ message: "Event not found" });
    }

    let volunteerProfile = await Volunteer.findOne({ email });

    let tempPassword = null;
    if (!volunteerProfile) {
      const defaultPassword = Math.random().toString(36).slice(-8);
      tempPassword = defaultPassword;
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      volunteerProfile = new Volunteer({
        name,
        email,
        phone,
        password: hashedPassword,
        events: [
          {
            event: eventId,
            role,
            date: eventExists.date,
            eventname: eventExists.title,
            status: "pending",
            assignedTasks: "",
          },
        ],
      });

      const qrData = JSON.stringify({ volunteerId: volunteerProfile._id, eventId });
      const qrCodeDataUrl = await QRCode.toDataURL(qrData);

      await SendPassword(name, email, defaultPassword, eventExists.title, qrCodeDataUrl);
    } else {
      const isAlreadyRegistered = volunteerProfile.events.some(
        (ev) => ev.event.toString() === eventId
      );

      if (isAlreadyRegistered) {
        return res.status(400).json({
          message: "You are already registered as a volunteer for this event",
        });
      }

      volunteerProfile.events.push({
        event: eventId,
        role,
        eventname: eventExists.title,
        date: eventExists.date,
        status: "pending",
        assignedTasks: "",
      });
    }
    await volunteerProfile.save();

    eventExists.volunteers.push(volunteerProfile._id);
    await eventExists.save();

    res.status(201).json({
      message: "Volunteer registration successful",
      volunteer: volunteerProfile,
      tempPassword, // Return the password if it was newly generated
      note: tempPassword
        ? "Please share these credentials with the volunteer."
        : "The volunteer is already registered; they can use their existing password.",
    });
  } catch (error) {
    console.error("Error in volunteer registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    // ✅ Ensure we only return volunteers still linked to this event
    const volunteers = await Volunteer.find({
      "events.event": eventId,
    }).select("name email phone events");

    res.status(200).json({ volunteers });
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:VolID/details", async (req, res) => {
  try {
    const VolID = req.params.VolID;

    const response = await Volunteer.findById(VolID);
    if (!response) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching volunteer:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.post("/edittask", async (req, res) => {
  try {
    const { volunteerId, eventId, name, email, phone, role, assignedTasks } =
      req.body;

    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    if (name) volunteer.name = name;
    if (email) volunteer.email = email;
    if (phone) volunteer.phone = phone;

    const eventIndex = volunteer.events.findIndex(
      (event) => event.event.toString() === eventId
    );

    if (eventIndex === -1) {
      return res
        .status(404)
        .json({ message: "Event not found for this volunteer" });
    }

    if (role) volunteer.events[eventIndex].role = role;

    if (assignedTasks !== undefined) {
      volunteer.events[eventIndex].assignedTasks = String(assignedTasks);
    }

    const updatedVolunteer = await volunteer.save();

    res.status(200).json({
      message: "Volunteer task updated successfully",
      updatedVolunteer,
    });
  } catch (error) {
    console.error("Error updating volunteer task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/delete/:volunteerId/:eventId", async (req, res) => {
  try {
    const { volunteerId, eventId } = req.params;

    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    // ✅ Correctly remove the event from volunteer.events
    volunteer.events = volunteer.events.filter(
      (ev) => ev.event.toString() !== eventId
    );

    if (volunteer.events.length === 0) {
      await Volunteer.findByIdAndDelete(volunteerId);
    } else {
      await volunteer.save();
    }

    // ✅ Correctly remove the volunteer from the event
    const event = await Event.findById(eventId);
    if (event) {
      event.volunteers = event.volunteers.filter(
        (vId) => vId.toString() !== volunteerId.toString()
      );

      await event.save();
    }

    console.log("Updated Volunteer:", await Volunteer.findById(volunteerId));

    res
      .status(200)
      .json({ message: "Volunteer successfully removed from event" });
  } catch (error) {
    console.error("Error deleting volunteer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/mark-attendance", async (req, res) => {
  try {
    const { volunteerId, eventId } = req.body;
    if (!volunteerId || !eventId) {
      return res.status(400).json({ message: "Missing volunteerId or eventId" });
    }

    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

    const eventIndex = volunteer.events.findIndex(
      (ev) => ev.event.toString() === eventId
    );

    if (eventIndex === -1) {
      return res.status(404).json({ message: "Volunteer is not registered for this event" });
    }

    volunteer.events[eventIndex].isPresent = true;
    await volunteer.save();

    res.status(200).json({ message: "Attendance marked successfully!" });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
