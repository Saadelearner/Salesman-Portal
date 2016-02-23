/**
 * Created by ALI COM on 2/4/2016.
 */


angular.module('myapp',['ngMaterial','firebase','ui.router'])

    .constant("myfirebase","https://salesmanassis.firebaseio.com/user")
    .constant("myfirebasecompany","https://salesmanassis.firebaseio.com/company")
    .constant("myfirebaseuser","https://salesmanassis.firebaseio.com/company/salesman")

.factory('myService', function() {
    var savedData;
        var saveduser;
        function setuserdata(userdata){
            saveduser=userdata;
        }
    function set(id) {
        savedid = id;
    }
        function setCompanyData(data){
            savedcompany=data;
        }
        function getCompanyData(){
            return savedcompany

        }
    function get() {
            return savedid;
        }
        function getuserdata() {
            return saveduser;
        }
    return {
        set: set,
        get: get,

        setCompanyData:setCompanyData,
        getCompanyData:getCompanyData,
            setuserdata:setuserdata,
        getuserdata:getuserdata
    }

})
    /////  Routes
    .config(function ($stateProvider,$urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('login',{
                url:"/login",
                templateUrl:'templates/login.html',
                controller:'loginCtrl'
            })
            .state('view',{
                url:"/view",
                templateUrl:'templates/view.html',
                controller:'viewCtrl'
            })
            .state('companydetail',{
                url:"/companydetail",
                templateUrl:'templates/companydetail.html',
                controller:'companyCtrl'

            })

            .state('adduser',{
                url:"/adduser",
                templateUrl:'templates/adduser.html',
                controller:'adduserCtrl'
            })
            .state('details',{
                url:"/details",
                templateUrl:'templates/details.html',
                controller:'detailCtrl'


            });
        $urlRouterProvider.otherwise("/login");
            })

.controller("loginCtrl",function($scope,myfirebase,$http,$location,$state,myService,$mdToast) {
        var ref = new Firebase(myfirebase);
        $scope.user = {};

        var vm = this;
        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };
        $scope.toastPosition = angular.extend({},last);
        $scope.getToastPosition = function() {
            sanitizePosition();
            return Object.keys($scope.toastPosition)
                .filter(function(pos) { return $scope.toastPosition[pos]; })
                .join(' ');
        };
        function sanitizePosition() {
            var current = $scope.toastPosition;
            if ( current.bottom && last.top ) current.top = false;
            if ( current.top && last.bottom ) current.bottom = false;
            if ( current.right && last.left ) current.left = false;
            if ( current.left && last.right ) current.right = false;
            last = angular.extend({},current);
        }
        $scope.showSimpleToast = function() {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Invalid Username or Password!')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
            );
        };
        //////// login for portal Admin
         $scope.login=function() {

            $http.post("/login",{
                useremail:$scope.user.email,
                userpassword:$scope.user.password
            }).success(function(data, status, headers, config) {
                console.log("data-------"+data);
                if (data !== 404) {

                    $state.go("companydetail");

                }
                if (data == 404) {
                    $scope.showSimpleToast();
                   console.log("out");

                }
            });

       }
        $scope.user = {};
        //////// login for company Admin
        $scope.companylogin=function() {

            $http.post("/comlogin",{
                useremail:$scope.user.email,
                userpassword:$scope.user.password
            }).success(function(data, status, headers, config) {
                var user=data;
                console.log("data-------"+data);
              //  console.log(data);
                if (data !== 404) {
                    myService.setuserdata(user);
                    $state.go("details");

                }
               else {
                    $scope.showSimpleToast();
                    console.log("out");

                }



            });



        }


    })
.controller('adduserCtrl',function($scope,myfirebaseuser,$http,$timeout, $mdSidenav, $log){
        var ref = new Firebase(myfirebaseuser);
//add
        $scope.adduser=function(){

            $http.post("/home",{
                username:$scope.username,
                useremail:$scope.useremail,
                userpassword:$scope.userpassword

            });
//            ref.createUser({
//                    name:$scope.username,
//                    email:$scope.useremail,
//                    password:$scope.userpassword
//
//                }
//                , function(error, userData) {
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

        };


    })

.controller('viewCtrl',function($scope,$http,myService){
        var currCompany={}
        currCompany=myService.getCompanyData();
        console.log("current Company name"+currCompany.cname);
        $scope.curComid=currCompany.id;

       })



    // All company and user details for Portal Admin
    .controller('companyCtrl',function($scope,$firebaseArray,myfirebasecompany,$rootScope,$mdMedia,$http,$timeout,$mdDialog, $mdSidenav, $log,myService){
        var ref = new Firebase(myfirebasecompany);
        $scope.img='templates/cap-logo-ideas3_1x.png'
        $scope.userimg='templates/usr_icon.png'
        var company={}
$scope.user={};
        $scope.addsalesman=function(cid){
            $scope.myvalue = false;

            $scope.id=cid;
            console.log("-----companyid--------"+$scope.user.uname_$scope.id);
            $http.post("/user",{
                comid:$scope.id,
                username:$scope.user.uname,
                useremail:$scope.user.email,
                userpassword:$scope.user.password

            });


        }
        $scope.expanded = false;

        $scope.expand = function() {
            $scope.expanded = !$scope.expanded;
        }
        $scope.myvalue = false;
        $scope.showAlert = function(){

                   $scope.myvalue = true;

            };
        $scope.hideAlert = function(){
            $scope.myvalue = false;
        };

        $http.get('/companydetail').then(function(d){
            console.log(d);
            $scope.companydata= d.data;
        },function(err){
            console.log(err);
        });
        $scope.selectedUserIndex = undefined;
        $scope.selectUserIndex = function (index,id) {

            $scope.id=id;
            $http.post("/viewuser",{
                comid:$scope.id

            }).then(function(d) {
                $scope.companyusers=d.data;
                console.log("------i am in");

                console.log(d.data);

            });
            if ($scope.selectedUserIndex !== index) {
                $scope.selectedUserIndex = index;
            }
            else {
                $scope.selectedUserIndex = undefined;
            }
        };
        $scope.showuser=function(id){
            $http.post("/viewuser",{
                comid:id

            }).success(function(data, status, headers, config) {
                $scope.companyusers=data.user;


             console.log(data.user);

            });
        };


        var messages = $firebaseArray(ref);
        $scope.addcompany=function(){
            console.log("===company password"+$scope.companypwd);
                $http.post("/home",{
                    companyname:$scope.companyname,
                    companyemail:$scope.companyemail,
                    companypwd:$scope.companypwd
                }).success(function(data, status, headers, config) {
                    $scope.companydata=data;

                });

            messages.$add({

            Company:$scope.companyname,
                Email:$scope.companyemail

        });
            $scope.companyname="";
            $scope.companyemaile="";
        };
        $scope.showAdd = function(ev,id) {
            $scope.expanded = false;
            console.log("----this is userid-------"+id);
            myService.set(id);
            $mdDialog.show({
                controller: DialogController,

                template: '<md-dialog aria-label="Mango (Fruit)"> <md-content class="md-padding"> ' +
                    '<form name="userForm"> <div layout layout-sm="column"> <md-input-container class="md-block" flex-gt-sm> <label>User Name</label> <input ng-model="user.uname" placeholder="Enter Your Full Name"> </md-input-container> </div> <md-input-container class="md-block" flex-gt-sm> <label>Email</label> <input ng-model="user.email"> </md-input-container> <div layout layout-sm="column">  </div> <md-input-container class="md-block" flex-gt-sm> <label>Password</label> <input type="password" ng-model="user.password" placeholder="Enter Your Full Name"> </md-input-container></form> </md-content> <div class="md-actions" layout="row"> <span flex></span> <md-button ng-click="cancel()"> Cancel </md-button> <md-button ng-click="answer()" class="md-primary"> Save </md-button> </div></md-dialog>',
                targetEvent: ev
            })
                .then(function(answer) {
                    $scope.alert = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };

        $scope.order=function(id,cname,cemail){
     company={
         id:id,
         cname:cname,
         cemail:cemail

     }
            myService.setCompanyData(company);
          //  Authorization.go('view');
        }


    })
    //selected company detail for company admin
    .controller('detailCtrl',function($scope,$firebaseArray,myfirebasecompany,$rootScope,$mdMedia,$http,$timeout,$mdDialog, $mdSidenav, $log,myService) {
        $scope.companyData = myService.getuserdata();
        $scope.userimg='templates/usr_icon.png'
     $scope.product=$scope.companyData.product;
        console.log($scope.product);
        $http.post("/viewuser",{
            comid: $scope.companyData._id

        }).success(function(data, status, headers, config) {
            $scope.companyusers=data;

            console.log("-----------------------------");
            console.log(data);
            $scope.$apply();

        });
        $scope.showAdd = function(ev,id) {

            $scope.expanded = false;
            console.log("----this is userid-------"+id);
            myService.set(id);
            $mdDialog.show({
                controller: DialogController,

                template: '<md-dialog aria-label="Mango (Fruit)"> <md-content class="md-padding"> ' +
                    '<form name="userForm"> <div layout layout-sm="column"> <md-input-container class="md-block" flex-gt-sm> <label>User Name</label> <input ng-model="user.uname" placeholder="Enter Your Full Name"> </md-input-container> </div> <md-input-container class="md-block" flex-gt-sm> <label>Email</label> <input ng-model="user.email"> </md-input-container> <div layout layout-sm="column">  </div> <md-input-container class="md-block" flex-gt-sm> <label>Password</label> <input type="password" ng-model="user.password" placeholder="Enter Your Full Name"> </md-input-container></form> </md-content> <div class="md-actions" layout="row"> <span flex></span> <md-button ng-click="cancel()"> Cancel </md-button> <md-button ng-click="answer(\'useful\')"  class="md-primary"> Save </md-button> </div></md-dialog>',
                targetEvent: ev
            })
                .then(function(answer) {
                    $scope.alert = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };


        $scope.data = {
            selectedIndex: 0,
            secondLocked:  true,
            secondLabel:   "Item Two",
            bottom:        false
        };
        $scope.next = function() {
            $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
        };
        $scope.previous = function() {
            $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
        };
        $scope.show_map=function(lat,long) {



            //show map
            var myLatlng = {lat:long  , lng:lat};

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
    });

function DialogController($scope, $mdDialog,myService,$http) {
    $scope.id=myService.get();
    console.log("----------my id----------"+$scope.id);
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      console.log("-------i am in-------------"+$scope.user.uname);
        $http.post("/user",{
            comid:$scope.id,
            username:$scope.user.uname,
            useremail:$scope.user.email,
             userpassword:$scope.user.password

        }).success(function(data, status, headers, config) {
            $scope.companyusers=data;
console.log("---------userdata-----"+data.username);



        });
        $mdDialog.hide(answer);
    };
};

