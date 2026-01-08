import express from "express";
import Analytics from "../models/PageAnalytics.js";

const router = express.Router();

// GET aggregated analytics per day for a page
router.get("/view/:page?", async (req, res) => {
  try {
    const page = req.params.page || null;

    // Aggregate views per day
    const sessions = await Analytics.aggregate([
      { $match: { page } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          views: { $sum: 1 },
          totalTime: { $sum: "$timeSpent" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const totalViews = sessions.reduce((a, s) => a + s.views, 0);
    const totalTimeSpent = sessions.reduce((a, s) => a + s.totalTime, 0);

    res.json({
      totalViews,
      totalTimeSpent,
      sessions: sessions.map((s) => ({
        session: s._id,
        views: s.views
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST route to log a page view
router.post("/log/:page?", async (req, res) => {
  try {
    const page = req.params.page || null;
    const timeSpent = req.body.timeSpent || 0;

    const record = new Analytics({ page, timeSpent });
    await record.save();

    res.json({ message: "Analytics logged", record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
