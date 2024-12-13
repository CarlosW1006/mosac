<template>
   <div class="page-tab flex-container" v-if="winwidth != true">
      <a href="#/index" class="tab-L">回到首頁</a> <p class="tab-R">首頁＞照護園地</p>
   </div>

   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12">
         <v-card>
            <v-list-item class="list-title list-title-care">
               <h3 class="page-title">照護園地</h3>
            </v-list-item>

            <v-list-item>
               <div class="search-frame">
                  <div class="dropdown">
                     <input type="string" id="steps" class="search-input top-select" placeholder="請輸入影片標題" />
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
                  <v-select v-model="selectPerPageNum" :items="perPageNum" label="每頁筆數" outlined :width="130"/>
               </div>
            </div>
            
            <!-- 影片網格區塊(大視窗) -->
            <div v-if="winwidth == true"> 
               <v-list-item>
                  <v-row>
                     <v-col v-for="(video, index) in videos" :key="index"
                     cols="12" md="6" lg="4" class="video-item">
                        <v-card class="video-card">
                           <router-link class="router-link" :to="{ name: 'careGdViewPage'}">
                              <v-img :src="video.thumbnail" class="video-thumbnail" cover>
                                 <v-icon class="play-icon">mdi-play-circle</v-icon>
                              </v-img>
                              <div class="video-info-card">
                                 <div class="left-section">
                                    <v-icon class="complete-icon">mdi-check-bold</v-icon>
                                    <span class="video-title">{{ video.title }}</span>
                                 </div>
                                 <span class="view-count">觀看次數：{{ video.views }}</span>
                              </div>
                           </router-link>
                        </v-card>
                     </v-col>
                  </v-row>
               </v-list-item>
            </div>

            <!-- 影片網格區塊(小視窗) -->
            <div v-else>
               <v-list-item style="padding: 0em">
                  <v-row class="video-grid">
                     <v-col v-for="(video, index) in videos" :key="index" 
                     cols="12" md="6" lg="4" class="video-item">
                        <v-card class="video-card">
                           <router-link class="router-link" :to="{ name: 'careGdViewPage'}">
                              <v-img :src="video.thumbnail" class="video-thumbnail" cover>
                                 <v-icon class="play-icon">mdi-play-circle</v-icon>
                              </v-img>
                              <div class="video-info-card">
                                 <div class="left-section">
                                    <v-icon class="complete-icon">mdi-check-bold</v-icon>
                                    <span class="video-title">{{ video.title }}</span>
                                 </div>
                                 <span class="view-count">觀看次數：{{ video.views }}</span>
                              </div>
                           </router-link>
                        </v-card>
                     </v-col>
                  </v-row>
               </v-list-item>
            </div>

            <div class="flex-container page-container" v-if="winwidth == true">
               <h3 class="pageNum">顯示第 1 到 10 項結果，共 {{ datas }} 項</h3>
               <v-row justify="end">
                  <v-pagination :length="pages" total-visible="5" class="my-4"/>
               </v-row>
            </div>

            <div v-else-if="isSmallWidth">
               <v-container class="max-width">
                  <v-pagination :length="pages" total-visible="1" class="my-4"/>
               </v-container>
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
      name: 'careGdPage',
      setup() {
         const { winwidth, isSmallWidth } = useWindowWidth();
         const selectPerPageNum = ref(10);
         const perPageNum = [10, 20, 30];     
         
         // 範例影片資料
         const videos = [
            { title: '衛教影片標題：如何保持健康的生活方式', views: 1234, thumbnail: 'article02.png' },
            { title: '影片標題2', views: 3, thumbnail: 'article02.png' },
            { title: '影片標題3', views: 5, thumbnail: 'article02.png' },
            { title: '影片標題4', views: 2, thumbnail: 'article02.png' },
            { title: '影片標題5', views: 6, thumbnail: 'article02.png' },
            { title: '影片標題6', views: 10, thumbnail: 'article02.png' },
            // 可以根據需求添加更多影片物件
         ];

         const perPage = ref(10);
         const data = ref([
            ['1', '1', '1', '1', '1'],
            ['2', '2', '2', '2', '2'],
            ['3', '3', '3', '3', '3']
         ]);

         //頁碼(後續調整)
         const datas = data.value.length;
         const pages = data.value.length * 3;
         let session = sessionStorage.getItem('session');

         return {
            winwidth,
            isSmallWidth,
            videos,
            session,
            data,
            datas,
            pages,
            perPage,
            perPageNum,
            selectPerPageNum,
         };
      },
   };
</script>

<style scoped src="../../assets/css/common.css"></style>
<style scoped src="../../assets/css/caregd.css"></style>