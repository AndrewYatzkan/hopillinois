const font = new FontFace('VT323', 'url(fonts/VT323-Regular.ttf)');
font.load().then(font => document.fonts.add(font));

// document.addEventListener('touchmove', function (event) {
//   if (event.scale !== 1) { event.preventDefault(); }
// }, false);