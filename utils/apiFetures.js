class APIFeture {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //1A Filtering
    const queryObj = { ...this.queryString };
    const ignore = ["page", "limit", "sort", "fields"];

    ignore.forEach((el) => delete queryObj[el]);

    //1B Advance filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // if we want to implement multiple sorting
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } //defalut sorting
    else {
      this.query = this.query.sort("name");
    }

    return this;
  }

  limitFields() {
    //3 field limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      // excludig version fields by default..
      this.query = this.query.select("-__v");
    }

    return this;
  }

  pagination() {
    //4 Pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeture;
