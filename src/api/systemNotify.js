import API from './apiInstance.js';

// 取得帳號資料 API
function getConsultNotify() { 
   return API.get('consult/notify').then((response) => { 
      return response.data;
   });
}

// 取得內容資料 API


// 整合兩個 API 的資料
export async function integrateNotify() {
   try {
      const consultNotify = await getConsultNotify();

      const integrateNotify = [];

      for (let i = 0; i < consultNotify.length; i++) {
         const item = { ...consultNotify[i], notifyType: "0" };
         integrateNotify.push(item);
      }

      console.log(integrateNotify);

      return integrateNotify;
   } catch {
      return []; // 發生錯誤時返回空陣列
   }
}
