(() => {
    // canvas の大きさの設定
    const CANVAS_WIDTH = window.innerWidth;
    const CANVAS_HEIGHT = window.innerHeight;

    // Canvas2D API をラップしたユーティリティクラス
    // @type {Canvas2DUtility}
    let util = null;

    // 描画対象の Canvas Element
    // @type {HTMLCanvasElement}
    let canvas = null;
    
    //Canvas2D API のコンテキスト
    // @type {CanvasRenderingContext2D}
    let ctx = null;

    // 実行開始時のタイムスタンプ
    // @type {number}
    let startTime = null;

    let omuriceManMono = null;
    let omuriceManNega = null;
    let omuriceManNormal = null;

    let squareSmall = null;
    let SquareBig = null;
    let squareSizeBasic = null;

    let promptMessage1 = null;
    let promptMessage2 = null;
    let promptMessage3 = null;
    let promptMessage4 = null;
    let promptMessage5 = null;
    let promptMessage6 = null;
    let promptMessage7 = null;
    let promptMessage8 = null;
    let promptMessage9 = null;
    let promptMessage10 = null;
    let promptMessage11 = null;

    let outputPass = null;
    
    let lineOpacity = null;
    let lineOpacityRate = null;

    let welcomeOpacity = null;
    let welcomeOpacityRate = null;

    let nowTime = null;
    let justTime = null;

    let phaseOneEnd = false;
    let phaseTwoEnd = false;

    let correctPass = null;
    let askPassFlag = false;
    let pass = null;

    let screenBlacked = false;
    let recordTimeAfterWait = false;
    let frameCounter = null;
    let blinkFreq = null;

    let babelObjArr = [];
    let babelCreated = 0;

    let requestId = 0; 

    /**
     * ページのロードが完了した時に発火する load イベント
     */
    window.addEventListener('load', () => {
        // ユーティリティクラスの初期化
        util = new Canvas2DUtility(document.getElementById('main_canvas'));
        // ユーティリティクラスより canvas を取得
        // canvas = document.getElementById('main_canvas'); と同じ
        canvas = util.canvas;
        // ユーティリティクラスより 2d コンテキストを取得
        ctx = util.context;

        // 初期化処理
        initialize();
        // インスタンスの準備、および完了後の処理
        loadCheck();
    }, false);

    /**
     * canvas やコンテキストの初期化
     */
    function initialize(){
        // canvas の大きさを設定
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        lineOpacity = 1.0;
        lineOpacityRate = 0.98;

        welcomeOpacity = 0.01;
        welcomeOpacityRate = 1.01;

        correctPass = '1999';

        frameCounter = 100;

        blinkFreq = 330;

        if (canvas.width < canvas.height) {
            squareSizeBasic = canvas.width;
        } else {
            squareSizeBasic = canvas.height;
        }
        
        omuriceManMono = new OmuriceMan(ctx, './image/omurice_mono.png');
        omuriceManMono.set(squareSizeBasic / 2, squareSizeBasic / 2, null);

        omuriceManNega = new OmuriceMan(ctx, './image/omurice_nega.png');
        omuriceManNega.set(squareSizeBasic / 2, squareSizeBasic / 2, 0.975);

        omuriceManNormal = new OmuriceMan(ctx, './image/omurice.png');
        omuriceManNormal.set(squareSizeBasic / 2, squareSizeBasic / 2, 1);

        squareBig = new Square(ctx, util);
        squareBig.set(squareSizeBasic / 1.2, squareSizeBasic / 1.2, 1.1, 3, '#b30000', '#b0c4de', 1.7, 0.98);

        squareSmall = new Square(ctx, util);
        squareSmall.set(squareSizeBasic / 2, squareSizeBasic / 2, 1.0, 2.2, '#b30000', '#b0c4de', 1.7, 0.98);

        promptMessage1 = new PromptString(ctx, util, 'BABEL-Login');
        promptMessage1.set('consolas', (squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6, 'center', '#ff8833', 2, 0);
        promptMessage2 = new PromptString(ctx, util, 'The login page');
        promptMessage2.set('consolas', (squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6, 'center', '#ff8833', 2, 0);
        promptMessage3 = new PromptString(ctx, util, 'for my website');
        promptMessage3.set('consolas', (squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6, 'center', '#ff8833', 2, 0);
        promptMessage4 = new PromptString(ctx, util, '© 2021');
        promptMessage4.set('consolas', (squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6, 'center', '#ff8833', 2, 0);
        promptMessage5 = new PromptString(ctx, util, 'Suyeden');
        promptMessage5.set('consolas', (squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6, 'center', '#ff8833', 2, 0);
        promptMessage6 = new PromptString(ctx, util, 'attach cd 01 /');
        promptMessage6.set('consolas', (squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6, 'start', '#ffffff', 2, 10);
        promptMessage7 = new PromptString(ctx, util, 'enter author password');
        promptMessage7.set('consolas', (squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6, 'start', '#ffffff', 2, 10);
        promptMessage8 = new PromptString(ctx, util, 'pass:');
        promptMessage8.set('consolas', (squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6, 'start', '#ffffff', 2, 10);

        outputPass = new PromptStringHalf(ctx, util, 'pass: ', 'pass:', 100);
        outputPass.set('consolas', (squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6, 'start', '#ffffff', 30, 0);

        promptMessage9 = new PromptString(ctx, util, ' Go to, let us go down, and there confound');
        promptMessage9.set('consolas', (squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6, 'center', '#ffffff', 2, Date.now());
        promptMessage10 = new PromptString(ctx, util, 'their language, that they may not understand');
        promptMessage10.set('consolas', (squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6, 'center', '#ffffff', 2, Date.now());
        promptMessage11 = new PromptString(ctx, util, "one another's speech." + ' '.repeat(23));
        promptMessage11.set('consolas', (squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6, 'center', '#ffffff', 2, Date.now());

        let fontWidth = (squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6;
        let lineHeight = fontWidth * 1.15; // 最低でも fontWidth * 1.0
        for (let i = 0; i < Math.floor(canvas.height / lineHeight) + 1; i++) {
            babelObjArr[i] = new Babel(ctx, canvas, fontWidth, canvas.height - lineHeight * i);
        }
    }

    /**
     * インスタンスの準備、および完了後の処理
     */
    function loadCheck(){
        // 準備の完了を判断するフラグ
        let ready = true;
        // AND 演算で準備の完了をチェックしていく
        ready = ready && omuriceManMono.ready;
        ready = ready && omuriceManNega.ready;
        ready = ready && omuriceManNormal.ready;

        // すべての準備が完了したら、描画その他の処理を始める
        if (ready == true) {
            // 実行開始時のタイムスタンプの取得
            startTime = Date.now();
            // 描画を始める
            render();
        } else {
            // 準備が終わっていなかった場合は 0.1 秒ごとに再帰呼び出しをする
            setTimeout(loadCheck, 100);
        }
    }

    /**
     * 描画処理
     */
    function render(){
        // 恒常ループのために描画処理を再帰呼び出しする
        requestId = window.requestAnimationFrame(render);

        // グローバルなアルファ値を 1.0 にして描画処理を開始する
        ctx.globalAlpha = 1.0;
        // 描画前に画面全体を黒で塗りつぶす
        util.drawRect(0, 0, canvas.width, canvas.height, '#000000');
        if (phaseTwoEnd == true && pass !== correctPass) {
            if (frameCounter > 30) {
                if (0 <= frameCounter % blinkFreq && frameCounter % blinkFreq < 3 || Date.now() % blinkFreq < 1 ) {
                    util.drawRect(0, 0, canvas.width, canvas.height, '#4d000d');
                }
            }
        }
        
        if ((Date.now() - startTime) / 1000 < 1) {
            util.drawLine(0, canvas.height / 2, canvas.width, canvas.height / 2, '#b0c4de', 2);
            util.drawLine(canvas.width / 2, 0, canvas.width / 2, canvas.height, '#b0c4de', 2);
        }

        if (1 < (Date.now() - startTime) / 1000 && omuriceManNega.isEnd == false) {
            if (squareSmall.isRotationEnd == true) {
                omuriceManMono.update(canvas.width / 2, canvas.height / 2, false);
                let endFlag = null;
                if (squareSmall.isEnd == true && squareBig.isEnd == true) {
                    endFlag = true;
                } else {
                    endFlag = false;
                }
                omuriceManNega.update(canvas.width / 2, canvas.height / 2, endFlag);
            }
            squareBig.update(canvas.width / 2, canvas.height / 2, squareSmall.isRotationEnd);
            if ((Date.now() - startTime) / 1000 > 1.3) {
                squareSmall.update(canvas.width / 2, canvas.height / 2, squareBig.isRotationEnd);
            }
            if (squareSmall.isRotationEnd == true && squareBig.isRotationEnd == true) {
                ctx.globalAlpha = lineOpacity;
                util.drawLine(0, canvas.height / 2, canvas.width, canvas.height / 2, '#b0c4de', 2);
                util.drawLine(canvas.width / 2, 0, canvas.width / 2, canvas.height, '#b0c4de', 2);
                ctx.globalAlpha = 1.0;
                lineOpacity = lineOpacity * lineOpacityRate;
            } else {
                util.drawLine(0, canvas.height / 2, canvas.width, canvas.height / 2, '#b0c4de', 2);
                util.drawLine(canvas.width / 2, 0, canvas.width / 2, canvas.height, '#b0c4de', 2);
            }
            nowTime = Date.now();
        }

        if (omuriceManNega.isEnd == true && phaseOneEnd == false) {
            omuriceManMono.update(canvas.width / 2, canvas.height / 2, false);
            squareBig.update(canvas.width / 2, canvas.height / 2, squareSmall.isRotationEnd);
            squareSmall.update(canvas.width / 2, canvas.height / 2, squareBig.isRotationEnd);
            promptMessage1.update(canvas.width / 2, canvas.height / 2 - squareSmall.heightFinal / 2 - ((squareBig.heightFinal - squareSmall.heightFinal) / 2) * (3 / 4), nowTime, 0, false);
            if (promptMessage1.isEnd == true) {
                if (promptMessage2.isSetStart == false) {
                    nowTime = Date.now();
                    promptMessage2.isSetStart = true;
                }
                promptMessage2.update(canvas.width / 2, canvas.height / 2 - squareSmall.heightFinal / 2 - ((squareBig.heightFinal - squareSmall.heightFinal) / 2) * (1 / 2), nowTime, 0, false);
            }
            if (promptMessage2.isEnd == true) {
                if (promptMessage3.isSetStart == false) {
                    nowTime = Date.now();
                    promptMessage3.isSetStart = true;
                }
                promptMessage3.update(canvas.width / 2, canvas.height / 2 - squareSmall.heightFinal / 2 - ((squareBig.heightFinal - squareSmall.heightFinal) / 2) * (1 / 4), nowTime, 0, false);
            }
            if (promptMessage3.isEnd == true) {
                if (promptMessage4.isSetStart == false) {
                    nowTime = Date.now();
                    promptMessage4.isSetStart = true;
                }
                promptMessage4.update(canvas.width / 2, canvas.height / 2 + squareSmall.heightFinal / 2 + ((squareBig.heightFinal - squareSmall.heightFinal) / 2) * (1 / 2), nowTime, 0, false);
            }
            if (promptMessage4.isEnd == true) {
                if (promptMessage5.isSetStart == false) {
                    nowTime = Date.now();
                    promptMessage5.isSetStart = true;
                }
                promptMessage5.update(canvas.width / 2, canvas.height / 2 + squareSmall.heightFinal / 2 + ((squareBig.heightFinal - squareSmall.heightFinal) / 2) * (3 / 4), nowTime, 0, false);
            }
            if (promptMessage5.isEnd == true && (Date.now() - nowTime) / 1000 > 5) {
                nowTime = Date.now();
                phaseOneEnd = true;
            }
        }

        if (phaseOneEnd == true && phaseTwoEnd == false) {
            if (Date.now() - nowTime > 2000 && askPassFlag == false) {
                if (promptMessage6.isEnd == false) {
                    promptMessage6.update(canvas.width / 2 - ((squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6) * 6, canvas.height / 2, nowTime + 3000, 3, true);
                }
                if (promptMessage6.isEnd == true && promptMessage7.isEnd == false) {
                    promptMessage6.update(canvas.width / 2 - ((squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6) * 6, canvas.height / 2 - ((squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6), nowTime + 3000, 3, false);
                    promptMessage7.update(canvas.width / 2 - ((squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6) * 6, canvas.height / 2, nowTime + 6000, 1, true);
                }
                if (promptMessage6.isEnd == true && promptMessage7.isEnd == true && promptMessage8.isEnd == false) {
                    promptMessage6.update(canvas.width / 2 - ((squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6) * 6, canvas.height / 2 - ((squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6) * 2, nowTime + 3000, 1, false);
                    promptMessage7.update(canvas.width / 2 - ((squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6) * 6, canvas.height / 2 - ((squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6), nowTime + 6000, 1, false);
                    promptMessage8.update(canvas.width / 2 - ((squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6) * 6, canvas.height / 2, nowTime + 7000, Date.now(), true);
                }
                if (Date.now() - nowTime > 10000) {
                    if (askPassFlag == false) {
                        pass = prompt("When is Suyeden's birth year ?");
                        outputPass.contents = outputPass.contents + pass;
                        askPassFlag = true;
                        nowTime = Date.now();
                    }
                }
            }
            if (askPassFlag == true && outputPass.isEnd == false) {
                promptMessage6.update(canvas.width / 2 - ((squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6) * 6, canvas.height / 2 - ((squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6) * 2, nowTime, 0, false);
                promptMessage7.update(canvas.width / 2 - ((squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6) * 6, canvas.height / 2 - ((squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6), nowTime, 0, false);
                outputPass.update(canvas.width / 2 - ((squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6) * 6, canvas.height / 2);
            }
        }

        if (phaseOneEnd == true && outputPass.isEnd == true && phaseTwoEnd == false) {
            if (pass == correctPass) {
                if (welcomeOpacity < 0.999) {
                    ctx.globalAlpha = welcomeOpacity;
                    omuriceManNormal.update(canvas.width / 2, canvas.height / 2 + ((squareBig.heightFinal - squareSmall.heightFinal) / 2) * (1 / 2), false);
                    ctx.globalAlpha = welcomeOpacity;
                    ctx.textAlign = 'center';
                    ctx.fillStyle = '#ffffff';
                    ctx.font = (squareBig.heightFinal - squareSmall.heightFinal) / 2 + 'px ' + 'sans-serif';
                    ctx.fillText('Welcome', canvas.width / 2, canvas.height / 2 + ((squareBig.heightFinal - squareSmall.heightFinal) / 2) * (1 / 2) - (squareSmall.heightFinal / 2) - ((squareBig.heightFinal - squareSmall.heightFinal) / 2) / 2);
                    welcomeOpacity = welcomeOpacity * welcomeOpacityRate;
                    ctx.globalAlpha = 1.0;
                } else {
                    phaseTwoEnd = true;
                    nowTime = Date.now();
                }
            } else {
                if (screenBlacked == false) {
                    justTime = Date.now();
                    screenBlacked = true;
                } else {
                    if (Date.now() - justTime > 1000) {
                        if (recordTimeAfterWait == false) {
                            nowTime = Date.now();
                            recordTimeAfterWait = true;
                        }
                        promptMessage9.update(canvas.width / 2, canvas.height / 2 - ((squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6) * 1.5, nowTime, 2, false);
                        if (promptMessage9.isEnd == true) {
                            if (promptMessage10.isSetStart == false) {
                                nowTime = Date.now();
                                promptMessage10.isSetStart = true;
                            }
                            promptMessage10.update(canvas.width / 2, canvas.height / 2, nowTime, 2, false);
                        }
                        if (promptMessage10.isEnd == true) {
                            if (promptMessage11.isSetStart == false) {
                                nowTime = Date.now();
                                promptMessage11.isSetStart = true;
                            }
                            promptMessage11.update(canvas.width / 2, canvas.height / 2 + ((squareBig.heightFinal - squareSmall.heightFinal) / 2 / 6) * 1.5 , nowTime, 0, false);
                        }
                        if (promptMessage11.isEnd == true) {
                            frameCounter--;
                        }
                        if (frameCounter < 0) {
                            phaseTwoEnd = true;
                            nowTime = Date.now();
                            frameCounter = 0;
                        }
                    }
                }
            }
        }

        if (phaseTwoEnd == true && pass == correctPass) {
            omuriceManNormal.update(canvas.width / 2, canvas.height / 2 + ((squareBig.heightFinal - squareSmall.heightFinal) / 2) * (1 / 2), false);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.font = (squareBig.heightFinal - squareSmall.heightFinal) / 2 + 'px ' + 'sans-serif';
            ctx.fillText('Welcome', canvas.width / 2, canvas.height / 2 + ((squareBig.heightFinal - squareSmall.heightFinal) / 2) * (1 / 2) - (squareSmall.heightFinal / 2) - ((squareBig.heightFinal - squareSmall.heightFinal) / 2) / 2);
            window.cancelAnimationFrame(requestId);
            window.setTimeout(() => {
                window.location.href = 'https://github.com/suyeden';
            }, 3000);
        } else if (phaseTwoEnd == true && pass !== correctPass) {
            window.cancelAnimationFrame(requestId);
            util.drawRect(0, 0, canvas.width, canvas.height, '#000000');
            window.setTimeout(() => {
                window.setInterval(() => {
                    util.drawRect(0, 0, canvas.width, canvas.height, '#000000');
                    if (babelCreated < babelObjArr.length) {
                        babelCreated++;
                    }
                    for (let i = 0; i < babelCreated; i++) {
                        babelObjArr[i].update();
                    }
                }, 500);
            }, 3000);
        }
    }
})();
