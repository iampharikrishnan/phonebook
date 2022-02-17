const request = require('supertest');
const app = require('../app');

describe('POST /signup', () => { 
    it('should return status code 201', async (done) => {
        const response = await request(app)
            .post('/signup')
            .send({
                username: 'test',
                password: 'test',
                email: 'test@gmail.com',
                phone: '1234567890'
            })
        expect(response.headers["Content-Type"]).toEqual(expect.stringContaining("json"));
    });
 })