const sql = require("../Database/connection");
module.exports = class Token {
  constructor(token_id, token, user_id, created_At) {
    this.token_id = token_id,
      this.token = token
    this.user_id = user_id
    this.created_At = created_At
  }
  static addToken = (token, user_id) => {
    return sql.query("INSERT Travel.Token (token,user_id,created_At) VALUES(?,?,now())", [token, user_id])
  }
  static create_event = (token_id) => {
    return sql.query(
      `CREATE EVENT event_${token_id} ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 5 MINUTE DO DELETE FROM Token WHERE TIMESTAMPDIFF(SECOND,created_At,now())>250;`
    )
  }
  static get_token = (token) => {
    return sql.query("SELECT * from Token WHERE token = ?", [token])
  }
}
