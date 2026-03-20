const express = require('express'); // هذا السطر كان ناقص
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors'); 
const nodemailer = require('nodemailer'); 
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// 1. الاتصال بقاعدة البيانات
const dbURI = "mongodb://baqerabd25031_db_user:eVC61tJdL5fNvfhF@ac-33chwos-shard-00-00.rcjeshr.mongodb.net:27017,ac-33chwos-shard-00-01.rcjeshr.mongodb.net:27017,ac-33chwos-shard-00-02.rcjeshr.mongodb.net:27017/?ssl=true&replicaSet=atlas-tfvav7-shard-0&authSource=admin&appName=Cluster0"; 

mongoose.connect(dbURI)
  .then(() => console.log("✅ DB CONNECTED (MongoDB Atlas)"))
  .catch(err => console.log("❌ DB ERROR:", err.message));

// --- موديلات البيانات (Schemas) ---

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

// 2. إعدادات الإيميل
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'baqer.abd25031@coai.uobaghdad.edu.iq',
        pass: 'Lulh ocoy nobt levw' 
    }
});

// ------------------------------------------------------------
// 3. الأبواب (Endpoints)
// ------------------------------------------------------------

// أ- باب الشات (البحث + تسجيل السؤال)
app.post('/api/chat', async (req, res) => {
    try {
        const userQuery = req.body.text; 
        const cleanQuery = userQuery.toLowerCase();

        let result = await ChatData.findOne({ 
            patterns: { $in: [new RegExp(cleanQuery, 'i')] } 
        });

        if (!result) {
            result = await ChatData.findOne({
                patterns: { $regex: cleanQuery, $options: 'i' }
            });
        }

        const logEntry = new UserQueryLog({
            query: userQuery,
            hasAnswer: result ? true : false
        });
        await logEntry.save();

        if (result) {
            res.json({ answer: result.response });
        } else {
            res.json({ answer: null });
        }
    } catch (error) {
        res.status(500).json({ answer: "حدث خطأ في السيرفر." });
    }
});

// ب- باب استمارة الاتصال (Contact Form)
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

// ------------------------------------------------------------
// ج- أبواب لوحة التحكم (Admin Endpoints) 🛠️
// ------------------------------------------------------------

// 1. جلب سجل المحادثات
app.get('/api/admin/logs', async (req, res) => {
    try {
        const logs = await UserQueryLog.find().sort({ timestamp: -1 }).limit(50);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: "فشل جلب السجلات" });
    }
});

// 2. جلب رسائل طلبات التواصل (الخطوة اللي ضفناها هسة 🚀)
app.get('/api/admin/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ date: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "فشل جلب الرسائل" });
    }
});

// 3. إضافة سؤال وجواب جديد للداتابيس
app.post('/api/admin/add-data', async (req, res) => {
    try {
        const { tag, patterns, response } = req.body;
        const newData = new ChatData({ tag, patterns, response });
        await newData.save();
        res.json({ message: "✅ تمت إضافة البيانات بنجاح!" });
    } catch (err) {
        res.status(500).json({ error: "فشل الإضافة" });
    }
});

// 4. مسح السجلات
app.delete('/api/admin/clear-logs', async (req, res) => {
    try {
        await UserQueryLog.deleteMany({});
        res.json({ message: "🗑️ تم تنظيف السجل بالكامل" });
    } catch (err) {
        res.status(500).json({ error: "فشل المسح" });
    }
});
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.listen(port, () => {
    console.log(`🚀 Ruwaad Server is LIVE on port: ${port}`);
});