export default {
    'GET /api/users': { 
        users: [{ username: 'admin' }],
        list: {
            columns: [
                {
                  label: '日期',
                  prop: 'date',
                  width: 180
                },
                {
                  label: '姓名',
                  prop: 'name',
                  width: 180
                },
                {
                  label: '地址',
                  prop: 'address'
                }
              ],
              data: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
              }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
              }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
              }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
              }]
        }
     },

     'GET /api/loginLog': {
        data: [{
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.230.24.58',
          remark: '位置异常',
          error: true,
        }, {
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.21.24.58',
          remark: '位置正常',
          error: false,
        }, {
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.21.24.58',
          remark: '位置正常',
          error: false,
        }, {
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.21.24.58',
          remark: '位置正常',
          error: false,
        }, {
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.21.24.58',
          remark: '位置正常',
          error: false,
        }, {
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.21.24.58',
          remark: '位置正常',
          error: false,
        }, {
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.21.24.58',
          remark: '位置正常',
          error: false,
        }, {
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.21.24.58',
          remark: '位置正常',
          error: false,
        }, {
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.21.24.58',
          remark: '位置正常',
          error: false,
        }, {
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.21.24.58',
          remark: '位置正常',
          error: false,
        }, {
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.230.24.58',
          remark: '位置异常',
          error: true,
        }, {
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.21.24.58',
          remark: '位置正常',
          error: false,
        }, {
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.21.24.58',
          remark: '位置正常',
          error: false,
        }, {
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.21.24.58',
          remark: '位置正常',
          error: false,
        }, {
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.21.24.58',
          remark: '位置正常',
          error: false,
        }, {
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.21.24.58',
          remark: '位置正常',
          error: false,
        }, {
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.21.24.58',
          remark: '位置正常',
          error: false,
        }, {
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.21.24.58',
          remark: '位置正常',
          error: false,
        }, {
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.21.24.58',
          remark: '位置正常',
          error: false,
        }, {
          loginDateTime: '2018-07-21 15:20:10',
          loginIp: '221.21.24.58',
          remark: '位置正常',
          error: false,
        }]
    }
    
}
