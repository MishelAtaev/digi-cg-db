const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const { MONGO_URI } = process.env;
const client = new MongoClient(MONGO_URI);

const dbName = "diginexus";

const signupHandler = async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const { username, email, password, confirmPassword } = req.body;
    const requiredFields = ["username", "email", "password", "confirmPassword"];
    const missingFields = requiredFields.filter(
      (field) => req.body[field] === undefined || req.body[field] === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Missing data",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 400,
        message: "Passwords do not match",
      });
    }

    const existingUser = await db
      .collection("users")
      .findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        status: 400,
        message: "User with this email or username already exists",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      _id: uuidv4(), // Generate unique user ID using uuid
      username,
      email,
      password: hashedPassword,
    };

    const result = await db.collection("users").insertOne(newUser);

    res.status(201).json({
      status: 201,
      userId: newUser._id, // Return the new user's UUID
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
  try {
    await client.connect();
    const db = client.db(dbName);
    const query = {
      $or: [{ email: identifier }, { username: identifier }],
    };
    const user = await db.collection("users").findOne(query);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        message: "Incorrect password",
      });
    }

    res.status(200).json({
      status: 200,
      userId: user._id, // Return the user's UUID
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

module.exports = {
  signupHandler,
  loginHandler,
};
