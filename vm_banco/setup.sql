-- Script para criação da base de dados e tabela
-- Rodar este script logado no psql na base 'biblioteca'

CREATE TABLE livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    ano INTEGER,
    editora VARCHAR(200),
    localizacao VARCHAR(100),
    edicao VARCHAR(50)
);

-- Inserindo alguns livros para teste inicial
INSERT INTO livros (titulo, autor, ano, editora, localizacao, edicao) VALUES
('O Senhor dos Anéis', 'J.R.R. Tolkien', 1954, 'HarperCollins', 'Corredor A - Prateleira 2', '1ª Edição'),
('1984', 'George Orwell', 1949, 'Companhia das Letras', 'Corredor B - Prateleira 1', 'Edição Especial'),
('Dom Quixote', 'Miguel de Cervantes', 1605, 'Nova Fronteira', 'Corredor C - Prateleira 5', 'Edição Clássica');
