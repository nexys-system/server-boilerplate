import * as L from '@nexys/lib';
//import { Role } from '../../common/generated/role';
import Model from '../../common/generated/schema';
import P from '../../product-service';

export const schema = L.GraphQL.SchemaFactory.getSchemaFromJSONDDL(
  Model,
  P.ProductQuery
);

export const query = L.GraphQL.SchemaFactory.getQueryFromJSONDDL(
  Model,
  P.ProductQuery
);
