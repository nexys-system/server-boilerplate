import LibServices from './product-service';
import app from './app';

// port on which the application will be run, default is 3000
const port = process.env.PORT ? Number(process.env.PORT) || 3000;

const subscribe = async () => {
  try {
    const productService = await LibServices.Product.subscribe(false); // workflow: use true

    if (productService.error) {
      console.error(r.message);
    } else {  
      console.log('Refreshed product service using app token');
      // LibServices.I18n.saveAll();
    }
  } catch (_err) {
    console.log('something went wrong while initializing product service');
  }
}

const startApp = async () => {
  subscribe();

  app.listen(port, () => console.log(`Server started at port ${port}`));
};

startApp();
