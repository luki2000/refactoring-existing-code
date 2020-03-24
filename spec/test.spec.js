// WE ARE ON PAGE 20


function statment(invoice, plays) {
  let totalAmount = 0;
  let result = `Statement for ${invoice.customer}\n`;
  
  for(let perf of invoice.performances) {

    // print line for this order
    result += ` ${playFor(perf).name}: ${currencyUSD(amountFor(perf)/100)} (${perf.audience} seats)\n`;
    totalAmount += amountFor(perf);
  }
 
  result += `Amount owed is ${currencyUSD(totalAmount)}\n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;
}

function totalVolumeCredits() {
  let result = 0;
  for(let perf of invoice.performances) {
    result += volumeCreditsFor(perf);
  }
  return result;
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function volumeCreditsFor(aPerformance) {
  let result = 0;
  //add volume credits
  result += Math.max(aPerformance.audience - 30, 0);
  // add extra credit for every ten comedy attendees
  if("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);
  return result;
}

function currencyUSD(aNumber) {
  return new Intl.NumberFormat("en-US",{ 
    style: "currency", currency: "USD",
    minimumFractionDigits: 2}).format(aNumber/100);
}


function amountFor(aPerformance) {
  let result = 0;
  switch(playFor(aPerformance).type) {
      case "tragedy":
          result = 40000;
          if(aPerformance.audience > 30) {
              result +=1000 * (aPerformance.audience - 30);
          }
          break;
      case "comedy":
          result = 30000;
          if(aPerformance.audience > 20) {
              result += 10000 + 500 * (aPerformance.audience - 20);
          }
          result += 300 * aPerformance.audience;
          break;
      default:
          throw Error(`unkown type: ${playFor(aPerformance).type}`);
  }
  return result;
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


describe("currencyUSD", function() {
  it("number should be converted to dollars to two decimals in string", function() {
    expect(currencyUSD(5500)).toBe('$55.00');
  });

});