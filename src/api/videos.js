// import API from './apiInstance.js';
import axios from 'axios';
const APIUrl = 'http://localhost:8888/';
import { splitDataFunc } from '../components/JS/splitDataFunc.js';

// 取得內容資料 API Start //
export function askContentData(currentPhase, categories, selectPerPageNum) { 
   const HCVideosArr = [];
   const HNVideosArr = [];

   // return API.get('user/videos')
   const token = sessionStorage.getItem('session');
   return axios.get(
      APIUrl + 'user/videos',
      {
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
         }
      }
   )
   .then((response) => {
      response.data.forEach((item) => {
         for(let i=0; i<item.phaseCategories.length; i++) {
            for(let j=0; j<item.categories.length; j++) {
               if((currentPhase == item.phaseCategories[i]) && (categories == item.categories[j])) {
                  if(categories == 0) {
                     HCVideosArr.push(item);
                  } else {
                     HNVideosArr.push(item);
                  }
               }
            }
         }
      });

      if(categories == 0) {
         // 進行分頁處理
         const paginatedData = splitDataFunc(HCVideosArr, selectPerPageNum);
         return { paginatedData };
      } else {
         // 進行分頁處理
         const paginatedData = splitDataFunc(HNVideosArr, selectPerPageNum);
         return { paginatedData };
      }
   })
   .catch((error) => {
      if (error.response && error.response.data && error.response.data.message) {
         alert(error.response.data.message); // 顯示伺服器返回的錯誤訊息
      } else {
         alert('資料處理發生異常，請聯絡系統管理員');
      }
   });
}
// 取得內容資料 API End //