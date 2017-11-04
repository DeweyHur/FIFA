const Papa = require('papaparse');

exports.fetch = async () => {
  const parse = (resolve, name) => {
    Papa.parse(`${window.location.origin}/${name}.csv`, {
      header: true,
      dynamicTyping: true,
      download: true,
      complete: results => {
        exports[name] = results.data;
        resolve();
      }
    });
  }
  return Promise.all([ 
    new Promise((resolve) => parse(resolve, 'teams')),
    new Promise((resolve) => parse(resolve, 'players'))
  ]);
}