/**
 * Canvas2D API をラップしたユーティリティクラス
 */
class Canvas2DUtility {
    /**
     * @constructor
     * @param {HTMLCanvasElement} canvas - 対象となる canvas element
     */
    constructor(canvas){
        /**
         * @type {HTMLCanvasElement}
         */
        this.canvasElement = canvas;
        /**
         * @type {CanvasRenderingContext2D}
         */
        this.context2d = canvas.getContext('2d');
    }

    /**
     * getter
     * @return {HTMLCanvasElement}
     */
    get canvas() {return this.canvasElement;}
    /**
     * getter
     * @return {CanvasRenderingContext2D}
     */
    get context() {return this.context2d;}

    /**
     * 線分の描画
     * @param {number} x1 - 始点のX座標
     * @param {number} y1 - 始点のY座標
     * @param {number} x2 - 終点のX座標
     * @param {number} y2 - 終点のY座標
     * @param {string} [color] - 線分の色
     * @param {number} [width=1] - 線幅
     */
    drawLine(x1, y1, x2, y2, color, width=1){
        // 色
        if (color != null) {
            this.context2d.strokeStyle = color;
        }
        // 線幅
        this.context2d.lineWidth = width;
        // パス設定の開始の宣言
        this.context2d.beginPath();
        // パスの始点の設定
        this.context2d.moveTo(x1, y1);
        // パスを終点へ
        this.context2d.lineTo(x2, y2);
        // パス設定の終了の宣言
        this.context2d.closePath();
        // 線描画を行う
        this.context2d.stroke();
    }

    /**
     * 矩形の描画
     * @param {number} x - 矩形の左上角のX座標
     * @param {number} y - 矩形の左上角のY座標
     * @param {number} width - 矩形の横幅
     * @param {number} height - 矩形の高さ
     * @param {string} [color] - 矩形を塗りつぶす色
     */
    drawRect(x, y, width, height, color){
        if (color != null) {
            this.context2d.fillStyle = color;
        }
        this.context2d.fillRect(x, y, width, height);
    }

    /**
     * テキストの描画
     * @param {string} text - 描画するテキスト
     * @param {number} x - 描画位置のX座標
     * @param {number} y - 描画位置のY座標
     * @param {string} [color] - テキストの色
     * @param {number} [width] - テキストの描画幅の上限値
     */
    drawText(text, x, y, color, width){
        // 色
        if (color != null) {
            this.context2d.fillStyle = color;
        }
        this.context2d.fillText(text, x, y, width);
    }

    /** 
     * 画像をロードした後、コールバック関数にロードした画像を与えて呼び出す
     * @param {string} path - 画像のパス
     * @param {fumction} [callback] - コールバック関数
     */
    imageLoader(path, callback){
        // 画像のインスタンスの生成
        let imageFile = new Image();
        // 画像のロードが完了した時の処理を先に書く
        // もしコールバック関数が与えられていたら、画像のロード後に画像をコールバック関数の引数に渡す
        imageFile.addEventListener('load', () => {
            if (callback != null) {
                callback(imageFile);
            }
        }, false);
        // 画像のロードを始めるためにパスを指定
        imageFile.src = path;
    }
}
