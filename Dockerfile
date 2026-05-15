# Monorepo API image — use when Railway "Root Directory" is the repo root (.)
# Prefer setting Railway Root Directory to apps/api and using apps/api/Dockerfile instead.
FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY apps/api/package.json apps/api/package-lock.json ./
RUN npm ci

COPY apps/api/tsconfig.json ./
COPY apps/api/src ./src
RUN npm run build

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production

COPY apps/api/package.json apps/api/package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/index.js"]
