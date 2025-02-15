FROM node:20-alpine

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY package*.json ./
COPY wait-for.sh ./

RUN chmod +x wait-for.sh && \
    npm install

COPY . .

EXPOSE 8000

CMD ["./wait-for.sh", "db", "npm", "run", "db:push", "&&", "npm", "run", "dev"] 