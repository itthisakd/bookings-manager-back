const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Staff } = require("../models");

exports.protect = async (req, res, next) => {
  try {
    let token = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1]; // to get the access token from headers{authorization: "Bearer <token>"}

    if (!token) return res.status(401).json({ message: "Access unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Staff.findOne({ where: { id: payload.id } });
    if (!user) return res.status(400).json({ message: "user not found" });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await Staff.findOne({ where: { username } });
    if (!user)
      return res
        .status(400)
        .json({ message: "Username or password incorrect." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Username or password incorrect." });

    const payload = {
      id: user.id,
      username: user.username,
      name: user.name,
      staffNumber: user.staffNumber,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: +process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.getStaff = async (req, res, next) => {
  try {
    const staffs = await Staff.findAll();
    res.status(200).json({ staffs });
  } catch (err) {
    next(err);
  }
};

exports.createStaff = async (req, res, next) => {
  try {
    const { username, name, password, confirmPassword, staffNumber } = req.body;
    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ message: "Passwords entered do not match" });

    // creates hashedPassword
    const hashedPassword = await bcrypt.hash(
      password,
      +process.env.BCRYPT_SALT
    );
    // add to DB
    await Staff.create({
      username,
      name,
      staffNumber,
      position: "admin",
      password: hashedPassword,
    });

    res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    next(err);
  }
};

exports.updateStaff = async (req, res, next) => {
  try {
    const { username, password, confirmPassword } = req.body;
    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ message: "Passwords entered do not match" });

    // creates hashedPassword
    const hashedPassword = await bcrypt.hash(
      password,
      +process.env.BCRYPT_SALT
    );
    // add to DB
    await Staff.update(
      {
        password: hashedPassword,
        updateAt: new Date(),
      },
      { where: { username } }
    );

    res.status(201).json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};
