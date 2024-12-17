import API from './apiInstance.js';
import { splitDataFunc } from '../components/JS/splitDataFunc.js';

let cachedConsultData = {
   data: null,
   type: null,
   startTime: null,
   endTime: null,
   title: null
};

// 取得諮詢資訊 API
export function getConsultResult(type = '', startTime, endTime, title, perPageNum = 10, forceUpdate = false) {
   // 如果沒有強制更新，有暫存資料且查詢條件相同，直接分頁處理
   if (
      !forceUpdate &&
      cachedConsultData.data &&
      cachedConsultData.type === type &&
      cachedConsultData.startTime === startTime &&
      cachedConsultData.endTime === endTime &&
      cachedConsultData.title === title
   ) {
      const paginatedData = splitDataFunc(cachedConsultData.data, perPageNum);
      return Promise.resolve(paginatedData);
   }

   // 動態建立查詢參數
   const params = {};
   if (title) params.title = title;
   if (startTime) params.startTime = startTime;
   if (endTime) params.endTime = endTime;

   const queryString = new URLSearchParams(params).toString();

   // 如果進行新的查詢，進行 API 請求
   return API.get(`consult/user?${queryString}`)
   .then((response) => {
      const data = response.data;

      // 篩選諮詢類別
      const filteredData = data.filter((item) => type === '' || item.consult_type === type);

      // 將資料暫存
      cachedConsultData = {
         data: filteredData,
         type,
         startTime,
         endTime,
         title,
      };

      // 進行分頁處理
      const paginatedData = splitDataFunc(filteredData, perPageNum);
      return paginatedData;
   })
   .catch(() => { 
      return [];
   });
}

export function getExpertConsultResult(type = '', startTime, endTime, title, perPageNum = 10, forceUpdate = false) {
   // 如果沒有強制更新，有暫存資料且查詢條件相同，直接分頁處理
   if (
      !forceUpdate &&
      cachedConsultData.data &&
      cachedConsultData.type === type &&
      cachedConsultData.startTime === startTime &&
      cachedConsultData.endTime === endTime &&
      cachedConsultData.title === title
   ) {
      const paginatedData = splitDataFunc(cachedConsultData.data, perPageNum);
      return Promise.resolve(paginatedData);
   }

   const params = {};
   if (title) params.title = title;
   if (startTime) params.startTime = startTime;
   if (endTime) params.endTime = endTime;

   const queryString = new URLSearchParams(params).toString();

   // 如果進行新的查詢，進行 API 請求
   return API.get(`consult/expert?${queryString}`)
   .then((response) => {
      const data = response.data;
      const filteredData = data.filter((item) => type === '' || item.consult_type === type);

      cachedConsultData = {
         data: filteredData,
         type,
         startTime,
         endTime,
         title,
      };

      // 進行分頁處理
      const paginatedData = splitDataFunc(filteredData, perPageNum);
      return paginatedData;
   })
   .catch(() => { 
      return []; // 保證錯誤情況下回傳空陣列
   });
}

// 撈取2天內的諮詢
export function get2DayConsultResult(startTime, endTime) { 
   return API.get(`consult/user?startTime=${startTime}&endTime=${endTime}`)
   .then((response) => {
      const data = response.data;
      console.log(data);
      let currentConsultNum = 0;

      for(let i=0; i<data.length; i++) {
         currentConsultNum += 1;
      }

      return currentConsultNum;
   })
   .catch(() => { 
      return [];
   });
}

// 諮詢詳細資訊 API
export function getConsultInfo(meetId) {
   return API.get(`consult/user/${meetId}`)
   .then((response) => {
      return response.data;
   })
}

export function getExpertConsultInfo(meetId) {
   return API.get(`consult/expert/${meetId}`)
   .then((response) => {
      return response.data;
   })
}

// 預約諮詢行程 API
export function postReserveConsult() { 
   return API.post('consult/user/reserve')
   .then(() => {
      sessionStorage.setItem('hasPendingSurvey', 'true');
      alert("已送出個人諮詢申請，請耐心等候管理者與您聯繫~");
      window.location.reload();
   })
}

export function getReserveOutcome() {
   return API.get(`consult/user/reserve`)
   .then((response) => {
      return response.data;
   })
}