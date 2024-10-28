import axios from 'axios';
const APIUrl = 'https://61a43e92-0ba6-4a79-96ae-0dc94502861b.mock.pstmn.io/'

// 生成驗證碼 API Start //
export function askVerifyCode() {
   return axios.get(
      APIUrl + 'responseVerifyCode',
      {
         headers: {
            'Content-Type': 'application/json'
         }
      }
   )
   .then((response) => {
      const verifyCode_id = response.data.data[0].verifyCode_id;
      const verifyCode_question = response.data.data[0].verifyCode_question;
      const verifyCode_ans = response.data.data[0].verifyCode_ans;

      return { verifyCode_id, verifyCode_question, verifyCode_ans };
   })
   .catch((error) => {
      alert('資料處理發生異常，請聯絡系統管理員 ', error);
      throw error;
   });
}
// 生成驗證碼 API End //

// 登入功能 API Start//
export function login(loginData) {
   if(loginData.accName=="" || loginData.accPassword=="" || loginData.verifyCode_reply=="") {
      alert("帳號、密碼或驗證碼欄位不可為空");
      return Promise.reject("帳號、密碼或驗證碼欄位不可為空");
   }
   else if(loginData.verifyCode_reply.toString() == loginData.verifyCode_ans) {
      return axios.get(
         APIUrl + '/responseAccID',
         loginData,
         {
            headers: {
               'Content-Type': 'application/json'
            }
         }
      )
      .then((response) => {
         const token = response.data.data[0].token;
         return token;
      })
      .catch((error) => {
         alert('資料處理發生異常，請聯絡系統管理員 ', error);
         throw error;
      });
   }
   else {
      return Promise.reject("請檢查帳號、密碼或驗證碼是否正確");
   }
}
// 登入功能 API End//

// 變更密碼 API Start//
export function changePassword(changePwdData) {
   if(changePwdData.accName=="" || changePwdData.accPassword=="" || changePwdData.reaccPassword=="" || changePwdData.verifyCode_reply=="") {
      return Promise.reject("帳號、新密碼或驗證碼欄位不可為空");
   }
   else if(changePwdData.verifyCode_reply.toString() == changePwdData.verifyCode_ans) {
      return axios.get(
         APIUrl + 'chagePwdAPI',
         changePwdData,
         {
            headers: {
               'Content-Type': 'application/json'
            }
         }
      )
      .then(() => {
         console.log('新密碼變更成功');
      })
      .catch((error) => {
         alert('資料處理發生異常，請聯絡系統管理員 ', error);
         throw error;
      });
   }
   else {
      return Promise.reject("驗證碼輸入錯誤");
   }
}
// 變更密碼 API End//

