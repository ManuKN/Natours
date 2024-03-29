const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

console.log(process.env);

const Port = process.env.PORT;
console.log(Port);
console.log(process.env.NANHESRU);
console.log(process.env.NODE_ENV);
app.listen(Port, () => {
  console.log(`App running on ${Port}`);
});
