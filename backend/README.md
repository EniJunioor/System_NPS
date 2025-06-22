# Backend - Sistema de Avaliação NPS

## Configuração do Banco de Dados

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do backend com as seguintes variáveis:

```env
# Configuração do Banco de Dados
DATABASE_URL="postgresql://username:password@localhost:5432/ava_nps"
DIRECT_URL="postgresql://username:password@localhost:5432/ava_nps"

# Configuração do JWT
JWT_SECRET="sua_chave_secreta_aqui"

# Configuração do Servidor
PORT=3001
NODE_ENV=development
```

### 3. Configurar Banco de Dados PostgreSQL

1. **Instalar PostgreSQL** (se ainda não tiver)
2. **Criar banco de dados:**
   ```sql
   CREATE DATABASE ava_nps;
   ```
3. **Executar migrações:**
   ```bash
   npx prisma migrate dev
   ```
4. **Gerar cliente Prisma:**
   ```bash
   npx prisma generate
   ```

### 4. Inserir Dados de Teste

Execute o script SQL para inserir dados de teste:

```bash
psql -d ava_nps -f clean-db.sql
```

### 5. Iniciar o Servidor

```bash
npm start
```

O servidor estará disponível em: `http://localhost:3001`

## Endpoints da API

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de usuário

### Tokens de Avaliação
- `POST /tokens` - Gerar token de avaliação
- `GET /tokens/:valor` - Validar token
- `PUT /tokens/:valor/usar` - Marcar token como usado

### Tickets
- `GET /tickets` - Listar tickets
- `POST /tickets` - Criar ticket
- `PUT /tickets/:id` - Atualizar ticket
- `DELETE /tickets/:id` - Deletar ticket

### Avaliações
- `POST /avaliacoes` - Criar avaliação
- `GET /avaliacoes` - Listar avaliações

## Documentação Swagger

Acesse: `http://localhost:3001/api-docs`

## Testes

```bash
npm test
```

## Estrutura do Banco de Dados

### Tabelas Principais:
- `usuarios` - Usuários do sistema
- `tickets` - Tickets de atendimento
- `tokens_avaliacao` - Tokens para avaliação
- `avaliacoes` - Avaliações dos clientes

### Relacionamentos:
- Um usuário pode criar múltiplos tickets
- Um ticket pode ter um token de avaliação
- Um ticket pode ter uma avaliação
- Um token de avaliação pertence a um atendimento específico 