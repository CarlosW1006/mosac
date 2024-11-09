import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useWindowWidth() {
   const windowWidth = ref(window.innerWidth);
   const winwidth = ref(window.innerWidth > 1280);

   const updateWindowWidth = () => {
      windowWidth.value = window.innerWidth;
   };

   const updateWinValue = () => {
      winwidth.value = windowWidth.value > 1280;
   };

   onMounted(() => {
      window.addEventListener('resize', updateWindowWidth);
      window.addEventListener('resize', updateWinValue);
   });

   onBeforeUnmount(() => {
      window.removeEventListener('resize', updateWindowWidth);
      window.removeEventListener('resize', updateWinValue);
   });

   return {
      winwidth, windowWidth
   };
}
