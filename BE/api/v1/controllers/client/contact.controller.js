const Contact = require("../../models/contact.model");

// [GET] /contacts/send
module.exports.sendContact = async (req, res) => {
  try {
    const { email, fullName, phone, description, title } = req.body;
    console.log(email);
    
    await Contact.create({
      email, 
      fullName, 
      phone, 
      description,
      title
    });

    res.json({
      code: 200,
      message: `Gửi thành công`,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: `Lỗi ${error.message}`
    });
  }
}
