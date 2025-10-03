const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const destinatarioRoutes = require("./routes/destinatarios");
const zohoRoutes = require("./services/zoho");
const notaRoutes = require('./routes/notas')
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Conectado ao MongoDB Atlas"))
.catch(err => console.error("❌ Erro MongoDB:", err));

// Rotas
app.use("/destinatarios", destinatarioRoutes);
app.use("/zoho", zohoRoutes);
app.use("/nota", notaRoutes)

// Teste básico
app.get("/", (req, res) => res.send("API de Destinatários funcionando ✅"));

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));