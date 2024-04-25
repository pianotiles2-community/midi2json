#!/bin/bash -e

cd /midi2json

git apply --ignore-whitespace /app/midi2json-emcc.patch

source /emsdk/emsdk_env.sh

em++ ./src/main.cpp \
    ./src/midi/Binasc.cpp \
    ./src/midi/MidiEvent.cpp \
    ./src/midi/MidiEventList.cpp \
    ./src/midi/MidiFile.cpp \
    ./src/midi/MidiMessage.cpp \
    ./src/midi/Options.cpp \
    -std=c++11 -DNDEBUG -O3 \
    -o ./midi2json.js \
    -s WASM=1 \
    -s EXPORTED_FUNCTIONS=_processMidiFile \
    -s EXPORTED_RUNTIME_METHODS=ccall \
    -s FORCE_FILESYSTEM

cp ./midi2json.* /app/js