<template>
    <div class="health-knowledge-view">
      <div class="article-container">
        <!-- 標題部分 -->
        <h2>營養衛教：口腔保養</h2>
  
        <!-- 圖片 -->
        <img :src="require('/public/cat01.jpg')" alt="衛教圖片" class="article-image" />
  
        <!-- 發布日期 -->
        <p class="publish-date">發布日期：113年10月13日</p>
  
        <!-- 文章內容 -->
        <div class="article-content">
          <h3>標題</h3>
          <p>這裡是文章的主要內容，講述口腔保養的重要性和相關知識。</p>
  
          <h3>影片連結</h3>
          <a href="https://www.example.com/video" target="_blank">影片連結點擊這裡</a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'healthKnowledgeViewPage',
    data() {
      return {
        // 這裡是靜態文章資料
      };
    },
  };
  </script>
  
  <style scoped>
  .health-knowledge-view {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .article-container {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 0 auto;
  }
  
  h2 {
    font-size: 24px;
    color: #333;
  }
  
  .article-image {
    width: 100%;
    height: auto;
    margin-top: 20px;
  }
  
  .publish-date {
    font-size: 14px;
    color: #666;
    margin-top: 10px;
  }
  
  .article-content {
    margin-top: 20px;
  }
  
  h3 {
    font-size: 18px;
    color: #333;
  }
  
  p {
    font-size: 16px;
    color: #555;
    line-height: 1.6;
  }
  
  a {
    color: #1e90ff;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  </style>
  