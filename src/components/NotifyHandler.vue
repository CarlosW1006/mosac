<template>
   <span></span>
</template>

<script>
   import { useRouter } from 'vue-router';
   import { formatDate } from './JS/formatTime.js';
   import { get2DayConsultResult } from '../api/consult.js';

   export default {
      name: 'NotifyHandler',
      setup() {
         const router = useRouter();
         const currentDate = new Date();
         const currentDateTime = formatDate(currentDate);

         currentDate.setDate(currentDate.getDate() + 1);
         const nextDateTime = formatDate(currentDate);

         get2DayConsultResult(currentDateTime, nextDateTime).then((result) => {
            if(result != 0) {
               alert('親愛的用戶您好，近日有為您安排諮詢行程，請記得準時參加~');
            }
            router.push({ path: '/index' });
         });
            
      },
   };
</script>
