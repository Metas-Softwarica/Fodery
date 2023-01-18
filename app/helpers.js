export function convertToObjectWithIdAsKey(array) {
  let obj = {};
  array.forEach((element) => {
    obj[element.id] = element;
  });
  return obj;
}
