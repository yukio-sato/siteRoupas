const express = require("express");
const app = express();

app.use(express.static("views"));

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',     // host for connection
    port: 3306,            // default port for mysql is 3306
    user: 'root',          // username of the mysql connection
    password: 'root',      // password of the mysql connection
    database: 'ilhaTrue'      // database from which we want to connect our node application
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
  
    connection.query('SELECT * FROM tb_roupa', function(err, results, fields)   {
        if (err) throw err;
        console.log(results);
        return res.render('index', { data: results});
    });
  });

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

// document.addEventListener("DOMContentLoaded", () => { 
//     var nike = document.getElementById("nikeClothes");
//     var nikeClothes = `
//     <div id="Roupas">
//         <img src="css/media/NikeTshirtSample.jpg" alt="camiseta da nike" id="RoupaImg">
//         Camiseta Nike Preta
//         <h1>R$65,00</h1>
//         <button class="BuyNike">Comprar</button>
//     </div>
//     `;

//     var adidas = document.getElementById("adidasClothes");
//     var lacoste = document.getElementById("lacosteClothes");
// });