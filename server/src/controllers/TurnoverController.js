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
  async copy(req, res) {
    const turnover = new Turnover();
    try {
      const { ids, date } = req.body;
      const response = await turnover.findByIds(ids);
      const turnovers = response.map(t => {
        return {
          accountId: t.account_id,
          categoryId: t.category_id,
          turnoverDate: date,
          payee: t.payee,
          amount: t.amount,
          note: t.note,
          source: t.source
        };
      });

      await turnover.createMultiple(turnovers);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update a turnover'
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
