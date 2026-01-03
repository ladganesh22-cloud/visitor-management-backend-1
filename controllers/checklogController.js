const checkLogModel = require('../models/checklog-model');
const passModle = require('../models/pass-model');


exports.getAllCheckLog = async (req, res) => {
  try {
    const checkLog = await checkLogModel.find();

    res.status(200).json(checkLog);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.scanCheckIn = async (req, res) => {
  // const { passId } = req.body;
  const { passId, visitorId, checkDate, scanType, scannedBy } = req.body;
  // const passId = req.user.passId;
  console.log(passId)
  console.log(visitorId)
  console.log(checkDate)
  console.log(scanType)
  console.log(scannedBy)
  if (!passId) {
    return res.status(400).json({ error: 'Pass ID is required' });
  }

  try {

    const newCheckLog = new checkLogModel({ passId, visitorId, checkDate, scannedBy });

    await newCheckLog.save();

    const passDetails = await passModle.findOne({ passId });
    console.log(passDetails, 'passDetails')

    passDetails.status = 'checked-in';

    await passDetails.save();

    res.status(201).json(newCheckLog);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.scanCheckOut = async (req, res) => {
  const { id, passId } = req.body;
  try {
    const checkLog = await checkLogModel.findById(id);
    console.log(checkLog);
    if (!checkLog) {
      return res.status(404).json({ error: 'No active check-in found for this visitor' });
    }
    checkLog.checkDate = new Date();

    checkLog.scanType = 'checkout';

    await checkLog.save();


    const passDetails = await passModle.findOne({ passId });
    console.log(passDetails, 'passDetails')

    passDetails.status = 'checked-out';

    await passDetails.save();

    res.status(201).json(checkLog);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};
