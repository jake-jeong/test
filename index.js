
var express = require('express');
var jm = express();
var bodyParser = require('body-parser');
var jade = require('jade');

secp256k1 = require('tiny-secp256k1')
createHash = require('create-hash')
bs58check = require('bs58check')
bs58 = require('bs58')

jm.locals.pretty = true;
jm.set('view engine', 'jade');
jm.set('views', './views');
jm.use(express.static('public'));
jm.use(bodyParser.urlencoded({extended : false}))

jm.get('/',function(req, res){
  res.render('inputKey')
})

jm.post('/outputAddress',function(req,res){

  let privateKey = Buffer.from(req.body.privateKey, 'hex');


  if( !secp256k1.isPrivate(privateKey) ) {
    output = `올바른 프라이빗 키를 입력해라. 기회 한번 더 준다.<br>
    <a href='/'> 돌아가기 </a>`;
    res.send(output);
  }
  else {

    publicKey = secp256k1.pointFromScalar(privateKey)
    sha256 = createHash('sha256').update(publicKey).digest();
    ripemd160 = createHash('ripemd160').update(sha256).digest();
    result = Buffer.from('00'+ripemd160.toString('hex'),'hex')
    sha256x1 = createHash('sha256').update(result).digest();
    sha256x2 = createHash('sha256').update(sha256x1).digest();
    sliced = sha256x2.slice(0,4)
    mixed = Buffer.concat([result,sliced],result.length+4)

    output = `
    <!doctype html>
    <html>
    <head>
    <meta charset='utf-8'>
    <title> 양종만을 위한 싸이트 </title>
    </head>
    <body>
    <h1 style="color:red"> base58check 함수를 쓸꺼면 3번의 결과 값을 base58check에 넣어줘라 <br>
    base58 함수를 쓸거면 7번 까지 진행하고 base58 함수를 돌려줘라 </h1>
    <b><br>이것은 publicKey니까 참고하시고</b>
    <br> ${publicKey.toString('hex')}
    <b><br><br>1. sha-256 한번 돌려주고</b>
    <br>${sha256.toString('hex')}
    <b><br><br>2. ripemd-160도 한번 돌려주고</b>
    <br>${ripemd160.toString('hex')}
    <b><br><br>3. '2'에서 나온 값의 맨 앞에 00붙혀주고 이 값은 잘 보관해라.</b>
    <br>${result.toString('hex')}
    <b><br><br>4. sha-256 한번 돌려주고</b>
    <br>${sha256x1.toString('hex')}
    <b><br><br>5. sha-256 한번 더 돌려주고</b>
    <br>${sha256x2.toString('hex')}
    <b><br><br>6. 나온 값에 앞에 8글자(4byte)만 떼라</b>
    <br>${sliced.toString('hex')}
    <b><br><br>7. 뗀 값을 '3'번에서 나온 값에 맨 뒤에 붙혀줘라</b>
    <br>${mixed.toString('hex')}
    <b><br><br>8. base58 전환ㄱㄱ</b>
    <br>${bs58.encode(mixed)}<br><br>

    <a href="https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses#How_to_create_Bitcoin_Address"> 참고한 싸이트 </a>
    </body>
    `

    res.send(output);
  }
})

jm.post('/outputAddressFromPub',function(req,res){

  let publicKey = Buffer.from(req.body.publicKey, 'hex');


  if( !secp256k1.isPoint(publicKey) ) {
    output = `올바른 퍼블릭 키를 입력해라. 기회 한번 더 준다.<br>
    <a href='/'> 돌아가기 </a>`;
    res.send(output);
  }
  else {

    let sha256 = createHash('sha256').update(publicKey).digest();
    let ripemd160 = createHash('ripemd160').update(sha256).digest();
    let result = Buffer.from('00'+ripemd160.toString('hex'),'hex')
    let sha256x1 = createHash('sha256').update(result).digest();
    let sha256x2 = createHash('sha256').update(sha256x1).digest();
    let sliced = sha256x2.slice(0,4)
    let mixed = Buffer.concat([result,sliced],result.length+4)

    output = `
    <!doctype html>
    <html>
    <head>
    <meta charset='utf-8'>
    <title> 양종만을 위한 싸이트 </title>
    </head>
    <body>
    <h1 style="color:red"> base58check 함수를 쓸꺼면 3번의 결과 값을 base58check에 넣어줘라 <br>
    base58 함수를 쓸거면 7번 까지 진행하고 base58 함수를 돌려줘라 </h1>
    <b><br>이것은 publicKey니까 참고하시고</b>
    <br> ${publicKey.toString('hex')}
    <b><br><br>1. sha-256 한번 돌려주고</b>
    <br>${sha256.toString('hex')}
    <b><br><br>2. ripemd-160도 한번 돌려주고</b>
    <br>${ripemd160.toString('hex')}
    <b><br><br>3. '2'에서 나온 값의 맨 앞에 00붙혀주고 이 값은 잘 보관해라.</b>
    <br>${result.toString('hex')}
    <b><br><br>4. sha-256 한번 돌려주고</b>
    <br>${sha256x1.toString('hex')}
    <b><br><br>5. sha-256 한번 더 돌려주고</b>
    <br>${sha256x2.toString('hex')}
    <b><br><br>6. 나온 값에 앞에 8글자(4byte)만 떼라</b>
    <br>${sliced.toString('hex')}
    <b><br><br>7. 뗀 값을 '3'번에서 나온 값에 맨 뒤에 붙혀줘라</b>
    <br>${mixed.toString('hex')}
    <b><br><br>8. base58 전환ㄱㄱ</b>
    <br>${bs58.encode(mixed)}<br><br>

    <a href="https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses#How_to_create_Bitcoin_Address"> 참고한 싸이트 </a>
    </body>
    `
    res.send(output);
  }
})

jm.listen(32323, function(){
  console.log('Connected 0302 port!');
});
