let clientLocation = false;

async function init() {
  if (!navigator?.geolocation) {
    throw new Error('browser not supported');
    document.body.innerHTML = 'Your browser does not support geolocation.';
  }

  clientLocation = await getGeolocation(); // will prompt user if they haven't already granted perms
  let hasGeolocationPerms = !!location;
  if (!hasGeolocationPerms) return needsGeolocationPerms();

  setInterval(async () => {
    let loc = await getGeolocation();
    if (loc) clientLocation = loc;
  }, 10_000);
}

// returns {latitude, longitude, accuracy, ...}
async function getGeolocation() {
  let options = {
    enableHighAccuracy: true, // try to use GPS chip
    timeout: 10_000,
    maximumAge: 0 // don't use a cached position
  };
  try {
    let pos = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    );
    return pos.coords;
  } catch (e) {
    if (e.PERMISSION_DENIED) return false;
    throw new Error(`Unknown error: ${e.message}`);
  }
}

function needsGeolocationPerms() {
  document.body.innerText = 'This site does not have access to your location.\n\nPlease go to your browser\'s settings to allow location access.';
}

init();
