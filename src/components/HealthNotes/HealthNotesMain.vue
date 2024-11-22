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
      <div class="legend-item"><span class="status-icon0">✔️</span>完成填寫</div>
      <div class="legend-item"><span class="status-icon0">❌</span>尚未填寫</div>
   </v-row>

   <v-row justify="center" class="calendar-row" style="margin: 1% 1% 0;">
      <Calendar is-inline expanded ref="calendar" @did-move="handleDidMove">
         <template #day-content="{ day }">
            <div class="day-content" :style="{ backgroundColor: checkDay(day.date.toLocaleDateString()) }">
               <!-- 桌面裝置＞直接顯示日期-->
               <div v-if="winwidth == true">
                  {{ day.date.getDate() }}
                  <span class="status-icon completed" v-if="isFinished(day.date.toLocaleDateString()) === true">✔️</span>
                  <span class="status-icon not-completed" v-else-if="isFinished(day.date.toLocaleDateString()) === false">❌</span>
                  <span v-else></span>
               </div>
               <!-- 行動裝置＞使用按鈕 -->
               <div v-else class="day-content-phone">
                  <button @click="navigate(day.date)">
                     {{ day.date.getDate() }}
                     <span class="status-icon completed" v-if="isFinished(day.date.toLocaleDateString()) === true">✔️</span>
                     <span class="status-icon not-completed" v-else-if="isFinished(day.date.toLocaleDateString()) === false">❌</span>
                     <span v-else></span>
                  </button>
               </div>
            </div>

            <div v-if="winwidth == true">
               <div class="space" :style="{ backgroundColor: checkDay(day.date.toLocaleDateString()) }">
                  <a v-bind:href="`./index.html#/healthDetailForm?date=${day.date.toISOString()}`">每日健康紀錄</a>
               </div>
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
         window.location.href = `./index.html#/healthDetailForm?date=${val.toISOString()}`;
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

      function isFinished(val) {
         const date = new Date(val);
         const rangeMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
         const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
         
         // 尋找有符合指定日期、finish=true
         if(rangeMonth === '2024-10' || rangeMonth === '2024-11' || rangeMonth === '2024-12') {
            if((new Date(formattedDate) > new Date(today)) == true) {
               return(null);
            }
            else if(eachDayFinish.value.some(item => item.createAt === formattedDate && item.finish === 'true')) {
               // console.log(new Date(formattedDate) > new Date(today));
               return(true);
            }
            else {
               return(false);
            }
         }
         return(null);
      }

      return {
         today,
         winwidth,
         stepGoal,
         joggingGoal,
         currentMonth,
         eachDayFinish,

         checkDay,
         navigate,
         isFinished,
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