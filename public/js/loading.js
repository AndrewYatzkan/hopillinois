(async () => {
	let playBtn = document.querySelector('.play');
	let loading = document.querySelector('div.loading');
	
	// await Promise.all(promises);
	await new Promise((resolve, reject) => {
		setTimeout(resolve, 1_000);
	});
	
	playBtn.classList.add('visible');
	playBtn.onclick = () => {
		loading.style.display = 'none';
		window.mode = 'regular';
		usertab.style.display = 'flex';
		createEventBtn.style.display = 'flex';
	}
})();