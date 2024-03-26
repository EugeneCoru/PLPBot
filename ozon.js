
//выгрузка остатков на Озоне
const OZONStock = async () =>{
      

    const apiKey = process.env.API_OZON; 
    const clientId = process.env.CLIENT_ID_OZON;
    const headers = {
            'Client-Id': clientId,
            'Api-Key': apiKey
          };
    //Тело запроса на получение остатков товара
    const body = {
          "filter": {
            "visibility": "ALL"
          },
          "limit": 500 // Если товаров больше 500 меняем на нужное количество. Ограничение: Минимум — 1, максимум — 1000.
        };
    //Параметры запроса
    const options = {
        "method": "POST",
        "headers": headers,
        "contentType": "application/json",
        "body": JSON.stringify(body)
        };
    
    let response = await fetch("https://api-seller.ozon.ru/v3/product/info/stocks", options);
      // Parse the JSON reply
      //console.log(response);
     let data =  await response.json();
     let json =  data.result.items;
     
     let massStocks = [];
     let massStocksAll = [];
     json.forEach(el => {
          let art = el.offer_id;
          let stock_fbo = Number(el.stocks.filter(x => x['type'] == 'fbo').map(y => y.present - y.reserved));
          let stock_fbs = Number(el.stocks.filter(x => x['type'] == 'fbs').map(y => y.present - y.reserved));
          let sumStocks = stock_fbo + stock_fbs;
          //console.log(sumStocks);
          if (sumStocks <= 5 && sumStocks !== 0) {
            massStocks.push({
              id: art,
              stock: sumStocks
          });
          }
          
          

          
         
     });
    //console.log(massStocks);
    return massStocks;
}


const OZONOders = async () =>{
  function DateFrom(){
    const date = new Date();
    let day = date.getDate() - 1 ;
        if (day < 10) {
          day = `0${day}`
        }
    let month = date.getMonth() + 1 ;
        if (month < 10) {
          month = `0${month}`
        }
    const year = date.getFullYear();
   
    const fullDateApi = `${year}-${month}-${day}T00:00:00.000Z`;
    console.log(fullDateApi);
    return fullDateApi;
  }
  
  function DateTo(){
    const date = new Date();
    let day = date.getDate();
        if (day < 10) {
          day = `0${day}`
        }
    let month = date.getMonth() + 1 ;
        if (month < 10) {
          month = `0${month}`
        }
    const year = date.getFullYear();
   
    const fullDateApi = `${year}-${month}-${day}T00:00:00.000Z`;
    console.log(fullDateApi);
    return fullDateApi;
  }


  const apiKey = process.env.API_OZON; 
  const clientId = process.env.CLIENT_ID_OZON;
  const headers = {
          'Client-Id': clientId,
          'Api-Key': apiKey
        };
  //Тело запроса на получение остатков товара
  const body = {
    "dir": "ASC",
    "filter": {
    "since": DateFrom(),
    "status": "",
    "to": DateTo()
    },
    "limit": 1000,
    "offset": 0,
    "translit": false,
    "with": {
    "analytics_data": true,
    "financial_data": true
    }
    };
  //Параметры запроса
  const options = {
      "method": "POST",
      "headers": headers,
      "contentType": "application/json",
      "body": JSON.stringify(body)
      };
  
  let response = await fetch("https://api-seller.ozon.ru/v2/posting/fbo/list", options);
    // Parse the JSON reply
    //console.log(response);
   let data =  await response.json();
   let json =  data.result;
   
   let massOders = [];
   console.log(json);
   json.forEach(el => {
     let product = el.products;
     product.forEach(elem=>{
       let art = elem.offer_id;
       let quantity = elem.quantity;
       massOders.push({
        art: art,
        quantity: quantity
      });
       
     })
    //console.log(el); 
    
   });
   let result = massOders.reduce((a,c) => (a[c.art] = (a[c.art] || 0) + c.quantity, a), {});

   return result;
}


module.exports = { OZONStock, OZONOders };