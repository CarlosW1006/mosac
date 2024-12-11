import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useWindowWidth() {
   const windowWidth = ref(window.innerWidth);
   const winwidth = ref(window.innerWidth > 1200);
   const isSmallWidth = ref(window.innerWidth <= 550);

   const updateWindowWidth = () => {
      windowWidth.value = window.innerWidth;
   };

   const updateWinValue = () => {
      winwidth.value = windowWidth.value > 1200;
   };

   const updateIsSmallWidth = () => {
      isSmallWidth.value = windowWidth.value <= 550;
   };

   onMounted(() => {
      window.addEventListener('resize', updateWindowWidth);
      window.addEventListener('resize', updateWinValue);
      window.addEventListener('resize', updateIsSmallWidth); // 新增事件監聽
   });

   onBeforeUnmount(() => {
      window.removeEventListener('resize', updateWindowWidth);
      window.removeEventListener('resize', updateWinValue);
      window.removeEventListener('resize', updateIsSmallWidth); // 移除事件監聽
   });

   return {
      winwidth,
      windowWidth,
      isSmallWidth,
   };
}
