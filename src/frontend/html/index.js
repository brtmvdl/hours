
// elements
const inputName = document.getElementById('input-name')
const inputStartHour = document.getElementById('input-start-hour')
const inputStartMinute = document.getElementById('input-start-minute')
const inputEndHour = document.getElementById('input-end-hour')
const inputEndMinute = document.getElementById('input-end-minute')
const buttonSave = document.getElementById('button-save')
const txtErrors = document.getElementById('text-errors')

const tableHours = document.getElementById('table-hours')
const btnFixo = document.getElementById('btn-fixo')
const btnLivre = document.getElementById('btn-livre')

btnFixo.addEventListener('click', () => {
  const txtNome = document.createElement('input')
  txtNome.type = 'text'

  const txtInicio = document.createElement('input')
  txtInicio.type = 'time'

  const txtTermino = document.createElement('input')
  txtTermino.type = 'time'

  const txtDuracao = document.createElement('span')
  txtDuracao.innerText = '00:00'

  const btnSalvar = document.createElement('button')
  btnSalvar.innerText = 'Salvar'

  btnSalvar.addEventListener('click', () => {
    const [horaInicio, minutoInicio] = txtInicio.value.split(':')
    const [horaTermino, minutoTermino] = txtTermino.value.split(':')

    // TODO Adicionar tempo de duração à tabela
    console.log(`Das ${horaInicio}:${minutoInicio} às ${horaTermino}:${minutoTermino}.`)

    // TODO Notificar no tempo inicial e no tempo final
  }, false)

  // adicionar campos no DOM
  const tableLinha = document.createElement('tr')

  const colunaNome = document.createElement('td')
  colunaNome.append(txtNome)
  tableLinha.append(colunaNome)

  const colunaInicio = document.createElement('td')
  colunaInicio.append(txtInicio)
  tableLinha.append(colunaInicio)

  const colunaTermino = document.createElement('td')
  colunaTermino.append(txtTermino)
  tableLinha.append(colunaTermino)

  const colunaDuracao = document.createElement('td')
  colunaDuracao.append(txtDuracao)
  tableLinha.append(colunaDuracao)

  const colunaAcoes = document.createElement('td')
  colunaAcoes.append(btnSalvar)
  tableLinha.append(colunaAcoes)

  tableHours.append(tableLinha)
}, false)

btnLivre.addEventListener('click', () => {
  const txtNome = document.createElement('input')
  txtNome.type = 'text'

  // adicionar campos de texto nas colunas
  const colunaNome = document.createElement('td')
  colunaNome.appendChild(txtNome)

  // TODO Adiconar botão para início da contagem

  // TODO Adicionar botão para término da contagem

  // TODO Adicionar contador

  // TODO Implementar ações dos botões

  // adicionar colunas na linha
  const tableLinha = document.createElement('tr')
  tableLinha.appendChild(colunaNome)

  // adicionar linha na tabela
  tableHours.appendChild(tableLinha)
}, false)

// vars
const hours = []

// helpers

const jsonParse = (text, onempty = null) => {
  try { return JSON.parse(text) || onempty }
  catch (error) { console.error('JSON.parse error', { error, text, onempty }) }
  return onempty
}

const onInputNumber = ({ key, target: { value } }, maxlength = 2) =>
  key.match(/[0-9]/ig) !== null && value.length < maxlength

const onInputFocus = ({ target }) => target.setSelectionRange(0, target.value.length)

const getValues = (...elements) => elements.map(({ value }) => value)

const validate = (startDate, endDate) => {
  const errors = []

  // valid name
  const [name] = getValues(inputName)
  if (!name) errors.push('invalid name.')
  if (hours.some(({ name: title }) => title === name)) errors.push('duplicated name.')

  // valid dates
  if (!startDate) errors.push('invalid start date.')
  if (!endDate || diffTime(endDate, startDate) <= 0) errors.push('invalid end date.')

  console.log('validate', { startDate, endDate, errors })

  return errors
}

const clearChildren = (element) => { while (element.children.length) element.children[0].remove(); }

const clearValues = (...elements) => elements.forEach(element => element.value = '')

const appendError = error => {
  const txt = document.createElement('div')
  txt.innerText = error
  txtErrors.appendChild(txt)
}

const showErrors = (errors = []) => {
  clearChildren(txtErrors)
  errors.forEach(error => appendError(error))
}

const padDateString = (text) => text.toString().padStart(2, "0")

const getDateElements = (date = new Date()) =>
  typeof date === 'object' ? ([
    +date.getFullYear(),
    +date.getMonth(),
    +date.getDate(),
    +date.getHours(),
    +date.getMinutes()
  ]) : null

const dateToString = ([, month, day, hour, minute]) => 
  padDateString(month) + '/' +
  padDateString(day) + ' ' +
  padDateString(hour) + ':' +
  padDateString(minute) + 'hs'

const addTD = (text, tr) => {
  const td = document.createElement('td')
  td.innerText = text
  tr.appendChild(td)
}

const diffTime = (time1, time2) => new Date(...time1) - new Date(...time2)

const timeName = (time) => {
  const seconds = Math.ceil(Math.abs(time) / 1000)
  if (seconds < 60) return seconds + ' second(s)'

  const minutes = Math.ceil(seconds / 60)
  if (minutes < 60) return minutes + ' minute(s)'

  const hours = Math.ceil(minutes / 60)
  if (hours < 24) return hours + ' hour(s)'

  const days = Math.ceil(hours / 24)
  if (days < 7) return days + ' day(s)'

  return 'more than one week'
}

const remaningTime = (start, end) => {
  const current = getDateElements()

  if (current < start) return timeName(diffTime(current, start)) + ' to start'
  else if (current < end) return timeName(diffTime(current, end)) + ' to end'
  else return timeName(diffTime(current, end)) + ' from end'
}

const addTR = ({ name, startDate, endDate }, table) => {
  const tr = document.createElement('tr')
  const texts = [name, dateToString(startDate), dateToString(endDate), remaningTime(startDate, endDate)]
  texts.forEach(text => addTD(text, tr))
  table.appendChild(tr)
}

const showHours = () => {
  clearChildren(tableHours)
  hours.forEach((hour) => addTR(hour, tableHours))
}

const saveHours = () => localStorage.setItem('hours', JSON.stringify(hours))

const addPeriod = (name, startDate, endDate) => {
  hours.push({ name, startDate, endDate })
  clearChildren(txtErrors)
  clearValues(inputName, inputStartHour, inputStartMinute, inputEndHour, inputEndMinute)
  inputName.focus()
  saveHours()
}

const onSaveClick = () => {
  const [name, startHour, startMinute, endHour, endMinute] =
    getValues(inputName, inputStartHour, inputStartMinute, inputEndHour, inputEndMinute)

  const [curYear, curMonth, curDay] = getDateElements()
  const startDate = [curYear, curMonth, curDay, +startHour, +startMinute]
  const endDate = [curYear, curMonth, curDay, +endHour, +endMinute]

  const errors = validate(startDate, endDate)
  errors && errors.length ? showErrors(errors) : addPeriod(name, startDate, endDate)
}

const updateTime = () => [showHours(), window.requestAnimationFrame(updateTime)]

const loadHours = () => {
  while (hours[0]) hours.slice()

  jsonParse(localStorage.getItem('hours'), [])
    .forEach(hour => hours.push(hour))
}

const onBodyLoad = () => loadHours()

// events
// document.body.onload = () => onBodyLoad()
// window.requestAnimationFrame(updateTime)
