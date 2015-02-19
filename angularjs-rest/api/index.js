var express = require('express'),
    mysql = require('mysql'),
    bodyParser = require('body-parser'),
    app = express(),

    // Change these out with your own credentials
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'Demo'
    });

// Set up the middleware for parsing body data and accepting all incoming requests and methods. Obviously this won't fly
// in a production environment, but we're just running this locally.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS, DELETE");
    next();
});

// Connect to the database
connection.connect();

/**
 * Returns all bands
 */
app.get('/bands', function (req, res) {
    connection.query('SELECT * FROM bands', function(err, results) {
        res.json(results);
    });
});

/**
 * Updates the band with the provided id
 */
app.put('/band/:id', function (req, res) {
    var id = req.params.id,
        name = req.body.name,
        bestAlbum = req.body.bestAlbum;
    connection.query('UPDATE bands SET name = ?, bestAlbum = ? WHERE id = ?', [name, bestAlbum, id], function(err, results) {
        if (err || !results || results.affectedRows == 0) {
            res.json(false);
        } else {
            res.json(true);
        }
    });
});

/**
 * Adds a new band
 */
app.post('/band', function (req, res) {
    var name = req.body.name,
        bestAlbum = req.body.bestAlbum;
    connection.query('INSERT INTO bands SET name = ?, bestAlbum = ?', [name, bestAlbum], function(err, results) {
        if (err || !results || results.affectedRows == 0) {
            res.json(false);
        } else {
            res.json(results.insertId);
        }
    });
});

/**
 * Deletes the band with the provided id
 */
app.delete('/band/:id', function (req, res) {
    var id = req.params.id;
    connection.query('DELETE FROM bands WHERE id = ?', [id], function(err, results) {
        if (err || !results || results.affectedRows == 0) {
            res.json(false);
        } else {
            res.json(true);
        }
    });
});
 
app.listen(9999);