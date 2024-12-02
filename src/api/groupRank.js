import API from './apiInstance.js';
// import axios from 'axios';
// const APIUrl = 'http://localhost:8888/';
import { splitDataFunc } from '../components/JS/splitDataFunc.js';

let cachedGroupRankingData = {
   data: null,
   phaseNum: null,
   phaseMonth: null
};

export function getGroupRanking(phaseNum, phaseMonth, selectPerPageNum, forceUpdate = false) {
   const phaseMapping = {
      '1': '意圖前期',
      '2': '意圖期',
      '3': '準備期',
      '4': '行動期',
      '5': '維持期'
   };

   // 如果沒有強制更新，有暫存資料且查詢條件相同，直接分頁處理
   if (!forceUpdate && cachedGroupRankingData.data && cachedGroupRankingData.phaseNum === phaseNum &&
   cachedGroupRankingData.phaseMonth === phaseMonth) {
      const paginatedData = splitDataFunc(cachedGroupRankingData.data, selectPerPageNum);
      return Promise.resolve(paginatedData);
   }

   // 如果進行新的查詢，進行 API 請求
   return API.get(`user/phases/${phaseNum}?month=${phaseMonth}`)
   // const token = sessionStorage.getItem('session');
   // return axios.get(
   //    APIUrl + 'user/phases/1',
   //    {
   //       headers: {
   //          'Content-Type': 'application/json',
   //          'Authorization': `Bearer ${token}` 
   //       }
   //    }
   // )
   .then((response) => {
      response.data.forEach((item) => {
         item.phase = phaseMapping[phaseNum];
      });

      // 將資料暫存
      cachedGroupRankingData = {
         data: response.data,
         phaseNum,
         phaseMonth
      };

      // 進行分頁處理
      const paginatedData = splitDataFunc(response.data, selectPerPageNum);
      return paginatedData;
   })
   .catch((error) => {
      if (error.response && error.response.data && error.response.data.message) {
         alert(error.response.data.message); // 顯示伺服器返回的錯誤訊息
      } else {
         alert('資料處理發生異常，請聯絡系統管理員' + error);
      }
   });
}