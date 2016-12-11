var invoiceManagement = angular.module('invoiceManagementapp',[]);
invoiceManagement.controller('invoiceManagement', function($scope, $http){

    $scope.invoices = function(){

        $http({
            method:'get',
            url:'/invoices'
        }).success(function(data){
           // console.log("Getting all the hosts " + data);
           // console.log("Here are the dates " + data[0].createdDate);
            for(var i=0; i<data.length; i++) {
                data[i].createdDate = new Date(data[i].createdDate).toDateString();
                console.log(data[i].createdDate);
            }
            $scope.invoice = data;
        })

    };


    $scope.getInvoice = function(id){
       // console.log("getInvoice gets called "+id);
        $http({
            method:'post',
            url:'/getInvoice',
            data:{
                "_id":id
            }
        }).success(function(data){
            console.log("Getting Products from city " + JSON.stringify(data));
            $scope.a=data;
        })
    };


    $scope.notifyLogistics = function(id){
        // console.log("getInvoice gets called "+id);
        $http({
            method:'post',
            url:'/notifyLogistics',
            data:{
                "_id":id
            }
        }).success(function(data){
            console.log("Getting Products from city " + JSON.stringify(data));
            //SAND_CHANGE
            $window.location.assign('/invoices');
           // $scope.b=data;
        })
    };

    $scope.sortName = 'firstName';
    $scope.sortReverse = false;

});