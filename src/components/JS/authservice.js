import { askVerifyCode, login, changePassword } from '@/api/auth';

// 呼叫驗證碼 API Start //
export function getVerifyCode(verifyCodeArr) {
   return askVerifyCode().then((response) => {
      verifyCodeArr.value = response; // 更新 verifyCodeArr 的值
   });
}
// 呼叫驗證碼 API End //

// 呼叫登入功能 API Start//
export function sendAuth(accname, password, verifycode, verifyCode_ans) {
   const loginData = {
      action: "login",
      accName: accname,
      accPassword: password,
      verifyCode_reply: verifycode,
      verifyCode_ans: verifyCode_ans,
   };

   return login(loginData)
      .then((response) => {
         console.log('Received token:', response);
         sessionStorage.setItem('session', response.token);
         sessionStorage.setItem('accType', response.acc_type);
         sessionStorage.setItem('isSurvey', response.survey_status);
      })
}
// 呼叫登入功能 API End//

// 呼叫變更密碼 API Start//
export function sendPassword(accname, password, repassword, verifycode, verifyCode_ans) {
   const changePwdData = {
      accName: accname,
      accPassword: password,
      reaccPassword: repassword,
      verifyCode_reply: verifycode,
      verifyCode_ans: verifyCode_ans,
   };

   return changePassword(changePwdData)
      .then(() => {
         alert('新密碼變更成功');
      })
}
// 呼叫變更密碼 API End//

