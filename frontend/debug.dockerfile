# Create image based off of the official 12.8-alpine
FROM node:14

# disabling ssl for npm for Dev or if you are behind proxy
RUN npm set strict-ssl false
#RUN echo "nameserver 8.8.8.8" |  tee /etc/resolv.conf > /dev/null

WORKDIR /frontend

# Copy dependency definitions
COPY package.json ./

## installing and Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i

COPY . .

EXPOSE 4200 49153

CMD ["npm", "start"]
