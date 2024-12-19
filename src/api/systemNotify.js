import API from './apiInstance.js';
import { formatTime } from '../components/JS/formatTime.js';
import { splitDataFunc } from '../components/JS/splitDataFunc.js';

// 取得諮詢行程通知 API
function getConsultNotify() { 
   return API.get('consult/notify').then((response) => { 
      return response.data;
   });
}

// 取得健康知能通知 API
function getVideoNotify() { 
   return API.get('user/video-notifies').then((response) => { 
      return response.data;
   });
}

// 整合諮詢行程+健康知能通知
export async function integrateNotify(perPageNum) {
   try {
      const consultNotify = await getConsultNotify();
      const videoNotify = await getVideoNotify();
      const integrateNotify = [];
      let unReadedNumber = 0;

      for(let i = 0; i < consultNotify.length; i++) {
         consultNotify[i].createAt = formatTime(consultNotify[i].create_at);
         consultNotify[i].notifyVarId = consultNotify[i].consult_id;
         const item = { ...consultNotify[i], notifyType: "0" };
         integrateNotify.push(item);
      }

      for(let i = 0; i < videoNotify.length; i++) {
         videoNotify[i].createAt = formatTime(videoNotify[i].createAt);
         videoNotify[i].notifyVarId = videoNotify[i].id;
         videoNotify[i].readed = videoNotify[i].isRead;
         const item = { ...videoNotify[i], notifyType: "1" };
         integrateNotify.push(item);
      }

      integrateNotify.sort((a, b) => {
         const dateA = new Date(a.create_at || a.createAt);
         const dateB = new Date(b.create_at || b.createAt);
         return dateB - dateA;
      });

      for(let i = 0; i < integrateNotify.length; i++) {
         if(integrateNotify[i].readed === false) {
            unReadedNumber += 1;
         }
      }

      // 進行分頁處理
      const paginatedData = splitDataFunc(integrateNotify, perPageNum);

      return { paginatedData, unReadedNumber };
   } catch {
      return [];
   }
}

// 讀取健康知能 API
export function videoNotifyReaded(videoId) { 
   return API.post(`user/video-notifies/${videoId}/read`);
}

// 讀取諮詢行程 API
export function consultNotifyReaded(consultId) { 
   return API.patch('consult/notify',
      {
         consult_Id: consultId,
      }
   )
}