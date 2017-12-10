const UserController = require('../controllers/UserController');
const BudgetController = require('../controllers/BudgetController');
const CategoryController = require('../controllers/CategoryController');
const CategoryGroupController = require('../controllers/CategoryGroupController');
const CategoryBudgetedController = require('../controllers/CategoryBudgetedController');
const GoalController = require('../controllers/GoalController');
const AccountController = require('../controllers/AccountController');
const TurnoverController = require('../controllers/TurnoverController');
const authRequired = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (app) => {
  // Users
  app.post('/api/users/login',
    UserController.login);

  // Budgets
  app.get('/api/budgets/',
    authRequired,
    BudgetController.index);

  app.get('/api/:budgetid/budgets/list/:budgetdate',
    authRequired,
    BudgetController.list);

  app.get('/api/:budgetid/budgets/tobebudgeted/:budgetdate',
    authRequired,
    BudgetController.toBeBudgeted);

  app.get('/api/:budgetid/budgets/hidden',
    authRequired,
    BudgetController.getHiddenCount);

  app.get('/api/:budgetid/budgets/budgetedlastmonth/:budgetdate',
    authRequired,
    BudgetController.budgetedLastMonth);

  app.get('/api/budgets/budgetedlastmonth/:budgetdate/:categoryid',
    authRequired,
    BudgetController.budgetedLastMonthByCategoryId);

  // Categories
  app.get('/api/categories/:id',
    authRequired,
    CategoryController.find);

  app.get('/api/:budgetid/categories',
    authRequired,
    CategoryController.index);

  app.post('/api/categories',
    authRequired,
    CategoryController.create);

  app.post('/api/categories/positions',
    authRequired,
    CategoryController.updatePositions);

  app.put('/api/categories/:id',
    authRequired,
    CategoryController.update);

  app.put('/api/:budgetid/categories/unhide',
    authRequired,
    CategoryController.unhideAll);

  app.delete('/api/categories/:id',
    authRequired,
    CategoryController.delete);

   // CategoryGroups
  app.get('/api/categorygroups/:id',
    authRequired,
    CategoryGroupController.find);

  app.get('/api/:budgetid/categorygroups',
    authRequired,
    CategoryGroupController.index);

  app.post('/api/:budgetid/categorygroups',
    authRequired,
    CategoryGroupController.create);

  app.post('/api/categorygroups/positions',
    authRequired,
    CategoryGroupController.updatePositions);

  app.put('/api/categorygroups/:id',
    authRequired,
    CategoryGroupController.update);

  app.put('/api/categorygroups/:id/unhide',
    authRequired,
    CategoryGroupController.unhide);

  app.delete('/api/categorygroups/:id',
    authRequired,
    CategoryGroupController.delete);

  // CategoriesBudgeted
  app.get('/api/categoriesbudgeted',
    authRequired,
    CategoryBudgetedController.index);

  app.put('/api/categoriesbudgeted/:id/:date',
    authRequired,
    CategoryBudgetedController.update);

  app.post('/api/:budgetid/categoriesbudgeted/lastmonth/:date',
    authRequired,
    CategoryBudgetedController.lastMonth);

  app.post('/api/categoriesbudgeted/lastmonth/:categoryid/:date',
    authRequired,
    CategoryBudgetedController.lastMonthByCategoryId);

  // Goals
  app.get('/api/goals/:id',
    authRequired,
    GoalController.find);

  app.get('/api/:budgetid/goals',
    authRequired,
    GoalController.index);

  app.post('/api/goals',
    authRequired,
    GoalController.create);

  app.put('/api/goals/:id',
    authRequired,
    GoalController.update);

  app.delete('/api/goals/:id',
    authRequired,
    GoalController.delete);

  // Accounts
  app.get('/api/accounts/:id',
    authRequired,
    AccountController.find);

  app.put('/api/accounts/:id',
    authRequired,
    AccountController.update);

  app.get('/api/:budgetid/accounts',
    authRequired,
    AccountController.index);

  app.get('/api/:budgetid/accounts/balance',
    authRequired,
    AccountController.balance);

  app.post('/api/:budgetid/accounts',
    authRequired,
    AccountController.create);

  // Turnovers
  app.get('/api/:budgetid/turnovers',
    authRequired,
    TurnoverController.index);

  app.get('/api/:budgetid/turnovers/minmaxdate',
    authRequired,
    TurnoverController.minMaxDate);

  app.get('/api/:budgetid/turnovers/payees',
    authRequired,
    TurnoverController.payees);

  app.post('/api/turnovers',
    authRequired,
    TurnoverController.create);

  app.post('/api/turnovers/copy',
    authRequired,
    TurnoverController.copy);

  app.put('/api/turnovers/:id',
    authRequired,
    TurnoverController.update);

  app.delete('/api/turnovers',
    authRequired,
    TurnoverController.delete);
}
