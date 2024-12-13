<template>
   <div class="page-tab flex-container" v-if="winwidth != true">
      <a href="#/index" class="tab-L">回到首頁</a> <p class="tab-R">首頁＞專家諮詢</p>
   </div>

   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12">
         <v-card>
            <v-list-item class="list-title">
               <h3 class="page-title">專家諮詢</h3>
            </v-list-item>

            <v-list-item>
               <div class="search-frame">
                  <div class="dropdown">
                     <select id="category" name="category" class="top-select" v-model="consultType">
                        <option value="">諮詢類別</option>
                        <option value="0">個人諮詢</option>
                        <option value="1">團體諮詢</option>
                     </select>
                     <p class="date-input-info">查詢區間</p>
                     <input type="date" class="date-input-start" placeholder="查詢起始日期" v-model="startAtDate">
                     <span style="margin: 0 0.5em; font-size: 2em;">—</span>
                     <input type="date" class="date-input-end" placeholder="查詢結束日期" v-model="endAtDate"><br>
                  </div>
                  <input type="string" id="steps" class="search-input-meet" placeholder="請輸入諮詢名稱" v-model="searchTitle"/>
                  <button class="search-btn" @click="searchConsult()">搜尋</button>
               </div>
            </v-list-item>
         </v-card>
      </v-col>
   </v-row>

   <v-row style="margin: 0 1% 0;">
      <v-col cols="12">
         <v-card style="margin-bottom: 50px;">
            <v-list-item class="list-title">
               <h3 class="page-title">查詢結果</h3>
            </v-list-item>
            <div class="flex-container pageTotal">
               <div class="perPage flex-container">
                  <v-select v-model="perPageDataAmount" :items="perPageNum" @update:modelValue="changePerPageNum" 
                  label="每頁筆數" outlined style="width: 130px;" />
               </div>
               <v-btn v-if="accType == 0 && reserveStatus.message !== '本月無預約紀錄'" class="reserve-btn" :ripple="false" 
               :disabled="reserveStatus.clicked" @click="reserveConsult()">{{ reserveStatus.message }}</v-btn>
               <v-btn v-if="accType == 0 && reserveStatus.message == '本月無預約紀錄'" class="reserve-btn" :ripple="false" 
               :disabled="reserveStatus.clicked" @click="reserveConsult()">我要預約諮詢</v-btn>
            </div>

            <div class="meetInfoFrame">
               <v-card v-for="(item, index) in consultData[curPageNum-1]" :key="index"
               :class="{'person-meet-card mb-4': item.consult_type == '0', 'group-meet-card mb-4': item.consult_type !== '0'}">
                  <div class="flex-container">
                     <p :class="{'person-meet': item.consult_type == '0', 'group-meet': item.consult_type !== '0'}">
                        {{ item.consult_type == '0' ? '個人諮詢' : '團體諮詢' }}
                     </p>
                     <v-icon style="color: #e9b347; margin-top: 1em;" size="25" v-if="item.consult_type == '0'">mdi-account-outline</v-icon>
                     <v-icon style="color: #436ead; margin-top: 1em;" size="25" v-else>mdi-account-multiple-plus-outline</v-icon>
                  </div>
                  <div class='meet-name mt-4'>
                     <a :href="'#/meetDetail?meetId='+item.id">{{ item.title }}</a>
                     <!-- <p style="margin-top: 15px;">諮詢專家：{{ item.name }}</p> -->
                  </div>
                  <div class="flex-container meet-time">
                     <p>諮詢時間：{{ callFormatTime(item.start_time) }} ～ {{ callFormatTime(item.end_time) }}</p>
                  </div>
               </v-card>
            </div>

            <div class="flex-container page-container" v-if="winwidth">
               <h3 class="pageNum">顯示第 {{ dataNumRange[0] }} 到 {{ dataNumRange[1] }} 項結果，共 {{ curDataAmount }} 項</h3>
               <v-row justify="end">
                  <v-pagination v-model="curPageNum" @update:modelValue="changePage" :length="pagesAmount" total-visible="5" class="my-4"/>
               </v-row>
            </div>

            <div v-else-if="isSmallWidth">
               <v-container class="max-width">
                  <v-pagination v-model="curPageNum" @update:modelValue="changePage" :length="pagesAmount" total-visible="1" class="my-4"/>
               </v-container>
            </div>

            <div v-else>
               <v-container class="max-width">
                  <v-pagination v-model="curPageNum" @update:modelValue="changePage" :length="pagesAmount" class="my-4"/>
               </v-container>
            </div>
         </v-card>
      </v-col>
   </v-row>

   <!-- 等待執行結果動畫 -->
   <isLoading :active="isLoading" color="#76caad"/>
</template>

<script>
   import { ref } from 'vue';
   import { formatTime } from '../JS/formatTime.js';
   import { useWindowWidth } from '../JS/winwidth.js';
   import { getConsultResult, getExpertConsultResult, postReserveConsult, getReserveOutcome} from '../../api/consult.js';

   export default {
      name: 'meetInfoPage',
      setup() {
         const { winwidth, isSmallWidth } = useWindowWidth();
         let session = sessionStorage.getItem('session');
         let accType = sessionStorage.getItem('accType');
         let isLoading = ref(true);
         let dataNumRange = ref([1, 10]);
         let reserveStatus = ref([0, '我要預約諮詢']);
         const consultType = ref('');
         const startAtDate = ref('');
         const endAtDate = ref('');
         const searchTitle = ref('');
         let consultData = ref([]);
         let curPageNum = ref(1); // 當前頁數
         let pagesAmount = ref(1); // 頁面總數
         let curDataAmount = ref(0); // 當前頁面資料數量
         let perPageDataAmount = ref(10); // 當前每頁筆數
         const perPageNum = [10, 20, 30]; // 每頁資料筆數

         function fetchRankingData() {
            if(accType == 0) {
               getConsultResult(consultType.value, startAtDate.value, endAtDate.value, searchTitle.value, perPageDataAmount.value)
               .then((result) => {
                  consultData.value = result;
                  pagesAmount.value = result.length;
                  if (curPageNum.value && Array.isArray(result[curPageNum.value - 1])) {
                     curDataAmount.value = result[curPageNum.value - 1].length;
                  } else {
                     curDataAmount.value = 0; // 或者設置為默認值
                  }

                  if(consultData.value == undefined) {
                     consultData.value = [];
                  }
               });
            }

            else {
               getExpertConsultResult(consultType.value, startAtDate.value, endAtDate.value, searchTitle.value, perPageDataAmount.value)
               .then((result) => {
                  consultData.value = result;
                  pagesAmount.value = result.length;
                  if (curPageNum.value && Array.isArray(result[curPageNum.value - 1])) {
                     curDataAmount.value = result[curPageNum.value - 1].length;
                  } else {
                     curDataAmount.value = 0; // 或者設置為默認值
                  }

                  if(consultData.value == undefined) {
                     consultData.value = [];
                  }
               });
            }
            
         }
         
         // 搜尋功能
         function searchConsult() { 
            curPageNum.value = 1;
            fetchRankingData();
         }

         // 每頁筆數功能
         function changePerPageNum() {
            curPageNum.value = 1;
            fetchRankingData();
         }

         // 切換頁數功能
         function changePage(newPageNum) {
            curPageNum.value = newPageNum;
            fetchRankingData();
         }

         function callFormatTime(val) {
            return formatTime(val)
         }

         function reserveConsult() {
            postReserveConsult();
         }

         Promise.all([
            getReserveOutcome().then((result) => {
               fetchRankingData();
               
               reserveStatus.value = { ...result };

               if (result.reserve_status == 1 || result.reserve_status == 2) {
                  reserveStatus.value.clicked = true;
               }
            }),
         ]).finally(() => {
            isLoading.value = false; // 所有資料加載完成後設為 false
         });

         return {
            winwidth,
            isSmallWidth,
            session,
            accType,
            isLoading,
            reserveStatus,
            dataNumRange,
            consultType,
            startAtDate,
            endAtDate,
            searchTitle,
            consultData,
            curPageNum,
            pagesAmount,
            curDataAmount,
            perPageDataAmount,
            perPageNum,
            
            formatTime,
            changePage,
            searchConsult,
            reserveConsult,
            callFormatTime,
            changePerPageNum,
         };
      },
   };
</script>

<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/meetInfo.css";
</style>
