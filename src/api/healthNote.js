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

// 將 UTC 時間轉換為當地日期字符串 (YYYY/MM/DD)
// function formatLocalDate(date) {
//    const localDate = new Date(date);
//    return `${localDate.getFullYear()}/${String(localDate.getMonth() + 1).padStart(2, '0')}/${String(localDate.getDate()).padStart(2, '0')}`;
// }

function getLocalDateString(date) {
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
               (month === 12 && date === 31) ||
               (month === 12 && date === 4);// 測試

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

// 取得對應的體重和HbA1c值 API Start //
// async function getValidWeightAndHbA1c(targetDate) {
//    const token = sessionStorage.getItem('session');
//    const date = new Date(targetDate);
   
//    // 取得週的開始和結束日期（使用當地時間）
//    const weekStart = new Date(date);
//    weekStart.setDate(date.getDate() - date.getDay());
//    const weekEnd = new Date(weekStart);
//    weekEnd.setDate(weekStart.getDate() + 6);

//    // 取得季度末日期
//    //const quarterMonth = Math.floor(date.getMonth() / 3) * 3 + 2;
//    //const quarterEnd = new Date(date.getFullYear(), quarterMonth + 1, 0);

//    try {
//       const startYear = `${date.getFullYear()}-01-01`;
//       const endDate = formatLocalDate(date).replace(/\//g, '-');

//       const response = await API.get('user/health-records', {
//          params: {
//             startAt: startYear,
//             endAt: endDate
//          },
//          headers: {
//             'Authorization': `Bearer ${token}`
//          }
//       });

//       let weight = 0;
//       let hba1c = 0;

//       if (Array.isArray(response.data) && response.data.length > 0) {
//          // 處理體重記錄
//          const saturdayRecords = response.data
//             .filter(record => {
//                const recordDate = new Date(record.createAt);
//                // 記錄日期必須是週六且在目標日期之前（或同一天）
//                return recordDate.getDay() === 6 && 
//                       recordDate <= date && 
//                       record.weeklyWeight > 0;
//             })
//             .sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

//          console.log('Available weight records:', saturdayRecords.map(r => ({
//             date: new Date(r.createAt).toLocaleDateString(),
//             weight: r.weeklyWeight
//          })));

//          // 處理 HbA1c 記錄
//          const quarterRecords = response.data
//             .filter(record => {
//                const recordDate = new Date(record.createAt);
//                const recordMonth = recordDate.getMonth() + 1;
//                const recordDay = recordDate.getDate();
               
//                // 檢查是否是常規的季度末日期或測試日期(12/4)
//                const isValidDate = (recordMonth === 3 && recordDay === 31) ||
//                                  (recordMonth === 6 && recordDay === 30) ||
//                                  (recordMonth === 9 && recordDay === 30) ||
//                                  (recordMonth === 12 && recordDay === 31) ||
//                                  (recordMonth === 12 && recordDay === 4);  // 加入測試日期
               
//                // 記錄日期必須在目標日期之前（或同一天）且有 HbA1c 值
//                return isValidDate && 
//                       recordDate <= date && 
//                       record.HbA1c > 0;
//             })
//             .sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

//          console.log('Available HbA1c records:', quarterRecords.map(r => ({
//             date: new Date(r.createAt).toLocaleDateString(),
//             hba1c: r.HbA1c
//          })));

//          // 使用最新的有效記錄
//          if (saturdayRecords.length > 0) {
//             weight = saturdayRecords[0].weeklyWeight;
//             console.log('Selected weight value:', weight, 
//                        'from date:', new Date(saturdayRecords[0].createAt).toLocaleDateString());
//          }

//          if (quarterRecords.length > 0) {
//             hba1c = quarterRecords[0].HbA1c;
//             console.log('Selected HbA1c value:', hba1c, 
//                        'from date:', new Date(quarterRecords[0].createAt).toLocaleDateString());
//          }
//       }

//       return { weight, hba1c };
//    } catch (error) {
//       console.error('獲取記錄失敗:', error);
//       return { weight: 0, hba1c: 0 };
//    }
// }
// 取得對應的體重和HbA1c值 API End //

// 上傳健康紀錄 API Start //
// 上傳健康紀錄 API Start //
export function addHealthRecord(healthData) {
   const token = sessionStorage.getItem('session');
   const targetDate = healthData.date ? new Date(healthData.date) : new Date();
   const now = new Date();
   
   // 保持日期部分，但使用當前時間
   targetDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
   
   console.log('Preparing to save record for:', {
      targetDate: getLocalDateString(targetDate),
      createAt: targetDate.toISOString()
   });

   // 構建記錄數據，確保所有欄位都有預設值
   const recordData = {
      createAt: targetDate.toISOString()
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
      recordData,
      localDate: getLocalDateString(targetDate)
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
         localDate: getLocalDateString(response.data.createAt)
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
       return response.data.filter(record => 
         getLocalDateString(record.createAt) === targetDateStr
       ).sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
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
            return getLocalDateString(record.createAt) === targetDateStr;
         });

         console.log('Filtered records for date', targetDateStr, ':', dayRecords);

         if (dayRecords.length > 0) {
            // 按照 UTC 時間戳降序排序
            dayRecords.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
            
            const latestRecord = dayRecords[0];
            console.log('Selected latest record:', {
               id: latestRecord.id,
               createAt: latestRecord.createAt,
               localDate: getLocalDateString(latestRecord.createAt)
            });
            return latestRecord;
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