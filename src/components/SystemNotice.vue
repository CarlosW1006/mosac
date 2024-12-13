<template>
   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12">
         <v-card style="margin-bottom: 50px;">
            <v-list-item class="list-title">
               <h3 class="page-title">系統通知訊息</h3>
            </v-list-item>
            <div class="flex-container pageTotal">
               <div class="perPage flex-container">
                  <v-select v-model="selectPerPageNum" :items="perPageNum" label="每頁筆數" outlined style="width: 130px;" />
               </div>
            </div>

            <div class="tableInfoFrame">
               <div class="tableInnerFrame">
                  <table>
                     <thead>
                        <tr class="table-title">
                           <th class="col1"><strong></strong></th>
                           <td class="col1"><strong>類別</strong></td>
                           <td class="col2" v-if="winwidth"><strong>標題</strong></td>
                           <td class="col2" v-if="winwidth"><strong>發布時間</strong></td>
                           <td class="col2"  v-if="!winwidth"><strong>詳細資訊</strong></td>
                        </tr>
                     </thead>

                     <tbody v-for="(item, index) in data" :key="index">
                        <tr>
                           <td><p style="text-align: center;">{{ index + 1 }}</p></td>
                           <td><p>{{ item[0] }}</p></td>
                           <td v-if="winwidth"><p>{{ item[2] }}：{{ item[3] }}</p></td>
                           <td v-if="winwidth"><p>{{ item[1] }}</p></td>
                           <td v-if="!winwidth">
                              <a class="li-info expandBtn" 
                              @click="toggleCard(index)">檢視資訊</a>
                           </td>
                        </tr>

                        <!-- 檢視資訊展開區塊 -->
                        <tr v-if="showCard[index] == true" class="notifyInfo">
                           <td colspan="5">
                              <p>{{ item[2] }}</p>
                              <p><strong>諮詢標題：</strong>{{ item[3] }}</p>
                              <p><strong>發布時間：</strong>{{ item[1] }}</p>
                           </td>
                        </tr>
                     </tbody>
                  </table>

                  <div v-if="data.length == 0" class="nodata-frame">
                     <p class="nodata">查無資料</p>
                  </div>
               </div>
            </div>

            <div class="flex-container page-container" v-if="winwidth">
               <h3 class="pageNum">顯示第 1 到 10 項結果，共 {{ datas }} 項</h3>
               <v-row justify="end">
                  <v-pagination :length="pages" total-visible="5" class="my-4"/>
               </v-row>
            </div>

            <div v-else>
               <v-container class="max-width">
                  <v-pagination :length="pages" class="my-4"/>
               </v-container>
            </div>
         </v-card>
      </v-col>
   </v-row>
</template>

<script>
   import { ref } from 'vue';
   import { useWindowWidth } from './JS/winwidth.js';
   import { integrateNotify } from '../api/systemNotify.js'

   export default {
      name: 'sysNoticePage',
      setup() {
         const { winwidth, isSmallWidth } = useWindowWidth();
         const selectPerPageNum = ref(10);
         const perPageNum = [10, 20, 30];
         const perPage = ref(10);
         const data = ref([
            ['諮詢行程', '2024/10/01 12:00:00', '個人諮詢行程通知', '諮詢測試3_1212'],
            ['諮詢行程', '2024/10/01 12:00:00', '個人諮詢行程通知', '諮詢測試3_1212'],
            ['諮詢行程', '2024/10/01 12:00:00', '個人諮詢行程通知', '諮詢測試3_1212'],
         ]);

         const datas = data.value.length;
         const pages = 1;
         let session = sessionStorage.getItem('session');

         const showCard = ref([]); // 追蹤每個項目的顯示狀態
         function toggleCard(index) {
            if (showCard.value[index] == undefined) {
               showCard.value[index] = false;
            }

            showCard.value[index] = !showCard.value[index];
         }

         integrateNotify();

         return {
            winwidth,
            isSmallWidth,
            session,
            showCard,
            data,
            datas,
            pages,
            perPage,
            perPageNum,
            selectPerPageNum,
            toggleCard,
         };
      },
   };
</script>

<style lang="css" scoped>
   @import "../assets/css/common.css";
   @import "../assets/css/accountInfo.css";
</style>
