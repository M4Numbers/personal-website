/**
 * Created by M4Numbers on 21/03/2016.
 */

(function() {

    var app = angular.module('m4numbers', []).config(function($interpolateProvider){
        $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    });

    app.controller('LoadingController', [ '$scope', '$http', '$log', function($scope, $http, $log) {

        $scope.offset = 1;
        $scope.content = [];

        this.checkContentEmpty = function() {
            return !$scope.content.length;
        };

        this.getContent = function() {
            return $scope.content;
        };

        this.loadMore = function(mode) {
            $http.get('/scripts/load_mode.php',
                {params: {offset: $scope.offset, mode: mode}})
                .then(function successCallback(data){
                $scope.content.push.apply($scope.content, data.data);
                $scope.offset = $scope.offset + 1;
            }, function errorCallback(response) {
                $log.log(response);
            });
        };

    }]);

    app.directive('animeTemplate', function(){
        return {
            restrict: 'E',
            templateUrl: '/scripts/angular/anime-template.html'
        };
    });

    app.directive('mangaTemplate', function(){
        return {
            restrict: 'E',
            templateUrl: '/scripts/angular/manga-template.html'
        }
    });

    app.directive('videoTemplate', function(){
        return {
            restrict: 'E',
            templateUrl: '/scripts/angular/video-template.html'
        };
    });

})();