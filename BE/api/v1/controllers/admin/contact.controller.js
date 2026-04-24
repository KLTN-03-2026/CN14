const Contact = require("../../models/contact.model");
const sendMailHelper = require("../../../../helpers/sendMail");

// [GET] /contacts
module.exports.index = async (req, res) => {
  try {
    const { status, limit, page } = req.query;
    // Bộ lọc mặc định
    let find = {};
    if (status) find.status = status;

    // Phân trang
    const limitItems = parseInt(limit) || 5;
    const currentPage = parseInt(page) || 1;

    const count = await Contact.countDocuments(find);
    const totalPage = Math.ceil(count / limitItems);
    const skip = (currentPage - 1) * limitItems;

    // Lấy danh sách
    const contacts = await Contact.find(find)
      .limit(limitItems)
      .skip(skip)
      .lean();

    // Trả kết quả
    res.json({
      code: 200,
      data: {
        contacts,
        totalPage
      }
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: 400,
      message: "Lỗi: " + error.message,
    });
  }
}

// [POST] /contacts/reply/:contact_id
module.exports.reply = async (req, res) => {
  try {
    const contact_id = req.params.contact_id;
    const { title, content } = req.body;

    const contact = await Contact.findById(contact_id);

    if (!contact) {
      return res.json({
        code: 204,
        message: `Không tìm thấy liên hệ này!`
      });
    }

    if (contact.status === "closed") {
      return res.json({
        code: 204,
        message: `Liên hệ này đã đóng, không xử lý thêm!`
      });
    }

    if (contact.status === "spam") {
      return res.json({
        code: 204,
        message: `Liên hệ này là SPAM, không xử lý thêm!`
      });
    }

    sendMailHelper.sendMail(contact.email, title, content);

    contact.status = "resolved";
    await contact.save();

    res.json({
      code: 200,
      message: `Gửi phản hồi thành công đến email: ${contact.email}`
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: 400,
      message: "Lỗi: " + error.message,
    });
  }
}

// [GET] /api/v1/contacts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    await Contact.updateOne({
      _id: id
    }, {
      status: status,
    })

    res.json({
      code: 200,
      message: "Cập nhập trạng thái thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi " + error.message
    });
  }
}