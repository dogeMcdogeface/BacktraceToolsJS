document.write(5 + 6);



var xhr = new XMLHttpRequest();
xhr.open('POST', "/api/test");

xhr.onreadystatechange = function() {
    if (this.readyState != 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
        console.log(data);
        document.write(data);
    }
};

let data = `{
  "Id": 78912,
  "Customer": "Jason Sweet",
}`;

xhr.send(data);