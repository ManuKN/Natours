const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

  mongoose.connect(DB , {
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
  }).then((con) =>{
    console.log("connections:", con.connections )
    console.log("DataBase is succesfully Connected")
  })

// const testTour = new Tour({
//   name: 'The Park Camper',
//   price:597,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('Error 💥:', err);
//   });

console.log(process.env);
const Port = process.env.PORT;
console.log(Port);
console.log(process.env.NANHESRU);
console.log(process.env.NODE_ENV);
app.listen(Port, () => {
  console.log(`App running on ${Port}`);
});
