const jwt = require("jsonwebtoken");

const jwtauthmiddleware = (req, res, next) => {
  //extract jwt token from header
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorize" });

  try {
    const decoded = jwt.verify(token, process.env.jwt_secretkey);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "jwt expired" });
    }

    res.status(401).json({ message: "invalid token" });
  }
};

const generatetoken = (userdata) => {
  //generate new token using user data
  return jwt.sign(userdata, process.env.jwt_secretkey, { expiresIn: "1h" });
};
module.exports = { jwtauthmiddleware, generatetoken };
