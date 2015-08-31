(function(){
       
    var funcSellerOrders = function($scope,$stateParams,SellerInfo,$filter,$state,$cordovaEmailComposer,$ionicLoading,commonAppService,$ionicModal,$ionicPopup,ApiEndpoint,$ionicHistory,$timeout ){
            
        $scope.userId = commonAppService.getloggedInUserId();
        $scope.userType = commonAppService.getloggedInUserType();
        
        $scope.orderChkbox = {item_id:[]};
        $scope.onlyNumbers = /^[1-9]+[0-9]*/;
        
        $scope.OrderedItemCheckBoxClicked = function(idx,orderItem){
            if (idx != undefined) {
                //Flip the checked flag
                orderItem.checked = !orderItem.checked;
                $scope.orderItemDetails[idx] = orderItem;
            }
        }
        
        $scope.viewOrderDetails = function(){
            $scope.orderId = $stateParams.orderId;
            $scope.orderDetails=[];
            $scope.productImageUrl =ApiEndpoint+"/product/productImage/productId/";
            SellerInfo.getOrdersDetails($stateParams.orderId).then(function(details){
                $scope.orderItemDetails = [];
                angular.forEach(angular.fromJson(JSON.stringify(details)),function(value,key){
                   angular.forEach(value.items,function(value1,key1){
                       value1.checked = false;
                   });
                   $scope.orderItemDetails = value.items;
                });
                $scope.orderStatus  = true;
                if (details[0].order_status == 'closed' || details[0].order_status == 'confirmed' ) {
                    $scope.orderStatus = false;
                }
                $scope.orderDetails = details;
            });
       }; 
        if($ionicHistory.backView().stateName == 'app.seller') {
             $scope.viewOrderDetails();
        }
       
        var finalOrders=[];
        //console.log("final orders before process=  "+JSON.stringify($scope.finalOrders));
        $scope.checkStatus = false;
        
        
        //Function to update the flag value, if user has selected any of items in Screen 9
        $scope.updateCheckFlag = function(flag) {
            $scope.checkStatus = flag; 
            console.log("Order Details in Screen 9 checked flag"+$scope.checkStatus);
        };
        //Click of process button on Seller Order Details
        $scope.processOrder = function(orderId){
            var selllerFulfilledOrderList = [];
            
            
            angular.forEach($scope.orderItemDetails,function(value,key){
                //console.log("checked value "+value.checked+"- Item ID"+value.item_id)
                if(value.checked) {
                    //console.log("checked value "+value.checked+"- Item ID"+value.item_id)
                    selllerFulfilledOrderList.push(value.item_id+"-"+value.order_qty);
                }
            });
            
            SellerInfo.fulFillOrder(selllerFulfilledOrderList).then(function(resultFlag){
                    $scope.productImageUrl =ApiEndpoint+"/product/productImage/productId/";
                    if (resultFlag){
                        //$state.go("app.seller.orderDetails.conf",{orderId:orderId});
                        SellerInfo.getOrdersDetails(orderId).then(function(details){
                            console.log("In viewOrderDetails/getOrdersDetails() of SellerOrderCtrl--"+JSON.stringify(details));
                            //$state.go("app.seller.orderDetails.conf",{orderId:orderId,orderDetails:details});
                            //commonAppService.setOrderDetails(details);
                            SellerInfo.setProcessedOrders(details);
                            $state.go("app.seller.orderDetails.conf",{orderId:orderId});
                            //$scope.orderConfItemDetails = [];
                            $scope.orderItemDetails = [];
                           
                        });
                        //$state.go("app.seller.orderDetails.conf",);
                    }else{
                        console.log(" Something went wrong for processing order ID# "+orderId);
                    }
            });
            
        };
        
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
            $scope.modal.show();
        };
         //});
        $scope.emailOrder = function(buyerDetails){
            $scope.alertWIP();
        };
        $scope.confirmOrderProcess = function(buyerId,orderId){
            SellerInfo.confirmOrder(orderId).then(function(details){
                $state.go("app.seller");
            });
            
        }
        $scope.alertWIP = function() {
               var alertPopup = $ionicPopup.alert({
                 title: 'WIP!',
                 template: 'Work-in-progress !!'
               });
               alertPopup.then(function(res) {
                });
                 
        };
        $scope.finalOrders = finalOrders ;
    };
        
    kitApp.controller('SellerOrderCtrl',funcSellerOrders) ;
    
    
    
    var funcSellerOrderConf = function($scope,$stateParams,SellerInfo,$state,$ionicLoading,commonAppService,$ionicModal,$ionicPopup,ApiEndpoint,$ionicHistory,$timeout,$q ){
        $scope.orderDetails  = angular.fromJson(JSON.stringify(SellerInfo.getProcessedOrders()));
        $scope.orderConfItemDetails = [];
        $scope.orderId = $stateParams.orderId;
        $scope.productImageUrl =ApiEndpoint+"/product/productImage/productId/";
        //Fetch the Item details from main order list
        angular.forEach(angular.fromJson($scope.orderDetails),function(value,key){
                $scope.orderConfItemDetails = value.items;
            });
        
        $scope.confirmOrderProcess = function(buyerId,orderId){
            SellerInfo.confirmOrder(orderId).then(function(details){
                $state.go("app.seller");
            });
            
        };
        
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

        // Open the buyer info modal
         //$timeout(function() {
        $scope.buyerInfo = function() {
            $scope.modal.show();
        };
    }
    kitApp.controller('SellerOrderConfCtrl',funcSellerOrderConf) ;
    
    var funcCustMgmt = function($scope,$stateParams,SellerInfo){
        $scope.buyersList = [{"name":"A",id:1},{"name":"B",id:2},{"name":"C",id:3}];
        
    };
    kitApp.controller('sellerCustomerMgmtCtrl',funcCustMgmt) ;
}());