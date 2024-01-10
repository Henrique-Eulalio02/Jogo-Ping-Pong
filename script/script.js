function setDifficulty(ballSpeed, gameMode) {
  localStorage.setItem('ballSpeed', ballSpeed);
  localStorage.setItem('gameMode', gameMode);
  window.location.href = 'game.html';
}

function getGameDifficulty() {
  const storedBallSpeed = localStorage.getItem('ballSpeed');
  const storedGameMode = localStorage.getItem('gameMode');

  return {
    ballSpeed: parseFloat(storedBallSpeed),
    gameMode: parseInt(storedGameMode)
  };
}

const canvasEl = document.querySelector('canvas'),
    canvasCtx = canvasEl.getContext('2d'),
    gapX = 10,
    lineWidth = 15

    const mouse = {
      x: 0,
      y: 0
    }

    let endGame = 0

    const field = {
      w: window.innerWidth,
      h: window.innerHeight,
      draw: function() {
      // criando campo
      // fillRect: x = onde inicia e caminha para direita
      // y = onde inicia e caminha para baixo
      // w = tamanho em relação a x
      // h = tamanho em relação a y
      canvasCtx.fillStyle = '#286047'
      canvasCtx.fillRect(0, 0, this.w, this.h)
      }
    }

    const line = {
      w: 15,
      h: field.h,
      draw: function() {
        // criando linha central
        canvasCtx.fillStyle = '#ffffff'
        canvasCtx.fillRect((field.w / 2) - (this.w / 2), 0, this.w, this.h)
      }
    }

    const leftPaddle = {
      x: gapX,
      y: 0,
      w: line.w,
      h: 200,
      _move: function() {
        this.y = mouse.y - (this.h / 2)
      },
      draw: function() {
        // criando raquete esquerda
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)
        this._move()
      }
    }

    const rightPaddle = {
      x: field.w - line.w - gapX,
      y: 0,
      w: line.w,
      h: 200,
      speed: 1,
      _move: function() {
        if(this.y + this.h / 2 < ball.y + ball.r) {
          this.y += this.speed
        } else {
          this.y -= this.speed
        }  
      },
      _speedUp: function () {
        this.speed += 0.5
      },
      draw: function() {
        // criando raquete esquerda
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)
        this._move()
      }
    }

    const ball = {
        x: field.w / 2,
        y: field.h / 2,
        r: 20,
        speed: 7,
        directionX: 1,
        directionY: 1,
        _calcPosition: function () {
          if(this.x > field.w - this.r - rightPaddle.w - gapX) {
            if(this.y + this.r > rightPaddle.y && this.y - this.r < rightPaddle.y + rightPaddle.h) {
              this._reverseX()
            } else {
              score._incrementHuman()
              this._pointUp()
            }
          }

          if(this.x < this.r + leftPaddle.w + gapX) {
            if(this.y + this.r > leftPaddle.y && this.y - this.r < leftPaddle.y + leftPaddle.h) {
              this._reverseX()
            } else {
              score._incrementComputer()
              this._pointUp()
            }
          }

          if((this.y - this.r < 0 && this.directionY < 0) || (this.y > field.h - this.r && this.directionY > 0)) {
            this._reverseY()
          }
        },
        _reverseX: function () {
          this.directionX *= -1
        },
        _reverseY: function () {
          this.directionY *= -1
        },
        _move: function () {
          this.x += this.directionX * this.speed
          this.y += this.directionY * this.speed
        },
        _speedUp: function () {
          const { ballSpeed, gameMode } = getGameDifficulty();

          if(gameMode == 1) {
            this.speed += ballSpeed
          }
          else if(gameMode == 2) {
            this.speed += ballSpeed
          } else {
            this.speed += ballSpeed
          }
        },
        _pointUp: function () {
          this._speedUp()
          rightPaddle._speedUp()
          
          this.x = field.w / 2
          this.y = field.h / 2
        },
        draw: function () {
          canvasCtx.fillStyle = "#ffffff"
          canvasCtx.beginPath()
          // arc(x, y, r, 0, 0 * Math.PI, false): x, y -> correspondentes as posições cartesianas
          // r = raio -> vai definir o tamanho da bolinha
          // 0 = onde inicia a rotação
          // 2 * Math.PI = criação de 4 arcos
          // false = sentido que o arco gira e é criado
          canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
          canvasCtx.fill()

          this._calcPosition()
          this._move()
        },
      }

    const score = {
      human: 0,
      computer: 0,
      w: field.w,
      isEndGame: 0,
      _incrementHuman: function () {
        this.human++
      },
      _incrementComputer: function () {
        this.computer++
      },
      endGame: function() {
        if(this.human >= 10 || this.computer >= 10) {
          this.isEndGame++
        }
      },
      _resetGame: function() {
        ball.r = 20
        ball.speed = 7
        rightPaddle.speed = 1
        this.human = 0
        this.computer = 0
        this.isEndGame = 0
      },
      draw: function() {
        // criando o placar
        canvasCtx.font = 'bold 72px Arial'
        canvasCtx.textAlign = 'center'
        canvasCtx.textBaseline = 'top'
        canvasCtx.fillStyle = '#01341d'

        this.endGame()
        
        if(this.isEndGame == 0) {
          canvasCtx.fillText(this.human, this.w / 4, 50)
          canvasCtx.fillText(this.computer, (this.w / 4) + (this.w / 2), 50)
        } else {
          canvasCtx.fillText('Fim de Jogo!', this.w / 2, 50)
          if(this.human === 10) {
            canvasCtx.fillText('Humano venceu!', this.w / 2, 150)
            ball.r = 0
            rightPaddle.speed = 0
  
            setTimeout(() => {
              this._resetGame()
            }, 5000)
          } 
          if(this.computer === 10) {
            canvasCtx.fillText('Computador venceu!', this.w / 2, 150)
            ball.r = 0
            rightPaddle.speed = 0
  
            setTimeout(() => {
              this._resetGame()
            }, 5000)
          } 
        }
      }
    }

    function setup() {
      canvasEl.width = canvasCtx.width = field.w
      canvasEl.height = canvasCtx.height = field.h
    }

    function draw() {
      field.draw()
      line.draw()
      leftPaddle.draw()
      rightPaddle.draw()
      score.draw()
      ball.draw()
    }

    window.animateFrame = (function() {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
          return window.setTimeout(callback, 1000 / 60)
        }
      )
    })()

    function main() {
      animateFrame(main)
      draw()
    }

    setup()
    main()

    canvasEl.addEventListener('mousemove', function(e) {
      mouse.x = e.pageX
      mouse.y = e.pageY
    })