module.exports = (err, req, res, next) => {
  console.error(err); // Log the error for debugging purposes

  return res.status(500).json({
    error: true,
    message: 'An error occurred on the server.'
  });
};