const db = require('../db');
const SQL = require('sql-template-strings');

class CategoryGroup {
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
  }

  async all(budgetid) {
    try {
      const query = SQL`
      select *
      from categorygroup
      where budget_id = ${budgetid}
      order by position
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
      from categorygroup
      where id = ${id}
      `;
      const result = await db.oneOrNone(query);
      if (!result) return {};
      this.init(result);
    } catch (error) {
        console.log(error);
    }
  }

  async create(budgetId, name) {
    try {
      const query = SQL`
      insert into categorygroup
      (name, position, budget_id)
      values
      (${name}, 0, ${budgetId})
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
      update categorygroup
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
          update categorygroup
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

  async delete(id) {
    try {
      const query = SQL`
      delete from categorygroup
      where id = ${id}
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }
}

module.exports = CategoryGroup;
