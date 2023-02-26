const font = new FontFace('VT323', 'url(fonts/VT323-Regular.ttf)');
font.load().then(font => {
  document.fonts.add(font);
  document.querySelector('div.loading span').classList.add('visible');
});

let overlay = document.querySelector('.overlay');
let usertab = document.querySelector('.usertab');
let createEventBtn = document.querySelector('button.create-event');
let promptEl = document.querySelector('div.prompt');
let step = document.querySelector('span.step');
let instruction = document.querySelector('span.instruction');
let promptBtn = document.querySelector('.response button');
let promptInput = promptEl.querySelector('input');
let responseEl = document.querySelector('.response');
let eventConfirm = document.querySelector('.event-confirm');

let confirmEvent = document.querySelector('.event-confirm .confirm');
let cancelEvent = document.querySelector('.event-confirm .cancel');

let event;

createEventBtn.onclick = () => {
  event = {};
  createEventBtn.style.display = 'none';

  step.innerText = '1 / 4';
  instruction.innerText = 'Name Your Event.';
  promptInput.placeholder = 'frisbee on the quad'

  promptEl.style.display = 'flex';
  usertab.style.display = 'none';
}

window.mode = 'zoomed out';
window.pinLoc = [0, 0];
window.ringRadius = 64 * 2.5;

confirmEvent.onclick = () => {
  resetEventCreation();
  event.radius = window.ringRadius / TILE_SIZE;

  let start = Date.now();
  let end = Date.now() + 1000 * 60 * 5; // 5 mins

  createEvent(event.name, event.description, event.location, event.radius, start, end);
  event = {};
}

cancelEvent.onclick = () => {
  resetEventCreation();
  event = {};
}

function resetEventCreation() {
  promptBtn.style.display = 'inline';
  promptBtn.innerHTML = '<img src="assets/rightarrow.png"></img>';
  promptInput.style.display = 'inline';
  createEventBtn.style.display = 'block';
  promptEl.style.display = 'none';
  usertab.style.display = 'flex';
  responseEl.style.display = 'flex';
  promptBtn.style.width = '3rem';
  window.mode = 'regular';
  eventConfirm.style.display = 'none';
  overlay.style.background = 'transparent';
}

promptBtn.onclick = () => {
  let stepNumber = parseInt(step.innerText[0]);
  if (stepNumber === 1) {
    // TODO: validate event name (is it empty, profain, etc.)
    event.name = promptInput.value;
    promptInput.value = '';

    step.innerText = '2/4';
    instruction.innerText = 'Describe It';
    promptInput.placeholder = 'casual frisbee sesh for the next 30 mins!'
    // backarrow.style.display = 'flex'
  } else if (stepNumber === 2) {
    event.description = promptInput.value;
    promptInput.value = '';

    step.innerText = '3/4';
    instruction.innerText = 'Where Is It? (drag)';
    promptInput.style.display = 'none';
    promptBtn.innerHTML = '<img src="assets/pin.png">&nbsp;here';
    promptBtn.style.width = '100%';
    

    overlay.style.background = 'rgba(0, 0, 0, 0.4)';
    window.mode = 'drop pin';
  } else if (stepNumber === 3) {
    window.mode = 'select radius'
    event.location = window.pinLoc;
    step.innerText = '4/4';
    instruction.innerText = 'Select Event Radius';
    responseEl.style.display = 'none';
    promptBtn.style.display = 'none';

    eventConfirm.style.display = 'flex';
  }
}

// document.querySelector('.usertab').onclick = () => alert(1);

// document.addEventListener('touchmove', function (event) {
//   if (event.scale !== 1) { event.preventDefault(); }
// }, false);