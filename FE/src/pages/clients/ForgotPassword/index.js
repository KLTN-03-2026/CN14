import { useState } from "react"
import { Card, Button, Input, Alert, Steps, message } from "antd"
import {
  MailOutlined,
  SafetyOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ArrowLeftOutlined,
} from "@ant-design/icons"
import { forgotPasswordPost, optPasswordPost, resetPasswordPost } from "../../../services/client/userServies"
import { getCookie, setCookie } from "../../../helpers/cookie";
import { checkLoginUser } from "../../../actions/loginUser";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const { Step } = Steps

export default function ForgotPassword() {
  const [currentStep, setCurrentStep] = useState(0)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tokenUser = getCookie("tokenUser");

  useEffect(() => {

    if (tokenUser) {
      navigate("/");
    }

  }, [])

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError("Vui lòng nhập địa chỉ email")
      return
    }

    try {
      setLoading(true);

      const response = await forgotPasswordPost({ email: email });
      if (response.code === 200) {
        message.success(response.message);
        setCookie("email", email, 1);
        setCurrentStep(1);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) {
      setError("Vui lòng nhập mã OTP 6 số")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await optPasswordPost(email, { otp: otp });
      if (response.code === 200) {
        // message.success(response.message);
        setCookie("tokenUser", response.tokenUser, 24);
        setCurrentStep(2);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false);
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    if (newPassword.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự")
      return
    }
    setError("")
    try {
      setLoading(true);

      const option = {
        password: newPassword,
        comfirmPassword: confirmPassword
      };

      const response = await resetPasswordPost(option, tokenUser);
      if (response.code === 200) {
        message.success(response.message);
        setCookie("email", email, 1);
        setCookie("tokenUser", tokenUser, 24);
        dispatch(checkLoginUser(true));
        setCurrentStep(0)
        setEmail("")
        setOtp("")
        setNewPassword("")
        setConfirmPassword("")
        navigate(`/`);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const goBack = () => {
    setError("")
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const steps = [
    {
      title: "Nhập Email",
      icon: <MailOutlined />,
    },
    {
      title: "Xác thực OTP",
      icon: <SafetyOutlined />,
    },
    {
      title: "Đặt mật khẩu mới",
      icon: <LockOutlined />,
    },
  ]

  const getStepTitle = (step) => {
    switch (step) {
      case 0:
        return "Đặt lại mật khẩu"
      case 1:
        return "Xác thực OTP"
      case 2:
        return "Tạo mật khẩu mới"
      default:
        return ""
    }
  }

  const getStepDescription = (step) => {
    switch (step) {
      case 0:
        return "Nhập địa chỉ email để nhận mã xác thực"
      case 1:
        return `Nhập mã OTP đã được gửi đến ${email}`
      case 2:
        return "Tạo mật khẩu mới cho tài khoản của bạn"
      default:
        return ""
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <Steps current={currentStep} size="small" className="px-4">
          {steps.map((item, index) => (
            <Step key={index} title={item.title} icon={item.icon} />
          ))}
        </Steps>
      </div>

      <Card className="shadow-lg border-0 bg-white rounded-lg">
        <div className="text-center pb-4">
          <div className="flex items-center justify-center mb-4 relative">
            {currentStep > 0 && (
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={goBack}
                className="absolute left-0 top-0"
                size="small"
              />
            )}
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600">
              {steps[currentStep].icon}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{getStepTitle(currentStep)}</h2>
          <p className="text-gray-600">{getStepDescription(currentStep)}</p>
        </div>

        <div className="space-y-6">
          {error && <Alert message={error} type="error" showIcon className="mb-4" />}

          {/* Step 1: Email Input */}
          {currentStep === 0 && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">Địa chỉ email</label>
                <Input
                  type="email"
                  placeholder="Nhập địa chỉ email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  prefix={<MailOutlined className="text-gray-400" />}
                  required
                />
              </div>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 bg-green-600 hover:bg-green-700 border-green-600 font-medium"
                loading={loading}
              >
                {loading ? "Đang gửi..." : "Gửi mã OTP"}
              </Button>
            </form>
          )}

          {/* Step 2: OTP Input */}
          {currentStep === 1 && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">Mã OTP</label>
                <Input
                  type="text"
                  placeholder="Nhập mã OTP 6 số"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="h-12 text-center text-lg tracking-widest"
                  maxLength={6}
                  prefix={<SafetyOutlined className="text-gray-400" />}
                  required
                />
              </div>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 bg-green-600 hover:bg-green-700 border-green-600 font-medium"
                loading={loading}
              >
                {loading ? "Đang xác thực..." : "Xác thực OTP"}
              </Button>
            </form>
          )}

          {/* Step 3: New Password */}
          {currentStep === 2 && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">Mật khẩu mới</label>
                <Input.Password
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-12"
                  prefix={<LockOutlined className="text-gray-400" />}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">Xác nhận mật khẩu</label>
                <Input.Password
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12"
                  prefix={<LockOutlined className="text-gray-400" />}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  required
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2 font-medium">Mật khẩu mạnh nên có:</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Ít nhất 8 ký tự</li>
                  <li>• Kết hợp chữ hoa và chữ thường</li>
                  <li>• Có số và ký tự đặc biệt</li>
                </ul>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 bg-green-600 hover:bg-green-700 border-green-600 font-medium"
                loading={loading}
              >
                {loading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
              </Button>
            </form>
          )}

          {/* Back to Login Link */}
          <div className="text-center pt-4">
            <a href="/login">
              <Button type="link" className="text-gray-500 hover:text-green-600">
                Quay lại đăng nhập
              </Button>
            </a>
          </div>
        </div>
      </Card>
    </div>
  )
}
