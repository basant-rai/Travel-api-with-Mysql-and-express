const sql = require("../Database/connection");
const bcrypt = require('bcrypt')

module.exports = class User {
  constructor(id, user_name, first_name, last_name, email, password, phone, country, address, profile_picture, accessToken, isVerified,role) {
    this.id = id
    this.user_name = user_name;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
    this.phone_number = phone;
    this.country = country;
    this.address = address;
    this.profile_picture = profile_picture;
    this.accessToken = accessToken;
    this.isVerified = isVerified;
    this.role = role
  }

  static getAllUser = () => {
    return sql.execute('SELECT * FROM Travel.User')
  }

  static findEmail = (email) => {
    return sql.query('SELECT * FROM Travel.User where email=?', [email])
  }

  static addUser = (data, email) => {
    let salt = bcrypt.genSaltSync(10)
    const hashPassword = bcrypt.hashSync(data.password, salt)
    return sql.query('INSERT INTO Travel.User (user_name,first_name,last_name,address,country,password,phone_number,email) VALUES (?,?,?,?,?,?,?,?)', [
      data.user_name,
      data.first_name,
      data.last_name,
      data.address,
      data.country,
      hashPassword,
      data.phone_number,
      email
    ])
  }

  static deleteUser = (id) => {
    return sql.execute('DELETE FROM Travel.User WHERE id = ?', [id])
  }

  static update = (id, data, profile_picture) => {
    
    return sql.query(
      'UPDATE Travel.User SET user_name=?,first_name=?,last_name=?,address=?,country=?,phone_number=?,profile_picture=? WHERE id = ?',
      [
        data.user_name,
        data.first_name,
        data.last_name,
        data.address,
        data.country,
        data.phone_number,
        profile_picture,
        id,
      ])
  }

  static updateNoImage = (id, data) => {
    
    return sql.query(
      'UPDATE Travel.User SET user_name=?,first_name=?,last_name=?,address=?,country=?,phone_number=? WHERE id = ?',
      [
        data.user_name,
        data.first_name,
        data.last_name,
        data.address,
        data.country,
        data.phone_number,
        id,
      ])
  }
  static getPassword = (password) => {
    return sql.query('SELECT * FROM Travel.User where password=?', [password])
  }

  static login = (email, password) => {
    return sql.query('SELECT * FROM Travel.User where email=?,password=?', [email, password])
  }

  static updateToken = (accessToken, email) => {
    return sql.query("UPDATE Travel.User SET accessToken = ? WHERE email = ?", [accessToken, email])
  }

  static deleteToken = (accessToken) => {
    return sql.query("UPDATE Travel.User SET accessToken = NULL WHERE accessToken = ?", [accessToken])
  }

  static find_by_id = (id) => {
    return sql.query('SELECT * FROM Travel.User where id=?', [id])
  }

  static is_verified = (id) => {
    return sql.query("Update Travel.User SET isVerified = ? WHERE id = ?", [true, id])
  }

  static get_verified = (id) => {
    return sql.query("SELECT isVerified FROM Travel.User where id=?", [id])
  }

  static resetPassword = (password, id) => {
    let salt = bcrypt.genSaltSync(10)
    const hashPassword = bcrypt.hashSync(password, salt)
    return sql.query("Update Travel.User SET password = ? WHERE id = ?", [hashPassword, id])
  }

  static getDataFromToken = (accessToken) => {
    return sql.query('SELECT * FROM Travel.User  WHERE accessToken = ?', [accessToken])

  }
}

