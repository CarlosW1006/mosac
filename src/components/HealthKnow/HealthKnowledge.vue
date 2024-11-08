<template>
   <div class="page-tab flex-container">
      <a href="#/index" class="tab-L">回到首頁</a> <p class="tab-R">首頁＞健康知能</p>
   </div>

   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12">
         <v-card style="width: 100%;">
            <v-list-item class="list-title list-title-care">
               <h3 class="page-title">健康知能</h3>
            </v-list-item>

            <v-list-item>
               <div class="search-frame">
                  <div class="dropdown">
                     <input type="string" id="steps" class="search-input" placeholder="請輸入文章標題" />
                     <button class="search-btn" style="width: 70px;">搜尋</button>
                  </div>
               </div>
            </v-list-item>
         </v-card>
      </v-col>
   </v-row>
     
  <v-row style="margin: 1% 1% 50px;">
     <v-col cols="12">
        <v-card style="width: 100%;">
           <v-list-item class="list-title ">
              <div class="flex-container" style="justify-content: space-between;">
                 <h3 class="page-title">健康知能</h3>
              </div>
           </v-list-item>

           <div class="flex-container pageTotal">
               <div class="perPage flex-container">
                  <v-select :items="perPageNum" label="每頁筆數" outlined :width="130"/>  
               </div>
               <v-btn href="#/game" class="save-btn-healthklg " :ripple="false">動動腦九宮格</v-btn>
           </div>
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
        const perPageNum = [10, 20, 30];  
        
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
           perPageNum
        };
     },
  };
</script>

<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/healthklg.css";

</style>
