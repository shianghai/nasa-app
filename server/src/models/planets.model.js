const {parse} = require('csv-parse');
const fs = require('fs');
const path = require('path');

const planets = require('./planets.mongo');

function isHabitable(planet){
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 
        && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6

}

const habitablePlanets = [];

async function loadPlanetsData(){
    return new Promise((resolve, reject)=>{
        fs.createReadStream(path.join(__dirname,'..', 'data', 'kepler_data.csv'))
        .pipe(parse({
            columns: true,
            comment: "#"
        }))
        .on('data', async(data)=>{
            if(isHabitable(data)){
                await savePlanet(data);
            }
        })
        .on('error', error => console.log(error))
        .on('end', async()=>{
            const habitablePlanetsCount = (await getAllPlanets()).length;
            console.log(`${habitablePlanetsCount} planets are habitable!`);
            resolve();
        });

    });
}

async function savePlanet(planet){
    try{
       await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        },{
            upsert: true
        });
    }
    catch(err){
        console.log(`Could not save planet data: ${err}`);
    }
}

async function getAllPlanets(){
    return await planets.find({}, {
        '__v': 0, '_id' : 0
    });
}
 
module.exports = {
    loadPlanetsData,
    getAllPlanets,
}