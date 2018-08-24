const db = require('../db');
const SQL = require('sql-template-strings');

class Account {
  constructor(data) {
    this.init(data);
  }

  init(data) {
    if (!data) {
      return;
    }
    this.id = data.id;
    this.name = data.name;
    this.csv_delimiter = data.csv_delimiter
    this.csv_decimalsymbol = data.csv_decimalsymbol;
    this.csv_offset = data.csv_offset;
    this.csv_encoding = data.csv_encoding;
    this.csv_mapping = data.csv_mapping;
  }

  async all(budgetid) {
    try {
      const query = SQL`
      select
        a.id,
        a.name,
        a.csv_delimiter,
        a.csv_decimalsymbol,
        a.csv_offset,
        a.csv_encoding,
        a.csv_mapping,
        sum(t.amount) as balance
      from account as a
      left join turnover as t
      on t.account_id = a.id and
         t.turnover_date <= now()
      where budget_id = ${budgetid}
      group by a.id
      order by a.id
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
      from account
      where id = ${id}
      `;
      const result = await db.oneOrNone(query);
      if (!result) return {};
      this.init(result);
    } catch (error) {
        console.log(error);
    }
  }

  async getBalance(budgetid, params) {
    try {
      const { start, end, userid} = params;
      const data = {
        pastBalance: null,
        balances: []
      };

      let query = SQL`
      select report_startdate
      from "user"
      where id = ${userid}
      `;
      const response = await db.oneOrNone(query);

      query = SQL`
      select sum(amount)
      from turnover
      where
      account_id in (select id from account where budget_id = ${budgetid}) and
      turnover_date < ${start} and
      turnover_date >= ${response.report_startdate || '19000101'}
      `;
      const result = await db.oneOrNone(query);

      query = SQL`
      select t.date, t.amount from (
        select
          sum(amount) as amount,
          to_char(turnover_date, 'MM/YYYY') as date,
          to_char(turnover_date, '01/MM/YYYY') as sort_date
        from turnover
        where
          account_id in (select id from account where budget_id = ${budgetid}) and
          turnover_date >= ${start} and
          turnover_date <= ${end} and
          turnover_date >= ${response.report_startdate || '19000101'}
        group by
          date,
          sort_date
        ) as t
        order by
          cast (t.sort_date as DATE)
      `;
      const results = await db.manyOrNone(query);

      data.balances = [...results];
      data.pastBalance = result.sum;
      return data;
    } catch (error) {
        console.log(error);
    }
  }

  async getSpending(budgetid, params) {
    try {
      const { start, end, userid, categoryid } = params;

      const data = {
        pastBalance: null,
        balances: []
      };

      let whereAppend = SQL` `;

      if (categoryid === undefined) {
        whereAppend = SQL` and c.id = 9999999`;
      } else if (!Array.isArray(categoryid)) {
        whereAppend = SQL` and c.id = ${categoryid}`;
      } else {
        whereAppend = SQL` and c.id = ANY(${categoryid})`;
      }

      let query = SQL`
      select
      t.category_id,
      c.name,
      sum(t.amount) * -1 as amount
      from turnover as t
      inner join category as c on c.id = t.category_id
      where
        t.account_id in (select id from account where budget_id = ${budgetid}) and
        t.turnover_date >= ${start} and
        t.turnover_date <= ${end} and
        t.amount < 0 `.append(whereAppend).append(`
      group by
        t.category_id,
        c.name
      order by amount desc
      `);

      const categoryTotals = await db.manyOrNone(query);

      query = SQL`
      select * from (
        select
          t.category_id,
          c.name,
          to_char(turnover_date, 'MM/YYYY') as date,
          to_char(turnover_date, '01/MM/YYYY') as sort_date,
          sum(t.amount) * -1 as amount
        from turnover as t
        inner join category as c on c.id = t.category_id
        where
          t.account_id in (select id from account where budget_id = ${budgetid}) and
          t.turnover_date >= ${start} and
          t.turnover_date <= ${end} and
          t.amount < 0 `.append(whereAppend).append(`
        group by
          t.category_id,
          date,
          sort_date,
          c.name ) as t
        order by
          cast (t.sort_date as DATE),
          amount desc
      `);
      const categoryTotalsByMonth = await db.manyOrNone(query);

      data.totals = [...categoryTotals];
      data.totalsByMonth = [...categoryTotalsByMonth];

      return data;
    } catch (error) {
        console.log(error);
    }
  }

  async store(budgetid, account) {
    const {
      name,
      csv_delimiter,
      csv_decimalsymbol,
      csv_offset,
      csv_encoding,
      csv_mapping
    } = account;

    try {
      const query = SQL`
      insert into account
      (name, csv_delimiter, csv_decimalsymbol, csv_offset, csv_encoding, csv_mapping, budget_id)
      values
      (${name}, ${csv_delimiter}, ${csv_decimalsymbol}, ${csv_offset}, ${csv_encoding}, ${csv_mapping}, ${budgetid})
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async save(account) {
    const {
      id,
      name,
      csv_delimiter,
      csv_decimalsymbol,
      csv_offset,
      csv_encoding,
      csv_mapping
    } = account;

    try {
      const query = SQL`
      update account
      set
        name = ${name},
        csv_delimiter = ${csv_delimiter},
        csv_decimalsymbol = ${csv_decimalsymbol},
        csv_offset = ${csv_offset},
        csv_encoding= ${csv_encoding},
        csv_mapping = ${csv_mapping}
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
      delete from account
      where id = ${id}
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async restore(budgetid, data) {
    const {
      id,
      name,
      csv_delimiter,
      csv_decimalsymbol,
      csv_offset,
      csv_encoding,
      csv_mapping,
    } = data;

    try {
      const query = SQL`
      insert into account
      (id, name, csv_delimiter, csv_decimalsymbol, csv_offset, csv_encoding, csv_mapping, budget_id)
      values
      (${id}, ${name}, ${csv_delimiter}, ${csv_decimalsymbol}, ${csv_offset}, ${csv_encoding}, ${csv_mapping}, ${budgetid})
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }
}

module.exports = Account;
