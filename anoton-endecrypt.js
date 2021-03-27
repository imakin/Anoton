//Izzulmakin 2021
function console_log(s){
  console.log(s);//debug
}

// crypto-save physical sensor analog to digital generated secure random initial vector
const pre_iv = "239iuadpks;x;pk29'a[pkoj";
//argon2-ed during encrypt and decrypt :::::::
const password_salt = "od;Þx86+x1b>,2/1."
const iv_salt = "E»Òi&*x99Qf59e"

/**
 * generate 128-bit key from password with any length
 * @param {*string} password 
 */
function passwordToKey(password) {
  var str = password;
  var bytes = []; // char codes

  for (var i = 0; i < str.length; ++i) {
    var code = str.charCodeAt(i);    
    bytes = bytes.concat([code]);
  }
  return bytes;

}

/** padd a text to have length of multiple of 16 bytes
 * @param length: length of text to be padded
 */
function makePadd(length) {
  const padding_char = ' ';
  return padding_char.repeat(
    ((length-1)|15)+1-length // closest upper multiplier of 16
  );
}

/**
 * Encrypt text string using password string with AES-CBC method
 * @param {*string} text 
 * @param {*string} password 
 * @return promise  resolve(hexstring of encrypted text)
 *    sample: encrypt("secret text", "passwd").then(function(h){console.log(h)})
 */
function encrypt(text, password) {
  var promisereturn = new Promise(function(resolve,reject){
    argon2.hash({ pass: password, salt: password_salt, time:password.length,mem:password.length*9,hashLen:16})
    .then(function(h) {
      console_log("step1 argon2 password");
      //~ console_log(h.hash, h.hashHex, h.encoded);
      argon2.hash({ pass: pre_iv, salt: iv_salt, time:password.length,mem:password.length*11,hashLen:16})
      .then(function(hiv) {
        console_log("step2 argon2 iv");
        //~ console_log(hiv.hash, hiv.hashHex, hiv.encoded);
        text = text+makePadd(text.length); // pad to multiplier of 16 length
        var aesCbc = new aesjs.ModeOfOperation.cbc(h.hash,hiv.hash);
        var encryptedBytes = aesCbc.encrypt(
          aesjs.utils.utf8.toBytes(text) // convert to bytes
        );
        var encryptedhexstring =  aesjs.utils.hex.fromBytes(encryptedBytes); //convert to hexstring
        console_log(encryptedhexstring);
        resolve(encryptedhexstring);
      })
    });
  });
  return promisereturn;
}

/**
 * Decrypt hexstringEncryptedData (hex string) using password
 * @param {*} hexstringEncryptedData: a hexstring of encrypted bytes
 * @param {*} password: password used
 *   sample: decrypt("ccdcaf625d66c658fc868e4fb9264a7b","pintars")
 */
function decrypt(hexstringEncryptedData, password) {
  
  var promisereturn = new Promise(function(resolve,reject){
    argon2.hash({ pass: password, salt: password_salt, time:password.length,mem:password.length*9,hashLen:16})
    .then(function(h) {
      console_log("step1 argon2 password");
      //~ console_log(h.hash, h.hashHex, h.encoded);
      argon2.hash({ pass: pre_iv, salt: iv_salt, time:password.length,mem:password.length*11,hashLen:16})
      .then(function(hiv) {
        console_log("step2 argon2 iv");
        //~ console_log(hiv.hash, hiv.hashHex, hiv.encoded);
        var aesCbc = new aesjs.ModeOfOperation.cbc(h.hash,hiv.hash);
        
        var encryptedBytes = aesjs.utils.hex.toBytes(hexstringEncryptedData);//hexstring to encrypted bytes
        var decryptedBytes = aesCbc.decrypt(encryptedBytes); //decrypt to bytes
        var decrypted_string = aesjs.utils.utf8.fromBytes(decryptedBytes).trim();//from Bytes to string, trim trailing spaces
        console_log(decrypted_string);
        resolve(decrypted_string)
        
      })
    });
  });
  return promisereturn;
}
