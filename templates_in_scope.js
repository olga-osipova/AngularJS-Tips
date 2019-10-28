	/*--------Source links---------
	
	https://stackoverflow.com/questions/20651578/how-to-bind-an-angularjs-controller-to-dynamically-added-html
	https://stackoverflow.com/questions/27974795/what-is-the-purpose-of-calling-compileelementscope-in-a-directive

	------------------------------*/
	
	
    //Declaring AngularJS application and controller needed for displaying data in a modal pop-up window  
	angularAppInitialize();	

    //Adding the modal window template to the document structure
    var modal = getTemplate();
    var e1 = angular.element(document.getElementById("modal"));
    e1.html(modal);
    
    //Adding the div element containing modal window to the Angular controller scope
    var mController = angular.element(document.getElementById("modal"));
    mController.scope().activateView(e1);

    //Call for message when needed
    showError("Please fill in the fields");


    /*-----------Functions-----------*/


    function angularAppInitialize() {
			
        angular.module('myApp', []).controller('myCtrl', ['$scope', '$compile', '$sce', function($scope, $compile, $sce) {			
            
            $scope.records = [];	
            
            //Function for adding an html element to the Angular controller scope
            $scope.activateView = function(ele) {
                $compile(ele.contents())($scope);
                $scope.$apply();
            };
            
            //function to set the html content to not be sanitized
            $scope.setTrusted = function(template) {
                return $sce.trustAsHtml(template);					
            }

        }]);
        
        //Binding the html view and the Angular app
        $('body').attr('ng-app', 'myApp');
        $('body').attr('ng-controller', 'myCtrl');			
			
	}


    function showError(message) {
			
        //Retrieving the scope object current for "modal" element
        var scope = angular.element(document.getElementById('modal')).scope();
        
        //Adding error message data to the Angular controller scope
                            
        scope.$apply(function(){	
            scope.width_value = "30%";
            scope.error_message = message;
            scope.header_data = scope.setTrusted('<h4 class="modal-title" id="error_title" style="text-align: center">Error message</h4>');
        });
        
        //Show Modal Pop-up       		
        $("#myModal").modal();
        
    }
    

    function getTemplate() {
			
        //Modal Pop-up template
        var modal = '<div class="modal fade" id="myModal" role="dialog">' +
                        '<div class="modal-dialog modal-lg" ng-attr-style= "width: {{width_value}}">' +   
                        
                            '<!-- Modal content-->' +
                            '<div class="modal-content" style="border-radius: 0px;">' +
                            
                                '<div class="modal-header" style = "text-align: center">'+
                                    '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                                    '<div ng-if="header_data" ng-bind-html="header_data"></div>'+
                                '</div>'+
                                
                                '<div class="modal-body">'+                                
                                    '<div ng-if = "error_message" class = "error">{{error_message}}</div>'+                                    
                                '</div>'+
                                                                        
                                '<div class="modal-footer" style="height: 65px;">'+
                                    '<button type="button" class="btn btn-info" data-dismiss="modal">Ok</button>'+
                                '</div>'+
                                
                            '</div>'+
                        '</div>'+
                    '</div>';
        
        return modal;
        
    }

