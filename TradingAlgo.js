//Runs all the scripts on a 5 minute interval
//PullLTC pulls the RSI price from TAAPI and passes it to parseData function as unParsed
setInterval(async function PullLTC(){
    const clientSecret = ''
    var XMLHttpRequest = require('xhr2');
    const LTC = new XMLHttpRequest();
    LTC.open('GET', `https://api.taapi.io/rsi?secret=${await clientSecret}&exchange=binance&symbol=LTC/USDT&interval=5m`,true);
    LTC.onerror = data => {
    console.log(`retrying..`);
    sendRequest()};  
    LTC.send();
    LTC.onload = data => {
        parseData(LTC.response);
    }
 },10000);


//parseData prases the data so that we can use it as a string, this function also determins if the algorithm should buy/sell and will send the information via SMS 
function parseData(unParsed) {
    let data = JSON.parse(unParsed);
    if(data.value > 30 && data.value < 65) {
        console.log(`Taking no action | RSI of LTC at: ${data.value}`)
    } else {
    if(data.value < 30) {
        let messageS = 'LTC is less than 30... buying | INFO:'
        SMS("+" && "+", data.value, messageS)
        console.log('LTC is less than 30... buying')
        Sell()
             } else {
    if(data.value > 65) {
        let messageB = 'LTC is greater than 65... selling | INFO:'
        SMS("+" && "+", data.value, messageB) 
        console.log('LTC is greater than 65... selling')
        Buy()

        }
    };
}
    }

//SMS sends the text message with the information about what the algorithm is going to do
async function SMS(phoneNumbers, RsiValue, message) {
    const accountSid = '';
    const authToken = '';
    const client = require('twilio')(accountSid, authToken);
    client.messages.create({body: `${message} RSI for LTC/USDT is at ${RsiValue}`, from: '+', to: phoneNumbers}).then(message => console.log(message.sid));

}

//Buy executes a buy action via Alpaca API/ NPM API
async function Buy() {
const Alpaca = require('@alpacahq/alpaca-trade-api')
const alpaca = new Alpaca({
    keyId: '',
    secretKey: '',
    paper: true,})
alpaca.createOrder({
    symbol: 'LTC', 
    qty: '11',
    side: 'buy',
    type: 'market',
    time_in_force: 'day' ,
  })
 }

//Sell executes a sell action via Alpaca API/ NPM API
async function Sell() {
    const Alpaca = require('@alpacahq/alpaca-trade-api')
    const alpaca = new Alpaca({
    keyId: '',
    secretKey: '',
    paper: true})
  alpaca.createOrder({
    symbol: 'LTC', 
    qty: '11',
    side: 'sell',
    type: 'market',
    time_in_force: 'day' ,
  })

}
