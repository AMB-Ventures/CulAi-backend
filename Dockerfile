# Dockerfile
FROM node:20-bullseye

WORKDIR /app
ENV NODE_ENV=production

# Install only what's needed to build native deps (bcrypt)
RUN apt-get update && apt-get install -y --no-install-recommends \
  python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
# Use npm ci and keep prod-only deps
RUN npm ci --omit=dev

COPY . .

# Fly provides PORT; default to 8080 for local runs
ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
