const Team = require('../Model/team_model')


exports.viewMember = async (req, res) => {
  const [members] = await Team.getAll()
  if (!members) {
    return res.status(400).json({ error: "Members not found" })
  }
  return res.send({ data: members })
}

exports.addMember = async (req, res) => {
  const member_image = req.file.path
  const [new_member] = await Team.add(req.body, member_image)
  if (new_member.affectedRows === 0) {
    return res.status(400).json({ error: "Something went wrog" })
  }
  return res.status(200).json({ message: "Team member has been added successfully" })
}

exports.updateMember = async (req, res) => {
  if (req.file === undefined) {
    const [update_member] = await Team.updateNoImage(req.body, req.params.id,)
    if (update_member.affectedRows === 0) {
      return res.status(400).json({ error: "Member not found" })
    } else {
      return res.status(200).send(update_member[0])
    }
  } else {
    const member_image = req.file.path
    const [update_member] = await Team.update(req.body, req.params.id, member_image,)
    if (update_member.affectedRows === 0) {
      return res.status(400).json({ error: "Member not found" })
    } else {
      return res.status(200).send(update_member[0])
    }
  }
}

exports.deleteMember = async (req, res) => {
  const [delete_member] = await Team.delete(req.params.id)
  if (delete_member.affectedRows === 0) {
    return res.status(400).json({ error: "Member not found" })
  } else {
    return res.status(200).json({ message: "Member has been deleted successfully" })
  }
}