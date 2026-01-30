FROM node:20-bookworm

WORKDIR /front

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
