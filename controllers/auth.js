const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
        const cleantoken = authHeader.split(" ")[1];        
        jwt.verify(cleantoken, process.env.JWT_SECRET, (err, user) => {
        if (err) res.status(403).json("Token is not valid");
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("You are not authenticated");
    }
  };

  const verifyTokenAndAuthentication = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.isadmin) {
        next();
      } else {
        res.status(403).json("Not authenticated for this action");
      }
    });
  };

  const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.isadmin) {
        next();
      } else {
        res.status(403).json("Not authenticated for this action");
      }
    });
  };
  
  module.exports = { verifyToken, verifyTokenAndAdmin };