import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkLogin, logout } from '../../actions/login';
import { getCookie } from "../../helpers/cookie";

function PrivateRoutes() {
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);
  const isLogin = useSelector((state) => state.auth.isLogin);

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      dispatch(checkLogin(token));
    } else {
      dispatch(logout());
    }

    setIsChecking(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  if (isChecking) {
    return <div>Loading...</div>; // Hiển thị loading trong khi đang kiểm tra token
  }

  return isLogin ? <Outlet /> : <Navigate to="/auth/login" />;
}

export default PrivateRoutes;