const dropzone = document.querySelector('.file-upload');
const fileInput = document.getElementById('file-input');
const fileInfo = document.querySelector('.file-name');

const processButton = document.getElementById('process-button');
const downloadButton = document.getElementById('download-button');
const statusMessage = document.querySelector('.status');

const output = document.querySelector('.output');

let file = null;

dropzone.addEventListener('dragover', (e) => {
	e.preventDefault();
	document.querySelector('.file-upload').style.border = '3px dashed rgb(138 180 248 / 100%)';
});

dropzone.addEventListener('dragleave', (e) => {
	e.preventDefault();
	document.querySelector('.file-upload').style.border = '';
});

dropzone.addEventListener('drop', (e) => {
	e.preventDefault();
	file = e.dataTransfer.files[0];
	const fileName = file.name;
	const fileSize = file.size.toLocaleString();
	fileInfo.innerText = `${fileName} (${fileSize} B)`;
});

fileInput.addEventListener('change', (e) => {
	file = e.target.files[0];
	const fileName = file.name;
	const fileSize = file.size.toLocaleString();
	fileInfo.innerText = `${fileName} (${fileSize} B)`;
});

processButton.addEventListener('click', (e) => {
	if (file === null) {
		return;
	}

	const midiTickQ = document.getElementById('midiTickQ');
	const midiTrack5 = document.getElementById('midiTrack5');
	const midiTick5 = document.getElementById('midiTick5');
	const ignoreRestsTrack = document.getElementById('ignoreRestsTrack');

	const reader = new FileReader();
	reader.onload = (event) => {
		const buffer = event.target.result;
		const data = new Uint8Array(buffer);

		const fd = FS.open('test.mid', 'w+');
		FS.write(fd, data, 0, data.length, 0);
		FS.close(fd);

		const result = Module.ccall(
			'processMidiFile',
			'string',
			['string', 'number', 'number', 'number', 'number'],
			['test.mid', midiTickQ.value, midiTrack5.value, midiTick5.value, ignoreRestsTrack.value],
		);

		output.value = result;
		downloadButton.style.display = 'block';
		statusMessage.innerText = 'File successfully converted.';
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
