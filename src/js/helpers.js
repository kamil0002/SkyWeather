export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject();
    }, s * 1000);
  });
};
