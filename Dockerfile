# Stage 1 - compile
FROM node:11-alpine AS compile
WORKDIR /opt/web/app
COPY . .
RUN npm i && npm rebuild node-sass && npm run build

# Stage 2 - production install
FROM node:11-alpine AS prod-install
WORKDIR /opt/web/app
COPY --from=compile /opt/web/app/package.json /opt/web/app/package-lock.json ./
RUN npm i --only=production

# Stage 3 - package files
FROM node:11-alpine AS package
WORKDIR /opt/web/app
COPY --from=compile         /opt/web/app/bin                                        ./bin
COPY --from=compile         /opt/web/app/config/default.js                          ./config/
COPY --from=compile         /opt/web/app/config/custom-environment-variables.json   ./config/
COPY --from=compile         /opt/web/app/src                                        ./src
COPY --from=compile         /opt/web/app/public                                     ./public
COPY --from=compile         /opt/web/app/lock.html                                  ./
COPY --from=compile         /opt/web/app/package.json                               ./
COPY --from=compile         /opt/web/app/package-lock.json                          ./
COPY --from=prod-install    /opt/web/app/node_modules                               ./node_modules

FROM node:11-alpine AS deploy
WORKDIR /opt/web/app
COPY --from=package /opt/web/app/ ./
EXPOSE 8080
CMD ["node", "src/app"]
