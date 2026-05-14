FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# Passer les variables d'environnement pour le build
ARG GROQ_API_KEY
ARG DATABASE_URL
ENV GROQ_API_KEY=$GROQ_API_KEY
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
