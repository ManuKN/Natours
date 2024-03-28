const app = require('./app');

const Port = 3000;
app.listen(Port, () => {
  console.log(`App running on ${Port}`);
});
