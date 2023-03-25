/* -- Glow effect -- */

const blob = document.getElementById("blob");
let frame = null;
window.onpointermove = event => { 
  const { clientX, clientY } = event;
  
  frame = requestAnimationFrame(() => {
    cancelAnimationFrame(frame);
    blob.animate({
      left: `${clientX}px`,
      top: `${clientY}px`
    }, { duration: 3000, fill: "forwards" });
  })
}
/* -- Text effect -- */

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let interval = null;

const screens = document.querySelectorAll(".screen");
screens.forEach(function(screen){
  screen.onmouseenter = event => {  
	if(screen.dataset.mode === "dormant"){
		let name = screen.querySelector(".name");
		name.dataset.iteration = 0;
		clearInterval(interval);
		
		interval = setInterval(() => {
		  name.innerText = name.innerText
			.split("")
			.map((letter, index) => {
			  if((index*3) < parseInt(name.dataset.iteration)) {
				return name.dataset.value[index];
			  }

			  return letters[Math.floor(Math.random() * 26)]
			})
			.join("");

		  if(parseInt(name.dataset.iteration) >= name.dataset.value.length * 3){ 
			clearInterval(interval);
		  }

		  name.dataset.iteration = parseInt(name.dataset.iteration) + 1;
		}, 30);
	  }
  }
  screen.onmouseleave = () => {
    clearInterval(interval);
    let name = screen.querySelector(".name");
    name.innerText = name.dataset.value;
  }
})

const locked = document.querySelector(".locked")

locked.onclick = function(){
  locked.classList.remove("shake");
  void locked.offsetWidth;
  locked.classList.add("shake");  
}

const examine = document.querySelector(".examine");
let mag = examine.querySelector(".magnifying-glass");
const examineClickContent = examine.querySelector(".examine-click-content");

magnifyingGlassListener = function(event){
  mag.classList.remove("fade-out");
  mag.classList.add("squish-flex-to-hide");
}


examine.onclick = function(){
	if(examine.dataset.mode === "dormant"){
		mag.addEventListener("transitionend", magnifyingGlassListener, {once:true});
		mag.classList.add("fade-out");
		let screenMove = examine.querySelector(".screen-move-group");
		screenMove.classList.add("squish-gap");
		examineClickContent.classList.add("examine-click-content-grow");
		let subcontent = examineClickContent.querySelector(".examine-click-subcontent");
		subcontent.classList.remove("hiding");
		examine.dataset.mode = "active"
	} else{
		
		
	}
}

const mainContent = examine.querySelector("#main-content");

var scanDisabled = false;
var metarenaEnabled = false;

const potentialContent = [
{
	query: function(valueText){
				return valueText.includes("FAWFUL")
			},
	content: "<p class=\"success-text\">ADMIN USER NAME DETECTED. FURTHER QUERY DETAILS REQUIRED.</p>"
},
{
	query: function(valueText){
		return valueText.match(/SCANDISABLED\((.*)\)/)
	},
	content: function(valueText){
		newScanValue = valueText.match(/SCANDISABLED\((.*)\)/)[1]
		if (newScanValue) {
			 globalThis.scanDisabled = JSON.parse(newScanValue.toLowerCase());
			 return `<p class=\"success-text\">SCANDISABLED SET TO ${scanDisabled.toString().toUpperCase()};</p>`
		}
		else{
			return `<p class=\"success-text\">SCANDISABLED CURRENTLY SET TO ${scanDisabled.toString().toUpperCase()};</p>`
		}
	}
},
{
	query:function(valueText){
				return valueText.match(/^SCAN\(.*\)/) || valueText.match(/^SCAN$/)
			},
	content: function(valueText){
		if (scanDisabled) {
			return "<p class=\"success-text\">SCANNING IS DISABLED. PLEASE REENABLE SCAN TO CONTINUE."
		} else {
			scanValue = valueText.match(/SCAN\((.*)\)/)
			if (!scanValue || !scanValue[1]){
				return "<p class=\"success-text\">USAGE: SCAN(&lt;target&gt;)</p>"
			} else {
				if (scanValue.includes("ARTEMIS")) {
					globalThis.scanDisabled = true;
					return "<span class=\"error-text\" onanimationend=\"eraseMainContent()\"> ABORT ABORT ABORT </span>";
				}
				return `<p class=\"success-text\">SCANNING FOR ${scanValue[1]}...</p>`
			}
		}
	}
},
{
	query: function(valueText){
				return (valueText.includes("WHERE") || (valueText.match(/SCAN\(.*\)/) && !scanDisabled)) &&
						valueText.includes("FAWFUL")
			}, 
	content: "<p class=\"success-text\">ADMIN USER MISSING. LAST KNOWN LOCATION: TELEPORTER - AISLE 24, SHELF D, BOX 6. TRACES OF TEMPORAL MAGIC DETECTED.</p>"
},
{
	query: function(valueText){
				return valueText.includes("3.137") &&
						valueText.includes("-3.04") && 
						(valueText.includes("-0.0818") || valueText.includes("-8.18E-2"))
			},
	content: "<p class=\"success-text\">COORDINATES MAP TO KNOWN STAR: LEO VI. <br/> <i class=\"fa-solid fa-camera primary-color\"></i> <br/> Screenshot this!</p>"
},
{
	query: function(valueText){
		return valueText.includes("METARENA") && !(globalThis.metarenaEnabled)
	},
	content: "<span class=\"error-text\" onanimationend=\"eraseMainContent()\"> ENTER PASSWORD TO ENABLE</span>"
},
{
	query: function(valueText){
		return valueText.includes("METARENA") && (globalThis.metarenaEnabled)
	},
	content: "<p class=\"success-text\">MICROMETARENA IS ENABLED. SUCCESS CODE 111703 <br/> <i class=\"fa-solid fa-camera primary-color\"></i> <br/> Screenshot this!</span>"
},
{
	query: function(valueText){
		return valueText.includes("PEAL") && !(globalThis.metarenaEnabled)
	},
	content: "<p class=\"success-text\">PASSWORD ACCEPTED, ADVANCED FEATURES UNLOCKED</span>"
},{
	query: function(valueText){
		return valueText.includes("PEAL")
	}
	content: "<p class=\"success-text\">Okay, I'm going to be real with you, this is a lot to type out. I have the short notes of what I'm looking to have here, but it's a lot. For now, IHAVEFURY is the password that unlocks the Metarena. Love you all, will let you know when this is actually updated with content.</p>"
}
]

function attemptFindContent(field, e){
	e = e || window.event;
	if (e.key === "Enter") {
		content = "<span class=\"error-text\" onanimationend=\"eraseMainContent()\">QUERY NOT FOUND</span>"
		valueText = field.value.toUpperCase();
		console.log(valueText);
		for(const item of potentialContent){
			if (item.query(valueText)) {
				if (item.content instanceof Function) {
					content = item.content(valueText);
				} else {
					content = item.content;
				}
				if ("onFind" in item) { 
					item.onFind(valueText)
				}
			}
		}
		mainContent.innerHTML = content;
	}
}

function eraseMainContent(){
	mainContent.innerHTML = "";
}

