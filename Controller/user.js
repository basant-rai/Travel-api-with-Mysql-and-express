const User = require("../Model/user")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt')
const crypto = require('crypto');
const Token = require("../Model/token_modal");
const sendEmail = require('../utils/send_email');


exports.viewUser = async (req, res) => {
  try {
    const [user] = await User.getAllUser();
    return res.send({ data: user })
  } catch (error) {
    return res.status(400).json({ error: "Something went wrong" })
  }
}

exports.findByEmail = async (req, res) => {
  const [uniq] = await User.findEmail(req.body.email)
  if (uniq.length === 0) {
    return res.status(400).json({ error: "Email not found" })
  }
  return res.status(200).send(uniq)
}

exports.createUser = async (req, res) => {
  const [uniq] = await User.findEmail(req.body.email)
  if (uniq.length === 0) {
    const email = req.body.email
    const [newUser] = await User.addUser(req.body, email)
    if (newUser.affectedRows === 0) {
      return res.status(400).json({ error: "Something went wrong" })
    } else {
      let token = crypto.randomBytes(16).toString('hex')
      const [update_token] = await Token.addToken(token, newUser.insertId)

      if (update_token.affectedRows === 0) {
        return res.status(400).json({ error: "Token not updated" })
      }
      Token.create_event(update_token.insertId)
      const url = `http://localhost:5000/api/confirmuser/${token}`
      sendEmail({
        from: 'travel_nepal@info.np',
        to: email,
        subject: 'verfication Email',
        text: `<h5>Please click to verify account. ${url}</h5>`,
        html: `<a href="${url}"><button>Verify Account</button></a>`
      })
      return res.status(200).json({ message: "Account created.Please verify your email within 5 minutes" })
    }
  } else {
    return res.status(400).json({ error: "This email has been already registered" })
  }
}

exports.confirm_user = async (req, res) => {
  const [[confirm_token]] = await Token.get_token(req.params.token)
  if (!confirm_token) {
    return res.status(400).json({ error: "Token has been expired " })
  } else {
    const [[verify_user]] = await User.find_by_id(confirm_token.user_id)
    if (!verify_user.id) {
      return res.status(400).json({ error: "User not found " })
    } else {
      const [[verified]] = await User.get_verified(verify_user.id)
      if (verified.isVerified === 1) {
        return res.status(400).json({ error: "Already verified. Please login to continue" })
      } else {
        const [is_verified] = await User.is_verified(verify_user.id)
        if (is_verified.affectedRows === 0) {
          return res.status(400).json({ error: "User not verified" })
        } else {
          return res.status(200).json({ message: "User verified.Please login to continue" })
        }
      }
    }
  }
}

exports.resend_confirmation = async (req, res) => {
  const [email_check] = await User.findEmail(req.body.email)
  if (email_check.length === 0) {
    return res.status(400).json({ error: "Email is not registered" })
  } else {
    const [user] = email_check
    const [[verified]] = await User.get_verified(user.id)
    if (verified.isVerified === 1) {
      return res.status(400).json({ error: "Already verified. Please login to continue" })
    } else {
      let token = crypto.randomBytes(16).toString('hex')
      const [token_update] = await Token.addToken(token, user.id)
      if (token_update.affectedRows === 0) {
        return res.status(400).json({ error: "Token not updated" })
      }
      Token.create_event(token_update.insertId)
      const url = `http://localhost:5000/api/confirmuser/${token}`
      sendEmail({
        from: 'travel_nepal@info.np',
        to: user.email,
        subject: 'verfication Email',
        text: `<h5>Please click to verify account. ${url}</h5>`,
        html: `
          <h3>Travel Nepal</h3>
          <h4>Verify your email address</h4>
          <p>Please confirm that you want to use this email as your Travel Nepal account email address.</p>
          <a href="${url}"><button>Verify my email</button></a>`,
      })
      return res.status(200).json({ message: "Please check your email to verify" })
    }
  }
}

exports.forgot_password = async (req, res) => {
  const [email_check] = await User.findEmail(req.body.email)
  if (email_check.length === 0) {
    return res.status(400).json({ error: "Email is not registered" })
  } else {
    const [user] = email_check
    const [[verified]] = await User.get_verified(user.id)
    if (verified.isVerified === 0) {
      return res.status(400).json({ error: "User not verified" })
    } else {
      let token = crypto.randomBytes(16).toString('hex')
      const [token_update] = await Token.addToken(token, user.id)
      if (token_update.affectedRows === 0) {
        return res.status(400).json({ error: "Token not updated" })
      }
      Token.create_event(token_update.insertId)
      const url = `http://localhost:3000/reset-password/${token}`
      sendEmail({
        from: 'travel_nepal@info.np',
        to: user.email,
        subject: 'verfication Email',
        text: `<h5>Reset password. ${url}</h5>`,
        html: `
          <h3>Travel Nepal</h3>
          <h4>Reset password</h4>
          <p>Please reset your password.</p>
          <a href="${url}"><button>Reset password</button></a>`,
      })
      return res.status(200).json({ message: "Please check your email to reset password" })
    }
  }
}

exports.reset_password = async (req, res) => {
  const [[confirm_token]] = await Token.get_token(req.params.token)
  if (!confirm_token) {
    return res.status(400).json({ error: "Token has been expired " })
  } else {
    const [[verify_user]] = await User.find_by_id(confirm_token.user_id)
    if (!verify_user.id) {
      return res.status(400).json({ error: "User not found " })
    } else {
      const password = req.body.password
      const [reset] = await User.resetPassword(password, verify_user.id)
      if (reset.affectedRows === 0) {
        return res.status(400).json({ error: "Failed to reset password try again" })
      } else {
        return res.status(200).json({ error: "Password has been reset successfully" })
      }
    }
  }
}

exports.deleteUser = async (req, res, next) => {
  const [deleteuser] = await User.deleteUser(req.params.id)
  if (deleteuser.affectedRows === 0) {
    return res.status(400).json({ error: "User is not registered" })
  }
  return res.status(200).json({ message: "Account has been deactivated" })
}

exports.updateUser = async (req, res) => {
  if (req.file !== undefined) {
    const profile_picture = req.file.path
    const [updateuser] = await User.update(req.params.id, req.body, profile_picture)
    if (updateuser.affectedRows === 0) {
      return res.status(400).json({ error: "User is not registered" })
    } else {
      return res.status(200).json({ message: "User has been updated successfully" })
    }
  } else {
    const [updateuser] = await User.updateNoImage(req.params.id, req.body)
    if (updateuser.affectedRows === 0) {
      return res.status(400).json({ error: "User is not registered" })
    } else {
      return res.status(200).json({ message: "User has been updated successfully" })
    }
  }

}

const createAccessToken = (user) => {
  // create new JWT access token
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    // {
    //   expiresIn: "1h",
    // }
  );
  return accessToken;
};

exports.logIn = async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  const [user] = await User.findEmail(email)
  const [checkuser_isVerified] = user
  if (user.length > 0) {
    if (checkuser_isVerified.isVerified === 1) {
      var password_hash = user[0]["password"];
      const check_password = await bcrypt.compare(password, password_hash)
      if (!check_password) {
        return res.status(400).json({ error: "Incorrect password.Please try again" })
      } else {
        const accessToken = createAccessToken(user[0]);
        res.cookie("access-token", accessToken, {
          // maxAge: 0000 * 60, //1h
          httpOnly: true,
        });
        const [update_token] = await User.updateToken(accessToken, user[0].email)

        if (user[0].accessToken !== null) {
          return res.status(400).json({ error: "User is logged In" })
        } else {
          const [user_token] = await User.findEmail(email)
          return res.status(200).send(user_token[0])
        }
      }
    } else {
      return res.status(400).json({ error: "Email not verified. Please verify to continue " })
    }
  }
  else {
    return res.status(400).json({ error: "Email not found. Please register your email" })
  }
}

exports.logOut = async (req, res) => {
  const [logout] = await User.deleteToken(req.params.token)
  if (logout.affectedRows === 0) {
    return res.status(400).json({ error: "Token not found" })
  } else {
    return res.status(200).json({ message: "Logout sucessfully" })
  }
}

exports.getUserData = async (req, res) => {

  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const [profile] = await User.find_by_id(authData.id)
      res.json({ message: "Welcome to profile", data: profile[0] })
    }
  })
}

// exports.verifyToken=(req, res, next)=> {
//   const bearerHeader = req.headers['authorization'];

//   if (bearerHeader) {
//     const bearer = bearerHeader.split(' ');
//     const bearerToken = bearer[1];
//     req.token = bearerToken;
//     next();
//   } else {
//     // Forbidden
//     res.sendStatus(403);
//   }
// }

exports.verifyToken = expressjwt({
  secret: process.env.ACCESS_TOKEN_SECRET,
  algorithms: ["HS256"]
})
