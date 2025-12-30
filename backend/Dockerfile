FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas as dependências (incluindo dev para build)
RUN npm ci

# Copiar código da aplicação
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Criar diretório para uploads
RUN mkdir -p uploads

# Expor porta
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "start"]

