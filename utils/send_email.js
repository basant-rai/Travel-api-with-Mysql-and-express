const nodemailer = require("nodemailer");

const sendEmail = (mailoptions) => {

  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const message = {
    from: mailoptions.from,
    to: mailoptions.to,
    subject: mailoptions.subject,
    text: mailoptions.text,
    html: mailoptions.html
  };
  transport.sendMail(message, (error, info) => {
    if (error) {
      return console.log(error);
    }
    return message
  })
}
module.exports = sendEmail

