<template>
   <v-container fluid>
      <v-row :class="{ 'pa-4': winwidth }">
         <v-col cols="12" sm="7" md="6" lg="5">
            <v-card>
               <v-list-item class="list-title">
                  <h3 class="page-title">個人累積點數</h3>
               </v-list-item>

               <v-list-item class="list-item">
                  <div class="flex-container">
                     <v-col cols="5" sm="5" md="4"><h4 class="item-title">點數類型</h4></v-col>
                     <v-col cols="7" sm="7" md="8"><h4>累積數量</h4></v-col></div>
               </v-list-item>
                  
               <v-list-item class="list-item">
                  <div class="flex-container">
                     <v-col cols="5" sm="5" md="4"><p class="item-title">個人點數：</p></v-col>
                     <v-col cols="7" sm="7" md="8"><p>45</p></v-col></div>
               </v-list-item>

               <v-list-item class="list-item">
                  <div class="flex-container">
                     <v-col cols="5" sm="5" md="4"><p class="item-title">團體徽章：</p></v-col>
                     <v-col cols="7" sm="7" md="8" style="display: flex;"><p>2</p>
                     </v-col>
                  </div>
               </v-list-item>
            </v-card>
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
   import { useWindowWidth } from '../JS/winwidth.js';
   import { ref } from 'vue';

   export default {
      name: 'accInfoPage',
      setup() {
         const { winwidth } = useWindowWidth();
         const drawer = ref(false);

         let session = sessionStorage.getItem('session');

         return {
            winwidth,
            drawer,
            session,
         };
      },
   };
</script>

<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/accountInfo.css";
</style>