// eslint-disable-next-line arrow-body-style 
module.exports = fn => {
    return (req , res , next) => {
      fn(req , res ,next).catch(next)
      // so here if some thing goes wrong next will be called which will direct to global middle ware for error handling 
    }
  }

  //vedio-116