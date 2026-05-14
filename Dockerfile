FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ARG GROQ_API_KEY
ENV GROQ_API_KEY=$GROQ_API_KEY

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
