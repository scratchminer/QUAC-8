var storage;

function storageAvailable() {
	try {
		storage = window.localStorage;
		var x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch (e) {
		return e instanceof DOMException &&
		(e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
		(storage && storage.length !== 0);
	}
}

function createDisk(diskname) {
	if (storageAvailable()) {
		var disk = storage.getItem(diskname);
		if (!disk) {
			storage.setItem("disk_" + diskname, "empty");
		}
		return true;
	}
	return false;
}

function addFileToDisk(diskname, filename, data) {
	if (storageAvailable()) {
		var disk = storage.getItem("disk_" + diskname);
		if (!disk) return false;
		var newData = getFileBinary(data);
		if (disk == "empty") {
			storage.setItem("disk_" + diskname, filename + "::::" + newData + ";;;;");
		}
		else {
			storage.setItem("disk_" + diskname, disk + filename + "::::" + newData + ";;;;");
		}
	}
	return false;
}

function listFilesOnDisk(diskname) {
	if (storageAvailable()) {
		var ret = {};
		var disk = storage.getItem("disk_" + diskname);
		while (disk.length > 1) {
			var filename = disk.substring(0, disk.indexOf("::::"));
			disk = disk.substring(disk.indexOf("::::") + 4);
			ret[filename] = fromFileBinary(disk.substring(0, disk.indexOf(";;;;")));
			disk = disk.substring(disk.indexOf(";;;;", 4) + 4);
		}
		return ret;
	}
	return {};
}

function formatDisk(diskname) {
	if (storageAvailable()) {
		storage.setItem("disk_" + diskname, "empty");
		return true;
	}
	return false;
}

function deleteDisk(diskname) {
	if (storageAvailable()) {
		storage.removeItem("disk_" + diskname);
		return true;
	}
	return false;
}

function exportFilesToDisk(diskname, files) {
	formatDisk(diskname);
	if (storageAvailable()) {
		var results = [];
		for (var i = 0; i < Object.keys(files).length; i++) {
			var filename = Object.keys(files)[i];
			results.push(addFileToDisk(diskname, filename, files[filename]));
		}
		return results.every(item => item);
	}
	return false;
}

function deleteFileOnDisk(diskname, filename) {
	var files = listFilesOnDisk(diskname);
	if (files == {}) return false;
	delete files[filename];
	return exportFilesToDisk(diskname, files);
}

function getFileBinary(data) {
	if (storageAvailable()) {
		var ret = "";
		for (var i = 0; i < Math.ceil(data.length / 2); i += 2) {
			ret += String.fromCharCode(data[i] | (data[i] << 8));
		}
		return ret;
	}
	return null;
}

function getDiskBinary(diskname) {
	var ret = "QUAC-8 DSK";
	var dskData = listFilesOnDisk(diskname);
	for (var i = 0; i < Object.keys(dskData).length; i++) {
		var filename = Object.keys(dskData)[i];
		var data = dskData[filename];
		if (data) ret += String.fromCharCode(data.length) + filename + "::::" + getFileBinary(new Zlib.Deflate(data).compress());
	}
	return ret;
}

function getDiskURL(diskname) {
	const blob = new Blob([getDiskBinary(diskname)], { type: "application/octet-stream" });
	return URL.createObjectURL(blob);
}

function fromFileBinary(data) {
	if (data.substring(0, 10) != "QUAC-8 ROM" && data.substring(0, 10) != "QUAC-8 BAS" && data.substring(0, 10) != "QUAC-8 DSK") return null;
	ret = new Uint8Array(data.length * 2);
	for (var i = 0; i < data.length; i++) {
		ret[2 * i] = data.charCodeAt(i) & 0xff;
		ret[2 * i + 1] = data.charCodeAt(i) >> 8;
	}
	return ret;
}

function fromDiskBinary(data, diskname) {
	if (data.substring(0, 10) != "QUAC-8 DSK") return false;
	createDisk(diskname);
	var count = 10;
	while (count < data.length) {
		var len = data.charCodeAt(count);
		addFileToDisk(diskname, data.substring(count + 1, data.indexOf("::::", count + 1)), new Zlib.Inflate(data.substring(data.indexOf("::::", count + 1) + 4, data.indexOf("::::", count + 1) + 4 + len)).decompress());
	}
	return true;
}