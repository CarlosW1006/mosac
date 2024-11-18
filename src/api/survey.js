import axios from 'axios';
const APIUrl = 'http://localhost:3000/';
// const APIUrl = 'http://172.20.10.9:3000/';

// 傳送問卷結果 API Start//
export function postSurveyOutcome(resultPhase) {
   const token = sessionStorage.getItem('session');
   return axios.post(
      APIUrl + 'user/survey-results',
      {
         resultPhase: resultPhase,
      },
      {
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
         }
      }
   )
   .then(() => {
      sessionStorage.setItem('hasPendingSurvey', 'true');
   })
   .catch((error) => {
      if (error.response && error.response.data && error.response.data.message) {
         alert(error.response.data.message); // 顯示伺服器返回的錯誤訊息
      } else {
         alert('資料處理發生異常，請聯絡系統管理員' + error);
      }
   });
}
// 傳送問卷結果 API End//