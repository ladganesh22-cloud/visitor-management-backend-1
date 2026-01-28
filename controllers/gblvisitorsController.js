const visitorModel = require('../models/visitor-model');



// get all GBL visitors
exports.getAllGBLVisitors = async (req, res) => {
  try {

    // triiggering visitor to find all lists of GBL visitors from visitor model table
    const gblvisitors = await visitorModel.find();

    // if gbl visitors find response then return 200 status code and return JSON response
    res.status(200).json(gblvisitors);

  } catch (error) {
    // if unable to fetch the response from visitor modle the return 400 status with error message
    res.status(400).json({ error: error.message });
  }
};

// get gblvisitor by ID
exports.getGBLVisitorById = async (req, res) => {
  // get sepcific id from requests when front end send id in the request
  const { id } = req.params;

  try {
    // find id from visitor modle table base on id
    const gblvisitor = await visitorModel.findById(id);

    // if response failed from visitor modle then return status 400 code
    if (!gblvisitor) {
      return res.status(404).json({ error: 'GBLVisitor not found!!!!!' });
    }

    // if GBL visitos find data based on id then return 201 status code with json response
    res.status(201).json(visitor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// create new GBL visitor
exports.createGBLVisitor = async (req, res) => {
  // get sepcific name, email, phone, address from requests when front end send id in the request
  const { name, email, phone, address, photo, createdBy } = req.body;

  console.log(name, 'namee');
  console.log(email, 'email');
  console.log(phone, 'phone');
  console.log(address, 'address');
  console.log(createdBy, 'createdBy');

  // if name and email failed then return 400 status code
  if (!name || !email) {
    return res.status(400).json({
      message: "Name and Email are required",
    });
  }

  try {
    console.log('here1');
    const newGBLVisitor = new visitorModel({ name, email, phone, address, photo, createdBy });
    // save then data on monodb visitor model with above data
    await newGBLVisitor.save();

    // return json of the new GBL visitors
    res.status(201).json(newGBLVisitor);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update GBL visitor
exports.updateGBLVisitor = async (req, res) => {
  const { id } = req.params;
  console.log(id, 'iddddddd');

  try {

    const updates = req.body;
    console.log(updates, 'updatesssss');
    const updatedGBLVisitor = await visitorModel.findByIdAndUpdate(id, updates, { new: true });
    console.log(updatedGBLVisitor);
    if (!updatedGBLVisitor) {
      return res.status(404).json({ error: 'GBL Visitor not found!!!!!' });
    }
    // return updated GBL visitors
    res.status(201).json(updatedGBLVisitor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete visitor
exports.deleteGBLVisitor = async (req, res) => {
  const { id } = req.params;
  console.log(id, 'idddeleteeeee');
  try {
    // find id and delete data from monogdb

    const deletedVisitor = await visitorModel.findByIdAndDelete(id);

    if (!deletedVisitor) {
      return res.status(404).json({ error: 'GBL Visitor not found!!!!!' });
    }

    // return json with message
    res.status(201).json({ message: 'GBL Visitor deleted successfully' });
  } catch (error) {

    res.status(400).json({ error: error.message });
  }
};
