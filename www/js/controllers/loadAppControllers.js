(function(){
    var funcLoadApp = function($scope,$ionicModal,$timeout,$state,$stateParams,LoadAppInfo,ProductInfo,$ionicHistory,$ionicScrollDelegate,$ionicPopup,SellerInfo,commonAppService,$ionicLoading,OrderInfo,ApiEndpoint,LoginInfo){
    $scope.loginData = {};
    $scope.imeiNbr ;
    $scope.buyerId ;
    $scope.buyerName ;
    
    $scope.userId = commonAppService.getloggedInUserId();
    $scope.userType = commonAppService.getloggedInUserType();
        
    //console.log("In App controller ; UID and Type =>"+$scope.userId+"-"+$scope.userType);
       
    $scope.alertOrderConfirmed = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'You\'r order is in process!',
            template: 'Thank YOU for placing the order'
        });
        alertPopup.then(function(res) {
            //console.log('Alert confirmed ');
            $state.go('app.buyer');
        });
    };
        
        
    $scope.pickProducts=function(name,id,buyerId){
        $timeout(function() {
          //console.log('DEBUG: $state.go for buy products'+name+" id-"+id+"-buyer id"+$scope.userId);
          $state.go('app.buyer.buyProducts',{ shopName: name,uid_seller:id, buyer_uid:$scope.userId });
        });
    };

    $scope.buyerOrders=function(buyerId){

        var buyerId = buyerId;
        //console.log('Buyer Id in LoadApp Controllers is '+buyerId);
        if (buyerId == null || buyerId == 0 ) {
            buyerId = $scope.userId;
            
        }
        
        OrderInfo.getBuyerOrders(buyerId).then(function(items){
            //console.log("Controller(OrderItemCtrl); Func(getOrders) ; orders data"+JSON.stringify(items));
            $scope.orders = items;
        });
    };
    
  
    $scope.viewSellerOrders = function(sellerId){
           $scope.sellerId = sellerId;
            if ($scope.sellerId == null || $scope.sellerId == 0 ){
                $scope.sellerId = commonAppService.getloggedInUserId();
            }
           //console.log("In AppCtrl , viewSellerOrders() - Seller Id- "+$scope.sellerId);
           $scope.sellerOrders=[];
           $scope.buyerName;
           SellerInfo.getSellerOrders($scope.sellerId).then(function(orders){
                //console.log("In getSellerOrders() of SellerInfo--"+orders.length);
                $scope.sellerOrders = orders;
            });
           //console.log("In AppCtrl , sdfsdf "+sellerId);
    };
    
    if ( $scope.userType  == 'seller' && $scope.userId != null ){
        $scope.viewSellerOrders();
    }
        
    $ionicModal.fromTemplateUrl('templates/buyerInfo.html', {
        scope: $scope,
        animation: 'mh-slide'
        }).then(function(modal) {
        $scope.modal = modal;
    });


    // Triggered in the login modal to close it
    $scope.closeBuyerInfo = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    //$timeout(function() {
    $scope.buyerInfo = function() {
        //console.log("Buyer Info triggered")
        $scope.modal.show();
    };   
        
    //$scope.buyerOrders();
    //Use this function to get all Sellers associated with logged in Buyer
    $scope.getSellersForBuyer = function() {
        //console.log("In getSellersForBuyer within load App controllers");
        LoadAppInfo.getSellersForBuyer($scope.userId).then(function(sellers){
            //console.log("From DB Sellers length"+sellers.length);
            $scope.sellersAssociated = sellers;
            angular.forEach($scope.sellersAssociated,function(value,key){
               //$scope.sellersAssociated[key].imgpath="img/sellers/images-"+key+".jpeg";
                 $scope.sellersAssociated[key].imgpath=ApiEndpoint+"/user/fetchShopImage/uid/"+value.uid;
                //console.log(" value "+value.uid)
                //$scope.sellersAssociated[key].imgpath="img/sellers/images-"+key+".jpeg";
            });
            //console.log("$scope.sellersAssociated-"+JSON.stringify($scope.sellersAssociated));
            //console.log("$scope.sellersAssociated-"+$scope.sellersAssociated.length);

        });
    };
    if ( $scope.userType  == 'buyer' ){
        $scope.getSellersForBuyer();
    }
    
    
    $scope.addFavSeller = function (sellerId){
        
        //console.log("seller ID-"+sellerId+",buyerID-"+$scope.userId);
        
    }

    $scope.orderChkbox = {prodid:[]};

    $scope.viewOrderDetails = function(orderId,buyerId){
           $state.go("app.seller.orderDetails",{orderId:orderId,buyerId:buyerId});
    };  
        
    $scope.logout = function(){
       
       if (navigator.app) {
           var alertPopup = $ionicPopup.confirm({
             title: 'Logout ?',
             template: 'Are you sure you want to logout?'
           });
           alertPopup.then(function(res) {
               if(res){
                    
                    LoginInfo.userLogout();
                    ionic.Platform.exitApp();
               }else{
                   //console.log('Alert cancelled ');
               }
            });

        }else if (navigator.device) {
           // alert("device");
            navigator.device.exitApp();
        }
    }

};
    kitApp.controller('AppCtrl',funcLoadApp);
    
   
}());
