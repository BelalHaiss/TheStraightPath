const mongoose = require("mongoose");
const User = require("./models/user");
const dbUrl = "mongodb://localhost:27017/Ahadith";
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Mongo server Running");
  })
  .catch((e) => {
    console.log("Error with the Mongo Server");
    console.log(e);
  });

// const Update = async () => {
//   try {
//     const updated = await User.findOne({username: "meko"});
//     console.log(updated);
//   } catch (e) {
//     console.log("error");
//   }
// };
// Update();

// const changePassword = async () => {
//   const foundUser = await User.findOne({username: "mam"});
//   await foundUser.changePassword("dad", "mam", (err, res) => {
//     if (err) {
//       console.log(err);
//     }

//     if (res) {
//       console.log(res);
//     }
//   });
// };
// changePassword();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

require("dotEnv").config();

async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail' ,
    host: process.env.mailSMTPServer,
    port: process.env.mailPort,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.mailLogin, // generated ethereal user
      pass: process.env.mailPassword, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

// main().catch(console.error);
