class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
    this.worldOrder = null
  }

  getValue() {
    if (['J', 'Q', 'K'].includes(this.rank)) {
      return 10;
    } else if (this.rank === 'A') {
      return 11;
    } else {
      return parseInt(this.rank);
    }
  }
}



class Shoe {
  constructor(amountDecks, shoePen) {
    this.cards = [];
    this.amountDecks = amountDecks;
    this.shoePen = shoePen;
    this.initialize();
    this.counter = 0
    this.trueCount = 0
    this.runningCount = 0
    this.stack = 0
  }

  initialize() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    for (let i = 0; i < this.amountDecks; i++) {
      for (let suit of suits) {
        for (let rank of ranks) {
          this.cards.push(new Card(suit, rank));
        }
      }
    }
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]; // Swap
    }
  }

  shuffleCheck() {
    return (this.cards.length<= 52*this.amountDecks*(1-this.shoePen)) 
  }
  

  deal(arg) {
    let newCard = this.cards.pop()
    newCard.worldOrder = this.counter
    
    let id = newCard.rank
    if (['J','Q','K'].includes(id)) {
      id = '10'
    }
    id = id+'S'
    
    let plus = parseInt(document.getElementById(id).innerText)
    if (arg==='Hidden') {
      this.stack = plus
    }
    else {
      plus += this.stack
      this.stack = 0
      this.runningCount += plus
    }

    this.trueCount = this.runningCount/(this.cards.length/52)
    this.counter += 1
    document.getElementById("shoe").innerText = `Shoe: ${this.cards.length}/${this.amountDecks*52}`
    document.getElementById("runningCount").innerText = `Running Count: ${this.runningCount}`
    document.getElementById("trueCount").innerText = `True Count: ${this.trueCount.toFixed(2)}`
    document.getElementById("bar").style.height = `${200-(200*(this.counter/(52*8)))}px`
    return newCard
  }
}

class Bankroll {
  constructor(cash) {
    this.cash = cash
  }
  add(arg) {
    this.cash += arg 
  }
  give(arg) {
    this.cash -= arg
    document.getElementById("bankroll").innerText = `Bankroll: ${this.cash}`
    return arg
  }
}

class Hand {
  constructor(bet, placeId) {
    this.cards = []
    this.bet = bankroll.give(bet)
    this.bust = false
    this.score = 0
    this.placeId = placeId
    this.BJ = false
  
  }
  empty() {
    this.cards = []
    this.bet = 0
    this.score = 0
  }
  addCard(dubble) {
    let newCard = shoe.deal(this.cards.length)
    this.cards.push(newCard)
    this.score = handValue(this.cards)
    
    cardPlacer(this, newCard)

    if (dubble) {
      flipCard(newCard)
    }
  }
  bustCheck() {
    if (this.score > 21) {
      this.bet = 0
      displayBets()
      this.bust = true
      HANDPOOL.goNext()
    }
  }
  hit() {
    document.getElementById("surrenderButton").setAttribute('disabled',true)
    this.addCard()
    document.getElementById("dubbleButton").setAttribute("disabled", true)

    this.bustCheck()
    
  }
  dubble() {
    document.getElementById("surrenderButton").setAttribute('disabled',true)

    this.bet += bankroll.give(this.bet);
    this.addCard('dubble')
    if (this.score > 21) {
      this.bet = 0
      this.bust = true
      
    this.score = handValue(this.cards)
    displayBets()
    HANDPOOL.goNext()
  }
  async split() { 
    document.getElementById("surrenderButton").setAttribute('disabled',true)

    let newHand = new Hand(this.bet)
    HANDPOOL.POOL.splice(HANDPOOL.handIndex +1,0,newHand)
    newHand.placeId = this.placeId + '1'
    
    this.cards.reverse()
    cardMover(this.cards[1], newHand.placeId) 
    newHand.cards.push(this.cards.pop())
    this.placeId = this.placeId + '0'
    cardMover(this.cards[0], this.placeId) 
    await sleep(TIME)
    this.addCard()
    await sleep(TIME)
    newHand.addCard()
    if (this.cards[0].getValue() === this.cards[1].getValue()) {
      document.getElementById("splitButton").removeAttribute("disabled")
    }
    else {
      document.getElementById("splitButton").setAttribute("disabled", true)
    }
    displayBets()
  }

  stand() {
    document.getElementById("surrenderButton").setAttribute('disabled',true)

    this.score = handValue(this.cards)
    HANDPOOL.goNext()
  }
  surrender() {
    this.cashOut(0.5)
    this.bet=0
    displayBets()
    this.bust = true
    HANDPOOL.goNext()
  }
  cashOut(arg) {
    bankroll.cash += this.bet *arg
    document.getElementById("bankroll").innerText = `Bankroll: ${bankroll.cash}`
    
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
  while (j > 21 && aceCount > 0) {
    j -= 10
    aceCount -= 1
  }

  return j
}

async function waitAdd(arg) {
  await sleep(TIME)
  arg.addCard()
}
class Dealer {
  constructor() {
    this.cards = []
    this.score = 0
    this.bust = false
    this.placeId = 'D'
  }
  async addCard() {
    let newCard = shoe.deal(this.cards.length)
    this.cards.push(newCard)
    newDealerCard(newCard)
    
  }
  checkBJ() {
    this.score = handValue(this.cards)
    return (this.cards.length === 2 && this.score === 21)
  }
  async run() {
    
    showHiddenCard(this.cards)
    while (handValue(this.cards) < 17 || this.cards.length < 2) {
      if (handValue(this.cards) < 17 || this.cards.length < 2) {
        false
      }
      await sleep(TIME)
      this.addCard()
      
    }
    
    this.score = handValue(this.cards)
    if (this.score > 21) {
      this.bust = true
    
    }
  }
  empty() {
    this.cards = []
    this.score = 0
    this.bust = false
  }
}

class HandPool {
  constructor() {
    this.POOL = []
    this.handIndex = 0
    this.HAND = null
  }
  empty() {
    this.POOL = []
    this.handIndex = 0
    this.HAND = null
  }
  activateHand() {
    this.HAND = this.POOL[this.handIndex]
  }
  async goNext() {
    this.handIndex += 1
    this.activateHand()
    document.getElementById("dubbleButton").removeAttribute("disabled")
    if (!this.HAND) {
      document.getElementById("surrenderButton").removeAttribute("disabled")
      await sleep(TIME/2)
      RUNFINALEY()
    }
    else { 
      if (this.HAND.placeId === '1') {
        document.getElementById("surrenderButton").removeAttribute("disabled")
      }
      if (this.HAND.cards[0].getValue() === this.HAND.cards[1].getValue()) {
        document.getElementById("splitButton").removeAttribute("disabled")
      }
      else {
        document.getElementById("splitButton").setAttribute("disabled", true)
      }
    
      if (this.HAND.BJ) {
        this.goNext()
      }
      
    }
  }
  add(arg) {
    this.POOL.push(arg)
    this.activateHand()
  }
 
}

async function RUNFINALEY() {
  
  let c = 0
  for (i in HANDPOOL.POOL) {
    if (HANDPOOL.POOL[i].bust || HANDPOOL.POOL[i].BJ) {
      c += 1
    }
  }
  if (c === HANDPOOL.POOL.length || dealer.checkBJ()) {
    showHiddenCard(dealer.cards)
    func()
  }
  else {
    dealer.run().then(() => {
      for (i in HANDPOOL.POOL) {
        let sub = HANDPOOL.POOL[i] 
        if (!dealer.bust) {
          if ((!sub.bust && !sub.BJ) && sub.score > dealer.score) {
            sub.bet *=2
            displayBets()
            sub.cashOut(1)
          }
          else if (sub.score < dealer.score) {
            sub.bet *=0
            displayBets()
            
          }
          else if (!sub.bust && sub.score === dealer.score) {
            sub.cashOut(1)
          }
        }
        else if (dealer.bust && !sub.BJ) {
          if (!sub.bust) {
            sub.bet *=2
            displayBets()
            sub.cashOut(1)
            
          }
          else if(sub.bust) {
            sub.bet *=0
            displayBets()
            
          }
          
        }    
      }
      
    
      //dealer.empty()
      func()
    })

    
  }

}
async function func() {
  await sleep(TIME)
  document.getElementById("goButton").removeAttribute("disabled")
  res = bankroll.cash -res
  if (res >= 0) {
    document.getElementById("result").innerText = `Gain: +${res}`
  }
  else if (res < 0) {
    document.getElementById("result").innerText = `Loss: ${res}`
  }
  
  document.getElementById("popup").style.display = "flex"

}

async function runGame(two,bet) {
  if (two) {
    twoHand(bet).then(() => {
      displayBets()
      checkBlackJack()
    })
  }
  else {
    oneHand(bet).then(() => {
      displayBets()
      checkBlackJack()
    })
  }
  
}

async function checkBlackJack() {
  let k = 0
  if (!dealer.checkBJ()) {
    for (i in HANDPOOL.POOL) {
      
      
      if (HANDPOOL.POOL[i].score === 21) {
        console.log(HANDPOOL.POOL[i])

        HANDPOOL.POOL[i].BJ = true
        HANDPOOL.POOL[i].bet *=2.5
        HANDPOOL.POOL[i].cashOut(1)
        displayBets()
        
        console.log(i)
        if (HANDPOOL.POOL[0].BJ) {
          HANDPOOL.goNext()
          
          console.log("UUUUUUUUU")
        }
        k += 1
        if (k === HANDPOOL.POOL.length && !HANDPOOL.POOL[0].BJ) {
          showHiddenCard(dealer.cards)
          
          func()
          
        }
      
      }
    }
  }
  else if (dealer.checkBJ()) {
    console.log(HANDPOOL.POOL)
    showHiddenCard(dealer.cards)
    if (handValue(HANDPOOL.POOL[0].cards) === 21) {
      HANDPOOL.POOL[0].cashOut(1)
    }
    else {
      HANDPOOL.POOL[0].bet *= 0
    }
    
    if (HANDPOOL.POOL[1] && handValue(HANDPOOL.POOL[1].cards) === 21) {
      HANDPOOL.POOL[1].cashOut(1)
    }
    else if (HANDPOOL.POOL[1]) {
      HANDPOOL.POOL[1].bet *= 0
      }
    
    displayBets()
    await sleep(TIME) 
    console.log("noo")
    RUNFINALEY()
  }

}

async function twoHand(arg) {
  HANDPOOL.empty()
  HANDPOOL.add(new Hand(arg, '0'))
  HANDPOOL.add(new Hand(arg, '1'))
  displayBets()

  HANDPOOL.POOL[0].addCard()
  await sleep(TIME)

  HANDPOOL.POOL[1].addCard()
  await sleep(TIME)

  dealer.addCard()
  await sleep(TIME)

  HANDPOOL.POOL[0].addCard()
  await sleep(TIME)

  HANDPOOL.POOL[1].addCard()
  await sleep(TIME)

  hiddenCard()
  dealer.cards.push(shoe.deal('Hidden'))
  if (HANDPOOL.POOL[0].cards[0].getValue() === HANDPOOL.POOL[0].cards[1].getValue()) {
    document.getElementById("splitButton").removeAttribute("disabled")
  }
  else {
    document.getElementById("splitButton").setAttribute("disabled", true)
  }
  
}

async function oneHand(arg) {
  HANDPOOL.empty()
  HANDPOOL.add(new Hand(arg, 'U'))
  displayBets()

  HANDPOOL.POOL[0].addCard()
  await sleep(TIME)

  dealer.addCard()
  await sleep(TIME)

  HANDPOOL.POOL[0].addCard()
  await sleep(TIME)

  hiddenCard()
  dealer.cards.push(shoe.deal('Hidden'))
  
  if (HANDPOOL.POOL[0].cards[0].getValue() === HANDPOOL.POOL[0].cards[1].getValue()) {
    document.getElementById("splitButton").removeAttribute("disabled")
  }
  else {
    document.getElementById("splitButton").setAttribute("disabled", true)
  }
}


function seeker(key, hand) {
  let down = 0
  let left = 0
  if (key[0] === '0') {
    left = 1100
    down = 540
  }
  if (key[0] === '1') {
    left = 800
    down = 540

  }
  if (key[0] === 'U') {
    left = 950
    down = 540
  }
  for (let i = 0; i < hand.cards.length-1; i++) {
    left += 30
    down -= 40
  }
  for (let i = 0; i < key.length-1; i++) {
    let pair1 = key[i+1]
    let pair2 =key[i]
    let x = 1.2
    if (pair1 === '0' && pair2 === '0') {
      left += 150 * x
      down -= 60
    }
    if (pair1 === '1' && pair2 === '0') {
      left -= 50
      down -= 60
    }
    if (pair1 === '0' && pair2 === '1'  ) {
      left += 50
      down -= 60
    }
    if (pair1 === '1' && pair2 === '1' ) {
      left -= 150 * x
      down -= 60
    }
    if (pair2 === 'U' && pair1 === '0') {
      left += 100
      down -= 60
    }
    if (pair2 === 'U' && pair1 === '1') {
      left -= 100
      down -= 60
    } 
    
    x = x*x
  }
  return [left, down]
}

function cardPlacer(hand, card) {
  
  let key = hand.placeId
  
  newDisplayCard(card, seeker(key, hand) )
}

function cardMover(card, key) {
  id = card.worldOrder
  sub = document.getElementById(id)
  
  let down = 0
  let left = 0
  if (key[0] === '0') {
    left = 1100
    down = 540
  }
  if (key[0] === '1') {
    left = 800
    down = 540
  }
  if (key[0] === 'U') {
    left = 950
    down =540
  }

  for (let i = 0; i < key.length-1; i++) {
    let pair1 = key[i+1]
    let pair2 =key[i]
    let x = 1.2
    if (pair1 === '0' && pair2 === '0') {
      left += 150 *x
      down -= 60
    }
    if (pair1 === '1' && pair2 === '0') {
      left -= 50
      down -= 60
    }
    if (pair1 === '0' && pair2 === '1') {
      left += 50
      down -= 60
    }
    if (pair1 === '1' && pair2 === '1') {
      left -= 150 * x
      down -= 60
    }
    if (pair2 === 'U' && pair1 === '0') {
      left += 100
      down -= 60
    }
    if (pair2 === 'U' && pair1 === '1') {
      left -= 100
      down -= 60
    } 
    
    x = x*x
  }

  sub.style.left =`${left}px`
  sub.style.top = `${down}px`
  

}

function handBetPlacer(hand) {
  let key = hand.placeId
  let down = 0
  let left = 0
  if (key[0] === '0') {
    left = 1100
    down = 700
  }
  if (key[0] === '1') {
    left = 800
    down = 700
  }
  if (key[0] === 'U') {
    left = 950
    down = 700
  }

  for (let i = 0; i < key.length-1; i++) {
    let pair1 = key[i+1]
    let pair2 =key[i]
    let x = 1.2
    if (pair1 === '0' && pair2 === '0') {
      left += 150 *x
      down -= 60
    }
    if (pair1 === '1' && pair2 === '0') {
      left -= 50
      down -= 60
    }
    if (pair1 === '0' && pair2 === '1') {
      left += 50
      down -= 60
    }
    if (pair1 === '1' && pair2 === '1') {
      left -= 150 * x
      down -=60
    }
    if (pair2 === 'U' && pair1 === '0') {
      left += 100
      down -= 60
    }
    if (pair2 === 'U' && pair1 === '1') {
      left -= 100
      down -= 60
    } 
    
    x = x*x
  }
  return [left, down]
  
}

function displayBets() {
  document.getElementById("bet-container").innerHTML = ''
  for (i in HANDPOOL.POOL) {
    let hand = HANDPOOL.POOL[i]
    let bet = document.createElement('div')
    let place = handBetPlacer(hand)
    bet.innerText = hand.bet
    bet.style.position = "absolute"
    bet.style.transform = "translate(25%,25%)"
    bet.style.width = "180px"
    bet.style.color = "red"
    bet.style.fontSize ="40px"
    bet.style.fontWeight = "bold"
    bet.style.left =`${place[0]}px`
    bet.style.top = `${place[1]}px`
    bet.id = hand.placeId
    document.getElementById("bet-container").appendChild(bet);

  }
  

}


const HANDPOOL = new HandPool
let shoe = new Shoe(amountDecks, deckPen);
const bankroll = new Bankroll(money)
const dealer = new Dealer

TIME = document.getElementById("speed").innerText
console.log(TIME)
shoe.shuffle()


document.getElementById("bankroll").innerText = `Bankroll: ${bankroll.cash}`






function sleep(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

