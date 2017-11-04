const fs = require('fs');
const Papa = require('papaparse');

exports.fetch = () => {
  ['teams', 'players'].forEach(name => {
    Papa.parse(fs.readFileSync(`./views/${name}.csv`, 'utf8'), {
      header: true,
      dynamicTyping: true,
      complete: results => {
        exports[name] = results.data;
      }
    });
  });
}