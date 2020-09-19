import LibServices from './product-service';
import app from './app';

// this is defined but is not called?
const startApp = async () => {
  const productService = LibServices.Product.subscribe(true); // workflow: use true

  productService
    .then(r => {
      console.log(r);
      if (r.error) console.error(r.message);
      else console.log('Refreshed product service using app token');
      // LibServices.I18n.saveAll();
    })
    .catch(err => {
      console.log('something went wrong while initializing product service');
    });

  const port = process.env.PORT || 3000;

  app.listen(port, () => console.log(`Server started at port ${port}`));
};

startApp();
