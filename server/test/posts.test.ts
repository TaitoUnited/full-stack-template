import { expect } from "chai";
import "mocha";
import requestBase from "request-promise";

const request = requestBase.defaults({
  baseUrl: `${process.env.TEST_API_URL}`,
  json: true,
  simple: false,
  resolveWithFullResponse: true
});

describe("posts", () => {
  before(async () => {
    // Nothing to do. Just an example.
    expect(true).to.equal(true);
  });

  after(async () => {
    // Nothing to do. Just an example.
    expect(true).to.equal(true);
  });

  beforeEach(async () => {
    // Nothing to do. Just an example.
    expect(true).to.equal(true);
  });

  it("GET /posts returns some posts", async () => {
    const response = await request.get("/posts");
    expect(response.statusCode).to.equal(200);
    // TODO: We should add some posts first to make sure that there
    // are some posts to retrieve. Now we can only check that it returns
    // an array.
    expect(response.body.data).to.be.an("array");
  });
});
