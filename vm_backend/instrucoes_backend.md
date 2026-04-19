# Instruções da VM 2 - Backend (Web Service)

Nesta VM ficará nossa API que conectará ao banco e enviará os dados para o Frontend.

## 1. Instalação do Node.js
No terminal do Ubuntu (VM 2), atualize os pacotes e instale o Node.js:
```bash
sudo apt update
sudo apt install nodejs npm -y
```

## 2. Preparando os Arquivos
1. Crie uma pasta para o projeto e entre nela:
```bash
mkdir biblioteca-api
cd biblioteca-api
```

2. Crie os arquivos `package.json` e `server.js` exatamente como estão disponibilizados para você na pasta `vm_backend`.
Você pode usar o comando `nano server.js` e colar o código lá dentro.

## 3. Instalando as Dependências
Com os arquivos criados dentro da pasta `biblioteca-api`, rode o comando:
```bash
npm install
```
Isso instalará os pacotes: express, cors, pg (postgres) e os pacotes do swagger (documentação).

## 4. Configurando a Conexão com a VM 1 (BANCO)
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

## 5. Rodando o Servidor
Execute o servidor:
```bash
node server.js
```
Se tudo der certo, aparecerá a mensagem: `Servidor rodando na porta 3000` e `Conectado ao banco de dados PostgreSQL!`.

**Seu Web Service está pronto!**
Dica: você pode ver a documentação das rotas (Swagger) acessando no navegador de qualquer pc na rede: `http://IP_DESTA_VM2:3000/api-docs`.

**Anote o IP desta VM 2 e vá para a VM 3 (Frontend)!**
