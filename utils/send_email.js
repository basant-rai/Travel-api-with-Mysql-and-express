const nodemailer = require("nodemailer");

const sendEmail =  (mailoptions) => {

  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "d90b40e8dd271c",
      pass: "27d89a236c17a1"
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

