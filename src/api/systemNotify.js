import API from './apiInstance.js';

// 取得諮詢行程通知 API
function getConsultNotify() { 
   return API.get('consult/notify').then((response) => { 
      return response.data;
   });
}

// 取得健康知能通知 API


// 整合諮詢行程+健康知能通知
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
