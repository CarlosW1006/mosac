<template>
   <div class="page-tab flex-container" v-if="winwidth != true">
      <a href="#/index" class="tab-L">回到首頁</a> <p class="tab-R">首頁＞專家諮詢</p>
   </div>

   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12">
         <v-card>
            <v-list-item class="list-title">
               <h3 class="page-title">諮詢預約紀錄</h3>
            </v-list-item>

            <v-list-item>
               <div class="search-frame">
                  <div class="dropdown">
                     <select id="category" name="category" class="top-select">
                        <option value="">諮詢類別</option>
                        <option value="0">個人諮詢</option>
                        <option value="1">團體諮詢</option>
                     </select>

                     <input type="string" id="steps" class="search-input" placeholder="請輸入諮詢名稱、日期" />
                     <button class="search-btn">搜尋</button>
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
                  <v-select :items="perPageNum" label="每頁筆數" outlined :width="130"/>
               </div>
               <v-btn class="reserve-btn" :ripple="false">我要預約諮詢</v-btn>
            </div>

            <div class="meetInfoFrame">
               <v-card v-for="(item, index) in data" :key="index"
               :class="{'person-meet-card' : item[0] === '個人諮詢', 'group-meet-card mt-4': item[0] !== '個人諮詢'}">
                  <div class="flex-container">
                     <p :class="{'person-meet': item[0] === '個人諮詢', 'group-meet': item[0] !== '個人諮詢'}">{{ item[0] }}</p>
                     <img :src="require('../../assets/images/user.png')" class="meet-img" v-if="item[0] === '個人諮詢'">
                     <img :src="require('../../assets/images/users.png')" class="meet-img" v-else>
                  </div>
                  <div :class="{'person-meet-name mt-4': item[0] === '個人諮詢', 'group-meet-name mt-4': item[0] !== '個人諮詢'}">
                     <a :href="'#/meetDetail?mid='+item[4]">{{ item[1] }}</a>
                     <p style="color: grey; margin-top: 15px;">主講人 {{ item[3] }}</p>
                     
                  </div>
                  <div class="flex-container meet-host">
                     <p>諮詢時間&nbsp;&nbsp;{{ item[2] }}</p>
                  </div>
               </v-card>
            </div>

            <div class="flex-container page-container" v-if="winwidth == true">
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
   import { useWindowWidth } from '../JS/winwidth.js';
   import { ref } from 'vue';

   export default {
      name: 'meetInfoPage',
      setup() {
         const { winwidth } = useWindowWidth();
         const perPageNum = [10, 20, 30];
         const perPage = ref(10);
         const data = ref([
            ['個人諮詢', '下午2點 個人諮詢會議', '2024/10/10 14:00~15:00', '陳ＯＯ醫師', 'M0001'],
            ['團體諮詢', '[聊天室] 減重飲食指南1', '2024/10/10 15:00~16:00', '陳ＯＯ醫師', 'M0002'],
            ['團體諮詢', '[聊天室] 減重飲食指南2', '2024/10/10 16:00~17:00', '陳ＯＯ醫師', 'M0003']
         ]);

         const datas = data.value.length;
         // const pages = Math.ceil(data.value.length / 10);
         const pages = data.value.length * 3;
         let session = sessionStorage.getItem('session');

         return {
            winwidth,
            session,
            data,
            datas,
            pages,
            perPage,
            perPageNum,
         };
      },
   };
</script>

<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/meetInfo.css";
</style>
