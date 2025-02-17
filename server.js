const express = require("express");
const bodyParser=require("body-parser");
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
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));

// Process application/json
app.use(bodyParser.json());

function showClothes(response,logged){
    var roupas = [];
    connection.query('SELECT * FROM tb_roupa', function(err, results, fields)   {
        if (err) throw err;
        // console.log(results);
        for (let i2 = 0; i2 < results.length; i2++) {
            var hasClothe = false;
            for (let i = 0; i < roupas.length; i++) {
                if (roupas[i].nm_roupa == results[i2].nm_roupa && roupas[i].cat_roupa == results[i2].cat_roupa){
                    hasClothe = true;
                }
            }
            if (hasClothe == false) {
                roupas.push(results[i2]);
            }         
        }
        return response.render('index', { data: roupas, login: logged });
    });
}

app.get('/', function (req, res) {
    showClothes(res,'false');
});

app.post('/', function (req, res) {
    showClothes(res,req.body.logged);
});


app.get('/cadastrar', function (req, res) {
    res.render('cadastrar', {nome: '' , email: '', senha: '', msg:'' });
});

app.get('/entrar', function (req, res) {
    res.render('entrar', { msg:'' });
});


app.post('/historico', function (req, res) {
    console.log(req.body);
    console.log(req.body.logged);
    console.log('=============================');
    connection.query(`SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));`);
    connection.query(`
        SELECT *
        from tb_historico as h
        join tb_roupa as r
        on h.fk_cd_roupa = r.cd_roupa
        and h.fk_email_usuario = '`+req.body.logged+`'
        group by r.cd_roupa
        order by h.cd_historico desc;
        `, function(err, results, fields)   {
            if (results.length > 0){
                return res.render('historico', { data: results, login: req.body.logged });
            } else{
                return res.render('historico', { data: 'Vazio', login: req.body.logged });
            }
        }
    );
});

app.post('/userCadastrar', function (req, res) {
    connection.query(`
        SELECT * FROM tb_usuario
        where email_usuario = '`+req.body.email+`';
        `, function(err, results, fields)   {
        if (err) throw err;
        // console.log(results);
        if (results.length > 0){
            return res.render('cadastrar', {nome: req.body.nome, email: req.body.email, senha: req.body.senha, msg: 'Este Email Já Existe.'});
        } else {
            connection.query(`
                INSERT Into tb_usuario
                values(
                    '`+req.body.email+`',
                    '`+req.body.nome+`',
                    '`+req.body.senha+`'
                );
                `, function(err, results, fields)   {
                if (err) throw err;
                // console.log(results);
    
                showClothes(res,req.body.email);
            });
        }
    });
});

app.post('/userLog', function (req, res) {
    connection.query(`
        SELECT * FROM tb_usuario
        where email_usuario = '`+req.body.email+`'
        and senha_usuario = '`+req.body.senha+`';
        `, function(err, results, fields)   {
        if (err) throw err;
        // console.log(results);
        if (results.length <= 0){
            return res.render('entrar', {msg: 'Email ou Senha Incorretos'});
        } else {
            showClothes(res,req.body.email);
        }
    });
});

app.post('/produto', function (req, res) {  
    var cores = [];
    var tamanho = [];
    var images = [];
    connection.query(`
        SELECT * FROM tb_roupa
        where nm_roupa = '`+req.body.hiddenVl+`'
        and cat_roupa = '`+req.body.hiddenVl3+`';
        `, function(err, results, fields)   {
        if (err) throw err;
        // console.log(results);
        for (let i2 = 0; i2 < results.length; i2++) {
            var hasCor = false;
            for (let i = 0; i < cores.length; i++) {
                if (cores[i] == results[i2].cor_roupa){
                    hasCor = true;
                }
            }
            if (hasCor == false) {
                cores.push(results[i2].cor_roupa);
            }

            var hasTam = false;
            for (let i = 0; i < tamanho.length; i++) {
                if (tamanho[i] == results[i2].tam_roupa){
                    hasTam = true;
                }
            }
            if (hasTam == false) {
                tamanho.push(results[i2].tam_roupa);
            }

            var hasImg = false;
            for (let i = 0; i < images.length; i++) {
                if (images[i] == results[i2].url_roupa){
                    hasImg = true;
                }
            }
            if (hasImg == false) {
                images.push(results[i2].url_roupa);
            }
        }
        // console.log(cores+" Cor / "+tamanho+" Tamanho");
        if (req.body.logged != 'false' && req.body.viewing == 'false'){
            connection.query(`
                INSERT Into tb_historico
                values(
                    null,
                    '`+req.body.logged+`',
                    `+results[0].cd_roupa+`
                );
                `, function(err, results, fields)   {
                if (err) throw err;
                // console.log(results);
            });
        }
        return res.render('produto', { data: results, color: cores, size: tamanho, url: images, login: req.body.logged });
    });
});

app.listen(3000, function () {
    console.log('http://localhost:3000');
});