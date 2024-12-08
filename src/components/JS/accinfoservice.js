export function checkDateDurant() {
   const today = new Date();
   const firstBeginExchangeDate = new Date('2024/12/03');
   const firstEndExchangeDate = new Date('2024/12/08');
   const secondBeginExchangeDate = new Date('2025/09/01');
   const secondEndExchangeDate = new Date('2025/09/14');

   try {
      if (
         (today >= firstBeginExchangeDate && today <= firstEndExchangeDate) || 
         (today >= secondBeginExchangeDate && today <= secondEndExchangeDate)
      ) {
         return true;
      } else {
         return false;
      }
   } catch (error) {
      alert(error);
   }
   
}