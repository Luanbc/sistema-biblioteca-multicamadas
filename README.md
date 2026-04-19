# Sistema Integrado de Gestão de Biblioteca (Multicamadas)

Este repositório contém o código-fonte e as instruções de configuração para o sistema de biblioteca, dividido em três camadas (Máquinas Virtuais).

Abaixo estão as instruções de instalação para cada uma das máquinas. Certifique-se de configurar a rede das VMs em modo Bridge e anotar os IPs de cada uma.

---

## 🖥️ VM 1 - Banco de Dados (PostgreSQL)

Nesta VM, iremos instalar o banco de dados e configurá-lo para aceitar conexões remotas (vindas da VM do Backend).

### 1. Instalação
No terminal do Ubuntu (VM 1), execute os seguintes comandos:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y
```

### 2. Configurando o Banco e o Usuário
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
Agora que está conectado na base `biblioteca`, vamos criar a tabela. Copie e cole o código que está no arquivo `vm_banco/setup.sql` (ou digite):
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

### 3. Liberando o Acesso Externo (IMPORTANTE!)
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

---

## ⚙️ VM 2 - Backend (Web Service)

Nesta VM ficará nossa API que conectará ao banco e enviará os dados para o Frontend.

### 1. Instalação do Node.js
No terminal do Ubuntu (VM 2), atualize os pacotes e instale o Node.js:
```bash
sudo apt update
sudo apt install nodejs npm -y
```

### 2. Preparando os Arquivos
1. Crie uma pasta para o projeto e entre nela:
```bash
mkdir biblioteca-api
cd biblioteca-api
```

2. Crie os arquivos `package.json` e `server.js` exatamente como estão disponibilizados para você na pasta `vm_backend`.
Você pode usar o comando `nano server.js` e colar o código lá dentro.

### 3. Instalando as Dependências
Com os arquivos criados dentro da pasta `biblioteca-api`, rode o comando:
```bash
npm install
```
Isso instalará os pacotes: express, cors, pg (postgres) e os pacotes do swagger (documentação).

### 4. Configurando a Conexão com a VM 1 (BANCO)
Abra o arquivo `server.js` (`nano server.js`) e procure pela configuração do Pool do Postgres (lá em cima). 
Você deve **MUDAR O IP DO HOST** para colocar o **IP da sua VM 1**.
Exemplo:
```javascript
const pool = new Pool({
  user: 'admin_biblio',
  host: 'COLOQUE_AQUI_O_IP_DA_VM1_BANCO', // <--- ALTERAR ISSO AQUI
  database: 'biblioteca',
  password: 'senha123',
  port: 5432,
});
```
*Salve o arquivo e saia (Ctrl+O, Enter, Ctrl+X)*

### 5. Rodando o Servidor
Execute o servidor:
```bash
node server.js
```
Se tudo der certo, aparecerá a mensagem: `Servidor rodando na porta 3000` e `Conectado ao banco de dados PostgreSQL!`.

**Seu Web Service está pronto!**
Dica: você pode ver a documentação das rotas (Swagger) acessando no navegador de qualquer pc na rede: `http://IP_DESTA_VM2:3000/api-docs`.

**Anote o IP desta VM 2 e vá para a VM 3 (Frontend)!**

---

## 💻 VM 3 - Cliente (Frontend)

Esta é a interface que o usuário final utilizará. Ela vai se conectar na nossa VM do Backend.

### 1. Instalação
O Frontend foi feito em HTML, CSS e JavaScript puro para ser muito rápido.
No Ubuntu Desktop (VM 3), você só precisa de um servidor HTTP simples.
Abra o terminal e instale o python (caso não tenha):
```bash
sudo apt update
sudo apt install python3 -y
```

### 2. Preparando os Arquivos
1. Crie uma pasta para o projeto e entre nela:
```bash
mkdir biblioteca-app
cd biblioteca-app
```
2. Crie ou copie os 3 arquivos que estão na pasta `vm_frontend` para cá: `index.html`, `style.css` e `app.js`.

### 3. Configurando a Conexão com o Backend (IMPORTANTE!)
O frontend precisa saber onde o Backend está rodando.
Abra o arquivo `app.js` e altere a PRIMEIRA LINHA do código:
```javascript
const API_URL = 'http://IP_DA_VM2_BACKEND:3000/livros';
```
*Substitua `IP_DA_VM2_BACKEND` pelo IP que você anotou da sua VM 2.*

### 4. Rodando o Site
Ainda dentro da pasta `biblioteca-app`, rode o comando para criar um servidor local:
```bash
python3 -m http.server 8000
```
Isso vai rodar o seu site!
Abra o navegador (Firefox ou Chrome) dentro dessa sua VM 3 e acesse:
`http://localhost:8000`

Se a conexão estiver correta, você verá o site bonito e os livros que inserimos no banco de dados da VM 1! Você poderá adicionar, deletar e editar.
