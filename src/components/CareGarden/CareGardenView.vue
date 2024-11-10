<template> 
   <div class="page-tab flex-container">
      <a href="#/careGarden" class="tab-L">回到照護園地</a><p class="tab-R">照護園地＞衛教影片</p>
   </div>
   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12" sm="12" xl="12" md="8" lg="8">
         <v-card>
            <v-list-item>
               <!-- 嵌入的 YouTube 影片 -->
               <div class="video-container">
               <iframe 
                     :src="videoUrl" 
                  frameborder="0" 
                  allowfullscreen 
                  class="youtube-embed">
               </iframe>
               </div>
            </v-list-item>
            <v-list-item>
               <div class="video-info">
                  <h2 class="video-view-title">{{ videoTitle }}</h2>
                  <button @click="toggleFavorite" class="favorite-icon">{{ isFavorite ? '❤️' : '🤍' }}</button>
               </div>
            </v-list-item>
         
            <v-list-item>
               <div class="video-stats">
                  <span class="view-count">觀看次數：{{ views }}</span>
                  <span class="upload-date">上傳日期：{{ uploadDate }}</span>
               </div>
            </v-list-item>

            <v-list-item>
               <div class="video-description">
                  <p>{{ description }}</p>
               </div>
            </v-list-item>
         </v-card>
      </v-col>

      <!-- 推薦影片區 -->
      <v-col cols="12" sm="12" xl="12" md="4" lg="4">
         <v-card class="recommendation-card" v-for="video in recommendedVideos" :key="video.id">
            <v-list-item>
               <div class="recommendation-item">
                  <div class="thumbnail-r">
                  <img :src="video.thumbnail" alt="Video Thumbnail" class="video-thumbnail-r" />
                  </div>
                  <div class="video-details-r">
                     <h3 class="video-title-r">{{ video.title }}</h3>
                     <span class="view-count-r">觀看次數：{{ video.views }}</span>
                     <span class="upload-date-r">{{ video.uploadDate }}</span>
                  </div>
               </div>
            </v-list-item>
         </v-card>
      </v-col>
   </v-row>
</template>

<script>
   import { useWindowWidth } from '../JS/winwidth.js';
   import { ref } from 'vue';

   export default {
      name: 'careGdViewPage',
      setup() {
         const { winwidth } = useWindowWidth();     
      
         // 影片資料
         const videoTitle = ref('衛教影片標題：如何保持健康的生活方式'); // 影片標題
         //const videoUrl = ref('https://www.youtube.com/embed/VIDEO_ID'); // 替換為實際的 YouTube 影片 ID
         const videoUrl = ref('https://www.youtube.com/embed/XavzHsjWIAg?si=0MYLs8S7JNWEV7SD');
         const views = ref(1234); // 觀看次數
         const uploadDate = ref('2024-10-27'); // 上傳日期
         const description = ref(`在這段影片中，我們將介紹一些保持健康生活方式的重要技巧和建議。我們會探討均衡飲食的關鍵，包含如何選擇營養豐富的食物，以及每日所需的各類營養素。此外，我們還將討論運動對身體和心理健康的益處，並分享一些簡單易行的運動建議，讓您可以在繁忙的日常生活中輕鬆融入運動。
         除了飲食和運動，我們還會深入了解睡眠的重要性，如何建立良好的睡眠習慣，以促進身心的恢復與健康。我們的專家將提供一些有用的提示，幫助您管理壓力，保持積極的心態，讓生活更加充實。
         希望這段影片能夠啟發您，並促進您對健康生活的思考。請與我們一起學習，為自己和家人的健康加分！`); // 影片簡介
         const isFavorite = ref(false); // 收藏狀態

         // 切換收藏狀態
         const toggleFavorite = () => {
         isFavorite.value = !isFavorite.value;
         };

         // 推薦影片資料
         const recommendedVideos = ref([
            { title: '如何提升睡眠品質', views: '2500', uploadDate: '2024-09-15', thumbnail: 'article02.png' },
            { title: '運動與健康益處', views: '1800', uploadDate: '2024-08-30', thumbnail: 'article01.png' },
            { title: '均衡飲食的重要性', views: '3200', uploadDate: '2024-07-20', thumbnail: 'article02.png' },
            { title: '如何提升睡眠品質', views: '2500', uploadDate: '2024-09-15', thumbnail: 'article01.png' },
            { title: '運動與健康益處', views: '1800', uploadDate: '2024-08-30', thumbnail: 'article02.png' },
            { title: '均衡飲食的重要性', views: '3200', uploadDate: '2024-07-20', thumbnail: 'article01.png' }
         ]);
         
         return {
            winwidth,
            videoTitle,
            videoUrl,
            views,
            uploadDate,
            description,
            isFavorite,
            toggleFavorite,
            recommendedVideos
         };
      },
   };
</script>

<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/caregd.css";

</style>
