<template>
   <!-- 頁籤區塊 -->
   <div class="page-tab flex-container">
      <a href="#/healthNotes" class="tab-L">回到健康手扎</a>
      <p class="tab-R">健康手札＞健康紀錄</p>
   </div>

   <!-- 主要內容區塊 -->
   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12" sm="12" md="7" lg="7">
         <v-card>
            <!-- 載入中顯示 loading 動畫 -->
            <div v-if="loading" class="loading-container">
               <v-progress-circular
                  indeterminate
                  color="#76caad"
                  :size="50"
               ></v-progress-circular>
            </div>
            <!-- 載入完成後顯示內容 -->
            <template v-else>
            <v-list-item class="list-title">
               <div class="flex-container" style="justify-content: space-between;">
                  <h3 class="page-title">健康手札</h3>
                  <p class="hd-title">{{ formattedDate }} 健康紀錄</p>
               </div>
            </v-list-item>

            <!-- 根據記錄狀態顯示不同內容 -->
            <template v-if="hasRecord">
               <!-- 有記錄時顯示詳細資訊 -->
               <v-list-item class="list-item">
                  <div class="flex-container">
                     <h4 class="list-name">每日步數：</h4>
                     <p class="list-info50">{{ healthInfo.steps }} 步</p>
                  </div>
               </v-list-item>

               <v-list-item class="list-item">
                  <div class="flex-container">
                     <h4 class="list-name">每日慢跑時間：</h4>
                     <p class="list-info50">{{ totalWalkingTime }} 分鐘</p>
                  </div>
               </v-list-item>

               <v-list-item class="list-item">
                  <div class="flex-container">
                     <h4 class="list-name">每日飲食目標：</h4>
                     <p class="list-info50">
                        <span v-if="healthInfo.selectedMeals && healthInfo.selectedMeals.length > 0">
                           {{ healthInfo.selectedMeals.join(', ') }}
                        </span>
                        <span v-else>無</span>
                     </p>
                  </div>
               </v-list-item>

               <!-- 每週體重紀錄 - 只在有值時顯示 -->
               <v-list-item v-if="healthInfo.weight !== null && healthInfo.weight !== undefined && healthInfo.weight !== '查無紀錄'" class="list-item">
                  <div class="flex-container">
                     <h4 class="list-name">每周體重紀錄：</h4>
                     <p class="list-info50">{{ healthInfo.weight }} 公斤</p>
                  </div>
               </v-list-item>

               <!-- HbA1C - 只在有值時顯示 -->
               <v-list-item v-if="healthInfo.hba1c !== null && healthInfo.hba1c !== undefined && healthInfo.hba1c !== '查無紀錄'" class="list-item">
                  <div class="flex-container">
                     <h4 class="list-name">HbA1C：</h4>
                     <p class="list-info50">{{ healthInfo.hba1c }}？</p>
                  </div>
               </v-list-item>
            </template>
            <template v-else>
               <!-- 無記錄時顯示中央提示文字 -->
               <div class="no-record-container">
                  <p class="no-record-text">查無紀錄</p>
               </div>
            </template>
            </template>
         </v-card>

         <!-- 編輯按鈕 -->
         <v-btn 
            v-if="hasRecord && canEdit" 
            class="gotoMeet-btn" 
            :ripple="false" 
            @click="editHealthRecord"
         >
            編輯健康紀錄
         </v-btn>
      </v-col>
   </v-row>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getHealthRecordByDate, changeDate } from '../../api/healthNote';

export default {
   name: 'healthDetailViewPage',
   setup() {
      const healthInfo = ref({
         steps: '',
         walkingTimes: [0],
         diet: '',
         selectedMeals: [],
         weight: '',
         hba1c: ''
      });
      const router = useRouter();
      const route = useRoute();
      const loading = ref(false);

      // 判斷是否有記錄的計算屬性
      const hasRecord = computed(() => {
         return healthInfo.value.steps !== '查無紀錄';
      });

      // 計算日期格式化
      const formattedDate = computed(() => {
         const dateString = route.query.date;
         if (dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('zh-TW', {
               year: 'numeric',
               month: '2-digit',
               day: '2-digit'
            });
         }
         return '';
      });

      // 計算總慢跑時間
      const totalWalkingTime = computed(() => {
         if (healthInfo.value && healthInfo.value.walkingTimes) {
            return healthInfo.value.walkingTimes.reduce((total, time) => {
               const numTime = Number(time);
               return isNaN(numTime) ? total : total + numTime;
            }, 0);
         }
         return 0;
      });

      onMounted(async () => {
         const dateString = route.query.date;
         if (!dateString) {
            console.error('未提供日期參數');
            return;
         }

         loading.value = true;
         try {
            // 先檢查 sessionStorage 中是否有暫存的記錄
            const cachedRecord = sessionStorage.getItem('temp-health-record');
            if (cachedRecord) {
               const record = JSON.parse(cachedRecord);
               // 清除暫存
               sessionStorage.removeItem('temp-health-record');
               
               // 直接使用暫存的記錄
               processRecord(record);
            } else {
               // 如果沒有暫存，再從 API 獲取
               const recordData = await getHealthRecordByDate(dateString);
               processRecord(recordData);
            }
         } catch (error) {
            console.error('載入健康紀錄失敗:', error);
            setEmptyRecord();
         } finally {
            loading.value = false;
         }
      });

      // 處理記錄的輔助函數
      function processRecord(recordData) {
         if (!recordData) {
            setEmptyRecord();
            return;
         }

         const recordDate = changeDate(recordData.createAt);
         const currentDate = changeDate(route.query.date);
         
         if (recordDate === currentDate) {
            const isComplete = 
               recordData.dailySteps != null &&
               recordData.dailyJoggingTime != null &&
               recordData.dailyDietGoal != null;

            if (isComplete) {
               healthInfo.value = {
                  steps: recordData.dailySteps,
                  walkingTimes: [recordData.dailyJoggingTime],
                  diet: recordData.dailyDietGoal.startsWith('是') ? '是' : '否',
                  selectedMeals: recordData.dailyDietGoal.startsWith('是') 
                     ? recordData.dailyDietGoal.match(/早餐|午餐|晚餐/g) || []
                     : [],
                  // 只在有值時設置體重和HbA1c
                  weight: recordData.weeklyWeight || null,
                  hba1c: recordData.HbA1c || null
               };
            } else {
               setEmptyRecord();
            }
         } else {
            setEmptyRecord();
         }
      }

      // 設置空記錄的輔助函數
      const setEmptyRecord = () => {
         healthInfo.value = {
            steps: '查無紀錄',
            walkingTimes: ['查無紀錄'],
            diet: '查無紀錄',
            selectedMeals: [],
            weight: null,  
            hba1c: null    
         };
      };

      // 判斷是否可以編輯的計算屬性
      const canEdit = computed(() => {
         const currentDate = route.query.date;
         if (!currentDate) return false;

         const recordDate = new Date(currentDate);
         const today = new Date();
         today.setHours(0, 0, 0, 0);  // 重置時間部分以便準確比較日期

         // 計算日期差異（天數）
         const diffTime = today.getTime() - recordDate.getTime();
         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

         // 只有最近三天（今天和前兩天）的記錄可以編輯
         return diffDays <= 2 && diffDays >= 0;
      });

      const editHealthRecord = () => {
         router.push({
            path: '/healthDetailForm',
            query: { date: route.query.date }
         });
      };

      return {
         healthInfo,
         hasRecord,
         formattedDate,
         totalWalkingTime,
         loading,
         canEdit,
         editHealthRecord
      };
   }
};
</script>

<style scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/meetInfo.css";
   @import "../../assets/css/accountInfo.css";

   /* common */
   .list-title { 
      height: auto;
      padding: 1em;
      background: #81d0cd;
   }

   .page-title { 
      font-size: 2.5em;
      margin-left: 0.1em;
   }
   /* common */

   /* 自訂樣式調整 */
   .hd-title{
      font-size: 2em;
   }
   .gotoMeet-btn {
      color: #FFFFFF;
      background-color: #69c9a7;
      font-size: 2.5em;
      font-weight: 600;
      width: 100%;
      height: 2em !important;
      margin-top: 1em;
   }

   .loading-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 300px;
   }

   @media screen and (max-width: 1000px) {
      /* common */
      .list-title {
            height: auto;
            font-size: 1.3em;
         }

         .page-title {
            font-size: 1.5em;
            margin-left: 0.05em;
         }
      /* common */
      .hd-title{
         font-size: 1.3em;
      }
      .gotoMeet-btn {
            font-size: 2em;
            font-weight: 600;
            width: 100%;
            height: 2.5em !important;
      }
   }
</style>