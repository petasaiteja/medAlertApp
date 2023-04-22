const joiAccount = obj => {
    const {fullname, email, password, sex, age} = obj
    const sexArr = ['f', 'F', 'Female', 'female', 'FEMALE', 'm', 'M', 'Male', 'male', 'MALE']
    if(fullname && email && password && sex && age){
        if(fullname.length > 2){
            if(sexArr.includes(sex)){
                if(Number(age)){
                    if(age >= 0){
                        if(password.length > 5){
                            return joiEmail(email)
                        }else{
                            return {status: false, message: 'Password must be at least 6 characters long'}
                        }
                    }else{
                        return {status: false, message: 'Age value cannot be less than zero(0)'}
                    }
                }else{
                    return {status: false, message: 'Age value must be a number'}
                }
            }else{
                return {status: false, message: 'Sex can either be F or M'}
            }
        }else{
            return {status: false, message: 'Fullname must be at least 3 characters long'}
        }
    }else{
        return {status: false, message: 'All the fields are required'}
    }
}

const joiEmail = email => {
    if(email){
        const splitE = email.split('@')
        const username = splitE[0]
        const dname = splitE[1]
        if(username && dname){
            const dsplit = dname.split('.')
            if(dsplit[0].length > 1 && dsplit[1].length > 1){
                return {status: true}
            }else{
                return {status: false, message: 'Invalid email address'}
            }
        }else{
            return {status: false, message: 'Invalid email address'}
        }
    }else{
        return {status: false, message: 'Email address is required'}
    }
}

const joiLogin = obj => {
    const {email, password} = obj;
    if(email && password){
        if(password.length > 5){
            return joiEmail(email)
        }else{
            return {status: false, message: 'Password length must be at least 6 characters'}
        }
    }else{
        return {status: false, message: 'All the fields are required'}
    }
}

const joiTitleNote = obj => {
    const {title, note} = obj
    if(title && note){
        return {status: true}
    }else{
        return {status: false, message: 'Title and Note fields cannot be empty'}
    }
}

const joiPrescription = obj => {
    const {name, total, dose} = obj
    if(name && total && dose){
        if(Number(total) && Number(dose)){
            if(Number(total) > 0){
                if(Number(dose) > 0){
                    return {status: true}
                }else{
                    return {status: false, message: 'Daily dosage value cannot be zero'}
                }
            }else{
                return {status: false, message: 'Total number of pills cannot be zero'}
            }
        }else{
            return {status: false, message: 'Total number of bills and daily dosage value must be a number'}
        }
    }else{
        return {status: false, message: 'All the fields are required'}
    }
}

export default {
    joiEmail,
    joiAccount,
    joiLogin,
    joiTitleNote,
    joiPrescription
}