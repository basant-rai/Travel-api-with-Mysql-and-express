const sql = require("../Database/connection");

module.exports = class Package {
  constructor(id, package_name, description, package_image, package_location, package_rating) {
    this.id = id;
    this.package_image = package_image;
    this.package_location = package_location
    this.description = description;
    this.package_name = package_name
    this.package_rating = package_rating

  }

  static getAll = () => {
    return sql.query('SELECT * FROM Travel.Packages')
  }
  static add(items, package_image) {
    return sql.query("INSERT INTO Packages (package_name,package_location,package_image,description,package_rating) VALUES (?,?,?,?,?)",
      [
        items.package_name,
        items.package_location,
        package_image,
        items.description,
        items.package_rating
      ])
  }

  static delete(id) {
    return sql.query("DELETE FROM Packages WHERE id = ?", [id])
  }
  static getById(id) {
    return sql.query('SELECT * FROM Travel.Packages WHERE id = ?', [id])

  }
  static update(id, items, package_image) {
    return sql.query('UPDATE Packages SET package_name=?,package_location=?,package_image=?,description=?,package_rating=?WHERE id = ?',
      [
        items.package_name,
        items.package_location,
        package_image,
        items.description,
        items.package_rating,
        id
      ])
  }
  static updateNoImage(id, items) {
    return sql.query('UPDATE Packages SET package_name=?,package_location=?,description=?,package_rating=? WHERE id = ?',
      [
        items.package_name,
        items.package_location,
        items.description,
        items.package_rating,
        id
      ])
  }
}




