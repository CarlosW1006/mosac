<template>
   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12">
         <v-card>
            <v-list-item class="list-title list-title-care">
               <h3 class="page-title">影音收藏</h3>
            </v-list-item>

            <v-list-item>
               <div class="search-frame">
                  <div class="dropdown">
                     <input type="string" id="steps" class="search-input top-select v" placeholder="請輸入文章、影片標題" />
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

            <v-list-item>
               <div >
                  <!-- 分類切換按鈕 -->
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

            <!-- 影片網格區塊(大視窗) -->
            <div v-if="winwidth && filteredItems.length > 0"> 
               <v-list-item>
                  <v-row>
                     <v-col v-for="(item, index) in filteredItems" :key="index" 
                     cols="12" md="6" lg="4" class="video-item">
                        <v-card class="video-card">
                           <router-link class="router-link" :to="{ name: 'careGdViewPage'}">
                              <v-img :src="item.thumbnail" class="video-thumbnail" cover>
                                 <v-icon v-if="item.type === 'video'" class="play-icon">mdi-play-circle</v-icon>
                              </v-img>
                           </router-link>
                           <div class="video-info">
                              <span class="video-title">{{ item.title }}</span>
                              <button @click="() => toggleFavorite(index)" class="favorite-icon">
                                 {{ items[index].isFavorite ? '❤️' : '🤍' }}
                              </button>
                           </div>
                        </v-card>
                     </v-col>
                  </v-row>
               </v-list-item>
            </div>

            <!-- 影片網格區塊(小視窗) -->
            <div v-else-if="filteredItems.length > 0">
               <v-list-item style="padding: 4px 2px">
                  <v-row class="video-grid">
                     <v-col v-for="(item, index) in filteredItems" :key="index" 
                     cols="12" md="6" lg="4" class="video-item">
                        <v-card class="video-card">
                           <router-link class="router-link" :to="{ name: 'careGdViewPage'}">
                              <v-img :src="item.thumbnail" class="video-thumbnail" cover>
                                 <v-icon v-if="item.type === 'video'" class="play-icon">mdi-play-circle</v-icon>
                              </v-img>
                           </router-link>   
                           <div class="video-info">
                              <span class="video-title">{{ item.title }}</span>
                              <button @click="() => toggleFavorite(index)" class="favorite-icon">
                                 {{ items[index].isFavorite ? '❤️' : '🤍' }}
                              </button>
                           </div>
                        </v-card>
                     </v-col>
                  </v-row>
               </v-list-item>
            </div>

            <!-- 無內容顯示 -->
            <div v-else class="no-content">
               <p>目前沒有收藏的{{ getTabLabel }}</p>
            </div>

            <div class="flex-container page-container" v-if="winwidth == true">
               <h3 class="pageNum">顯示第 1 到 10 項結果，共 {{ datas }} 項</h3>
               <v-row justify="end">
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
import { ref, computed } from 'vue';

export default {
   name: 'videoclnPage',
   setup() {
      const { winwidth } = useWindowWidth();   
      
      // 分類標籤
      const tabs = [
         { label: '全部', value: 'all' },
         { label: '文章', value: 'article' },
         { label: '影片', value: 'video' }
      ];
      
      const currentTab = ref('all');

      // 範例內容資料
      const items = ref([
         { 
            title: '衛教影片：如何保持健康的生活方式', 
            type: 'video',
            thumbnail: 'article02.png',
            isFavorite: true 
         },
         { 
            title: '健康生活文章：每日運動指南', 
            type: 'article',
            thumbnail: 'article01.png',
            isFavorite: true 
         },
         { 
            title: '衛教影片：正確的飲食習慣', 
            type: 'video',
            thumbnail: 'article02.png',
            isFavorite: true 
         },
         { 
            title: '營養健康文章：均衡飲食的重要性', 
            type: 'article',
            thumbnail: 'article01.png',
            isFavorite: true 
         },
         { 
            title: '衛教影片：如何保持健康的生活方式', 
            type: 'video',
            thumbnail: 'article02.png',
            isFavorite: true 
         },
         { 
            title: '健康生活文章：每日運動指南', 
            type: 'article',
            thumbnail: 'article01.png',
            isFavorite: true 
         },
         { 
            title: '衛教影片：正確的飲食習慣', 
            type: 'video',
            thumbnail: 'article02.png',
            isFavorite: true 
         },
         { 
            title: '營養健康文章：均衡飲食的重要性', 
            type: 'article',
            thumbnail: 'article01.png',
            isFavorite: true 
         }
      ]);

      // 根據分類過濾內容
      const filteredItems = computed(() => {
         if (currentTab.value === 'all') {
            return items.value;
         }
         return items.value.filter(item => item.type === currentTab.value);
      });

      // 切換收藏狀態
      const toggleFavorite = (index) => {
         items.value[index].isFavorite = !items.value[index].isFavorite;
      };

      // 獲取當前分類標籤文字
      const getTabLabel = computed(() => {
         const tab = tabs.find(t => t.value === currentTab.value);
         return tab ? tab.label : '內容';
      });

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
         tabs,
         currentTab,
         items,
         filteredItems,
         toggleFavorite,
         getTabLabel,
         pages,
         perPage,
         datas,
         session
      };
   },
};
</script>

<style scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/videocln.css";
</style>