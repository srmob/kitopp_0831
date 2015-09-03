(function(){
   var funcUserLogin = function($scope,$state, $stateParams,$timeout,LoginInfo,$ionicPopup,commonAppService,$ionicLoading,base64){
        
       
       
        var pushNotification;
        /*ionic.Platform.ready(function(){
           pushNotification = window.plugins.pushNotification;
            if ( device.platform == 'android' || device.platform == 'Android' ){
                pushNotification.register(
                    successHandler,
                    errorHandler,
                    {
                        "senderID":"981302519609",
                        "ecb":"onNotification"       
                        "senderID":"1088647290869",
                        "ecb":"onNotification"
                    });
            }
            function successHandler (result) {
                alert('result = ' + result);
            }
            function errorHandler (error) {
                alert('error = ' + error);
            }
            function onNotification(e) {
                $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

                switch( e.event )
                {
                case 'registered':
                    if ( e.regid.length > 0 )
                    {
                        $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                        // Your GCM push server needs to know the regID before it can push to this device
                        // here is where you might want to send it the regID for later use.
                        console.log("regID = " + e.regid);
                        alert(e.regid)
                    }
                break;

                case 'message':
                    // if this flag is set, this notification happened while we were in the foreground.
                    // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                    if ( e.foreground )
                    {
                        $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

                        // on Android soundname is outside the payload.
                        // On Amazon FireOS all custom attributes are contained within payload
                        var soundfile = e.soundname || e.payload.sound;
                        // if the notification contains a soundname, play it.
                        var my_media = new Media("/android_asset/www/"+ soundfile);
                        my_media.play();
                    }
                    else
                    {  // otherwise we were launched because the user touched a notification in the notification tray.
                        if ( e.coldstart )
                        {
                            $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                        }
                        else
                        {
                            $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                        }
                    }

                   $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
                       //Only works for GCM
                   $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
                   //Only works on Amazon Fire OS
                   $status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
                break;

                case 'error':
                    $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
                break;

                default:
                    $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                break;
              }
            }
            
        });*/
        
       
       //$scope.phoneNum = 8121314151;
       $scope.passcode = "";
        var retryCount = 0 ;
       $scope.loginUser = function() {
            $state.go('login');
            
        }
        $scope.doLogin = function() {
            $state.go('dologin');
            
        }
        $scope.loginUser1 = function() {
            $state.go('login1');
            
        }
        
        $scope.add = function(value){
            var uid = 0 ;
           if($scope.passcode.length < 4) {
            $scope.passcode = $scope.passcode + value;
            if($scope.passcode.length == 4) {
                $timeout(function() {
                    var passwordEntered = base64.encode($scope.passcode);
                    var urlSafeBase64EncodedString = encodeURIComponent(passwordEntered);
                     LoginInfo.verifyLoggedInUser(commonAppService.getDeviceId(),urlSafeBase64EncodedString).then(function(loginResult){
                       //Valid User
                        if(loginResult){
                             //console.log("loginResult 1 :- "+loginResult);
                            if (commonAppService.getloggedInUserType() == 'buyer') {
                                console.log("loginResult 2 :- "+loginResult+"-"+commonAppService.getloggedInUserType());
                                $timeout($state.go('app.buyer'),1000);
                            }if (commonAppService.getloggedInUserType() == 'seller' || commonAppService.getloggedInUserType() == 'both' ) { 
                                console.log("loginResult 3 :- "+loginResult+"-"+commonAppService.getloggedInUserType());
                                $timeout($state.go('app.seller'),1000);
                            }
                        }
                        else { 
                              //Invalid user
                            retryCount++;
                            console.log("Retry Count is:"+retryCount);
                            if (retryCount < 5 ) {
                                $scope.wrongPin();
                                $scope.passcode="";
                            }else {
                                $state.go('welcome');
                            }
                        }

                    });
                    
                }, 500);
            }
        }
       }
        
        $scope.delete = function(){
            if($scope.passcode.length > 0) {
                $scope.passcode = $scope.passcode.substring(0, $scope.passcode.length - 1);
            }
        }
        $scope.clear = function(){
            if($scope.passcode.length > 0) {
                $scope.passcode = "";
            }
        }
        
        $scope.wrongPin = function() {
           var alertPopup = $ionicPopup.alert({
             title: 'Invalid Pin',
             template: 'Invalid Pin - '+retryCount+'/5'
           });
           alertPopup.then(function(res) {
             $state.go('login1');
           });
         };
       
       $scope.register = function(){
            $state.go('register');
       }
    
       $scope.logout = function(){
           console.log("Exit the app..");
           if (navigator.app) {
                LoginInfo.userLogout();
                ionic.Platform.exitApp();
            }else if (navigator.device) {
                navigator.device.exitApp();
            }
       }
            
    };
        
    kitApp.controller('loginCtrl',funcUserLogin ) ;
}());