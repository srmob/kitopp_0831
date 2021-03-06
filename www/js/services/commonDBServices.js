(function(){
    
    var dbAccessFunc = function($cordovaSQLite, $q, $ionicPlatform,$filter) {
          var self = this;

          // Handle query's and potential errors
          self.query = function (query, parameters) {
            parameters = parameters || [];
            //console.log(" Parameters passed for Query - "+query+" - is/are -> "+parameters);
            var q = $q.defer();

            $ionicPlatform.ready(function () {
                console.warn(parameters);
                console.warn(query);
                console.warn(db);
              $cordovaSQLite.execute(db, query, parameters)
                .then(function (result) {
                  //console.log("In Query Result is "+result);
                  q.resolve(result);
                }, function (error) {
                  console.warn('I found an error for query');
                  console.warn(error);
                  q.reject(error);
                });
            });
            return q.promise;
          }
          
          self.insertList = function (query, parameters) {
            //parameters = parameters || [];
            //console.log(" Parameters passed for Query in Insert List - "+query+" - is/are -> "+[parameters]);
            var q = $q.defer();
            //var coll = parameters.slice(0); // clone collection
            //console.log(" Collection value in insert List - "+coll+" - For query -> "+query);
            $ionicPlatform.ready(function () {
                console.warn(parameters);
              $cordovaSQLite.insertCollection (db, query, [parameters])
                .then(function (result) {
                  console.log(' insertList inserted?'+result);
                  q.resolve(result);
                }, function (error) {
                  console.warn('I found an error in insertList');
                  console.warn(error);
                  q.reject(error);
                });
            });
            return q.promise;
          }
          
          // Proces a result set
          self.processResultSet = function(result) {
            var output = [];
            console.log(" Service(DBA); function(processResultSet); result length  "+result.rows.length);
            for (var i = 0; i < result.rows.length; i++) {
                output.push(result.rows.item(i));
            }
            return output;
          }
            self.processResultSethttp = function(result) {
                var output = [];
                var serverValues = angular.fromJson(result);
                for (var i = 0; i < Object.keys(serverValues.data).length; i++) {
                    output.push(serverValues.data[i]);
                }
                return output;
            }
            
          self.processOrderDetailsResultSethttp = function(result) {
            var output = [];
              var serverValues = angular.fromJson(result);
              output.push(Object(serverValues.data));
              return output;
          }
          
          return self;
    };
    
    //angular.module('kitakiapp').factory('DBA',dbAccessFunc);
    kitApp.factory('DBA',dbAccessFunc);
    
    var appServices = function($window){
        var deviceId;
        var loggedInUserId;
        var loggedInUserType;
        var loggedInUserPhoneNum;
        var orderDetails=[];
        return {
            getDeviceId:function () {
                return deviceId;
            },
            setDeviceId:function (userDeviceId) {
                console.log("Device ID being set as->"+userDeviceId);
                deviceId = userDeviceId;
                return deviceId;
            },
            getloggedInUserId:function () {
                return loggedInUserId;
            },
            setloggedInUserId:function (id) {
                console.log("User ID being set as->"+id);
                loggedInUserId=id
                return loggedInUserId;
            },
            getloggedInUserType:function () {
                return loggedInUserType;
            },
            setloggedInUserType:function (type) {
                console.log("User Type being set as->"+type);
                loggedInUserType=type;
                return loggedInUserType;
            },
            getloggedInUserPhoneNum:function () {
                return loggedInUserPhoneNum;
            },
            setloggedInUserPhoneNum:function (phNum) {
                console.log("User Phone Number being set as->"+phNum);
                loggedInUserPhoneNum=phNum;
                return loggedInUserPhoneNum;
            },
            setToken: function(key, value) {
                console.log("token being set as"+value);
                $window.localStorage[key] = value;
            },
            getToken: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            }
        };
    }
    kitApp.service('commonAppService',appServices);
}());