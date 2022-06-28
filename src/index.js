// Do not use eval!!!
module.exports = {
  expressionCalculator
}

const CONSTANTS = {
  brackets: ['(', ')'],
  addSymbol: '+',
  minusSymbol: '-',
  multiSymbol: '*',
  divSymbol: '/',
  negativeSymbol: 'n',
  get getBrackets () { return this.brackets },
  get getAddSymbol () { return this.addSymbol },
  get getMinusSymbol () { return this.minusSymbol },
  get getMultiSymbol () { return this.multiSymbol },
  get getDivSymbol () { return this.divSymbol },
  get getOperation () { return [this.multiSymbol, this.divSymbol, this.addSymbol, this.minusSymbol] },
  get getNegativeSymbol () { return this.negativeSymbol }
}

function expressionCalculator (expr) {
  expr = removeSpaces(expr)
  const sub = CONSTANTS.getMinusSymbol
  const negativeSymbol = CONSTANTS.getNegativeSymbol

  checkPairOfBrackets(expr)

  while (!isExprHasOperation(expr)) {
    expr = stepByStepCalcExpr(expr)
  }

  if (typeof (expr) === 'string') expr = expr.replace(negativeSymbol, sub)

  const res = parseFloat(expr)
  return res
}

function stepByStepCalcExpr (expr) {
  const [openBracket, closeBracket] = CONSTANTS.getBrackets
  let newExpr = ''
  let noBracketsExp = ''
  let isBracket = true

  for (let i = 0; i < expr.length; i++) {
    if (expr.charAt(i) === openBracket) {
      newExpr = newExpr + noBracketsExp + expr.charAt(i)
      noBracketsExp = ''
    }

    isBracket = [openBracket, closeBracket].indexOf(expr[i]) > -1
    if (!isBracket) noBracketsExp = noBracketsExp + expr.charAt(i)

    if (expr.charAt(i) === closeBracket) {
      const resSimpleExp = countSimpleExpr(noBracketsExp)
      newExpr = newExpr.slice(0, -1) + resSimpleExp + expr.slice(i + 1)
      noBracketsExp = ''
      return newExpr
    }

    const isExprHasNotBrackets = i === expr.length - 1
    if (isExprHasNotBrackets) newExpr = countSimpleExpr(noBracketsExp)
  }

  return newExpr
}

function countSimpleExpr (noBracketsExp) {
  const divSymbol = CONSTANTS.getDivSymbol
  const multiSymbol = CONSTANTS.getMultiSymbol
  const minusSymbol = CONSTANTS.getMinusSymbol
  const addSymbol = CONSTANTS.getAddSymbol
  const negativeSymbol = CONSTANTS.getNegativeSymbol
  let res = ''

  const exprArr = normalizeStrExpr(noBracketsExp).split(' ').filter((el) => el !== '')

  while (exprArr.indexOf(divSymbol) > -1) {
    const index = exprArr.indexOf(divSymbol)
    const prevItem = parseFloat(mayBeNegativeSymbolToMinus(exprArr[index - 1]))
    const nextItem = parseFloat(mayBeNegativeSymbolToMinus(exprArr[index + 1]))
    if (nextItem === 0) throw new Error('TypeError: Division by zero.')
    const res = prevItem / nextItem
    exprArr.splice(index - 1, 3, res)
    if (isNaN(prevItem) || isNaN(nextItem)) break
  }

  while (exprArr.indexOf(multiSymbol) > -1) {
    const index = exprArr.indexOf(multiSymbol)
    const prevItem = parseFloat(mayBeNegativeSymbolToMinus(exprArr[index - 1]))
    const nextItem = parseFloat(mayBeNegativeSymbolToMinus(exprArr[index + 1]))
    const res = prevItem * nextItem
    exprArr.splice(index - 1, 3, res)
    if (isNaN(prevItem) || isNaN(nextItem)) break
  }

  while (exprArr.indexOf(minusSymbol) > -1) {
    const index = exprArr.indexOf(minusSymbol)
    const prevItem = parseFloat(mayBeNegativeSymbolToMinus(exprArr[index - 1]))
    const nextItem = parseFloat(mayBeNegativeSymbolToMinus(exprArr[index + 1]))
    if (prevItem) {
      const res = prevItem - nextItem
      exprArr.splice(index - 1, 3, res)
    } else {
      const res = -nextItem
      exprArr.splice(index, 2, res)
    }

    if (isNaN(prevItem) || isNaN(nextItem)) break
  }

  while (exprArr.indexOf(addSymbol) > -1) {
    const index = exprArr.indexOf(addSymbol)
    const prevItem = parseFloat(mayBeNegativeSymbolToMinus(exprArr[index - 1]))
    const nextItem = parseFloat(mayBeNegativeSymbolToMinus(exprArr[index + 1]))
    if (prevItem || prevItem === 0) {
      const res = prevItem + nextItem
      exprArr.splice(index - 1, 3, res)
    } else {
      const res = nextItem
      exprArr.splice(index, 2, res)
    }
    if (isNaN(prevItem) || isNaN(nextItem)) break
  }

  [res] = exprArr
  return (res < 0) ? `${negativeSymbol}${-res}` : res
}

function mayBeNegativeSymbolToMinus (mayNegative) {
  const minusSymbol = CONSTANTS.getMinusSymbol
  const negativeSymbol = CONSTANTS.getNegativeSymbol
  if (typeof (mayNegative) === 'string') mayNegative = mayNegative.replace(negativeSymbol, minusSymbol)
  return mayNegative
}

function checkPairOfBrackets (expr) {
  const [openBracket, closeBracket] = CONSTANTS.getBrackets
  const isCountBracketsEqual = expr.split(openBracket).length === expr.split(closeBracket).length
  if (!isCountBracketsEqual) throw new Error('ExpressionError: Brackets must be paired')
  const exprArr = expr.split('').filter(item => CONSTANTS.getBrackets.indexOf(item) > -1)
  let sumBrackets = 0
  exprArr.forEach(item => {
    if (item === openBracket) sumBrackets++
    if (item === closeBracket) sumBrackets--
    if (sumBrackets < 0) throw new Error('ExpressionError: Bracket order is wrong')
  })
}

function isExprHasOperation (expr) {
  return ![...CONSTANTS.getOperation, ...CONSTANTS.getBrackets].some(item => (String(expr).indexOf(item) > -1))
}

function normalizeStrExpr (expr) {
  const cleanExpr = removeSpaces(expr)
  const calcNegativeSymbol = cleanExpr.replace(/--/g, '+').replace(/-n/g, '+').replace(/nn/g, '+').replace(/\++/g, '+')
  const replaceNegativeOperation = calcNegativeSymbol.replace(/\*-/g, '*n').split('/-').join('/n').split('/+').join('/')
  const normExpr = replaceNegativeOperation.replace(/\+/g, ' + ').replace(/-/g, ' - ').replace(/\*/g, ' * ').replace(/[/)]/g, ' / ')
  return normExpr
}

function removeSpaces (expr) {
  return expr.replace(/\s/g, '')
}
