import * as Request from './request';

import File from './file';
import * as FileUtils from './file';

import I18n from './i18n';
import * as I18nUtils from './i18n/utils';

import * as CMSUtil from './cms';
import CMS from './cms';
import Email from './email';
import Notification from './notification';
import * as NotificationUtil from './notification';

import * as GraphQL from './graph-ql';

import * as Types from './request/types';

import * as Query from './query';
import Product from './product';
import ProductQuery from './product/query';

import * as API from './api';
import Workflow from './workflow';
import * as WorkflowTypes from './workflow/types';
import JWT from './jwt';

import * as UserManagement from './user-management';

import HTTP from '@nexys/http';

const init = ({
  authToken,
  host = 'https://flow-dev.nexys.io',
  i18n = { local: false },
  production = false
}: Types.Init) => {
  const DataService = new ProductQuery(host, authToken);

  return {
    DataService,
    File: new File(host, authToken),
    Email: new Email(host, authToken, production),
    I18n: new I18n(host, authToken, i18n.local, i18n.path),
    CMS: new CMS(host, authToken),
    Notification: new Notification(host, authToken),
    API: API.Service(host, authToken),
    Workflow: new Workflow(host, authToken),
    // deprecated, here for legacy reasons
    Product: new Product(host, authToken),
    Query: new Query.Simple(host, authToken),
    ProductQuery: DataService
  };
};

export {
  API,
  CMS,
  CMSUtil,
  Email,
  File,
  FileUtils,
  HTTP,
  GraphQL,
  I18n,
  I18nUtils,
  JWT,
  Notification,
  NotificationUtil,
  Product,
  ProductQuery,
  Query,
  Request,
  Types,
  UserManagement,
  Workflow,
  WorkflowTypes
};

export default init;
