export function splitDataFunc(val, perPageNum) {
   const perPageData = [];
   
   val.forEach((item, index) => {
      const pageIndex = Math.floor(index / perPageNum);
      
      if (!perPageData[pageIndex]) {
         perPageData[pageIndex] = [];
      }

      perPageData[pageIndex].push(item);
   });

   return perPageData;
}