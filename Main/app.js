const express = require('express')
const fs = require('fs')

const app = express();

app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

app.get('/app/v1/tours',(req,res) =>{
    res.status(200).json({
        status:'success',
        result:tours.length,
        data:{
            tours:tours
        }
    })
})

app.post('/app/v1/tours',(req,res) =>{
    // console.log(req.body)

    const newId = tours[tours.length - 1].id + 1;
    console.log(newId)
    const newtour = Object.assign({id:newId} , req.body);
    tours.push(newtour)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),err =>{
        res.status(201).json({
            status:'success',
            data:{
                tours:newtour
            }
        })
    })
})

// app.post('/',(req,res) =>{
//    res.send('U can Post any data from this URl')
// })

const Port = 3000;
app.listen( Port , () =>{
    console.log(`App running on ${Port}`)
})