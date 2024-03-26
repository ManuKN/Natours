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

app.get('/app/v1/tours/:id',(req,res) =>{
    console.log(req.params)
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id)
    // if(id > tours.length){
        if(!tour){
        res.status(404).json({
            status:'Fail',
            data:({
                message:'Invalid ID'
            })
        })
    }
    
    res.status(200).json({
        status:'success',
        data:{
            tour
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

app.patch('/app/v1/tours/:id',(req,res) =>{
    const id = req.params.id * 1
    if(id > tours.length){
        res.status(404).json({
            status:'Fail',
            data:{
                message:'Invalid Id'
            }
        })
    } 

    res.status(200).json({
        status:'Success',
        data:{
         message:"Updated Data bro  "
        }
    })
})

app.delete('/app/v1/tours/:id',(req,res) =>{
    const id = req.params.id * 1
    if(id > tours.length){
        res.status(404).json({
            status:'Fail',
            data:{
                message:'Invalid Id'
            }
        })
    } 

    res.status(204).json({
        status:'Success',
        data:null
    })
})

// app.post('/',(req,res) =>{
//    res.send('U can Post any data from this URl')
// })

const Port = 3000;
app.listen( Port , () =>{
    console.log(`App running on ${Port}`)
})