let promises = []; // for loading

let clientLocation = false;

async function init() {
  if (!navigator?.geolocation) {
    throw new Error('browser not supported');
    document.body.innerHTML = 'Your browser does not support geolocation.';
  }

  // // FOR TESTING
  // clientLocation = {latitude: 40.11189902507066, longitude: -88.22705020329083};
  // setInterval(() => {
  //   clientLocation = {
  //     latitude: 40.11037078334671 + Math.random() * 0.002392755242,
  //     longitude: -88.22878141253977 + Math.random() * 0.003106385747
  //   }
  // }, 2_000);
  // return;
  // // FOR TESTING

  let promise = new Promise(async (resolve, reject) => {
    let loc = await getGeolocation(); // will prompt user if they haven't already granted perms
    if (!!loc) resolve(loc);
    else reject();
  });
  promises.push(promise);

  clientLocation = await promise;
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
