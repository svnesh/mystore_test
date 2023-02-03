const { db } = require("../db.js");

exports.getProducts = (req,res) => {
    
    //Get all products
    const q = "SELECT * from products";

    db.query(q, [req.query.cat], (err,data) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
}

exports.getProduct = (req,res) => {
    
    //Get single Product
    const q = "SELECT `pname`,`price`,`quantity`,`active` FROM products WHERE id=?";

    db.query(q, [req.params.id], (err,data) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json(data[0]);
    });
}

exports.addProduct = (req,res) =>{

    //Add product
    const q = "INSERT INTO products(`pname`,`price`,`quantity`,`active`) VALUES (?)";
    const values = [req.body.pname, req.body.price, req.body.quantity, req.body.active == true ? 1 : 0];

    db.query(q, [values], (err,data) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json("Product added successfully");
    });
}

exports.deleteProduct = (req,res) =>{

    const token = req.cookies?.access_token
    if (!token) return res.status(401).json("Not authenticated")

    const productID = req.params.id;
    const q = "DELETE FROM products WHERE `id` = ?";

    db.query(q, [productID], (err,data) => {
        if(err) return res.status(403).json("You can only delete your product");
        return res.json("Product has been deleted");
    });
}

exports.updateProduct = (req,res)=>{

    const token = req.cookies?.access_token
    if (!token) return res.status(401).json("Not authenticated")

    const productID = req.params.id;
    const q = "UPDATE products SET `pname`=?,`price`=?,`quantity`=?,`active`=? WHERE `id`=?";
    const values = [req.body.pname, req.body.price, req.body.quantity, req.body.active];

    db.query(q, [values], (err,data) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json("Product added successfully");
    });
}