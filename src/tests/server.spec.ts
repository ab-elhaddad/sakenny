import app from "../index";
import supertest from "supertest";

const request = supertest(app);

describe("Testing Server", () => {
    it("Server Should Return 200", async () => {
        expect((await request.get('/')).statusCode).toBe(200);
    })
})