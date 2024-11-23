import API from './apiInstance';

// 傳送問卷結果 API Start//
export function postSurveyOutcome(resultPhase) { 
   return API.post('user/survey-results',
      {
         resultPhase: resultPhase,
      }
   )
   .then(() => {
      sessionStorage.setItem('hasPendingSurvey', 'true');
   })
   .catch((error) => {
      if (error.response && error.response.data && error.response.data.message) {
         alert(error.response.data.message); // 顯示伺服器返回的錯誤訊息
      } else {
         alert('資料處理發生異常，請聯絡系統管理員');
      }
   });
}
// 傳送問卷結果 API End//