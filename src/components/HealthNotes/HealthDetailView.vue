<template>
   <!-- 頁籤區塊 -->
   <div class="page-tab flex-container">
      <a href="#/healthNotes" class="tab-L">回到健康手扎</a>
      <p class="tab-R">健康手札＞健康紀錄</p>
   </div>

   <!-- 主要內容區塊 -->
   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12" sm="12" md="6" lg="6">
         <v-card>
            <!-- 載入中顯示 loading 動畫 -->
            <div v-if="loading" class="loading-container">
               <v-progress-circular indeterminate color="#76caad" :size="50"></v-progress-circular>
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
                  <div class="flex-container detail-row">
                     <div class="info-section">
                        <h4 class="list-name">每日步數：</h4>
                        <p class="list-info50">{{ healthInfo.steps }} 步</p>
                     </div>
                     <v-btn class="detail-btn" color="#76caad" @click="showDetail('steps')">
                        詳細
                     </v-btn>
                  </div>
               </v-list-item>

               <v-list-item class="list-item">
                  <div class="flex-container detail-row">
                     <div class="info-section">
                        <h4 class="list-name">每日慢跑時間：</h4>
                        <p class="list-info50">{{ totalWalkingTime }} 分鐘</p>
                     </div>
                     <v-btn class="detail-btn" color="#76caad" @click="showDetail('jogging')">
                        詳細
                     </v-btn>
                  </div>
               </v-list-item>

               <v-list-item class="list-item">
                  <div class="flex-container detail-row">
                     <div class="info-section">
                        <h4 class="list-name">每日飲食目標：</h4>
                        <p class="list-info50">
                           <span v-if="healthInfo.selectedMeals && healthInfo.selectedMeals.length > 0">
                              {{ healthInfo.selectedMeals.join(', ') }}
                           </span>
                           <span v-else>無</span>
                        </p>
                     </div>
                  </div>
               </v-list-item>

               <!-- 每週體重紀錄 - 只在有值時顯示 -->
               <v-list-item v-if="healthInfo.weight !== null && healthInfo.weight !== undefined 
               && healthInfo.weight !== '查無紀錄'" class="list-item">
                  <div class="flex-container">
                     <h4 class="list-name">每周體重紀錄：</h4>
                     <p class="list-info50">{{ healthInfo.weight }} 公斤</p>
                  </div>
               </v-list-item>

               <!-- HbA1C - 只在有值時顯示 -->
               <v-list-item v-if="healthInfo.hba1c !== null && healthInfo.hba1c !== undefined 
               && healthInfo.hba1c !== '查無紀錄'" class="list-item">
                  <div class="flex-container">
                     <h4 class="list-name">HbA1C：</h4>
                     <p class="list-info50">{{ healthInfo.hba1c }}</p>
                  </div>
               </v-list-item>
            </template>
            
            <template v-else>
               <!-- 無記錄時顯示中央提示文字 -->
               <div class="nodata-frame">
                  <p>查無紀錄</p>
               </div>
            </template>
            </template>
         </v-card>

         <!-- 填寫按鈕 -->
         <v-btn v-if="hasRecord && canEdit" class="gotoMeet-btn" 
         :ripple="false" @click="editHealthRecord">
            填寫健康紀錄
         </v-btn> 
      </v-col>
      <!-- 上傳記錄區塊 -->
      <v-col v-if="hasRecord && canEdit" cols="12" sm="12" md="6" lg="6">
         <v-card class="upload-records-container">
            <div class="upload-header" @click="toggleRecords">
               <h3>上傳記錄</h3>
               <v-icon>{{ isRecordsExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </div>
            
            <v-expand-transition>
               <div v-show="isRecordsExpanded" class="records-list">
                  <template v-if="uploadedRecords.length > 0">
                     <div v-for="(record, index) in sortedRecords" :key="record.id" class="record-item">
                        <div class="record-info">
                           <div class="record-time">
                              <span class="record-date">{{ formatDateTime(record.createAt).date }}</span>
                              <span class="record-hour">{{ formatDateTime(record.createAt).time }}</span>
                              <span class="record-font">上傳記錄</span>
                           </div>
                           <span class="record-status" v-if="index === 0"></span>
                        </div>
                        <v-btn class="edit-record-btn" color="#76caad" @click="editUploadedRecord(record)">
                           編輯
                        </v-btn>
                     </div>
                  </template>
                  <div v-else class="no-records">
                     <p>無上傳記錄</p>
                  </div>
               </div>
            </v-expand-transition>
         </v-card>
      </v-col>
   </v-row>

   <!-- 詳細資訊彈窗 -->
   <v-dialog v-model="detailDialog.show" width="400" class="detail-dialog">
      <v-card>
         <v-card-title class="dialog-title">
            {{ detailDialog.title }}
            <v-btn icon @click="detailDialog.show = false" class="close-btn" variant="text">
               <v-icon>mdi-close</v-icon>
            </v-btn>
         </v-card-title>
         <v-card-text class="dialog-content">
            <div class="detail-records">
               <div v-for="record in sortedDetailRecords" :key="record.id" class="detail-record-item">
                  <div class="record-time">
                     <span class="detail-record-date">{{ formatDateTime(record.createAt).date }}</span>
                     <span class="detail-record-hour">{{ formatDateTime(record.createAt).time }}</span>
                  </div>
                  <span class="record-value">
                     {{ getDetailValue(record) }}
                  </span>
               </div>
            </div>
         </v-card-text>
      </v-card>
   </v-dialog>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { changeDate, getAllHealthRecordsByDate } from '../../api/healthNote';

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
      const isRecordsExpanded = ref(false);
      const uploadedRecords = ref([]);

      // 用單個對象管理彈窗狀態
      const detailDialog = ref({
         show: false,
         type: '',
         title: ''
      });

      // 統一的顯示詳細資訊方法
      const showDetail = (type) => {
         detailDialog.value = {
            show: true,
            type: type,
            title: type === 'steps' ? '步數詳細紀錄' : '慢跑時間詳細紀錄'
         };
      };

      // 根據類型獲取顯示值
      const getDetailValue = (record) => {
         if (detailDialog.value.type === 'steps') {
            return `${record.dailySteps || 0} 步`;
         } else {
            return `${record.dailyJoggingTime || 0} 分鐘`;
         }
      };

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

      const sortedRecords = computed(() => {
         return [...uploadedRecords.value].sort((a, b) => {
            const dateA = new Date(a.createAt);
            const dateB = new Date(b.createAt);
            
            if (dateA.toLocaleDateString() !== dateB.toLocaleDateString()) {
               // 如果日期不同，較新的日期排前面
               return dateB - dateA;
            } else {
               // 如果日期相同，比較時間
               return dateB.getTime() - dateA.getTime();
            }
         });
      });

      // 格式化時間
      const formatDateTime = (dateString) => {
         const date = new Date(dateString);
         const dateStr = date.toLocaleDateString('zh-TW', {
            month: '2-digit',
            day: '2-digit'
         });
         const timeStr = date.toLocaleTimeString('zh-TW', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
         });
         return {
            date: dateStr,
            time: timeStr
         };
      };

      // 切換記錄展開狀態
      const toggleRecords = () => {
         isRecordsExpanded.value = !isRecordsExpanded.value;
      };

      // 排序計算屬性
      const sortedDetailRecords = computed(() => {
         // 根據 type 決定排序邏輯
         return [...uploadedRecords.value].sort((a, b) => {
            const dateA = new Date(a.createAt);
            const dateB = new Date(b.createAt);
            
            if (dateA.toLocaleDateString() !== dateB.toLocaleDateString()) {
               // 如果日期不同，較新的日期排前面
               return dateB - dateA;
            } else {
               // 如果日期相同，根據類型進行排序
               if (detailDialog.value.type === 'steps') {
                  return (b.dailySteps || 0) - (a.dailySteps || 0);
               } else {
                  return (b.dailyJoggingTime || 0) - (a.dailyJoggingTime || 0);
               }
            }
         });
      });

      onMounted(async () => {
         const dateString = route.query.date;
         if (!dateString) {
            console.error('未提供日期參數');
            return;
         }

         loading.value = true;
         try {
            // 獲取當天所有記錄
            const records = await getAllHealthRecordsByDate(dateString);
            uploadedRecords.value = records.map(record => ({
               id: record.id,
               createAt: record.createAt,
               dailySteps: record.dailySteps,
               dailyJoggingTime: record.dailyJoggingTime,
               dailyDietGoal: record.dailyDietGoal,
               weeklyWeight: record.weeklyWeight,
               HbA1c: record.HbA1c
         }));

         // 處理最新記錄的顯示
         if (records.length > 0) {
            processRecord(records);
         } else {
            setEmptyRecord();
         }
         } catch (error) {
         console.error('載入健康紀錄失敗:', error);
         setEmptyRecord();
         } finally {
         loading.value = false;
         }
      });

      // 處理記錄的輔助函數
      function processRecord(records) {
         if (!records || records.length === 0) {
            setEmptyRecord();
            return;
         }

         // 先檢查第一筆記錄的日期是否符合目標日期
         const recordDate = changeDate(records[0].createAt);
         const currentDate = changeDate(route.query.date);
         
         if (recordDate === currentDate) {
            // 計算所有記錄的步數和慢跑時間總和
            const totalSteps = records.reduce((sum, record) => {
               return sum + (record.dailySteps || 0);
            }, 0);

            const totalJoggingTime = records.reduce((sum, record) => {
               return sum + (record.dailyJoggingTime || 0);
            }, 0);

            // 獲取最新記錄（陣列中的第一筆，因為已經按時間排序）
            const latestRecord = records[0];

            // 設置健康資訊
            healthInfo.value = {
               // 步數和慢跑時間使用總和
               steps: totalSteps,
               walkingTimes: [totalJoggingTime],
               
               // 飲食目標使用最新記錄
               diet: latestRecord.dailyDietGoal.startsWith('是') ? '是' : '否',
               selectedMeals: latestRecord.dailyDietGoal.startsWith('是') 
                  ? latestRecord.dailyDietGoal.match(/早餐|午餐|晚餐/g) || []
                  : [],
               
               // 體重和 HbA1c 只在有值時才設置
               weight: latestRecord.weeklyWeight || null,
               hba1c: latestRecord.HbA1c || null
            };
         } else {
            setEmptyRecord();
         }
      }

      // 編輯上傳的記錄
      const editUploadedRecord = (record) => {
         router.push({
         path: '/healthDetailEdit',
         query: { 
            date: route.query.date,
            recordId: record.id,
            recordTime: new Date(record.createAt).toISOString()
         }
         });
      };

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
         detailDialog,
         showDetail,
         getDetailValue,
         hasRecord,
         formattedDate,
         totalWalkingTime,
         loading,
         canEdit,
         editHealthRecord,
         isRecordsExpanded,
         uploadedRecords,
         toggleRecords,
         sortedRecords,
         formatDateTime,
         sortedDetailRecords,
         editUploadedRecord,
      };
   }
};
</script>

<style scoped src="../../assets/css/common.css"></style>
<style scoped src="../../assets/css/accountInfo.css"></style>
<style scoped src="../../assets/css/healthNoteDetail.css"></style>

<style lang="css" scoped>
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

   @media screen and (max-width: 1200px) {
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