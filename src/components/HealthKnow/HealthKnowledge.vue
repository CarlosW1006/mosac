<template>
   <div class="page-tab flex-container" v-if="winwidth != true">
      <a href="#/index" class="tab-L">回到首頁</a> <p class="tab-R">首頁＞健康知能</p>
   </div>

   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12">
         <v-card>
            <v-list-item class="list-title list-title-know">
               <h3 class="page-title">健康知能</h3>
            </v-list-item>

            <v-list-item>
               <div class="search-frame">
                  <div class="dropdown">
                     <input type="string" id="steps" class="search-input top-select" placeholder="請輸入文章標題" />
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
            <!-- 查詢功能 -->
            <v-list-item class="list-title ">
               <div class="flex-container" style="justify-content: space-between;">
                  <h3 class="page-title">查詢結果</h3>
               </div>
            </v-list-item>

            <div class="flex-container pageTotal">
               <div class="perPage flex-container">
                  <v-select v-model="perPageDataAmount" :items="perPageNum" @update:modelValue="changePerPageNum" 
                  label="每頁筆數" outlined style="width: 130px;" />
               </div>
               <v-btn href="#/game" class="save-btn-healthklg " :ripple="false">動動腦九宮格</v-btn>
            </div>
            
            <!-- 文章區塊 -->
            <v-list-item :style="!winwidth ? 'padding: 4px 2px' : ''">
               <v-row :class="!winwidth ? 'article-grid' : ''">
                  <v-col v-for="(item, index) in HCVideosArr[curPageNum-1]" :key="index" cols="12" md="6" lg="4" class="article-item">
                     <v-card class="article-card">
                     <router-link class="router-link" :to="{ name: 'healthKnowledgeViewPage' }">
                        <div class="article-info">
                           <span class="article-title">{{ item.title }}</span>
                        </div>
                        <!-- <v-img :src="winwidth ? item.coverImageUrl : item.thumbnail" class="article-thumbnail" cover></v-img> -->
                        <v-img src="/article02.png" class="article-thumbnail" cover></v-img>
                     </router-link>
                     </v-card>
                  </v-col>
               </v-row>
            </v-list-item>

            <div class="flex-container page-container" v-if="winwidth == true">
               <h3 class="pageNum">顯示第 1 到 10 項結果，共 {{ curDataAmount }} 項</h3>
               <v-row justify="end">
                  <v-pagination :length="pagesAmount" total-visible="5" class="my-4"/>
               </v-row>
            </div>

            <div v-else-if="isSmallWidth">
               <v-container class="max-width">
                  <v-pagination :length="pagesAmount" total-visible="1" class="my-4"/>
               </v-container>
            </div>

            <div v-else>
               <v-container class="max-width">
                  <v-pagination :length="pagesAmount" class="my-4"/>
               </v-container>
            </div>
         </v-card>
      </v-col>
   </v-row>
</template>

<script>
   import { useWindowWidth } from '../JS/winwidth.js';
   import { askContentData } from '../../api/videos.js';
   import { ref } from 'vue';

   export default {
      name: 'HealthKnowledgePage',
      setup() {
         const currentPhase = sessionStorage.getItem('currentPhase');
         let session = sessionStorage.getItem('session');
         const { winwidth, isSmallWidth } = useWindowWidth();
         let HCVideosArr = ref([]);

         let curPageNum = ref(1); // 當前頁數
         let pagesAmount = ref(0); // 頁面總數
         let curDataAmount = ref(0); // 當前頁面資料
         let perPageDataAmount = ref(10); // 當前每頁筆數
         const perPageNum = [10, 20, 30]; // 每頁資料筆數

         // 抓取健康知能資料、頁數 pagesAmount、當前頁面的資料數量 curDataAmount
         askContentData(currentPhase, 1, perPageDataAmount.value).then((result) => { 
            HCVideosArr.value = result.paginatedData;
            pagesAmount.value = HCVideosArr.value ? HCVideosArr.value.length : 0; // 設置載入緩衝
            curDataAmount.value = HCVideosArr.value ? HCVideosArr.value[curPageNum.value].length : 0; // 設置載入緩衝
         });

         function changePerPageNum() {
            askContentData(currentPhase, 1, perPageDataAmount.value).then((result) => { 
               HCVideosArr.value = result.paginatedData;
               pagesAmount.value = HCVideosArr.value ? HCVideosArr.value.length : 0; // 設置載入緩衝
               curDataAmount.value = HCVideosArr.value ? HCVideosArr.value[curPageNum.value].length : 0; // 設置載入緩衝
            });
         }

         return {
            winwidth,
            isSmallWidth,
            session,
            perPageNum,
            curPageNum,
            pagesAmount,
            HCVideosArr,
            curDataAmount,
            perPageDataAmount,

            // Function
            changePerPageNum,
         };
      },
   };
</script>

<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/healthklg.css";

</style>
