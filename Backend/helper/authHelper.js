const bcrypt = require('bcrypt');

 const hashPassword = async(password)=>{
    try {
        const salt = 10
    const hashPassword =  await bcrypt.hash(password, salt)
    return hashPassword
    } catch (error) {
        console.log(error);
    }
}

 const comparePassword = async(password, hashPassword)=>{
    try {
    return bcrypt.compare(password, hashPassword);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {hashPassword, comparePassword}