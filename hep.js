let config = {
	interval: 500,
	filenameFront: "",
	filenameBack: "",
	errMax: 5,
	minWidth: 2000,
};//在此修改配置
let iframe = document.getElementsByTagName("iframe")[0];
if (iframe) {
	location.href = iframe.src;
}
let div = document.createElement("div");
div.innerHTML = `
	<div  style="
		position: absolute;
	    z-index: 99;
	    left: 0;
	    top: 0;
	    height: 600px;
	    overflow-y: scroll;
	    background-color: white;
	    max-width: 60%">
		<input type="number" id="page-start" value="0">-<input type="number" id="page-end">
		<button onclick="getPage()">获取页面</button>
		<button onclick="downloadPage()">下载文件</button>
		<input type="checkbox" id="auto"/>自动模式
		<br/><span id="size"></span><br/>
		<img id="image"  alt="" src=""/>
	</div>
`;
document.body.appendChild(div);
let start = document.getElementById("page-start");
let end = document.getElementById("page-end");
let img = document.getElementById("image");
let auto = document.getElementById("auto");
let size = document.getElementById("size");
let error = 0;
img.onload = () => {
	size.innerHTML = img.offsetWidth + "*" + img.offsetHeight;
};
let pageInput = document.querySelector(".jump_input input");
let pageBtn = document.querySelector(".jump_input span");
let read = document.querySelector(".read_box");
let readLarge = document.querySelector(".right_control ul:nth-child(2) li");
(function larger() {
	if (read.offsetWidth < config.minWidth) {
		readLarge.dispatchEvent(new Event("click"));
		setTimeout(larger, 500);
	}
})();

function changePage(num) {
	pageInput.value = num;
	pageInput.dispatchEvent(new Event("input"));
	pageBtn.click();
}

function getPage() {
	let num = start.value;
	changePage(parseInt(num) + 1);
	let canvas = document.querySelector("#the-canvas" + num + " canvas");
	if (canvas) {
		error = 0;
		img.src = canvas.toDataURL();
		console.log("获取第", num, "页成功");
	} else {
		error++;
		if (error >= config.errMax) {
			console.error("加载第", num, "页", "重试次数超限，终止运行");
		} else {
			console.warn("获取第", num, "页出错，稍后重试");
			setTimeout(getPage, config.interval * 2);
		}
	}
	if (auto.checked) {
		setTimeout(downloadPage, config.interval);
	}
}

function downloadPage() {
	let save_link = document.createElement("a");
	save_link.href = img.src;
	save_link.download = config.filenameFront + start.value + config.filenameBack + ".png";
	save_link.click();
	if (auto.checked && parseInt(start.value) >= parseInt(end.value)) {
		console.info("遍历完毕");
	} else {
		start.value = parseInt(start.value) + 1;
		setTimeout(getPage, config.interval);
	}
}
