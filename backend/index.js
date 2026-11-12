const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quiz");
const productsRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const ordersRoutes = require("./routes/orders");
const faceScanRoutes = require("./routes/faceScan");
const servicesRoutes = require("./routes/services");
const appointmentsRoutes = require("./routes/appointments");
const categoriesRoutes = require("./routes/categories");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/payments", require("./routes/payments"));

app.use("/api/face-scan", faceScanRoutes);
app.get("/", (req, res) => {
  res.json({ message: "SkinCaring API is working!" });
});

app.listen(PORT, () => {
  console.log(`Server is on http://localhost:${PORT}`);
});
