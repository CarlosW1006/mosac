<template>
   <div class="page-tab flex-container" v-if="winwidth != true">
      <a href="#/index" class="tab-L">回到首頁</a> <p class="tab-R">首頁＞影音收藏</p>
   </div>

   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12">
         <v-card>
            <v-list-item class="list-title list-title-care">
               <h3 class="page-title">影音收藏</h3>
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

            <!-- 分類標籤 -->
            <v-list-item>
               <div>
                  <div class="category-tabs">
                     <button 
                        v-for="tab in tabs" 
                        :key="tab.value"
                        :class="['category-tab', { active: currentTab === tab.value }]"
                        @click="currentTab = tab.value"
                     >
                        {{ tab.label }}
                     </button>
                  </div>
               </div>
            </v-list-item>
            
            <!-- 內容區塊 -->
            <v-list-item :style="!winwidth ? 'padding: 4px 2px' : ''">
               <v-row :class="!winwidth ? 'video-grid' : ''">
                  <v-col v-for="(item, index) in paginatedItems" :key="index" 
                  cols="12" md="6" lg="4" class="video-item">
                     <v-card class="video-card">
                        <router-link class="router-link" :to="{ name: 'careGdViewPage', query: { id: item.id }}">
                           <v-img :src="item.thumbnail" class="video-thumbnail" cover>
                              <v-icon v-if="item.categories.includes(1)" class="play-icon">mdi-play-circle</v-icon>
                           </v-img>
                        </router-link>   
                        <div class="video-info">
                           <span class="video-title">{{ item.title }}</span>
                           <button @click="() => toggleFavorite(getOriginalIndex(index))" class="favorite-icon">
                              {{ item.isFavorite ? '❤️' : '🤍' }}
                           </button>
                        </div>
                     </v-card>
                  </v-col>
               </v-row>
            </v-list-item>

            <!-- 無內容顯示 -->
            <div v-if="filteredItems.length === 0" class="no-content">
               <p>目前沒有收藏的{{ getTabLabel }}</p>
            </div>

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
import { ref, computed, watch } from 'vue';

export default {
   name: 'VideoCollectionPage',
   setup() {
      const currentPhase = sessionStorage.getItem('currentPhase');
      let session = sessionStorage.getItem('session');
      const { winwidth, isSmallWidth } = useWindowWidth();
      
      // 分類標籤
      const tabs = [
         { label: '全部', value: 'all' },
         { label: '文章', value: '0' },
         { label: '影片', value: '1' }
      ];
      const currentTab = ref('all');
      
      // 搜尋相關的響應式變數
      const searchTitle = ref('');
      const searchContent = ref('');
      const selectedPhase = ref('');
      const originalData = ref([]);
      const filteredTotal = ref(0);

      let curPageNum = ref(1);
      let pagesAmount = ref(0);
      let perPageDataAmount = ref(10);
      const perPageNum = [10, 20, 30];

      // 過濾後的項目
      const filteredItems = computed(() => {
         return originalData.value.filter(item => {
            const matchesTitle = searchTitle.value ? 
               item.title.toLowerCase().includes(searchTitle.value.toLowerCase()) : true;
            const matchesContent = searchContent.value ? 
               item.content.toLowerCase().includes(searchContent.value.toLowerCase()) : true;
            const matchesPhase = selectedPhase.value ? 
               item.phaseCategories.includes(Number(selectedPhase.value)) : true;
            const matchesType = currentTab.value === 'all' ? true : 
            item.categories.includes(Number(currentTab.value));
            
            return matchesTitle && matchesContent && matchesPhase && matchesType;
         });
      });

      // 分頁後的項目
      const paginatedItems = computed(() => {
         const start = (curPageNum.value - 1) * perPageDataAmount.value;
         const end = start + perPageDataAmount.value;
         return filteredItems.value.slice(start, end);
      });

      // 監聽 filteredItems 的變化來更新 filteredTotal
      watch(filteredItems, (newValue) => {
         filteredTotal.value = newValue.length;
         updatePagination();
      });

      // 計算分頁相關數值
      const totalItems = computed(() => filteredTotal.value);
      
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
            // filteredTotal 會通過 watch 自動更新
         } catch (error) {
            console.error('獲取資料時發生錯誤:', error);
         }
      };

      // 處理搜尋
      const handleSearch = () => {
         curPageNum.value = 1;
      };

      // 更新分頁
      const updatePagination = () => {
         pagesAmount.value = Math.ceil(filteredItems.value.length / perPageDataAmount.value);
      };

      // 處理換頁
      const handlePageChange = (newPage) => {
         curPageNum.value = newPage;
      };

      // 處理每頁筆數變更
      const changePerPageNum = () => {
         curPageNum.value = 1;
         updatePagination();
      };

      // 獲取當前分類標籤文字
      const getTabLabel = computed(() => {
         const tab = tabs.find(t => t.value === currentTab.value);
         return tab ? tab.label : '內容';
      });

      // 切換收藏狀態
      const toggleFavorite = (index) => {
         if (originalData.value[index]) {
            originalData.value[index].isFavorite = !originalData.value[index].isFavorite;
         }
      };

      // 獲取原始索引
      const getOriginalIndex = (paginatedIndex) => {
         return (curPageNum.value - 1) * perPageDataAmount.value + paginatedIndex;
      };

      // 獲取初始資料
      fetchData();

      return {
         winwidth,
         isSmallWidth,
         session,
         tabs,
         currentTab,
         perPageNum,
         curPageNum,
         pagesAmount,
         perPageDataAmount,
         searchTitle,
         searchContent,
         selectedPhase,
         paginatedItems,
         filteredItems,
         handleSearch,
         changePerPageNum,
         handlePageChange,
         getTabLabel,
         toggleFavorite,
         getOriginalIndex,
         totalItems,
         startItem,
         endItem,
      };
   },
};
</script>

<style lang="css" scoped>
@import "../../assets/css/common.css";
@import "../../assets/css/videocln.css";
</style>