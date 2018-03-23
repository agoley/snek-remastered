/**
 * The snake object.
 */
function Snake() {
    this.elementRef; // A reference to the Snake element.
    this.scales; // {Scale[]} An array of scales.

    this.elementRef = document.getElementById('snake');

    this.grow = function () {
        var scale = this.generateScale();

        this.elementRef.append(scale.getRef());

        if (!this.scales) {
            this.scales = [scale];
        } else {
            this.scales.push(scale);
        }
    }

    this.move = function (direction) {
        if (direction) {
            this.scales[0].direction = direction;
        }

        var me = this;
        function frame() {
            // Base case: check for valididty.
            if (!me.isInValidState()) {
                if (app.game.scoreBoard.getScore() < 7900) {
                    console.log("( ͡° ͜ʖ ͡°) you can't beat me!: Lenny's top score is 7900.")
                } else {
                    console.log("( ͡° ͜ʖ ͡°) you must have cheated, I'm telling!")
                }

                // GAME OVER!
                app.game.endGame();
            }

            for (var i = 0; i < me.scales.length; i++) {
                var newX = framework.getElementPos(me.scales[i].getRef(), 'left');
                var newY = framework.getElementPos(me.scales[i].getRef(), 'top');

                if (me.scales[i].direction === 'right') {
                    var x = framework.getElementPos(me.scales[i].getRef(), 'left');
                    me.scales[i].getRef().style.left = (x + 15) + 'px';
                    newX = x + 15;
                } else if (me.scales[i].direction === 'left') {
                    var x = framework.getElementPos(me.scales[i].getRef(), 'left');
                    me.scales[i].getRef().style.left = (x - 15) + 'px';
                    newX = x - 15;
                } else if (me.scales[i].direction === 'down') {
                    var y = framework.getElementPos(me.scales[i].getRef(), 'top');
                    me.scales[i].getRef().style.top = (y + 15) + 'px';
                    newY = y + 15;
                } else if (me.scales[i].direction === 'up') {
                    var y = framework.getElementPos(me.scales[i].getRef(), 'top');
                    me.scales[i].getRef().style.top = (y - 15) + 'px';
                    newY = y - 15;
                }

                if (i === 0 && me.hasCollidedWithApple(newX, newY)) {
                    app.game.apple.move();
                    me.grow();
                    app.game.scoreBoard.increment();
                }
            }

            for (var i = me.scales.length - 1; i > 0; i--) {
                me.scales[i].direction = me.scales[i - 1].direction;
            }
        }
        this.interval = setInterval(frame, 100);
    }

    this.stop = function () {
        clearInterval(me.interval);
    }

    this.reset = function () {
        me.scales.forEach(scale => {
            scale.getRef().remove();
        });
        me.scales = null;

        me.grow();
    }

    this.generateScale = function () {
        var node = document.createElement('div');
        node.classList.add('scale');

        if (this.scales) {

            // This scale is being appended to a list of scales.
            var tail = this.scales[this.scales.length - 1];
            var tailX = framework.getElementPos(tail.getRef(), 'left');
            var tailY = framework.getElementPos(tail.getRef(), 'top');

            var offset = this.scales.length === 1 ? 30 : 15;

            if (tail.direction === 'right') {

                // Place the next scale trailing to the left.
                node.style.left = tailX - offset + 'px';
                node.style.top = tailY + 'px';
            } else if (tail.direction === 'left') {

                // Place the next scale trailing to the left.
                node.style.left = tailX + offset + 'px';
                node.style.top = tailY + 'px';
            } else if (tail.direction === 'up') {

                // Place the next scale trailing from the bottom.
                node.style.left = tailX + 'px';
                node.style.top = tailY + offset + 'px';
            } else if (tail.direction === 'down') {

                // Place the next scale trailing from the top.
                node.style.left = tailX + 'px';
                node.style.top = tailY - offset + 'px';
            }

            return new Scale(node, tail.direction);
        } else {
            return new Scale(node);
        }
    }

    this.hasCollidedWithApple = function (x, y) {
        var appleRef = document.getElementsByClassName('apple')[0];
        var appleX = framework.getElementPos(appleRef, 'left');
        var appleY = framework.getElementPos(appleRef, 'top');

        if (x === appleX && y === appleY) {
            return true
        }

        return false;
    }

    this.isInValidState = function () {

        // Check if the snake has reached a border.
        var x = framework.getElementPos(this.scales[0].getRef(), 'left');
        var y = framework.getElementPos(this.scales[0].getRef(), 'top');

        // console.log("%s, %s", x, y);


        if (y < 0) {

            // The snake has collided with the top border.
            return false;
        }

        if (x < 0) {

            // The snake has collided with the left border.
            return false;
        }

        if (x > 585) {
            // The snake has collided with the right border.
            return false;
        }

        if (y > 285) {

            // The snake has collided with the bottom border.
            return false;
        }

        // Check if the snake has collided with itself.
        for (var i = 1; i < this.scales.length; i++) {
            var scaleX = framework.getElementPos(this.scales[i].getRef(), 'left');
            var scaleY = framework.getElementPos(this.scales[i].getRef(), 'top');


            if (x === scaleX && y === scaleY) {
                return false;
            }
        }

        return true;
    }

    this.grow.apply(this); // Initialize with the first scale on new.

    var me = this;
    window.onkeyup = function (e) {
        if (!app.game.isGameOver) {
            clearInterval(me.interval);

            var key = e.keyCode ? e.keyCode : e.which;

            if (key == 39) {
                me.move('right');
            } else if (key == 40) {
                me.move('down');
            } else if (key == 37) {
                me.move('left');
            } else if (key == 38) {
                me.move('up');
            }
        }
    }
}

function Game() {
    this.scoreBoard = new ScoreBoard();
    this.snake = new Snake();
    this.apple = new Apple();
    this.isGameOver = false;
    var me = this;

    this.endGame = function () {
        if (!me.isGameOver) {
            this.snake.stop();

            var node = document.createElement('div');
            node.innerHTML = 'GAME OVER!';
            node.id = 'game-over-msg';
            document.getElementById('boundry').append(node);

            node = document.createElement('button');
            node.innerHTML = 'NEW GAME'
            node.addEventListener("click", me.reset)
            node.id = 'reset-btn';
            document.getElementById('boundry').append(node);

            me.isGameOver = true;
        }
    }

    this.reset = function () {
        document.getElementById('boundry').removeChild(document.getElementById('game-over-msg'));
        document.getElementById('boundry').removeChild(document.getElementById('reset-btn'));
        me.snake.reset();
        me.scoreBoard.reset()
        me.isGameOver = false;
    }
}

/**
 * A score board keeps track of game statistics.
 * @param {HTMLElement} elementRef 
 */
function ScoreBoard() {
    this.scoreBoardRef = document.getElementById('score-board');
    var me = this;

    this.increment = function () {
        var curr = me.getScore();
        var next = curr + 100;
        me.scoreBoardRef.innerHTML = next;
    }

    this.reset = function () {
        me.scoreBoardRef.innerHTML = 0;
    }

    this.getScore = function() {
        return parseInt(me.scoreBoardRef.innerHTML);
    }
}

/**
 * A single Scale (a link in the chain of nodes making up the Snake).
 * @param {HTMLElement} elementRef 
 */
function Scale(elementRef, direction) {
    this.direction = direction; // The direction that the Scale is moving in (up, down, left, right).

    this.getRef = function () {
        return elementRef;
    }
}

/**
 * The apple is food for a Snake object.
 */
function Apple() {

    this.generate = function () {
        var x = Math.floor(Math.random() * ((600 / 15) - 2)) * 15;
        var y = Math.floor(Math.random() * ((300 / 15) - 2)) * 15;

        var node = document.createElement('div');
        node.classList.add('apple');

        var node2 = document.createElement('div');
        node2.classList.add('apple-1');
        node.appendChild(node2);
        var node3 = document.createElement('div');
        node3.classList.add('apple-2');
        node.appendChild(node3);
        var node4 = document.createElement('div');
        node4.classList.add('apple-3');
        node.appendChild(node4);
        var node5 = document.createElement('div');
        node5.classList.add('apple-4');
        node.appendChild(node5);


        document.getElementById('boundry').append(node);
        node.style.top = y + 'px';
        node.style.left = x + 'px';
    }

    this.isValidMove = function (x, y) {
        var allScales = document.getElementsByClassName('scale');
        var isValid = true;
        for (var i = 0; i < allScales.length; i++) {
            var rect = allScales[i].getBoundingClientRect();
            var appleRef = document.getElementsByClassName('apple')[0];
            appleRef.style.top = y + 'px';
            appleRef.style.left = x + 'px';
            var rect2 = appleRef.getBoundingClientRect();
            if ((Math.abs(rect2.y - rect.y) < 15) && (Math.abs(rect2.x - rect.x) < 15)) {
                isValid = false;
            }
        }
        return isValid;
    }

    this.move = function () {
        var moveIsValid = false;
        var x, y;

        while (!moveIsValid) {
            app.game.snake.stop();
            x = Math.floor(Math.random() * ((600 / 15) - 2)) * 15;
            y = Math.floor(Math.random() * ((300 / 15) - 2)) * 15;
            moveIsValid = this.isValidMove(x, y);
        }

        var appleRef = document.getElementsByClassName('apple')[0];
        appleRef.style.top = y + 'px';
        appleRef.style.left = x + 'px';

        app.game.snake.move();
    }

    this.generate();
}