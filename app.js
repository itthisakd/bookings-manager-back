require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const errorMiddleware = require("./middlewares/error");
const staffController = require("./controllers/staffController");
const staffRoute = require("./routes/staffRoute");
const ratesRoute = require("./routes/ratesRoute");
const reservationsRoute = require("./routes/reservationsRoute");

const { sequelize } = require("./models");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use("/staff", staffRoute);
// app.use("/rates", ratesRoute);
app.use("/reservations", reservationsRoute);
// app.use("/staff", staffRoute);
// app.post("/login", staffController.login);

app.use((req, res) => {
  res.status(404).json({ message: "path not found on this server" });
});

// app.use(errorMiddleware);

// sequelize.sync().then(() => console.log("DB Sync"));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server running on port ${port}`));
