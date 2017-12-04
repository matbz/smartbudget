const CategoryGroup = require('../models/CategoryGroup');
const Category = require('../models/Category');
const CategoryController = require('./CategoryController');

module.exports = {
  async index(req, res) {
    const categoryGroup = new CategoryGroup();
    try {
      const results = await categoryGroup.all(req.params.budgetid);
      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to create an category'
      });
    }
  },
  async find(req, res) {
    const categoryGroup = new CategoryGroup();
    try {
      await categoryGroup.find(req.params.id);
      res.json(categoryGroup);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to find an account'
      });
    }
  },
  async create(req, res) {
    const categoryGroup = new CategoryGroup();
    try {
      await categoryGroup.create(req.params.budgetid, req.body.name);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to create an categoryGroup'
      });
    }
  },
  async update(req, res) {
    const categoryGroup = new CategoryGroup();
    try {
      if (req.body.is_hidden !== undefined) {
        await CategoryController.updateHiddenByCategoryGroupId(req.params.id, req.body.is_hidden);
      }
      await categoryGroup.update(req.params.id, req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update an categoryGroup'
      });
    }
  },
  async unhide(req, res) {
    const categoryGroup = new CategoryGroup();
    try {
      await categoryGroup.update(req.params.id, req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update an categoryGroup'
      });
    }
  },
  async updatePositions(req, res) {
    const categoryGroup = new CategoryGroup();
    try {
      await categoryGroup.updatePositions(req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update positions of categoryGroups'
      });
    }
  },
  async delete(req, res) {
    const categoryGroup = new CategoryGroup();
    const category = new Category();

    try {
      const categories = await category.findByCategoryGroupId(req.params.id);

      await asyncForEach(categories, async (c) => {
        await category.delete(c.id);
      })

      await categoryGroup.delete(req.params.id);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to delete an categoryGroup'
      });
    }
  }
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
