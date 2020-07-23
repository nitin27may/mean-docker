# Create image based off of the official 12.8-alpine
FROM node:12.8-alpine

# disabling ssl for npm for Dev or if you are behind proxy
#RUN npm set strict-ssl false
#RUN echo "nameserver 8.8.8.8" |  tee /etc/resolv.conf > /dev/null

## installing angular cli globally
RUN npm install -g @angular/cli

# Copy dependency definitions
COPY package.json ./

## installing and Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir /frontend && mv ./node_modules ./frontend

# Change directory so that our commands run inside this new directory
WORKDIR /frontend

COPY . /frontend/

# Expose the port the app runs in
EXPOSE 4200
# Serve the app
CMD ["ng",  "serve", "--host", "0.0.0.0", "--watch", "--poll=2000"]
