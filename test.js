var io = require('socket.io-client')

const socket = io('ws://192.168.1.74:8088/ssh', {
	path: '/socket.io'
}
);
socket.on('connect', function () {
	console.log('connect to jms')

	socket.emit("token", {
		'token': token, 'secret': uuid.v4(),
		'size': [100, 140]
	});
	var tick = setInterval(function () {

		if (room != null) {
			console.log('count :' + count)

			if (count < 6) {
				console.log('wait to connect :')

			} else {

				// var processId = 1;
				var cmd = randomCmd()
				console.log("process :" + processId + ' send cmd :' + cmd)

				socket.emit("data", {
					'room': room,
					'data': '\x03\x0d'
				});

				socket.emit("data", {
					'room': room,
					'data': cmd
				});
				socket.emit("data", {
					'room': room,
					'data': '\x0d'
				});

			}

		} else {
			console.log('room is  null ')

		}
	}, 5000);



});

socket.on('data', function (data) {

	count++;
	var newroom = data['room'];

	if (room != newroom)
		room = newroom
})