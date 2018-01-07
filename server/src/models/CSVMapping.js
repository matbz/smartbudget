const db = require('../db');
const SQL = require('sql-template-strings');

class CSVMapping {
  constructor(data) {
    this.init(data);
  }

  init(data) {
    if (!data) {
      return;
    }
    this.id = data.id;
    this.payee_csv = data.payee_csv;
    this.payee = data.payee
    this.note = data.note;
    this.user_id = data.user_id;
    this.category_id = data.category_id;
  }

  async all(userid) {
    try {
      const query = SQL`
      select
        csv.id,
        csv.payee_csv,
        csv.payee,
        csv.note,
        csv.category_id,
        cat.name as category_name
      from csvmapping as csv
      left join category as cat
      on cat.id = csv.category_id
      where user_id = ${userid}
      order by csv.payee_csv
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
      from csvmapping
      where id = ${id}
      `;
      const result = await db.oneOrNone(query);
      if (!result) return {};
      this.init(result);
    } catch (error) {
        console.log(error);
    }
  }

  async store(userid, csvmapping) {
    const {
      payee_csv,
      payee,
      note,
      category_id,
    } = csvmapping;

    try {
      const query = SQL`
      insert into csvmapping
      (payee_csv, payee, note, user_id, category_id)
      values
      (${payee_csv}, ${payee}, ${note}, ${userid}, ${category_id})
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async update(csvmapping) {
    const {
      id,
      payee_csv,
      payee,
      note,
      category_id
    } = csvmapping;

    try {
      const query = SQL`
      update csvmapping
      set
        payee_csv = ${payee_csv},
        payee = ${payee},
        note = ${note},
        category_id = ${category_id}
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
      delete from csvmapping
      where id = ${id}
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }
}

module.exports = CSVMapping;
