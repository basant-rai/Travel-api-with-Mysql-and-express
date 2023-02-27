const Product = require("../Model/product_model")

exports.viewProduct = async (req, res, next) => {
  try {
    const [all_product] = await Product.getAll();
    return res.status(200).send({ data: all_product })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.addProduct = async (req, res) => {
  const product_image = req.file.path
  if (product_image) {
    const [addpackage] = await Product.add(req.body, product_image);
    if (addpackage.affectedRows === 0) {
      return res.status(400).json({ error: "Something went wrong" })
    }
    res.status(200).json({ message: "product has been added successfully" })
  }
  res.status(400).json({ message: "product image is required" })
}

exports.removeProduct = async (req, res) => {
  const [delete_product] = await Product.delete(req.params.id)
  if (delete_product.affectedRows === 0) {
    return res.status(400).json({ error: "Product not found" })
  }
  return res.status(200).json({ message: "product has been deleted successfully" })
}

exports.findProductById = async (req, res) => {
  const [find_product] = await Product.getById(req.params.id)
  const [send_product] = find_product
  if (find_product.length === 0) {
    return res.status(400).json({ error: "product not found" })
  } else {
    return res.status(200).send({data:send_product})
  }
}

exports.updateProduct = async (req, res) => {
  if (req.file === undefined) {
    const [update_product] = await Product.updateNoImage(req.params.id, req.body)
    if (!update_product) {
      return res.status(400).json({ error: "product not found" })
    }
    res.status(200).json({ message: "product has been updated successfully" })
  }
  else {
    const product_image = req.file.path
    const [update_product] = await Product.update(req.params.id,
      req.body, product_image
    )
    if (!update_product) {
      return res.status(400).json({ error: "product not found" })
    }
    res.status(200).json({ message: "product has been updated successfully" })
  }
}
