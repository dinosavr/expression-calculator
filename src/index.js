function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    // write your solution here
    // rewrite action / *

    let result;           

    checkBrackets(expr);
    
    while (!checkSolvesReady(expr)) { // выводит 0, затем 1, затем 2
        expr = getSimpleExpr(expr);
      }
    
      if(typeof(expr) == 'string') expr = expr.replace('m','-');

      result = parseFloat(expr);    

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
        
        if(expr.charAt(i) == STARTBRACKET) {
            currExpr = currExpr + simpleExp; 
            simpleExp = '';
        }
        
        simpleExp = simpleExp + expr.charAt(i);

        if(expr.charAt(i) == ENDBRACKET) {
        simpleExp = countSimpleExpr(simpleExp);   
        currExpr = currExpr + simpleExp + getLastPartExpr(i+1, expr);
        i = expr.length + 1;         
        }

        if(i == expr.length-1) currExpr = countSimpleExpr(simpleExp);   
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

tempExpressionArray = actionToArray(tempExpressionArray, ADDSYMBOL);    
tempExpressionArray = filterArray(tempExpressionArray);       

result = parseFloat(tempExpressionArray[0]);

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

    for (var i = 0; i < str.length; i++) {
    if (str[i] === STARTBRACKET) ready=false;
    if (str[i] === ENDBRACKET) ready=false;
    if (str[i] === MULTISYMBOL) ready=false;
    if (str[i] === DIVSYMOBL) ready=false;
    if (str[i] === ADDSYMBOL) ready=false;
    if (str[i] === SUBSYMBOL) ready=false;

    }

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
    
    return tempExpressionArray;
}

function normalizeStringExpr(expr){

    tempExpression = expr.replace(/\s/g, '');    
    tempExpression = tempExpression.replace(/[\()]/g, "").replace(/[\)]/g, "").replace(/\+/g, " + ").replace(/\-/g, " - ").replace(/\*/g, " * ").replace(/[\/)]/g, " / ");

    return tempExpression;
}

function tryAction (firstValue, secondValue, thirdValue, action){

    let answer = null;

    if(typeof(firstValue) == 'string') firstValue = firstValue.replace('m','-');
    if(typeof(thirdValue) == 'string') thirdValue = thirdValue.replace('m','-');

      if((secondValue == '*') && (action == '/')) answer = (parseFloat(firstValue) * parseFloat(thirdValue));
      if((secondValue == '/') && (action == '/') && parseFloat(thirdValue) == 0) throw "TypeError: Division by zero.";
      if((secondValue == '/') && (action == '/')) answer = (parseFloat(firstValue) / parseFloat(thirdValue));
      if((secondValue == '+') && (action == '+')) answer = (parseFloat(firstValue) + parseFloat(thirdValue));
      if((secondValue == '-') && (action == '+')) answer = (parseFloat(firstValue) - parseFloat(thirdValue));

      return answer;      
}

function actionToArray(tempExpressionArray, action){
    let i = 0;

    for (i; i < tempExpressionArray.length; i++) {

        firstValue = tempExpressionArray[i];
        secondValue = tempExpressionArray[i+1];
        thirdValue = tempExpressionArray[i+2];
        
        answer = tryAction (firstValue, secondValue, thirdValue, action);

        if (answer !== null) {
            tempExpressionArray[i] = null;
            tempExpressionArray[i+1] = null;
            tempExpressionArray[i+2] = answer;
        }
        
    }

    return tempExpressionArray;
}

function filterArray(tempExpressionArray){
    let filtered;

    filtered = tempExpressionArray.filter(function (el) {
        return el != null;
      });
      
      return filtered;
}