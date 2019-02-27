/*
 *  First I will patch the xmlhttprequest library that socket.io-client uses
 *  internally to simulate XMLHttpRequest in the browser world.
 */
var originalRequest = require('xmlhttprequest').XMLHttpRequest;

require('xmlhttprequest').XMLHttpRequest = function(){
  originalRequest.apply(this, arguments);
  this.setDisableHeaderCheck(true);
  var stdOpen = this.open;

  /*
   * I will patch now open in order to set my cookie from the jar request.
   */
  this.open = function() {
    stdOpen.apply(this, arguments);
    var header = j.get({ url: 'http://192.168.1.74:8088/login/' })
      .map(function (c) {
        return c.name + "=" + c.value;
      }).join("; ");
      
    this.setRequestHeader('cookie', header);
  };
};


/*
 * Authenticate first, doing a post to some url 
 * with the credentials for instance
 */
 

// request('http://192.168.1.74:8088/users/login/',function(err, res,body) {
	
// 	var secret = extractCsrfToken(res);
// 	var token = genCsrf(secret);
// 	console.log(token)
// 	request.post({
// 	  jar: j,
// 	  url: 'http://192.168.1.74:8088/users/login/',
// 	  form: {username: 'testuser', password: 'Calong@2015',csrfmiddlewaretoken: secret ,_csrf: token}
// 	}, function (err, resp, body){


// 	  /*
// 	   * now we can connect.. and socket.io will send the cookies!
// 	   */
// 	   // console.log(resp)
// 	  var socket = io.connect('ws://192.168.1.74:8088/ssh', {
// 	  path: '/socket.io'
// 	});
// 	  socket.on('connect', function(){
// 	    console.log('connected! handshakedddddddddddd')
	    
// 	  });

// 	});
// });



// function extractCsrfToken(res) {
//  var $ = cheerio.load(res.body);
//  return $('[name=csrfmiddlewaretoken]').val();
// }

// function genCsrf(tex){
// 	return csrf.create(tex);
// }