<template> 
   <div class="page-tab flex-container" v-if="winwidth != true">
      <a href="#/index" class="tab-L">回到首頁</a>
      <p class="tab-R">首頁＞健康手札</p>
   </div>

   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12">
         <v-card>
            <v-list-item class="list-title">
               <h3 class="page-title">健康手札</h3>
            </v-list-item>

            <v-list-item>            
               <div class="search-frame">
                  <div class="info-container">
                     <!-- 左側區塊 - 目標資訊 -->
                     <div class="info-box">
                        <div class="info-box-title">
                           <h4>每日目標</h4>
                           <v-icon class="title-icon">mdi-target</v-icon>
                        </div>
                        <div class="target-info">
                           <div class="target-item">
                              <h4 class="list-name">每日步數：</h4>
                              <p class="list-info">{{ targetInfo.currentSteps }} 步</p>
                           </div>
                           <div class="target-item">
                              <h4 class="list-name">每日慢跑：</h4>
                              <p class="list-info">{{ targetInfo.currentJogTime }} 分鐘</p>
                           </div>
                        </div>
                     </div>
                     
                     <!-- 右側區塊 - 圖示說明 -->
                     <div class="info-box">
                        <div class="info-box-title">
                           <h4>圖示說明</h4>
                           <v-icon class="title-icon">mdi-help-circle-outline</v-icon>
                        </div>
                        <div class="legend-container">
                           <div class="legend-item">
                              <span class="status-icon0 complete-icon">
                                 <v-icon class="complete-icon">mdi-check-bold</v-icon>
                                 <p>完成填寫 ({{ statusCounts.completed }})</p>
                              </span>
                           </div>
                           <div class="legend-item">
                              <span class="status-icon0 missing-icon">
                                 <v-icon class="missing-icon">mdi-close-thick</v-icon>
                                 <p>缺少紀錄 ({{ statusCounts.missing }})</p>
                              </span>
                           </div>
                           <div class="legend-item">
                              <span class="status-icon0 uncomplete-icon">
                                 <v-icon class="uncomplete-icon">mdi-alert-circle</v-icon>
                                 <p>尚未完成 ({{ statusCounts.incomplete }})</p>
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </v-list-item>
         </v-card>
      </v-col>
   </v-row>

   <v-row justify="center" class="calendar-row" style="margin: 1% 1% 0;">
      <Calendar is-inline expanded ref="calendar" @did-move="handleDidMove">
         <template #day-content="{ day }">
            <div class="day-content" :style="{ backgroundColor: checkDay(day.date.toLocaleDateString()) }">
               <!-- 桌面裝置＞直接顯示日期 -->
               <div v-if="winwidth == true">
                  {{ day.date.getDate() }}
                  <!-- 狀態圖示 -->
                  <template v-if="getStatus(day.date)">
                     <span class="status-icon" v-if="getStatus(day.date) === '完成填寫'">
                        <v-icon class="complete-icon">mdi-check-bold</v-icon>
                     </span>
                     <span class="status-icon" v-else-if="getStatus(day.date) === '缺少紀錄'">
                        <v-icon class="missing-icon">mdi-close-thick</v-icon>
                     </span>
                     <span class="status-icon" v-else-if="getStatus(day.date) === '尚未完成'">
                        <v-icon class="uncomplete-icon">mdi-alert-circle</v-icon>
                     </span>
                  </template>
               </div>
               <!-- 行動裝置＞使用按鈕 -->
               <div v-else class="day-content-phone">
                  <button @click="navigate(day.date)">
                     {{ day.date.getDate() }}
                     <!-- 狀態圖示 -->
                     <template v-if="getStatus(day.date)">
                        <span class="status-icon" v-if="getStatus(day.date) === '完成填寫'">
                           <v-icon class="complete-icon">mdi-check-bold</v-icon>
                        </span>
                        <span class="status-icon" v-else-if="getStatus(day.date) === '缺少紀錄'">
                           <v-icon class="missing-icon">mdi-close-thick</v-icon>
                        </span>
                        <span class="status-icon" v-else-if="getStatus(day.date) === '尚未完成'">
                           <v-icon class="uncomplete-icon">mdi-alert-circle</v-icon>
                        </span>
                     </template>
                  </button>
               </div>
            </div>

            <!-- 桌面日期狀態顯示 -->
            <div v-if="winwidth == true">
               <div class="space" :style="{ backgroundColor: checkDay(day.date.toLocaleDateString()) }">
                  <template v-if="getStatus(day.date)">
                     <a class="recordComplete" @click="navigate(day.date)"
                        v-if="getStatus(day.date) === '完成填寫'">
                        <p>完成填寫</p>
                     </a>
                     <a class="recordMissing" @click="navigate(day.date)"
                        v-else-if="getStatus(day.date) === '缺少紀錄'">
                        <p>缺少紀錄</p>
                     </a>
                     <a class="recordUnComplete" @click="navigate(day.date)"
                        v-else>
                        <p>尚未完成</p>
                     </a>
                  </template>
                  <template v-else>
                     <a class="recordNull">
                        <p>健康紀錄</p>
                     </a>
                  </template>
               </div>
            </div>
         </template>
      </Calendar>
   </v-row>
</template>

<script>
import { Calendar } from 'v-calendar';
import { useWindowWidth } from '../JS/winwidth';
import { askHealthNoteRecord, getHealthRecordByDate } from '../../api/healthNote';
import { askTargetInfo } from '../../api/accInfo';
import 'v-calendar/style.css';
import { ref, onMounted } from 'vue';

export default {
   name: 'healthNotesPage',
   components: {
      Calendar,
   },
   setup() {
      const today = new Date();
      const { winwidth } = useWindowWidth();
      const monthDataCache = ref({});
      const currentMonthKey = ref('');  // 追蹤當前顯示的月份
      const targetInfo = ref('');
      const statusCounts = ref({
         completed: 0,
         missing: 0,
         incomplete: 0
      });

      function checkDay(val) {
         if (val === today.toLocaleDateString()) {
            return '#b0d9ff';
         }
         return '#ffffff';
      }

      // 預加載相鄰月份數據
      const preloadAdjacentMonths = async (year, month) => {
         const prevMonth = month === 1 ? 12 : month - 1;
         const prevYear = month === 1 ? year - 1 : year;
         const nextMonth = month === 12 ? 1 : month + 1;
         const nextYear = month === 12 ? year + 1 : year;
         
         const loadMonth = async (y, m) => {
            const startDate = `${y}-${String(m).padStart(2, '0')}-01`;
            const lastDay = new Date(y, m, 0).getDate();
            const endDate = `${y}-${String(m).padStart(2, '0')}-${lastDay}`;
            
            const result = await askHealthNoteRecord(startDate, endDate);
            if (result?.HealthNoteRecord) {
               monthDataCache.value[`${y}-${m}`] = result.HealthNoteRecord;
            }
         };

         // 非同步載入相鄰月份
         Promise.all([
            loadMonth(prevYear, prevMonth),
            loadMonth(nextYear, nextMonth)
         ]);
      };

      // 計算當前月份的狀態統計
      const calculateStatusCounts = (monthKey) => {
         const records = monthDataCache.value[monthKey];
         if (!records) {
            statusCounts.value = {
               completed: 0,
               missing: 0,
               incomplete: 0
            };
            return;
         }

         const [year, month] = monthKey.split('-').map(Number);
         const today = new Date();
         today.setHours(0, 0, 0, 0);

         let completed = 0;
         let missing = 0;
         let incomplete = 0;

         // 計算當月最後一天
         const lastDay = new Date(year, month, 0).getDate();
         
         // 確定要檢查到哪一天
         const daysToCheck = (year === today.getFullYear() && month === today.getMonth() + 1)
            ? today.getDate()
            : lastDay;

         // 遍歷每一天計算狀態
         for (let day = 1; day <= daysToCheck; day++) {
            const currentDate = new Date(year, month - 1, day);
            currentDate.setHours(0, 0, 0, 0);

            const record = records.find(item => {
               const recordDate = new Date(item.date);
               recordDate.setHours(0, 0, 0, 0);
               return recordDate.getTime() === currentDate.getTime();
            });

            if (record) {
               // 有記錄，根據完成狀態計數
               if (record.finish === 'true') {
                  completed++;
               } else {
                  incomplete++;
               }
            } else {
               // 沒記錄，根據日期差異計數
               const daysDifference = Math.floor((today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
               if (daysDifference > 2) {
                  missing++;
               } else {
                  incomplete++;
               }
            }
         }

         statusCounts.value = {
            completed,
            missing,
            incomplete
         };
      };

      async function handleDidMove(pages) {
         if (pages && pages.length > 0) {
            const month = pages[0].month;
            const year = pages[0].year;
            const monthKey = `${year}-${month}`;
            currentMonthKey.value = monthKey;  // 更新當前月份

            try {
               // 如果沒有緩存，載入當前月份數據
               if (!monthDataCache.value[monthKey]) {
                  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
                  const lastDay = new Date(year, month, 0).getDate();
                  const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

                  const result = await askHealthNoteRecord(startDate, endDate);
                  if (result?.HealthNoteRecord) {
                     monthDataCache.value[monthKey] = result.HealthNoteRecord;
                  }
               }
               
               // 計算當前月份的狀態統計
               calculateStatusCounts(monthKey);

               // 預加載相鄰月份
               preloadAdjacentMonths(year, month);

               console.log(monthDataCache.value);
            } catch (error) {
               console.error('Failed to load month data:', error);
            }
         }
      }

      function getStatus(date) {
         const inputDate = new Date(date);
         const today = new Date();
         
         // 重要：設置時間為 00:00:00 以進行純日期比較
         inputDate.setHours(0, 0, 0, 0);
         today.setHours(0, 0, 0, 0);

         if (inputDate > today) {
            return null;
         }

         const monthKey = `${inputDate.getFullYear()}-${inputDate.getMonth() + 1}`;
         const records = monthDataCache.value[monthKey];
         
         if (!records) {
            return null;
         }

         // 檢查是否有記錄
         const record = records.find(item => {
            const recordDate = new Date(item.date);
            recordDate.setHours(0, 0, 0, 0);
            return recordDate.getTime() === inputDate.getTime();
         });

         if (record) {
            // 如果有記錄，根據 finish 狀態判斷
            return record.finish === 'true' ? '完成填寫' : '尚未完成';
         } else {
            // 如果沒有記錄，根據日期差異判斷
            const daysDifference = Math.floor((today.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24));
            return daysDifference <= 2 ? '尚未完成' : '缺少紀錄';
         }
      }

      async function navigate(val) {
         try {
            const inputDate = new Date(val);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            inputDate.setHours(0, 0, 0, 0);
            
            if (inputDate > today) {
               return;
            }

            const record = await getHealthRecordByDate(val.toISOString());
            
            if (record) {
               sessionStorage.setItem('temp-health-record', JSON.stringify(record));
               const dateParam = encodeURIComponent(val.toISOString());
               window.location.href = `#/healthDetailView?date=${dateParam}`;
               return;
            }

            const status = getStatus(val);
            if (!status) return;

            const targetPath = (status === '完成填寫' || status === '缺少紀錄') 
               ? '/healthDetailView' 
               : '/healthDetailForm';

            const dateParam = encodeURIComponent(val.toISOString());
            window.location.href = `#${targetPath}?date=${dateParam}`;
         } catch (error) {
            console.error('Navigation error:', error);
            const dateParam = encodeURIComponent(val.toISOString());
            window.location.href = `#/healthDetailForm?date=${dateParam}`;
         }
      }

      onMounted(async () => {
         const currentYear = new Date().getFullYear();
         const currentMonth = new Date().getMonth() + 1;
         await handleDidMove([{ month: currentMonth, year: currentYear }]);
      
         // 獲取目標資訊
         askTargetInfo().then((result) => {
            targetInfo.value = result;
         });
      });

      return {
         today,
         winwidth,
         checkDay,
         navigate,
         getStatus,
         handleDidMove,
         targetInfo,
         statusCounts,
      };
   }
};
</script>
  
<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/healthNoteMain.css";

   :deep(.vc-day.is-not-in-month *) {
      opacity: 1;
      color: #BDBDBD;
   }

   @media screen and (max-width: 1000px) {
      :deep(.vc-day){
         border: 0.05px solid #b6b6b6;
      }
   }
</style>