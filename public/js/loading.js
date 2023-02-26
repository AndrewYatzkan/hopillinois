(async () => {
	let playBtn = document.querySelector('.play');
	let loading = document.querySelector('div.loading');
	
	// await Promise.all(promises);
	
	playBtn.classList.add('visible');
	playBtn.onclick = () => {
		loading.style.display = 'none';
		window.mode = 'regular';
		usertab.style.display = 'flex';
		createEventBtn.style.display = 'flex';
	}

	let animate = ({timing, draw, duration}) => {

		let start = performance.now();
	  
		requestAnimationFrame(function animate(time) {
		  // timeFraction goes from 0 to 1
		  let timeFraction = (time - start) / duration;
		  if (timeFraction > 1) timeFraction = 1;
	  
		  // calculate the current animation state
		  let progress = timing(timeFraction)
	  
		  draw(progress); // draw it
	  
		  if (timeFraction < 1) {
			requestAnimationFrame(animate);
		  }
	  
		});
	  }
	
	let moveOut = (x, timeFraction) => {
		return Math.pow(timeFraction, 2) * ((x + 1) * timeFraction - x);
	}
})();