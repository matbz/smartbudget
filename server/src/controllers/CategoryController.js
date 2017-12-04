const Category = require('../models/Category');

module.exports = {
  async index(req, res) {
    const category = new Category();
    try {
      const results = await category.all(req.params.budgetid);
      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to create an category'
      });
    }
  },
  async find(req, res) {
    const category = new Category();
    try {
      await category.find(req.params.id);
      res.json(category);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to find an account'
      });
    }
  },
  async create(req, res) {
    const category = new Category();
    try {
      await category.create(req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to create an category'
      });
    }
  },
  async update(req, res) {
    const category = new Category();
    try {
      await category.update(req.params.id, req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update an category'
      });
    }
  },
  async updateHiddenByCategoryGroupId(categoryGroupId, isHidden) {
    const category = new Category();
    try {
      const categories = await category.findByCategoryGroupId(categoryGroupId);
      const updateData = categories.map(c => {
        return {
          id: c.id,
          isHidden
        }
      });
      await category.updateVisibilities(updateData);
    } catch (err) {
      console.log(err);
    }
  },
  async updatePositions(req, res) {
    const category = new Category();
    try {
      if (req.body[0].categorygroup_id) {
        await asyncForEach(req.body, async (e) => {
          await category.update(e.id, { categorygroup_id: e.categorygroup_id });
        });
      }

      await category.updatePositions(req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update positions of categories'
      });
    }
  },
  async unhideAll(req, res) {
    const category = new Category();
    try {
      await category.unhideAll(req.params.budgetid);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to delete an category'
      });
    }
  },
  async delete(req, res) {
    const category = new Category();
    try {
      await category.delete(req.params.id);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to delete an category'
      });
    }
  }
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
