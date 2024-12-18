# 📱 Sistema Web Mobile - Next.js, MySQL e Prisma

Bem-vindo ao repositório do **Sistema Web Mobile**, uma aplicação projetada exclusivamente para dispositivos móveis, construída com **Next.js** no frontend e backend, integrando banco de dados MySQL por meio do ORM **Prisma**.

## 🚀 Tecnologias Utilizadas

- **Frontend e Backend**: [Next.js](https://nextjs.org/)
- **Banco de Dados**: [MySQL](https://www.mysql.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)

## 📂 Estrutura do Projeto

#### src/app/api => todo o backend
#### src/app/dashboard => páginas do projeto 
#### src/app/components => componentes jsx 
#### src/context => contextos que gerenciam os dados do banco


## 🛠️ Configuração do Ambiente

Siga os passos abaixo para rodar o projeto localmente:

### 1️⃣ Pré-requisitos

- Node.js (v16 ou superior)
- MySQL instalado e rodando
- Gerenciador de pacotes (NPM ou Yarn)

### 2️⃣ Clonando o Repositório

```bash
git clone https://github.com/pedroenriqueps/sistema-souza.git
cd sistema-souza

npm install
# ou
yarn install

DATABASE_URL="mysql://usuario:senha@localhost:3306/nome-do-banco"

npx prisma migrate dev
