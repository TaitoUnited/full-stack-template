import { expect } from "chai";
import "mocha";
import { asCamelCase } from "./formatters";

describe("formatters", () => {
  describe("#asCamelCase", () => {
    it("converts an object to camel case", async () => {
      expect(
        asCamelCase({
          first_name: "John",
          last_name: "Doe"
        })
      ).to.deep.equal({
        firstName: "John",
        lastName: "Doe"
      });
    });

    it("converts an array of objects to camel case", async () => {
      expect(
        asCamelCase([
          {
            first_name: "Matt"
          },
          {
            first_name: "Susan"
          }
        ])
      ).to.deep.equal([
        {
          firstName: "Matt"
        },
        {
          firstName: "Susan"
        }
      ]);
    });
  });
});
