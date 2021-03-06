/**
 * Created by yzjf on 2014/10/24.
 */

var mysql = require('mysql');
var moment = require('moment');
var dbConfig = require('../config.js').dataBase;
var log = require('../controller/errLog');

var pool  = mysql.createPool({
    "host": dbConfig.config.host,
    "port": dbConfig.config.port,
    "database": dbConfig.dataTable.name,
    "multipleStatements": dbConfig.config.multipleStatements,
    "user": dbConfig.config.user,
    "password": dbConfig.config.password
});
exports.escape = function(data){
    return pool.escape(data) ;
}
var queryDbStream = function (strSqls, cb, endCb) {
    var strSql = "" ;
    for ( var i = 0 ; i < strSqls.length ; i ++ ){
        strSql += strSqls[i] ;
    }
    pool.getConnection(function(err, connection) {
        // Use the connection
        if (err) {
            cb(err);
            return ;
        }
        var query = connection.query(strSql);
        query
            .on('error', function(err) {
                // Handle error, an 'end' event will be emitted after this as well
                if (err) {
                    cb(err);
                }
            })
            .on('fields', function(fields, index) {
                // the fields for the result rows that follow
            })
            .on('result', function(row, index) {
                // index refers to the statement this result belongs to (starts at 0)
                if ( cb ){
                    cb("",row,index) ;
                }
            })
            .on('end', function() {
                // all rows have been received
                connection.release();
                endCb();
            });
    });
};
var queryDb = function (strSql, logInfo, cb) {
    if (cb === undefined){
        cb = logInfo ;
        logInfo =  moment().format('YYYY-MM-DD HH:mm:ss.SSS' + ' ');
    }
    log.info(logInfo+ strSql);
    pool.getConnection(function(err, connection) {
        if (err) {
            cb(err);
            return ;
        }
        connection.query( strSql , function(err, rows) {
            // And done with the connection.
            if (err) {
                cb(err);
                return;
            }
            cb(err, rows);

            connection.release();
            // Don't use the connection here, it has been returned to the pool.
        });
    });
};
exports.beginTransactions = function(cb){
    pool.getConnection(function(err, connection) {
        if (err) {
            cb(err);
            return ;
        }
        connection.beginTransaction(function(err) {
            if (err) {
                cb(err);
            }
            else{
                cb(null, connection) ;
            }
        });
    });
};
exports.queryTransactions = function(connection, strSql, logInfo, cb){
    if (cb === undefined){
        cb = logInfo ;
        logInfo =  moment().format('YYYY-MM-DD HH:mm:ss.SSS' + ' ');
    }
    log.info(logInfo + strSql);
    connection.query( strSql , function(err, rows) {
        if (err) {
            cb(err);
            return;
        }
        cb(err, rows);
    });
};
exports.endTransactions = function(connection, cb){
    connection.release();
};
exports.createTableDb = function (logInfo, cb) {
    queryDb(dbConfig.dataTable.create, moment().format('YYYY-MM-DD HH:mm:ss.SSS') + ' IP:' + logInfo + ' ' , function(err){
        if (err) {
            cb(err);
            return ;
        }
        else{
            var strSql = dbConfig.table.create ;
            queryDb(strSql, moment().format('YYYY-MM-DD HH:mm:ss.SSS') + ' IP:' + logInfo + ' ' , function(err){
                if (err) {
                    cb(err);
                    return ;
                }
                else{
                    log.info(logInfo ,"数据库初始化完成！" + moment().format('YYYY-MM-DD HH:mm:ss.SSS'));
                    cb();
                }
            });
        }
    });
};

exports.dropTableDb = function (logInfo, cb) {
    var strSql = "drop schema `"+ dbConfig.dataTable.name +"`;";
    queryDb(strSql, moment().format('YYYY-MM-DD HH:mm:ss.SSS') + ' IP:' + logInfo + ' ' , function(err){
        if (err) {
            cb(err);
            return ;
        }
        else{
            log.info(logInfo ,"数据库删除完成！" + moment().format('YYYY-MM-DD HH:mm:ss.SSS'));
            cb();
        }
    });
};

exports.queryDb = function (strSql, logInfo, cb) {
    queryDb(strSql,cb);
};
exports.queryDbStream = function (strSql,cb) {
    queryDbStream(strSql,cb);
};
