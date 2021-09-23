const express = require("express");
const Job = require("../models/Job");

// Require handleValidateId by destructuring it from the exports object
const { handleValidateId, handleRecordExists, handleValidateOwnership } = require("../middleware/custom_errors");
const { requireToken } = require("../middleware/auth");

const router = express.Router();

// INDEX
// GET api/jobs
router.get("/", (req, res, next) => {
  // Use our Job model to find all of the documents
  // in the jobs collection
  // When found, they are passed down the promise chain
  // to the `.then()` where we send the response as JSON
  // with `res.json` and pass it any jobs found
  Job.find()
    .populate("owner", "email -_id")
    .then((jobs) => res.json(jobs))
    .catch(next);
});

// SHOW
// GET api/jobs/5a7db6c74d55bc51bdf39793
router.get("/:id", handleValidateId, (req, res, next) => {
  Job.findById(req.params.id)
    .populate("owner")
    .then(handleRecordExists)
    .then((job) => {
      if (!job) {
        res.sendStatus(404);
      } else {
        res.json(job);
      }
    })
    .catch(next);
});

// CREATE
// POST api/jobs
router.post("/", requireToken, (req, res, next) => {
  Job.create({ ...req.body, owner: req.user._id })
    .then((job) => res.status(201).json(job))
    .catch(next);
});

// UPDATE
// PUT api/jobs/5a7db6c74d55bc51bdf39793
router.put("/:id", handleValidateId, requireToken, (req, res, next) => {
  Job.findById(req.params.id)
    .then(handleRecordExists)
    .then((job) => handleValidateOwnership(req, job))
    .then((job) => job.set(req.body).save())
    .then((job) => {
      res.json(job);
    })
    .catch(next);
});

// DESTROY
// DELETE api/jobs/5a7db6c74d55bc51bdf39793
router.delete("/:id", handleValidateId, requireToken, (req, res, next) => {
  Job.findById(req.params.id)
    .then(handleRecordExists)
    .then((job) => handleValidateOwnership(req, job))
    .then((job) => job.remove())
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

module.exports = router;
