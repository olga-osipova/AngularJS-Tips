

//Template of a data table with pagination, sorting and filtering
//There is no general HTML template, plus we assume that the modal pop-up template is included into <div id="modal"></div>
//Data is meant to be fetched by any method and put as an array of objects into "resp" parameter of "displayData" function



angularAppInitialize();	

function angularAppInitialize() {

	var app = angular.module('myApp', []);

	app.controller('myCtrl', ['$scope', '$compile', '$sce', '$parse', '$filter', function($scope, $compile, $sce, $parse, $filter) {			

		$scope.pages = [];
		$scope.records = [];

		$scope.reverse = true;
		$scope.activePage = 0;
		$scope.begin = 0;
		$scope.deactPrev = true;
		$scope.ifClicked = {};	

		$scope.filter = {
			$: ""
		}

		//function for adding an html element to the Angular controller scope
		$scope.activateView = function(ele) {
			$compile(ele.contents())($scope);
			$scope.$apply();
		};


		//function to set the html content to not be sanitized
		$scope.setTrusted = function(template) {
			return $sce.trustAsHtml(template);					
		}



		//function for setting the filter criteria of the addressees list
		$scope.setFilter = function(){

			if ($scope.search_filter!=undefined) {

				$scope.filter = {
					$: $scope.search_filter
				}

				//set the pages for filtered data
				$scope.queryData = $filter('filter')($scope.records, $scope.filter);					
				console.log($scope.queryData);
				$scope.pages = calculatePages($scope.queryData);

				$scope.deactNext = false;
				//deactivate page navigation buttons if there is only one page
				if ($scope.pages.length == 1) {						
					$scope.deactNext = true;
				}
			}
		}


		//function for setting the color of glyphicon in case of sorting the list
		$scope.orderBy = function(opt) {

			var options = Object.keys($scope.ifClicked);

			for (var i=0; i<options.length; i++) {						
				$scope.ifClicked[options[i]] = "#337ab7";							
			}					

			$scope.ifClicked[opt] = "white";

			$scope.reverse = !$scope.reverse;
			$scope.propName = opt.toString();
			console.log("Ordered by: ", $scope.propName);

		}


		//function for setting parameters for list pagination
		$scope.setStart = function(page) {

			$scope.begin = page.start;
			$scope.activePage = page.start/10;

			if ($scope.begin != ($scope.pages.length-1)*10) {
				$scope.deactNext = false;
			}
			else {
				$scope.deactNext = true;
			}

			if ($scope.begin!=0) {
				$scope.deactPrev = false;
			}
			else {
				$scope.deactPrev = true;
			}
		}


		//function for setting parameters when moving to the previous page
		$scope.setPrevious = function() {

			if ($scope.pages.length != 1) {
				$scope.deactNext = false;
			}

			if ($scope.begin!=0) {

				$scope.activePage -=1;
				$scope.begin = $scope.begin - 10;
				if ($scope.begin == 0) {
					$scope.deactPrev = true;
				}
			}
			else {
				$scope.deactPrev = true;
			}
		}


		//function for setting parameters when moving to the next page
		$scope.setNext = function() {

			if ($scope.pages.length != 1) {
				$scope.deactPrev = false;
			}					

			if ($scope.begin != ($scope.pages.length-1)*10) {
				$scope.activePage +=1;
				$scope.begin = $scope.begin + 10;
				if ($scope.begin == ($scope.pages.length-1)*10) {
					$scope.deactNext = true;
				}
			}
			else {
				$scope.deactNext = true;
			}
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


function dislayData(template, resp, width) {

	//Retrieving the scope object current for "modal" element containing modal pop-up template
	var scope = angular.element(document.getElementById('modal')).scope();		
	var title;

	//Adding response data to the Angular controller scope										
	scope.$apply(function(){

			//set default pagination values
			scope.pages = calculatePages(resp);					
			scope.reverse = true;
			scope.activePage = 0;
			scope.begin = 0;
			scope.deactPrev = true;					
			scope.deactNext = false;

			//set the filter to empty
			scope.search_filter = "";
			scope.filter = {
				$: ""
			}

			//deactivate page navigation buttons if there is only one page
			if (scope.pages.length == 1) {						
				scope.deactNext = true;
			}

			scope.records = resp; //response is an array of record objects
			scope.record_options = Object.keys(resp[0]); //the desired sequence of column names can be set by other method
			scope.content_template = scope.setTrusted(template);

			for (var i=0; i < scope.record_options.length; i++) {						
				scope.ifClicked[scope.record_options[i]] = "#337ab7";	//set the glyphicon colour the same as the background colour				
			}						
		}				


		//set modal window width value
		scope.width_value = width;

	});					

	//Show Modal Pop-up

	$("#myModal").modal();						

}	



function calculatePages(data) {

	var pages = [];

	//calculate page amount to be displayed, 10 records per page as an example
	var page_amount = Math.ceil(data.length/10);
	console.log("Page amount: ", page_amount);

	for (var j = 0; j < page_amount; j++) {						
		pages[j] = {
			start: 10*j
		}
	}

	return pages;
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

							'<div class="modal-footer">'+										
								'<button type="button" class="btn btn-info" data-dismiss="modal">Ok</button>'+
							'</div>'+	

						'</div>'+
					'</div>'+
				'</div>';					

	return modal;				

}


function getTemplate() {

	var template =  '<div class="input-group" style="margin: 10px 20px">'+								
						'<input type="text" class="form-control" id="search" ng-model="search_filter">'+
						'<span class="input-group-btn">'+
							'<button class="btn btn-success" type="button" ng-click="setFilter()"><span class="glyphicon glyphicon-search"></span></button>'+
						'</span>'+
					'</div>'+							
					'<table ng-if = "records.length" class = "table table-bordered" style = "font-size: 14px; width: 95%; margin: auto;">'+
						'<tbody>'+
							'<tr class="bg-primary">'+
								'<td ng-if = "record_options" ng-repeat = "option in record_options track by $index" ng-click="$index == 0 ? orderBy(option) : \'\'" ng-style = "$index == 0 ? {cursor: \'pointer\'} : \'\'">'+											
									'<strong>{{option}}</strong>'+
									'<span style = "margin: 10px; color: {{ifClicked[option]}}" class="glyphicon" ng-class="{true: \'glyphicon-chevron-up\', false: \'glyphicon-chevron-down\'}[reverse]"></span>'+
								'</td>'+
							'</tr>'+									
							'<tr ng-repeat = "record in records | filter: filter | orderBy : propName : reverse | limitTo : 10 : begin" >'+
								'<td ng-repeat = "option in record_options track by $index">'+
									'<div style = "display: inline">{{record[option]}}</div>'+
								'</td>'+
							'</tr>'+
						'</tbody>'+
					'</table>'+
					'<nav aria-label="Page navigation" style="display: flex; justify-content: center;">'+								
						'<ul class="pagination">'+
							'<li class="page-item" ng-class = "{true: \'disabled\', false: \'\'}[deactPrev]">'+
								'<a class="page-link" href="javascript:void(0)" aria-label="Previous" ng-click="setPrevious()">'+
									'<span class = "glyphicon glyphicon-chevron-left"></span>'+
									'<span class="sr-only">Previous</span>'+
								'</a>'+
							'</li>'+

							'<li class="page-item" ng-class = "{true: \'active\', false: \'\'}[activePage == $index]" ng-repeat = "page in pages track by $index"><a class="page-link" href="javascript:void(0)" ng-click = "setStart(page)">{{$index + 1}}</a></li>'+   

							'<li class="page-item" ng-class = "{true: \'disabled\', false: \'\'}[deactNext]">'+
								'<a class="page-link" href="javascript:void(0)" aria-label="Next" ng-click="setNext()">'+
									'<span class = "glyphicon glyphicon-chevron-right"></span>'+
									'<span class="sr-only">Next</span>'+
								'</a>'+
							'</li>'+
						'</ul>'+
					'</nav>';

	return template;

}
		
		
