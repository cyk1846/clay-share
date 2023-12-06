var gameData = {
	items: {
    //for overarching game checkpoints or misc checks
    //format: [0:randomrange...]
    main: [99],
    
    //to track upgrades the user has gotten
    //format: [0:shovel, 1:pail, ...]
    equips: [false, false],
    
    //format: [exists,  town shop]
    urShop: [null,1,"coins"," coins","sectionRight", ['plates'],[5]],
    
    //format: [0:amount (if exists: unlocked), 1:perClick, 2:randint, 3:cost1, 4:cost2, ...]
    /*one day change the format to be less insane
    [exists/amount, perclick, HTML ID, flavortext, cost key, cost 1, cost 2, randint]
      [0: exists/amount, 
      1: amt per click,
      2: HTML flavortext ID,
      3: flavortext,
      4: HTML hidden on start ID, 
      5: key of checkpoints per cost,
      6: list of cost amounts,
      7: price,
      8: randint]
    */
    
    clay: [0, 1, "clayGathered", " clay gathered"],
    water: [null, 1, "waterCollected", " units of water collected", "hideWater", ['clay'], [10]],
    ceramic: [null, 1, "ceramicMade", " handfuls of ceramic", "hideCeramic", ['clay', 'water'], [10,20]],
    
    plates: [null, 1, "plateMade", " earthenware plates, small", "hideCeramic", ['ceramic'],[1],1,95],
    bowls: [null, 1,"bowlMade", " round bowls", "hideBowl", ['ceramic'],[1],1,90],
    teapots: [null, 1],
    
    temperror: [true]
  }
}

var line0 = "You have a warm home.";
var line1 = "In a fine town."
var line2 = "In a time that is kind to you."
var line3 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
var line4 = "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
var notifQueue = [line0, line1, line2, line3, line4]


function notifLog(newNotif){
  notifQueue.pop()
  notifQueue.unshift(newNotif)
  for (var notif of notifQueue){
    var string = "line" + String(notifQueue.indexOf(notif))
    document.getElementById(string).innerHTML=notif
  }
  //ratchet voice THIS IS GONNA GET GREASY
}

notifLog("test");

function revealChecker() {
  //aka on-load, check this shit
  var templist = [gameData.items.water, gameData.items.ceramic, gameData.items.urShop, gameData.items.plates, gameData.items.bowls]
  if (gameData.items.bowls[0] == null) {
    gameData.items.bowls = [null, 1,"bowlMade", " round bowls", "hideBowl", ['ceramic'],[1],1,90]
  }
  document.getElementById(gameData.items.clay[2]).innerHTML = gameData.items.clay[0] + gameData.items.clay[3];
  document.getElementById("plateFailMsg").style.display = "none";
  for (var type of templist){
    var revealVar = document.getElementById(type[4]);
    console.log(revealVar);
    if (type[0] == null){
      revealVar.style.display = "none";
    }
    else{
      revealVar.style.display = "block";
      document.getElementById(type[2]).innerHTML = type[0] + type[3];
    }
  }
}

function makeThing(thing) {
  var tempChance = Math.floor(Math.random()*gameData.items.main[0])
  if ((tempChance <= thing[8])||(typeof thing[8] === 'undefined')) {
    //if random number is under the chance limit (aka it was successful)...
    gameData.items.temperror[0] = true;
    var resources = thing[5]
    var minReq = thing[6]
    var tempArray = []
    for (var resource of resources){
      var currentAmt = gameData.items[String(resource)][0]
      var place = resources.indexOf(resource)
      if (currentAmt >= (minReq[place])){
        tempArray.push(true);
      }
      else{
        tempArray.push(false);
      }
    }
    let checker = tempArray.every(v => v === true);
    if (checker == true){
      for (var resource of resources){
        var currentAmt = gameData.items[String(resource)][0]
        var place = resources.indexOf(resource)
        gameData.items[String(resource)][0] -= minReq[place]
        document.getElementById(gameData.items[String(resource)][2]).innerHTML = gameData.items[String(resource)][0] + gameData.items[String(resource)][3]
      }
      thing[0] += thing[1]
      document.getElementById(thing[2]).innerHTML = thing[0] + thing[3]
    }
    else{
      console.log("else");
      // log should tell them they dont have enought o make thing
    }
  }
  else {
    gameData.items.temperror[0] = false;
  }
}

function hideErrors() {
  //this needs to be updated to be more flexible? works for now for just plates though
	var revealVar1 = document.getElementById("plateFailMsg");
	if (gameData.items.temperror[0]) {
		revealVar1.style.display = "none";
	}
	else {
		revealVar1.style.display = "block";
	}
}

function revealBlock(out) {
  // NOTE: THIS ASSUMES THAT ARGS2 CONTAINS EQUAL TO OR GREATER THAN REQUIREMENTS ONLY
  var tempArray = []
  var args1 = out[5]
  var args2 = out[6]
  for (var item of args1){
    console.log(item);
    var minVal = gameData.items[String(item)][0]
    console.log(minVal);
    var place = args1.indexOf(item)
    if (minVal >= (args2[place]-1)){
      tempArray.push(true);
    }
    else{
      tempArray.push(false);
    }}
  let checker = tempArray.every(v => v === true);
  console.log(checker);
  var revealVar = document.getElementById(out[4]);
  if (checker==true){
    revealVar.style.display = "block";
    out[0]=0
    //out[1]=1
  }
  else{
    revealVar.style.display = "none";
  }
}

function getClay() {
  if (gameData.items.water[0] == null){
    revealBlock(gameData.items.water);
  }
  gameData.items.clay[0] += gameData.items.clay[1]
	document.getElementById(gameData.items.clay[2]).innerHTML = gameData.items.clay[0] + gameData.items.clay[3];
}

function getWater() { 
  if (gameData.items.ceramic[0] == null){
    revealBlock(gameData.items.ceramic);
  }
  gameData.items.water[0] += gameData.items.water[1]
	document.getElementById("waterCollected").innerHTML = gameData.items.water[0] + gameData.items.water[3]
}

function getCeramic() {
  makeThing(gameData.items.ceramic)
}

function getPlate() {
  if (gameData.items.urShop[0] == null){
    revealBlock(gameData.items.urShop);
  }
	makeThing(gameData.items.plates)
}

function getBowl() {
  
}

function revealShop1() {
	if (gameData.items.plates[0] >= 5 || gameData.revealShopCheck) {
    var revealVar = document.getElementById("hideShop1");
		revealVar.style.display = "block";
		gameData.revealShopCheck = true
	}
	else {
		revealVar.style.display = "none";
	}
}

function revealShop2() {
	var revealVar = document.getElementById("hideShop2");
	if (gameData.items.plates[0] >= 5 || gameData.revealShopCheck) {
		revealVar.style.display = "block";
		gameData.revealShopCheck = true
	}
	else {
		revealVar.style.display = "none";
	}
}

function sellWares(item) {
	var typeItem = gameData.items[String(item)]
  if (typeItem[0] >= 1) {
		typeItem[0] -= 1
		gameData.items.urShop[0] += typeItem[7]
		document.getElementById("coins").innerHTML = gameData.items.urShop[0] + " coins"
		document.getElementById(typeItem[2]).innerHTML = typeItem[0] + typeItem[3]
	}
	else {
    console.log("sellWares else");
		// msg: not enough of item to sell
	}
}

function getShovel() {
	if (gameData.items.urShop[0] >= 10 && gameData.items.clay[1] <= 1) {
    var elem = document.getElementById("shovelButton");
    gameData.items.bowls = [0, 1, "bowlMade", " round bowls", "hideBowl", ['ceramic'],[1],1,90]
    elem.value = "[Equipped]";
		gameData.items.urShop[0] -= 10
    gameData.items.clay[1] = 5
		document.getElementById("gotShovel").innerHTML = " "
		document.getElementById("coins").innerHTML = gameData.items.urShop[0] + " coins"
		gameData.items.equips[0] = true;
	}
  else{
    console.log("test fail");
    console.log("Coins: "+gameData.items.urShop[0])
  }
}

function getPail() {
	if (gameData.items.urShop[0] >= 20 && gameData.items.water[1] <= 1) {
    var elem = document.getElementById("pailButton");
    elem.value = "[Equipped]";
		gameData.items.urShop[0] -= 20
    gameData.items.water[1] = 5
		document.getElementById("gotPail").innerHTML = " "
		document.getElementById("coins").innerHTML = gameData.items.urShop[0] + " coins"
	}
}

var saveGameLoopData = window.setInterval(function() {
  localStorage.setItem("claySave", JSON.stringify(gameData))
}, 1000)

var savegameData = JSON.parse(localStorage.getItem("claySave"))
if (savegameData !== null) {
  gameData = savegameData
}

function onLoad() {
	document.getElementById("coins").innerHTML = "Coins: " + gameData.coins
  if (gameData.items.clay[1] = 5){
    var elem = document.getElementById("shovelButton");
      elem.value = "[Equipped]";
  }
  if (gameData.items.water[1] = 5){
    var elem = document.getElementById("pailButton");
      elem.value = "[Equipped]";
  }
}
