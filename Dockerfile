FROM ubuntu
MAINTAINER Jeffery Russell

# install all dependencies
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y build-essential && \
    apt-get install -y sudo curl && \
    curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash - && \
    apt-get install -y nodejs && \
    apt-get update && \
    apt-get clean

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
ENTRYPOINT ["node", "server.js"]
