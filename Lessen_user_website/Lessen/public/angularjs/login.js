var myapp = angular.module('myapp', []);

myapp.controller('loginCtrl', function($scope, $http) {

    $scope.invalid_login = true;
    $scope.unknown_error = true;
    console.log("inside controller");
    //Validate user credentials and signIn
    $scope.validate = function() {
        console.log("Posting for signin...!!");
        $http({
            method : "POST",
            url : '/validateuser',
            data : {
                "username" : $scope.username,
                "password" : $scope.password
            }
        }).success(function(data) {
            //checking the response data for statusCode
            if (data.statusCode == 200) {
                $scope.invalid_login = true;
                $scope.unknown_error = true;
                console.log("Rendering homepage from login controller");
                window.location.assign("/homepage");
            }
            else
            {
                console.log("Received 401 response after posting login credentials");
                $scope.invalid_login = false;
                $scope.unknown_error = true;
            }

        }).error(function(error) {
            $scope.invalid_login = true;
            $scope.unknown_error = false;
        });
    };

    //Handle new user registrations
    $scope.register = function() {
        console.log("Posting for registration...!!");
        $http({
            method : "POST",
            url : '/register',
            data : {
                "firstname" : $scope.firstname,
                "lastname" : $scope.lastname,
                "email" : $scope.email,
                "password": $scope.password,
                "address" : $scope.address,
                "city" : $scope.city,
                "state" : $scope.state,
                "zip" : $scope.zip,
                "phone" : $scope.phone,
                "dob" : $scope.dob,
            }
        }).success(function(data) {
            //checking the response data for statusCode
            if (data.statusCode == 401) {
                //set invalid fields

            }
            else
            {
                console.log("Redirecting to login");
                window.location.assign("/login");
            }
            //Making a get call
        }).error(function(error) {


        });
    };
});


myapp.controller('ccCtrl', function($scope, $http) {

    $scope.invalid_card = true;
    $scope.unknown_error = true;
    $scope.validatecc = function() {
        console.log("Posting for cartcheckout...!!");
        $http({
            method : "POST",
            url : '/checkout',
            data : {
                "expirydate" : $scope.expirydate,
                "cardnumber" : $scope.cardnumber,
                "cvv" : $scope.cvv
            }
        }).success(function(data) {
            //checking the response data for statusCode
            if (data.statusCode == 200) {
                $scope.invalid_card = true;
                $scope.unknown_error = true;
                window.location.assign("/thankyou");

            }
            else
            {
                $scope.invalid_card = false;
                $scope.unknown_error=true;
                console.log("status code == 401");
               // console.log("status code != 401");
            }
            //Making a get call to the '/redirectToHomepage' API
            //   window.location.assign("/home");
        }).error(function(error) {
            $scope.invalid_card = true;
            $scope.unknown_error=false;
        });
    };
});