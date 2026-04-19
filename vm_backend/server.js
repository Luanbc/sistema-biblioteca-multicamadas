const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// CONFIGURAÇÃO DO BANCO DE DADOS (PostgreSQL)
// ==========================================
// IMPORTANTE: Altere o 'host' abaixo para o IP da sua VM 1
const pool = new Pool({
  user: 'admin_biblio',
  host: 'IP_DA_VM1_AQUI', 
  database: 'biblioteca',
  password: 'senha123',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao conectar no banco de dados', err.stack);
  }
  console.log('✅ Conectado ao banco de dados PostgreSQL!');
  release();
});

// ==========================================
// CONFIGURAÇÃO DO SWAGGER (Documentação da API)
// ==========================================
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API da Biblioteca (Web Service)',
      version: '1.0.0',
      description: 'API Multicamadas para gestão de livros',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Servidor Local da VM 2'
      },
    ],
  },
  apis: ['./server.js'], // Lê as anotações neste mesmo arquivo
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==========================================
// ROTAS DA API (CRUD de Livros)
// ==========================================

/**
 * @swagger
 * components:
 *   schemas:
 *     Livro:
 *       type: object
 *       required:
 *         - titulo
 *         - autor
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogerado do livro
 *         titulo:
 *           type: string
 *         autor:
 *           type: string
 *         ano:
 *           type: integer
 *         editora:
 *           type: string
 *         localizacao:
 *           type: string
 *         edicao:
 *           type: string
 */

/**
 * @swagger
 * /livros:
 *   get:
 *     summary: Retorna a lista de todos os livros
 *     responses:
 *       200:
 *         description: Lista de livros.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Livro'
 */
app.get('/livros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM livros ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /livros:
 *   post:
 *     summary: Adiciona um novo livro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Livro'
 *     responses:
 *       201:
 *         description: Livro criado com sucesso.
 */
app.post('/livros', async (req, res) => {
  const { titulo, autor, ano, editora, localizacao, edicao } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO livros (titulo, autor, ano, editora, localizacao, edicao) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [titulo, autor, ano, editora, localizacao, edicao]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /livros/{id}:
 *   put:
 *     summary: Atualiza os dados de um livro existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Livro'
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso.
 */
app.put('/livros/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, autor, ano, editora, localizacao, edicao } = req.body;
  try {
    const result = await pool.query(
      'UPDATE livros SET titulo=$1, autor=$2, ano=$3, editora=$4, localizacao=$5, edicao=$6 WHERE id=$7 RETURNING *',
      [titulo, autor, ano, editora, localizacao, edicao, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Livro não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /livros/{id}:
 *   delete:
 *     summary: Remove um livro do banco de dados
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livro deletado com sucesso.
 */
app.delete('/livros/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM livros WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Livro não encontrado' });
    res.json({ message: 'Livro deletado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor backend rodando na porta ${port}`);
  console.log(`📄 Documentação da API (Swagger) disponível em: http://localhost:${port}/api-docs`);
});
