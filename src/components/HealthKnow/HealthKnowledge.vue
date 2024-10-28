<template> 
   <v-row style="margin: 1% 1% 50px;">
      <v-col cols="12">
         <v-card style="width: 100%;">
            <v-list-item class="list-title ">
               <div class="flex-container" style="justify-content: space-between;">
                  <h3 class="page-title">健康知能</h3>
                  <router-link to="/game">
                     <v-btn class="play-btn">動動腦九宮格</v-btn>
                  </router-link>
               </div>
            </v-list-item>

            <v-list-item>
               <div class="search-frame-healthklg">
                  <input type="string" id="steps" class="search-input" placeholder="請輸入文章標題、日期" />
                  <button class="search-btn">搜尋</button>
               </div>
            </v-list-item>
            <!-- 文章網格區塊(大視窗) -->
            <div v-if="winwidth == true"> 
            <v-list-item>
               <v-row class="article-grid">
                  <v-col 
                     v-for="(article, index) in articles" 
                     :key="index" 
                     cols="12" 
                     md="6" 
                     lg="4" 
                     class="article-item"
                  >
                     <v-card class="article-card">
                     <router-link class="router-link" :to="{ name: 'healthKnowledgeViewPage'}">
                        <div class="article-info">
                        <span class="article-title">{{ article.title }}</span> 
                        </div>
                        <v-img :src="article.thumbnail" class="article-thumbnail" cover></v-img>                    
                     </router-link>
                     </v-card>
                  </v-col>
               </v-row>
            </v-list-item>
            </div>

            <!-- 文章網格區塊(小視窗) -->
            <div v-else> 
            <v-list-item style="padding: 4px 2px">
               <v-row class="article-grid">
                  <v-col 
                     v-for="(article, index) in articles" 
                     :key="index" 
                     cols="12" 
                     md="6" 
                     lg="4" 
                     class="article-item"
                  >
                     <v-card class="article-card">
                     <router-link class="router-link" :to="{ name: 'healthKnowledgeViewPage'}">
                        <div class="article-info">
                        <span class="article-title">{{ article.title }}</span> 
                        </div>
                        <v-img :src="article.thumbnail" class="article-thumbnail" cover></v-img>                    
                     </router-link>
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
      name: 'HealthKnowledgePage',
      setup() {
         const { winwidth } = useWindowWidth();     
         
         // 範例影片資料
         const articles = [
            { title: '多吃蔬食有助減重？吃對更重要！', thumbnail: 'article01.png' },
            { title: '衛教文章2', thumbnail: 'article01.png' },
            { title: '衛教文章3', thumbnail: 'article01.png' },
            { title: '衛教文章4', thumbnail: 'article01.png' },
            { title: '衛教文章5', thumbnail: 'article01.png' },
            { title: '衛教文章6', thumbnail: 'article01.png' },
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
            articles,
            session,
            data,
            datas,
            pages,
            perPage,
         };
      },
   };
</script>

<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/healthklg.css";

</style>
