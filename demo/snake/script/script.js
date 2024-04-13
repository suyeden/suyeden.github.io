(() => {
    // Canvas の高さ
    let canvasHeight = 0;
    // Canvas の幅
    let canvasWidth = 0;
    // サイズ（座標の目盛り間隔、px）
    let S = 0;
    // 座標の上限値（X方向）
    let W = 0;
    // 座標の上限値（y方向）
    let H = 0;
    // 蛇
    let snake = [];
    // 餌
    let foods = [];
    // 餌の個数
    let foodsNumber = 0;
    // 押下キーのキーコード
    let keyCode = 0;
    // 得点
    let point = 0;
    // カウンター変数
    let counter = 0;
    // 更新頻度
    let updateFrequency = 0;
    // Canvas 2D API をラップしたユーティリティクラス
    let util = null;
    // 描画対象となる Canvas Element
    let canvas = null;
    // Canvas 2D API コンテキスト
    let ctx = null;
    // ゲームオーバーのフラグ
    let gameOverFlag = false;
    // ゲームが開始したかどうかのフラグ
    let gameStartFlag = false;

    /**
     * 座標を管理するクラス
     */
    class Position {
        constructor(x, y) {
            // x座標
            this.x = x;
            // y座標
            this.y = y;
        }
    }

    /**
     * キャラクターを管理するクラス
     */
    class Character extends Position {
        constructor(x, y, S, image, ctx) {
            // 継承元の初期化
            super(x, y);
            // サイズ（幅および高さ、px）
            this.size = S;
            // 画像の取得
            this.image = image;
            // コンテキストの格納
            this.ctx = ctx;
        }
        draw() {
            this.ctx.drawImage(
                this.image,
                this.x * S,
                this.y * S,
                S,
                S
            );
        }
    }

    /**
     * ページのロードが完了した時に発火
     */
    window.addEventListener('load', (event) => {
        // 初期化
        init();
        // イベントの設定
        eventManager();
        // 描画の開始
        render(); 
    }, false);

    /**
     * 初期化関数
     */
    function init() {
        // 変数の初期化
        canvasHeight = 0;
        canvasWidth = 0;
        S = 0;
        W = 21;
        H = 21;
        snake = [];
        foods = [];
        foodsNumber = 10;
        keyCode = 0;
        point = 0;
        counter = 0;
        updateFrequency = 10;
        util = null;
        canvas = null;
        ctx = null;
        gameOverFlag = false;
        gameStartFlag = false;
        // ユーティリティクラスの初期化
        util = new Canvas2DUtility(document.getElementById('canvas'));
        // キャンバス要素の取得
        canvas = util.canvas;
        // Canvas 2D API コンテキストの取得
        ctx = util.context;

        // Canvasの設定
        let baseSize = 0;
        let displayWidth = document.body.clientWidth;
        let displayHeight = document.documentElement.clientHeight;
        if (displayWidth > displayHeight) { // 画面横向き
            baseSize = displayHeight;
            canvasWidth = Math.floor(baseSize * 0.8);
            canvasHeight = canvasWidth;
            // 垂直方向のキャンバスの位置
            let canvasMarginTop = canvasHeight * 0.05;
            document.getElementById('canvas_wrapper').style.marginTop =  canvasMarginTop + 'px';
            // Retryボタン以外を非表示に
            document.getElementById('left').style.display = 'none';
            document.getElementById('up').style.display = 'none';
            document.getElementById('down').style.display = 'none';
            document.getElementById('right').style.display = 'none';
            document.getElementById('retry2').style.display = 'none';
            // Retryボタンの設定
            let buttonSize = (displayHeight - canvasHeight) / 3;
            let buttonBorderWidth = buttonSize * 0.02;
            document.getElementById('retry').style.height = buttonSize + 'px';
            document.getElementById('retry').style.marginTop = (displayHeight - canvasMarginTop - canvasHeight - buttonSize) / 3 + 'px';
            document.getElementById('retry').style.marginLeft = displayWidth / 2 - buttonSize / 2 + 'px';
            document.getElementById('retry').style.border = buttonBorderWidth + 'px solid #696969';
        } else { // 画面縦向き
            baseSize = displayWidth;
            canvasHeight = Math.floor(baseSize * 0.8);
            canvasWidth = canvasHeight;
            // 垂直方向のCanvasの位置
            let canvasMarginTop = Math.abs(displayHeight / 2 - canvasHeight / 1.3);
            document.getElementById('canvas_wrapper').style.marginTop =  canvasMarginTop + 'px';
            // デフォルトのRetryボタンを非表示に
            document.getElementById('retry').style.display = 'none';
            // ボタンのサイズ
            let buttonSize = (displayHeight - canvasHeight - canvasMarginTop) / 4;
            let buttonBorderWidth = buttonSize * 0.02;
            document.getElementById('up').style.height = buttonSize + 'px';
            document.getElementById('left').style.height = buttonSize + 'px';
            document.getElementById('down').style.height = buttonSize + 'px';
            document.getElementById('right').style.height = buttonSize + 'px';
            document.getElementById('retry2').style.height = buttonSize + 'px';
            document.getElementById('up').style.border = buttonBorderWidth + 'px solid #696969';
            document.getElementById('left').style.border = buttonBorderWidth + 'px solid #696969';
            document.getElementById('down').style.border = buttonBorderWidth + 'px solid #696969';
            document.getElementById('right').style.border = buttonBorderWidth + 'px solid #696969';
            document.getElementById('retry2').style.border = buttonBorderWidth + 'px solid #696969';
            // ボタンの位置
            let baseMargin = displayWidth / 2 - (buttonSize / 2);
            let buttonMarginTop = (displayHeight - canvasMarginTop - canvasHeight - buttonSize * 3) / 6;
            let buttonDistance = buttonMarginTop;
            document.getElementById('up').style.marginLeft = baseMargin + 'px';
            document.getElementById('left').style.marginLeft = baseMargin - (buttonSize + buttonBorderWidth) - buttonDistance + 'px';
            document.getElementById('retry2').style.marginLeft = (buttonDistance - buttonBorderWidth) + 'px';
            document.getElementById('right').style.marginLeft = (buttonDistance - buttonBorderWidth) + 'px';
            document.getElementById('down').style.marginLeft = baseMargin + 'px';
            document.getElementById('up').style.marginTop = buttonMarginTop + 'px';
            document.getElementById('left').style.marginTop = buttonMarginTop + 'px';
            document.getElementById('retry2').style.marginTop = buttonMarginTop + 'px';
            document.getElementById('right').style.marginTop = buttonMarginTop + 'px';
            document.getElementById('down').style.marginTop = buttonMarginTop + 'px';
        }
        // Canvasのリサイズ
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        // Canvasを水平方向の中央に
        document.getElementById('canvas_wrapper').style.textAlign = "center";
        // 座標間隔の設定
        S = canvasWidth / W;
        // 蛇の初期化（座標中央に配置）
        snake[0] = new Character(Math.floor(W / 2), Math.floor(H / 2), S, document.getElementById('snake'), ctx);
        // 餌の初期化
        for (let i = 0; i < foodsNumber; i++) {
            addFood();
        }
    }

    /**
     * イベントの設定を行う
     */
    function eventManager() {
        window.addEventListener('keydown', (event) => {
            let k = event.keyCode;
            if (k == 37 || k == 38 || k == 39 || k == 40){
                keyCode = k;
            }
            if (!gameStartFlag) {
                gameStartFlag = true;
            }
        }, false);
        document.getElementById('left').addEventListener('touchstart', (event) => {
            document.getElementById('left').style.borderColor = '#F08080';
            keyCode = 37;
            if (!gameStartFlag) {
                gameStartFlag = true;
            }
        }, false);
        document.getElementById('up').addEventListener('touchstart', (event) => {
            document.getElementById('up').style.borderColor = '#F08080';
            keyCode = 38;
            if (!gameStartFlag) {
                gameStartFlag = true;
            }
        }, false);
        document.getElementById('right').addEventListener('touchstart', (event) => {
            document.getElementById('right').style.borderColor = '#F08080';
            keyCode = 39;
            if (!gameStartFlag) {
                gameStartFlag = true;
            }
        }, false);
        document.getElementById('down').addEventListener('touchstart', (event) => {
            document.getElementById('down').style.borderColor = '#F08080';
            keyCode = 40;
            if (!gameStartFlag) {
                gameStartFlag = true;
            }
        }, false);
        document.getElementById('retry').addEventListener('touchstart', (event) => {
            document.getElementById('retry').style.borderColor = '#F08080';
        }, false);
        document.getElementById('retry2').addEventListener('touchstart', (event) => {
            document.getElementById('retry2').style.borderColor = '#F08080';
        }, false);
        document.getElementById('left').addEventListener('click', (event) => {
            keyCode = 37;
            if (!gameStartFlag) {
                gameStartFlag = true;
            }
            document.getElementById('left').style.borderColor = '#696969';
        }, false);
        document.getElementById('up').addEventListener('click', (event) => {
            keyCode = 38;
            if (!gameStartFlag) {
                gameStartFlag = true;
            }
            document.getElementById('up').style.borderColor = '#696969';
        }, false);
        document.getElementById('right').addEventListener('click', (event) => {
            keyCode = 39;
            if (!gameStartFlag) {
                gameStartFlag = true;
            }
            document.getElementById('right').style.borderColor = '#696969';
        }, false);
        document.getElementById('down').addEventListener('click', (event) => {
            keyCode = 40;
            if (!gameStartFlag) {
                gameStartFlag = true;
            }
            document.getElementById('down').style.borderColor = '#696969';
        }, false);
        document.getElementById('retry').addEventListener('click', (event) => {
            if (gameOverFlag || (!gameStartFlag)) {
                init();
            }
            document.getElementById('retry').style.borderColor = '#F08080';
        }, false);
        document.getElementById('retry2').addEventListener('click', (event) => {
            if (gameOverFlag || (!gameStartFlag)) {
                init();
            }
            document.getElementById('retry2').style.borderColor = '#696969';
        }, false);
        document.getElementById('left').addEventListener('touchend', (event) => {
            document.getElementById('left').style.borderColor = '#696969';
        }, false);
        document.getElementById('up').addEventListener('touchend', (event) => {
            document.getElementById('up').style.borderColor = '#696969';
        }, false);
        document.getElementById('right').addEventListener('touchend', (event) => {
            document.getElementById('right').style.borderColor = '#696969';
        }, false);
        document.getElementById('down').addEventListener('touchend', (event) => {
            document.getElementById('down').style.borderColor = '#696969';
        }, false);
        document.getElementById('retry').addEventListener('touchend', (event) => {
            document.getElementById('retry').style.borderColor = '#696969';
        }, false);
        document.getElementById('retry2').addEventListener('touchend', (event) => {
            document.getElementById('retry2').style.borderColor = '#696969';
        }, false);
        document.getElementById('left').addEventListener('mouseover', (event) => {
            document.getElementById('left').style.borderColor = '#F08080';
        }, false);
        document.getElementById('left').addEventListener('mouseout', (event) => {
            document.getElementById('left').style.borderColor = '#696969';
        }, false);
        document.getElementById('up').addEventListener('mouseover', (event) => {
            document.getElementById('up').style.borderColor = '#F08080';
        }, false);
        document.getElementById('up').addEventListener('mouseout', (event) => {
            document.getElementById('up').style.borderColor = '#696969';
        }, false);
        document.getElementById('right').addEventListener('mouseover', (event) => {
            document.getElementById('right').style.borderColor = '#F08080';
        }, false);
        document.getElementById('right').addEventListener('mouseout', (event) => {
            document.getElementById('right').style.borderColor = '#696969';
        }, false);
        document.getElementById('down').addEventListener('mouseover', (event) => {
            document.getElementById('down').style.borderColor = '#F08080';
        }, false);
        document.getElementById('down').addEventListener('mouseout', (event) => {
            document.getElementById('down').style.borderColor = '#696969';
        }, false);
        document.getElementById('retry').addEventListener('mouseover', (event) => {
            document.getElementById('retry').style.borderColor = '#F08080';
        }, false);
        document.getElementById('retry').addEventListener('mouseout', (event) => {
            document.getElementById('retry').style.borderColor = '#696969';
        }, false);
        document.getElementById('retry2').addEventListener('mouseover', (event) => {
            document.getElementById('retry2').style.borderColor = '#F08080';
        }, false);
        document.getElementById('retry2').addEventListener('mouseout', (event) => {
            document.getElementById('retry2').style.borderColor = '#696969';
        }, false);
    }

    /**
     * 餌を一つ追加する
     */
    function addFood() {
        while (true) {
            let x = Math.floor(Math.random() * W);
            let y = Math.floor(Math.random() * H);
            // 蛇、あるいはすでに配置している餌と衝突する場合はやり直す
            if (isHit(snake, x, y) || isHit(foods, x, y)) {
                continue;
            }
            foods.push(new Character(x, y, S, document.getElementById('food'), ctx));
            break;
        }
    }

    /**
     * 指定座標の餌を削除し、新たに餌を配置できる時は配置する
     */
    function moveFood(x, y) {
        foods = foods.filter(function (p) {
            return (p.x != x || p.y != y); 
        });
        if (snake.length + foods.length < W * H) {
            addFood();
        }
    }

    /**
     * 衝突判定の処理
     */
    function isHit(data, x, y) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].x == x && data[i].y == y) {
                return true;
            }
        }
        return false;
    }

    /**
     * 更新処理
     */
    function update() {
        // 蛇の頭の座標
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;
        
        switch (keyCode) {
        case 37: // 左
            snakeX--;
            break;
        case 38: // 上
            snakeY--;
            break;
        case 39: // 右
            snakeX++;
            break;
        case 40: // 下
            snakeY++;
            break;
        }

        // 自分自身か壁に衝突したら何もせずに描画
        if (!(snake.length == 1 && isHit(snake, snakeX, snakeY))) {
            if (isHit(snake, snakeX, snakeY) || snakeX < 0 || snakeY < 0 || snakeX >= W || snakeY >= H) {
                gameOverFlag = true;
                return;
            }
        }

        // 何はともあれ頭を先頭に追加（新たな値を配列の先頭に追加）
        snake.unshift(new Character(snakeX, snakeY, S, document.getElementById('snake'), ctx));

        // 餌との衝突判定
        if (isHit(foods, snakeX, snakeY)) {
            // 食べた時はポイントに+10し、新たに餌を配置できる時は配置する
            point += 10;
            moveFood(snakeX, snakeY);
        } else {
            // 食べてない時はしっぽを削除する
            snake.pop();
        }
    }

    /**
     * 描画処理
     */
    function render() {
        // 描画前に画面全体を白く塗りつぶす
        util.drawRect(0, 0, canvasWidth, canvasHeight, '#FFFFFF');
        // 状態の更新
        if (!gameOverFlag) {
            if (counter > updateFrequency) {
                update();
                counter = 0;
            } else {
                counter++;
            }
        }
        // 餌の描画
        foods.forEach(function (p) {
            p.draw();
        });
        // 蛇の描画
        snake.forEach(function (p) {
            p.draw();
        });
        // 得点の表示
        ctx.font = 'bold ' + S + 'px sans-serif';
        util.drawText(point, S, S * 2, '#000000');
        // Canvasに枠線を付ける
        util.drawLine(0, 0, canvasWidth, 0, '#000000');
        util.drawLine(0, 0, 0, canvasHeight, '#000000');
        util.drawLine(canvasWidth, 0, canvasWidth, canvasHeight, '#000000');
        util.drawLine(0, canvasHeight, canvasWidth, canvasHeight, '#000000');
        // ゲームオーバー時の処理
        if (gameOverFlag) {
            ctx.font = 'bold ' + S * 2 + 'px sans-serif';
            if (snake.length < W * H) {
                util.drawText('Game Over', canvasWidth / 2 - S * 5.5, canvasHeight / 2, '#0000FF');
            } else {
                util.drawText('Game Clear!', canvasWidth / 2 - S * 6.5, canvasHeight / 2, '#FFA500');
            }
            ctx.font = "bold 20px sans-serif";
        }
        // ループ
        requestAnimationFrame(render);
    }
})();
