FROM node:14-buster-slim AS builder
WORKDIR /home/node
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:14-buster-slim
WORKDIR /home/node
COPY --from=builder --chown=node /home/node/node_modules node_modules/
COPY --from=builder --chown=node \
  /home/node/package*.json \
  /home/node/*.js \
  /home/node/*.proto \
  /home/node/user-function.desc \
  ./
USER node
EXPOSE 8080
CMD ["npm", "start"]
