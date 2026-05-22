const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/home", (req, res) => {
  // اگر می‌خواهید چیزی را چک کنید، فقط بخش‌های مهم را لاگ کنید
  console.log("درخواست دریافت شد!");

  // حتماً باید یک پاسخ بفرستید
  res.json({ message: "پاسخ از سمت سرور با موفقیت دریافت شد" });
});

app.listen(3000, () => {
  console.log("running on port 3000");
});
