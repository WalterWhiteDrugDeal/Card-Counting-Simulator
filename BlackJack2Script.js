document.addEventListener('DOMContentLoaded', () => { //Load everything first
  
  hitButton.addEventListener('click', () => {
    alertCenter(HANDPOOL.HAND, dealer, 'H')
    HANDPOOL.HAND.hit()
  });
  document.addEventListener('keypress', (event) => {
    if (event.key === 'A' || event.key === 'a') {
      hitButton.click()
    }
  });
  surrenderButton.addEventListener('click', () => {
    alertCenter(HANDPOOL.HAND, dealer, 'U')
    HANDPOOL.HAND.surrender()
  });
  document.addEventListener('keypress', (event) => {
    if (event.key === 'U' || event.key === 'u') { 
      surrenderButton.click()
    }
  });
  dubbleButton.addEventListener('click', () => {
    alertCenter(HANDPOOL.HAND, dealer, 'D')
    HANDPOOL.HAND.dubble()
    });
  document.addEventListener('keypress', (event) => {
    if (event.key === 'D' ||  event.key === 'd') { 
      dubbleButton.click()
    }
  });
  standButton.addEventListener('click', () => {
    alertCenter(HANDPOOL.HAND, dealer, 'S')

    HANDPOOL.HAND.stand()
    });
  document.addEventListener('keypress', (event) => {
    if (event.key === 'S' || event.key === 's') { 
      standButton.click()
    }
  });
  splitButton.addEventListener('click', () => {
    alertCenter(HANDPOOL.HAND, dealer, 'Y')

    HANDPOOL.HAND.split()
    });
  document.addEventListener('keypress', (event) => {
    if (event.key === 'W' || event.key === 'w') { 
      splitButton.click()
    }
  });
  document.addEventListener('keypress', (event) => {
    if (event.key === 'x' || event.key === 'X') {
      event.preventDefault()
      goButton.click()
      document.getElementById("goButton").setAttribute("disabled",true)

    }
  })
  document.addEventListener('keypress', (event) => {
    if (event.key === 'c' || event.key === 'C') {
      selectButton.click()
    }
  } )
  
  shoeButt.addEventListener('click', () => {
    if (document.getElementById("shoe").style.display === "none") {
      document.getElementById("shoe").style.display = "flex"
    } 
    else {
      document.getElementById("shoe").style.display = "none"
    }  
  })
  runningButt.addEventListener('click', () => {
    if (document.getElementById("runningCount").style.display === "none") {
      document.getElementById("runningCount").style.display = "flex"
    } 
    else {
      document.getElementById("runningCount").style.display = "none"
    }  
  })
  trueButt.addEventListener('click', () => {
    if (document.getElementById("trueCount").style.display === "none") {
      document.getElementById("trueCount").style.display = "flex"
    } 
    else {
      document.getElementById("trueCount").style.display = "none"
    }  
  })
  





});

function alertCenter(hand, dealer, ans) {
  let basicS = document.getElementById("check1").checked
  let trueDev = document.getElementById("check2").checked
  if (trueDev && basicS) {
    return
  }
  else if (trueDev && !basicS) {
    basicStrategy(hand, dealer, ans)
  }
  else {
    generalDeviations(hand, dealer, ans)
  }

}

function handValue(hand) {
  let j = 0
  let aceCount = 0
  for (i in hand) {
    j += hand[i].getValue()
    if (hand[i].rank === 'A') {
      aceCount += 1
    }
  }
}
function basicStrategy(hand, dealer, ans) {
  if (document.getElementById("check1").checked) {
    return
  }
  let score = handValue(hand.cards)
  let d = dealer.cards[0].getValue()
  
  let show = []
  for (i in hand.cards) {
    show.push(hand.cards[i].rank)
  }
  
  if (hand.cards[0].getValue() === hand.cards[1].getValue() && hand.cards.length === 2) {
    let Pd = d -2
    let Pscore = 11-hand.cards[0].getValue()
    let Pindex = "P"+String(Pd)+String(Pscore)
    let Pcor = document.getElementById(Pindex) ? document.getElementById(Pindex).innerText : false;
    if (Pcor) {
      Pcor = String(Pcor).trim()
    }
    console.log(Pcor, ans)
    if (Pcor) {
      if (Pcor === 'N') {
        if (ans === 'Y') {
          alert(`For Hand: ${show} and dealer: ${dealer.cards[0].rank}
          it is not correct to split according to Basic strategy`)
          return
        }
      }
      if (Pcor === 'Y') {
        if (ans != 'Y') {
          alert(`For Hand: ${show} and dealer: ${dealer.cards[0].rank}
          it is correct to split according to Basic strategy`)
          return
        }
      }
    }
    if (Pcor === ans) {
      return
    }
  }
  
  let k =0
  let p = 0
  for (i in hand.cards) {
    if (hand.cards[i].rank === 'A') {
      k +=1
    }
    p += hand.cards[i].getValue()
  }
  if (k > 0  && p < 21) {
    let Sd = d-2
    let Sscore = 9-(score -11)
    let Sindex = "S"+String(Sd)+String(Sscore)
    let Scor = document.getElementById(Sindex) ? document.getElementById(Sindex).innerText : false;
    if (Scor) {
      Scor = String(Scor).trim()
    }
    console.log(Scor, ans)
    if (Scor === 'Ds') {
      if (hand.cards.length > 2) {
        Scor = 'S'
      }
      else if (hand.cards.length === 2) {
        Scor = 'D'
      }
    }
    if (Scor === 'D' && hand.cards.length > 2) {
      Scor = 'H'
    }
    if (Scor && ans != Scor) {
      alert(`For Hand: ${show} and dealer: ${dealer.cards[0].rank}
      ${Scor} is correct according to Basic strategy`)
      return
      
    }
    else if (Scor === ans) {
      return
    }
  }
  if ((hand.placeId === '0' || hand.placeId === '1' || hand.placeId === 'U') && hand.cards.length === 2) {
    let Ud = d-2
    let Uscore = 16-score
    let Uindex = "U"+String(Ud)+String(Uscore)
    let Ucor = document.getElementById(Uindex) ? document.getElementById(Uindex).innerText : false;
    if (Ucor) {
      Ucor = String(Ucor).trim()
    }
    if (Ucor === '<empty string>') {
      Ucor = false
    }
    

    if (Ucor && ans != Ucor.trim()) {
      alert(`For Hand: ${show} and dealer: ${dealer.cards[0].rank}
      ${Ucor} is correct according to Basic strategy`)
      return
    }
  }
  
  let Hd = d-2
  let Hscore = 17-score
  let Hindex = "H"+String(Hd)+String(Hscore)
  let Hcor = document.getElementById(Hindex) ? document.getElementById(Hindex).innerText : false;
  if (Hcor) {
    Hcor = String(Hcor).trim()
  }
  console.log(Hcor, ans)
  if (Hcor === 'D' && hand.cards.length > 2) {
    Hcor = 'H'
  }
  if (Hcor && ans != Hcor) {
    alert(`For Hand: ${show} and dealer: ${dealer.cards[0].rank}
    ${Hcor} is correct according to Basic strategy`)
    return
  }
  if (score > 17) {
    if (ans != 'S') {
      alert(`For Hand: ${show} and dealer: ${dealer.cards[0].rank}
      S is correct`)
      return
    }
  }
  if (score < 8) {
    if (ans != 'H') {
      alert(`For Hand: ${show} and dealer: ${dealer.cards[0].rank}
      H is correct`)
      return
    }
  
  }
  
}
function checkS(hand) {
  let k =0
  let p = 0
  for (i in hand.cards) {
    if (i.rank === 'A') {
      k +=1
    }
    p += hand.cards[i].getValue()
  }
  return (k > 0  && p < 21)
}

function generalDeviations(hand, dealer, ans) {
  //Endast en ändring är möjlig per situation, kanske fixa det?
  let list = ["0+","1+","2+","3+","4+","5+","6+","-0-","-1-","-2-"]
  let res = false
  let show = []
  for (i in hand.cards) {
    show.push(hand.cards[i].rank)
  }

  for (i in list) {
    let neg = false
    let countId = list[i][0]
    
    if (countId[0] == '-') {
      neg = true
    }
    countId = parseFloat(list[i].slice(0,-1))
    
    let margin = parseFloat(document.getElementById("failMargin").innerText)
    let count = shoe.trueCount
    
    //count = -0.4

    let Ad0i
    let sna
    let id

    let d0
    let Ad0
    
    if (neg) {
      if (count - margin <= countId) {
        d0 = document.getElementById(list[i]).innerText
        Ad0 = d0.split(";")
        
      }
    }    
    else if (!neg) {
      
      if (count + margin >= countId) {
        d0 = document.getElementById(list[i]).innerText
        d0.replace(/\s+/g, "")
        Ad0 = d0.split(";")
        
      }
    }
  
    
    if (d0) {
    for (j in Ad0) {
      Ad0i = Ad0[j].trim()[0]
      sna = Ad0[j][Ad0[j].length -1]
      //console.log(Ad0i === 'H')
      if (Ad0i === 'H') {
        console.log(Ad0i)
      }
      id = Ad0[j].slice(Ad0[j].indexOf('(')+1,Ad0[j].indexOf(')')).split(',')
      //console.log(Ad0i=== 'H')
      if (Ad0i === 'P' && hand.cards[0].getValue() === hand.cards[1].getValue() && hand.cards.length === 2) {
        console.log(id[2])
        if (id[0] === 'T' && id [1] === 'T') {
          id[0] = '10'
          id[1] = '10'
        }
        else if (id[0] === 'A' && id [1] === 'A') {
          id[0] = '11'
          id[1] = '11'
        }
      
        if (hand.cards[0].getValue() == id[0] && dealer.cards[0].getValue() == id[2]) {
          console.log(id)
          res = true
          if (ans != sna) {
            if ((!neg && count - margin <= countId) || (neg && count + margin >= countId)) {
              basicStrategy(hand, dealer, ans)
            }
            
            else {
              alert(`For Hand: ${show} and dealer: ${dealer.cards[0].rank}
              ${sna} is correct according to true count deviations`)
              return
            } 
          }
          if (ans === sna) {
            return
          }
        }
      }
        
      else if (Ad0i === 'S' && checkS(hand)) {
        console.log(Ad0i)

        if (id[1] == handValue(hand.cards) -11 && id[2] == dealer.cards[0].rank) {
          res = true
          if (ans != sna) {
            if ((!neg && count - margin <= countId) || (neg && count + margin >= countId)) {
              basicStrategy(hand, dealer, ans)
            }
            else {
              alert(`For Hand: ${show} and dealer: ${dealer.cards[0].rank}
              ${sna} is correct according to true count deviations`)
              return
            }            
          }
          if (ans === sna) {
            return
          }

        }
      }
      else if (Ad0i === 'U' && (hand.placeId === '0' || hand.placeId === '1' || hand.placeId === 'U')) {
        console.log(Ad0i)

        if (id[0] == handValue(hand.cards) && id[1] == dealer.cards[0].rank) {
          res = true
          if (ans != sna) {
            if ((!neg && count - margin <= countId) || (neg && count + margin >= countId)) {
              basicStrategy(hand, dealer, ans)
            }
            else {
              alert(`For Hand: ${show} and dealer: ${dealer.cards[0].rank}
              ${sna} is correct according to true count deviations`)
              return
            }   
          }
          if (ans === sna) {
            return
          }

        }
      }
      else if (Ad0i === 'H') {
        console.log(Ad0i)

        if (id[0] == handValue(hand.cards) && id[1] == dealer.cards[0].rank) {
          res = true
          if (ans != sna) {
            if ((!neg && count - margin <= countId) || (neg && count + margin >= countId)) {
              basicStrategy(hand, dealer, ans)
            }
            else {
              alert(`For Hand: ${show} and dealer: ${dealer.cards[0].rank}
              ${sna} is correct according to true count deviations`)
              return

            } 
          }
          if (ans === sna) {
            return
          }
        }
        }  
      }
    }
    
  }
  if (!res) {
    basicStrategy(hand, dealer, ans)
  }
}
function collectBetSpreads() {
  let bets = []
  for (let i = 0; i < 11; i++) {
    bets.push(parseInt(document.getElementById(`B${i}`).innerText)) 
  }
  let uniqueBets = bets.filter((el, ind) => {
    return bets.indexOf(el)=== ind
  })
  
  createButtons(uniqueBets)
}

betUpdate.addEventListener('click', () => {
  collectBetSpreads()
})
//checkBetStrategy(250)
function checkBetStrategy(ans) {
  let res = false
  let ser = false
  let bets = []
  for (let i = 0; i < 11; i++) {
    let k = parseInt(document.getElementById(`B${i}`).innerText)
    let j = parseInt(document.getElementById(`H${i}`).innerText)
    
    bets.push([k,j]) 
  }
  let count = shoe.trueCount
  let margin = document.getElementById("failMargin").innerText
  
  
  margin = parseFloat(margin)
  count = parseFloat(count)


  let q = bets[5]
  bets.splice(5,0,q)
  
  for (let i = -5; i<7; i++) {
    if (i === -5) {
      if (count-margin <= -5) {
        if (ans === bets[i+5][0]) {
          res = true
        }
        if (douce && bets[i+5][1] === 2) {
          ser = true
        }
        if (!douce && bets[i+5][1] === 1) {
          ser = true
        }
        
      }
    }
    else if (i === 5) {
      if (count+margin >= 5) {
        if (ans === bets[i+5][0]) {
          res = true
        }
        if (douce && bets[i+5][1] === 2) {
          ser = true
        }
        if (!douce && bets[i+5][1] === 1) {
          ser = true
        }
      }
    }
    else if (count+margin >= i-1 && count-margin <= i) {
      
      if (ans === bets[i+5][0]) {
        
        res = true
      }
      if (douce && bets[i+5][1] === 2) {
        ser = true
      }
      if (!douce && bets[i+5][1] === 1) {
        ser = true
      }
    }
  }
  if (!res && !ser) {
    alert("Wrong bet size and number of hands according to bet spread strategy")
  }
  else if (!res) {
    alert(`Wrong bet size according to bet spread strategy`)
  }
  else if (!ser) {
    alert("Wrong number of hands according to bet spread strategy")
  }
}

const container = document.getElementById('container'); // Get the container element
const dealerContainer = document.getElementById('dealer-container')

async function newDisplayCard(card, place) {
  startAnimation(place[0],place[1], 0.25)
  //await sleep(500)
  let sort = card.rank + card.suit[0]
  if (sort[0] === '1') {
    sort = sort.slice(1,3)
  }
  
  const theCard = document.createElement("img")
  theCard.src = `${sort}.png`
  //theCard.className = "card2"
  theCard.id = card.worldOrder
  theCard.style.position = "absolute"
  //theCard.style.display = "block"
  //theCard.style.boxShadow = "0 0 3px rgba(0,0,45)"
  theCard.style.width = "130px"
  theCard.style.left =`${place[0]}px`
  theCard.style.top = `${place[1]}px`
  //theCard.style.marginTop = placeId[0]
  //theCard.style.marginLeft = placeId[1]
  
  container.appendChild(theCard);
  
 
}

async function newDealerCard(card) {
  let sort = card.rank + card.suit[0]
  if (sort[0] === '1') {
    sort = sort.slice(1,3)
  }
  startAnimation(1100, 200, 0.25)
  //await sleep(500)
  const theCard = document.createElement("img")
  theCard.src = `${sort}.png`
  dealerContainer.appendChild(theCard)
}

async function hiddenCard() {
  startAnimation(1100, 200, 0.25)
  //await sleep(TIME/2)
  let hiddenCard = document.createElement("img")
  hiddenCard.id = "hiddenCard"
  hiddenCard.src = "back.png"
  dealerContainer.appendChild(hiddenCard)
}

async function showHiddenCard(dealerHand) {
  //await sleep(500)
  let hiddenCard = document.getElementById("hiddenCard")
  let card = dealerHand[1]
  let sort = card.rank + card.suit[0]
  
  if (sort[0] === '1') {
    sort = sort.slice(1,3)
  }
  
  hiddenCard.src = `${sort}.png`
}

function flipCard(card) {
  let theCard = document.getElementById(`${card.worldOrder}`)
  theCard.style.transform = "rotate(90deg)"
  theCard.style.marginLeft = "2%"
  theCard.style.marginBottom = "-4%"
}

function createButtons(Buttons) {
  const container = document.getElementById('buttonContainer'); // Get the container element
  container.innerHTML = ''; // Clear existing content

  for (let i = 0; i < Buttons.length; i++) {
    const button = document.createElement('button'); // Create a new button element
    button.innerText = `${Buttons[i]}`;
    
    button.style.backgroundColor = "lightgreen"
    
    
    button.style.padding = "4px 8px"
    button.id = `button${i}`; // Optional: Assign an ID to each button

    container.appendChild(button); // Append the button to the container
    button.addEventListener('click', () => {
      document.getElementById("goButton").innerText = `Bet: ${button.innerText}`;
      activeBet = Buttons[i];
  });
  document.addEventListener('keypress', (event) => {
    const buttonIndex = parseInt(event.key, 10) - 1; // Convert key to index
    if (buttonIndex >= 0 && buttonIndex < Buttons.length) {
      let buttonID = `button${buttonIndex}`
      let buttonToClick = document.getElementById(buttonID)
      if (buttonToClick) {
        buttonToClick.click()
      }
      
    }
  });
  }
}



const selectButton = document.getElementById("handSelector")
selectButton.addEventListener('click', () => {
  if (douce) {
    douce = false
    selectButton.innerHTML = "Hands: 1" 
  }
  else if (!douce) {
    douce = true
    selectButton.innerHTML = "Hands: 2" 
  }
});

let activeBet = 500
let douce = true

function startAnimation(targetX, targetY, time) {
  const entity = document.getElementById('movingEntity');
  entity.style.animation = "none"
  void entity.offsetWidth;
  const rootStyle = document.documentElement.style;

  // Set CSS variables to target positions
  rootStyle.setProperty('--move-to-x', targetX + 'px');
  rootStyle.setProperty('--move-to-y', targetY + 'px');

  // Apply the animation
  entity.style.animation = `moveAndDisappear ${time}s`;
  
}

function moveCard(targetX, targetY, card) {
  const entity = document.getElementById(card);
  
  const rootStyle = document.documentElement.style;

  // Set CSS variables to target positions
  rootStyle.setProperty('--move-to-x', targetX + 'px');
  rootStyle.setProperty('--move-to-y', targetY + 'px');

  // Apply the animation
  entity.style.animation = `cardMove 0.5s`;
  
}
let res = 0

goButton.addEventListener('click', () => {
  //document.getElementById("goButton").setAttribute("disabled",true)
  if (!document.getElementById("check3").checked) {
    checkBetStrategy(activeBet)

  }
  
  TIME = document.getElementById("speed").innerText
  updateCash()
  updateShoe()
  document.getElementById("container").innerHTML = ''
  document.getElementById("dealer-container").innerHTML =''
  res = bankroll.cash
  
  runGame(douce, activeBet)
  document.getElementById("popup").style.display = "none"
  dealer.empty()
 
})

let deckPen = document.getElementById("deckPen").innerText

let amountDecks = document.getElementById("decksInShoe").innerText

let money = document.getElementById("setBankroll").innerText

function updateCash() {
  if (money != document.getElementById("setBankroll").innerText) {
    money = document.getElementById("setBankroll").innerText
    bankroll.cash = money
  }

}

function updateShoe() {
  console.log(deckPen)
  if (shoe.shuffleCheck()) {
    shoe = new Shoe(amountDecks, deckPen)
    shoe.shuffle()
  }
  if (deckPen != document.getElementById("deckPen").innerText ||
  amountDecks != document.getElementById("decksInShoe").innerText
  ) {
    amountDecks = document.getElementById("decksInShoe").innerText
    deckPen = document.getElementById("deckPen").innerText
    shoe = new Shoe(amountDecks, deckPen)
    shoe.shuffle()
  }
  
}

const cell = document.getElementsByClassName("cell")


createButtons([250,500,750,1000])

function generateGridsU() {
 
  let container = ""
  let ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T','A'];
  for (let p = 0; p < 3; p++) {
    for (let q = 0; q < 11; q++) {
      if (q=== 0) {
        container += `<div class="cell"style="background-color: rgb(219, 60, 60)">${16-p}</div>`
      }
      else {
        container += `<div id=U${String(q-1)+String(p)} contenteditable="true" class="cell"></div>`
      }     

    }
  }
  return container
}
function generateGridsP() {
 
  let container = ""
  let ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T','A'];
  for (let p = 0; p < 10; p++) {
    for (let q = 0; q < 11; q++) {
      if (q=== 0) {
        container += `<div class="cell"style="background-color: rgb(219, 60, 60)">${ranks[9-p]},${ranks[9-p]}</div>`
      }
      else {
        container += `<div id=P${String(q-1)+String(p)} contenteditable="true" class="cell"></div>`
      }     

    }
  }
  return container
}
function generateGridsS() {
 
  let container = ""
  let ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T','A'];
  for (let p = 0; p < 8; p++) {
    for (let q = 0; q < 11; q++) {
      if (q=== 0) {
        container += `<div class="cell"style="background-color: rgb(219, 60, 60)">A,${9-p}</div>`
      }
      else {
        container += `<div id=S${String(q-1)+String(p)} contenteditable="true" class="cell"></div>`
      }     

    }
  }
  return container
}
function generateGridsH() {
 
  let container = ""
  let ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T','A'];
  for (let p = 0; p < 10; p++) {
    for (let q = 0; q < 11; q++) {
      if (q=== 0) {
        container += `<div class="cell"style="background-color: rgb(219, 60, 60)">${17-p}</div>`
      }
      else {
        container += `<div id=H${String(q-1)+String(p)} contenteditable="true" class="cell"></div>`
      }     

    }
  }
  return container
}
