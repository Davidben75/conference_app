import { addDays, addHours } from "date-fns";
import app from "../infrastrcuture/express_api/app";
import request from "supertest";

describe("Feature : Organize conference", () => {
    it("Should organize a conference", async () => {
        const result = await request(app)
            .post("/conference")
            .send({
                title: "My first conference",
                seats: 100,
                startDate: addDays(new Date(), 4).toISOString(),
                endDate: addDays(addHours(new Date(), 2), 4).toISOString(),
            });

        expect(result.status).toBe(201);
        expect(result.body).toEqual({ id: expect.any(String) });
    });
});
