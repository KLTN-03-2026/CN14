const express = require("express");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser"); // lấy dữ liệu từ body gửi lên
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(bodyParser.json()); // dùng để patch json lên 

app.use(cors());

app.use(cookieParser());

const route = require("./api/v1/routes/admin/index.route");
const routeClient = require("./api/v1/routes/client/index.route");

route(app);
routeClient(app);

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
});