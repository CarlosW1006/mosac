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
                           <td class="col2"><strong>標題</strong></td>
                           <td class="col2"><strong>發布時間</strong></td>
                        </tr>
                     </thead>

                     <tbody v-for="(item, index) in data" :key="index"> 
                        <tr>
                           <td><p style="text-align: center;">{{ index + 1 }}</p></td>
                           <td><p>{{ item[0] }}</p></td>
                           <td><p>{{ item[1] }}</p></td>
                        </tr>
                     </tbody>
                  </table>
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
   import { useWindowWidth } from './JS/winwidth.js';
   import { ref } from 'vue';

   export default {
      name: 'sysNoticePage',
      setup() {
         const { winwidth } = useWindowWidth();
         const selectPerPageNum = ref(10);
         const perPageNum = [10, 20, 30];
         const perPage = ref(10);
         const data = ref([
            ['系統已為您安排諮詢會議，諮詢時間：2024/10/10 14:00~15:00', '2024/10/01'],
            ['健康知能已新增一篇文章：多吃蔬食有助減重？吃對更重要！', '2024/10/01'],
            ['健康知能已新增一篇文章：多吃蔬食有助減重？吃對更重要！', '2024/10/01'],
            ['系統已為您安排諮詢會議，諮詢時間：2024/10/10 14:00~15:00', '2024/10/01'],
            ['健康知能已新增一篇文章：多吃蔬食有助減重？吃對更重要！', '2024/10/01'],
            ['健康知能已新增一篇文章：多吃蔬食有助減重？吃對更重要！', '2024/10/01'],
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
