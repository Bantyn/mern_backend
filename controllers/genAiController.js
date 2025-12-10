// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const express = require("express");
// const genAI = new GoogleGenerativeAI({process.env.GOOGLE_API_KEY});
// exports.chatBot = async (req, res) => {
//     try {
//         const { message } = req.body;
//         const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//         const result = await model.generateContent(message); 
//         const formattedReply = {
//             sender: "bot",          
//             text: result.response.text(),             
//             timestamp: new Date(),  
//             type: "text",           
//         };
//         res.json({ reply: formattedReply });
//         res.json({ reply });
//     } catch (error) {
//         console.error("Error in chatBot:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };

import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";
// const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
const client = new Groq({ apiKey: "REMOVEDOVg7m4KdHxe8uXP3ySJnWGdyb3FYuasddm1veynFdpLvYSbUCsCc" });

export const chatBot = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: message }],
    });

    res.json({
      reply: {
        sender: "bot",
        text: response.choices[0].message.content,
        timestamp: new Date(),
        type: "text",
      }
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};
