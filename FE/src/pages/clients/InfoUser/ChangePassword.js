import { useEffect, useState } from "react";
import {
  infoGet,
  resetPasswordPatch,
  setPasswordPatch,
} from "../../../services/client/userServies";
import { getCookie } from "../../../helpers/cookie";
import {
  Button,
  Card,
  Form,
  Input,
  message,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
} from "@ant-design/icons";
import "./InfoUser.scss";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const tokenUser = getCookie("tokenUser");
  const [formChangePassword] = Form.useForm();

  const navigate = useNavigate();

  const [isAuthAccount, setIsAuthAccount] = useState(true);

  const fetchApi = async () => {
    try {
      const response = await infoGet(tokenUser);
      if (response.code === 200) {
        const userData = response.data;
        setIsAuthAccount(userData.isAuthAccount);

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
      await fetchApi(); // sau đó mới chạy logic parse địa chỉ
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangePassword = async (e) => {
    if (isAuthAccount) {
      try {
        const resChangePassword = await resetPasswordPatch(e, tokenUser);
        if (resChangePassword.code === 200) {
          navigate("/logout");
        } else {
          if (Array.isArray(resChangePassword.message)) {
            const allErrors = resChangePassword.message
              .map((err) => err.message)
              .join("\n");
            message.error(allErrors);
          } else {
            message.error(resChangePassword.message);
          }
        }
      } catch (error) {
        message.error(error.message);
      }
    } else {
      try {
        const resSetPassword = await setPasswordPatch(e, tokenUser);
        if (resSetPassword.code === 200) {
          navigate("/logout");
        } else {
          if (Array.isArray(resSetPassword.message)) {
            const allErrors = resSetPassword.message
              .map((err) => err.message)
              .join("\n");
            message.error(allErrors);
          } else {
            message.error(resSetPassword.message);
          }
        }
      } catch (error) {
        message.error(error.message);
      }
    }
  };

  return (
    <>
      <div className="card-info__info">
        <Card title="Thay đổi mật khẩu">
          <Form
            onFinish={handleChangePassword}
            layout="horizontal"
            form={formChangePassword}
            labelCol={{
              span: 6,
            }}
          >
            {isAuthAccount ? (
              <>
                <Form.Item
                  name="passwordOld"
                  label={
                    <span className="font-medium text-gray-700">
                      Mật khẩu cũ
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu" },
                    {
                      min: 8,
                      message:
                        "Mật khẩu phải 8-20 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Nhập mật khẩu cũ của bạn"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    className="!rounded-lg !border-gray-300 hover:!border-blue-400 focus:!border-blue-500"
                    style={{
                      padding: "12px 16px",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="passwordNew"
                  label={
                    <span className="font-medium text-gray-700">
                      Mật khẩu mới
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu" },
                    {
                      min: 8,
                      message:
                        "Mật khẩu phải 8-20 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Nhập mật khẩu của bạn"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    className="!rounded-lg !border-gray-300 hover:!border-blue-400 focus:!border-blue-500"
                    style={{
                      padding: "12px 16px",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="passwordNewComfirm"
                  label={
                    <span className="font-medium text-gray-700">
                      Xác nhận mật khẩu
                    </span>
                  }
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng xác nhận mật khẩu",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("passwordNew") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu không khớp")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Xác nhận mật khẩu của bạn"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    className="!rounded-lg !border-gray-300 hover:!border-blue-400 focus:!border-blue-500"
                    style={{
                      padding: "12px 16px",
                    }}
                  />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  name="password"
                  label={
                    <span className="font-medium text-gray-700">
                      Mật khẩu
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu" },
                    {
                      min: 8,
                      message:
                        "Mật khẩu phải 8-20 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Nhập mật khẩu của bạn"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    className="!rounded-lg !border-gray-300 hover:!border-blue-400 focus:!border-blue-500"
                    style={{
                      padding: "12px 16px",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label={
                    <span className="font-medium text-gray-700">
                      Xác nhận mật khẩu
                    </span>
                  }
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng xác nhận mật khẩu",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu không khớp")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Xác nhận mật khẩu của bạn"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    className="!rounded-lg !border-gray-300 hover:!border-blue-400 focus:!border-blue-500"
                    style={{
                      padding: "12px 16px",
                    }}
                  />
                </Form.Item>
              </>
            )}
            <Form.Item>
              <Button type="primary" htmlType="submit" name="btn">
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default ChangePassword;
