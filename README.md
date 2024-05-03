# midi2json

midi2json for Piano Tiles 2. Initially developed for desktop by [Volian0](https://github.com/Volian0), it has now been ported to the web. Runs directly on the web browser without the need for compiling the [original source code](https://github.com/Volian0/midi2json).

Instructions on how to use this tool can be found here: https://pianotiles2-community.github.io/wiki/midi2json.html

## Getting Started

Before you begin, ensure you have the following prerequisites:

-   **Git:** https://git-scm.com/
-   **Docker:** https://docs.docker.com/get-docker/

## Installation

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/pianotiles2-community/midi2json.git
    ```
2. **Install Docker:** Follow the instructions on the official Docker website to set up Docker on your system.

## Building midi2json

### Automatic Building (Recommended)

Leveraging the provided Dockerfile, this method simplifies the building process:

1. **Execute the build script:**
    - On Linux/macOS:
    ```bash
    . ./build.sh
    ```
    - On Windows:
    ```
    cmd /c build.bat
    ```

### Manual Building

For advanced users who prefer a more hands-on approach:

1. **Install Emscripten:** Refer to the official [Emscripten documentation](https://emscripten.org/docs/getting_started/downloads.html) for installation instructions.
2. **Clone the Original Repository:**

    ```bash
    git clone https://github.com/Volian0/midi2json.git
    cd midi2json
    ```

3. **Apply Patch:**

    ```bash
    git apply --ignore-whitespace ../midi2json-emcc.patch
    ```

4. **Compile:**

    ```bash
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
    ```

5. **Copy Binaries:**

    ```bash
    cp ./midi2json.* ../js
    ```

## License

The majority of the content in this repository is licensed under the [MIT license](https://opensource.org/licenses/MIT). Refer to [the license file](/LICENSE) for further details. In summary, you are free to use the content as you wish.
