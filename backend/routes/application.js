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
      resume: `uploads/resumes/${req.file.filename}`,
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
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await Application.find({
      student: req.user.id,
    })
      .populate("internship", "title mode duration")
      .populate({
        path: "internship",
        populate: {
          path: "company",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

router.put("/status/:id", authMiddleware, async (req, res) => {
  try {
    // 1️⃣ Role check
    if (req.user.role !== "company") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body;

    // 2️⃣ Allowed status values
    const validStatus = ["Applied", "Shortlisted", "Selected", "Rejected"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // 3️⃣ Fetch application FIRST
    const application = await Application.findById(req.params.id).populate(
      "internship"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 4️⃣ Ownership check (VERY IMPORTANT)
    if (application.internship.company.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 5️⃣ Final-state protection
    if (["Selected", "Rejected"].includes(application.status)) {
      return res.status(400).json({
        message: "Final status cannot be changed",
      });
    }

    // 6️⃣ Update status
    application.status = status;
    await application.save();

    // 7️⃣ Populate response
    await application.populate("student", "name email");
    await application.populate({
      path: "internship",
      populate: {
        path: "company",
        select: "name",
      },
    });

    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

router.get("/internship/:internshipId", authMiddleware, async (req, res) => {
  if (req.user.role !== "company") {
    return res.status(403).json({ message: "Access denied" });
  }

  const internship = await Internship.findOne({
    _id: req.params.internshipId,
    company: req.user.id,
  });

  if (!internship) {
    return res.status(404).json({ message: "Internship not found" });
  }

  const applications = await Application.find({
    internship: req.params.internshipId,
  }).populate("student", "name email");

  res.json(applications);
});

router.patch("/:applicationId/status", authMiddleware, async (req, res) => {
  if (req.user.role !== "company") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { status } = req.body;

  const validStatus = ["Shortlisted", "Selected", "Rejected"];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const application = await Application.findById(
    req.params.applicationId
  ).populate("internship");

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  if (application.internship.company.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  if (["Selected", "Rejected"].includes(application.status)) {
    return res.status(400).json({
      message: "Final decision already made",
    });
  }

  application.status = status;
  await application.save();

  res.json(application);
});

module.exports = router;
