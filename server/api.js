const express = require("express");
const apiRouter = express.Router();

const {
  createMeeting,
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
  deleteAllFromDatabase,
} = require("./db.js");
const checkMillionDollarIdea = require("./checkMillionDollarIdea.js");

// Parameter handler
apiRouter.use("/:route/:id", (req, res, next) => {
  const elem = getFromDatabaseById(req.params.route, req.params.id);
  req.route = req.params.route;
  req.id = req.params.id;
  req.elem = elem;
  if (
    elem &&
    (req.params.route === "minions" || req.params.route === "ideas")
  ) {
    next();
  } else {
    res.status(404).send();
  }
});

// Route methods
apiRouter.get("/:route/", (req, res, next) => {
  const data = getAllFromDatabase(req.params.route);
  res.send(data);
});

apiRouter.post("/ideas", checkMillionDollarIdea);

apiRouter.post("/:route", (req, res, next) => {
  let data;
  if (req.params.route === "minions" || req.params.route === "ideas") {
    data = addToDatabase(req.params.route, req.body);
  } else if (req.params.route === "meetings") {
    const meeting = createMeeting();
    data = addToDatabase(req.params.route, meeting);
  }
  res.status(201).send(data);
});

apiRouter.delete("/:route", (req, res, next) => {
  if (req.params.route === "meetings") {
    deleteAllFromDatabase(req.params.route);
    res.status(204).send();
  }
});

// Id methods
apiRouter.get("/:route/:id", (req, res, next) => {
  const elem = getFromDatabaseById(req.params.route, req.params.id);
  res.send(elem);
});

apiRouter.put("/:route/:id", (req, res, next) => {
  const elem = updateInstanceInDatabase(req.params.route, req.body);
  res.send(elem);
});

apiRouter.delete("/:route/:id", (req, res, next) => {
  deleteFromDatabasebyId(req.params.route, req.id);
  res.status(204).send();
});

// Work routes
apiRouter.get("/minions/:minionId/work", (req, res, next) => {
  const minionWorks = getAllFromDatabase("work").filter(
    (work) => work.minionId === req.params.minionId
  );
  res.send(minionWorks);
});

apiRouter.post("/minions/:minionId/work", (req, res, next) => {
  const work = addToDatabase("work", req.body);
  res.status(201).send(work);
});

apiRouter.put("/minions/:minionId/work/:workId", (req, res, next) => {
  if (req.body.minionId === req.params.minionId) {
    const work = updateInstanceInDatabase("work", req.body);
    res.send(work);
  } else {
    res.status(400).send();
  }
});

apiRouter.delete("/minions/:minionId/work/:workId", (req, res, next) => {
  const work = deleteFromDatabasebyId("work", req.params.workId);
  res.status(204).send(work);
});

module.exports = apiRouter;
