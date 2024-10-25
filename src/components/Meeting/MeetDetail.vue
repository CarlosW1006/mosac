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
               
            <v-list-item class="list-item">
               <div class="flex-container">
                  <h4 class="list-name">諮詢名稱：</h4>
                  <p class="list-info50">下午2點 個人諮詢會議</p>
               </div>
            </v-list-item>

            <v-list-item class="list-item">
               <div class="flex-container">
                  <h4 class="list-name">諮詢類別：</h4>
                  <p class="list-info50">個人諮詢</p>
               </div>
            </v-list-item>

            <v-list-item class="list-item">
               <div class="flex-container">
                  <h4 class="list-name">主持名稱：</h4>
                  <p class="list-info50">陳ＯＯ醫師</p>
               </div>
            </v-list-item>

            <v-list-item class="list-item">
               <div class="flex-container">
                  <h4 class="list-name">諮詢開始時間：</h4>
                  <p class="list-info50">2024/10/10 14:00</p>
               </div>
            </v-list-item>

            <v-list-item class="list-item">
               <div class="flex-container">
                  <h4 class="list-name">諮詢結束時間：</h4>
                  <p class="list-info50">2024/10/10 15:00</p>
               </div>
            </v-list-item>
         </v-card>

         <v-btn class="gotoMeet-btn" :ripple="false">進入諮詢室</v-btn>
      </v-col>
   </v-row>
</template>

<script>
export default {
      name: 'meetDtPage',
      setup() {
         
      },
   };
</script>

<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/meetInfo.css";
   @import "../../assets/css/accountInfo.css";
</style>