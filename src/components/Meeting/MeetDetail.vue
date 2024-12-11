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
                  <h4 class="list-name">主辦人名稱：</h4>
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

            <v-list-item class="list-item">
               <div class="flex-container">
                  <h4 class="list-name">諮詢簡介：</h4>
                  <p class="list-info50"></p>
               </div>
               <v-card class="meetInfo-container">
                  <p class="meetInfo-font">
                     此次諮詢會議由陳〇〇醫師主持，旨在為參與者提供全方位的個人化指導與專業建議。會議內容將圍繞健康管理、心理調適及生活規劃等主題，針對每位參與者的實際需求進行深入探討。陳醫師以專業的醫學知識與細膩的溝通方式，幫助參與者解答各類疑問，無論是健康維護、壓力管理、職場挑戰還是生活品質提升，皆能獲得實用且具針對性的解決方案。
<br><br>
                     無論您面臨的是健康問題、情緒困擾還是生活規劃的難題，這場諮詢會議都將為您提供指引，幫助您更有信心地迎接未來。請務必把握此次機會，讓專業的建議成為您前進道路上的助力！
                  </p>
               </v-card>
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