const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
//const { check, validationResult } = require('express-validator');
const configDB = require('../../config/db');
const { Connection, Request } = require("tedious");
//const { request } = require('express');


// @route    POST api/measurement/
// @desc     Get measurement list for station by time, measurement unit id, id station
// @access   Public'
router.post('/measurements', auth, async (req, res) => {
    const {DateFrom, DateTo, ID_Station, ID_Measured_Unit} = req.body;
    var connection = new Connection(configDB.user(req.user));
    connection.connect();
    connection.on('connect', function(err) {
        var all = [];
        request = new Request(`select * from Measurment
                                where Time >= '${DateFrom}' and Time < '${DateTo}' and ID_Station = '${ID_Station}' and ID_Measured_Unit = ${ID_Measured_Unit} order by Time;`, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                console.log(err);
                res.status(500).send('Server error');
            } else {
                res.json(all);
            }
        });
        request.on("row", columns => {
            var row = {};
            columns.forEach(column => {
              row[column.metadata.colName] = column.value;
            });
            all.push(row);
        });
        connection.execSql(request);
    })
});

// @route    POST api/station/unitsFull
// @desc     Get unit list with full info for station by station id
// @access   Public
router.post('/unitsFull', auth, async (req, res) => {
    const {ID_Station} = req.body;
    var connection = new Connection(configDB.user(req.user));
    connection.connect();
    connection.on('connect', function(err) {
        var all = [];
        request = new Request(`select Measurment.ID_Measured_Unit, Title, Unit
                                from Measurment inner join Measured_Unit
                                ON Measurment.ID_Measured_Unit = Measured_Unit.ID_Measured_Unit
                                where ID_Station = '${ID_Station}'
                                group by Measurment.ID_Measured_Unit, Title, Unit;`, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                console.log(err);
                res.status(500).send('Server error');
            } else {
                res.json(all);
            }
        });
        request.on("row", columns => {
            var row = {};
            columns.forEach(column => {
              row[column.metadata.colName] = column.value;
            });
            all.push(row);
        });
        connection.execSql(request);
    })
});

// @route    POST api/station/units
// @desc     Get unit list for station by station id
// @access   Public
router.post('/units/', auth, async (req, res) => {
    const {ID_Station} = req.body;
    var connection = new Connection(configDB.user(req.user));
    connection.connect();
    connection.on('connect', function(err) {
        var all = [];
        request = new Request(`select Title
                                from Measurment inner join Measured_Unit
                                ON Measurment.ID_Measured_Unit = Measured_Unit.ID_Measured_Unit
                                where ID_Station = '${ID_Station}'
                                group by Title;`, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                console.log(err);
                res.status(500).send('Server error');
            } else {
                res.json(all);
            }
        });
        request.on("row", columns => {
            columns.forEach(column => {
              all.push(column.value);
            });
          });
        connection.execSql(request);
    })
});

// @route    POST api/station/toFavorite
// @desc     Add station to favorite
// @access   Private
router.post('/toFavorite', auth, async (req, res) => {
    const {ID_Station} = req.body;
    var connection = new Connection(configDB.user(req.user));
    connection.connect();
    connection.on('connect', function(err) {
        request = new Request(`IF NOT EXISTS (select * from Favorite_Station where ID_Station = '${ID_Station}' and ID_User = ${req.user.id}) insert into Favorite_Station(ID_User, ID_Station) values (${req.user.id}, '${ID_Station}');`, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                console.log(err);
                res.status(500).send('Server error');
            } else {
                res.json({
                    message: "Added to favorite"
                });
            }
        });
        connection.execSql(request);
    })
});

// @route    POST api/station/fromFavorite
// @desc     Delete station from favorite
// @access   Private
router.post('/fromFavorite', auth, async (req, res) => {
    const {ID_Station} = req.body;
    var connection = new Connection(configDB.user(req.user));
    connection.connect();
    connection.on('connect', function(err) {
        request = new Request(`delete from Favorite_Station where ID_User = ${req.user.id} and ID_Station = '${ID_Station}';`, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                console.log(err);
                res.status(500).send('Server error');
            } else {
                res.json({
                    message: "Deleted from favorite"
                });
            }
        });
        connection.execSql(request);
    })
});

// @route    POST api/station/fromFavorite
// @desc     Delete station from favorite
// @access   Private
router.post('/changeFavorite', auth, async (req, res) => {
    const {ID_Station, isFavorite} = req.body;
    var row = {};
    var requestStr = `select ID_Station, Name, Status, ID_Server, ID_SaveEcoBot, Longitude, Latitude, (select Favorite_Station.ID_Station from Favorite_Station where ID_User = ${req.user.id} and Favorite_Station.ID_Station = Station_Coordinates.ID_Station) as Favorite from Station_Coordinates where ID_Station = '${ID_Station}';`
    if (isFavorite == "true") {
        requestStr = `IF NOT EXISTS (select * from Favorite_Station where ID_Station = '${ID_Station}' and ID_User = ${req.user.id}) insert into Favorite_Station(ID_User, ID_Station) values (${req.user.id}, '${ID_Station}');` + requestStr;
    } else {
        requestStr = `delete from Favorite_Station where ID_User = ${req.user.id} and ID_Station = '${ID_Station}';` + requestStr;
    }
    var connection = new Connection(configDB.user(req.user));
    connection.connect();
    connection.on('connect', function(err) {
        request = new Request(requestStr, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                console.log(err);
                res.status(500).send('Server error');
            } else {
                res.json(row);
            }
        });
        request.on("row", columns => {
            columns.forEach(column => {
              row[column.metadata.colName] = column.value;
            });
          });
        connection.execSql(request);
    })
});

// @route    GET api/station
// @desc     Get station list by url params
// @access   Public
router.get('/', auth, async (req, res) => {
    var url = req.query;
    var connection = new Connection(configDB.user(req.user));
    connection.connect();
    connection.on('connect', function(err) {
        var all = [];
        let requestStr = `select ID_Station, Name, Status, ID_Server, ID_SaveEcoBot, Longitude, Latitude, (select Favorite_Station.ID_Station from Favorite_Station where ID_User = ${req.user.id} and Favorite_Station.ID_Station = Station_Coordinates.ID_Station) as Favorite from Station_Coordinates`;
        let favStr = "";
        let orderStr = "";

        if (url.searchString) {
            requestStr += ` where CHARINDEX('${url.searchString}', CONCAT(ID_Station, Name)) != 0`;
        }

        if (url.onlyFav) {
            if (url.onlyFav == "true") {
                favStr = (url.searchString ? " and": " where") + ` exists (select * from Favorite_Station where ID_User = ${req.user.id} and Favorite_Station.ID_Station = Station_Coordinates.ID_Station)`;
            }
        }

        if (url.order == "idUp") {
            orderStr = " order by ID_Station";
        } else if (url.order == "idDown") {
            orderStr = " order by ID_Station DESC";
        }

        request = new Request(requestStr + favStr + orderStr, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                console.log(err);
                res.status(500).send('Server error');
            } else {
                res.json(all);
            }
        });
        request.on("row", columns => {
            var row = {};
            columns.forEach(column => {
              row[column.metadata.colName] = column.value;
            });
            all.push(row);
          });
        connection.execSql(request);
    })
});

module.exports = router;