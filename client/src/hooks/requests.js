
const API_URL = 'http://localhost:7000/v1';

async function httpGetPlanets() {
  // Load planets and return as JSON.

  const response  = await fetch(`${API_URL}/planets`);
  return response.json();
}

async function httpGetLaunches() {

  const response = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a, b)=> {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(launch) {
  // Submit given launch data to launch system.
  try{
    return await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(launch),
    })
  }
  catch(err){
    return {
      ok: false,
    }
  }
  
}

async function httpAbortLaunch(id) {

  try{
    return await fetch(`${API_URL}/launches/${id}`,{
      method: "delete",
    })
  }
  catch(err){
    return {
      ok: false
    }
  }
 

  
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};