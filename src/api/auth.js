import API from './apiInstance.js';

// 生成驗證碼 API
export function askVerify(verifyCodeArr) {
   return API.get('verification').then((response) => {
      const verify_id = response.data.verificationId;
      const verify_num1 = response.data.number1;
      const verify_num2 = response.data.number2;

      return  verifyCodeArr.value = { verify_id, verify_num1, verify_num2 };
   })
}

// 登入功能 API Start//
export function login(credential, password, verificationId, verifyAnswer) {
   return API.post('user/login',
      {
         credential: credential,
         password: password,
         verificationId: verificationId,
         verificationAnswer: Number(verifyAnswer),
      }
   )
   .then((response) => {
      console.log(response);
      const token = response.data.token;
      const userName = response.data.name;
      const userType = response.data.userType;
      const currentPhase = response.data.currentPhase;
      const hasPendingSurvey = response.data.hasPendingSurvey;
      
      sessionStorage.setItem('session', token);
      sessionStorage.setItem('accName', userName);
      sessionStorage.setItem('accType', userType);
      sessionStorage.setItem('credential', credential);
      sessionStorage.setItem('currentPhase', currentPhase);
      sessionStorage.setItem('hasPendingSurvey', hasPendingSurvey);
   })
}

// 忘記密碼 API
export function forgotPassword(credential, newPassword, verificationId, verifyAnswer) { 
   return API.patch('user/password',
      {
         credential: credential,
         passwordList:{
            newPassword: newPassword,
         },
         verificationId: verificationId,
         verificationAnswer: Number(verifyAnswer)
      }
   )
   .then(() => {
      alert('密碼變更成功');
   })
}

// 修改密碼 API
export function changePassword(originPassword, newPassword, verificationId, verifyAnswer) { 
   const credential = sessionStorage.getItem('credential');
   return API.patch('user/password',
      {
         credential: credential,
         passwordList:{
            originPassword: originPassword,
            newPassword: newPassword,
         },
         verificationId: verificationId,
         verificationAnswer: Number(verifyAnswer)
      }
   )
   .then(() => {
      alert('密碼變更成功');
   })
}
