const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
//const { check, validationResult } = require('express-validator');
const configDB = require('../../config/db');
const { Connection, Request } = require("tedious");
//const { request } = require('express');

// @route    POST api/measurement/
// @desc     Get measurement optimal value list
// @access   Public
router.post('/optimalValue', auth, async (req, res) => {
    const {ID_Measured_Unit} = req.body;
    var connection = new Connection(configDB.user(req.user));
    connection.connect();
    connection.on('connect', function(err) {
        var all = [];
        request = new Request(`select * from Optimal_Value_Category
                                where ID_Measured_Unit = ${ID_Measured_Unit};`, function(err, rowCount, rows) {
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