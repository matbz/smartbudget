const fs = require('fs');
const path = require('path');
const moment = require('moment');
const Budget = require('../models/Budget');
const Account = require('../models/Account');
const Category = require('../models/Category');
const CategoryBudgeted = require('../models/CategoryBudgeted');
const CategoryGroup = require('../models/CategoryGroup');
const Goal = require('../models/Goal');
const Turnover = require('../models/Turnover');

module.exports = {
  async index(req, res) {
    const budget = new Budget();
    try {
      const results = await budget.findBudgetsByUserId(req.query.userid);
      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to get the budget id'
      });
    }
  },
  async active(req, res) {
    const budget = new Budget();
    try {
      await budget.findActiveBudgetByUserId(req.query.userid);
      res.json(budget);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to get the budget id'
      });
    }
  },
  async update(req, res) {
    const budget = new Budget();
    try {
      await budget.update(req.params.id, req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update an goal'
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
  },
  async backup(req, res) {
    const {username, userid} = req.query;
    const budgetid = req.params.budgetid;
    const data = {};
    const month = moment(new Date()).month() + 1;
    const filename = `backup_budget_${budgetid}_${username}_${moment(new Date()).year()}_${month}_${moment(new Date()).date()}`;
    const filepath = './uploads/' + filename + '.json';

    const account = new Account();
    const category = new Category();
    const categorybudgeted = new CategoryBudgeted();
    const categorygroup = new CategoryGroup();
    const goal = new Goal();
    const turnover = new Turnover();

    try {
      data['account'] = await account.all(budgetid);
      data['category'] = await category.all(budgetid);
      data['categorybudgeted'] = await categorybudgeted.all(budgetid);
      data['categorygroups'] = await categorygroup.all(budgetid);
      data['goal'] = await goal.all(budgetid);
      data['turnover'] = await turnover.allUnfiltered(budgetid);

      await asyncForEach(data['categorybudgeted'], async (e) => {
        e.budgeted_date = moment(e.budgeted_date).format('YYYY-MM-DD');
      });

      await asyncForEach(data['goal'], async (e) => {
        if (e.enddate !== null) {
          e.enddate = moment(e.enddate).format('YYYY-MM-DD');
        }
      });

      await asyncForEach(data['turnover'], async (e) => {
        if (e.turnover_date !== null) {
          e.turnover_date = moment(e.turnover_date, 'DD.MM.YYYY').format('YYYY-MM-DD');
        }
      });

      fs.writeFile(filepath, JSON.stringify(data, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        };

        res.download(filepath, filename + '.json', function() {
          fs.unlink(filepath, function (err) {
            if (err) {
                console.error(err);
            }
          });
        });
      });
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to backup the budget'
      });
    }
  },
  async restore(req, res) {
    try {
      const budgetid = req.params.budgetid;

      const file = req.file;
      const contents = fs.readFileSync(file.path);
      const data = JSON.parse(contents);

      const account = new Account();
      const category = new Category();
      const categorybudgeted = new CategoryBudgeted();
      const categorygroup = new CategoryGroup();
      const goal = new Goal();
      const turnover = new Turnover();

      // Delete
      await asyncForEach(data['category'], async (e) => {
        await category.delete(e.id);
      });

      await asyncForEach(data['categorygroups'], async (e) => {
        await categorygroup.delete(e.id);
      });

      await asyncForEach(data['account'], async (e) => {
        await account.delete(e.id);
      });

      // Insert
      await asyncForEach(data['account'], async (e) => {
        await account.restore(budgetid, e);
      });

      await asyncForEach(data['categorygroups'], async (e) => {
        await categorygroup.restore(budgetid, e);
      });

      await asyncForEach(data['category'], async (e) => {
        await category.restore(e);
      });

      await asyncForEach(data['categorybudgeted'], async (e) => {
        await categorybudgeted.restore(e);
      });

      await asyncForEach(data['goal'], async (e) => {
        await goal.restore(e);
      });

      await asyncForEach(data['turnover'], async (e) => {
        await turnover.restore(e);
      });

      fs.unlinkSync(file.path);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to restore.'
      });
    }
  }
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
