const gameArea = document.getElementById(`gameArea`)

gameArea.style.outline = `3px solid red`

class LightOutGame {
    isGameRunning = true
    cells = {}
    actions = {
        white: (x, y) => {
            console.log("white action", x, y)
            // console.log(this)
            let cell = this.getCell(x, y)
            cell.active = !cell.active
            //find adjacent cells
            let shiftVals = [-1, 1]
            shiftVals.forEach(xShift => {
                this.flipCell(x + xShift, y)
            })
            shiftVals.forEach(yShift => {
                this.flipCell(x, y + yShift)
            })
        },
        red: (x, y) => {
            console.log("Red action", x, y)
            // console.log(this)
            let cell = this.getCell(x, y)
            cell.active = !cell.active
            //find adjacent cells
            let shiftVals = [-1, 1]
            shiftVals.forEach(xShift => {
                shiftVals.forEach(yShift => {
                    this.flipCell(x + xShift, y + yShift)
                })
            })

        },
        green: (x,y) => {
            console.log("Green action", x, y)
            // console.log(this)
            let cell = this.getCell(x, y)
            let shiftVals = [-1, 0, 1]
            shiftVals.forEach(xShift => {
                shiftVals.forEach(yShift => {
                    this.flipCell(x + xShift, y + yShift)
                })
            })

        },
        // col
        blue: (x,y) => {
            for(let yy = 0; yy < this.width; yy++){
                this.flipCell(x, yy)
            }
        },
        // row
        orange: (x,y) => {
            for(let xx = 0; xx < this.width; xx++){
                this.flipCell(xx, y)
            }
        }
    }
    constructor(targetEl, width, height) {
        this.targetEl = targetEl
        this.width = width
        this.height = height
        this.totalCells = width * height
        this.init()
        this.render()
    }
    init() {
        this.createGameBoard()
        console.log(this.cells)
    }
    createGameBoard() {
        let { width, height, cells, genCoords } = this
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let color = this.chooseRandomColor()
                let coords = genCoords(x, y)
                cells[coords] = { color, active: 1, action: this.actions[color], x, y }
            }
        }
    }
    render() {
        console.log("render")
        const { width, height, cells, genCoords, targetEl } = this
        targetEl.innerHTML = ''
        let els = []
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let borderWidth = 3;
                let el = document.createElement("div")
                el.style.width = `calc(100% / ${width} - ${borderWidth * 2}px)`
                el.style.height = `calc(100% / ${height} - ${borderWidth * 2}px)`
                el.style.borderRadius = `10%`
                el.style.border = `3px solid black`
                let cell = cells[genCoords(x, y)]
                el.style.backgroundColor = cell.color
                el.style.transform = cell.active ? '' : 'scale(.2)'
                el.addEventListener('click', (event) => { this.buttonClick(x, y) })
                els.push(el)

                let coords = `${x}-${y}`
                cells[coords] = cell
            }
        }
        targetEl.append(...els)
        this.checkVictory()
    }
    buttonClick(x, y) {
        if (!this.isGameRunning) return
        console.log("buttonClick")
        const cell = this.getCell(x, y)
        cell.action(x, y)
        this.render()
    }
    checkIfCellExists(x, y) {
        console.log("checkIfCellExists")
        let cell = this.getCell(x, y)
        if (cell) return true
        return false
    }
    getCell(x, y) {
        // console.log('get cell', x,y)
        return this.cells[this.genCoords(x, y)] || null
    }
    genCoords(x, y) {
        return `${x}-${y}`
    }
    flipCell(x, y) {
        let cell = this.getCell(x, y)
        if (cell) cell.active = !cell.active
    }
    checkVictory() {
        let isWinning = true
        for (let key in this.cells) {
            let cell = this.cells[key]
            if (cell.active) { isWinning = false; break; }
        }
        if (isWinning) {
            this.isGameRunning = false
            setTimeout(() => {alert("YOU WON")}, 1)
        }
    }
    chooseRandomColor() {
        
        let colors = Object.keys(this.actions)
        return colors[this.rand(0, colors.length - 1)]
    }
    rand(lo, hi) {
        let diff = hi - lo + 1
        return Math.floor(Math.random() * diff + lo)
    }
}

const game = new LightOutGame(gameArea, 3,3)