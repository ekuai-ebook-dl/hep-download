let iframe = document.getElementsByTagName("iframe")[0];
if (iframe) {
	location.href = iframe.src;
}
iframe = document.createElement("iframe");
document.body.appendChild(iframe);
window.console = iframe.contentWindow.console;

function init() {
	let data = $vm.$children[0].$children[0].$children[0]._data;
	let pageRes = data.impoweRes;
	let directories = data.tableOfContentList;
	let directoriesDom = document.querySelectorAll(".catalog-list li");
	let ret = "";
	for (let i = 0; i < directories.length; i++) {
		let directory = directories[i];
		let tab = parseInt(directoriesDom[i].style.textIndent) / 10;
		tab = "\t".repeat(tab);
		for (let j = 0; j < pageRes.length; j++) {
			if (pageRes[j].Url.split("fn=")[1] === directory.page) {
				ret += tab + directory.Title + "\t" + (j + 1) + "\r\n";
				break;
			}
		}
	}
	exportRaw(data.readData.title, ret);
}

function exportRaw(name, data) {
	let export_blob = new Blob([data], {type: "text/plain,charset=UTF-8"});
	let save_link = document.createElement("a");
	save_link.href = window.URL.createObjectURL(export_blob);
	save_link.download = name;
	save_link.click();
}

init();
