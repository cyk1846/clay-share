/* Functions for making things tidier...*/
function getId(what) {
  return document.getElementById(what);
}

/* Game data & Player data */
var gameData = {
	meta:{
		v: "0.0.5"
	},
  items: {
    //for overarching game checkpoints or misc checks
    //format: [0:randomrange...]
    main: [99],
    equips: ["shovel","pail"],
    
    //format: [exists/amount,  town shop]
    urShop: ["coins"," coins","sectionRight", ['plates'],[5]],
    
    //format: [0:amount (if exists: unlocked), 1:perClick, 2:randint, 3:cost1, 4:cost2, ...]
    /*one day change the format to be less insane
    [exists/amount, perclick, HTML ID, flavortext, cost key, cost 1, cost 2, randint]
      [0: HTML flavortext ID,
      1: flavortext,
      2: HTML hidden on start ID, 
      3: key of cost per item,
      4: list of cost amounts,
      5: reveal flavortext for the log,
      6: price,
      7: randint]
    */
    
    clay: ["clayGathered", " clay gathered"],
    water: ["waterCollected", " units of water collected", "hideWater", ['clay'], [10],"A small stream, alive with clear, bright water"],
    ceramic: ["ceramicMade", " ceramic", "hideCeramic", ['clay', 'water'], [10,20],"Tougher than dough, softer than flesh."],
    
    plates: ["plateMade", " earthenware plates", "hidePlate", ['ceramic'],[1],"Flatten the ceramic between your palms...",1,95],
    bowls: ["bowlMade", " round bowls", "hideBowl", ['ceramic'],[2],"Dip your thumb into the flesh of the earth, and pull...",4,90],
    teapots: ["teapotMade", "teapots", "hideTeapot", ['ceramic'],[5],"For boiling water, or making tea...", 10, 80],
    
    temperror: [true]
  }
}

var saveFile = {
	meta:{
	v: "0.0.5"
	},

  items: {
    urShop: [null, 1],
    //to track upgrades the user has gotten
    //format: [0:shovel, 1:pail, ...]
    equips: [false, false],
    
    clay: [0, 1],
    water: [null, 1],
    ceramic: [null, 1],
    
    plates: [null, 1],
    bowls: [null, 1],
    teapots: [null, 1]
  }
}

var notifQueue = ["", "", "", "", "", "", "", ""]
function notifLog(newNotif){
  notifQueue.unshift(newNotif)
  notifQueue.pop()
  for (var i=0; i<notifQueue.length; i++){
    var string = "line" + String(i)
    getId(string).innerHTML=notifQueue[i];
  }
}


// GAME HERE ////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

function revealChecker() {
  //aka on-load, check this shit...
  
  if (savegameData !== null && savegameData.meta.v == gameData.meta.v) {
    saveFile = savegameData
    notifLog("A buzzing in the mind...");
  } else{
    var line0 = "You have a warm home.";
    var line1 = "In a fine town."
    var line2 = "In a time that is kind to you."
    notifLog(line2);
    notifLog(line1);
    notifLog(line0);
  }
  
  for (var thing in saveFile.items){
    var type = gameData.items[String(thing)]; var inv = saveFile.items[String(thing)];
    try{
      if (type[2].slice(0,4)=="hide"){
        var revealVar = getId(type[2]);
        if (inv[0] !== null){
          revealVar.style.display = "block";
          getId(type[0]).innerHTML = inv[0] + type[1];
        }
        else{
          revealVar.style.display = "none";
          console.log("hide:"," ",type)
        }
      } else if (thing == "equips"){
          for (var item in type){
            var place = type.findIndex(item)
            if (inv[place]){
              var elem=getId((String(item).concat("Button")));
              getId((String(item).concat("Get"))).innerHTML = " "
              elem.value = "[Equipped]";
            }
          }
      }} catch(err){
        console.log("caught: ",type);
      }
  }
  getId(gameData.items.clay[0]).innerHTML = saveFile.items.clay[0] + gameData.items.clay[1];
  getId("plateFailMsg").style.display = "none";
}

function makeThing(item) {
	var thing = gameData.items[String(item)]; var inv = saveFile.items[String(item)];
  var tempChance = Math.floor(Math.random()*gameData.items.main[0])
  var resources = thing[3]
  var minReq = thing[4]
  var tempArray = []
  
  // check for min of each resource needed to make thing
  for (var resource of resources){
    var currentAmt = saveFile.items[String(resource)][0]
    var place = resources.indexOf(resource)
    if (currentAmt >= (minReq[place])){
      tempArray.push(true);
    }
    else{
      tempArray.push(false);
    }
  }
  //checker says yes you have enough (true) or no you don't (false)
  let checker = tempArray.every(v => v === true);
    
  if (checker == true){
  //change to "if checker:" ...?
    for (var resource of resources){
      var currentAmt = saveFile.items[String(resource)][0]; var place = resources.indexOf(resource);
      saveFile.items[String(resource)][0] -= minReq[place]
      getId(gameData.items[String(resource)][0]).innerHTML = saveFile.items[String(resource)][0] + gameData.items[String(resource)][1]
    }
    getId(thing[0]).innerHTML = inv[0] + thing[1]
    //if all resources avail, attempt to make. test if it's a success or not.
    if ((tempChance <= thing[7])||(typeof thing[7] === 'undefined')) {
      inv[0] += inv[1]
      notifLog("1 added to your storage of "+thing[1]);
      getId(thing[0]).innerHTML = inv[0] + thing[1]
    //if random number is under the chance limit (aka it was successful)...
    gameData.items.temperror[0] = true;
    }
    else {
    gameData.items.temperror[0] = false;
    }
  }
  else{
    notifLog("Not enough");
  }
}

function hideErrors() {
  //change this to be a notifLog thing at some point??
  var revealVar1 = getId("plateFailMsg");
  if (gameData.items.temperror[0]) {
    revealVar1.style.display = "none";
  }
  else {
    revealVar1.style.display = "block";
  }
}

function revealBlock(item) {
  // NOTE: THIS ASSUMES THAT ARGS2 CONTAINS EQUAL TO OR GREATER THAN REQUIREMENTS ONLY
  var out = gameData.items[String(item)]; var inv = saveFile.items[String(item)];
  var tempArray = [];
  var args1 = out[3]; var args2 = out[4];
  for (var arg of args1){
    var minVal = saveFile.items[String(arg)][0]
    var place = args1.indexOf(arg)
    if (minVal >= (args2[place]-1)){
      tempArray.push(true);
    }
    else{
      tempArray.push(false);
    }}
  let checker = tempArray.every(v => v === true);
  var revealVar = getId(out[2]);
  if (checker==true){
    revealVar.style.display = "block";
    console.log(inv[0]);
    inv[0]=0;
    console.log(inv[0]);
    if (typeof(out[5])!== "number"){
      notifLog(out[5]);
    }
  else{
    revealVar.style.display = "none";
  }
}}

function getClay() {
  if (saveFile.items.water[0] == null){
    revealBlock("water");
  }
  saveFile.items.clay[0] += saveFile.items.clay[1]
  getId(gameData.items.clay[0]).innerHTML = saveFile.items.clay[0] + gameData.items.clay[1];
}

function getWater() { 
  if (saveFile.items.ceramic[0] == null){
    revealBlock("ceramic");
  }
  saveFile.items.water[0] += saveFile.items.water[1]
  getId("waterCollected").innerHTML = saveFile.items.water[0] + gameData.items.water[1]
}

function getCeramic() {
  if (saveFile.items.plates[0] == null){
    revealBlock("plates");
  }
  makeThing("ceramic")
}

function getPlate() {
  if (saveFile.items.urShop[0] == null){
    revealBlock("urShop");
  }
  if (saveFile.items.bowls[0] == null){
    revealBlock("bowls");
  }
  makeThing("plates")
}

function getBowl() {
  makeThing("bowls")
}

function getTeapot(){
  makeThing("teapots")
}

function sellWares(item) {
  var typeItem = saveFile.items[String(item)]
  var dataItem = gameData.items[String(item)]
  if (typeItem[0] >= 1) {
    typeItem[0] -= 1
    saveFile.items.urShop[0] += dataItem[7]
    getId("coins").innerHTML = saveFile.items.urShop[0] + " coins"
    getId(dataItem[0]).innerHTML = typeItem[0] + dataItem[1]
  }
  else {
    notifLog("None to sell");
  }
}

function getShovel() {
  if (saveFile.items.urShop[0] >= 10 && saveFile.items.clay[1] <= 1) {
    var elem = getId("shovelButton");
    elem.value = "[Equipped]";
    saveFile.items.urShop[0] -= 10
    saveFile.items.clay[1] = 5
    getId("gotShovel").innerHTML = " "
    getId("coins").innerHTML = saveFile.items.urShop[0] + " coins"
    saveFile.items.equips[0] = true;
  }
  else{
    notifLog("Not enough");
    //say not enough money
  }
}

function getPail() {
  if (saveFile.items.urShop[0] >= 20 && saveFile.items.water[1] <= 1) {
    var elem = getId("pailButton");
    elem.value = "[Equipped]";
    saveFile.items.urShop[0] -= 20
    saveFile.items.water[1] = 5
    getId("gotPail").innerHTML = " "
    getId("coins").innerHTML = saveFile.items.urShop[0] + " coins"
    saveFile.items.equips[1] = true;
  }
  else{
    notifLog("Not enough");
    //say not enough money
  }
}

var saveGameLoopData = window.setInterval(function() {
  localStorage.setItem("claySave", JSON.stringify(saveFile))
}, 1000)

var savegameData = JSON.parse(localStorage.getItem("claySave"))
