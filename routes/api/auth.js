const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const configDB = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Connection, Request } = require("tedious");
const config = require('config');

// @route    GET api/auth
// @desc     Test route
// @access   Public
router.get('/', auth, async (req, res) => {
    console.log(req.user);
    var connection = new Connection(configDB.user(req.user));
    connection.connect();
    connection.on('connect', function(err) {
        var all = [];
        request = new Request("select * from station", function(err, rowCount, rows) {
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

// @route    POST api/auth
// @desc     Authenticate client & get token
// @access   Public
router.post('/', [
    check('login', 'Login is qrequired').exists(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() });
    }


    const {password, login} = req.body;

    var connection = new Connection(configDB.master);
    connection.connect();
    var loginResult = false;
    connection.on('connect', function(err) {
        var all = [];
        var user_id = null;
        request = new Request(`SELECT principal_id
                                from master.sys.sql_logins
                                where PWDCOMPARE('${password}', password_hash) = 1 and name = '${login}';`, function(err, rowCount, rows) {
            connection.close();
            if (err) {
                res.status(500).send('Server error');
            } else {
                if (loginResult == false) {
                    return res.json({ errors: [{ msg: 'Invalid Credentials' }] });
                }

                const payload = {
                    user: {
                        id: user_id,
                        login: login,
                        password: password
                    }
                }

                jwt.sign(
                    payload, 
                    config.get('jwtSecret'),
                    { expiresIn: 360000 },
                    (err, token) => {
                        if (err) throw err;
                        res.json({ token });
                    });
            }
        });
        request.on("row", columns => {
            if (columns[0].value != null) {
                loginResult = true;
                user_id = columns[0].value;
            }
          });
        connection.execSql(request);
    })

});

module.exports = router;