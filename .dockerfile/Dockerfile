FROM node:12.18.3 AS builder
WORKDIR /usr/src/app
COPY package.json .
RUN npm install -g npm
RUN npm install --legacy-peer-deps
ARG APP_ENV
COPY . .
COPY .devenv/.env.${APP_ENV} ./.env
RUN echo "APP_VERSION=$(git describe --tags)" >> ./.env
RUN npm run build

FROM node:12.18.3 AS runner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
EXPOSE 3000
ENTRYPOINT npm start