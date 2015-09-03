(function(){
    var funcUserInfo = function(DBA,$http,ApiEndpoint) {
        var self = this;
        self.getUserCategories = function() {
            return $http.get(ApiEndpoint + '/user/userRoles',{skipAuthorization: true})
              .then(function(result){
                console.log(" User Category Result is ;"+JSON.stringify(result));
                return DBA.processResultSethttp(result);
              },function(error) {
                    console.log("Error in Service(UserInfo); funcUserInfo; "+JSON.stringify(error));
            });
          }
        
        self.addUser = function(userDetails) {
            return $http.post(ApiEndpoint + '/user/register?',userDetails,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            })
              .then(function(result){
                //return DBA.processResultSethttp(result);
                console.log(" Result is ;"+JSON.stringify(result));
                return result;
              },function(error) {
                    console.log("Error in Service(UserInfo); funcUserInfo; "+JSON.stringify(error));
            });
          }
        return self;
    };
    
    //UserInfo.$inject('DBA',$http,'ApiEndpoint');
    kitApp.factory('UserInfo',funcUserInfo);    
}());