function Validate(name, value) {
  const list = {
    // eslint-disable-next-line
    Name: /^[a-zA-Z ]{5,}$/g.test(value) && value, // eslint-disable-next-line
    Username: /^[a-zA-Z0-9 \.\-_]{5,15}$/g.test(value) && value, // eslint-disable-next-line
    Email:
      /^[a-zA-Z0-9\.\-_]{6,30}[@][a-zA-Z0-9]{3,10}[\.][a-zA-Z0-9]{2,7}$/g.test(
        value
      ) && value, // eslint-disable-next-line
    Password: /^[ -~]{8,30}$/g.test(value) && value,
  }
  return list[name]
}
module.exports = Validate
