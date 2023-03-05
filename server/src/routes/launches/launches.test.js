const request  = require('supertest');
const app  = require("../../app");
const {connectToMongo, disconnectFromMongo} = require('../../services/mongo');
const {loadPlanetsData} = require('../../models/planets.model'); 

describe("Launches API", ()=>{
    beforeAll(async()=>{
        await connectToMongo();
        await loadPlanetsData();
    });

    describe("Test Get /launches", ()=>{
        test("It should respond with 200 success", async()=>{
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });
    
    describe("Test Post /launches", ()=>{
        const completeLaunchData = {
            mission: 'Space Exploration',
            target: 'Kepler-62 f',
            rocket: 'Splorer 342',
            launchDate: 'December 21, 2030',
        }
    
        const launchDatawithoutDate = {
            mission: "Space Exploration",
            target: "Kepler-62 f",
            rocket: "Splorer 342",
        }
    
        const launchDataWithInvalidDate = {
            mission: 'Space Exploration',
            target: 'Kepler-62 f',
            rocket: 'Splorer 342',
            launchDate: 'anggular',
        }
    
        test("It should respond with 201 created and Content Type json", async()=>{
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
    
            expect(response.body).toMatchObject(launchDatawithoutDate);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
    
            expect(responseDate).toBe(requestDate);
        });
    
        test("It should catch missing required properties", async()=>{
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDatawithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);
    
            expect(response.body).toStrictEqual({
                error: "missing required launch property"
            });
        });
    
        test("It should catch invalid dates", async()=>{
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400);
    
            expect(response.body).toStrictEqual({
                error: "not a valid date"
            });
        });
    
    });

    afterAll(async()=>{
        await disconnectFromMongo();
    })
});

