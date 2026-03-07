FROM node:bookworm-slim
LABEL maintainer="Jeffery Russell"

# Create a working directory for the container
RUN mkdir /github-graphs

# copy files from the directory of the Dockerfile to the docker container
COPY /server /github-graphs/server
COPY README.md /github-graphs/
COPY LICENSE /github-graphs/

# setup working directory to the default in the container
WORKDIR /github-graphs/server

# Install dependencies and start the program at RUN
RUN npm install
CMD ["node", "server.js"]
