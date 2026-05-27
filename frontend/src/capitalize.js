const capitalize = (text) => {
  const mayus = text.charAt(0).trim() !== "" ? text.charAt(0).toUpperCase() : text.charAt(1).toUpperCase();
  const rest = text.charAt(0).trim() !== "" ? text.slice(1).toLowerCase() : text.slice(2).toLowerCase();
  console.log(mayus + rest)
  return mayus + rest;
};

export default capitalize;