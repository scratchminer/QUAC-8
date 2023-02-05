var instance;
var header;
var footer;

function codeChanged(pre) {
	var codeText = pre.innerHTML;

	codeText = codeText.replaceAll("<br /></div>", "\n");
	codeText = codeText.replaceAll("</div>", "\n");
	codeText = codeText.replaceAll("<div>", "");

	if (codeText.endsWith("\n")) codeText = codeText.substr(0, codeText.length - 1);

	document.getElementById("actualcode").value = he.decode(codeText);

	var lines = codeText.split("\n");

	document.getElementById("linenums").innerHTML = lines.map(function(line, idx) {
		return `<span class="codeline">${idx + 1}</span>`;
	}).join("\n");
}

function hexStrToBinary(hexStr) {
	bin = ""
	while (hexStr.length % 4 != 0) hexStr += "0"
	for (var i = 0; i < Math.ceil(hexStr.length / 4) * 4; i += 4) {
		bin += String.fromCharCode((parseInt(hexStr.substring(i + 2, i + 4), 16) << 8) | parseInt(hexStr.substring(i, i + 2)));
	}
	return bin;
}

function assembleCode() {
	if (!instance || !header || !footer) return;
	var asmPtr = makeRustString(header + "\n" + he.decode(document.getElementById("actualcode").value) + "\n" + footer);
	var outputPtr = instance.exports.wasm_assemble(4, asmPtr);
	var output = readRustString(outputPtr);
	dropRustString(asmPtr);
	dropRustString(outputPtr);

	if (output.includes("error:")) {
		var lineStart = output.indexOf("asm:") + 6;

		var lineNum = parseInt(output.substring(lineStart, output.indexOf(":", lineStart))) - 170;
		var colNum = parseInt(output.substring(output.indexOf(":", lineStart) + 1, output.indexOf(":", output.indexOf(":", lineStart) + 1)));

		alert("There was something wrong with your code (line " + lineNum + ", column " + colNum + ").\n");
		return;
	}
	var diskname = document.getElementById("diskname").value;
	if (diskname == "") diskname = "disk.quac";
	var filename = document.getElementById("filename").value;
	createDisk(diskname);
	addFileToDisk(diskname, filename, hexStrToBinary(output));
	alert("Code successfully assembled!");
}

window.onload = function() {
	storageAvailable();
	WebAssembly.instantiateStreaming(fetch("wasm/customasm.gc.wasm")).then(result => {
		instance = result.instance;
	});
	fetch("wasm/header.inc").then(resp => resp.text()).then(result => {
		header = result;
	});
	fetch("wasm/footer.inc").then(resp => resp.text()).then(result => {
		footer = result;
	});

	codeChanged(document.getElementById("asmcode"));
}

function makeRustString(str) {
	var bytes = window.TextEncoder ? new TextEncoder("utf-8").encode(str) : stringToUtf8ByteArray(str);
	var ptr = instance.exports.wasm_string_new(bytes.length);
	for (var i = 0; i < bytes.length; i++)
		instance.exports.wasm_string_set_byte(ptr, i, bytes[i]);
	return ptr;
}

function readRustString(ptr) {
	var len = instance.exports.wasm_string_get_len(ptr);
	var bytes = [];
	for (var i = 0; i < len; i++)
		bytes.push(instance.exports.wasm_string_get_byte(ptr, i));
	var str = window.TextDecoder ? new TextDecoder("utf-8").decode(new Uint8Array(bytes)) : utf8ByteArrayToString(bytes);
	var ansiCode = false;
	var newStr = "";
	for (var i = 0; i < str.length; i++) {
		if (!ansiCode && str.charAt(i) === "[") ansiCode = true;
		if (ansiCode && str.charAt(i - 1) === "m") ansiCode = false;
		if (!ansiCode) newStr += str.charAt(i);
	}
	return newStr;
}

function dropRustString(ptr) {
	instance.exports.wasm_string_drop(ptr);
}

function stringToUtf8ByteArray(str) {
	var out = [], p = 0;
	for (let i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);
		if (c < 128) {
			out[p++] = c;
		} else if (c < 2048) {
			out[p++] = (c >> 6) | 192;
			out[p++] = (c & 63) | 128;
		} else if (
			((c & 0xFC00) == 0xD800) && (i + 1) < str.length &&
			((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
			c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
			out[p++] = (c >> 18) | 240;
			out[p++] = ((c >> 12) & 63) | 128;
			out[p++] = ((c >> 6) & 63) | 128;
			out[p++] = (c & 63) | 128;
		} else {
			out[p++] = (c >> 12) | 224;
			out[p++] = ((c >> 6) & 63) | 128;
			out[p++] = (c & 63) | 128;
		}
	}
	return out;
}

function utf8ByteArrayToString(bytes) {
	let out = [], pos = 0, c = 0;
	while (pos < bytes.length) {
		let c1 = bytes[pos++];
		if (c1 < 128) {
			out[c++] = String.fromCharCode(c1);
		} else if (c1 > 191 && c1 < 224) {
			var c2 = bytes[pos++];
			out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
		} else if (c1 > 239 && c1 < 365) {
			var c2 = bytes[pos++];
			var c3 = bytes[pos++];
			var c4 = bytes[pos++];
			var u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 0x10000;
			out[c++] = String.fromCharCode(0xD800 + (u >> 10));
			out[c++] = String.fromCharCode(0xDC00 + (u & 1023));
		} else {
			var c2 = bytes[pos++];
			var c3 = bytes[pos++];
			out[c++] =
				String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
		}
	}
	return out.join('');
}