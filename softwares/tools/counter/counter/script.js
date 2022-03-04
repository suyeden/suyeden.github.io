(() => {
    let canvas = null;
    let ctx = null;
    let canvasHeight = 0;
    let canvasWidth = 0;
    let count = 0;
    let numberWidth = 0;
    let numberHeight = 0;
    let numberColor = null;
    let backgroundColor = null;
    let addCounter = 0;

    window.addEventListener('contextListner', () => {
        return false;
    }, false);

    window.addEventListener('copy', () => {
        return false;
    }, false);

    window.addEventListener('load', (event) => {
        init();
    }, false);

    function init() {
        canvas = document.getElementById('main_canvas');
        ctx = canvas.getContext('2d');

        // 背景を黒く塗る
        backgroundColor = '#000000';
        document.getElementsByTagName('body')[0].style.backgroundColor = backgroundColor;

        // 文字の色
        numberColor = '#ffffff';

        // キャンバスサイズの設定
        setCanvasSize(canvas);

        // イベントの設定
        eventManager();

        // カウンター加算用の数値
        addCounter = 1;

        // カウンターをリセット
        count = 0;

        render();
    }

    function render() {
        // キャンバスサイズの設定
        // 関数末尾でupdateするのではなく、このタイミングで
        setCanvasSize(canvas);
        
        // ループ
        window.requestAnimationFrame(render);

        // 文字サイズ取得のための文字描画
        drawText(ctx, '1', canvasWidth / 2, canvasHeight / 2, canvasHeight / 5, numberColor);
        // 文字サイズ取得
        numberWidth = ctx.measureText(count).width;
        numberHeight = canvasHeight / 7;

        // 画面初期化
        document.getElementsByTagName('body')[0].style.backgroundColor = backgroundColor;
        drawRect(ctx, 0, 0, canvasWidth, canvasHeight, backgroundColor);

        // 数字描画
        drawText(ctx, count, canvasWidth / 2 - numberWidth / 2.8, canvasHeight / 2 + numberHeight / 3, numberHeight, numberColor);
    }

    function eventManager() {
        if (window.ontouchstart === undefined || navigator.maxTouchPoints <= 0) {
            canvas.addEventListener('click', (event) => {
                count += addCounter;
                window.navigator.vibrate([100]);
            }, false);
        }

        canvas.addEventListener('touchstart', (event) => {
            count += addCounter;
            window.navigator.vibrate([100]);
        }, false);

        // safariの連続押し無効問題の対策
        canvas.addEventListener('touchend', (event) => {
            event.preventDefault();
        }, false);

        $('.button').on('click', () => {
            $('.menu_list').toggleClass('is_toggled');
            $('.cross').toggleClass('is_toggled');
            $('.wheel').toggleClass('is_toggled');
        });

        document.getElementById('revert').addEventListener('click', (event) => {
            event.preventDefault();
            addCounter *= -1;
            if (backgroundColor === '#000000') {
                backgroundColor = '#ffffff';
                numberColor = '#000000';
                alert('マイナスカウンター');
            } else {
                backgroundColor = '#000000';
                numberColor = '#ffffff';
                alert('プラスカウンター');
            }
        }, false);

        document.getElementById('calc').addEventListener('click', (event) => {
            event.preventDefault();

            let value;
            let result;

            value = window.prompt('加算する値を入力してください。\n減算する場合はマイナス値を入力してください。');
            if (value !== null && value !== '' && window.isNaN(Number(value)) === false) {
                value = Number(value);
                result = count + value;
                if (value < 0) {
                    value = '(' + value + ')';
                }
                if (window.confirm(count + ' + ' + value + ' = ' + result + '\n本当に加算しますか？')) {
                    count = result;
                }
            }
        }, false);

        document.getElementById('reset').addEventListener('click', (event) => {
            event.preventDefault();
            if (window.confirm('数値をリセットしますか？')) {
                count = 0;
            }
        }, false);
    }

    function update() {
        setCanvasSize(canvas);
    }

    function setCanvasSize(canvas) {
        canvasHeight = document.documentElement.clientHeight;
        canvasWidth = document.body.offsetWidth;
        canvas.height = canvasHeight;
        canvas.width = canvasWidth;

        document.getElementsByClassName('button')[0].width = canvasHeight / 8;
        document.getElementsByClassName('button')[0].height = canvasHeight / 8;
        document.getElementsByClassName('button')[1].width = canvasHeight / 8;
        document.getElementsByClassName('button')[1].height = canvasHeight / 8;
    }

    function drawText(ctx, text, x, y, size, color) {
        ctx.fillStyle = color;
        ctx.font = size + 'px Meiryo';
        ctx.fillText(text, x, y);
    }

    function drawRect(ctx, x, y, width, height, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }
})();
