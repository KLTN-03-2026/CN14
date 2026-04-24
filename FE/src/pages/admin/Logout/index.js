import { useNavigate } from "react-router-dom";
import { deleteCookie } from "../../../helpers/cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../../actions/login";


function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    deleteCookie("token");
    dispatch(logout());
    localStorage.removeItem('permissions');
    navigate("/auth/login");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>

    </>
  )
}

export default Logout;