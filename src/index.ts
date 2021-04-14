import LibServices from './product-service';
import app from './app';

// port on which the application will be run, default is 3000
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const subscribe = async () => {
  try {
    await LibServices.Product.subscribe(false); // workflow: use true

    console.log('Refreshed product service using app token');
  } catch (_err) {
    console.log('something went wrong while initializing product service');
  }
};

const startApp = async () => {
  subscribe();

  app.listen(port, () => console.log(`Server started at port ${port}`));
};

startApp();
