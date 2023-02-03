const { db } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = (req,res) =>{

    //check existing user
    const q = "SELECT * FROM users WHERE email = ? OR username = ?"
    db.query(q, [req.body.email, req.body.username], (err,data) => {
        if(err) return res.json(err);
        if(data.length > 0) return res.status(409).json("User already exists");

        //Hash password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password.toString(), salt);

        const q = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)";
        const values = [req.body.username, req.body.email, hash];

        db.query(q, [values], (err, data)=>{
            if(err) return res.json(err);
            return res.status(200).json("User has been created");
        });
    });
}

exports.login = (req,res) =>{

    //check user credetials
    const q = "SELECT * from users WHERE username = ?";

    db.query(q, [req.body.username], (err,data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("User does not exists");

        //
        const isPassCorrect = bcrypt.compareSync(req.body.password.toString(), data[0].password);
        
        if(!isPassCorrect) return res.status(400).json("Username or password is wrong")

        const token = jwt.sign({id: data[0].id}, process.env.JWT_SECRET);
        const {password, ...other} = data[0];

        console.log(token);

        res.cookie("access_token", token, {
            httpOnly:true
        }).status(200).json(other)
    })
}

exports.logout = (req,res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("User has been logged out") 
};