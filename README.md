# 🏥 Gilson Farma - Sistema de Farmácia

Sistema completo de gerenciamento de farmácia com frontend em Angular e backend em Next.js + Prisma + PostgreSQL.

---

## 📋 Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [PostgreSQL](https://www.postgresql.org/download/) (versão 13 ou superior)
- [Git](https://git-scm.com/)
- Um editor de código (VS Code recomendado)

---

## 🗄️ Configuração do Banco de Dados PostgreSQL

### Passo 1: Instalar o PostgreSQL

1. **Baixe o PostgreSQL:**
   - Acesse: https://www.postgresql.org/download/windows/
   - Ou diretamente: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
   - Baixe a versão mais recente (recomendado: PostgreSQL 15 ou 16)

2. **Instale o PostgreSQL:**
   - Execute o instalador baixado
   - **Porta:** Deixe o padrão `5432`
   - **Senha:** Defina uma senha para o usuário `postgres` (exemplo: `postgres123`)
   - ⚠️ **ANOTE ESTA SENHA!** Você vai precisar dela
   - **Componentes:** Instale todos (PostgreSQL Server, pgAdmin 4, Command Line Tools)
   - **Locale:** Deixe o padrão

3. **Verifique a instalação:**
   - Abra o menu iniciar e procure por "pgAdmin 4"
   - Se encontrar, a instalação foi bem-sucedida!

### Passo 2: Criar o Banco de Dados

1. **Abra o pgAdmin 4** (instalado junto com PostgreSQL)

2. **Conecte ao servidor:**
   - Clique em "Servers" no painel esquerdo
   - Clique em "PostgreSQL [versão]"
   - Digite a senha que você criou na instalação

3. **Crie o banco de dados:**
   - No painel esquerdo, clique com botão direito em "Databases"
   - Selecione **"Create" > "Database..."**
   - Em "Database", digite: `produtos`
   - Clique em **"Save"**

✅ Pronto! Seu banco de dados PostgreSQL está configurado!

---

## 🚀 Configuração do Projeto

### Passo 1: Clonar o Repositório

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd gilson-farma-comentarios
```

### Passo 2: Instalar Dependências do Frontend

```bash
# Na pasta raiz do projeto
npm install
```

### Passo 3: Configurar o Backend

```bash
# Entre na pasta backend
cd backend

# Instale as dependências
npm install
```

### Passo 4: Configurar Variáveis de Ambiente

1. **Crie o arquivo `.env`** na pasta `backend`:

```bash
# No Windows PowerShell (dentro da pasta backend)
Copy-Item .env.example .env

# Ou crie manualmente um arquivo chamado .env
```

2. **Edite o arquivo `backend/.env`** com suas credenciais:

```env
# Substitua SUA_SENHA pela senha que você definiu no PostgreSQL
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/produtos?schema=public"
```

**Exemplo:**
```env
# Se sua senha for "postgres123"
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/produtos?schema=public"
```

⚠️ **IMPORTANTE:** Nunca compartilhe este arquivo com sua senha!

### Passo 5: Configurar o Prisma e Criar as Tabelas

```bash
# Certifique-se de estar na pasta backend
cd backend

# Gere o cliente Prisma
npx prisma generate

# Crie as tabelas no banco de dados
npx prisma migrate dev --name init
```

✅ Se tudo deu certo, você verá uma mensagem de sucesso!

### Passo 6: Popular o Banco com Produtos Iniciais

**Opção 1 - Via Navegador (mais fácil):**
1. Inicie o backend: `npm run dev`
2. Abra o navegador em: `http://localhost:3001/api/produtos/seed`

**Opção 2 - Via Terminal:**
```bash
# Com o backend rodando, em outro terminal:
curl -X POST http://localhost:3001/api/produtos/seed

# Ou no Git Bash:
curl -X POST http://localhost:3001/api/produtos/seed
```

✅ Você verá uma mensagem: `"38 produtos criados com sucesso"`

---

## 🎮 Rodando o Projeto

Você precisa rodar **DOIS servidores** em terminais separados:

### Terminal 1 - Backend (Next.js + API)

```bash
# Entre na pasta backend
cd backend

# Inicie o servidor backend
npm run dev
```

✅ Backend rodando em: **http://localhost:3001**

### Terminal 2 - Frontend (Angular)

```bash
# Na pasta raiz do projeto
ng serve
```

✅ Frontend rodando em: **http://localhost:4200**

---

## 🔍 Verificar se está Funcionando

### Testar o Backend:
- Abra: `http://localhost:3001/api/produtos`
- Deve mostrar a lista de produtos em JSON

### Testar o Frontend:
- Abra: `http://localhost:4200`
- Faça login com as credenciais
- Acesse "Medicamentos" e veja os produtos

### Visualizar o Banco de Dados:
```bash
# Na pasta backend
npx prisma studio
```
- Abre em: `http://localhost:5555`
- Interface visual para ver e editar dados

---

## 📝 Resumo dos Comandos Importantes

```bash
# BACKEND
cd backend
npm install                    # Instalar dependências
npx prisma generate           # Gerar cliente Prisma
npx prisma migrate dev        # Criar/atualizar tabelas
npx prisma studio             # Abrir interface visual do banco
npm run dev                   # Rodar servidor backend

# FRONTEND
npm install                   # Instalar dependências
ng serve                      # Rodar servidor frontend

# POPULAR BANCO
# Com backend rodando, acesse no navegador:
http://localhost:3001/api/produtos/seed
```

---

## 🆘 Problemas Comuns

### ❌ Erro: "Can't reach database server at localhost:5432"

**Solução:** PostgreSQL não está rodando

```bash
# Windows - PowerShell como Administrador
Get-Service postgresql*
Start-Service postgresql-x64-[versão]
```

### ❌ Erro: "password authentication failed for user postgres"

**Solução:** Senha incorreta no arquivo `.env`
- Verifique a senha no arquivo `backend/.env`
- Certifique-se de que é a mesma senha definida na instalação do PostgreSQL

### ❌ Erro: "database produtos does not exist"

**Solução:** Banco não foi criado
- Abra o pgAdmin 4
- Crie um banco chamado `produtos` (veja Passo 2 acima)

### ❌ Erro: "Port 3001 already in use"

**Solução:** Já existe algo rodando na porta 3001
- Feche outros servidores Node.js
- Ou mude a porta no `backend/package.json`

---

## 📁 Estrutura do Projeto

````markdown
src
├── app
│   ├── api
│   │   ├── produtos
│   │   │   ├── route.ts
│   │   │   └── seed.ts
│   │   └── users
│   │       └── route.ts
│   ├── components
│   │   ├── Navbar
│   │   │   └── Navbar.tsx
│   │   └── ProductCard
│   │       └── ProductCard.tsx
│   ├── lib
│   │   ├── prisma.ts
│   │   └── seedData.ts
│   ├── pages
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── index.tsx
│   │   └── produtos
│   │       └── [id].tsx
│   └── styles
│       ├── globals.css
│       └── Home.module.css
├── package.json
├── prisma
│   ├── schema.prisma
│   └── seed.ts
└── tsconfig.json
````

---

## 🔒 Como Funciona a Segurança

**O que vai para o GitHub:**
- ✅ Todo o código fonte
- ✅ Arquivo `.env.example` (com exemplo SEM senha real)
- ✅ `.gitignore` (que bloqueia o `.env`)
- ❌ `.env` (com sua senha real) **NUNCA vai**

**Quando outra pessoa clonar:**
1. Ela vai ter todo o código
2. Ela vai ver o `.env.example`
3. Ela precisa criar o próprio `.env` com a senha dela
4. Ela precisa ter PostgreSQL instalado na máquina dela

---

## 🔐 Segurança e Variáveis de Ambiente

### ⚠️ NUNCA COMMITE O ARQUIVO .env

O arquivo `.env` contém suas credenciais sensíveis (senhas do banco de dados, chaves API, etc).

**Configuração correta:**

1. O arquivo `.env` está no `.gitignore` - ele NUNCA vai para o GitHub
2. Use o arquivo `.env.example` como modelo
3. Cada desenvolvedor cria seu próprio `.env` local

**Para novos desenvolvedores:**

```bash
# Copie o arquivo de exemplo
cp backend/.env.example backend/.env

# Edite o .env com suas credenciais locais
# Nunca compartilhe este arquivo!
```

### 🔑 Credenciais Necessárias

Cada desenvolvedor precisa ter:
- ✅ PostgreSQL instalado e rodando
- ✅ Um banco de dados criado
- ✅ Suas próprias credenciais no arquivo `.env`
