DROP TABLE IF EXISTS goal CASCADE;
DROP TABLE IF EXISTS categorybudgeted CASCADE;
DROP TABLE IF EXISTS turnover CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS categorygroup CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS budget CASCADE;
DROP TABLE IF EXISTS user_budget CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- user
CREATE TABLE IF NOT EXISTS "user"(
	id serial primary key,
	username text unique not null,
	password text not null,
	report_startdate date default null,
  	attempts integer default 0
);

-- budget
CREATE TABLE IF NOT EXISTS budget(
	id serial primary key,
	name text not null,
	user_id integer not null,
  foreign key (user_id) references "user"(id)
);

--user_budget
CREATE TABLE IF NOT EXISTS user_budget(
	id serial primary key,
  user_id integer not null,
  budget_id integer not null,
  active boolean default false,
  foreign key (user_id) references "user"(id),
  foreign key (budget_id) references budget(id)
);

-- account
CREATE TABLE IF NOT EXISTS account(
	id serial primary key,
	name text not null,
	csv_delimiter text default null,
	csv_decimalsymbol text default null,
	csv_offset text default null,
	csv_encoding text default null,
  	csv_mapping text default null,
	budget_id integer not null,
	foreign key (budget_id) references budget(id)
);

-- categorygroup
CREATE TABLE IF NOT EXISTS categorygroup(
	id serial primary key,
	name text not null,
	position integer not null,
	is_hidden boolean default false,
 	inflow boolean default false,
	budget_id integer not null,
	foreign key (budget_id) references budget(id)
);


-- category
CREATE TABLE IF NOT EXISTS category(
	id serial primary key,
	name text not null,
	position integer not null,
	is_hidden boolean default false,
    inflow boolean default false,
	categorygroup_id integer not null,
	foreign key (categorygroup_id) references categorygroup(id)
);

--csvmapping
CREATE TABLE IF NOT EXISTS csvmapping(
	id serial primary key,
	payee_csv text default null,
  	payee text default null,
  	note text default null,
  	user_id integer not null,
	category_id integer default null,
  	foreign key (user_id) references "user"(id),
	foreign key (category_id) references category(id)
);

-- categorybudgeted
CREATE TABLE IF NOT EXISTS categorybudgeted(
	id serial primary key,
	budgeted_date date not null,
	amount numeric(14,2) default 0.00,
	category_id integer not null,
	foreign key (category_id) references category(id)
);

-- goal
CREATE TABLE IF NOT EXISTS goal(
	id serial primary key,
    enddate date default null,
	amount numeric(14,2) default 0.00,
	category_id integer not null,
	foreign key (category_id) references category(id)
);

-- turnover
CREATE TABLE IF NOT EXISTS turnover(
	id serial primary key,
	amount numeric(14,2) default 0.00,
	turnover_date date default null,
	note text default null,
	account_id integer not null,
	category_id integer default null,
    payee text default null,
    source char(1) default null,
    imported_date date default null,
	foreign key (account_id) references account(id),
	foreign key (category_id) references category(id)
);
