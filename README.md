# 🚀 CodeDaily

O **CodeDaily** é uma plataforma de desafios diários de programação, onde usuários podem resolver problemas diretamente no navegador, submeter código e receber feedback automático em tempo real.

O sistema é composto por uma aplicação web fullstack em Next.js e um runner isolado responsável pela execução segura do código.

---

## 🧠 Visão geral

O fluxo da aplicação funciona da seguinte forma:

1. O usuário acessa um desafio
2. Escreve sua solução no editor
3. Submete o código
4. A aplicação envia o código para o runner
5. O runner executa em ambiente isolado
6. O resultado é retornado e exibido ao usuário

---

## 🏗️ Arquitetura

```
Next.js (App Router)
│
├── Frontend (React + Tailwind)
├── API Routes (Next.js)
│
└── Prisma (SQLite)
        ↓
Runner (Rust)
```

* 🌐 **App (frontend + backend)**: Next.js (App Router)
* 🗄️ **Banco de dados**: SQLite + Prisma
* ⚙️ **Runner**: serviço separado em Rust (`codedaily-runner`)

---

## 📦 Estrutura do projeto

```
codedaily/
├── app/                  # App Router (páginas + layout)
├── content/              # Conteúdo dos Challenges (mdx)
├── lib/                  # Helpers (prisma, utils, etc)
├── prisma/               # Schema e migrations
├── public/               # Arquivos estáticos
├── package.json
├── next.config.js
└── README.md
```

---

## ⚙️ Funcionalidades

* 🧩 Desafios diários de programação
* 💻 Editor de código integrado
* 🧪 Execução com test cases
* 🔄 Feedback automático
* ⚡ Integração com runner externo
* 📦 Persistência com Prisma

---

## 🔌 Integração com Runner

O CodeDaily utiliza um serviço externo para execução de código.

Fluxo:

```
Frontend → API (Next.js) → Runner (Rust) → Resultado → Frontend
```

A API do Next.js é responsável por:

* receber o código do usuário
* buscar test cases
* enviar para o runner
* retornar o resultado final

---

## 🧪 Banco de dados

Gerenciado com Prisma + SQLite.

### Comandos úteis:

```
npx prisma migrate dev
npx prisma studio
```

---

## ▶️ Rodando o projeto

### 1. Clonar repositório

```
git clone https://github.com/seu-usuario/codedaily
cd codedaily
```

---

### 2. Instalar dependências

```
npm install
```

---

### 3. Configurar ambiente

Crie um arquivo `.env`:

```
DATABASE_URL="file:./dev.db"
RUNNER_URL="http://runner:8080"
```

---

### 4. Rodar banco de dados

```
npx prisma migrate dev
```

---

### 5. Rodar aplicação

```
npm run dev
```

---

## 🐳 Rodando com Docker

O projeto foi pensado para rodar totalmente em containers.

### Subir ambiente completo:

```
docker-compose up --build
```

Isso irá iniciar:

* Next.js (frontend + API)
* Banco SQLite
* Runner (container separado)

---

## 🔐 Segurança

A execução de código é feita fora da aplicação principal, garantindo isolamento:

* Limite de CPU/memória
* Timeout de execução

---

## 🚧 Roadmap

* [ ] Sistema de usuários
* [ ] Histórico de submissões
* [ ] Ranking global
* [ ] Execução assíncrona com fila
* [ ] Suporte a múltiplas linguagens
* [ ] Melhorias no editor (autocomplete, lint)

---

## 🤝 Contribuição

Contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`feature/minha-feature`)
3. Commit suas mudanças
4. Abra um Pull Request

