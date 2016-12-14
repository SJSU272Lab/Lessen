var invoiceManagement = angular.module('invoiceManagementapp',[]);
invoiceManagement.controller('invoiceManagement', function($scope, $http, $window){

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

  //  $scope.pendingpick = [{"_id":"584e23aca110c418a4c60026","nameValuePairs":{"product_name":"teddy","product_category_id":"7","product_category_name":"Toys&Hobbies","product_price":4,"product_condition":"1","product_type":0,"product_seller":{"_id":"584e1fddcb34c5635f91464f","user_firstName":"Sandeep Kumar","user_lastName":"Chawan","user_email":"sand@sand.sand","user_password":"sand","user_address":"65 Rio Robles East, Apt 2402","user_city":"San Jose","user_state":"CA","user_zip":"95134","user_phone":"6692655217","user_dob":"2016-12-31","user_handle":"sand","user_balance":1000,"user_loginTime":"2016-12-12 04:02:19","user_spent":0,"user_earned":0},"product_desc":"teddy bear","product_stock":"1","product_bid_start_price":0,"product_bid_end_time":0,"Product_bid_start_time":0,"product_bid_end":0,"product_max_bid_price":0,"product_image_url":"http://res.cloudinary.com/sandeepchawan/image/upload/v1481515947/quolh9uvadyysnlwblyc.jpg","is_admin_approved":true,"is_pickup_pending":true,"is_pickup_completed":false}},{"_id":"584e257aa110c418a4c6002a","nameValuePairs":{"product_name":"chair","product_category_id":"5","product_category_name":"Home&Garden","product_price":12,"product_condition":"1","product_type":0,"product_seller":{"_id":"584e1fddcb34c5635f91464f","user_firstName":"Sandeep Kumar","user_lastName":"Chawan","user_email":"sand@sand.sand","user_password":"sand","user_address":"65 Rio Robles East, Apt 2402","user_city":"San Jose","user_state":"CA","user_zip":"95134","user_phone":"6692655217","user_dob":"2016-12-31","user_handle":"sand","user_balance":1000,"user_loginTime":"2016-12-12 04:02:19","user_spent":0,"user_earned":0},"product_desc":"office chair in great condition","product_stock":"1","product_bid_start_price":0,"product_bid_end_time":0,"Product_bid_start_time":0,"product_bid_end":0,"product_max_bid_price":0,"product_image_url":"http://res.cloudinary.com/sandeepchawan/image/upload/v1481516409/vpov2svg8kjymcyqqr3f.jpg","is_admin_approved":true,"is_pickup_pending":true,"is_pickup_completed":false}}]
    $scope.getInvoice = function(id){
        console.log("getInvoice gets called: trying to notify logistics: "+id);
        $http({
            method:'post',
            url:'/getInvoice',
            data:{
                "_id":id
            }
        }).success(function(data){
            console.log("Getting Products from city " + JSON.stringify(data));
            $scope.pendingpick=data;
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
            $window.location.assign('/admin_activeLogisticsManagement');
           // $scope.b=data;
        })
    };

    $scope.createEvent = function(){

        $http({
            method:'post',
            url:'/createEvent',
            data:{
                "eventName": $scope.eventName,
                "eventMsg" : $scope.eventMsg,
                "doe" : $scope.doe,
                "location" : $scope.location
            }
        }).success(function(data){
            console.log("Got resposnse from server, redirect suitably - to aactive log management: ", data);
            $window.location.assign('/admin_dashboard');

            //$window.location.assign('/admin_dashboard');

        })

    };

    $scope.sortName = 'firstName';
    $scope.sortReverse = false;

});