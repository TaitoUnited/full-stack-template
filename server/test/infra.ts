import { expect } from "chai";
import "mocha";
import requestBase from "request-promise";
import db from "../src/common/db";

const request = requestBase.defaults({
  baseUrl: `${process.env.TEST_API_URL}`,
  json: true,
  simple: false,
  resolveWithFullResponse: true
});

describe("infra", function infra() {
  // EXAMPLE: You can increase API timeout for slow API calls
  this.timeout(5000);

  describe("infra API", () => {
    it("GET /config returns APP_VERSION", async () => {
      const response = await request.get("/config");
      expect(response.statusCode).to.equal(200);
      expect(response.body.data.APP_VERSION).to.be.a("string");
    });

    it("GET /uptimez returns OK", async () => {
      const response = await request.get("/uptimez");
      expect(response.statusCode).to.equal(200);
      expect(response.body.status).to.equal("OK");
    });

    it("GET /healthz returns OK", async () => {
      const response = await request.get("/healthz");
      expect(response.statusCode).to.equal(200);
      expect(response.body.status).to.equal("OK");
    });
  });

  describe("db access for integration tests", () => {
    it("Check db access", async () => {
      await db.any("SELECT 1");
    });
  });
});
