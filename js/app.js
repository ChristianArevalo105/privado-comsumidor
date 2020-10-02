// app in strict mode for safely
(function() {
        'use strict';
        angular.module('app', ['ngSanitize']);
        angular.module('app').controller('ConsumerController', ConsumerController);

        angular.module('app').factory('ProductosService', function($http, $q) {
            function ProductosService() {
                var self = this;
                self.productos = null;
                self.getProducts = function() {
                    //  Create a deferred operation.
                    var deferred = $q.defer();
                    if (self.productos !== null) {
                        deferred.resolve(self.productos + " (from Cache!)");
                    } else {
                        //  Get the name from the server.
                        $http.get('privado-api.test/api/productos').success(function(productos) {
                            self.productos = productos.data;
                            deferred.resolve(productos + " (from Server!)");
                        }).error(function(response) {
                            deferred.reject(response);
                        });
                    }
                    return deferred.promise;
                }
            }
        });




        ConsumerController.$inject = ['$scope', '$filter', '$http'];

        function ConsumerController($scope, $filter, $http, ) {
            // vm controlador, en lugar de this, para evitar conflictos de scope 
            var vm = this;
            vm.productos = null;
            var onSuccess = function (data, status, headers, config) {
               $scope.data = data;
               vm.productos = data.data.data;
           };

           var onError = function (data, status, headers, config) {
               $scope.error = status;
           }
       
           var promise = $http.get("http://privado-api.test/api/productos");
               
           promise.then(onSuccess);

        }
       
        })();