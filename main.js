const board = document.querySelector('.board')
const statement = document.querySelector('.statement')
const resetBtn = document.querySelector('[data-reset]')
const modeSelector = document.querySelector('.mode-selector')

const Lines = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7]
]

const players = {
  circle: '⭕',
  cross: '❌',
}

const mode = {
  single: 'single',
  duo: 'duo',
}

const model = {
  circle: [],
  cross: [],
  isWinnerAppear(player, pattern) {
    let result = false
    for (const line of Lines) {
      result = line.every(index => player.includes(index))

      if (result) {
        statement.innerText = `${pattern} won!`
        view.showClapsIcons()
      }
    }
  },
  whenTie() {
    const remainedBlocks = document.querySelectorAll('.unclicked')

    if (!remainedBlocks.length) {
      statement.innerText = 'Tie!'
    }
  }
}

const view = {
  displayPlayer(player) {
    event.target.innerText = player
    event.target.classList.remove('unclicked')
  },
  showClapsIcons() {
    document.querySelectorAll('.unclicked').forEach(block => {
      block.innerText = '👏'
      block.classList.remove('unclicked')
    })
  },
  resetTheBoard() {
    document.querySelectorAll('.block').forEach(block => {
      block.innerText = null
      block.classList.add('unclicked')
    })
    model.circle = []
    model.cross = []
    statement.innerText = null
    controller.currentPlayer = players.circle
  },
  autoDisplayCross() {
    const remainedBlocks = document.querySelectorAll('.unclicked')

    if (!remainedBlocks.length) return

    const randomIndex = Math.floor(Math.random() * remainedBlocks.length)
    remainedBlocks[randomIndex].innerText = players.cross
    remainedBlocks[randomIndex].classList.remove('unclicked')
    model.cross.push(Number(remainedBlocks[randomIndex].dataset.index))
  },
  changeTheMode() {
    document.querySelectorAll('[name="player').forEach(input => {
      if (input.checked) {
        controller.currentMode = input.value
        view.resetTheBoard()
      }
    })
  }
}

const controller = {
  currentPlayer: players.circle,
  currentMode: mode.single,
  reset() {
    view.resetTheBoard()
  },
  change() {
    view.changeTheMode()
  },
  duoPlayers(player) {
    switch (player) {
      case players.circle:
        view.displayPlayer(players.circle)
        model.circle.push(Number(event.target.dataset.index))
        model.whenTie()
        model.isWinnerAppear(model.circle, players.circle)
        this.currentPlayer = players.cross
        break
      case players.cross:
        view.displayPlayer(players.cross)
        model.cross.push(Number(event.target.dataset.index))
        model.isWinnerAppear(model.cross, players.cross)
        this.currentPlayer = players.circle
        break
    }
  },
  singlePlayer() {
    view.displayPlayer(players.circle)
    model.circle.push(Number(event.target.dataset.index))
    model.whenTie()
    model.isWinnerAppear(model.circle, players.circle)
    view.autoDisplayCross()
    model.isWinnerAppear(model.cross, players.cross)
  },
  checkedTheMode(m) {
    switch (m) {
      case mode.single:
        this.singlePlayer()
        break
      case mode.duo:
        this.duoPlayers(this.currentPlayer)
        break
    }
  }
}

board.addEventListener('click', event => {
  if (event.target.matches('.unclicked')) {
    controller.checkedTheMode(controller.currentMode)
  }
})

resetBtn.addEventListener('click', controller.reset)

modeSelector.addEventListener('click', controller.change)