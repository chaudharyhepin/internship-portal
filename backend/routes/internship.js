const express = require("express");
const Internship = require("../models/Internship");
const authMiddleware = require("../middleware/authMiddleware");
const Application = require("../models/Application");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "company") {
    return res.status(403).json({ message: "Access denied" });
  }

  const internship = new Internship({
    title: req.body.title,
    description: req.body.description,
    duration: req.body.duration,
    mode: req.body.mode,
    skills: req.body.skills,
    company: req.user.id,
  });

  await internship.save();
  res.json({ message: "Internship posted" });
});

router.get("/", async (req, res) => {
  const internships = await Internship.find().populate("company", "name");
  res.json(internships);
});

router.put("/close/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "company") {
    return res.status(403).json({ message: "Access denied" });
  }

  const internship = await Internship.findOneAndUpdate(
    { _id: req.params.id, company: req.user.id },
    { isOpen: false },
    { new: true }
  );

  if (!internship) {
    return res.status(404).json({ message: "Internship not found" });
  }

  res.json(internship);
});

router.get("/company", authMiddleware, async (req, res) => {
  if (req.user.role !== "company") {
    return res.status(403).json({ message: "Access denied" });
  }

  const internships = await Internship.find({
    company: req.user.id,
  }).lean();

  for (let internship of internships) {
    internship.applicantCount = await Application.countDocuments({
      internship: internship._id,
    });
  }

  res.json(internships);
});

router.get("/:id", async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id).populate(
      "company",
      "name"
    );

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.json(internship);
  } catch (error) {
    res.status(400).json({ message: "Invalid internship ID" });
  }
});

module.exports = router;
