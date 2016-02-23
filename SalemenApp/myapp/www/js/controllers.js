angular.module('starter.controllers', ['firebase','ui.router','ngCordova'])
    .constant("myfirebase","https://salesmanassis.firebaseio.com/user")
    .factory('myService', function() {
        var savedData={};
        function set(data) {
            savedData = data;
        }
        function get() {
            return savedData;
        }

        return {
            set: set,
            get: get
        }

    })


.controller('DashCtrl',function($scope,myfirebase,$http,$location,$state,myService) {


    $scope.submit=function(){


        $http.post("/dash",{
            useremail:$scope.email,
            userpassword:$scope.password
        }).success(function(data, status, headers, config) {
console.log(data);
            if (data !== 404) {
                myService.set(data);
              $location.path("/account");
                console.log("in");
            }
            if (data == 404) {

                alert("Invalid Username or Password");

            }



        });

        };

//
//        $scope.register=function(){
//
//            $http.post("/home",{
//                email:$scope.email,
//                    password:$scope.password
//        }
//            );
//            ref.createUser({
//                "email":$scope.email ,
//                password:$scope.password
//            }, function(error, userData) {
//                if (error) {
//                    switch (error.code) {
//                        case "EMAIL_TAKEN":
//                            console.log("The new user account cannot be created because the email is already in use.");
//                            break;
//                        case "INVALID_EMAIL":
//                            console.log("The specified email is not a valid email.");
//                            break;
//                        default:
//                            console.log("Error creating user:", error);
//                    }
//                } else {
//                    console.log("Successfully created user account with uid:", userData.uid);
//                }
//            });
//
//        };
    })

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

    .controller('order', function($scope,myfirebase,$http,$Location) {

    })
.controller('AccountCtrl', function($scope,myService,$cordovaGeolocation,$http) {
$scope.userdata=myService.get();

$scope.val=true;

       $scope.company=$scope.userdata.comid;



      //  console.log($scope.company);
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)

            .then(function (position) {
                var lat  = position.coords.latitude
                var long = position.coords.longitude

                console.log(lat + '   ' + long)

                $scope.long=long;
                $scope.lati=lat;
            }, function(err) {
                console.log(err)
            });

        var watchOptions = {timeout : 3000, enableHighAccuracy: false};
        var watch = $cordovaGeolocation.watchPosition(watchOptions);

        watch.then(
            null,

            function(err) {
                console.log(err)
            },

            function(position) {
                var lat  = position.coords.latitude
                var long = position.coords.longitude
                console.log(lat + '' + long)

            }
        );


        watch.clearWatch();

       $scope.show_map=function() {



           console.log($scope.lati+ '---oute--------   ');
           console.log('---oute--------   ' + $scope.long)
            var myLatlng = {lat:$scope.lati  , lng: $scope.long};

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 16,
                center: myLatlng
                       });

            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: 'Click to zoom'
            });

            map.addListener('center_changed', function() {
                // 3 seconds after the center of the map has changed, pan back to the
                // marker.
                window.setTimeout(function() {
                    map.panTo(marker.getPosition());
                }, 3000);
            });

            marker.addListener('click', function() {
                map.setZoom(8);
                map.setCenter(marker.getPosition());
            });
        }

        $scope.submitorder=function(id){
            $scope.cid=id;
            console.log("company long"+$scope.long);
            $http.post("/account",{
                productname    :$scope.name,
                quantity       :$scope.pquantity,
                deldate        :$scope.pdate,
                address        :$scope.paddress,
                salesmanid     :$scope.userdata._id,
                salesmanname   :$scope.userdata.username,
                latpos         :$scope.long,
                longpos        :$scope.lati,
                company        :$scope.cid
            }).success(function(data, status, headers, config) {
                $scope.companydata=data;
                console.log(data.data);

            });
        }
$scope.showorder=function(){
    console.log("user id"+$scope.userdata._id);
    $http.post("/showuser",{
        comid: $scope.userdata._id

    }).success(function(data, status, headers, config) {
        $scope.companyprod=data;

        console.log("-----------------------------");
        console.log($scope.companyprod);


    });
}
});
