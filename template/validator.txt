const nameValidator = (name) => {
  return /^[a-zA-Z ]{2,30}$/.test(name);
}

const passwordValidator = (password) =>{
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);

}

const phoneValidator = (phoneNumber) =>{
   return /^[0]?[789]\d{9}$/.test(phoneNumber);
}

const emailValidator =(email) =>{
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
}

export default {emailValidator,phoneValidator,passwordValidator,nameValidator}