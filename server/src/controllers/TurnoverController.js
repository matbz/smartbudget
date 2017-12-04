const Turnover = require('../models/Turnover');

module.exports = {
  async index(req, res) {
    const turnover = new Turnover();
    try {
      const results = await turnover.all(req.params.budgetid, req.query);
      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to find all turnovers'
      });
    }
  },
  async minMaxDate(req, res) {
    const turnover = new Turnover();
    try {
      const results = await turnover.minMaxDate(req.params.budgetid);
      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to find all turnovers'
      });
    }
  },
  async payees(req, res) {
    const turnover = new Turnover();
    try {
      const results = await turnover.allPayees(req.params.budgetid);
      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to find all turnovers'
      });
    }
  },
  async create(req, res) {
    const turnover = new Turnover();
    try {
      if(req.body.length) {
        await turnover.createMultiple(req.body);
      } else {
        await turnover.create(req.body);
      }
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to create a turnover'
      });
    }
  },
  async update(req, res) {
    const turnover = new Turnover();
    try {
      await turnover.update(req.params.id, req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update a turnover'
      });
    }
  },
  async delete(req, res) {
    const turnover = new Turnover();
    try {
      await turnover.delete(req.query.id);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update a turnover'
      });
    }
  }
};
