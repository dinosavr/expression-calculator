function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    // write your solution here
    // rewrite action / *

    let result;       
    let debug = false;

    if(debug) console.log("Start expr = " + expr);     

    checkBrackets(expr);
    
    while (!checkSolvesReady(expr)) { // выводит 0, затем 1, затем 2
        if(debug) console.log('EXPR befor  = ' + expr);
        expr = getSimpleExpr(expr);
        if(debug) console.log('EXPR after  = ' + expr);
      }
    
      if(typeof(expr) == 'string') expr = expr.replace('m','-');

      result = parseFloat(expr);
      console.log('RESULT = ' + result);
      // getSimpleExpr(expr);

    // countSimpleExpr(expr);

    return result;
}

module.exports = {
    expressionCalculator
}

function getSimpleExpr(expr){

    const STARTBRACKET = '(';
    const ENDBRACKET = ')';

    let currExpr = '';
    let simpleExp = '';
    let debug = false;
    

     for (var i = 0; i < expr.length; i++) {
        // currExpr = currExpr + expr.charAt(i);
        
        if(expr.charAt(i) == STARTBRACKET) {
            currExpr = currExpr + simpleExp; 
            if(debug) console.log("CurrExpr = " + currExpr);     
            simpleExp = '';
        }
        
        simpleExp = simpleExp + expr.charAt(i);

        if(expr.charAt(i) == ENDBRACKET) {
        if(debug) console.log("simpleExp = " + simpleExp);     
        simpleExp = countSimpleExpr(simpleExp);   
        if(debug) console.log("CountSimpleExp = " + simpleExp);     
        currExpr = currExpr + simpleExp + getLastPartExpr(i+1, expr);
        if(debug) console.log("NewCurrExpr = " + currExpr);  
        i = expr.length + 1;         
        // console.log("NewCurrExpr + Last Part = " + currExpr + getLastPartExpr(i+1, expr));           
        // expr = currExpr + getLastPartExpr(i, expr);        
        }

        if(i == expr.length-1) currExpr = countSimpleExpr(simpleExp);   
        // if(i == expr.length) console.log("Final expr = " + expr);     
        // console.log("Final NewCurrExpr = " + currExpr);     
}

return currExpr;

}
function getLastPartExpr(i, expr){
    let lastPartOfExpr = '';
    for (i; i < expr.length; i++) {
        lastPartOfExpr = lastPartOfExpr + expr.charAt(i);
};
   return lastPartOfExpr;
}
function countSimpleExpr(expr)             {
    const STARTBRACKET = '(';
    const ENDBRACKET = ')';
    const MULTISYMBOL = '*';
    const DIVSYMOBL = '/';
    const ADDSYMBOL = '+';
    const SUBSYMBOL = '-';
    
    let debug = false;
    
tempExpressionArray = stringToArray(expr);
    
tempExpressionArray = actionToArray(tempExpressionArray, DIVSYMOBL);    
tempExpressionArray = filterArray(tempExpressionArray);      
if (debug) console.log("filterArray apply " + tempExpressionArray);        

tempExpressionArray = actionToArray(tempExpressionArray, ADDSYMBOL);    
tempExpressionArray = filterArray(tempExpressionArray);       

result = parseFloat(tempExpressionArray[0]);
if (debug) console.log("Answer = " + result);    

if(result < 0) result = 'm'+(-result);

return result; 
}

function checkBrackets(expr) {
    const STARTBRACKET = '(';
    const ENDBRACKET = ')';

    if(charCount(expr,STARTBRACKET) !== charCount(expr,ENDBRACKET)) throw("ExpressionError: Brackets must be paired");

}

function checkSolvesReady(expr) {
    const STARTBRACKET = '(';
    const ENDBRACKET = ')';
    const MULTISYMBOL = '*';
    const DIVSYMOBL = '/';
    const ADDSYMBOL = '+';
    const SUBSYMBOL = '-';

    let ready=true;
    let str = expr;    
    let debug = false;

    for (var i = 0; i < str.length; i++) {
    if (str[i] === STARTBRACKET) ready=false;
    if (str[i] === ENDBRACKET) ready=false;
    if (str[i] === MULTISYMBOL) ready=false;
    if (str[i] === DIVSYMOBL) ready=false;
    if (str[i] === ADDSYMBOL) ready=false;
    if (str[i] === SUBSYMBOL) ready=false;
    // if ((str[i] === SUBSYMBOL) && str.split(SUBSYMBOL).length == 1) console.log('Check minus: ' + str);

    }

    if(debug) console.log('Check expr = ' + expr);
    if(debug) console.log('Check answer = ' + ready);
    return ready;
}

function charCount(str,chr) {
    let count =0;
    for (var i = 0; i < str.length; i++) {
    if (str[i].toLowerCase() === chr.toLowerCase()) {
    count++;
    }
    }

    return count;
    }

function stringToArray(expr){
    let debug = false;
    let splitSymbol = " ";
    let tempExpression;

    tempExpression = normalizeStringExpr(expr);
    tempExpressionArray = tempExpression.split(splitSymbol);
    if (debug) console.log("tempExpressionToArray = " + tempExpressionArray); 
    
    return tempExpressionArray;
}

function normalizeStringExpr(expr){

    let debug = false;

    if (debug)  console.log("Get Simple expr = " + expr);
    tempExpression = expr.replace(/\s/g, '');    
    if (debug)  console.log("tempExpression1 = " + tempExpression);
    tempExpression = tempExpression.replace(/[\()]/g, "").replace(/[\)]/g, "").replace(/\+/g, " + ").replace(/\-/g, " - ").replace(/\*/g, " * ").replace(/[\/)]/g, " / ");
    if (debug)  console.log("tempExpression2 = " + tempExpression);
    // tempExpression = expr.replace(ADDSYMBOL, '');
    // tempExpression = expr.replace(/\+/g, " + ");

    return tempExpression;
}

function tryAction (firstValue, secondValue, thirdValue, action){

    let answer = null;

    // rewrite action / *

    if(typeof(firstValue) == 'string') firstValue = firstValue.replace('m','-');
    if(typeof(thirdValue) == 'string') thirdValue = thirdValue.replace('m','-');

      if((secondValue == '*') && (action == '/')) answer = (parseFloat(firstValue) * parseFloat(thirdValue));
      if((secondValue == '/') && (action == '/') && parseFloat(thirdValue) == 0) throw "TypeError: Devision by zero.";
      if((secondValue == '/') && (action == '/')) answer = (parseFloat(firstValue) / parseFloat(thirdValue));
      if((secondValue == '+') && (action == '+')) answer = (parseFloat(firstValue) + parseFloat(thirdValue));
      if((secondValue == '-') && (action == '+')) answer = (parseFloat(firstValue) - parseFloat(thirdValue));

      return answer;      
}

function actionToArray(tempExpressionArray, action){
    let i = 0;
    let debug = false;

    for (i; i < tempExpressionArray.length; i++) {

        firstValue = tempExpressionArray[i];
        secondValue = tempExpressionArray[i+1];
        thirdValue = tempExpressionArray[i+2];
        
        answer = tryAction (firstValue, secondValue, thirdValue, action);
        // if (answer !== null) console.log('answer: ' + answer);
        if (answer !== null) {
            tempExpressionArray[i] = null;
            tempExpressionArray[i+1] = null;
            tempExpressionArray[i+2] = answer;
            if (debug)  console.log("tempExpressionToArray after action = " + tempExpressionArray);                            
        }
        
    }

    return tempExpressionArray;
}

function filterArray(tempExpressionArray){
    let filtered;
    let debug = false;

    filtered = tempExpressionArray.filter(function (el) {
        return el != null;
      });
      
      if(debug) console.log(filtered);
      return filtered;
}