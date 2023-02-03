const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')

const productRouter = require('./routes/products');
const userRouter = require('./routes/users')


const PORT = 8800;

app.use(express.json());
app.use(cookieParser());

app.use("/products", function auth(req,res,next){
    const authHeader = req.headers.authorization;
    //console.log(req.headers.authorization);
    if (authHeader) {
        const cleantoken = authHeader.split(" ")[1];
        //console.log(cleantoken);
        jwt.verify(cleantoken, process.env.JWT_SECRET, (err, user) => {
          if (err) res.status(403).json("Token is not valid");
          req.user = user;
          next();
        });
      } else {
        return res.status(401).json("You are not authenticated");
      }
});


app.use("/products", productRouter);
app.use("/user", userRouter);

app.listen(PORT, ()=> console.log(`Server running in port ${PORT}`));