const sql = require("../Database/connection");

module.exports = class Member {
  constructor(member_id, member_name, member_description, facebook_link, twitter_link, instagram_link, member_image) {
    this.member_id = member_id,
      this.member_name = member_name,
      this.member_description = member_description,
      this.facebook_link = facebook_link,
      this.twitter_link = twitter_link,
      this.instagram_link = instagram_link,
      this.member_image = member_image
  }

  static getAll = () => {
    return sql.query('SELECT * FROM Travel.Team_member')
  }

  static add = (team, member_image) => {
    return sql.query('INSERT INTO Team_member (member_name,member_description,facebook_link,instagram_link,twitter_link,member_image) VALUES(?,?,?,?,?,?)', [
      team.member_name,
      team.member_description,
      team.facebook_link,
      team.instagram_link,
      team.twitter_link,
      member_image
    ])
  }

  static update = (team, member_id, member_image) => {
    return sql.query('UPDATE Team_member SET member_name=?,member_description=?,facebook_link=?,twitter_link=?,instagram_link=?,member_image=? WHERE member_id=?', [
      team.member_name,
      team.member_description,
      team.facebook_link,
      team.twitter_link,
      team.instagram_link,
      member_image,
      member_id
    ])
  }

  static updateNoImage = (team, member_id) => {
    return sql.query('UPDATE Team_member SET member_name=?,member_description=?,facebook_link=?,twitter_link=?,instagram_link=? WHERE member_id=?', [
      team.member_name,
      team.member_description,
      team.facebook_link,
      team.twitter_link,
      team.instagram_link,
      member_id
    ])
  }

  static delete = (member_id) => {
    return sql.query("DELETE FROM Team_member WHERE member_id = ?", [member_id])
  }
}