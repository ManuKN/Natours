class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'field'];
    excludedFields.forEach((el) => delete queryObj[el]);
    console.log(queryObj);

    //2)Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
    //{ duration: { gte: '5' } } to add $ sign we write above code
    //{ duration: { '$gte': '5' } }

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBY = this.queryString.sort.split(',').join(' ');
      console.log(sortBY);
      this.query.sort(sortBY);
      //sort('price ratingsAverage')
    } else {
      this.query = this.query.sort('-createdAt');
      //byDefault sort them by cretaedAt
    }
    return this;
  }

  limitfield() {
    if (this.queryString.field) {
      //query.select('name price duration difficulty'); to get into this format we wrote the below code
      const fieldsParams = this.queryString.field.split(',').join(' ');
      console.log(fieldsParams);
      this.query = this.query.select(fieldsParams);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1;
    const limit = this.queryString.limit * 1;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIfeatures;