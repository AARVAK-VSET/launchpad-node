FROM node:22-slim

WORKDIR /starter
ENV NODE_ENV development

COPY .env.example /starter/.env.example
COPY . /starter

RUN npm install -g pm2 && \
    if [ "$NODE_ENV" = "production" ]; then \
        npm install --omit=dev; \
    else \
        npm install; \
    fi

RUN chown -R node:node /starter

USER node

CMD ["pm2-runtime","app.js"]

EXPOSE 8080