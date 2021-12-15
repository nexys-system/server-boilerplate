import app from './app';

// port on which the application will be run, default is 3000
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const startApp = async (port: number) =>
  app.listen(port, () => console.log('Server started at port ' + port));

startApp(port);
