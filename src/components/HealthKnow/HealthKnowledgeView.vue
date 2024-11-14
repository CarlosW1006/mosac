<template> 
   <div class="page-tab flex-container">
      <a href="#/healthKnowledge" class="tab-L">回到健康知能</a><p class="tab-R">健康知能＞衛教文章</p>
   </div>
   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12" sm="12" xl="12" md="8" lg="8">
         <v-card style="width: 100%; padding-bottom: 1em;">
            <v-list-item>
               <div class="article-info">
                  <h2 class="article-view-title">{{ articleTitle }}</h2>
               </div>
            </v-list-item>

            <!-- 圖片輪播區塊 -->
            <v-list-item>
               <v-carousel show-arrows-on-hover >
               <v-carousel-item
                  v-for="(image, index) in images"
                  :key="index"
                  :src="image"
               ></v-carousel-item>
               </v-carousel>
            </v-list-item>

            <v-list-item>
               <div class="article-stats">
                  <span class="upload-date">上傳日期：{{ uploadDate }}</span>
                  <span class="upload-name">上傳者：{{ uploader }}</span>
               </div>
            </v-list-item>

            <v-list-item>
               <div class="article-subtitle">
                  <p>{{ subtitle }}</p>
               </div>
               <div class="article-description">
                  <p>{{ description }}</p>
               </div>
            </v-list-item>

            <!-- 嵌入的 YouTube 影片 -->
            <v-list-item>
               <div class="video-container">
                  <iframe 
                     :src="videoUrl" 
                  frameborder="0" 
                  allowfullscreen 
                  class="youtube-embed">
                  </iframe>
               </div>
            </v-list-item>
         </v-card>
      </v-col>
      <!-- 推薦文章區 -->
      <v-col cols="12" sm="12" xl="12" md="4" lg="4">
         <v-card class="recommendation-card" v-for="article in recommendedArticles" :key="article.id">
         <v-list-item style="padding: 0 0 0 5px;">
            <div class="recommendation-item">
               <div class="thumbnail-r">
               <img :src="article.thumbnail" alt="Article Thumbnail" class="article-thumbnail-r" />
               </div>
               <div class="article-details-r">
               <h3 class="article-title-r">{{ article.title }}</h3>
               <span class="article-uploader-r">上傳者：{{ article.uploader }}</span>
               <span class="upload-date-r">{{ article.uploadDate }}</span>
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
      name: 'healthKnowledgeViewPage',
      setup() {
         const { winwidth } = useWindowWidth();     
      
         // 文章資料
         const articleTitle = ref('多吃蔬食有助減重？吃對更重要！');
         //const videoUrl = ref('https://www.youtube.com/embed/VIDEO_ID'); // 替換為實際的 YouTube 影片 ID
         const videoUrl = ref('https://www.youtube.com/embed/1qb4p3xxDwg?si=auL4AGzE8iLpJ6qu');
         const uploader = ref('陳ＯＯ醫師');
         const uploadDate = ref('2024-10-27');
         const subtitle = ref('減重是一種良好習慣的養成');
         const description = ref(`在這段影片中，我們將介紹一些保持健康生活方式的重要技巧和建議。我們會探討均衡飲食的關鍵，包含如何選擇營養豐富的食物，以及每日所需的各類營養素。此外，我們還將討論運動對身體和心理健康的益處，並分享一些簡單易行的運動建議，讓您可以在繁忙的日常生活中輕鬆融入運動。
            除了飲食和運動，我們還會深入了解睡眠的重要性，如何建立良好的睡眠習慣，以促進身心的恢復與健康。我們的專家將提供一些有用的提示，幫助您管理壓力，保持積極的心態，讓生活更加充實。
            希望這段影片能夠啟發您，並促進您對健康生活的思考。請與我們一起學習，為自己和家人的健康加分！`); // 影片簡介
         const isFavorite = ref(false); // 收藏狀態

         // 圖片輪播資料
         const images = ref([
            'article01.png',
            'article02.png',
            'cat03.png', 
            // 可依需求添加更多圖片
         ]);

         // 切換收藏狀態
         const toggleFavorite = () => {
            isFavorite.value = !isFavorite.value;
         };

         // 推薦影片資料
         const recommendedArticles= ref([
            { title: '如何提升睡眠品質', uploader: '陳ＯＯ醫師', uploadDate: '2024-09-15', thumbnail: 'article02.png' },
            { title: '運動與健康益處', uploader: '陳ＯＯ醫師', uploadDate: '2024-08-30', thumbnail: 'article01.png' },
            { title: '均衡飲食的重要性', uploader: '陳ＯＯ醫師', uploadDate: '2024-07-20', thumbnail: 'article02.png' },
            { title: '如何提升睡眠品質', uploader: '陳ＯＯ醫師', uploadDate: '2024-09-15', thumbnail: 'article01.png' },
            { title: '運動與健康益處', uploader: '陳ＯＯ醫師', uploadDate: '2024-08-30', thumbnail: 'article02.png' },
            { title: '均衡飲食的重要性', uploader: '陳ＯＯ醫師', uploadDate: '2024-07-20', thumbnail: 'article01.png' },
            { title: '如何提升睡眠品質', uploader: '陳ＯＯ醫師', uploadDate: '2024-09-15', thumbnail: 'article02.png' },
            { title: '運動與健康益處', uploader: '陳ＯＯ醫師', uploadDate: '2024-08-30', thumbnail: 'article01.png' },
            { title: '均衡飲食的重要性', uploader: '陳ＯＯ醫師', uploadDate: '2024-07-20', thumbnail: 'article02.png' },
            { title: '如何提升睡眠品質', uploader: '陳ＯＯ醫師', uploadDate: '2024-09-15', thumbnail: 'article01.png' }
         ]);
         
         return {
            winwidth,
            articleTitle,
            videoUrl,
            uploader,
            uploadDate,
            subtitle,
            description,
            isFavorite,
            images,
            toggleFavorite,
            recommendedArticles
         };
      },
   };
</script>

<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/healthklg.css";
</style>
