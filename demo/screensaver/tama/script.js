(() => {
    let canvas = null;
    let ctx = null;
    let canvasHeight = 0;
    let canvasWidth = 0;
    let ballNumber = 0;
    let ball = [];
    let ballColor = [];

    window.addEventListener('load', (event) => {
        init();
        render();
    }, false);

    function drawRect(x, y, width, height, color, ctx) {
        if (color != null) {
            ctx.fillStyle = color;
        }
        ctx.fillRect(x, y, width, height);
    }

    class Position {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    class Ball extends Position {
        constructor(x, y, dx, dy, size, color, ctx) {
            super(x, y);
            this.dx = dx;
            this.dy = dy;
            this.size = size;
            this.color = color;
            this.ctx = ctx;
        }
        draw() {
            if (this.color != null) {
                this.ctx.fillStyle = this.color;
            }
            this.ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }

    function init() {
        // 変数初期化
        canvas = document.getElementById('main_canvas');
        ctx = canvas.getContext('2d');
        canvasHeight = document.documentElement.clientHeight;
        canvasWidth = document.body.offsetWidth;
        ballNumber = 5;
        ballColor = ['#0A800A', '#FF0000', '#0000cd', '#FFFF00', '#E6E6FA'];
        for (let i = 0; i < ballNumber; i++) {
            let ballSize = Math.random() * 40 + 5;
            let ballX = canvasWidth / 2 - ballSize;
            let ballY = canvasHeight / 2 - ballSize;
            let ballDx = 0;
            if (Math.random() > 0.5) {
                ballDx = Math.random() * 8;
            } else {
                ballDx = 0 - Math.random() * 8;
            }
            let ballDy = 0;
            if (Math.random() > 0.5) {
                ballDy = Math.random() * 8;
            } else {
                ballDy = 0 - Math.random() * 8;
            }
            ball[i] = new Ball(ballX, ballY, ballDx, ballDy, ballSize, ballColor[i], ctx);
        }
        // canvas リサイズ
        canvas.height = canvasHeight;
        canvas.width = canvasWidth;
    }

    function update() {
        canvasHeight =	window.innerHeight;
        canvasWidth = document.body.offsetWidth;
        for (let i = 0; i < ballNumber; i++) {
            ball[i].x += ball[i].dx;
            ball[i].y += ball[i].dy;
            if (ball[i].x > canvasWidth - ball[i].size) {
                ball[i].x = canvasWidth - ball[i].size;
                ball[i].dx = 0 - ball[i].dx;
            } else if (ball[i].x < 0) {
                ball[i].x = 0;
                ball[i].dx = 0 - ball[i].dx;
            }
            if (ball[i].y > canvasHeight - ball[i].size) {
                ball[i].y = canvasHeight - ball[i].size;
                ball[i].dy = 0 - ball[i].dy;
            } else if (ball[i].y < 0) {
                ball[i].y = 0;
                ball[i].dy = 0 - ball[i].dy;
            }
        }
    }

    function render() {
        // 状態更新
        update();
        // canvasサイズ更新
        canvas.height = canvasHeight;
        canvas.width = canvasWidth;
        // 画面初期化
        drawRect(0, 0, canvasWidth, canvasHeight, '#000000', ctx);
        // 描画
        for (let i = 0; i < ballNumber; i++) {
            ball[i].draw();
        }
        // ループ
        requestAnimationFrame(render);
    }
})();
