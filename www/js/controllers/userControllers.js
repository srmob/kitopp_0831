(function(){
   var funcUserReg = function($scope,$state, $stateParams,commonAppService,UserInfo,$ionicLoading,$filter,$ionicPopup,$ionicActionSheet,$timeout,ImageService,base64){
        var ab = this;
        $scope.user={};
        $scope.userId = commonAppService.getloggedInUserId();
        $scope.userType = commonAppService.getloggedInUserType();
        $scope.imeiID = commonAppService.getDeviceId();
        $scope.userPhoneNum = commonAppService.getloggedInUserPhoneNum();
        $scope.gender=[{"id":"M","value":"Male"},{"id":"F","value":"Female"}];
        $scope.onlyNumbers = /^[1-9]+[0-9]*/;
       
       $scope.getUserCategory = function(){
           //$scope.userCategory = ["buyer","seller","both"];
           $scope.userCategory=[{"id":1,"name":"seller"},{"id":2,"name":"buyer"},{"id":3,"name":"both"}];
           
       }
        $scope.getUserCategory();
       
        $scope.clearUserRegForm = function(){
            $scope.user = "";
        }
        //For Back button on top, go to home page
        $scope.goBackToWelcome = function(){ 
            $state.go("welcome");
        }
        
        $scope.addMedia = function() {
            $scope.hideSheet = $ionicActionSheet.show({
              buttons: [
                { text: 'Take photo' },
                { text: 'Photo from library' }
              ],
              titleText: 'Add images',
              cancelText: 'Cancel',
              buttonClicked: function(index) {
                $scope.addImage(index);
              }
            });
        }
        $scope.addImage = function(type) {
            $scope.hideSheet();
            $timeout(function(){
                ImageService.handleMediaDialog(type).then(function(imageURL) {
                    $scope.imgURI = imageURL;
                });
            });
        }
        $scope.addMedia_shop = function() {
            $scope.hideSheet = $ionicActionSheet.show({
              buttons: [
                { text: 'Take photo' },
                { text: 'Photo from library' }
              ],
              titleText: 'Add images',
              cancelText: 'Cancel',
              buttonClicked: function(index) {
                $scope.addImage_shop(index);
              }
            });
        }
        $scope.addImage_shop = function(type) {
            $scope.hideSheet();
            $timeout(function(){
                ImageService.handleMediaDialog(type).then(function(imageURL) {
                    $scope.imgURI_shop = imageURL;
                });
            });
        }
       
        // Populate the drop down list for category and related subcategories
        $scope.registerUser = function(user) {
            
            var imageStringB64 =  base64.encode($scope.imgURI);
            var imageStringB64_shop =  base64.encode($scope.imgURI_shop);
           
            saveToDB ="registerForm[user_img]="+imageStringB64+"&registerForm[shop_img]="+imageStringB64_shop+"&registerForm[user_type_id]="+user.category+"&registerForm[first_name]="+user.firstName+"&registerForm[last_name]="+user.lastName+"&registerForm[phone_num]="+user.phone+"&registerForm[email_id]="+user.email+"&registerForm[imie_id]="+commonAppService.getDeviceId();
            //if seller
            if(user.category ==1 || user.category ==3  ){
                saveToDB +="&registerForm[tin_num]="+user.tinNumber+"&registerForm[gender]="+user.gender+"&registerForm[st_num]="+user.stNumber+"&registerForm[date_of_birth]="+$filter('date')(user.dob, 'dd/MM/yyyy')+"&registerForm[alternate_phone_num]="+commonAppService.getloggedInUserPhoneNum();
            }
            UserInfo.addUser(saveToDB).then(function(data){
                if (data.status == 200) {
                    $scope.alertUserAdded();
                }else if (data.status == 500){
                    $scope.alertUserAdd_error();
                }
            });
            
            
        };
       $scope.alertUserAdded = function() {
           var alertPopup = $ionicPopup.alert({
             title: 'User Registration!',
             template: 'Registration complete, please check SMS for pin !!'
           });
           alertPopup.then(function(res) {
               $state.go('welcome');
            });
        };
       $scope.alertUserAdd_error = function() {
           var alertPopup = $ionicPopup.alert({
             title: 'User Registration Failed',
             template: 'Some error please re-try !!'
           });
           alertPopup.then(function(res) {
               $state.go('welcome');
            });
        };
        
    };
    //UserRegCtrl.$inject($scope,$state, $stateParams,'commonAppService','UserInfo');
    kitApp.controller('UserRegCtrl',funcUserReg);
}());