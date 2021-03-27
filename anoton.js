//Izzulmakin 2021
username = "makin";
password = "qwejkl";

var textarea = document.getElementById("decryptedtext");
var encrypteddisplay= document.getElementById("encrypteddisplay");

function anoton_downloadString(filename, data) {
    var blob = new Blob([data], {type: 'text/csv'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}
function anoton_save(){
  password = document.getElementById("password").value;
  encrypt(textarea.value, password).then(
    function(encryptedtext) {
      //~ encrypteddisplay.innerHTML = encryptedtext;
      anoton_downloadString("myfile",encryptedtext);
    }
  );
}
function anoton_load(e){
  const reader = new FileReader();
  let file = e.target.files[0];
  password = document.getElementById("password").value;
  //todo confirm discard current textarea, and prompt password
  reader.readAsText(file);
  reader.onload = function () {
    decrypt(reader.result.trim(), password).then(function(txt){
      textarea.value = txt;
    });
    console.log("["+reader.result.trim()+"]");
  };
  reader.onerror = function () {
    console.log(reader.error);
  };
}
document.getElementById("input_openfile").addEventListener("change",anoton_load);
