// Display OUR/CLEAR permitted uses directly in Primo
// Requires an URL to the OUR/CLEAR resource inside the
import X2JS from 'x2js';

angular
    .module('oclsClearDisplay', [])
    .factory('oclsClearService', ['$http', '$sce',function($http, $sce){
        function fetchOurData(baseUrl,resourceName){
            let url = baseUrl + 'api/?tag=' + resourceName;
            
            var x2js = new X2JS();
            
            $sce.trustAsResourceUrl(url);

            return $http.get(url)
                .then(
                    function(response){
                        return x2js.xml2js(response.data);
                    },
                    function(httpError){
                        if (httpError.status === 404)return null;
                        let error = "an error occured: oclsClearService callback: " + httpError.status;
                        if (httpError.data && httpError.data.errorMessage) {
                            error += ' - ' + httpError.data.errorMessage;
                        }
                        console.error(error);
                        return null;
                    }
                );
            }
            return {
                fetchOurData : fetchOurData
            };
        }])
    .controller('oclsClearDisplayController', ['$scope', 'oclsClearService', function ($scope, oclsClearService) {
        var vm = this;
        this.$onInit = function() {
            $scope.$watch(
                function () {
                    if (angular.isDefined(vm.parentCtrl.services)) {
                        // As soon as there are location details, watch for changes in the list of location items
                        return vm.parentCtrl.services;
                    }
                    return 0;
                },
                function () {
                    // This listener function is called both during initial run and whenever the watched variable changes.
                    if (angular.isDefined(vm.parentCtrl.services)){
                        console.log('OCLS CLEAR display start');
                        
                        var services = vm.parentCtrl.services;
                        
                        // Go through the list of available services and look for OUR/CLEAR URLs
                        for(var i = 0; i < services.length; i++){
                            console.log(services[i]);
                            var clearLink = services[i].publicNote.match(/href="(.+\.scholarsportal\.info\/licenses\/)([^"]+)\"/);
                            console.log('Found CLEAR link');
                            console.log(clearLink);
                            if (clearLink){
                                var clearBaseUrl = clearLink[1];
                                console.log(clearBaseUrl);
                                var clearResourceName = clearLink[2];
                                console.log(clearResourceName);
                                oclsClearService.fetchOurData(clearBaseUrl,clearResourceName)
                                .then((data) => {
                                    try{
                                        if (!data)return;
                                        // The data variable contains the license information as a JSON object.
                                        console.log(data);
                                    }
                                    catch(e){
                                        console.error("an error occured: oclsClearDisplayController:\n\n");
                                        console.error(e.message);
                                    }
                                })
                                
                            }
                            
                            
                        }
                         
                    }
                }
            );
        }
    }])

    .component('prmAlmaViewitItemsAfter', {
        bindings: { parentCtrl: '<' },
        controller: 'oclsClearDisplayController'
    });