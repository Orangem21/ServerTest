const fs = require('fs');
const child_process = require('child_process');

var pid = 0;
var pcs_count = 0;
var target = 50;
var tick = setInterval(function () {

   if (pcs_count < target) {
      var workerProcess = child_process.spawn('node', ['mock-ssh-interval-break.js', pid]);
      pcs_count++;
      pid++;
      console.log('create process ' + pid);

      workerProcess.stdout.on('data', function (data) {
         console.log('stdout: ' + data);
      });

      workerProcess.stderr.on('data', function (data) {
         console.log('stderr: ' + data);
      });

      workerProcess.on('close', function (code) {
         pcs_count--;
         console.log('子进程已退出，退出码 ' + code);
      });
   }
}, 5000);

// for(var i=0; i<5; i++) {
//    var workerProcess = child_process.spawn('node', ['client-break.js', i]);

//    workerProcess.stdout.on('data', function (data) {
//       console.log('stdout: ' + data);
//    });

//    workerProcess.stderr.on('data', function (data) {
//       console.log('stderr: ' + data);
//    });

//    workerProcess.on('close', function (code) {
//       console.log('子进程已退出，退出码 '+code);
//    });
// }