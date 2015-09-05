(function(){
    var funcSellerInfo = function($cordovaSQLite, DBA,$http,ApiEndpoint,$q,$timeout) {
          var self = this;
          var processedOrders=[];
          
        self.getSellerOrders = function(sellerId) {
            var parameters= [sellerId];
            return $http.get(ApiEndpoint + '/order/fetchOrderForSeller/sellerId/'+sellerId)
                .then(function(result){
                //console.log(" Service(SellerInfo); function(getSellerOrders); "+ JSON.stringify(result));
                return DBA.processResultSethttp(result);
            },function(error) {
                console.log("Error in SellerServices.JS-> Service(SellerInfo); function(getSellerOrders); "+JSON.stringify(error));
            });
        }

        self.getOrdersDetails = function(orderId) {
            return $http.get(ApiEndpoint + '/order/orderDetail/orderId/'+orderId).then(function(result){
                console.log(" Service(SellerInfo); function(getOrdersDetails); "+ JSON.stringify(result));
                return DBA.processOrderDetailsResultSethttp(result);
            },function(error) {
                console.log("Error in DBA-> Service(SellerInfo); function(getOrdersDetails); "+error.message);
            });
        }

        self.setProcessedOrders = function( value) {
            processedOrders = value;
            return processedOrders;
        }
        self.getProcessedOrders = function() {
            return processedOrders;
        }
          
        self.fulFillOrder = function(list){
            var urlSellerOrderValues="";

            angular.forEach(list, function (value) {
                urlSellerOrderValues += "orderList[]="+value+"&"; // prepare the seller fulfill order list for http processing
            });
            
            return $http.post(ApiEndpoint + '/order/processSellerOrder',urlSellerOrderValues,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            })
               .then(function (result){
                    var serverValues = angular.fromJson(result);
                    return serverValues.data.result;
               },function(error) {
                    console.log("Error in DBA-> Service(SellerInfo); function(fulFillOrder); "+JSON.stringify(error));
                });
        }
        
        self.confirmOrder = function(orderId){
                var order_id = "order_id="+orderId;
                return $http.post(ApiEndpoint + '/order/confirmOrder',order_id,{
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    })
                   .then(function (result){
                        console.log("Result in confirm order = "+JSON.stringify(result));
                        return result.data.result;
                    });
            }
               
        return self;
    };
    kitApp.factory('SellerInfo',funcSellerInfo);   
    
    var functionProductInfo = function($cordovaSQLite, DBA,$http,ApiEndpoint) {
          var self = this;
        
        
        self.addSellerProduct = function(sellerId,productDetails) {
            //console.log(" Service(ManageProduct); function(addSellerProduct);"+sellerId+"-API-= "+ApiEndpoint);
            //return $http.get(ApiEndpoint + '/product/addProduct/uidSeller/'+sellerId+"?"+productDetails)
            return $http.post(ApiEndpoint + '/product/addProduct/uidSeller/'+sellerId+"?",productDetails,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            })
            .then(function(result){
                console.log(" Service(ManageProduct); function(addSellerProduct); "+ JSON.stringify(result));
                return result.status;
            },function(error) {
                console.log("Error in DBA-> Service(ManageProduct); function(addSellerProduct); "+error.message);
            });
        }
        
        
        self.getSellersProducts = function(sellerId) {
            var parameters= [sellerId];
            //console.log(" Service(ManageProduct); function(getSellersProducts);"+sellerId+"-API-= "+ApiEndpoint);
            //return DBA.query("select  product_id, product_name from product_details where uid_seller=101 order by product_name" , parameters)
              return $http.get(ApiEndpoint + '/product/productListBySeller/sellerId/'+sellerId)
              .then(function(result){
                //console.log(" Service(ManageProduct); function(getSellersProducts); "+ JSON.stringify(result));
                return result.data;
              },function(error) {
                    console.log("Error in DBA-> Service(ManageProduct); function(getSellersProducts); "+error.message);
                });
        }
        self.getProductDetailsForEdit = function(productId) {
            var parameters= [productId];
            //console.log(" Service(ManageProduct); function(getProductDetailsForEdit); -"+productId+"-API-= "+ApiEndpoint);
            /*return DBA.query("select  product_id, product_name from product_details where uid_seller=101 order by product_name" , parameters)*/
              return $http.get(ApiEndpoint + '/product/productInfo/productId/'+productId)
              .then(function(result){
                //console.log(" Service(ManageProduct); function(getProductDetailsForEdit);  "+ JSON.stringify(result));
                //return DBA.processResultSethttp(result);
                return result;
              },function(error) {
                    console.log("Error in DBA-> Service(ManageProduct); function(getProductDetailsForEdit); "+error.message);
                });
        }
          
          self.updateProductDetails = function(productId,productDetails,sellerId) {
            //console.log(" Service(ManageProduct); function(updateProductDetails);"+sellerId+"-API-= "+ApiEndpoint);
            //return $http.get(ApiEndpoint + '/product/editProduct/productId/'+productId+'/uidSeller/'+sellerId+"?"+productDetails)
            return $http.post(ApiEndpoint + '/product/editProduct/productId/'+productId+'/uidSeller/'+sellerId+"?",productDetails,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            })
            .then(function(result){
                //console.log(" Service(ManageProduct); function(updateProductDetails); "+ JSON.stringify(result));
                return result;
            },function(error) {
                console.log("Error in DBA-> Service(ManageProduct); function(updateProductDetails); "+error.message);
            });
        }
        return self;
    };
    
    kitApp.factory('ManageProduct',functionProductInfo); 
    
}());