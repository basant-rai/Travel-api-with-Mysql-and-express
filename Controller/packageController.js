const Package = require("../Model/packageModel")
const sql = require("../Database/connection");

exports.viewPackage = async (req, res, next) => {
  try {
    const [allPackages] = await Package.getAll();
    return res.status(200).json({ data: allPackages })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.addPackage = async (req, res) => {
  const package_image = req.file.path
  const [addpackage] = await Package.add(req.body, package_image);
  if (addpackage.affectedRows === 0) {
    return res.status(400).json({ error: "Something went wrong" })
  }
  res.status(200).json({ message: "Package has been added successfully" })
}

exports.removePackages = async (req, res) => {
  const [deletePackage] = await Package.delete(req.params.id)
  if (deletePackage.affectedRows === 0) {
    return res.status(400).json({ error: "Package not found" })
  }
  return res.status(200).json({ message: "Package has been deleted successfully" })
}

exports.findPackageById = async (req, res) => {
  const [findpackage] = await Package.getById(req.params.id)
  if (findpackage === 0) {
    return res.status(400).json({ error: "Package not found" })
  } else {
    return res.status(200).send({data:findpackage[0]})
  }
}

exports.updatePackages = async (req, res) => {
  if (req.file === undefined) {
    const [updatepackage] = await Package.updateNoImage(req.params.id, req.body)
    if (!updatepackage) {
      return res.status(400).json({ error: "Package not found" })
    }
    res.send(updatepackage[0])
  } else {
    const package_image = req.file.path
    const [updatepackage] = await Package.update(req.params.id, req.body, package_image)
    if (!updatepackage) {
      return res.status(400).json({ error: "Package not found" })
    }
    res.send(updatepackage[0])
  }
}