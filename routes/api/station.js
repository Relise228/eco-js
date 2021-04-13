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

// @route    GET api/station
// @desc     Get station list by url params
// @access   Public
router.get('/', auth, async (req, res) => {
    var url = req.query;
    var connection = new Connection(configDB.user(req.user));
    connection.connect();
    connection.on('connect', function(err) {
        var all = [];
        let requestStr = "select * from Station_Coordinates";
        let orderStr = "";

        if (url.searchString) {
            requestStr = `select *
            from Station_Coordinates
            where CHARINDEX('${url.searchString}', CONCAT(ID_Station, Name)) != 0`;
        }

        if (url.order == "idUp") {
            orderStr = " order by ID_Station";
        } else if (url.order == "idDown") {
            orderStr = " order by ID_Station DESC";
        }

        request = new Request(requestStr + orderStr, function(err, rowCount, rows) {
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