FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm \
	npm ci

COPY . .

RUN npm run build && npm ci --omit=dev && npm cache clean --force

FROM gcr.io/distroless/nodejs22-debian12

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./package.json

EXPOSE 3000

CMD ["./dist/index.js"]