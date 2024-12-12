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
                  <div class="dropdown">
                     <input v-model="stepGoal" type="number" class="search-input top-select" placeholder="每日步數目標" @keyup.enter="saveGoals"/>
                     <input v-model="joggingGoal" type="number" class="search-input" placeholder="每日慢跑目標" @keyup.enter="saveGoals"/>
                     <button class="search-btn" @click="saveGoals">儲存</button>
                  </div>
               </div>
            </v-list-item>
         </v-card>
      </v-col>
      <!-- 圖示說明 -->
      <div class="legend-item">
         <span class="status-icon0 complete-icon">
            <v-icon class="complete-icon">mdi-check-bold</v-icon>
            <p>完成填寫</p>
         </span>
      </div>
      <div class="legend-item">
         <span class="status-icon0 missing-icon">
            <v-icon class="missing-icon">mdi-close-thick</v-icon>
            <p>缺少紀錄</p>
         </span>
      </div>
      <div class="legend-item">
         <span class="status-icon0 uncomplete-icon">
            <v-icon class="uncomplete-icon">mdi-alert-circle</v-icon>
            <p>尚未完成</p>
         </span>
      </div>
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
import { getLocalDateString, askHealthNoteRecord, inputHealthNoteGoal, getHealthRecordByDate } from '../../api/healthNote';
import 'v-calendar/style.css';
import { ref, onMounted } from 'vue';

export default {
   name: 'healthNotesPage',
   components: {
      Calendar,
   },
   setup() {
      const stepGoal = ref('');
      const joggingGoal = ref('');
      const today = new Date();
      const { winwidth } = useWindowWidth();
      const monthDataCache = ref({});
      const currentMonthKey = ref('');  // 追蹤當前顯示的月份

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
         today.setHours(0, 0, 0, 0);

         if (inputDate > today) {
            return null;
         }

         const monthKey = `${inputDate.getFullYear()}-${inputDate.getMonth() + 1}`;
         const records = monthDataCache.value[monthKey];
         
         if (!records) {
            return null;
         }

         const formattedDate = `${inputDate.getFullYear()}/${(inputDate.getMonth() + 1).toString().padStart(2, '0')}/${inputDate.getDate().toString().padStart(2, '0')}`;
         const record = records.find(item => {
            const recordDate = item.date || item.createAt; // 如果 date 為空則使用 createAt
            return getLocalDateString(recordDate) === formattedDate;
         });
         
         if (record) {
            return record.finish === 'true' ? '完成填寫' : '尚未完成';
         }

         const daysDifference = Math.floor((today - inputDate) / (1000 * 60 * 60 * 24));
         return daysDifference > 2 ? '缺少紀錄' : '尚未完成';
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

      function saveGoals() {
         if (!stepGoal.value || !joggingGoal.value) {
            alert('請輸入步數和慢跑目標');
            return;
         }
         inputHealthNoteGoal(stepGoal.value, joggingGoal.value);
      }

      onMounted(async () => {
         const currentYear = new Date().getFullYear();
         const currentMonth = new Date().getMonth() + 1;
         await handleDidMove([{ month: currentMonth, year: currentYear }]);
      });

      return {
         today,
         winwidth,
         stepGoal,
         joggingGoal,
         checkDay,
         navigate,
         getStatus,
         handleDidMove,
         saveGoals,
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