-- user
insert into "user"
(username, password)
values
('test', 'test');

-- budget
insert into budget
(name, user_id)
values
('Main Budget', 1);

-- user_budget
insert into user_budget
(user_id, budget_id, active)
values
(1, 1, true);

-- account
insert into account
(name, csv_delimiter, csv_decimalsymbol, csv_offset, csv_encoding, budget_id)
values
('ING-DiBa', ';', null, null, null, 1);

-- categorygroup
insert into categorygroup
(name, position, budget_id, inflow)
values
('Everyday Expenses', 1, 1, false),
('Funds', 2, 1, false),
('Longterm Savings', 3, 1, false),
('Monthly Bills', 4, 1, false),
('Inflow', -1, 1, true);

-- category
insert into category
(name, position, categorygroup_id, inflow)
values
('To be Budgeted', -1, 5, true),
('Groceries', 1, 1, false),
('Recreation', 2, 1, false),
('Shopping ', 3, 1, false),
('Vacation', 1, 2, false),
('Gifts', 2, 2, false),
('Unexpected Expenses', 3, 2, false),
('Housing', 2, 3, false),
('Retirement', 1, 3, false),
('Emergency', 3, 3, false),
('Rent', 1, 4, false),
('Utilities', 2, 4, false),
('Electricity', 3, 4, false),
('Insurances', 4, 4, false),
('Contact lenses', 5, 4, false),
('Spotify', 8, 4, false),
('Phone', 7, 4, false),
('Internet', 6, 4, false);

-- categorybudgeted
insert into categorybudgeted
(budgeted_date, amount, category_id)
values
('20170101', 300, 2),
('20170201', 300, 2),
('20170301', 300, 2),
('20170401', 300, 2),
('20170501', 300, 2),
('20170601', 300, 2),
('20170701', 300, 2),
('20170801', 300, 2),
('20170901', 300, 2),
('20171001', 300, 2),
('20171101', 300, 2),
('20171201', 300, 2),
('20180101', 300, 2),
('20170101', 300, 3),
('20170201', 300, 3),
('20170301', 300, 3),
('20170401', 300, 3),
('20170501', 300, 3),
('20170601', 300, 3),
('20170701', 300, 3),
('20170801', 300, 3),
('20170901', 300, 3),
('20171001', 300, 3),
('20171101', 300, 3),
('20171201', 300, 3),
('20180101', 300, 3),
('20170101', 100, 4),
('20170201', 100, 4),
('20170301', 100, 4),
('20170401', 100, 4),
('20170501', 100, 4),
('20170601', 100, 4),
('20170701', 100, 4),
('20170801', 100, 4),
('20170901', 100, 4),
('20171001', 100, 4),
('20171101', 100, 4),
('20171201', 100, 4),
('20180101', 100, 4),
('20170101', 100, 5),
('20170201', 100, 5),
('20170301', 100, 5),
('20170401', 100, 5),
('20170501', 100, 5),
('20170601', 100, 5),
('20170701', 100, 5),
('20170801', 100, 5),
('20170901', 100, 5),
('20171001', 100, 5),
('20171101', 100, 5),
('20171201', 100, 5),
('20180101', 100, 5),
('20170101', 50, 6),
('20170201', 50, 6),
('20170301', 50, 6),
('20170401', 50, 6),
('20170501', 50, 6),
('20170601', 50, 6),
('20170701', 50, 6),
('20170801', 50, 6),
('20170901', 50, 6),
('20171001', 50, 6),
('20171101', 50, 6),
('20171201', 50, 6),
('20180101', 50, 6),
('20170101', 50, 7),
('20170201', 50, 7),
('20170301', 50, 7),
('20170401', 50, 7),
('20170501', 50, 7),
('20170601', 50, 7),
('20170701', 50, 7),
('20170801', 50, 7),
('20170901', 50, 7),
('20171001', 50, 7),
('20171101', 50, 7),
('20171201', 50, 7),
('20180101', 50, 7),
('20161201', 10000, 8),
('20170101', 100, 8),
('20170201', 100, 8),
('20170301', 100, 8),
('20170401', 100, 8),
('20170501', 100, 8),
('20170601', 100, 8),
('20170701', 100, 8),
('20170801', 100, 8),
('20170901', 100, 8),
('20171001', 100, 8),
('20171101', 100, 8),
('20171201', 100, 8),
('20180101', 100, 8),
('20161201', 5000, 9),
('20161201', 10000, 10),
('20170101', 600, 11),
('20170201', 600, 11),
('20170301', 600, 11),
('20170401', 600, 11),
('20170501', 600, 11),
('20170601', 600, 11),
('20170701', 600, 11),
('20170801', 600, 11),
('20170901', 600, 11),
('20171001', 600, 11),
('20171101', 600, 11),
('20171201', 600, 11),
('20180101', 600, 11),
('20170101', 200, 12),
('20170201', 200, 12),
('20170301', 200, 12),
('20170401', 200, 12),
('20170501', 200, 12),
('20170601', 200, 12),
('20170701', 200, 12),
('20170801', 200, 12),
('20170901', 200, 12),
('20171001', 200, 12),
('20171101', 200, 12),
('20171201', 200, 12),
('20180101', 200, 12),
('20170101', 50, 13),
('20170201', 50, 13),
('20170301', 50, 13),
('20170401', 50, 13),
('20170501', 50, 13),
('20170601', 50, 13),
('20170701', 50, 13),
('20170801', 50, 13),
('20170901', 50, 13),
('20171001', 50, 13),
('20171101', 50, 13),
('20171201', 50, 13),
('20180101', 50, 13),
('20170101', 50, 14),
('20170201', 50, 14),
('20170301', 50, 14),
('20170401', 50, 14),
('20170501', 50, 14),
('20170601', 50, 14),
('20170701', 50, 14),
('20170801', 50, 14),
('20170901', 50, 14),
('20171001', 50, 14),
('20171101', 50, 14),
('20171201', 50, 14),
('20180101', 50, 14),
('20170101', 50, 15),
('20170201', 50, 15),
('20170301', 50, 15),
('20170401', 50, 15),
('20170501', 50, 15),
('20170601', 50, 15),
('20170701', 50, 15),
('20170801', 50, 15),
('20170901', 50, 15),
('20171001', 50, 15),
('20171101', 50, 15),
('20171201', 50, 15),
('20180101', 50, 15),
('20170101', 10, 16),
('20170201', 10, 16),
('20170301', 10, 16),
('20170401', 10, 16),
('20170501', 10, 16),
('20170601', 10, 16),
('20170701', 10, 16),
('20170801', 10, 16),
('20170901', 10, 16),
('20171001', 10, 16),
('20171101', 10, 16),
('20171201', 10, 16),
('20180101', 10, 16),
('20170101', 10, 17),
('20170201', 10, 17),
('20170301', 10, 17),
('20170401', 10, 17),
('20170501', 10, 17),
('20170601', 10, 17),
('20170701', 10, 17),
('20170801', 10, 17),
('20170901', 10, 17),
('20171001', 10, 17),
('20171101', 10, 17),
('20171201', 10, 17),
('20180101', 10, 17),
('20170101', 30, 18),
('20170201', 30, 18),
('20170301', 30, 18),
('20170401', 30, 18),
('20170501', 30, 18),
('20170601', 30, 18),
('20170701', 30, 18),
('20170801', 30, 18),
('20170901', 30, 18),
('20171001', 30, 18),
('20171101', 30, 18),
('20171201', 30, 18),
('20180101', 30, 18);

-- turnover
insert into turnover
(amount, turnover_date, note, account_id, category_id, payee, source)
values
(25000,'20161201', 'Init', 1, 1,'','M'),
(2000,'20170101', null, 1, 1,'Company AG','M'),
(2000,'20170201', null, 1, 1,'Company AG','M'),
(2000,'20170301', null, 1, 1,'Company AG','M'),
(2000,'20170401', null, 1, 1,'Company AG','M'),
(2000,'20170501', null, 1, 1,'Company AG','M'),
(2000,'20170601', null, 1, 1,'Company AG','M'),
(2000,'20170701', null, 1, 1,'Company AG','M'),
(2000,'20170801', null, 1, 1,'Company AG','M'),
(2000,'20170901', null, 1, 1,'Company AG','M'),
(2000,'20171001', null, 1, 1,'Company AG','M'),
(2000,'20171101', null, 1, 1,'Company AG','M'),
(2000,'20171201', null, 1, 1,'Company AG','M'),
(2000,'20180101', null, 1, 1,'Company AG','M'),
(-100,'20170101', null, 1, 2,'Edeka','M'),
(-50,'20170101', null, 1, 2,'ALDI','M'),
(-50,'20170101', null, 1, 2,'LIDL','M'),
(-100,'20170101', null, 1, 3,'Vinci Due','M'),
(-70,'20170101', null, 1, 3,'','M'),
(-30,'20170101', null, 1, 3,'','M'),
(-50,'20170101', null, 1, 4,'Amazon','M'),
(-25,'20170101', null, 1, 4,'Media Markt','M'),
(-25,'20170101', null, 1, 4,'Amazon','M'),
(-150,'20170201', null, 1, 2,'','M'),
(-25,'20170201', null, 1, 2,'','M'),
(-25,'20170201', null, 1, 2,'','M'),
(-30,'20170201', null, 1, 3,'','M'),
(-20,'20170201', null, 1, 3,'','M'),
(-50,'20170201', null, 1, 3,'','M'),
(-100,'20170201', null, 1, 4,'','M'),
(-150,'20170301', null, 1, 2,'','M'),
(-75,'20170301', null, 1, 2,'','M'),
(-75,'20170301', null, 1, 2,'','M'),
(-50,'20170301', null, 1, 3,'','M'),
(-75,'20170301', null, 1, 3,'','M'),
(-75,'20170301', null, 1, 3,'','M'),
(-25,'20170401', null, 1, 2,'','M'),
(-25,'20170401', null, 1, 2,'','M'),
(-50,'20170401', null, 1, 2,'','M'),
(-100,'20170401', null, 1, 3,'','M'),
(-75,'20170401', null, 1, 4,'','M'),
(-25,'20170401', null, 1, 4,'','M'),
(-200,'20170501', null, 1, 2,'','M'),
(-50,'20170501', null, 1, 2,'','M'),
(-50,'20170501', null, 1, 2,'','M'),
(-300,'20170501', null, 1, 3,'','M'),
(-100,'20170501', null, 1, 4,'','M'),
(-100,'20170501', null, 1, 4,'','M'),
(-100,'20170601', null, 1, 2,'','M'),
(-50,'20170601', null, 1, 2,'','M'),
(-20,'20170601', null, 1, 3,'','M'),
(-50,'20170601', null, 1, 4,'','M'),
(-25,'20170601', null, 1, 4,'','M'),
(-25,'20170601', null, 1, 4,'','M'),
(-25,'20170701', null, 1, 2,'','M'),
(-25,'20170701', null, 1, 2,'','M'),
(-40,'20170701', null, 1, 3,'','M'),
(-10,'20170701', null, 1, 3,'','M'),
(-80,'20170701', null, 1, 4,'','M'),
(-250,'20170801', null, 1, 2,'','M'),
(-50,'20170801', null, 1, 2,'','M'),
(-190,'20170801', null, 1, 3,'','M'),
(-10,'20170801', null, 1, 3,'','M'),
(-5.55,'20170801', null, 1, 4,'','M'),
(-90,'20170801', null, 1, 4,'','M'),
(-4.45,'20170801', null, 1, 4,'','M'),
(-100,'20170901', null, 1, 2,'','M'),
(-150,'20170901', null, 1, 2,'','M'),
(-100,'20170901', null, 1, 2,'','M'),
(-150,'20170901', null, 1, 3,'','M'),
(-100,'20170901', null, 1, 3,'','M'),
(-250,'20170901', null, 1, 3,'','M'),
(-100,'20170901', null, 1, 4,'','M'),
(-100,'20171001', null, 1, 2,'','M'),
(-100,'20171001', null, 1, 3,'','M'),
(-150,'20171001', null, 1, 3,'','M'),
(-50,'20171001', null, 1, 3,'','M'),
(-100,'20171001', null, 1, 4,'','M'),
(-50,'20171101', null, 1, 2,'','M'),
(-50,'20171101', null, 1, 3,'','M'),
(-50,'20171101', null, 1, 4,'','M'),
(-25,'20171101', null, 1, 4,'','M'),
(-25,'20171101', null, 1, 4,'','M'),
(-100,'20171201', null, 1, 2,'','M'),
(-250,'20171201', null, 1, 2,'','M'),
(-200,'20171201', null, 1, 3,'','M'),
(-175,'20171201', null, 1, 3,'','M'),
(-30,'20171201', null, 1, 3,'','M'),
(-50,'20180101', null, 1, 2,'','M'),
(-50,'20180101', null, 1, 2,'','M'),
(-100,'20180101', null, 1, 3,'','M'),
(-70,'20180101', null, 1, 3,'','M'),
(-30,'20180101', null, 1, 3,'','M'),
(-50,'20180101', null, 1, 4,'','M'),
(-25,'20180101', null, 1, 4,'','M'),
(-25,'20180101', null, 1, 4,'','M'),
(-1000,'20171101', 'Norway', 1, 5,'Expedia','M'),
(-200,'20170501', 'Birthday present for person x', 1, 6,'Amazon','M'),
(-300,'20171201', 'Christmas presents', 1, 6,'Amazon','M'),
(-400,'20170901', 'Kitchen repair', 1, 7,'Kuechenstudio Kall','M'),
(-600,'20170101', null, 1, 11,'','M'),
(-200,'20170101', null, 1, 12,'','M'),
(-50,'20170101', null, 1, 13,'','M'),
(-50,'20170101', null, 1, 14,'','M'),
(-50,'20170101', null, 1, 15,'','M'),
(-10,'20170101', null, 1, 16,'','M'),
(-10,'20170101', null, 1, 17,'','M'),
(-30,'20170101', null, 1, 18,'','M'),
(-600,'20170201', null, 1, 11,'','M'),
(-200,'20170201', null, 1, 12,'','M'),
(-50,'20170201', null, 1, 13,'','M'),
(-50,'20170201', null, 1, 14,'','M'),
(-50,'20170201', null, 1, 15,'','M'),
(-10,'20170201', null, 1, 16,'','M'),
(-10,'20170201', null, 1, 17,'','M'),
(-30,'20170201', null, 1, 18,'','M'),
(-600,'20170301', null, 1, 11,'','M'),
(-200,'20170301', null, 1, 12,'','M'),
(-50,'20170301', null, 1, 13,'','M'),
(-50,'20170301', null, 1, 14,'','M'),
(-50,'20170301', null, 1, 15,'','M'),
(-10,'20170301', null, 1, 16,'','M'),
(-10,'20170301', null, 1, 17,'','M'),
(-30,'20170301', null, 1, 18,'','M'),
(-600,'20170401', null, 1, 11,'','M'),
(-200,'20170401', null, 1, 12,'','M'),
(-50,'20170401', null, 1, 13,'','M'),
(-50,'20170401', null, 1, 14,'','M'),
(-50,'20170401', null, 1, 15,'','M'),
(-10,'20170401', null, 1, 16,'','M'),
(-10,'20170401', null, 1, 17,'','M'),
(-30,'20170401', null, 1, 18,'','M'),
(-600,'20170501', null, 1, 11,'','M'),
(-200,'20170501', null, 1, 12,'','M'),
(-50,'20170501', null, 1, 13,'','M'),
(-50,'20170501', null, 1, 14,'','M'),
(-50,'20170501', null, 1, 15,'','M'),
(-10,'20170501', null, 1, 16,'','M'),
(-10,'20170501', null, 1, 17,'','M'),
(-30,'20170501', null, 1, 18,'','M'),
(-600,'20170601', null, 1, 11,'','M'),
(-200,'20170601', null, 1, 12,'','M'),
(-50,'20170601', null, 1, 13,'','M'),
(-50,'20170601', null, 1, 14,'','M'),
(-50,'20170601', null, 1, 15,'','M'),
(-10,'20170601', null, 1, 16,'','M'),
(-10,'20170601', null, 1, 17,'','M'),
(-30,'20170601', null, 1, 18,'','M'),
(-600,'20170701', null, 1, 11,'','M'),
(-200,'20170701', null, 1, 12,'','M'),
(-50,'20170701', null, 1, 13,'','M'),
(-50,'20170701', null, 1, 14,'','M'),
(-50,'20170701', null, 1, 15,'','M'),
(-10,'20170701', null, 1, 16,'','M'),
(-10,'20170701', null, 1, 17,'','M'),
(-30,'20170701', null, 1, 18,'','M'),
(-600,'20170801', null, 1, 11,'','M'),
(-200,'20170801', null, 1, 12,'','M'),
(-50,'20170801', null, 1, 13,'','M'),
(-50,'20170801', null, 1, 14,'','M'),
(-50,'20170801', null, 1, 15,'','M'),
(-10,'20170801', null, 1, 16,'','M'),
(-10,'20170801', null, 1, 17,'','M'),
(-30,'20170801', null, 1, 18,'','M'),
(-600,'20170901', null, 1, 11,'','M'),
(-200,'20170901', null, 1, 12,'','M'),
(-50,'20170901', null, 1, 13,'','M'),
(-50,'20170901', null, 1, 14,'','M'),
(-50,'20170901', null, 1, 15,'','M'),
(-10,'20170901', null, 1, 16,'','M'),
(-10,'20170901', null, 1, 17,'','M'),
(-30,'20170901', null, 1, 18,'','M'),
(-600,'20171001', null, 1, 11,'','M'),
(-200,'20171001', null, 1, 12,'','M'),
(-50,'20171001', null, 1, 13,'','M'),
(-50,'20171001', null, 1, 14,'','M'),
(-50,'20171001', null, 1, 15,'','M'),
(-10,'20171001', null, 1, 16,'','M'),
(-10,'20171001', null, 1, 17,'','M'),
(-30,'20171001', null, 1, 18,'','M'),
(-600,'20171101', null, 1, 11,'','M'),
(-200,'20171101', null, 1, 12,'','M'),
(-50,'20171101', null, 1, 13,'','M'),
(-50,'20171101', null, 1, 14,'','M'),
(-50,'20171101', null, 1, 15,'','M'),
(-10,'20171101', null, 1, 16,'','M'),
(-10,'20171101', null, 1, 17,'','M'),
(-30,'20171101', null, 1, 18,'','M'),
(-600,'20171201', null, 1, 11,'','M'),
(-200,'20171201', null, 1, 12,'','M'),
(-50,'20171201', null, 1, 13,'','M'),
(-50,'20171201', null, 1, 14,'','M'),
(-50,'20171201', null, 1, 15,'','M'),
(-10,'20171201', null, 1, 16,'','M'),
(-10,'20171201', null, 1, 17,'','M'),
(-30,'20171201', null, 1, 18,'','M'),
(-600,'20180101', null, 1, 11,'','M'),
(-200,'20180101', null, 1, 12,'','M'),
(-50,'20180101', null, 1, 13,'','M'),
(-50,'20180101', null, 1, 14,'','M'),
(-50,'20180101', null, 1, 15,'','M'),
(-10,'20180101', null, 1, 16,'','M'),
(-10,'20180101', null, 1, 17,'','M'),
(-30,'20180101', null, 1, 18,'','M');
