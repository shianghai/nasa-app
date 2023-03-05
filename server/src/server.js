const http  = require('http');
require('dotenv').config();

const app = require('./app');

const {connectToMongo} = require('./services/mongo')

const {loadPlanetsData} = require('./models/planets.model');
const {loadLaunchesData} = require('./models/launches.model'); 

const PORT = process.env.PORT || 7000;

const server = http.createServer(app);

async function startServer(){
    await connectToMongo();
    await loadPlanetsData();
    await loadLaunchesData();
    server.listen(PORT, ()=>{
        console.log(`listening on port ${PORT}`);
    });
}

startServer();


