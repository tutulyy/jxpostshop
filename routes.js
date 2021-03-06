/**
 * Module dependencies.
 */


var goods = require('./controller/goods');
var account = require('./controller/account');
/*var view = require('./controllers/view')
    ,adminManage = require('./controllers/adminManage')
    ,c_machine = require('./controllers/C_machine')
    ,c_department = require('./controllers/C_department')
    ,c_type = require('./controllers/C_type');*/

module.exports = function (app) {

    app.get('/', goods.getGoodsList);
    app.get('/good/*', goods.getGood);
    app.post('/goodsbyid', goods.getGoodsById);

    app.get('/checkout', account.getCheckout);
    // home page
    /*app.get('/', view.index);
    app.get('/index', view.index);
    app.get('/admin', view.admin);
    app.get('/addMachine', view.addMachine);
    app.get('/manage', view.manage);

    app.get('/dropDatabase', adminManage.dropDB);
    app.get('/createDatabase', adminManage.createDB);

    app.get('/getMachineInfoByBarcode', c_machine.getInfoByBarcode);
    app.post('/addMachine', c_machine.addMachine);
    app.post('/changeMachine', c_machine.changeMachine);
    app.get('/getMachinesByTypeDepartment', c_machine.getMachinesByTypeDepartment);

    app.get('/getDepartment', c_department.getInfoAll);
    app.post('/addDepartment', c_department.addDepartment);

    app.get('/getType', c_type.getInfoAll);
    app.post('/addType', c_type.addType);
*/

};