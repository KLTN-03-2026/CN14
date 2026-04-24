import { useEffect, useState } from "react";
import {
  editInfoPatch,
  infoGet,
  sendEmailOTPAcount,
  verifyEmailOTPAccount,
} from "../../../services/client/userServies";
import { getCookie, setCookie } from "../../../helpers/cookie";
import { Button, Card, Col, Form, Input, message, Row, Select, } from "antd";
import { MailOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import "./InfoUser.scss";
import { useNavigate } from "react-router-dom";
import UploadFile from "../../../components/UploadFile";
const { Option } = Select;

function Info() {
  const tokenUser = getCookie("tokenUser");
  const navigate = useNavigate();

  const [infoUser, setInfoUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const [formInfo] = Form.useForm();

  const [avatar, setAvatar] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [loading, setLoading] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://provinces.open-api.vn/api/p/");
      const data = await response.json();
      setProvinces(data);
      return data; // ✅ return để dùng ngay
    } catch (error) {
      console.error("Error fetching provinces:", error);
      message.error("Không thể tải danh sách tỉnh/thành phố");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async (provinceCode) => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://provinces.open-api.vn/api/p/" + provinceCode + "?depth=2"
      );
      const data = await response.json();
      setDistricts(data.districts || []);
      setWards([]);
      formInfo.setFieldsValue({ district: undefined, ward: undefined });
      return data.districts || []; // ✅ return để dùng ngay
    } catch (error) {
      console.error("Error fetching districts:", error);
      message.error("Không thể tải danh sách quận/huyện");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchWards = async (districtCode) => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://provinces.open-api.vn/api/d/" + districtCode + "?depth=2"
      );
      const data = await response.json();
      setWards(data.wards || []);
      formInfo.setFieldsValue({ ward: undefined });
      return data.wards || []; // ✅ return để dùng ngay
    } catch (error) {
      console.error("Error fetching wards:", error);
      message.error("Không thể tải danh sách phường/xã");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchApi = async () => {
    try {
      const response = await infoGet(tokenUser);
      if (response.code === 200) {
        const userData = response.data;

        setInfoUser(userData);

        if (userData.address) {
          const parts = userData.address.split(",").map((p) => p.trim());

          // Luôn lấy 3 phần cuối cùng làm tỉnh, quận, phường
          const provinceName = parts[parts.length - 1];
          const districtName = parts[parts.length - 2];
          const wardName = parts[parts.length - 3];

          // Phần còn lại gộp lại thành địa chỉ chi tiết
          const addressDetail = parts.slice(0, parts.length - 3).join(", ");

          const normalize = (str) => str?.toLowerCase().normalize("NFC").trim();

          // ✅ dùng provinces đã fetch ở init
          const allProvinces = provinces.length
            ? provinces
            : await fetchProvinces();

          const province = allProvinces.find(
            (p) => normalize(p.name) === normalize(provinceName)
          );

          if (province) {
            const allDistricts = await fetchDistricts(province.code);
            const district = allDistricts.find(
              (d) => normalize(d.name) === normalize(districtName)
            );

            if (district) {
              const allWards = await fetchWards(district.code);
              const ward = allWards.find(
                (w) => normalize(w.name) === normalize(wardName)
              );

              formInfo.setFieldsValue({
                province: province.code,
                district: district?.code,
                ward: ward?.code,
                address: addressDetail,
                fullName: userData.fullName,
                phone: userData.phone,
                email: userData.email,
              });
              return;
            }
          }

          // fallback nếu không match
          formInfo.setFieldsValue(userData);
        } else {
          formInfo.setFieldsValue(userData);
        }
      } else if (response.code === 404) {
        navigate("/logout");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchProvinces(); // load tỉnh trước
      await fetchApi(); // sau đó mới chạy logic parse địa chỉ
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeInfo = async (e) => {
    // Tìm tên tương ứng từ code
    const provinceName = provinces.find((p) => p.code === e.province);
    const districtName = districts.find((d) => d.code === e.district);
    const wardName = wards.find((w) => w.code === e.ward);
    // Ghép lại thành địa chỉ đầy đủ
    const fullAddress =
      e.address +
      ", " +
      (wardName ? wardName.name : "") +
      ", " +
      (districtName ? districtName.name : "") +
      ", " +
      (provinceName ? provinceName.name : "");
    e.tokenUser = tokenUser;
    e.address = fullAddress;

    const info = {
      fullName: e.fullName,
      address: e.address,
      phone: e.phone,
      email: e.email,
      avatar: avatar,
    };

    try {
      const resChangeInfo = await editInfoPatch(info, tokenUser);
      if (resChangeInfo.code === 200) {
        setVerified(false);
        setOtpSent(false);
        setIsEdit(false);
        setCookie("fullName", e.fullName, 24);
        setCookie("email", e.email, 24);
        setCookie("avatar", avatar, 24);
        fetchApi();
        message.success(resChangeInfo.message);
      } else {
        if (Array.isArray(resChangeInfo.message)) {
          const allErrors = resChangeInfo.message
            .map((err) => err.message)
            .join("\n");
          message.error(allErrors);
        } else {
          message.error(resChangeInfo.message);
        }
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleEdit = () => {
    setIsEdit(!isEdit);
  };

  const handleProvinceChange = (value) => {
    fetchDistricts(value);
  };

  const handleDistrictChange = (value) => {
    fetchWards(value);
  };

  const filterOption = (input, option) => {
    if (option && option.children) {
      return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    return false;
  };

  const handleSendOTP = async () => {
    try {
      const email = formInfo.getFieldValue("email");
      if (!email) return message.warning("Vui lòng nhập email trước!");
      const response = await sendEmailOTPAcount(email, tokenUser);
      if (response.code === 200) {
        message.success(`${response.message}`);
        setOtpSent(true);
      } else {
        message.error(response.message || "Gửi mã OTP thất bại!");
      }
    } catch (err) {
      console.log(err.message);

      message.error(err.response?.message || "Gửi mã OTP thất bại!");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const email = formInfo.getFieldValue("email");
      const otp = formInfo.getFieldValue("otp");

      if (!otp) return message.warning("Vui lòng nhập mã xác thực!");
      const res = await verifyEmailOTPAccount(email, otp, tokenUser);
      if (res.code === 200) {
        message.success("Xác thực email thành công!");
        setVerified(true);
      } else {
        message.error(res.message || "Mã xác thực không hợp lệ!");
      }
    } catch (err) {
      message.error(err.response?.message || "Xác thực thất bại!");
    }
  };

  return (
    <>
      <div className="card-info__info">
        <Card
          title="Thông tin cá nhân"
          extra={
            isEdit ? (
              <Button onClick={handleEdit}>Hủy</Button>
            ) : (
              <Button onClick={handleEdit}>Chỉnh sửa</Button>
            )
          }
        >
          <Form
            onFinish={handleChangeInfo}
            layout="horizontal"
            form={formInfo}
            labelCol={{
              span: 4,
            }}
            style={{
              maxWidth: 600,
            }}
            disabled={!isEdit}
          >
            <Row>
              <Col span={24}>
                <Form.Item label="Ảnh đại diện" name="avatar">
                  <UploadFile
                    onImageUrlsChange={setAvatar}
                    initialImageUrls={infoUser.avatar}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Họ tên"
                  name="fullName"
                  rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                >
                  <Input style={{ width: "400px" }} />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số điện thoại!",
                    },
                  ]}
                >
                  <Input style={{ width: "400px" }} />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input
                    style={{ width: "400px" }}
                    prefix={<MailOutlined />}
                    placeholder="Xác thực Email để cập nhật thông tin"
                    disabled={verified}
                    suffix={
                      !otpSent ? (
                        <Button type="link" onClick={handleSendOTP}>
                          Gửi mã
                        </Button>
                      ) : verified ? (
                        <SafetyCertificateOutlined className="text-green-600" />
                      ) : (
                        <Button type="link" onClick={handleSendOTP}>
                          Gửi lại
                        </Button>
                      )
                    }
                  />
                </Form.Item>
              </Col>

              {/* Xac thuc otp  */}
              <Col span={24}>
                {otpSent && !verified && (
                  <Form.Item
                    name="otp"
                    label="Mã xác thực"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mã OTP",
                      },
                    ]}
                  >
                    <Input
                      style={{ width: "400px" }}
                      maxLength={6}
                      placeholder="Nhập mã 6 số"
                      suffix={
                        <Button type="link" onClick={handleVerifyOTP}>
                          Xác thực
                        </Button>
                      }
                    />
                  </Form.Item>
                )}
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Tỉnh/TP"
                  name="province"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn tỉnh/thành phố!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn tỉnh/thành phố"
                    size="small"
                    loading={loading}
                    onChange={handleProvinceChange}
                    showSearch
                    filterOption={filterOption}
                    style={{ width: "400px" }}
                  >
                    {provinces.map((province) => (
                      <Option key={province.code} value={province.code}>
                        {province.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Quận/Huyện"
                  name="district"
                  rules={[
                    { required: true, message: "Vui lòng chọn quận/huyện!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn quận/huyện"
                    size="small"
                    loading={loading}
                    onChange={handleDistrictChange}
                    disabled={districts.length === 0}
                    showSearch
                    filterOption={filterOption}
                    style={{ width: "400px" }}
                  >
                    {districts.map((district) => (
                      <Option key={district.code} value={district.code}>
                        {district.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Phường/Xã"
                  name="ward"
                  rules={[
                    { required: true, message: "Vui lòng chọn phường/xã!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn phường/xã"
                    size="small"
                    loading={loading}
                    disabled={wards.length === 0}
                    showSearch
                    filterOption={filterOption}
                    style={{ width: "400px" }}
                  >
                    {wards.map((ward) => (
                      <Option key={ward.code} value={ward.code}>
                        {ward.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Địa chỉ cụ thể"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập địa chỉ cụ thể!",
                    },
                  ]}
                >
                  <Input style={{ width: "400px" }} />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item>
                  {isEdit ? (
                    <Button
                      type="primary"
                      htmlType="submit"
                      name="btn"
                      loading={loading}
                      block
                      disabled={!verified}
                    >
                      Cập nhập
                    </Button>
                  ) : (
                    <></>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default Info;