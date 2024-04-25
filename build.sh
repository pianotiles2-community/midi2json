#!/bin/bash -e
docker build --force-rm -t midi2json-build .
docker run --rm -v $pwd:/app -w /app midi2json-build bash -e build_in_docker.sh