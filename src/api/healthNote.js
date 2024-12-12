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

export function getLocalDateString(date) {
   const d = new Date(date);
   return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
}

// 添加輔助函數來標準化日期比較
export function isSameDay(date1, date2) {
   const d1 = new Date(date1);
   const d2 = new Date(date2);
   return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
   );
}

export function changeDate(val) {
   if (!val) return null;
   const d = new Date(val);
   return getLocalDateString(d);
}

// 健康手札紀錄 API Start //
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
            // 優先使用 date 欄位，如果沒有則使用 createAt
            const recordDate = record.date || record.createAt;
            record.date = changeDate(recordDate);
            if (!HealthNoteRecord.some(r => r.date === record.date)) {
               // 檢查基本記錄
               const recordDateObj = new Date(recordDate);
               const hasBasicRecords = record.dailySteps != null && 
                  record.dailyJoggingTime != null && 
                  record.dailyDietGoal != null;

               // 只在特殊日期檢查額外要求
               const isSaturday = recordDateObj.getDay() === 6;
               const month = recordDateObj.getMonth() + 1;
               const date = recordDateObj.getDate();
               const isQuarterEnd = 
                  (month === 3 && date === 31) ||
                  (month === 6 && date === 30) ||
                  (month === 9 && date === 30) ||
                  (month === 12 && date === 31) ||
                  (month === 12 && date === 9);// 測試

               // 決定完成狀態
               record.finish = hasBasicRecords && 
                  (!isSaturday || record.weeklyWeight != null) && 
                  (!isQuarterEnd || record.HbA1c != null) ? 'true' : 'false';

               HealthNoteRecord.push(record);
            }
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
   const targetDate = healthData.date ? new Date(healthData.date) : new Date();
   // 設置時間為當地時間的 00:00:00
   targetDate.setHours(0, 0, 0, 0);

   console.log('Preparing to save record for:', {
      date: getLocalDateString(targetDate)
   });

   // 構建記錄數據，確保所有欄位都有預設值
   const recordData = {
      date: targetDate.toISOString()
   };

   // 只在有實際輸入值時覆蓋預設值
   if (healthData.steps !== '' && healthData.steps !== undefined) {
      recordData.dailySteps = Number(healthData.steps);
   }

   if (healthData.walkingTime !== '' && healthData.walkingTime !== undefined) {
      recordData.dailyJoggingTime = Number(healthData.walkingTime);
   }

   if (healthData.diet) {
      recordData.dailyDietGoal = healthData.diet === '是' && healthData.selectedMeals?.length > 0
         ? `是(${healthData.selectedMeals.join('、')})`
         : healthData.diet;
   }

   if (healthData.weight !== '' && healthData.weight !== undefined) {
      recordData.weeklyWeight = Number(healthData.weight);
   }

   if (healthData.hba1c !== '' && healthData.hba1c !== undefined) {
      recordData.HbA1c = Number(healthData.hba1c);
   }

   console.log('Sending record with time:', {
      recordData
   });
   
   return API.post('user/health-records', recordData, {
      headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` 
      }
   })
   .then((response) => {
      console.log('Server response:', {
         data: response.data,
      });
      
      alert('健康紀錄儲存成功');
      return response.data;
   })
   .catch((error) => {
      console.error('健康紀錄儲存失敗:', error);
      throw error;
   });
}
// 上傳健康紀錄 API End //

// 取得特定日期的所有健康紀錄
export function getAllHealthRecordsByDate(dateString) {
   const targetDate = new Date(dateString);
   targetDate.setHours(0, 0, 0, 0);
   
   const formattedDate = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
   
   const token = sessionStorage.getItem('session');
 
   return API.get(
     'user/health-records',
     {
       params: {
         startAt: formattedDate,
         endAt: formattedDate
       },
       headers: {
         'Authorization': `Bearer ${token}`
       }
     }
   ).then((response) => {
     if (Array.isArray(response.data)) {
      const targetDateStr = getLocalDateString(targetDate);
      return response.data.filter(record => {
        // 如果有 date 欄位就用 date，否則用 createAt
        const recordDate = record.date || record.createAt;
        return getLocalDateString(recordDate) === targetDateStr;
      }).sort((a, b) => new Date(b.createAt) - new Date(a.createAt)); // 依然用 createAt 來排序
    }
     return [];
   });
 }

// 取得健康紀錄 API Start //
export function getHealthRecordByDate(dateString) {
   const targetDate = new Date(dateString);
   targetDate.setHours(0, 0, 0, 0);
   
   // 格式化日期為 YYYY-MM-DD
   const formattedDate = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
   
   console.log('Requesting record for date:', formattedDate);
   
   const token = sessionStorage.getItem('session');

   return API.get(
     `user/health-records`,
     {
       params: {
         startAt: formattedDate,
         endAt: formattedDate
       },
       headers: {
         'Authorization': `Bearer ${token}` 
       }
     }
   ).then((response) => {      
      console.log('Raw API response:', response.data);
      
      if (Array.isArray(response.data) && response.data.length > 0) {
         // 根據本地日期字符串進行過濾
         const targetDateStr = getLocalDateString(targetDate);
         const dayRecords = response.data.filter(record => {
            // 優先使用 date 欄位，如果沒有則使用 createAt
            const recordDate = record.date || record.createAt;
            const recordDateObj = new Date(recordDate);
            recordDateObj.setHours(0, 0, 0, 0);
            return getLocalDateString(recordDate) === targetDateStr;
         });

         console.log('Filtered records for date', targetDateStr, ':', dayRecords);

         if (dayRecords.length > 0) {
            // 按照 UTC 時間戳降序排序
            dayRecords.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
            
            return dayRecords[0];
         }
      }
      
      console.log('No records found for date:', formattedDate);
      return null;
   }).catch((error) => {
      console.error('獲取健康紀錄失敗:', error);
      throw error;
   });
}
// 取得健康紀錄 API End //

// 更新健康紀錄 API Start //
export function updateHealthRecord(recordId, healthData) {
   const token = sessionStorage.getItem('session');
   
   // 構建要更新的數據對象
   const updateData = {};
   
   // 只包含有值的欄位
   if (healthData.steps !== '' && healthData.steps !== undefined) {
      updateData.dailySteps = Number(healthData.steps);
   }

   if (healthData.walkingTimes !== '' && healthData.walkingTimes !== undefined) {
      updateData.dailyJoggingTime = Number(healthData.walkingTimes);
   }

   if (healthData.diet) {
      updateData.dailyDietGoal = healthData.diet === '是' && healthData.selectedMeals?.length > 0
         ? `是(${healthData.selectedMeals.join('、')})`
         : healthData.diet;
   }

   if (healthData.weight !== '' && healthData.weight !== undefined) {
      updateData.weeklyWeight = Number(healthData.weight);
   }

   if (healthData.hba1c !== '' && healthData.hba1c !== undefined) {
      updateData.HbA1c = Number(healthData.hba1c);
   }

   return API.patch(`user/health-records/${recordId}`, updateData, {
      headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
      }
   })
   .then((response) => {
      alert('健康紀錄更新成功');
      return response.data;
   })
   .catch((error) => {
      console.error('健康紀錄更新失敗:', error);
      throw error;
   });
}
// 更新健康紀錄 API End //