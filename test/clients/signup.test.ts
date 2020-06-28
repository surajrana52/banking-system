import request from "supertest";
import app from "../../src/app";

describe("Client SignUp", () => {

    it("should return 200 OK", async () => {
         await request(app)
            .post('/api/v1/signup')
            .send({
                fullName: "Suraj Rana",
                email: "suraj@abc.com",
                password: "123456",
                accountType: 1
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
    });

});
