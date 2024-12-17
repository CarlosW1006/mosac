<template> 
   <div class="page-tab flex-container">
      <a href="#/careGarden" class="tab-L">回到照護園地</a><p class="tab-R">照護園地＞衛教影片</p>
   </div>
   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12" sm="12" xl="12" md="8" lg="8">
         <v-card>
            <v-list-item>
               <!-- 嵌入的影片 -->
               <div class="video-container">
                  <iframe 
                     :src="videoData.videoUrl" 
                     frameborder="0" 
                     allowfullscreen 
                     class="youtube-embed"
                  >
                  </iframe>
               </div>
            </v-list-item>
            <v-list-item>
               <div class="video-info">
                  <h2 class="video-view-title">{{ videoData.title }}</h2>
                  <button @click="toggleFavorite" class="favorite-icon">收藏 {{ isFavorite ? '❤️' : '🤍' }}</button>
               </div>
            </v-list-item>
         
            <v-list-item>
               <div class="video-stats">
                  <span class="view-count">觀看次數：{{ videoData.viewCount }}</span>
                  <span class="upload-date">上傳日期：{{ formatDate(videoData.createAt) }}</span>
               </div>
            </v-list-item>

            <v-list-item>
               <div class="video-description">
                  <p>{{ videoData.content }}</p>
               </div>
            </v-list-item>
         </v-card>
      </v-col>

      <!-- 推薦影片區 -->
      <v-col cols="12" sm="12" xl="12" md="4" lg="4">
         <v-card class="recommendation-card" v-for="video in recommendedVideos" :key="video.id">
            <v-list-item>
               <router-link class="router-link" 
                  :to="{ name: 'careGdViewPage', query: { id: video.id }}"
               >
                  <div class="recommendation-item">
                     <div class="thumbnail-r">
                        <img :src="video.coverImageUrl" alt="Video Thumbnail" class="video-thumbnail-r" />
                        <v-icon class="play-icon">mdi-play-circle</v-icon>
                     </div>
                     <div class="video-details-r">
                        <h3 class="video-title-r">{{ video.title }}</h3>
                        <span class="view-count-r">觀看次數：{{ video.viewCount }}</span>
                        <span class="upload-date-r">{{ formatDate(video.createAt) }}</span>
                        <v-icon v-if="video.isWatched" class="complete-icon-r">mdi-check-bold</v-icon>
                     </div>
                  </div>
               </router-link>
            </v-list-item>
         </v-card>
      </v-col>
   </v-row>
</template>

<script>
import { useWindowWidth } from '../JS/winwidth.js';
import { askContentData } from '../../api/videos.js';
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

export default {
   name: 'CareGardenViewPage',
   setup() {
      const { winwidth } = useWindowWidth();
      const route = useRoute();
      const videoData = ref({
         id: '',
         title: '',
         content: '',
         videoUrl: '',
         coverImageUrl: '',
         viewCount: 0,
         createAt: '',
         isWatched: false
      });
      const recommendedVideos = ref([]);

      const isFavorite = ref(false); // 收藏狀態

      // 切換收藏狀態
      const toggleFavorite = () => {
         isFavorite.value = !isFavorite.value;
      };

      // 格式化日期
      const formatDate = (dateString) => {
         const date = new Date(dateString);
         return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      };

      // 獲取影片數據
      const fetchVideoData = async () => {
         const currentPhase = sessionStorage.getItem('currentPhase');
         try {
            const result = await askContentData(currentPhase, 1, 100);
            const allVideos = result.paginatedData.flat();
            
            // 找到當前影片
            const currentVideo = allVideos.find(video => video.id === route.query.id);
            if (currentVideo) {
               videoData.value = currentVideo;
               
               // 過濾推薦影片（排除當前影片並最多顯示6個）
               recommendedVideos.value = allVideos
                  .filter(video => video.id !== currentVideo.id)
                  .slice(0, 6);
            }
         } catch (error) {
            console.error('獲取影片資料時發生錯誤:', error);
         }
      };

      // 監聽路由變化，重新獲取數據
      watch(() => route.query.id, () => {
         fetchVideoData();
      });

      onMounted(() => {
         fetchVideoData();
      });

      return {
         winwidth,
         videoData,
         recommendedVideos,
         isFavorite,
         toggleFavorite,
         formatDate
      };
   },
};
</script>

<style lang="css" scoped>
@import "../../assets/css/common.css";
@import "../../assets/css/caregd.css";
</style>