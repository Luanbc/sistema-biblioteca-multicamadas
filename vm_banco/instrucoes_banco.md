# Instruções da VM 1 - Banco de Dados (PostgreSQL)

Nesta VM, iremos instalar o banco de dados e configurá-lo para aceitar conexões remotas (vindas da VM do Backend).

## 1. Instalação
No terminal do Ubuntu (VM 1), execute os seguintes comandos:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y
```

## 2. Configurando o Banco e o Usuário
Vamos entrar no console do PostgreSQL e criar nosso banco e nosso usuário:
```bash
sudo -u postgres psql
```

Dentro do console do banco (você verá `postgres=#`), digite exatamente isso:
```sql
CREATE DATABASE biblioteca;
CREATE USER admin_biblio WITH ENCRYPTED PASSWORD 'senha123';
GRANT ALL PRIVILEGES ON DATABASE biblioteca TO admin_biblio;
\c biblioteca
```
Agora que está conectado na base `biblioteca`, vamos criar a tabela. Copie e cole o código que está no arquivo `setup.sql` (ou digite):
```sql
CREATE TABLE livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    ano INTEGER,
    editora VARCHAR(200),
    localizacao VARCHAR(100),
    edicao VARCHAR(50)
);
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_biblio;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin_biblio;
\q
```

## 3. Liberando o Acesso Externo (IMPORTANTE!)
Por padrão, o Postgres só aceita conexão local. Precisamos mudar isso.

**1. Edite o arquivo postgresql.conf:**
```bash
sudo nano /etc/postgresql/*/main/postgresql.conf
```
Encontre a linha `#listen_addresses = 'localhost'` e altere para (tire o `#`):
```text
listen_addresses = '*'
```
*Salve e saia (Ctrl+O, Enter, Ctrl+X)*

**2. Edite o arquivo pg_hba.conf:**
```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```
Vá até o final do arquivo e adicione esta linha para permitir que qualquer IP na sua rede se conecte usando senha:
```text
host    all             all             0.0.0.0/0               md5
```
*Salve e saia (Ctrl+O, Enter, Ctrl+X)*

**3. Reinicie o serviço:**
```bash
sudo systemctl restart postgresql
```

PRONTO! O Banco de Dados está rodando e aceitando conexões. 
**Anote o IP desta VM e vá configurar a VM 2 (Backend)!**
