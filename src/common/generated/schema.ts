export default [
  {
    name: 'User',
    uuid: true,
    fields: [
      {
        name: 'firstName',
        optional: false,
        column: null,
        type: 'String'
      },
      {
        name: 'lastName',
        optional: false,
        column: null,
        type: 'String'
      },
      {
        name: 'email',
        optional: false,
        column: null,
        type: 'String'
      },
      {
        name: 'status',
        optional: false,
        column: null,
        type: 'UserStatus'
      },
      {
        name: 'logDateAdded',
        optional: false,
        column: null,
        type: 'LocalDateTime'
      },
      {
        name: 'instance',
        optional: false,
        column: null,
        type: 'Instance'
      },
      {
        name: 'lang',
        optional: false,
        column: null,
        type: 'String'
      }
    ]
  },
  {
    name: 'UserStatus',
    uuid: false,
    fields: [
      {
        name: 'name',
        optional: false,
        column: null,
        type: 'String'
      }
    ]
  },
  {
    name: 'UserAuthenticationType',
    uuid: false,
    fields: [
      {
        name: 'name',
        optional: false,
        column: null,
        type: 'String'
      }
    ]
  },
  {
    name: 'UserAuthentication',
    uuid: true,
    fields: [
      {
        name: 'value',
        optional: false,
        column: null,
        type: 'String'
      },
      {
        name: 'isEnabled',
        optional: false,
        column: null,
        type: 'Boolean'
      },
      {
        name: 'type',
        optional: false,
        column: null,
        type: 'UserAuthenticationType'
      },
      {
        name: 'user',
        optional: false,
        column: null,
        type: 'User'
      }
    ]
  },
  {
    name: 'Instance',
    uuid: true,
    fields: [
      {
        name: 'name',
        optional: false,
        column: null,
        type: 'String'
      },
      {
        name: 'dateAdded',
        optional: false,
        column: null,
        type: 'LocalDateTime'
      }
    ]
  },
  {
    name: 'Permission',
    uuid: true,
    fields: [
      {
        name: 'name',
        optional: false,
        column: null,
        type: 'String'
      }
    ]
  },
  {
    name: 'UserPermission',
    uuid: true,
    fields: [
      {
        name: 'permissionInstance',
        optional: false,
        column: null,
        type: 'PermissionInstance'
      },
      {
        name: 'user',
        optional: false,
        column: null,
        type: 'User'
      }
    ]
  },
  {
    name: 'PermissionInstance',
    uuid: true,
    fields: [
      {
        name: 'instance',
        optional: false,
        column: null,
        type: 'Instance'
      },
      {
        name: 'permission',
        optional: false,
        column: null,
        type: 'Permission'
      }
    ]
  }
];
