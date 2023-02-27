const { check, validationResult } = require('express-validator')

exports.productCheck = [
    check('product_name', 'product name is required').notEmpty().isLength({ min: 3 }).withMessage("Product name must be of 3 character"),
    check('product_price', "product price is required").notEmpty().isNumeric().withMessage("Price must be number"),
    check("product_description", "Description is required").notEmpty().isLength({ min: 20 }).withMessage("Description Must be of 20 character"),
    check("product_quantity", "Quantity is requied").notEmpty().isNumeric().withMessage("Quantity must be number"),
    // check("product_image",'product_image is required').notEmpty()
]
exports.memberCheck = [
    check('member_name', 'Member name is required').notEmpty().isLength({ min: 3 }).withMessage("Character must be of 3 character"),
    check("member_description", "Description is required").notEmpty().isLength({ min: 20 }).withMessage("Must be of 20 character"),
    // check("member_image",'product_image is requires').notEmpty()
]

exports.packageCheck = [
  check('package_name', 'package name is required').notEmpty().isLength({ min: 3 }).withMessage("Character must be of 3 character"),
//   check('package_price', "package price is required").notEmpty().isNumeric().withMessage("Price must be in number"),
  check("description", "Description is required").notEmpty().isLength({ min: 20 }).withMessage("Must be of 20 character"),
//   check("package_image", "Image is requied").notEmpty(),
]

exports.userCheck = [
    check("user_name", "user_name is required").notEmpty().isLength({ min: 3 }).withMessage("user_name must be of 3 character"),
    check("first_name", "first_name is required").notEmpty().isLength({ min: 3 }).withMessage("first_name must be 3 character"),
    check("last_name", "last_name is required").notEmpty().isLength({ min: 3 }).withMessage("last_name must be 3 character"),
    check("email", "Email is required").notEmpty().isEmail().withMessage("Email format incorrect"),
    check("password", "Password is required").notEmpty().isLength({ min: 3 }).withMessage("Must be  character").isLength({ max: 15 })
    .withMessage("maximum length is 15").matches(/^[A-Z]/).withMessage("password must contain uppercase at first")
    .matches(/[a-z]/).withMessage("password must contain lowercase")
    .matches(/[-_!@#$%^&*]/).withMessage("password must conatain atleast one character"),
    check('phone_number','phone_number is required').notEmpty().isNumeric().withMessage('Must be number'),
    check("country", "country is required").notEmpty().isLength({ min: 3 }).withMessage("country must be of 3 character"),
    check("address", "address is required").notEmpty().isLength({ min: 3 }).withMessage("city Must be of 3 character"),
]
exports.userCheckUpdate = [
    check("user_name", "user_name is required").notEmpty().isLength({ min: 3 }).withMessage("user_name must be of 3 character"),
    check("first_name", "first_name is required").notEmpty().isLength({ min: 3 }).withMessage("first_name must be 3 character"),
    check("last_name", "last_name is required").notEmpty().isLength({ min: 3 }).withMessage("last_name must be 3 character"),
    // check("email", "Email is required").notEmpty().isEmail().withMessage("Email format incorrect"),
    // check("password", "Password is required").notEmpty().isLength({ min: 3 }).withMessage("Must be  character").isLength({ max: 15 })
    // .withMessage("maximum length is 15").matches(/^[A-Z]/).withMessage("password must contain uppercase at first")
    // .matches(/[a-z]/).withMessage("password must contain lowercase")
    // .matches(/[-_!@#$%^&*]/).withMessage("password must conatain atleast one character"),
    check('phone_number','phone_number is required').notEmpty().isNumeric().withMessage('Must be number'),
    check("country", "country is required").notEmpty().isLength({ min: 3 }).withMessage("country must be of 3 character"),
    check("address", "address is required").notEmpty().isLength({ min: 3 }).withMessage("city Must be of 3 character"),
]
//category check ,validation
exports.validation = (req, res, next) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array()[0].msg })

        // return res.status(400).json({errors:errors.array().map(err=>{return err.msg})})
    }
    next()

}
