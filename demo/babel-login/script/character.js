/**
 * 座標管理のためのクラス
 */
class Position {
    /**
     * @constructor
     * @param {number} x - X座標
     * @param {number} y - Y座標
     */
    constructor(x, y){
        /**
         * X座標
         * @type {number}
         */
        this.x = x;
        /**
         * Y座標
         * @type {number}
         */
        this.y = y;
    }

    /**
     * 値を設定する
     * @param {number} [x] - X座標
     * @param {number} [y] - Y座標
     */
    set(x, y){
        if (x !== null) {
            this.x = x;
        }
        if (y !== null) {
            this.y = y;
        }
    }
}

class Square {
    constructor(ctx, util){
        this.ctx = ctx;
        this.util = util;
        this.colorFill = null;
        this.colorStroke = null;
        this.strokeWidth = null;
        this.width = 0;
        this.height = 0;
        this.widthFinal = 0;
        this.heightFinal = 0;
        this.rotateSpeed = 0;
        this.growingSpeed = 0;
        this.angle = 270 * Math.PI / 180;
        this.opacity = 1;
        this.fadeOutRate = 0;
        this.keepTime = null;
        this.isRotationEnd = false;
        this.isEnd = false;
    }

    get rotateAngle() {
        if ((this.widthFinal / this.growingSpeed) - ((450 - 270) / this.rotateSpeed) < (30 / this.rotateSpeed)) {
            return 450;
        } else {
            return 540;
        }
    }

    set(wf, hf, rotateSpeed, growingSpeed, colorFill, colorStroke, strokeWidth, fadeOutRate){
        this.widthFinal = wf;
        this.heightFinal = hf;
        this.rotateSpeed = rotateSpeed;
        this.growingSpeed = growingSpeed;
        this.colorFill = colorFill;
        this.colorStroke = colorStroke;
        this.strokeWidth = strokeWidth;
        this.fadeOutRate = fadeOutRate;
    }

    growingRotationDraw(x, y){
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(this.angle);
        let offsetX = this.width / 2;
        let offsetY = this.height / 2;
        this.util.drawRect(-offsetX, -offsetY, this.width, this.height, this.colorFill);
        this.ctx.strokeStyle = this.colorStroke;
        this.ctx.lineWidth = this.strokeWidth;
        this.ctx.strokeRect(-offsetX, -offsetY, this.width, this.height);
        this.ctx.restore();
    }

    fadeOutDraw(x, y){
        if (this.opacity > 0.05) {
            this.opacity = this.opacity * this.fadeOutRate;
            this.ctx.globalAlpha = this.opacity;
            let offsetX = this.width / 2;
            let offsetY = this.height / 2;
            this.util.drawRect(x - offsetX, y - offsetY, this.width, this.height, this.colorFill);
            this.ctx.globalAlpha = 1.0;
        } else {
            this.isEnd = true;
        }
        let offsetX = this.width / 2;
        let offsetY = this.height / 2;
        this.ctx.strokeStyle = this.colorStroke;
        this.ctx.lineWidth = this.strokeWidth;
        this.ctx.strokeRect(x - offsetX, y - offsetY, this.width, this.height);
    }

    update(x, y, fadeStartFlag){
        if (this.isRotationEnd == true && fadeStartFlag == true) {
            this.fadeOutDraw(x, y);
        } else {
            if (this.angle < (this.rotateAngle * Math.PI / 180)) {
                if (this.width < this.widthFinal && this.height < this.heightFinal) {
                    this.width += this.growingSpeed;
                    this.height += this.growingSpeed;
                } else {
                    this.width = this.widthFinal;
                    this.height = this.heightFinal;
                }
                this.angle = ((this.angle * 180 / Math.PI) + this.rotateSpeed) * Math.PI / 180;
            } else {
                if (this.width < this.widthFinal && this.height < this.heightFinal) {
                    this.width += this.growingSpeed;
                    this.height += this.growingSpeed;
                } else {
                    this.width = this.widthFinal;
                    this.height = this.heightFinal;
                    this.isRotationEnd = true;
                }
                this.angle = this.rotateAngle * Math.PI / 180;
            }
            this.growingRotationDraw(x, y);
        }

        this.ctx.globalAlpha = 1.0;
    }
}

class OmuriceMan {
    constructor(ctx, imagePath){
        // @type {CanvasRenderingContext2D}
        this.ctx = ctx;
        // @type {number}
        this.width = 0;
        // @type {number}
        this.height = 0;
        // @type {number}
        this.angle = 270 * Math.PI / 180;
        // @type {boolean}
        this.ready = false;
        // @type {Image}
        this.image = new Image();
        this.image.addEventListener('load', () => {
            this.ready = true; // 画像のロードが完了したら準備完了フラグを立てる
        }, false);
        this.image.src = imagePath;
        this.opacity = 1;
        this.fadeOutRate = null;
        this.isEnd = false;
    }

    set(w, h, fadeOutRate){
        this.width = w;
        this.height = h;
        this.fadeOutRate = fadeOutRate;
    }

    draw(x, y){
        let offsetX = this.width / 2;
        let offsetY = this.height / 2;
        this.ctx.drawImage(
            this.image,
            x - offsetX,
            y - offsetY,
            this.width,
            this.height
        );
    }

    fadeOutDraw(x, y){
        if (this.opacity > 0.011) {
            this.ctx.globalAlpha = this.opacity;
            let offsetX = this.width / 2;
            let offsetY = this.height / 2;
            this.ctx.drawImage(
                this.image,
                x - offsetX,
                y - offsetY,
                this.width,
                this.height
            );
            this.ctx.globalAlpha = 1.0;
        } else {
            this.isEnd = true;
        }
    }

    update(x, y, fadeOutFlag){
        if (fadeOutFlag == false) {
            this.draw(x, y);
        } else {
            this.fadeOutDraw(x, y);
            this.opacity = this.opacity * this.fadeOutRate;
        }
        
        this.ctx.globalAlpha = 1.0;
    }
}

class PromptString {
    constructor(ctx, util, contents){
        this.ctx = ctx;
        this.util = util;
        this.contents = contents;
        this.outputString = '';
        this.outputText = '';
        this.counter = 0;
        this.frame = 0;
        this.x = 0;
        this.y = 0;
        this.font = null;
        this.fontSize = null;
        this.textAlign = null;
        this.width = 0;
        this.color = null;
        this.interval = 0;
        this.promptString = null;
        this.isSetStart = false;
        this.isEnd = false;
        this.promptInterval = 0;
        this.promptOpacity = 1.0;
    }

    set(font, fontSize, textAlign, color, interval, promptInterval){
        this.font = fontSize + 'px ' + font;
        this.fontSize = fontSize;
        this.textAlign = textAlign;
        this.color = color;
        this.interval = interval;
        this.promptInterval = promptInterval;
    }
    
    drawString(x, y){
        this.x = x;
        this.y = y;
        if (this.frame % this.interval == 0) {
            this.outputString += this.contents.charAt(this.counter);
            this.outputText = this.outputString + ' '.repeat(this.contents.length - this.outputString.length);
            this.counter++;
        }
        this.ctx.textAlign = this.textAlign;
        this.ctx.fillStyle = this.color;
        this.ctx.font = this.font;
        this.ctx.fillText(this.outputText, this.x, this.y);
        this.frame++;
    }

    drawPrompt(){
        this.promptString = '▮';
        if (this.frame % this.promptInterval == 0) {
            if (this.promptOpacity == 1.0) {
                this.promptOpacity = 0.5;
            } else {
                this.promptOpacity = 1.0;
            }
        }
        this.ctx.globalAlpha = this.promptOpacity;
        this.ctx.textAlign = this.textAlign;
        this.ctx.fillStyle = this.color;
        this.ctx.font = this.font;
        this.ctx.fillText(this.promptString, this.x + this.ctx.measureText(this.contents + ' ').width, this.y);
        this.ctx.globalAlpha = 1.0;
    }

    update(x, y, startTime, keepTime, promptFlag){
        if ((Date.now() - startTime) / 1000 < keepTime) {
            if (this.counter < this.contents.length) {
                this.drawString(x, y);
            } else {
                if (promptFlag == true) {
                    this.drawString(x, y);
                    this.drawPrompt();
                } else {
                    this.drawString(x, y);
                }
            }
        } else {
            this.drawString(x, y);
        }
        if ((Date.now() - startTime) / 1000 > keepTime && this.contents.length == this.outputString.length) {
            this.isEnd = true;
        }
    }
}

class PromptStringHalf extends PromptString {
    constructor(ctx, util, contents, question, waitFrame){
        super(ctx, util, contents);
        this.question = question;
        this.outputString = this.question;
        this.isSetTime = false;
        this.justTime = null;
        this.waitFrame = waitFrame;
        this.frameCounter = 0;
    }

    drawString(x, y){
        this.x = x;
        this.y = y;
        if (this.frame % this.interval == 0) {
            this.outputString += this.contents.charAt(this.counter + this.question.length);
            this.outputText = this.outputString + ' '.repeat(this.contents.length - this.outputString.length);
            this.counter++;
        }
        this.ctx.textAlign = this.textAlign;
        this.ctx.fillStyle = this.color;
        this.ctx.font = this.font;
        this.ctx.fillText(this.outputText, this.x, this.y);
        this.frame++;
    }

    update(x, y){
        this.drawString(x, y);
        if (this.contents.length == this.outputString.length) {
            if (this.isSetTime == false) {
                this.justTime = Date.now();
                this.isSetTime = true;
            }
            if (this.contents.length == this.outputString.length) {
                this.frameCounter++;
            }
            if (this.frameCounter > this.waitFrame) {
                this.isEnd = true;
            }
        }
    }
}

class Babel {
    constructor(ctx, canvas, fontSize, y){
        this.ctx = ctx;
        this.canvas = canvas;
        this.fontSize = fontSize;
        this.canvasHeight = canvas.height;
        this.canvasWidth =canvas.width;
        this.x = null;
        this.y = y;
        this.xType = 1;
        this.outputString = 'BABEL   '.repeat(Math.floor(this.canvas.width / 8) + 1);
        this.color = '#ff0000';
        this.font = this.fontSize + 'px Franklin Gothic Medium';
    }

    drawBabel(){
        if (this.xType == 0) {
            this.x = - this.fontSize * 3.0;
            this.xType = 1 - this.xType;
        } else {
            this.x = - this.fontSize * 3.5;
            this.xType = 1 - this.xType;
        }
        this.ctx.fillStyle = this.color;
        this.ctx.font = this.font;
        this.ctx.fillText(this.outputString, this.x, this.y);
    }

    update(){
        this.drawBabel();
    }
}
