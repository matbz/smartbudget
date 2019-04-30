const db = require('../db');
const SQL = require('sql-template-strings');

class User {
  constructor(data) {
    this.init(data);
  }

  init(data) {
    if (!data) {
        return;
    }
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
    this.attempts = data.attempts;
  }

  async find(id) {
    try {
      const query = SQL`
      select *
      from "user"
      where id = ${id}
      `;
      const result = await db.oneOrNone(query);
      if (!result) return {};
      this.init(result);
    } catch (error) {
        console.log(error);
    }
  }

  async findByUsername(username) {
    try {
      const query = SQL`
      select *
      from "user"
      where username = ${username}
      `;
      const result = await db.oneOrNone(query);
      if (!result) return {};
      this.init(result);
    } catch (error) {
        console.log(error);
    }
  }

  async resetAttempts(id) {
    try {
      const query = SQL`
      update "user"
      set
        attempts = 0
      where id = ${id}
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async addAttempts(id, attempts) {
    attempts++;

    try {
      const query = SQL`
      update "user"
      set
        attempts = ${attempts}
      where id = ${id}
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

}

module.exports = User;
