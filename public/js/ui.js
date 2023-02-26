const font = new FontFace('VT323', 'url(fonts/VT323-Regular.ttf)');
font.load().then(font => {
  document.fonts.add(font);
  document.querySelector('div.loading span').classList.add('visible');
});

let createEventBtn = document.querySelector('button.create-event');
let promptEl = document.querySelector('div.prompt');
let step = document.querySelector('span.step');
let instruction = document.querySelector('span.instruction');
let promptBtn = document.querySelector('.response button');
let promptInput = promptEl.querySelector('input');

let event;

createEventBtn.onclick = () => {
  event = {};
  createEventBtn.style.display = 'none';

  step.innerText = '1/5';
  instruction.innerText = 'Name Your Event';
  promptInput.placeholder = 'frisbee on the quad'

  promptEl.style.display = 'flex';
}

promptBtn.onclick = () => {
  let stepNumber = parseInt(step.innerText[0]);
  if (stepNumber === 1) {
    // TODO: validate event name (is it empty, profain, etc.)
    event.name = promptInput.value;
    promptInput.value = '';

    step.innerText = '2/5';
    instruction.innerText = 'Describe It';
    promptInput.placeholder = 'casual frisbee sesh for the next 30 mins!'
  }
}

// document.querySelector('.usertab').onclick = () => alert(1);

// document.addEventListener('touchmove', function (event) {
//   if (event.scale !== 1) { event.preventDefault(); }
// }, false);