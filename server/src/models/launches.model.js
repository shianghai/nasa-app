const axios = require('axios');

const launches = require('./launches.mongo');
const planetsDb = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches(){
    console.log('Downloading launch Data');
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [{
                path:'rocket',
                    select: {
                        'name': 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    });
    
    if(response.status !== 200) {
        console.log("Something went wrong trying to download launches");
        throw new Error("Launches data download failed");
    }
    const launchDocs = response.data.docs;
    for(const launchDoc of launchDocs){
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload)=>{
            return payload['customers']
        });

        const launch = {
            flightNumber : launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            succes: launchDoc['success'],
            customers
        }
        console.log(`${launch.flightNumber} ${launch.mission}`)
        await saveLaunch(launch);
    }
}

async function loadLaunchesData(){
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        mission: 'FalconSat',
    });

    if(firstLaunch){
        console.log('launch data already exists');
    }
    else{
        await populateLaunches();
    }
    
   
}


async function saveLaunch(launch){
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true
    });
}

async function getAllLaunches(skip, limit){
    return await launches
        .find({}, {'__v': 0,'_id': 0})
        .sort({flightNumber: 1})
        .skip(skip)
        .limit(limit);
}

async function findLaunch(filter){
    return await launches.findOne(filter)
}

async function existsLaunchWithId(launchId){
    return await findLaunch({
        flightNumber: launchId
    });
}

async function scheduleNewLaunch(launch){
    const planet = await planetsDb.findOne({
        keplerName: launch.target
    });
    if(!planet){
        throw new Error('target planet not found');
    }

    const newFlightNumber = await getLatestFlightNumber() + 1;

    console.log(newFlightNumber)

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['ZTM', 'ATM'],
        flightNumber: newFlightNumber
    });


    await saveLaunch(newLaunch);
}

async function getLatestFlightNumber(){
    const latestLaunch = await launches.findOne().sort('-flightNumber');

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function abortLaunchById(launchId){
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;
    const aborted = await launches.updateOne({
        flightNumber: launchId,
    },
    {
        upcoming: false,
        success: false,
    });

    return aborted.ok === 1 && aborted.nModified === 1;
}

module.exports = {
   getAllLaunches, 
   existsLaunchWithId,
   abortLaunchById,
   saveLaunch,
   scheduleNewLaunch,
   loadLaunchesData,
};