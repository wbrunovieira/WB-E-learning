# Base image para Node.js LTS
FROM node:18-alpine AS builder

# Definindo o diretório de trabalho no container
WORKDIR /app

# Copiando apenas os arquivos necessários para o build
COPY package.json pnpm-lock.yaml ./

# Instalando pnpm para um gerenciamento de pacotes mais eficiente
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copiando o restante dos arquivos da aplicação
COPY . .

# Compilando o código TypeScript
RUN pnpm build

# Remoção de arquivos desnecessários para manter o container limpo
RUN pnpm prune --prod

# Segunda etapa - imagem final mínima
FROM node:18-alpine

# Definindo o diretório de trabalho no container
WORKDIR /app

# Copiando apenas os arquivos necessários do build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Definindo a porta padrão que será exposta pelo container
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/main.js"]
