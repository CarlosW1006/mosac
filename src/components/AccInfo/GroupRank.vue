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
                        <option value="2024-11">2月</option>
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
         <v-card style="margin-bottom: 50px;">
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
                  <table>
                     <thead>
                        <tr class="table-title">
                           <!-- <th class="col1"><strong></strong></th> -->
                           <!-- <td class="col2"><strong>群組類別</strong></td> -->
                           <td class="col2"><strong>帳號暱稱</strong></td>
                           <td class="col2"><strong>群組排名</strong></td>
                           <td class="col2"><strong>減重進度</strong></td>
                           <td class="col2"><strong>心得回饋</strong></td>
                        </tr>
                     </thead>

                     <tbody v-for="(item, index) in rankingData[curPageNum-1]" :key="index">
                        <tr>
                           <!-- <td><p style="text-align: center;">{{ (curPageNum*perPageDataAmount + index + 1)-perPageDataAmount }}</p></td> -->
                           <!-- <td><p>{{ item.phase }}</p></td> -->
                           <td><p>{{ item.nickname }}</p></td>
                           <td><p>第{{ item.rank }}名</p></td>
                           <td><p>{{ (item.completionRate*100).toFixed(2) }}%</p></td>
                           <td v-if="item.rank <= 3">
                              <button class="li-info expandBtn" @click="navigateToPath('groupFeedback', item.id)">檢視心得</button>
                           </td>
                        </tr>
                     </tbody>
                  </table>

                  <div v-if="rankingData.length == 0" class="nodata-frame">
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

            <div v-else>
               <v-container class="max-width">
                  <v-pagination v-model="curPageNum" @update:modelValue="changePage" :length="pagesAmount" class="my-4"/>
               </v-container>
            </div>
         </v-card>
      </v-col>
   </v-row>

</template>

<script>
   import { getGroupRanking } from '../../api/groupRank.js';
   import { useWindowWidth } from '../JS/winwidth.js';
   import { ref } from 'vue';
   import { useRouter } from 'vue-router'

   export default {
      name: 'accInfoPage',
      setup() {
         const router = useRouter();
         let rankingData = ref([]);
         let dataNumRange = ref([1, 10]);
         const selectedGroup = ref('1');
         const selectedMonth = ref('2024-11');
         let curPageNum = ref(1); // 當前頁數
         let pagesAmount = ref(0); // 頁面總數
         let curDataAmount = ref(0); // 當前頁面資料數量
         let perPageDataAmount = ref(10); // 當前每頁筆數
         const perPageNum = [10, 20, 30]; // 每頁資料筆數
         const { winwidth } = useWindowWidth();
         let session = sessionStorage.getItem('session');

         function fetchRankingData() {
            getGroupRanking(selectedGroup.value, selectedMonth.value, perPageDataAmount.value)
            .then((result) => {
               if (result && result.length > 0) {
                  rankingData.value = result;
                  pagesAmount.value = result.length;
                  curDataAmount.value = result[curPageNum.value - 1] ? result[curPageNum.value - 1].length : 0;

                  // 計算資料範圍
                  const startNum = perPageDataAmount.value * (curPageNum.value - 1) + 1;
                  const endNum = startNum + curDataAmount.value - 1;
                  dataNumRange.value = [startNum, endNum];
               } else {
                  rankingData.value = [];
                  pagesAmount.value = 0;
                  curDataAmount.value = 0;
                  dataNumRange.value = [0, 0];
               }
            })
         }

         // 搜尋功能
         function searchSpecifyGroup() {
            if (selectedMonth.value === 'none' || selectedGroup.value === 'none') {
               alert("請選擇月份和群組");
               return;
            }
            curPageNum.value = 1; // 回到第一頁
            fetchRankingData();
         }

         // 每頁筆數功能
         function changePerPageNum() {
            curPageNum.value = 1; // 回到第一頁
            fetchRankingData();
         }

         // 切換頁數功能
         function changePage(newPageNum) {
            curPageNum.value = newPageNum; // 更新到新頁數
            fetchRankingData();
         }

         // 初始化查詢
         fetchRankingData();

         // 功能列頁面轉址
         function navigateToPath(path, uid) { 
            router.push({ path: '/' + path, query: { uid: uid, phase: selectedGroup.value, month: selectedMonth.value }});
         }

         return {
            session,
            winwidth,
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


<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/accountInfo.css";
</style>
