require('dotenv').config();
const {Bot} = require('grammy'); 
const {WbStock, WBorders, WbAdvertising, WbBalance, WbBudget} = require('./wb');
const {OZONStock, OZONOders} = require('./ozon');

const bot = new Bot(process.env.API_TG);


bot.command('start', async ctx => {
       //получение сегодняшней даты
       const date = new Date();
       let day = date.getDate() - 1;
       if (day < 10) {
              day = `0${day}`
       }
       let month = date.getMonth() + 1 ;
       if (month < 10) {
              month = `0${month}`
       }
       const year = date.getFullYear();
       const fullDate = `${day}.${month}.${year}`;
       
       async function marketplaceOZON() {
              //выгрузка остатков меньше 5 и не равных нулю
              const ozonStock = await OZONStock();
              let massStock = [];
              for (const key in ozonStock) {              
                     massStock.push(`${ozonStock[key]['id']} - ${ozonStock[key]['stock']} шт.\n`);
              }
              let massStockReply = massStock.join('');

              //выгрузка заказов за сутки
              const ozonOders = await OZONOders();
              let massOders = [];
              
              for (const key in ozonOders) {
                     massOders.push(`${key} - ${ozonOders[key]} шт.\n`); 
                     }
              let massOdersReply = massOders.join('');

       

      

       
       ctx.reply(`🚹OZON на ${fullDate}🚹\n\n❗️ОСТАТКИ❗️\nАртикулы на которые стоит обратить внимание, так как остатки близятся к нулю\n${massStockReply}\n\n❗️ЗАКАЗЫ❗️\n${massOdersReply}`);
       }
       
       
       //работа с API WB
        async function marketplaceWB() {
              
              //работаем с остатками на складах, выгружаем если меньше 10 и не равны 0
              const wbStock = await WbStock();
              let massStock = [];
       
              for (const key in wbStock) {              
                     massStock.push(`${wbStock[key]['articul']} - ${wbStock[key]['stoke']} шт.\n`);
              }
              let massStockReply = massStock.join('');

              //работаем с заказами на прошлый день
              const wbOrders = await WBorders();
              console.log(wbOrders);
              let massOders = [];
              for (const key in wbOrders) {              
                     massOders.push(`${key} - ${wbOrders[key]} шт.\n`);
              }
              let massOdersReply = massOders.join('');

              // работаем с рекламными компаниями
              const wbAdvertising = await WbAdvertising();             
              let massAdvertising = [];
              for (const key in wbAdvertising) {
                     let budget = await WbBudget(wbAdvertising[key]['id']);//получаем бюджет рекламной компании
                     massAdvertising.push(`ID рк: ${wbAdvertising[key]['id']}\nНазвание: ${wbAdvertising[key]['name']}\nРасходы: ${wbAdvertising[key]['sum']} рублей\nCTR: ${wbAdvertising[key]['ctr']}\nБЮДЖЕТ КОМПАНИИ: ${budget} рублей\n\n`);
              }
              console.log(massAdvertising);
              let massAdvertisingReply = massAdvertising.join('');
              
              //получаем баланс на продвижение
              const wbBalance = await WbBalance();
              




       ctx.reply(`🚺Wildberries на ${fullDate}🚺\n\n❗️ОСТАТКИ❗️\nАртикулы на которые стоит обратить внимание, так как остатки близятся к нулю;\n${massStockReply}\n\n❗️ЗАКАЗЫ❗️\n${massOdersReply}\n\n❗️РЕКЛАМА❗️\n${massAdvertisingReply}Бюджет на продвижение: ${wbBalance} рублей`);
       }


       marketplaceOZON();
       marketplaceWB();
});

bot.start();