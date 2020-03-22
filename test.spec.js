function statment(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("en-US",{ 
                                      style: "currency", currency: "USD",
                                      minimumFractionDigits: 2}).format;
  for(let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = amountFor(perf, play);

    //add volume credits
    volumeCredits += Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

    // print line for this order
    result += ` ${play.name}: ${format(thisAmount/100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount/100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}


function amountFor(perf, play) {
  let thisAmount = 0;
  switch(play.type) {
      case "tragedy":
          thisAmount = 40000;
          if(perf.audience > 30) {
              thisAmount +=1000 * (perf.audience - 30);
          }
          break;
      case "comedy":
          thisAmount = 30000;
          if(perf.audience > 20) {
              thisAmount += 10000 + 500 * (perf.audience - 20);
          }
          thisAmount += 300 * perf.audience;
          break;
      default:
          throw Error(`unkown type: ${play.type}`);
  }
  return thisAmount;
}

/// DATA

const plays = {
  "hamlet": {"name":"Hamlet","type": "tragedy"},
  "as-like": {"name": "As You Like It", "type": "comedy"},
  "othello": {"name": "Othello", "type": "tragedy"}
}

const invoice = {
  "customer": "BigCo",
  "performances": [
      {"playID": "hamlet",
      "audience": 55
      },
      {"playID": "as-like",
       "audience": 35
      },
      {"playID": "othello",
       "audience": 40
      } 
      ]
};



console.log(statment(invoice,plays));


//TEST SUITE

describe("AmountFor", function() {
    it("An audience of 55 in tragedy should cost 65,000", function() {
      expect(amountFor(invoice.performances[0], plays.hamlet)).toBe(65000);
    });
    it("An audience of 35 in comedy plays should cost 58,000", function() {
      expect(amountFor(invoice.performances[1], plays['as-like'])).toBe(58000);
    });
});