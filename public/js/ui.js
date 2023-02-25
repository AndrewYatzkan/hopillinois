const font = new FontFace('VT323', 'url(fonts/VT323-Regular.ttf)');
font.load().then(font => {
  document.fonts.add(font);
  document.querySelector('div.loading span').classList.add('visible');
});

let createEventBtn = document.querySelector('');

// document.querySelector('.usertab').onclick = () => alert(1);

// document.addEventListener('touchmove', function (event) {
//   if (event.scale !== 1) { event.preventDefault(); }
// }, false);