FROM node:23.11.1-alpine3.22

COPY app .

RUN npm install
RUN npm run build

CMD ["npm", "run","preview"]
