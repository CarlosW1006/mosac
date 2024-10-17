<template>
   <v-container fluid>
      <v-row :class="{ 'pa-4': winwidth }">
         <!-- 今日健康紀錄 -->
         <v-col cols="12" sm="12" md="7" lg="7" class="mb-4">
            <v-card outlined class="v-card-L">
               <v-card-title>今日健康紀錄</v-card-title>
               <v-card-text class="inner-box">
                  <ul class="mt-4">
                     <!-- 欄位標題 -->
                     <li class="row title-row">
                        <div class="col-1"></div>
                        <div class="col-2"><strong>項目</strong></div>
                        <div class="col-2"><strong>填寫狀態</strong></div>
                        <div class="col-2 col-time"><strong>填寫時間</strong></div>
                     </li>

                     <!-- 健康紀錄項目 -->
                     <li class="row">
                        <div class="col-1 text-center">1.</div>
                        <div class="col-2">步數紀錄</div>
                        <div class="col-2">
                           <v-chip class="completed-chip" color="green" text-color="white" outlined>
                              填寫完成
                           </v-chip></div>
                        <div class="col-2 col-time">2024/10/10 08:10</div>
                     </li>

                     <li class="row gray">
                        <div class="col-1 text-center">2.</div>
                        <div class="col-2">慢跑紀錄</div>
                        <div class="col-2">
                           <v-chip class="completed-chip" color="green" text-color="white" outlined>
                              填寫完成
                           </v-chip></div>
                        <div class="col-2 col-time">2024/10/10 08:10</div>
                     </li>

                     <li class="row">
                        <div class="col-1 text-center">3.</div>
                        <div class="col-2">飲食紀錄</div>
                        <div class="col-2">
                           <v-chip class="completed-chip" color="green" text-color="white" outlined>
                              填寫完成
                           </v-chip></div>
                        <div class="col-2 col-time">2024/10/10 08:10</div>
                     </li>

                     <li class="row gray">
                        <div class="col-1 text-center">4.</div>
                        <div class="col-2">體重紀錄</div>
                        <div class="col-2">
                           <v-chip class="completed-chip" color="red" text-color="white" outlined>
                              尚未填寫
                           </v-chip></div>
                        <div class="col-2 col-time"></div>
                     </li>

                     <li class="row">
                        <div class="col-1 text-center">5.</div>
                        <div class="col-2">HbA1C紀錄</div>
                        <div class="col-2">
                           <v-chip class="completed-chip" color="red" text-color="white" outlined>
                              尚未填寫
                           </v-chip></div>
                        <div class="col-2 col-time"></div>
                     </li>
                  </ul>
               </v-card-text>
            </v-card>

            <!-- 今日諮詢行程：大螢幕畫面 -->
            <div v-if="winwidth == true">
               <v-card outlined class="mt-4 v-card-L">
                  <v-card-title>今日諮詢行程</v-card-title>
                  <v-card-text class="inner-box">
                     <ul class="mt-4">
                        <!-- 欄位標題 -->
                        <li class="row title-row">
                           <div class="col-1"></div>
                           <div class="col-2"><strong>類別</strong></div>
                           <div class="col-3"><strong>會議名稱</strong></div>
                           <div class="col-2 col-time"><strong>諮詢時間</strong></div>
                        </li>

                        <!-- 健康紀錄項目 -->
                        <li class="row">
                           <div class="col-1 text-center">1.</div>
                           <div class="col-2 personMeet">個人諮詢
                              <img :src="require('../assets/images/user.png')" class="meetImg"></div>
                           <div class="col-3 meetName">下午2點 個人諮詢會議</div>
                           <div class="col-2 col-time">14:00~15:00</div>
                        </li>

                        <li class="row gray">
                           <div class="col-1 text-center">2.</div>
                           <div class="col-2 groupMeet">團體諮詢
                              <img :src="require('../assets/images/users.png')" class="meetImg2"></div>
                           <div class="col-3">[聊天室] 減重飲食指南1</div>
                           <div class="col-2 col-time">15:00~16:00</div>
                        </li>

                        <li class="row">
                           <div class="col-1 text-center">3.</div>
                           <div class="col-2 groupMeet">團體諮詢
                              <img :src="require('../assets/images/users.png')" class="meetImg2"></div>
                           <div class="col-3">[聊天室] 減重飲食指南2</div>
                           <div class="col-2 col-time">16:00~17:00</div>
                        </li>
                     </ul>
                  </v-card-text>
               </v-card>
            </div>

            <!-- 今日諮詢行程：小螢幕畫面 -->
            <div v-else>
               <v-card class="meetCard mt-4">
                  <v-card-title>今日諮詢行程</v-card-title>
                  <v-card outlined class="meet-box mt-4" style="border: 3px solid #e9b347;"><v-card-text>
                     <div class="meetInfo">
                        <strong class="personMeet">個人諮詢</strong><img :src="require('../assets/images/user.png')" class="meetImg">
                        <p class="meetTime">14:00~15:00</p>
                     </div>
                     <div class="meetName">下午2點 個人諮詢會議 下午2點 個人諮詢會議 下午2點 個人諮詢會議</div>
                  </v-card-text></v-card>
                  <v-card outlined class="meet-box mt-4" style="border: 3px solid #436ead;"><v-card-text>
                     <div class="meetInfo">
                        <strong class="groupMeet">團體諮詢</strong><img :src="require('../assets/images/users.png')" class="meetImg">
                        <p class="meetTime">15:00~16:00</p>
                     </div>
                     <div class="meetName">[聊天室] 減重飲食指南1</div>
                  </v-card-text></v-card>
               </v-card>
            </div>
         </v-col>

         <!-- 個人及團體目標達成率 -->
         <v-col cols="12" sm="12" md="5" lg="5" class="mb-4 v-card-RT">
            <v-card outlined class="v-card-R">
               <v-card-title>個人目標達成率</v-card-title>
               <v-card-text style="height: 100%;">
                  <v-row style="height: 100%;">
                  <v-col cols="6" sm="6" md="5" lg="5">
                     <div class="flex-container target">
                        <h5>目標體重</h5>&nbsp;&nbsp;<h5>65公斤</h5>
                     </div>
                     <div class="flex-container recent">
                        <h5>目前體重</h5>&nbsp;&nbsp;<h5>70公斤</h5>
                     </div>
                  </v-col>
                  <v-col cols="6" sm="6" md="7" lg="7" class="flex-container-chart">
                     <v-progress-circular :model-value="timer.progress" color="#f5bc4a" size="120" width="15">
                        60%
                     </v-progress-circular>
                  </v-col>
                  </v-row>
               </v-card-text>
            </v-card>

            <v-card outlined class="v-card-R mt-4">
               <v-card-title style="display: flex;">
                  群組目標達成率
                  <v-btn class="toGroupPage">更多</v-btn>
               </v-card-title>
               <v-card-text style="height: 100%;">
                  <v-row style="height: 100%;">
                  <v-col cols="6" sm="6" md="5" lg="5">
                     <div class="flex-container target">
                        <h5>群組總人數</h5>&nbsp;&nbsp;<h5>30人</h5>
                     </div>
                     <div class="flex-container recent">
                        <h5>達成總人數</h5>&nbsp;&nbsp;<h5>18人</h5>
                     </div>
                  </v-col>
                  <v-col cols="6" sm="6" md="7" lg="7" class="flex-container-chart">
                     <v-progress-circular :model-value="timer.progress" color="#CE0000	" size="120" width="15">
                        60%
                     </v-progress-circular>
                     
                  </v-col>
                  </v-row>
               </v-card-text>
            </v-card>
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
   import { useWindowWidth } from './JS/winwidth.js';
   import { ref, reactive } from 'vue';

   export default {
      name: 'IndexPage',
      setup() {
         const showDetails = ref(false);
         const { winwidth } = useWindowWidth();
         let timer = reactive({ interval: null, progress: 0 });

         timer.interval = setInterval(() => {
            if(timer.progress < 60){
               timer.progress += 10; // Update progress reactively
               console.log('Progress:', timer.progress);
            }
         }, 50);

         return {
            winwidth,
            showDetails,
            timer,
         };
      },
   };
</script>

<style lang="css" scoped>
   @import "../assets/css/index.css";

   :deep(.v-progress-circular) {
      width: 90% !important;
      height: 90% !important;
      font-size: 2em !important;
   }

</style>