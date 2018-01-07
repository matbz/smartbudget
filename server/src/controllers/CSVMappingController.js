const CSVMapping = require('../models/CSVMapping');

module.exports = {
  async index(req, res) {
    const csvmapping = new CSVMapping();
    try {
      const results = await csvmapping.all(req.params.userid);
      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to find all csvmapping'
      });
    }
  },
  async find(req, res) {
    const csvmapping = new CSVMapping();
    try {
      await csvmapping.find(req.params.id);
      res.json(csvmapping);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to find a csvmapping'
      });
    }
  },
  async create(req, res) {
    const csvmapping = new CSVMapping();
    try {
      if (!req.body.category_id) {
        req.body.category_id = null;
      }

      await csvmapping.store(req.params.userid, req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to create a csvmapping'
      });
    }
  },
  async update(req, res) {
    const csvmapping = new CSVMapping();
    try {
      await csvmapping.find(req.params.id);

      Object.keys(csvmapping).map((key) => {
        if(req.body[key] != undefined) {
          csvmapping[key] = req.body[key];
        }
      });

      if (!csvmapping.category_id) {
        csvmapping.category_id = null;
      }

      await csvmapping.update(csvmapping)
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update a csvmapping'
      });
    }
  },
  async delete(req, res) {
    const csvmapping = new CSVMapping();
    try {
      await csvmapping.delete(req.params.id);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to delete a csvmapping'
      });
    }
  }
};
