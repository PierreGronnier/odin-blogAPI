const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
};

module.exports = notFoundHandler;
