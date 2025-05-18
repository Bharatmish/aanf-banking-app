module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // 👆 nothing else—remove plugins line
  };
};
