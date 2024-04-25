FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get install -y build-essential git python3

WORKDIR /
RUN git clone https://github.com/emscripten-core/emsdk.git
RUN git clone https://github.com/Volian0/midi2json.git

WORKDIR /emsdk
RUN ./emsdk install latest
RUN ./emsdk activate latest

WORKDIR /app