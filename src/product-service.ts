import Lib from '@nexys/lib';
import { Types } from '@nexys/lib';
import { product, inProd } from './config';
const { host, token } = product.service;

const libConfig: Types.IInit = {
  host,
  auth: token,
  i18n: {
    local: false
  },
  production: inProd
};
const init = Lib.init(libConfig);
const subscribe = inProd || false;
// subscribe to product service
if (subscribe) {
  init.Product.subscribe(true).then(x => {
    console.log('Subscribe output: ' + JSON.stringify(x));
  });
}
export default init;
