const express = require('express'); 
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors'); 
const nodemailer = require('nodemailer'); 
const app = express();

// إعدادات الكورس والجيسون
app.use(cors());
app.use(express.json());

// 1. الاتصال بقاعدة البيانات
const dbURI = "mongodb://baqerabd25031_db_user:eVC61tJdL5fNvfhF@ac-33chwos-shard-00-00.rcjeshr.mongodb.net:27017,ac-33chwos-shard-00-01.rcjeshr.mongodb.net:27017,ac-33chwos-shard-00-02.rcjeshr.mongodb.net:27017/?ssl=true&replicaSet=atlas-tfvav7-shard-0&authSource=admin&appName=Cluster0"; 

// تحسين بسيط للاتصال ليتناسب مع السيرفرليس
mongoose.connect(dbURI)
  .then(() => console.log("✅ DB CONNECTED"))
  .catch(err => console.log("❌ DB ERROR:", err.message));

// --- موديلات البيانات (كما هي بدون تغيير) ---
const Message = mongoose.model("Message", {
    name: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const ChatData = mongoose.model("ChatData", {
    tag: String,
    patterns: [String],
    response: String
}, "chat_knowledge");

const UserQueryLog = mongoose.model("UserQueryLog", {
    query: String,
    hasAnswer: Boolean,
    timestamp: { type: Date, default: Date.now }
}, "user_queries");

// 2. إعدادات الإيميل (كما هي)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'baqer.abd25031@coai.uobaghdad.edu.iq',
        pass: 'Lulh ocoy nobt levw' 
    }
});

// ------------------------------------------------------------
// 3. الأبواب (Endpoints) - حافظت على كل التفاصيل
// ------------------------------------------------------------

app.post('/api/chat', async (req, res) => {
    try {
        const userQuery = req.body.text; 
        const cleanQuery = userQuery.toLowerCase();
        let result = await ChatData.findOne({ patterns: { $in: [new RegExp(cleanQuery, 'i')] } });
        if (!result) {
            result = await ChatData.findOne({ patterns: { $regex: cleanQuery, $options: 'i' } });
        }
        const logEntry = new UserQueryLog({ query: userQuery, hasAnswer: !!result });
        await logEntry.save();
        res.json({ answer: result ? result.response : null });
    } catch (error) {
        res.status(500).json({ answer: "حدث خطأ في السيرفر." });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) return res.status(400).json({ message: "❌ تعبئة الحقول مطلوبة" });
        const newMessage = new Message({ name, email, message });
        await newMessage.save();
        const mailOptions = {
            from: 'baqer.abd25031@coai.uobaghdad.edu.iq',
            to: 'baqer.abd25031@coai.uobaghdad.edu.iq',
            subject: `🚀 طلب جديد: ${name}`,
            text: `الاسم: ${name}\nالإيميل: ${email}\nالرسالة: ${message}`
        };
        await transporter.sendMail(mailOptions);
        res.json({ message: "✅ تم الإرسال!" });
    } catch (error) {
        res.status(500).json({ message: "❌ خطأ بالسيرفر." });
    }
});

// --- أبواب لوحة التحكم (Admin) ---
app.get('/api/admin/logs', async (req, res) => {
    try {
        const logs = await UserQueryLog.find().sort({ timestamp: -1 }).limit(50);
        res.json(logs);
    } catch (err) { res.status(500).json({ error: "فشل جلب السجلات" }); }
});

app.get('/api/admin/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ date: -1 });
        res.json(messages);
    } catch (err) { res.status(500).json({ error: "فشل جلب الرسائل" }); }
});

app.post('/api/admin/add-data', async (req, res) => {
    try {
        const { tag, patterns, response } = req.body;
        const newData = new ChatData({ tag, patterns, response });
        await newData.save();
        res.json({ message: "✅ تمت إضافة البيانات بنجاح!" });
    } catch (err) { res.status(500).json({ error: "فشل الإضافة" }); }
});

app.delete('/api/admin/clear-logs', async (req, res) => {
    try {
        await UserQueryLog.deleteMany({});
        res.json({ message: "🗑️ تم تنظيف السجل بالكامل" });
    } catch (err) { res.status(500).json({ error: "فشل المسح" }); }
});

// --- التعديل الجوهري لـ Vercel ---
// بدل app.listen، نقوم بتصدير الـ app
module.exports = app;