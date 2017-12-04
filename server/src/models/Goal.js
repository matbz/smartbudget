const db = require('../db');
const SQL = require('sql-template-strings');

class Goal {
  constructor(data) {
    this.init(data);
  }

  init(data) {
    if (!data) {
      return;
    }
    this.id = data.id;
    this.enddate = data.enddate;
    this.amount = data.amount;
    this.category_id = data.category_id;
  }

  async all(budgetid, filter) {
    try {
      let where = SQL`cg.budget_id = ${budgetid}`;
      if (filter.categoryid) {
        where.append(SQL` and g.category_id = ${filter.categoryid}`);
      }

      const query = SQL`
      select
        g.id,
        g.enddate,
        g.amount,
        g.category_id
      from goal as g
      inner join category as c
      on c.id = g.category_id
      inner join categorygroup as cg
      on cg.id = c.categorygroup_id
      where `
      .append(where);

      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async find(id) {
    try {
      const query = SQL`
      select *
      from goal
      where id = ${id}
      `;
      const result = await db.oneOrNone(query);
      if (!result) return {};
      this.init(result);
    } catch (error) {
        console.log(error);
    }
  }

  async create(data) {
    const {
      enddate,
      amount,
      category_id
    } = data;

    try {
      const query = SQL`
      insert into goal
      (enddate, amount, category_id)
      values
      (${enddate}, ${amount}, ${category_id})
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async update(id, data) {
    const {
      enddate,
      amount
    } = data;

    try {
      const query = SQL`
      update goal
      set
        enddate = ${enddate},
        amount = ${amount}
      where id = ${id}
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async delete(id) {
    try {
      const query = SQL`
      delete from goal
      where id = ${id}
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }
}

module.exports = Goal;
