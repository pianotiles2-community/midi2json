const dropzone = document.querySelector('.file-dropzone');
const fileInput = document.getElementById('file-input');
const fileInfo = document.querySelector('.selected-file');

const processButton = document.querySelector('.process-button');
const downloadButton = document.querySelector('.download-button');
const statusMessage = document.querySelector('.status-message');

const output = document.getElementById('outputTextarea');

let file = null;

dropzone.addEventListener('dragover', e => {
	e.preventDefault();
	dropzone.style.border = '4px dashed rgb(138 180 248 / 100%)';
});

dropzone.addEventListener('dragleave', e => {
	e.preventDefault();
	dropzone.style.border = '';
});

dropzone.addEventListener('drop', e => {
	e.preventDefault();
	dropzone.style.border = '';
	file = e.dataTransfer.files[0];
	const fileName = file.name;
	const fileSize = file.size.toLocaleString();
	fileInfo.innerText = `${fileName} (${fileSize} B)`;
});

fileInput.addEventListener('change', e => {
	file = e.target.files[0];
	const fileName = file.name;
	const fileSize = file.size.toLocaleString();
	fileInfo.innerText = `${fileName} (${fileSize} B)`;
});

processButton.addEventListener('click', e => {
	if (file === null) {
		return;
	}

	const midiTickQ = document.getElementById('qDuration');
	const midiTrack5 = document.getElementById('doubleTilesTrack');
	const midiTick5 = document.getElementById('doubleTilesTick');
	const ignoreRestsTrack = document.getElementById('ignoreRestsTrack');

	const reader = new FileReader();
	reader.onload = event => {
		const buffer = event.target.result;
		const data = new Uint8Array(buffer);

		const fd = FS.open('test.mid', 'w+');
		FS.write(fd, data, 0, data.length, 0);
		FS.close(fd);

		try {
			const result = Module.ccall(
				'processMidiFile',
				'string',
				['string', 'number', 'number', 'number', 'number'],
				['test.mid', midiTickQ.value, midiTrack5.value, midiTick5.value, ignoreRestsTrack.value],
			);

			output.value = result;
			downloadButton.style.display = 'block';
			statusMessage.innerHTML = '<span style="color: #0f0; font-weight: 700">File successfully converted.</span>';
		} catch (e) {
			statusMessage.innerHTML = `<span style="color: #f00; font-weight: 700">ERROR: ${
				e.message ?? 'Unknown error occurred.'
			}<br />Please refer to <a href="https://pianotiles2-community.github.io/wiki/midi2json.html#troubleshooting" target="_blank">the wiki page</a> for a list of errors and troubleshooting tips.</span>`;
		}
	};
	reader.readAsArrayBuffer(file);
});

downloadButton.addEventListener('click', () => {
	const blob = new Blob([output.value], { type: 'text/plain' });
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = 'output.txt';
	link.click();

	URL.revokeObjectURL(url);
});
