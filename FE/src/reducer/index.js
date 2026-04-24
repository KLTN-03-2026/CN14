import {combineReducers} from "redux";
import { loginReducers } from "./login";
import { loginUserReducers } from "./loginUser";
import { cartReducer } from "./cart";


const allReducers = combineReducers({
  auth: loginReducers,
  loginUserReducers,
  cartReducer
});

export default allReducers;