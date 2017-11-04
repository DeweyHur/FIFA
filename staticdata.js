const _ = require('lodash');
const fs = require('fs');
const Papa = require('papaparse');

exports.fetch = () => {
  [ ['teams', 'id'], ['players', 'playerid']].forEach(item => {
    const [ name, key ] = item;
    Papa.parse(fs.readFileSync(`./views/${name}.csv`, 'utf8'), {
      header: true,
      dynamicTyping: true,
      complete: results => {
        exports[name] = _.keyBy(_.values(results.data), key);
      }
    });
  });
}