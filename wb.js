
//Выгрузка остатков товара меньше 10 и не равных нулю
const WbStock = async () => {
    //апи ключ стата
    const apiKey = process.env.API_WB;
    const url = `https://statistics-api.wildberries.ru/api/v1/supplier/stocks?dateFrom=2023-01-01`;
   
  
  //запрос
    const options = {
    muteHttpExceptions: true,
    headers:{
        Authorization: apiKey,
        accept: "application/json",
        contentType: "application/json; charset=utf-8",
        }
    }; 

    let req = await fetch(url, options);
    let json = await req.json();


    let dataMass = [];
    let massAll = [];
    json.forEach(el =>{
    let art = el.supplierArticle;
    let stockOp = el.quantity;
    massAll.push({articul: art, stoke: stockOp});
    });
    
    let result = massAll.reduce((a,c) => (a[c.articul] = (a[c.articul] || 0) + c.stoke, a), {});
    for (const key in result) {
        
        if (result[key] <= 10 && result[key] !== 0) {
                dataMass.push({articul: key, stoke: result[key]});
            }
        
    } 
                
    
    
    return dataMass;
}

//Выгрузка заказов за сегодня
const WBorders = async ()=>{
    //получение сегодняшней даты
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
      
       const fullDateApi = `${year}-${month}-${day}`;
       console.log(fullDateApi);
         //апи ключ стата
    const apiKey = process.env.API_WB;
    const url = `https://statistics-api.wildberries.ru/api/v1/supplier/orders?dateFrom=${fullDateApi}`;
   
  
  //запрос
    const options = {
    muteHttpExceptions: true,
    headers:{
        Authorization: apiKey,
        accept: "application/json",
        contentType: "application/json; charset=utf-8",
        }
    }; 

    let req = await fetch(url, options);
    let json = await req.json();
    let massOders = [];
    json.forEach(el=>{
        const  supplierArticle = el.supplierArticle;
        const i = 1;
        massOders.push({art: supplierArticle, count: i});

    });
    console.log(massOders);
    let result = massOders.reduce((a,c) => (a[c.art] = (a[c.art] || 0) + c.count, a), {});
    console.log(result);
    return result;
}




//Выгрузка статистики по рекламным компаниям
const WbAdvertising = async () =>{
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
   
    const fullDateApi = `${year}-${month}-${day}`;
    //апи реклама
    const apiKey = process.env.API_WB;
    let url = `https://advert-api.wb.ru/adv/v1/promotion/count`;
   
  
  //запрос
    let options = {
    muteHttpExceptions: true,
    headers:{
        Authorization: apiKey,
        accept: "application/json",
        contentType: "application/json; charset=utf-8",
        }
    }; 

    let req = await fetch(url, options);
    let jsonCount = await req.json();
    console.log(jsonCount);
    
    let massAdvertising9 = [];
    for (const key in jsonCount.adverts) {     
        if (jsonCount.adverts[key].type == 8 || jsonCount.adverts[key].type == 9) {
            if (jsonCount.adverts[key].status == 9) {
                jsonCount.adverts[key].advert_list.forEach(el=>{
                    massAdvertising9.push({
                        id: el.advertId,
                        dates: [
                            fullDateApi,
                            fullDateApi
                            ]
                    });
                });
            }
        }
    };
    
    console.log(massAdvertising9);
    let url2 = `https://advert-api.wb.ru/adv/v2/fullstats`;
    let options2 = {
        muteHttpExceptions: true,
        'method': 'POST',
        'headers': {
            Authorization: process.env.API_WB,
            contentType: 'application/json',

        },
        'body': JSON.stringify(massAdvertising9)
        
    }
    const res2 =  await fetch(url2, options2);
    const json2 =  await res2.json();
    let massAdv = [];
    
    
    await json2.forEach( async el =>{
        //console.log(el);
        let nameId = await el.advertId;// id рекламной компании
        let sum = el.sum; //расходы за день
        let ctr = el.ctr;
        let nameText = el.days[0].apps[0].nm[0].name; //название первого товара в рекламной компании
        
         massAdv.push({
            id: nameId,
            name: nameText,
            sum: sum,
            ctr: ctr

            
        });
        
        
    });
    
    

    return  massAdv;
    
};

//Выгрузка баланса на продвижения
const WbBalance = async ()=>{
    const apiKey = process.env.API_WB;
    const url = `https://advert-api.wb.ru/adv/v1/balance`;
   
  
  //запрос
    const options = {
    muteHttpExceptions: true,
    headers:{
        Authorization: apiKey,
        accept: "application/json",
        contentType: "application/json; charset=utf-8",
        }
    }; 

    let req = await fetch(url, options);
    let json = await req.json();
    return json.net;
};

//выгрухка бюджета компании
const WbBudget =  async (topId) =>{
    const apiKey = process.env.API_WB;
    const url = `https://advert-api.wb.ru/adv/v1/budget?id=${topId}`;
   
  
  //запрос
    const options = {
    muteHttpExceptions: true,
    headers:{
        Authorization: apiKey,
        accept: "application/json",
        contentType: "application/json; charset=utf-8",
        }
    }; 

    let req = await fetch(url, options);
    let json = await req.json();
    let result = json.total;
    return result;
}





module.exports = {WbStock, WBorders, WbAdvertising, WbBalance, WbBudget};