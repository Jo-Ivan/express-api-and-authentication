const express = require("express");
const Job = require("../models/Job");

const router = express.Router();

// INDEX
// GET api/jobs
router.get("/", (req, res) => {
  // Use our Job model to find all of the documents
  // in the jobs collection
  // When found, they are passed down the promise chain
  // to the `.then()` where we send the response as JSON
  // with `res.json` and pass it any jobs found
  Job.find().then((jobs) => res.json(jobs));
});

// SHOW
// GET api/jobs/5a7db6c74d55bc51bdf39793
router.get("/:id", (req, res) => {
  Job.findById(req.params.id).then((job) => {
    if (!job) {
      res.send(404);
    } else {
      res.json(job);
    }
  });
});

// CREATE
// POST api/jobs
router.post("/", (req, res) => {
  Job.create(req.body)
    .status(201)
    .then((job) => res.json(job));
});

// UPDATE
// PUT api/jobs/5a7db6c74d55bc51bdf39793
router.put("/:id", (req, res) => {
  Job.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true
  }).then((job) => {
    if (!job) {
      res.sendStatus(404);
    } else {
      res.json(job);
    }
  });
});

// DESTROY
// DELETE api/jobs/5a7db6c74d55bc51bdf39793
router.delete("/:id", (req, res) => {
  Job.findOneAndDelete({
    _id: req.params.id
  }).then((job) => {
    if (!job) {
      res.sendStatus(404);
    } else {
      res.json(204);
    }
  });
});

module.exports = router;
