const express = require("express");
const Job = require("../models/Job");

// Require handleValidateId by destructuring it from the exports object
const { handleValidateId, handleRecordExists } = require("../middleware/custom_errors");

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
    .then((jobs) => res.json(jobs))
    .catch(next);
});

// SHOW
// GET api/jobs/5a7db6c74d55bc51bdf39793
router.get("/:id", handleValidateId, (req, res, next) => {
  Job.findById(req.params.id)
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
router.post("/", (req, res, next) => {
  Job.create(req.body)
    .then((job) => res.json(job))
    .catch(next);
});

// UPDATE
// PUT api/jobs/5a7db6c74d55bc51bdf39793
router.put("/:id", handleValidateId, (req, res, next) => {
  Job.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true
  })
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

// DESTROY
// DELETE api/jobs/5a7db6c74d55bc51bdf39793
router.delete("/:id", handleValidateId, (req, res, next) => {
  Job.findOneAndDelete({
    _id: req.params.id
  })
    .then(handleRecordExists)
    .then((job) => {
      if (!job) {
        res.sendStatus(404);
      } else {
        res.json(204);
      }
    })
    .catch(next);
});

module.exports = router;
