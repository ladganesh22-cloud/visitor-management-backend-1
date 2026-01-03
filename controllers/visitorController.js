const visitorModel = require('../models/visitor-model');



// get all visitors
exports.getAllVisitors = async (req, res) => {
  try {
    const visitors = await visitorModel.find();

    res.status(200).json(visitors);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get visitor by ID
exports.getVisitorById = async (req, res) => {
  const { id } = req.params;

  try {
    const visitor = await visitorModel.findById(id);

    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }

    res.status(201).json(visitor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// create new visitor
exports.createVisitor = async (req, res) => {
  const { name, email, phone, address, photo, createdBy } = req.body;

  console.log(name, 'namee')

  if (!name || !email) {
    return res.status(400).json({
      message: "Name and Email are required",
    });
  }

  try {
    console.log('here1');
    const newVisitor = new visitorModel({ name, email, phone, address, photo, createdBy });

    await newVisitor.save();

    res.status(201).json(newVisitor);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update visitor
exports.updateVisitor = async (req, res) => {
  const { id } = req.params;

  const updates = req.body;
  try {

    const updatedVisitor = await visitorModel.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedVisitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }

    res.status(201).json(updatedVisitor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete visitor
exports.deleteVisitor = async (req, res) => {
  const { id } = req.params;
  try {

    const deletedVisitor = await visitorModel.findByIdAndDelete(id);

    if (!deletedVisitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }

    res.status(201).json({ message: 'Visitor deleted successfully' });
  } catch (error) {

    res.status(400).json({ error: error.message });
  }
};
