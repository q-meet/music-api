FROM timbru31/node-alpine-git:14

RUN apk add --no-cache tini

ENV NODE_ENV production
USER node

WORKDIR /app

COPY --chown=node:node . ./

RUN npm i --omit=dev --ignore-scripts

EXPOSE 8081

CMD ["npm" , "run", "server"]