<template>
    <!--使該容器將自適應螢幕寬度，確保頁面內容佔據整個螢幕的寬度-->
    <v-container fluid>
       <v-row justify="start">
          <!-- 健康手札大標題 -->
          <h1 class="main-title">健康手札</h1>
       </v-row>
       
       <v-row justify="center">
          <!-- 每月活動目標區塊 -->
          <div :class="{'monthly-goal-section': true, 'wide': winwidth}">
             <div class="goal-header">
                <h2 class="sub-title">每月活動目標</h2>
                <button @click="saveGoals" class="save-button">保存目標</button>
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
       </v-row>
 
       <!-- 用戶成功保存後的提示 -->
       <div v-if="saveSuccess" class="save-success">
          <p>目標已保存！</p>
       </div>
       <v-row justify="center" class="calendar-row">
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
    </v-container>
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
         const stepGoal = ref(''); // 步數目標
         const runGoal = ref('');  // 慢跑目標
         const saveSuccess = ref(false); // 保存成功的狀態
 
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
  
<style scoped>
.main-title {
   font-size: 2.5em; /* 大標題字體大小 */
   margin-top: 10px; /* 大標題上方間距 */
   margin-bottom: 20px; /* 標題下方間距 */
   margin-left: 45px; /* 標題左方間距 */
}

.sub-title {
   font-size: 1.5em; /* 小標題字體大小 */
   margin: 0; /* 移除上下間距 */
}
/* 每月活動目標區塊 */
.monthly-goal-section {
   border-radius: 8px; /* 圓角 */
   width: 400px; /* 區塊寬度 */
   margin-bottom: 50px;
}

.monthly-goal-section.wide {
   width: 60%; /* 當視窗為桌面時，佔據大部分寬度 */
} 
/* 第一行：小標題與保存按鈕 */
.goal-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   background-color: #f0f0f0;
   padding: 10px 20px;
   border-radius: 8px 8px 0 0; /* 只讓上方圓角 */
}

.save-button {
   background-color: #ff7f7f;
   color: white;
   padding: 10px;
   border: none;
   border-radius: 5px;
   cursor: pointer;
}

.save-button:hover {
   background-color: #ff4f4f; /* 鼠標懸停時背景顏色 */
}

/* 每行輸入框區塊 */
.goal-input-row {
   display: flex;
   align-items: center;
   background-color: #fff; /* 白色背景 */
   padding: 15px 20px;
   color: #914502;
}

.goal-input-row:nth-child(odd) {
   background-color: #f0f0f0; /* 灰色背景 */
   border-radius: 0 0 8px 8px;
}

/* 調整標籤和輸入框的寬度使它們對齊 */
.goal-label {
   width: 150px; /* 固定標籤寬度，確保兩行標籤對齊 */
   text-align: left;
}

.goal-input {
   width: 150px; /* 固定輸入框寬度，確保輸入框對齊 */
   padding: 5px;
   background-color: #fff;
   border: 1px solid #000; /* 黑色邊框 */
   border-radius: 4px;
   margin-right: 10px; /* 保持與後面的文字（步、分鐘）間距 */
}

/* 隱藏輸入欄位右側的上下箭頭 */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
-webkit-appearance: none;
margin: 0; 
}

/* 保存成功的提示 */
.save-success {
   color: #28a745; /* 成功提示文字顏色 */
   margin-bottom: 20px;
}

.calendar-row{
   padding: 1.5em 1.5em 0.5em 1.5em;
}

.my-calendar .vc-weekday-1, .my-calendar .vc-weekday-7 {
   color: #6366f1;
}
 
.day-content{
   text-align: left;
   font-size: 1.8em;
   padding-left: 5px;
   border: 0.5px solid #b6b6b6;
   border-bottom: none;
}

.day-content-phone {
   padding: 0.7em;
}

.space {
   height: 80px;
   width: 100% !important;
   border: 0.5px solid #b6b6b6 !important;
   border-top: none !important; /* 強制移除上方線條 */
   display: flex;
   align-items: center; /* 垂直置中 */
   justify-content: center; /* 水平置中 */
}

:deep(vc-day.is-not-in-month *) {
   opacity: 1;
   color: #BDBDBD;
}


a {
   height: 70%;
   width: 70%;
   font-size: 1.8em;
   padding-top: 15px;
   padding-bottom: 15px;
   text-align: center;
   color: #53d2aa;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis; /* 如果希望結尾有省略號，可以加這個屬性 */
   text-decoration: none;
}

.content {
   /* height: 100px; */
   width: 100%;
   margin-top: 20px;
   /* border: 0.5px solid #b6b6b6; */
}
.contentList {
   height: 100px;
   width: 100%;
   margin-top: 20px;
   border: 0.5px solid #b6b6b6;
}

.status-icon {
   font-size: 0.8em;
   margin-left: 5px;
   vertical-align: middle;
}


.legend {
   margin-top: 20px;
   display: flex;
   gap: 15px;
}

.legend-item {
   display: flex;
   align-items: center;
   font-size: 2em;
   font-family: Arial, Helvetica, sans-serif;
}
</style>