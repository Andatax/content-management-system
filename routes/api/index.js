const router = require("express").Router();

const dbRouter = require("./db");

router.use("/db", dbRouter);

module.exports = router;
