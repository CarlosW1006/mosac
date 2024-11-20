export function checkDateDurant() {
   const today = new Date().toLocaleDateString();
   const firstBeginExchangeDate = '2024/11/20';
   const firstEndExchangeDate = '2024/11/22';
   const secondBeginExchangeDate = '2024/12/20';
   const secondEndExchangeDate = '2024/12/22';

   try {
      if((today>=firstBeginExchangeDate && today<=firstEndExchangeDate) || 
      (today>=secondBeginExchangeDate && today<=secondEndExchangeDate)) {
         return(true);
      } else {
         return(false);
      }
   } catch(error) {
      alert(error);
   }
   
}