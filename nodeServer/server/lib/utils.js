const capitalize = str => {
  return str.replace(/(^|\s)([a-z])/g, (m, p1, p2) => {
    return p1 + p2.toUpperCase();
  });
};

export { capitalize };
