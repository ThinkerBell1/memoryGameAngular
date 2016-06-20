var app = angular.module('app', []);

app.controller('mainCtrl', function($scope,$timeout,$http){	
	$http.get('./data/cardsN.json').
    success(function(data, status, headers, config) {
    	$scope.allcards = data.cards;
    	/*
    	 // old - when data is in rows
    	$scope.rows = data.rows;
    	$scope.cards =[];
    	angular.forEach($scope.rows, function(row, key) {
			angular.forEach(row,function(card,k){this.push(card)},this)
		},$scope.cards);
    	*/
		
		
    }).error(function(data, status, headers, config) {
      // log error
      console.log("Error loading JSON file");
      console.log(status);
    });

	//set the rows & number of cards according to the level
	$scope.setCards = function(){
		$scope.startDisabled = true;
		console.log("in setCards level is:" + $scope.level);
		//decide how much rows we have
		var numCols,numRows = $scope.level*2;
		if($scope.level===1)
			numCols = numRows+1;
		else
			numCols = numRows;
		var numCards = numCols * numRows /2;  

		//first of all take relevant cards 
		var tmpArr = $scope.allcards.slice(0,numCards);
		// then duplicate cards and shuffle
		$scope.cards = angular.copy(tmpArr);
		$scope.cards = shuffleArray($scope.cards.concat(tmpArr));
		//now setting  cards in rows
		var row,rowCards,counter=0,i,j;
		$scope.rows= {};
		for ( i = 0; i < numRows; i++) {
			rowCards=[];
			for (j = 0; j < numCols; j++) {
				//give each card a unique data-id
				$scope.cards[counter+j].dataId = counter+j;
				//add it to the row
				rowCards.push($scope.cards[counter+j]);
			};
			counter = counter + j;
			// row = { i: rowCards};
			$scope.rows[i] = rowCards;
		}
		console.log($scope.rows);
	};
	function shuffleArray(array) {
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	    return array;
	}

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

	function checkGameDone(){
		var gameDone = true;
		angular.forEach($scope.cards, function(card){
			if (!card.freeze) {
				gameDone = false;
			}
		});
		if(gameDone){
			$scope.gameDone = true;
			var audio = new Audio('data/applause.mp3');
			audio.play();
		}
	}

	function freeze(s){
		s[0].freeze = s[1].freeze = true;
		reset(s);
	}

	function reset(s){
		s[0].selected = s[1].selected = false;
	}

	$scope.onCardClick = function(card){
		if(card.selected || card.freeze)
			return;
		else card.selected = true;

		var selected = getSelected();
		if (selected.length == 2){
			console.log('2 selected !');
			if (areTheSame(selected)){
				//don't flip back cards
				freeze(selected);
				checkGameDone();
			} else {
				$timeout(function() {reset(selected)},500);
			}
		}

	}
/*	$scope.$watch('cards', function(oldVal, newVal){
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
*/});

app.directive('memoryCard', function(){
	return {
		/*scope: {
			data: '='
		},*/
		scope: false,
		replace: true,
		restrict: 'AE',
		//template: '<div class="card" ng-class="{\'selected\': data.selected || data.freeze}" ng-disabled="data.freeze" ng-click="data.selected=true">{{data.id}}</div>',
		//template: '<div class="flipper" data-id={{card.dataId}} ng-click="card.freeze || card.selected=true" ng-class="{\'selected\': card.selected }"><div class="front" ><img ng-src="{{card.src}}"></div><div class="back" style="background:#f8f8f8;"><div class="back-title">@click me ..</div></div></div>',
		template: '<div class="flipper" data-id={{card.dataId}} ng-click="onCardClick(card)" ng-class="{\'selected\': card.selected || card.freeze}"><div class="front" ><img ng-src="{{card.src}}"></div><div class="back" style="background:#f8f8f8;"><div class="back-title">@click me ..</div></div></div>',
        link: function ($scope, element, attrs) { 
        	card = $scope.card;
        },
	}
});


