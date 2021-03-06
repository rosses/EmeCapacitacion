isCordovaApp = !!window.cordova;
rest = "http://www.bligoeventos.com/sistema/ws.php";

function err(msg) {
  console.log(msg);
  if (default_app.modo == "dev") {
    alert(msg);
  }
  else {
    navigator.notification.alert(
        (msg ? msg : 'Error al consultar el servicio. Intente más tarde'),  // message
        function() { },
        'Error',
        'OK'
    );
  }
}
function ok(msg) {
  console.log(msg);
  if (default_app.modo == "dev") {
    alert(msg);
  }
  else {
    navigator.notification.alert(
        (msg ? msg : 'Operación realizada'),  // message
        function() { },
        'Listo',
        'OK'
    );
  }
}
function confirmar(msg,callback,noback) {
  console.log('Confirmar: '+msg);
  if (default_app.modo == "dev") {
    if (confirm(msg ? msg : '¿Desea continuar?')) {
      callback();
    }
    else {
      noback();
    }
  }
  else {
    navigator.notification.confirm(
        (msg ? msg : '¿Desea continuar?'),  // message
        function(boton) { if (boton == 1) { callback(); } else { noback(); }},
        'Confirmar',
        ['Si', 'No']
    );
  }
}
function preguntar(msg) {
  console.log('Preguntar: '+msg);
  if (default_app.modo == "dev") {
    return prompt(msg);
  }
  else {
    navigator.notification.prompt(
        (msg ? msg : 'Ingrese monto'),  // message
        function(results) { if (results.buttonIndex == 1) { return results.input1; } else { return false; }},
        'Monto',
        ['Listo','Cancelar']
    );
  }
}


String.prototype.toBytes = function() {
    var arr = []
    for (var i=0; i < this.length; i++) {
    arr.push(this[i].charCodeAt(0))
    }
    return arr
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, o_lat, o_lng, d_lat, d_lng) {
  o_lat = parseFloat(o_lat);
  o_lng = parseFloat(o_lng);
  d_lat = parseFloat(d_lat);
  d_lng = parseFloat(d_lng);
  
  directionsService.route({
    origin: {lat: o_lat, lng: o_lng},  
    destination: {lat: d_lat, lng: d_lng},
    drivingOptions: {
      departureTime: new Date(Date.now() + 10000),  // for the time N milliseconds from now.
      trafficModel: "optimistic"
    },
    //provideRouteAlternatives: true,  
    // Note that Javascript allows us to access the constant
    // using square brackets and a string value as its
    // "property."
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    //console.log(response);
    if (response.routes[0].legs[0].duration_in_traffic.text) {
      jQuery("#div_tlr").hide();
      jQuery("#div2_tlr").show();
      jQuery("#div3_tlr").hide();
      jQuery("#timeleft_route2").html(response.routes[0].legs[0].duration_in_traffic.text);
    }
    else {
      jQuery("#div_tlr").show();
      jQuery("#div2_tlr").hide();
      jQuery("#div3_tlr").hide();
      jQuery("#timeleft_route").html(response.routes[0].legs[0].duration.text);
    }
    
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      /*
      for (var i = 0, len = response.routes.length; i < len; i++) {
        new google.maps.DirectionsRenderer({
            map: mapObject,
            directions: response,
            routeIndex: i
        });
      }
      */
    } else {
     err('Fallo servicio de direcciones ' + status);
    }
  });
}


function calculateDistance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var radlon1 = Math.PI * lon1/180
  var radlon2 = Math.PI * lon2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  if (unit=="K") { dist = dist * 1.609344 }
  if (unit=="N") { dist = dist * 0.8684 }
  return dist
}

function miles(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? ',' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
}
function validarDrut(sim,rut) {
  var soapRequest =
      '<?xml version="1.0" encoding="utf-8"?> \
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"> \
      <soapenv:Header/> \
        <soapenv:Body> \
          <dash:validaPago xmlns:dash="http://webservice_pda.v2.base.abastible.com/"> \
            <args>' + sim + '</args> \
            <pagos> \
              <pago> \
                <DDV_CODIGO>'+rut+'</DDV_CODIGO> \
                <DDV_MONTO></DDV_MONTO> \
                <MA_CODIGO></MA_CODIGO> \
                <MA_CANTIDAD></MA_CANTIDAD> \
                <TEL_CODIGO>DRUT</TEL_CODIGO> \
              </pago> \
            </pagos> \
          </dash:validaPago> \
        soap:Envelopeenv:Body> \
      soap:Envelopeenv:Envelope>';

  return $.when(jQuery.ajax({
    type: "POST",
    url: default_app.wsdash,
    contentType: "text/xml",
    dataType: "xml",
    data: soapRequest
  }));
};

function validarPromocion(sim,promo) {
  var soapRequest =
      '<?xml version="1.0" encoding="utf-8"?> \
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"> \
      <soapenv:Header/> \
        <soapenv:Body> \
          <dash:validaPago xmlns:dash="http://webservice_pda.v2.base.abastible.com/"> \
            <args>' + sim + '</args> \
            <pagos> \
              <pago> \
                <DDV_CODIGO>'+promo+'</DDV_CODIGO> \
                <DDV_MONTO></DDV_MONTO> \
                <MA_CODIGO></MA_CODIGO> \
                <MA_CANTIDAD></MA_CANTIDAD> \
                <TEL_CODIGO>VAL</TEL_CODIGO> \
              </pago> \
            </pagos> \
          </dash:validaPago> \
        soap:Envelopeenv:Body> \
      soap:Envelopeenv:Envelope>';

  return $.when(jQuery.ajax({
    type: "POST",
    url: default_app.wsdash,
    contentType: "text/xml",
    dataType: "xml",
    data: soapRequest
  }));
};

function validarCupon(sim,cupon) {
  var soapRequest =
      '<?xml version="1.0" encoding="utf-8"?> \
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"> \
      <soapenv:Header/> \
        <soapenv:Body> \
          <dash:validaPago xmlns:dash="http://webservice_pda.v2.base.abastible.com/"> \
            <args>' + sim + '</args> \
            <pagos> \
              <pago> \
                <DDV_CODIGO>'+cupon+'</DDV_CODIGO> \
                <DDV_MONTO></DDV_MONTO> \
                <MA_CODIGO></MA_CODIGO> \
                <MA_CANTIDAD></MA_CANTIDAD> \
                <TEL_CODIGO>CUP</TEL_CODIGO> \
              </pago> \
            </pagos> \
          </dash:validaPago> \
        soap:Envelopeenv:Body> \
      soap:Envelopeenv:Envelope>';

  return $.when(jQuery.ajax({
    type: "POST",
    url: default_app.wsdash,
    contentType: "text/xml",
    dataType: "xml",
    data: soapRequest
  }));
};


$.whenAll = function( firstParam ) {
    var args = arguments,
        sliceDeferred = [].slice,
        i = 0,
        length = args.length,
        count = length,
        rejected,
        deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise )
            ? firstParam
            : jQuery.Deferred();
    
    function resolveFunc( i, reject ) {
        return function( value ) {
            rejected |= reject;
            args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
            if ( !( --count ) ) {
                // Strange bug in FF4:
                // Values changed onto the arguments object sometimes end up as undefined values
                // outside the $.when method. Cloning the object into a fresh array solves the issue
                var fn = rejected ? deferred.rejectWith : deferred.resolveWith;
                fn.call(deferred, deferred, sliceDeferred.call( args, 0 ));
            }
        };
    }
    
    if ( length > 1 ) {
        for( ; i < length; i++ ) {
            if ( args[ i ] && jQuery.isFunction( args[ i ].promise ) ) {
                args[ i ].promise().then( resolveFunc(i), resolveFunc(i, true) );
            } else {
                --count;
            }
        }
        if ( !count ) {
            deferred.resolveWith( deferred, args );
        }
    } else if ( deferred !== firstParam ) {
        deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
    }
    return deferred.promise();
};

Number.prototype.padLeft = function(base,chr){
   var  len = (String(base || 10).length - String(this).length)+1;
   return len > 0? new Array(len).join(chr || '0')+this : this;
}

document.addEventListener("deviceready", onDeviceReadyPG, false);

function onDeviceReadyPG() {
  cordova.plugins.backgroundMode.enable();
  setTimeout(function() {
    //alert(JSON.stringify(navigator.splashscreen));
    navigator.splashscreen.hide();
  }, 500);

  /*document.addEventListener("backbutton", function (e) {
      e.preventDefault();
  }, false );*/
}
