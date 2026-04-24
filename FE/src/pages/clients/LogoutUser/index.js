import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteCookie } from "../../../helpers/cookie";
import { checkLoginUser } from "../../../actions/loginUser";
import { message } from "antd";
import { getFavorites, removeAllFavorite } from "../../../helpers/favorites";
import { updateCartLength } from "../../../actions/cart";


function LogoutUser() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    deleteCookie("tokenUser");
    deleteCookie("email");
    deleteCookie("fullName");
    deleteCookie("avatar");
    deleteCookie("userId");
    dispatch(checkLoginUser(false));
    removeAllFavorite();
    dispatch(updateCartLength(0));
    message.success("Đăng xuất thành công")
    navigate("/login");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>

    </>
  )
}

export default LogoutUser;