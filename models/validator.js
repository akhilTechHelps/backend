const nameValidator = (name) => {
  return /^[a-zA-Z ]{2,30}$/.test(name);
}

const passwordValidator = (password) =>{
  return /^(?=.[0-9])(?=.[!@#$%^&])[a-zA-Z0-9!@#$%^&]{6,16}$/.test(password);

}

const phoneValidator = (phoneNumber) =>{
   return /^[0]?[789]\d{9}$/.test(phoneNumber);
}

const emailValidator =(email) =>{
  return /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/.test(email);
}

module.exports = {emailValidator,phoneValidator,passwordValidator,nameValidator}