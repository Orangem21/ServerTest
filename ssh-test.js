var Client = require('ssh2').Client;

var command_list = ['ping 192.168.1.1',
  'top',
  'pwd',
  'history',
  'pwd',
  "tail /var/log/dmesg",
  "echo hello world"]

var asset_arr = [
  { ip: '192.168.1.136', id: '118c826c864f4b8cbe3635e307fd7f04' },
  { ip: '192.168.1.232', id: '29e599253287448bbcdb490dd19aed04' },
  { ip: '192.168.1.234', id: 'e3fe078763e5407589312085dd9054cc' },
  // {ip:'192.168.1.245',id:'fa9977f1-2540-4578-9e0a-fd1b7f8076b0'},
  { ip: '192.168.1.240', id: '0127ec8786014c76996c1a312ab74081' },
  { ip: '192.168.1.231', id: '451f4250-247c-411b-8f7a-dbc124d95266' }


  // 'fa9977f1254045789e0afd1b7f8076b0',
  // '454b50b4c17c4d069711a10ebbdc6251',
  // 'b344d4980aef4e2d8624591d4fc66bfe',
  // '42f3453d1f694949ae2b7e66623a064d',
  // '5371a2395c25432a958eac64983ab28b'
]


var userAndPass = [
  { username: 'testuser', password: 'Calong@2015' },
  { username: 'testuser2', password: 'Calong@2015' },
  { username: 'testuser3', password: 'Calong@2015' }
]

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


function randomCmd() {
  var index = getRandomInt(command_list.length)
  return command_list[index]
}

function randomuser() {

  var index = getRandomInt(userAndPass.length)
  return userAndPass[index]
}

var user = randomuser();

var conn = new Client();
conn.on('ready', function () {
  console.log('Client :: ready');

  // conn.exec('ls', function(err, stream) {
  //   if (err) throw err;
  //   stream.on('close', function(code, signal) {
  //     console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
  //     conn.end();
  //   }).on('data', function(data) {
  //     console.log('STDOUT: ' + data);
  //   }).stderr.on('data', function(data) {
  //     console.log('STDERR: ' + data);
  //   });
  // });

  var streamend = 0;

  conn.shell({ pty: true }, function (err, stream) {
    if (err) throw err;
    stream.on('close', function () {
      console.log('Stream :: close');
      conn.end();
    }).on('data', function (data) {
      console.log('STDOUT: ' + data);
      streamend = 1;

      setTimeout(function () {
        streamend = 0;
      }, 2000, 'funky');

    }).stderr.on('data', function (data) {
      console.log('STDERR: ' + data);

    });
    var cmd = randomCmd()
    console.log(cmd)
    var times = 0;
    var tick = setInterval(function () {
      if (streamend == 0) {
        times++;
        if (times == 1) {
          stream.write('p\n');

        }
        if (times == 2) {
          var vmIndex = getRandomInt(asset_arr.length)
          stream.write(vmIndex + '');
          stream.write('\n');

        }
        if (times == 3) {
          clearInterval(tick)

          var cmdInterval = setInterval(function () {
            if (streamend == 0) {
              var cmd = randomCmd()
              stream.write('\x03\x0d');
              stream.write(cmd);
              stream.write('\n');
            }

          }, 4000);
        }
      }

    }, 2000);








    // stream.end('ls -l\nexit\n');
  });
}).connect({
  // "debug": function (err) {
  //       console.log(err);
  //   },
  host: '192.168.1.74',
  port: 2222,
  // username: 'root',
  // password: 'Calong@2015'
  username: user.username,
  password: user.password
});

// var Connection = require('ssh2');

// var c = new Connection();

// c.on('ready', function() {
//    c.shell(onShell);
// });

// var onShell = function(err, stream) { 
//     if (err != null) {
//         console.log('error: ' + err);
//     }

//     stream.on('readable', function() {
//         var chunk;
//         while (null !== (chunk = stream.read())) {
//             console.log(chunk)
//             console.log('got %d bytes of data', chunk.length);
//         }
//     });
//     stream.write('pwd');
//     stream.write('ls\r\n');

//     console.log('Shell');

// }

// c.connect({
//     host: '192.168.1.74',
//     port: 22, 
//     username: 'root',
//     password: 'Calong@2015'
// });