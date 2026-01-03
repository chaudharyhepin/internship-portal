const express = require("express");
const Application = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");
const Internship = require("../models/Internship");
const uploadResume = require("../middleware/uploadResume");

const router = express.Router();

router.post(
  "/:internshipId",
  authMiddleware,
  uploadResume.single("resume"),
  async (req, res) => {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const internship = await Internship.findById(req.params.internshipId);
    if (!internship || !internship.isOpen) {
      return res.status(400).json({ message: "Internship is closed" });
    }

    const existing = await Application.findOne({
      student: req.user.id,
      internship: req.params.internshipId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume is required" });
    }

    const application = new Application({
      student: req.user.id,
      internship: req.params.internshipId,
      resume: req.file.path,
    });

    await application.save();

    res.status(201).json(application);
  }
);

router.delete("/withdraw/:internshipId", authMiddleware, async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied" });
  }

  await Application.findOneAndDelete({
    student: req.user.id,
    internship: req.params.internshipId,
  });

  res.json({ message: "Application withdrawn successfully" });
});

router.get("/company", authMiddleware, async (req, res) => {
  if (req.user.role !== "company") {
    return res.status(403).json({ message: "Access denied" });
  }

  const internships = await Internship.find({ company: req.user.id });
  const internshipIds = internships.map((i) => i._id);

  const applications = await Application.find({
    internship: { $in: internshipIds },
  })
    .select("student internship status resume")
    .populate("student", "name email")
    .populate("internship", "title");

  res.json(applications);
});

router.get("/student", authMiddleware, async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied" });
  }

  const applications = await Application.find({
    student: req.user.id,
  }).populate({
    path: "internship",
    populate: {
      path: "company",
      select: "name",
    },
  });

  res.json(applications);
});

router.put("/status/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "company") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { status } = req.body;

  if (!["Accepted", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  )
    .populate("student", "name email")
    .populate({
      path: "internship",
      populate: { path: "company", select: "name" },
    });

  res.json(application);
});

module.exports = router;
