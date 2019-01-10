var app = angular.module('myApp', []);

app.controller("MainCtrl", function($scope, $http){

    $scope.timeLines = [];
    $scope.searchTextCh = "";
    $scope.searchText = "";
    $scope.resultFalg = false;
    $scope.noResults = false;
    $scope.singleChar = false;
    $scope.doubleChar = false;

    $scope.getData = function(value) {

        $scope.searchTextCh = $scope.searchText;
        let url = 'http://139.59.31.152:3002/search?q=';

        if($scope.searchText.length >= 3){
            let startTime = new Date().getTime();
            $http.get(url + $scope.searchText)
            .then(function(response) {
                let endTime = new Date().getTime();

                if($scope.timeLines.length == 10){
                    $scope.timeLines.splice(0, 1)
                }
                $scope.timeLines.push({apiTime: (endTime - startTime), strKey: $scope.searchText.length > 5 ? $scope.searchText.substring(0,5) + ' ...' : $scope.searchText});
                
                if(response.data.success){
                    if(response.data.data){
                        $scope.resultFalg = true;
                        $scope.noResults = false;
                        $scope.singleChar = false;
                        $scope.doubleChar = false;
                        $scope.people = response.data.data
                    }else{
                        $scope.noResults = true;
                        $scope.resultFalg = false;
                        $scope.singleChar = false;
                        $scope.doubleChar = false;
                    }
                }else{
                    $scope.noResults = true;
                    $scope.resultFalg = false;
                    $scope.singleChar = false;
                    $scope.doubleChar = false;
                }
            });
        }else{

            if($scope.searchText.length == 0){
                $scope.singleChar = false;
                $scope.doubleChar = false;
            }

            if($scope.searchText.length == 1){
                $scope.singleChar = true;
                $scope.doubleChar = false;
            }

            if($scope.searchText.length == 2){
                $scope.singleChar = false;
                $scope.doubleChar = true;
            }

            $scope.people = {};
            $scope.resultFalg = false
        }
    }
});