import mongoose from "mongoose";

const pageAnalyticsSchema = new mongoose.Schema(
  {
    page: { type: String, default: null }, // page path
    timeSpent: { type: Number, default: 0 }, // seconds spent
  },
  { timestamps: true } // createdAt for session tracking
);

const PageAnalytics = mongoose.model("PageAnalytics", pageAnalyticsSchema);

export default PageAnalytics;
