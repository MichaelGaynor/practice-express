$(document).ready(function(){
    // console.log("sanity check");
    const freshDeck = createDeck();
    var theDeck = freshDeck.slice();
    var playersHand = [];
    var dealersHand = [];
    var spade = "&#9824;";
    var club = "&#9827;";
    var heart = "&#9829;";
    var diamond = "&#9830;";
    // var sickleHammer = "&#9773";
    // var yinYang = "&#9775";
    // var aesculapiusStaff = "&#9877";
    // var blackFlag = "&#9873";
    // var blackCloud = "&#9729";
    // var umbrella = "&#9730";
    // var blackStar = "&#9733";
    // var whiteStar = "&#9734";
    var presentCards = [];
    var chipsVal = 50;
    var haveDealt = false;
    
    checkDealt();


///////////////////////////////////////////////
///////////////////////////////////////////////
/////////////// BUTTON EVENTS /////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
    $(".deal-button").click(function(){
        if (!haveDealt){
            reset();
            $(".deal-button").removeClass("click-here");
            // Now that the deck is shuffled, update the player and dealer hands
            playersHand.push(theDeck.shift());
            dealersHand.push(theDeck.shift());
            playersHand.push(theDeck.shift());
            dealersHand.push(theDeck.shift());
            placeCard("player","1",playersHand[0]);
            placeCard("dealer","1",dealersHand[0]);
            placeCard("player","2",playersHand[1]);
            placeCard("dealer","2",dealersHand[1]);
            $(".dealer-cards .card-2").addClass("hidden-card")
            calculateTotal(playersHand,"player");
            calculateTotal(dealersHand,"dealer");
            $(".dealer-total-count").html("?");
            $(".chips-invisible").addClass("chips");
            $(".chips").text(chipsVal);
            haveDealt = true;
            checkDealt();
            if(calculateTotal(playersHand, "player") === 21){
                $(".dealer-cards .card-2").removeClass("hidden-card")
                var dealerTotal = calculateTotal(dealersHand,"dealer");
                checkWin();
                $(".deal-button").addClass("click-here");
                haveDealt = false;
                checkDealt();   
            }
        }
    });


    $(".hit-button").click(function(){
        if ((calculateTotal(playersHand, "player") < 21) && (haveDealt)){
            playersHand.push(theDeck.shift());
            placeCard("player",playersHand.length,playersHand[playersHand.length-1]);
            calculateTotal(playersHand,"player");
        }
    });


    $(".stay-button").click(function(){
        if(haveDealt){
            $(".dealer-cards .card-2").removeClass("hidden-card")
            var dealerTotal = calculateTotal(dealersHand,"dealer");
            while(dealerTotal < 17){
                dealersHand.push(theDeck.shift());
                placeCard("dealer",dealersHand.length,dealersHand[dealersHand.length-1])
                dealerTotal = calculateTotal(dealersHand,"dealer");
            }
            checkWin();
            $(".deal-button").addClass("click-here");
            haveDealt = false;
            checkDealt();
        }
    });



///////////////////////////////////////////////
///////////////////////////////////////////////
/////////// UTILITY FUNCTIONS /////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////


    function reset(){
        theDeck = freshDeck.slice();
        shuffleDeck();
        playersHand = [];
        dealersHand = [];
        presentCards = [];
        $(".card").html("")
        $(".dealer-total-number").html("0");
        $(".dealer-total-number").html("0");
        $(".message").text("");
        $(".card").removeClass("card-present");
        $(".chips-invisible").removeClass("chips");
    };


    function checkWin(){
        var playerTotal = calculateTotal(playersHand,"player");
        var dealerTotal = calculateTotal(dealersHand,"dealer");
        if (playerTotal > 21){
            winner = "Player BUSTS and LOSES, -5 chips";
            chipsVal -= 5;
        } else if (dealerTotal > 21){
            winner = "Dealer BUSTS, player WINS, +5 chips";
            chipsVal += 5;
        } else if (playerTotal > dealerTotal){
            winner = "Player WINS, +5 chips";
            chipsVal += 5;
        } else if (dealerTotal > playerTotal){
            winner = "Player LOSES, -5 chips"
            chipsVal -= 5;
        } else{
            winner = "It's a tie. Both of you keep your chips.";

        }
        $(".message").text(winner);
        $('#myModal').modal();
        $(".chips").text(chipsVal);
    };


    // function checkBust(){
    //     var playerTotal = calculateTotal(playersHand,"player");
    //     if (playerTotal > 21){
    //         winner = "Player BUSTS and LOSES: -5 chips";
    //         chipsVal -= 5;
    //     }
    // };


    function calculateTotal(hand,who){
        var total = 0;
        var thisCardValue = 0;
        var hasAce = false;
        var totalAces = 0;
        for (let i=0;i<hand.length;i++){
            thisCardValue = Number(hand[i].slice(0,-1));
            if (thisCardValue > 10){
                thisCardValue = 10;
            } else if(thisCardValue == 1){
                hasAce = true;
                totalAces++;
                thisCardValue = 11;
            }
            total += thisCardValue;
        }
        for (let i=0; i<totalAces; i++){
            if(total > 21){
                total -= 10
            }
        }
        var classSelector = "." +who+ "-total-count";
        $(classSelector).html(total);
        return total;
    };


    function placeCard(who,where,cardToPlace){
        var classSelector = "." +who+ "-cards .card-" +where;
        var thisCardValue = cardToPlace.slice(0,-1);
        if (thisCardValue === "1"){
            thisCardValue = "A"
        } else if(thisCardValue === "11"){
            thisCardValue = "J"
        } else if(thisCardValue === "12"){
            thisCardValue = "Q"
        } else if(thisCardValue === "13"){
            thisCardValue = "K"
        };
        var theSuit = cardToPlace.slice(-1);
        var theSymbol = "";
        if (theSuit === "s"){
            theSymbol = spade
        } else if (theSuit === "c"){
            theSymbol = club
        } else if (theSuit === "h"){
            theSymbol = heart
        } else{
            theSymbol = diamond
        };
        $(classSelector).html(thisCardValue +"<br>"+ theSymbol);
        $(classSelector).addClass("card-present");
        presentCards.push($(classSelector));
        $(classSelector).addClass("flicker");
        setTimeout(function(){ ($(classSelector).removeClass("flicker")); }, 250);
        setInterval(function(){
            for (let i=0; i<presentCards.length; i++){
                var specificCard = presentCards[i];
                var random = Math.floor(Math.random()*100)
                if (random >= 90){
                    $(specificCard).addClass("flicker");
                    setTimeout(function(){ ($(specificCard).removeClass("flicker")); }, 250);
                }else{
                    $(specificCard).removeClass("flicker");
                }
            }
        },1000);
    };


    function shuffleDeck(){
        // loop a big number of times, each time through switch two elements in the array
        for (let i =0;i<5000;i++){
            var randomCard1 = Math.floor(Math.random()*theDeck.length);
            var randomCard2 = Math.floor(Math.random()*theDeck.length);
            var temp = theDeck[randomCard1];
            theDeck[randomCard1] = theDeck[randomCard2];
            theDeck[randomCard2] = temp;
        }
        return theDeck;
    };


    function createDeck(){
        var newDeck = [];
        const suits = ["h","s","d","c"];
        for (let s=0; s<suits.length; s++){
            for (let c=1;c<=13;c++){
                newDeck.push(c + suits[s]);
            }
        }
        return newDeck;
    };


    function checkDealt(){
        if(!haveDealt){
            $(".hit-button").addClass("not-allowed");
            $(".stay-button").addClass("not-allowed");
            $(".deal-button").removeClass("not-allowed");
        }else{
            $(".hit-button").removeClass("not-allowed");
            $(".stay-button").removeClass("not-allowed");
            $(".deal-button").addClass("not-allowed");
        };
    }
});