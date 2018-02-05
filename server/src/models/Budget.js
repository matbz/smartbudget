const db = require('../db');
const SQL = require('sql-template-strings');
const moment = require('moment');

class Budget {
  constructor(data) {
    this.init(data);
  }

  init(data) {
    if (!data) {
      return;
    }
    this.id = data.budget_id;
    this.toBeBudgeted = data.toBeBudgeted;
  }

  async findBudgetsByUserId(userid) {
    try {
      const query = SQL`
      select *
      from user_budget
      where user_id = ${userid}
      `;
      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async findActiveBudgetByUserId(userid) {
    try {
      const query = SQL`
      select budget_id
      from user_budget
      where user_id = ${userid} and
            active = true
      `;
      const result = await db.oneOrNone(query);
      if (!result) return {};
      this.init(result);
    } catch (error) {
        console.log(error);
    }
  }

  async update(id, data) {
    const {
      active
    } = data;

    try {
      const query = SQL`
      update user_budget
      set
        active = ${active}
      where id = ${id}
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async budgeted(data) {
    const {
      budgetid,
      budgetdate
    } = data;
    const budgetdate_month = moment(budgetdate).format('YYYY-MM');

    try {
      const query = SQL`
      select
        cg.id as categorygroup_id,
        cg.position as categorygroup_position,
        cg.name as categorygroup_name,
        cg.is_hidden as categorygroup_is_hidden,
        ca.id as category_id,
        ca.name as category_name,
        ca.position as category_position,
        ca.is_hidden as category_is_hidden,
        cb.amount as budgeted,
        sum(t.amount) as activity,
        to_char(cb.budgeted_date, 'YYYY-MM') as date,
        g.amount as goal_amount,
        g.enddate as goal_enddate
      from categorygroup as cg
      left join category as ca
      on cg.id = ca.categorygroup_id and
         ca.inflow = false
      left join categorybudgeted as cb
      on ca.id = cb.category_id and
         cb.budgeted_date <= ${budgetdate}
      left join turnover as t
      on t.category_id = ca.id and
          t.turnover_date >= cb.budgeted_date and
          t.turnover_date < cb.budgeted_date + interval '1 month'
      left join goal as g
      on g.category_id = ca.id
      where budget_id = ${budgetid} and
            cg.inflow = false
      group by
        cg.id,
        cg.name,
        ca.id,
        ca.name,
        cb.amount,
        date,
        g.amount,
        g.enddate
      order by
        cg.position,
        ca.position,
        date
      `;
      const budgetList = await db.manyOrNone(query);
      return buildBudgetTable(budgetList, budgetdate_month);
    } catch (error) {
        console.log(error);
    }
  }

  async toBeBudgeted(data) {
    const {
      budgetid,
      budgetdate
    } = data;

    try {
      const query = SQL`
      select
        ( (
          select sum(t.amount)
          from account as a
          left join turnover as t
          on t.account_id = a.id and
            t.turnover_date < ${budgetdate}::date + interval '1 month' and
            ( t.category_id in (select c.id from categorygroup as cg inner join category as c on c.categorygroup_id = cg.id where budget_id = ${budgetid} and c.name = 'To be Budgeted') or
              t.amount > 0 )
          where budget_id = ${budgetid}
        ) - coalesce(sum(cb.amount),0) ) as tobebudgeted
      from categorygroup as cg
      left join category as ca
      on cg.id = ca.categorygroup_id
      left join categorybudgeted as cb
      on ca.id = cb.category_id and
        cb.budgeted_date <= ${budgetdate}
      where budget_id = ${budgetid}
      group by cg.budget_id
      `;
      return await db.oneOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async findHidden(budgetid) {
    try {
      const query = SQL`
      select count(*)
      from categorygroup as cg
      inner join category as c
      on c.categorygroup_id = cg.id
      where
        cg.budget_id = ${budgetid} and
        ( cg.is_hidden = true or c.is_hidden = true )
      `;
      return await db.oneOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async budgetedLastMonth(data) {
    const {
      budgetid,
      budgetdate
    } = data;

    try {
      const query = SQL`
      select sum(cb.amount) as budgetedlastmonth
      from categorygroup as cg
      left join category as ca
      on cg.id = ca.categorygroup_id
      left join categorybudgeted as cb
      on ca.id = cb.category_id and
         cb.budgeted_date = ${budgetdate}::date - interval '1 month'
      where budget_id = ${budgetid}
      group by cg.budget_id
      `;
      return await db.oneOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async budgetedLastMonthByCategoryId(data) {
    const {
      categoryid,
      budgetdate
    } = data;

    try {
      const query = SQL`
      select cb.amount as budgetedlastmonth
      from categorygroup as cg
      left join category as ca
      on cg.id = ca.categorygroup_id
      left join categorybudgeted as cb
      on ca.id = cb.category_id and
         cb.budgeted_date = ${budgetdate}::date - interval '1 month'
      where
        ca.id = ${categoryid}
      `;
      return await db.oneOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }
}

function buildBudgetTable(budgetList, budgetdate_month) {
  const data = {};
  let max_date = '';

  budgetList.forEach((item) => {
    if(item.date > max_date) {
      max_date = item.date;
    }
  });

  budgetList.forEach((item, index) => {
    if (data[item.categorygroup_id] === undefined){
      data[item.categorygroup_id] = {};
      data[item.categorygroup_id].categorygroup_id = item.categorygroup_id;
      data[item.categorygroup_id].categorygroup_name = item.categorygroup_name;
      data[item.categorygroup_id].categorygroup_position = item.categorygroup_position;
      data[item.categorygroup_id].categorygroup_is_hidden = item.categorygroup_is_hidden;
      data[item.categorygroup_id].available = 0;
      data[item.categorygroup_id].budgeted = 0;
      data[item.categorygroup_id].activity = 0;
      data[item.categorygroup_id].items = {};
    }

    if (data[item.categorygroup_id].items[item.category_id] === undefined){
      data[item.categorygroup_id].items[item.category_id] = {};
      data[item.categorygroup_id].items[item.category_id].category_id = item.category_id;
      data[item.categorygroup_id].items[item.category_id].category_name = item.category_name;
      data[item.categorygroup_id].items[item.category_id].category_position = item.category_position;
      data[item.categorygroup_id].items[item.category_id].category_is_hidden = item.category_is_hidden;
      data[item.categorygroup_id].items[item.category_id].goal_amount = item.goal_amount;
      data[item.categorygroup_id].items[item.category_id].goal_enddate = item.goal_enddate;
      data[item.categorygroup_id].items[item.category_id].budgeted = 0;
      data[item.categorygroup_id].items[item.category_id].activity = 0;
      data[item.categorygroup_id].items[item.category_id].available = 0;
    }

    data[item.categorygroup_id].items[item.category_id].available += Number(item.budgeted) + Number(item.activity);
    if (item.date === max_date) {
      data[item.categorygroup_id].available += data[item.categorygroup_id].items[item.category_id].available;
    }

    if (item.date === budgetdate_month) {
      data[item.categorygroup_id].items[item.category_id].budgeted = item.budgeted;
      data[item.categorygroup_id].items[item.category_id].activity = item.activity;
      data[item.categorygroup_id].budgeted += Number(item.budgeted);
      data[item.categorygroup_id].activity += Number(item.activity);
    }
  });

  const returnData = [];

  Object.keys(data).forEach((key, index) => {
    const header = data[key];
    returnData.push({
      header: {
        categorygroup_id: header.categorygroup_id.toString(),
        categorygroup_name: header.categorygroup_name,
        categorygroup_position: header.categorygroup_position,
        categorygroup_is_hidden: header.categorygroup_is_hidden,
        available: header.available.toFixed(2),
        budgeted: header.budgeted.toFixed(2),
        activity: header.activity.toFixed(2)
      },
      items: []
    });

    Object.keys(data[key].items).forEach((itemKey) => {
      const item = data[key].items[itemKey];
      if (item.category_id) {
        returnData[index].items.push({
          category_id: item.category_id.toString(),
          category_name: item.category_name,
          category_position: item.category_position,
          category_is_hidden: item.category_is_hidden,
          goal_amount: item.goal_amount,
          goal_enddate: item.goal_enddate,
          available: item.available.toFixed(2),
          budgeted: item.budgeted ? item.budgeted : "0.00",
          activity: item.activity ? item.activity : "0.00"
        });
      }
    });

    returnData[index].items.sort((a, b) => {
      return a.category_position - b.category_position;
    });
  });

  returnData.sort((a, b) => {
    return a.header.categorygroup_position - b.header.categorygroup_position;
  });

  return returnData;
}

module.exports = Budget;
