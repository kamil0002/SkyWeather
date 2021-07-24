export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Ładowanie danych nie powiodło się, operacje trwała zbyt długo - (${s}s) `));
    }, s * 1000);
  });
};
