const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Event = require("../models/event.model");
const dayjs = require("dayjs");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);


router.get("/dashboard-analytics", async (req, res) => {
    try {
        const { userid } = req.query; 

        if (!userid) {
            return res.status(400).json({ error: "User ID is required as a query parameter" });
        }

        const events = await Event.find({ createdBy: userid }).select("title image date startTime endTime ticketCategory ticketPrice participants");

        const totalEvents = events.length;
        const totalRegistrations = events.reduce((sum, event) => sum + (event.participants?.length || 0), 0);
        const totalMoney = events.reduce((sum, event) => {
            if (event.ticketCategory === "paid") {
                const soldTickets = event.participants?.length || 0;
                return sum + (soldTickets * (Number(event.ticketPrice) || 0));
            }
            return sum;
        }, 0);

        const now = dayjs(); 

        const ongoingEvents = [];
        const upcomingEvents = [];

        events.forEach(event => {
            const eventDate = dayjs(event.date).isValid() ? dayjs(event.date) : dayjs(new Date(event.date));

            if (eventDate.isValid()) {
                if (eventDate.isSameOrBefore(now, "day")) {
                    ongoingEvents.push(event);
                } else {
                    upcomingEvents.push(event);
                }
            }
        });

        res.status(200).json({
            totalEvents,
            totalRegistrations,
            totalMoney,
            ongoingEvents: ongoingEvents.map(event => ({
                _id: event._id,
                image: event.image,
                title: event.title,
                date: event.date,
                starttime : event.startTime,
                endTime : event.endTime,
                ticketCategory: event.ticketCategory,
                ticketPrice: event.ticketPrice,
                registrations: event.participants?.length || 0
            })),
            upcomingEvents: upcomingEvents.map(event => ({
                _id: event._id,
                image: event.image,
                title: event.title,
                date: event.date,
                starttime : event.startTime,
                endTime : event.endTime,
                ticketCategory: event.ticketCategory,
                ticketPrice: event.ticketPrice,
                registrations: event.participants?.length || 0
            }))
        });

    } catch (error) {
        console.error(`[Dashboard Analytics] Error for user ${req.query.userid}:`, error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

module.exports = router;
