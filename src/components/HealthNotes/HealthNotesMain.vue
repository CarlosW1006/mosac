<template> 
   <div class="page-tab flex-container" v-if="winwidth != true">
      <a href="#/index" class="tab-L">回到首頁</a> <p class="tab-R">首頁＞健康手札</p>
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
                     <input v-model="stepGoal" type="number" class="search-input top-select" placeholder="每日步數目標" />
                     <input v-model="joggingGoal" type="number" class="search-input" placeholder="每日慢跑目標" />
                     <button class="search-btn">儲存</button>
                  </div>
               </div>
            </v-list-item>
         </v-card>
      </v-col>
      <div class="legend-item"><span class="status-icon0 complete-icon">
         <v-icon class="complete-icon">mdi-check-bold</v-icon>
         <p>完成填寫</p>
      </span></div>
      <div class="legend-item"><span class="status-icon0 missing-icon">
         <v-icon class="missing-icon">mdi-close-thick</v-icon>
         <p>缺少紀錄</p>
      </span></div>
      <div class="legend-item"><span class="status-icon0 uncomplete-icon">
         <v-icon class="uncomplete-icon">mdi-alert-circle</v-icon>
         <p>尚未完成</p>
      </span></div>
   </v-row>

   <v-row justify="center" class="calendar-row" style="margin: 1% 1% 0;">
      <Calendar is-inline expanded ref="calendar" @did-move="handleDidMove">
         <template #day-content="{ day }">
            <div class="day-content" :style="{ backgroundColor: checkDay(day.date.toLocaleDateString()) }">
               <!-- 桌面裝置＞直接顯示日期-->
               <div v-if="winwidth == true">
                  {{ day.date.getDate() }}
                  <!--1129狀態修改-->
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
                  <!--修改-->
               </div>
               <!-- 行動裝置＞使用按鈕 -->
               <div v-else class="day-content-phone">
                  <button @click="navigate(day.date)">
                     {{ day.date.getDate() }}
                     <!--1129狀態修改-->
                     <span class="status-icon" v-if="getStatus(day.date) === '完成填寫'">
                       <v-icon class="complete-icon">mdi-check-bold</v-icon>
                     </span>
                     <span class="status-icon" v-else-if="getStatus(day.date) === '缺少紀錄'">
                       <v-icon class="missing-icon">mdi-close-thick</v-icon>
                     </span>
                     <span class="status-icon" v-else-if="getStatus(day.date) === '尚未完成'">
                       <v-icon class="uncomplete-icon">mdi-alert-circle</v-icon>
                     </span>
                     <!--修改-->
                  </button>
               </div>
            </div>

            <div v-if="winwidth == true">
               <!--修改-->
               <div class="space" :style="{ backgroundColor: checkDay(day.date.toLocaleDateString()) }">
                  <template v-if="getStatus(day.date)">
                  <a class="recordComplete" v-bind:href.prop="`./index.html#/healthDetailForm?date=${day.date.toISOString()}`"
                     v-if="getStatus(day.date) === '完成填寫'">
                     <p>完成填寫</p>
                  </a>
                  <a class="recordMissing" v-bind:href.prop="`./index.html#/healthDetailForm?date=${day.date.toISOString()}`"
                     v-else-if="getStatus(day.date) === '缺少紀錄'">
                     <p>缺少紀錄</p>
                  </a>
                  <a class="recordUnComplete" v-bind:href.prop="`./index.html#/healthDetailForm?date=${day.date.toISOString()}`"
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
               <!--修改-->
            </div>
         </template>
      </Calendar>
   </v-row>
</template>
  
<script>
   import { Calendar } from 'v-calendar';
   import { useWindowWidth } from '../JS/winwidth';
   import { askHealthNoteRecord } from '../../api/healthNote';
   import 'v-calendar/style.css';
   import { ref } from 'vue';

   export default {
      name: 'healthNotesPage',
      components: {
         Calendar,
      },
      setup() {
         const stepGoal = ref('');
         const joggingGoal = ref('');
         const today = new Date();
         const eachDayFinish = ref([]);
         const currentMonth = today.getMonth() + 1;
         const { winwidth } = useWindowWidth();

         function checkDay(val) {
            // 如果當前日期匹配今天，改變背景顏色
            if (val === today.toLocaleDateString()) {
               return '#b0d9ff';
            }
            return '#ffffff';
         }

         function navigate(val) {
            if (this.getStatus(val)) {
               window.location.href = `./index.html#/healthDetailForm?date=${val.toISOString()}`;
         }
         }

         function handleDidMove(pages) {
            if (pages && pages.length > 0) {
               const month = pages[0].month;
               askHealthNoteRecord('2024/' + month + '/01', '2024/' + month + '/31').then((result) => {
                  eachDayFinish.value = result.HealthNoteRecord;
               });
            }
         }

         askHealthNoteRecord('2024/' + currentMonth + '/01', '2024/' + currentMonth + '/31').then((result) => {
            eachDayFinish.value = result.HealthNoteRecord;
            // console.log(eachDayFinish.value);
         });

         // function isFinished(val) {
         //    const date = new Date(val);
         //    const rangeMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
         //    const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
            
         //    // 尋找有符合指定日期、finish=true
         //    if(rangeMonth === '2024-10' || rangeMonth === '2024-11' || rangeMonth === '2024-12') {
         //       if((new Date(formattedDate) > new Date(today)) == true) {
         //          return(null);
         //       }
         //       else if(eachDayFinish.value.some(item => item.createAt === formattedDate && item.finish === 'true')) {
         //          // console.log(new Date(formattedDate) > new Date(today));
         //          return(true);
         //       }
         //       else {
         //          return(false);
         //       }
         //    }
         //    return(null);
         // }

         function getStatus(date) {
            const inputDate = new Date(date);
            const today = new Date(); // 重新獲取當前日期，確保是最新的

            // 如果輸入日期大於今天，直接返回 null 或禁用狀態
            if (inputDate > today) {
               return null; // 或者返回一個特殊狀態表示不可操作
            }

            const daysDifference = Math.floor((today - inputDate) / (1000 * 60 * 60 * 24));
            const formattedDate = inputDate.toLocaleDateString();

            const isCompleted = eachDayFinish.value.some(
            (item) => item.createAt === formattedDate && item.finish === 'true'
            );

            if (isCompleted) {
            return '完成填寫';
            } else if (daysDifference > 2) {
            // 超過兩天的未完成視為缺少紀錄
            return '缺少紀錄';
            } else {
            // 最近三天的未完成視為尚未完成
            return '尚未完成';
            }
         }   

         console.log('Today:', today);
console.log('Today toLocaleDateString():', today.toLocaleDateString());
console.log('Today getMonth():', today.getMonth() + 1);
console.log('Today getDate():', today.getDate());

         return {
            today,
            winwidth,
            stepGoal,
            joggingGoal,
            currentMonth,
            eachDayFinish,
            checkDay,
            navigate,
            getStatus,
            handleDidMove,
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