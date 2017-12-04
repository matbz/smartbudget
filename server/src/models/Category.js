const db = require('../db');
const SQL = require('sql-template-strings');

class Category {
  constructor(data) {
    this.init(data);
  }

  init(data) {
    if (!data) {
      return;
    }
    this.id = data.id;
    this.name = data.name;
    this.is_hidden = data.is_hidden
    this.position = data.position;
    this.categorygroup_id = data.categorygroup_id;
  }

  async all(budgetid) {
    try {
      const query = SQL`
      select
        ca.id,
        ca.name,
        ca.position,
        ca.is_hidden,
        ca.categorygroup_id
      from categorygroup as cg
      inner join category as ca
      on ca.categorygroup_id = cg.id
      where cg.budget_id = ${budgetid}
      order by
        cg.position,
        ca.position
      `;
      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async find(id) {
    try {
      const query = SQL`
      select *
      from category
      where id = ${id}
      `;
      const result = await db.oneOrNone(query);
      if (!result) return {};
      this.init(result);
    } catch (error) {
        console.log(error);
    }
  }

  async findByCategoryGroupId(id) {
    try {
      const query = SQL`
      select *
      from category
      where categorygroup_id = ${id}
      `;
      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async create(data) {
    const {
      categorygroupId,
      name
    } = data;

    try {
      const query = SQL`
      insert into category
      (name, position, categorygroup_id)
      values
      (${name}, 0, ${categorygroupId})
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async update(id, data) {
    try {
      const updateData = SQL``;
      Object.keys(data).forEach((key, index, arr) => {
        updateData.append(key).append(SQL`= ${data[key]}`);
        if(index < arr.length - 1) {
          updateData.append(', ');
        }
      });

      const query = SQL`
      update category
      set `.append(updateData).append(SQL`
      where id = ${id}
      `);
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async updatePositions(list) {
    try {
      await db.tx(t => {
        const queries = list.map(l => {
          const query = SQL`
          update category
          set
            position = ${l.position}
          where id = ${l.id}
          `;
          return t.none(query);
        });
        return t.batch(queries);
      });
    } catch (error) {
      console.log(error)
    }
  }

  async updateVisibilities(list) {
    try {
      await db.tx(t => {
        const queries = list.map(l => {
          const query = SQL`
          update category
          set
            is_hidden = ${l.isHidden}
          where id = ${l.id}
          `;
          return t.none(query);
        });
        return t.batch(queries);
      });
    } catch (error) {
      console.log(error)
    }
  }

  async unhideAll(budgetid) {
    try {
      return await db.task('unhideAllCategoriesTask', async t => {
        let query = SQL`
        update category
        set is_hidden = false
        where categorygroup_id in (select id from categorygroup where budget_id = ${budgetid})`;
        await t.none(query);

        query = SQL`
        update categorygroup
        set is_hidden = false
        where budget_id = ${budgetid};
        `;
        await t.none(query);
      })
    } catch (error) {
        console.log(error);
    }
  }

  async delete(id) {
    try {
      return await db.task('deleteCategoryTask', async t => {
        let query = SQL`
        delete from categorybudgeted
        where category_id = ${id}
        `;
        await t.none(query);

        query = SQL`
        delete from turnover
        where category_id = ${id}
        `;
        await t.none(query);

        query = SQL`
        delete from goal
        where category_id = ${id}
        `;
        await t.none(query);

        query = SQL`
        delete from category
        where id = ${id}
        `;
        await t.none(query);
      })
    } catch (error) {
        console.log(error);
    }
  }
}

module.exports = Category;
