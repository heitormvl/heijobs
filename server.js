const express = require("express");
const sql = require("mssql");
const path = require("path");

const app = express();

// Middleware para parsing do corpo da requisição
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Adiciona cabeçalhos CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Rota POST para inserção dos dados
app.post("/submit", async (req, res) => {
  const { nome, cpf, nascimento, curso, experiencias } = req.body;
  const connectionString =
    "Server=tcp:budgetbuddyv2-webapp-server.database.windows.net,1433;Initial Catalog=heikedin;Persist Security Info=False;User ID=budgetbuddyv2-webapp-server-admin;Password=iN#EuXKa@0bOLB8q4NJ@SGE@#r^w1NJm;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";

  try {
    const pool = await sql.connect(connectionString);
    await pool
      .request()
      .input("nome", sql.NVarChar, nome)
      .input("cpf", sql.VarChar, cpf)
      .input("nascimento", sql.Date, nascimento)
      .input("curso", sql.NVarChar, curso)
      .input("experiencias", sql.NVarChar, experiencias)
      .query(`INSERT INTO candidatos (nome, cpf, nascimento, curso, experiencias)
              VALUES (@nome, @cpf, @nascimento, @curso, @experiencias)`);

    res.send("Dados inseridos com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao inserir dados");
  }
});

// Serve arquivos estáticos (index.html, etc.) depois das rotas de API
app.use(express.static(__dirname));

// Rota para servir o index.html na raiz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(5500, () => {
  console.log("Servidor rodando na porta 5500");
});
