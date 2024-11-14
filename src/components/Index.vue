<template>
   <v-container fluid>
      <v-row>
         <v-col cols="12" md="8">
            <!-- 個人及團體目標達成率 -->
            <v-col cols="12" class="v-card-space" v-if="accType == 0">
               <v-row>
                  <!-- 個人目標達成率卡片 -->
                  <v-col cols="12" sm="6" md="6">
                     <v-card outlined class="v-card-Target">
                        <v-card-title>個人目標達成率：65公斤</v-card-title>
                        <v-card-text style="height: 150px;">
                           <p class="recent-progress">目前體重：70公斤</p>
                           <div class="flex-container">
                              <v-progress-linear class="recent-progress-linear" :model-value="timer.progress" color="#ffaf2f"></v-progress-linear>
                              <div class="recent-progress-num" style="color: #ffaf2f">{{ timer.progress }}%</div>
                           </div>
                        </v-card-text>
                     </v-card>
                  </v-col>

                  <!-- 群組目標達成率卡片 -->
                  <v-col cols="12" sm="6" md="6">
                     <v-card outlined class="v-card-Target">
                        <v-card-title style="display: flex;">群組目標達成率：30人</v-card-title>
                        <v-card-text style="height: 150px;">
                           <p class="recent-progress">達成人數：18人</p>
                           <div class="flex-container">
                              <v-progress-linear class="recent-progress-linear" :model-value="timer.progress" color="#c53939"></v-progress-linear>
                              <div class="recent-progress-num" style="color: #c53939">{{ timer.progress }}%</div>
                           </div>
                        </v-card-text>
                     </v-card>
                  </v-col>
               </v-row>
            </v-col>

            <!-- 下方左側功能區 -->
            <v-col cols="12">
               <v-row>
                  <v-col cols="12" v-if="accType == 0">
                     <!-- 今日健康紀錄 -->
                     <v-card outlined class="v-card-L v-card-space">
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
                  </v-col>

                  <v-col cols="12">
                     <!-- 今日諮詢行程：大螢幕畫面 -->
                     <div v-if="winwidth == true">
                        <v-card outlined class="v-card-L">
                           <v-card-title v>今日諮詢行程</v-card-title>
                           <v-card-text class="inner-box">
                              <ul class="mt-5">
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
                                       <v-icon>mdi-account-outline</v-icon>
                                    </div>
                                    <div class="col-3">下午2點 個人諮詢會議</div>
                                    <div class="col-2 col-time">14:00~15:00</div>
                                 </li>

                                 <li class="row gray">
                                    <div class="col-1 text-center">2.</div>
                                    <div class="col-2 groupMeet">團體諮詢
                                       <v-icon>mdi-account-multiple-plus-outline</v-icon>   
                                    </div>
                                    <div class="col-3">[聊天室] 減重飲食指南1</div>
                                    <div class="col-2 col-time">15:00~16:00</div>
                                 </li>

                                 <li class="row">
                                    <div class="col-1 text-center">3.</div>
                                    <div class="col-2 groupMeet">團體諮詢
                                       <v-icon>mdi-account-multiple-plus-outline</v-icon>
                                    </div>
                                    <div class="col-3">[聊天室] 減重飲食指南2</div>
                                    <div class="col-2 col-time">16:00~17:00</div>
                                 </li>
                              </ul>
                           </v-card-text>
                        </v-card>
                     </div>

                     <!-- 今日諮詢行程：小螢幕畫面 -->
                     <div v-else>
                        <v-card class="meetCard v-card-space">
                           <v-card-title>今日諮詢行程</v-card-title>
                           <v-card outlined class="meet-box" style="border: 3px solid #e9b347;"><v-card-text>
                              <div class="meetInfo">
                                 <strong class="personMeet">個人諮詢
                                    <v-icon>mdi-account-outline</v-icon>
                                 </strong>
                                 <p class="meetTime">14:00~15:00</p>
                              </div>
                              <div class="meetName">下午2點 個人諮詢會議 下午2點 個人諮詢會議 下午2點 個人諮詢會議</div>
                           </v-card-text></v-card>
                           <v-card outlined class="meet-box" style="border: 3px solid #436ead;"><v-card-text>
                              <div class="meetInfo">
                                 <strong class="groupMeet">團體諮詢
                                    <v-icon>mdi-account-multiple-plus-outline</v-icon>
                                 </strong>
                                 <p class="meetTime">15:00~16:00</p>
                              </div>
                              <div class="meetName">[聊天室] 減重飲食指南1</div>
                           </v-card-text></v-card>
                        </v-card>
                     </div>
                  </v-col>
               </v-row>
            </v-col>
         </v-col>

         <v-col cols="12" md="4" v-if="accType == 0">
            <!-- 下方右側功能區 -->
            <v-col cols="12">
               <v-row>
                  <!-- 上個月群組排名 -->
                  <v-col cols="12">
                     <v-card outlined class="v-card-Group v-card-space">
                        <v-card-title>上個月群組排名：準備期</v-card-title>
                        
                        <v-card-text class="inner-box">
                           <ul class="mt-5 group-rank">
                              <!-- 欄位標題 -->
                              <li class="row title-row">
                                 <div class="col-4"></div>
                                 <div class="col-5"><strong>姓名</strong></div>
                                 <div class="col-5"><strong>達成率</strong></div>
                                 <div class="col-5"><strong>組排名</strong></div>
                              </li>

                              <!-- 健康紀錄項目 -->
                              <li class="row">
                                 <div class="col-4 text-center"></div>
                                 <div class="col-6">葉ＯＯ</div>
                                 <div class="col-6">100%</div>
                                 <div class="col-6">第一名</div>
                              </li>

                              <li class="row gray">
                                 <div class="col-4 text-center"></div>
                                 <div class="col-6">陳ＯＯ</div>
                                 <div class="col-6">100%</div>
                                 <div class="col-6">第一名</div>
                              </li>

                              <li class="row">
                                 <div class="col-4 text-center"></div>
                                 <div class="col-6">王ＯＯ</div>
                                 <div class="col-6">95%</div>
                                 <div class="col-6">第三名</div>
                              </li>
                           </ul>
                        </v-card-text>
                     </v-card>
                  </v-col>

                  <!-- 系統功能捷徑 -->
                  <v-col cols="12">
                     <v-card outlined class="v-card-L" style="padding: 15px; display: flex; flex-direction: column; gap: 10px;">
                        <v-row>
                        <button class="next-page-button" @click="navigateToPath('healthKnowledge')">
                           <span class="arrow">»</span>
                           <span class="text">前往健康知能</span>
                        </button>

                        <button class="next-page-button" @click="navigateToPath('healthNotes')">
                           <span class="arrow">»</span>
                           <span class="text">前往健康手札</span>
                        </button>
                        
                        <button class="next-page-button" @click="navigateToPath('careGarden')">
                           <span class="arrow">»</span>
                           <span class="text">前往照護園地</span>
                        </button>
                        
                        <button class="next-page-button" @click="navigateToPath('meetInfo')">
                           <span class="arrow">»</span>
                           <span class="text">前往專家諮詢</span>
                        </button>
                     </v-row>
                     </v-card>
                  </v-col>
               </v-row>
            </v-col>
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
         let accType = sessionStorage.getItem('accType');
         let timer = reactive({ interval: null, progress: 0 });

         const showDetails = ref(false);
         const { winwidth } = useWindowWidth();

         timer.interval = setInterval(() => {
            if(timer.progress < 60) {
               timer.progress += 10;
            }
         }, 50);

         // 功能列頁面轉址
         function navigateToPath(path) { 
            window.location.href = '#/' + path;
         }

         return {
            winwidth,
            showDetails,
            timer,
            accType,
            navigateToPath,
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