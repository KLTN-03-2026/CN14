// const nodemailer = require("nodemailer");

// module.exports.sendMail = (email, subject, html) => {
//   const  transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     }
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: subject,
//     html: html
//   };

//   transporter.sendMail(mailOptions, function(error, info){
//     if(error) {
//       console.log(error);
//     } else {
//       console.log("Email sent: " + info.response);
//       // do something userfull
//     }
//   });
// }

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Gửi 1 email
 */
module.exports.sendMail = async (email, subject, html) => {
  try {
    const mailOptions = {
      from: `"Bunz Web" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    return { success: true, email };
  } catch (error) {
    console.error("❌ Error sending email:", email, error.message);
    return { success: false, email, error: error.message };
  }
};

module.exports.sendMultipleMail = async (emails, subject, html) => {
  const results = await Promise.allSettled(
    emails.map(email => module.exports.sendMail(email, subject, html))
  );

  // Đếm số lượng thành công và thất bại
  const successCount = results.filter(r => r.status === "fulfilled" && r.value.success).length;
  const failCount = results.length - successCount;

  return {
    total: results.length,
    success: successCount,
    failed: failCount,
    detail: results.map(r => r.value || r.reason),
  };
};
