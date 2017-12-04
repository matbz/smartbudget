const Account = require('../models/Account');

module.exports = {
  async index(req, res) {
    const account = new Account();
    try {
      const results = await account.all(req.params.budgetid);
      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to find all account'
      });
    }
  },
  async find(req, res) {
    const account = new Account();
    try {
      await account.find(req.params.id);
      res.json(account);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to find an account'
      });
    }
  },
  async create(req, res) {
    const account = new Account();
    try {
      await account.store(req.params.budgetid, req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to create an account'
      });
    }
  },
  async update(req, res) {
    const account = new Account();
    try {
      await account.find(req.params.id);

      Object.keys(account).map((key) => {
        if(req.body[key] != undefined) {
          account[key] = req.body[key];
        }
      });

      await account.save(account)
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update an account'
      });
    }
  }
};
