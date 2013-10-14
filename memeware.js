var memeware = {
	init: function(element) {
		var imgs = [];
		var i = 0;
		var canv = null;
		var ctx = null;

		if(!element) {
			console.log("memeware: no element to live in");
			return;
		}
		this.element = element;
		this.element.style.fontFamily = "sans-serif";

		imgs = element.querySelectorAll("img");
		this.data = [];
		this.games = [];
		for(i = 0; i < imgs.length; i++) {
			canv = document.createElement("canvas");
			canv.width = 512;
			canv.height = 256;
			ctx = canv.getContext("2d");
			ctx.drawImage(imgs[i], 0, 0, imgs[i].width, imgs[i].height,
						  0, 0, canv.width, canv.height);
			this.games.push(canv);
		}
		if(!i) {
			canv = document.createElement("canvas");
			canv.width = 512;
			canv.height = 256;
			this.games.push(canv);
		}
		this.currentGame = 0;
		this.canvas = this.games[this.currentGame];
		this.ctx = this.canvas.getContext("2d");

//		this.game.load(this.canvas.ctx);
		this.render();
	},

	render: function(render) {
		var elm = this.element;
		var node = null;
		var sub = null;
		var ctx = null;
		var data = null;
		var i = 0;

		while(elm.firstChild) {
			elm.removeChild(elm.firstChild);
		}

		var view = document.createElement("div");
		view.className = "view";
		node = this.games[this.currentGame];
		this.canvas = node;
		this.ctx = this.canvas.getContext("2d");
//		this.game.load(this.ctx);
		//this.ctx.fillStyle = "#888";
		//this.ctx.fillRect(0, 0, 256, 256);
		view.appendChild(node);
		elm.appendChild(view);

		elm.appendChild(document.createTextNode("games:"));
		node = document.createElement("select");
		node.onchange = this.handleChangeGame.bind(this);
		for(i = 0; i < this.games.length; i++) {
			sub = document.createElement("option");

			ctx = this.games[i].getContext("2d");
			data = this.game.load(ctx) || {};
			this.data.push(data);
			if(i === this.currentGame) {
				sub.selected = true;
			}
			sub.value = i;
			sub.innerHTML = data.title || i;
			node.appendChild(sub);
		}

		elm.appendChild(node);
		node = document.createElement("button");
		node.appendChild(document.createTextNode("Delete"));
		node.onclick = this.handleDeleteGame.bind(this);
		elm.appendChild(node);
		node = document.createElement("button");
		node.appendChild(document.createTextNode("New"));
		node.onclick = this.handleNewGame.bind(this);
		elm.appendChild(node);

		var edit = document.createElement("div");
		edit.appendChild(document.createTextNode("title:"));
		node = document.createElement("input");
		node.className = "title";
		node.onchange = this.handleChangeTitle.bind(this);
		edit.appendChild(node);
		elm.appendChild(edit);

		this.fillForm(this.data[this.currentGame]);
	},

	fillForm: function(data) {
		var elm = this.element;
		elm.querySelector(".title").value = data.title || "";
	},

	handleChangeGame: function(e) {
		this.currentGame = parseInt(e.target.value, null);

		var view = this.element.querySelector(".view");
		while(view.firstChild) {
			view.removeChild(view.firstChild);
		}

		var game = this.games[this.currentGame];
		view.appendChild(game);
		this.canvas = game;
		this.ctx = this.canvas.getContext("2d");

		this.fillForm(this.data[this.currentGame]);
	},
	handleDeleteGame: function(e) {
		this.games.splice(e.target.value, 1);
		if(this.currentGame >= this.games.length) {
			this.currentGame = this.games.length - 1;
		}
	},
	handleNewGame: function(e) {
		var canv = document.createElement("canvas");
		canv.width = 512;
		canv.height = 256;
		this.games.push(canv);
		this.currentGame = this.games.length - 1;
		this.render();
	},

	handleChangeTitle: function(e) {
		var title = e.target.value;
		var data = this.data[this.currentGame];

		title = title.substring(0, 32);
		e.target.value = title;

		data.title = title;
		this.game.save(this.ctx, data);
		this.render();
/*
		var hex = this.hex.pad(this.hex.encodeHex(title), 64, "0");
		//console.log(this.hex.encodeHex(title));
		//console.log(this.hex.pad(this.hex.encodeHex(title), 64, "0"));
		var i = 0;
		var color = null;
		for(i = 0; i * 6 < hex.length; i ++) {
			color = hex.substring(i * 6, (i * 6) + 6);
			//console.log(color);
			this.ctx.fillStyle = "#" + color;
			this.ctx.fillRect(256 + 128 + i, 128, 1, 1);
		}
		this.canvas.title = title;
		this.render();
*/
	},

	hex: {
		digitArray: ["0","1","2","3","4","5","6","7",
					 "8","9","a","b","c","d","e","f"],
		toHex: function(n) {
			var result = "";
			var start = true;
			var i = 0;
			for(i = 32; i > 0;) {
				i -= 4;
				var digit = (n >> i) & 0xf;
				if(!start || digit != 0) {
					start = false;
					result += this.digitArray[digit];
				}
			}
			return (result === "" ? "0" : result);
		},
		pad: function(str, len, pad) {
			var result = str;
			var i = 0;
			for(i = str.length; i < len; i++) {
				result = pad + result;
			}
			return result;
		},
		encodeHex: function(str) {
			var result = "";
			var i = 0;
			for(i = 0; i < str.length; i++) {
				result += this.pad(this.toHex(str.charCodeAt(i)&0xff), 2, "0");
			}
			return result;
		},
		hexv: {
			"00":0,"01":1,"02":2,"03":3,"04":4,"05":5,"06":6,"07":7,
			"08":8,"09":9,"0A":10,"0B":11,"0C":12,"0D":13,"0E":14,"0F":15,
			"10":16,"11":17,"12":18,"13":19,"14":20,"15":21,"16":22,"17":23,
			"18":24,"19":25,"1A":26,"1B":27,"1C":28,"1D":29,"1E":30,"1F":31,
			"20":32,"21":33,"22":34,"23":35,"24":36,"25":37,"26":38,"27":39,
			"28":40,"29":41,"2A":42,"2B":43,"2C":44,"2D":45,"2E":46,"2F":47,
			"30":48,"31":49,"32":50,"33":51,"34":52,"35":53,"36":54,"37":55,
			"38":56,"39":57,"3A":58,"3B":59,"3C":60,"3D":61,"3E":62,"3F":63,
			"40":64,"41":65,"42":66,"43":67,"44":68,"45":69,"46":70,"47":71,
			"48":72,"49":73,"4A":74,"4B":75,"4C":76,"4D":77,"4E":78,"4F":79,
			"50":80,"51":81,"52":82,"53":83,"54":84,"55":85,"56":86,"57":87,
			"58":88,"59":89,"5A":90,"5B":91,"5C":92,"5D":93,"5E":94,"5F":95,
			"60":96,"61":97,"62":98,"63":99,"64":100,"65":101,"66":102,"67":103,
			"68":104,"69":105,"6A":106,"6B":107,"6C":108,"6D":109,"6E":110,"6F":111,
			"70":112,"71":113,"72":114,"73":115,"74":116,"75":117,"76":118,"77":119,
			"78":120,"79":121,"7A":122,"7B":123,"7C":124,"7D":125,"7E":126,"7F":127,
			"80":128,"81":129,"82":130,"83":131,"84":132,"85":133,"86":134,"87":135,
			"88":136,"89":137,"8A":138,"8B":139,"8C":140,"8D":141,"8E":142,"8F":143,
			"90":144,"91":145,"92":146,"93":147,"94":148,"95":149,"96":150,"97":151,
			"98":152,"99":153,"9A":154,"9B":155,"9C":156,"9D":157,"9E":158,"9F":159,
			"A0":160,"A1":161,"A2":162,"A3":163,"A4":164,"A5":165,"A6":166,"A7":167,
			"A8":168,"A9":169,"AA":170,"AB":171,"AC":172,"AD":173,"AE":174,"AF":175,
			"B0":176,"B1":177,"B2":178,"B3":179,"B4":180,"B5":181,"B6":182,"B7":183,
			"B8":184,"B9":185,"BA":186,"BB":187,"BC":188,"BD":189,"BE":190,"BF":191,
			"C0":192,"C1":193,"C2":194,"C3":195,"C4":196,"C5":197,"C6":198,"C7":199,
			"C8":200,"C9":201,"CA":202,"CB":203,"CC":204,"CD":205,"CE":206,"CF":207,
			"D0":208,"D1":209,"D2":210,"D3":211,"D4":212,"D5":213,"D6":214,"D7":215,
			"D8":216,"D9":217,"DA":218,"DB":219,"DC":220,"DD":221,"DE":222,"DF":223,
			"E0":224,"E1":225,"E2":226,"E3":227,"E4":228,"E5":229,"E6":230,"E7":231,
			"E8":232,"E9":233,"EA":234,"EB":235,"EC":236,"ED":237,"EE":238,"EF":239,
			"F0":240,"F1":241,"F2":242,"F3":243,"F4":244,"F5":245,"F6":246,"F7":247,
			"F8":248,"F9":249,"FA":250,"FB":251,"FC":252,"FD":253,"FE":254,"FF":255
		},
		ntos: function(n) {
			n = n.toString(16);
			if(n.length == 1) {
				n = "0" + n;
			}
			n = "%" + n;
			return unescape(n);
		},
		decodeHex: function(str){
			str = str.toUpperCase().replace(new RegExp("s/[^0-9A-Z]//g"));
			var result = "";
			var nextchar = "";
			var i = 0;
			for(i = 0; i < str.length; i++) {
				nextchar += str.charAt(i);
				if(nextchar.length == 2) {
					result += this.ntos(this.hexv[nextchar]);
					nextchar = "";
				}
			}
			return result;
		}
	},

	game: {
		load: function(ctx) {
			try {
				var x = 0;
				var y = 0;
				var img = null;
				var i = 0;
				var enc = "";
				var raw = "";
				var data = null;

//				this.data = {};

				img = ctx.getImageData(256 + 128, 128, 128, 128).data;

				for(i = 0; i < img.length; i += 4) {
					enc += memeware.hex.pad(memeware.hex.toHex(img[i]),
											2, "0");
					enc += memeware.hex.pad(memeware.hex.toHex(img[i+1]),
											2, "0");
					enc += memeware.hex.pad(memeware.hex.toHex(img[i+2]),
											2, "0");
					//i+3 is alpha, ignore
				}
				raw = memeware.hex.decodeHex(enc);
				raw = raw.substring(raw.indexOf("{"));
				raw = raw.substring(0, raw.lastIndexOf("}") + 1);
				console.log("load:" + raw);
				try {
					data = JSON.parse(raw);
				} catch(err) {
					console.log("could not parse json. blank?");
				}
			} catch(e) {
				alert("failed to load game.\n" + e.message);
			}
//			this.data = data;
			return data;
		},
		save: function(ctx, data) {
//			var data = JSON.stringify(this.data) + "      ";
			data += "      ";
			var enc = memeware.hex.encodeHex(data);
			var arr = [];
			var x = 0;
			var y = 0;
			var color = null;

			console.log("save:" +data);
			if(enc.length > 128*128 * 3*2) {
				alert("data too big, bitch at penduin.\n" + data);
				return;
			}

			do {
				arr.push(enc.substring(0, 128 * 3*2));
				enc = enc.substring(128 * 3*2);
			} while(enc.length > 128 * 3*2);

			ctx.save();
			for(y = 0; y < arr.length; y++) {
				for(x = 0; x * 6 < arr[y].length; x++) {
					color = arr[y].substring(x * 6, (x * 6) + 6);
					ctx.fillStyle = "#" + color;
					ctx.fillRect(256 + 128 + x, 128 + y, 1, 1);
				}
			}
			ctx.restore();
		}
	}
};

//document.addEventListener("load", memeware.init);
document.addEventListener("DOMContentLoaded", function() {
	memeware.init(document.querySelector(".memeware"));
});