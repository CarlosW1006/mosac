import axios from 'axios';

const API = axios.create({
   baseURL: process.env.VUE_APP_API_URL,
   headers: {
      'Content-Type': 'application/json',
   },
});

let hasShownAlert = false;
let hasShownSysAlert = false;
let hasShownOtherAlert = false;

API.interceptors.request.use((config) => {
   const token = sessionStorage.getItem('session');
   if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
   }
   return config;
});

API.interceptors.response.use(
   (response) => {
      return response;
   },
   (error) => {
      if (error.response) {
         const { status, data } = error.response;

         if (status === 403) {
            if (!hasShownAlert) {
               hasShownAlert = true;
               alert('您的登入已逾時，請重新登入');
            }
            return Promise.reject({ handled: true });
         } else if (data && data.message) {
            if (!hasShownSysAlert) {
               hasShownSysAlert = true;
               alert(data.message);
            }
            return Promise.reject({ handled: true });
         } else {
            if (!hasShownOtherAlert) {
               hasShownOtherAlert = true;
               alert('資料處理發生異常，請聯絡系統管理員');
            }
            return Promise.reject({ handled: true });
         }
      } else {
         if (!hasShownOtherAlert) {
            hasShownOtherAlert = true;
            alert(`發生錯誤：${error.message}`);
         }
         return Promise.reject({ handled: true });
      }
   }
);


export default API;
