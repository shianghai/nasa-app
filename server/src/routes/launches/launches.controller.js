const {getAllLaunches, scheduleNewLaunch, existsLaunchWithId, abortLaunchById, saveLaunch} = require('../../models/launches.model');
const {getPagination} = require('../../services/query');

async function httpGetAllLaunches(req, res){
    const {skip, limit} = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit)
    return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res){
    const launch  = req.body;

    if(!launch.mission || !launch.launchDate || !launch.target || !launch.rocket){
        return res.status(400).json({
            error: "missing required launch property"
        })
    }

    
    if(isNaN(new Date(launch.launchDate).valueOf())){
        return res.status(400).json({
            error: "not a valid date"
        });
    }
    launch.launchDate = new Date(launch.launchDate)

    
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}


 

async function httpAbortLaunch(req, res){
    const launchId = +req.params.id
    const existsLaunch = await existsLaunchWithId(launchId)
    if(!existsLaunch){
        return res.status(404).json({
            error: "launch not found"
        }); 
    }
    const aborted = await abortLaunchById(launchId);
    if(!aborted){
        return res.status(400).json({
            error: 'launch not aborted'
        });
    }
    return res.status(200).json({
        ok: true
    });
}

module.exports = {
    httpGetAllLaunches, 
    httpAddNewLaunch,
    httpAbortLaunch
}