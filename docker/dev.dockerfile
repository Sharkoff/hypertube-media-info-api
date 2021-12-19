FROM node:16.13.1

ENV PATH /media-info-api/node_modules/.bin:$PATH
WORKDIR /media-info-api

COPY media-info-api/ ./
RUN npm install --silent

CMD ["npm", "run", "dev"]