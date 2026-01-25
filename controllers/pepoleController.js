// use user model for getting all lists of users list and a specific user id when front-end-developer fetch id
const peopleModel = require('../models/user-model');

// get all lists of pepople lists who sign-up the GBL Visitors
exports.getAllPeoples = async (req, res) => {
  try {
    // trigger the pepoles from who sign-up the GBL Visitors and find the from User Model
    const pepoles = await peopleModel.find();

    // check peoples response to check 200 status and get json response
    res.status(200).json(pepoles);

  } catch (error) {
    // if peoples response failed then return status 400 and error message
    res.status(400).json({ error: error.message });
  }
};

// get people id from User model sepcific to fetch based on id
exports.getPeopleById = async (req, res) => {
  // get arguments from request params and define it
  const { id } = req.params;

  try {
    // use mongodb function findbyId to fetch sepcific id from user model table
    const pepoles = await peopleModel.findById(id);

    // if pepoles data unable to fetch then return erro
    if (!pepoles) {
      return res.status(404).json({ error: 'GBL pepoles not found!!!!!!' });
    }

    // if peoples found from user modle then return sepcific peoples from user modle table
    res.status(200).json(pepoles);

  } catch (error) {
    // if sepecific peoples id not found from trigger errors
    res.status(400).json({ error: error.message });
  }
};
