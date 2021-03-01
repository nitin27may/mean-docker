# Create image based off of the official 12.8-alpine
FROM node:14

#RUN echo "nameserver 8.8.8.8" |  tee /etc/resolv.conf > /dev/null
WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./

## installing and Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm ci

COPY . /app/

EXPOSE 4200 49153

#CMD ["npm", "start"]
# ENTRYPOINT ["/bin/bash", "-c", "if [ \"$ENABLE_POLLING\" = \"enabled\" ]; \
#   then npm run start:docker:poll; else npm run start:docker; fi"]
CMD [ "npm", "run", "start" ]
