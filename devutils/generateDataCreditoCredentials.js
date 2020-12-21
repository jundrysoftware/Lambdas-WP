const { encrypt } = require('../shared/utils/crypto')

const username = "XXXXXXX";
const password = "passwprd";
const secondpass = "secondpass";


console.log('User', encrypt(username))
console.log('Password', encrypt(password))
console.log('secondpass', encrypt(secondpass))

console.log('Update your user entry and put the last information under setting.datacredito')