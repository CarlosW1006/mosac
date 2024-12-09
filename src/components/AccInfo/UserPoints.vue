<template>
   <v-row style="margin: 1% 1% 10px;">
      <!-- 目前累積點數功能 -->
      <v-col cols="12" sm="12" md="6" lg="6">
         <v-card>
            <v-list-item class="list-title">
               <div class="flex-container">
                  <h3 class="page-title">個人累積點數</h3>
               </div>
            </v-list-item>
               
            <v-list-item class="list-item">
               <div class="flex-container">
                  <p class="list-name">累積點數：</p>
                  <div class="flex-container">
                     <p class="list-number">{{ accInfoArr.totalPoints }}</p><p class="list-unit">點</p>
                  </div>
               </div>
            </v-list-item>

            <v-list-item class="list-item">
               <div class="flex-container">
                  <p class="list-name">累積徽章：</p>
                  <p class="list-number">{{ accInfoArr.totalMedals }}</p><p class="list-unit">枚</p>
               </div>
            </v-list-item>
         </v-card>

         <v-btn :class="pointsChangable? 'exchange-btn':'unexchange-btn'" :disabled="!pointsChangable" 
         :ripple="false" @click="callExchangePoints()">我要兌換點數</v-btn>
         <p class="exxhangeDateMsg">第一梯次 點數兌換時間：2025/06/01 ~ 06/14</p>
         <p class="exxhangeDateMsg">第二梯次 點數兌換時間：2025/09/01 ~ 09/14</p>
      </v-col>

      <!-- 點數兌換紀錄功能 -->
      <!-- <v-col cols="12" sm="12" md="6" lg="6">
         <v-card>
            <v-list-item class="list-title">
               <div class="flex-container">
                  <h3 class="page-title">點數兌換紀錄</h3>
               </div>
            </v-list-item>
         </v-card>

         <v-card style="height: 430px; overflow-y: auto;"> 
            <v-list-item class="list-item" v-for="(item, index) in pointsRecord" :key="index">
               <div class="flex-container">
                  <p>兌換時間：</p>
                  <p class="list-info50" style="margin-right: 50px; padding: 5px 0px 5px;">{{ item['createAt'] }}</p>
               </div>
               <div class="flex-container">
                  <p>兌換點數：</p>
                  <p v-if="item.records && item.records.length > 0" class="list-info50" style="margin-right: 35px;">{{ item['records'][0]['amount'] }}點</p>
                  <p v-else class="list-info50">0點</p>

                  <p>兌換徽章：</p>
                  <p v-if="item.records && item.records.length > 1" class="list-info50">{{ item['records'][1]['amount'] }}枚</p>
                  <p v-else class="list-info50">0枚</p>
               </div>
            </v-list-item>

            <div v-if="pointsRecord.length == 0" class="nodata-frame">
               <p>查無資料</p>
            </div>
            
         </v-card>
      </v-col> -->

      <!-- 點數兌換記錄功能 -->
      <v-col cols="12" sm="12" md="6" lg="6">
         <v-card class="upload-records-container">
            <div class="upload-header" @click="toggleRecords">
               <h3>點數兌換紀錄</h3>
               <v-icon>{{ isRecordsExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </div>
            
            <v-expand-transition>
               <div v-show="isRecordsExpanded" class="records-list">
                  <template v-if="pointsRecord.length > 0">
                     <v-list-item class="list-item" v-for="(item, index) in pointsRecord" :key="index">
                        <div class="flex-container exchange-date">
                           <p>兌換時間：</p>
                           <p class="list-info50">{{ item['createAt'] }}</p>
                        </div>
                        <div class="flex-container">
                           <p>已兌換點數：</p>
                           <p v-if="item.records && item.records.length > 0" class="list-info50">{{ item['records'][0]['amount'] }}點</p>
                           <p v-else class="list-info50">0點</p>
                        </div>

                        <div class="flex-container">
                           <p>已兌換徽章：</p>
                           <p v-if="item.records && item.records.length > 1" class="list-info50">{{ item['records'][1]['amount'] }}枚</p>
                           <p v-else class="list-info50">0枚</p>
                        </div>
                     </v-list-item>
                  </template>

                  <div v-else class="no-records">
                     <p>無點數兌換記錄</p>
                  </div>
               </div>
            </v-expand-transition>
         </v-card>
      </v-col>
   </v-row>

   <!-- 等待執行結果動畫 -->
   <isLoading :active="isLoading" color="#76caad"/>
</template>

<script>
import { ref } from 'vue';
import { checkDateDurant } from '../JS/accinfoservice';
import { askAccInfo, askPointsRecord, exchangePoints } from '../../api/accInfo.js';

export default {
   name: 'userPointsPage',

   setup() {
      let isLoading = ref(true);
      const accInfoArr = ref('');
      const pointsRecord = ref([]);
      let pointsChangable = ref(false);
      const isRecordsExpanded = ref(false);

      pointsChangable.value = checkDateDurant();

      Promise.all([
         askAccInfo().then((result) => {
            accInfoArr.value = result;
         }),
         askPointsRecord().then((result) => {
            pointsRecord.value = result;
         }),
      ]).finally(() => {
         isLoading.value = false; // 所有資料加載完成後設為 false
      });

      function callExchangePoints() {
         if (accInfoArr.value.totalPoints == 0 && accInfoArr.value.totalMedals == 0) {
            alert('目前尚無點數與徽章可以兌換');
         } else {
            isLoading.value = true;
            try {
               exchangePoints();
            } finally {
               alert('點數兌換完成');
               isLoading.value = false;

               setTimeout(() => {
                  window.location.reload();
               }, 1000);
            }
         }
      }

      // 切換記錄展開狀態
      function toggleRecords() {
         isRecordsExpanded.value = !isRecordsExpanded.value;
      }

      return {
         isLoading,
         accInfoArr,
         pointsRecord,
         pointsChangable,
         isRecordsExpanded,

         toggleRecords,
         callExchangePoints,
      };
   },
};
</script>


<style scoped src="../../assets/css/common.css"></style>
<style scoped src="../../assets/css/accountInfo.css"></style>