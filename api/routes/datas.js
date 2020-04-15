const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Data = require("../models/data");

router.get("/", (req, res, next) => {
  Data.find()
    .select("dataString dataNumber _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        datainBase: docs.map((doc) => {
          return {
            dataString: doc.dataString,
            dataNumber: doc.dataNumber,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:5000/data/" + doc._id,
            },
          };
        }),
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  const data = new Data({
    _id: new mongoose.Types.ObjectId(),
    dataString: req.body.dataString,
    dataNumber: req.body.dataNumber,
  });
  data
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created Data successfully",
        createdData: {
          dataString: result.dataString,
          dataNumber: result.dataNumber,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:5000/data/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:dataId", (req, res, next) => {
  const id = req.params.dataId;
  Data.findById(id)
    .select("dataString dataNumber _id")
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          data: doc,
          request: {
            type: "GET",
            url: "http://localhost:5000/data",
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:dataId", (req, res, next) => {
  const id = req.params.dataId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Data.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Data updated",
        request: {
          type: "GET",
          url: "http://localhost:5000/data/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:dataId", (req, res, next) => {
  const id = req.params.dataId;
  Data.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Data deleted",
        request: {
          type: "POST",
          url: "http://localhost:5000/data",
          body: { dataString: "String", dataNumber: "Number" },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
