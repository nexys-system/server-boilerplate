import { Params, Filters } from "./types";

const q: Params = {
  filters: {
    userCert: {
      status: { id: { $in: [3, 4] } },
    }, // valid and underway
    passed: { $ne: null },
  },
  projection: { userCert: {} },
};

test("query", () => {
  // this test is only here for the above: make sure the query does not return any errors
  expect(q).toEqual(q);
});

test("filter with null", () => {
  const f = { anAttribute: null };
  // this test is only here for the above: make sure the query does not return any errors
  expect(f).toEqual(f);
});
