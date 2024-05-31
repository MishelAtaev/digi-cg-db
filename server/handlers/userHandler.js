const { MongoClient } = require("mongodb");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const { MONGO_URI } = process.env;
const dbName = "diginexus";

const signupHandler = async (req, res) => {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(dbName);
    const { username, email, password, confirmPassword } = req.body;
    const requiredFields = ["username", "email", "password", "confirmPassword"];
    const missingFields = requiredFields.filter(
      (field) => req.body[field] === undefined || req.body[field] === ""
    );

    // Checking if all the required fields are completed
    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Missing-Data",
      });
    }

    // Checking if the password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 400,
        message: "Passwords do not match",
      });
    }

    // Checking if the new user doesn't already have an account created
    const existingUser = await db
      .collection("users")
      .findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        status: 400,
        message: `Error, there is already an account with this email or username`,
      });
    }

    // Hashing the password for security
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      _id: uuidv4(),
      username,
      email,
      password: hashedPassword,
    };

    const insertNewUser = await db.collection("users").insertOne(newUser);
    if (!insertNewUser || !insertNewUser.insertedId) {
      return res.status(500).json({
        status: 500,
        message: "Mongo error while creating new user",
      });
    }

    res.status(201).json({
      status: 201,
      _id: insertNewUser.insertedId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  } finally {
    await client.close();
  }
};

const loginHandler = async (req, res) => {
  const { identifier, password } = req.body;
  const client = new MongoClient(MONGO_URI);

  if (!identifier || !password) {
    return res.status(400).json({
      status: 400,
      message: "Please include a username/email and password",
    });
  }

  // Connecting to database
  try {
    await client.connect();
    const db = client.db(dbName);
    const query = {
      $or: [{ email: identifier }, { username: identifier }],
    };
    const foundUser = await db.collection("users").findOne(query);

    // Checking in the database if there is a user with this email or username
    if (!foundUser) {
      return res.status(404).json({
        status: 404,
        message: `Unable to find an account with the provided credentials`,
      });
    }

    // Comparing the password given by the user to the database making sure they are the same
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        message: "Incorrect password",
      });
    }

    // If password and email/username are correct, send the user data except the password
    const { password: hashedPassword, ...userData } = foundUser;

    res.status(200).json({
      status: 200,
      message: "Login successful",
      user: userData,
    });
    console.log("This is userData: ", userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  } finally {
    await client.close();
  }
};

module.exports = {
  signupHandler,
  loginHandler,
};
