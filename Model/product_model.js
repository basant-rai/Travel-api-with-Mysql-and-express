const sql = require("../Database/connection");

module.exports = class Product {
  constructor(product_id, product_name, product_description, product_image, product_quantity, product_rating, product_price,) {
    this.product_id = product_id;
    this.product_name = product_name;
    this.product_image = product_image
    this.product_description = product_description;
    this.product_quantity = product_quantity;
    this.product_rating = product_rating
    this.product_price = product_price

  }

  static getAll = () => {
    return sql.query('SELECT * FROM Travel.Product')
  }

  static add(items, product_image) {
    return sql.query("INSERT INTO Product ( product_name, product_description, product_quantity, product_rating, product_price, product_image) VALUES (?,?,?,?,?,?)", [
      items.product_name,
      items.product_description,
      items.product_quantity,
      items.product_rating,
      items.product_price,
      product_image,
    ])
  }

  static delete(product_id) {
    return sql.query("DELETE FROM Product WHERE product_id = ?", [product_id])
  }

  static getById(product_id) {
    return sql.query('SELECT * FROM Travel.Product WHERE product_id = ?', [product_id])

  }

  static update(product_id, items, product_image) {
    return sql.query('UPDATE Product SET product_name=?, product_description=?, product_image=?, product_quantity=?, product_rating=?,product_price=? WHERE product_id = ?', [
      items.product_name,
      items.product_description,
      product_image,
      parseInt(items.product_quantity),
      parseInt(items.product_rating),
      items.product_price,
      product_id
    ])
  }
  static updateNoImage(product_id, items) {
    return sql.query('UPDATE Product SET product_name=?, product_description=?, product_quantity=?, product_rating=?,product_price=? WHERE product_id = ?', [
      items.product_name,
      items.product_description,
      items.product_quantity,
      items.product_rating,
      items.product_price,
      product_id
    ])
  }
}