import API from './apiInstance.js';
import { splitDataFunc } from '../components/JS/splitDataFunc.js';

let cachedGroupRankingData = {
   data: null,
   phaseNum: null,
   phaseMonth: null
};

// 取得階段排名 API
export function getGroupRanking(phaseNum, phaseMonth, perPageNum, forceUpdate = false) {
   // 如果沒有強制更新，有暫存資料且查詢條件相同，直接分頁處理
   if (!forceUpdate && cachedGroupRankingData.data && cachedGroupRankingData.phaseNum === phaseNum &&
   cachedGroupRankingData.phaseMonth === phaseMonth) {
      const paginatedData = splitDataFunc(cachedGroupRankingData.data, perPageNum);
      return Promise.resolve(paginatedData);
   }

   // 如果進行新的查詢，進行 API 請求
   return API.get(`user/phases/${phaseNum}?month=${phaseMonth}`)
   .then((response) => { 
      const responseData = Array.isArray(response.data) ? response.data : [];

      for(let i = 0; i < responseData.length; i++) {
         responseData[i].blockname = responseData[i].name[0] + 'Ｏ' + responseData[i].name.slice(2);
      }

      // 將資料暫存
      cachedGroupRankingData = {
         data: responseData,
         phaseNum,
         phaseMonth
      };

      // 進行分頁處理
      const paginatedData = splitDataFunc(responseData, perPageNum);
      return paginatedData;
   })
   .catch((error) => {
      alert(error); 
      return []; // 保證錯誤情況下回傳空陣列
   });
}

// 取得心得回饋 API
export function getFeedback(phaseRecordId, phaseMonth) { 
   const phaseMapping = {
      '1': '意圖前期',
      '2': '意圖期',
      '3': '準備期',
      '4': '行動期',
      '5': '維持期'
   };

   return API.get(`/user/phaseRecords/${phaseRecordId}/feedback`)
   .then((response) => { 
      response.data.phase = phaseMapping[response.data.phase];
      response.data.phaseMonth = phaseMonth.split("-")[1] + '月';
      response.data.completionRate = (response.data.completionRate*100).toFixed(2) + '%';
      response.data.blockname = response.data.user.name[0] + 'Ｏ' + response.data.user.name.slice(2);
      const feedBackInfo = response.data;
      return feedBackInfo;
   })
   .catch((error) => {
      alert(error); 
      return []; // 保證錯誤情況下回傳空陣列
   });
}
