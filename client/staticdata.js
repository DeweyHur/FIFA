const Papa = require('papaparse');

exports.fetch = async () => {
  const parse = (resolve, name, key) => {
    Papa.parse(`${window.location.origin}/${name}.csv`, {
      header: true,
      dynamicTyping: true,
      download: true,
      complete: results => {
        exports[name] = _.keyBy(_.values(results.data), key);;
        resolve();
      }
    });
  }
  return Promise.all([ 
    new Promise((resolve) => parse(resolve, 'teams', 'id')),
    new Promise((resolve) => parse(resolve, 'players', 'playerid'))
  ]);
}