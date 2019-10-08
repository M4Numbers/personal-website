# Stage 1 - compile
FROM node:11-alpine AS compile
WORKDIR /opt/web/app
COPY . .
RUN npm i && npm rebuild node-sass && npm run build:compile

# Stage 2 - production install
FROM node:11-alpine AS prod-install
WORKDIR /opt/web/app
COPY --from=compile /opt/web/app/package.json /opt/web/app/package-lock.json ./
RUN npm i --only=production

# Stage 3 - package files
FROM node:11-alpine AS package
WORKDIR /opt/web/app
COPY --from=compile         /opt/web/app/bin                                        ./bin
COPY --from=compile         /opt/web/app/config/default.json                        ./config/
COPY --from=compile         /opt/web/app/config/custom-environment-variables.json   ./config/
COPY --from=compile         /opt/web/app/gql                                        ./gql
COPY --from=compile         /opt/web/app/journey                                    ./journey
COPY --from=compile         /opt/web/app/lib                                        ./lib
COPY --from=compile         /opt/web/app/middleware                                 ./middleware
COPY --from=compile         /opt/web/app/public                                     ./public
COPY --from=compile         /opt/web/app/routes                                     ./routes
COPY --from=compile         /opt/web/app/views                                      ./views
COPY --from=compile         /opt/web/app/app.js                                     ./
COPY --from=compile         /opt/web/app/lock.html                                  ./
COPY --from=compile         /opt/web/app/package.json                               ./
COPY --from=compile         /opt/web/app/package-lock.json                          ./
COPY --from=compile         /opt/web/app/robots.txt                                 ./
COPY --from=compile         /opt/web/app/sitemap.txt                                ./
COPY --from=prod-install    /opt/web/app/node_modules                               ./node_modules

FROM node:11-alpine AS deploy
WORKDIR /opt/web/app
COPY --from=package /opt/web/app/ ./
EXPOSE 3000
CMD ["node", "bin/www"]
