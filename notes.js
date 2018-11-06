let _ = require('lodash/fp')

let now = () => parseInt(new Date(new Date().toUTCString()).getTime() / 1000)
let daysAgo = (n = 1) => now() - (n * 24 * 60 * 60)

let transactions = [
  {
    timestamp: 1541510249,
    type: 'buy',
    price: 90,
  },
  {
    timestamp: 1541506649,
    type: 'sell',
    price: 100,
  },
  {
    timestamp: 1541423849,
    type: 'sell',
    price: 50,
  },
  {
    timestamp: 1540905449,
    type: 'buy',
    price: 0,
  },
  {
    timestamp: 1538831849,
    type: 'sell',
    price: 35,
  },
  {
    timestamp: 1509974249,
    type: 'buy',
    price: 60,
  },
]

let log = _.tap((o) => console.log(JSON.stringify(o, null, 2)))

let selectPrice = _.prop('price')
let selectType = _.prop('type')
let selectTimestamp = _.prop('timestamp')

let sum = _.reduce((p, c) => p + c, 0)
let sumPrice = _.pipe(
  _.map(selectPrice),
  sum,
)
let sortByPrice = _.sortBy(selectPrice)
let groupByType = _.groupBy(selectType)
let convertBuys = _.pipe(
  groupByType,
  _.toPairs,
  _.map(([type, transactions]) =>
    type === 'buy' ?
    [type, transactions.map(
      (t) => ({...t, price: t.price * -1})
    )] :
    [type, transactions]
  ),
  _.flatMap(([type, transactions]) => transactions)
)

let sumTransactions = _.pipe(convertBuys, sumPrice)

let last = (n) => _.pipe(
  convertBuys,
  _.filter(t => daysAgo(n) < t.timestamp),
)
let lastDay = last(1)
let lastWeek = last(7)
let lastDayGross = _.pipe(lastDay, sumPrice)
let lastWeekGross = _.pipe(lastWeek, sumPrice)
const reportLabels = ['lastDayGross', 'lastWeekGross']
let createReports = _.pipe(
  _.over([lastDayGross, lastWeekGross]),
  _.zipObject(reportLabels),
)

let output = lastDayGross

console.log(JSON.stringify(
  output(transactions)
, null, 2))
