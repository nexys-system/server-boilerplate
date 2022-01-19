import * as FetchR from '@nexys/fetchr';

import ProductService from '@nexys/core/dist/product';
import QueryService from '@nexys/core/dist/query/service';
import Cache from '@nexys/node-cache';

import * as Config from './config';
import model from './model';

import WorkflowService from '@nexys/core/dist/services/workflow';
import EmailService from '@nexys/core/dist/services/email';
import NotificationService from '@nexys/core/dist/services/notification';

export const email = new EmailService(Config.context);
export const workflow = new WorkflowService(Config.context);
export const notifications = new NotificationService(Config.context);

const fetchR = new FetchR.default(Config.database, model);
export const qs = new QueryService(fetchR);
export const cache = new Cache();

const p = new ProductService(
  { appToken: Config.appToken, secretKey: Config.secretKey },
  qs,
  cache
);

export default p;
