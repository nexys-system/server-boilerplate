import * as T from "./type";
import QueryService from "../query/simple";
jest.mock("../query/simple");

export const qs = new QueryService("host", "token");

export const userUuid = "myUuid";
export const email = "john@doe.com";

export const permissions = ["app", "admin"];
export const profile: T.Profile = {
  uuid: userUuid,
  firstName: "John",
  lastName: "Doe",
  email,
  lang: "en",
  instance: { uuid: "instanceUuid", name: "instance" },
};

export const status = T.Status.pending;

export const hashedPassword = "myhashedpassword";

const mockInsert = qs.insertUuid as jest.Mock;
const mockListPermissions = qs.list as jest.Mock;
const mockFindPermissions = qs.find as jest.Mock;

mockInsert.mockImplementation((entity, data) => {
  return { uuid: entity + "_uuid" };
});

mockListPermissions.mockImplementation((entity, _query) => {
  if (entity === "UserPermission") {
    return [
      { permissionInstance: { permission: { name: "app" } } },
      { permissionInstance: { permission: { name: "admin" } } },
    ];
  }
});

mockFindPermissions.mockImplementation((entity, _query) => {
  if (entity === "User") {
    return {
      ...profile,
      status,
      UserAuthentication: [
        {
          value: hashedPassword,
          type: { id: 1, name: "password" },
          isEnabled: true,
        },
      ],
    };
  }
});
