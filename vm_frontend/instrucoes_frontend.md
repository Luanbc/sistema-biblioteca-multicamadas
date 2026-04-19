# Instruções da VM 3 - Cliente (Frontend)

Esta é a interface que o usuário final utilizará. Ela vai se conectar na nossa VM do Backend.

## 1. Instalação
O Frontend foi feito em HTML, CSS e JavaScript puro para ser muito rápido.
No Ubuntu Desktop (VM 3), você só precisa de um servidor HTTP simples.
Abra o terminal e instale o python (caso não tenha):
```bash
sudo apt update
sudo apt install python3 -y
```

## 2. Preparando os Arquivos
1. Crie uma pasta para o projeto e entre nela:
```bash
mkdir biblioteca-app
cd biblioteca-app
```
2. Crie ou copie os 3 arquivos que estão na pasta `vm_frontend` para cá: `index.html`, `style.css` e `app.js`.

## 3. Configurando a Conexão com o Backend (IMPORTANTE!)
O frontend precisa saber onde o Backend está rodando.
Abra o arquivo `app.js` e altere a PRIMEIRA LINHA do código:
```javascript
const API_URL = 'http://IP_DA_VM2_BACKEND:3000/livros';
```
*Substitua `IP_DA_VM2_BACKEND` pelo IP que você anotou da sua VM 2.*

## 4. Rodando o Site
Ainda dentro da pasta `biblioteca-app`, rode o comando para criar um servidor local:
```bash
python3 -m http.server 8000
```
Isso vai rodar o seu site!
Abra o navegador (Firefox ou Chrome) dentro dessa sua VM 3 e acesse:
`http://localhost:8000`

Se a conexão estiver correta, você verá o site bonito e os livros que inserimos no banco de dados da VM 1! Você poderá adicionar, deletar e editar.
