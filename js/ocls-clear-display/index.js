// Display OUR/CLEAR permitted uses directly in Primo
// Requires an URL to the OUR/CLEAR resource inside the

angular
    .module('oclsClearDisplay', [])

    .controller('oclsClearDisplayController', ['$scope', function ($scope) {
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
                            if (clearLink.length > 0){
                                var clearBaseUrl = clearLink[1];
                                console.log(clearBaseUrl);
                                var clearResourceName = clearLink[2];
                                console.log(clearResourceName);
                                
                                
                                
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