const Budget = require('../models/Budget');
const Category = require('../models/Category');
const CategoryBudgeted = require('../models/CategoryBudgeted');
const moment = require('moment');

module.exports = {
  async index(req, res) {
    const categoryBudgeted = new CategoryBudgeted();
    try {
      await categoryBudgeted.findByCategoryIdAndDate(req.query.categoryid, req.query.date);
      res.json(categoryBudgeted);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to find an account'
      });
    }
  },
  async update(req, res) {
    const categoryBudgeted = new CategoryBudgeted();
    try {
      await categoryBudgeted.findByCategoryIdAndDate(req.params.id, req.params.date);

      const budgetedData = {
        id: categoryBudgeted.id,
        categoryId: req.params.id,
        budgetedDate: req.params.date,
        amount: req.body.amount
      }

      if(budgetedData.id) {
        await categoryBudgeted.update(budgetedData);
      } else {
        await categoryBudgeted.create(budgetedData);
      }

      res.json(req.budgetedData);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update the budgeted amount'
      });
    }
  },
  async currentMonth(req, res) {
    const categoryBudgeted = new CategoryBudgeted();
    const { budgetid, date} = req.params;

    try {
      const budgetedAll = await categoryBudgeted.currentMonth(budgetid, date);

      res.json(budgetedAll);

    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to set budgeted last month'
      });
    }
  },
  async lastMonth(req, res) {
    const categoryBudgeted = new CategoryBudgeted();
    const { budgetid, date} = req.params;

    try {
      const budgetedAll = await categoryBudgeted.findByDate(budgetid, date);
      const categories = [];

      budgetedAll.map(item => {
        categories.push(item.category_id);
        return item.budgeted_date = date
      });

      await categoryBudgeted.deleteMultiple(categories, date);
      await categoryBudgeted.createMultiple(budgetedAll);

      res.json(budgetedAll);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to set budgeted last month'
      });
    }
  },
  async lastMonthByCategoryId(req, res) {
    const categoryBudgeted = new CategoryBudgeted();
    const { categoryid, date} = req.params;
    try {
      await categoryBudgeted.findByCategoryIdAndDate(categoryid, date);

      if (categoryBudgeted.id) {
        await categoryBudgeted.delete(categoryBudgeted.id);
      }

      const data = {
        categoryId: categoryid,
        budgetedDate: date,
        amount: req.body.amount
      }

      await categoryBudgeted.create(data);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to set budgeted last month'
      });
    }
  },
  async avgSpent(req, res) {
    const budget = new Budget();
    const category = new Category();
    const categoryBudgeted = new CategoryBudgeted();

    const { budgetid, startdate, enddate} = req.params;

    try {
      const cats =  await category.all(budgetid);
      const resp = await budget.getAvgDate(req.params);

      // const months = Math.floor(moment(enddate).diff(moment(resp.tdate), 'months', true) + 1);

      const months = moment(enddate).diff(moment(resp.tdate), 'months');

      await asyncForEach(cats, async (c) => {
        if (c.name === "To be Budgeted") {

        } else {
          req.params.categoryid = c.id;
          let avg = await budget.budgetedAvgSpentByCategoryId(req.params);

          avg.avgspent/=months;
          if (avg.avgspent <0 ) avg.avgspent*=-1;

          await categoryBudgeted.findByCategoryIdAndDate(c.id, enddate);

          if (categoryBudgeted.id) {
            await categoryBudgeted.delete(categoryBudgeted.id);
          }

          const data = {
            categoryId: c.id,
            budgetedDate: enddate,
            amount: avg.avgspent
          }

          await categoryBudgeted.create(data);
        }
      });

      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to set budgeted last month'
      });
    }
  },
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
