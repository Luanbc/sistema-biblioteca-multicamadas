# Roteiro de Apresentação (Apoio)

Use este roteiro como guia na hora de apresentar o trabalho para a sua turma e o professor. Você pode imprimir ou deixar no celular.

## 1. Introdução (Apresentando a Solução)
*   **"Bom dia/boa noite a todos. Nosso desafio era criar um Web Service para uma biblioteca escolar."**
*   Diga que o sistema permite o cadastro completo do livro (título, autor, ano, editora, localização e edição).
*   Mostre a tela do Frontend funcionando, adicione um livro como teste ao vivo para mostrar que funciona.

## 2. Arquitetura (Ganhando os 40% da avaliação)
*   **"O grande diferencial do trabalho é a arquitetura que usamos. Separamos o sistema fisicamente em 3 Máquinas Virtuais no VirtualBox."**
*   Explique rapidamente o que cada VM faz:
    *   **VM 1:** Fica o banco de dados PostgreSQL. Ninguém acessa ela direto pela internet por segurança.
    *   **VM 2:** Fica a API (Backend) em Node.js. É a ponte que valida as coisas.
    *   **VM 3:** Fica a interface que acabamos de mostrar.
*   *Dica Técnica:* Fale que você configurou as placas de rede do VirtualBox no modo "Bridge", o que permitiu que cada máquina ganhasse um IP real na sua rede local para elas se comunicarem via TCP/IP.

## 3. Respondendo as Perguntas
*   **A questão do GIT:** "Sobre como a equipe vai trabalhar junto, sugerimos o uso de **Conventional Commits**. Ao invés de fazer commits bagunçados, a gente usa tags como 'feat:' pra nova funcionalidade e 'fix:' pra correção de bugs. Isso deixa o histórico limpo e o pessoal do front e back consegue saber o que o colega alterou só batendo o olho no repositório."
*   **A questão da API:** "Para as equipes consumirem a API de forma fácil, nós implementamos o **Swagger**. O Node.js lê o próprio código do nosso servidor e gera um site automático com o manual de como o frontend deve se conectar. Eu vou mostrar pra vocês..." *(Nessa hora, abra no navegador a rota do seu backend tipo `http://[IP_DA_VM2]:3000/api-docs` para o professor ver a tela do Swagger).*

## 4. Conclusão
*   Finalize dizendo que essa arquitetura dividida (microsserviços/camadas) permite que se a biblioteca crescer, eles podem colocar mais memória só na VM do banco de dados, sem precisar mexer no Frontend. É mais escalável.
*   Agradeça a atenção.
