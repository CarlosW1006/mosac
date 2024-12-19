<template>
   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12">
         <v-card>
            <v-list-item class="list-title">
               <h3 class="page-title">群組排名紀錄</h3>
            </v-list-item>

            <v-list-item>
               <div class="search-frame">
                  <div class="dropdown">
                     <select id="phaseMonth" name="phaseMonth" class="top-select" v-model="selectedMonth">
                        <option value="none">請選擇月份</option>
                        <option value="2024-12">2月</option>
                        <option value="2024-03">3月</option>
                        <option value="2024-04">4月</option>
                        <option value="2024-05">5月</option>
                        <option value="2024-06">6月</option>
                        <option value="2024-07">7月</option>
                     </select>
                     
                     <select id="phaseGroup" name="phaseGroup" class="top-select2" v-model="selectedGroup">
                        <option value="none">請選擇群組</option>
                        <option value="1">意圖前期</option>
                        <option value="2">意圖期</option>
                        <option value="3">準備期</option>
                        <option value="4">行動期</option>
                        <option value="5">維持期</option>
                     </select>

                     <button class="search-btn" @click="searchSpecifyGroup()">搜尋</button>
                  </div>
               </div>
            </v-list-item>
         </v-card>
      </v-col>
   </v-row>

   <v-row style="margin: 0 1% 0;">
      <v-col cols="12">
         <v-card style="margin-bottom: 10px;">
            <v-list-item class="list-title">
               <h3 class="page-title">查詢結果</h3>
            </v-list-item>
            <div class="flex-container pageTotal">
               <div class="perPage flex-container">
                  <v-select v-model="perPageDataAmount" :items="perPageNum" @update:modelValue="changePerPageNum" 
                  label="每頁筆數" outlined style="width: 130px;" />
               </div>
            </div>

            <div class="tableInfoFrame">
               <div class="tableInnerFrame">
                  <table v-if="rankingData && rankingData.length > 0">
                     <thead>
                        <tr class="table-title">
                           <td class="col2"><strong>帳號暱稱</strong></td>
                           <td class="col2"><strong>群組排名</strong></td>
                           <td class="col2"><strong>減重進度</strong></td>
                        </tr>
                     </thead>

                     <tbody>
                        <tr v-for="(item, index) in rankingData[curPageNum-1]" :key="index">
                           <td v-if="item.rank <= 3 && item.nickname != null"><p class="group-top3">{{ item.nickname }}</p></td>
                           <td v-else-if="item.rank <= 3" @click="navigateToPath('groupFeedback', item.phaseRecordId)"><p class="group-top3">{{ item.blockname }}</p></td>
                           <td v-else><p>{{ item.nickname }}</p></td>
                           <td v-if="item.rank <= 3" @click="navigateToPath('groupFeedback', item.phaseRecordId)"><p class="group-top3">第{{ item.rank }}名</p></td>
                           <td v-else><p>第{{ item.rank }}名</p></td>
                           <td v-if="item.rank <= 3" @click="navigateToPath('groupFeedback', item.phaseRecordId)"><p class="group-top3">{{ (item.completionRate*100).toFixed(2) }}%</p></td>
                           <td v-else><p>{{ (item.completionRate*100).toFixed(2) }}%</p></td>
                        </tr>
                     </tbody>
                  </table>

                  <div v-else class="nodata-frame">
                     <p class="nodata">查無資料</p>
                  </div>
               </div>
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
   import { getGroupRanking } from '../../api/groupRank.js';
   import { useWindowWidth } from '../JS/winwidth.js';
   import { ref } from 'vue';
   import { useRouter } from 'vue-router'

   export default {
      name: 'accInfoPage',
      setup() {
         let isLoading = ref(true);
         const router = useRouter();
         const selectedGroup = ref('1');
         const selectedMonth = ref('2024-12');
         const { winwidth, isSmallWidth } = useWindowWidth();

         let rankingData = ref([]);
         const curPageNum = ref(1); // 目前頁數
         const pagesAmount = ref(1); // 頁面總數
         const curDataAmount = ref(0); // 資料總數
         const perPageNum = [10, 20, 30]; // 每頁資料數量(選項)
         const dataNumRange = ref([1, 10]);
         const perPageDataAmount = ref(10); // 目前每頁資料數量

         function fetchRankingData() {
            getGroupRanking(selectedGroup.value, selectedMonth.value, perPageDataAmount.value)
            .then((result) => {
               rankingData.value = result;

               let totalDataCount = 0;
               for(let i = 0; i < result.length; i++) {
                  if(Array.isArray(result[i])) {
                     totalDataCount += result[i].length;
                  }
               }
               pagesAmount.value = Math.ceil(totalDataCount / perPageDataAmount.value);

               let startIndex = (curPageNum.value - 1) * perPageDataAmount.value + 1;
               let endIndex = Math.min(curPageNum.value * perPageDataAmount.value, totalDataCount);
               dataNumRange.value = [startIndex, endIndex];

               if(curPageNum.value <= result.length && Array.isArray(result[curPageNum.value - 1])) {
                  curDataAmount.value = totalDataCount;
               } else {
                  curDataAmount.value = 0;
               }

               if(rankingData.value === undefined) {
                  rankingData.value = [];
               }
            })
         }

         // 搜尋功能
         function searchSpecifyGroup() {
            if(selectedMonth.value === 'none' || selectedGroup.value === 'none') {
               alert("請選擇月份和群組");
               return;
            }
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

         Promise.all([
            fetchRankingData(),
         ]).finally(() => {
            isLoading.value = false; // 所有資料加載完成後設為 false
         });

         function navigateToPath(path, phaseRecordId) { 
            router.push({ path: '/' + path, query: { phaseRecordId: phaseRecordId, month: selectedMonth.value }});
         }

         return {
            isLoading,
            winwidth,
            isSmallWidth,
            perPageNum,
            curPageNum,
            pagesAmount,
            rankingData,
            dataNumRange,
            selectedMonth,
            selectedGroup,
            curDataAmount,
            perPageDataAmount,

            changePage,
            navigateToPath,
            changePerPageNum,
            searchSpecifyGroup,
         };
      },
   };
</script>

<style scoped src="../../assets/css/common.css"></style>
<style scoped src="../../assets/css/accountInfo.css"></style>