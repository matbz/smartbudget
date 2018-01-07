const csv = require('csvtojson');
const fs = require('fs');
const iconv = require('iconv-lite');
const moment = require('moment');
const { Transform } = require('stream');
const Account = require('../models/Account');
const Turnover = require('../models/Turnover');
const CSVMapping = require('../models/CSVMapping');

module.exports = {
  async index(req, res) {
    const account = new Account();
    try {
      const results = await account.all(req.params.budgetid);
      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to find all account'
      });
    }
  },
  async find(req, res) {
    const account = new Account();
    try {
      await account.find(req.params.id);
      res.json(account);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to find an account'
      });
    }
  },
  async balance(req, res) {
    const account = new Account();
    try {
      const results = await account.getBalance(req.params.budgetid, req.query);
      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to find account balances'
      });
    }
  },
  async spending(req, res) {
    const account = new Account();
    try {
      const results = await account.getSpending(req.params.budgetid, req.query);
      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to find account balances'
      });
    }
  },
  async create(req, res) {
    const account = new Account();
    try {
      await account.store(req.params.budgetid, req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to create an account'
      });
    }
  },
  async update(req, res) {
    const account = new Account();
    try {
      await account.find(req.params.id);

      Object.keys(account).map((key) => {
        if(req.body[key] != undefined) {
          account[key] = req.body[key];
        }
      });

      await account.save(account)
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update an account'
      });
    }
  },
  async import(req, res) {
    const account = new Account();
    const turnover = new Turnover();
    const csvmapping = new CSVMapping();

    await account.find(req.params.id);
    const mappings = await csvmapping.all(req.query.userid);

    try {
      const data = [];
      const file = req.file;
      const csvReadStream = fs.createReadStream(file.path, { encoding: account.csv_encoding }).pipe(new LineDropper(Number(account.csv_offset)));

      csv({
        delimiter: account.csv_delimiter,
      })
      .fromStream(csvReadStream)
      .on('json', (jsonRow) => {
        // Removes leading and double spaces
        const rowRaw = JSON.parse(JSON.stringify(jsonRow).replace(/"\s+|\s+"/g,'"').replace(/\s{2,}/g, ' '))
        const row = {};
        const mapping = JSON.parse(account.csv_mapping);

        Object.keys(mapping).forEach(key => {
          row[key] = rowRaw[mapping[key]];
        });

        mappings.forEach(e => {
          if (row['note'] && e.note && row['note'].toLowerCase().indexOf(e.note.toLowerCase()) !== -1) {
            row['categoryId'] = e.category_id;
          }

          if (row['payee'] && row['payee'] === e.payee_csv) {
            row['payee'] = e.payee;
            if (e.category_id && row['categoryId'] === undefined) {
              row['categoryId'] = e.category_id;
            }
          }

          if (e.category_id && row['categoryId'] === undefined && row['payee'] === e.payee) {
            row['categoryId'] = e.category_id;
          }
        });

        if (row['amount']) {
          row['amount'] = parseFloat(row['amount'].replace(',','.')).toFixed(2);
        }

        row['accountId'] = account.id;
        row['source'] = 'I';
        row['importedDate'] = new Date();

        if (row['turnoverDate']) {
          row['turnoverDate'] = moment(row['turnoverDate'], 'DD.MM.YYYY').toDate();
          data.push(row);
        }
      })
      .on('done', error => {
        fs.unlinkSync(file.path);

        turnover.createMultiple(data);

        res.json({
          importDate: new Date(),
          turnovers: data
        });
      })
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to upload a csv file.'
      });
    }
  }
};

class LineDropper extends Transform {
  constructor(lineCount) {
      super();
      this.lineCount = lineCount;
      this.trimCount = 0;
      this.doneTrimming = false;
  }

  _transform(chunk, enc, cb) {
       if (!this.doneTrimming) {
           const lines = chunk.toString().split(/\r?\n/);
           for (const _ of lines) {
                lines.shift();
                this.trimCount += 1;
                if (this.trimCount === this.lineCount) {
                    this.doneTrimming = true;
                    break;
                }
           }
           chunk = lines.join('\n');
        }
        if (chunk) {
            this.push(chunk);
        }
        cb();
   }
}
