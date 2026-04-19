# Relatório: Estudo de Caso - Web Service de Biblioteca

**Projeto:** Sistema Integrado de Gestão de Biblioteca (Multicamadas)
**Disciplina:** Gestão de Conhecimento e Arquitetura Orientada a Serviços.

---

## 1. Fundamentação Teórica e Resolução do Problema

O desafio consistia em projetar um webservice para integração entre as camadas de uma aplicação de biblioteca, utilizando uma arquitetura multicamada com instâncias separadas (Máquinas Virtuais).

### 1.1 A Arquitetura Multicamadas (Multi-tier Architecture)
A arquitetura de software dividida em camadas lógicas e físicas tem como principal objetivo a **separação de responsabilidades**. No nosso projeto, utilizamos uma arquitetura de Três Camadas (3-Tier), fisicamente distribuída em duas Máquinas Virtuais (VMs) hospedadas no VirtualBox e uma máquina local (host):

1.  **Camada de Apresentação (Cliente / Frontend - Máquina Local):** Responsável pela interação direta com o usuário. Desenvolvida em HTML, CSS e JavaScript puro para máxima performance. Ela não possui regra de negócios ou conexão direta com banco de dados; sua única função é exibir dados e enviar ações do usuário (via requisições HTTP) para o servidor central. Roda diretamente no sistema operacional do usuário, sem a necessidade de uma terceira VM.
2.  **Camada de Lógica de Negócios (Web Service / Backend - VM 2):** O "cérebro" da aplicação. Desenvolvida utilizando Node.js com o framework Express. Ela recebe as requisições REST (GET, POST, PUT, DELETE) do cliente, aplica as validações necessárias e interage com a camada de dados. 
3.  **Camada de Dados (SGBD - VM 1):** Responsável por armazenar, consultar e garantir a integridade das informações da biblioteca. Utilizamos o PostgreSQL. Esta máquina está isolada, bloqueando acessos externos diretos, permitindo comunicação apenas via Backend.

### 1.2 Resolução da Infraestrutura
Para que as VMs se comunicassem entre si e com a máquina local, a interface de rede do VirtualBox foi configurada no modo **Bridge** (Ponte). Isso permitiu que o roteador local atribuísse um IP válido na rede local para cada máquina virtual. 
Dessa forma, o Frontend (rodando na máquina local) foi configurado para fazer requisições para o IP da VM do Backend, e o Backend foi configurado para autenticar no IP da VM do SGBD. Essa topologia simula perfeitamente um ambiente em nuvem real (como instâncias EC2 da AWS ou droplets da DigitalOcean).

---

## 2. Análise das Questões Levantadas

### Questão 1: Qual a melhor forma de documentar os commits de GIT para integração da equipe?
**Resposta:** A melhor forma é adotar a padronização conhecida como **Conventional Commits** (Commits Convencionais). 

Em equipes que trabalham integradas (como um time de Front e um de Back), mensagens genéricas como *"atualizado"* ou *"bug resolvido"* geram confusão. O padrão *Conventional Commits* exige que cada commit tenha uma estrutura semântica clara:
*   `feat: adiciona rota de deletar livro` (Quando uma nova funcionalidade é adicionada)
*   `fix: corrige erro na conexão do banco de dados` (Quando um bug é resolvido)
*   `docs: atualiza documentação do swagger` (Quando apenas documentação é alterada)
*   `refactor: melhora estrutura visual do card` (Para melhorias de código sem mudar a lógica)

**Vantagens:** Facilita a leitura do histórico de versão, ajuda as equipes a entenderem o que foi feito sem precisarem ler o código linha a linha, e permite a geração automática de arquivos *Changelog* (Notas de Versão) para gerentes de projeto.

### Questão 2: Como as equipes podem fazer uso da documentação nativa dos frameworks de API?
**Resposta:** Através de ferramentas como o **Swagger (OpenAPI)**, que implementamos na nossa solução do Backend.

A documentação nativa permite que a própria API gere uma interface visual baseada em comentários ou tipagens no código fonte. As equipes podem fazer uso disso da seguinte forma:
1.  **Contrato Único (Single Source of Truth):** A equipe de Frontend não precisa parar a equipe de Backend para perguntar "quais parâmetros essa rota recebe?" ou "o que ela devolve?". Acessando a rota nativa de documentação (ex: `/api-docs`), eles têm acesso a um painel interativo com todas as rotas.
2.  **Testes Integrados:** Ferramentas nativas como o Swagger permitem que o time teste as requisições HTTP (enviando JSONs) diretamente do navegador, sem precisar construir o Front ou usar ferramentas de terceiros como Postman/Insomnia.
3.  **Manutenção Automatizada:** Como a documentação é feita no próprio código do Backend (via anotações), toda vez que um desenvolvedor cria ou altera uma rota, a documentação é atualizada automaticamente no deploy, evitando que fique obsoleta.

---
**Conclusão**
A implementação atendeu a todos os requisitos: o CRUD de livros está funcional com as colunas exigidas, a topologia foi fisicamente separada, e as melhores práticas de integração de equipe (Git Semântico e API Docs) foram estabelecidas e justificadas.
