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
        sum(t.amount) as balance
      from account as a
      left join turnover as t
      on t.account_id = a.id
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

  async store(budgetid, account) {
    const {
      name,
      csv_delimiter,
      csv_decimalsymbol,
      csv_offset,
      csv_encoding
    } = account;

    try {
      const query = SQL`
      insert into account
      (name, csv_delimiter, csv_decimalsymbol, csv_offset, csv_encoding, budget_id)
      values
      (${name}, ${csv_delimiter}, ${csv_decimalsymbol}, ${csv_offset}, ${csv_encoding}, ${budgetid})
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
      csv_encoding
    } = account;

    try {
      const query = SQL`
      update account
      set
        name = ${name},
        csv_delimiter = ${csv_delimiter},
        csv_decimalsymbol = ${csv_decimalsymbol},
        csv_offset = ${csv_offset},
        csv_encoding= ${csv_encoding}
      where id = ${id}
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }
}

module.exports = Account;
