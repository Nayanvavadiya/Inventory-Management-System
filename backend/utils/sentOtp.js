const transporter = require("../config/mailer");
const otpGenerator = require("otp-generator");

const sendOTP = async (email) => {
    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP Verification",
        html: `<h2>Your OTP is: ${otp}</h2>`,
    };

    await transporter.sendMail(mailOptions);

    return otp;
};

module.exports = sendOTP;