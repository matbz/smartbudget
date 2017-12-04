const Goal = require('../models/Goal');

module.exports = {
  async index(req, res) {
    const goal = new Goal();
    try {
      const results = await goal.all(req.params.budgetid, req.query);
      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to create an goal'
      });
    }
  },
  async find(req, res) {
    const goal = new Goal();
    try {
      await goal.find(req.params.id);
      res.json(category);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to find an goal'
      });
    }
  },
  async create(req, res) {
    const goal = new Goal();
    try {
      await goal.create(req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to create an goal'
      });
    }
  },
  async update(req, res) {
    const goal = new Goal();
    try {
      await goal.update(req.params.id, req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update an goal'
      });
    }
  },
  async delete(req, res) {
    const goal = new Goal();
    try {
      await goal.delete(req.params.id);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to delete an goal'
      });
    }
  }
};
