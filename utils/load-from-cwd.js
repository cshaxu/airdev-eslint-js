function loadFromCwd(moduleName) {
  return require(require.resolve(moduleName, { paths: [process.cwd()] }));
}

module.exports = {
  loadFromCwd,
};
