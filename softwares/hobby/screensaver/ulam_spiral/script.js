(() => {
    let canvas = null;
    let ctx = null;
    let canvasHeight = 0;
    let canvasWidth = 0;
    let coordMax = 0;
    let coordInterval = 0;
    let block = null;
    let plotCount = 0;
    let plotMax = 0;
    let startNumber = null;
    let numberSize = 0;
    let opacity = 0;
    let endFlag = 0;
    let requestId = 0;
    let opacityKeepTimer = 0;
    let blockColor = 0;

    window.addEventListener('load', (event) => {
        init();
    }, false);

    function init() {
        canvas = document.getElementById('main_canvas');
        ctx = canvas.getContext('2d');

        // 背景を黒く塗る
        document.getElementsByTagName('body')[0].style.backgroundColor = '#000000';

        // 座標数
        coordMax = 125;

        // canvasサイズ設定
        setCanvasSize(canvas, coordMax);

        // 最初に配置する数字
        startNumber = [Math.floor(Math.random() * 65000), canvasWidth, canvasHeight, canvasWidth];

        // ブロック初期化
        block = [];
        let moveDirection = 1;
        let moveMax = 0;
        let moveCount = 0;
        block[0] = [startNumber[0], canvasHeight / 2 - coordInterval / 2, canvasHeight / 2 - coordInterval / 2, '#000000', 0];
        for (let i = 1; i < coordMax * coordMax; i++) {
            if (moveDirection == 1 && moveCount <= moveMax) {
                block[i] = [block[i-1][0] + 1, block[i-1][1] + coordInterval, block[i-1][2], '#000000', 0];
            } else if (moveDirection == 2 && moveCount <= moveMax) {
                block[i] = [block[i-1][0] + 1, block[i-1][1], block[i-1][2] - coordInterval, '#000000', 0];
            } else if (moveDirection == 3 && moveCount <= moveMax) {
                block[i] = [block[i-1][0] + 1, block[i-1][1] - coordInterval, block[i-1][2], '#000000', 0];
            } else {
                block[i] = [block[i-1][0] + 1, block[i-1][1], block[i-1][2] + coordInterval, '#000000', 0];
            }
            moveCount++;
            if (moveMax < moveCount) {
                moveCount = 0;
                if (moveDirection % 2 == 0) {
                    moveMax++;
                }
                if (moveDirection == 4) {
                    moveDirection = 1;
                } else {
                    moveDirection++;
                }
            }
        }

        // 描画するブロック数の初期値
        plotCount = 0;

        // 状態更新するブロック数の初期値
        plotMax = 1;

        // ブロックの色を指定
        let blockColorRed = Math.floor(Math.random() * 256).toString(16);
        if (0 <= parseInt(blockColorRed, 16) && parseInt(blockColorRed, 16) <= 15) {
            blockColorRed = '0' + blockColorRed;
        }
        let blockColorGreen = Math.floor(Math.random() * 256).toString(16);
        if (0 <= parseInt(blockColorGreen, 16) && parseInt(blockColorGreen, 16) <= 15) {
            blockColorGreen = '0' + blockColorGreen;
        }
        let blockColorBlue = Math.floor(Math.random() * 256).toString(16);
        if (0 <= parseInt(blockColorBlue, 16) && parseInt(blockColorBlue, 16) <= 15) {
            blockColorBlue = '0' + blockColorBlue;
        }
        blockColor = '#' + blockColorRed + blockColorGreen + blockColorBlue;

        // 描画する数字のサイズ
        numberSize = canvasWidth / 25;

        // 透明度の初期化
        opacity = 1;

        // 描画終了後画面をキープするタイマー
        opacityKeepTimer = 100;

        // 終了フラグの初期化
        endFlag = 0;

        // 画面初期化
        ctx.globalAlpha = 1;
        drawRect(0, 0, canvasWidth, canvasHeight, '#000000');

        // 数字の描画
        // 一度文字を描画してからそのサイズを取得する
        drawText(startNumber[0], ctx.measureText('1').width, canvasHeight - numberSize / 2, numberSize, '#ffffff');
        // 初期値
        drawRect(0, 0, canvasWidth, canvasHeight, '#000000');
        drawText(startNumber[0], ctx.measureText('1').width, canvasHeight - numberSize / 2, numberSize, '#ffffff');
        // 現在値
        drawText(startNumber[0] + plotCount, canvasWidth - ctx.measureText(startNumber[0] + coordMax * coordMax).width - ctx.measureText('1').width, canvasHeight - numberSize / 2, numberSize, '#ffffff');

        // メインループ
        window.setTimeout(render, 4000);        
    }

    function render() {
        // ループ
        requestId = window.requestAnimationFrame(render);

        // 画面初期化
        ctx.globalAlpha = 1;
        drawRect(0, 0, canvasWidth, canvasHeight, '#000000');

        // 不透明度指定
        ctx.globalAlpha = opacity;

        // ドットの描画
        for (let i = 0; i < plotCount; i++) {
            drawRect(block[i][1], block[i][2], coordInterval, coordInterval, block[i][3]);
        }

        // 数字の描画
        // 初期値
        drawRect(0, canvasHeight - numberSize / 2 - numberSize, ctx.measureText(startNumber[0]).width + ctx.measureText('1').width * 2, numberSize * 1.5, '#000000');
        drawText(startNumber[0], ctx.measureText('1').width, canvasHeight - numberSize / 2, numberSize, '#ffffff');
        // 現在値
        drawRect(canvasWidth - ctx.measureText('1').width * 2 - ctx.measureText(startNumber[0] + coordMax * coordMax).width, canvasHeight - numberSize / 2 - numberSize, ctx.measureText(startNumber[0] + plotCount).width + ctx.measureText('1').width * 2, numberSize * 1.5, '#000000');
        drawText(startNumber[0] + plotCount, canvasWidth - ctx.measureText(startNumber[0] + coordMax * coordMax).width - ctx.measureText('1').width, canvasHeight - numberSize / 2, numberSize, '#ffffff');

        // 状態更新
        update();
    }

    function update() {
        let counter = 0;
        if (endFlag == 0) {
            for (let i = 0; i < coordMax * coordMax; i++) {
                if (block[i][4] == 0) {
                    plotCount++;
                    if (judgePrime(block[i][0]) == true) {
                        block[i][3] = blockColor;
                    }
                    block[i][4] = 1;
                    if (plotMax < counter) {
                        plotMax = plotMax * 1.0025;
                        break;
                    } else {
                        counter++;
                    }
                }
                if (i == coordMax * coordMax - 1) {
                    endFlag = 1;
                }
            }
        } else {
            if (0 < opacityKeepTimer) {
                opacityKeepTimer--;
            } else {
                opacity = opacity * 0.95;
            }
            if (opacity < 0.005) {
                window.cancelAnimationFrame(requestId);
                init();
            }
        }
    }

    function setCanvasSize(canvas, coordMax) {
        let clientHeight = document.documentElement.clientHeight;
        let clientWidth = document.body.offsetWidth;

        // 短い辺に合わせる
        if (clientHeight <= clientWidth) {
            canvasHeight = clientHeight;
            canvasWidth = clientHeight;
            canvas.height = canvasHeight;
            canvas.width = canvasWidth;
            // Canvasを水平方向の中央に
            document.getElementById('canvas_wrapper').style.textAlign = 'center';
        } else {
            canvasHeight = clientWidth;
            canvasWidth = clientWidth;
            canvas.height = canvasHeight;
            canvas.width = canvasWidth;
            // Canvasを垂直方向の中央に
            document.getElementById('canvas_wrapper').style.marginTop = clientHeight / 2 - canvasHeight / 2 + 'px';
        }

        // 座標間隔の設定
        coordInterval = canvasHeight / coordMax;
    }

    function judgePrime(number) {
        if (number == 1) {
            return false;
        } else if (number == 2) {
            return true;
        } else {
            for (let i = 2; i < number; i++) {
                if (number % i == 0) {
                    return false;
                }
                if (i + 1 == number) {
                    return true;
                }
            }
        }
    }

    function drawRect(x, y, width, height, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }

    function drawText(text, x, y, size, color) {
        ctx.fillStyle = color;
        ctx.font = size + 'px Arial';
        ctx.fillText(text, x, y);
    }
})();
