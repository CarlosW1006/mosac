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
                     <select v-model="selectedPhase" id="category" name="category" class="top-select">
                        <option value="">階段類別</option>
                        <option value="0">意圖前期</option>
                        <option value="1">意圖期</option>
                        <option value="2">準備期</option>
                        <option value="3">行動期</option>
                        <option value="4">維持期</option>
                     </select>
                     <input 
                        type="string" 
                        v-model="searchTitle" 
                        class="search-input-klg" 
                        placeholder="請輸入標題"
                     />
                     <input 
                        type="string" 
                        v-model="searchContent" 
                        class="search-input-klg" 
                        placeholder="請輸入內文"
                     />
                     <button class="search-btn" @click="handleSearch">搜尋</button>
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
               <div class="flex-container" style="justify-content: space-between;">
                  <h3 class="page-title">查詢結果</h3>
               </div>
            </v-list-item>

            <div class="flex-container pageTotal">
               <div class="perPage flex-container">
                  <v-select v-model="perPageDataAmount" :items="perPageNum" @update:modelValue="changePerPageNum" 
                  label="每頁筆數" outlined style="width: 130px;" />
               </div>
            </div>
            
            <!-- 影片網格區塊 -->
            <v-list-item :style="!winwidth ? 'padding: 4px 2px' : ''">
               <v-row :class="!winwidth ? 'video-grid' : ''">
                  <v-col v-for="(video, index) in videosArr[curPageNum-1]" :key="index" 
                  cols="12" md="6" lg="4" class="video-item">
                     <v-card class="video-card">
                        <router-link class="router-link" :to="{ name: 'careGdViewPage', query: { id: video.id }}">
                           <v-img :src="video.coverImageUrl" class="video-thumbnail" cover>
                              <v-icon class="play-icon">mdi-play-circle</v-icon>
                           </v-img>
                           <div class="video-info-card">
                              <div class="left-section">
                                 <v-icon v-if="video.isWatched" class="complete-icon">mdi-check-bold</v-icon>
                                 <span class="video-title">{{ video.title }}</span>
                              </div>
                              <span class="view-count">觀看次數：{{ video.viewCount }}</span>
                           </div>
                        </router-link>
                     </v-card>
                  </v-col>
               </v-row>
            </v-list-item>

            <div class="flex-container page-container" v-if="winwidth == true">
               <h3 class="pageNum">顯示第 {{ startItem }} 到 {{ endItem }} 項結果，共 {{ totalItems }} 項</h3>
               <v-row justify="end">
                  <v-pagination 
                     v-model="curPageNum"
                     :length="pagesAmount" 
                     total-visible="5" 
                     class="my-4"
                     @update:modelValue="handlePageChange"
                  />
               </v-row>
            </div>

            <div v-else-if="isSmallWidth">
               <v-container class="max-width">
                  <v-pagination 
                     v-model="curPageNum"
                     :length="pagesAmount" 
                     total-visible="1" 
                     class="my-4"
                     @update:modelValue="handlePageChange"
                  />
               </v-container>
            </div>

            <div v-else>
               <v-container class="max-width">
                  <v-pagination 
                     v-model="curPageNum"
                     :length="pagesAmount" 
                     class="my-4"
                     @update:modelValue="handlePageChange"
                  />
               </v-container>
            </div>
         </v-card>
      </v-col>
   </v-row>
</template>

<script>
import { useWindowWidth } from '../JS/winwidth.js';
import { askContentData } from '../../api/videos.js';
import { ref, computed } from 'vue';

export default {
   name: 'CareGardenMainPage',
   setup() {
      const currentPhase = sessionStorage.getItem('currentPhase');
      let session = sessionStorage.getItem('session');
      const { winwidth, isSmallWidth } = useWindowWidth();
      
      // 搜尋相關的響應式變數
      const searchTitle = ref('');
      const searchContent = ref('');
      const selectedPhase = ref('');
      const originalData = ref([]);
      let videosArr = ref([]);
      const filteredTotal = ref(0);

      let curPageNum = ref(1);
      let pagesAmount = ref(0);
      let perPageDataAmount = ref(10);
      const perPageNum = [10, 20, 30];

      // 計算分頁顯示相關的數值
      const totalItems = computed(() => {
         return filteredTotal.value;
      });

      const startItem = computed(() => {
         return ((curPageNum.value - 1) * perPageDataAmount.value) + 1;
      });

      const endItem = computed(() => {
         const end = curPageNum.value * perPageDataAmount.value;
         return Math.min(end, totalItems.value);
      });

      // 初始資料獲取
      const fetchData = async () => {
         try {
            const result = await askContentData(currentPhase, 1, perPageDataAmount.value);
            originalData.value = result.paginatedData.flat();
            filteredTotal.value = originalData.value.length;
            handleSearch();
         } catch (error) {
            console.error('獲取資料時發生錯誤:', error);
         }
      };

      // 搜尋功能
      const handleSearch = () => {
         const filteredData = originalData.value.filter(item => {
            const matchesTitle = searchTitle.value ? 
               item.title.toLowerCase().includes(searchTitle.value.toLowerCase()) : true;
            const matchesContent = searchContent.value ? 
               item.content.toLowerCase().includes(searchContent.value.toLowerCase()) : true;
            const matchesPhase = selectedPhase.value ? 
               item.phaseCategories.includes(Number(selectedPhase.value)) : true;
            
            return matchesTitle && matchesContent && matchesPhase;
         });

         filteredTotal.value = filteredData.length;

         const paginatedResults = [];
         for (let i = 0; i < filteredData.length; i += perPageDataAmount.value) {
            paginatedResults.push(filteredData.slice(i, i + perPageDataAmount.value));
         }

         videosArr.value = paginatedResults;
         pagesAmount.value = paginatedResults.length;
         curPageNum.value = 1;
      };

      // 處理換頁
      const handlePageChange = (newPage) => {
         curPageNum.value = newPage;
      };

      // 處理每頁筆數變更
      const changePerPageNum = () => {
         handleSearch();
      };

      // 獲取初始資料
      fetchData();

      return {
         winwidth,
         isSmallWidth,
         session,
         perPageNum,
         curPageNum,
         pagesAmount,
         videosArr,
         perPageDataAmount,
         searchTitle,
         searchContent,
         selectedPhase,
         handleSearch,
         changePerPageNum,
         handlePageChange,
         totalItems,
         startItem,
         endItem,
      };
   },
};
</script>

<style scoped src="../../assets/css/common.css"></style>
<style scoped src="../../assets/css/caregd.css"></style>