// import API from './apiInstance.js';
import axios from 'axios';
const APIUrl = 'http://localhost:8888/';
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
   // return API.get(`user/phases/${phaseNum}?month=${phaseMonth}`)
   const token = sessionStorage.getItem('session');
   return axios.get(
      APIUrl + 'user/phases',
      {
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
         }
      }
   )
   .then((response) => {
      const responseData = Array.isArray(response.data) ? response.data : [];
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
   .catch(() => { 
      return []; // 保證錯誤情況下回傳空陣列
   });
}

// 取得用戶暱稱 API
export function getUserNickName(uid, phaseNum, phaseMonth) {
   const phaseMapping = {
      '1': '意圖前期',
      '2': '意圖期',
      '3': '準備期',
      '4': '行動期',
      '5': '維持期'
   };

   // return API.get(`user/phases/${phaseNum}?month=${phaseMonth}`)
   const token = sessionStorage.getItem('session');
   return axios.get(
      APIUrl + 'user/phases',
      {
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
         }
      }
   )
   .then((response) => {
      const foundItem = response.data.find((item) => item.id === uid);
      const nickname = foundItem.nickname;
      const phase = phaseMapping[phaseNum];
      const month = phaseMonth.split("-")[1];
      const completionRate = (foundItem.completionRate*100).toFixed(2) + '%';

      return {month, phase, nickname, completionRate};
   })
}


// 取得心得回饋 API
export function getFeedback() {
   // return API.get(`users/:${uid}/phases-feedbacks?yearMonth=${phaseMonth}`)
   const token = sessionStorage.getItem('session');
   return axios.get(
      APIUrl + 'users/:userId/phases-feedbacks',
      {
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
         }
      }
   )
   .then((response) => {
      return response.data;
   })
}
