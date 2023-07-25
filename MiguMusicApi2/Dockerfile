FROM timbru31/node-alpine-git:14

RUN apk add --no-cache tini

ENV NODE_ENV production~

WORKDIR /app

COPY --chown=node:node . ./

RUN npm i --omit=dev --ignore-scripts

EXPOSE 3400

CMD [ "/sbin/tini", "--", "node", "bin/www" ]
