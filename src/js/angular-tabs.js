(function () {
    'use strict';

    var routeProvider;
    var app = angular.module('angularTabs', ['ngRoute', 'oc.lazyLoad']);

    app.config(function ($routeProvider, $controllerProvider) {
        routeProvider = $routeProvider;
        angular.module('ngApp').controller = $controllerProvider.register;
    });

    app.directive('angularTabs', ['$timeout', '$route', '$location', '$minutephp', function ($timeout, $route, $location, $minutephp) {
        return {
            restrict: 'A',
            replace: true,
            scope: {angularTabs: "="},
            templateUrl: '/static/bower_components/angular-tabs/src/templates/angular-tabs.html',
            controller: function ($scope) {
                $scope.extend = function (init, data) {
                    $minutephp.extend.call(this, this, init, data);
                };

                $scope.$watch('angularTabs', function (tabs) {
                    if (tabs) {
                        for (var i = tabs.length - 1; i >= 0; i--) {
                            var tab = tabs[i];
                            routeProvider.when('/' + tab.href, {templateUrl: tab.url, reloadOnSearch: true});

                            if (i == 0) {
                                routeProvider.otherwise('/' + tab.href);
                                $timeout($route.reload);
                            }
                        }
                    }
                });

                $scope.$on('$routeChangeSuccess', function () {
                    var route = $route.current.$$route || {originalPath: '', templateUrl: $location.url()};
                    $scope.href = route.originalPath.replace(/^\//, '');
                    $scope.url = route.templateUrl;

                    $minutephp.setSelfURL($scope.url);
                });
            }
        };
    }]);
})();


