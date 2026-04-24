const SettingGeneral = require("../../models/settings-general.model");
const ShippingSetting = require("../../models/shippingSetting.model");


module.exports.index = async (req, res) => {
  try {

    const settings = await SettingGeneral.findOne().lean();
    const shippingFee = await ShippingSetting.findOne().lean();
    settings.shippingFee = shippingFee.freeThreshold;
    res.json({
      code: 200,
      message: "Setting General",
      settings: settings
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}