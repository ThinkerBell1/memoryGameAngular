var app = angular.module('app', []);

app.controller('mainCtrl', function($scope,$timeout,$http){	
	
	$http.get('./data/cards.json').
    success(function(data, status, headers, config) {
    //	$scope.allcards = data.cards;
    	// old - when data is in rows
    	$scope.rows = data.rows;
    	$scope.cards =[];
    	angular.forEach($scope.rows, function(row, key) {
			angular.forEach(row,function(card,k){this.push(card)},this)
		},$scope.cards);
    	
		
		
    }).error(function(data, status, headers, config) {
      // log error
      console.log("Error loading JSON file");
      console.log(status);
    });

	//set the rows & number of cards according to the level
	$scope.setCards = function(){
		console.log("in setCards level is:" + $scope.level);
		var numCols,numRows = $scope.level*2;
		if($scope.level===1)
			numCols = numRows+1;
		else
			numCols = numRows;
		var numCards = numCols * numRows /2;  
	};

	function getSelected(){
		var res = [];
		angular.forEach($scope.cards, function(card){
			if (card.selected) res.push(card);
		});
		return res;
	}

	function areTheSame(selected){
		return (selected[0].data == selected[1].data);
	}

	function freeze(s){
		s[0].freeze = s[1].freeze = true;
		reset(s);
	}

	function reset(s){
		s[0].selected = s[1].selected = false;
	}

	$scope.$watch('cards', function(oldVal, newVal){
		if (oldVal == newVal) return;

		var selected = getSelected();
		if (selected.length == 2){
			console.log('2 selected !');
			if (areTheSame(selected)){
				freeze(selected);
			} else {
				$timeout(function() {reset(selected)},500);
			}
		}

	}, true);
});

app.directive('memoryCard', function(){
	return {
		/*scope: {
			data: '='
		},*/
		scope: false,
		replace: true,
		restrict: 'AE',
		//template: '<div class="card" ng-class="{\'selected\': data.selected || data.freeze}" ng-disabled="data.freeze" ng-click="data.selected=true">{{data.id}}</div>',
		template: '<div class="flipper" data-id={{card.id}} ng-click="card.selected=true" ng-class="{\'selected\': card.selected || card.freeze}"><div class="front" ng-disabled="card.freeze" ><img ng-src="{{card.src}}"></div><div class="back" style="background:#f8f8f8;"><div class="back-title">@click me ..</div></div></div>',
        link: function ($scope, element, attrs) { 
        	card = $scope.card;
        },
	}
});


