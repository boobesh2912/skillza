const jwt = require('jsonwebtoken');

// This is our security guard function
module.exports = function (req, res, next) {
  // 1. Get the token from the request header
  // We expect the front-end to send the token in a header called 'x-auth-token'
  const token = req.header('x-auth-token');

  // 2. Check if no token was sent
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. If there is a token, verify it
  try {
    // jwt.verify will decode the token. If it's not valid, it will throw an error.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If the token is valid, the 'decoded' object will contain our payload (user.id)
    // We attach this payload to the request object so our routes can use it
    req.user = decoded.user;

    // Call next() to pass the request along to the next function (the controller)
    next();
  } catch (error) {
    // This block runs if the token is invalid
    res.status(401).json({ msg: 'Token is not valid' });
  }
};