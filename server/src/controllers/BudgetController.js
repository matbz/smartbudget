const Budget = require('../models/Budget');

module.exports = {
  async index(req, res) {
    const budget = new Budget();
    try {
      await budget.findBudgetId(req.query.userid);
      res.json(budget);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to get the budget id'
      });
    }
  },
  async list(req, res) {
    const budget = new Budget();
    try {
      const results = await budget.budgeted(req.params);
      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to get the budget list data'
      });
    }
  },
  async toBeBudgeted(req, res) {
    const budget = new Budget();
    try {
      const results = await budget.toBeBudgeted(req.params);
      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to get tobebudgeted'
      });
    }
  },
  async getHiddenCount(req, res) {
    const budget = new Budget();
    try {
      const result = await budget.findHidden(req.params.budgetid);
      res.json(result);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to get the budget id'
      });
    }
  },
  async budgetedLastMonth(req, res) {
    const budget = new Budget();
    try {
      const results = await budget.budgetedLastMonth(req.params);
      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to get tobebudgeted'
      });
    }
  },
  async budgetedLastMonthByCategoryId(req, res) {
    const budget = new Budget();
    try {
      const results = await budget.budgetedLastMonthByCategoryId(req.params);
      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to get tobebudgeted'
      });
    }
  }
};
