import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
app.use(express.json());

const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE_URL;
const USER_SERVICE = process.env.USER_SERVICE_URL;
const ORDER_SERVICE = process.env.ORDER_SERVICE_URL;



app.use("/products", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${PRODUCT_SERVICE}${req.url}`,
      data: req.body
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || err.message);
  }
});


app.use("/auth", async (req, res) => {
  try {
    console.log(`Forwarding ${req.method} request to ${USER_SERVICE}${req.url}`);
    const response = await axios({
      method: req.method,
      url: `${USER_SERVICE}${req.url}`,
      data: req.body
    });
    res.json(response.data);
  } catch (err) {
    console.error("Error forwarding auth request:", err.message);
    res.status(err.response?.status || 500).json(err.response?.data || err.message);
  }
});


app.use("/orders", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${ORDER_SERVICE}${req.url}`,
      data: req.body
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
