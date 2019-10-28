    
    //Case you need to complile variables in an HTML template added dynamically
    //https://stackoverflow.com/questions/40788937/ng-bind-html-not-working-with-my-scope-variable
    
    function angularAppInitialize() {
			
		var app = angular.module('myApp', []);
		
		app.controller('myCtrl', ['$scope', '$compile', '$sce', '$parse', function($scope, $compile, $sce, $parse) {			
							
		
			//function for adding an html element to the Angular controller scope
			$scope.activateView = function(ele) {
				$compile(ele.contents())($scope);
				$scope.$apply();
			};
			
			
			//function to set the html content to not be sanitized
			$scope.setTrusted = function(template) {
				return $sce.trustAsHtml(template);					
			}
					
		}]);
		
		
		//a directive for automatic including html value added by ng-bind-html into AngularJS scope to evaluate AngularJS expressions
		app.directive('compileTemplate', function($compile, $parse){
			return {
				link: function(scope, element, attr){
						var parsed = $parse(attr.ngBindHtml);
						function getStringValue() {
							return (parsed(scope) || '').toString();
						}

					// Recompile if the template changes
					scope.$watch(getStringValue, function() {
						$compile(element, null, -9999)(scope);  // The -9999 makes it skip directives so that we do not recompile ourselves
					});
				}
			}
		});
		
		//Binding the html view and the Angular app
		$('body').attr('ng-app', 'myApp');
		$('body').attr('ng-controller', 'myCtrl');					
		
	}


    function getModalTemplate() {
        
        //Modal Pop-up template
        var modal = '<div class="modal fade" id="myModal" role="dialog">' +
                        '<div class="modal-dialog modal-lg" ng-attr-style= "width: {{width_value}}">' +   
                        
                            '<!-- Modal content-->' +
                            '<div class="modal-content" style="border-radius: 0px;">' +
                            
                                '<div class="modal-header">'+	
                                    '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                                    '<div ng-if="header_data" ng-bind-html="header_data" compile-template></div>'+																				
                                '</div>'+
                                
                                '<div class="modal-body" id="content_body" ng-bind-html="content_template" compile-template></div>'+											
                                                                        
                                '<div class="modal-footer" style="height: 65px">'+                                    
                                    '<button type="button" class="btn btn-info" data-dismiss="modal">Ok</button>'+
                                '</div>'+	
                                
                            '</div>'+
                        '</div>'+
                    '</div>';					
        
        return modal;				
        
    }