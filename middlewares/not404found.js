// if api failed or use wrong api then we need to throw 404 not found api so that it throw proper error
const not404Found = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "VIsitor mangement throw 404 API endpoint was not found!!!!!!",
    path: req.originalUrl,
    method: req.method
  });
};

module.exports = not404Found;
