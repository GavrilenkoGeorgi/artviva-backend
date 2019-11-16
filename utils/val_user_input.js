const checkNameAndPass = (name, pass) => {
  const validPassPattern = /^[A-Za-z]\w{7,15}$/
  const validNamePattern = /^[a-z0-9_-]{3,16}$/

  const validName = name.match(validNamePattern)
  const validPass = pass.match(validPassPattern)

  return (validName && validPass ? true : false)
}

module.exports = {
  checkNameAndPass
}
