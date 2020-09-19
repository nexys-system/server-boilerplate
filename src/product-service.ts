import Lib from '@nexys/lib';
import { Types } from '@nexys/lib';
import { product, inProd } from './config';
const { host, token: auth } = product.service;

if (!auth) {
  throw Error('the app needs a app token to start');
}

const libConfig: Types.IInit = {
  host,
  auth,
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
