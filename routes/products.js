const express = require('express');
const product_controller = require('../controllers/product')
const {
    verifyTokenAndAdmin,
  } = require('../controllers/auth')

const router = express.Router()


router.get("/", product_controller.getProducts);
router.get("/:id", product_controller.getProduct);
router.post("/add", verifyTokenAndAdmin, product_controller.addProduct);
router.delete("/:id", verifyTokenAndAdmin, product_controller.deleteProduct);
router.put("/:id", verifyTokenAndAdmin, product_controller.updateProduct);


module.exports = router