import API from './apiInstance.js'; 
import { ref } from 'vue';

// 全局狀態管理
export const healthRecords = ref({
   records: {},  // 存儲所有記錄
});

// 更新記錄
export function updateHealthRecords(monthKey, records) {
   healthRecords.value.records[monthKey] = records;
}

// 獲取記錄
export function getHealthRecords(monthKey) {
   return healthRecords.value.records[monthKey] || [];
}

export function changeDate(val) {
   const rawDate = new Date(val);
   const formattedDate = rawDate.getFullYear() + '/' + 
   (rawDate.getMonth() + 1).toString().padStart(2, '0')
   + '/' + rawDate.getDate().toString().padStart(2, '0');

   return(formattedDate);
}

// 健康手札紀錄 API Start //
export function askHealthNoteRecord(startAt, endAt) {
   return API.get(
      'user/health-records',
      {
         params: {
            startAt: startAt,
            endAt: endAt
         },
      }
   )
   .then((response) => { 
      const HealthNoteRecord = [];
      let uncompleteNumber = 0;
      if(Array.isArray(response.data)) {
         // 整理記錄，去除重複
         response.data.forEach(record => {
            record.createAt = changeDate(record.createAt);
            if (!HealthNoteRecord.some(r => r.createAt === record.createAt)) {
               HealthNoteRecord.push(record);
            }
         });

         // 更新狀態
         HealthNoteRecord.forEach(record => {
            const recordDate = new Date(record.createAt);
            
            // 檢查基本記錄
            const hasBasicRecords = record.dailySteps != null && 
            record.dailyJoggingTime != null && record.dailyDietGoal != null;

            // 只在特殊日期檢查額外要求
            const isSaturday = recordDate.getDay() === 6;
            const month = recordDate.getMonth() + 1;
            const date = recordDate.getDate();
            const isQuarterEnd = 
               (month === 3 && date === 31) ||
               (month === 6 && date === 30) ||
               (month === 9 && date === 30) ||
               (month === 12 && date === 31);

            // 決定完成狀態
            record.finish = hasBasicRecords && 
               (!isSaturday || record.weeklyWeight != null) && 
               (!isQuarterEnd || record.HbA1c != null) ? 'true' : 'false';
         });

         // 更新全局狀態
         const monthKey = `${new Date(startAt).getFullYear()}-${new Date(startAt).getMonth() + 1}`;
         updateHealthRecords(monthKey, HealthNoteRecord);
      }

      // 計算沒有填寫的天數
      for(let i=0; i<HealthNoteRecord.length; i++) {
         if(HealthNoteRecord[i].finish === 'false') {
            uncompleteNumber += 1;
         }
      }
      if(HealthNoteRecord.length<3) {
         uncompleteNumber += (3-HealthNoteRecord.length);
      }

      return { HealthNoteRecord, uncompleteNumber };
   })
   .catch(error => {
      console.error('Health record fetch error:', error);
      return { HealthNoteRecord: [] };
   });
}
// 健康手札紀錄 API End //

// 儲存每月目標 API Start //
export function inputHealthNoteGoal(stepGoal, joggingGoal){
   return API.post('user/health-targets',
      {
         dailySteps: stepGoal,
         dailyJoggingTime: joggingGoal,
      }
   )
   .then((response) => {
      alert('目標設定成功');
      return response.data;// 回傳伺服器回應的資料
   })
   .catch((error) => {
      if (error.response && error.response.data && error.response.data.message) {
         alert(error.response.data.message); // 顯示伺服器返回的錯誤訊息
      } else {
         alert('資料處理發生異常，請聯絡系統管理員');
      }
   });
}

// 儲存每月目標 API End //

// 上傳健康紀錄 API Start //
export function addHealthRecord(healthData) {
   const token = sessionStorage.getItem('session');
   
   return API.post('user/health-records', 
      {
         dailySteps: healthData.steps,
         dailyJoggingTime: healthData.walkingTimes.reduce((a, b) => a + b, 0),
         dailyDietGoal: healthData.diet === '是' ? `是(${healthData.selectedMeals.join('、')})` : '否',
         weeklyWeight: healthData.weight,
         HbA1c: healthData.hba1c ? parseFloat(healthData.hba1c) : null,
         startAt: healthData.startAt,  // 使用傳入的 startAt
         endAt: healthData.endAt       // 使用傳入的 endAt
      },
      {
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
         }
      }
   )
   .then((response) => {
      alert('健康紀錄儲存成功');
      return response.data;
   })
   .catch((error) => {
      console.error('健康紀錄儲存失敗:', error);
      if (error.response && error.response.data && error.response.data.message) {
         alert(error.response.data.message);
      } else {
         alert('資料處理發生異常，請聯絡系統管理員');
      }
      throw error;
   });
}
// 上傳健康紀錄 API End //

// 取得健康紀錄 API Start //
export function getHealthRecordByDate(dateString) {
   const date = new Date(dateString);
   const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
   
   console.log('Request params:', { startAt: formattedDate, endAt: formattedDate });
   const token = sessionStorage.getItem('session');

   const params = new URLSearchParams();
   params.append('startAt', formattedDate);
   params.append('endAt', formattedDate);

   return API.get(
     `user/health-records?${params.toString()}`,
     {
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` 
       }
     }
   ).then((response) => {
      console.log('API response:', response.data);
      
      if (Array.isArray(response.data) && response.data.length > 0) {
         // 找到對應日期的記錄
         const targetRecord = response.data.find(record => {
            const recordDate = changeDate(record.createAt).replace(/\//g, '-');
            return recordDate === formattedDate;
         });
         
         console.log('Found record for date:', formattedDate, targetRecord);
         return targetRecord || null;
      }
      return null;
   }).catch((error) => {
      console.error('獲取健康紀錄失敗:', error);
      return null;
   });
}
// 取得健康紀錄 API End //