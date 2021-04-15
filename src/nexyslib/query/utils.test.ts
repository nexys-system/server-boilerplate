import * as Q from "./utils";
import * as T from "./types";

test("paramsFromFilters - id", () => {
  const id = 34;
  const filters = { id };
  expect(Q.paramsFromFilters(id)).toEqual(filters);
});

test("paramsFromFilters - uuid", () => {
  const uuid = "34";
  const filters = { uuid };
  expect(Q.paramsFromFilters(uuid)).toEqual(filters);
});

test("paramsFromFilters - misc", () => {
  const filters = { a: "a", b: "b" };
  expect(Q.paramsFromFilters(filters)).toEqual(filters);
});

test("deleteById", () => {
  const q = {
    MyEntity: {
      delete: {
        filters: {
          id: 2,
        },
      },
    },
  };

  expect(Q.deleteById("MyEntity", 2)).toEqual(q);
});

describe("access data", () => {
  const entity = "MyEntity";

  test("getList", () => {
    const data = { [entity]: [] };
    expect(Q.getList(data, entity)).toEqual([]);
  });

  test("getList - error", () => {
    const data = {};

    try {
      Q.getList(data, entity);
    } catch (err) {
      expect(err.body).toEqual(
        "The requested resource `MyEntity` does not exist"
      );
    }
  });

  test("getDetail", () => {
    const detail = { id: 1 };

    const data = {
      [entity]: [detail],
    };

    expect(Q.getDetail(data, entity)).toEqual(detail);
  });

  test("getDetail - error", () => {
    const data = {};

    try {
      Q.getDetail(data, entity);
    } catch (err) {
      expect(err.body).toEqual(
        "The requested resource `MyEntity` does not exist"
      );
    }
  });

  test("getDetail - empty array error", () => {
    const data = { [entity]: [] };

    try {
      Q.getDetail(data, entity);
    } catch (err) {
      expect(err.body).toEqual(
        "The requested entry of `MyEntity` could not be found"
      );
    }
  });

  test("getDetail - optional", () => {
    const data = { [entity]: [] };
    expect(Q.getDetail(data, entity, true)).toBe(null);
  });
});

describe("constructParamsPermission", () => {
  const entity = "Test";
  const constraint: T.ProjectionConstraint = {
    attribute: "logUser",
  };

  const qOut: T.Params = {
    filters: { id: 3 },
    projection: {},
  };

  test("simple", () => {
    const postQ: T.Params = Q.constructParamsPermission(
      { ...qOut },
      [],
      [constraint]
    );

    expect(postQ).toEqual(qOut);
  });

  test("remove loguser", () => {
    const q: T.Params = {
      filters: { id: 3 },
      projection: { logUser: true },
    };

    const postQ: T.Params = Q.constructParamsPermission(
      { ...q },
      [],
      [constraint]
    );

    expect(postQ).toEqual(qOut);
  });

  test("add filter", () => {
    const q: T.Params = {
      filters: { id: 3 },
      projection: { logUser: true },
    };

    const constraintFilter: T.FilterConstraint = {
      attribute: "user",
      filterAttribute: { id: 8 },
    };

    const postQ: T.Params = Q.constructParamsPermission(
      { ...q },
      [constraintFilter],
      [constraint]
    );

    expect(postQ.filters).toEqual({ id: 3, user: { id: 8 } });
  });

  test("filter override", () => {
    const q: T.Params = {
      filters: { id: 3 },
      projection: { logUser: true },
    };

    const constraintFilter: T.FilterConstraint = {
      attribute: "id",
      filterAttribute: 9,
    };

    const postQ: T.Params = Q.constructParamsPermission(
      { ...q },
      [constraintFilter],
      [constraint]
    );

    expect(postQ.filters).toEqual({ id: 9 });
  });
});

test("insert single", () => {
  interface Row {
    id: number;
    name: string;
  }
  expect(
    Q.insert<Row>("MyEntity", { name: "myname" })
  ).toEqual({ MyEntity: { insert: { data: { name: "myname" } } } });
});

test("insert multiple", () => {
  interface Row {
    id: number;
    name: string;
  }
  expect(
    Q.insert<Row>("MyEntity", [{ name: "myname" }, { name: "myname2" }])
  ).toEqual({
    MyEntity: { insert: { data: [{ name: "myname" }, { name: "myname2" }] } },
  });
});

test("constructMutatePermission", () => {
  const q = { User: { insert: { data: {} } } };
  const append = { logDateAdded: "2020-09-04" };
  const q2 = { User: { insert: { data: { ...append } } } };
  expect(Q.constructMutatePermission(q, new Map(), new Map(), append)).toEqual(
    q2
  );
});
