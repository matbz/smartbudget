const db = require('../db');
const SQL = require('sql-template-strings');

class CategoryBudgeted {
  constructor(data) {
    this.init(data);
  }

  init(data) {
    if (!data) {
      return;
    }
    this.id = data.id;
    this.budgeted_date = data.budgeted_date;
    this.amount = data.amount;
  }

  async findByDate(budgetid, date) {
    try {
      const query = SQL`
      select
        cb.id as id,
        ca.id as category_id,
        cb.budgeted_date as budgeted_date,
        cb.amount as amount
      from categorygroup as cg
      left join category as ca
      on cg.id = ca.categorygroup_id
      left join categorybudgeted as cb
      on ca.id = cb.category_id and
        cb.budgeted_date = ${date}::date - interval '1 month'
      where budget_id = ${budgetid}
      `;
      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async findByCategoryIdAndDate(categoryid, date) {
    try {
      const query = SQL`
      select *
      from categorybudgeted
      where
        category_id = ${categoryid} and
        budgeted_date = ${date}
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
      categoryId,
      budgetedDate,
      amount
    } = data;

    try {
      const query = SQL`
      insert into categorybudgeted
      (category_id, budgeted_date, amount)
      values
      (${categoryId}, ${budgetedDate}, ${amount})
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async createMultiple(list) {
    try {
      await db.tx(t => {
        const queries = list.map(l => {
          const query = SQL`
          insert into categorybudgeted
            (category_id, budgeted_date, amount)
          values
            (${l.category_id}, ${l.budgeted_date}, ${l.amount})
          `;
          return t.none(query);
        });
        return t.batch(queries);
      });
    } catch (error) {
      console.log(error)
    }
  }

  async update(data) {
    const {
      id,
      budgetedDate,
      amount
    } = data;

    try {
      const query = SQL`
      update categorybudgeted
      set
        amount = ${amount}
      where id = ${id} and
            budgeted_date= ${budgetedDate}
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async delete(id) {
    try {
      const query = SQL`
      delete from categorybudgeted
      where id = ${id}
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async deleteMultiple(categories, date) {
    try {
      const query = SQL`
      delete from categorybudgeted
      where
        budgeted_date = ${date} and
        category_id = ANY(${categories})
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }
}

module.exports = CategoryBudgeted;
