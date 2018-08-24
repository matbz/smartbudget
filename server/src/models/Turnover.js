const db = require('../db');
const SQL = require('sql-template-strings');

class Turnover {
  constructor(data) {
    this.init(data);
  }

  init(data) {
    if (!data) {
      return;
    }
    this.id = data.id;
    this.account_id = data.account_id;
    this.account_name = data.account_name;
    this.category_id = data.category_id;
    this.category_name = data.category_name;
    this.payee = data.payee;
    this.amount = data.amount;
    this.turnover_date = data.turnover_date
    this.note = data.note;
    this.source = data.source;
    this.imported_date = data.imported_date;
  }

  async all(budgetid, filter) {
    try {
      let where = SQL`budget_id = ${budgetid}`;

      if (filter.accountid) {
        where.append(SQL` and a.id = ${filter.accountid}`);
      }

      if (filter.categoryid) {
        where.append(SQL` and c.id = ${filter.categoryid}`);
      }

      if (filter.start) {
        where.append(SQL` and t.turnover_date >= ${filter.start}`);
      }

      if (filter.end) {
        where.append(SQL` and t.turnover_date <= ${filter.end}`);
      }

      if (filter.importdate) {
        where.append(SQL` and t.imported_date <= ${filter.importdate}`);
      }

      if (filter.showimported) {
        where.append(SQL` and t.source = 'I'`);
      }

      if (filter.q) {
        const queries = filter.q.split(';');

        queries.forEach(q => {
          const search = `%${q.toLowerCase()}%`;
          const searchAmount = q.replace(',','.');
          const searchOperand = 'LIKE';
          let searchAmountQuery = '';

          if (!hasNumbers(q)) {
            searchAmountQuery = '';
          } else if (q[0] === '<' || q[0] === '>') {
            searchAmountQuery = `or t.amount ${searchAmount}`;
          } else {
            searchAmountQuery = `or cast(t.amount as text) LIKE '%${searchAmount}%'`;
          }

          where.append(SQL` and (
             lower(a.name) like ${search}
          or lower(c.name) like ${search}
          or lower(t.payee) like ${search}
          or to_char(t.turnover_date, 'DD.MM.YYYY') like ${search}
          or lower(t.note) like ${search}
          `).append(searchAmountQuery)
          .append(')');
        });
      }

      const order = filter.orderby.split(';');
      const orderColumnQuery = order[0];
      const orderDirection = order[1];
      let orderColumn = '';

      switch (orderColumnQuery) {
        case 'account':
          orderColumn = 'a.name';
          break;
        case 'date':
          orderColumn = 't.turnover_date';
          break;
        case 'payee':
          orderColumn = 't.payee';
          break;
        case 'category':
          orderColumn = 'c.name';
          break;
        case 'note':
          orderColumn = 't.note';
          break;
        case 'amount':
          orderColumn = 't.amount';
          break;
      }

      const query = SQL`
      select
        t.id,
        a.id as account_id,
        a.name as account_name,
        c.id as category_id,
        c.name as category_name,
        t.amount,
        to_char(t.turnover_date, 'DD.MM.YYYY') as turnover_date,
        t.note,
        t.payee,
        t.imported_date,
        t.source
      from account as a
      inner join turnover as t
      on t.account_id = a.id
      left join category as c
      on t.category_id = c.id
      where `
      .append(where).append(`
      order by
        ${orderColumn} ${orderDirection},
        t.id desc
      `);
      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async allUnfiltered(budgetid) {
    try {
    const query = SQL`
      select
        t.id,
        a.id as account_id,
        a.name as account_name,
        c.id as category_id,
        c.name as category_name,
        t.amount,
        to_char(t.turnover_date, 'DD.MM.YYYY') as turnover_date,
        t.note,
        t.payee,
        t.imported_date,
        t.source
      from account as a
      inner join turnover as t
      on t.account_id = a.id
      left join category as c
      on t.category_id = c.id
      where budget_id = ${budgetid}
      order by
        t.id asc
      `;
      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async findByIds(ids) {
    try {
      const query = SQL`
      select *
      from turnover
      where
        id = ANY(${ids})
      `;
      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async minMaxDate(budgetid) {
    try {
      const query = SQL`
      select
        min(turnover_date),
        max(turnover_date)
      from turnover
      where account_id in (select id from account where budget_id = ${budgetid})
      `;
      return await db.oneOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async allPayees(budgetid) {
    try {
      const query = SQL`
      select distinct payee
      from turnover
      where
        account_id IN ( select id from account where budget_id = ${budgetid}) and
        payee is not null and
        payee <> ''
      order by payee asc
      `;
      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async create(data) {
    const {
      accountId,
      categoryId,
      payee,
      amount,
      turnoverDate,
      note,
      source,
    } = data;

    try {
      let query = ''

      if (data.importedDate !== undefined) {
        query = SQL`
        insert into turnover
          (account_id, category_id, payee, amount, turnover_date, note, source, imported_date)
        values
         (${accountId}, ${categoryId}, ${payee}, ${amount}, ${turnoverDate}, ${note}, ${source}, ${data.importedDate})
        `;
      } else if (categoryId === '' || categoryId === 0) {
        query = SQL`
        insert into turnover
          (account_id, category_id, payee, amount, turnover_date, note, source)
        values
         (${accountId}, null, ${payee}, ${amount}, ${turnoverDate}, ${note}, ${source})
        `;
      } else {
        query = SQL`
        insert into turnover
          (account_id, category_id, payee, amount, turnover_date, note, source)
        values
         (${accountId}, ${categoryId}, ${payee}, ${amount}, ${turnoverDate}, ${note}, ${source})
        `;
      }

      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async createMultiple(list) {
    try {
      await db.tx(t => {
        const queries = list.map(l => {
          let query = ''

          if (l.importedDate !== undefined) {
            query = SQL`
            insert into turnover
              (account_id, category_id, payee, amount, turnover_date, note, source, imported_date)
            values
              (${l.accountId}, ${l.categoryId}, ${l.payee}, ${l.amount}, ${l.turnoverDate}, ${l.note}, ${l.source}, ${l.importedDate})
            `;
          } else if (l.categoryId === '' || l.categoryId === 0) {
            query = SQL`
            insert into turnover
              (account_id, category_id, payee, amount, turnover_date, note, source)
            values
              (${l.accountId}, null, ${l.payee}, ${l.amount}, ${l.turnoverDate}, ${l.note}, ${l.source})
            `;
          } else {
            query = SQL`
            insert into turnover
              (account_id, category_id, payee, amount, turnover_date, note, source)
            values
              (${l.accountId}, ${l.categoryId}, ${l.payee}, ${l.amount}, ${l.turnoverDate}, ${l.note}, ${l.source})
            `;
          }
          return t.none(query);
        });
        return t.batch(queries);
      });
    } catch (error) {
      console.log(error)
    }
  }

  async update(id, data) {
    const {
      accountId,
      categoryId,
      payee,
      amount,
      turnoverDate,
      note
    } = data;

    try {
      let query = '';

      if (categoryId === '' || categoryId === 0) {
        query = SQL`
        update turnover
        set
          account_id = ${accountId},
          category_id = null,
          payee = ${payee},
          amount = ${amount},
          turnover_date = ${turnoverDate},
          note = ${note}
        where id = ${id}
        `;
      } else {
        query = SQL`
        update turnover
        set
          account_id = ${accountId},
          category_id = ${categoryId},
          payee = ${payee},
          amount = ${amount},
          turnover_date = ${turnoverDate},
          note = ${note}
        where id = ${id}
        `;
      }

      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async delete(ids) {
    try {
      let query = '';
      if (Array.isArray(ids)) {
        query = SQL`
        delete from turnover
        where
          id = ANY(${ids})
        `;
      } else {
        query = SQL`
        delete from turnover
        where
          id = ${ids}
        `;
      }
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async restore(data) {
    const {
      id,
      account_id,
      category_id,
      amount,
      turnover_date,
      note,
      payee,
      imported_date,
      source
    } = data;

    try {
      const query = SQL`
      insert into turnover
      (id, account_id, category_id, amount, turnover_date, note, payee, imported_date, source)
      values
      (${id}, ${account_id}, ${category_id}, ${amount}, ${turnover_date}, ${note}, ${payee}, ${imported_date}, ${source})
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }
}

module.exports = Turnover;

function hasNumbers(t){
  var regex = /\d/g;
  return regex.test(t);
}
