function refreshDisks() {
	var diskTbl = document.getElementById("disktbl");
	diskTbl.innerHTML = "";
	var disks = [];
	if (storageAvailable()) {
		for (const diskname in storage) {
			if (diskname.startsWith("disk_")) disks.push(diskname)
		}
	}
	if (!storageAvailable() || Object.keys(disks).length === 0) diskTbl.appendChild(document.createElement("tr")).appendChild(document.createElement("td")).innerHTML = "You don't have any disks to display."
	else {
		var header = document.createElement("tr");
		header.appendChild(document.createElement("th")).innerHTML = "Disk name"
		header.appendChild(document.createElement("th")).innerHTML = "Download"
		header.appendChild(document.createElement("th")).innerHTML = "Load"
		header.appendChild(document.createElement("th")).innerHTML = "Delete"
		diskTbl.appendChild(header);
		for (var i = 0; i < disks.length; i++) {
			var diskname = disks[i];
			var dn = diskname.substring(5);
			var entry = document.createElement("tr");
			var col1 = document.createElement("td");
			col1.class = "centerHoriz";
			entry.appendChild(col1).innerHTML = dn;

			var downLink = document.createElement("a");
			downLink.href = getDiskURL(dn);
			downLink.download = dn + ".quac";
			var col2 = document.createElement("td");
			col2.class = "centerHoriz";
			entry.appendChild(col2).appendChild(downLink).innerHTML = "Download " + dn;

			var col3 = document.createElement("td");
			col3.class = "centerHoriz";
			var loadLink = document.createElement("a");
			loadLink.href = "/?disk=" + encodeURIComponent(dn);
			entry.appendChild(col3).appendChild(loadLink).innerHTML = "Load " + dn;

			var delButton = document.createElement("button");
			delButton.addEventListener("click", function() {
				deleteDisk(dn);
				refreshDisks();
			});
			var col4 = document.createElement("td");
			col4.class = "centerHoriz";
			entry.appendChild(col4).appendChild(delButton).innerHTML = "Delete " + dn;
			diskTbl.appendChild(entry);
		}
		diskTbl.appendChild(document.createElement("p")).innerHTML = "Count: " + disks.length;

	}
}

document.body.onload = refreshDisks;