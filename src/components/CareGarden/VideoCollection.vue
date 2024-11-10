<template> 
   <v-row style="margin: 1% 1% 50px;">
      <v-col cols="12">
         <v-card style="width: 100%;">
            <v-list-item class="list-title">
               <h3 class="page-title">影音收藏</h3>
            </v-list-item>

            <v-list-item>
               <div class="search-frame-care">
                  <div> 
                     <input type="string" id="steps" class="search-input" placeholder="請輸入影片標題、日期" />
                     <button class="search-btn" style="width: 70px;">搜尋</button>
                  </div>
               </div>
            </v-list-item>
            <!-- 影片網格區塊(大視窗) -->
            <div v-if="winwidth == true"> 
            <v-list-item>
               <v-row class="video-grid">
                  <v-col v-for="(video, index) in videos" :key="index" 
                  cols="12" md="6" lg="4" class="video-item">
                     <v-card class="video-card">
                     <router-link class="router-link" :to="{ name: 'careGdViewPage'}">
                        <v-img :src="video.thumbnail" class="video-thumbnail" cover>
                           <v-icon class="play-icon">mdi-play-circle</v-icon>
                        </v-img>
                     </router-link>
                        <div class="video-info">
                           <span class="video-title">{{ video.title }}</span>
                           <button @click="toggleFavorite" class="favorite-icon">{{ isFavorite ? '❤️' : '🤍' }}</button>
                        </div>
                     </v-card>
                  </v-col>
               </v-row>
            </v-list-item>
         </div>

         <!-- 影片網格區塊(小視窗) -->
         <div v-else>
            <v-list-item style="padding: 4px 2px">
               <v-row class="video-grid">
                  <v-col v-for="(video, index) in videos" :key="index" 
                  cols="12" md="6" lg="4" class="video-item">
                     <v-card class="video-card">
                     <router-link class="router-link" :to="{ name: 'careGdViewPage'}">
                        <v-img :src="video.thumbnail" class="video-thumbnail" cover>
                           <v-icon class="play-icon">mdi-play-circle</v-icon>
                        </v-img>
                     </router-link>   
                        <div class="video-info">
                           <span class="video-title">{{ video.title }}</span>
                           <button @click="toggleFavorite" class="favorite-icon">{{ isFavorite ? '❤️' : '🤍' }}</button>
                        </div>
                     </v-card>
                  </v-col>
               </v-row>
            </v-list-item>
         </div>

         <div class="flex-container page-container" v-if="winwidth == true">
            <v-row justify="center">
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
      name: 'videoclnPage',
      setup() {
         const { winwidth } = useWindowWidth();   
         
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

         const isFavorite = ref(true); // 收藏狀態

         // 切換收藏狀態
         const toggleFavorite = () => {
         isFavorite.value = !isFavorite.value;
         };

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
            videos,
            isFavorite,
            toggleFavorite,
            session,
            data,
            datas,
            pages,
            perPage,
         };
      },
   };
</script>

<style scoped src="../../assets/css/common.css"></style>
<style scoped src="../../assets/css/videocln.css"></style>