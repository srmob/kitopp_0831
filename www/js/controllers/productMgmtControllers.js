(function(){
    
    var funcManageProduct = function($scope,$stateParams,$state,commonAppService,ManageProduct,ProductInfo,$ionicPopup,$cordovaCamera,$cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet, ImageService,ApiEndpoint,$timeout,base64){
        $scope.productFlag = "0";
        $scope.product = {};
        $scope.editProduct = "";
        $scope.products = {};
        $scope.onlyNumbers = /^[1-9]+[0-9]*/;
        $scope.decimalNumbers = /^\d{0,9}(\.\d{1,9})?$/;
        
        $scope.userId = commonAppService.getloggedInUserId();
        $scope.productImageUrl =ApiEndpoint+"/product/productImage/productId/";
        
        $scope.urlForImage = function(imageName) {
            var trueOrigin = cordova.file.dataDirectory + imageName;
            return trueOrigin;
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
        $scope.add = function(){
            $scope.productFlag="add";
        };
        $scope.edit = function(){
            $scope.productFlag="edit";
        };
        $scope.clearSearch = function(){
            $scope.searchProduct='';
        };
        
        $scope.addProduct = function(){
            var imageStringB64 =  base64.encode($scope.imgURI);
            
            var saveProductToDB ="product[product_img_id1]="+imageStringB64+"&product[product_catg_id]="+$scope.product.product_catg_id+"&product[product_sub_catg_id]="+$scope.product.product_sub_catg_id+"&product[product_name]="+$scope.product.name+"&product[product_desc]="+$scope.product.desc+"&product[product_mfc_name]="+$scope.product.mfrName+"&product[product_min_qty]="+$scope.product.minQty+"&product[plan][1]="+$scope.product.price_platinum+"&product[plan][2]="+$scope.product.price_gold+"&product[plan][3]="+$scope.product.price_silver;
            
            ManageProduct.addSellerProduct($scope.userId,saveProductToDB).then(function(result){
               if (result == 200) {
                    $scope.alertProductAdd();
                }else{
                    $scope.alertProductAdd_error();
                }
               
            });
        }
        
        $scope.alertProductAdd = function() {
               var alertPopup = $ionicPopup.alert({
                 title: 'Product Addedd Successfully!',
                 template: 'Thank YOU!'
               });
               alertPopup.then(function(res) {
                 $scope.getProductsForSeller();
                 $scope.productFlag = "0";
                 $state.go('app.seller.manageProduct');
               });
        };
        $scope.alertProductAdd_error = function() {
               var alertPopup = $ionicPopup.alert({
                 title: 'Error while adding product, please try again!',
                 template: 'Sorry, something went wrong - OopS!'
               });
               alertPopup.then(function(res) {
                 console.log('Alert confirmed for error while adding product');
                 $scope.productFlag = "0";
                 $state.go('app.seller.manageProduct');
               });
        };
        $scope.editProduct = function(){
            //console.log("Product Edit "+JSON.stringify($scope.product));
        }
        $scope.resetProduct = function(){
            $scope.product = {};
            $state.go('app.seller.manageProduct');
            
        }
    
        
        // Populate the drop down list for category and related subcategories
        $scope.getAllProductCategories = function() {
            ProductInfo.getAllProdCatg($scope.userId).then(function(products){
              $scope.productCatg = products;
            });
        }
        $scope.getAllProductCategories();
        
        
        $scope.getProductsForSeller = function(){
            ManageProduct.getSellersProducts($scope.userId).then(function(results){
                $scope.products  = results;
                
            });
        }
        $timeout($scope.getProductsForSeller(),1000);
        //$scope.getProductsForSeller();
        
        
        $scope.selectProductEdit = function(product_id){
            console.log("Edit product id : "+product_id+"-for seller id-"+$scope.userId);
            $state.go("app.seller.manageProduct.edit",{productId:product_id,sellerId:$scope.userId});
        }
        
        
        $scope.takePicture = function() {
            var options = { 
                quality : 75, 
                destinationType : Camera.DestinationType.DATA_URL, 
                sourceType : Camera.PictureSourceType.CAMERA, 
                allowEdit : false,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                console.log(" &&&&& Image from camera is--->"+imageData)
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
                 console.log(" *** Error in camera function--->"+err);
            });
        };
    
    };
    
    kitApp.controller('sellerManageProductCtrl',funcManageProduct) ;
    
     var funcEditProduct = function($scope,$stateParams,$state,commonAppService,ManageProduct,ProductInfo,$ionicPopup,ApiEndpoint,$ionicActionSheet,base64,$timeout,ImageService){
         
        $scope.product = "";
        $scope.onlyNumbers = /^[1-9]+[0-9]*/;
        $scope.imgURI="";
        $scope.cameraButtonClicked = false;
         
         console.log(" Image URI in edit prod controller is : "+$scope.imgURI);
        
        $scope.userId = commonAppService.getloggedInUserId();
        
        $scope.resetProduct = function(){
            $scope.product = {};
            //console.log("Product"+JSON.stringify($scope.product));
        }
        
        // Populate the drop down list for category and related subcategories
        $scope.getAllProductCategories = function() {
            
            ProductInfo.getAllProdCatg($scope.userId).then(function(products){
              $scope.productCatg = products;
                console.log(" Product category "+JSON.stringify($scope.productCatg)+" User id : "+$scope.userId);
            });
        }
        $scope.getAllProductCategories();
         
         //Camera functionality starts
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
                     console.log(" Image URI "+$scope.imgURI);
                    $scope.cameraButtonClicked = true;
                });
            });
        }
         //Camera functionality ends
         
        
        $scope.editProductDetails = function(){
            product_id = $stateParams.productId;
            
            ManageProduct.getProductDetailsForEdit(product_id).then(function(results){
                var prices =results.data.price;
                console.log("Edit product id  in edit(): "+product_id+"-for seller id-"+$scope.userId+"- and details are :-"+JSON.stringify(results));
                if(prices.length < 4 ) {
                    var price_category = {1:"platinum", 2:"gold", 3:"silver", 4:"normal"};
                    for(var i=1 ; i <= 4 ; i++ ){
                        var flag = false;
                        angular.forEach(prices,function(val,key){
                            if(val.category_id == i){
                                  flag = true;
                            }
                        })
                        if (!flag) {
                            prices.push({
                            category_id: i,
                            category_name: price_category[i],
                            product_price: ""
                        });
                        }
                    }
                }
                $scope.product  = results.data;
            });
        }
        $scope.editProductDetails();
        //$scope.product= productDetails;
        $scope.productImageUrl =ApiEndpoint+"/product/productImage/productId/";
         
        $scope.editProduct = function(product){
            product_id = $stateParams.productId;
            
            var price_platinum, price_gold, price_silver;
            angular.forEach($scope.product.price,function(value,key){
                if(value.category_id == 1 ) {
                    price_platinum = value.product_price;
                }else if(value.category_id == 2 ) {
                    price_gold = value.product_price;
                }else if(value.category_id == 3 ) {
                    price_silver = value.product_price;
                }
                            
            });
            var imageStringB64 =  base64.encode($scope.imgURI);
            var updateProductDetails ="product[product_img_id1]="+imageStringB64+"&product[product_catg_id]="+$scope.product.product_catg_id+"&product[product_sub_catg_id]="+$scope.product.product_sub_catg_id+"&product[product_name]="+$scope.product.product_name+"&product[product_desc]="+$scope.product.product_desc+"&product[product_mfc_name]="+$scope.product.product_mfc_name+"&product[product_min_qty]="+$scope.product.product_min_qty+"&product[plan][1]="+price_platinum+"&product[plan][2]="+price_gold+"&product[plan][3]="+price_silver;
            
            ManageProduct.updateProductDetails(product_id,updateProductDetails,$scope.userId).then(function(results){
                if (results.status == 200) {
                    $scope.alertProductEdit();
                }
            });
        }
        
        $scope.alertProductEdit = function() {
               var alertPopup = $ionicPopup.alert({
                 title: 'Product Updated Successfully!',
                 template: 'Thank YOU!'
               });
               alertPopup.then(function(res) {
                 $scope.productFlag = "0";
                 $state.go('app.seller.manageProduct');
               });
        };
        
    };
    
    kitApp.controller('editProductCtrl',funcEditProduct) ;
    

}());