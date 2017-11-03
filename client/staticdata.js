
exports.fetch = () => {
  ['teams', 'players'].forEach(name => {
    Papa.parse(`${window.location.origin}/${name}.csv`, {
      header: true,
      dynamicTyping: true,
      download: true,
      complete: results => {
        exports[name] = results.data;
      }
    });
  });
}