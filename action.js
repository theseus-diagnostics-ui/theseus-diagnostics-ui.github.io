/* -- Glow effect -- */

const blob = document.getElementById("blob");

window.onpointermove = event => { 
  const { clientX, clientY } = event;
  
  blob.animate({
    left: `${clientX}px`,
    top: `${clientY}px`
  }, { duration: 3000, fill: "forwards" });
}

/* -- Text effect -- */

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let interval = null;

const screens = document.querySelectorAll(".screen");
screens.forEach(function(screen){
  screen.onmouseenter = event => {  
    let name = screen.querySelector(".name");
    name.dataset.iteration=0;
    clearInterval(interval);

    interval = setInterval(() => {
      name.innerText = name.innerText
        .split("")
        .map((letter, index) => {
          if(index < parseInt(name.dataset.iteration)) {
            return name.dataset.value[index];
          }

          return letters[Math.floor(Math.random() * 26)]
        })
        .join("");

      if(parseInt(name.dataset.iteration) >= name.dataset.value.length){ 
        clearInterval(interval);
      }

      name.dataset.iteration = parseInt(name.dataset.iteration) + 1;
    }, 30);
  }
}
               )

const locked = document.querySelector(".locked")

locked.onclick = function(){
  locked.classList.remove("shake");
  void locked.offsetWidth;
  locked.classList.add("shake");  
}

const examine = document.querySelector(".examine")

examine.onclick = function(){
  
}
