const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());

app.listen(port, () => {
  console.log(`서버는 ${port} Port에서 정상작동 중입니다`);
});
