window.onload = function () {
var chart = new CanvasJS.Chart("chartContainer", {
	animationEnabled: true,
	title:{
		text: ""
	},
	axisY: {
		title: "Temperature (in °C)",
		includeZero: false,
		suffix: " °C"
	},
	legend:{
		cursor: "pointer",
		fontSize: 16,
		itemclick: toggleDataSeries
	},
	toolTip:{
		shared: true
	},
	data: [{
		name: "Server Room",
		type: "spline",
		yValueFormatString: "#0.## °C",
		showInLegend: true,
		dataPoints: [
			{y: 31 },
			{y: 31 },
			{y: 29 },
			{y: 29 },
			{y: 31 },
			{y: 30 },
			{y: 29 }
		]
	}]
});
chart.render();

function toggleDataSeries(e){
	if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	} else {
		e.dataSeries.visible = true;
	}
	chart.render();
}

}

document.getElementById('about').style.display='none';
document.getElementById('grafik').style.display='none';
document.getElementById('home').style.display='block';
conSuhu(30);

var ws = new WebSocket("ws://localhost:8880");				
ws.onopen = function() {                  
	//ws.send("Message to send");
	console.log("Server connected");
};
ws.onmessage = function (evt) { 
	var msg = evt.data;
	console.log("Data received: " + msg);
	var obj = JSON.parse(msg);
	var tm = Math.round(obj.temperature * 100) / 100;
	var hm = Math.round(obj.humidity * 100) / 100;
	console.log(tm);
	console.log(hm);
	conSuhu(tm);
};
				
ws.onclose = function() {                   
	// websocket is closed.
	alert("Connection is closed..."); 
};
/*
	rumus rata-rata (mean)
			total data (x1+x2+x3+...xn)
	mean = ---------------------------
				jumlah data (n)
	;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
*/
	var jData = [{
					"suhu": "33",
					"updated": "2019-11-01 22:22:11"
				}, {
					"suhu": "34",
					"updated": "2019-11-01 22:23:11"
				}, {
					"suhu": "31",
					"updated": "2019-11-01 22:24:11"
				}, {
					"suhu": "32",
					"updated": "2019-11-01 22:25:11"
				}, {
					"suhu": "36",
					"updated": "2019-11-01 22:26:11"
				}, {
					"suhu": "30",
					"updated": "2019-11-01 22:27:11"
				}];
	//var dataSuhu = JSON.parse(jData);
	var dataSuhu = jData;
	var t = dataSuhu.length;
	var tsuhu = 0;
	for (a = 0; a < t; a++){
		tsuhu += parseInt(dataSuhu[a].suhu);
	}
	var mean = tsuhu / t;							//rumus rata2
	
	date1 = new Date("2019-11-02 11:00:00");
	date2 = new Date("2019-11-02 13:00:00");
	date3 = new Date("2019-11-07 13:00:00");
	var h1 = hitungJam(3, date1, "maju");
	var h2 = hitungJam(7, date2, "mundur");
	var d1 = hitungHari(2, date3, "mundur");
	var d2 = hitungHari(7, date1, "maju");
	var m1 = hitungBulan(1, date1, "maju");
	var m2 = hitungBulan(4, date1, "mundur");
	/*
	//console.log(dataSuhu);
	console.log(tsuhu);
	console.log(t);
	console.log(mean);								//nilai real
	console.log(mean.toFixed(2));					//desimal 2
	console.log(Math.round(mean));					//bulat
	console.log(new Date(h1));
	console.log(new Date(h2));
	console.log(new Date(d1));
	console.log(new Date(d2));
	console.log(new Date(m1));
	console.log(new Date(m2));
	*/
//hitung bulan
function hitungBulan(berapaBulan, tanggal, adj){
	var mm = tanggal;
	if(adj == "maju"){
		mm.setMonth(mm.getMonth() + berapaBulan);
	}
	else if(adj == "mundur"){
		mm.setMonth(mm.getMonth() - berapaBulan);
	}
	return mm.toString();
}
//hitung hari
function hitungHari(berapaHari, tanggal, adj){
	var dd = tanggal;
	if(adj == "maju"){
		dd.setDate(dd.getDate() + berapaHari);
	}
	else if(adj == "mundur"){
		dd.setDate(dd.getDate() - berapaHari);
	}
	return dd.toString();
}
//hitung jam
function hitungJam(berapaJam, tanggal, adj){
	var ms = 3600000 * berapaJam;
	var tgj = new Date(tanggal);
	var res;
	if(adj == "maju"){
		res = tgj.getTime() + ms;
	}
	else if(adj == "mundur"){
		res = tgj.getTime() - ms;
	}
	return res;
}
	
//konversi suhu
function conSuhu(celcius){
	var c = celcius;
	var f = (c * 9 / 5) + 32;
	var k = c + 273.15;
	var r = c * 0.8;
	var today = new Date();
	var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = time + " " + date;
	document.getElementById("suhu").innerHTML = c + "°C";
	document.getElementById("lastSuhu").innerHTML = Math.round(f * 100) / 100 + " °Fahrenheit | " 
													+ Math.round(k * 100) / 100 + " Kelvin | " 
													+ Math.round(r * 100) / 100 + " Reamur";
	document.getElementById("waktuSuhu").innerHTML = dateTime;
}

//show hide konten
function openPage(hal){
	switch(hal) {
		case 'home':
			document.getElementById('about').style.display='none';
			document.getElementById('grafik').style.display='none';
			document.getElementById('home').style.display='block';
			break;
		case 'grafik':
			document.getElementById('about').style.display='none';
			document.getElementById('grafik').style.display='block';
			document.getElementById('home').style.display='none';
			break;
		case 'about':
			document.getElementById('about').style.display='block';
			document.getElementById('grafik').style.display='none';
			document.getElementById('home').style.display='none';
			break;
		default:
		// code block
			break;
	} 
}

// Close side navigation
function w3_close() {
	document.getElementById("mySidebar").style.display = "none";
}

// Used to toggle the menu on smaller screens when clicking on the menu button
function openNav() {
	var x = document.getElementById("navDemo");
	if (x.className.indexOf("w3-show") == -1) {
		x.className += " w3-show";
	} else { 
		x.className = x.className.replace(" w3-show", "");
	}
}
