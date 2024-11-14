<template> 
   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12">
         <v-card>
            <v-list-item class="list-title">
               <h3 class="page-title">健康手札</h3>
            </v-list-item>

            <v-list-item>
               <!-- 每月活動目標區塊 -->
               <div :class="{'monthly-goal-section': true, 'wide': winwidth}">
                  <div class="goal-header">
                     <h2 class="sub-title">每月活動目標</h2>
                     <v-btn @click="saveGoals" class="save-btn">儲存</v-btn>
                  </div>
      
                  <div class="goal-input-row">
                     <label class="goal-label">每月步數目標：</label>
                     <input v-model="stepGoal" type="number" class="goal-input" placeholder="輸入步數目標" /> 步
                  </div>
                  
                  <div class="goal-input-row">
                     <label class="goal-label">每月慢跑目標：</label>
                     <input v-model="runGoal" type="number" class="goal-input" placeholder="輸入慢跑目標" /> 分鐘
                  </div>
               </div>
            </v-list-item>
 
            <!-- 用戶成功保存後的提示 -->
            <div v-if="saveSuccess" class="save-success">
               <p>目標已保存！</p>
            </div>
         </v-card>
      </v-col>
   </v-row>
   <v-row justify="center" class="calendar-row" style="margin: 1% 1% 0;">
          <Calendar is-inline expanded ref="calendar">
             <!--day-content 插槽傳入的 day 物件包含了每一天的日期等資訊。-->
             <template #day-content="{ day }">
                <!--這行是綁定 day-content 元素的背景顏色，根據 checkDay() 函數的回傳值改變背景顏色。-->
                <div class="day-content" :style="{ backgroundColor: checkDay(day.date.toLocaleDateString()) }">
                   <!--如果螢幕寬度足夠寬（桌面裝置），直接顯示日期-->
                   <div v-if="winwidth == true">
                      {{ day.date.getDate() }}
                      <span v-if="isPastOrToday(day.date)">
                         <span v-if="isCompleted(day.date)" class="status-icon completed">✔️</span>
                         <span v-else class="status-icon not-completed">❌</span>
                      </span>
                   </div>
                   <!--如果螢幕寬度較窄（行動裝置），則用按鈕包裹日期，讓使用者可以點擊跳轉到該日期的詳細頁面。-->
                   <div v-else class="day-content-phone">
                      <button @click="navigate(day.date)">
                        {{ day.date.getDate() }}
                        <span v-if="isPastOrToday(day.date)">
                           <span v-if="isCompleted(day.date)" class="status-icon completed">✔️</span>
                           <span v-else class="status-icon not-completed">❌</span>
                        </span>
                      </button>
                   </div>
                </div>
 
                <div v-if="winwidth == true">
                   <div class="space"
                   :style="{ backgroundColor: checkDay(day.date.toLocaleDateString()) }">
                      <!-- 每一天的 Dom -->
                      <a v-bind:href="`./index.html#/healthDetailForm?date=${day.date.toISOString()}`">每日健康紀錄</a>
                   </div>
                </div>
             </template>
          </Calendar>
   </v-row>
   <v-row justify="center" class="legend">
      <div class="legend-item">
         <span class="status-icon completed">✔️</span>完成填寫 
      </div>
      <div class="legend-item">
         <span class="status-icon not-completed">❌</span> 尚未填寫
      </div>
   </v-row>
       
       
    
 </template>
  
<script>
   import { Calendar } from 'v-calendar';
   import { useWindowWidth } from '../JS/winwidth';
   import 'v-calendar/style.css';
   import { ref } from 'vue'; 
 
   export default {
      name: 'healthNotesPage',
      components: {
         Calendar
      },
      setup() {
         // 每月步數與慢跑目標
         const stepGoal = ref(''); 
         const runGoal = ref('');  
         const saveSuccess = ref(false); 
         // 保存目標功能
         function saveGoals() {
            if (stepGoal.value === '' || runGoal.value === '') {
               alert('請填寫完整的目標');
               return;
            }
            console.log('步數目標:', stepGoal.value, '慢跑目標:', runGoal.value);
 
            // 保存成功後顯示提示，並清空表單
            saveSuccess.value = true;
            setTimeout(() => {
               saveSuccess.value = false; // 2秒後隱藏提示
            }, 2000);
 
            // 清空表單
            stepGoal.value = '';
            runGoal.value = '';
         }
 
         // 獲取今天的日期 Start //
         const today = new Date();
 
         function checkDay(val) {
            // 如果當前日期匹配今天，改變背景顏色
            if (val === today.toLocaleDateString()) {
               return '#b0d9ff'; // 高亮顏色
            }
            return '#ffffff'; // 預設背景顏色
         }
         // 獲取今天日期 End //
         
         // 獲取螢幕寬度 Start //
         const { winwidth } = useWindowWidth();
         // 獲取螢幕寬度 End //
         
         // 記錄填寫的日期，假設是填寫過的日期列表
         const completedDates = ref(['2023-10-21', '2023-10-22']); // 用 YYYY-MM-DD 格式

         // 檢查日期是否已完成
         const isCompleted = (date) => {
            const dateStr = date.toISOString().split('T')[0];
            return completedDates.value.includes(dateStr);
         };

         // 檢查日期是否為今天或之前
         const isPastOrToday = (date) => {
            return date <= today;
         };

         // 月曆按鈕 function Start //
         function navigate(val) {
            window.location.href = `./index.html#/healthDetailForm?date=${val.toISOString()}`; 
         }
         // 月曆按鈕 function End //
 
         return { 
            today,
            isCompleted,
            isPastOrToday,
            checkDay,
            winwidth,
            navigate,
            stepGoal,
            runGoal,
            saveGoals,
            saveSuccess,
         };
      },
   };
 
</script>
  
<style lang="css" scoped>
@import "../../assets/css/common.css";
@import "../../assets/css/healthnote.css";

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