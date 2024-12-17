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
         const today = new Date();
         const [currentDateTime, nextDateTime] = [formatDate(today), formatDate(new Date(today.setDate(today.getDate() + 1)))];

         get2DayConsultResult(currentDateTime, nextDateTime).then((result) => {
            if (result) alert(`親愛的用戶您好，近日有為您安排諮詢行程，請記得準時參加~${result}`);
            router.push({ path: '/index' });
         });
      },
   };
</script>
