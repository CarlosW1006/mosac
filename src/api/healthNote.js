import API from './apiInstance.js';

export function changeDate(val) {
   const rawDate = new Date(val);
   const formattedDate = rawDate.getFullYear() + '/' +
   (rawDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
   rawDate.getDate().toString().padStart(2, '0');

   return(formattedDate);
}

// 健康手札紀錄 API Start //
export function askHealthNoteRecord(startAt, endAt) {
   return API.get('user/health-records',
      {
         params: {
            startAt: startAt,
            endAt: endAt
         },
      }
   ).then((response) => { 
      const groupByWeekArr = [];
      const HealthNoteRecord = [];
      let uncompleteNumber = 0;

      // 撈最近一筆重複日期記錄
      if(Array.isArray(response.data)) {
         for(let i = 0; i < response.data.length; i++) {
            response.data[i].createAt = changeDate(response.data[i].createAt);

            let isDuplicate = false;

            // 檢查是否有重複的 createAt
            for(let j = 0; j < HealthNoteRecord.length; j++) {
               if(HealthNoteRecord[j].createAt === response.data[i].createAt) {
                  isDuplicate = true;
                  break;
               }
            }

            if(!isDuplicate) {
               HealthNoteRecord.push(response.data[i]);
            }
         }

         // 更新 finish 狀態
         for(let j = 0; j < HealthNoteRecord.length; j++) {
            const record = HealthNoteRecord[j];
            const parsedCreateAt = new Date(record.createAt);
            // 確認每週6的體重紀錄
            const isSaturday = parsedCreateAt.getDay() === 6;
            // 確認每天的步數、慢跑、飲食紀錄
            const isDailyIncomplete = record.dailySteps == null || record.dailyJoggingTime == null || record.dailyDietGoal == null;
            // 確認第3、6個月最後一天的Hba1c紀錄
            const isLastDayofMonth = record.createAt === '2024/4/30' || record.createAt === '2024/7/31';

            if(isDailyIncomplete) {
               record.finish = 'false';
            }
            else if(isSaturday && record.weeklyWeight == null) {
               record.finish = 'false';
            }
            else if(isLastDayofMonth && record.HbA1c == null) {
               record.finish = 'false';
            }
            else {
               record.finish = 'true';
            }
         }
      }

      // 日期依照週數分類
      for(let i = 0; i < HealthNoteRecord.length; i++) {
         const rawDate = HealthNoteRecord[i].createAt;
         const d = new Date(Date.UTC(parseInt(rawDate.split('/')[0]), parseInt(rawDate.split('/')[1]) - 1, parseInt(rawDate.split('/')[2])));
         const dayNum = d.getUTCDay() || 7;
         d.setUTCDate(d.getUTCDate() + 4 - dayNum);
         const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
         const weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);

         if(!groupByWeekArr[weekNumber]) {
            groupByWeekArr[weekNumber] = [];
         }
         
         groupByWeekArr[weekNumber].push(HealthNoteRecord[i]);
      }

      // 計算沒有填寫的天數
      for(let i=0; i<HealthNoteRecord.length; i++) {
         if(HealthNoteRecord[i].finish === 'false') {
            uncompleteNumber += 1;
         }
      }
      if(HealthNoteRecord.length <= 3) { 
         uncompleteNumber += 3 - HealthNoteRecord.length;
      }

      return { HealthNoteRecord, uncompleteNumber };
      
   })
   .catch((error) => {
      if(error.response && error.response.data && error.response.data.message) {
         alert(error.response.data.message); // 顯示伺服器返回的錯誤訊息
      } else {
         alert('資料處理發生異常，請聯絡系統管理員');
      }
   });
}

// 健康手札紀錄 API End //
