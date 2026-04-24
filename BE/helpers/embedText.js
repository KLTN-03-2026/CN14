const axios = require("axios");

const EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"; // model 384D, miễn phí
const HF_API_KEY = process.env.HF_API_KEY;

exports.embedText = async (text) => {
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${EMBED_MODEL}`,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );


    // API trả về mảng 2D [ [vector...] ]
    const data = response.data;
    const embedding = Array.isArray(data[0]) ? data[0] : data;

    console.log("✅ Vector chiều:", embedding.length);
    return embedding;
  } catch (err) {
    console.error("❌ Lỗi tạo embedding:", err.response?.data || err.message);
    return null;
  }
};
