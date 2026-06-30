require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((err, success) => {
    if (err) {
        console.log(err);
    } else {
        console.log("SMTP Connected!");
    }
});



// const nodemailer = require("nodemailer");

// // console.log("EMAIL_USER:", process.env.EMAIL_USER);
// // console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });



module.exports = transporter;