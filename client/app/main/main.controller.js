'use strict';

angular.module('getirApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];

//socket.emit('courierLogin', { name: 'courier1' ,latitude: 34234,longitue: 2323});

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      //socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }

    
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      //socket.unsyncUpdates('thing');
    });
  });
