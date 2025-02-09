function genrateOTP(length = 6){
    let otp = '';
    for(let i=1; i<=length; i++){
        otp = otp + Math.floor(Math.random()*10);
    }
    return otp
}

export default genrateOTP;