angular.module('emeapp', ['ngCordova', 'base64', 'angular-websql', 'ionic', 'emeapp.controllers', 'ngStorage', 'slickCarousel'])

.run(function($rootScope,$ionicPlatform,$ionicHistory, $ionicPopup, $ionicSideMenuDelegate,$localStorage,$cordovaGeolocation,$state,$timeout,$http,$ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    $ionicSideMenuDelegate.canDragContent(false);

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);
      cordova.plugins.Keyboard.shrinkView(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }


  }); /* Fin Ready */


  $rootScope.cerrarSesion = function() {
    $rootScope.confirmar('¿Desea realmente cerrar su sesión?', function() {
      $ionicSideMenuDelegate.toggleLeft();
      $localStorage.emeapp = {auth: 0, id: '', nombre: '', correo: '', clave: '', foto: ''};
      $state.go( "login" );
    });
  };


  $rootScope.err = function(msg) {
     var alertPopup = $ionicPopup.alert({
       title: 'Error',
       template: (msg ? msg : 'Error al consultar el servicio. Intente más tarde'),
       buttons: [{
        text: 'Aceptar',
        type: 'button-eme'
        }]
     });

     alertPopup.then(function(res) {
       $("body").removeClass("modal-open");
     });
  };
  $rootScope.ok = function(msg) {
    
     var alertPopup = $ionicPopup.alert({
       title: 'Listo',
       template: (msg ? msg : 'Operación realizada'),
       buttons: [{
        text: 'Aceptar',
        type: 'button-eme'
        }]
     });

     alertPopup.then(function(res) {
      $("body").removeClass("modal-open");
      alertPopup.close();
     });
     
     //alert(msg);
  };
  $rootScope.confirmar = function(msg, callback,no) {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Confirmar',
     template: (msg ? msg : '¿Desea continuar?'),
     buttons: [
      { 
        text: 'No', 
        type: 'button-stable',
        onTap: function(e) { if (no) { $("body").removeClass("modal-open"); no(); } } 
      },
      {
        text: '<b>Aceptar</b>',
        type: 'button-bligo',
        onTap: function(e) {
          $("body").removeClass("modal-open");
          callback();
        }
      },
     ]
   });
  };

  $rootScope.showload = function(msg) { $ionicLoading.show({ template: '<ion-spinner></ion-spinner>'+(msg ? '<br>'+msg : '') }).then(function(){}); };
  $rootScope.hideload = function(){ $ionicLoading.hide().then(function(){ }); };

  if ($localStorage.emeapp) { 
    if ($localStorage.emeapp.auth == 1) { $state.go("main.home"); }
    else { $state.go("login"); }
  }
  else {
    $state.go("login");
  }

})
.directive('elastic', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, element) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                var resize = function() {
                    element[0].style.height = $scope.initialHeight;
                    element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                element.on("input change", resize);
                $timeout(resize, 0);
            }
        };
    }
])

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  $ionicConfigProvider.views.maxCache(0);

  $stateProvider
  .state('login', {
    url: '/login',
    cache: false,
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('main', {
    url: '/main',
    abstract: true,
    templateUrl: 'templates/main.html',
    controller: 'MainCtrl'
  })

  .state('main.contratos', {
    url: '/contratos',
    views: {
      'menuContent': {
        templateUrl: 'templates/contratos.html',
        controller: 'ContratosCtrl'
      }
    },
    params : {
      reloadPrecios: 0
    }
  })
  .state('main.activo', {
    url: '/activo',
    views: {
      'menuContent': {
        templateUrl: 'templates/activo.html',
        controller: 'ActivoCtrl'
      }
    },
    params : {
      reloadPrecios: 0
    }
  })

  .state('main.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    },
    params : {
      reloadPrecios: 0
    }
  });
  // if none of the above states are matched, use this as the fallback
  //abstract: true,
  //$urlRouterProvider.otherwise('/login');
});