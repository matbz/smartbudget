const CategoryBudgeted = require('../models/CategoryBudgeted');

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
  }
};
