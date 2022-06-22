// Do not use eval!!!
module.exports = {
  expressionCalculator
}

function expressionCalculator (expr) {
  const sub = CONSTANTS.getMinusSymbol
  const negativeSymbol = CONSTANTS.getNegativeSymbol

  // более правильно проверка открытия закрытия скобок
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

  for (let i = 0; i < expr.length; i++) {
    if (expr.charAt(i) === openBracket) {
      newExpr = newExpr + noBracketsExp
      noBracketsExp = ''
    }

    noBracketsExp = noBracketsExp + expr.charAt(i)

    if (expr.charAt(i) === closeBracket) {
      const resSimpleExp = countSimpleExpr(noBracketsExp)
      newExpr = newExpr + resSimpleExp + expr.slice(i + 1)
      const correctIndex = 1
      i = expr.length + correctIndex
    }

    const isLastCalc = i === expr.length - 1
    if (isLastCalc) newExpr = countSimpleExpr(noBracketsExp)
  }

  return newExpr
}

function countSimpleExpr (noBracketsExp) {
  const divSymbol = CONSTANTS.getDivSymbol
  const addSymbol = CONSTANTS.getAddSymbol
  const negativeSymbol = CONSTANTS.getNegativeSymbol

  let exprArr = normalizeStringExpr(noBracketsExp).split(' ')
  exprArr = actionToArray(exprArr, divSymbol).filter((el) => el != null)
  const [firstItem] = actionToArray(exprArr, addSymbol).filter((el) => el != null)
  const res = parseFloat(firstItem)
  return (res < 0) ? `${negativeSymbol}${-res}` : res
}

function checkPairOfBrackets (expr) {
  const [openBracket, closeBracket] = CONSTANTS.getBrackets
  const isCountBracketsEqual = expr.split(openBracket).length === expr.split(closeBracket).length
  if (!isCountBracketsEqual) throw new Error('ExpressionError: Brackets must be paired')
}

function isExprHasOperation (expr) {
  return !CONSTANTS.getOperation.some(item => (String(expr).indexOf(item) > -1))
}

function normalizeStringExpr (expr) {
  // add constants and rewrite this moment
  const cleanExpr = expr.replace(/\s/g, '').replace(/[\\()]/g, '')
  const normExpr = cleanExpr.replace(/\+/g, ' + ').replace(/-/g, ' - ').replace(/\*/g, ' * ').replace(/[/)]/g, ' / ')
  return normExpr
}

function tryOperation (minimalExpr, operation) {
  let res = null
  let [firstItem, secondItem, thirdItem] = minimalExpr
  const [multi, division, add, sub] = ['*', '/', '+', '-']
  const negativeSymbol = 'n'

  if (typeof (firstItem) === 'string') firstItem = firstItem.replace(negativeSymbol, sub)
  if (typeof (thirdItem) === 'string') thirdItem = thirdItem.replace(negativeSymbol, sub)

  if ((secondItem === multi) && (operation === division)) res = (parseFloat(firstItem) * parseFloat(thirdItem))
  if ((secondItem === division) && (operation === division) && parseFloat(thirdItem) === 0) throw new Error('TypeError: Division by zero.')
  if ((secondItem === division) && (operation === division)) res = (parseFloat(firstItem) / parseFloat(thirdItem))
  if ((secondItem === add) && (operation === add)) res = (parseFloat(firstItem) + parseFloat(thirdItem))
  if ((secondItem === sub) && (operation === add)) res = (parseFloat(firstItem) - parseFloat(thirdItem))

  return res
}

function actionToArray (exprArr, operation) {
  exprArr.forEach((item, i) => {
    const minimalExprSize = 3
    const minimalExpr = exprArr.slice(i, i + minimalExprSize)
    const resArr = tryOperation(minimalExpr, operation)
    if (resArr !== null) exprArr.splice(i, minimalExprSize, null, null, resArr)
  })
  return exprArr
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
