$(function () {

    $('#circularG').show();

	window.fbAsyncInit = function() {
	    FB.init({appId: /*'000000000000000'*/, status: true, cookie: true, xfbml: true});

	    FB.getLoginStatus(function(response) {
			Login();
		});

    	$('#loginB').show();
   		$('#circularG').hide();
	};
	
	$('body').append('<div id="fb-root"></div>');
	$.getScript(document.location.protocol + '//connect.facebook.net/en_US/all.js');

	// ************************************************************************************** Buttons and selects
	// ********************************** MENU
	/* Play button */
	$('#jugar').click(function() {
		comenzar();
	});
	$('#compartir').click(function() {
		compartir();
	});
	$('#resetear').click(function() {
		tablero();
		comenzar();
	});
	tablero();

});

	var valor = 0;
	var valor2 = 0;
	var lugar;
	var lugar2;
	var ubicacion;
	var ubicacion2;
	var lugares = [];
	var timeout;
	var puntaje;
	var cantAciertos; 
	var cantErrores; 
 	var idChequeo = "0";
 	var acierto;
 	var medidorMultiplicador = 0;
 	var multiplicador;
 	var marcado = true;
 	var logeadoFacebook = false;
 	var friendsActive = false;
 	var amigos = {};
 	var	amigo = 0;


 	var documentWidth = $(document).width(); 
	var documentHeight = $(document).height();
	$("#back").attr("style", "width:"+documentWidth+"px;height:"+documentHeight+"px")

	// ********************************** IN GAME
	/* Select of two numbers in game */
	$('#numeros').on("click", ".back", function (event) {
		idChequeo = "0";
		acierto = false;
		if (+valor == 0 && $(this).attr('value')) {
			valor = $(this).attr('value');
			if (valor != "x") {
				ubicacion = $(this).attr('id');
				ubicacion2 = "";
				$('#'+ubicacion+"M").addClass("select");
			} else {
				valor = 0;
			}
		} else if (+valor2 == 0 && ubicacion != $(this).attr('id') && $(this).attr('value')) {
			valor2 = $(this).attr('value');
			ubicacion2 = $(this).attr('id');
			$('#'+ubicacion2+"M").addClass("select");
					
			var suma = +valor + +valor2;
			chequeo(suma, ubicacion, ubicacion2);
			ubicacion = "";
			ubicacion2 = "";
		} else {
			valor = 0;
			valor2 = 0;
			$('#'+ubicacion+"M").removeClass("select");
			$('#'+ubicacion2+"M").removeClass("select");
		}
	});

	// ************************************************************************************** Functions
	function comenzar() {
		puntaje = 0; 
		cantAciertos = 0;
		cantErrores = 0; 
		multiplicador = 1;
		timeout = 3000;
		amigo = 0;
		lugares = ["place1","place2","place3","place4","place5","place6","place7","place8",
	"place9","place10","place11","place12","place13","place14","place15","place16","place17",
	"place18","place19","place20","place21","place22","place23","place24","place25","place26"
	,"place27","place28","place29","place30"];
		$("#puntos").html(0);
		$("#multiplicador").html("x"+multiplicador);
		$('#jugar,#back,#tutorial').hide('fast');

		reloj(timeout);
	}

	/* Calculate the dificult of levels */
	function calcularNivel() {
		var nivel = 1;	
		var repeticion = 1; var rangoA = 5;	var rangoB = 15;  
		
		if (puntaje > 100 && puntaje < 150) {
			repeticion = 1;	rangoA = 5;	rangoB = 15; marcado = false; timeout = 4000;
		} else if (puntaje >= 150 && puntaje < 1000) {
			repeticion = 2;	rangoA = 5;	rangoB = 15; marcado = false; timeout = 10000;
		} else if (puntaje >= 1000 && puntaje < 2000) {
			repeticion = 2;	rangoA = 5;	rangoB = 25; marcado = false; timeout = 8500;
		} else if (puntaje >= 2000 && puntaje < 4000) {
			repeticion = 2;	rangoA = 5;	rangoB = 35; marcado = false; timeout = 7500;
		} else if (puntaje >= 5000 && puntaje < 7000) {
			repeticion = 2;	rangoA = 15; rangoB = 35; marcado = false; timeout = 7000;
		} else if (puntaje >= 7000 && puntaje < 9000) {
			repeticion = 2;	rangoA = 15; rangoB = 45; marcado = false; timeout = 6000;
		} else if (puntaje >= 9000 && puntaje < 12000) {
			repeticion = 2;	rangoA = 20; rangoB = 55; marcado = false; timeout = 5500;
		} else if (puntaje >= 12000 && puntaje < 15000) {
			repeticion = 2;	rangoA = 25; rangoB = 65; marcado = false; timeout = 5500;
		} else if (puntaje >= 15000 ) {
			repeticion = 2;	rangoA = 15; rangoB = 75; marcado = false; timeout = 4000;
		} 	 		 		 						
		
		reloj(timeout);
		trioNumeros(rangoA, rangoB, repeticion, marcado);	
	}
	
	// ********************************** IN GAME
	/* Calculate all the numbers */
	function trioNumeros(min, max, repeat, mark) {
		var resultados = [];
		// Three numbers for pass
		for (var i = 0; i < repeat;) {
			// Obtain a random number
			var resultadoRandom = Math.floor(Math.random() * (max - min + 1)) + min;	
			var minimo = 3;
			// Obtain two numbers from the last random number
			var numUno = Math.floor(Math.random() * (resultadoRandom - minimo + 1)) + minimo;
			var numDos = resultadoRandom - numUno;
			
			if ($.inArray(resultadoRandom, resultados)==-1 &&
			 	$.inArray(numUno, resultados)==-1 && 
			 	$.inArray(numDos, resultados)==-1 && 
			 	resultadoRandom != numUno &&
			 	numUno != numDos &&
			 	resultadoRandom != numDos) {
				var count = resultados.length;
				// Save in a array the three numbers
				resultados[count] = +resultadoRandom;
				resultados[count+1] = numUno;
				resultados[count+2] = numDos;
				i++
			} 
		}
		lugares.sort(function() { return 0.5 - Math.random() });		
		imprimirNumero(resultados, lugares, mark);
	}

	/* Show the numbers */
	function imprimirNumero(valor, id, marcado) {
		for (var i = 0; i < valor.length; i++) {
			if (marcado) {
				if (i==0 || i==3 || i==6 || i==9 || i==12) {
					$("#"+id[i]).addClass('sumaNumber');
				}
			}
			$("#"+id[i]).html('<div class="but"></div><div class="butRight"></div>'+valor[i]);
			$("#"+id[i]).attr("value", valor[i]);
			$("#"+id[i]).addClass('number');
			
			$("#"+id[i]+"M").find('.card').addClass('flipped');
			
			id.splice(i,1);
		}
		if (id.length < 1) {
			finalizo();
		}
	}

	/* Check if the selection is correct */
	function chequeo(total, lugar, lugar2) {
		$("[value='"+total+"']").each(function() {
			if (idChequeo == "0") {
				idChequeo = $(this).attr('id');
				if ($('#'+idChequeo).attr('value') == +total) {
		            $('#'+lugar).html('');
		            $('#'+lugar2).html('');
		            $('#'+idChequeo).html('');
		            $('#'+lugar).attr('value','');
		            $('#'+lugar2).attr('value','');
		            $('#'+idChequeo).attr('value','');
	      			$('#'+lugar).removeClass('number');
	      			$('#'+lugar2).removeClass('number');
	      			$('#'+idChequeo).removeClass('number');
	      			$('#'+idChequeo).removeClass('sumaNumber');
	      			$('#'+lugar2+"M").find('.card').removeClass('flipped');
	      			$('#'+lugar+"M").find('.card').removeClass('flipped');
	      			$('#'+idChequeo+"M").find('.card').removeClass('flipped');

		            lugares.push(lugar, lugar2, idChequeo);
		            acierto = true;
		        }	
		    } 
        });     
        CalculoPuntaje(acierto);
    			
		valor = 0;
		valor2 = 0;

		$('#'+ubicacion+'M').removeClass("select");
		$('#'+ubicacion2+'M').removeClass("select");
	}

	/* Function of the timer */
	var timer = $.timer(function() {
			calcularNivel();
	});

	/* Show the clock and initiate the timer */
	function reloj(tiempo) {
		timer.stop();
		timer.set({time:tiempo, autostart:true});
	}

	function CalculoPuntaje(bool) {
		if (bool) {
			cantAciertos++;
			puntaje += 25*multiplicador; 
			//TODO sumar puntaje general segun los sg transcurridos
			medidorMultiplicador++;
			if (medidorMultiplicador == 5) {
				multiplicador++;
				medidorMultiplicador = 0;
				$("#multiplicador").html("x"+multiplicador);
			}
			$("#puntos").html(puntaje);
		} else {
			cantErrores++;
			medidorMultiplicador = 0;
			multiplicador = 1;
			$("#multiplicador").html("x"+multiplicador);
		}
	}

	function tablero() {
		var tableroT = "";
		for (var i = 1; i <= 30; i++) {
			tableroT += '<div id="place'+i+'M" class="flip"><div class="card"><div class="face front color'+i+'"><div class="eye parpadeo'+i+'"></div><div class="eye parpadeo'+i+'"></div><div class="mouth"></div></div>	<div id="place'+i+'" class="face back color'+i+'"></div></div></div>';
		}
		$('#numeros').html(tableroT);
	}

	function finalizo() {
		timer.stop();
		console.log(puntaje);
		shareXHR(puntaje);
		$('#jugar,#back,#tutorial').show('fast');
		//$('.container').attr('style','width:740px');
		puntaje = 0;
		multiplicador = 1;
		$("#puntos").html(0);
		$("#multiplicador").html("x"+multiplicador);
		tablero();
	}

//************************************RANKING
	function getScore() {
		FB.api('/me/friends/', 'get', function(response) {
			console.log(response.data);
			if (response && !response.error) {
				$.each(response.data, function(ind, dataResponse) {
					callbackGetFriendsScore(dataResponse.id);
					console.log("1.0 amigo");
				});
				console.log("1.1 se obtienen amigos");
		    }
	    });	

		scorePropio();
	}

	function callbackGetFriendsScore(id){
		FB.api('/'+id+'/scores/', 'get', function(response) {
			console.log(response);
			if (response && !response.error) {
				$('#puestos').html('');

				$.each(response.data, function(ind, dataResponse) {
					console.log("2.pre score amigo"+dataResponse.user.name+dataResponse.application.id);
					if (dataResponse.application.id == /*00000000000000000*/) {
						amigos[dataResponse.user.name] = dataResponse.score;
						console.log("2.0 score amigo"+dataResponse.user.name+dataResponse.application.id );
					}

				});
				console.log("2.1 se obtiene puntaje de amigo");

				var arr = sortObject(amigos);
				$.each(arr, function(i,data){
					printScore(data,i);
				});
				console.log("3.1 se ordena la tabla y se muestra");
		    }
		});
	}

	function scorePropio() {
		FB.api('/me/scores/', 'get', function(response) {
			if (response && !response.error) {
				$.each(response.data, function(ind, dataResponse) {
					if (dataResponse.application.id == /*00000000000000000*/) {
						amigos[dataResponse.user.name] = dataResponse.score;
						console.log("3.0 score mio");
					}
				});
		    }
		});
	}

	function sortObject(obj) {
	    var arr = [];
	    for (var prop in obj) {
	        if (obj.hasOwnProperty(prop)) {
	            arr.push({
	                'key': prop,
	                'value': obj[prop]
	            });
	        }
	    }
	    arr.sort(function(a, b) { return b.value - a.value; });
	    return arr; 
	}

	function shareXHR(User) {
		FB.api('/me/scores/', 'get', function(response) {
			if (response && !response.error) {
				callbackXHR(response, User);
			}
		});
	}

	encontrado = false;
	var high; 
	function callbackXHR(responseCall, suser) {
		var index;
		$.each(responseCall.data, function(ind, dataResponse) {
			$.each(dataResponse.application, function(i, v) {
			    if (dataResponse.application.id == "1437150286538966") {
    				index = ind;
			    	encontrado = true;
			        return;
			    }
		    });

		});

		if (encontrado) {
			lag = responseCall.data[index].score;
			if (suser > lag) { 
				post(suser);
			}
		} else {
			post(suser);
		}
	}

	function printScore(results, number) {
		var userName = results['key'];
		var userScore = results['value'];
		var userPuesto = number+1;

		console.log("4.0 se imprimen puntajes");

		$('#puestos').append(''+
   		 '<li><span>'+userPuesto+'°</span>'+userName+'<span>'+userScore+'</span></li>'+
   		'');
	}

function Login() {
  $('#loginB').hide();
  $('#circularG').show();

  FB.login(function (response) {
    if (response.authResponse) {
    	$('#circularG').hide();
    	$('#logoutB').show();
		getScore();
	} else {
      alert("Error conectando con Facebook.");
        $('#logoutB').hide();
    	$('#loginB').show();
    }
  }, { scope: 'public_profile, publish_actions, user_games_activity, friends_games_activity, user_friends' });
}

function Logout() {
  	FB.logout(function () { document.location.reload(); });
}

function compartir() {
	FB.ui({
	  method: 'share_open_graph',
	  action_type: 'og.likes',
	  action_properties: JSON.stringify({
	      object:'https://apps.facebook.com/colmate/',
	  })
	}, function(response){});
}