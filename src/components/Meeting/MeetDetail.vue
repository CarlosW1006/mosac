<template>
   <div class="page-tab flex-container">
      <a href="#/meetInfo" class="tab-L">回到專家諮詢</a> <p class="tab-R">專家諮詢＞諮詢資訊檢視</p>
   </div>

   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12" sm="12" md="7" lg="7">
         <v-card>
            <v-list-item class="list-title">
               <h3 class="page-title">諮詢資訊檢視</h3>
            </v-list-item>

            <template v-for="(item, index) in infoItems" :key="index">
               <v-list-item class="list-item" v-if="item.show">
                  <div class="flex-container">
                     <h4 class="list-name">{{ item.label }}</h4>
                     <p class="list-info50">{{ item.value }}</p>
                  </div>
               </v-list-item>
            </template>

            <v-list-item class="list-item">
               <div class="flex-container">
                  <h4 class="list-name">諮詢簡介：</h4>
               </div>
               <v-card class="meetInfo-container">
                  <p class="meetInfo-font">{{ meetInfoData.description }}</p>
               </v-card>
            </v-list-item>
         </v-card>

         <v-btn class="gotoMeet-btn" :disabled="!allowEnterConsultation" 
         :ripple="false" @click="navigateToPath(meetInfoData.url)">
            進入諮詢室
         </v-btn>
      </v-col>
   </v-row>

   <!-- 等待執行結果動畫 -->
   <isLoading :active="isLoading" color="#76caad"/>
</template>

<script>
   import { ref, computed, onMounted } from 'vue';
   import { formatTime } from '../JS/formatTime.js';
   import { getConsultInfo, getExpertConsultInfo } from '../../api/consult.js';

   export default {
      name: 'meetDtPage',
      setup() {
         let isLoading = ref(true);
         let accType = sessionStorage.getItem('accType');
         const hashUrl = ref(window.location.hash);
         const currentDateTime = callFormatTime(new Date());
         const queryString = hashUrl.value.split('?')[1];
         const params = new URLSearchParams(queryString);
         const meetId = params.get('meetId');
         let meetInfoData = ref([]);
         let allowEnterConsultation = ref(false);

         // 當頁面載入後檢查當前的 hash 值
         onMounted(() => {
            hashUrl.value = window.location.hash;
         });

         // 監聽 hash 值的變化
         window.addEventListener('hashchange', () => {
            hashUrl.value = window.location.hash;
         });

         let promise;

         if (accType == 0) {
            promise = getConsultInfo(meetId).then((result) => {
               meetInfoData.value = result;
            });
         } else {
            promise = getExpertConsultInfo(meetId).then((result) => {
               meetInfoData.value = result;
            });
         }

         Promise.all([promise]).finally(() => {
            isLoading.value = false; // 所有資料加載完成後設為 false

            allowEnterConsultation.value =
               callFormatTime(meetInfoData.value.start_time) < currentDateTime &&
               callFormatTime(meetInfoData.value.end_time) > currentDateTime;
         });

         function callFormatTime(val) {
            return formatTime(val);
         }

         // 功能列頁面轉址
         function navigateToPath(url) {
            window.open(url, '_blank');
         }

         // 陣列化諮詢資訊
         const infoItems = computed(() => [
            {
               label: '諮詢名稱：',
               value: meetInfoData.value.title || '',
               show: true,
            },
            {
               label: '諮詢類別：',
               value: meetInfoData.value.consult_type == '0' ? '個人諮詢' : 
               meetInfoData.value.consult_type == '1' ? '團體諮詢' : '',
               show: true,
            },
            {
               label: '預約人數：',
               value: meetInfoData.value.user_consults || '',
               show: accType != 0,
            },
            {
               label: '諮詢專家：',
               value: meetInfoData.value.name || '',
               show: true,
            },
            {
               label: '開始時間：',
               value: meetInfoData.value.start_time ? formatTime(meetInfoData.value.start_time) : '',
               show: true,
            },
            {
               label: '結束時間：',
               value: meetInfoData.value.end_time ? formatTime(meetInfoData.value.end_time) : '',
               show: true,
            },
         ]);

         return {
            accType,
            infoItems,
            isLoading,
            meetInfoData,
            allowEnterConsultation,

            callFormatTime,
            navigateToPath,
         };
      },
   };
</script>


<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/meetInfo.css";
   @import "../../assets/css/accountInfo.css";
</style>