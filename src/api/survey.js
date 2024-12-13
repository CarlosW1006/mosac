import API from './apiInstance.js';

// 傳送問卷結果 API
export function postSurveyOutcome(resultPhase) { 
   return API.post('user/survey-results',
      {
         resultPhase: resultPhase,
      }
   )
   .then(() => {
      sessionStorage.setItem('hasPendingSurvey', 'true');
   })
}