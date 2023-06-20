// Display OUR/CLEAR permitted uses directly in Primo
// Requires an URL to the OUR/CLEAR resource inside the services' public note.
// If such an URL is found, use the OUR API to retrieve license information for each service
// and display a summary underneath each service.

import X2JS from 'x2js';

angular
    .module('oclsClearDisplay', [])
    .factory('oclsClearService', ['$http', '$sce',function($http, $sce){
        function fetchOurData(baseUrl,resourceName,locationIndex){
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
        
        function addPermissionsObject(term,value){
            return '<dt>' + term + '</dt><dd class="ocls-clear-term-' + value + '">' + value + '</dd>';
        };
        
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
                        for(let i = 0; i < services.length; i++){
                            console.log(i);
                            console.log(services[i]);
                            var clearLinks = services[i].publicNote.match(/([^"]+\.scholarsportal\.info\/licenses\/[^"]+)/g);

                            if (clearLinks){
                                
                                services[i].publicNote = '';
                                
                                clearLinks.forEach(function(foundLink){
                                    console.log('Found CLEAR link');
                                    let clearLink = foundLink.match(/(.+\.scholarsportal\.info\/licenses\/)(.+)/);
                                    let clearBaseUrl = clearLink[1];
                                    console.log(clearBaseUrl);
                                    let clearResourceName = clearLink[2];
                                    console.log(clearResourceName);
                                    oclsClearService.fetchOurData(clearBaseUrl,clearResourceName,i)
                                    .then((data) => {
                                        try{
                                            if (!data)return;
                                            // The data variable contains the license information as a JSON object.
                                            console.log(data);
                                            // Replace the public note content with a summary display of this information
                                            let permissionsOutput = '<a href="' + clearBaseUrl + clearResourceName + '" target="_blank">Permitted uses (click for more):<dl class="ocls-clear-display">';
                                            if (data.license.e_reserves){
                                                permissionsOutput += addPermissionsObject('E-Reserve?',data.license.e_reserves.usage);
                                            }
                                            if (data.license.cms){
                                               permissionsOutput = permissionsOutput +
                                                addPermissionsObject('CMS?',data.license.cms.usage);
                                            }
                                            if (data.license.course_pack){
                                               permissionsOutput = permissionsOutput +
                                                addPermissionsObject('Course packs?',data.license.course_pack.usage);
                                            }
                                            if (data.license.durable_url){
                                               permissionsOutput = permissionsOutput +
                                                addPermissionsObject('Link?',data.license.durable_url.usage);
                                            }
                                            if (data.license.ill_print){
                                               permissionsOutput = permissionsOutput +
                                                addPermissionsObject('ILL?',data.license.ill_print.usage);
                                            }
                                            permissionsOutput = permissionsOutput + '</dl></a><br/>';
                                            services[i].publicNote = services[i].publicNote + permissionsOutput;
                                        
                                        
                                        }
                                        catch(e){
                                            console.error("an error occured: oclsClearDisplayController:\n\n");
                                            console.error(e.message);
                                        }
                                    })
                                    }
                                    
                                )
                                
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