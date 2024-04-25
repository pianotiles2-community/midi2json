docker build --force-rm -t midi2json-build .
docker run --rm -v "%cd%":/app -w /app midi2json-build bash -e build_in_docker.sh