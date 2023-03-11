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

const potentialContent = [{query: function(valueText){return valueText.includes("WHERE") & valueText.includes("FAWFUL")}, 
content:"<p class=\"success-text\">ADMIN USER MISSING. LAST KNOWN LOCATION (3.165, -3.04, -0.0818). TRACES OF TEMPORAL MAGIC DETECTED.</span>"}]

function attemptFindContent(field, e){
	e = e || window.event;
	if (e.key === "Enter"){
		content = "<span class=\"error-text\" onanimationend=\"eraseMainContent()\">QUERY NOT FOUND</span>"
		valueText = field.value.toUpperCase();
		console.log(valueText);
		for(const item of potentialContent){
			if(item.query(valueText)){
				content = item.content;
			}
		}
		mainContent.innerHTML = content;
	}
}

function eraseMainContent(){
	mainContent.innerHTML = "";
}

