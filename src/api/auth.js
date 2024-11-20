import API from './apiInstance';

// 生成驗證碼 API Start //
export function askVerify(verifyCodeArr) {
   return API.get('verification').then((response) => {
      const verify_id = response.data.verificationId;
      const verify_num1 = response.data.number1;
      const verify_num2 = response.data.number2;

      return  verifyCodeArr.value = { verify_id, verify_num1, verify_num2 };
   })
   .catch((error) => {
      if (error.response && error.response.data && error.response.data.message) {
         alert(error.response.data.message); // 顯示伺服器返回的錯誤訊息
      } else {
         alert('資料處理發生異常，請聯絡系統管理員');
      }
   });
}
// 生成驗證碼 API End //

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
      const token = response.data.token;
      const userType = response.data.userType;
      const hasPendingSurvey = response.data.hasPendingSurvey;
      
      sessionStorage.setItem('session', token);
      sessionStorage.setItem('accType', userType);
      sessionStorage.setItem('credential', credential);
      sessionStorage.setItem('hasPendingSurvey', hasPendingSurvey);
   })
   .catch((error) => {
      if (error.response && error.response.data && error.response.data.message) {
         alert(error.response.data.message); // 顯示伺服器返回的錯誤訊息
      } else {
         alert('資料處理發生異常，請聯絡系統管理員');
      }
   });
}
// 登入功能 API End//

// 忘記密碼 API Start//
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
   .catch((error) => {
      if (error.response && error.response.data && error.response.data.message) {
         alert(error.response.data.message); // 顯示伺服器返回的錯誤訊息
      } else {
         alert('資料處理發生異常，請聯絡系統管理員');
      }
   });
}
// 忘記密碼 API End//

// 修改密碼 API Start//
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
   .catch((error) => {
      if (error.response && error.response.data && error.response.data.message) {
         alert(error.response.data.message); // 顯示伺服器返回的錯誤訊息
      } else {
         alert('資料處理發生異常，請聯絡系統管理員');
      }
   });
}
// 修改密碼 API End//
