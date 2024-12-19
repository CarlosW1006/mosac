<template>
   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12">
         <v-card style="margin-bottom: 50px;">
            <v-list-item class="list-title">
               <h3 class="page-title">系統通知訊息</h3>
            </v-list-item>

            <div class="flex-container pageTotal">
               <div class="perPage flex-container">
                  <v-select v-model="perPageDataAmount" :items="perPageNum" @update:modelValue="changePerPageNum" 
                  label="每頁筆數" outlined style="width: 130px;" />
               </div>
            </div>

            <div class="tableInfoFrame">
               <div class="tableInnerFrame">
                  <table v-if="notifyData && notifyData.length > 0">
                     <thead>
                        <tr class="table-title">
                           <th class="col1"><strong></strong></th>
                           <td class="col1"><strong>類別</strong></td>
                           <td class="col2" v-if="winwidth"><strong>標題</strong></td>
                           <td class="col2" v-if="winwidth"><strong>發布時間</strong></td>
                           <td class="col2" v-if="!winwidth"><strong>詳細資訊</strong></td>
                        </tr>
                     </thead>

                     <tbody v-for="(item, index) in notifyData[curPageNum-1]" :key="index">
                        <tr>
                           <td><p style="text-align: center;">{{ (curPageNum - 1) * perPageDataAmount + index + 1 }}</p></td>
                           <td><p :class="item.readed === false ? 'notifyUnreaded0' : 'notifyReaded'">{{ item.notifyType === "0" ? "諮詢行程" : "健康知能" }}</p></td>
                           <td v-if="winwidth" @click="notifyReaded(item.notifyType, item.notifyVarId, item.id)">
                              <button :class="item.readed === false ? 'notifyUnreaded' : 'notifyReaded'">{{ item.title }}</button>
                           </td>
                           <td v-if="winwidth"><p :class="item.readed === false ? 'notifyUnreaded0' : 'notifyReaded'">{{ item.createAt }}</p></td>
                           <td v-if="!winwidth">
                              <button class="li-info expandBtn" @click="toggleCard(index)">檢視資訊</button>
                           </td>
                        </tr>

                        <!-- 檢視資訊展開區塊 -->
                        <tr v-if="showCard[index]" class="notifyInfo">
                           <td colspan="5" @click="notifyReaded(item.notifyType, item.notifyVarId, item.videoId)" :class="item.readed === false ? 'notifyUnreaded' : 'notifyReaded'">
                              <p v-if="item.notifyType === '0'"><strong>{{ item.consult_type === "0" ? "個人諮詢行程通知" : "團體諮詢行程通知" }}</strong></p>
                              <p v-else><strong>健康知能影片通知</strong></p>
                              <p><strong>{{ item.notifyType === "0" ? "諮詢標題：" : "影片標題：" }}</strong>{{ item.title }}</p>
                              <p><strong>發布時間：</strong>{{ item.createAt }}</p>
                           </td>
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
   import { ref } from 'vue';
   import { useWindowWidth } from './JS/winwidth.js';
   import { integrateNotify, videoNotifyReaded, consultNotifyReaded } from '../api/systemNotify.js';

   export default {
      name: 'sysNoticePage',
      setup() {
         const isLoading = ref(true);
         const showCard = ref([]);
         const { winwidth, isSmallWidth } = useWindowWidth();

         const notifyData = ref([]);
         const curPageNum = ref(1); // 目前頁數
         const pagesAmount = ref(1); // 頁面總數
         const curDataAmount = ref(0); // 資料總數
         const perPageNum = [10, 20, 30]; // 每頁資料數量(選項)
         const dataNumRange = ref([1, 10]);
         const perPageDataAmount = ref(10); // 目前每頁資料數量

         async function fetchNotifyData() {
            try {
               const result = await integrateNotify(perPageDataAmount.value);
               notifyData.value = result.paginatedData;

               // 初始化展開狀態
               showCard.value = notifyData.value.flat().map(() => false);

               const totalDataCount = notifyData.value.reduce((sum, page) => sum + page.length, 0);
               pagesAmount.value = Math.ceil(totalDataCount / perPageDataAmount.value);

               const startIndex = (curPageNum.value - 1) * perPageDataAmount.value + 1;
               const endIndex = Math.min(curPageNum.value * perPageDataAmount.value, totalDataCount);
               dataNumRange.value = [startIndex, endIndex];
               curDataAmount.value = totalDataCount;
            } catch (error) {
               console.error("Error fetching notifications:", error);
               notifyData.value = [];
               curDataAmount.value = 0;
            } finally {
               isLoading.value = false;
            }
         }

         function changePerPageNum() {
            curPageNum.value = 1;
            fetchNotifyData();
         }

         function changePage(newPageNum) {
            curPageNum.value = newPageNum;
            fetchNotifyData();
         }

         function toggleCard(index) {
            if(index >= 0 && index < showCard.value.length) {
               showCard.value[index] = !showCard.value[index];
            } else {
               alert("Index out of range:", index);
            }
         }

         async function notifyReaded(notifyType, notifyVarId, videoId) { 
            try {
               if(notifyType === '0') {
                  await consultNotifyReaded(notifyVarId);
                  window.location.href = `#/meetDetail?meetId=${notifyVarId}`;
                  
               } else if(notifyType === '1') {
                  await videoNotifyReaded(notifyVarId);
                  window.location.href = `#/healthKnowledgeView?id=${videoId}`;
                  
               } else {
                  alert('未知通知類型，請稍後再嘗試');
               }
            } catch (error) {
               alert(`通知標註失敗：${error.message || "請稍後再嘗試"}`);
            }
         }

         fetchNotifyData();

         return {
            winwidth,
            showCard,
            isLoading,
            isSmallWidth,

            notifyData,
            perPageNum,
            curPageNum,
            pagesAmount,
            dataNumRange,
            curDataAmount,
            perPageDataAmount,
            
            changePage,
            toggleCard,
            notifyReaded,
            changePerPageNum,
         };
      },
   };

</script>

<style lang="css" scoped>
   @import "../assets/css/common.css";
   @import "../assets/css/accountInfo.css";
</style>
