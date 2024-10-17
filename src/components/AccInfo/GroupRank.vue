<template>
      <v-row style="margin: 1% 1% 10px;">
         <v-col cols="12">
            <v-card style="width: 100%;">
               <v-list-item class="list-title">
                  <h3 class="page-title">群組排名紀錄</h3>
               </v-list-item>

               <v-list-item>
                  <div class="search-frame">
                     <div class="dropdown">
                        <p class="search-item">月份</p>
                        <select id="category" name="category">
                           <option value="">請選擇月份</option>
                           <option value="2">2月</option>
                           <option value="3">3月</option>
                           <option value="4">4月</option>
                           <option value="5">5月</option>
                           <option value="6">6月</option>
                           <option value="7">7月</option>
                        </select>
                        
                        <p class="search-item">群組類別</p>
                        <select id="category" name="category">
                           <option value="">請選擇群組</option>
                           <option value="專業訓練">意圖前期</option>
                           <option value="通識訓練">意圖期</option>
                           <option value="職前訓練">準備期</option>
                           <option value="管理訓練">行動期</option>
                           <option value="專業課程">維持期</option>
                        </select>

                        <button class="search-btn" style="width: 70px;">搜尋</button>
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
                  <h3 class="page-title">群組排名紀錄</h3>
               </v-list-item>
               <div class="flex-container pageTotal">
                  <p>顯示</p>
                  <select v-model="perPage">
                     <option value="10">10</option>
                     <option value="20">20</option>
                     <option value="30">30</option>
                  </select>
                  <p>項結果</p>
               </div>
               <div class="groupInfoFrame">
                  <table>
                     <!-- 群組排名：大螢幕畫面 -->
                     <!-- 欄位標題 -->
                     <thead>
                        <tr class="table-title">
                           <th class="col1"><strong></strong></th>
                           <td class="col2"><strong>群組類別</strong></td>
                           <td class="col2"><strong>用戶姓名</strong></td>
                           <td class="col2"><strong>群組排名</strong></td>
                           <td class="col2"><strong>心得回饋</strong></td>
                        </tr>
                     </thead>

                     <tbody v-for="(item, index) in data" :key="index"> 
                        <tr>
                           <td><p style="text-align: center;">{{ index + 1 }}</p></td>
                           <td><p>{{ item[0] }}</p></td>
                           <td><p>{{ item[1] }}</p></td>
                           <td><p>{{ item[2] }}</p></td>
                           <td>
                              <button class="li-info expandBtn" 
                              @click="toggleCard(index)">檢視心得</button>
                           </td>
                        </tr>

                        <tr v-if="showCard[index] == true" class="feedback"> <!-- 使用 index 控制項目的顯示 -->
                           <td colspan="5">
                              <p><strong>心得回饋：</strong>{{ item[3] }}</p>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>

               <div class="flex-container page-container">
                  <h3 class="pageNum" v-if="winwidth == true">顯示第 1 到 10 項結果，共 {{ datas }} 項</h3>
                  <v-row justify="end">
                     <v-pagination :length="pages" :total-visible="5"/>
                  </v-row>
               </div>
            </v-card>
         </v-col>
      </v-row>
</template>

<script>
   import { useWindowWidth } from '../JS/winwidth.js';
   import { ref } from 'vue';

   export default {
      name: 'accInfoPage',
      setup() {
         const { winwidth } = useWindowWidth();
         const perPage = ref(10);
         const data = ref([
            ['2月/意圖前期', '陳ＯＯ', '第一名', '這是用戶1的心得回饋內容。'],
            ['2月/意圖前期', '李ＯＯ', '第二名', '這是用戶2的心得回饋內容。'],
            ['2月/意圖前期', '黃ＯＯ', '第三名', '這是用戶3的心得回饋內容。']
         ]);

         const datas = data.value.length;
         // const pages = Math.ceil(data.value.length / 10);
         const pages = data.value.length * 3;
         let session = sessionStorage.getItem('session');

         const showCard = ref([]); // 追蹤每個項目的顯示狀態
         function toggleCard(index) {
            if (showCard.value[index] == undefined) {
               showCard.value[index] = false;
            }

            showCard.value[index] = !showCard.value[index];

            console.log(showCard.value);
         }

         return {
            winwidth,
            session,
            showCard,
            data,
            datas,
            pages,
            perPage,
            toggleCard,
         };
      },
   };
</script>

<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/accountInfo.css";
</style>
