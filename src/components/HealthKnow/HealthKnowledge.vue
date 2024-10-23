<template>
    <div class="app">
      <!-- 頂部導航欄 -->
      <div class="header">
        <h1>健康知能</h1>
        <router-link to="/game">
          <button class="game-button">動動腦九宮格</button>
        </router-link>
      </div>
  
      <!-- 衛教文章顯示區 -->
      <div class="article-container">
        <div
          v-for="(article, index) in articles"
          :key="index"
          class="article"
        >
        <!-- <router-link :to="{ name: 'healthKnowledgeViewPage', params: { id: article.id }}"> -->
        <router-link :to="{ name: 'healthKnowledgeViewPage'}">
        <div class="image-wrapper">
          <strong><p class="article-title">{{ article.title }}</p></strong>
          <img :src="article.image" alt="衛教文章" />
        </div>
        </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HealthKnowledgePage',
    data() {
      return {
        articles: [
          {
            id: 1,
            title: "營養衛教：口腔保養",
            image: "/cat03.png",
          },
          {
            id: 2,
            title: "營養衛教：口腔保養",
            image: "/cat03.png",
          },
          {
            id: 3,
            title: "衛教文章 3",
            image: "/cat01.jpg",
          },
          {
            id: 4,
            title: "衛教文章 4",
            image: "/cat02.png",
          },
          {
            id: 5,
            title: "衛教文章 5",
            image: "/cat03.png",
          },
        ],
      };
    },
    created() {
      // 模擬後台返回的資料
      this.article = {
        title: '營養衛教：口腔保養',
        image: require('/public/cat03.png'), // 替換成你的圖片
        publishDate: '114年10月13日',
        content: '這裡是文章的主要內容...',
        videoLink: 'https://www.example.com/video',
      };
    }
  };
  </script>
  
<style scoped>
/* 全局樣式設置 */
.app {
  padding: 16px;
  font-family: Arial, sans-serif;
}
  
/* 頂部導航欄 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
  
.game-button {
  padding: 10px 20px;
  background-color: #f49595;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}
  
/* 文章容器樣式 */
.article-container {
  display: grid;
  grid-template-columns: repeat(1, 1fr); /* 手機版單列 */
  grid-gap: 16px;
  margin-top: 20px;
}
  
/* 單篇文章樣式 */
.article {
  border: 1px solid #f0f0f0;
  padding: 10px;
  background-color: #fff;
  text-align: center;
}
.image-wrapper {
  position: relative;
  display: flex;
  flex-direction: column; /* 讓內容垂直排列 */
  justify-content: flex-start;
  align-items: flex-start; /* 左對齊 */
  padding: 10px;
}

/* 標題樣式，放在圖片上方 */
.article-title {
  font-size: 1.5em;
  color: #9e5a33;
  text-decoration: none;
  padding: 0.5em 1em;
  border-radius: 0.5em;
  z-index: 1; /* 確保文字在圖片上層 */
}

/* 圖片樣式 */
.article img {
  width: 100%;
  height: auto;
  max-width: 400px;
  margin-top: 0.5em; /* 調整圖片與標題的距離，使標題位於圖片左上角 */
  object-fit: cover; /* 確保圖片按比例縮放並覆蓋整個區域 */
}
  
/* 桌面版樣式 */
@media (min-width: 768px) {
  .article-container {
    grid-template-columns: repeat(4, 1fr); /* 桌面版四列 */
  }
}
</style>
  