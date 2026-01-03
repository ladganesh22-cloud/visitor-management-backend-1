const userModel = require('../models/user-model');

const jwt = require('jsonwebtoken');

const createToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.SECRET_KEY,
    { expiresIn: '8h' }
  );
};

// Register Controller
exports.createRegisterUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {

    const newUser = await userModel.createRegisterUser(name, email, password, role);

    // create JWT token
    const token = createToken(newUser._id);

    res.status(201).json({ email: newUser.email, token, role: newUser.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login Controller
exports.loginVisitor = async (req, res) => {

  const { email, password } = req.body;
  console.log(email, password)
  try {
    const loginUser = await userModel.loginUser(email, password);

    // create JWT token
    const token = createToken(loginUser._id);

    res.status(200).json({ email: loginUser.email, token, role: loginUser.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
