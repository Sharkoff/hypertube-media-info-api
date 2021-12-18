FROM node:16.13.1

ENV PATH /media-api/node_modules/.bin:$PATH
WORKDIR /media-api

COPY media-api/ ./
RUN npm install --silent

CMD ["npm", "run", "dev"]