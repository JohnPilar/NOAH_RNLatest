/*
This file are only limited to Promptus8 and Noah Web Application only
under company: Forecasting and Planning Technologies Inc.
Developer: Danielle P. Dignadice

Date Modification Created : June 20 2018  
Date Modified : September 02, 2021 / 08:30 AM  - before: 09-01-2021
Version: P8-Charts Library 1.0.138

Illegal used are Prohibited
Modification of this Library is Prohibited.
*/

//Browser Check Start

// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 71
//var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

// Blink engine detection
//var isBlink = (isChrome || isOpera) && !!window.CSS;

//Browser Check End

//Generic Variables
var PI = Math.PI,
    cos = Math.cos,
    sin = Math.sin,
    abs = Math.abs,
    pow = Math.pow,
    round = Math.round;
var click = false;

var i, ic, j;

var P8 = P8 || {};

var option = [],
    optionH = [], // Option Header
    optionF = [], // Option Footer
    optionLL = [], // Option Label Left
    optionLR = [], // Option Label Right
    optionLabelFont = [],
    optionLegendFont = [],
    optionGridLine = [],
    optionMeasureLeft = [],
    optionMeasureRight = [],
    element = [],
    percent = 0,
    formatx,
    formaty;
var month = "January February March April May June July August September October November December".split(" ");
var day = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");

//var mid = function (x, y, r) {
//    return {
//        x: x
//        , y: y
//        , r: r
//    }
//}

//Element by ID
function elementID(canvasID) {
    return document.getElementById(canvasID);
}

function numdigit(num, digit) {
    var q = !1; 0 > num && (q = !0, num *= -1); num = "" + num; for (digit = digit ? digit : 1; num.length < digit;) num = "0" + num; return q ? "-" + num : num
}

function TimeDateElement(input, dt) {
    switch (dt) {
        case "date":
            return TimeDateLabel(input, "MMM. DD, yyyy");
            break;
        case "time":
            return TimeDateLabel(input, "hh:mm TT");
            break;
        case "year":
            return TimeDateLabel(input, "yyyy");
            break;
        case "month":
            return TimeDateLabel(input, "MMM. yyyy");
            break;
        default:
            return TimeDateLabel(input, "MMM. DD, yyyy<br>hh:mm ss TT");
    }
}

function TimeDateLabel(input, format) {
    var az = /D{1,4}|M{1,4}|y{1,4}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|f{1,3}|t{1,2}|T{1,2}|K|z{1,3}|"[^"]*"|'[^']*'/g;
    //var AZ = /[^-+\dA-Z]/g;
    var year = input.getFullYear(),
        months = input.getMonth(),
        date = input.getDate(),
        days = input.getDay(),
        hours = input.getHours(),
        minutes = input.getMinutes(),
        seconds = input.getSeconds();
    return format = format.replace(
        az, function (c) {
            switch (c) {
                case "D": return date;
                case "DD": return numdigit(date, 2);
                case "DDD": return day[days].slice(0, 3);
                case "DDDD": return day[days];
                case "M": return months + 1;
                case "MM": return numdigit(months + 1, 2);
                case "MMM": return month[months].slice(0, 3);
                case "MMMM": return month[months];
                case "y": return parseInt(String(year).slice(-2));
                case "yy": return numdigit(String(year).slice(-2), 2);
                case "yyy": return numdigit(String(year).slice(-3), 3);
                case "yyyy": return year;
                case "H": return hours;
                case "HH": return numdigit(hours, 2);
                case "h": return hours % 12 || 12;
                case "hh": return numdigit(hours % 12 || 12, 2);
                case "m": return minutes;
                case "mm": return numdigit(minutes, 2);
                case "s": return seconds;
                case "ss": return numdigit(seconds, 2);
                case "T": return 12 > hours ? 'A' : 'P';
                case "TT": return 12 > hours ? 'AM' : 'PM';
                case "t": return 12 > hours ? 'a' : 'p';
                case "tt": return 12 > hours ? 'am' : 'pm';
                default: return c.slice(1, c.length - 1);
            }
        })
}

var Clabeltext, Clabelfontweight, Clabelfontsize, Clabelfontfamily, Clabelfontstyle, Clabelrotate, Clabelalign, Clabelbaseline, Clabelcolor, ClabelX, ClabelY;

Number.isInteger = Number.isInteger || function (value) {
    return typeof value === 'number' &&
      isFinite(value) &&
      Math.floor(value) === value;
};

//Animation
var requestAnimFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function (f, millisecond) { return setTimeout(f, millisecond) };
var cancelAnimFrame = window.cancelAnimationFrame
    || window.webkitCancelRequestAnimationFrame
    || window.mozCancelRequestAnimationFrame
    || window.oCancelRequestAnimationFrame
    || window.msCancelRequestAnimationFrame
    || function (requestID) { return clearTimeout(requestID) }; //fall back

//Element by ID
function ElementID(canvasID) {
    return document.getElementById(canvasID);
}

//Create Canvas
function Canvas(canvasID) {
    return ElementID(canvasID).getContext('2d');
}

//Angle
function anglemeasure(x, y) {
    return (cos(x) + sin(y))
}

function angleresult(angle) {
    var out = parseInt(angle / 360);
    if (angle < -360 || angle > 360) {
        angle -= (360 * out);
        return angle;
    }
    else
        return angle;
}

function toDegrees(angle) {
    return angle * (180 / PI);
}

function toRadians(angle) {
    return angle * (PI / 180);
}

//Locale String
function localestring(x, precision) {
    return x.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: precision });
}

//random value
function random(value) {
    return Math.floor(Math.random() * ((value * 2) + 1)) - value;
}

//percentage
function Percent(x, total) {
    return (x / total) * 100
}

(function (c) {
    if (!c || !c.prototype) return;

    //Font
    c.prototype.FontFormat = function (font) {
        font.fontWeight = font.fontWeight || 'normal';
        font.fontStyle = font.fontStyle || 'normal';
        this.font = font.fontStyle + ' ' + font.fontWeight + ' ' + (font.fontSize | 0) + 'px ' + font.fontFamily;
    }

    c.prototype.FontWidth = function (text, font) {
        this.FontFormat(font);
        return this.measureText(text).width;
    }

    c.prototype.FontHeight = function (font) {
        this.FontFormat(font);
        return parseInt(this.font.match(/\d+/), 10)
    }

    //Text Display
    c.prototype.TextDisplay = function (text, x, y, rotate, fill, stroke, strokewidth, align, baseline) {
        stroke = stroke || "black";
        strokewidth = strokewidth || 0;
        this.save();
        this.fillStyle = fill;
        this.strokeStyle = stroke;
        this.translate(parseInt(x), parseInt(y));
        this.rotate(toRadians(angleresult(rotate)));
        this.textAlign = align;
        this.textBaseline = baseline;
        this.fillText(text, 0, 0);
        if (strokewidth > 0) this.strokeText(text, 0, 0);
        this.restore();
    }

    /*c.prototype.wrapText = function (text, x, y, rotate, textwidth, fill, stroke, align, baseline, maxWidth, lineHeight, font) {
        stroke = stroke || "black";
        textwidth = textwidth || 0;
        this.save();
        var yAdd = parseInt(y);
        var yLine = parseInt(y);
        var line = '';
        this.fillStyle = fill;
        this.strokeStyle = stroke;
        this.textAlign = align;
        this.textBaseline = baseline;
        this.translate(parseInt(x), y);
        this.rotate(toRadians(angleresult(rotate)));
        var sections;
        if (typeof text == "string") {
            //manage carriage return
            text = text.replace(/(\r\n|\n\r|\r|\n)/g, "\n");
            //manage tabulation
            text = text.replace(/(\t)/g, "    "); // I use 4 spaces for tabulation, but you can use anything you want
            //array of lines
            var sections = text.split("\n");
        }
        else if (typeof text == "number"){
            var sections = [""];
        }
        
        for (s = 0, len = sections.length; s < len; s++) {
            var words = sections[s].split(' ');
            var line = '';

            //var words = text.toString().split(' ');
            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = this.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    this.fillText(line, 0, yAdd - y);
                    if (textwidth > 0) this.strokeText(line, 0, yAdd - y);
                    this.TextLine(line, 0, yLine - y, fill, font, align, baseline);
                    line = words[n] + ' ';
                    yAdd += lineHeight;
                    yLine += lineHeight;
                }
                else {
                    line = testLine;
                }
            }
            this.fillText(line, 0, yAdd - y);
            if (textwidth > 0) this.strokeText(line, 0, yAdd - y);
            this.TextLine(line, 0, yLine - y, fill, font, align, baseline);
            yAdd += lineHeight;
            yLine += lineHeight;
        }
        this.restore();
    }*/
    
    c.prototype.wrapText = function (text, x, y, rotate, textwidth, fill, stroke, align, baseline, maxWidth, lineHeight, font, letter) {
        letter = letter || false;
        stroke = stroke || "black";
        textwidth = textwidth || 0;
        this.save();
        var yAdd = parseInt(y);
        var yLine = parseInt(y);
        var line = '';
        this.fillStyle = fill;
        this.strokeStyle = stroke;
        this.textAlign = align;
        this.textBaseline = baseline;
        this.translate(parseInt(x), y);
        this.rotate(toRadians(angleresult(rotate)));
        var sections;
        if (typeof text == "string") {
            //manage carriage return
            text = text.replace(/(\r\n|\n\r|\r|\n)/g, "\n");
            //manage tabulation
            text = text.replace(/(\t)/g, "    "); // I use 4 spaces for tabulation, but you can use anything you want

            //array of lines
            sections = text.split("\n");
        }
        else if (typeof text == "number"){
            var sections = [""];
        }
        
        for (s = 0, len = sections.length; s < len; s++) {
            var words = letter ? sections[s].split('')
                : sections[s].split(' ');
            var line = '';

            //var words = text.toString().split(' ');
            for (var n = 0; n < words.length; n++) {
                var testLine = letter ? line + words[n] + '' : line + words[n] + ' ';
                var metrics = this.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    this.fillText(line, 0, yAdd - y);
                    if (textwidth > 0) this.strokeText(line, 0, yAdd - y);
                    this.TextLine(line, 0, yLine - y, fill, font, align, baseline);
                    line = words[n] + ' ';
                    yAdd += lineHeight;
                    yLine += lineHeight;
                }
                else {
                    line = testLine;
                }
            }
            this.fillText(line, 0, yAdd - y);
            if (textwidth > 0) this.strokeText(line, 0, yAdd - y);
            this.TextLine(line, 0, yLine - y, fill, font, align, baseline);
            yAdd += lineHeight;
            yLine += lineHeight;
        }
        this.restore();
    }

    c.prototype.wrapTextWidth = function (text, maxWidth, font, letter) {
        letter = letter || false;
        var line = '';
        var sections;
        if (typeof text == "string") {
            //manage carriage return
            text = text.replace(/(\r\n|\n\r|\r|\n)/g, "\n");
            //manage tabulation
            text = text.replace(/(\t)/g, "    "); // I use 4 spaces for tabulation, but you can use anything you want
            //array of lines
            var sections = text.split("\n");
        }
        else if (typeof text == "number") {
            var sections = [""];
        }

        var textarray = [];
        for (s = 0, len = sections.length; s < len; s++) {
            var words = letter ? sections[s].split('') : sections[s].split(' ');
            var line = '';

            var space= letter ? '' : ' ';
            //this.FontWidth(testLine, font)
            var textadd = 0;
            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + space;
                var metrics = this.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    textadd += this.FontWidth(line, font);
                    line = words[n] + ' ';
                    textarray.push(textadd);
                }
                else {
                    line = testLine;
                }
            }
            textarray.push(this.FontWidth(line, font));
        }
        return MaxArray(textarray);
    }

    c.prototype.wrapTextHeight = function (text, y, maxWidth, lineHeight, letter) {
        letter = letter || false;
        //manage carriage return
        text = text.replace(/(\r\n|\n\r|\r|\n)/g, "\n");
        //manage tabulation
        text = text.replace(/(\t)/g, "    "); // I use 4 spaces for tabulation, but you can use anything you want
        //array of lines
        var sections = text.split("\n");
        
        for (s = 0, len = sections.length; s < len; s++) {
            var words = letter ? sections[s].split('') : sections[s].split(' ');
            var line = '';

            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = this.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    line = words[n] + ' ';
                    y += lineHeight;
                }
                else {
                    line = testLine;
                }
            }
            y += lineHeight;
        }
        return parseInt(y /*+ lineHeight*/);
    }

    c.prototype.wrapTextArray = function (text, y, maxWidth, lineHeight, letter) {
        letter = letter || false;
        //manage carriage return
        text = text.replace(/(\r\n|\n\r|\r|\n)/g, "\n");
        //manage tabulation
        text = text.replace(/(\t)/g, "    "); // I use 4 spaces for tabulation, but you can use anything you want
        //array of lines
        var sections = text.split("\n");

        var wordnum = 0;
        for (s = 0, len = sections.length; s < len; s++) {
            var words = letter ? sections[s].split('') : sections[s].split(' ');
            var line = '';

            //var words = text.split(' ');
            //var line = '';

            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = this.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    line = words[n] + ' ';
                    wordnum += 1;
                }
                else {
                    line = testLine;
                }
            }
            wordnum += 1;
        }
        return wordnum;
    }
    c.prototype.Text = function (text, x, y, rotate, fill, stroke, strokewidth, align, baseline, font) {
        this.save();
        this.FontFormat(font);
        this.TextLine(text, parseInt(x), parseInt(y), fill, font, align, baseline);
        this.TextDisplay(text, parseInt(x), parseInt(y), rotate, fill, stroke, strokewidth, align, baseline);
        this.restore();
    }

    c.prototype.TextWrap = function (text, x, y, rotate, textwidth, fill, stroke, align, baseline, font, maxWidth, lineHeight, letter) {
        letter = letter || false;
        this.save();
        this.FontFormat(font);
        this.wrapText(text, parseInt(x), parseInt(y), rotate, textwidth, fill, stroke, align, baseline, maxWidth, lineHeight, font, letter);
        this.restore();
    }

    c.prototype.TextLine = function (text, x, y, fill, font, align, baseline) {
        var textWidth = this.measureText(text).width;

        var startX = 0, startY, startYS, startYO;
        var fontheight = this.FontHeight(font);

        if (baseline == "alphabetic") {
            startY = parseInt(y + (parseInt(font.fontSize) / 15)); //15
            startYS = parseInt(y - (parseInt(font.fontSize) / 3));
        }
        else if (baseline == "middle") {
            startY = parseInt(y + (parseInt(font.fontSize) / 3)); //3
            startYS = parseInt(y - (parseInt(font.fontSize) / 10));
        }
        else if (baseline == "hanging") {
            if (isEdge || isIE) {
                startY = parseInt(y + (parseInt(font.fontSize) / 1)); //1.3
                startYS = parseInt(y + (parseInt(font.fontSize) / 1.5));
            }
            else {
                startY = parseInt(y + (parseInt(font.fontSize) / 1.3)); //1.3
                startYS = parseInt(y + (parseInt(font.fontSize) / 2.5));
            }
            startYO = parseInt(y);
        }

        var endX = 0,
            endY = startY,
            endYS = startYS,
            endYO = startYO;

        var underlineHeight = round(fontheight / 15);

        if (underlineHeight < 1) {
            underlineHeight = 1;
        }

        if (align == "center") {
            startX = parseInt(x - (textWidth / 2));
            endX = parseInt(x + (textWidth / 2));
        } else if (align == "right") {
            startX = parseInt(x - textWidth);
            endX = parseInt(x);
        } else {
            startX = parseInt(x);
            endX = parseInt(x + textWidth);
        }

        if (font.underline) this.Line(startX, startY + 0.5, endX, endY + 0.5, underlineHeight, fill, nullshadow);
        if (font.strikethrough) this.Line(startX, startYS + 0.5, endX, endYS + 0.5, underlineHeight, fill, nullshadow);
        if (font.overline) this.Line(startX, startYO + 0.5, endX, endYO + 0.5, underlineHeight, fill, nullshadow);
    }

    c.prototype.MaxArrayLabel = function (option, chart) {
        data = option.data;
        labelfont = option.labelfont;
        this.FontFormat(labelfont);
        var arrayname = [];
        for (var i = 0; i < data.length; i++) {
            labelwidth = LabelOutput(option, i, false, chart, true);
            arrayname.push(this.measureText(labelwidth).width);
        }
        var maxarray = MaxArray(arrayname);
        if (data.length < 1E6) {
            //this.LabelRotate(data, numbaseB, intervalx, labelfont);
            return Math.ceil(maxarray)
        }
        else return (labelfont.fontSize) ;
    }

    c.prototype.MaxArrayLabelNum = function (array, font) {
        this.FontFormat(font);
        var arrayname = [];
        for (var i = 0; i < array.length; i++) {
            arrayname.push(this.measureText(convertnum(i)).width);
        }
        var maxarray = MaxArray(arrayname);
        if (array.length < 1E6) {
            return Math.ceil(maxarray) / 2
        }
        else return (font.fontSize + (font.fontSize * 0.7)) / 2;
    }

    c.prototype.MaxArrayText = function (option, chart) {
        data = dataarrayoutput(option);
        ObjectData = option.ObjectData;
        legend = option.legendfont;
        this.FontFormat(legend);
        chart = chart || "barline";
        var arrayname = [];
        var array;
        if (chart == "piedoughnut"
            || chart == "pie"
            || chart == "doughnut"
            || chart == "cone"
            || chart == "pyramid"
            || chart == "cylinder")
            array = data;
        else
            array = DataOutput(option);
        for (var i = 0; i < array.length; i++) {
            if (chart == "piedoughnut"
                || chart == "pie"
                || chart == "doughnut"
                || chart == "cone"
                || chart == "pyramid"
                || chart == "cylinder") {
                arrayname.push(this.measureText(array[i][Object.keys(array[i])[0]]).width);
            }
            else {
                if (array == data)
                    arrayname.push(this.measureText(LabelOutput(option, i, false, chart)).width);
                else
                    arrayname.push(this.measureText(array[i][Object.keys(array[i])[0]]).width);
            }
        }
        var maxarray = MaxArray(arrayname);
        return maxarray;
    }

    c.prototype.shadowset = function (setx, sety, blur, color) {
        setx = setx || 0;
        sety = sety || 0;
        blur = blur || 0;
        color = color || "#000000";
        this.shadowOffsetX = setx;
        this.shadowOffsetY = sety;
        this.shadowBlur = blur;
        this.shadowColor = color;
    }

    //Shape A
    c.prototype.shapeA = function (x, y, r, side, area, width, fill, stroke, shadow) {
        area *= 1.25;
        this.lineWidth = width;
        this.fillStyle = fill;
        this.strokeStyle = stroke;
        this.save();
        this.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
        this.beginPath();
        for (var i = 0; i < side; i++) {
            var step = 2 * PI / side,
                shift = toRadians(r),
                curStep = i * step + shift;
            this.lineTo(x + area * cos(curStep), y + area * sin(curStep));
        }
        this.closePath();
        if (width > 0) this.stroke();
        this.fill();
        this.restore();
        if (width > 0) this.stroke();
    }
    //Shape B
    c.prototype.shapeB = function (cx, cy, spikes, area, width, fill, stroke, shadow) {
        var x = cx, y = cy;
        this.lineWidth = width;
        this.fillStyle = fill;
        this.strokeStyle = stroke;
        var rot = 3 * (PI / 2);
        var step = PI / spikes;
        area *= 1.2;
        var outerRadius = area;
        var innerRadius = area / 2;

        this.save();
        this.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
        this.beginPath();
        this.moveTo(cx, cy - outerRadius)
        for (i = 0; i < spikes; i++) {
            x = cx + cos(rot) * outerRadius;
            y = cy + sin(rot) * outerRadius;
            this.lineTo(x, y)
            rot += step

            x = cx + cos(rot) * innerRadius;
            y = cy + sin(rot) * innerRadius;
            this.lineTo(x, y)
            rot += step
        }
        this.lineTo(cx, cy - outerRadius);
        if (width > 0) this.stroke();
        this.fill();
        this.restore();
        if (width > 0) this.stroke();
    }

    //Shape C
    c.prototype.shapeC = function (x, y, area, rotate, point, m, width, stroke, shadow) {
        this.lineWidth = width * 1.5;
        this.strokeStyle = stroke;
        this.save();
        this.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
        this.beginPath();
        this.translate(x, y);
        this.rotate(PI / rotate);
        this.moveTo(0, 0 - area);
        for (var i = 0; i < point; i++) {
            this.rotate(PI / point);
            this.lineTo(0, 0 - (area * m));
            this.rotate(PI / point);
            this.lineTo(0, 0 - area);
        }
        this.closePath();
        this.stroke();
        this.restore();
    }

    //circle
    c.prototype.circle = function (x, y, r, width, fill, stroke, shadow) {
        this.lineWidth = width;
        this.fillStyle = fill;
        this.strokeStyle = stroke;
        this.save();
        this.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
        this.beginPath();
        this.arc(x, y, r, 0, PI * 2, false);
        if (width > 0) this.stroke();
        this.fill();
        this.restore();
        if (width > 0) this.stroke();
        this.closePath();
    }

    //pyramid
    c.prototype.pyramid = function (x, y, width, height, area, rotate, bar, stretch, percent, topcrop, percentheight, side, scale, filltype, gradienttype, fill, stroke, linewidth, dash, shadow, chart, option, group, ic, i, Garray) {
        group = group || 1;
        ic = ic || 0;

        topcrop = topcrop || 0;
        if (chart != "pyramid") {
            var Gout = Garray[ic - 1];
            var group3D = group3dstack(option, i);
            var OD = option.ObjectData.length,
                data = option.data,
                stacked = option.stacked,
                percentstack = option.percentstack;

            var valueuptotal = ValueTotal(option, chart, "up"),
                valuedowntotal = ValueTotal(option, chart, "down");

            var datainput = DataInput(data, i, ic);
        }

        percent = percent || 100;
        shadow = shadow || nullshadow;
        stretch = stretch || false;
        side = side || false;
        scale = scale || 1;

        var areaA = area / 100,
            areaB = 1 - areaA,
            areaC = areaA * 0.5,
            areaD = 1 - areaC,
            areaE = (1 - areaA) * 0.5,
            areaF = 1 - areaE;

        var vertical;
        if (side) {
            var percentheight = (height) * ((100 - percent) / 100);
            vertical = false;
            height -= percentheight;
            y += (percentheight * 0.5);
        }
        else {
            var percentwidth = (width) * ((100 - percent) / 100);
            vertical = true;
            width -= percentwidth;
            x += (percentwidth * 0.5);
        }

        var xadd = width * 0.5;
        var yadd = height * 0.5;
        var xA = x + xadd;
        var yA = y + yadd;
        var xB = 0 - xadd;
        var yB = 0 - yadd;

        WidthA = WidthFix(width, height, areaA, true, bar, vertical),
        WidthB = WidthFix(width, height, areaA, false, bar, vertical),
        WidthC = WidthFix(width, height, areaC, true, bar, vertical),
        WidthD = WidthFix(width, height, areaC, false, bar, vertical),
        WidthE = WidthFix(width, height, areaE, true, bar, vertical),
        WidthF = WidthFix(width, height, areaE, false, bar, vertical);

        HeightA = HeightFix(width, height, areaA, true, bar, vertical),
        HeightB = HeightFix(width, height, areaA, false, bar, vertical),
        HeightC = HeightFix(width, height, areaC, true, bar, vertical),
        HeightD = HeightFix(width, height, areaC, false, bar, vertical),
        HeightE = HeightFix(width, height, areaE, true, bar, vertical),
        HeightF = HeightFix(width, height, areaE, false, bar, vertical);

        function pyramidpoints(c, startx, starty, nextx, nexty, nextx2, nexty2, endx, endy) {
            c.moveTo(startx, starty);
            c.lineTo(nextx, nexty);
            c.lineTo(nextx2, nexty2);
            c.lineTo(endx, endy);
            c.lineTo(startx, starty);
        }

        this.save();
        this.translate(xA, yA);
        this.rotate(toRadians(angleresult(rotate)));

        var xm = xB + xadd;
        var ym = yB + yadd;
        var xe = xB + width;
        var ye = yB + height;

        function tripoints(c, startx, starty, nextx, nexty, endx, endy, fill) {
            //c.save();
            //c.beginPath();
            //c.fillStyle = fill;
            c.moveTo(startx, starty);
            c.lineTo(nextx, nexty);
            c.lineTo(endx, endy);
            c.lineTo(startx, starty);
            //c.fill();
            //c.closePath();
            //c.restore();
        }

        if (stretch) {

            var xout, yout;
            if (scale >= 0) {

                if (!vertical) {
                    if (valuedowntotal > valueuptotal) {
                        if (valuedowntotal == data.length) {
                            xB //-= WidthA;
                        }
                        else {
                            if (datainput > 0) xB //+= WidthA;
                        }
                    }
                    else {
                        if (valueuptotal == data.length) {
                            xB //-= WidthA;
                        }
                        else {
                            if (datainput < 0) xB += WidthA;
                            if (datainput >= 0) xB -= WidthA;
                        }
                    }
                }

                if (stacked || percentstack) {
                    if (datainput >= 0) {
                        yout = yB + HeightA;
                    }
                    else {
                        yout = yB - HeightA;
                    }
                    xout = xB;
                }
                else {
                    xout = xB //+ HeightA;
                    yout = yB + HeightA;
                }
            }
            else {
                xout = xB;
                yout = yB - HeightA;
            }

            var xoutA,
                xoutB,
                yfrontA,
                yfrontB,
                yRA,
                yRB,
                youtA,
                youtB,
                youtC,
                youtD;
            if (width >= 0) {
                xoutA = xout;
                xoutB = xout + WidthA;
                yfrontA = yB + HeightA;
                yfrontB = ye;
                yRA = yB;
                yRB = yB + HeightA;
                youtA = yB + HeightA;
                youtB = ye;
                youtC = yB;
                youtD = yB + HeightB;
            }
            else {
                xoutA = xout //+ WidthA;
                xoutB = xout - WidthA;
                yfrontA = yB + HeightA;
                yfrontB = ye; //yB + HeightB;
                yRA = ye;//yB + HeightB;
                yRB = yB + HeightB;
                youtA = yB + HeightA;
                youtB = ye; //yB + HeightB;
                youtC = yB //+ HeightA;
                youtD = yB + HeightB; //ye;
            }

            var pyramidfront = [],
                pyramidLside = [],
                pyramidrear = [],
                pyramidRside = [],
                pyramidbottom = [];

            if (side) {
                pyramidfront.push({ x: xoutA, y: yfrontA });
                pyramidfront.push({ x: xe, y: ym });
                pyramidfront.push({ x: xoutA, y: yfrontB });

                pyramidLside.push({ x: xB - WidthA, y: youtC });
                pyramidLside.push({ x: xe, y: ym });
                pyramidLside.push({ x: xB, y: youtA });

                pyramidRside.push({ x: xoutB, y: yRA });
                pyramidRside.push({ x: xoutA, y: yRB });
                pyramidRside.push({ x: xe, y: ym });

                if ((!stacked && !percentstack)
                    || ((stacked || percentstack) && Gout == 1)) {

                    pyramidrear.push({ x: xoutB, y: youtC });
                    pyramidrear.push({ x: xe, y: ym });
                    pyramidrear.push({ x: xoutB, y: youtD });

                    pyramidbottom.push({ x: xoutA, y: youtA });
                    pyramidbottom.push({ x: xoutA, y: youtB });
                    pyramidbottom.push({ x: xoutB, y: youtD });
                    pyramidbottom.push({ x: xoutB, y: youtC });
                }


                var scaleout;
                //this.scale(1, 1);
            }
            else {
                pyramidfront.push({ x: xm, y: ye });
                pyramidfront.push({ x: xB + (width * areaB), y: yB });
                pyramidfront.push({ x: xB, y: yB });

                pyramidRside.push({ x: xm, y: ye });
                pyramidRside.push({ x: xB + (width * areaB), y: yB });
                pyramidRside.push({ x: xe, y: yout });

                if (!stacked && !percentstack) {
                    pyramidLside.push({ x: xm, y: ye });
                    pyramidLside.push({ x: xB, y: yB });
                    pyramidLside.push({ x: xB + (width * areaA), y: yout });

                    pyramidrear.push({ x: xm, y: ye });
                    pyramidrear.push({ x: xB + (width * areaA), y: yout });
                    pyramidrear.push({ x: xe, y: yout });

                }
                pyramidbottom.push({ x: xB, y: yB });
                pyramidbottom.push({ x: xB + (width * areaB), y: yB });
                pyramidbottom.push({ x: xe, y: yout });
                pyramidbottom.push({ x: xB + (width * areaA), y: yout });

            }
            //pyramidfront(this, fill);

            if (stacked || percentstack) {
                if (datainput < 0 && Gout == 1) {
                    this.polygon(pyramidbottom, fill, stroke, linewidth, [0], shadow);
                    this.polygon(pyramidbottom, rgba(0, 0, 0, 0.5), stroke, 0, [0], shadow);
                }
            }
            else {
                if ((scale >= 0 && !side)
                    || (side && width >= 0)) {
                    this.polygon(pyramidbottom, fill, stroke, linewidth, [0], shadow);
                    this.polygon(pyramidbottom, rgba(0, 0, 0, 0.5), stroke, 0, [0], shadow);
                }
            }

            //rear
            this.polygon(pyramidrear, fill, stroke, 0, [0], nullshadow);
            this.polygon(pyramidrear, rgba(255, 255, 255, 0.75), stroke, linewidth, [0], nullshadow);

            //front
            this.polygon(pyramidfront, fill, stroke, linewidth, [0], nullshadow);

            //sides
            if (side){
                if (datainput >= 0){
                    this.polygon(pyramidRside, fill, stroke, 0, [0], nullshadow);
                    this.polygon(pyramidRside, rgba(0, 0, 0, 0.5), stroke, linewidth, [0], nullshadow);
                }
                else{
                    this.polygon(pyramidLside, fill, stroke, 0, [0], nullshadow);
                    this.polygon(pyramidLside, rgba(0, 0, 0, 0.5), stroke, linewidth, [0], nullshadow);
                }
            }
            else{
                this.polygon(pyramidRside, fill, stroke, 0, [0], nullshadow);
                this.polygon(pyramidRside, rgba(0, 0, 0, 0.5), stroke, linewidth, [0], nullshadow);
            }

            if (stacked || percentstack) {
                if (datainput < 0 && Gout == 1) {
                    this.polygon(pyramidbottom, fill, 0, linewidth, [0], shadow);
                    this.polygon(pyramidbottom, rgba(0, 0, 0, 0.5), 0, 0, [0], nullshadow);
                }
            }
            else {
                if ((scale < 0 && !side) || (side && width < 0)) {
                    this.polygon(pyramidbottom, fill, 0, linewidth, [0], shadow);
                    this.polygon(pyramidbottom, rgba(0, 0, 0, 0.5), 0, 0, [0], nullshadow);
                }
            }
            //pyramidside(this, fill);
            //pyramidside(this, rgba(255, 255, 255, 0.5));
        }
        else {
            var PHeightC = HeightFix(width, percentheight, areaC, true, bar, vertical),
                PHeightD = HeightFix(width, percentheight, areaC, false, bar, vertical),
                PWidthC = WidthFix(width, percentheight, areaC, true, bar, vertical),
                PWidthD = WidthFix(width, percentheight, areaC, false, bar, vertical)
            var heightpercenttotal = Percent(height, width);
            var percentcrop = topcrop / 100; //topcrop / 100

            var Ytopcropout = yB + ((percentheight - PHeightC) * percentcrop);
            var middlecropA = percentheight * percentcrop;
            var middlecropB = (width - PWidthC) * percentcrop;
            var pyramidwidthA, pyramidwidthB, pyramidlength, XcropA, XcropB, XcropCout, XcropC;

            if (abs(height) > abs(width)) {
                pyramidwidthA = 0;
                pyramidwidthB = width;
                pyramidwidthC = width * areaB;
                pyramidlength = yadd;
                XcropCout = xadd;
                XcropA = xB + (xadd - (middlecropB * 0.5));
                XcropB = xB + (xadd + (middlecropB * 0.5));
            }
            else {
                pyramidwidthA = xadd - (height * 0.5);
                pyramidwidthB = xadd + (height * 0.5);
                pyramidwidthC = xadd + ((height * areaB) * 0.5);
                pyramidlength = xadd;
                XcropCout = xadd - PWidthC;
                XcropA = xB + (xadd - (middlecropA * 0.5));
                XcropB = xB + (xadd + (middlecropA * 0.5) - (((height * areaA) * 0.5) * percentcrop));
            }
            XcropC = xB + xadd + (XcropCout * percentcrop);

            var pointdown = xB + pyramidwidthC;

            var pyramidcroptop = [];
            pyramidcroptop.push({ x: XcropB, y: yB + middlecropA });
            pyramidcroptop.push({ x: XcropC, y: Ytopcropout });
            pyramidcroptop.push({ x: XcropA, y: Ytopcropout });

            var pyramidfront = [];
            pyramidfront.push({ x: XcropB, y: yB + middlecropA });
            pyramidfront.push({ x: pointdown, y: yB + height });
            pyramidfront.push({ x: xB + pyramidwidthA, y: yB + HeightD });
            pyramidfront.push({ x: XcropA, y: Ytopcropout });
            
            var pyramidsidedynamic = [];
            pyramidsidedynamic.push({ x: XcropB, y: yB + middlecropA });
            pyramidsidedynamic.push({ x: XcropC, y: Ytopcropout });
            pyramidsidedynamic.push({ x: xB + pyramidwidthB, y: yB + HeightD });
            pyramidsidedynamic.push({ x: pointdown, y: ye });
            
            this.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);

            //crop top fill
            this.polygon(pyramidcroptop, fill, stroke, linewidth, [0], shadow);

            //front
            this.polygon(pyramidfront, fill, stroke, linewidth, [0], shadow);

            //side fill
            this.polygon(pyramidsidedynamic, fill, stroke, linewidth, [0], shadow);

            //side shade
            this.polygon(pyramidsidedynamic, "rgba(0, 0, 0, 0.5)", stroke, linewidth, [0], nullshadow);

            //crop top shade
            this.polygon(pyramidcroptop, "rgba(255, 255, 255, 0.5)", stroke, linewidth, [0], nullshadow);
        }
        this.restore();
    }

    //cone
    c.prototype.cone = function (x, y, width, height, area, rotate, stretch, percent3d, topcrop, percentheight, bar, side, scale, filltype, gradienttype, fill, stroke, linewidth, dash, shadow, Gout, option, i, ic) {
        Gout = Gout || 1;
        percent3d = percent3d || 100;
        topcrop = topcrop || 0;
        var conewidthA, conewidthB;
        stretch = stretch || false;
        side = side || false;
        var areaA = area / 100,
            areaB = 1 - areaA,
            areaC = areaA * 0.5,
            areaD = 1 - areaC;

        if (bar) {
            var data = option.data,
                stacked = option.stacked,
                percentstack = option.percentstack;

            var datainput = DataInput(data, i, ic);
        }

        if (stretch) {
            conewidthA = 0;
            conewidthB = width;
        }
        else {
            if (height > width) {
                conewidthA = 0;
                conewidthB = width;
            }
            else {
                conewidthA = (width * 0.5) - (height * 0.5);
                conewidthB = (width * 0.5) + (height * 0.5);
            }
        }
        
        var vertical;
        if (side) {
            var percentheight = (height) * ((100 - percent3d) / 100);
            vertical = false;
            height -= percentheight;
            y += (percentheight * 0.5);
        }
        else {
            var percentwidth = (width) * ((100 - percent3d) / 100);
            vertical = true;
            width -= percentwidth;
            x += (percentwidth * 0.5);
        }

        var xadd = width / 2;
        var yadd = height / 2;
        var xa = x + xadd;
        var ya = y + yadd;
        var xb = 0 - xadd;
        var yb = 0 - yadd;

        var xe = xb + width;
        var ye = yb + height
        dash = dash || [];
        rotate = rotate || 0;

        WidthA = WidthFix(width, height, areaA, true, bar, vertical);
        WidthB = WidthFix(width, height, areaA, false);
        WidthC = WidthFix(width, height, areaC, true);
        WidthD = WidthFix(width, height, areaC, false);

        HeightA = HeightFix(width, height, areaA, true, bar, vertical);
        HeightB = HeightFix(width, height, areaA, false, bar, vertical);
        HeightC = HeightFix(width, height, areaC, true);
        HeightD = HeightFix(width, height, areaC, false);

        this.save();
        this.translate(xa, ya);
        if (filltype == "color") {
            fillout = fill;
        }
        else if (filltype == "gradient") {
            var gradientx = (0 - (conewidthA * 1.25));
            var gradientwidth = conewidthB;//conelength;

            var gtypeout = gradienttype.toString().toLowerCase();

            //var gradientx = (x - (width * 0.75)) - conewidthA;
            //var gradientwidth = conewidthB;//conelength;

            switch (gtypeout) {
                case "linear a": fillout = this.GradientLinear(0, yb, gradientwidth, HeightB, fill, 0, false, false); break
                case "linear b": fillout = this.GradientLinear(0, yb, gradientwidth, HeightB, fill, 0, true, false); break
                case "linear c": fillout = this.GradientLinear(gradientx, 0, gradientwidth, HeightB, fill, 0, true, true); break
                case "linear d": fillout = this.GradientLinear(gradientx, 0, gradientwidth, HeightB, fill, 0, false, true); break
                case "linear e": fillout = this.GradientLinear(gradientx, yb, gradientwidth, HeightB, fill, 0, false, true, true); break
                case "linear f": fillout = this.GradientLinear(gradientx, yb, gradientwidth, HeightB, fill, 0, true, true, true); break
                case "linear g": fillout = this.GradientLinear(gradientx, yb, gradientwidth, HeightB, fill, 0, false, false, true); break
                case "linear h": fillout = this.GradientLinear(gradientx, yb, gradientwidth, HeightB, fill, 0, true, false, true); break
                case "radial": fillout = this.GradientCircle(0, yb, height / 5, 0, yb, height, fill); break
            }
        }
        this.fillStyle = fillout;
        this.strokeStyle = stroke;
        this.rotate(toRadians(angleresult(rotate)));

        var areaarc = HeightA//height * areameasure;
        var areaarcH = WidthA;
        var arcwidth = width * 0.1;
        var conewidthsum = conewidthA + conewidthB,
            conewidthdiff = conewidthB - conewidthA;
        this.beginPath();
        if (side) {
            this.moveTo(xb + width, yb + yadd);
            this.lineTo(xb + areaarcH, yb + height);
            for (var i = 0.5 * PI; i < 1.5 * PI; i += 0.01) {
                xPos = (xb + areaarcH) - ((areaarcH * 0.5) * sin(i)) * sin(0 * PI) + ((areaarcH * 0.5) * cos(i)) * cos(0 * PI);
                yPos = (yb + yadd) + (yadd * cos(i)) * sin(0 * PI) + (yadd * sin(i)) * cos(0 * PI);
                this.lineTo(xPos, yPos);
            }
        }
        else {
            if (stretch) {
                var Yplus;
                if (scale < 0) {
                    Yplus = yb;
                }
                else {
                    if (height >= 0) {
                        Yplus = yb - areaarc;
                    }
                    else {
                        Yplus = yb + areaarc;
                    }
                }

                var arcstart = toRadians(180 + rotate), // PI
                    arcend = toRadians(360 + rotate); // 2 * PI
                this.moveTo(xb + xadd, yb + height);
                this.lineTo(xb, Yplus);
                for (var i = arcstart; i < arcend; i += 0.01) {
                    xPos = (xb + xadd) - (xadd * sin(i)) * sin(toRadians(rotate)) + (xadd * cos(i)) * cos(toRadians(rotate));
                    yPos = (Yplus) + (areaarc * cos(i)) * sin(toRadians(rotate)) + (areaarc * sin(i)) * cos(toRadians(rotate));
                    this.lineTo(xPos, yPos);
                }
            }
            else {
                var xtopcropA = (xb + xadd) + ((percentheight * 0.5) * (topcrop / 100));
                var xtopcropB = (xb + xadd) - ((percentheight * 0.5) * (topcrop / 100));
                var ytopcrop = yb + ((percentheight - HeightA) * (topcrop / 100));
                this.moveTo(xtopcropA, ytopcrop);
                this.lineTo(xb + conewidthB, yb + HeightB);
                this.quadraticCurveTo(xb + conewidthB, ye, xb + xadd, ye);
                this.quadraticCurveTo(xb + conewidthA, ye, xb + conewidthA, yb + HeightB);
                this.lineTo(xtopcropB, ytopcrop);
                //this.quadraticCurveTo(xb + conewidthB, ytopcrop, xb + xadd, ytopcrop);
                //this.quadraticCurveTo(xb + conewidthA, ytopcrop, xb + conewidthA, ytopcrop + HeightA);
                //this.lineTo(xtopcropA, ytopcrop);

            }
        }
        //this.save();
        //if (!side && !stretch)
        //    OvalTB(this, xb, yb + HeightB, conewidthdiff, (percentheight - HeightA), area * 2, rgba(0, 0, 0, 0.5), stroke, linewidth, dash, nullshadow, vertical);
        //this.restore();
        this.save();
        this.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
        this.fill();
        this.restore();
        this.closePath();
        this.lineWidth = linewidth;
        this.setLineDash(dash);
        if (linewidth > 0) this.stroke();
        //this.closePath();

        if (bar) {
            if (stacked || percentstack) {
                if (datainput < 0 && Gout == 1) {
                    OvalTB(this, parseInt(xb + (areaarc)) - 0.5, parseInt(yb), parseInt(width) + 1, parseInt(height) - 1, area * 2, rgba(0, 0, 0, 0.5), stroke, linewidth, dash, nullshadow, vertical);
                }
            }
            else {
                if (vertical){
                    if (scale < 0) OvalTB(this, parseInt(xb) - 0.5, parseInt(yb - (areaarc * 0.5)), parseInt(width) + 1, parseInt(height) - 1, area * 2, rgba(0, 0, 0, 0.5), stroke, linewidth, dash, nullshadow, vertical);
                }
                else{
                    if (width < 0) OvalTB(this, parseInt(xb - (areaarc)) - 0.5, parseInt(yb - (areaarc * 0.5)), parseInt(width) + 1, parseInt(height) - 1, area * 2, rgba(0, 0, 0, 0.5), stroke, linewidth, dash, nullshadow, vertical);
                }
            }
        }
        this.restore();
    }

    //cylinder
    c.prototype.cylinder = function (x, y, width, height, area, bar, vertical, scale, fill, stroke, linewidth, dash, shadow, chart, option, ic, i, group, Garray) {
        shadow = shadow || nullshadow;
        bar = bar || false;
        vertical = vertical || false;
        var conewidthA, conewidthB;
        //percentage = percentage || 100;
        if (chart != "cylinder") {
            group = group || 1;
            var Gout = Garray[ic - 1];
            var Glength = MaxArray(Garray);
            var stacked = option.stacked,
                percentstack = option.percentstack,
                ObjectData = option.ObjectData,
                barpercent = option.barpercent,
                data = option.data;

            var datainput = NaNCheck(DataInput(data, i, ic));

            var valueuptotal = ValueTotal(option, chart, "up"),
                valuedowntotal = ValueTotal(option, chart, "down");

            var group3D = group3dstack(option, i);

        }

        stacked = stacked || false;
        var areaA = area / 100,
            areaB = 1 - areaA;
        if (height > width) {
            conewidthA = 0;
            conewidthB = width;
        }
        else {
            conewidthA = (width * 0.5) - (height * 0.5);
            conewidthB = (width * 0.5) + (height * 0.5);
        }
        WidthA = WidthFix(width, height, areaA, true, bar, vertical);
        WidthB = WidthFix(width, height, areaA, false, bar, vertical);
        //HeightA = HeightFix(width, height, areaA, true, bar, vertical);
        //HeightB = HeightFix(width, height, areaA, false, bar, vertical);

        var xadd = width / 2,
            yadd = height / 2;

        var xA = x + xadd, yA = y + yadd,
            xB = 0 - xadd, yB = 0 - yadd;

        var areameasure = 0.5;
        function maincylinder(c, x, y, width, height, area, bar, vertical, scale, fill, stroke, linewidth, dash, shadow, Gout) {
            var areaA = area / 100,
                areaB = 1 - areaA;
            HeightA = HeightFix(width, height, areaA, true, bar, vertical);
            HeightB = HeightFix(width, height, areaA, false, bar, vertical);
            var areaarc = (width * areaA) * areameasure;

            WidthA = WidthFix(width, height, areaA, true, bar, vertical);
            WidthB = WidthFix(width, height, areaA, false, bar, vertical);
            //WidthA = height * areaA;
            var areaarcH = height * areaA;

            c.save();
            c.fillStyle = fill;
            c.strokeStyle = stroke;
            c.beginPath();
            //var start

            var angleTS, angleTE, angleBS, angleBE;
            angleTS = 180;
            angleBS = 0,
            angleBE = 180;
            if (bar) {
                if (scale > 0) {
                    if (Gout > 1) {
                        angleTE = angleTS - 180;
                    }
                    else {
                        angleTE = angleTS + 180;
                    }

                }
                else {
                    angleTE = angleTS + 180;
                }
            }
            else {
                angleTE = angleTS + 180;
            }
            var topstart = toRadians(angleTS) * 0.5,
                topend = toRadians(angleTE) - topstart,
                bottomstart = toRadians(angleBS) * 0.5,
                bottomend = toRadians(angleBE) - bottomstart;

            function arcdraw(c, x, y, start, end, xarc, yarc, invert, rev) {
                var xPosA = function (x, start, i) { return (x) - (xarc * sin(i)) * sin(start) + (xarc * cos(i)) * cos(start) },
                    yPosA = function (y, start, i) { return (y) + (yarc * cos(i)) * sin(start) + (yarc * sin(i)) * cos(start) };
                invert = invert || false;
                rev = rev || false;
                var arcin, arcout;
                if (rev) {
                    arcin = end;
                    arcout = start;
                }
                else {
                    arcin = start;
                    arcout = end;
                }
                
                if (invert) {
                    for (var i = arcin; i > arcout; i -= 0.01) {
                        xPos = xPosA(x, arcin, i);
                        yPos = yPosA(y, arcin, i);
                        c.lineTo(xPos, yPos);
                    }
                }
                else {
                    for (var i = arcin; i < arcout; i += 0.01) {
                        xPos = xPosA(x, arcin, i);
                        yPos = yPosA(y, arcin, i);
                        c.lineTo(xPos, yPos);
                    }
                }
            }
            if (bar) {
                if (vertical) {
                    var widthbar = width - (areaarc * 4);
                    var bararcH = areaarc //* 3;

                    var bararc;
                    if (scale > 0) {
                        bararc = -areaarc
                    }
                    else {
                        bararc = areaarc;
                    }
                    xout = x + (areaarc * 2) + (widthbar * 0.5);
                    yout = y + (bararc);
                    if (Gout > 1) {
                        yout -= 1;
                    }
                    xarc = ((width - (bararcH * 2)) * 0.5);
                    yarc = areaarc;

                    c.moveTo(x + bararcH, y + (bararc * 2));
                    var invert;
                    if (scale > 0) {
                        if (Gout == 1) {
                            invert = false;
                        }
                        else{
                            invert = true;
                        }
                    }
                    else {
                        invert = false;
                    }
                    arcdraw(c, xout, yout, topstart, topend, xarc, yarc, invert, false, null);
                    c.lineTo(x + (width - bararcH), yout);
                    c.lineTo(x + (width - bararcH), yout + height);
                    arcdraw(c, xout, yout + height, bottomstart, bottomend, xarc, yarc, false, false);
                    c.lineTo(x + bararcH, yout);
                }
                else {
                    var leftstart, leftend, rightstart, rightend;
                    var bararc, heightbar;
                    var xstart, xend;
                    var angleRS, angleRE;
                    if (width >= 0) {
                        heightbar = height - areaarcH;
                        leftstart = toRadians(90) * 0.5,
                        leftend = toRadians(270) - leftstart;
                        angleRS = 270;
                        if (stacked || percentstack) {
                            if (valuedowntotal > valueuptotal) {
                                if (valuedowntotal == data.length) {
                                    x;
                                }
                                else {
                                    if (datainput < 0) x += areaarcH;
                                }
                            }
                            else {
                                if (valueuptotal == data.length) {
                                    x
                                }
                                else {
                                    if (datainput > 0) x -= areaarcH;
                                }
                            }

                            if (Gout == 1) {
                                angleRE = angleRS - 180;
                                xstart = x + (areaarcH * 0.75)
                                xend = x + (width);
                            }
                            else if (Gout > 1 && Gout < Glength) {
                                angleRE = angleRS + 180;
                                xstart = x + (areaarcH * 0.75)
                                xend = x + (width - areaarcH);
                            }
                            else {
                                angleRE = angleRS + 180;
                                xstart = x + (areaarcH * 0.75)
                                xend = x + (width - areaarcH);
                            }
                        }
                        else {
                            angleRE = angleRS + 180;
                            xstart = x + (areaarcH * 0.5)
                            xend = xstart + (width) - (areaarcH);
                            if(xend < (xstart + (areaarcH * 0.5))) xend = (xstart + (areaarcH * 0.5));
                        }
                        rightstart = toRadians(angleRS) * 0.5;
                        rightend = toRadians(angleRE) - rightstart;
                        c.moveTo(xstart, y + (areaarcH * 0.5));
                        c.lineTo(xend, y + (areaarcH * 0.5));

                        var invertarc;
                        if (stacked || percentstack) {
                            if (Gout == 1) {
                                invertarc = true;
                            }
                            else if (Gout > 1 && Gout < Glength) {
                                invertarc = true;
                            }
                            else {
                                invertarc = false;
                            }
                            //if (group == 1) {
                            //    if (ic == ObjectData.length) {
                            //        invertarc = false;
                            //    }
                            //    else if (ic < ObjectData.length && ic > 1) {
                            //        invertarc = false;
                            //    }
                            //    else {
                            //        invertarc = true;
                            //    }
                            //}
                            //else if (group > 1 && group < MaxArray(group3D)) {
                            //    invertarc = true;
                            //}
                            //else {
                            //    invertarc = false;
                            //}
                        }
                        else {
                            invertarc = false;
                        }
                        arcdraw(c, xend, y + (height * 0.5), rightstart, rightend, (areaarcH * 0.5), (heightbar * 0.5), invertarc, false);
                        c.lineTo(xstart, y + (height - (areaarcH * 0.5)));
                        arcdraw(c, xstart, y + (height * 0.5), leftstart, leftend, (areaarcH * 0.5), (heightbar * 0.5), false, false);
                    }
                    else {
                        heightbar = height - areaarcH;
                        var angleLS, angleLE;
                        angleLS = 90;
                        angleRS = 270;
                        angleRE = angleRS + 180;
                        if (stacked || percentstack) {
                            if (valuedowntotal > valueuptotal) {
                                if (valuedowntotal == data.length) {
                                    x
                                }
                                else {
                                    if (datainput < 0) x += areaarcH;
                                }
                            }
                            else {
                                if (valueuptotal == data.length) {
                                    x
                                }
                                else {
                                    if (datainput > 0) x -= areaarcH;
                                }
                            }
                            xend = x + (width + (areaarcH * 0.5));
                            if (group == -1) {
                                if (ic == 1) {
                                    xstart = x - (areaarcH * 0.5);
                                    angleLE = angleLS + 180;
                                }
                                else {
                                    xstart = x - (areaarcH * 0.5);
                                    angleLE = angleLS - 180;
                                }
                            }
                            else if (group < -1 && group > MinArray(group3D)) {
                                xstart = x + (areaarcH * 0.5);
                                angleLE = angleLS - 180;
                            }
                            else if (group == MinArray(group3D)) {
                                if (ic == ObjectData.length) {
                                    xstart = x + (areaarcH * 0.5);
                                    angleLE = angleLS - 180;
                                }
                                else {
                                    xstart = x + (areaarcH * 0.5);
                                    angleLE = angleLS - 180;
                                }
                            }
                        }
                        else {
                            if (valuedowntotal > valueuptotal) {
                                if (valuedowntotal == data.length) {
                                    x
                                }
                                else {
                                    if (datainput < 0) x += areaarcH;
                                }
                            }
                            else {
                                if (valueuptotal == data.length) {
                                    x
                                }
                                else {
                                    if (datainput > 0) x -= areaarcH;
                                }
                            }
                            xstart = x - (areaarcH * 0.5);
                            xend = x + (width - (areaarcH * 0.5));
                            angleLE = angleLS + 180;
                        }
                        leftstart = toRadians(angleLS) * 0.5;
                        leftend = toRadians(angleLE) - leftstart;
                        rightstart = toRadians(angleRS) * 0.5;
                        rightend = toRadians(angleRE) - rightstart;
                        c.moveTo(xstart, y + (areaarcH * 0.5));
                        c.lineTo(xend, y + (areaarcH * 0.5));
                        arcdraw(c, xend, y + (height * 0.5), rightstart, rightend, (areaarcH * 0.5), (heightbar * 0.5), true, true);
                        c.lineTo(xstart, y + (height - (areaarcH * 0.5)));
                        if (stacked || percentstack) {
                            if (group == -1) {
                                if (ic == 1) {
                                    invertarc = true;
                                }
                                else {
                                    invertarc = false;
                                }
                            }
                            else if (group < -1 && group > MinArray(group3D)) {
                                invertarc = true;
                            }
                            else {
                                if (ic == ObjectData.length) {
                                    invertarc = false;
                                }
                                else {
                                    invertarc = false;
                                }
                            }
                        }
                        else {
                            invertarc = true;
                        }
                        arcdraw(c, xstart, y + (height * 0.5), leftstart, leftend, (areaarcH * 0.5), (heightbar * 0.5), invertarc, true);
                    }
                }
            }
            else {
                var bararc = areaarc;
                var bararcH = areaarc;
                xarc = ((width - (bararcH * 2)) * 0.5);
                yarc = areaarc;
                yout = y //+ (bararc);
                c.moveTo(x, y);
                var xPosA = function (x, start, j) { return (x + (width * 0.5)) - ((width * 0.5) * sin(j)) * sin(start) + ((width * 0.5) * cos(j)) * cos(start); }
                var yPosA = function (y, start, j) { return (y) + ((areaarc * 0.5) * cos(j)) * sin(start) + ((areaarc * 0.5) * sin(j)) * cos(start); }
                for (var j = topstart; j < topend; j += 0.01) {
                    xPos = xPosA(x, topstart, j);
                    yPos = yPosA(y, topstart, j);
                    c.lineTo(xPos, yPos);
                }
                c.lineTo(x + (width), y);
                c.lineTo(x + (width), y + height);
                for (var j = bottomstart; j < bottomend; j += 0.01) {
                    xPosBottom = xPosA(x, bottomstart, j);
                    yPosBottom = yPosA(y + height, bottomstart, j);
                    c.lineTo(xPosBottom, yPosBottom);
                }
                c.lineTo(x, y);
            }


            c.lineWidth = linewidth;
            c.setLineDash(dash);
            c.save();
            c.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
            c.fill();
            c.restore();
            if (linewidth > 0)
                c.stroke();
            c.closePath();
            c.restore();
        }
        this.save();
        this.translate(xA, yA);
        var barpercentout, areaout;
        if (chart != "cylinder" && chart == "horizontalbar"){
            barpercentout = (height * (1 - (barpercent / 100))) + (height * areaA);
            areaout = area * 2;
        }
        else if (chart == "cylinder"){
            barpercentout = 0;
            areaout = area;
        }
        else{
            barpercentout = 0;
            areaout = area * 2;
        }
        maincylinder(this, parseInt(xB) - 0.5, parseInt(yB), parseInt(width) + 1, parseInt(height) - 1, area, bar, vertical, scale, fill, stroke, linewidth, dash, shadow, Gout);
        var topX, topY , widthout, pointout;
        if (bar) {
            if (vertical) {
                var areaarc = (width * areaA) * areameasure;
                var barout, yout;
                if (scale > 0) {
                    yout = yB - areaarc;
                    barout = -areaarc
                    pointout = -1.5;
                }
                else {
                    yout = yB + (height + areaarc);
                    barout = areaarc;
                    pointout = 1.5;
                }
                topX = xB + (areaarc);
                topY = yout;
                widthout = width - (areaarc * 2);
            }
            else {
                var areaarc = (height * areaA) * areameasure;
                if (width >= 0) {
                    if (valuedowntotal > valueuptotal) {
                        if (valuedowntotal == data.length) {
                            xB
                        }
                        else {
                            xB //-= areaarc
                        }
                    }
                    else {
                        if (valueuptotal == data.length) {
                            xB
                        }
                        else {
                            xB //-= areaarc 
                        }
                    }
                    topX = (xB + width - (area * 0.25))//+ ((height /* areaA*/) * 0.5)//+ (width + (areaarc * 2));
                    topY = yB;
                    widthout = width;
                }
                else {
                    if (valuedowntotal > valueuptotal) {
                        if (valuedowntotal == data.length) {
                            xB
                        }
                        else {
                            if (datainput < 0) xB += areaarc;
                        }
                    }
                    else {
                        if (valueuptotal == data.length) {
                            xB
                        }
                        else {
                            if (datainput > 0) xB -= areaarc;
                        }
                    }
                    if (group == 1) {
                        topX = xB - (areaarc * 1.5);
                    }
                    else if (group < 1 && group > MinArray(group3D)) {
                        topX = xB + (areaarc * 1.5);
                    }
                    else {
                        topX = xB + (areaarc * 1.5);
                    }
                    topY = yB;
                    widthout = width //- areaarc;
                }
                pointout = 0.5;
            }
        }
        else {
            var areaarc = (width * areaA) * areameasure;
            pointout = 0.5;
            topX = xB;
            topY = yB;
            widthout = width;
        }
        if ((!stacked && !percentstack)
            || ((stacked || percentstack) && (vertical && ((datainput >= 0) || (datainput < 0 && Gout == 1))) || (!vertical && ((datainput >= 0 && Gout == Garray) || (datainput < 0 && group == -1 && Gout == 1))))
            //|| (stacked && group == MaxArray(group3D))
            ) OvalTB(this, parseInt(topX) - 0.5, parseInt(topY + parseInt(barpercentout * 0.5)) + pointout, parseInt(widthout) + 1, parseInt(height - barpercentout) + 1, areaout, rgba(0, 0, 0, 0.5), stroke, linewidth, dash, nullshadow, vertical);
        
        this.restore();
    }

    //rounded square
    c.prototype.roundsquare = function (x, y, area, radius, width, fill, stroke, shadow) {
        this.lineWidth = width;
        this.fillStyle = fill;
        this.strokeStyle = stroke;
        this.save();
        this.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
        this.beginPath();
        area *= 1.9;
        x -= (area / 2);
        y -= (area / 2);
        var r = x + area;
        var b = y + area;
        this.moveTo(x + radius, y);
        this.lineTo(r - radius, y);
        this.quadraticCurveTo(r, y, r, y + radius);
        this.lineTo(r, y + area - radius);
        this.quadraticCurveTo(r, b, r - radius, b);
        this.lineTo(x + radius, b);
        this.quadraticCurveTo(x, b, x, b - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
        if (width > 0) this.stroke();
        this.fill();
        this.restore();
        if (width > 0) this.stroke();
    }

    //rectangle
    c.prototype.rectangle = function (x, y, width, height, rotate, linewidth, fill, stroke, dash, shadow) {
        fill = fill || "black";
        stroke = stroke || "black"
        linewidth = linewidth || 0
        shadow = shadow || nullshadow;
        var xadd = width / 2;
        var yadd = height / 2;
        var xa = x + xadd;
        var ya = y + yadd;
        var xb = 0 - xadd;
        var yb = 0 - yadd;
        dash = dash || [0];
        rotate = rotate || 0;
        this.fillStyle = fill;
        this.strokeStyle = stroke;
        this.save();
        this.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
        this.translate(xa, ya);
        this.rotate(toRadians(angleresult(rotate)));
        this.beginPath();
        this.rect(xb, yb, width, height);
        if (linewidth > 0) this.stroke();
        this.fill();
        this.restore();
        this.lineWidth = linewidth;
        this.setLineDash(dash);
        this.closePath();
        if (linewidth > 0) this.stroke();
    }

    //rectangle
    c.prototype.roundedrectangle = function (x, y, width, height, area, rotate, linewidth, fill, stroke, dash, shadow) {
        var areaA = area / 100,
            areaB = 1 - areaA,
            areaC = areaA * 0.5,
            areaD = 1 - areaC,
            xadd = width / 2,
            yadd = height / 2,
            xa = x + xadd,
            ya = y + yadd,
            xb = 0 - xadd,
            yb = 0 - yadd,
            xe = xb + width,
            ye = yb + height,
            WidthC = WidthFix(width, height, areaC, true),
            WidthD = WidthFix(width, height, areaC, false),
            HeightC = HeightFix(width, height, areaC, true),
            HeightD = HeightFix(width, height, areaC, false);

        dash = dash || [];
        rotate = rotate || 0;
        this.fillStyle = fill;
        this.strokeStyle = stroke;
        this.save();
        this.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
        this.translate(xa, ya);
        this.rotate(toRadians(angleresult(rotate)));
        this.beginPath();
        this.moveTo(xb + WidthC, yb);
        this.lineTo(xb + WidthD, yb);
        this.quadraticCurveTo(xe, yb, xe, yb + HeightC);
        this.lineTo(xe, yb + HeightD);
        this.quadraticCurveTo(xe, ye, xb + WidthD, ye);
        this.lineTo(xb + WidthC, ye);
        this.quadraticCurveTo(xb, ye, xb, yb + HeightD);
        this.lineTo(xb, yb + HeightC);
        this.quadraticCurveTo(xb, yb, xb + WidthC, yb);
        if (linewidth > 0) this.stroke();
        this.fill();
        this.restore();
        this.lineWidth = linewidth;
        this.setLineDash(dash);
        this.closePath();
        if (linewidth > 0) this.stroke();
    }

    //Bevel Bar
    c.prototype.bevelbar = function (value, x, y, width, height, linewidth, fill, stroke, chart, shadow) {
        this.save();
        this.fillStyle = fill;
        this.fillRect(
            parseInt(x) - 0.5
            , parseInt(y) - 0.5
            , parseInt(width) + 1
            , parseInt(height) + 1
            );
        this.restore();
        var area = (0.5) / 2,
            dash = [0],
            areaC = area,
            areaD = 1 - areaC;

        var bvA = 0.2,
            bvB = 1 - bvA;

        var WidthUp = width - height,
            HeightUp = height - width,
            WidthHeight = width + height;

        if (height >= width) {
            if (width >= 0) {
                WidthC = width * areaC,
                WidthD = width * areaD;
            }
            else {
                if (abs(width) <= abs(height)) {
                    WidthC = width * areaC,
                    WidthD = width * areaD;
                }
                else {
                    WidthC = (height * areaC) * -1,
                    WidthD = (width * areaD) + (WidthHeight * areaC);
                }
            }
        }
        else if (height < width) {
            /*if (height > 0) {
                WidthC = height * areaC,
                WidthD = (width * areaD) + (WidthUp * areaC);
            }
            else {
                if (abs(width) <= abs(height)) {
                    WidthC = width * areaC,
                    WidthD = width * areaD;
                }
                else {
                    WidthC = (height * areaC) * -1,
                    WidthD = (width * areaD) + ((height + width) * areaC);
                }
            }*/
            WidthC = height * areaC,
            WidthD = (width * areaD) + (WidthUp * areaC);
        }

        if (height > width) {
            if (width >= 0) {
                HeightC = width * areaC,
                HeightD = (height * areaD) + (HeightUp * areaC);
            }
            else {
                if (abs(width) <= abs(height)) {
                    HeightC = abs(width) * areaC;
                    HeightD = (height * areaD) + ((height + width) * areaC);
                }
                else {
                    HeightC = height * areaC;
                    HeightD = height * areaD;
                }
            }
        }
        else if (height <= width) {
            HeightC = height * areaC,
            HeightD = height * areaD;
        }

        function topbevel(c, fill, stroke, linewidth, dash) {
            c.save();
            c.beginPath();
            c.fillStyle = fill;
            c.moveTo(parseInt(x) - 0.5, parseInt(y) - 0.5);
            c.lineTo(parseInt(x + width) - 0.5, parseInt(y) - 0.5);
            c.lineTo(parseInt(x + WidthD) + 0.5, parseInt(y + HeightC) - 0.5);
            c.lineTo(parseInt(x + WidthC) - 0.5, parseInt(y + HeightC) - 0.5);
            c.lineTo(parseInt(x) - 0.5, parseInt(y) - 0.5);
            c.fillStyle = fill;
            c.strokeStyle = stroke;
            c.fill();
            c.lineWidth = linewidth;
            c.lineJoin = "bevel";
            c.setLineDash(dash);
            if (linewidth > 0) c.stroke();
            c.closePath();
            c.restore();
        }

        function rightbevel(c, fill, stroke, linewidth, dash) {
            c.save();
            c.beginPath();
            c.moveTo(parseInt(x + width) + 0.5, parseInt(y) - 0.5);
            c.lineTo(parseInt(x + width) + 0.5, parseInt(y + height) + 0.5);
            c.lineTo(parseInt(x + WidthD) + 0.5, parseInt(y + HeightD) + 0.5);
            c.lineTo(parseInt(x + WidthD) + 0.5, parseInt(y + HeightC) - 0.5);
            c.lineTo(parseInt(x + width) + 0.5, parseInt(y) + 0.5);
            c.fillStyle = fill;
            c.strokeStyle = stroke;
            c.fill();
            c.lineWidth = linewidth;
            c.lineJoin = "bevel";
            c.setLineDash(dash);
            if (linewidth > 0) c.stroke();
            c.closePath();
            c.restore();
        }

        function bottombevel(c, fill, stroke, linewidth, dash) {
            c.save();
            c.beginPath();
            c.moveTo(parseInt(x) - 0.5, parseInt(y + height) + 0.5);
            c.lineTo(parseInt(x + width) + 0.5, parseInt(y + height) + 0.5);
            c.lineTo(parseInt(x + WidthD) + 0.5, parseInt(y + HeightD) + 0.5);
            c.lineTo(parseInt(x + WidthC) - 0.5, parseInt(y + HeightD) + 0.5);
            c.lineTo(parseInt(x) - 0.5, parseInt(y + height) + 0.5);
            c.fillStyle = fill;
            c.strokeStyle = stroke;
            c.fill();
            c.lineWidth = linewidth;
            c.lineJoin = "bevel";
            c.setLineDash(dash);
            if (linewidth > 0) c.stroke();
            c.closePath();
            c.restore();
        }

        function leftbevel(c, fill, stroke, linewidth, dash) {
            c.save();
            c.beginPath();
            c.moveTo(parseInt(x) - 0.5, parseInt(y) - 0.5);
            c.lineTo(parseInt(x) - 0.5, parseInt(y + height) + 0.5);
            c.lineTo(parseInt(x + WidthC) - 0.5, parseInt(y + HeightD) + 0.5);
            c.lineTo(parseInt(x + WidthC) - 0.5, parseInt(y + HeightC) - 0.5);
            c.lineTo(parseInt(x) - 0.5, parseInt(y) - 0.5);
            c.fillStyle = fill;
            c.strokeStyle = stroke;
            c.fill();
            c.lineWidth = linewidth;
            c.lineJoin = "bevel";
            c.setLineDash(dash);
            if (linewidth > 0) c.stroke();
            c.closePath();
            c.restore();
        }

        if (chart == "barline") {
            var leftshade = "rgba(255,255,255,0.50)",
                rightshade = "rgba(0,0,0,0.25)";

            if (value > 0) {
                var bottomshade = "rgba(255,255,255,0.50)",
                    topshade = "rgba(0,0,0,0.25)";
            }
            else {
                var topshade = "rgba(255,255,255,0.25)",
                    bottomshade = "rgba(0,0,0,0.50)";
            }
        }
        else {
            var topshade = "rgba(255,255,255,0.25)",
                bottomshade = "rgba(0,0,0,0.50)";

            if (value > 0) {
                leftshade = "rgba(255,255,255,0.50)",
                rightshade = "rgba(0,0,0,0.25)";
            }
            else {
                leftshade = "rgba(0,0,0,0.25)",
                rightshade = "rgba(255,255,255,0.50)";
            }
        }

        topbevel(this, topshade, stroke, 0, dash);
        leftbevel(this, leftshade, stroke, 0, dash);
        rightbevel(this, rightshade, stroke, 0, dash);
        bottombevel(this, bottomshade, stroke, 0, dash);

        if (chart == "barline") this.drawbar(x, y, width, height, linewidth, rgba(0, 0, 0, 0), stroke, shadow);
        else if (chart == "horizontalbar") this.drawhbar(x, y, width, height, linewidth, rgba(0, 0, 0, 0), stroke, shadow);
    }

    c.prototype.bevelmarker = function (x, y, rotate, area, linewidth, fill, stroke, dash, shadow) {
        dash = dash || [];
        rotate = rotate || 0;
        area *= 2;
        var width = area,
            height = area;
        x -= (area / 2);
        y -= (area / 2);
        this.save();
        this.beginPath();

        this.save();
        this.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
        this.fillStyle = fill;
        this.fillRect(
            parseInt(x) + 0.5
            , parseInt(y) + 0.5
            , parseInt(width) - 1
            , parseInt(height) - 1
            );
        this.restore();

        var bvA = 0.5,
            bvB = 1 - bvA;
        var WidthA, WidthB;
        var HeightA, HeightB;

        if (height > width) {
            WidthA = width * bvA;
            WidthB = width * bvB;

            HeightA = width * bvA;
            HeightB = (height * bvB) + ((height - width) * bvA);
        }
        else if (height < width) {
            WidthA = height * bvA;
            WidthB = (width * bvB) + ((width - height) * bvA);

            HeightA = height * bvA;
            HeightB = height * bvB;
        }
        else {
            WidthA = width * bvA;
            WidthB = width * bvB;

            HeightA = height * bvA;
            HeightB = height * bvB;
        }

        function topbevel(c, fill, stroke, linewidth, dash) {
            c.save();
            c.beginPath();
            c.fillStyle = fill;
            c.moveTo(parseInt(x) + 0.5, parseInt(y) + 0.5);
            c.lineTo(parseInt(x + width) - 0.5, parseInt(y) + 0.5);
            c.lineTo(parseInt(x + WidthB) - 0.5, parseInt(y + HeightA) + 0.5);
            c.lineTo(parseInt(x + WidthA) + 0.5, parseInt(y + HeightA) + 0.5);
            c.lineTo(parseInt(x) + 0.5, parseInt(y) + 0.5);
            c.fillStyle = fill;
            c.strokeStyle = stroke;
            c.fill();
            c.lineWidth = linewidth;
            c.lineJoin = "bevel";
            c.setLineDash(dash);
            //if (linewidth > 0) c.stroke();
            c.closePath();
            c.restore();
        }

        function rightbevel(c, fill, stroke, linewidth, dash) {
            c.save();
            c.beginPath();
            c.moveTo(parseInt(x + width) - 0.5, parseInt(y) + 0.5);
            c.lineTo(parseInt(x + width) - 0.5, parseInt(y + height) - 0.5);
            c.lineTo(parseInt(x + WidthB) - 0.5, parseInt(y + HeightB) - 0.5);
            c.lineTo(parseInt(x + WidthB) - 0.5, parseInt(y + HeightA) + 0.5);
            c.lineTo(parseInt((x + width)) - 0.5, parseInt(y) + 0.5);
            c.fillStyle = fill;
            c.strokeStyle = stroke;
            c.fill();
            c.lineWidth = linewidth;
            c.lineJoin = "bevel";
            c.setLineDash(dash);
            //if (linewidth > 0) c.stroke();
            c.closePath();
            c.restore();

        }

        function bottombevel(c, fill, stroke, linewidth, dash) {
            c.save();
            c.beginPath();
            c.moveTo(parseInt(x) + 0.5, parseInt(y + height) - 0.5);
            c.lineTo(parseInt(x + width) - 0.5, parseInt(y + height) - 0.5);
            c.lineTo(parseInt(x + WidthB) - 0.5, parseInt(y + HeightB) - 0.5);
            c.lineTo(parseInt(x + WidthA) + 0.5, parseInt(y + HeightB) - 0.5);
            c.lineTo(parseInt(x) + 0.5, parseInt(y + height) - 0.5);
            c.fillStyle = fill;
            c.strokeStyle = stroke;
            c.fill();
            c.lineWidth = linewidth;
            c.lineJoin = "bevel";
            c.setLineDash(dash);
            //if (linewidth > 0) c.stroke();
            c.closePath();
            c.restore();
        }

        function leftbevel(c, fill, stroke, linewidth, dash) {
            c.save();
            c.beginPath();
            c.moveTo(parseInt(x) + 0.5, parseInt(y) + 0.5);
            c.lineTo(parseInt(x) + 0.5, parseInt(y + height) - 0.5);
            c.lineTo(parseInt(x + WidthA) + 0.5, parseInt(y + HeightB) - 0.5);
            c.lineTo(parseInt(x + WidthA) + 0.5, parseInt(y + HeightA) + 0.5);
            c.lineTo(parseInt(x) + 0.5, parseInt(y) + 0.5);
            c.fillStyle = fill;
            c.strokeStyle = stroke;
            c.fill();
            c.lineWidth = linewidth;
            c.lineJoin = "bevel";
            c.setLineDash(dash);
            //if (linewidth > 0) c.stroke();
            c.closePath();
            c.restore();
        }

        topbevel(this, "rgba(255,255,255,0.25)", stroke, linewidth, dash);
        rightbevel(this, "rgba(0,0,0,0.25)", stroke, linewidth, dash);
        bottombevel(this, "rgba(0,0,0,0.50)", stroke, linewidth, dash);
        leftbevel(this, "rgba(255,255,255,0.50)", stroke, linewidth, dash);
        
        this.restore();
    }
    //Vertical Bar
    c.prototype.drawbar = function (x, y, width, height, linewidth, fill, stroke, shadow) {
        var add;
        width += x;
        height += y;
        if (linewidth > 0) add = 0.5;
        else add = 0;
        add += parseInt(linewidth / 2);
        this.fillStyle = fill;
        this.strokeStyle = stroke;
        this.save();
        this.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
        this.beginPath();
        this.moveTo(x + add, y);
        this.lineTo(x + add, height - add);
        this.lineTo(width - add, height - add);
        this.lineTo(width - add, y);
        this.fill();
        this.restore();
        this.lineWidth = linewidth;
        if (linewidth > 0) this.stroke();
    }

    //Horizontal Bar
    c.prototype.drawhbar = function (x, y, width, height, linewidth, fill, stroke, shadow) {
        var add;
        width += x;
        height += y;
        if (linewidth > 0) add = 0.5;
        else add = 0;
        add += (linewidth / 2);
        this.fillStyle = fill;
        this.strokeStyle = stroke;
        this.save();
        this.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
        this.beginPath();
        this.moveTo(x, y - add);
        this.lineTo(width + add, y - add);
        this.lineTo(width + add, height - add);
        this.lineTo(x, height - add);
        this.fill();
        this.restore();
        this.lineWidth = linewidth;
        if (linewidth > 0) this.stroke();
    }
    //arrow
    c.prototype.drawArrow = function (x, y, r, direction, area, width, fill, stroke, ID, shadow) {
        area *= 2;
        r = r || 0;
        var arrow = makeArrow(area * 2, area * 0.75, area * 0.75, area * 2.5, fill, stroke, width, ID);
        var Drotate;
        var xarrow = -arrow.width / 2,
            yarrow = -arrow.height / 2;
        xarrow -= 2.5;//(area * 0.25);
        switch (direction) {
            case "right":
                Drotate = 0;
                break
            case "down":
                Drotate = 90;
                break
            case "left":
                Drotate = 180;
                break
            case "up":
                Drotate = 270;
                break
        }
        var rotate = toRadians(r + Drotate);
        this.save();
        this.translate(x, y);
        this.rotate(rotate);
        this.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
        this.drawImage(arrow, xarrow, yarrow);
        this.restore();
    }
    c.prototype.drawArrowB = function (x, y, r, direction, area, linewidth, fill, stroke, ID, shadow) {
        area *= 1.5;
        r = r || 0;
        var arrow = makeArrow(area * 2.25, area * 0.6, area * 0.90, area * 1.25, fill, stroke, linewidth, ID);
        var Drotate;
        var xarrow = -arrow.width / 2,
            yarrow = -arrow.height / 2;
        xarrow -= 2.5;
        switch (direction) {
            case "right":
                Drotate = 0; break
            case "down":
                Drotate = 90; break
            case "left":
                Drotate = 180; break
            case "up":
                Drotate = 270; break
        }
        var rotate = toRadians(r + Drotate);
        this.save();
        this.translate(x, y);
        this.rotate(rotate);
        this.drawImage(arrow, xarrow, yarrow);
        this.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
        this.restore();
    }
    //Line Stick
    c.prototype.Stick = function (xa, ya, xb, yb) {
        this.moveTo(xa, ya + 0.5);
        this.lineTo(xb, yb + 0.5);
    }

    //Candlestick Marker
    c.prototype.candlestick = function (x, open, high, low, close, width, fillcolor, strokecolor, linewidth, shadow) {
        var base = parseInt(x) + 0.5;
        var rectX = parseInt(x) - (width / 2);
        var OCA, OCB, HLA, HLB;
        if (open < close) {
            OCA = open;
            OCB = close;
        }
        else {
            OCA = close;
            OCB = open;
        }
        this.fillStyle = fillcolor;
        this.strokeStyle = strokecolor;
        this.lineWidth = linewidth;
        this.save();
        this.beginPath();
        this.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
        this.fillRect(rectX, open, width, close - open);
        if (high < low) {
            if (OCA > high) this.Stick(base, high, base, OCA);
            else this.Stick(base, high, base, OCB);
            if (OCB < low) this.Stick(base, low, base, OCB);
            else this.Stick(base, low, base, OCA);
        }
        else {
            if (OCA > low) this.Stick(base, low, base, OCA);
            else this.Stick(base, low, base, OCB);
            if (OCB < high) this.Stick(base, high, base, OCB);
            else this.Stick(base, low, base, OCA);
        }
        if (width > 0) this.stroke();
        this.closePath();
        this.restore();
        this.beginPath();
        this.rect(rectX, open, width, close - open);
        this.fill();
        if (width > 0) this.stroke();
        this.closePath();
    }

    //OHLC Marker
    c.prototype.OHLCsign = function (x, open, high, low, close, width, strokecolor, linewidth, shadow) {
        var base = parseInt(x) + 0.5;
        var O = parseInt(open) + 0.5;
        var C = parseInt(close) + 0.5;
        width /= 2;
        this.strokeStyle = strokecolor;
        this.lineWidth = linewidth;
        this.save();
        this.beginPath();
        this.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
        this.Stick(base, high, base, low);
        this.Stick(parseInt(x) - width, O, parseInt(x), O);
        this.Stick(parseInt(x), C, parseInt(x) + width, C);
        if (width > 0) this.stroke();
        this.restore();
    }

    //Markers
    c.prototype.Markers = function (input, x, y, area, lweight, fill, stroke, scale, ID, shadow) {
        //input = input.toString().toLowerCase();
        this.save();
        this.scale(1, scale);
        y *= scale;
        switch (input) {
            case "circle": case "o":
                this.circle(x, y, area, lweight, fill, stroke, shadow); break
            case "triangle": case "^":
                this.shapeA(x, y + 1, 30, 3, area, lweight, fill, stroke, shadow); break
            case "itriangle": case "v":
                this.shapeA(x, y - 1, -30, 3, area, lweight, fill, stroke, shadow); break
            case "ltriangle": case "<":
                this.shapeA(x, y, -60, 3, area, lweight, fill, stroke, shadow); break
            case "rtriangle": case ">":
                this.shapeA(x, y, 0, 3, area, lweight, fill, stroke, shadow); break
            case "diamond": case "<>":
                this.shapeA(x, y, 0, 4, area, lweight, fill, stroke, shadow); break
            case "square": case "[]":
                this.shapeA(x, y, 45, 4, area, lweight, fill, stroke, shadow); break
            case "roundsquare":
                this.roundsquare(x, y, area, area / 4, lweight, fill, stroke, shadow); break
            case "cross": case "x": //case "X":
                this.shapeC(x, y, area + 1, 4, 4, 0, lweight, fill, shadow); break
                //shapeC(x, y, 4, area, lweight, fill, stroke, ctx, shadowinput); break
            case "plus": case "+":
                this.shapeC(x, y, area, 0, 4, 0, lweight, fill, shadow); break
                //shapeC(x, y, 4, area, lweight, fill, stroke, ctx, shadowinput); break
            case "star":
                this.shapeB(x, y, 5, area, lweight, fill, stroke, shadow); break
            case "pentagon": case "5":
                this.shapeA(x, y, -18, 5, area / 1.25, lweight, fill, stroke, shadow); break
            case "hexagon": case "6":
                this.shapeA(x, y, 0, 6, area / 1.25, lweight, fill, stroke, shadow); break
            case "octagon": case "8":
                this.shapeA(x, y, 22.5, 8, area / 1.25, lweight, fill, stroke, shadow); break
            case "asterisk": case "*":
                this.shapeC(x, y, area + 1, 0, 8, 0, lweight, fill, shadow); break
                //shapeC(x, y, 5, area, lweight, fill, stroke, this, shadow.x, shadow.y, shadow.blur, shadow.color); break
            case "up":
                this.drawArrow(x, y, 0, "up", area, lweight, fill, stroke, ID, shadow); break
            case "down":
                this.drawArrow(x, y, 0, "down", area, lweight, fill, stroke, ID, shadow); break
            case "left":
                this.drawArrow(x, y, 0, "left", area, lweight, fill, stroke, ID, shadow); break
            case "right":
                this.drawArrow(x, y, 0, "right", area, lweight, fill, stroke, ID, shadow); break
            case "bevel":
                this.bevelmarker(x, y, 0, area, lweight, fill, stroke, [0], shadow); break
        }
        this.restore();
    }

    //Line
    c.prototype.Line = function (xa, ya, xb, yb, width, color, shadow, dash, cap, join) {
        shadow = shadow || nullshadow;
        cap = cap || "butt";
        join = join || "miter";
        dash = dash || [0];

        var dasharray = [];
        for (var d = 0; d < dash.length; d++) {
            dasharray.push(dash[d] * width);
        }

        var dashout = dasharray || [0];

        this.save();
        this.beginPath();
        this.lineWidth = width;
        this.strokeStyle = color;
        this.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
        this.setLineDash(dashout);
        this.lineCap = cap;
        this.lineJoin = join;
        this.moveTo(xa, ya);
        this.lineTo(xb, yb);
        this.closePath();
        if (width > 0) this.stroke();
        this.restore();
    }

    //Vertical Bar, Line, Bubble, and OHLC Chart Grid Lines
    c.prototype.gridlinesdraw = function (option, precision, chart, click) {
        var duration = option.duration,
            gridline = option.gridline,
            data = dataarrayoutput(option),
            ObjectData = option.ObjectData,
            enable3d = option.enable3d || false,
            labelfont = option.labelfont,
            rotatelabel = labelfont.rotatelabel || false,
            //precision = NaNCheck(option.precision),
            stacked = option.stacked,
            customXY = option.customXY,
            minset = option.min;

        var customX, customY, conw, conh, animation;
        if (customXY) {
            animation = false;
            customX = option.x,
            customY = option.y;
        }
        else {
            animation = option.animation || false;
            customX = 0,
            customY = 0;
        }
        conw = option.size.width,
        conh = option.size.height;
        
        var GArray = GroupArray(ObjectData);
        var gtotalmax = MaxArray(GroupArrayTotal(GArray));

        var gtotalresult = removeDuplicate(GArray).toString().split(",").map(Number);
        var gtotalresultmax = MaxArray(gtotalresult);

        intervalx = NaNCheck(duration.interval) || 1;
        if (intervalx < 1) intervalx = 1;

        var max = MaxMin(option, chart, true),
            min = MaxMin(option, chart, false);

        var valueuptotal = ValueTotal(option, chart, "up"),
            valuedowntotal = ValueTotal(option, chart, "down");

        this.save();
        if (animation) this.clear(option.size.width, option.size.height);

        var color = gridline.color,
            horizontalcolor = gridline.horizontalcolor,
            internalwidth = gridline.internalwidth,
            width = gridline.width;

        horizontalcolor = horizontalcolor || color;
        internalwidth = internalwidth || width;

        var percent3d, BarPercentWidth, BarPercentHeight;
        if (enable3d) {
            if (stacked) {
                BarPercentWidth = barpercentmeasure(this, option, chart, false) * gtotalmax;
                BarPercentHeight = barpercentmeasure(this, option, chart, false) * gtotalmax;
            }
            else {
                BarPercentWidth = barpercentmeasure(this, option, chart, false);
                BarPercentHeight = barpercentmeasure(this, option, chart, false);
            }
        }
        else {
            BarPercentWidth = 0;
            BarPercentHeight = 0;
        }

        var hA, hB, vA, vB;
        if (chart == "horizontalbar") {
            var optionLL = option.labelleft,
                optionLR = option.labelright,
                optionH = option.header,
                optionSH = option.subheader,
                optionF = option.footer,
                measurefont = option.measurefont,
                //measureleft = option.measureleft,
                //measureright = option.measureright,
                legendposition = option.legendposition;

            gridline.internalcolor = gridline.internalcolor || gridline.color;
            //gridline.internalwidth = gridline.internalwidth || gridline.width;

            //multiple vertical lines

            hA = this.BaseLabelH(option, "left", chart) + 1;
            hB = this.BaseLabelH(option, "right", chart); //- BarPercentWidth;

            vA = this.TBPosition(option, chart, "top");
            vB = this.TBPosition(option, chart, "bottom");

            //varCompute
            var varCompute = ComputeCheck(option, hB, max, min, "y"),
                varP = VarPcount(option, hB, max, min, "y"),
                lineDrawCount = LineCount(option, hB, max, min, "y");

            var YCanvas = vB; //conh - 55
            var ynumbase = YCanvas + TextFontHeight(this, measurefont);
    
            //var Yorigin = vB;

            //measurement
            
            //varCompute
            var intervalV = (hB - hA) / (lineDrawCount - 1);
            var percent;
            if (enable3d)
                percent = BarPercentWidth;
            else
                percent = 0;

            for (var i = 0; i < lineDrawCount; i++) {
                var gridpoints = [];
                if (valueuptotal >= valuedowntotal) {
                    cx = parseInt(i * intervalV) + hA;

                    if (enable3d) {
                        if (varP == 0) {

                            if (valuedowntotal == data.length) {
                                gridpoints.push({ x: cx + 0.5 - percent, y: vA - 1 });
                                gridpoints.push({ x: cx + 0.5 - percent, y: (YCanvas + 2) });
                                gridpoints.push({ x: cx + 0.5, y: (YCanvas + 2) - percent });
                                gridpoints.push({ x: cx + 0.5, y: vA - 1 });
                            }
                            else {
                                gridpoints.push({ x: cx + 0.5, y: vA - 1 });
                                gridpoints.push({ x: cx + 0.5, y: (YCanvas + 2) - percent });
                                gridpoints.push({ x: cx + 0.5 - percent, y: (YCanvas + 2) });
                                //gridpoints.push({ x: cx + 0.5 - percent, y: vA - 1 });
                            }
                        }
                        else if (varP > 0) {
                            if (valueuptotal > 0) {
                                gridpoints.push({ x: cx + 0.5 + percent, y: vA - 1 });
                                gridpoints.push({ x: cx + 0.5 + percent, y: (YCanvas + 2) - percent });
                                gridpoints.push({ x: cx + 0.5, y: (YCanvas + 2) });
                            }
                            else {
                                //this.Line(cx + 0.5, vA - 1, cx + 0.5, (YCanvas + 2), internalwidth, color);
                            }

                            if (i == 0) {
                                this.Line(cx + 0.5, vA - 1, cx + 0.5, (YCanvas + 2), internalwidth, color, nullshadow);
                            }
                        }
                        else {
                            gridpoints.push({ x: cx + 0.5 - percent, y: (YCanvas + 2) });
                            gridpoints.push({ x: cx + 0.5, y: (YCanvas + 2) - percent });
                            gridpoints.push({ x: cx + 0.5, y: vA - 1 });
                        }
                        this.polygon(gridpoints, rgba(0, 0, 0, 0), gridline.internalcolor, internalwidth, [0], nullshadow, false);
                    }
                    else {
                        this.Line(cx + 0.5, vA - 1, cx + 0.5, (YCanvas + 2), internalwidth, color);
                    }

                }
                else if (valueuptotal < valuedowntotal) {
                    cx = parseInt(((lineDrawCount - 1) - i) * intervalV) + hA;

                    if (enable3d) {
                        if (varP == 0) {
                            //gridpoints.push({ x: cx + 0.5, y: vA - 1 });
                            gridpoints.push({ x: cx + 0.5, y: (YCanvas + 2) });
                            gridpoints.push({ x: cx + 0.5 + percent, y: (YCanvas + 2) - percent });
                            gridpoints.push({ x: cx + 0.5 + percent, y: vA - 1 });
                        }
                        else if (varP < 0) {
                            gridpoints.push({ x: cx + 0.5, y: (YCanvas + 2) });
                            gridpoints.push({ x: cx + 0.5 + percent, y: (YCanvas + 2) - percent });
                            gridpoints.push({ x: cx + 0.5 + percent, y: vA - 1 });
                        }
                        else {
                            gridpoints.push({ x: cx + 0.5 - percent, y: (YCanvas + 2) });
                            gridpoints.push({ x: cx + 0.5, y: (YCanvas + 2) - percent });
                            gridpoints.push({ x: cx + 0.5, y: vA - 1 });
                        }
                        this.polygon(gridpoints, rgba(0, 0, 0, 0), color, internalwidth, [0], nullshadow, false);
                    }
                    else {
                        this.Line(cx + 0.5, vA - 1, cx + 0.5, (YCanvas + 2), internalwidth, color);
                    }

                }
                
                varP -= varCompute;
            }

            if (valuedowntotal > valueuptotal) {
                this.Line(cx + 0.5, vA - 1, cx + 0.5, (YCanvas + 2), gridline.internalwidth, gridline.internalcolor);
            }

            //horizontal line
            this.Line(hA + 0.5, round(vB) + 1.5, (hB + 1) - percent, round(vB) + 1.5, width, color);
            
        }
        else if (chart == "radar") {

            var measurefont = option.measurefont;
            vA = this.TBPosition(option, chart, "top"), //+ Vpercent3d;
            vB = this.TBPosition(option, chart, "bottom");

            var area = conh * 0.45 - (vA + vB);
            var areaplus = (conh * 0.5) - area;
            var varCompute = ComputeCheck(option, area, max, min, "x");
            var lineDrawCount = LineCount(option, area, max, min, "x");
            var interval = area / (lineDrawCount - 1);
            var varP = VarPcount(option, area, max, min, "x");

            var carea;
            for (var i = 0; i < lineDrawCount; i++) {
                carea = parseInt(i * interval);

                var startline = -(PI) / 2;
                var endline = -(PI) / 2;
                for (var j = 0; j < data.length; j++) {
                    var CD = data[j];
                    var valueline = 1 / data.length;
                    var circum = valueline * PI * 2;
                    if (j > 0) startline = endline;
                    endline += circum;

                    offsetXline = cos(startline) * carea;
                    offsetYline = sin(startline) * carea;
                    offsetXlineEnd = cos(endline) * carea;
                    offsetYlineEnd = sin(endline) * carea;
                    this.Line((conw / 2) + offsetXline, (conh / 2) + offsetYline, (conw / 2) + offsetXlineEnd, (conh / 2) + offsetYlineEnd, gridline.width / 2, gridline.color);
                    //ctx.circle((conw / 2), (conh / 2), carea, gridline.width / 4, "rgba(0,0,0,0)", gridline.color, nullshadow);
                }

                varP -= varCompute;
            }
            var totalValues = varCompute * (lineDrawCount - 1);
            var total = MaxArray(data);

            var startline = -(PI) / 2;
            var endline = -(PI) / 2;
            for (var i = 0; i < data.length; i++) {
                var text = data[i][Object.keys(data[i])[0]];
                var valueline = 1 / data.length;
                var circum = valueline * PI * 2;
                if (i > 0) startline = endline;
                endline += circum;

                offsetXline = cos(startline) * area;
                offsetYline = sin(startline) * area;
                this.Line((conw / 2), (conh / 2), (conw / 2) + offsetXline, (conh / 2) + offsetYline, gridline.width, gridline.color);
            }
        }
        else {

            var labeladdtop, labeladdbottom;

            switch (labelfont.position) {
                case "top":
                    labeladdbottom = 0;
                    if (rotatelabel) {
                        labeladdtop = 0;
                    }
                    else {
                        labeladdtop = this.lmeasureout(option, precision, chart, 0);
                    }
                    break
                case "bottom":
                    labeladdtop = 0;
                    if (rotatelabel) {
                        labeladdbottom = 0;
                    }
                    else {
                        labeladdbottom = this.lmeasureout(option, precision, chart, 0);
                    }
                    break
            }

            hA = this.BaseNum(option, "left", precision, chart) + 6;
            hB = this.BaseNum(option, "right", precision, chart) - 6;
            vA = (this.TBPosition(option, chart, "top") + BarPercentHeight) - labeladdtop;
            vB = this.TBPosition(option, chart, "bottom") - labeladdbottom;
            //
            //multiple horizontal lines

            //varCompute
            var varCompute = ComputeCheck(option, vB, max, min, "x");
            var varP = VarPcount(option, vB, max, min, "x");
            var lineDrawCount = LineCount(option, vB, max, min, "x");
            var intervalH = (vB - vA) / (lineDrawCount - 1);

            for (var i = 0; i < lineDrawCount; i++) {
                var gridpoints = [];
                if (valueuptotal >= valuedowntotal) {
                    cy = parseInt(i * intervalH) + vA;
                }
                else if (valueuptotal < valuedowntotal) {
                    cy = parseInt(((lineDrawCount - 1) - i) * intervalH) + vA;
                }

                var text = "";

                if (varP == minset) text = 0;

                varP -= varCompute;

                if (enable3d) {
                    this.save();
                    if (valueuptotal >= valuedowntotal) {
                        if ((i == lineDrawCount - 1) && (varP != 0)) {
                            gridpoints.push({ x: hA, y: (cy) + 0.5 });
                            gridpoints.push({ x: hA + BarPercentWidth, y: (cy - BarPercentHeight) + 0.5 });
                            gridpoints.push({ x: hB, y: (cy - BarPercentHeight) + 0.5 });
                            gridpoints.push({ x: hB - BarPercentWidth, y: (cy) + 0.5 });
                            gridpoints.push({ x: hA, y: (cy) + 0.5 });
                        }
                        else {
                            gridpoints.push({ x: hA, y: (cy) + 0.5 });
                            gridpoints.push({ x: hA + BarPercentWidth, y: (cy - BarPercentHeight) + 0.5 });
                            gridpoints.push({ x: hB, y: (cy - BarPercentHeight) + 0.5 });
                        }
                    }
                    else if (valueuptotal < valuedowntotal) {
                        if (i == 0) {
                            gridpoints.push({ x: hA, y: (cy) + 0.5 });
                            gridpoints.push({ x: hA + BarPercentWidth, y: (cy - BarPercentHeight) + 0.5 });
                            gridpoints.push({ x: hB, y: (cy - BarPercentHeight) + 0.5 });
                            gridpoints.push({ x: hB - BarPercentWidth, y: (cy) + 0.5 });
                            gridpoints.push({ x: hA, y: (cy) + 0.5 });
                        }
                        else {
                            gridpoints.push({ x: hA, y: (cy) + 0.5 });
                            gridpoints.push({ x: hA + BarPercentWidth, y: (cy - BarPercentHeight) + 0.5 });
                            gridpoints.push({ x: hB, y: (cy - BarPercentHeight) + 0.5 });
                        }
                    }
                    this.polygon(gridpoints, rgba(0, 0, 0, 0), horizontalcolor, internalwidth, [0], nullshadow, false);
                }
                else {
                    if (text == 0) this.Line(hA, cy + 0.5, hB + 1, cy + 0.5, width, color);
                    else this.Line(hA, cy + 0.5, hB + 1, cy + 0.5, internalwidth, horizontalcolor);
                }

            }

            //vertical line drawing left
            this.Line(round(hA) - 0.5, vA, round(hA) - 0.5, vB, width, color);

            //vertical line drawing right
            if (!enable3d) this.Line(round(hB) + 1.5, vA, round(hB) + 1.5, vB + 1, width, color);
            this.restore();

            Xorigin = hA;
            var widthtotal = hB - Xorigin;
            var widthCperline = widthtotal;
            widthCperline /= data.length;

            gridline.internal = gridline.internal || false;

            for (i = 1; i < data.length; i++) {
                var addx = hA;
                //var linemeasure = intervalx * i;
                //if (linemeasure >= data.length) break;
                var xh = round(addx + (widthCperline * i)) + 0.5;
                var Vcolor;
                if (i < 1 && i == (data.length - 1)) Vcolor = gridline.color;
                else Vcolor = gridline.verticalcolor;
                if (gridline.internal) {
                    if (chart == "barline") this.Line(xh, vA, xh, vB, gridline.width, Vcolor);
                }
            }
        }
    }//end of canvas drawing

    //Clear Canvas
    c.prototype.clear = function (width, height) {
        this.clearRect(0, 0, width, height);
    }

    //Label Measure Height
    c.prototype.LabelMeasureHeight = function (font, h) {
        if (font.display)
            return this.wrapTextHeight(font.text, 10, h, this.FontHeight(font), false);
        else
            return 10;
    }

    //Measure Label Length
    c.prototype.MeasureLabelLength = function (option, font, chart, precision) {
        if (font.display) {
            if (font.textdirection == "left")
                return this.FontHeight(font);
            else if (font.textdirection == "right")
                return this.FontHeight(font);
            else 
                return this.MeasureArray(option, font, chart, precision) + 10;
        }
        else {
            return 10;
        }
    }

    //Gradient Codes
    c.prototype.gradient = function (xa, ya, xb, yb) {
        return this.createLinearGradient(xa, ya, xb, yb);
    }

    function gradinputstop(grd, input, i) {
        var g = input[i].stop || (NaNCheck(i / (input.length - 1)));
        grd.addColorStop(g, input[i].color);
    }

    //linear gradient
    c.prototype.GradientLinear = function (x, y, width, height, input, rotate, reverse, invert, diag) {
        rotate = rotate || 0;
        var xa, xb, ya, yb, grd;
        reverse = reverse || false;
        invert == invert || false;
        var pheta = Math.atan2(height, width);
        if (invert) pheta *= -1;
        var AB = abs(height * cos(pheta));
        var xdx = cos(pheta + PI / 2) * AB;
        var xdy = sin(pheta + PI / 2) * AB;
        //diagonal
        if (diag) {
            xa = x + (width / 2) - xdx;
            ya = y + (height / 2) - xdy;
            xb = x + (width / 2) + xdx;
            yb = y + (height / 2) + xdy;
            if (reverse) grd = this.gradient(xb, yb, xa, ya);
            else grd = this.gradient(xa, ya, xb, yb);
        }
        //horizontal and vertical
        else {
            if (reverse) {
                xa = x + width, xb = x; //left
                ya = y + height, yb = y; //up
            }
            else {
                xa = x, xb = x + width; //right
                ya = y, yb = y + height; //down
            }
            if (invert) grd = this.gradient(xa, height / 2, xb, height / 2); //horizontal
            else grd = this.gradient(width / 2, ya, width / 2, yb); //vertical
        }
        for (i = 0; i < input.length; i++) gradinputstop(grd, input, i);
        return grd;
    }

    //Radial Gradient
    c.prototype.GradientCircle = function (xA, yA, rA, xB, yB, rB, input) {
        var grd = this.createRadialGradient(xA, yA, rA, xB, yB, rB);
        for (i = 0; i < input.length; i++) gradinputstop(grd, input, i);
        return grd;
    }

    //Header, Footer, Sides
    c.prototype.labelHFS = function (option, chart) {
        var H = option.header,
            SH = option.subheader,
            F = option.footer,
            legend = option.legendfont,
            legendposition = option.legendposition,
            ObjectData = option.ObjectData,
            data = option.data,
            duration = option.duration,
            format = option.format,
            customXY = option.customXY,
            L, R, legendresult;

        var w, h;

        if (customXY) {
            customX = option.x,
            customY = option.y;
        }
        else {
            customX = 0,
            customY = 0;
        }
        w = option.size.width,
        h = option.size.height;

        if (chart == "piedoughnut"
            || chart == "pie"
            || chart == "doughnut"
            || chart == "radar"
            || chart == "cone"
            || chart == "pyramid"
            || chart == "cylinder") {
            L = nulltext,
            R = nulltext,
            legendresult = data;
        }
        else if (chart == "gauge") {
            L = nulltext,
            R = nulltext;
            legendresult = [];
        }
        else {
            L = option.labelleft,
            R = option.labelright,
            legendresult = DataOutput(option);
        }

        H.display = H.display || false;
        SH.display = SH.display || false;
        F.display = F.display || false;
        L.display = L.display || false;
        R.display = R.display || false;

        var conwlegend
        switch (legendposition) {
            case "left":
            case "right":
                conwlegend = w * 0.2;
                break
            default:
                conwlegend = w;
                break
        }

        //var wraparray = [];
        for (j = 0; j < legendresult.length; j++) {
            if (chart == "piedoughnut"
                || chart == "pie"
                || chart == "doughnut"
                || chart == "cone"
                || chart == "pyramid"
                || chart == "cylinder") {
                labelcheck = legendresult[j][Object.keys(legendresult[j])[0]].toString();
            }
            else {
                if (legendresult == data) {
                    labelcheck = LabelOutput(option, j, false, chart, true).toString();
                }
                else labelcheck = ObjectData[j][Object.keys(ObjectData[j])[0]].toString();
            }
            //wraparray.push(this.wrapTextArray(labelcheck, 0, conwlegend, 0, true) - 1)
        }

        var wraptextarray = [];
        for (k = 0; k < legendresult.length; k++) {
            wraptextarray.push(parseInt(this.wrapTextWidth(labelcheck, conwlegend, legend, true)));
        }

        var Hbase, SHbase, Lbase, Rbase, Fbase, sideBase, legendarray, legendfontheight;
        Hbase = 10 + customY;
        if (chart == "gauge") {
            legendarray = 0;
            legendfontheight = 0;
        }
        else {
            var labellegendnum = legendarraynum(this, option, chart);
            legendarray = (MaxArray(wraptextarray) + 35);//20 + this.MaxArrayText(option, chart);
            legendfontheight = TextFontHeight(this, legend) * (MaxArray(labellegendnum) + 1);
        }
        var LHeight, RHeight, footerdeduct;
        
        if (L.display)
            LHeight = this.wrapTextHeight(L.text, 0, h, TextFontHeight(this, L), false);
        else
            LHeight = 10;

        if (R.display)
            RHeight = this.wrapTextHeight(R.text, 0, h, TextFontHeight(this, R), false);
        else
            RHeight = 10;

        var Wdeduct = LHeight + RHeight;
        sideBase = round(h * 0.5) + customY;
        if (F.display)
            footerdeduct = (this.wrapTextHeight(F.text, 10, w - Wdeduct, TextFontHeight(this, F), false));
        else
            footerdeduct = 10;

        var mainlabelY = (w / 2) + customX;
        switch (legendposition) {
            case "bottom":
                Lbase = 10;
                Rbase = w - 10;
                Fbase = h - (footerdeduct + legendfontheight);
                break
            case "left":
                Lbase = 10 + legendarray;
                Rbase = w - 10;
                Fbase = h - footerdeduct;
                break
            case "right":
                Lbase = 10;
                Rbase = w - (10 + legendarray);
                Fbase = h - footerdeduct;
                break
            default:
                Lbase = 10;
                Rbase = w - 10;
                Fbase = h - footerdeduct;
                break
        }

        //header
        if (H.display)
            this.TextWrap(H.text, mainlabelY, Hbase, 0, H.width, H.color, H.stroke, "center", "hanging", H, w - Wdeduct, TextFontHeight(this, H), false);

        //sub header
        if (SH.display) {
            if (H.display) SHbase = this.wrapTextHeight(H.text, Hbase, w - Wdeduct, TextFontHeight(this, H), false);
            else SHbase = Hbase;
            this.TextWrap(SH.text, mainlabelY, SHbase, 0, SH.width, SH.color, SH.stroke, "center", "hanging", SH, w - Wdeduct, TextFontHeight(this, SH), false);
        }

        //footer
        if (F.display)
            this.TextWrap(F.text, mainlabelY, parseInt(Fbase) + customY, 0, F.width, F.color, F.stroke, "center", "alphabetic", F, w - Wdeduct, TextFontHeight(this, F), false);

        //labelleft
        if (L.display)
            this.TextWrap(L.text, Lbase + customX, sideBase, -90, L.width, L.color, L.stroke, "center", "hanging", L, h, TextFontHeight(this, L), false);

        //labelright
        if (R.display)
            this.TextWrap(R.text, Rbase + customX, sideBase, 90, R.width, R.color, R.stroke, "center", "hanging", R, h, TextFontHeight(this, R), false);
    }

    //Measurement Array
    c.prototype.MeasureArray = function (option, font, chart, precision) {
        var numA, numB;
        var format = option.format,
            convert = option.kmflag,
            minset = option.min || 0;
        format.prefix = format.prefix || "";
        format.suffix = format.suffix || "";
        var percentstack = option.percentstack;

        //top
        var vmovey = this.TBPosition(option, chart, "top");
        //bottom
        var vposition = this.TBPosition(option, chart, "bottom");
        var HCanvas = vposition - vmovey;
        var max = MaxMin(option, chart, true),
            min = MaxMin(option, chart, false);

        var valueuptotal = ValueTotal(option, chart, "up"),
            valuedowntotal = ValueTotal(option, chart, "down");

        var array = [];
        this.FontFormat(font);

        var varCompute = ComputeCheck(option, vposition, max, min, "x");
        var varP = VarPcount(option, vposition, max, min, "x");
        var lineDrawCount = LineCount(option, vposition, max, min, "x");
        var intervalH = HCanvas / (lineDrawCount - 1);

        //varCompute
        for (var i = 0; i < lineDrawCount; i++) {
            if (valueuptotal >= valuedowntotal) {
                cy = parseInt(i * intervalH) + vmovey;
            }
            else if (valueuptotal < valuedowntotal) {
                cy = parseInt(((lineDrawCount - 1) - i) * intervalH) + vmovey;
            }

            var text = "";

            if (varP > minset) text = varP;
            else if (varP == minset) text = minset;
            else {
                text = varP;
            }

            if (percentstack) num = Num(option, chart, text, "x", false, false, precision);
            else num = Num(option, chart, text, "x", false, convert, precision);

            varP -= varCompute;
            
            array.push(this.measureText(num).width);
        }

        var maxarray = MaxArray(array);
        return maxarray
    }

    //Top Bottom
    c.prototype.TopBottom = function (option, TB, chart) {
        var labelfont = option.labelfont,
            rotatelabel = labelfont.rotatelabel || false,
            measureleft = option.measureleft,
            measureright = option.measureright,
            H = option.header,
            SH = option.subheader,
            F = option.footer,
            customXY = option.customXY;
        var LHeight, RHeight;

        var customX, customY, conw, conh;
        if (customXY) {
            customX = option.x,
            customY = option.y;
        }
        else {
            customX = 0,
            customY = 0;
        }
        conw = option.size.width,
        conh = option.size.height;

        H.display = H.display || false;
        SH.display = SH.display || false;
        F.display = F.display || false;

        if (chart != "piedoughnut"
            && chart != "pie"
            && chart != "doughnut"
            && chart != "cone"
            && chart != "pyramid"
            && chart != "cylinder"
            && chart != "radar") {
            var L = option.labelleft,
                R = option.labelright;
            L.display = L.display || false;
            R.display = R.display || false;

            if (L.display)
                LHeight = this.wrapTextHeight(L.text, 0, conh, TextFontHeight(this, L), false);
            else
                LHeight = 4;

            if (R.display)
                RHeight = this.wrapTextHeight(R.text, 0, conh, TextFontHeight(this, R), false);
            else
                RHeight = 4;
            var Wdeduct = LHeight + RHeight;
        }

        var top, bottom, topadd, subtopadd, bottomadd, labeladd, numadd, numaddleft, numaddright;

        switch (chart) {
            case "horizontalbar":
                var measurefont = option.measurefont;
                
                if (H.display) {
                    topadd = this.wrapTextHeight(H.text, 5, conw - Wdeduct, TextFontHeight(this, H), false);
                }
                else {
                    topadd = 5;
                }
        
                if (SH.display) {
                    subtopadd = this.wrapTextHeight(SH.text, 5, conw - Wdeduct, TextFontHeight(this, SH), false);
                }
                else {
                    subtopadd = 5;
                }
        
                if (F.display) {
                    bottomadd = this.wrapTextHeight(F.text, 10, conw - Wdeduct, TextFontHeight(this, F), false);
                }
                else {
                    bottomadd = 5;
                }
                
                //top = parseInt(topadd + subtopadd);
                //bottom = parseInt(conh - (bottomadd));

                labeladd = TextFontHeight(this, measurefont) + 2;
                break
            case "pie":
            case "doughnut":
            case "radar":
            case "cone":
            case "cylinder":
            case "pyramid":

                if (H.display)
                    topadd = this.wrapTextHeight(H.text, 10, conw, TextFontHeight(this, H), false);
                else
                    topadd = 10;

                if (SH.display)
                    subtopadd = this.wrapTextHeight(SH.text, 10, conw, TextFontHeight(this, SH), false);
                else
                    subtopadd = 10;
                if (F.display)
                    bottomadd = this.wrapTextHeight(F.text, 10, conw, TextFontHeight(this, F), false);
                else
                    bottomadd = 10;

                labeladd = 0;
                break
            default:
                if (H.display)
                    topadd = this.wrapTextHeight(H.text, 25, conw - Wdeduct, TextFontHeight(this, H), false);
                else
                    topadd = 25;
                if (SH.display)
                    subtopadd = this.wrapTextHeight(SH.text, 0, conw - Wdeduct, TextFontHeight(this, SH), false);
                else
                    subtopadd = 0;
                if (F.display)
                    bottomadd = this.wrapTextHeight(F.text, 25, conw - Wdeduct, TextFontHeight(this, F), false);
                else
                    bottomadd = 20

                labeladd = 0;
        }

        if (chart == "radar") {
            top = parseInt((topadd + (subtopadd * 0.6)) * 0.5);
            bottom = parseInt(bottomadd);
        }
        else if(chart == "pie"
        || chart == "doughnut"
        || chart == "cone"
        || chart == "cylinder"
        || chart == "pyramid") {
            //top = parseInt(topadd + subtopadd /*+ numadd*/);
            //bottom = parseInt(conh - (bottomadd + labeladd/*+ numadd*/));
        }
        else {
            top = parseInt(topadd + subtopadd /*+ numadd*/);
            bottom = parseInt(conh - (bottomadd + labeladd/*+ numadd*/));
        }
        if (TB == "top") return top + customY
        else if (TB == "bottom") return bottom + customY
    }

    c.prototype.LabelRotate = function (option, length, chart) {
        var data = dataarrayoutput(option),
            labelfont = option.labelfont,
            rotatelabel = labelfont.rotatelabel || false,
            duration = option.duration;
        duration.interval = NaNCheck(duration.interval) || 1;
        if (duration.interval < 1) duration.interval = 1;
        var intervalx = parseInt(duration.interval);
        var result, labelxarray = [];
        for (var j = 0; j < data.length; j++) {
            var internalout = j * intervalx;
            if (internalout >= data.length) break;
            var labelout;
            if (chart == "bubble")
                labelout = convertnum(internalout);
            else
                labelout = LabelOutput(option, internalout, false, chart);
            labelxarray.push(this.FontWidth(labelout, labelfont) + (labelfont.fontSize + 5));
        }
        var maxarray = MaxArray(labelxarray);
        var labelxmeasure = parseFloat(maxarray);
        var datameasure = parseFloat((length * intervalx) / data.length);
        if (labelxmeasure > datameasure) {
            result = datameasure - labelxmeasure;
            if (result < -90) result = -90;
        }
        else {
            result = 0;
        }
        return result
    }

    //Num Add
    c.prototype.NumAdd = function (option) {
        var measureleft = option.measureleft,
            measureright = option.measureright;
        var numaddleft, numaddright;
        var labelfont = option.labelfont;
        if (measureleft.textdirection == "left"
            || measureleft.textdirection == "right") numaddleft = parseInt(this.FontWidth("___", measureleft));
        else numaddleft = 0;
        if (measureright.textdirection == "left"
            || measureright.textdirection == "right") numaddright = parseInt(this.FontWidth("___", measureright));
        else numaddright = 0;
        return Math.max(numaddleft, numaddright) / 2;
    }

    //Top Bottom Position
    c.prototype.TBPosition = function (option, chart, TB) {
        var labelfont = option.labelfont,
            legendfont = option.legendfont,
            rotatelabel = labelfont.rotatelabel || false,
            legendposition = option.legendposition,
            ObjectData = option.ObjectData,
            customXY = option.customXY,
            enable3d = option.enable3d || false,
            plotlabel = option.plotlabel;

        var customX, customY, conw, conh;
        if (customXY) {
            customX = option.x,
            customY = option.y;
        }
        else {
            customX = 0,
            customY = 0;
        }
        conw = option.size.width /*+ customX*/,
        conh = option.size.height /*+ customY*/;

        if (chart != "barline"
            && chart != "horizontalbar") enable3d = false;

        var top, bottom, labeladd, rotateadd;
        var canvastop = this.TopBottom(option, "top", chart);
        var canvasbottom = this.TopBottom(option, "bottom", chart);
        var plotlabeladd;
        var labellegendarray = LLarray(option, chart, this);
        var labellegendarraygroup = MaxArrayNum(labellegendarray, conw);

        var legendfontheight = (this.FontHeight(legendfont) + 15) * (MaxArray(labellegendarraygroup) + 1);
        if (/*chart == "horizontalbar"
            ||*/ chart == "pie"
            || chart == "doughnut"
            || chart == "radar"
            || chart == "cone"
            || chart == "cylinder"
            || chart == "pyramid") {

            switch (legendposition) {
                case "top":
                    top = canvastop + legendfontheight; //40
                    bottom = canvasbottom; //320
                    break
                case "bottom":
                    top = canvastop;
                    bottom = canvasbottom + legendfontheight; //320
                    break
                default:
                    top = canvastop;
                    bottom = canvasbottom; //320
            }
            plotlabeladd = 0;

            if (TB == "top") {
                return parseInt(top);
            }
            else if (TB == "bottom") return parseInt(bottom);
        }
        else {
            //plot label
            var plotlabelcheck = 0;
            for (i = 0; i < ObjectData.length; i++) {
                var OD = ObjectData[i];
                OD.showlabel = OD.showlabel || false;
                if (OD.showlabel) plotlabelcheck += 1;
                else plotlabelcheck += 0;
            }
            if (plotlabelcheck > 0) plotlabeladd = this.wrapTextHeight("|", 0, conw, this.FontHeight(plotlabel), false);
            else plotlabeladd = 0;

            duration = option.duration,
            format = option.format;

            duration.interval = NaNCheck(duration.interval) || 1;
            if (duration.interval < 1) duration.interval = 1;
            var intervalx = parseInt(duration.interval);

            labeladd = 0//this.FontHeight(labelfont) * 0.5;
            if (rotatelabel) {
                rotateadd = labeladd + ((this.LabelRotate(option, canvasbottom, chart)) * -1);
            }
            else {
                rotateadd = 0;
            }

            switch (legendposition) {
                case "top":
                    top = canvastop + legendfontheight; //40
                    bottom = canvasbottom; //320
                    break
                case "bottom":
                    top = canvastop;
                    bottom = canvasbottom - legendfontheight; //320
                    break
                default:
                    top = canvastop;
                    bottom = canvasbottom; //320
            }

            switch (labelfont.position) {
                case "top":
                    top += rotateadd;
                    bottom;
                    break
                case "bottom":
                    top;
                    bottom -= rotateadd;
                    break
                default:
                    top;
                    bottom;
                    break
            }
            if (TB == "top") {
                if (chart == "barline") return parseInt(top) + plotlabeladd;
                else return parseInt(top);
            }
            else if (TB == "bottom") return parseInt(bottom) - 10;
        }

    }

    //Label Measure
    c.prototype.lmeasureout = function (option, precision, chart, i) {
        i = i || 0;
        var data = dataarrayoutput(option),
            duration = option.duration,
            labelfont = option.labelfont;
            
        duration.interval = NaNCheck(duration.interval) || 1;
        if (duration.interval < 1) duration.interval = 1;
        var intervalx = parseInt(duration.interval);

        hA = this.BaseNum(option, "left", precision, chart);
        hB = this.BaseNum(option, "right", precision, chart);

        var Wcanvas = (hB - hA) / data.length;
        var wmeasure = Wcanvas * intervalx;

        var namearray = [];
        for (var j = 0; j < data.length; j++) {
            var labelmeasure;
            labelmeasure = LabelOutput(option, j, false, chart);
            namearray.push(this.FontWidth(labelmeasure, labelfont) / intervalx);
        }
        var maxarrayname = MaxArray(namearray);
        var lmeasure = intervalx * i;

        if (maxarrayname > wmeasure) {
            if (isEven(lmeasure))
                return this.FontHeight(labelfont) + 2;
            else
                return 0;
        }
        else {
            return 0;
        }
    }

    //Label Base
    c.prototype.LabelBase = function (option, chart, precision, i) {
        var labelfont = option.labelfont,
            legendfont = option.legendfont,
            //duration = option.duration,
            //format = option.format,
            legendposition = option.legendposition;
        var numadd = 0//this.NumAdd(option);

        var numbaseB = this.BaseNum(option, "right", precision, chart);

        var baseAdd = 0;
        
        var canvastop = this.TopBottom(option, "top", chart);
        var canvasbottom = this.TopBottom(option, "bottom", chart);

        var base;
        var labellegendarray = LLarray(option, chart, this);
        var labellegendarraygroup = MaxArrayNum(labellegendarray, conw);
        //var legendfontheight = this.FontHeight(legendfont) + 10;
        var legendfontheight = (this.FontHeight(legendfont) + 15) * (MaxArray(labellegendarraygroup) + 1);
        if (labelfont.position == "top") {
            base = canvastop;
            if (legendposition == "bottom")
                base;
            else if (legendposition == "top")
                base -= legendfontheight;

        }
        else if (labelfont.position == "bottom") {
            base = canvasbottom;
            if (legendposition == "bottom")
                base -= legendfontheight;
            else if (legendposition == "top")
                base;
        }
        return (base - 5)
    }

    //Base Label Horizontal
    c.prototype.BaseLabelH = function (option, leftright, chart) {
        var customXY = option.customXY,
            duration = option.duration,
            gridline = option.gridline,
            data = dataarrayoutput(option),
            ObjectData = option.ObjectData,
            enable3d = option.enable3d || false,
            //precision = NaNCheck(option.precision),
            minset = option.min,
            optionLL = option.labelleft,
            optionLR = option.labelright,
            legendfont = option.legendfont,
            legendposition = option.legendposition;

        var customX, customY, conw, conh;
        if (customXY) {
            customX = option.x,
            customY = option.y;
        }
        else {
            customX = 0,
            customY = 0;
        }
        conw = option.size.width,
        conh = option.size.height;

        var canvasleft, canvasright;
        if (optionLL.display) {
            canvasleft = parseInt(this.wrapTextHeight(optionLL.text, TextFontHeight(this, optionLL) + 5, conh, TextFontHeight(this, optionLL), false));
        }
        else {
            canvasleft = 12;
        }

        if (optionLR.display) {
            canvasright = parseInt(conw - (this.wrapTextHeight(optionLR.text, TextFontHeight(this, optionLR) + 5, conh, TextFontHeight(this, optionLR), false)));
        }
        else {
            canvasright = conw - 8;
        }

        if (chart == "piedoughnut"
            || chart == "pie"
            || chart == "doughnut"
            || chart == "cone"
            || chart == "pyramid"
            || chart == "cylinder") {
            Data = data;
        }
        else {
            Data = DataOutput(option);
        }

        var conwlegend
        switch (legendposition) {
            case "left":
            case "right":
                conwlegend = conw * 0.2;
                break
            default:
                conwlegend = conw;
                break
        }

        var wraparray = [];
        for (j = 0; j < Data.length; j++) {
            if (chart == "piedoughnut"
                || chart == "pie"
                || chart == "doughnut"
                || chart == "cone"
                || chart == "pyramid"
                || chart == "cylinder") {
                labelcheck = Data[j][Object.keys(Data[j])[0]].toString();
            }
            else {
                if (Data == data) {
                    labelcheck = LabelOutput(option, j, false, chart).toString();
                }
                else labelcheck = ObjectData[j][Object.keys(ObjectData[j])[0]].toString();
            }
            wraparray.push(this.wrapTextArray(labelcheck, 0, conwlegend, 0, true) - 1)
        }

        var wraptextarray = [];
        for (k = 0; k < Data.length; k++) {
            wraptextarray.push(parseInt(this.wrapTextWidth(labelcheck, conwlegend, legendfont, true)));
        }
        var legendarray = (MaxArray(wraptextarray) + 35);

        var hA, hB;
        switch (legendposition) {
            case "left":
                hA = parseInt(this.MaxArrayLabel(option, chart) + canvasleft + (legendarray));
                hB = canvasright;
                break
            case "right":
                hA = parseInt(this.MaxArrayLabel(option, chart) + canvasleft);
                hB = canvasright - (legendarray);
                break
            default:
                hA = parseInt(this.MaxArrayLabel(option, chart) + canvasleft);
                hB = canvasright;
        }

        switch (leftright) {
            case "left":
                return hA + customX
                break
            case "right":
                return hB + customX
                break
        }
    }

    //Base Num
    c.prototype.BaseNum = function (option, leftright, precision, chart) {
        var customXY = option.customXY,
            data = option.data,
            ObjectData = option.ObjectData,
            legendfont = option.legendfont,
            measureleft = option.measureleft,
            measureright = option.measureright,
            optionLL = option.labelleft,
            optionLR = option.labelright,
            legendposition = option.legendposition,
            duration = option.duration,
            format = option.format,
            percentstack = option.percentstack,
            enable3d = option.enable3d,
            convert = option.kmflag;
            //precision = precision || option.precision;

        var customX, customY, conw, conh;
        if (customXY) {
            customX = option.x,
            customY = option.y;
        }
        else {
            customX = 0,
            customY = 0;
        }
        conw = option.size.width,
        conh = option.size.height;

        percentstack = percentstack || false;
        precision = NaNCheck(precision);

        if (chart == "piedoughnut"
            || chart == "pie"
            || chart == "doughnut"
            || chart == "cone"
            || chart == "pyramid"
            || chart == "cylinder") {
            Data = data;
        }
        else {
            Data = DataOutput(option);
        }

        var conwlegend
        switch (legendposition) {
            case "left":
            case "right":
                conwlegend = conw * 0.2;
                break
            default:
                conwlegend = conw;
                break
        }

        var wraptextarray = [];
        var labelcheck = [];
        for (j = 0; j < Data.length; j++) {
            if (chart == "piedoughnut"
                || chart == "pie"
                || chart == "doughnut"
                || chart == "cone"
                || chart == "pyramid"
                || chart == "cylinder") {
                labelcheck.push(Data[j][Object.keys(Data[j])[0]].toString());
            }
            else {
                if (Data == data) {
                    labelcheck.push(LabelOutput(option, j, false, chart, true).toString());
                }
                else labelcheck.push(ObjectData[j][Object.keys(ObjectData[j])[0]].toString());
            }
        }

        for (k = 0; k < Data.length; k++) {
            wraptextarray.push(parseInt(this.wrapTextWidth(labelcheck[k], conwlegend, legendfont, true)));
        }

        //Legend Array
        var legendresult = DataOutput(option);
        var legendarray = (MaxArray(wraptextarray) + 35)//20 + this.MaxArrayText(option, chart);//
        //var legendarray = 20 + this.MaxArrayText(option, chart);//
        var measureleftlength = this.MeasureLabelLength(option, measureleft, chart, precision);
        var measurerightlength;
        if (!enable3d)
            measurerightlength = this.MeasureLabelLength(option, measureright, chart, precision);
        else
            measurerightlength = 0;

        var LLtextheight = this.LabelMeasureHeight(optionLL, conh);
        var LRtextheight = this.LabelMeasureHeight(optionLR, conh);
        var canvasleft = parseInt(LLtextheight + measureleftlength);
        var canvasright = parseInt(conw - (LRtextheight + measurerightlength));
        switch (legendposition) {
            case "left":
                baseA = canvasleft + legendarray;
                baseB = canvasright; //default
                break
            case "right":
                baseA = canvasleft;
                baseB = canvasright - legendarray;
                break
            default:
                baseA = canvasleft;
                baseB = canvasright; //default
        }
        if (leftright == "left") return baseA + customX
        else if (leftright == "right") return baseB + customX
    }

    //Labelling
    c.prototype.canvaslabel = function (option, chart, precision, click) {
        var customXY = option.customXY,
            intervaldata = option.intervaldata,
            data = dataarrayoutput(option),
            ObjectData = option.ObjectData,
            minset = option.min || 0,
            labelfont = option.labelfont,
            legendfont = option.legendfont,
            duration = option.duration,
            format = option.format,
            convert = option.kmflag || false,
            enable3d = option.enable3d || false,
            rotatelabel = labelfont.rotatelabel || false,
            //precision = NaNCheck(option.precision),
            percentstack = option.percentstack,
            stacked = option.stacked;

        duration.interval = NaNCheck(duration.interval) || 1;
        if (duration.interval < 1) duration.interval = 1;
        
        var customX, customY, conw, conh;
        if (customXY) {
            customX = option.x,
            customY = option.y;
        }
        else {
            customX = 0,
            customY = 0;
        }
        conw = option.size.width,
        conh = option.size.height;

        var max = MaxMin(option, chart, true),
            min = MaxMin(option, chart, false);

        //top
        var vA = this.TBPosition(option, chart, "top"),
            vB = this.TBPosition(option, chart, "bottom");

        var conwlegend
        switch (legendposition) {
            case "left":
            case "right":
                conwlegend = conw * 0.2;
                break
            default:
                conwlegend = conw;
                break
        }

        var Data;
        if (chart == "pie"
            || chart == "doughnut"
            || chart == "cone"
            || chart == "pyramid"
            || chart == "cylinder") {
            Data = data;
        }
        else {
            Data = DataOutput(option);
        }

        if (chart == "horizontalbar") {

            //var wraparray = [];
            //for (j = 0; j < Data.length; j++) {
            //    if (chart == "piedoughnut"
            //        || chart == "pie"
            //        || chart == "doughnut"
            //        || chart == "cone"
            //        || chart == "pyramid"
            //        || chart == "cylinder") {
            //        labelcheck = Data[j][Object.keys(Data[j])[0]].toString();
            //    }
            //    else {
            //        if (Data == data) {
            //            labelcheck = LabelOutput(option, j, false, chart).toString();
            //        }
            //        else labelcheck = Data[j][Object.keys(Data[j])[0]].toString();
            //    }
            //    wraparray.push(this.wrapTextArray(labelcheck, 0, conwlegend, 0, true) - 1)
            //}

            var wraptextarray = [];
            for (k = 0; k < Data.length; k++) {
                //if (chart == "piedoughnut"
                //    || chart == "pie"
                //    || chart == "doughnut"
                //    || chart == "cone"
                //    || chart == "pyramid"
                //    || chart == "cylinder") {
                //    labelout = Data[j][Object.keys(Data[j])[0]].toString();
                //}
                //else {
                //    if (Data == data) {
                //        labelout = LabelOutput(option, j, false, chart).toString();
                //    }
                //    else labelout = ObjectData[j][Object.keys(ObjectData[j])[0]].toString();
                //}
                labelout = Data[k][Object.keys(Data[k])[0]].toString();
                wraptextarray.push(parseInt(this.wrapTextWidth(labelout, conwlegend, legendfont, true)));
            }

            var measurefont = option.measurefont,
                legendposition = option.legendposition,
                reverse = option.reverse,
                L = option.labelleft;

            var hA = this.BaseLabelH(option, "left", chart),
                hB = this.BaseLabelH(option, "right", chart);

            var WCanvas = hB - hA;

            var YCanvas = vB - 2; //conh - 55
            var ynumbase = YCanvas + TextFontHeight(this, measurefont);

            var Yorigin = vB;

            if (L.display) {
                canvasleft = parseInt(this.wrapTextHeight(L.text, TextFontHeight(this, L) + 5, conh, TextFontHeight(this, L), false));
            }
            else {
                canvasleft = 12;
            }

            switch (legendposition) {
                case "left":
                    xlabelbase = this.MaxArrayLabel(option, chart) + canvasleft + (MaxArray(wraptextarray) + 35);
                    break
                case "right":
                    xlabelbase = this.MaxArrayLabel(option, chart) + canvasleft;
                    break
                default:
                    xlabelbase = this.MaxArrayLabel(option, chart) + canvasleft;
            }

            var valueuptotal = ValueTotal(option, chart, "up"),
                valuedowntotal = ValueTotal(option, chart, "down");

            var heightCperY = YCanvas - vA;
            heightCperY /= data.length;

            //measurement
            measurefont.display = measurefont.display || false;
            if (measurefont.display) {
                var percent;
                if (enable3d)
                    percent = barpercentmeasure(this, option, chart, false);
                else
                    percent = 0;

                var varCompute = ComputeCheck(option, hB, max, min, "y");
                var varPX = VarPcount(option, hB, max, min, "y");
                var lineDrawCount = LineCount(option, hB, max, min, "y");
                var intervalV = WCanvas / (lineDrawCount - 1);
                for (var i = 0; i < lineDrawCount; i++) {
                    var text = "";
                    if (valueuptotal >= valuedowntotal) {
                        cx = parseInt(i * intervalV) + hA;
                        if (varPX > 0) {
                            text = varPX;
                            cx -= (percent * 0.25);
                        }
                        else if (varPX == 0) {
                            text = 0;
                            cx -= percent;
                        }
                        else {
                            text = varPX;
                            cx -= percent;
                        }

                    }
                    else if (valueuptotal < valuedowntotal) {
                        cx = parseInt(((lineDrawCount - 1) - i) * intervalV) + hA;
                        if (varPX > 0) {
                            text = varPX;
                            cx -= percent;
                        }
                        else if (varPX == 0) {
                            text = 0;
                        }
                        else {
                            text = varPX;
                            //cx += percent;
                        }

                    }

                    //if (valuedowntotal > valueuptotal) {
                    //    if (valuedowntotal == data.length) {
                    //        x
                    //    }
                    //    else {
                    //        if (valueout < 0) x += Hpercent;
                    //    }
                    //}
                    //else {
                    //    if (valueuptotal == data.length) {
                    //        x
                    //    }
                    //    else {
                    //        if (valueout > 0) x -= Hpercent;
                    //    }
                    //}
                    
                    if (percentstack) num = Num(option, chart, text, "y", false, false);
                    else num = Num(option, chart, text, "y", false, convert, precision);

                    varPX -= varCompute;

                    this.Text(num, cx, ynumbase, 0, measurefont.color, null, 0, "center", "middle", measurefont);
                }
            }

            //label rows
            labelfont.display = labelfont.display || false;
            if (labelfont.display) {
                for (i = 0; i < data.length; i++) {
                    if (reverse) rev = i;
                    else rev = (data.length - 1) - i;
                    var intervaly = duration.interval;
                    var labely, labelcanvas;
                    var labelmeasure, loopmeasure;
                    labelmeasure = intervaly * rev;
                    if (data.length > 20) {
                        if (labelmeasure >= data.length) break;
                        labelcanvas = (heightCperY / 2) + Yorigin - (heightCperY * intervaly * (data.length - i));
                        //labelcanvas = (ynumbase - 14) - ((Math.ceil(YCanvas - 5) / (data.length / intervaly)) * (i));
                        loopmeasure = labelmeasure;
                    }
                    else {
                        labelcanvas = (heightCperY / 2) + Yorigin - (heightCperY * intervaly * (data.length - i));
                        loopmeasure = labelmeasure;
                    }
                    labely = LabelOutput(option, loopmeasure, false, chart);

                    this.Text(labely, xlabelbase, labelcanvas, 0, labelfont.color, null, 0, "right", "middle", labelfont);
                }
            }
        }
        else if (chart == "radar") {
            var measurefont = option.measurefont;

            var vA = this.TBPosition(option, chart, "top"), //+ Vpercent3d;
                vB = this.TBPosition(option, chart, "bottom");

            //var radius;
            //if (conh < conw)
            //    radius = conh;
            //else
            //    radius = conw;

            var area = conh * 0.45 - (vA + vB);
            var areaplus = (conh * 0.5) - area;

            var varCompute = ComputeCheck(option, area, max, min, "x");
            var lineDrawCount = LineCount(option, area, max, min, "x");
            var interval = area / (lineDrawCount - 1);
            var varPR = VarPcount(option, area, max, min, "x");

            for (var i = 0; i < lineDrawCount; i++) {
                carea = parseInt(i * interval);

                if (varPR == 0) {
                    var areaadd = carea;
                }

                var startline = -(PI) / 2;
                var endline = -(PI) / 2;
                for (var j = 0; j < data.length; j++) {
                    var CD = data[j];
                    var valueline = 1 / data.length;
                    var circum = valueline * PI * 2;
                    if (j > 0) startline = endline;
                    endline += circum;

                    offsetXline = cos(startline) * carea;
                    offsetYline = sin(startline) * carea;
                    offsetXlineEnd = cos(endline) * carea;
                    offsetYlineEnd = sin(endline) * carea;
                }

                var text = "";

                text = varPR;

                if (percentstack) num = Num(option, chart, text, "x", false, false, precision);
                else num = Num(option, chart, text, "x", false, convert, precision);

                if (varPR > 0) this.Text(num, conw / 2, carea + areaplus, 0, measurefont.color, null, 0, "center", "middle", measurefont);

                varPR -= varCompute;
            }
            var totalValues = varCompute * (lineDrawCount - 1);
            var total = MaxArray(data);

            var startline = -(PI) / 2;
            var endline = -(PI) / 2;
            for (var i = 0; i < data.length; i++) {
                var text = data[i][Object.keys(data[i])[0]];
                var valueline = 1 / data.length;
                var circum = valueline * PI * 2;
                if (i > 0) startline = endline;
                endline += circum;

                offsetXline = cos(startline) * (area + 14);
                offsetYline = sin(startline) * (area + 14);
                this.Text(text, (conw / 2) + offsetXline, (conh / 2) + offsetYline, 0, labelfont.color, null, 0, "center", "middle", labelfont);
            }

        }
        else {

            var totalbar = TotalBarLine(option, "bar");
            var totalline = TotalBarLine(option, "line");

            var measureleft = option.measureleft,
                measureright = option.measureright;
            vB -= this.lmeasureout(option, precision, chart, 0);
            var Hpercent3d, Vpercent3d;
            if (enable3d) {
                Hpercent3d = 0//WidthA;
                Vpercent3d = 0//HeightA;
            }
            else {
                Hpercent3d = 0;
                Vpercent3d = 0;
            }

            var percentX;
            if (enable3d)
                percentX = barpercentmeasure(this, option, chart, false);
            else
                percentX = 0;

            var hB = this.BaseNum(option, "right", precision, chart);
            //bottom
            var valueuptotal = ValueTotal(option, chart, "up"),
                valuedowntotal = ValueTotal(option, chart, "down");

            var intervalx = duration.interval;

            var hA = this.BaseNum(option, "left", precision, chart);

            var Xorigin = hA + 5;
            var XCanvas = hB - 5;

            vA += percentX;

            if (chart == "barline") hB += 2;

            var HCanvas = (vB - vA);
            var GArray = GroupArray(ObjectData);
            var gtotalmax = MaxArray(GroupArrayTotal(GArray));

            precision = precision || 0;
            var numA, numB, widthCperX;
            var widthtotal = XCanvas - Xorigin;
            widthCperX = widthtotal;
            widthCperX /= data.length;
            var wmeasure = widthCperX * intervalx;

            measureleft.display = measureleft.display || false;
            measureright.display = measureright.display || false;

            labelfont.align = labelfont.align || "center";
            labelfont.position = labelfont.position || "bottom";

            percentstack = percentstack || false;
            //measurement labels positive

            var varCompute = ComputeCheck(option, vB, max, min, "x");
            var varP = VarPcount(option, vB, max, min, "x");

            var lineDrawCount = LineCount(option, vB, max, min, "x");
            var intervalH = HCanvas / (lineDrawCount - 1);

            //varCompute
            for (var i = 0; i < lineDrawCount; i++) {
                if (valueuptotal >= valuedowntotal) {
                    cy = parseInt(i * intervalH) + vA;
                }
                else if (valueuptotal < valuedowntotal) {
                    cy = parseInt(((lineDrawCount - 1) - i) * intervalH) + vA;
                }

                var text = "";

                if (varP > minset) text = varP;
                else if (varP == minset) text = minset;
                else text = varP;

                varP -= varCompute;

                if (percentstack) num = Num(option, chart, text, "x", false, false, precision);
                else num = Num(option, chart, text, "x", false, convert, precision);

                var Clabeltext = num;

                //measure label left
                Clabelcolor = measureleft.color;
                if (measureleft.textdirection == "left") {
                    ClabelX = hA;
                    Clabelrotate = -90
                    Clabelalign = "center";
                    Clabelbaseline = "alphabetic";
                }
                else if (measureleft.textdirection == "right") {
                    ClabelX = hA - 5;
                    Clabelrotate = 90
                    Clabelalign = "center";
                    Clabelbaseline = "alphabetic";
                }
                else {
                    ClabelX = hA;
                    Clabelrotate = 0
                    Clabelalign = "right";
                    Clabelbaseline = "middle";
                }
                if (measureleft.display) this.Text(Clabeltext, ClabelX, cy, Clabelrotate, Clabelcolor, null, 0, Clabelalign, Clabelbaseline, measureleft);

                //measure label right
                Clabelcolor = measureright.color;
                if (measureright.textdirection == "left") {
                    ClabelX = hB + 8;
                    Clabelrotate = -90
                    Clabelalign = "center";
                    Clabelbaseline = "alphabetic";
                }
                else if (measureright.textdirection == "right") {
                    ClabelX = hB + 1;
                    Clabelrotate = 90;
                    Clabelalign = "center";
                    Clabelbaseline = "alphabetic";
                }
                else {
                    ClabelX = hB;
                    Clabelrotate = 0;
                    Clabelalign = "left";
                    Clabelbaseline = "middle";
                }
                if (measureright.display) this.Text(Clabeltext, ClabelX, cy, Clabelrotate, Clabelcolor, null, 0, Clabelalign, Clabelbaseline, measureright);
            }

            //label columns
            var labelcanvas, labelx, loopmeasure, labelmeasure, labelbaseline, labelrotate, datameasure, labelxarray = [];
            labelfont.display = labelfont.display || false;
            format.input = format.input || "num";
            if (labelfont.position == "top") labelbaseline = "alphabetic";
            else if (labelfont.position == "bottom") labelbaseline = "hanging";

            var namearray = [];
            for (var j = 0; j < data.length; j++) {
                lmeasure = LabelOutput(option, j, false, chart);
                namearray.push(this.FontWidth(lmeasure, labelfont) / intervalx);
            }
            var maxarrayname = MaxArray(namearray);

            for (var i = 0; i < data.length; i++) {
                labelmeasure = intervalx * i;
                var legendfontplus;
                if (rotatelabel) {
                    legendfontplus = 0;
                }
                else {
                    if (maxarrayname > wmeasure) {
                        if (isOdd(labelmeasure))
                            legendfontplus = this.FontHeight(labelfont) + 2;
                        else
                            legendfontplus = 0;
                    }
                    else {
                        legendfontplus = 0;
                    }
                }

                if (rotatelabel) {
                    labelrotate = this.LabelRotate(option, hB, chart);
                }
                else {
                    labelrotate = 0;
                }

                var ylabelbase;
                //var labellegendarray = LLarray(option, chart, this);
                //var labellegendarraygroup = MaxArrayNum(labellegendarray, conw);
                var legendfontheight = this.FontHeight(legendfont) + 10;
                //var legendfontheight = (this.FontHeight(legendfont) + 15) * (MaxArray(labellegendarraygroup) + 1);
                if (labelfont.position == "top") {
                    ylabelbase = vA;
                    if (legendposition == "bottom")
                        ylabelbase;
                    else if (legendposition == "top")
                        ylabelbase -= legendfontheight;

                }
                else if (labelfont.position == "bottom") {
                    ylabelbase = vB;
                    if (legendposition == "bottom")
                        ylabelbase -= (legendfontheight);
                    else if (legendposition == "top")
                        ylabelbase;
                }
                ylabelbase += ((legendfontplus + 5) - (labelrotate * 2));

                if (labelmeasure >= data.length) break;
                if (chart == "bubble") {
                    //loopmeasure = labelmeasure;
                    if (data.length > 20) {
                        labelcanvas = (widthCperX / 2) + Xorigin + ((widthCperX * intervalx) * i);
                    }
                    else {
                        labelcanvas = (widthCperX / 2) + Xorigin + 5 + ((widthCperX * intervalx) * i);
                    }
                    labelx = convertnum(labelmeasure);
                }
                else {
                    if (chart == "barline") {
                        if (totalbar >= 1) {
                            labelcanvas = (widthCperX / 2) + Xorigin + ((widthCperX * intervalx) * i);
                        }
                        else {
                            labelcanvas = Xorigin + ((widthtotal / (data.length - 1)) * intervalx * i);
                        }
                    }
                    else if (chart == "OHLC" || chart == "scatter") {
                        labelcanvas = (widthCperX / 2) + Xorigin + ((widthCperX * intervalx) * i);
                    }
                    labelx = LabelOutput(option, labelmeasure, false, chart);
                }

                if (labelfont.display) this.Text(labelx, labelcanvas, ylabelbase, labelrotate, labelfont.color, null, 0, labelfont.align, labelbaseline, labelfont);
            }
        }
    }

    c.prototype.GradientMarker = function (array, gradienttype, xa, ya, Areamarker) {

        var GradX = xa - Areamarker;
        var GradY = ya - Areamarker;
        var GradDX = xa - (Areamarker * 0.5);
        var GradDY = ya - (Areamarker * 0.5);
        var gtypeout = gradienttype.toString().toLowerCase();

        var fill;
        switch (gtypeout) {
            case "linear a": fill = this.GradientLinear(0, GradY, Areamarker, Areamarker * 2, array, 0, true, false); break
            case "linear b": fill = this.GradientLinear(0, GradY, Areamarker, Areamarker * 2, array, 0, false, false); break
            case "linear c": fill = this.GradientLinear(GradX, 0, Areamarker * 2, Areamarker, array, 0, true, true); break
            case "linear d": fill = this.GradientLinear(GradX, 0, Areamarker * 2, Areamarker, array, 0, false, true); break
            case "linear e": fill = this.GradientLinear(GradDX, ya, Areamarker * 1.5, Areamarker * 1.5, array, 0, false, true, true); break
            case "linear f": fill = this.GradientLinear(GradDX, ya, Areamarker * 1.5, Areamarker * 1.5, array, 0, true, true, true); break
            case "linear g": fill = this.GradientLinear(GradDX, GradDY, Areamarker * 1.5, Areamarker * 1.5, array, 0, false, false, true); break
            case "linear h": fill = this.GradientLinear(GradDX, GradDY, Areamarker * 1.5, Areamarker * 1.5, array, 0, true, false, true); break
            case "radial": fill = this.GradientCircle(xa, ya, Areamarker / 5, xa, ya, Areamarker, array); break
        }
        return fill;
    }

    c.prototype.GradientArrow = function (array, gradienttype, direction, xa, ya, GradDX, GradDY, XGradient, YGradient, Areamarker) {
        var grad = [];
        for (var j = 0; j < array.length; j++) {
            grad.push({ color: array[j].color, stop: array[j].stop });
        }
        var arrowdirectLR, gradoutA, gradoutB, arrowdirectUD;
        var areaLR, areaUD;
        var xarrowA, yarrowA, xarrowB, yarrowB;

        switch (direction) {
            case "right":
                xarrowA = 0;
                yarrowA = ya;
                xarrowB = 0;
                yarrowB = ya;
                areaLR = Areamarker * 0.2;
                arrowdirectLR = false;
                gradoutA = false;
                gradoutB = false;
                arrowdirectUD = true;
                break
            case "down":
                xarrowA = xa - (xa * 0.5);
                yarrowA = 0;
                xarrowB = 0;
                yarrowB = ya;
                areaLR = Areamarker;
                arrowdirectLR = true;
                gradoutA = false;
                gradoutB = false;
                arrowdirectUD = false;
                break
            case "left":
                xarrowA = 0;
                yarrowA = ya;
                xarrowB = 0;
                yarrowB = ya;
                areaLR = Areamarker * 0.2;
                arrowdirectLR = false;
                gradoutA = false;
                gradoutB = false;
                arrowdirectUD = true;
                break
            case "up":
                xarrowA = xa - (xa * 0.5);
                yarrowA = 0;
                xarrowB = 0;
                yarrowB = ya;
                areaLR = Areamarker;
                arrowdirectLR = true;
                gradoutA = true;
                gradoutB = false;
                arrowdirectUD = false;
                break
        }
        var gtypeout = gradienttype.toString().toLowerCase();
        switch (gtypeout) {
            case "linear a":
                fill = this.GradientLinear(xarrowA, yarrowA, areaLR, areaLR * 2, grad, 0, gradoutA, arrowdirectLR); break
            case "linear b":
                fill = this.GradientLinear(xarrowA, yarrowA, areaLR, areaLR * 2, grad, 0, gradoutB, arrowdirectLR); break
            case "linear c":
                fill = this.GradientLinear(xarrowA, yarrowA, areaLR * 2, areaLR, grad, 0, gradoutA, arrowdirectUD); break
            case "linear d":
                fill = this.GradientLinear(xarrowA, yarrowA, areaLR * 2, areaLR, grad, 0, gradoutB, arrowdirectUD); break
            case "linear e":
                fill = this.GradientLinear(GradDX, ya, Areamarker * 1.5, Areamarker * 1.5, grad, 0, false, true, true); break
            case "linear f":
                fill = this.GradientLinear(GradDX, ya, Areamarker * 1.5, Areamarker * 1.5, grad, 0, true, true, true); break
            case "linear g":
                fill = this.GradientLinear(GradDX, GradDY, Areamarker * 1.5, Areamarker * 1.5, grad, 0, false, false, true); break
            case "linear h":
                fill = this.GradientLinear(GradDX, GradDY, Areamarker * 1.5, Areamarker * 1.5, grad, 0, true, false, true); break
            case "radial":
                fill = this.GradientCircle(XGradient, YGradient, Areamarker / 5, XGradient, YGradient, Areamarker, grad); break
        }
        return fill;
    }

    c.prototype.legendtextwidth = function (option, chart) {
        var ID = option.canvasID,
            customXY = option.customXY,
            data = dataarrayoutput(option),
            ObjectData = option.ObjectData,
            H = option.header,
            SH = option.subheader,
            F = option.footer,
            legendfont = option.legendfont,
            legendposition = option.legendposition || "none",
            duration = option.duration,
            format = option.format,
            line = option.line;
        var ltextX, ltextY, Xmarker, Ymarker, legendX, legendY, lalign, lbaseline, Htop, Hadd, Fbottom;
        var legendfontheight = parseInt(this.FontHeight(legendfont));
        var llineV = legendfontheight + 5;
        legendfont.underline = legendfont.underline || false;

        var customX, customY, conw, conh;
        if (customXY) {
            customX = option.x,
            customY = option.y;
        }
        else {
            customX = 0,
            customY = 0;
        }
        conw = option.size.width,
        conh = option.size.height;

        H.display = H.display || false;
        SH.display = SH.display || false;
        F.display = F.display || false;

        var Data;

        if (chart == "piedoughnut"
            || chart == "pie"
            || chart == "doughnut"
            || chart == "cone"
            || chart == "pyramid"
            || chart == "cylinder") {
            Data = data;
            L = nulltext;
            R = nulltext;
        }
        else {
            Data = DataOutput(option);
            L = option.labelleft;
            R = option.labelright;
        }

        var legendarray = [];

    }

    //Legend
    c.prototype.legend = function (option, chart) {
        var ID = option.canvasID,
            customXY = option.customXY,
            data = option.data,
            ObjectData = option.ObjectData,
            H = option.header,
            SH = option.subheader,
            F = option.footer,
            legendfont = option.legendfont,
            legendposition = option.legendposition,
            duration = option.duration,
            format = option.format,
            intervaldata,
            line = option.line;
        var ltextX, ltextY, Xmarker, Ymarker, legendX, legendY, lalign, lbaseline, Htop, Hadd, Fbottom;
        var legendfontheight = parseInt(this.FontHeight(legendfont));
        legendfont.underline = legendfont.underline || false;

        var customX, customY, conw, conh;
        if (customXY) {
            customX = option.x,
            customY = option.y;
        }
        else {
            customX = 0,
            customY = 0;
        }
        conw = option.size.width,
        conh = option.size.height;

        H.display = H.display || false;
        SH.display = SH.display || false;
        F.display = F.display || false;

        var areasize = 6;

        var Data;

        if (chart == "piedoughnut"
            || chart == "pie"
            || chart == "doughnut"
            || chart == "cone"
            || chart == "pyramid"
            || chart == "cylinder") {
            Data = data;
            L = nulltext;
            R = nulltext;
            intervaldata = 1;
        }
        else {
            Data = DataOutput(option);
            L = option.labelleft;
            R = option.labelright;

            if (Data == data)
                intervaldata = option.intervaldata || 1;
            else
                intervaldata = 1;
        }

        if (chart != "piedoughnut"
            && chart != "pie"
            && chart != "doughnut"
            && chart != "cone"
            && chart != "pyramid"
            && chart != "cylinder") {
            duration.format = duration.format || "num";
        }

        format.input = format.input || "num";

        if (H.display) {
            Htop = parseInt(this.wrapTextHeight(H.text, 6, conw, this.FontHeight(H), false));
        }
        else {
            Htop = 10;
        }

        if (SH.display) {
            Hadd = parseInt(this.wrapTextHeight(SH.text, 6, conw, this.FontHeight(SH), false));
        }
        else {
            Hadd = 10;
        }

        //if (F.display) {
        //    Fbottom = parseInt(this.wrapTextHeight(F.text, 12, conw, this.FontHeight(F), false));
        //}
        //else {
        //    Fbottom = 10;
        //}
        Fbottom = 0;

        var LAHTotal = 0;
        for (var j = 0; j < Data.length; j++) {
            LAHTotal += parseInt(this.FontHeight(legendfont)) + 5;
        }

        var Datalength;
        var measurelength;
        if (Data == data)
            measurelength = dataarrayoutput(option);
        else
            measurelength = ObjectData;

        if (legendposition == "left" ||
            legendposition == "right") {
            var Dataout = 0;
            for (var k = 0; k < measurelength.length; k++) {
                Dataout += 1;
            }
            Datalength = Dataout;
        }
        else {
            Datalength = measurelength.length;
        }

        for (var i = 0; i < Datalength; i++) {
            var OD = Data[i];

            if (chart == "piedoughnut"
                || chart == "pie"
                || chart == "doughnut"
                || chart == "cone"
                || chart == "pyramid"
                || chart == "cylinder") {
                labellegend = Data[i][Object.keys(Data[i])[0]].toString();
                WCanvas = conw;
            }
            else {
                if (Data == data) {
                    labellegend = LabelOutput(option, i, false, chart).toString();
                }
                else labellegend = ObjectData[i][Object.keys(ObjectData[i])[0]].toString();


                if (L.display)
                    LHeight = this.wrapTextHeight(L.text, 0, conh, TextFontHeight(this, L), false);
                else
                    LHeight = 4;

                if (R.display)
                    RHeight = this.wrapTextHeight(R.text, 0, conh, TextFontHeight(this, R), false);
                else
                    RHeight = 4;

                var Wdeduct = LHeight + RHeight;
                WCanvas = conw - Wdeduct;
            }
            OD.heat = OD.heat || false;
            OD.area = OD.area || false;

            var linededuct = (legendfontheight * 0.5) + 4;
            //function LegendArrayGroup(array, max) {
            //    var arrayin = []
            //    for (var j = 0; j < array.length; j++) {
            //        var arrayadd = 0;
            //        var group = 0;

            //        for (k = 0; k <= j; k++) {
            //            arrayadd += array[k];
            //            if (arrayadd > max && arrayadd != array[k]) {
            //                arrayadd = 0;
            //                arrayadd += array[k];
            //                group += 1;
            //            }
            //        }
            //        arrayin.push({ 'x': array[j], 'y': group });
            //    }

            //    var grouparray = [];
            //    for (ic = 0; ic < arrayin.length; ic++) {
            //        var O = arrayin[ic].y;
            //        grouparray.push(O);
            //    }
            //    var grouparrayout = removeDuplicate(grouparray).toString().split(",").map(Number);

            //    var arraytotal = [];
            //    for (var j = 0; j < array.length; j++) {
            //        var arrayaddtotal = 0;
            //        for (k = 0; k < grouparrayout.length; k++) {
            //            if (arrayin[j].y == k) {
            //                for (var i = 0; i < array.length; i++) {
            //                    if (arrayin[i].y == k) {
            //                        arrayaddtotal += arrayin[i].x;
            //                    }
            //                }
            //            }
            //        }
            //        arraytotal.push(arrayaddtotal);
            //    }

            //    var arraysplit = [];
            //    for (var k = 0; k < grouparrayout.length; k++) {
            //        var arrayEX = [];
            //        for (var j = 0; j < arrayin.length; j++) {
            //            if (arrayin[j].y == k) {
            //                arrayEX.push(arrayin[j].x);
            //            }
            //        }
            //        arraysplit.push(arrayEX);
            //    }

            //    var arrayX = [];
            //    for (var j = 0; j < arraysplit.length; j++) {
            //        var arrayadd = 0;
            //        for (k = 0; k < arraysplit[j].length; k++) {
            //            if (k == 0) arrayadd = 0;
            //            else arrayadd += arraysplit[j][k - 1];

            //            arrayX.push(arrayadd);
            //        }
            //    }

            //    var arrayout = [];
            //    for (var j = 0; j < array.length; j++) {
            //        arrayout.push({ x: arrayX[j], y: arrayin[j].y, height: arrayin[j].y, z: arraytotal[arrayin[j].y] });
            //    }
            //    return arrayout
            //}
            var labellegendarray = LLarray(option, chart, this);
            var labellegendarraygroup = LegendArrayGroup(labellegendarray, conw);
            var labellegendnum = MaxArrayNum(labellegendarray, conw);
            var lbase, llength;
            var llineH = labellegendarraygroup[i].x;
            //console.log(MaxArray(labellegendnum))

            var conwlegend
            switch (legendposition) {
                case "left":
                case "right":
                    conwlegend = conw * 0.2;
                    break
                default:
                    conwlegend = conw;
                    break
            }

            var wraparray = [];
            var labelout;
            for (j = 0; j < Data.length; j++) {
                if (chart == "piedoughnut"
                    || chart == "pie"
                    || chart == "doughnut"
                    || chart == "cone"
                    || chart == "pyramid"
                    || chart == "cylinder") {
                    labelout = Data[j][Object.keys(Data[j])[0]].toString();
                }
                else {
                    if (Data == data) {
                        labelout = LabelOutput(option, j, false, chart, true).toString();
                    }
                    else labelout = ObjectData[j][Object.keys(ObjectData[j])[0]].toString();
                }
                wraparray.push(this.wrapTextArray(labelout, 0, conwlegend, 0, true) - 1)
            }
            //if (i == Data.length - 1) console.log(wraparray);

            var LegendHeightOut;
            //(text, y, maxWidth, lineHeight, letter)
            var wraptotal = wraparray[i];

            var wrapplus = [];
            var wraptextarray = [];
            for (k = 0; k < Data.length; k++) {
                var labelcheck;
                var addarray = 0;
                for (j = 0; j < k + 1; j++) {
                    if (chart == "piedoughnut"
                        || chart == "pie"
                        || chart == "doughnut"
                        || chart == "cone"
                        || chart == "pyramid"
                        || chart == "cylinder") {
                        labelcheck = Data[j][Object.keys(Data[j])[0]].toString();
                    }
                    else {
                        if (Data == data) {
                            labelcheck = LabelOutput(option, j, false, chart, true).toString();
                        }
                        else labelcheck = ObjectData[j][Object.keys(ObjectData[j])[0]].toString();
                    }

                    if (j == 0)
                        addarray = 0;
                    else if (j > 0 && wraparray[j - 1] > 1)
                        addarray += (parseInt(this.FontHeight(legendfont)) * wraparray[j - 1])
                    else
                        addarray += parseInt(this.FontHeight(legendfont))
                }
                wrapplus.push(addarray);
                wraptextarray.push(parseInt(this.wrapTextWidth(labelcheck, conwlegend, legendfont, true)));
            }
            //if (i == Data.length - 1) console.log(wrapplus);
            //if (i == Data.length - 1) console.log(wraptextarray);

            var measureline = parseInt(this.FontHeight(legendfont));
            var llineV = wrapplus[i]//parseInt(this.FontHeight(legendfont)) * 2;

            var measuredata = wrapplus[Data.length - 1];

            var lheight = (conh - measuredata) * 0.5;

            llength = (conw - labellegendarraygroup[i].z) * 0.5;

            var lcolorwidth = llength + llineH + (areasize * 0.5);

            var ltextH = llength + llineH + (areasize * 2);
            var ltextV = parseInt(lheight + (llineV));
            var lcolorheight = ltextV - 1;

            lalign = "left";
            switch (legendposition) {
                case "top":
                    legendheightadd = (legendfontheight) * labellegendarraygroup[i].y
                    ltextX = ltextH;
                    ltextY = (Htop + Hadd) + legendheightadd;
                    Xmarker = lcolorwidth;
                    Ymarker = ltextY + parseInt(legendfontheight * 0.35);
                    lbaseline = "hanging";
                    break
                case "bottom":
                    legendheightadd = (legendfontheight) * ((MaxArray(labellegendnum) + 1) - labellegendarraygroup[i].y);
                    ltextX = ltextH;
                    ltextY = (conh - Fbottom) - legendheightadd;
                    Xmarker = lcolorwidth;
                    Ymarker = ltextY - parseInt(legendfontheight * 0.35);
                    lbaseline = "alphabetic";
                    break
                case "left":
                    ltextX = 20;
                    ltextY = ltextV;
                    Xmarker = ltextX - linededuct;
                    Ymarker = lcolorheight;
                    lbaseline = "middle";
                    break
                case "right":
                    ltextX = conw - (MaxArray(wraptextarray) + 15)//((this.MaxArrayText(option, chart)));
                    ltextY = ltextV;
                    Xmarker = ltextX - linededuct;
                    Ymarker = lcolorheight;
                    lbaseline = "middle";
                    break
                //default:
                //    Xmarker = 0;
                //    Ymarker = 0;
                //    break
            }
            if ((legendposition != "top" &&
                legendposition != "bottom" &&
                legendposition != "left" &&
                legendposition != "right") ||
                legendposition == undefined) legendposition = "none";

            //for markers
            var Areamarker;
            if (chart == "barline"
                || chart == "scatter"
                || chart == "horizontalbar"
                || chart == "piedoughnut"
                || chart == "pie"
                || chart == "doughnut"
                || chart == "OHLC"
                || chart == "radar"
                || chart == "cone"
                || chart == "pyramid"
                || chart == "cylinder") Areamarker = areasize - 2;
            else if (chart == "bubble") Areamarker = areasize;

            var grad,
                shine;

            if (Data == ObjectData) {
                OD.fillcolor = OD.fillcolor || "black";
                OD.filltype = OD.filltype || "color";
                OD.style = OD.style || "2d";
                if (chart == "barline" || chart == "radar") {
                    OD.marker = OD.marker || "off";
                    OD.gradienttype = OD.gradienttype || "linear a";
                }
                else if (chart == "bubble") {
                    OD.marker = OD.marker || "o";
                    OD.gradienttype = OD.gradienttype || "radial";
                }
            }
            else if (Data == data) {
                if (chart == "barline" || chart == "radar") {
                    ObjectData[0].marker = ObjectData[0].marker || "off";
                    ObjectData[0].gradienttype = ObjectData[0].gradienttype || "linear a";
                    OD.marker = OD.marker || ObjectData[0].marker;
                    OD.gradienttype = OD.gradienttype || ObjectData[0].gradienttype;
                }
                else if (chart == "bubble" || chart == "scatter") {
                    ObjectData[0].marker = ObjectData[0].marker || "o";
                    ObjectData[0].gradienttype = ObjectData[0].gradienttype || "radial";
                    OD.marker = OD.marker || ObjectData[0].marker;
                    OD.gradienttype = OD.gradienttype || ObjectData[0].gradienttype;
                }

                if (chart != "piedoughnut"
                    && chart != "pie"
                    && chart != "doughnut"
                    && chart != "cone"
                    && chart != "pyramid"
                    && chart != "cylinder") {
                    ObjectData[0].fillcolor = ObjectData[0].fillcolor || "black";
                    ObjectData[0].filltype = ObjectData[0].filltype || "color";
                    ObjectData[0].style = ObjectData[0].style || "2d";
                    OD.style = OD.style || "2d";
                    OD.filltype = OD.filltype || "color";
                    OD.fillcolor = OD.fillcolor //|| ObjectData[0].fillcolor;
                }
            }

            function squarelegend(c, option, Xmarker, Ymarker, Data, i, chart, ID, Areamarker) {
                var OD = Data[i];
                var shadow = {
                    x: 0,
                    y: 0,
                    blur: 0,
                    color: "Black"
                }

                c.save();
                var lbarfill, lbarstroke;
                //Ymarker -= 1;

                //var shine = [];
                //shine.push({ color: OD.fillcolor, stop: 0 });
                //shine.push({ color: rgba(255, 255, 255, 0.7), stop: 0.25 });
                //shine.push({ color: rgba(255, 255, 255, 0.7), stop: 0.35 });
                //shine.push({ color: OD.fillcolor, stop: 0.8 });

                var BoxArea = areasize * 2;
                if (chart == "barline"
                    || chart == "horizontalbar"
                    || chart == "OHLC") {
                    if (OD.gradienttype == undefined) {
                        switch (chart) {
                            case "barline": OD.gradienttype = "linear a"; break
                            case "horizontalbar": OD.gradienttype = "linear c"; break
                            case "OHLC": OD.gradienttype = "linear a"; break
                        }
                    }
                    if (OD.filltype == "gradient") {
                        var grad = [];
                        for (var j = 0; j < OD.fillcolor.length; j++) {
                            grad.push({ color: OD.fillcolor[j].color, stop: OD.fillcolor[j].stop });
                        }
                        var gtypeout = OD.gradienttype.toString().toLowerCase();

                        switch (gtypeout) {
                            case "linear a": lbarfill = c.GradientLinear(0, Ymarker - areasize, areasize, BoxArea, grad, 0, true, false); break
                            case "linear b": lbarfill = c.GradientLinear(0, Ymarker - areasize, areasize, BoxArea, grad, 0, false, false); break
                            case "linear c": lbarfill = c.GradientLinear(Xmarker - areasize, 0, BoxArea, areasize, grad, 0, true, true); break
                            case "linear d": lbarfill = c.GradientLinear(Xmarker - areasize, 0, BoxArea, areasize, grad, 0, false, true); break
                            case "linear e": lbarfill = c.GradientLinear(Xmarker, Ymarker - (areasize * 0.5), (areasize * 1.5), (areasize * 1.5), grad, 0, false, true, true); break
                            case "linear f": lbarfill = c.GradientLinear(Xmarker, Ymarker - (areasize * 0.5), (areasize * 1.5), (areasize * 1.5), grad, 0, true, true, true); break
                            case "linear g": lbarfill = c.GradientLinear(Xmarker, Ymarker - (areasize * 0.5), (areasize * 1.5), (areasize * 1.5), grad, 0, false, false, true); break
                            case "linear h": lbarfill = c.GradientLinear(Xmarker, Ymarker - (areasize * 0.5), (areasize * 1.5), (areasize * 1.5), grad, 0, true, false, true); break
                        }

                    }
                    else if (OD.filltype == "color" && OD.style == "2d") {
                        lbarfill = OD.fillcolor;
                    }
                    else if (OD.filltype == "color" && OD.style == "3d") {
                        var shine = [];
                        shine.push({ color: OD.fillcolor, stop: 0 });
                        shine.push({ color: 'white', stop: 0.3 });
                        shine.push({ color: OD.fillcolor, stop: 0.5 });
                        switch (chart) {
                            case "barline": case "scatter": case "OHLC": lbarfill = c.GradientLinear(Xmarker, 0, areasize, areasize, shine, 0, false, true); break
                            case "horizontalbar": lbarfill = c.GradientLinear(0, Ymarker - areasize, areasize, areasize * 2, shine, 0, false, false); break
                            //case "OHLC": lbarfill = c.GradientLinear(Xmarker, 0, 6, 6, shine, 0, false, true); break
                        }
                        //lbarfill = c.GradientLinear(0, Ymarker - 6, 6, 12, shine, 0, true, false);
                    }
                    lbarstroke = OD.strokewidth;
                    if (OD.strokewidth > 1) lbarstroke = 1;
                    lline = OD.strokecolor;
                }
                else if (chart == "piedoughnut"
                    || chart == "pie"
                    || chart == "doughnut"
                    || chart == "cone"
                    || chart == "pyramid"
                    || chart == "cylinder") {
                    lbarstroke = 1;
                    lline = line.color;
                    if (OD.filltype == "color") lbarfill = OD.fill;
                    else if (OD.filltype == "gradient") {
                        var grad = [];
                        for (var j = 0; j < OD.fill.length; j++) {
                            grad.push({ color: OD.fill[j].color, stop: OD.fill[j].stop });
                        }
                        var gtypeout = OD.gradienttype.toString().toLowerCase();

                        //var grad = ctx.createLinearGradient((area / 2), yb, (area / 2), yb + area);
                        switch (gtypeout) {
                            case "linear a": lbarfill = c.GradientLinear(0, Ymarker - Areamarker, Areamarker * 2.5, Areamarker * 2.5, grad, 0, false, false); break
                            case "linear b": lbarfill = c.GradientLinear(0, Ymarker - Areamarker, Areamarker * 2.5, Areamarker * 2.5, grad, 0, true, false); break
                            case "linear c": lbarfill = c.GradientLinear(Xmarker - Areamarker, 0, Areamarker * 2.5, Areamarker * 2.5, grad, 0, true, true); break
                            case "linear d": lbarfill = c.GradientLinear(Xmarker - Areamarker, 0, Areamarker * 2.5, Areamarker * 2.5, grad, 0, false, true); break
                            case "linear e": lbarfill = c.GradientLinear(Xmarker, Ymarker, (areasize * 1.5), (areasize * 1.5), grad, 0, false, true, true); break
                            case "linear f": lbarfill = c.GradientLinear(Xmarker, Ymarker, (areasize * 1.5), (areasize * 1.5), grad, 0, true, true, true); break
                            case "linear g": lbarfill = c.GradientLinear(Xmarker, Ymarker, (areasize * 1.5), (areasize * 1.5), grad, 0, false, false, true); break
                            case "linear h": lbarfill = c.GradientLinear(Xmarker, Ymarker, (areasize * 1.5), (areasize * 1.5), grad, 0, true, false, true); break
                            case "radial": lbarfill = c.GradientCircle(Xmarker, Ymarker, Areamarker / 5, Xmarker, Ymarker, Areamarker, grad); break
                        }

                    }
                }
                c.shapeA(Xmarker, Ymarker, 45, 4, areasize, lbarstroke, lbarfill, lline, shadow);
                c.restore();
            }

            var ODout = Data[i];
            if (legendposition != "none" && legendposition != "off") {
                switch (chart) {
                    case "barline":
                        if (Data == ObjectData) {
                            //line legend
                            if (OD.charttype == "line") markerlegend(this, option, Xmarker, Ymarker, ODout, chart, ID, Areamarker);
                                //bar legend
                            else if (OD.charttype == "bar"
                                || OD.charttype == undefined) squarelegend(this, option, Xmarker, Ymarker, Data, i, chart, ID, Areamarker);
                        }
                        else if (Data == data) {
                            //line legend
                            if (ObjectData[0].charttype == "line") markerlegend(this, option, Xmarker, Ymarker, ODout, chart, ID, Areamarker);
                                //bar legend
                            else if (ObjectData[0].charttype == "bar"
                                || ObjectData[0].charttype == undefined) squarelegend(this, option, Xmarker, Ymarker, Data, i, chart, ID, Areamarker);
                        }
                        break;
                    //case "radar":
                    //    if (Data == ObjectData) {
                    //        markerlegend(this, Data);
                    //    }
                    //    else if (Data == data) {
                    //        markerlegend(this, Data);
                    //    }
                    //    break;
                    case "bubble": case "scatter": case "radar":
                        markerlegend(this, option, Xmarker, Ymarker, ODout, chart, ID, Areamarker);
                        break;
                    default:
                        squarelegend(this, option, Xmarker, Ymarker, Data, i, chart, ID, Areamarker);
                        break;
                }

                //this.Text(labellegend, ltextX, ltextY, 0, legendfont.color, null, 0, lalign, lbaseline, legendfont);
                //this.TextWrap(R.text, Rbase, round(h * 0.5), 90, R.width, R.color, R.stroke, "center", "hanging", R, h, TextFontHeight(this, R)); //parseInt(this.FontHeight(legendfont))
                this.TextWrap(labellegend, ltextX, ltextY, 0, 0, legendfont.color, null, lalign, lbaseline, legendfont, conwlegend, parseInt(this.FontHeight(legendfont)), true);
                //c.prototype.TextWrap = function (text, x, y, rotate, textwidth, fill, stroke, align, baseline, font, maxWidth, lineHeight, letter)
                //c.prototype.Text = function (text, x, y, rotate, fill, stroke, strokewidth, align, baseline, font)
            } //end legend position display

            elementlegend = {
                x: ltextX
                , y: ltextY
            }
            mouseclick(ID, chart, option);
        } //end for loop
    } //end legend function

    c.prototype.BubbleGridCut = function (conw, conh, vmovey, vposition, xnumbase, numbaseB) {
        this.clearRect(0, 0, conw, vmovey);
        this.clearRect(0, vposition + 1, conw, conh);
        this.clearRect(0, 0, xnumbase + 2, conh);
        this.clearRect(numbaseB - 2, 0, conw, conh);
    }

    //Gradient Check
    c.prototype.GradientCheck = function (array, centerX, centerY, area) {
        var GradX = centerX - (area);
        var GradY = centerY - (area);
        var GradDX = centerX - (area * 0.5);
        var GradDY = centerY - (area * 0.5);
        var gtypeout = array.gradienttype || "linear a";
        gtypeout = gtypeout.toLowerCase();
        //console.log(gtypeout)
        switch (gtypeout) {
            case "linear a": fill = this.GradientLinear(0, GradY, area, area * 2, array.fill, true, false); break
            case "linear b": fill = this.GradientLinear(0, GradY, area, area * 2, array.fill, false, false); break
            case "linear c": fill = this.GradientLinear(GradX, 0, area * 2, area, array.fill, true, true); break
            case "linear d": fill = this.GradientLinear(GradX, 0, area * 2, area, array.fill, false, true); break
            case "linear e": fill = this.GradientLinear(GradDX, GradY, area * 2.5, area * 2.5, array.fill, false, true, true); break
            case "linear f": fill = this.GradientLinear(GradDX, GradY, area * 2.5, area * 2.5, array.fill, true, true, true); break
            case "linear g": fill = this.GradientLinear(GradDX, GradDY, area * 2.5, area * 2.5, array.fill, false, false, true); break
            case "linear h": fill = this.GradientLinear(GradDX, GradDY, area * 2.5, area * 2.5, array.fill, true, false, true); break
            case "radial": fill = this.GradientCircle(centerX, centerY, area / 5, centerX, centerY, area, array.fill); break
        }
        return fill
    }

    //3D Bar
    c.prototype.Bar3D = function (x, y, width, height, area, rotate, fill, stroke, linewidth, dash, shadow, vertical, scaleY, option, group, ic, i, chart, Garray, Glength) {
        var Gout = Garray[ic - 1];
        group = group || 1;
        ic = ic || 1;
        var group3D = group3dstack(option, i);
        var OD = option.ObjectData.length,
            data = dataarrayoutput(option),
            ObjectData = option.ObjectData;
        //var Gout = groupout(option);
        var datainput = DataInput(data, i, ic);

        var valueuptotal = ValueTotal(option, chart, "up"),
            valuedowntotal = ValueTotal(option, chart, "down");

        //side = side || false;
        var stacked = option.stacked || false,
            percentstack = option.percentstack || false;
        vertical = vertical || false;
        scaleY = scaleY || 1;
        shadow = shadow || nullshadow;
        var WidthA, WidthB, HeightA, HeightB;
        var areaA = area / 100,
            areaB = 1 - areaA,
            WidthA = WidthFix(width, height, areaA, true, true, vertical),
            WidthB = WidthFix(width, height, areaA, false, true, vertical),
            HeightA = HeightFix(width, height, areaA, true, true, vertical),
            HeightB = HeightFix(width, height, areaA, false, true, vertical);
        var xadd = width / 2,
            yadd = height / 2;

        var xA = x + xadd, yA = y + yadd,
            xB = 0 - xadd, yB = 0 - yadd;

        var xe = xB + width,   // x-end
            ye = yB + height,  // y-end
            xm = xB + xadd,    // x-middle
            ym = yB + yadd;    // y-middle

        this.save();
        this.translate(xA, yA);
        var quadtop = [];
        var quadside = [];
        var recout = {};
        if (height >= 0) {
            if (width >= 0) {
                if (vertical) {
                    recout.x = xB + WidthA - 0.5,
                    recout.y = (yB + HeightA) - 0.5,
                    recout.width = WidthB + 1,
                    recout.height = height + 1;

                    quadtop.push({ x: xB + WidthA, y: yB + HeightA - 0.5 });
                    quadtop.push({ x: xB, y: yB });
                    quadtop.push({ x: xB + WidthB - 0.5, y: yB });
                    quadtop.push({ x: xe - 0.5, y: yB + HeightA - 0.5 });

                    quadside.push({ x: parseInt(xB) - 0.5, y: yB });
                    quadside.push({ x: parseInt(xB) - 0.5, y: yB + HeightB });
                    quadside.push({ x: xB + WidthA - 0.5, y: parseInt(ye) - 0.5 });
                    quadside.push({ x: xB + WidthA - 0.5, y: yB + HeightA - 0.5 });
                }
                else {
                    recout.y = (yB + HeightA) - 0.5;
                    recout.height = HeightB + 1;
                    //recout.width = WidthB;

                    var xout;
                    if (stacked || percentstack) {
                        var valueout = DataInput(data, i, ic);
                        if (valuedowntotal > valueuptotal) {
                            if (valuedowntotal == data.length) {
                                xB;
                            }
                            else {
                                if (valueout < 0) xB += WidthA;
                            }
                        }
                        else {
                            if (valueuptotal == data.length) {
                                xB
                            }
                            else {
                                if (valueout > 0) xB //-= WidthA;
                            }
                        }

                        if (Gout == 1) {
                            recout.x = xB - 0.5;
                            recout.width = WidthB;
                        }
                        //else if (group > 1 && group < MaxArray(group3D)) {
                        //    recout.x = xB - WidthA - 0.5;
                        //    recout.width = width;
                        //}
                        else {
                            recout.x = xB - WidthA - 0.5;
                            recout.width = width;
                        }

                        if (Gout != 1) {
                            quadtop.push({ x: xB - WidthA, y: yB + HeightA - 0.5 });
                            quadtop.push({ x: xB, y: yB });
                        }
                        else {
                            quadtop.push({ x: xB, y: yB + HeightA - 0.5 });
                            quadtop.push({ x: xB + WidthA, y: yB });
                        }
                    }
                    else {
                        quadtop.push({ x: xB, y: yB + HeightA - 0.5 });
                        quadtop.push({ x: xB + WidthA, y: yB });
                        recout.x = xB - 0.5;
                        recout.width = WidthB;
                    }

                    quadtop.push({ x: parseInt(xe) - 0.5, y: yB });
                    quadtop.push({ x: xB + WidthB - 0.5, y: yB + HeightA - 0.5 });

                    //if (!stacked
                    //    || (stacked && group == MaxArray(group3D))) {
                        quadside.push({ x: parseInt(xe) - 0.5, y: yB });
                        quadside.push({ x: parseInt(xe) - 0.5, y: yB + HeightB });
                        quadside.push({ x: xB + WidthB - 0.5, y: parseInt(ye) + 0.5 });
                        quadside.push({ x: xB + WidthB - 0.5, y: yB + HeightA - 0.5 });
                    //}

                }
            }
            else {
                recout.y = (yB + HeightA) - 0.5;
                recout.height = HeightB;

                if (stacked || percentstack) {
                    if (Gout == Glength) {
                        recout.x = xB + WidthA - 0.5;
                        recout.width = WidthB + 0.5;

                        quadtop.push({ x: xB + WidthA - 0.5, y: yB + HeightA - 0.5 });
                        quadtop.push({ x: xB - 0.5, y: yB });

                        quadtop.push({ x: xB + WidthB - 0.5, y: yB });
                        quadtop.push({ x: xe - 0.5, y: yB + HeightA - 0.5 });
                    }
                    else {
                        recout.x = xB /*+ WidthA*/ - 0.5;
                        recout.width = width - 1.5;

                        quadtop.push({ x: xB /*+ WidthA*/ - 0.5, y: yB + HeightA - 0.5 });
                        quadtop.push({ x: xB - WidthA - 0.5, y: yB });

                        quadtop.push({ x: xe - WidthA - 0.5, y: yB });
                        quadtop.push({ x: xe /*+ WidthA*/ - 0.5, y: yB + HeightA - 0.5 });
                    }
                }
                else {
                    recout.x = xB + WidthA + 0.5;
                    recout.width = width;
                    quadtop.push({ x: xB + WidthB - 0.5, y: yB });
                    quadtop.push({ x: xe - 0.5, y: yB + HeightA - 0.5 });
                }

                if ((!stacked && !percentstack)
                    || ((stacked || percentstack) && (Gout == 1))) {
                    quadside.push({ x: parseInt(xB) - 0.5, y: yB });
                    quadside.push({ x: parseInt(xB) - 0.5, y: yB + HeightB });
                    quadside.push({ x: xB + WidthA - 0.5, y: parseInt(ye) - 0.5 });
                    quadside.push({ x: xB + WidthA - 0.5, y: yB + HeightA - 0.5 });
                }
            }
        }
        else {
            if (width >= 0) {
                recout.x = xB - 0.5,
                recout.y = yB - 0.5,
                recout.width = WidthB + 1,
                recout.height = height + 1;
                if (scaleY < 0) {

                    var countout = 0;
                    //var currentgroup = ObjectData[ic - 1].group.ID;
                    //ObjectData[ic - 1].group.ID;

                    //var ODgrouparray = [];
                    //for (var j = 1; j <= gtotalresult.length; j++) {
                    //    var ODcurrentgroup = [];
                    //    for (var k = 0; k < ObjectData.length; k++) {
                    //        if (ObjectData[k].group.ID == j) {
                    //            ODcurrentgroup.push(ObjectData[k])
                    //        }
                    //    }
                    //    ODgrouparray.push(ODcurrentgroup)
                    //}

                    if ((!stacked && !percentstack)
                        || ((stacked || percentstack) && (Gout == 1))) {

                        quadtop.push({ x: xB, y: yB });
                        quadtop.push({ x: xB + WidthB - 0.5, y: yB });
                        quadtop.push({ x: xe - 0.5, y: yB - HeightA - 0.5 });
                        quadtop.push({ x: xB + WidthA, y: yB - HeightA - 0.5 });
                    }
                    //quadtop.push({ x: xB, y: yB });
                    //quadtop.push({ x: xB + WidthB - 0.5, y: yB });
                    //quadtop.push({ x: xe - 0.5, y: yB - HeightA - 0.5 });
                    //quadtop.push({ x: xB + WidthA, y: yB - HeightA - 0.5 });

                    quadside.push({ x: parseInt(xe) - 0.5, y: yB - HeightA - 0.5 });
                    quadside.push({ x: parseInt(xe) - 0.5, y: yB + HeightB });
                    quadside.push({ x: xB + WidthB - 0.5, y: parseInt(ye) - 0.5 });
                    quadside.push({ x: xB + WidthB - 0.5, y: yB - 0.5 });
                }
                else {
                    
                    quadtop.push({ x: xB + WidthA - 0.5, y: ye + HeightA });
                    quadtop.push({ x: xe - 0.5, y: ye + HeightA });
                    quadtop.push({ x: xB + WidthB - 0.5, y: parseInt(ye) - 0.5 });
                    quadtop.push({ x: xB, y: parseInt(ye) - 0.5 });

                    quadside.push({ x: parseInt(xe) - 0.5, y: ye + HeightA });
                    quadside.push({ x: parseInt(xe) - 0.5, y: yB + HeightA - 0.5 });
                    quadside.push({ x: xB + WidthB - 0.5, y: yB });
                    quadside.push({ x: xB + WidthB - 0.5, y: parseInt(ye) - 0.5 });
                }
            }
            else {
                recout.x = xB - 0.5,
                recout.y = yB - 0.5,
                recout.width = WidthB + 1,
                recout.height = HeightB + 1;

                quadtop.push({ x: xB + WidthA, y: parseInt(ye) - 0.5 });
                quadtop.push({ x: parseInt(xe) - 0.5, y: parseInt(ye) - 0.5 });
                quadtop.push({ x: xB + WidthB - 0.5, y: yB + HeightB });
                quadtop.push({ x: xB, y: yB + HeightB });

                quadside.push({ x: parseInt(xe) - 0.5, y: parseInt(ye) - 0.5 });
                quadside.push({ x: parseInt(xe) - 0.5, y: yB + HeightA - 0.5 });
                quadside.push({ x: xB + WidthB - 0.5, y: yB });
                quadside.push({ x: xB + WidthB - 0.5, y: yB + HeightB });

            }
        }

        //shadow
        //top
        this.polygon(quadtop, fill, stroke, linewidth, dash, shadow);

        //side
        this.polygon(quadside, fill, stroke, linewidth, dash, shadow);

        //front
        this.save();
        this.beginPath();
        this.fillStyle = fill;
        this.strokeStyle = stroke;
        this.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
        this.rect(recout.x, recout.y, recout.width, recout.height);
        this.lineWidth = linewidth;
        this.lineJoin = "bevel";
        this.setLineDash(dash);
        this.fill();
        if (linewidth > 0) this.stroke();
        this.closePath();
        this.restore();

        //top
        this.polygon(quadtop, "rgba(0, 0, 0, 0.25)", stroke, linewidth, dash, nullshadow);

        //side
        this.polygon(quadside, "rgba(0, 0, 0, 0.5)", stroke, linewidth, dash, shadow);

        this.restore();
    }

    //polygon
    c.prototype.polygon = function (p, fill, stroke, linewidth, dash, shadow, close) {
        close = close || false;
        shadow = shadow || nullshadow;
        fill = fill || rgba(0, 0, 0, 0);
        this.save();
        this.beginPath();
        this.fillStyle = fill;
        this.strokeStyle = stroke;
        for (var i = 0; i < p.length; i++) {
            if (i == 0)
                this.moveTo(p[0].x, p[0].y);
            else
                this.lineTo(p[i].x, p[i].y);
        }
        //this.lineTo(p[0].x, p[0].y);
        this.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
        this.fill();
        this.lineWidth = linewidth;
        this.setLineDash(dash);
        this.lineJoin = "bevel";
        if (linewidth > 0) this.stroke();
        if (close) this.closePath();
        this.restore();
    }

})(CanvasRenderingContext2D);

var nulltext = {
    fontFamily: ""
    , text: ""
};

var nullshadow = {};
nullshadow.x = 0;
nullshadow.y = 0;
nullshadow.blur = 0;
nullshadow.color = "Black";

//Number Sorting
function sortNumber(a, b) {
    return a - b;
}

function OvalTB(c, x, y, width, height, area, fill, stroke, linewidth, dash, shadow, vertical) {
    var xadd = width / 2,
        yadd = height / 2,
        areaA = area / 100,
        areameasure = 0.25;
    var start = toRadians(angleresult(0)) * 0.5;
    var end = toRadians(angleresult(360)) - start;
    c.save();
    HeightA = width * areaA;
    WidthA = height * areaA;
    var areaarc, xPos, yPos, xA, xB, yA, yB;
    c.strokeStyle = stroke;
    c.beginPath();
    var xPosInput = function (xA, xB, i, rad){
        return (xA - (xB * sin(i)) * sin(rad)) + ((xB * cos(i)) * cos(rad));
    };
    var yPosInput = function (yA, yB, i, rad){
        return (yA - (yB * cos(i)) * sin(rad)) + ((yB * sin(i)) * cos(rad));
    };
    if (vertical){
        areaarc = HeightA * areameasure,
        xA = x + xadd, 
        xB = xadd, 
        yA = y, 
        yB = areaarc;
    } else {
        areaarc = WidthA * areameasure,
        xA = x, 
        xB = areaarc, 
        yA = y + yadd, 
        yB = yadd;
    }
    for (var i = start; i < end; i += 0.01) {
        xPos = xPosInput(xA, xB, i, start);
        yPos = yPosInput(yA, yB, i, start);
        if (i == 0) {
            c.moveTo(xPos, yPos);
        } else {
            c.lineTo(xPos, yPos);
        }
    }

    c.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
    c.fillStyle = fill;
    c.fill();
    c.lineWidth = linewidth;
    c.setLineDash(dash);
    if (linewidth > 0) c.stroke();
    c.closePath();
    c.restore();
}

function makeArrow(length, lineHeight, arrowLength, arrowHeight, fillcolor, strokecolor, linewidth, ID) {
    var lineTop = ((arrowHeight - lineHeight) / 2);
    var arrowLeft = (length - arrowLength);
    var c = document.createElement(ID);
    var ctx = c.getContext("2d");
    c.width = parseInt(length);
    c.height = parseInt(arrowHeight);

    ctx.fillStyle = fillcolor;
    ctx.strokeStyle = strokecolor;
    ctx.lineWidth = linewidth;
    ctx.beginPath();
    ctx.moveTo(4 + linewidth, lineTop);
    ctx.lineTo(arrowLeft, lineTop);
    ctx.lineTo(arrowLeft, 4 + linewidth);
    ctx.lineTo(parseInt(length) - (linewidth), (arrowHeight / 2));
    ctx.lineTo(arrowLeft, (arrowHeight) - (4 + linewidth));
    ctx.lineTo(arrowLeft, (lineTop + lineHeight));
    ctx.lineTo(4 + linewidth, (lineTop + lineHeight));
    ctx.closePath();
    ctx.fill();
    if (linewidth > 0) ctx.stroke();
    return (c);
}

//Get Cursor Position
function getCursorPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    return {
        x: x,
        y: y
    }
}

//Value
function convertnum(value, precision) {
    var zero = /.0/g;
    var T = (value / 1E12).toFixed(2) + "T";
    if (T.match(zero)) T = (value / 1E12) + "T";
    var B = (value / 1E9).toFixed(2) + "B";
    if (B.match(zero)) B = (value / 1E9) + "B";
    var M = (value / 1E6).toFixed(2) + "M";
    if (M.match(zero)) M = (value / 1E6) + "M";
    var k = (value / 1E3).toFixed(2) + "k";
    if (k.match(zero)) k = (value / 1E3) + "k";
    //var d;
    //var v = (value).toFixed(1);
    //if (v.match(zero)) d = parseInt(value);
    //else d = localestring(value, precision);
    var d = localestring(value, precision);
    if (d.match(zero)) d = parseInt(value);
    return value = (value >= 1E12) ? T
        : (value >= 1E9) ? B
        : (value >= 1E6) ? M
        : (value >= 1E3) ? k
        : (value <= -1E12) ? T
        : (value <= -1E9) ? B
        : (value <= -1E6) ? M
        : (value <= -1E3) ? k
        : (value > -1E3) ? d
        : d; //if (value < 1E3)
}

//Grid and Height Computation
function ComputeCheck(option, length, max, min, xy) {
    var percentstack = option.percentstack;
    var minheightLine;
    if (xy == "x") {
        if (percentstack) minheightLine = 30;
        else minheightLine = 60; //50
    }
    else if (xy == "y") {
        if (percentstack) minheightLine = 50;
        else minheightLine = 100;
    }

    var maxGridLine = parseInt(length / minheightLine);
    var minGridline = maxGridLine - 1;

    var computed = max / maxGridLine;
    if (min < 0) var computed = (max + abs(min)) / maxGridLine;
    for (var i = 0; i <= 1000; i++) {
        /*if (pow(10, i) * 0.1 >= computed) {
            return pow(10, i) * 0.1;
            break;
        }
        else if (pow(10, i) * 0.5 >= computed) {
            return pow(10, i) * 0.5;
            break;
        }
        else*/ if (pow(10, i) >= computed) {
            return pow(10, i);
            break;
        }
        /*else if (pow(10, i) * 1.5 >= computed) {
            return pow(10, i) * 1.5;
            break;
        }*/
        else if (pow(10, i) * 2 >= computed) {
            return pow(10, i) * 2;
            break;
        }
        else if (pow(10, i) * 3 >= computed) {
            return pow(10, i) * 3;
            break;
        }
        else if (pow(10, i) * 5 >= computed) {
            return pow(10, i) * 5;
            break;
        }
    }
}

function VarPcount(option, height, max, min, xy) {
    var ic = 1;
    var varCompute = ComputeCheck(option, height, max, min, xy);
    for (var i = ic; i <= 10; i++) {
        var P = varCompute * i;
        if (varCompute * i >= max) {
            break;
        }
    }
    return P;
}

function LineCount(option, length, max, min, xy) {
    var varCompute = ComputeCheck(option, length, max, min, xy);
    var line = 1;
    for (var i = 1; i <= 10; i++) {
        line++;
        if (varCompute * i >= max) {
            break;
        }
    }

    if (min < 0) {
        for (var i = 1; i <= 10; i++) {
            if (varCompute * i >= abs(min)) {
                line++;
                break;
            }
            line++;
        }
    }
    return line;
}

//Data Output
function DataOutput(option) {
    var data = option.data,
        ObjectData = option.ObjectData;

    var datacolorarray = [];
    var datamarkerarray = [];
    var datacoloradd = 0;
    var datamarkeradd = 0;
    for (var i = 0; i < data.length; i ++) {
        if (data[i].fillcolor != undefined) {
            datacolorarray.push(1);
        }
        else {
            datacolorarray.push(0);
        }


        if (data[i].marker != undefined) {
            datamarkerarray.push(1);
        }
        else {
            datamarkerarray.push(0);
        }

        datacoloradd += datacolorarray[i];
        datamarkeradd += datamarkerarray[i];
    }

    if (datacoloradd > 0 || datamarkeradd > 0) return data;
    else return ObjectData;
}

//Even
function isEven(n) {
    return n % 2 == 0;
}

//Odd
function isOdd(n) {
    return Math.abs(n % 2) == 1;
}

//Hover Function
function p8check(a) {
    var p8animate = a.getAttribute("p8animate", false);
    var p8draw = a.getAttribute("p8draw", false);
    if (p8animate == "true") p8animate = false;
    if (p8draw != "true") p8draw = false;
}

function mouseclick(ID, chart, option, list) {
    var m = ElementID(ID);

    m.addEventListener("mousedown", function (event) {
        var coordinates = getCursorPosition(m, event);
        var y = coordinates.y;
        var x = coordinates.x;
        //alert("x: " + x + "  y: " + y);

        if (y > element.y && y < element.y + element.height && x > element.x && x < element.x + element.width) {

        }
    }, false);
}

function mouseevent(ctx, option, list, type) {
    var canvasIDcon = option.canvasID,
        defoption = defaultinput(canvasIDcon, type),
        precision = option.precision,
        hoverfont = option.hoverfont,
        ObjectData = option.ObjectData,
        data = option.data,
        total = option.totaldisplay,
        legendfont = option.legendfont,
        legendposition = option.legendposition,
        customXY = option.customXY || false,
        optionH = option.header,
        optionSH = option.subheader,
        optionLL = option.labelleft,
        optionLR = option.labelright,
        optionF = option.footer,
        iscanvas = option.iscanvas,
        animation = option.animation,
        canvasID = (iscanvas) ? option.cID : canvasIDcon + "_canvas";
    var a = ElementID(canvasID);
    var h = ElementID(canvasID);
    //console.log(canvasID)

    var customX, customY, conw, conh;
    if (customXY) {
        customX = 0//option.x,
        customY = 0//option.y;
    }
    else {
        customX = 0,
        customY = 0;
    }
    conw = option.size.width,
    conh = option.size.height;

    var divtooltip = document.createElement("div");
    divtooltip.className = "tooltip";

    if (type == "piedoughnut"
        || type == "pie"
        || type == "doughnut"
        || type == "cone"
        || type == "pyramid"
        || type == "cylinder") ObjectData = option.data;

    var Data = DataOutput(option);
    total = total || false;
    precision = precision || 0;

    var GArray = GroupArray(ObjectData);
    var gtotalmax = MaxArray(GroupArrayTotal(GArray));

    var gtotalresult = removeDuplicate(GArray).toString().split(",").map(Number);
    var gtotalresultmax = MaxArray(gtotalresult);

    function canvasinput(canvasname/*, hoverfont*/) {
        return "<canvas id='"
            + canvasname + "'>"
            //+ " width='"
            //+ hoverfont.fontSize
            //+ "' height='"
            //+ hoverfont.fontSize
            //+ "' >"
            + "</canvas>"
    }

    function ShapeFill(filltype, gradienttype, fill, type, pattern) {
        var gtypeout = gradienttype || "linear a";
        switch (gtypeout) {
            case "linear a":
                gradout = "to bottom,";
                break;
            case "linear b":
                gradout = "to top,";
                break;
            case "linear c":
                gradout = "to left,";
                break;
            case "linear d":
                gradout = "to right,";
                break;
            case "linear e":
                gradout = "to bottom right,";
                break;
            case "linear f":
                gradout = "to top left,";
                break;
            case "linear g":
                gradout = "to bottom left,";
                break;
            case "linear h":
                gradout = "to top right,";
                break;
            case "radial":
                gradout = "";
                break;
        }

        var linrad;
        if (includes(gtypeout, "linear"))
            linrad = "linear";
        else if (includes(gtypeout, "radial"))
            linrad = "radial";

        filltype = filltype || "color";
        var fillout, output;
        switch (filltype) {
            case "color":
                output = fill;
                break
            case "gradient":
                var gradcolorlist = [];
                for (var k = 0; k < fill.length; k++) {
                    gradcolorlist.push(fill[k].color);
                }

                if (type == "pie" 
                    || type == "doughnut"
                    || type == "cone"
                    || type == "pyramid"
                    || type == "cylinder")
                    fillout = gradcolorlist;
                else
                    fillout = fill;

                //var browsertype = [];
                //browsertype.push("-webkit-");
                //browsertype.push("-moz-");
                //browsertype.push("-ms-");
                //browsertype.push("-o-");
                //browsertype.push("");

                //var tout = "";
                //for (var k = 0; k < browsertype.length; k++) {
                //    tcolorin = browsertype[k] + linrad + "-gradient(" + gradout + fillout + ")";
                //    tout += tcolorin;
                //}
                //output = linrad + "-gradient( to the left, " + fillout + ")";
                output = linrad + "-gradient(" + gradout + fillout + ")";
                break
        }
        return output//"<td id = '" + patternout + "' style = '" + output + "'>" + innercanvas + " </td>"
    }
    var txtalignA = "center";

    var borderradius = 0//2;

    var top, bottom, left, right;
    var Htop, SHtop;

    optionH.display = optionH.display || false;
    optionSH.display = optionSH.display || false;
    optionF.display = optionF.display || false;

    if (optionH.display)
        Htop = ctx.wrapTextHeight(optionH.text, 10, conw, ctx.FontHeight(optionH), false);
    else
        Htop = 10;

    if (optionSH.display)
        SHtop = ctx.wrapTextHeight(optionSH.text, 10 + Htop, conw, ctx.FontHeight(optionSH), false);
    else
        SHtop = 10;
    var canvastop = (Htop + (SHtop * 0.6));
    var canvasbottom;
    if (optionF.display)
        canvasbottom = ctx.wrapTextHeight(optionF.text, 10, conw, ctx.FontHeight(optionF), false);
    else
        canvasbottom = 10;
    //var legendfontheight = ctx.FontHeight(legendfont);
    //switch (legendposition) {
    //    case "top":
    //        top = canvastop + (legendfontheight); //40
    //        bottom = canvasbottom; //320
    //        break
    //    case "bottom":
    //        top = canvastop;
    //        bottom = canvasbottom - (legendfontheight); //320
    //        break
    //    default:
    //        top = canvastop;
    //        bottom = canvasbottom; //320
    //}
    //var radius;
    //if (conh < conw)
    //    radius = conh;
    //else
    //    radius = conw;

    var legendfontheight;

    var labellegendnum = legendarraynum(ctx, option, type);

    if (legendfont.display) {
        legendfontheight = TextFontHeight(ctx, legendfont) * (MaxArray(labellegendnum));
    }
    else {
        legendfontheight = 0;
    }

    var radius;
    if (conh < conw) {
        radius = (conh + customY)
    }
    else {
        radius = (conw + customX)
    }

    var moveX, moveY;
    switch (legendposition) {
        case "top":
            top = canvastop + (legendfontheight); //40
            bottom = canvasbottom; //320
            moveX = conw * 0.5;
            moveY = (conh * 0.5) + (legendfontheight);
            break
        case "bottom":
            top = canvastop;
            bottom = canvasbottom + (legendfontheight); //320
            moveX = conw * 0.5;
            moveY = (conh * 0.5) - (legendfontheight);
            break
        case "left":
            top = canvastop;
            bottom = canvasbottom; //320
            if (conh < conw) moveX = conw * 0.5;
            else moveX = (conw * 0.5);

            moveY = conh * 0.5;
            break
        case "right":
            top = canvastop;
            bottom = canvasbottom; //320
            if (conh < conw) moveX = conw * 0.5;
            else moveX = (conw * 0.5);

            moveY = conh * 0.5;
            break
        default:
            top = canvastop;
            bottom = canvasbottom; //320
            moveX = conw * 0.5;
            moveY = conh * 0.5;
    }
    var xmeasure, radiusmeasure;

    var mid = {
        x: moveX + customX
        , y: moveY + customY
        , r: parseInt((radius * 0.5) - (top + bottom))//* 0.35
    }

    h.addEventListener("mousemove", function (event) {
        p8check(h);
        var coordinates = getCursorPosition(h, event);
        var y = coordinates.y //+ customY;
        var x = coordinates.x //+ customX;
        var IDout;

        var eh = ElementID(canvasIDcon + "_hover");
        eh.style.borderRadius = borderradius + "px";
        eh.style.position = "absolute";
        eh.style.background = hoverfont.background || rgba(255, 255, 255, 0.75);
        eh.style.fontFamily = hoverfont.fontFamily;
        eh.style.fontSize = hoverfont.fontSize + "px";
        eh.style.fontWeight = hoverfont.fontWeight;
        eh.style.fontStyle = hoverfont.fontStyle;
        eh.style.color = hoverfont.color;

        //var ptag = document.getElementsByTagName("P");
        //ptag.style.textAlign = "ceonter"

        function MeasureTableWidth(x, conw, eh) {
            var outputX;
            if (x >= 0 && x <= (conw - eh.offsetWidth)) {
                outputX = x + "px";
            }
            else if (x > (conw - eh.offsetWidth) && x <= conw) {
                outputX = (x - eh.offsetWidth) + "px";
            }
            return outputX
        }

        function MeasureTableHeight(y, conh, eh) {
            var outputY;
            if (y >= 0 && y <= (conh - (eh.offsetHeight + 27))) {
                outputY = y + 27 + "px";
            }
            else if (y > (conh - (eh.offsetHeight + 27)) && y <= conh) {
                outputY = (y - eh.offsetHeight) + "px";
            }
            return outputY
        }

        function ifstringout(ifinput, textout) {
            ifinput = ifinput || "";
            if (ifinput === "") return "";
            else return " " + textout + "='" + ifinput + "'";
        }

        function tdout(text, value, Class, ID) {
            text = text || "";

            var valueout = ifstringout(value, "value"),
                classout = ifstringout(Class, "class"),
                IDout = ifstringout(ID, "id");

            return "<td"
                + IDout
                + classout
                + valueout
                + ">" + text + "</td>"
        }

        function troutput(array) {
            var arrayout = "";
            for (var i = 0; i < array.length; i++) {
                arrayout += array[i].toString();
            }
            return "<tr>" + arrayout + "</tr>"
        }

        var tcolor;
        var yarc = y - mid.y,
            xarc = x - mid.x;
        var dist = Math.sqrt(pow(xarc, 2) + pow(yarc, 2));
        var ang = Math.atan2(yarc, xarc);
        var angletan = 0;
        if (type == "piedoughnut"
            || type == "pie"
            || type == "doughnut") {
            ang += (toRadians(360) + toRadians((option.degrees - 180) * -1))//PI * 2.5;
            //ang += (toRadians(360) + toRadians(-option.degrees))//PI * 2.5;
            ang %= toRadians(360);

            var total = 0;
            for (var i = 0; i < data.length; i++) {
                var datavalue = data[i].value;
                if (datavalue < 0) datavalue = 0;
                total += datavalue;
            }
            var value = []
            for (var i = 0; i < data.length; i++) {
                var datavalue = data[i].value;
                if (datavalue < 0) datavalue = 0;
                value.push({
                    angle: abs(datavalue / total) * (PI * 2)
                    , value: data[i].value
                    , name: data[i].name
                });
            }
            var hovercanvas;
            var txtinput = "", txtoutput;
            var i = 0;
            while (i < data.length - 1) {
                if (ang < angletan + (value[i].angle)) {
                    break;
                }
                angletan += value[i].angle;
                i += 1;
            }
            if (dist < mid.r) {
                var canvasname = "tabledraw";
                //hovercanvas = canvasinput(canvasname, hoverfont);

                tcolor = ShapeFill(data[i].filltype, data[i].gradienttype, data[i].fill, type, "square");
                var degrees = option.degrees;
                if (degrees <= 0) degrees = 0;
                var offsetrad = (angletan + toRadians(degrees - 180)) + (value[i].angle * 0.5);
                offsetX = cos(offsetrad) * (mid.r);
                offsetY = sin(offsetrad) * (mid.r);

                var elementinputwidth = (hoverfont.fontSize * 2) + ctx.FontWidth(element.name + ":" + element.value, hoverfont);
                var elementinputheight = (TextFontHeight(ctx, hoverfont) + (hoverfont.fontSize * 0.5)) * 0.5;

                //redraw with tooltip
                eh.style.marginLeft = (mid.x + offsetX) - (elementinputwidth * 0.5) + "px"//
                eh.style.marginTop = (mid.y + offsetY) - (elementinputheight * 0.5) + "px"//

                var tdarray = [];
                tdarray.push(tdout("", null, "colorfill_" + canvasIDcon, null));
                tdarray.push(tdout(data[i].name + ": ", null, "name_" + canvasIDcon, null));
                tdarray.push(tdout(data[i].value, null, "value_" + canvasIDcon, null));
                //tdarray.push(tdout("(" + ((data[i].value / total) * 100).toFixed(2) + "%)", null, "percent_" + canvasIDcon, null));
                tdarray.push(tdout("(" + Percent(data[i].value, total).toFixed(2) + "%)", null, "percent_" + canvasIDcon, null));

                txtinput = troutput(tdarray);

                txtoutput = "<table class='center'>" + txtinput + "</table>";

                eh.style.display = "inline";//"block";
                eh.innerHTML = "<div class='tooltip'>" + txtoutput + "</div>";

                var boxsize = hoverfont.fontSize;
                var s = document.getElementsByClassName("colorfill_" + canvasIDcon);
                s[0].style.background = tcolor;
                s[0].style.width = boxsize + "px";

                var hname = document.getElementsByClassName("name_" + canvasIDcon);

                var hvalue = document.getElementsByClassName("value_" + canvasIDcon);

                var hpercent = document.getElementsByClassName("percent_" + canvasIDcon);

                hname[0].style.fontSize = hoverfont.fontSize;
                hname[0].style.fontStyle = hoverfont.fontStyle;
                hname[0].style.fontFamily = hoverfont.fontFamily;
                hname[0].style.fontWeight = hoverfont.fontWeight;

                hvalue[0].style.fontSize = hoverfont.fontSize;
                hvalue[0].style.fontStyle = hoverfont.fontStyle;
                hvalue[0].style.fontFamily = hoverfont.fontFamily;
                hvalue[0].style.fontWeight = hoverfont.fontWeight;

                hpercent[0].style.fontSize = hoverfont.fontSize;
                hpercent[0].style.fontStyle = hoverfont.fontStyle;
                hpercent[0].style.fontFamily = hoverfont.fontFamily;
                hpercent[0].style.fontWeight = hoverfont.fontWeight;

            }
        }
        else if (type == "radar") {
            var total = MaxArray(data);

            var max = MaxMin(option, type, true);
            var angledata = abs(1 / data.length) * (PI * 2);
            var i = 0;
            var angletan = 0;
            var angletanmeasure = 0;
            //console.log(toDegrees(angledata * 0.5))
            ang += (toRadians(360) + toRadians(90 + toDegrees(angledata * 0.5)))//PI * 2.5;
            ang %= toRadians(360);

            //ang -= (angledata * 0.5);
            while (i < data.length - 1) {
                if (ang < angletanmeasure + angledata) {
                    break;
                }
                angletanmeasure += angledata;
                angletan += angledata;
                i += 1;
            }

            var offsetrad = angletan + (toRadians(-90));
            offsetX = cos(offsetrad) * (mid.r);
            offsetY = sin(offsetrad) * (mid.r);
            //console.log(Math.ceil(toDegrees(ang)) + " " + toDegrees(angletan + (angledata)))

            //vA = this.TBPosition(option, chart, "top"), //+ Vpercent3d;
            //vB = this.TBPosition(option, chart, "bottom");

            //var area = conh * 0.45 - (vA + vB);

            if (dist < mid.r) {
                //redraw with tooltip
                eh.style.marginLeft = ((conw * 0.5) + offsetX) - (eh.offsetWidth * 0.5) + "px"//
                eh.style.marginTop = ((conh * 0.5) + offsetY) - (eh.offsetHeight * 0.5) + "px"//

                //eh.style.marginLeft = x + 12 + "px"//
                //eh.style.marginTop = y + 12 + "px"//

                var txtout = "";

                for (var j = 0; j < ObjectData.length; j++) {
                    var canvasname = "tabledraw" + j;
                    //hovercanvas = canvasinput(canvasname, hoverfont);

                    var fillout, filltypeout, gradienttypeout;
                    if (ObjectData[j].area)
                        fillout = ObjectData[j].areafill;
                    else
                        fillout = ObjectData[j].fillcolor || data[i].fillcolor;

                    //var pattern = data[i].marker || ObjectData[j].marker;

                    /*var tablelabel = "<td class='name_" + canvasIDcon + "' value='" + data[i][Object.keys(data[i])[0]] + "'>"
                            + data[i][Object.keys(data[i])[0]] + ": "
                            + "</td>"*/

                    var tdarray = [];

                    tabledata = "<td class='name_" + canvasIDcon + "' value='" + data[i][Object.keys(data[i])[0]] + "'>"
                        + data[i][Object.keys(data[i])[0]] + ": "
                        + "</td>";

                    var tableout;
                    hovercanvas = canvasinput("colorfill_" + canvasIDcon + j, hoverfont);

                    tdarray.push(tdout(hovercanvas, ObjectData[j].name, "colorfill_" + canvasIDcon, null));
                    if (ObjectData.length > 1) {
                        tdarray.push(tdout(ObjectData[j].name, ObjectData[j].name, "name_" + canvasIDcon, null));
                    }
                    else {
                        tdarray.push(tdout(data[i][Object.keys(data[i])[0]], data[i][Object.keys(data[i])[0]], "name_" + canvasIDcon, null));
                    }
                    var dataout = localestring(DataInput(data, i, j + 1), precision);

                    tdarray.push(tdout(dataout, ObjectData[j].name, "value_" + canvasIDcon, null));

                    txtinput = troutput(tdarray);

                    txtout += txtinput;
                }

                var txtlabel;
                if (ObjectData.length > 1) {
                    txtlabel = "<p>" + data[i][Object.keys(data[i])[0]] + "</p>"
                }
                else {
                    txtlabel = ""
                }

                txtoutput = "<table class='center'>"
                    + txtlabel
                    + txtout
                    + "</table>";
                
                var HTMLoutput = "<div class='tooltip'>"
                    + txtoutput
                    + "</div>";

                eh.style.display = "inline";//"block";
                eh.innerHTML = HTMLoutput;

                Data = DataOutput(option);
                var boxsize = 6; //hoverfont.fontSize;
                var s = document.getElementsByClassName("colorfill_" + canvasIDcon);
                var hname = document.getElementsByClassName("name_" + canvasIDcon);
                var hvalue = document.getElementsByClassName("value_" + canvasIDcon);
                for (var b = 0; b < ObjectData.length; b++) {
                    var OD = ObjectData[b];
                    var fillout, filltypeout, gradienttypeout;

                    var pattern, gradtype;
                    var gradtype = OD.gradtypelist || OD.areagradienttype;

                    if (Data == ObjectData) {
                        if (OD.area) {
                            fillout = OD.areafill;
                            pattern = "square";
                            gradtype = OD.areagradienttype;
                        }
                        else {
                            fillout = OD.fillcolor;
                            pattern = OD.marker;
                            gradtype = OD.gradtypelist || OD.areagradienttype;
                        }
                    }
                    else if (Data == data) {
                        fillout = data[i].fillcolor;
                        pattern = data[i].marker;
                        gradtype = data[i].gradtypelist;
                    }

                    var hID = document.getElementById("colorfill_" + canvasIDcon + b);
                    var hc = Canvas("colorfill_" + canvasIDcon + b);
                    pattern = pattern || "square";

                    hID.width = 24;
                    hID.height = 16;

                    var hX = hID.width * 0.5,
                        hY = hID.height * 0.5;

                    if (OD.areafilltype == "gradient" ||
                        data[i].filltype == "gradient") {
                        tcolor = gradcolorout(hc, hX, hY, boxsize, fillout, gradtype, type);
                    }
                    else if (OD.areafilltype == "color") {
                        tcolor = fillout;
                    }
                    var markerline = 2;

                    if (Data == data) {
                        markerlinestroke = ObjectData[0].linecolor;
                        //markdash = ObjectData[0].dash || [0];
                        markcap = ObjectData[0].cap || "butt";
                        markjoin = ObjectData[0].join || "miter";
                        if (ObjectData[0].linecolor == undefined) {
                            if (ObjectData[0].filltype == "color") markerlinestroke = ObjectData[0].fillcolor;
                            else if (ObjectData[0].filltype == "gradient") markerlinestroke = ObjectData[0].fillcolor[ObjectData[0].fillcolor.length - 1].color;
                        }

                    }
                    else if (Data == ObjectData) {
                        //markdash = OD.dash || [0];
                        markcap = OD.cap || "butt";
                        markjoin = OD.join || "miter";

                        if (OD.linewidth > 0) {
                            markerlinestroke = OD.linecolor;
                            if (OD.linecolor == undefined) {
                                if (OD.filltype == "color") markerlinestroke = OD.fillcolor;
                                else if (OD.filltype == "gradient") markerlinestroke = OD.fillcolor[OD.fillcolor.length - 1].color;
                            }
                        }

                    }

                    markdash = OD.dash; //|| [0];

                    if (!OD.area) markerlinewidth = OD.strokewidth;
                    else markerlinewidth = OD.linewidth;
                    if ((OD.strokewidth > 1 && !OD.area)
                        || (OD.linewidth > 1 && OD.area)) markerlinewidth = 1;

                    var markerwidth, markerstroke;
                    if (Data == ObjectData) {
                        if (OD.area) {
                            markerwidth = markerlinewidth;
                            markerstroke = markerlinestroke;
                        }
                        else {
                            markerwidth = OD.strokewidth;
                            if (OD.strokewidth > 2) markerwidth = 3;
                            markerstroke = OD.strokecolor;
                            if (OD.strokecolor == undefined) {
                                if (OD.filltype == "color" && OD.style == "2d") markerstroke = OD.fillcolor;
                                else if (OD.filltype == "gradient") markerstroke = OD.fillcolor[OD.fillcolor.length - 1].color;
                            }
                        }

                        if (!OD.area) hc.Line(0, parseInt(hY) + 0.5, hID.width, parseInt(hY) + 0.5, markerline, markerlinestroke, nullshadow, markdash, markcap, markjoin);
                    }
                    else {
                        markerwidth = ObjectData[0].strokewidth;
                        if (ObjectData[0].strokewidth > 2) markerwidth = 3;

                        markerstroke = ObjectData[0].strokecolor;
                        if (ObjectData[0].strokecolor == undefined) {
                            if (ObjectData[0].filltype == "color" && ObjectData[0].style == "2d") markerstroke = ObjectData[0].fillcolor;
                            else if (ObjectData[0].filltype == "gradient") markerstroke = ObjectData[0].fillcolor[ObjectData[0].fillcolor.length - 1].color;
                        }

                        hc.Line(0, parseInt(hY) + 0.5, hID.width, parseInt(hY) + 0.5, markerline, markerlinestroke, nullshadow, markdash, markcap, markjoin);
                    }

                    var markerlinefill;
                    if (OD.areafilltype == "color") markerlinefill = OD.areafill;
                    else if (OD.areafilltype == "gradient") {
                        markerlinefill = hc.GradientMarker(OD.areafill, OD.gradienttype, hX, hY, boxsize);
                    }
                    //if (!OD.area) hc.Line(0, parseInt(hY) + 0.5, hID.width, parseInt(hY) + 0.5, markerline, markerlinestroke, nullshadow, markdash, markcap, markjoin);
                    hc.Markers(pattern, hX, hY, boxsize, markerwidth, tcolor, markerstroke, 1, canvasIDcon, nullshadow);
                    //else hc.shapeA(hX, hY, 45, 4, 6, markerlinewidth, markerlinefill, markerlinestroke, nullshadow);
                    //markerlegend(hc, option, hX, hY, data[i], chart, canvasID, boxsize);

                    hname[b].style.fontSize = hoverfont.fontSize;
                    hname[b].style.fontStyle = hoverfont.fontStyle;
                    hname[b].style.fontFamily = hoverfont.fontFamily;
                    hname[b].style.fontWeight = hoverfont.fontWeight;

                    hvalue[b].style.fontSize = hoverfont.fontSize;
                    hvalue[b].style.fontStyle = hoverfont.fontStyle;
                    hvalue[b].style.fontFamily = hoverfont.fontFamily;
                    hvalue[b].style.fontWeight = hoverfont.fontWeight;
                    hvalue[b].style.textAlign = "right";

                }
                //requestAnimFrame()
            }

        }
        else if (type == "cone"
            || type == "pyramid"
            || type == "cylinder") {
            
            list.forEach(function (element) {
                element.prefix = element.prefix || "";
                element.suffix = element.suffix || "";
                if (y > element.y + customY
                    && y < element.y + element.height //+ customY
                    && x > element.x /*+ customX*/
                    && x < element.x + element.width /*+ customX*/) {
                    //if (ctx.isPointInPath(y > element.y, y)) {

                    var elementinputwidth = (hoverfont.fontSize * 2) + ctx.FontWidth(element.name + ":" + element.value, hoverfont);
                    var elementinputheight = (TextFontHeight(ctx, hoverfont) + (hoverfont.fontSize * 0.5));

                    //console.log(element.y + element.height)
                    var Ytop;
                    if (x >= ((conw * 0.5) - (elementinputwidth * 0.5))
                        && x < ((conw * 0.5) + (elementinputwidth * 0.5))
                        && y >= element.y + ((element.height - elementinputheight) * 0.5) //- (elementinputheight * 0.5)
                        && y < element.y + (element.height * 0.5) + (elementinputheight)
                        ) {
                        Ytop = y + (elementinputheight * 0.5);
                    }
                    else {
                        if (type == "cylinder") {
                            Ytop = (element.y + ((element.height - elementinputheight) * 0.5)) //- (elementinputheight * 0.5);//(element.dataheight + ((element.area / 100) * element.fullheight)) - elementinputheight;
                        }
                        else {
                            Ytop = (element.y + ((element.height - elementinputheight) * 0.5)) //- (elementinputheight * 0.5);//element.dataheight;
                        }
                    }

                    eh.style.marginLeft = element.x + ((element.width - elementinputwidth) * 0.5) /*+ (element.x + eh.offsetWidth)*/ + "px";//MeasureTableWidth(x, conw, eh);

                    eh.style.marginTop = Ytop + (elementinputheight * 0.5) + "px";//MeasureTableHeight(y, conh, eh);
                    var canvasname = "tabledraw";

                    var tdarray = [];
                    tdarray.push(tdout("", null, "colorfill_" + canvasIDcon, null));
                    tdarray.push(tdout(element.name + ":", null, "name_" + canvasIDcon, null));
                    tdarray.push(tdout(element.value, null, "value_" + canvasIDcon, null));
                    
                    txtinput = troutput(tdarray);

                    txtoutput = "<table class='center'>" + txtinput + "</table>";

                    var HTMLoutput = "<div class='tooltip'>"
                        + txtoutput
                        + "</div>";

                    eh.style.display = "inline";//"block";
                    eh.innerHTML = HTMLoutput;

                    var boxsize = hoverfont.fontSize;
                    var s = document.getElementsByClassName("colorfill_" + canvasIDcon);
                    tcolor = ShapeFill(element.filltype, element.gradienttype.toString().toLowerCase(), element.fill, type, "square");
                    s[0].style.background = tcolor;
                    s[0].style.width = boxsize + "px";

                    var hname = document.getElementsByClassName("name_" + canvasIDcon);

                    var hvalue = document.getElementsByClassName("value_" + canvasIDcon);
                    hname[0].style.fontSize = hoverfont.fontSize;
                    hname[0].style.fontStyle = hoverfont.fontStyle;
                    hname[0].style.fontFamily = hoverfont.fontFamily;
                    hname[0].style.fontWeight = hoverfont.fontWeight;

                    hvalue[0].style.fontSize = hoverfont.fontSize;
                    hvalue[0].style.fontStyle = hoverfont.fontStyle;
                    hvalue[0].style.fontFamily = hoverfont.fontFamily;
                    hvalue[0].style.fontWeight = hoverfont.fontWeight;


                }
            })
        }
        else {
            var table = document.createElement("table");
            table.class = "center";

            list.forEach(function (element) {
                element.prefix = element.prefix || "";
                element.suffix = element.suffix || "";
                //element.x = element.x + customX;
                //element.y = element.y + customY;
                if (y > element.y + customY
                    && y < element.y + element.height + customY
                    && x > element.x + customX
                    && x < element.x + element.width + customX) {

                    //redraw with tooltip
                    var hovercanvas, arraytxt, txtinput = "", txtlabel, txtoutput, txttotal, arraytotal = 0;
                    element.percent = element.percent || "";

                    var fillCSSoutput, fillgrad, tcolorin;

                    var vA = ctx.TBPosition(option, type, "top"),
                        vB = ctx.TBPosition(option, type, "bottom");

                    var hA = ctx.BaseNum(option, "left", precision, type),
                        hB = ctx.BaseNum(option, "right", precision, type);

                    var xout, yout;
                    var widthtotal = (hB - 5) - (hA + 5);
                    var xtest = widthtotal / data.length;

                    var elementinputarrayW = [];
                    var elementinputarrayH = 0;

                    var canvaselementwidth;
                    if (type == "OHLC") {
                        canvaselementwidth = hoverfont.fontSize * 3;
                    }
                    else {
                        canvaselementwidth = hoverfont.fontSize * 2;
                    }
                    for (var j = 0; j < ObjectData.length; j++) {
                        var grouplist;
                        if (gtotalresultmax > 1) grouplist = " (" + ObjectData[j].group.text + ")"
                        else grouplist = "";

                        txtavgfont = {};
                        txtavgfont.fontSize = hoverfont.fontSize;
                        txtavgfont.fontWeight = "Bold";

                        var bubbledisplay;
                        if (type == "bubble") {
                            bubbledisplay = ctx.FontWidth(element.textaverage, txtavgfont)
                            + ctx.FontWidth( ": " + parseFloat(element.averagelist[j]), hoverfont);
                        }
                        else
                            bubbledisplay = 0;

                        element.percentlist[j] == element.percentlist[j] || "";

                        var namelist, valueout;
                        switch (type) {
                            case "OHLC":
                                //if (element.ODlist[j] == "" || element.ODlist[j] == undefined) namelist = 0;
                                //else namelist = ctx.FontWidth(element.ODlist[j] + ": ", hoverfont);
                                namelist = 0;

                                var OHLCarraytext = [];
                                OHLCarraytext.push(ctx.FontWidth("Open: "
                                    + element.prefix + localestring(parseInt(element.openlist[j]), precision) + element.suffix, hoverfont))
                                OHLCarraytext.push(ctx.FontWidth("High: "
                                    + element.prefix + localestring(parseInt(element.highlist[j]), precision) + element.suffix, hoverfont))
                                OHLCarraytext.push(ctx.FontWidth("Low: "
                                    + element.prefix + localestring(parseInt(element.lowlist[j]), precision) + element.suffix, hoverfont))
                                OHLCarraytext.push(ctx.FontWidth("Close: "
                                    + element.prefix + localestring(parseInt(element.closelist[j]), precision) + element.suffix, hoverfont))
                                //    + namelist

                                valueout = MaxArray(OHLCarraytext);
                                break;
                            default:
                                if (element.ODlist[j] == "" || element.ODlist[j] == undefined) namelist = 0;
                                else namelist = ctx.FontWidth(element.ODlist[j] + grouplist + ": ", hoverfont);

                                valueout = ctx.FontWidth(element.prefix
                                    + " "
                                    + localestring(convertpoint(element.valuearray[j]), precision)
                                    + " "
                                    + element.suffix
                                    + " "
                                    , hoverfont)
                                    + ctx.FontWidth(element.percentlist[j], hoverfont)
                                    + bubbledisplay;

                        }
                        arraytxt = canvaselementwidth + namelist + valueout;

                        elementinputarrayW.push(arraytxt);
                        elementinputarrayH += TextFontHeight(ctx, hoverfont);
                    }

                    if (ObjectData.length > 1) {
                        elementinputarrayW.push(ctx.FontWidth(element.label, hoverfont));
                        elementinputarrayH += TextFontHeight(ctx, hoverfont);
                    }
                    //TextFontHeight(ctx, font)
                    var htmlwidth = Math.ceil(MaxArray(elementinputarrayW));
                    var htmlheight = elementinputarrayH + (hoverfont.fontSize * 0.5);

                    if (type == "horizontalbar") {
                        xout = (ctx.BaseLabelH(option, "right", type) - htmlwidth);
                        var mheight = (element.height * ObjectData.length) / gtotalresult.length;
                        //if (element.height < eh.offsetHeight) {
                        //    if (y >= 0 && y < (vB - (eh.offsetHeight * 0.5))) {
                        //        yout = element.y;
                        //    }
                        //    else {
                        //        yout = (element.y + element.height) - (eh.offsetHeight);
                        //    }
                        //}
                        //else {
                        //    yout = element.y + (element.height * 0.5);
                        //}
                        yout = element.y + ((element.height * 0.5) - (htmlheight * 0.5));
                    }
                    else {
                        //if (xtest < htmlwidth) {
                        //    if (x >= 0 && x < (hA + (htmlwidth))
                        //    && element.x >= 0 && element.x < (hA + (htmlwidth * 0.5))) {
                        //        xout = (element.x + (element.width * 0.25)); //element.x + "px";
                        //    }
                        //    else if (x > (hA + (htmlwidth)) && x < (hB - (htmlwidth))
                        //    && element.x > (hA + (htmlwidth * 0.5)) && element.x < (hB - (htmlwidth * 0.5))) {
                        //        xout = (element.x + ((element.width * 0.5) - (htmlwidth * 0.5)));
                        //    }
                        //    else {
                        //        xout = ((element.x + (element.width)) - (htmlwidth));
                        //    }
                        //}
                        //else {
                        //    xout = (element.x + ((element.width * 0.5) - (htmlwidth * 0.5)));
                        //}
                        xout = element.x + ((element.width * 0.5) - (htmlwidth * 0.5));

                        yout = vA;
                    }
                    eh.style.marginLeft = xout + customX + "px";
                    eh.style.marginTop = yout + customY + "px";

                    switch (type) {
                        case "OHLC":
                            for (var j = 0; j < ObjectData.length; j++) {
                                var namedetail = element.ODlist[j];
                                var namelist = element.ODlist[j] + ": ";
                                if (element.ODlist[j] == undefined) {
                                    namedetail = "";
                                    namelist = "";
                                }

                                var canvasname = "tabledraw" + j;

                                hovercanvas = canvasinput("colorfill_" + canvasIDcon + j, hoverfont);
                                var openvalue = element.prefix + localestring(parseInt(element.openlist[j]), precision) + element.suffix;
                                var highvalue = element.prefix + localestring(parseInt(element.highlist[j]), precision) + element.suffix;
                                var lowvalue = element.prefix + localestring(parseInt(element.lowlist[j]), precision) + element.suffix;
                                var closevalue = element.prefix + localestring(parseInt(element.closelist[j]), precision) + element.suffix;

                                var tdarray = [];
                                tdarray.push(tdout(hovercanvas, null, "colorfill_" + canvasIDcon + j, null));
                                tdarray.push(tdout(namelist, null, "name_" + canvasIDcon, null));

                                var tdarrayopen = [];
                                tdarrayopen.push(tdout("Open: ", "Open", "name_" + canvasIDcon, null));
                                tdarrayopen.push(tdout(openvalue, null, "value_" + canvasIDcon, null));

                                var tdarrayhigh = [];
                                tdarrayhigh.push(tdout("High: ", "High", "name_" + canvasIDcon, null));
                                tdarrayhigh.push(tdout(highvalue, null, "value_" + canvasIDcon, null));

                                var tdarraylow = [];
                                tdarraylow.push(tdout("Low: ", "Low", "name_" + canvasIDcon, null));
                                tdarraylow.push(tdout(lowvalue, null, "value_" + canvasIDcon, null));

                                var tdarrayclose = [];
                                tdarrayclose.push(tdout("Close: ", "Close", "name_" + canvasIDcon, null));
                                tdarrayclose.push(tdout(closevalue, null, "value_" + canvasIDcon, null));

                                arraytxt = troutput(tdarray)
                                    + troutput(tdarrayopen)
                                    + troutput(tdarrayhigh)
                                    + troutput(tdarraylow)
                                    + troutput(tdarrayclose);

                                //txtinput += arraytxt;
                                txtinput += arraytxt;
                            }
                            break;
                        default:
                            for (var j = 0; j < ObjectData.length; j++) {
                                var tr = document.createElement('tr');
                                var grouplist;

                                if (gtotalresultmax > 1) grouplist = " (" + ObjectData[j].group.text + ")";
                                else grouplist = "";

                                var namedetail = element.ODlist[j] + grouplist;
                                var namelist = element.ODlist[j] + grouplist + ": ";

                                if (element.ODlist[j] == "") {
                                    namedetail = "";
                                    namelist = "";
                                }

                                var canvasname = "tabledraw" + j;
                                var hover
                                //hovercanvas = canvasinput(canvasname, hoverfont);

                                hovercanvas = canvasinput("colorfill_" + canvasIDcon + j, hoverfont)

                                element.percentlist[j] == element.percentlist[j] || "";

                                var colorfilltd = tdout(hovercanvas, null, "colorfill_" + canvasIDcon, null);

                                var valuetextout = element.prefix + " "
                                    + localestring(convertpoint(element.valuearray[j]), precision) + " "
                                    + element.suffix + " "
                                    + element.percentlist[j];

                                var tdarray = [];
                                tdarray.push(tdout(hovercanvas, null, "colorfill_" + canvasIDcon, null));
                                tdarray.push(tdout(namelist, namedetail, "name_" + canvasIDcon, null));
                                tdarray.push(tdout(valuetextout, localestring(convertpoint(element.valuearray[j]), precision), "value_" + canvasIDcon + j, null));

                                if (type == "bubble") {
                                    tdarray.push(tdout("<b>" + element.textaverage + "</b>" + ": ", null, "name_" + canvasIDcon, null));
                                    tdarray.push(tdout(parseFloat(element.averagelist[j]), null, "bubblevalue_" + canvasIDcon + j, null));
                                }

                                arraytxt = troutput(tdarray);

                                txtinput += arraytxt;
                                arraytotal += parseFloat(element.valuearray[j]);

                            }

                            txttotal = "<tr>"
                                + "<td></td>"
                                + "<td class='total_" + canvasIDcon + "'>"
                                + "Total:"
                                + "</td>"
                                + "<td class='value_" + canvasIDcon + "'>"
                                + localestring(arraytotal)
                                + "</td>" + "</tr>";

                            if (ObjectData.length > 1 && total) {
                                txtinput += txttotal;
                            }
                            else txtinput;
                            break;
                    }

                    if (ObjectData.length > 1) {
                        txtlabel = "<p>" + element.label + "</p>"
                    }
                    else {
                        txtlabel = ""
                    }

                    txtoutput = "<table class='center'>" + txtinput + "</table>";

                    var HTMLoutput = "<div class='tooltip'>"
                        + txtlabel
                        + txtoutput
                        + "</div>";

                    eh.style.display = "inline";//"block";
                    eh.innerHTML = HTMLoutput;

                    var boxsize = hoverfont.fontSize * 0.5;
                    var hname = document.getElementsByClassName("name_" + canvasIDcon);
                    
                    var Data = DataOutput(option);
                    for (var b = 0; b < ObjectData.length; b++) {
                        var hvalue = document.getElementsByClassName("value_" + canvasIDcon + b);
                        var hbubblevalue = document.getElementsByClassName("bubblevalue_" + canvasIDcon + b);
                        var s = document.getElementsByClassName("colorfill_" + canvasIDcon + b);
                        var hID = document.getElementById("colorfill_" + canvasIDcon + b);
                        var hc = Canvas("colorfill_" + canvasIDcon + b);//document.getElementById("colorfill_" + canvasIDcon);
                        var pattern = element.pattern[b] || "square";
                        var gradtype = element.gradtypelist[b] || "linear a";
                        var OD = ObjectData[b];
                        //console.log(element.gradtypelist[b]);
                        element.filltypelist[b] = element.filltypelist[b] || "color";
                        //tcolor = ShapeFill(element.filltypelist[b], gradtype, element.filllist[b], type, pattern);
                        //s[b].style.background = tcolor;
                        //s[b].style.width = boxsize + 12 + "px";
                        //s[b].style.height = boxsize + 12 + "px";
                        //s[b].margin = "0px auto";
                        hID.width = canvaselementwidth;
                        hID.height = 16;
                        //hID.style.borderStyle = "solid";
                        //hID.style.borderColor = "black";
                        //hID.style.borderWidth = 1 + "px";
                        s.align = "center";
                        //hID.style.alignContent = "center";
                        //hID.style.background = tcolor;
                        var boxsizeout = boxsize;
                        if (pattern == "up" || 
                            pattern == "down" || 
                            pattern == "left" || 
                            pattern == "right") boxsizeout *= 0.8;

                        var hX = hID.width * 0.5,
                            hY = hID.height * 0.5;

                        if (element.filltypelist[b] == "gradient") {
                            tcolor = gradcolorout(hc, hX, hY, boxsizeout, element.filllist[b], gradtype, type);
                        }
                        else if (element.filltypelist[b] == "color") {
                            tcolor = element.filllist[b];
                        }
                        var markerline = 2;

                        if (Data == data) {
                            markerlinestroke = ObjectData[0].linecolor;
                            markdash = ObjectData[0].dash || [0];
                            markcap = ObjectData[0].cap || "butt";
                            markjoin = ObjectData[0].join || "miter";
                            if (ObjectData[0].linecolor == undefined) {
                                if (ObjectData[0].filltype == "color") markerlinestroke = ObjectData[0].fillcolor;
                                else if (ObjectData[0].filltype == "gradient") markerlinestroke = ObjectData[0].fillcolor[ObjectData[0].fillcolor.length - 1].color;
                            }

                        }
                        else if (Data == ObjectData) {
                            markdash = OD.dash || [0];
                            markcap = OD.cap || "butt";
                            markjoin = OD.join || "miter";

                            if (OD.linewidth > 0) {
                                markerlinestroke = OD.linecolor;
                                if (OD.linecolor == undefined) {
                                    if (OD.filltype == "color") markerlinestroke = OD.fillcolor;
                                    else if (OD.filltype == "gradient") markerlinestroke = OD.fillcolor[OD.fillcolor.length - 1].color;
                                }
                            }

                        }

                        if (type != "scatter"
                            && OD.charttype == "line"
                            && !OD.area) hc.Line(0, parseInt(hY) + 0.5, hID.width, parseInt(hY) + 0.5, markerline, markerlinestroke, nullshadow, markdash, markcap, markjoin);

                        if (element.linewidth[b] > 1) element.linewidth[b] = 1;
                        var lineout = element.linewidth[b] || 0;
                        var strokeout;
                        if (element.linewidth[b] <= 0) strokeout = 0;
                        else {
                            if (OD.area) strokeout = markerlinestroke;
                            else strokeout = element.strokelist[b];
                        }
                        hc.Markers(pattern, hX, hY, boxsizeout, lineout, tcolor, strokeout, 1, canvasIDcon, nullshadow);

                        if (type == "OHLC") {
                            for (var O = 0; O < (4 * ObjectData.length); O++) {
                                hname[O].style.fontSize = hoverfont.fontSize;
                                hname[O].style.fontStyle = hoverfont.fontStyle;
                                hname[O].style.fontFamily = hoverfont.fontFamily;
                                hname[O].style.fontWeight = hoverfont.fontWeight;

                                hvalue[O].style.fontSize = hoverfont.fontSize;
                                hvalue[O].style.fontStyle = hoverfont.fontStyle;
                                hvalue[O].style.fontFamily = hoverfont.fontFamily;
                                hvalue[O].style.fontWeight = hoverfont.fontWeight;
                                hvalue[O].style.textAlign = "right";
                            }
                        }
                        else {
                            hname[0].style.fontSize = hoverfont.fontSize;
                            hname[0].style.fontStyle = hoverfont.fontStyle;
                            hname[0].style.fontFamily = hoverfont.fontFamily;
                            hname[0].style.fontWeight = hoverfont.fontWeight;

                            hvalue[0].style.fontSize = hoverfont.fontSize;
                            hvalue[0].style.fontStyle = hoverfont.fontStyle;
                            hvalue[0].style.fontFamily = hoverfont.fontFamily;
                            hvalue[0].style.textAlign = "right";

                            if (type == "bubble") {

                                hbubblevalue[0].style.fontSize = hoverfont.fontSize;
                                hbubblevalue[0].style.fontStyle = hoverfont.fontStyle;
                                hbubblevalue[0].style.fontFamily = hoverfont.fontFamily;
                                hbubblevalue[0].style.textAlign = "right";

                            }

                        }
                        //hvalue[0].style.color = "gray";
                    }

                    if (total) {
                        var htotal = document.getElementsByClassName("total_" + canvasIDcon);
                        htotal[0].style.fontSize = hoverfont.fontSize;
                        htotal[0].style.fontStyle = hoverfont.fontStyle;
                        htotal[0].style.fontFamily = hoverfont.fontFamily;
                        htotal[0].style.fontWeight = hoverfont.fontWeight;
                    }
                }
            });
        }
    }, false);

    h.addEventListener("mouseout", function (event) {
        ElementID(canvasIDcon + "_hover").style.display = "none";
        //ElementID(canvasIDcon + "_click").style.display = "none";
        p8check(h);

        try {
            var iscontinue = P8Chart_HoverOut(canvasID, element);
        } catch (err) {
            //console.log(err);
        }

    }, false);

    //h.addEventListener("mousedown", function (event) {
    //    p8check(h);
    //    var coordinates = getCursorPosition(h, event);
    //    var y = coordinates.y;
    //    var x = coordinates.x;
    //    var ec = ElementID(canvasIDcon + "_click");
    //    ec.style.borderRadius = borderradius + "px";
    //    ec.style.backgroundColor = rgba(0, 0, 0, 0.75);
    //    ec.style.fontSize = hoverfont.fontSize + "px";
    //    ec.style.position = "absolute";

    //    if (type == "piedoughnut") {
    //        y -= (conh / 2)//element.y;
    //        x -= (conw / 2)//element.x;
    //        var dist = Math.sqrt(pow(x, 2) + pow(y, 2));

    //        var total = 0;
    //        for (var i = 0; i < data.length; i++) {
    //            var datavalue = data[i].value;
    //            if (datavalue < 0) datavalue = 0;
    //            total += datavalue;
    //        }
    //        var value = []
    //        for (var i = 0; i < data.length; i++) {
    //            var datavalue = data[i].value;
    //            if (datavalue < 0) datavalue = 0;
    //            value.push({
    //                angle: abs(datavalue / total) * (PI * 2)
    //                , value: data[i].value
    //                , name: data[i].name
    //            });
    //        }
    //    }

    //    list.forEach(function (element) {

    //        element.prefix = element.prefix || "";
    //        element.suffix = element.suffix || "";
    //        if (type == "piedoughnut") {
    //            var hovercanvas;
    //            if (dist < element.radius) {
    //                var txtinput = "", txtoutput;
    //                var ang = Math.atan2(y, x);
    //                ang += PI * 2.5;
    //                ang %= PI * 2;
    //                var i = 0;
    //                var angletan = 0;
    //                while (i < data.length - 1) {
    //                    if (ang < angletan + (value[i].angle)) {
    //                        break;
    //                    }
    //                    angletan += value[i].angle;
    //                    i += 1;
    //                }
    //                var canvasname = "tabledraw";
    //                hovercanvas = canvasinput(canvasname, hoverfont);

    //                txtinput = "<tr>"
    //                    + "<td>"
    //                    + hovercanvas
    //                    + "</td>"
    //                    + "<td class='name_" + canvasIDcon + "' value='" + data[i].name + "'>"
    //                    + data[i].name + ": "
    //                    + "</td>"
    //                    + "<td class='value_" + canvasIDcon + " value='" + data[i].value + "'>"
    //                    + data[i].value
    //                    + "</td>"
    //                    + "<td class='percent'>"
    //                    + "(" + ((data[i].value / total) * 100).toFixed(2) + "%)"
    //                    + "</td>"
    //                    + "</tr>";
    //                //redraw with tooltip
    //                ec.style.display = "inline";//"block";
    //                ec.style.marginTop = y + (conh / 2) + 27 + "px";
    //                ec.style.marginLeft = x + (conw / 2) + "px";
    //                fillCSSoutput = fillCSSinput;
    //                txtoutput = "<table class='center'>" + txtinput + "</table>";

    //                ec.innerHTML = "<div class='tooltip'>" + txtoutput + "</div>";
    //            }
    //        }
    //        else {
    //            if (y > element.y && y < element.y + element.height && x > element.x && x < element.x + element.width) {

    //            }
    //        }
    //    });

    //}, false);
}

//Parameter
function Para(option, type, click) {
    var IDcon = option.canvasID,
        iscanvas = option.iscanvas,
        ID = (option.cID || option.canvasID) + "_canvas",
        IDbutton = option.canvasID + "_button",
        b = option.background,
        customXY = option.customXY || false,
        absolute = option.absolute || false;
        border = option.border;
    var element = ElementID(IDcon);

    var customX, customY, w, h;
    if (customXY) {
        customX = option.x,
        customY = option.y;
    }
    else {
        customX = 0,
        customY = 0;
    }
    w = option.size.width,
    h = option.size.height;

    if (option.hover && !iscanvas) {
        var parahover = document.createElement("div");
        parahover.id = IDcon + "_hover";
        element.appendChild(parahover);
    }

    var paraclick = document.createElement("div");
    paraclick.id = IDcon + "_click";
    if (absolute) element.appendChild(paraclick);

    var paracanvas = document.createElement("canvas");
    paracanvas.id = ID;
    paracanvas.width = w;
    paracanvas.height = h;
    paracanvas.style.background = b || rgba(0, 0, 0, 0);
    paracanvas.style.borderStyle = border.style;
    paracanvas.style.borderColor = border.fill;
    paracanvas.style.borderWidth = border.width + "px";
    if(iscanvas != true) element.appendChild(paracanvas);

    var parabuttonsize = document.createElement("button");
    parabuttonsize.id = IDbutton + "size";
    parabuttonsize.textContent = "ABS";
    parabuttonsize.hidden = true;
    if (absolute) element.appendChild(parabuttonsize);

    var parabutton = document.createElement("input");
    parabutton.id = IDbutton;
    parabutton.type = "button";
    parabutton.style.position = "absolute"
    parabutton.style.marginLeft = (0 - 50) + "px";
    parabutton.style.marginTop = (h - 20) + "px";
    parabutton.value = "ABS";

    if (absolute){
        if (!click) {
            parabutton.onclick = function () { CreateChart(option, type, true) };
        }
        else {
            parabutton.onclick = function () { CreateChart(option, type, false) };
        }
    element.appendChild(parabutton);
    }
}

//Animation
function animatecanvas(option, ID, canvas, anim, percent) {
    var millisecond = option.millisecond;
    var a = ElementID(ID);
    var p8draw = a.getAttribute("p8draw", true);
    anim = anim || false;
    if (anim) {
        if (p8draw != "true" && p8draw == undefined) {
            requestAnimFrame(canvas, 1);
        } else {
            canvas();
        }
    }
    else {
        canvas();
    }
}

//Includes
function includes(container, value) {
    var returnValue = false;
    var pos = container.indexOf(value);
    if (pos >= 0) {
        returnValue = true;
    }
    return returnValue;
}

//Num
function Num(option, chart, num, output, invert, convert, precision) {
    var x, y;
    var ObjectData = option.ObjectData,
        percentstack = option.percentstack,
        stacked = option.stacked,
        format = option.format,
        prefix = format.prefix || "",
        suffix = format.suffix || "";

    var GArray = GroupArray(ObjectData);
    var gtotalmax = MaxArray(GroupArrayTotal(GArray));

    precision = precision || 0;

    var valueuptotal = ValueTotal(option, chart, "up"),
        valuedowntotal = ValueTotal(option, chart, "down");

    if (valueuptotal >= valuedowntotal) {
        xA = num * -1;
        xB = num;
        if (num == 0) {
            xA = 0;
            xB = 0;
        }
    }
    else if (valueuptotal < valuedowntotal) {
        xA = num;
        xB = num * -1;
        if (num == 0) {
            xA = 0;
            xB = 0;
        }
    }

    var yA, yB;

    if (valueuptotal >= valuedowntotal) {
        yA = num;
        yB = num * -1;
        if (num == 0) {
            yA = 0;
            yB = 0;
        }
    }
    else if (valueuptotal < valuedowntotal) {
        yA = num * -1;
        yB = num;
        if (num == 0) {
            yA = 0;
            yB = 0;
        }
    }

    if (stacked && !percentstack) {
        xA *= gtotalmax;
        yA *= gtotalmax;
        xB *= gtotalmax;
        yB *= gtotalmax;
    }

    if (invert) {
        if (convert || percentstack) {
            x = convertnum(xA, precision);
            y = convertnum(yA, precision);
        }
        else {
            x = localestring(xA, precision);
            y = localestring(yA, precision);
        }
    }
    else {
        if (convert || percentstack) {
            x = convertnum(xB, precision);
            y = convertnum(yB, precision);
        }
        else {
            x = localestring(xB, precision);
            y = localestring(yB, precision);
        }
    }

    if (output == "x") {
        if (percentstack && !stacked)
            return x.toString() + "%"
        else
            return prefix + x.toString() + suffix
    }
    else if (output == "y") {
        if (percentstack && !stacked)
            return y.toString() + "%"
        else
            return prefix + y.toString() + suffix
    }
}

function convertpoint(value) {
    if (Number.isInteger(value)) return parseInt(value)
    else return (value).toFixed(2);
}

//color function
function rgba(r, g, b, a) {
    r = (r > 255) ? 255 : (r < 0) ? 0 : r;
    g = (g > 255) ? 255 : (g < 0) ? 0 : g;
    b = (b > 255) ? 255 : (b < 0) ? 0 : b;
    a = (a > 1) ? 1 : (a < 0) ? 0 : a;
    return 'rgba(' + r + ',' + g + ', ' + b + ', ' + a + ')'
}

//Color Name to Hex
function colorNameToHex(color) {
    var colors = {
        "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff"
        , "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff"
        , "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887", "cadetblue": "#5f9ea0", "chartreuse": "#7fff00"
        , "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c"
        , "cyan": "#00ffff", "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9"
        , "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f"
        , "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f"
        , "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1", "darkviolet": "#9400d3"
        , "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff", "firebrick": "#b22222"
        , "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff", "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff"
        , "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f"
        , "honeydew": "#f0fff0", "hotpink": "#ff69b4", "indianred ": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0"
        , "khaki": "#f0e68c", "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd"
        , "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2", "lightgrey": "#d3d3d3"
        , "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa"
        , "lightslategray": "#778899", "lightsteelblue": "#b0c4de", "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32"
        , "linen": "#faf0e6", "magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd"
        , "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee"
        , "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970"
        , "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5", "navajowhite": "#ffdead", "navy": "#000080"
        , "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6"
        , "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093", "papayawhip": "#ffefd5"
        , "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080"
        , "rebeccapurple": "#663399", "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1", "saddlebrown": "#8b4513"
        , "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0"
        , "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f"
        , "steelblue": "#4682b4", "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0"
        , "violet": "#ee82ee", "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5", "yellow": "#ffff00", "yellowgreen": "#9acd32"
    };

    if (typeof colors[color.toLowerCase()] != 'undefined')
        return colors[color.toLowerCase()];

    return false;
}

//Color Hex to RGBA
function colorconvert(color, transparency) {
    if (color.includes("#")) color = stringsplit(color, '#')
    var r = parseInt(color.substring(0, 2), 16);
    var g = parseInt(color.substring(2, 4), 16);
    var b = parseInt(color.substring(4, 6), 16);
    var a = parseInt(transparency);
    return (rgba(r, g, b, a));
}

function stringsplit(word, split) {
    var letter = word.toString().split(split);

    var wordout = "";
    for (i = 0; i < letter.length; i++){
        wordout += letter[i];
    }

    return wordout
}
//Label Output
function LabelOutput(option, i, element, chart, maxlabel) {
    maxlabel = maxlabel || false;
    interval = option.intervaldata;

    if (maxlabel) data = option.data;
    else data = dataarrayoutput(option);

    duration = option.duration;
    format = option.format;

    var datanum = [];
    for (var j = 0; j < data.length; j++) {
        datanum.push({ x: j });
    }

    duration.format = duration.format || "string";
    var dataxy = data[i][Object.keys(data[i])[0]];
    var formatxy;
    if (duration.format == "string" || typeof dataxy == "string")
        formatxy = dataxy;
    else if (duration.format == "num" || typeof dataxy == "number") {
        if (element) formatxy = localestring(NaNCheck(dataxy));
        else formatxy = convertnum(NaNCheck(dataxy));
    }
    else if (typeof dataxy == "object") {
        //duration.format = duration.format || "MMM. DD, yyyy<br>hh:mm ss TT";
        //if (element) formatxy = TimeDateElement(dataxy, duration.dt);
        //else formatxy = TimeDateLabel(dataxy, duration.format);
        formatxy = TimeDateLabel(dataxy, duration.format);
    }
    return formatxy;
}

//Percent Stack Total
function PercentTotal(option, i) {
    var d = option.data;
    var OD = option.ObjectData;
    var p = 0;
    var pstackadd = [];
    for (var j = 1; j <= OD.length; j++) {
        var datavalue = DataInput(d, i, j);
        pstackadd.push(datavalue);
    }
    for (var j = 0; j < pstackadd.length; j++) {
        p += abs(pstackadd[j]);
    }
    return p
}

//Group Array
function GroupArray(OD) {
    var grouparray = [];
    for (ic = 0; ic < OD.length; ic++) {
        var O = OD[ic].group;
        if (O == undefined) O = { ID: 1 };
        if (O.ID == undefined
            || O.ID < 1) O.ID = 1;
        grouparray.push(O.ID);
    }
    grouparray.sort();
    return grouparray
}

//Group Array Total
function GroupArrayTotal(array) {
    var garraytotal = [],
        gcurrent = null,
        gcnt = 0;
    for (var i = 0; i <= array.length; i++) {
        if (array[i] != gcurrent) {
            if (gcnt > 0) {
                garraytotal.push(gcnt);
            }
            gcurrent = array[i];
            gcnt = 1;
        } else {
            gcnt++;
        }
    }
    return garraytotal
}

//remove duplicate
function removeDuplicate(arr) {
    var c;
    var len = arr.length;
    var result = [];
    var obj = {};
    for (c = 0; c < len; c++) {
        obj[arr[c]] = 0;
    }
    for (c in obj) {
        result.push(c);
    }
    return result;
}

//Width Fix
function WidthFix(width, height, area, AB, bar, vertical) {
    vertical = vertical || false;
    bar = bar || false;
    var WidthUp = width - height,
        WidthDown = width + height,
        areaB = 1 - area;

    if (abs(height) >= abs(width)) {
        if (width >= 0) {
            if (height >= 0) {
                if (AB) {
                    if (bar) {
                        if (vertical)
                            return width * area;
                        else
                            return height * area;
                    }
                    else
                        return width * area;
                }
                else {
                    if (bar) {
                        if (vertical)
                            return width * areaB;
                        else
                            return (width * areaB) + (WidthUp * area);
                    }
                    else
                        return width * areaB;
                }
            }
            else {
                if (AB) return width * area;
                else return width * areaB;
            }
        }
        else {
            if (height >= 0) {
                if (AB) {
                    if (bar) {
                        if (vertical)
                            return -height * area;
                        else
                            return -height * area;
                    }
                    else
                        return -height * area;
                }
                else {
                    if (bar)
                        if (vertical)
                            return (width * areaB) + (WidthDown * area);
                        else
                            return (width * areaB) + (WidthDown * area);
                    else
                        return (width * areaB) + (WidthDown * area);
                }
            }
            else {
                if (AB) {
                    if (bar) {
                        if (vertical)
                            return width * area;
                        else
                            return height * area;
                    }
                    else {
                        return width * area;
                    }
                }
                else return width * areaB;
            }
        }
    }
    else if (abs(height) < abs(width)) {
        if (width >= 0) {
            if (height >= 0) {
                if (AB) {
                    if (bar)
                        return height * area;
                    else
                        return height * area;
                }
                else {
                    return (width * areaB) + (WidthUp * area);
                }
            }
            else {
                if (AB) {
                    if (bar) {
                        if (vertical)
                            return width * area;
                        else {
                            return -height * area;
                        }
                    }
                    else {
                        return -height * area;
                    }
                }
                else {
                    if (bar) {
                        if (vertical)
                            return (width * areaB) //- (WidthUp * area);
                        else
                            return (width * areaB)
                    }
                    else {
                        return (width * areaB) + (WidthDown * area);
                    }
                }
            }
        }
        else {
            if (height >= 0) {
                if (AB) {
                    if (bar) {
                        if (vertical)
                            return width * area;
                        else
                            return -height * area;
                    }
                    else
                        return width * area;
                }
                else {
                    if (bar) {
                        return (width * areaB) + (WidthDown * area);
                    }

                    /*if (AB) {
                        if (bar) {
                            if (vertical)
                                return width * area;
                            else
                                return -height * area;
                        }
                        else
                            return width * area;
                    }*/
                }
            }
            else {
                if (AB) {
                    if (vertical)
                        return width * area;
                    else
                        return height * area;
                    //return width * area;
                }
                else {
                    return width * areaB;
                }
            }
        }
    }
}

//Height Fix
function HeightFix(width, height, area, AB, bar, vertical) {
    bar = bar || false;
    vertical = vertical || false;
    var HeightUp = height - width,
        HeightDown = height + width,
        areaB = 1 - area;

    if (abs(height) >= abs(width)) {
        if (height >= 0) {
            if (width >= 0) {
                if (AB) {
                    if (bar) {
                        if (vertical)
                            return width * area;
                        else
                            return height * area;
                    }
                    else
                        return width * area;
                }
                else {
                    if (bar) {
                        if (vertical)
                            return (height * areaB) + (HeightUp * area);
                        else
                            return height * areaB;
                    }
                    else
                        return (height * areaB) + (HeightUp * area);
                }
            }
            else {
                if (AB) {
                    if (bar) {
                        if (vertical)
                            return height * area;
                        else
                            return height * area;
                    }
                    else
                        return height * area;
                }
                else {
                    if (bar) {
                        if (vertical)
                            return height * areaB;
                        else
                            return height * areaB;
                    }
                    else
                        return height * areaB;
                }
            }
        }
        else {
            if (AB) {
                if (bar) {
                    if (vertical) {
                        return (height * area) - (HeightDown * area);
                    }
                    else {
                        return height * area//(height * area) - (HeightDown * area);
                    }
                }
                else return (height * area) - (HeightDown * area);
            }
            else {
                if (bar) {
                    if (vertical)
                        return (height * areaB) + (HeightDown * area);//height * areaB;
                    else
                        return height * areaB;
                }
                else {
                    return (height * areaB) + (HeightDown * area);//height * areaB;
                }
            }
        }
    }
    else if (abs(height) < abs(width)) {
        if (height >= 0) {
            if (width >= 0) {
                if (AB) {
                    if (bar) {
                        if (vertical) {
                            return width * area
                        }
                        else {
                            return height * area
                        }
                    }
                    else {
                        return height * area
                    }
                }
                else return height * areaB
            }
            else {
                if (AB) return height * area
                else return height * areaB
            }
        }
        else {
            if (width >= 0) {
                if (AB) {
                    if (bar) {
                        if (vertical)
                            return -width * area;
                        else
                            return height * area;
                    }
                    else
                        return -width * area;
                }
                else {
                    if (bar) {
                        if (vertical)
                            return (height * areaB) + (HeightDown * area)
                        else
                            return height * areaB//(height * areaB) + (HeightDown * area)
                    }
                    else
                        return (-width * areaB) + (HeightDown * area)
                }
            }
            else {
                if (AB) return height * area;
                else return height * areaB;//(height * areaB) + (HeightUp * area)
            }
        }
    }
}


//roundoff
function roundoff(value) {
    return value = (value >= 1E12) ? 12 : (value <= -1E12) ? 12
        : (value >= 1E11) ? 11 : (value <= -1E11) ? 11
        : (value >= 1E10) ? 10 : (value <= -1E10) ? 10
        : (value >= 1E9) ? 9 : (value <= -1E9) ? 9
        : (value >= 1E8) ? 8 : (value <= -1E8) ? 8
        : (value >= 1E7) ? 7 : (value <= -1E7) ? 7
        : (value >= 1E6) ? 6 : (value <= -1E6) ? 6
        : (value >= 1E5) ? 5 : (value <= -1E5) ? 5
        : (value >= 1E4) ? 4 : (value <= -1E4) ? 4
        : (value >= 1E3) ? 3 : (value <= -1E3) ? 3
        : (value >= 1E2) ? 2 : (value <= -1E2) ? 2
        : 1;
}

//Stack
function Stack(option, value, ic, i, g, animP, garray, totalV, vlength, invert, element, scale) {
    scale = (scale || -1) * -1;
    element = element || false;
    var d = option.data,
        ObjectData = option.ObjectData,
        OD = ObjectData[ic - 1],
        datavalue = DataInput(d, i, g),
        v = (datavalue / totalV) * vlength;

    if (scale > 0)
        value *= 1;
    else
        value *= -1;

    if (!invert) v *= -1;
    if (v == undefined) v = 0;
    v *= animP;
    v *= garray.length;
    if (ObjectData[g - 1].group.ID != OD.group.ID) v = 0;
    if (invert) {
        if (value >= 0) {
            if (element) {
                if (v < 0) v = 0;
            }
            else {
                if (v > 0) v = 0;
            }
        }
        else {
            if (element) {
                if (v > 0) v = 0;
            }
            else {
                if (v <= 0) v = 0;
            }
        }
    }
    else {
        if (value <= 0) {
            if (element) {
                if (v > 0) v = 0;
            }
            else {
                if (v <= 0) v = 0;
            }
        }
        else {
            if (element) {
                if (v <= 0) v = 0;
            }
            else
                if (v > 0) v = 0;
        }
    }
    return v
}

//Stack Percent
function PStack(option, i, g, value, percentanimation, gtotalresult, totalValues, vlength, invert, element, scale) {
    scale = (scale || -1) * -1;
    element = element || false;
    var data = option.data;
    var ObjectData = option.ObjectData;
    var datavalue = NaNCheck(data[i][Object.keys(data[i])[g]]);
    var pstacktotal = PercentTotal(option, i);

    if (scale > 0)
        var pstack = Percent((value / totalValues), pstacktotal);
    else
        var pstack = Percent((value / totalValues), pstacktotal) * -1;

    v = Percent((datavalue / totalValues), pstacktotal) * vlength;
    if (!invert) v *= -1;
    v *= ObjectData.length;
    v *= percentanimation;
    v *= gtotalresult.length;
    if (invert) {
        if (pstack <= 0) {
            if (element) {
                if (v < 0) v = 0;
            }
            else {
                if (v > 0) v = 0;
            }
        }
        else {
            if (element) {
                if (v >= 0) v = 0;
            }
            else {
                if (v <= 0) v = 0;
            }
        }
    }
    else {
        if (pstack <= 0) {
            if (element) {
                if (v > 0) v = 0;
            }
            else {
                if (v < 0) v = 0;
            }
        }
        else {
            if (element) {
                if (v <= 0) v = 0;
            }
            else {
                if (v > 0) v = 0;
            }
        }
    }
    return v
}

//Number Array Total
function ArrayTotal(array) {
    var total = 0;
    for (var i = 0; i < array.length; i++) {
        total += array[i];
    }
    return total;
}

// Max Array Group JSON
function LegendArrayGroup(array, max) {
    var arrayin = []
    for (var j = 0; j < array.length; j++) {
        var arrayadd = 0;
        var group = 0;

        for (k = 0; k <= j; k++) {
            arrayadd += array[k];
            if (arrayadd > max && arrayadd != array[k]) {
                arrayadd = 0;
                arrayadd += array[k];
                group += 1;
            }
        }
        arrayin.push({ 'x': array[j], 'y': group });
    }

    var grouparray = [];
    for (ic = 0; ic < arrayin.length; ic++) {
        var O = arrayin[ic].y;
        grouparray.push(O);
    }
    var grouparrayout = removeDuplicate(grouparray).toString().split(",").map(Number);

    var arraytotal = [];
    for (var j = 0; j < array.length; j++) {
        var arrayaddtotal = 0;
        for (k = 0; k < grouparrayout.length; k++) {
            if (arrayin[j].y == k) {
                for (var i = 0; i < array.length; i++) {
                    if (arrayin[i].y == k) {
                        arrayaddtotal += arrayin[i].x;
                    }
                }
            }
        }
        arraytotal.push(arrayaddtotal);
    }

    var arraysplit = [];
    for (var k = 0; k < grouparrayout.length; k++) {
        var arrayEX = [];
        for (var j = 0; j < arrayin.length; j++) {
            if (arrayin[j].y == k) {
                arrayEX.push(arrayin[j].x);
            }
        }
        arraysplit.push(arrayEX);
    }

    var arrayX = [];
    for (var j = 0; j < arraysplit.length; j++) {
        var arrayadd = 0;
        for (k = 0; k < arraysplit[j].length; k++) {
            if (k == 0) arrayadd = 0;
            else arrayadd += arraysplit[j][k - 1];

            arrayX.push(arrayadd);
        }
    }

    var arrayout = [];
    for (var j = 0; j < array.length; j++) {
        arrayout.push({ x: arrayX[j], y: arrayin[j].y, z: arraytotal[arrayin[j].y] });
    }
    return arrayout
}

// Max Array Group Number
function MaxArrayNum(array, max) {
    var arrayout = []
    for (var j = 0; j < array.length; j++) {
        var arrayadd = 0;
        var group = 0;

        for (k = 0; k <= j; k++) {
            arrayadd += array[k];
            if (arrayadd > max && arrayadd != array[k]) {
                arrayadd = 0;
                arrayadd += array[k];
                group += 1;
            }
        }
        arrayout.push(group);
    }
    return arrayout
}

//Label Legend Array
function LLarray(option, chart, ctx) {
    var data = option.data,
        ObjectData = option.ObjectData,
        legendposition = option.legendposition,
        legendfont = option.legendfont;

    var areasize = 6;
    var Data;
    if (chart == "piedoughnut"
        || chart == "pie"
        || chart == "doughnut"
        || chart == "cone"
        || chart == "pyramid"
        || chart == "cylinder") {
        Data = data;
    }
    else {
        Data = DataOutput(option);
    }

    var arrayout = [];
    var labellegendmeasure;
    for (var j = 0; j < Data.length; j++) {
        if (chart == "piedoughnut"
            || chart == "pie"
            || chart == "doughnut"
            || chart == "cone"
            || chart == "pyramid"
            || chart == "cylinder") {
            labellegendmeasure = data[j][Object.keys(data[j])[0]];
        }
        else {
            if (Data == data) labellegendmeasure = LabelOutput(option, j, false, chart, true);
            else labellegendmeasure = ObjectData[j][Object.keys(ObjectData[j])[0]];
        }
        arrayout.push(ctx.FontWidth(labellegendmeasure, legendfont) + areasize + 12);
    }
    return arrayout
}

//Max Array
function MaxArray(array) {
    var max = 0;
    for (var i = 0; i < array.length; i++) {
        max = (array[i] > max) ? array[i] : max;
    }
    return max
}

//Min Array
function MinArray(array) {
    var min = 0;
    for (var i = 0; i < array.length; i++) {
        min = (array[i] < min) ? array[i] : min;
    }
    return min
}

//Data Input
function DataInput(d, i, j) {
    var dataset = d[i][Object.keys(d[i])[j]];
    var datainput;
    if (typeof dataset == "object"
        && dataset != null) {
        datainput = NaNCheck(dataset.value);
    }
    else { //number, string, or boolean
        datainput = NaNCheck(dataset);
    }
    return datainput
}

//Bar Percent Minus
function BarPercentMinus(option, m, barpercent) {
    var pattern3d = option.pattern3d;
    if (pattern3d == "cone") {
        if (barpercent > 80) {
            barpercent = 80;
        }
    }
    else {
        if (barpercent > 100) {
            barpercent = 100;
        }
    }
    //if (barpercent > 100) barpercent = 100;
    if (barpercent < 0) barpercent = 0;
    return (parseInt(m) * ((100 - barpercent) / 100)) / 2
}

//Max and Min
function MaxMin(option, chart, output) {
    var minset = option.min,
        maxset = option.max;
    var max = 0,
        min = 0;
    var data = dataarrayoutput(option),
        ObjectData = option.ObjectData,
        reversedata = option.reversedata || false,
        percentstack = option.percentstack || false;

    var valueuptotal, valuedowntotal;

    valueuptotal = ValueTotal(option, chart, "up"),
    valuedowntotal = ValueTotal(option, chart, "down");
    var value;

    for (var ic = 1; ic <= ObjectData.length; ic++) {
        for (var i = 0; i < data.length; i++) {
            var subdata = data[i][Object.keys(data[i])[ic]];
            if (typeof subdata == "number") {
                if (!reversedata) {
                    if (chart == "horizontalbar") {
                        if (valueuptotal >= valuedowntotal) {
                            value = DataInput(data, i, ic) * -1;
                        }
                        else if (valueuptotal < valuedowntotal) {
                            value = DataInput(data, i, ic);
                        }
                    }
                    else {
                        if (valueuptotal >= valuedowntotal) {
                            value = DataInput(data, i, ic);
                        }
                        else if (valueuptotal < valuedowntotal) {
                            value = DataInput(data, i, ic) * -1;
                        }
                    }
                }
                else {
                    if (chart == "horizontalbar") {
                        if (valueuptotal >= valuedowntotal) {
                            value = DataInput(data, i, ic);
                        }
                        else if (valueuptotal < valuedowntotal) {
                            value = DataInput(data, i, ic) * -1;
                        }
                    }
                    else {
                        if (valueuptotal >= valuedowntotal) {
                            value = DataInput(data, i, ic) * -1;
                        }
                        else if (valueuptotal < valuedowntotal) {
                            value = DataInput(data, i, ic);
                        }
                    }
                }


            }
            else if (typeof subdata == "object") {
                if (chart == "OHLC") {
                    var OHLCarray = [subdata.open, subdata.high, subdata.low, subdata.close];
                    for (var j = 0; j < OHLCarray.length; j++) {
                        var datavalue = OHLCarray[j];// NaNCheck(subdata[Object.keys(subdata)[j]]);

                        if (valueuptotal >= valuedowntotal) {
                            value = datavalue;
                        }
                        else if (valueuptotal < valuedowntotal) {
                            value = datavalue * -1;
                        }
                        max = (value > max) ? value : max;
                        min = (value < min) ? value : min;
                    }
                }
                else {
                    //var subdata = data[i][Object.keys(data[i])[ic]];
                    datavalue = DataInput(data, i, ic) || NaNCheck(subdata[Object.keys(subdata)[0]]);
                    if (!reversedata) {
                        if (chart == "horizontalbar") {
                            if (valueuptotal >= valuedowntotal) {
                                value = datavalue * -1;
                            }
                            else if (valueuptotal < valuedowntotal) {
                                value = datavalue;
                            }
                        }
                        else {
                            if (valueuptotal >= valuedowntotal) {
                                value = datavalue;
                            }
                            else if (valueuptotal < valuedowntotal) {
                                value = datavalue * -1;
                            }
                        }
                    }
                    else {
                        if (chart == "horizontalbar") {
                            if (valueuptotal >= valuedowntotal) {
                                value = datavalue;
                            }
                            else if (valueuptotal < valuedowntotal) {
                                value = datavalue * -1;
                            }
                        }
                        else {
                            if (valueuptotal >= valuedowntotal) {
                                value = datavalue * -1;
                            }
                            else if (valueuptotal < valuedowntotal) {
                                value = datavalue;
                            }
                        }
                    }
                }
            }
                
            var valueout;
            if (chart == "radar") {
                if (value < 0)
                    valueout = 0
                else
                    valueout = value;
            }
            else {
                valueout = value;
            }

            if (chart != "OHLC"){
                if (percentstack) {
                    var pstacktotal = 0;
                    var pstackadd = [];
                    for (var j = 1; j <= ObjectData.length; j++) {
                        if (!reversedata) pstackadd.push(DataInput(data, i, j));
                        else pstackadd.push(DataInput(data, i, j) * -1);
                    }
                    for (var j = 0; j < pstackadd.length; j++) {
                        pstacktotal += abs(pstackadd[j]);
                    }
                    var pstack = Percent(valueout, pstacktotal);

                    //Percent(x, total)
                    max = (pstack > max) ? 100 : max;
                    min = (pstack < min) ? -100 : min;
                }
                else {
                    max = (valueout > max) ? valueout : max;
                    min = (valueout < min) ? valueout : min;
                }
            }
        }
    }
    if (percentstack) {
        //if (valueuptotal >= valuedowntotal) {
        //}
        //else if (valueuptotal < valuedowntotal) {
        //}
        maxset = maxset || max;
        minset = minset || min
    }
    else {
        maxset = maxset || max;
        minset = minset || min;
    }

    if (output) return maxset;
    else return min;
}

function BarLength(option, length) {
    var ObjectData = option.ObjectData;
    var barpercent = option.barpercent;
    var pattern3d = option.pattern3d;
    if (pattern3d == "cone") {
        if (barpercent > 80) {
            barpercent = 80;
        }
    }
    else {
        if (barpercent > 100) {
            barpercent = 100;
        }
    }
    if (barpercent < 0) barpercent = 0;
    return parseFloat(length * (barpercent / 100)) + parseFloat(1 / ObjectData.length);
}

function BarX(option, i, w, Xorigin, gtotalresultmax) {
    var intervaldata = option.intervaldata || 1,
        data = dataarrayoutput(option),
        ObjectData = option.ObjectData,
        barpercent = option.barpercent;
    var gout
    if (data.length == 1) {
        gout = gtotalresultmax;
    }
    else {
        gout = 1;
    }
    var Xoriginplus;
    var datameasure = data.length;
    if (datameasure == 1) Xoriginplus = Xorigin + (w / 2);
    else Xoriginplus = Xorigin;
    var percentminus = BarPercentMinus(option, w, barpercent);

    var measureout;
    measureout = (parseFloat(Xoriginplus + round(w * i * ObjectData.length)) + (percentminus * ObjectData.length)) * gout;
    if (measureout < 0.5) measureout = 0.5;
    return measureout
}

function BarY(option, i, h, Yorigin) {
    var intervaldata = option.intervaldata || 1,
        data = dataarrayoutput(option),
        ObjectData = option.ObjectData,
        barpercent = option.barpercent;
    var Yoriginplus;
    if (data.length == 1) Yoriginplus = Yorigin + (h / 2);
    else Yoriginplus = Yorigin;
    var percentminus = BarPercentMinus(option, h, barpercent);
    return Yoriginplus - ((parseFloat(h * (i + 1) * ObjectData.length) - (percentminus * ObjectData.length)) + 1)
}

function LineX(option, i, widthtotal, Xorigin) {
    var data = dataarrayoutput(option);
    
    return Xorigin + ((widthtotal / (data.length - 1)) * i);
}

function TotalBarLine(option, barline) {
    var ObjectData = option.ObjectData;
    var ibar = [];
    var iline = [];
    var TL = 0;
    var TB = 0;
    for (i = 0; i < ObjectData.length; i++) {
        OD = ObjectData[i];
        OD.charttype = OD.charttype || "bar";
        if (OD.charttype == "line") ibar.push(1);
        else if (OD.charttype == "bar") ibar.push(0);

        if (OD.charttype == "line") iline.push(0);
        else if (OD.charttype == "bar") iline.push(1);
    }

    for (i = 0; i < ibar.length; i++) {
        TL += ibar[i];
    }
    for (i = 0; i < iline.length; i++) {
        TB += iline[i];
    }

    switch (barline) {
        case "bar":
            return TB;
            break
        case "line":
            return TL;
            break
    }
}

function ValueTotal(option, chart, updown) {
    var data = dataarrayoutput(option);
    var ObjectData = option.ObjectData;
    var reversedata = option.reversedata || false;
    var valuearrayup = [];
    var vuptotal = 0;
    var valuearraydown = [];
    var vdowntotal = 0;

    if (chart == "OHLC") {
        for (var ic = 1; ic <= ObjectData.length; ic++) {
            for (i = 0; i < data.length; i++) {
                var subdata = data[i][Object.keys(data[i])[ic]];
                var OHLCarray = [subdata.open, subdata.high, subdata.low, subdata.close];
                for (var j = 1; j <= OHLCarray.length; j++) {
                    var datavalue = /*OHLCarray[j];*/ NaNCheck(subdata[Object.keys(subdata)[j]]);

                    if (!reversedata) {
                        valuex = datavalue;
                    }
                    else {
                        valuex = datavalue * -1;
                    }

                    if (valuex >= 0) {
                        valuearrayup.push(1);
                        valuearraydown.push(0);
                    }
                    else {
                        valuearrayup.push(0);
                        valuearraydown.push(1);
                    }
                }
            }
        }
    }
    else {
        for (var ic = 1; ic <= ObjectData.length; ic++) {
            for (var i = 0; i < data.length; i++) {
                if (chart == "horizontalbar") {
                    if (!reversedata) {
                        valuex = DataInput(data, i, ic) * -1;
                    }
                    else {
                        valuex = DataInput(data, i, ic);
                    }
                }
                else {
                    if (!reversedata) {
                        valuex = DataInput(data, i, ic);
                    }
                    else {
                        valuex = DataInput(data, i, ic) * -1;
                    }
                }

                if (valuex >= 0) {
                    valuearrayup.push(1);
                    valuearraydown.push(0);
                }
                else {
                    valuearrayup.push(0);
                    valuearraydown.push(1);
                }
            }
        }
    }

    for (j = 0; j < valuearrayup.length; j++) {
        vuptotal += valuearrayup[j];
        vdowntotal += valuearraydown[j];
    }

    switch (updown) {
        case "up":
            return vuptotal;
            break
        case "down":
            return vdowntotal;
            break
    }
}

function AreaFillTotal(option, updown) {
    var data = dataarrayoutput(option);
    var ObjectData = option.ObjectData;
    var reversedata = option.reversedata;
    var valuearrayup = [];
    var vuptotal = 1;
    var valuearraydown = [];
    var vdowntotal = 1;
    for (var ic = 1; ic <= ObjectData.length; ic++) {
        for (var i = 0; i < data.length; i++) {
            if (reversedata == false)
                valuex = DataInput(data, i, ic);
            else
                valuex = DataInput(data, i, ic) * -1;

            if (valuex >= 0) {
                valuearrayup.push(1);
                valuearraydown.push(0);
            }
            else {
                valuearrayup.push(0);
                valuearraydown.push(1);
            }
        }
    }

    for (j = 0; j < valuearrayup.length; j++) {
        vuptotal *= valuearrayup[j];
        vdowntotal *= valuearraydown[j];
    }

    switch (updown) {
        case "up":
            return vuptotal;
            break
        case "down":
            return vdowntotal;
            break
    }
}

//Bar Percentage for 3D Chart
function barpercentmeasure(ctx, option, chart, vertical) {
    var data = dataarrayoutput(option),
        ObjectData = option.ObjectData,
        stacked = option.stacked,
        percentstack = option.percentstack,
        precision = option.precision,
        labelfont = option.labelfont,
        rotatelabel = labelfont.rotatelabel || false,
        enable3d = option.enable3d,
        GArray = GroupArray(ObjectData),
        gtotalmax = MaxArray(GroupArrayTotal(GArray)),
        gtotalresult = removeDuplicate(GArray).toString().split(",").map(Number),
        gtotalresultmax = MaxArray(gtotalresult);

    //plot label
    labelfont.align = labelfont.align || "center";
    labelfont.position = labelfont.position || "bottom";

    var area = 20;

    //checking max and min
    var max = MaxMin(option, chart, true),
        min = MaxMin(option, chart, false);

    var valueuptotal = ValueTotal(option, chart, "up"),
        valuedowntotal = ValueTotal(option, chart, "down");

    var vA = ctx.TBPosition(option, chart, "top"),
        vB = ctx.TBPosition(option, chart, "bottom");
    var width, height;
    if (chart == "horizontalbar") {

        //checking max and min
        var XaddB;

        var hA = ctx.BaseLabelH(option, "left", chart) + 1,//parseInt(xlabelbase + 1);
            hB = ctx.BaseLabelH(option, "right", chart);

        var WCanvas = hB - hA;

        //get perline width

        var YCanvas = vB; //conh - 55
        //var Yorigin = vB;

        var varCompute = ComputeCheck(option, hB, max, min, "y");
        var lineDrawCount = LineCount(option, hB, max, min, "y");
        var intervalV = WCanvas / (lineDrawCount - 1);
        var totalValues = varCompute * (lineDrawCount - 1);

        //graph and labels
        var heightC = YCanvas - vA;

        heightC /= ObjectData.length;
        heightC /= data.length;
        h = heightC;
        if (data.length == 1) h /= 2;

        height = BarLength(option, h);

        //var pstacktotal = PercentTotal(option, i);
        //var pstack = Percent((valuey / totalValues), pstacktotal);

        if (!percentstack) width = parseInt((max / totalValues) * WCanvas);
        ////For Stacked Bar
        //if (stacked && !percentstack) {
        //    var gs = gtotalmax * gtotalresultmax;
        //    width /= gtotalmax;
        //    height *= ObjectData.length;
        //    height /= gtotalresultmax;
        //    for (var g = 1; g < ic; g++) {
        //        valueyAdd = Stack(option, valuey, ic, rev, g, percentanimation, gtotalresult, totalValues, WCanvas, true, true);
        //    }
        //}
        ////For Percentage Stack
        //if (percentstack) {
        //    height *= ObjectData.length;
        //    width = (pstack * WCanvas);
        //    for (var g = 1; g < ic; g++) {
        //        var valueyAddpercent = PStack(option, rev, g, valuey, percentanimation, gtotalresult, totalValues, WCanvas, true, false);
        //    }
        //}

        var areaA = area / 100,
            areaB = 1 - areaA,
            WidthA = WidthFix(width, height, areaA, true, true, vertical),
            WidthB = WidthFix(width, height, areaA, false, true, vertical),
            HeightA = HeightFix(width, height, areaA, true, true, vertical),
            HeightB = HeightFix(width, height, areaA, false, true, vertical)

        if (vertical) {
            return height * areaA//HeightA
        }
        else {
            return height * areaA
        }

        //return 20;
    }
    else {
        var hB = ctx.BaseNum(option, "right", precision, chart);

        /*if (enable3d) {
            measureright.display = false;
        }*/
        var HCanvas = (vB - vA) //+ Vpercent3d;
        //varCompute
        var varCompute = ComputeCheck(option, vB, max, min, "x");
        var lineDrawCount = LineCount(option, vB, max, min, "x");
        var intervalH = HCanvas / (lineDrawCount - 1);
        //var varP = VarPcount(option, vB, max, min, "x");

        var totalValues = (varCompute * (lineDrawCount - 1));

        var xnumbase = ctx.BaseNum(option, "left", precision, chart);
        var numbaseB = hB //- Hpercent3d;

        var Xorigin = (xnumbase + 5) //+ Hpercent3d;
        var XCanvas = numbaseB - 5;

        //graph and label
        var addW = 0;

        var widthtotal = (XCanvas - Xorigin);
        var widthC = widthtotal;
        widthC /= ObjectData.length;
        widthC /= data.length;
        w = widthC;
        if (data.length == 1) w /= 2;

        var totalbar = TotalBarLine(option, "bar");
        var totalline = TotalBarLine(option, "line");

        var width = BarLength(option, w);
        if (totalline >= 1) width *= ((totalline / totalbar) + totalline);

        if (!percentstack) height = parseFloat((max / totalValues) * HCanvas);
        /*
        var pstacktotal = PercentTotal(option, data.length);
        var pstack = Percent((maxX / totalValues), pstacktotal);
    
        //For Stacked Bar
        if (stacked && !percentstack) {
            var gs = gtotalmax * gtotalresultmax;
            width *= totalbar;
            width /= gtotalresultmax;
        }
    
        //For Percentage Stack
        if (percentstack) {
            width *= totalbar;
        }
    
    
        //For Stacked Bar
        if (stacked && !percentstack) {
            height /= gtotalmax;
        }
    
        //For Percentage Stack
        if (percentstack) {
            height = (pstack * HCanvas);
        }*/

        var areaA = area / 100,
            areaB = 1 - areaA,
            WidthA = WidthFix(width, height, areaA, true, true, vertical),
            WidthB = WidthFix(width, height, areaA, false, true, vertical),
            HeightA = HeightFix(width, height, areaA, true, true, vertical),
            HeightB = HeightFix(width, height, areaA, false, true, vertical)

        if (vertical) {
            return height * areaA//HeightA
        }
        else {
            return width * areaA//WidthA
        }
    }
}

var NaNCheck = function (x) {
    if (isNaN(parseFloat(x))) return 0
    else return parseFloat(x)
}
//function NaNCheck(x) {
//    if (isNaN(parseFloat(x))) return 0
//    else return parseFloat(x)
//}

function TextFontHeight(ctx, font) {
    if (isEdge || isIE)
        return ctx.FontHeight(font) * 1.08
    else
        return ctx.FontHeight(font)
}

//Stack 3D
function stack3d(option, i, ic, datainput, chart) {
    var d = option.data,
        OD = option.ObjectData,
        p = 0;
    
    var csadd = [];
    for (var j = OD.length; j >= ic ; j--) {
        if (OD[j - 1].group.ID == OD[ic - 1].group.ID) {
            var datavalue = DataInput(d, i, j);
            if (datainput >= 0) {
                if (datavalue >= 0) {
                    csadd.push(datavalue);
                }
                else {
                    csadd.push(0);
                }
            }
            else {
                if (datavalue >= 0) {
                    csadd.push(0);
                }
                else {
                    csadd.push(datavalue);
                }
            }
        }
        else {
            csadd.push(0);
        }
    }

    for (var j = 0; j < csadd.length; j++) {
        switch (chart) {
            case "horizontalbar":
                p += csadd[j];
                break
            default:
                p += abs(csadd[j]);
                break
        }
    }
    return p
}

//Stack 3D Total
function stacktotal(option, i, ic, datainput, chart) {
    var d = option.data,
        OD = option.ObjectData;
    var p = 0;

    var csadd = [];

    for (var j = 0; j < OD.length ; j++) {
        var ODgroup = OD[j].group || { ID: 1, text: "Group 1" };
        if (ODgroup.ID == undefined || ODgroup.ID < 1) ODgroup.ID = 1;
        if (ODgroup.ID == OD[ic - 1].group.ID) {
            var jout = j + 1;//((OD.length) - j);
            var datavalue = DataInput(d, i, jout);
            if (datainput >= 0) {
                if (datavalue >= 0) {
                    csadd.push(datavalue);
                }
                else {
                    csadd.push(0);
                }
            }
            else {
                if (datavalue >= 0) {
                    csadd.push(0);
                }
                else {
                    csadd.push(datavalue);
                }
            }
        }
        else {
            csadd.push(0);
        }
    }

    for (var j = 0; j < csadd.length; j++) {
        p += abs(csadd[j]);
    }
    return p
}

//Grad Color Out

function gradcolorout(c, x, y, area, fill, gradtype, type) {
    gradtype = gradtype.toString().toLowerCase() || "linear a";

    var grad = [];
    for (var j = 0; j < fill.length; j++) {
        grad.push({
            color: fill[j].color
            , stop: fill[j].stop
        });
    }

    var invert;
    switch (gradtype) {
        case "linear a":
            if (type == "horizontalbar") invert = true;
            else invert = false;
            return c.GradientLinear(0, y * 0.5, area, area, grad, 0, invert, false);
            break
        case "linear b":
            if (type == "horizontalbar") invert = false;
            else invert = true;
            return c.GradientLinear(0, y * 0.5, area, area, grad, 0, invert, false);
            break
        case "linear c": return c.GradientLinear(x * 0.5, 0, area, area, grad, 0, true, true); break
        case "linear d": return c.GradientLinear(x * 0.5, 0, area, area, grad, 0, false, true); break
        case "linear e": return c.GradientLinear(x * 0.5, y * 0.5, area, area, grad, 0, false, true, true); break
        case "linear f": return c.GradientLinear(x * 0.5, y * 0.5, area, area, grad, 0, true, true, true); break
        case "linear g": return c.GradientLinear(x * 0.5, y * 0.5, area, area, grad, 0, true, false, true); break
        case "linear h": return c.GradientLinear(x * 0.5, y * 0.5, area, area, grad, 0, false, false, true); break
        case "radial": return c.GradientCircle(x, y, area / 5, x, y, area, grad); break
    }
}

//Marker Legend
function markerlegend(c, option, Xmarker, Ymarker, ODout, chart, ID, Areamarker) {
    var data = option.data,
        ObjectData = option.ObjectData;
    var OD = ODout;
    c.save();

    var shadow = {
        x: 0,
        y: 0,
        blur: 0,
        color: "Black"
    }

    var markerwidth, markerfill, markerstroke, markerlinestroke, markdash, markcap, markjoin, marker;
    var GradX = Xmarker - Areamarker;
    var GradY = Ymarker - Areamarker;

    if (chart == "piedoughnut"
        || chart == "pie"
        || chart == "doughnut"
        || chart == "cone"
        || chart == "pyramid"
        || chart == "cylinder") {
        Data = data;
    }
    else {
        Data = DataOutput(option);
    }

    if (Data == ObjectData) {
        OD.filltype = OD.filltype || "color";
        if (OD.filltype == "color") {
            var bshine = [];
            bshine.push({ color: rgba(255, 255, 255, 0.5), stop: 0 });
            bshine.push({ color: OD.fillcolor, stop: 0.7 });
            if (OD.heat) {
                var heatcolor = [];
                for (var j = 0; j < OD.fillcolor.length; j++) heatcolor.push({ color: OD.fillcolor[j].color });
                markerfill = c.GradientLinear(GradX, GradY, Areamarker * 2, Areamarker, heatcolor, 0, false, true);
            }
            else {
                if (OD.style == "2d") {
                    markerfill = OD.fillcolor;
                }
                else if (OD.style == "3d") {
                    markerfill = c.GradientCircle(XGradient, YGradient, Areamarker / 5, XGradient, YGradient, Areamarker, bshine);
                }
            }
        }
        else if (OD.filltype == "gradient") {
            if (OD.marker == "off") {
                markerfill = OD.fillcolor[OD.fillcolor.length - 1].color;
            }
            else {
                markerfill = c.GradientMarker(OD.fillcolor, OD.gradienttype, Xmarker, Ymarker, Areamarker);
            }
        }

        markerwidth = OD.strokewidth;
        if (OD.strokewidth > 2) markerwidth = 3;

        markerstroke = OD.strokecolor;
        if (OD.strokecolor == undefined) {
            if (OD.filltype == "color" && OD.style == "2d") markerstroke = OD.fillcolor;
            else if (OD.filltype == "gradient") markerstroke = OD.fillcolor[OD.fillcolor.length - 1].color;
        }

        marker = OD.marker;
    }
    else if (Data == data) {
        var datafill = OD.fillcolor || ObjectData[0].fillcolor;
        //if (OD.fillcolor == undefined) datafill = ObjectData[0].fillcolor;
        if (ObjectData[0].filltype == "color") {
            var bshineB = [];
            bshineB.push({ color: rgba(255, 255, 255, 0.5), stop: 0 });
            bshineB.push({ color: datafill, stop: 0.7 });
            if (ObjectData[0].heat) {
                var heatcolor = [];
                for (var j = 0; j < ObjectData[0].fillcolor.length; j++) heatcolor.push({ color: ObjectData[0].fillcolor[j].color });
                markerfill = c.GradientLinear(GradX, GradY, Areamarker * 2, Areamarker, heatcolor, 0, false, true);
            }
            else {
                if (ObjectData[0].style == "2d") {
                    markerfill = datafill;
                }
                else if (ObjectData[0].style == "3d") {
                    markerfill = c.GradientCircle(XGradient, YGradient, Areamarker / 5, XGradient, YGradient, Areamarker, bshineB);
                }
            }
        }
        else if (ObjectData[0].filltype == "gradient") {
            if (ObjectData[0].marker == "off") {
                markerfill = OD.fillcolor[OD.fillcolor.length - 1].color;
            }
            else {
                markerfill = c.GradientMarker(datafill, ObjectData[0].gradienttype, Xmarker, Ymarker, Areamarker);
            }
        }

        markerwidth = ObjectData[0].strokewidth;
        if (ObjectData[0].strokewidth > 2) markerwidth = 3;

        markerstroke = ObjectData[0].strokecolor;
        if (ObjectData[0].strokecolor == undefined) {
            if (ObjectData[0].filltype == "color" && ObjectData[0].style == "2d") markerstroke = ObjectData[0].fillcolor;
            else if (ObjectData[0].filltype == "gradient") markerstroke = ObjectData[0].fillcolor[ObjectData[0].fillcolor.length - 1].color;
        }

        //if (OD.marker == undefined) OD.marker = ObjectData[0].marker;
        marker = OD.marker || ObjectData[0].marker;
    }

    if (chart == "barline" || chart == "radar") {
        var markerlinefill;
        if (OD.areafilltype == "color") markerlinefill = OD.areafill;
        else if (OD.areafilltype == "gradient") {
            markerlinefill = c.GradientMarker(OD.areafill, OD.gradienttype, Xmarker, Ymarker, Areamarker);
        }
        if (!OD.area) markerlinewidth = OD.strokewidth;
        else markerlinewidth = OD.linewidth;
        if ((OD.strokewidth > 1 && !OD.area)
            || (OD.linewidth > 1 && OD.area)) markerlinewidth = 1;
        var markerline = 2;

        if (Data == data) {
            markerlinestroke = ObjectData[0].linecolor;
            //markdash = ObjectData[0].dash || [0];
            markcap = ObjectData[0].cap || "butt";
            markjoin = ObjectData[0].join || "miter";
            if (ObjectData[0].linecolor == undefined) {
                if (ObjectData[0].filltype == "color") markerlinestroke = ObjectData[0].fillcolor;
                else if (ObjectData[0].filltype == "gradient") markerlinestroke = ObjectData[0].fillcolor[ObjectData[0].fillcolor.length - 1].color;
            }

        }
        else if (Data == ObjectData) {
            //markdash = OD.dash || [0];
            markcap = OD.cap || "butt";
            markjoin = OD.join || "miter";

            if (OD.linewidth > 0) {
                markerlinestroke = OD.linecolor;
                if (OD.linecolor == undefined) {
                    if (OD.filltype == "color") markerlinestroke = OD.fillcolor;
                    else if (OD.filltype == "gradient") markerlinestroke = OD.fillcolor[OD.fillcolor.length - 1].color;
                }
            }

        }
        markdash = OD.dash || [0];

        if (!OD.area) c.Line(Xmarker + 6, parseInt(Ymarker) + 0.5, Xmarker - 6, parseInt(Ymarker) + 0.5, markerline, markerlinestroke, nullshadow, markdash, markcap, markjoin);
        else c.shapeA(Xmarker, Ymarker, 45, 4, 6, markerlinewidth, markerlinefill, markerlinestroke, shadow);
    }

    if (!OD.area) c.Markers(marker, Xmarker, Ymarker, Areamarker, markerwidth, markerfill, markerstroke, 1, ID, shadow);
    //console.log("legend marker width: " + markerfill)
    c.restore();
}

//Stack 3D Group
function group3dstack(option, i) {
    var ObjectData = option.ObjectData;
    var OD3D = [], D3D;
    for (var j = 1; j <= ObjectData.length; j++) {
        D3D = DataInput(data, i, j);
        OD3D.push(D3D);
    }
    var ODadd = [], ODsub = [];
    for (var j = 0; j < ObjectData.length; j++) {
        if (OD3D[j] >= 0) {
            ODadd.push(1);
            ODsub.push(0);
        }
        else {
            ODadd.push(0);
            ODsub.push(1);
        }
    }

    var result = [], group3dadd = 0, groud3dsub = 0;
    for (var j = 0; j < ObjectData.length; j++) {
        var data3dout = OD3D[j];
        if (data3dout >= 0) {
            group3dadd += ODadd[j];
            result.push(group3dadd);
        }
        else {
            groud3dsub -= ODsub[j];
            result.push(groud3dsub);
        }
    }
    return result;
}

function flatten(arr) {
    var flat = [];
    for (var i = 0; i < arr.length; i++) {
        flat = flat.concat(arr[i]);
    }
    return flat;
}

function groupout(option, gtotalresult, concat) {
    concat = concat || true;
    var ObjectData = option.ObjectData;

    var ODgrouparray = [];
    for (var j = 1; j <= gtotalresult.length; j++) {
        var ODcurrentgroup = [];
        var gcount = 0;
        for (var k = 0; k < ObjectData.length; k++) {
            var OD = ObjectData[k];
            OD.group = OD.group || { ID: 1, text: "Group 1" };
            if (OD.group.ID == undefined || OD.group.ID < 1) OD.group.ID = 1;
            //if (ObjectData[k].group.ID == undefined) ObjectData[k].group.ID = 1;
            if (OD.group.ID == j) {
                gcount += 1;
                ODcurrentgroup.push(gcount)
            }
        }
        ODgrouparray.push(ODcurrentgroup)
    }

    if (concat)
        return flatten(ODgrouparray)
    else
        return ODgrouparray
}

function grouplength(option, gtotalresult) {
    var ObjectData = option.ObjectData;
    var ODgrouparray = [];
    for (var j = 1; j <= gtotalresult.length; j++) {
        var gcount = 0;
        for (var k = 0; k < ObjectData.length; k++) {
            var OD = ObjectData[k];
            OD.group = OD.group || { ID: 1, text: "Group 1" };
            if (OD.group.ID == undefined || OD.group.ID < 1) OD.group.ID = 1;
            //if (ObjectData[k].group.ID == undefined) ObjectData[k].group.ID = 1;
            if (OD.group.ID == j) {
                gcount += 1;
                //ODcurrentgroup.push(gcount)
            }
        }
        ODgrouparray.push(gcount)
    }

    return ODgrouparray
}

//Legend Array Num Height
function legendarraynum(ctx, option, chart) {
    var customXY = option.customXY;
    var conw = option.size.width;
    var labellegendarray = LLarray(option, chart, ctx),
        labellegendarraygroup = LegendArrayGroup(labellegendarray, conw),
        labellegendnum = MaxArrayNum(labellegendarray, conw);

    return labellegendnum;
}

//Data Output
function dataarrayoutput(option) {
    var intervaldata = option.intervaldata || 1,
        data = option.data;

    var dataarray = [];
    for (var i = 0; i < data.length; i += intervaldata) {
        dataarray.push(data[i])
    }
    return dataarray;
}

//Default Input
function defaultinput(canvasID, chart, cID, iscanvas) {

    var size = {
        width: 660
        , height: 400
    }

    var data = [];
    switch (chart) {
        case "OHLC":
            data.push({
                label: "Item1"
                , index: { open: 15, high: 40, low: 10, close: 35 }
            });
            data.push({
                label: "Item2"
                , index: { open: 35, high: 40, low: 10, close: 15 }
            });
            data.push({
                label: "Item3"
                , index: { open: 15, high: 10, low: 40, close: 35 }
            });
            data.push({
                label: "Item4"
                , index: { open: 35, high: 10, low: 40, close: 15 }
            });
            data.push({
                label: "Item5"
                , index: { open: 20, high: 40, low: 10, close: 30 }
            });
            data.push({
                label: "Item6"
                , index: { open: 30, high: 40, low: 10, close: 20 }
            });
            break
        case "bubble":
            data.push({
                label: "Item1"
                , index: { 
                    value: 10
                    , area: 100 
                }
                //, fillcolor: "red"
            });
            data.push({
                label: "Item2"
                , index: { 
                    value: 20
                    , area: 70 
                }
                //, fillcolor: "blue"
            });
            data.push({
                label: "Item3"
                , index: { 
                    value: 30
                    , area: 50 
                }
                //, fillcolor: "yellow"
            });
            data.push({
                label: "Item4"
                , index: { 
                    value: 40
                    , area: 30 
                }
                //, fillcolor: "green"
            });
            break
        case "pie":
        case "doughnut":
        case "cone":
        case "pyramid":
        case "cylinder":
            data.push({
                name: "Item1"
                , value: 50
                , fill: "red"
                , filltype: undefined
            });
            data.push({
                name: "Item2"
                , value: 50
                , fill: "yellow"
                , filltype: undefined
            });
            data.push({
                name: "Item3"
                , value: 50
                , fill: "green"
                , filltype: undefined
            });
            break
        default:
            data.push({
                label: "Item1"
                , index: { value: 10 }
                , text: "Test1"
            });
            data.push({
                label: "Item2"
                , index: { value: 20 }
                , text: "Test2"
            });
            data.push({
                label: "Item3"
                , index: { value: 30 }
                , text: "Test3"
            });
            data.push({
                label: "Item4"
                , index: { value: 40 }
                , text: "Test4"
            });
            break
    }

    var min = undefined;
    var max = undefined;

    var reversedata = false;

    var duration;
    if (chart == "pie"
        || chart == "doughnut"
        || chart == "cone"
        || chart == "pyramid"
        || chart == "cylinder") {
        duration = {
            format : "num"
            };
    }
    else {
        duration = {
            xaxis: data.length
            , yaxis: 10
            , interval: 1
        }
    }

    var format = {
        input: undefined
        , datetime: undefined
        , datedisplay: undefined
        , prefix: null
        , suffix: null
    }

    var ObjectData = [];
    if (chart == "OHLC") {
        ObjectData.push({
            name: "Item"
            , fillcolor: "black"//"orange"
            , filltype: "color"
            , style: undefined
            , marker: "OHLC"//"candlestick"
        });
    }
    else {
        ObjectData.push({
            name: "Item"
            , fillcolor: "skyblue"
            , filltype: "color"
            , strokecolor: undefined
            , linecolor: "black"
            , charttype: "bar"
            , dash: [0] //use number format in array e.g. [1, 1]
            , cap: "butt" //butt, round, or square
            , join: "miter" //bevel, round, or miter
            , linewidth: 1
            , strokewidth: 0
            , marker: "o"
            , areasize: 5
            , group: 1
            , displaylegend: true
            , showlabel: false
            , prefix: ""
            , suffix: ""
        });
    }

    var background = rgba(0, 0, 0, 0); //transparent
    var border = {
        style: "solid"
        , fill: "black"
        , width: 0
    }

        //animation
    var animation = false;

        //legend position
    var legendposition //= "none";

        //stacked
    var stacked = false;

        //percent stacked
    var percentstack = false;

        //precision
    var precision = 0;

        //absolute function
    var absolute = false;

    //Line Option
    var optionLine = {
            color: "Black"
            , width: 1
    };
    //Grid Line Option
    var optionGridLine = {
        color: "Black"
        , horizontalcolor: "Black"
        , verticalcolor: "Black"
        , width: 1
        , internalwidth: 1
        , internal: false
    };
        //Measurement Left Option
    var optionMeasureLeft = {
            color: "Black"
        , fontFamily: "Arial"
        , fontSize: 10
        , fontWeight: "Bold"
        , fontStyle: "Normal"
        , textdirection: "off"
        , display: true
    };
        //Measurement Right Option
    var optionMeasureRight = {
        color: "Black"
        , fontFamily: "Arial"
        , fontSize: 10
        , fontWeight: "Bold"
        , fontStyle: "Normal"
        , textdirection: "off"
        , display: true
    };
        //Header Option
    var optionH = {
        color: "Black"
        , fontFamily: "Arial"
        , fontSize: 12
        , text: "Sample Chart"
        , fontWeight: "Bold"
        , fontStyle: "Normal"
        , display: true
    };
        //Sub Header Option
    var optionSH = {
        color: "Black"
        , fontFamily: "Arial"
        , fontSize: 12
        , text: "Sample Sub Header"
        , fontWeight: "Normal"
        , fontStyle: "Italic"
        , display: false
    };
        //Footer Option
    var optionF = {
        color: "Black"
        , fontFamily: "Arial"
        , fontSize: 12
        , text: "Test Footer"
        , fontWeight: "Bold"
        , fontStyle: "Normal"
        , display: false
    };
        //Label Left Option
    var optionLL = {
        color: "Black"
        , fontFamily: "Arial"
        , fontSize: 12
        , text: "Test Label Left"
        , fontWeight: "Bold"
        , fontStyle: "Normal"
        , display: true
    };
        //Label Right Option
    var optionLR = {
        color: "Black"
        , fontFamily: "Arial"
        , fontSize: 12
        , text: "Test Label Right"
        , fontWeight: "Bold"
        , fontStyle: "Normal"
        , display: false
    };
        //Plot Label
    var optionPlotLabel = {
        color: "Black"
        , fontFamily: "Arial"
        , fontSize: 10
        , fontWeight: "Bold"
        , fontStyle: "Normal"
        , custom: false
        , display: false
    };
        //Label Font Option
    var optionLabelFont = {
        color: "Black"
        , fontFamily: "Arial"
        , fontSize: 10
        , fontWeight: "Bold"
        , fontStyle: "Normal"
        , rotate: 0 //number of degrees
        , display: true
        , align: "center"
        , position: undefined
    };
    //Data Label
    var optionDataLabel = {
        color: "Black"
        , fontFamily: "Arial"
        , fontSize: 10
        , fontWeight: "Bold"
        , fontStyle: "Normal"
        , custom: false
        , display: false
    };
        //Legend Font Option
    var optionLegendFont = {
        color: "Black"
        , fontFamily: "Arial"
        , fontSize: 10
        , fontWeight: "Bold"
        , fontStyle: "Normal"
    };
        //Measure Font Option
    var optionMeasureFont = {
        color: "Black"
        , fontFamily: "Arial"
        , fontSize: 10
        , rotate: "off"
        , fontWeight: "Bold"
        , fontStyle: "Normal"
        , display: true
    };
        //Shadow Option
    var shadow = {
        x: 0
        , y: 0
        , blur: 0
        , color: "black"
    };
        //Hover Font Option
    var optionHoverFont = {
        color: "Black"
        , fontFamily: "Arial"
        , fontSize: 12
        , fontWeight: "Bold"
        , fontStyle: "Normal"
        , background: rgba(255, 255, 255, 0.75)
        //, label: {
        //    fontFamily: "Arial"
        //    , fontSize: 12
        //    , fontWeight: "Bold"
        //    , fontStyle: "Normal"
        //}
        //, name: {
        //    fontFamily: "Arial"
        //    , fontSize: 12
        //    , fontWeight: "Bold"
        //    , fontStyle: "Normal"
        //}
        //, value: {
        //    fontFamily: "Arial"
        //    , fontSize: 12
        //    , fontWeight: "Bold"
        //    , fontStyle: "Normal"
        //}
    };
    var totaldisplay = false;
    var convert = false;
    var barpercent = 95;
    var Enable3D = false;
    var pattern3d = null;
    var millisecond = 1000 / 60;
    var bubblelabel = "Area";
    var customXY = false;

    var option = {}

    if (iscanvas == true) {
        option.iscanvas = true;
        option.cID = cID;
    }

    option.duration = duration;
    option.labelfont = optionLabelFont;
    option.measureleft = optionMeasureLeft;
    option.measureright = optionMeasureRight;
    option.plotlabel = optionPlotLabel;
    option.datalabelfont = optionDataLabel;
    option.legendfont = optionLegendFont;
    option.gridline = optionGridLine;
    option.reversedata = reversedata;
    option.precision = precision;
    option.format = format;
    option.shadow = shadow;
    option.size = size;
    option.border = border;
    option.legendposition = legendposition;
    option.hoverfont = optionHoverFont;
    option.totaldisplay = totaldisplay;
    option.kmflag = convert;
    option.absolute = absolute;

    option.canvasID = canvasID;
    option.data = data;
    option.header = optionH;
    option.subheader = optionSH;
    option.footer = optionF;
    option.background = background;
    option.animation = animation;
    option.millisecond = millisecond;
    option.min = min;
    option.max = max;
    option.line = optionLine;
    option.customXY = customXY;
    option.x = 0;
    option.y = 0;
    option.width = 660;
    option.height = 400;
    option.hover = true;
    option.degrees = 90;
    option.intervaldata = 1;

    if (chart == "pie"
        || chart == "doughnut"
        || chart == "cone"
        || chart == "pyramid"
        || chart == "cylinder") {
        option.sort = false;
        option.ascending = true;
    }
    else if (chart == "bubble")
        option.bubblelabel = bubblelabel;

    if (chart != "pie"
        && chart != "doughnut"
        && chart != "cone"
        && chart != "pyramid"
        && chart != "cylinder") {
        option.labelleft = optionLL;
        option.labelright = optionLR;
        option.ObjectData = ObjectData;
    }

    switch (chart) {
        case "OHLC":
            break
        case "horizontalbar": case "radar":
            option.measurefont = optionMeasureFont;
        case "barline":
            option.barpercent = barpercent;
            option.enable3d = Enable3D;
            option.pattern3d = pattern3d;
            option.stacked = stacked;
            option.percentstack = percentstack;
            break
    }
    return option
}

//Vertical Bar and Line Chart
P8.Chart = function (canvasconID, cID, iscanvas) {
    this.option = defaultinput(canvasconID, "barline", cID, iscanvas);
};
P8.Chart.prototype.SetOption = function (option) {
    this.option = option;
};
P8.Chart.prototype.SetHeader = function (header) {
    this.option.header = header;
};
P8.Chart.prototype.SetSubHeader = function (subheader) {
    this.option.subheader = subheader;
};
P8.Chart.prototype.SetFooter = function (footer) {
    this.option.footer = footer;
};
P8.Chart.prototype.SetLabelLeft = function (labelleft) {
    this.option.labelleft = labelleft;
};
P8.Chart.prototype.SetLabelRight = function (labelright) {
    this.option.labelright = labelright;
};
P8.Chart.prototype.SetDuration = function (duration) {
    this.option.duration = duration;
};
P8.Chart.prototype.SetData = function (data) {
    this.option.data = data;
};
P8.Chart.prototype.SetLabelFont = function (labelfont) {
    this.option.labelfont = labelfont;
};
P8.Chart.prototype.SetMeasureLeft = function (measureleft) {
    this.option.measureleft = measureleft;
};
P8.Chart.prototype.SetMeasureRight = function (measureright) {
    this.option.measureright = measureright;
};
P8.Chart.prototype.SetGridLine = function (gridline) {
    this.option.gridline = gridline;
};
P8.Chart.prototype.SetLegendFont = function (legendfont) {
    this.option.legendfont = legendfont;
};
P8.Chart.prototype.SetPlotLabel = function (plotlabel) {
    this.option.plotlabel = plotlabel;
};
P8.Chart.prototype.SetObject = function (ObjectData) {
    this.option.ObjectData = ObjectData;
};
P8.Chart.prototype.SetBackground = function (background) {
    this.option.background = background;
};
P8.Chart.prototype.SetBorder = function (border) {
    this.option.border = border;
};
P8.Chart.prototype.SetAnimation = function (animation) {
    this.option.animation = animation;
};
P8.Chart.prototype.SetMillisecond = function (millisecond) {
    this.option.millisecond = millisecond;
};
P8.Chart.prototype.SetStacked = function (stacked) {
    this.option.stacked = stacked;
};
P8.Chart.prototype.SetReverseData = function (reversedata) {
    this.option.reversedata = reversedata;
};
P8.Chart.prototype.SetFormat = function (format) {
    this.option.format = format;
};
P8.Chart.prototype.SetPercentStack = function (percentstack) {
    this.option.percentstack = percentstack;
};
P8.Chart.prototype.SetSize = function (size) {
    this.option.size = size;
};
P8.Chart.prototype.SetShadow = function (shadow) {
    this.option.shadow = shadow;
};
P8.Chart.prototype.SetLegendPosition = function (legendposition) {
    this.option.legendposition = legendposition;
};
P8.Chart.prototype.SetHoverFont = function (hoverfont) {
    this.option.hoverfont = hoverfont;
};
P8.Chart.prototype.SetTotalDisplay = function (totaldisplay) {
    this.option.totaldisplay = totaldisplay;
};
P8.Chart.prototype.SetKMFlag = function (kmflag) {
    this.option.kmflag = kmflag;
};
P8.Chart.prototype.SetPrecision = function (precision) {
    this.option.precision = precision;
};
P8.Chart.prototype.SetBarPercent = function (barpercent) {
    this.option.barpercent = barpercent;
};
P8.Chart.prototype.SetMax = function (max) {
    this.option.max = max;
};
P8.Chart.prototype.SetMin = function (min) {
    this.option.min = min;
};
P8.Chart.prototype.SetAbsolute = function (absolute) {
    this.option.absolute = absolute;
};
P8.Chart.prototype.SetEnable3D = function (enable3d) {
    this.option.enable3d = enable3d;
};
P8.Chart.prototype.SetPattern3D = function (pattern3d) {
    this.option.pattern3d = pattern3d;
};
P8.Chart.prototype.SetIntervalData = function (intervaldata) {
    this.option.intervaldata = intervaldata;
};
P8.Chart.prototype.CustomXY = function (bool) {
    this.option.customXY = bool;
};
P8.Chart.prototype.x = function (x) {
    this.option.x = x;
};
P8.Chart.prototype.y = function (y) {
    this.option.y = y;
};
//P8.Chart.prototype.width = function (width) {
//    this.option.width = width;
//};
//P8.Chart.prototype.height = function (height) {
//    this.option.height = height;
//};
P8.Chart.prototype.Hover = function (hover) {
    this.option.hover = hover;
};
P8.Chart.prototype.Render = function () {
    CreateChart(this.option, "barline", click);
};

//Scatter Chart
P8.SChart = function (canvasID, cID, iscanvas) {
    this.option = defaultinput(canvasID, "scatter", cID, iscanvas);
};
P8.SChart.prototype.SetOption = function (option) {
    this.option = option;
};
P8.SChart.prototype.SetHeader = function (header) {
    this.option.header = header;
};
P8.SChart.prototype.SetSubHeader = function (subheader) {
    this.option.subheader = subheader;
};
P8.SChart.prototype.SetFooter = function (footer) {
    this.option.footer = footer;
};
P8.SChart.prototype.SetLabelLeft = function (labelleft) {
    this.option.labelleft = labelleft;
};
P8.SChart.prototype.SetLabelRight = function (labelright) {
    this.option.labelright = labelright;
};
P8.SChart.prototype.SetDuration = function (duration) {
    this.option.duration = duration;
};
P8.SChart.prototype.SetData = function (data) {
    this.option.data = data;
};
P8.SChart.prototype.SetLabelFont = function (labelfont) {
    this.option.labelfont = labelfont;
};
P8.SChart.prototype.SetMeasureLeft = function (measureleft) {
    this.option.measureleft = measureleft;
};
P8.SChart.prototype.SetMeasureRight = function (measureright) {
    this.option.measureright = measureright;
};
P8.SChart.prototype.SetGridLine = function (gridline) {
    this.option.gridline = gridline;
};
P8.SChart.prototype.SetLegendFont = function (legendfont) {
    this.option.legendfont = legendfont;
};
P8.SChart.prototype.SetPlotLabel = function (plotlabel) {
    this.option.plotlabel = plotlabel;
};
P8.SChart.prototype.SetObject = function (ObjectData) {
    this.option.ObjectData = ObjectData;
};
P8.SChart.prototype.SetBackground = function (background) {
    this.option.background = background;
};
P8.SChart.prototype.SetBorder = function (border) {
    this.option.border = border;
};
P8.SChart.prototype.SetAnimation = function (animation) {
    this.option.animation = animation;
};
P8.SChart.prototype.SetMillisecond = function (millisecond) {
    this.option.millisecond = millisecond;
};
P8.SChart.prototype.SetStacked = function (stacked) {
    this.option.stacked = stacked;
};
P8.SChart.prototype.SetReverseData = function (reversedata) {
    this.option.reversedata = reversedata;
};
P8.SChart.prototype.SetFormat = function (format) {
    this.option.format = format;
};
P8.SChart.prototype.SetPercentStack = function (percentstack) {
    this.option.percentstack = percentstack;
};
P8.SChart.prototype.SetSize = function (size) {
    this.option.size = size;
};
P8.SChart.prototype.SetShadow = function (shadow) {
    this.option.shadow = shadow;
};
P8.SChart.prototype.SetLegendPosition = function (legendposition) {
    this.option.legendposition = legendposition;
};
P8.SChart.prototype.SetHoverFont = function (hoverfont) {
    this.option.hoverfont = hoverfont;
};
P8.SChart.prototype.SetTotalDisplay = function (totaldisplay) {
    this.option.totaldisplay = totaldisplay;
};
P8.SChart.prototype.SetKMFlag = function (kmflag) {
    this.option.kmflag = kmflag;
};
P8.SChart.prototype.SetPrecision = function (precision) {
    this.option.precision = precision;
};
P8.SChart.prototype.SetBarPercent = function (barpercent) {
    this.option.barpercent = barpercent;
};
P8.SChart.prototype.SetMax = function (max) {
    this.option.max = max;
};
P8.SChart.prototype.SetMin = function (min) {
    this.option.min = min;
};
P8.SChart.prototype.SetAbsolute = function (absolute) {
    this.option.absolute = absolute;
};
P8.SChart.prototype.SetEnable3D = function (enable3d) {
    this.option.enable3d = enable3d;
};
P8.SChart.prototype.CustomXY = function (bool) {
    this.option.customXY = bool;
};
P8.SChart.prototype.x = function (x) {
    this.option.x = x;
};
P8.SChart.prototype.y = function (y) {
    this.option.y = y;
};
P8.SChart.prototype.SetIntervalData = function (intervaldata) {
    this.option.intervaldata = intervaldata;
};
//P8.SChart.prototype.width = function (width) {
//    this.option.width = width;
//};
//P8.SChart.prototype.height = function (height) {
//    this.option.height = height;
//};
P8.SChart.prototype.Hover = function (hover) {
    this.option.hover = hover;
};
P8.SChart.prototype.Render = function () {
    CreateChart(this.option, "scatter", click);
};

//Horizontal Bar Chart
P8.HChart = function (canvasID, cID, iscanvas) {
    this.option = defaultinput(canvasID, "horizontalbar", cID, iscanvas);//option;
};
P8.HChart.prototype.SetOption = function (option) {
    this.option = option;
};
P8.HChart.prototype.SetHeader = function (header) {
    this.option.header = header;
};
P8.HChart.prototype.SetSubHeader = function (subheader) {
    this.option.subheader = subheader;
};
P8.HChart.prototype.SetFooter = function (footer) {
    this.option.footer = footer;
};
P8.HChart.prototype.SetLabelLeft = function (labelleft) {
    this.option.labelleft = labelleft;
};
P8.HChart.prototype.SetLabelRight = function (labelright) {
    this.option.labelright = labelright;
};
P8.HChart.prototype.SetData = function (data) {
    this.option.data = data;
};
P8.HChart.prototype.SetDuration = function (duration) {
    this.option.duration = duration;
};
P8.HChart.prototype.SetObject = function (ObjectData) {
    this.option.ObjectData = ObjectData;
};
P8.HChart.prototype.SetBackground = function (background) {
    this.option.background = background;
};
P8.HChart.prototype.SetBorder = function (border) {
    this.option.border = border;
};
P8.HChart.prototype.SetGridLine = function (gridline) {
    this.option.gridline = gridline;
};
P8.HChart.prototype.SetLegendFont = function (legendfont) {
    this.option.legendfont = legendfont;
};
P8.HChart.prototype.SetLabelFont = function (labelfont) {
    this.option.labelfont = labelfont;
};
P8.HChart.prototype.SetMeasureFont = function (measurefont) {
    this.option.measurefont = measurefont;
};
P8.HChart.prototype.SetAnimation = function (animation) {
    this.option.animation = animation;
};
P8.HChart.prototype.SetMillisecond = function (millisecond) {
    this.option.millisecond = millisecond;
};
P8.HChart.prototype.SetStacked = function (stacked) {
    this.option.stacked = stacked;
};
P8.HChart.prototype.SetPercentStack = function (percentstack) {
    this.option.percentstack = percentstack;
};
P8.HChart.prototype.SetReverse = function (reverse) {
    this.option.reverse = reverse;
};
P8.HChart.prototype.SetFormat = function (reverse) {
    this.option.format = format;
};
P8.HChart.prototype.SetSize = function (size) {
    this.option.size = size;
};
P8.HChart.prototype.SetShadow = function (shadow) {
    this.option.shadow = shadow;
};
P8.HChart.prototype.SetLegendPosition = function (legendposition) {
    this.option.legendposition = legendposition;
};
P8.HChart.prototype.SetHoverFont = function (hoverfont) {
    this.option.hoverfont = hoverfont;
};
P8.HChart.prototype.SetBarPercent = function (barpercent) {
    this.option.barpercent = barpercent;
};
P8.HChart.prototype.SetKMFlag = function (kmflag) {
    this.option.kmflag = kmflag;
};
P8.HChart.prototype.SetMax = function (max) {
    this.option.max = max;
};
P8.HChart.prototype.SetMin = function (min) {
    this.option.min = min;
};
P8.HChart.prototype.SetAbsolute = function (absolute) {
    this.option.absolute = absolute;
};
P8.HChart.prototype.SetEnable3D = function (enable3d) {
    this.option.enable3d = enable3d;
};
P8.HChart.prototype.SetPattern3D = function (pattern3d) {
    this.option.pattern3d = pattern3d;
};
P8.HChart.prototype.CustomXY = function (bool) {
    this.option.customXY = bool;
};
P8.HChart.prototype.x = function (x) {
    this.option.x = x;
};
P8.HChart.prototype.y = function (y) {
    this.option.y = y;
};
P8.HChart.prototype.SetIntervalData = function (intervaldata) {
    this.option.intervaldata = intervaldata;
};
//P8.HChart.prototype.width = function (width) {
//    this.option.width = width;
//};
//P8.HChart.prototype.height = function (height) {
//    this.option.height = height;
//};
P8.HChart.prototype.Hover = function (hover) {
    this.option.hover = hover;
};
P8.HChart.prototype.Render = function () {
    CreateChart(this.option, "horizontalbar", click);
};

//Bubble Chart
P8.BChart = function (canvasID, cID, iscanvas) {
    this.option = defaultinput(canvasID, "bubble", cID, iscanvas);
};
P8.BChart.prototype.SetOption = function (option) {
    this.option = option;
};
P8.BChart.prototype.SetHeader = function (header) {
    this.option.header = header;
};
P8.BChart.prototype.SetSubHeader = function (subheader) {
    this.option.subheader = subheader;
};
P8.BChart.prototype.SetFooter = function (footer) {
    this.option.footer = footer;
};
P8.BChart.prototype.SetLabelLeft = function (labelleft) {
    this.option.labelleft = labelleft;
};
P8.BChart.prototype.SetLabelRight = function (labelright) {
    this.option.labelright = labelright;
};
P8.BChart.prototype.SetLabelFont = function (labelfont) {
    this.option.labelfont = labelfont;
};
P8.BChart.prototype.SetMeasureLeft = function (measureleft) {
    this.option.measureleft = measureleft;
};
P8.BChart.prototype.SetMeasureRight = function (measureright) {
    this.option.measureright = measureright;
};
P8.BChart.prototype.SetLegendFont = function (legendfont) {
    this.option.legendfont = legendfont;
};
P8.BChart.prototype.SetPlotLabel = function (plotlabel) {
    this.option.plotlabel = plotlabel;
};
P8.BChart.prototype.SetData = function (data) {
    this.option.data = data;
};
P8.BChart.prototype.SetKMFlag = function (kmflag) {
    this.option.kmflag = kmflag;
};
P8.BChart.prototype.SetDuration = function (duration) {
    this.option.duration = duration;
};
P8.BChart.prototype.SetObject = function (ObjectData) {
    this.option.ObjectData = ObjectData;
};
P8.BChart.prototype.SetBubbleArea = function (bubblearea) {
    this.option.bubblearea = bubblearea;
};
P8.BChart.prototype.SetBubbleLabel = function (bubblelabel) {
    this.option.bubblelabel = bubblelabel;
};
P8.BChart.prototype.SetBackground = function (background) {
    this.option.background = background;
};
P8.BChart.prototype.SetFormat = function (format) {
    this.option.format = format;
};
P8.BChart.prototype.SetBorder = function (border) {
    this.option.border = border;
};
P8.BChart.prototype.SetSize = function (size) {
    this.option.size = size;
};
P8.BChart.prototype.SetGridLine = function (gridline) {
    this.option.gridline = gridline;
};
P8.BChart.prototype.SetGradColor = function (gradcolor) {
    this.option.gradcolor = gradcolor;
};
P8.BChart.prototype.SetAnimation = function (animation) {
    this.option.animation = animation;
};
P8.BChart.prototype.SetMillisecond = function (millisecond) {
    this.option.millisecond = millisecond;
};
P8.BChart.prototype.SetShadow = function (shadow) {
    this.option.shadow = shadow;
};
P8.BChart.prototype.SetLegendPosition = function (legendposition) {
    this.option.legendposition = legendposition;
};
P8.BChart.prototype.SetHoverFont = function (hoverfont) {
    this.option.hoverfont = hoverfont;
};
P8.BChart.prototype.SetMax = function (max) {
    this.option.max = max;
};
P8.BChart.prototype.SetMin = function (min) {
    this.option.min = min;
};
P8.BChart.prototype.SetAbsolute = function (absolute) {
    this.option.absolute = absolute;
};
P8.BChart.prototype.CustomXY = function (bool) {
    this.option.customXY = bool;
};
P8.BChart.prototype.x = function (x) {
    this.option.x = x;
};
P8.BChart.prototype.y = function (y) {
    this.option.y = y;
};
P8.BChart.prototype.SetIntervalData = function (intervaldata) {
    this.option.intervaldata = intervaldata;
};
//P8.BChart.prototype.width = function (width) {
//    this.option.width = width;
//};
//P8.BChart.prototype.height = function (height) {
//    this.option.height = height;
//};
P8.BChart.prototype.Hover = function (hover) {
    this.option.hover = hover;
    };
P8.BChart.prototype.Render = function () {
    CreateChart(this.option, "bubble", click);
};

//OHLC Chart
P8.OHLCChart = function (canvasID, cID, iscanvas) {
    this.option = defaultinput(canvasID, "OHLC", cID, iscanvas);//option;
};
P8.OHLCChart.prototype.SetOption = function (option) {
    this.option = option;
};
P8.OHLCChart.prototype.SetHeader = function (header) {
    this.option.header = header;
};
P8.OHLCChart.prototype.SetSubHeader = function (subheader) {
    this.option.subheader = subheader;
};
P8.OHLCChart.prototype.SetFooter = function (footer) {
    this.option.footer = footer;
};
P8.OHLCChart.prototype.SetLabelLeft = function (labelleft) {
    this.option.labelleft = labelleft;
};
P8.OHLCChart.prototype.SetLabelRight = function (labelright) {
    this.option.labelright = labelright;
};
P8.OHLCChart.prototype.SetDuration = function (duration) {
    this.option.duration = duration;
};
P8.OHLCChart.prototype.SetData = function (data) {
    this.option.data = data;
};
P8.OHLCChart.prototype.SetLabelFont = function (labelfont) {
    this.option.labelfont = labelfont;
};
P8.OHLCChart.prototype.SetMeasureLeft = function (measureleft) {
    this.option.measureleft = measureleft;
};
P8.OHLCChart.prototype.SetMeasureRight = function (measureright) {
    this.option.measureright = measureright;
};
P8.OHLCChart.prototype.SetGridLine = function (gridline) {
    this.option.gridline = gridline;
};
P8.OHLCChart.prototype.SetLegendFont = function (legendfont) {
    this.option.legendfont = legendfont;
};
P8.OHLCChart.prototype.SetObject = function (ObjectData) {
    this.option.ObjectData = ObjectData;
};
P8.OHLCChart.prototype.SetBackground = function (background) {
    this.option.background = background;
};
P8.OHLCChart.prototype.SetFormat = function (format) {
    this.option.format = format;
};
P8.OHLCChart.prototype.SetBorder = function (border) {
    this.option.border = border;
};
P8.OHLCChart.prototype.SetAnimation = function (animation) {
    this.option.animation = animation;
};
P8.OHLCChart.prototype.SetMillisecond = function (millisecond) {
    this.option.millisecond = millisecond;
};
P8.OHLCChart.prototype.SetSize = function (size) {
    this.option.size = size;
};
P8.OHLCChart.prototype.SetShadow = function (shadow) {
    this.option.shadow = shadow;
};
P8.OHLCChart.prototype.SetLegendPosition = function (legendposition) {
    this.option.legendposition = legendposition;
};
P8.OHLCChart.prototype.SetHoverFont = function (hoverfont) {
    this.option.hoverfont = hoverfont;
};
P8.OHLCChart.prototype.SetKMFlag = function (kmflag) {
    this.option.kmflag = kmflag;
};
P8.OHLCChart.prototype.SetMax = function (max) {
    this.option.max = max;
};
P8.OHLCChart.prototype.SetMin = function (min) {
    this.option.min = min;
};
P8.OHLCChart.prototype.CustomXY = function (bool) {
    this.option.customXY = bool;
};
P8.OHLCChart.prototype.x = function (x) {
    this.option.x = x;
};
P8.OHLCChart.prototype.y = function (y) {
    this.option.y = y;
};
P8.OHLCChart.prototype.SetIntervalData = function (intervaldata) {
    this.option.intervaldata = intervaldata;
};
//P8.OHLCChart.prototype.width = function (width) {
//    this.option.width = width;
//};
//P8.OHLCChart.prototype.height = function (height) {
//    this.option.height = height;
//};
P8.OHLCChart.prototype.Hover = function (hover) {
    this.option.hover = hover;
};
P8.OHLCChart.prototype.Render = function () {
    CreateChart(this.option, "OHLC", click);
};

//Radar Chart
P8.RChart = function (canvasID, cID, iscanvas) {
    this.option = defaultinput(canvasID, "radar", cID, iscanvas);//option;
};
P8.RChart.prototype.SetOption = function (option) {
    this.option = option;
};
P8.RChart.prototype.SetHeader = function (header) {
    this.option.header = header;
};
P8.RChart.prototype.SetSubHeader = function (subheader) {
    this.option.subheader = subheader;
};
P8.RChart.prototype.SetFooter = function (footer) {
    this.option.footer = footer;
};
P8.RChart.prototype.SetDuration = function (duration) {
    this.option.duration = duration;
};
P8.RChart.prototype.SetData = function (data) {
    this.option.data = data;
};
P8.RChart.prototype.SetLabelFont = function (labelfont) {
    this.option.labelfont = labelfont;
};
P8.RChart.prototype.SetMeasureFont = function (measurefont) {
    this.option.measurefont = measurefont;
};
P8.RChart.prototype.SetGridLine = function (gridline) {
    this.option.gridline = gridline;
};
P8.RChart.prototype.SetLegendFont = function (legendfont) {
    this.option.legendfont = legendfont;
};
P8.RChart.prototype.SetPlotLabel = function (plotlabel) {
    this.option.plotlabel = plotlabel;
};
P8.RChart.prototype.SetObject = function (ObjectData) {
    this.option.ObjectData = ObjectData;
};
P8.RChart.prototype.SetBackground = function (background) {
    this.option.background = background;
};
P8.RChart.prototype.SetBorder = function (border) {
    this.option.border = border;
};
P8.RChart.prototype.SetAnimation = function (animation) {
    this.option.animation = animation;
};
P8.RChart.prototype.SetMillisecond = function (millisecond) {
    this.option.millisecond = millisecond;
};
P8.RChart.prototype.SetStacked = function (stacked) {
    this.option.stacked = stacked;
};
P8.RChart.prototype.SetReverseData = function (reversedata) {
    this.option.reversedata = reversedata;
};
P8.RChart.prototype.SetFormat = function (format) {
    this.option.format = format;
};
P8.RChart.prototype.SetPercentStack = function (percentstack) {
    this.option.percentstack = percentstack;
};
P8.RChart.prototype.SetSize = function (size) {
    this.option.size = size;
};
P8.RChart.prototype.SetShadow = function (shadow) {
    this.option.shadow = shadow;
};
P8.RChart.prototype.SetLegendPosition = function (legendposition) {
    this.option.legendposition = legendposition;
};
P8.RChart.prototype.SetHoverFont = function (hoverfont) {
    this.option.hoverfont = hoverfont;
};
P8.RChart.prototype.SetTotalDisplay = function (totaldisplay) {
    this.option.totaldisplay = totaldisplay;
};
P8.RChart.prototype.SetKMFlag = function (kmflag) {
    this.option.kmflag = kmflag;
};
P8.RChart.prototype.SetPrecision = function (precision) {
    this.option.precision = precision;
};
P8.RChart.prototype.SetBarPercent = function (barpercent) {
    this.option.barpercent = barpercent;
};
P8.RChart.prototype.SetMax = function (max) {
    this.option.max = max;
};
P8.RChart.prototype.SetMin = function (min) {
    this.option.min = min;
};
P8.RChart.prototype.SetAbsolute = function (absolute) {
    this.option.absolute = absolute;
};
P8.RChart.prototype.CustomXY = function (bool) {
    this.option.customXY = bool;
};
P8.RChart.prototype.x = function (x) {
    this.option.x = x;
};
P8.RChart.prototype.y = function (y) {
    this.option.y = y;
};
P8.RChart.prototype.SetIntervalData = function (intervaldata) {
    this.option.intervaldata = intervaldata;
};
//P8.RChart.prototype.width = function (width) {
//    this.option.width = width;
//};
//P8.RChart.prototype.height = function (height) {
//    this.option.height = height;
//};
P8.RChart.prototype.Hover = function (hover) {
    this.option.hover = hover;
};
P8.RChart.prototype.Render = function () {
    CreateChart(this.option, "radar", click);
};

//Pie Chart
P8.PieChart = function (canvasID, cID, iscanvas) {
    this.option = defaultinput(canvasID, "pie", cID, iscanvas);
};
P8.PieChart.prototype.SetOption = function (option) {
    this.option = option;
};
P8.PieChart.prototype.SetData = function (data) {
    this.option.data = data;
};
P8.PieChart.prototype.SetBackground = function (background) {
    this.option.background = background;
};
P8.PieChart.prototype.SetBorder = function (border) {
    this.option.border = border;
};
P8.PieChart.prototype.SetHeader = function (header) {
    this.option.header = header;
};
P8.PieChart.prototype.SetSubHeader = function (subheader) {
    this.option.subheader = subheader;
};
P8.PieChart.prototype.SetFooter = function (footer) {
    this.option.footer = footer;
};
P8.PieChart.prototype.SetLine = function (line) {
    this.option.line = line;
};
P8.PieChart.prototype.SetLegendFont = function (legendfont) {
    this.option.legendfont = legendfont;
};
P8.PieChart.prototype.SetHoverFont = function (hoverfont) {
    this.option.hoverfont = hoverfont;
};
P8.PieChart.prototype.SetDataLabelFont = function (datalabelfont) {
    this.option.datalabelfont = datalabelfont;
};
P8.PieChart.prototype.SetSize = function (size) {
    this.option.size = size;
};
P8.PieChart.prototype.SetLegendPosition = function (legendposition) {
    this.option.legendposition = legendposition;
};
P8.PieChart.prototype.SetFormat = function (format) {
    this.option.format = format;
};
P8.PieChart.prototype.SetShadow = function (shadow) {
    this.option.shadow = shadow;
};
P8.PieChart.prototype.SetAnimation = function (animation) {
    this.option.animation = animation;
};
P8.PieChart.prototype.SetMillisecond = function (millisecond) {
    this.option.millisecond = millisecond;
};
P8.PieChart.prototype.SetSort = function (sort) {
    this.option.sort = sort;
};
P8.PieChart.prototype.SetAscending = function (ascending) {
    this.option.ascending = ascending;
};
P8.PieChart.prototype.SetAbsolute = function (absolute) {
    this.option.absolute = absolute;
};
P8.PieChart.prototype.SetPlotLabel = function (plotlabel) {
    this.option.plotlabel = plotlabel;
};
P8.PieChart.prototype.CustomXY = function (bool) {
    this.option.customXY = bool;
};
P8.PieChart.prototype.x = function (x) {
    this.option.x = x;
};
P8.PieChart.prototype.y = function (y) {
    this.option.y = y;
};
P8.PieChart.prototype.SetDegrees = function (degrees) {
    this.option.degrees = degrees;
};
//P8.PieChart.prototype.width = function (width) {
//    this.option.width = width;
//};
//P8.PieChart.prototype.height = function (height) {
//    this.option.height = height;
//};
P8.PieChart.prototype.Hover = function (hover) {
    this.option.hover = hover;
};
P8.PieChart.prototype.Render = function () {
    CreateChart(this.option, "pie", click);
};

//Doughnut Chart
P8.DoughnutChart = function (canvasID, cID, iscanvas) {
    this.option = defaultinput(canvasID, "doughnut", cID, iscanvas);
};
P8.DoughnutChart.prototype.SetOption = function (option) {
    this.option = option;
};
P8.DoughnutChart.prototype.SetData = function (data) {
    this.option.data = data;
};
P8.DoughnutChart.prototype.SetBackground = function (background) {
    this.option.background = background;
};
P8.DoughnutChart.prototype.SetBorder = function (border) {
    this.option.border = border;
};
P8.DoughnutChart.prototype.SetHeader = function (header) {
    this.option.header = header;
};
P8.DoughnutChart.prototype.SetSubHeader = function (subheader) {
    this.option.subheader = subheader;
};
P8.DoughnutChart.prototype.SetFooter = function (footer) {
    this.option.footer = footer;
};
P8.DoughnutChart.prototype.SetLine = function (line) {
    this.option.line = line;
};
P8.DoughnutChart.prototype.SetLegendFont = function (legendfont) {
    this.option.legendfont = legendfont;
};
P8.DoughnutChart.prototype.SetHoverFont = function (hoverfont) {
    this.option.hoverfont = hoverfont;
};
P8.DoughnutChart.prototype.SetDataLabelFont = function (datalabelfont) {
    this.option.datalabelfont = datalabelfont;
};
P8.DoughnutChart.prototype.SetSize = function (size) {
    this.option.size = size;
};
P8.DoughnutChart.prototype.SetLegendPosition = function (legendposition) {
    this.option.legendposition = legendposition;
};
P8.DoughnutChart.prototype.SetFormat = function (format) {
    this.option.format = format;
};
P8.DoughnutChart.prototype.SetShadow = function (shadow) {
    this.option.shadow = shadow;
};
P8.DoughnutChart.prototype.SetAnimation = function (animation) {
    this.option.animation = animation;
};
P8.DoughnutChart.prototype.SetMillisecond = function (millisecond) {
    this.option.millisecond = millisecond;
};
P8.DoughnutChart.prototype.SetSort = function (sort) {
    this.option.sort = sort;
};
P8.DoughnutChart.prototype.SetAscending = function (ascending) {
    this.option.ascending = ascending;
};
P8.DoughnutChart.prototype.SetAbsolute = function (absolute) {
    this.option.absolute = absolute;
};
P8.DoughnutChart.prototype.SetPlotLabel = function (plotlabel) {
    this.option.plotlabel = plotlabel;
};
P8.DoughnutChart.prototype.CustomXY = function (bool) {
    this.option.customXY = bool;
};
P8.DoughnutChart.prototype.x = function (x) {
    this.option.x = x;
};
P8.DoughnutChart.prototype.y = function (y) {
    this.option.y = y;
};
P8.DoughnutChart.prototype.SetDegrees = function (degrees) {
    this.option.degrees = degrees;
};
//P8.DoughnutChart.prototype.width = function (width) {
//    this.option.width = width;
//};
//P8.DoughnutChart.prototype.height = function (height) {
//    this.option.height = height;
//};
P8.DoughnutChart.prototype.Hover = function (hover) {
    this.option.hover = hover;
};
P8.DoughnutChart.prototype.Render = function () {
    CreateChart(this.option, "doughnut", click);
};

//Cone Chart
P8.ConeChart = function (canvasID, cID, iscanvas) {
    this.option = defaultinput(canvasID, "cone", cID, iscanvas);
};
P8.ConeChart.prototype.SetOption = function (option) {
    this.option = option;
};
P8.ConeChart.prototype.SetData = function (data) {
    this.option.data = data;
};
P8.ConeChart.prototype.SetBackground = function (background) {
    this.option.background = background;
};
P8.ConeChart.prototype.SetBorder = function (border) {
    this.option.border = border;
};
P8.ConeChart.prototype.SetHeader = function (header) {
    this.option.header = header;
};
P8.ConeChart.prototype.SetSubHeader = function (subheader) {
    this.option.subheader = subheader;
};
P8.ConeChart.prototype.SetFooter = function (footer) {
    this.option.footer = footer;
};
P8.ConeChart.prototype.SetLine = function (line) {
    this.option.line = line;
};
P8.ConeChart.prototype.SetLegendFont = function (legendfont) {
    this.option.legendfont = legendfont;
};
P8.ConeChart.prototype.SetHoverFont = function (hoverfont) {
    this.option.hoverfont = hoverfont;
};
P8.ConeChart.prototype.SetSize = function (size) {
    this.option.size = size;
};
P8.ConeChart.prototype.SetLegendPosition = function (legendposition) {
    this.option.legendposition = legendposition;
};
P8.ConeChart.prototype.SetFormat = function (format) {
    this.option.format = format;
};
P8.ConeChart.prototype.SetShadow = function (shadow) {
    this.option.shadow = shadow;
};
P8.ConeChart.prototype.SetAnimation = function (animation) {
    this.option.animation = animation;
};
P8.ConeChart.prototype.SetMillisecond = function (millisecond) {
    this.option.millisecond = millisecond;
};
P8.ConeChart.prototype.SetSort = function (sort) {
    this.option.sort = sort;
};
P8.ConeChart.prototype.SetAscending = function (ascending) {
    this.option.ascending = ascending;
};
P8.ConeChart.prototype.SetAbsolute = function (absolute) {
    this.option.absolute = absolute;
};
P8.ConeChart.prototype.SetPlotLabel = function (plotlabel) {
    this.option.plotlabel = plotlabel;
};
P8.ConeChart.prototype.CustomXY = function (bool) {
    this.option.customXY = bool;
};
P8.ConeChart.prototype.x = function (x) {
    this.option.x = x;
};
P8.ConeChart.prototype.y = function (y) {
    this.option.y = y;
};
//P8.ConeChart.prototype.width = function (width) {
//    this.option.width = width;
//};
//P8.ConeChart.prototype.height = function (height) {
//    this.option.height = height;
//};
P8.ConeChart.prototype.Hover = function (hover) {
    this.option.hover = hover;
};
P8.ConeChart.prototype.Render = function () {
    CreateChart(this.option, "cone", click);
};

//Pyramid Chart
P8.PyramidChart = function (canvasID, cID, iscanvas) {
    this.option = defaultinput(canvasID, "pyramid", cID, iscanvas);
};
P8.PyramidChart.prototype.SetOption = function (option) {
    this.option = option;
};
P8.PyramidChart.prototype.SetData = function (data) {
    this.option.data = data;
};
P8.PyramidChart.prototype.SetBackground = function (background) {
    this.option.background = background;
};
P8.PyramidChart.prototype.SetBorder = function (border) {
    this.option.border = border;
};
P8.PyramidChart.prototype.SetHeader = function (header) {
    this.option.header = header;
};
P8.PyramidChart.prototype.SetSubHeader = function (subheader) {
    this.option.subheader = subheader;
};
P8.PyramidChart.prototype.SetFooter = function (footer) {
    this.option.footer = footer;
};
P8.PyramidChart.prototype.SetLine = function (line) {
    this.option.line = line;
};
P8.PyramidChart.prototype.SetLegendFont = function (legendfont) {
    this.option.legendfont = legendfont;
};
P8.PyramidChart.prototype.SetHoverFont = function (hoverfont) {
    this.option.hoverfont = hoverfont;
};
P8.PyramidChart.prototype.SetSize = function (size) {
    this.option.size = size;
};
P8.PyramidChart.prototype.SetLegendPosition = function (legendposition) {
    this.option.legendposition = legendposition;
};
P8.PyramidChart.prototype.SetFormat = function (format) {
    this.option.format = format;
};
P8.PyramidChart.prototype.SetShadow = function (shadow) {
    this.option.shadow = shadow;
};
P8.PyramidChart.prototype.SetAnimation = function (animation) {
    this.option.animation = animation;
};
P8.PyramidChart.prototype.SetMillisecond = function (millisecond) {
    this.option.millisecond = millisecond;
};
P8.PyramidChart.prototype.SetSort = function (sort) {
    this.option.sort = sort;
};
P8.PyramidChart.prototype.SetAscending = function (ascending) {
    this.option.ascending = ascending;
};
P8.PyramidChart.prototype.SetAbsolute = function (absolute) {
    this.option.absolute = absolute;
};
P8.PyramidChart.prototype.SetPlotLabel = function (plotlabel) {
    this.option.plotlabel = plotlabel;
};
P8.PyramidChart.prototype.CustomXY = function (bool) {
    this.option.customXY = bool;
};
P8.PyramidChart.prototype.x = function (x) {
    this.option.x = x;
};
P8.PyramidChart.prototype.y = function (y) {
    this.option.y = y;
};
//P8.PyramidChart.prototype.width = function (width) {
//    this.option.width = width;
//};
//P8.PyramidChart.prototype.height = function (height) {
//    this.option.height = height;
//};
P8.PyramidChart.prototype.Hover = function (hover) {
    this.option.hover = hover;
};
P8.PyramidChart.prototype.Render = function () {
    CreateChart(this.option, "pyramid", click);
};

//Cylinder Chart
P8.CylinderChart = function (canvasID, cID, iscanvas) {
    this.option = defaultinput(canvasID, "cylinder", cID, iscanvas);
};
P8.CylinderChart.prototype.SetOption = function (option) {
    this.option = option;
};
P8.CylinderChart.prototype.SetData = function (data) {
    this.option.data = data;
};
P8.CylinderChart.prototype.SetBackground = function (background) {
    this.option.background = background;
};
P8.CylinderChart.prototype.SetBorder = function (border) {
    this.option.border = border;
};
P8.CylinderChart.prototype.SetHeader = function (header) {
    this.option.header = header;
};
P8.CylinderChart.prototype.SetSubHeader = function (subheader) {
    this.option.subheader = subheader;
};
P8.CylinderChart.prototype.SetFooter = function (footer) {
    this.option.footer = footer;
};
P8.CylinderChart.prototype.SetLine = function (line) {
    this.option.line = line;
};
P8.CylinderChart.prototype.SetLegendFont = function (legendfont) {
    this.option.legendfont = legendfont;
};
P8.CylinderChart.prototype.SetHoverFont = function (hoverfont) {
    this.option.hoverfont = hoverfont;
};
P8.CylinderChart.prototype.SetSize = function (size) {
    this.option.size = size;
};
P8.CylinderChart.prototype.SetLegendPosition = function (legendposition) {
    this.option.legendposition = legendposition;
};
P8.CylinderChart.prototype.SetFormat = function (format) {
    this.option.format = format;
};
P8.CylinderChart.prototype.SetShadow = function (shadow) {
    this.option.shadow = shadow;
};
P8.CylinderChart.prototype.SetAnimation = function (animation) {
    this.option.animation = animation;
};
P8.CylinderChart.prototype.SetMillisecond = function (millisecond) {
    this.option.millisecond = millisecond;
};
P8.CylinderChart.prototype.SetSort = function (sort) {
    this.option.sort = sort;
};
P8.CylinderChart.prototype.SetAscending = function (ascending) {
    this.option.ascending = ascending;
};
P8.CylinderChart.prototype.SetAbsolute = function (absolute) {
    this.option.absolute = absolute;
};
P8.CylinderChart.prototype.SetPlotLabel = function (plotlabel) {
    this.option.plotlabel = plotlabel;
};
P8.CylinderChart.prototype.CustomXY = function (bool) {
    this.option.customXY = bool;
};
P8.CylinderChart.prototype.x = function (x) {
    this.option.x = x;
};
P8.CylinderChart.prototype.y = function (y) {
    this.option.y = y;
};
//P8.CylinderChart.prototype.width = function (width) {
//    this.option.width = width;
//};
//P8.CylinderChart.prototype.height = function (height) {
//    this.option.height = height;
//};
P8.CylinderChart.prototype.Hover = function (hover) {
    this.option.hover = hover;
};
P8.CylinderChart.prototype.Render = function () {
    CreateChart(this.option, "cylinder", click);
};

//start of create canvas
function CreateChart(option, type, click) {
    var canvasIDcon = option.canvasID,
        iscanvas = option.iscanvas,
        canvasID = (iscanvas) ? option.cID : canvasIDcon + "_canvas",
        //canvasID = option.cID || option.canvasID + "_canvas",
        chart = type;

    var elementlist = [];

    var elementcanvas = ElementID(canvasID);

    if (elementcanvas == undefined || elementcanvas == null || iscanvas == true) {
        Para(option, chart, click);
    }
    
    var ctx = Canvas(canvasID);

    option.intervaldata = option.intervaldata || 1;

    var data = dataarrayoutput(option);//option.data;
    var legendfont = option.legendfont;
    var legendposition = option.legendposition || "none";
    var absolute = option.absolute || false;
    var millisecond = option.millisecond || (1000 / 60);
    var customXY = option.customXY || false;
    var conw, conh;

    var animation, customX, customY;
    if (customXY) {
        animation = false;
        customX = option.x;
        customY = option.y;
    }
    else {
        customX = 0;
        customY = 0;
        animation = option.animation || false;
    }
    conw = option.size.width,//660 default number
    conh = option.size.height; //400 default number
    var percentanimation;
    //Horizontal Bar
    if (type == "horizontalbar") {
        var centerX = round((conw / 2) * 1.211);
        var centerY = conh / 2;
        var center = centerX + centerY;
        var h;

        var ObjectData = option.ObjectData;
        var maxset = option.maxset;
        var minset = option.minset || 0;
        var gridline = option.gridline;
        var measurefont = option.measurefont;
        var labelfont = option.labelfont;
        var duration = option.duration;
        var enable3d = option.enable3d;
        var pattern3d = option.pattern3d;
        var intervaldata = option.intervaldata || 1;

        var optionH = option.header,
            optionSH = option.subheader,
            optionF = option.footer,
            optionLL = option.labelleft,
            optionLR = option.labelright;

        var stacked = option.stacked || false;
        var percentstack = option.percentstack || false;
        var reverse = option.reverse || false;
        var shadow = option.shadow;
        var barpercent = option.barpercent;
        var convert = option.kmflag;
        var plotlabel = option.plotlabel;

        optionH.display = optionH.display || false;
        optionSH.display = optionSH.display || false;
        optionF.display = optionF.display || false;
        optionLL.display = optionLL.display || false;
        optionLR.display = optionLR.display || false;

        var format = option.format;
        var xlabelbase;
        var rev;
        var chart = type;

        var GArray = GroupArray(ObjectData);
        var gtotalmax = MaxArray(GroupArrayTotal(GArray));
        var gtotalresult = removeDuplicate(GArray).toString().split(",").map(Number);
        var gtotalresultmax = MaxArray(gtotalresult);

        //multiple vertical lines
        var vline;
        var yline = data.length;

        var Hpercent;
        if (enable3d) {
            if (stacked) 
                Hpercent = barpercentmeasure(ctx, option, chart, false) * gtotalmax;
            else
                Hpercent = barpercentmeasure(ctx, option, chart, false);
        }
        else
            Hpercent = 0;

        var hmovex = ctx.BaseLabelH(option, "left", chart) + 1,//parseInt(xlabelbase + 1);
            hline = ctx.BaseLabelH(option, "right", chart) //- Hpercent

        //checking max and min
        var XaddB;

        var maxY = MaxMin(option, chart, true),
            minY = MaxMin(option, chart, false);

        var valueuptotal = ValueTotal(option, chart, "up"),
            valuedowntotal = ValueTotal(option, chart, "down");

        //get perline width

        lineheight = ctx.TBPosition(option, chart, "top");
        hposition = ctx.TBPosition(option, chart, "bottom");

        //graph and labels
        var YCanvas = hposition; //conh - 55

        var heighttotal = YCanvas - lineheight;
        var heightC = heighttotal;
        heightC /= ObjectData.length;
        heightC /= data.length;
        h = heightC;
        if (data.length == 1) h /= 2;

        var WCanvas = (hline - hmovex); //- (h * 0.2);

        var Yorigin = hposition;
        var addH = 1;

        var varCompute = ComputeCheck(option, hline, maxY, minY, "y");
        var varP = VarPcount(option, hline, maxY, minY, "y");
        var lineDrawCount = LineCount(option, hline, maxY, minY, "y");
        var intervalV = WCanvas / (lineDrawCount - 1);

        for (var i = 0; i < lineDrawCount; i++) {
            if (valueuptotal >= valuedowntotal) {
                cx = parseInt(i * intervalV) + hmovex;

                if (varP == 0) {
                    cxline = cx - (Hpercent);
                }
            }
            else if (valueuptotal < valuedowntotal) {
                cx = parseInt(((lineDrawCount - 1) - i) * intervalV) + hmovex;
                if (varP == 0) {
                    cxline = cx + (Hpercent * 0.05);
                }
            }

            if (varP == 0) {
                var XaddB = cx;
                var XaddBline = cxline;
            }
            varP -= varCompute;

        }

        var totalValues = varCompute * (lineDrawCount - 1);
        var Gout = groupout(option, gtotalresult, true);

        //animate
        var barHAnimate;
        animatecanvas(option, canvasID, animateHBar, animation, percent);
        //ctx.beginPath();
        function animateHBar() {
            if (percent == 100 || !animation) {
                cancelAnimFrame(barHAnimate);
                var a = ElementID(canvasID);
                a.setAttribute("p8animate", false);
                a.setAttribute("p8draw", true);
                percentanimation = 1;
            }
            else {
                if (percent < 100) {
                    barHAnimate = requestAnimFrame(animateHBar, millisecond);
                }
                percentanimation = percent / 100;
                percent++
            } //end else
            //ctx.clear(conw, conh);
            ctx.gridlinesdraw(option, precision, chart);
            var YaddH = 0;
            ctx.save();
            for (var ic = 1; ic <= ObjectData.length; ic++) {
                var OD = ObjectData[ic - 1];
                ODlabel = OD[Object.keys(OD)[0]] || "";
                OD.fillcolor = OD.fillcolor || "black";
                OD.filltype = OD.filltype || "color";
                OD.style = OD.style || "2d";
                OD.group = OD.group || { ID: 1, text: "Group 1" };
                if (OD.group.ID == undefined || OD.group.ID < 1) OD.group.ID = 1;
                OD.group.text = OD.group.text || ("Group " + OD.group.ID);
                for (var i = 0; i < data.length; i++) {
                    if (percentstack) {
                        if (!reverse) rev = i;
                        else rev = (data.length - 1) - i;
                    }
                    else {
                        if (reverse) rev = i;
                        else rev = (data.length - 1) - i;
                    }
                    var barfill;
                    var datacolor = data[rev].fillcolor || OD.fillcolor;

                    var datainput = DataInput(data, rev, ic);
                    if (datainput > maxset) datainput = maxset;

                    var valueout, valuey, scaleX;
                    //valueout = datainput;
                    if (enable3d) {
                        switch (pattern3d) {
                            //case "cylinder":
                            //    valuey = datainput;
                            //    break
                            case "cone": case "pyramid":
                                var percent3dstack;
                                if (stacked) {
                                    valuey = stack3d(option, rev, ic, datainput, chart, gtotalresult);
                                    var percentout;
                                    if (valuey >= 0)
                                        percentout = 100;
                                    else
                                        percentout = -100
                                    percent3dstack = Percent(valuey, stacktotal(option, rev, ic, datainput, chart, gtotalresult));//(valuey / stacktotal(option, rev, ic, datainput, chart, gtotalresult)) * 100;
                                }
                                else {
                                    valuey = datainput;
                                    percent3dstack = 100;
                                }

                                //if (valueout >= 0) scaleX = 1;
                                //else scaleX = -1;
                                break
                            default:
                                valuey = datainput;
                                break
                        }
                    }
                    else valuey = datainput;
                    //valuey = datainput;

                    var x = XaddB; //XaddB
                    var y = BarY(option, rev, h, Yorigin) + YaddH;
                    var width;
                    var height;

                    if (valuedowntotal > valueuptotal) {
                        if (valuedowntotal == data.length) {
                            x
                        }
                        else {
                            if (valueout < 0) x //+= Hpercent;
                        }
                    }
                    else {
                        if (valueuptotal == data.length) {
                            x
                        }
                        else {
                            if (valueout > 0) x //-= Hpercent;
                        }
                    }

                    height = BarLength(option, h);

                    var pstacktotal = PercentTotal(option, i);
                    var pstack = Percent((valuey / totalValues), pstacktotal);

                    if (!percentstack) width = parseInt((valuey / totalValues) * (WCanvas)) * percentanimation;

                    //For Stacked Bar
                    if (stacked && !percentstack) {
                        var gs = gtotalmax * gtotalresultmax;
                        width /= gtotalmax;
                        height *= ObjectData.length;
                        height /= gtotalresultmax;
                        y += (height * (OD.group.ID - 1));
                        for (var g = 1; g < ic; g++) {
                            valueyAdd = Stack(option, valuey, ic, rev, g, percentanimation, gtotalresult, totalValues, WCanvas, true, true);
                            //if (enable3d) 
                            x += (valueyAdd / gs) //- WidthAstack;
                        }
                    }

                    //For Percentage Stack
                    if (percentstack) {
                        height *= ObjectData.length;
                        width = (pstack * WCanvas) * percentanimation;
                        for (var g = 1; g < ic; g++) {
                            var valueyAddpercent = PStack(option, rev, g, valuey, percentanimation, gtotalresult, totalValues, WCanvas, true, false);
                            x += (valueyAddpercent / ObjectData.length);
                        }
                    }

                    if (valuedowntotal > valueuptotal) {
                        if (valuedowntotal == data.length) {
                            width;
                        }
                        else {
                            width //+= Hpercent;
                        }

                    }
                    else {
                        if (valueuptotal == data.length) {
                            width;
                        }
                        else {
                             width //-= Hpercent;
                        }
                    }

                    if (enable3d) {
                        switch (pattern3d){
                            case "cone":
                                width //-= (h * 0.2)
                                break
                            default:
                                width
                                break
                        }
                    }
                    else width

                    if (valuey >= 0) x += 1;
                    if (valuey < 0) x;

                    //gradient
                    //var shine = [];
                    //shine.push({ color: datacolor, stop: 0 });
                    //shine.push({ color: 'white', stop: 0.25 });
                    //shine.push({ color: datacolor, stop: 0.5 });

                    var shine = [];
                    shine.push({ color: rgba(0, 0, 0, 0), stop: 0 });
                    shine.push({ color: rgba(255, 255, 255, 0.7), stop: 0.25 });
                    shine.push({ color: rgba(255, 255, 255, 0.7), stop: 0.35 });
                    shine.push({ color: rgba(0, 0, 0, 0), stop: 0.8 });

                    if (OD.filltype == "gradient") {
                        var gtypeout = OD.gradienttype || "linear a";
                        gtypeout = gtypeout.toString().toLowerCase();
                        var grad = [];
                        var elementgrad = [];
                        for (var j = 0; j < OD.fillcolor.length; j++) {
                            grad.push({ color: OD.fillcolor[j].color, stop: OD.fillcolor[j].stop });
                            elementgrad.push(OD.fillcolor[j].color);
                        }
                        switch (gtypeout) {
                            case "linear a": barfill = ctx.GradientLinear(0, y, width, height, grad, 0, true, false); break
                            case "linear b": barfill = ctx.GradientLinear(0, y, width, height, grad, 0, false, false); break
                            case "linear c": barfill = ctx.GradientLinear(x, 0, width, height, grad, 0, true, true); break
                            case "linear d": barfill = ctx.GradientLinear(x, 0, width, height, grad, 0, false, true); break
                            case "linear e":
                                if (valuey >= 0) barfill = ctx.GradientLinear(x, y, width, height, grad, 0, false, true, true);
                                else barfill = ctx.GradientLinear(x, y, width, height, grad, 0, false, false, true);
                                break
                            case "linear f":
                                if (valuey >= 0) barfill = ctx.GradientLinear(x, y, width, height, grad, 0, true, true, true);
                                else barfill = ctx.GradientLinear(x, y, width, height, grad, 0, true, false, true);
                                break
                            case "linear g":
                                if (valuey >= 0) barfill = ctx.GradientLinear(x, y, width, height, grad, 0, false, false, true);
                                else barfill = ctx.GradientLinear(x, y, width, height, grad, 0, false, true, true);
                                break
                            case "linear h":
                                if (valuey >= 0) barfill = ctx.GradientLinear(x, y, width, height, grad, 0, true, false, true);
                                else barfill = ctx.GradientLinear(x, y, width, height, grad, 0, true, true, true);
                                break
                            //case "radial":  barfill = ctx.GradientCircle(x + width, y, (width * height) / 5, x + width, y , (width * height), grad )
                        }
                        elementfill = elementgrad;
                    }
                    else if (OD.filltype == "color") {
                        //if (OD.style == "2d")
                        //    barfill = datacolor;
                        //else if (OD.style == "3d")
                        //    barfill = ctx.GradientLinear(0, y, width, height, shine, 0, false, false);
                    barfill = datacolor;
                    elementfill = datacolor;
                    var shinefill = ctx.GradientLinear(0, y, width, height, shine, 0, false, false);
                    }
                    OD.strokewidth = OD.strokewidth || 0;
                    barwidth = OD.strokewidth;
                    if (percentstack || stacked) barwidth = 0;
                    barstroke = OD.strokecolor || "black";


                    var group3D = group3dstack(option, rev);
                    if (OD.bevel)
                        ctx.bevelbar(valuey, x + 0.5, y - 0.5, width, height + 1.5, barwidth, barfill, barstroke, chart, shadow);
                    else {

                        var stretch = true;

                        if (enable3d) {
                            var Glength = gtotalresult.length;
                            switch (pattern3d) {
                                case "cylinder":
                                    ctx.cylinder(x, y, width, height, 20, true, false, 1, barfill, barstroke, barwidth, [0], shadow, chart, option, ic, rev, group3D[ic - 1], Gout, Glength);
                                    break
                                case "cone":
                                    ctx.cone(x, y, width, height, 10, 0, stretch, percent3dstack, 0, height, true, true, 1, OD.filltype, OD.gradienttype, barfill, barstroke, barwidth, [0], shadow, Gout[ic - 1], option, rev, ic);
                                    break
                                case "pyramid":
                                    ctx.pyramid(x, y, width, height, 20, 0, true, stretch, percent3dstack, 0, height, true, 1, OD.filltype, OD.gradienttype, barfill, barstroke, barwidth, [0], shadow, chart, option, group3D[ic - 1], ic, rev, Gout, Glength);
                                    break
                                default:
                                    ctx.Bar3D(x, y, width, height, 20, 0, barfill, "", 0, [0], shadow, false, 1, option, group3D[ic - 1], ic, rev, chart, Gout, Glength);
                                    break
                            }
                        }
                        else {
                            ctx.drawhbar(x, y, width, height, barwidth, barfill, barstroke, shadow);
                            if (OD.style == "3d") ctx.drawhbar(x, y, width, height, barwidth, shinefill, barstroke, nullshadow);
                        }
                    }

                }
                if (!stacked && !percentstack) YaddH += height;
            }
            ctx.Line(parseInt(XaddBline) + 0.5, parseInt(lineheight) + 0.5, parseInt(XaddBline) + 0.5, parseInt(hposition) + 1.5, gridline.width, gridline.color, nullshadow);
            var YaddHtxt = 0;
            for (var ic = 1; ic <= ObjectData.length; ic++) {
                var OD = ObjectData[ic - 1];
                ODlabel = OD[Object.keys(OD)[0]] || "";
                OD.group = OD.group || { ID: 1, text: "Group 1" };
                if (OD.group.ID == undefined || OD.group.ID < 1) OD.group.ID = 1;
                OD.group.text = OD.group.text || ("Group " + OD.group.ID);
                OD.prefix = OD.prefix || "";
                OD.suffix = OD.suffix || "";
                for (var i = 0; i < data.length; i++) {
                    if (percentstack) {
                        if (!reverse) rev = i;
                        else rev = (data.length - 1) - i;
                    }
                    else {
                        if (reverse) rev = i;
                        else rev = (data.length - 1) - i;
                    }

                    var datainput = DataInput(data, rev, ic);
                    if (datainput > maxset) datainput = maxset;

                    var valuey = datainput;
                    var valueout = datainput;

                    var x = XaddB; //XaddB
                    var y = BarY(option, rev, h, Yorigin) + YaddHtxt;
                    var width;
                    var height;

                    height = BarLength(option, h);

                    var pstacktotal = PercentTotal(option, i);
                    var pstack = Percent((valuey / totalValues), pstacktotal);

                    if (!percentstack) width = parseInt((valuey / totalValues) * WCanvas) * percentanimation;
                    //For Stacked Bar
                    if (stacked && !percentstack) {
                        var gs = gtotalmax * gtotalresultmax;
                        width /= gtotalmax;
                        height *= ObjectData.length;
                        height /= gtotalresultmax;
                        y += (height * (OD.group.ID - 1));
                        for (var g = 1; g < ic; g++) {
                            valueyAdd = Stack(option, valuey, ic, rev, g, percentanimation, gtotalresult, totalValues, WCanvas, true, true);
                            x += (valueyAdd / gs);
                        }
                    }
                    //For Percentage Stack
                    if (percentstack) {
                        height *= ObjectData.length;
                        width = (pstack * WCanvas) * percentanimation;
                        for (var g = 1; g < ic; g++) {
                            var valueyAddpercent = PStack(option, rev, g, valuey, percentanimation, gtotalresult, totalValues, WCanvas, true, false);
                            x += (valueyAddpercent / ObjectData.length);
                        }
                    }

                    if (valuey >= 0) x += 1;
                    if (valuey < 0) x;

                    if (!reversedata) elementvalue = datainput;
                    else elementvalue = datainput * -1;

                    data[i].text = data[i].text || "";

                    if (plotlabel.custom) plotlabeldisplay = data[i].text;
                    else plotlabeldisplay = parseInt(elementvalue * percentanimation);
                    //plotlabeldisplay = parseInt(elementvalue * percentanimation);
                    if (datainput <= 0)
                        plotlabelx = x - width;
                    else
                        plotlabelx = x + width;

                    if (datainput > 0) plotlabelalign = "center";
                    else plotlabelalign = "center";

                    if (click
                        || plotlabel.display) ctx.Text(plotlabeldisplay, plotlabelx, y + (height / 2), 0, plotlabel.color, null, 0, plotlabelalign, "middle", plotlabel);
                    ctx.restore();
                }
                if (!stacked && !percentstack) YaddHtxt += height;
            }
            ctx.restore();
            var YaddE = 0;
            for (var ic = 1; ic <= ObjectData.length; ic++) {
                var OD = ObjectData[ic - 1];
                ODlabel = OD[Object.keys(OD)[0]] || "";
                OD.fillcolor = OD.fillcolor || "black";
                OD.filltype = OD.filltype || "color";
                OD.style = OD.style || "2d";
                OD.group = OD.group || { ID: 1, text: "Group 1" };
                if (OD.group.ID == undefined || OD.group.ID < 1) OD.group.ID = 1;
                OD.group.text = OD.group.text || ("Group " + OD.group.ID);
                for (var i = 0; i < data.length; i++) {
                    if (reverse) rev = i;
                    else rev = (data.length - 1) - i;
                    //var datacolor = data[rev].fillcolor || OD.fillcolor;

                    var datainput = DataInput(data, rev, ic);
                    if (datainput > maxset) datainput = maxset;

                    valuey = datainput;
                    var x = hmovex; //XaddB
                    var y = BarY(option, rev, h, Yorigin) + YaddE;
                    var width;
                    //if (!percentstack) width = parseInt((valuey / totalValues) * WCanvas) * percentanimation;
                    width = WCanvas;
                    var height;

                    var pstacktotal = PercentTotal(option, rev);
                    var pstack = Percent((valuey / totalValues), pstacktotal);
                    height = YCanvas;//BarLength(option, h);
                    //For Stacked Bar
                    //if (stacked && !percentstack) {
                    //    var gs = gtotalmax * gtotalresultmax;

                    //    height *= ObjectData.length;
                    //    height /= gtotalresultmax;
                    //    width /= gtotalmax;

                    //    y += (height * (OD.group.ID - 1));
                    //    for (var g = 1; g < ic; g++) {
                    //        valueyAdd = Stack(option, valuey, ic, rev, g, percentanimation, gtotalresult, totalValues, WCanvas, true, true);
                    //        x += (valueyAdd / gs);
                    //    }
                    //}
                    //For Percentage Stack
                    //if (percentstack) {
                    //    width = (pstack * WCanvas) * percentanimation;
                    //    height *= ObjectData.length;
                    //    for (var g = 1; g < ic; g++) {
                    //        var valueyAddpercent = PStack(option, rev, g, valuey, percentanimation, gtotalresult, totalValues, WCanvas, true, false);
                    //        x += (valueyAddpercent / ObjectData.length);
                    //    }
                    //}
                    //if (valuey >= 0) x += 1;
                    //if (valuey < 0) x;

                    var elemrev;
                    if (reverse) {
                        elemrev = (data.length - 1) - i;
                    }
                    else {
                        elemrev = i;
                    }

                    if (percentstack) {
                        elementlabel = LabelOutput(option, elemrev, true, chart);
                    }
                    else {
                        elementlabel = LabelOutput(option, elemrev, true, chart);
                    }

                    //var elementtext, elementgroup;

                    //if (gtotalresultmax > 1) elementgroup = " (" + OD.group.text + ")";
                    //else elementgroup = "";

                    //if (stacked) elementtext = ODlabel + elementgroup;
                    //else elementtext = ODlabel;

                    if (percentstack) elementpercent = " (" + round(pstack) + "%)" + "<br>";
                    else elementpercent = "";

                    elementvalue = (valuey) + "<br>";

                    var ytest = (heighttotal + 8) / data.length;

                    elementY = (lineheight) + (ytest * rev);
                    elementheight = ytest;
                    //console.log(elementY)
                    //if (valuey > 0) {
                    //    elementX = x;
                    //    elementwidth = width;
                    //}
                    //else {
                    //    elementX = x + width;
                    //    elementwidth = width * -1;
                    //}
                    elementX = x;
                    elementwidth = width;

                    var valuelist = [],
                        ODlist = [],
                        percentlist = [],
                        filltypelist = [],
                        filllist = [],
                        gradtypelist = [],
                        grouplist = [],
                        patternlist = [],
                        strokelist = [],
                        strokeWarray = [],
                        percentarray;

                    for (var j = 1; j <= ObjectData.length; j++) {
                        var ODE = ObjectData[j - 1];

                        valuearray = DataInput(data, elemrev, j);

                        if (percentstack) percentarray = " (" + round(Percent(round(valuearray), pstacktotal)) + "%)";
                        else percentarray = "";

                        if (ODE.filltype == "color") {
                            var datacolorlist;
                            if (data[elemrev].fillcolor == undefined || j > 1) datacolorlist = ODE.fillcolor;
                            else datacolorlist = data[elemrev].fillcolor;
                            filllistresult = datacolorlist;
                        }
                        else if (ODE.filltype == "gradient") {
                            ODE.gradienttype = ODE.gradienttype || "linear a";
                            var elementgrad = [];
                            for (var k = 0; k < ODE.fillcolor.length; k++) {
                                elementgrad.push({
                                    color: ODE.fillcolor[k].color
                                    , stop: ODE.fillcolor[k].stop
                                });
                            }
                            filllistresult = elementgrad;
                            gradtypelist.push(ODE.gradienttype);
                        }
                        var strokelistresult = ODE.strokecolor || "black";

                        strokelist.push(strokelistresult);
                        filllist.push(filllistresult);
                        percentlist.push(percentarray);
                        filltypelist.push(ODE.filltype);
                        valuelist.push(valuearray);
                        strokeWarray.push(ODE.strokewidth);
                        if (ObjectData.length > 1) ODlist.push(ODE[Object.keys(ODE)[0]]);
                        else ODlist.push(elementlabel);

                        if (gtotalresultmax > 1) grouplist.push(ODE.group.text);
                        else grouplist.push("");

                        patternlist.push("square");
                    }

                    element = {
                        x: elementX
                        , y: elementY
                        , width: elementwidth
                        , height: elementheight
                        //, text: elementtext
                        , label: elementlabel
                        , prefix: format.prefix
                        , suffix: format.suffix
                        //, filltype: OD.filltype
                        , valuearray: valuelist
                        , ODlist: ODlist
                        , percentlist: percentlist
                        , filltypelist: filltypelist
                        , filllist: filllist
                        , gradtypelist: gradtypelist
                        , grouplist: grouplist
                        , pattern: patternlist
                        , strokelist: strokelist
                        , linewidth: strokeWarray
                    };
                    if (percentanimation == 1) elementlist.push(element);
                }
                if (!stacked && !percentstack) YaddE += height;
            }
            ctx.canvaslabel(option, chart, precision, click);
            ctx.labelHFS(option, chart);
            ctx.legend(option, chart);
            hoverout(option, elementlist, percentanimation, chart)
        }

    }
    //Pie, Doughnut
    else if (type == "pie"
        || type == "doughnut"
        || type == "cone"
        || type == "pyramid"
        || type == "cylinder") {
        var centerX = round((conw / 2) * 1.211);
        var centerY = conh / 2;
        var center = centerX + centerY;
        var degrees = option.degrees;
        if (degrees <= 0) degrees = 0;
        var start = toRadians(degrees - 180);
        var end = toRadians(degrees - 180);
        var median;
        var total = 0;

        var lineoption = option.line,
            optionH = option.header,
            optionSH = option.subheader,
            optionF = option.footer,
            shadow = option.shadow,
            format = option.format,
            sort = option.sort || false,
            plotlabel = option.plotlabel,
            datalabelfont = option.datalabelfont
            ascending = option.ascending;

        optionH.display = optionH.display || false;
        optionSH.display = optionSH.display || false;
        optionF.display = optionF.display || false;

        if (sort) {
            data.sort(function (a, b) {
                return NaNCheck(a.value) - NaNCheck(b.value)
            });
        }

        if (!ascending) {
            data.reverse();
        }

        shadow.enabled = shadow.enabled || false;

        var top, bottom, left, right;
        var Htop, SHtop;

        if (optionH.display)
            Htop = ctx.wrapTextHeight(optionH.text, 5, conw, TextFontHeight(ctx, optionH), false);
        else
            Htop = 5;

        if (optionSH.display)
            SHtop = ctx.wrapTextHeight(optionSH.text, Htop, conw, TextFontHeight(ctx, optionSH), false);
        else
            SHtop = 0;
        var canvastop = Htop + (SHtop * 0.5);
        var canvasbottom;
        if (optionF.display)
            canvasbottom = ctx.wrapTextHeight(optionF.text, 10, conw, TextFontHeight(ctx, optionF), false);
        else
            canvasbottom = 10;

        var legendfontheight;

        var labellegendnum = legendarraynum(ctx, option, chart);

        if (legendfont.display) {
            legendfontheight = TextFontHeight(ctx, legendfont) * (MaxArray(labellegendnum));
        }
        else {
            legendfontheight = 0;
        }

        var radius;
        if (conh < conw) {
            radius = conh
        }
        else {
            radius = conw
        }

        var moveX, moveY;
        switch (legendposition) {
            case "top":
                top = canvastop + (legendfontheight); //40
                bottom = canvasbottom; //320
                moveX = conw * 0.5;
                moveY = (conh * 0.5) + (legendfontheight);
                break
            case "bottom":
                top = canvastop;
                bottom = canvasbottom + (legendfontheight); //320
                moveX = conw * 0.5;
                moveY = (conh * 0.5) - (legendfontheight);
                break
            case "left":
                top = canvastop;
                bottom = canvasbottom; //320
                if (conh < conw) moveX = conw * 0.5;
                else moveX = (conw * 0.5);

                moveY = conh * 0.5;
                break
            case "right":
                top = canvastop;
                bottom = canvasbottom; //320
                if (conh < conw) moveX = conw * 0.5;
                else moveX = (conw * 0.5);

                moveY = conh * 0.5;
                break
            default:
                top = canvastop;
                bottom = canvasbottom; //320
                moveX = conw * 0.5;
                moveY = conh * 0.5;
        }
        var xmeasure, radiusmeasure;

        var mid = {
            x: moveX
            , y: moveY
            , r: parseInt((radius * 0.5) - (top + bottom))
        }

        //total values
        for (i = 0; i < data.length; i++) {
            var datavalue = data[i].value;
            if (datavalue < 0) datavalue = 0;
            total += datavalue;
        }

        //Animation
        var pieAnimate;
        animatecanvas(option, canvasID, animatePie, animation, percent);
        //pie chart
        function animatePie() {
            //ctx = copy_ctx without element bar/line
            var a = ElementID(canvasID);
            if (percent == 100 || !animation) {
                cancelAnimFrame(pieAnimate);
                a.setAttribute("p8animate", false);
                a.setAttribute("p8draw", true);
                percentanimation = 1;
            }
            else {
                if (percent < 100) {
                    pieAnimate = requestAnimFrame(animatePie, millisecond);
                }
                percentanimation = percent / 100;
                percent++
            }//end else

            ctx.clear(option.size.width, option.size.height);
            var offset = 0
                , offsetX
                , offsetY;
            var endRadians = toRadians(degrees - 180) + (toRadians(360) * percentanimation);
            switch (type) {
                case "pie":
                    ctx.save();
                    ctx.beginPath();
                    ctx.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
                    ctx.moveTo(mid.x, mid.y);
                    ctx.arc(mid.x, mid.y, mid.r + (lineoption.width / 2), toRadians(degrees - 180), endRadians, false);
                    ctx.fillStyle = lineoption.color;
                    if (shadow.enabled) ctx.fill();
                    ctx.restore();
                    ctx.save();
                    ctx.clip();
                    //Pie Chart
                    for (var i = 0; i < data.length; i++) {
                        var CD = data[i];
                        CD.filltype = CD.filltype || "color";
                        CD.gradienttype = CD.gradienttype || "linear a";

                        var datavalue = NaNCheck(CD.value);

                        var value = NaNCheck(abs(datavalue / total));
                        var circum = value * toRadians(360);
                        if (i > 0) start = end;
                        end += circum;
                        var median = (end + start) / 2;

                        offsetX = cos(median) * offset;
                        offsetY = sin(median) * offset;

                        offsetXlabel = (cos(end)) * (mid.r * 0.5);
                        offsetYlabel = (sin(end)) * (mid.r * 0.5);

                        ctx.save();
                        var piefill, elementfill;
                        if (CD.filltype == "color") {
                            var gradientfill = [];
                            gradientfill.push({ color: "white" });
                            gradientfill.push({ color: CD.fill });
                            gradientfill.push({ color: "white" });
                            //piefill = CD.fill;
                            piefill = ctx.GradientLinear(0, conh * 0.025, conw, conh, gradientfill, 0, false, false);
                            elementfill = CD.fill;
                        }
                        else if (CD.filltype == "gradient") {
                            var gtypeout = CD.gradienttype;
                            switch (gtypeout) {
                                case "linear a": piefill = ctx.GradientLinear(0, conh * 0.025, conw, conh, CD.fill, 0, false, false); break
                                case "linear b": piefill = ctx.GradientLinear(0, conh * 0.025, conw, conh, CD.fill, 0, true, false); break
                                case "linear c": piefill = ctx.GradientLinear(conw * 0.05, 0, conw, conh, CD.fill, 0, true, true); break
                                case "linear d": piefill = ctx.GradientLinear(conw * 0.05, 0, conw, conh, CD.fill, 0, false, true); break
                                case "linear e": piefill = ctx.GradientLinear(mid.x, mid.y, conw, conh, CD.fill, 0, false, true, true); break
                                case "linear f": piefill = ctx.GradientLinear(mid.x, mid.y, conw, conh, CD.fill, 0, true, true, true); break
                                case "linear g": piefill = ctx.GradientLinear(mid.x, mid.y, conw, conh, CD.fill, 0, false, false, true); break
                                case "linear h": piefill = ctx.GradientLinear(mid.x, mid.y, conw, conh, CD.fill, 0, true, false, true); break
                                case "radial": piefill = ctx.GradientCircle(mid.x, mid.y, mid.r / 5, mid.x, mid.y, mid.r, CD.fill); break
                            }
                            var elementgrad = [];
                            for (var l = 0; l < CD.fill.length; l++) {
                                elementgrad.push(CD.fill[l].color);
                            }
                            elementfill = elementgrad;
                        }
                        ctx.beginPath();
                        ctx.fillStyle = piefill;
                        ctx.strokeStyle = lineoption.color;
                        ctx.lineWidth = lineoption.width;
                        ctx.moveTo(mid.x + offsetX, mid.y + offsetY);
                        ctx.lineJoin = "round";
                        // Arc Parameters: x, y, radius, startingAngle (radians), endingAngle (radians), antiClockwise (boolean)
                        ctx.arc(mid.x + offsetX, mid.y + offsetY, mid.r, start, end, false);
                        //ctx.lineTo(mid.x + offsetX, mid.y + offsetY);
                        ctx.fill();
                        ctx.closePath();
                        if (lineoption.width > 0) ctx.stroke();

                        ctx.restore();
                        var anglelist = [];
                        for (var j = 0; j < data.length; j++) {
                            anglelist.push({ angle: abs(data[i].value / total) * start });
                        }
                        var namelist = [];
                        var colorlist = [];
                        var valuelist = [];
                        var filltypelist = [];
                        var gradtypelist = [];
                        for (var k = 0; k < data.length; k++) {
                            var CDE = data[k];
                            if (CDE.filltype == "color") {
                                var datacolorlist = CDE.fill;
                                filllistresult = datacolorlist;
                            }
                            else if (CDE.filltype == "gradient") {
                                CDE.gradienttype = CDE.gradienttype || "linear a";
                                var elementgrad = [];
                                for (var l = 0; l < CDE.fill.length; l++) {
                                    elementgrad.push(CDE.fill[l].color);
                                }
                                filllistresult = elementgrad;
                                gradtypelist.push(CDE.gradienttype);
                            }
                            colorlist.push(filllistresult);
                            namelist.push(CDE.name);
                            valuelist.push(CDE.value);
                            filltypelist.push(CDE.filltype);
                        }
                        element = {
                            x: mid.x
                            , y: mid.y
                            , radius: mid.r
                            , start: start
                            , end: end
                            , name: CD.name
                            , value: datavalue
                            , fill: elementfill
                            , filltype: CD.filltype
                            , gradienttype: CD.gradienttype
                            , i: i
                        }
                    }
                    var startlabel = -PI / 2, endlabel = -PI / 2;
                    for (var j = 0; j < data.length; j++) {
                        var CD = data[j];
                        var datavalue = NaNCheck(CD.value);
                        var value = NaNCheck(abs(datavalue / total));
                        var circumdeduct = value * PI;
                        var circumlabel = value * PI * 2;
                        if (j > 0) startlabel = endlabel;
                        endlabel += circumlabel;

                        offsetXlabel = cos(endlabel - circumdeduct) * (mid.r * 0.5);
                        offsetYlabel = sin(endlabel - circumdeduct) * (mid.r * 0.5);
                        if (percentanimation == 1 && datalabelfont.display && total > 0 && datavalue > 0) ctx.Text(datavalue, mid.x + offsetXlabel, mid.y + offsetYlabel, 0, datalabelfont.color, null, 0, "center", "middle", datalabelfont);

                    }
                    if (percentanimation == 1) {
                        //console.log(elementlist);
                        //console.log(degrees);
                        //console.log(degrees - 180)
                    }
                    break
                case "doughnut":
                    ctx.save();
                    ctx.beginPath();
                    ctx.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
                    ctx.arc(mid.x, mid.y, mid.r / 1.3, toRadians(degrees - 180), endRadians, false);
                    ctx.lineWidth = mid.r / 2.19;
                    ctx.stroke();
                    ctx.restore();
                    ctx.save()
                    ctx.beginPath();
                    ctx.lineTo(mid.x, mid.y);
                    ctx.arc(mid.x, mid.y, mid.r, toRadians(degrees - 180), endRadians, false);
                    ctx.lineWidth = mid.r;
                    ctx.restore();
                    ctx.save();
                    ctx.clip();
                    //Doughnut Chart
                    for (var i = 0; i < data.length; i++) {
                        var CD = data[i];
                        CD.filltype = CD.filltype || "color";
                        CD.gradienttype = CD.gradienttype || "linear a";

                        var datavalue = NaNCheck(CD.value);

                        var value = NaNCheck(datavalue / total);
                        var circum = value * toRadians(360);
                        if (i > 0) start = end;
                        end += circum;
                        var median = (end + start) / 2;

                        offsetX = cos(median) * offset;
                        offsetY = sin(median) * offset;

                        ctx.save();
                        var doughnutfill;
                        if (CD.filltype == "color") {
                            doughnutfill = CD.fill;
                        }
                        else if (CD.filltype == "gradient") {
                            //GradientLinear(x, y, width, height, input, ctx, reverse, invert, diag)
                            var gtypeout = CD.gradienttype.toString().toLowerCase();
                            switch (gtypeout) {
                                case "linear a": doughnutfill = ctx.GradientLinear(0, conh * 0.025, conw, conh, CD.fill, 0, false, false); break
                                case "linear b": doughnutfill = ctx.GradientLinear(0, conh * 0.025, conw, conh, CD.fill, 0, true, false); break
                                case "linear c": doughnutfill = ctx.GradientLinear(conw * 0.05, 0, conw, conh, CD.fill, 0, true, true); break
                                case "linear d": doughnutfill = ctx.GradientLinear(conw * 0.05, 0, conw, conh, CD.fill, 0, false, true); break
                                case "linear e": doughnutfill = ctx.GradientLinear(mid.x, mid.y, conw, conh, CD.fill, 0, false, true, true); break
                                case "linear f": doughnutfill = ctx.GradientLinear(mid.x, mid.y, conw, conh, CD.fill, 0, true, true, true); break
                                case "linear g": doughnutfill = ctx.GradientLinear(mid.x, mid.y, conw, conh, CD.fill, 0, false, false, true); break
                                case "linear h": doughnutfill = ctx.GradientLinear(mid.x, mid.y, conw, conh, CD.fill, 0, true, false, true); break
                                case "radial": doughnutfill = ctx.GradientCircle(mid.x, mid.y, mid.r / 2, mid.x, mid.y, mid.r, CD.fill); break
                            }
                        }
                        ctx.strokeStyle = doughnutfill;
                        ctx.beginPath();
                        ctx.lineWidth = mid.r;
                        // Arc Parameters: x, y, radius, startingAngle (radians), endingAngle (radians), antiClockwise (boolean)
                        ctx.arc(mid.x + offsetX, mid.y + offsetY, mid.r, start, end, false);
                        ctx.stroke();
                        ctx.closePath();
                        ctx.restore();
                        var anglelist = [];
                        for (var j = 0; j < data.length; j++) {
                            anglelist.push({ angle: abs(CD.value / total) * start });
                        }

                        //element = {
                        //    radius: mid.r
                        //    , value: datavalue
                        //}
                    }
                    //if (percentanimation == 1) {
                    //    console.log(degrees);
                    //    console.log(degrees - 180)
                    //}
                    var startlabel = -PI / 2, endlabel = -PI / 2;
                    for (var j = 0; j < data.length; j++) {
                        var CD = data[j];
                        var datavalue = NaNCheck(CD.value);
                        var value = NaNCheck(abs(datavalue / total));
                        var circumdeduct = value * PI;
                        var circumlabel = value * PI * 2;
                        if (j > 0) startlabel = endlabel;
                        endlabel += circumlabel;

                        offsetXlabel = cos(endlabel - circumdeduct) * (mid.r * 0.75);
                        offsetYlabel = sin(endlabel - circumdeduct) * (mid.r * 0.75);
                        if (percentanimation == 1 && datalabelfont.display && total > 0 && datavalue > 0) ctx.Text(datavalue, mid.x + offsetXlabel, mid.y + offsetYlabel, 0, datalabelfont.color, null, 0, "center", "middle", datalabelfont);

                    }
                    var filllistresult;
                    var namelist = [];
                    var colorlist = [];
                    var valuelist = [];
                    var filltypelist = [];
                    var gradtypelist = [];
                    for (var k = 0; k < data.length; k++) {
                        var CDE = data[k];
                        if (CDE.filltype == "color") {
                            var datacolorlist = CDE.fill;
                            filllistresult = datacolorlist;
                        }
                        else if (CDE.filltype == "gradient") {
                            CDE.gradienttype = CDE.gradienttype || "linear a";
                            var elementgrad = [];
                            for (var l = 0; l < CDE.fill.length; l++) {
                                elementgrad.push(CDE.fill[l].color);
                            }
                            filllistresult = elementgrad;
                            gradtypelist.push(CDE.gradienttype);
                        }
                        colorlist.push(filllistresult);
                        namelist.push(CDE.name);
                        valuelist.push(CDE.value);
                        filltypelist.push(CDE.filltype);
                    }
                    break
                default:
                    var x, y, width, height;
                    var radout = radius * 0.9;
                    var length;
                    var area = 10;
                    switch (type) {
                        case "cylinder":
                            area += 30
                            var areameasure = 0.25;
                            var areapercent = area / 100;
                            HeightA = radout * areapercent;
                            var areaarc = HeightA * areameasure;
                            var cmeasure = radout - (areaarc * 2);
                            x = mid.x - (cmeasure * 0.5);
                            y = top + (areaarc * 1.5);
                            length = radout - (areaarc * 2);
                            width = length;
                            break
                        default:
                            x = mid.x - (radout * 0.5);
                            y = top + 5;
                            length = radout;
                            width = radout;
                            break
                    }

                    var datatotal = total;
                    var elemtotal = total;
                    var elemheight, iheight, dataheight;
                    for (i = 0; i < data.length; i++) {
                        var rev = (data.length - 1) - i;
                        var CD = data[rev];
                        var percentage = (datatotal / total);
                        CD.filltype = CD.filltype || "color";
                        CD.gradienttype = CD.gradienttype || "linear a";

                        var datavalue = NaNCheck(CD.value);
                        iheight = (length - (top + bottom));
                        height = iheight * percentage;
                        elemtotal -= datavalue;
                        dataheight = iheight * (datavalue / total);
                        //if (percentanimation == 1) console.log("Element Height: " + elemheight);
                        //if (percentanimation == 1) console.log("Height: " + height);
                        //if (percentanimation == 1) console.log("Data Height: " + dataheight);
                        var shapefill;

                        if (type == "cone") {
                            shapefill = CD.fill;
                        }
                        else {
                            if (CD.filltype == "color") {
                                shapefill = CD.fill;
                            }
                            else if (CD.filltype == "gradient") {

                                var conewidthA, conewidthB;
                                var areaA = area / 100,
                                    areaB = 1 - areaA;
                                if (height > width) {
                                    conewidthA = 0;
                                    conewidthB = width;
                                }
                                else {
                                    conewidthA = (width * 0.5) - (height * 0.5);
                                    conewidthB = (width * 0.5) + (height * 0.5);
                                }
                                HeightA = HeightFix(width, height, areaA, true);
                                HeightB = HeightFix(width, height, areaA, false);

                                var gradientx = (x - (width * 0.75)) - conewidthA;
                                var gradientwidth = conewidthB;//conelength;
                                var gtypeout = CD.gradienttype.toString().toLowerCase();

                                switch (gtypeout) {
                                    case "linear a": shapefill = ctx.GradientLinear(0, y - (height * 0.5), gradientwidth, HeightB, CD.fill, 0, false, false); break
                                    case "linear b": shapefill = ctx.GradientLinear(0, y - (height * 0.5), gradientwidth, HeightB, CD.fill, 0, true, false); break
                                    case "linear c": shapefill = ctx.GradientLinear(gradientx, 0, gradientwidth, HeightB, CD.fill, 0, true, true); break
                                    case "linear d": shapefill = ctx.GradientLinear(gradientx, 0, gradientwidth, HeightB, CD.fill, 0, false, true); break
                                    case "linear e": shapefill = ctx.GradientLinear(gradientx, y, gradientwidth, HeightB, CD.fill, 0, false, true, true); break
                                    case "linear f": shapefill = ctx.GradientLinear(gradientx, y, gradientwidth, HeightB, CD.fill, 0, true, true, true); break
                                    case "linear g": shapefill = ctx.GradientLinear(gradientx, y, gradientwidth, HeightB, CD.fill, 0, false, false, true); break
                                    case "linear h": shapefill = ctx.GradientLinear(gradientx, y, gradientwidth, HeightB, CD.fill, 0, true, false, true); break
                                    case "radial": shapefill = ctx.GradientCircle(x - (conewidthB * 0.5), y, height / 5, x - (conewidthB * 0.5), y, height, CD.fill); break
                                }
                            }
                        }

                        ctx.save();
                        ctx.globalAlpha = percentanimation;
                        var shadowout;
                        //if (rev == data.length - 1) {
                        //    shadowout = shadow;
                        //}
                        //else {
                        //    shadowout = nullshadow;
                        //}
                        shadowout = nullshadow;//shadow;

                        var percentdraw = 100;
                        var percentheight = iheight;

                        var totalinitial = 0;
                        for (j = 0; j < rev; j++) {
                            totalinitial += NaNCheck(data[j].value);
                        }

                        var totalpercent = Percent(totalinitial, total);

                        var stretch = false;
                        switch (type) {
                            case "cone":
                                ctx.cone(x, y, width, height, area, 0, stretch, percentdraw, totalpercent, percentheight, false, false, 1, CD.filltype, CD.gradienttype, CD.fill, lineoption.color, lineoption.width, [0], shadowout, 1);
                                break
                            case "pyramid":
                                ctx.pyramid(x, y, width, height, area, 0, false, stretch, percentdraw, totalpercent, percentheight, false, 1, CD.filltype, CD.gradienttype, shapefill, lineoption.color, lineoption.width, [0], shadowout, type, false);
                                break
                            case "cylinder":
                                ctx.cylinder(x, y, width, height, area, false, true, 1, shapefill, lineoption.color, lineoption.width, [0], shadowout, type);
                                break
                        }
                        //(x, y, width, height, area, rotate, filltype, gradienttype, fill, stroke, linewidth, dash, shadow)
                        ctx.restore();
                        datatotal -= datavalue;
                    }
                    var datatotal = total;
                    var elemtotal = total;
                    if (type == "cylinder") {
                        HeightA = radout * areapercent;
                        var areaarc = HeightA * areameasure;
                        var cmeasure = radout + (areaarc * 2);
                        y = top + (areaarc * 2);
                    }
                    for (i = 0; i < data.length; i++) {
                        //var rev = (data.length - 1) - i;
                        var ic = i - 1;
                        var CD = data[i];
                        var CDdeduct;
                        if (ic < 0) CDdeduct = 0;
                        else CDdeduct = data[ic].value;

                        var percentage = (datatotal / total);
                        CD.filltype = CD.filltype || "color";
                        CD.gradienttype = CD.gradienttype.toString().toLowerCase() || "linear a";

                        var datavalue = NaNCheck(CD.value);
                        iheight = (length - (top + bottom));
                        height = (iheight * (datavalue / total));//* percentage;
                        //if (percentanimation == 1) console.log(height)

                        //if (percentanimation == 1) console.log(y)
                        elemtotal -= datavalue;
                        //dataheight = iheight * (datavalue / total);
                        //elemheight = (iheight * (elemtotal / total)) + (dataheight * 0.5);

                        if (type == "cone") {
                        }
                        else {
                            if (CD.filltype == "color") {
                            }
                            else if (CD.filltype == "gradient") {

                                var conewidthA, conewidthB;
                                var areaA = area / 100,
                                    areaB = 1 - areaA;
                                if (height > width) {
                                    conewidthA = 0;
                                    conewidthB = width;
                                }
                                else {
                                    conewidthA = (width * 0.5) - (height * 0.5);
                                    conewidthB = (width * 0.5) + (height * 0.5);
                                }
                                HeightA = HeightFix(width, height, areaA, true);
                                HeightB = HeightFix(width, height, areaA, false);

                                var gradientx = (x - (width * 0.75)) - conewidthA;
                                var gradientwidth = conewidthB;//conelength;
                                var gtypeout = CD.gradienttype.toString().toLowerCase();

                            }
                        }

                        var percentdraw = 100;
                        var percentheight = iheight;

                        var totalinitial = 0;
                        for (j = 0; j < rev; j++) {
                            totalinitial += NaNCheck(data[j].value);
                        }

                        var totalpercent = Percent(totalinitial, total);

                        datatotal -= datavalue;
                        element = {
                            x: x
                            , y: y
                            , width: width
                            , height: height
                            //, dataheight: elemheight
                            , value: CD.value
                            , name: CD.name
                            , fill: CD.fill
                            , filltype: CD.filltype
                            , gradienttype: CD.gradienttype
                            , area: area
                            //, text: elementtext
                            //, label: elementlabel
                            //, prefix: format.prefix
                            //, suffix: format.suffix
                            //, value: elementvalue
                            //, filltype: OD.filltype
                            //, ODlist: ODlist
                            //, valuearray: valuelist
                            //, percentlist: percentlist
                            //, filltypelist: filltypelist
                            //, filllist: filllist
                            //, gradtypelist: gradtypelist
                            //, grouplist: grouplist
                        }
                        if (percentanimation == 1) elementlist.push(element);
                        y += height;
                    }
                    break
            }
            ctx.restore();

            //Pie Chart
            var startline = -PI / 2;
            var endline = -PI / 2;
            if (click
                && (type == "pie" || type == "doughnut")) {
                for (var i = 0; i < data.length; i++) {
                    var CD = data[i];
                    var datavalue = NaNCheck(CD.value);
                    var measureline;
                    switch (type) {
                        case "pie":
                            measureline = mid.r * 0.5;
                            break;
                        case "doughnut":
                            measureline = mid.r * 0.75;
                            break
                    }
                    var valueline = NaNCheck(abs(datavalue / total));
                    var circum = valueline * PI * 2;
                    if (i > 0) startline = endline;
                    endline += circum;
                    var median = (endline + startline) / 2;

                    offsetXline = cos(median) * measureline;
                    offsetYline = sin(median) * measureline;
                    var ydisplay = (conh / (data.length * 2)) + ((conh / data.length) * i);
                    ctx.save();
                    ctx.beginPath();
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = plotlabel.linewidth;
                    ctx.moveTo(mid.x + offsetXline, mid.y + offsetYline);
                    ctx.lineTo(conw * 0.8, ydisplay);
                    ctx.lineJoin = "round";
                    // Arc Parameters: x, y, radius, startingAngle (radians), endingAngle (radians), antiClockwise (boolean)
                    //ctx.arc(mid.x + offsetX, mid.y + offsetY, mid.r, start, end, false);
                    ctx.stroke();
                    ctx.Text(CD.name + ": " + datavalue, (conw * 0.8) + 2, ydisplay, 0, "black", null, 0, "align-left", "middle", plotlabel);
                    ctx.restore();
                }
            }

            ctx.labelHFS(option, type);
            //legend();
            ctx.legend(option, type);

            hoverout(option, elementlist, percentanimation, chart)
        } // end animatePie

    }
    else if (type == "radar") {
        var data = dataarrayoutput(option),
            ObjectData = option.ObjectData,
            gridline = option.gridline,
            labelfont = option.labelfont,
            measurefont = option.measurefont,
            shadow = option.shadow,
            optionH = option.header,
            optionSH = option.subheader,
            optionF = option.footer,
            precision = NaNCheck(option.precision) || 0;

        shadow.enabled = shadow.enabled || false;

        var max = MaxMin(option, chart, true);
        var min = MaxMin(option, chart, false);

        var vA = ctx.TBPosition(option, chart, "top"), //+ Vpercent3d;
            vB = ctx.TBPosition(option, chart, "bottom");

        var legendfontheight;
        var labellegendnum = legendarraynum(ctx, option, chart);

        if (legendfont.display) {
            legendfontheight = TextFontHeight(ctx, legendfont) * (MaxArray(labellegendnum));
        }
        else {
            legendfontheight = 0;
        }

        var moveX, moveY;
        switch (legendposition) {
            case "top":
                moveX = conw * 0.5;
                moveY = (conh * 0.5) + (legendfontheight);
                break
            case "bottom":
                moveX = conw * 0.5;
                moveY = (conh * 0.5) - (legendfontheight);
                break
            case "left":
                if (conh < conw) moveX = conw * 0.5;
                else moveX = (conw * 0.5);
                moveY = conh * 0.5;
                break
            case "right":
                if (conh < conw) moveX = conw * 0.5;
                else moveX = (conw * 0.5);
                moveY = conh * 0.5;
                break
            default:
                moveX = conw * 0.5;
                moveY = conh * 0.5;
        }

        //var mid = {
        //    x: moveX
        //    , y: moveY
        //    , r: parseInt((radius * 0.5) - (top + bottom))//* 0.35
        //}
        var radius;
        if (conh < conw)
            radius = conh;
        else
            radius = conw;

        var mid = {
            x: moveX
            , y: moveY
            , r: parseInt(radius * 0.5 - (vA + vB))//* 0.35
        }

        var area = conh * 0.45 - (vA + vB);
        var areaplus = (conh * 0.5) - area;

        //Animation
        var radarAnimate;
        animatecanvas(option, canvasID, animateRadar, animation, percent);

        function animateRadar() {
            //ctx = copy_ctx without element bar/line
            var a = ElementID(canvasID);
            if (percent == 100 || !animation) {
                cancelAnimFrame(radarAnimate);
                a.setAttribute("p8animate", false);
                a.setAttribute("p8draw", true);
                percentanimation = 1;
            }
            else {
                if (percent < 100) {
                    radarAnimate = requestAnimFrame(animateRadar, millisecond);
                }
                percentanimation = percent / 100;
                percent++
            }//end else
            ctx.clear(conw, conh);
            //varCompute
            var varCompute = ComputeCheck(option, area, max, min, "x"),
                lineDrawCount = LineCount(option, area, max, min, "x"),
                interval = area / (lineDrawCount - 1),
                varP = VarPcount(option, area, max, min, "x");

            for (var i = 0; i < lineDrawCount; i++) {
                var carea = parseInt(i * interval);

                if (varP == 0) {
                    var areaadd = carea;
                }

                varP -= varCompute;
            }
            var totalValues = varCompute * (lineDrawCount - 1);
            var total = MaxArray(data);

            function RadarPoint(option, output) {
                var data = dataarrayoutput(option);
                var ObjectData = option.ObjectData;
                var stacked = option.stacked;
                var total = MaxArray(data);
                for (var ic = 1; ic <= ObjectData.length; ic++) {
                    var OD = ObjectData[ic - 1];
                    OD.fillcolor = OD.fillcolor || "black";
                    OD.strokecolor = OD.strokecolor || "black";
                    OD.filltype = OD.filltype || "color";
                    OD.style = OD.style || "2d";
                    OD.area = OD.area || false;
                    OD.dash = OD.dash || [];
                    OD.areafilltype = OD.areafilltype || "color";
                    var start = -(PI) / 2;
                    var end = -(PI) / 2;
                    var CD, CDmid, CDmidend, CDOut;
                    for (var i = 0; i < data.length; i++) {

                        CD = DataInput(data, i, ic);
                        if (CD < 0) CD = 0;

                        if (i == data.length - 1) {
                            CDOut = DataInput(data, 0, ic)
                        }
                        else {
                            CDOut = DataInput(data, i + 1, ic);
                        }
                        if (CDOut < 0) CDOut = 0;

                        if (stacked && ic > 1) {
                            CDmid = 0;
                            CDmidend = 0;
                            for (var g = 1; g < ic; g++) {
                                CD += DataInput(data, i, g);

                                if (i == data.length - 1) {
                                    CDOut += DataInput(data, 0, g)
                                }
                                else {
                                    CDOut += DataInput(data, i + 1, g);
                                }

                                CDmid += DataInput(data, i, g);
                                if (i == data.length - 1) {
                                    CDmidend += DataInput(data, 0, g);
                                }
                                else {
                                    CDmidend += DataInput(data, i + 1, g);
                                }
                            }
                        }

                        var measure, measuremid, measuremidend, measureend;
                        //var measure = (data[i] / total) * area;
                        measure = (CD / totalValues) * areaadd * percentanimation;

                        measuremid = (CDmid / totalValues) * areaadd * percentanimation;

                        measuremidend = (CDmidend / totalValues) * areaadd * percentanimation;

                        measureend = (CDOut / totalValues) * areaadd * percentanimation;

                        if (stacked) {
                            measure /= ObjectData.length;
                            measuremid /= ObjectData.length;
                            measuremidend /= ObjectData.length;
                            measureend /= ObjectData.length;
                        }

                        var value = 1 / data.length;
                        var circum = value * PI * 2;
                        if (i > 0) start = end;
                        end += circum;

                        offsetX = cos(start) * measure;
                        offsetY = sin(start) * measure;

                        offsetXmid = cos(start) * measuremid;
                        offsetYmid = sin(start) * measuremid;

                        offsetXmidend = cos(end) * measuremidend;
                        offsetYmidend = sin(end) * measuremidend;

                        offsetXEnd = cos(end) * measureend;
                        offsetYEnd = sin(end) * measureend;

                        var xstart = (conw / 2) + offsetX,
                            ystart = (conh / 2) + offsetY,
                            xmid = (conw / 2) + offsetXmid,
                            ymid = (conh / 2) + offsetYmid,
                            xmidend = (conw / 2) + offsetXmidend,
                            ymidend = (conh / 2) + offsetYmidend,
                            xend = (conw / 2) + offsetXEnd,
                            yend = (conh / 2) + offsetYEnd;

                        //start of line drawing
                        switch (output) {
                            case "area":
                                if (OD.area) {
                                    var areafill;
                                    if (OD.areafilltype == "color") {
                                        areafill = OD.areafill;
                                    }
                                    else if (OD.areafilltype == "gradient") {
                                        var gtypeout = OD.areagradienttype.toString().toLowerCase();
                                        switch (gtypeout) {
                                            case "linear a": areafill = ctx.GradientLinear(0, conh * 0.025, conw, conh, OD.areafill, 0, false, false); break
                                            case "linear b": areafill = ctx.GradientLinear(0, conh * 0.025, conw, conh, OD.areafill, 0, true, false); break
                                            case "linear c": areafill = ctx.GradientLinear(conw * 0.05, 0, conw, conh, OD.areafill, 0, true, true); break
                                            case "linear d": areafill = ctx.GradientLinear(conw * 0.05, 0, conw, conh, OD.areafill, 0, false, true); break
                                            case "linear e": areafill = ctx.GradientLinear(conw / 2, conh / 2, conw, conh, OD.areafill, 0, false, true, true); break
                                            case "linear f": areafill = ctx.GradientLinear(conw / 2, conh / 2, conw, conh, OD.areafill, 0, true, true, true); break
                                            case "linear g": areafill = ctx.GradientLinear(conw / 2, conh / 2, conw, conh, OD.areafill, 0, false, false, true); break
                                            case "linear h": areafill = ctx.GradientLinear(conw / 2, conh / 2, conw, conh, OD.areafill, 0, true, false, true); break
                                            case "radial": areafill = ctx.GradientCircle(conw / 2, conh / 2, area / 5, conw / 2, conh / 2, area, OD.areafill); break
                                        }
                                    }
                                }

                                ctx.save();
                                ctx.fillStyle = areafill;

                                if (stacked) {
                                    if (ic == 1) {
                                        if (i == 0) {
                                            ctx.beginPath();
                                            ctx.moveTo(xstart, ystart);
                                            ctx.lineTo(xend, yend);
                                        }
                                        else if (i > 0 && i < data.length - 1) {
                                            ctx.lineTo(xstart, ystart);
                                            ctx.lineTo(xend, yend);
                                        }
                                        else if (i == (data.length - 1)) {
                                            ctx.lineTo(xstart, ystart);
                                            ctx.lineTo(xend, yend);
                                            if (OD.area) ctx.fill();
                                            ctx.closePath();
                                        }
                                    }
                                    else {

                                        ctx.beginPath();
                                        ctx.moveTo(xmid, ymid);
                                        ctx.lineTo(xstart, ystart);
                                        ctx.lineTo(xend, yend);
                                        ctx.lineTo(xmidend, ymidend);
                                        if (OD.area) ctx.fill();
                                        ctx.closePath();
                                    }
                                }
                                else {
                                    if (i == 0) {
                                        ctx.beginPath();
                                        ctx.moveTo(xstart, ystart);
                                        ctx.lineTo(xend, yend);
                                    }
                                    else if (i > 0 && i < data.length - 1) {
                                        ctx.lineTo(xstart, ystart);
                                        ctx.lineTo(xend, yend);
                                    }
                                    else if (i == (data.length - 1)) {
                                        ctx.lineTo(xstart, ystart);
                                        ctx.lineTo(xend, yend);
                                        if (OD.area) ctx.fill();
                                        ctx.closePath();
                                    }
                                }
                                ctx.restore();

                                break
                            case "line":
                                ctx.save();
                                //ctx.setLineDash(OD.dash);
                                //ctx.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
                                ctx.beginPath();
                                ctx.strokeStyle = OD.linecolor;
                                ctx.lineWidth = OD.linewidth;
                                ctx.setLineDash(OD.dash);
                                ctx.moveTo((conw / 2) + offsetX, (conh / 2) + offsetY);
                                ctx.lineTo((conw / 2) + offsetXEnd, (conh / 2) + offsetYEnd);
                                ctx.stroke();
                                ctx.closePath();
                                ctx.restore();
                                break
                            case "marker":
                                var plotmarker = OD.marker || "o";
                                var datacolor = data[i].fillcolor || OD.fillcolor;
                                var Areashape = OD.areasize;
                                //gradient
                                if (OD.filltype == "gradient") {
                                    OD.gradienttype = OD.gradienttype || "linear a";
                                    markerfill = ctx.GradientMarker(OD.fillcolor, OD.gradienttype, plotx, grady, Areashape);
                                }
                                else if (OD.filltype == "color") {
                                    markerfill = datacolor;
                                }

                                markerwidth = OD.strokewidth || 0;
                                markerstroke = OD.strokecolor || datacolor;

                                var plotmarker = data[i].marker || OD.marker;
                                if (!reversedata) {
                                    valueout = CD;
                                }
                                else {
                                    valueout = CD;
                                }

                                var scaleY = 1;

                                ctx.Markers(plotmarker, (conw / 2) + offsetX, (conh / 2) + offsetY, Areashape, markerwidth, markerfill, markerstroke, scaleY, canvasIDcon, shadow);
                                //ctx.Text(CD.name + ": " + datavalue, (conw / 2) + offsetX, (conh / 2) + offsetY, 0, "black", "align-left", "middle", plotlabel);
                                break
                        }

                        element = {
                            //x: conw / 2
                            //, y: conh / 2
                            //, start: start
                            //, endangle: end
                            //, radius: mid.r + (lineoption.width / 2)
                            //, anglelist: anglelist
                            //, namelist: namelist
                            //, colorlist: colorlist
                            //, valuelist: valuelist
                            //, filltypelist: filltypelist
                            //, gradtypelist: gradtypelist
                            //, name: CD.name
                            //, value: datavalue
                        }
                        if (percentanimation == 1) elementlist.push(element);
                    }
                }
            }
            ctx.gridlinesdraw(option, precision, chart);
            ctx.canvaslabel(option, chart, precision, click);
            var RadarArray = [];
            RadarArray.push("area");
            RadarArray.push("line");
            RadarArray.push("marker");
            for (var k = 0; k < RadarArray.length; k++) {
                RadarPoint(option, RadarArray[k]);
            }
            ctx.labelHFS(option, chart);
            ctx.legend(option, chart);
            hoverout(option, elementlist, percentanimation, chart)
        }
    }
    //Bar Line, Plot, OHLC
    else {
        var centerX = round((conw / 2) * 1.211);
        var centerY = conh / 2;
        var center = centerX + centerY;
        var w;

        var duration = option.duration,
            ObjectData = option.ObjectData,
            maxset = option.max,
            //minset = option.min || 0,
            gridline = option.gridline,
            measureleft = option.measureleft,
            measureright = option.measureright,
            labelfont = option.labelfont,
            rotatelabel = labelfont.rotatelabel || false,
            shadow = option.shadow,
            stacked = option.stacked || false,
            percentstack = option.percentstack || false,
            plotlabel = option.plotlabel,
            reversedata = option.reversedata || false,
            format = option.format,
            barpercent = option.barpercent,
            totaldisplay = option.totaldisplay,
            convert = option.kmflag,
            enable3d = option.enable3d || false,
            //bubblelabel = option.bubblelabel || "",
            precision = NaNCheck(option.precision) || 0;

        var totalbar = TotalBarLine(option, "bar");
        var totalline = TotalBarLine(option, "line");

        //var maxbarline = Math.max(totalbar, totalline);

        var GArray = GroupArray(ObjectData);
        var gtotalmax = MaxArray(GroupArrayTotal(GArray));

        var gtotalresult = removeDuplicate(GArray).toString().split(",").map(Number);
        var gtotalresultmax = MaxArray(gtotalresult);

        //plot label
        labelfont.align = labelfont.align || "center";
        labelfont.position = labelfont.position || "bottom";

        //checking max and min
        var maxX = MaxMin(option, chart, true),
            minX = MaxMin(option, chart, false);

        var valueuptotal = ValueTotal(option, chart, "up"),
            valuedowntotal = ValueTotal(option, chart, "down");

        //vertical line position

        var hB = ctx.BaseNum(option, "right", precision, chart);

        var labeladdtop, labeladdbottom;
        switch (labelfont.position) {
            case "top":
                labeladdbottom = 0;
                if (rotatelabel) {
                    labeladdtop = 0;
                }
                else {
                    labeladdtop = ctx.lmeasureout(option, precision, chart, 0);
                }
                break
            case "bottom":
                labeladdtop = 0;
                if (rotatelabel) {
                    labeladdbottom = 0;
                }
                else {
                    labeladdbottom = ctx.lmeasureout(option, precision, chart, 0);
                }
                break
        }
        var vA = ctx.TBPosition(option, chart, "top") - labeladdtop,
            vB = ctx.TBPosition(option, chart, "bottom") - labeladdbottom;

        var area = ((80 / data.length) / Object.length);
        var areaA = area / 100,
            areaB = 1 - areaA,
            WidthA = WidthFix(hB, vB, areaA, true),
            WidthB = WidthFix(hB, vB, areaA, false),
            HeightA = HeightFix(hB, vB, areaA, true),
            HeightB = HeightFix(hB, vB, areaA, false)

        /*var percent3d;
        if (enable3d)
            percent3d = HeightA;
        else
            percent3d = 0;*/

        var Hpercent3d, Vpercent3d;
        if (enable3d) {
            Hpercent3d = 0//WidthA;
            Vpercent3d = 0//HeightA;
            measureright.display = false;
        }
        else {
            Hpercent3d = 0;
            Vpercent3d = 0;
        }

        var Vpercent;
        if (enable3d) {
            if (stacked)
                Vpercent = barpercentmeasure(ctx, option, chart, false) * gtotalmax;
            else
                Vpercent = barpercentmeasure(ctx, option, chart, false);
        }
        else
            Vpercent = 0;
        //top
        var vmovey = vA + Vpercent;
        //bottom
        var vposition = vB;
        var HCanvas = (vposition - vmovey) //+ Vpercent3d;
        //varCompute
        var varCompute = ComputeCheck(option, vposition, maxX, minX, "x");
        var lineDrawCount = LineCount(option, vposition, maxX, minX, "x");
        var intervalH = HCanvas / (lineDrawCount - 1);
        var varP = VarPcount(option, vposition, maxX, minX, "x");
        for (var i = 0; i < lineDrawCount; i++) {
            if (valueuptotal >= valuedowntotal) {
                cy = parseInt(i * intervalH) + vmovey;
            }
            else if (valueuptotal < valuedowntotal) {
                cy = parseInt(((lineDrawCount - 1) - i) * intervalH) + vmovey;
            }

            if (varP == 0) var YaddB = cy;

            varP -= varCompute;
        }

        var totalValues = (varCompute * (lineDrawCount - 1));

        var xnumbase = ctx.BaseNum(option, "left", precision, chart);
        var numbaseB = hB //- Hpercent3d;

        var Xorigin = (xnumbase + 5) //+ Hpercent3d;;
        var XCanvas = numbaseB - 5;

        //graph and label
        var addW = 0;

        var widthtotal = XCanvas - Xorigin;
        var widthC = widthtotal;
        widthC /= ObjectData.length;
        widthC /= data.length;
        var widthCperline = widthtotal;
        widthCperline /= data.length;
        w = widthC;
        if (data.length == 1) w /= 2;

        var Gout = groupout(option, gtotalresult, true);
        //animation
        //animatecanvas(option, canvasID, animateChart, animation, percent);

        var a = elementID(canvasID);
        var p8draw = a.getAttribute("p8draw", true);
        var barlineAnimate;

        if (p8draw != "true" && p8draw == undefined) {
            requestAnimFrame(animateChart);
        } else {
            percent = 99;
            animateChart();
        }

        function animateChart() {
            var canvasAnimate;
            var a = ElementID(canvasID);
            if (percent == 100 || !animation) {
                cancelAnimFrame(canvasAnimate);
                a.setAttribute("p8animate", false);
                a.setAttribute("p8draw", true);
                percentanimation = 1;
            }
            else {
                if (percent < 100) {
                    canvasAnimate = requestAnimFrame(animateChart, millisecond);
                }
                percent++
                percentanimation = percent / 100;
            }
            if (animation) ctx.clear(option.size.width, option.size.height);
            ctx.gridlinesdraw(option, precision, chart);

            ctx.save();
            var x, y, width, height, plotx, liney, plotlabeldisplay, plotlabelx, plotlabely, plotlabelbaseline;
            var elementtext, elementgroup, elementvalue;

            function Bubble(option, chart, YaddB) {
                var data = dataarrayoutput(option),
				    ObjectData = option.ObjectData,
					bubblelabel = option.bubblelabel || "",
					plotlabel = option.plotlabel;

                var maxbubblearea = 0;
                for (ic = 1; ic <= ObjectData.length; ic++) {
                    for (i = 0; i < data.length; i++) {
                        var subdata = data[i][Object.keys(data[i])[ic]];
                        valuearea = NaNCheck(subdata.area) || NaNCheck(subdata[Object.keys(subdata)[1]]);
                        maxbubblearea = (valuearea > maxbubblearea) ? valuearea : maxbubblearea;
                    }
                }
                var xaddW = 0;//addW;
                for (ic = 1; ic <= ObjectData.length; ic++) {
                    var OD = ObjectData[ic - 1];
                    ODlabel = OD[Object.keys(OD)[0]] || "";
                    OD.fillcolor = OD.fillcolor || "black";
                    OD.filltype = OD.filltype || "color";
                    OD.style = OD.style || "2d";
                    OD.marker = OD.marker || "o";
                    OD.heat = OD.heat || false;
                    OD.showlabel = OD.showlabel || false;
                    for (i = 0; i < data.length; i++) {
                        var bubblewidth, bubblefill, bubblestroke;
                        var subdata = data[i][Object.keys(data[i])[ic]];

                        //var datainput = DataInput(data, i, ic);
                        var datainput = DataInput(data, i, ic) || NaNCheck(subdata[Object.keys(subdata)[0]]);
                        if (datainput > maxset) datainput = maxset;

                        valuex = -1 * datainput;

                        var x = Xorigin + (w * i * (ObjectData.length));
                        var y = YaddB;
                        var width = (w * ObjectData.length) / 2;
                        var height = parseInt((valuex / totalValues) * HCanvas);

                        if (valuex > 0) y += 1;

                        var plotx = parseInt(x + width);
                        var liney = parseFloat(y + height) - 1;

                        var valuearea = NaNCheck(subdata.area) || NaNCheck(subdata[Object.keys(subdata)[1]]);
                        if (valuearea < 0) valuearea = 0;

                        var circleradius = round(conh * 0.12);

                        var circlewidth = (circleradius * (valuearea / maxbubblearea)) * percentanimation;

                        var datacolor;

                        //heat
                        if (OD.heat) {
                            var htotal = OD.fillcolor.length;
                            var heatmeasure = parseInt(maxbubblearea / htotal);

                            for (var k = 0; k < htotal; k++) {
                                if (k == (htotal - 1)) {
                                    if ((circlewidth >= 0 + (heatmeasure * k))) {
                                        datacolor = OD.fillcolor[k].color;
                                    }
                                }
                                else {
                                    if ((circlewidth >= 0 + (heatmeasure * k))
                                        && (circlewidth < heatmeasure + (heatmeasure * k))) {
                                        datacolor = OD.fillcolor[k].color;
                                    }
                                }
                            }

                        }
                        else {
                            datacolor = data[i].fillcolor || OD.fillcolor;
                        }

                        //stroke
                        bubblewidth = OD.strokewidth;
                        bubblestroke = OD.strokecolor || datacolor;

                        //fill
                        var elementfill;
                        var shine = [];
                        shine.push({ color: rgba(255, 255, 255, 0.5), stop: 0 });
                        shine.push({ color: datacolor, stop: 0.7 });
                        if (OD.filltype == "color") {
                            if (OD.style == "3d")
                                bubblefill = ctx.GradientCircle(plotx, liney, circlewidth / 5, plotx, liney - 1, circlewidth, shine);
                            else
                                bubblefill = datacolor;
                            elementfill = datacolor;
                        }
                        else if (OD.filltype == "gradient") {
                            //gradient
                            OD.gradienttype = OD.gradienttype || "radial";
                            bubblefill = ctx.GradientMarker(OD.fillcolor, OD.gradienttype, plotx, liney, circlewidth);
                            var elementgrad = [];
                            for (var j = 0; j < OD.fillcolor.length; j++) {
                                elementgrad.push(OD.fillcolor[j].color);
                            }
                            elementfill = elementgrad;
                        }

                        //markers
                        var bubblemarker = data[i].marker || OD.marker;
                        ctx.Markers(bubblemarker, plotx, liney, circlewidth, bubblewidth, bubblefill, bubblestroke, 1, canvasIDcon, shadow);
                        elementlabel = LabelOutput(option, i, true, chart);

                        var valuelist = [];
                        var ODlist = [];
                        var averagelist = [];
                        var filllist = [];
                        var filltypelist = [];
                        var gradtypelist = [];
                        var shapelist = [];
                        for (var j = 1; j <= ObjectData.length; j++) {
                            var ODE = ObjectData[j - 1];
                            var Esubdata = data[i][Object.keys(data[i])[j]];
                            var valuearray = NaNCheck(Esubdata[Object.keys(Esubdata)[0]]);
                            var averagearray = NaNCheck(Esubdata[Object.keys(Esubdata)[1]]);
                            if (averagearray < 0) averagearray = 0;

                            if (ODE.filltype == "color") {
                                var datacolorlist;
                                var elementcolor = datacolor;
                                if (elementcolor == undefined || j > 1) datacolorlist = ODE.fillcolor;
                                else datacolorlist = elementcolor;
                                filllistresult = datacolorlist;
                            }
                            else if (ODE.filltype == "gradient") {
                                ODE.gradienttype = ODE.gradienttype || "linear a";
                                var elementgrad = [];
                                for (var k = 0; k < ODE.fillcolor.length; k++) {
                                    elementgrad.push(ODE.fillcolor[k].color);
                                }
                                filllistresult = elementgrad;
                                gradtypelist.push(ODE.gradienttype);
                            }

                            var shapeout = data[i].marker || ODE.marker;
                            shapelist.push(shapeout);
                            filllist.push(filllistresult);
                            filltypelist.push(ODE.filltype);
                            valuelist.push(valuearray);
                            averagelist.push(averagearray);
                            if (ObjectData.length > 1) ODlist.push(ODE[Object.keys(ODE)[0]]);
                            else ODlist.push(elementlabel);
                        }

                        var xtest = widthtotal / data.length;
                        elementX = xnumbase + ((xtest) * i)//x;
                        elementwidth = xtest//width;

                        if (valuex < 0) {
                            elementY = y + height;
                            elementheight = HCanvas //height * -1;
                        }
                        else {
                            elementY = y;
                            elementheight = HCanvas//height;
                        }

                        //element = {
                        //    x: elementX //(x + width) - (circlewidth / 2)
                        //    , y: elementY //(y + height) - (circlewidth / 2)
                        //    , width: elementwidth //circlewidth
                        //    , height: elementheight //circlewidth
                        //    , text: ODlabel + ": "
                        //    , label: elementlabel
                        //    , prefix: format.prefix
                        //    , suffix: format.suffix
                        //    , filltype: OD.filltype
                        //    , textaverage: bubblelabel
                        //    , valueaverage: valuearea + "<br>"
                        //    , valuearray: valuelist
                        //    , ODlist: ODlist
                        //    , averagelist: averagelist
                        //    , filltypelist: filltypelist
                        //    , filllist: filllist
                        //    , gradtypelist: gradtypelist
                        //    , pattern: shapelist
                        //}
                        //if (percentanimation == 1) elementlist.push(element);
                    }
                }
                ctx.BubbleGridCut(conw, conh, vmovey, vposition, xnumbase, numbaseB);
                for (ic = 1; ic <= ObjectData.length; ic++) {
                    var OD = ObjectData[ic - 1];
                    OD.showlabel = OD.showlabel || false;
                    for (i = 0; i < data.length; i++) {
                        var subdata = data[i][Object.keys(data[i])[ic]];
                        var datainput = NaNCheck(subdata[Object.keys(subdata)[0]]);
                        if (datainput > maxset) datainput = maxset;

                        var x;
                        valuex = -1 * datainput;

                        x = Xorigin + (w * i * (ObjectData.length));
                        var y = YaddB;
                        var width = (w * ObjectData.length) / 2;
                        var height = parseInt((valuex / totalValues) * HCanvas);

                        if (valuex > 0) y += 1;

                        var plotx = parseInt(x + width),
                            liney = parseFloat(y + height) - 1;
                        var valuearea = NaNCheck(subdata[Object.keys(subdata)[1]]);

                        var areatext = parseInt(valuearea);
                        var arearesult;
                        arearesult = areatext;
                        if (click && percentanimation == 1) ctx.Text(arearesult, plotx, liney, 0, plotlabel.color, null, 0, "center", "middle", plotlabel);
                    }
                }
            }

            function BarLine(option, chart, output, YaddB, percentanimation) {
                var data = dataarrayoutput(option);
                var ObjectData = option.ObjectData;
                var totalbar = TotalBarLine(option, "bar");
                var totalline = TotalBarLine(option, "line");
                var plotlabel = option.plotlabel;
                var pattern3d = option.pattern3d;
                plotlabel.custom = plotlabel.custom || false;

                //var dataconsole = [];
                var xaddW = 0;//addW;
                for (ic = 1; ic <= ObjectData.length; ic++) {
                    var revic = ObjectData - (ic - 1);
                    var OD = ObjectData[ic - 1];
                    OD.fillcolor = OD.fillcolor || "black";
                    OD.strokecolor = OD.strokecolor || "black";
                    OD.filltype = OD.filltype || "color";
                    OD.style = OD.style || "2d";
                    OD.group = OD.group || { ID: 1, text: "Group 1" };
                    if (OD.group.ID == undefined 
                        || OD.group.ID < 1
                        || OD.group.ID == null) OD.group.ID = 1;
                    OD.showlabel = OD.showlabel || false;
                    OD.bevel = OD.bevel || false;
                    OD.charttype = OD.charttype || "bar";
                    if (enable3d) OD.charttype = "bar";

                    switch (output) {
                        case "bar":
                            //bars
                            if (OD.charttype == "bar") {
                                for (i = 0; i < data.length; i++) {
                                    ctx.save();
                                    var valueout, valuex, valuetype;
                                    var datainput = DataInput(data, i, ic);
                                    if (datainput > maxset) datainput = maxset;

                                    if (!reversedata) {
                                        valueout = datainput;
                                        if (enable3d) {
                                            switch (pattern3d) {
                                                case "cylinder":
                                                    valuex = datainput;
                                                    break
                                                case "cone": case "pyramid":
                                                    var garray = groupout(option, gtotalresult, false);
                                                    var percent3dstack;
                                                    if (stacked) {
                                                        valuex = stack3d(option, i, ic, datainput, chart, gtotalresult) * -1;
                                                        percent3dstack = Percent(valuex, stacktotal(option, i, ic, datainput, chart, gtotalresult)) * -1;
                                                    }
                                                    else {
                                                        valuex = datainput * -1;
                                                        percent3dstack = 100;
                                                    }

                                                    break
                                                default:
                                                    valuex = datainput * -1;
                                                    break
                                            }
                                        }
                                        else valuex = datainput;

                                    }
                                    else {
                                        valueout = datainput * -1;
                                        valuex = datainput * -1;
                                    }

                                    valuex = valuex || 0;
                                    //color
                                    var barfill, elementfill, elementgradient;
                                    var datacolor = data[i].fillcolor || OD.fillcolor;

                                    var shine = [];
                                    shine.push({ color: rgba(0, 0, 0, 0), stop: 0 });
                                    shine.push({ color: rgba(255, 255, 255, 0.7), stop: 0.25 });
                                    shine.push({ color: rgba(255, 255, 255, 0.7), stop: 0.35 });
                                    shine.push({ color: rgba(0, 0, 0, 0), stop: 0.8 });

                                    //stroke
                                    OD.strokewidth = OD.strokewidth || 0;

                                    barwidth = OD.strokewidth;
                                    if (percentstack || stacked || valuex == 0) barwidth = 0;
                                    barstroke = OD.strokecolor;

                                    //X, Y, Width, Height
                                    x = parseFloat(BarX(option, i, w, Xorigin, gtotalresultmax)) + xaddW;

                                    y = YaddB;

                                    width = BarLength(option, w);
                                    if (totalline >= 1) width *= ((totalline / totalbar) + totalline);
                                    var group3D = group3dstack(option, i);
                                    var scaleX = 1;
                                    var scaleY
                                    if (valueout > 0) {
                                        if (enable3d) {
                                            switch (pattern3d) {
                                                case "cylinder":
                                                    scaleY = -1;
                                                    break
                                                default:
                                                    scaleY = 1;
                                            }
                                        }
                                        else scaleY = -1;
                                    }
                                    else {
                                        if (enable3d) {
                                            switch (pattern3d) {
                                                case "cylinder":
                                                    scaleY = 1;
                                                    break
                                                case "cone": case "pyramid":
                                                    if (stacked)
                                                        scaleY = 1;
                                                    else
                                                        scaleY = -1;
                                                    break
                                                default:
                                                    scaleY = -1;
                                            }
                                        }
                                        else scaleY = 1;
                                        valuex *= -1;
                                    }

                                    var pstacktotal = PercentTotal(option, i);
                                    var pstack = Percent((valuex / totalValues), pstacktotal);

                                    //For Stacked Bar
                                    if (stacked && !percentstack) {
                                        var gs = gtotalmax * gtotalresultmax;
                                        width *= totalbar;
                                        width /= gtotalresultmax;

                                        x += (width * (OD.group.ID - 1));
                                        for (var g = 1; g < ic; g++) {
                                            valuexAdd = Stack(option, valuex, ic, i, g, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                                            y += (valuexAdd / gs);
                                        }
                                    }

                                    //For Percentage Stack
                                    if (percentstack) {
                                        width *= totalbar;
                                        for (var g = 1; g < ic; g++) {
                                            valuexAddpercent = PStack(option, i, g, valuex, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                                            y += (valuexAddpercent / ObjectData.length);
                                        }

                                    }
                                    if (width < 1) width = 1;
                                    ctx.scale(scaleX, scaleY);
                                    x /= scaleX;
                                    y /= scaleY;

                                    //if (valueout > 0) y;
                                    //if (valueout <= 0) y += 1;
                                    if (!percentstack) height = parseFloat((valuex / totalValues) * HCanvas) * percentanimation;

                                    //For Stacked Bar
                                    if (stacked && !percentstack) {
                                        if (enable3d) {
                                            switch (pattern3d) {
                                                case "cone":
                                                    height /= gtotalmax;
                                                    break
                                                default:
                                                    height /= gtotalmax;
                                                    break
                                            }
                                        }
                                        else {
                                            height /= gtotalmax;
                                        }
                                    }

                                    //For Percentage Stack
                                    if (percentstack) {
                                        height = (pstack * HCanvas) * percentanimation;
                                    }

                                    //gradient
                                    if (OD.filltype == "gradient") {
                                        var gtypeout = OD.gradienttype || "linear a";
                                        gtypeout = gtypeout.toLowerCase();
                                        var grad = [];
                                        for (var j = 0; j < OD.fillcolor.length; j++) {
                                            grad.push({
                                                color: OD.fillcolor[j].color
                                                , stop: OD.fillcolor[j].stop
                                            });
                                        }
                                        switch (gtypeout) {
                                            case "linear a": barfill = ctx.GradientLinear(0, y, width, height, grad, 0, false, false); break
                                            case "linear b": barfill = ctx.GradientLinear(0, y, width, height, grad, 0, true, false); break
                                            case "linear c": barfill = ctx.GradientLinear(x, 0, width, height, grad, 0, true, true); break
                                            case "linear d": barfill = ctx.GradientLinear(x, 0, width, height, grad, 0, false, true); break
                                            case "linear e":
                                                if (valuex < 0) barfill = ctx.GradientLinear(x, y, width, height, grad, 0, false, false, true);
                                                else barfill = ctx.GradientLinear(x, y, width, height, grad, 0, true, true, true);
                                                break
                                            case "linear f":
                                                if (valuex < 0) barfill = ctx.GradientLinear(x, y, width, height, grad, 0, true, false, true);
                                                else barfill = ctx.GradientLinear(x, y, width, height, grad, 0, false, true, true);
                                                break
                                            case "linear g":
                                                if (valuex < 0) barfill = ctx.GradientLinear(x, y, width, height, grad, 0, false, true, true);
                                                else barfill = ctx.GradientLinear(x, y, width, height, grad, 0, true, false, true);
                                                break
                                            case "linear h":
                                                if (valuex < 0) barfill = ctx.GradientLinear(x, y, width, height, grad, 0, true, true, true);
                                                else barfill = ctx.GradientLinear(x, y, width, height, grad, 0, false, false, true);
                                                break
                                        }
                                    }
                                    else if (OD.filltype == "color") {
                                        //if (OD.style == "2d") {
                                        //    barfill = datacolor;
                                        //}
                                        //else if (OD.style == "3d") {
                                        //    barfill = ctx.GradientLinear(x, 0, width, height, shine, 0, false, true);
                                        //}
                                        barfill = datacolor;
                                        shinefill = ctx.GradientLinear(x, 0, width, height, shine, 0, false, true);
                                    }
                                    if (OD.bevel)
                                        ctx.bevelbar(valueout, x, y, width, height, barwidth, barfill, barstroke, chart, shadow);
                                    else {
                                        if (enable3d) {
                                            var stretch = true;
                                            var bar = true;

                                            switch (pattern3d) {
                                                case "cylinder":
                                                    ctx.cylinder(x, y, width, height, 20, bar, true, scaleY, barfill, barstroke, barwidth, [0], shadow, chart, option, ic, i, 1, Gout, null);
                                                    break;
                                                case "cone":
                                                    ctx.cone(x, y, width, height, 10, 0, stretch, percent3dstack, 0, height, bar, false, scaleY, OD.filltype, OD.gradienttype, barfill, barstroke, barwidth, [0], shadow, Gout[ic - 1], option, ic, i);
                                                    break
                                                case "pyramid":
                                                    ctx.pyramid(x, y, width, height, 20, 0, bar, stretch, percent3dstack, 0, height, false, scaleY, OD.filltype, OD.gradienttype, barfill, barstroke, barwidth, [0], shadow, chart, option, 1, ic, i, Gout);
                                                    break
                                                default: //"bar"
                                                    ctx.Bar3D(x, y, width, height, 20, 0, barfill, "", 0, [0], shadow, true, scaleY, option, group3D[ic - 1], ic, i, chart, Gout, null);
                                                    break
                                            }
                                        }
                                        else {
                                            ctx.drawbar(x, y, width, height, barwidth, barfill, barstroke, shadow);
                                            if (OD.style == "3d") ctx.drawbar(x, y, width, height, barwidth, shinefill, barstroke, nullshadow);
                                        }
                                    }

                                    if (!reversedata) elementvalue = (valuex);
                                    else elementvalue = (valuex * -1);

                                    data[i].text = data[i].text || "";

                                    if (plotlabel.custom) plotlabeldisplay = data[i].text;
                                    else plotlabeldisplay = parseInt(elementvalue * percentanimation);

                                    plotlabely = y + height;

                                    if (valuex <= 0) plotlabelbaseline = "alphabetic";
                                    else plotlabelbaseline = "hanging";

                                    //if ((click
                                    //    || plotlabel.display)
                                    //    && percentanimation == 1) ctx.Text(plotlabeldisplay, x + (width / 2), plotlabely, 0, plotlabel.color, null, 0, "center", plotlabelbaseline, plotlabel);
                                    ctx.restore();
                                    //dataconsole.push(valuex)
                                }
                                if (!stacked && !percentstack) xaddW += width;
                            }
                            break;
                        case "line":
                            //lines and plots
                            if (OD.charttype == "line") {
                                ctx.save();
                                var linestroke;
                                OD.areafill == OD.areafill || rgba(0, 0, 0, 0);
                                OD.area = OD.area || false;
                                OD.dash = OD.dash || [];
                                OD.areafilltype = OD.areafilltype || "color";
                                OD.curve = OD.curve || false;

                                var curvetension = 0.375;
                                var curvesegments = 16;

                                //area
                                if (OD.curve) {
                                    var curvearea = [];
                                    for (i = 0; i < data.length; i++) {
                                        //ctx.save();
                                        var datainput = DataInput(data, i, ic);
                                        if (datainput > maxset) datainput = maxset;

                                        if (!reversedata) {
                                            valueout = datainput;
                                            valuex = datainput;
                                        }
                                        else {
                                            valueout = datainput * -1;
                                            valuex = datainput * -1;
                                        }
                                        //var x, width;
                                        if (totalbar >= 1) x = Xorigin + (w * i * (ObjectData.length));
                                        else x = LineX(option, i, widthtotal, Xorigin);

                                        if (totalbar >= 1) width = (w * ObjectData.length) / 2;
                                        else width = 1;

                                        y = YaddB;

                                        var scaleX = 1;

                                        if (valueout > 0) {
                                            var scaleY = 1;
                                            valuex *= -1;
                                        }
                                        else {
                                            var scaleY = 1;
                                            valuex *= -1;
                                        }

                                        var pstacktotal = PercentTotal(option, i);
                                        var pstack = Percent((valuex / totalValues), pstacktotal);

                                        //For Stacked Line
                                        if (stacked && !percentstack) {
                                            for (var g = 1; g < ic; g++) {
                                                valuexAdd = Stack(option, valuex, ic, i, g, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                                                y += (valuexAdd / gs);
                                            }
                                        }
                                        //For Percentage Stack
                                        if (percentstack) {
                                            for (var g = 1; g < ic; g++) {
                                                valuexAddpercent = PStack(option, i, g, valuex, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                                                y += (valuexAddpercent / ObjectData.length);
                                            }
                                        }
                                        if (valuex == undefined) continue;

                                        ctx.scale(scaleX, scaleY);

                                        if (!percentstack) height = parseInt((valuex / totalValues) * HCanvas) * percentanimation;

                                        //For Stacked Line
                                        if (stacked && !percentstack) {
                                            height /= ObjectData.length;
                                        }
                                        //For Percentage Stack
                                        if (percentstack) {
                                            height = (pstack * HCanvas) * percentanimation;
                                        }

                                        plotx = parseFloat(x + width);
                                        liney = parseFloat(y + height);
                                        //if (valuex > 0) liney;

                                        //if (valuex <= 0) liney;
                                        //if (valuex > 0) liney += 1;

                                        //for markers
                                        //var Xshape = plotx;
                                        //var Yshape = liney;
                                        //curvearray.push({ x: Xshape, y: Yshape });
                                        //for markers
                                        var Xshape = plotx;
                                        var Yshape = liney;
                                        curvearea.push({ x: Xshape, y: Yshape });
                                        //ctx.restore();
                                    }

                                    //y = YaddB;
                                    //if (totalbar >= 1) x = Xorigin + (w * i * (ObjectData.length));
                                    //else x = LineX(option, i, widthtotal, Xorigin);

                                    var startpoint = { x: Xorigin + (w * 0 * (ObjectData.length)), y: YaddB },
                                        endpoint = { x: Xorigin + (w * (data.length - 1) * (ObjectData.length)), y: YaddB };

                                    drawCurveArea(OD, ctx, curvearea, YaddB, curvetension, false, curvesegments);
                                }
                                else {
                                    for (i = 0; i < data.length; i++) {
                                        ctx.save();
                                        var datainput = DataInput(data, i, ic);
                                        if (datainput > maxset) datainput = maxset;
                                        //if (percentanimation == 1) console.log(datainput)
                                        if (!reversedata) {
                                            valueout = datainput;
                                            valuex = datainput;
                                        }
                                        else {
                                            valueout = datainput * -1;
                                            valuex = datainput * -1;
                                        }
                                        //var x, width;
                                        if (totalbar >= 1) x = Xorigin + (w * i * (ObjectData.length));
                                        else x = LineX(option, i, widthtotal, Xorigin);

                                        if (totalbar >= 1) width = (w * ObjectData.length) / 2;
                                        else width = 1;

                                        y = YaddB;

                                        var scaleX = 1;

                                        if (valueout > 0) {
                                            var scaleY = -1;
                                        }
                                        else {
                                            var scaleY = 1;
                                            valuex *= -1;
                                        }

                                        var pstacktotal = PercentTotal(option, i);
                                        var pstack = Percent((valuex / totalValues), pstacktotal);

                                        //For Stacked Line
                                        if (stacked && !percentstack) {
                                            for (var g = 1; g < ic; g++) {
                                                valuexAdd = Stack(option, valuex, ic, i, g, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                                                y += (valuexAdd / gs);
                                            }
                                        }
                                        //For Percentage Stack
                                        if (percentstack) {
                                            for (var g = 1; g < ic; g++) {
                                                valuexAddpercent = PStack(option, i, g, valuex, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                                                y += (valuexAddpercent / ObjectData.length);
                                            }
                                        }
                                        if (valuex == undefined) continue;

                                        ctx.scale(scaleX, scaleY);
                                        x /= scaleX;
                                        y /= scaleY;

                                        if (!percentstack) height = parseInt((valuex / totalValues) * HCanvas) * percentanimation;

                                        //For Stacked Line
                                        if (stacked && !percentstack) {
                                            height /= ObjectData.length;
                                        }
                                        //For Percentage Stack
                                        if (percentstack) {
                                            height = (pstack * HCanvas) * percentanimation;
                                        }

                                        plotx = parseInt(x + width);
                                        liney = parseFloat(y + height);
                                        //if (valuex > 0) liney;
                                        //if (valuex <= 0) liney += 1;

                                        //gradient
                                        if (OD.areafilltype == "gradient") {
                                            var gtypeout = OD.areagradienttype || "linear a";
                                            gtypeout = gtypeout.toLowerCase();

                                            /*for (k = 0; k < data.length; k++) {
                                                var areavalue = (data[k][Object.keys(data[k])[ic]]);
                                            }*/

                                            var areaheight, ygradient;
                                            var areafillup = AreaFillTotal(option, "up"),
                                                areafilldown = AreaFillTotal(option, "down");
                                            if (areafillup == 1) {
                                                areaheight = (HCanvas) * percentanimation;
                                                ygradient = y;
                                            }
                                            else if (areafilldown == 1) {
                                                areaheight = (HCanvas) * percentanimation;
                                                ygradient = y;
                                            }
                                            else if (areafillup != data.length && areafilldown != data.length) {
                                                areaheight = (HCanvas) * percentanimation;
                                                ygradient = vposition;
                                            }
                                            var grad = [];
                                            for (var j = 0; j < OD.areafill.length; j++) {
                                                grad.push({
                                                    color: OD.areafill[j].color
                                                    , stop: OD.areafill[j].stop
                                                });
                                            }
                                            switch (gtypeout) {
                                                case "linear a":
                                                    areafill = ctx.GradientLinear(0, ygradient, conw, areaheight, grad, 0, false, false); break
                                                case "linear b":
                                                    areafill = ctx.GradientLinear(0, ygradient, conw, areaheight, grad, 0, true, false); break
                                                case "linear c":
                                                    areafill = ctx.GradientLinear(xnumbase, 0, conw, areaheight, grad, 0, true, true); break
                                                case "linear d":
                                                    areafill = ctx.GradientLinear(xnumbase, 0, conw, areaheight, grad, 0, false, true); break
                                                    /*case "linear e":
                                                        if (valuex < 0) areafill = ctx.GradientLinear(0, 0, conw, areaheight, grad, 0, false, false, true);
                                                        else areafill = ctx.GradientLinear(0, 0, conw, areaheight, grad, 0, true, true, true);
                                                        break
                                                    case "linear f":
                                                        if (valuex < 0) areafill = ctx.GradientLinear(0, 0, conw, areaheight, grad, 0, true, false, true);
                                                        else areafill = ctx.GradientLinear(0, 0, conw, areaheight, grad, 0, false, true, true);
                                                        break
                                                    case "linear g":
                                                        if (valuex < 0) areafill = ctx.GradientLinear(0, 0, conw, areaheight, grad, 0, true, false, true);
                                                        else areafill = ctx.GradientLinear(0, 0, conw, areaheight, grad, 0, false, true, true);
                                                        break
                                                    case "linear h":
                                                        if (valuex < 0) areafill = ctx.GradientLinear(0, 0, conw, areaheight, grad, 0, false, false, true);
                                                        else areafill = ctx.GradientLinear(0, 0, conw, areaheight, grad, 0, true, true, true);
                                                        break*/
                                            }
                                        }
                                        else if (OD.areafilltype == "color") {
                                            areafill = OD.areafill;
                                        }
                                        //start of area drawing
                                        function arealine() {
                                            ctx.save();
                                            ctx.setLineDash(OD.dash);
                                            ctx.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
                                            ctx.fillStyle = areafill;
                                            var curveadd;
                                            if (valuex > 0) curveadd = 10
                                            else curveadd = -10
                                            if (i >= 1) {
                                                ctx.save();
                                                //ctx.bezierCurveTo(plotx, liney, plotx, liney, plotx, liney); //this is only a trial
                                                //ctx.bezierCurveTo(plotx, Math.atan2(liney, plotx), Math.atan2(liney, plotx), Math.atan2(liney, plotx), Math.atan2(liney, plotx), liney); //this is only a trial
                                                //BezierCurve(plotx, liney, ctx);
                                                ctx.lineTo(plotx, liney);
                                                ctx.restore();

                                                ctx.save();
                                                ctx.lineTo(plotx, y);
                                                ctx.restore();
                                                ctx.fill();
                                                if (i == data.length - 1) ctx.closePath();
                                            }
                                            ctx.beginPath();
                                            ctx.moveTo(plotx, y);
                                            ctx.lineTo(plotx, liney);
                                            ctx.restore();
                                        }

                                        ctx.save();
                                        ctx.lineCap = OD.cap;
                                        ctx.lineJoin = OD.join;

                                        if (OD.area) arealine();
                                        ctx.restore();

                                        //for markers
                                        //var Xshape = plotx;
                                        //var Yshape = liney;
                                        //curvearray.push({ x: Xshape, y: Yshape });
                                        ctx.restore();
                                    }
                                }

                                //lines
                                if (OD.curve) {
                                    var curvearray = [];
                                    for (i = 0; i < data.length; i++) {
                                        //ctx.save();
                                        var datainput = DataInput(data, i, ic);
                                        if (datainput > maxset) datainput = maxset;

                                        if (!reversedata) {
                                            valueout = datainput;
                                            valuex = datainput;
                                        }
                                        else {
                                            valueout = datainput * -1;
                                            valuex = datainput * -1;
                                        }
                                        //var x, width;
                                        if (totalbar >= 1) x = Xorigin + (w * i * (ObjectData.length));
                                        else x = LineX(option, i, widthtotal, Xorigin);

                                        if (totalbar >= 1) width = (w * ObjectData.length) / 2;
                                        else width = 1;

                                        y = YaddB;

                                        var scaleX = 1;

                                        if (valueout > 0) {
                                            var scaleY = 1;
                                            valuex *= -1;
                                        }
                                        else {
                                            var scaleY = 1;
                                            valuex *= -1;
                                        }

                                        var pstacktotal = PercentTotal(option, i);
                                        var pstack = Percent((valuex / totalValues), pstacktotal);

                                        //For Stacked Line
                                        if (stacked && !percentstack) {
                                            for (var g = 1; g < ic; g++) {
                                                valuexAdd = Stack(option, valuex, ic, i, g, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                                                y += (valuexAdd / gs);
                                            }
                                        }
                                        //For Percentage Stack
                                        if (percentstack) {
                                            for (var g = 1; g < ic; g++) {
                                                valuexAddpercent = PStack(option, i, g, valuex, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                                                y += (valuexAddpercent / ObjectData.length);
                                            }
                                        }
                                        if (valuex == undefined) continue;

                                        ctx.scale(scaleX, scaleY);

                                        if (!percentstack) height = parseInt((valuex / totalValues) * HCanvas) * percentanimation;

                                        //For Stacked Line
                                        if (stacked && !percentstack) {
                                            height /= ObjectData.length;
                                        }
                                        //For Percentage Stack
                                        if (percentstack) {
                                            height = (pstack * HCanvas) * percentanimation;
                                        }

                                        plotx = parseFloat(x + width);
                                        liney = parseFloat(y + height);
                                        //if (valuex > 0) liney;

                                        //if (valuex <= 0) liney;
                                        //if (valuex > 0) liney += 1;

                                        //for markers
                                        var Xshape = plotx;
                                        var Yshape = liney;
                                        curvearray.push({ x: Xshape, y: Yshape });
                                    }

                                    drawCurve(OD, ctx, curvearray, curvetension, false, curvesegments);
                                    //if (percentanimation == 1) console.log(getCurvePoints(curvearray, 0.5, false, 16));
                                }
                                else {
                                    for (i = 0; i < data.length; i++) {
                                        ctx.save();
                                        var datainput = DataInput(data, i, ic);
                                        if (datainput > maxset) datainput = maxset;

                                        if (!reversedata) {
                                            valueout = datainput;
                                            valuex = datainput;
                                        }
                                        else {
                                            valueout = datainput * -1;
                                            valuex = datainput * -1;
                                        }

                                        //var x, width;
                                        if (totalbar >= 1) x = Xorigin + (w * i * (ObjectData.length));
                                        else x = LineX(option, i, widthtotal, Xorigin);

                                        if (totalbar >= 1) width = (w * ObjectData.length) / 2;
                                        else width = 1;

                                        y = YaddB;

                                        var scaleX = 1;

                                        if (valueout > 0) {
                                            var scaleY = -1;
                                        }
                                        else {
                                            var scaleY = 1;
                                            valuex *= -1;
                                        }

                                        var pstacktotal = PercentTotal(option, i);
                                        var pstack = Percent((valuex / totalValues), pstacktotal);

                                        //For Stacked Line
                                        if (stacked && !percentstack) {
                                            var gs = gtotalmax * gtotalresultmax;

                                            for (var g = 1; g < ic; g++) {
                                                valuexAdd = Stack(option, valuex, ic, i, g, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                                                y += (valuexAdd / gs);
                                            }

                                        }

                                        //For Percentage Stack
                                        if (percentstack) {
                                            for (var g = 1; g < ic; g++) {
                                                valuexAddpercent = PStack(option, i, g, valuex, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                                                y += (valuexAddpercent / ObjectData.length);
                                            }
                                        }

                                        if (valuex == undefined) continue;

                                        ctx.scale(scaleX, scaleY);
                                        x /= scaleX;
                                        y /= scaleY;

                                        if (!percentstack) height = parseInt((valuex / totalValues) * HCanvas) * percentanimation;

                                        //For Stacked Line
                                        if (stacked && !percentstack) {
                                            height /= gtotalmax;
                                        }

                                        //For Percentage Stack
                                        if (percentstack) {
                                            height = (pstack * HCanvas) * percentanimation;
                                        }

                                        plotx = parseInt(x + width);
                                        liney = parseFloat(y + height);

                                        ctx.lineWidth = OD.linewidth;

                                        linestroke = OD.linecolor;

                                        if (OD.linecolor == undefined) {
                                            if (!OD.area) {
                                                if (OD.filltype == "gradient") linestroke = OD.fillcolor[OD.fillcolor.length - 1].color;
                                                else if (OD.filltype == "color") linestroke = OD.fillcolor;
                                            }
                                            else linestroke = rgba(0, 0, 0, 0);
                                        }

                                        if (OD.filltype == "gradient") {
                                            OD.gradienttype = OD.gradienttype || "linear a";
                                            var elementgrad = [];
                                            for (var j = 0; j < OD.fillcolor.length; j++) {
                                                elementgrad.push(OD.fillcolor[j].color);
                                            }
                                            elementfill = elementgrad;
                                        }
                                        else if (OD.filltype == "color") {
                                            var datacolor = data[i].fillcolor || OD.fillcolor;
                                            /*if (data[i].fillcolor == undefined) datacolor = OD.fillcolor;
                                            else datacolor = data[i].fillcolor;*/
                                            elementfill = datacolor;
                                        }

                                        //line dash
                                        OD.dash = OD.dash || [];

                                        //cap and join
                                        OD.cap = OD.cap || "round";
                                        OD.join = OD.join || "round";

                                        //start of line drawing
                                        function linepoint(stroke) {
                                            //ctx.save();
                                            ctx.setLineDash(OD.dash);
                                            ctx.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
                                            ctx.strokeStyle = stroke;
                                            if (i >= 1) {
                                                ctx.lineTo(plotx, liney);
                                                if (OD.linewidth > 0) ctx.stroke();
                                                ctx.closePath();
                                            }
                                            ctx.beginPath();
                                            ctx.moveTo(plotx, liney);
                                            //ctx.restore();
                                        }

                                        ctx.save();
                                        ctx.lineCap = OD.cap;
                                        ctx.lineJoin = OD.join;

                                        linepoint(linestroke);
                                        ctx.restore();

                                        if (OD.areasize <= 2) OD.areasize = 2;
                                        OD.areasize = OD.areasize || 2;

                                        //for plot area
                                        var areawidth = OD.areasize;

                                        //var dataarray = []
                                        //for (var j = 0; j < ObjectData.length; j++) {
                                        //    if (!reversedata) dataarray.push(DataInput(data, i, j) * -1);
                                        //    else dataarray.push(DataInput(data, i, j));
                                        //}
                                        ctx.restore();
                                    }
                                }

                                //plots
                                plots(ctx, OD, ic, chart, YaddB, Xorigin)
                                ctx.restore();
                            } //end data loop
                            break;
                        case "scatter":
                            plots(ctx, OD, ic, chart, YaddB, Xorigin);
                            break;
                    }
                } //end ObjectData loop

                if (totalline == 0) {
                    ctx.Line((xnumbase + 5), parseInt(YaddB) + 0.5, XCanvas - Vpercent, parseInt(YaddB) + 0.5, gridline.width, gridline.color, nullshadow);
                    if (ic == ObjectData.length + 1) ctx.Line(XCanvas - Vpercent, parseInt(YaddB) + 0.5, XCanvas, parseInt(YaddB - Vpercent) + 0.5, gridline.width, gridline.color, nullshadow);
                }
                //plots
                function plots(ctx, OD, ic, chart, YaddB, Xorigin) {
                    for (i = 0; i < data.length; i++) {
                        ctx.save();
                        var markerfill, markerstroke, markerwidth, gs;
                        var datacolor;
                        if (data[i].fillcolor == undefined || ic > 1) datacolor = OD.fillcolor;
                        else datacolor = data[i].fillcolor;

                        var datainput = DataInput(data, i, ic);
                        if (datainput > maxset) datainput = maxset;

                        if (!reversedata) {
                            valueout = datainput;
                            valuex = datainput;
                        }
                        else {
                            valueout = datainput * -1;
                            valuex = datainput * -1;
                        }

                        //var x, width;
                        if (totalbar >= 1 || chart == "scatter") x = Xorigin + (w * i * (ObjectData.length));
                        else x = LineX(option, i, widthtotal, Xorigin);

                        if (totalbar >= 1 || chart == "scatter") width = (w * ObjectData.length) / 2;
                        else width = 1;

                        y = YaddB;

                        var scaleX = 1;

                        if (valueout > 0) {
                            var scaleY = -1;
                        }
                        else {
                            var scaleY = 1;
                            valuex *= -1;
                        }

                        var pstacktotal = PercentTotal(option, i);
                        var pstack = Percent((valuex / totalValues), pstacktotal);

                        //For Stacked Plot
                        if (stacked && !percentstack) {
                            gs = gtotalmax * gtotalresultmax;
                            for (var g = 1; g < ic; g++) {
                                valuexAdd = Stack(option, valuex, ic, i, g, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                                y += (valuexAdd / gs);
                            }

                        }
                        //For Percentage Stack
                        if (percentstack) {
                            for (var g = 1; g < ic; g++) {
                                valuexAddpercent = PStack(option, i, g, valuex, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                                y += (valuexAddpercent / ObjectData.length);
                            }
                        }

                        ctx.scale(scaleX, scaleY);
                        x /= scaleX;
                        y /= scaleY;

                        if (!percentstack) height = ((valuex / totalValues) * HCanvas) * percentanimation;

                        //For Stacked Plot
                        if (stacked && !percentstack) {
                            height /= gtotalmax;
                        }
                        //For Percentage Stack
                        if (percentstack) {
                            height = (pstack * HCanvas) * percentanimation;
                        }

                        plotx = parseInt(x + width);
                        liney = parseFloat(y + height);

                        grady = parseFloat(y + height) * scaleY;
                        //if (valuex <= 0) liney;
                        //if (valuex > 0) liney += 1;

                        OD.areasize = OD.areasize || 2;
                        if (OD.areasize <= 2) OD.areasize = 2;

                        //for markers
                        var Xshape = plotx;
                        var Yshape = liney;
                        var Areashape = OD.areasize;

                        //gradient
                        if (OD.filltype == "gradient") {
                            OD.gradienttype = OD.gradienttype || "linear a";
                            markerfill = ctx.GradientMarker(OD.fillcolor, OD.gradienttype, plotx, grady, Areashape);
                        }
                        else if (OD.filltype == "color") {
                            markerfill = datacolor;
                        }

                        markerwidth = OD.strokewidth || 0;
                        markerstroke = OD.strokecolor || datacolor;

                        var plotmarker = data[i].marker || OD.marker;
                        //if (data[i].marker == undefined) plotmarker = OD.marker;

                        if (chart == "scatter") {
                            ctx.Markers(plotmarker, Xshape, Yshape, Areashape, markerwidth, markerfill, markerstroke, scaleY, canvasIDcon, shadow);
                        }
                        else {
                            if (data.length > 50) break;

                            if (!OD.area)
                                ctx.Markers(plotmarker, Xshape, Yshape, Areashape, markerwidth, markerfill, markerstroke, scaleY, canvasIDcon, shadow);

                        }

                        ctx.restore();
                    }
                }

                //Curve Lines
                function drawCurve(OD, ctx, ptsa, tension, isClosed, numOfSegments) {
                    ctx.lineWidth = OD.linewidth;

                    linestroke = OD.linecolor;

                    if (OD.linecolor == undefined) {
                        if (!OD.area) {
                            if (OD.filltype == "gradient") linestroke = OD.fillcolor[OD.fillcolor.length - 1].color;
                            else if (OD.filltype == "color") linestroke = OD.fillcolor;
                        }
                        else linestroke = rgba(0, 0, 0, 0);
                    }

                    //line dash
                    OD.dash = OD.dash || [];

                    //cap and join
                    OD.cap = OD.cap || "round";
                    OD.join = OD.join || "round";

                    ctx.save();
                    ctx.beginPath();
                    drawLines(ctx, getCurvePoints(ptsa, tension, isClosed, numOfSegments), linestroke, OD.linewidth, OD.dash, OD.cap, OD.join);
                    ctx.restore();
                }

                function drawCurveArea(OD, ctx, ptsa, y, tension, isClosed, numOfSegments) {
                    OD.areafill = OD.areafill || rgba(0, 0, 0, 0);
                    ctx.save();
                    ctx.beginPath();
                    drawArea(ctx, getCurvePoints(ptsa, tension, isClosed, numOfSegments), y, OD.areafill);
                    ctx.restore();
                }

                function drawLines(ctx, pts, stroke, linewidth, dash, cap, join) {
                    ctx.setLineDash(dash);
                    ctx.lineWidth = linewidth;
                    ctx.lineCap = cap;
                    ctx.lineJoin = join;
                    ctx.strokeStyle = stroke;
                    ctx.moveTo(pts[0], pts[1]);
                    for (i = 2; i < pts.length - 1; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
                    if (linewidth > 0) ctx.stroke();
                }

                function drawArea(ctx, pts, y, fill) {
                    ctx.fillStyle = fill;
                    ctx.moveTo(pts[0], y);
                    ctx.lineTo(pts[0], pts[1]);
                    for (i = 2; i < pts.length - 1; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
                    ctx.lineTo(pts[pts.length - 2], y);
                    ctx.fill();
                }

                function getCurvePoints(pts, tension, isClosed, numOfSegments, rev) {
                    rev = rev || false;
                    // use input value if provided, or use a default value	 
                    tension = (typeof tension != 'undefined') ? tension : 0.5;
                    isClosed = isClosed ? isClosed : false;
                    numOfSegments = numOfSegments ? numOfSegments : 16;

                    var inputpts = [];
                    for (i = 0; i < pts.length; i++) {
                        inputpts.push(pts[i].x);
                        inputpts.push(pts[i].y);
                    }

                    var _pts = [], res = [],	// clone array
                        x, y,			// our x,y coords
                        t1x, t2x, t1y, t2y,	// tension vectors
                        c1, c2, c3, c4,		// cardinal points
                        st, t, i;		// steps based on num. of segments

                    // clone array so we don't change the original
                    //
                    _pts = inputpts.slice(0);

                    // The algorithm require a previous and next point to the actual point array.
                    // Check if we will draw closed or open curve.
                    // If closed, copy end points to beginning and first points to end
                    // If open, duplicate first points to befinning, end points to end
                    if (isClosed) {
                        _pts.unshift(inputpts[inputpts.length - 1]);
                        _pts.unshift(inputpts[inputpts.length - 2]);
                        _pts.unshift(inputpts[inputpts.length - 1]);
                        _pts.unshift(inputpts[inputpts.length - 2]);
                        _pts.push(inputpts[0]);
                        _pts.push(inputpts[1]);
                    }
                    else {
                        _pts.unshift(inputpts[1]);	//copy 1. point and insert at beginning
                        _pts.unshift(inputpts[0]);
                        _pts.push(inputpts[inputpts.length - 2]);	//copy last point and append
                        _pts.push(inputpts[inputpts.length - 1]);
                    }

                    // ok, lets start..

                    // 1. loop goes through point array
                    // 2. loop goes through each segment between the 2 pts + 1e point before and after
                    for (i = 2; i < (_pts.length - 4) ; i += 2) {
                        for (t = 0; t <= numOfSegments; t++) {

                            // calc tension vectors
                            t1x = (_pts[i + 2] - _pts[i - 2]) * tension;
                            t2x = (_pts[i + 4] - _pts[i]) * tension;

                            t1y = (_pts[i + 3] - _pts[i - 1]) * tension;
                            t2y = (_pts[i + 5] - _pts[i + 1]) * tension;

                            // calc step
                            st = t / numOfSegments;

                            // calc cardinals
                            c1 = 2 * pow(st, 3) - 3 * pow(st, 2) + 1;
                            c2 = -(2 * pow(st, 3)) + 3 * pow(st, 2);
                            c3 = pow(st, 3) - 2 * pow(st, 2) + st;
                            c4 = pow(st, 3) - pow(st, 2);

                            // calc x and y cords with common control vectors
                            x = c1 * _pts[i] + c2 * _pts[i + 2] + c3 * t1x + c4 * t2x;
                            y = c1 * _pts[i + 1] + c2 * _pts[i + 3] + c3 * t1y + c4 * t2y;

                            //store points in array
                            res.push(x);
                            res.push(y);

                        }
                    }

                    return res;
                }
                var xaddWtxt = 0;//addW;
                for (ic = 1; ic <= ObjectData.length; ic++) {
                    var OD = ObjectData[ic - 1];
                    OD.showlabel = OD.showlabel || false;
                    OD.prefix = OD.prefix || "";
                    OD.suffix = OD.suffix || "";
                    if (OD.charttype == "bar") {
                        for (i = 0; i < data.length; i++) {
                            ctx.save();
                            var datainput = DataInput(data, i, ic);
                            if (datainput > maxset) datainput = maxset;
                            var valueout, valuex;
                            if (!reversedata) {
                                valueout = datainput;
                                valuex = datainput;
                            }
                            else {
                                valueout = datainput * -1;
                                valuex = datainput * -1;
                            }

                            valuex = valuex || 0;

                            //X, Y, Width, Height
                            x = parseFloat(BarX(option, i, w, Xorigin, gtotalresultmax) + xaddWtxt);

                            y = YaddB;

                            width = BarLength(option, w);
                            if (totalline >= 1) width *= ((totalline / totalbar) + totalline);

                            var scaleX = 1;
                            var stackscale;
                            if (valueout > 0) {
                                var scaleY = 1;
                                stackscale = -1;
                            }
                            else {
                                var scaleY = 1;
                                valuex *= -1;
                                stackscale = 1;
                            }

                            var pstacktotal = PercentTotal(option, i);
                            var pstack = Percent((valuex / totalValues), pstacktotal);

                            //For Stacked Bar
                            if (stacked && !percentstack) {
                                var gs = gtotalmax * gtotalresultmax;
                                width *= totalbar;
                                width /= gtotalresultmax;

                                x += (width * (OD.group.ID - 1));
                                for (var g = 1; g < ic; g++) {
                                    valuexAdd = Stack(option, valuex, ic, i, g, percentanimation, gtotalresult, totalValues, HCanvas, false, false, stackscale) //* -1;
                                    y += (valuexAdd / gs);
                                }
                            }

                            //For Percentage Stack
                            if (percentstack) {
                                width *= totalbar;
                                for (var g = 1; g < ic; g++) {
                                    valuexAddpercent = PStack(option, i, g, valuex, percentanimation, gtotalresult, totalValues, HCanvas, false, false, stackscale) //* -1;
                                    y += (valuexAddpercent / ObjectData.length);
                                }

                            }
                            if (width < 1) width = 1;

                            ctx.scale(scaleX, scaleY);
                            x /= scaleX;
                            y /= scaleY;

                            if (valueout > 0) y;
                            if (valueout <= 0) y;

                            if (!percentstack) height = parseFloat((valuex / totalValues) * HCanvas) //* -1;

                            //For Stacked Bar
                            if (stacked && !percentstack) {
                                height /= gtotalmax;
                            }

                            //For Percentage Stack
                            if (percentstack) {
                                height = (pstack * HCanvas);
                            }

                            //console.log(datainput)
                            if (!reversedata) elementvalue = datainput;
                            else elementvalue = datainput * -1;

                            var valuerev;
                            if (convert) valuerev = convertnum(elementvalue).toString();
                            else valuerev = elementvalue.toString();

                            //if (percentstack) elementvalue = Num(option, chart, valuerev, "x", false, false, precision);
                            //else elementvalue = Num(option, chart, valuerev, "x", false, convert, precision);

                            data[i].text = data[i].text || "";

                            if (plotlabel.custom) plotlabeldisplay = data[i].text;
                            else plotlabeldisplay = OD.prefix + valuerev + OD.suffix;
                            if (datainput <= 0)
                                plotlabely = y + height;
                            else
                                plotlabely = y - height;

                            if (datainput > 0) plotlabelbaseline = "alphabetic";
                            else plotlabelbaseline = "hanging";

                            var plotlabeloutput = plotlabeldisplay.toString();

                            var plotfill = plotlabel.fill || rgba(0, 0, 0, 0);
                            if ((click
                                || plotlabel.display)
                                && percentanimation == 1) {
                                ctx.rectangle(((x + (width * 0.5)) - ((ctx.FontWidth(plotlabeloutput, plotlabel) + 5) * 0.5)), (plotlabely - TextFontHeight(ctx, plotlabel)) + 5, ctx.FontWidth(plotlabeloutput, plotlabel) + 5, TextFontHeight(ctx, plotlabel) + 5, 0, 0, plotfill, "black", [0], nullshadow);
                                ctx.Text(plotlabeloutput, x + (width * 0.5), plotlabely, 0, plotlabel.color, null, 0, "center", plotlabelbaseline, plotlabel);
                            }
                            ctx.restore();
                        }
                        //ctx.Line((xnumbase + 5), round(YaddB) + 0.5, XCanvas, round(YaddB) + 0.5, gridline.width, gridline.color);
                        if (!stacked && !percentstack) xaddWtxt += width;
                    }
                    else if (OD.charttype == "line") {
                        //plots
                        for (i = 0; i < data.length; i++) {
                            ctx.save();
                            var markerfill, markerstroke, markerwidth, gs;
                            var datacolor;
                            if (data[i].fillcolor == undefined || ic > 1) datacolor = OD.fillcolor;
                            else datacolor = data[i].fillcolor;

                            var datainput = DataInput(data, i, ic);
                            if (datainput > maxset) datainput = maxset;

                            if (!reversedata) {
                                valueout = datainput;
                                valuex = datainput;
                            }
                            else {
                                valueout = datainput * -1;
                                valuex = datainput * -1;
                            }

                            //var x, width;
                            if (totalbar >= 1) x = Xorigin + (w * i * (ObjectData.length));
                            else x = LineX(option, i, widthtotal, Xorigin);

                            if (totalbar >= 1) width = (w * ObjectData.length) / 2;
                            else width = 1;

                            y = YaddB - (OD.areasize + 2);

                            var scaleX = 1;
                            var stackscale;
                            if (valueout > 0) {
                                var scaleY = 1;
                                stackscale = -1;
                            }
                            else {
                                var scaleY = 1;
                                valuex *= -1;
                                stackscale = 1;
                            }

                            var pstacktotal = PercentTotal(option, i);
                            var pstack = Percent((valuex / totalValues), pstacktotal);

                            //For Stacked Plot
                            if (stacked && !percentstack) {
                                gs = gtotalmax * gtotalresultmax;
                                for (var g = 1; g < ic; g++) {
                                    valuexAdd = Stack(option, valuex, ic, i, g, percentanimation, gtotalresult, totalValues, HCanvas, false, false, stackscale);
                                    y += (valuexAdd / gs);
                                }

                            }
                            //For Percentage Stack
                            if (percentstack) {
                                for (var g = 1; g < ic; g++) {
                                    valuexAddpercent = PStack(option, i, g, valuex, percentanimation, gtotalresult, totalValues, HCanvas, false, false, stackscale);
                                    y += (valuexAddpercent / ObjectData.length);
                                }
                            }

                            ctx.scale(scaleX, scaleY);
                            x /= scaleX;
                            y /= scaleY;

                            if (valueout > 0) y;
                            if (valueout <= 0) y;

                            if (!percentstack) height = parseFloat((valuex / totalValues) * HCanvas);

                            //For Stacked Bar
                            if (stacked && !percentstack) {
                                height /= gtotalmax;
                            }

                            //For Percentage Stack
                            if (percentstack) {
                                height = (pstack * HCanvas)
                            }

                            if (!reversedata) elementvalue = datainput;
                            else elementvalue = datainput * -1;

                            var valuerev;
                            if (convert) valuerev = convertnum(elementvalue).toString();
                            else valuerev = elementvalue.toString();

                            data[i].text = data[i].text || "";

                            if (plotlabel.custom) plotlabeldisplay = data[i].text;
                            else plotlabeldisplay = OD.prefix + valuerev + OD.suffix;

                            var plotlabeloutput = plotlabeldisplay.toString();

                            if (datainput <= 0)
                                plotlabely = (y + height) - OD.areasize;
                            else
                                plotlabely = (y - height) - OD.areasize;

                            //if (datainput > 0) plotlabelbaseline = "middle";
                            //else plotlabelbaseline = "middle";
                            plotlabelbaseline = "alphabetic";
                            var plotfill = plotlabel.fill || rgba(0, 0, 0, 0);
                            if ((click
                                || plotlabel.display)
                                && percentanimation == 1) {
                                ctx.rectangle(((x + width) - ((ctx.FontWidth(plotlabeloutput, plotlabel) + 5) * 0.5)), parseInt(plotlabely - TextFontHeight(ctx, plotlabel)) + 1, ctx.FontWidth(plotlabeloutput, plotlabel) + 5, TextFontHeight(ctx, plotlabel) + 2, 0, 0, plotfill, "black", [0], nullshadow);
                                ctx.Text(plotlabeloutput, x + width, plotlabely, 0, plotlabel.color, null, 0, "center", plotlabelbaseline, plotlabel);
                            }
                            ctx.restore();
                        }
                    }
                }
            }

            function OHLC(option, chart, YaddB) {
                var data = dataarrayoutput(option);
                var ObjectData = option.ObjectData;
                for (ic = 1; ic <= ObjectData.length; ic++) {
                    var OD = ObjectData[ic - 1];
                    ODlabel = OD[Object.keys(OD)[0]] || "";
                    OD.fillcolor = OD.fillcolor || "black";
                    OD.filltype = OD.filltype || "color";
                    OD.style = OD.style || "2d";
                    for (i = 0; i < data.length; i++) {
                        var datacolor = data[i].fillcolor;
                        if (data[i].fillcolor == undefined || ic > 1) datacolor = OD.fillcolor;
                        if (OD.strokewidth == undefined || OD.strokewidth < 0) OD.strokewidth = 1;
                        var subdata = data[i][Object.keys(data[i])[ic]];
                        //var OHLCarray = [subdata.open, subdata.high, subdata.low, subdata.close];
                        var x;
                        x = Xorigin + 5 + (w * i * ObjectData.length);
                        y = YaddB;
                        var width;
                        width = ((w * 0.9 * ObjectData.length) / 2);//w * 0.9;
                        if (valuex > 0) y += 1;

                        plotx = x + width;

                        //if (OD.areasize <= 2 || OD.areasize == undefined) OD.areasize = 2;

                        var candlefill, candlestroke, upfill, downfill;

                        var openinput, highinput, lowinput, closeinput;
                        /*openinput = NaNCheck(subdata[Object.keys(subdata)[0]]);
                        highinput = NaNCheck(subdata[Object.keys(subdata)[1]]);
                        lowinput = NaNCheck(subdata[Object.keys(subdata)[2]]);
                        closeinput = NaNCheck(subdata[Object.keys(subdata)[3]]);*/
                        openinput = NaNCheck(subdata.open);
                        highinput = NaNCheck(subdata.high);
                        lowinput = NaNCheck(subdata.low);
                        closeinput = NaNCheck(subdata.close);

                        var open, high, low, close;
                        open = parseInt(y + ((openinput / totalValues) * HCanvas * -1));
                        high = parseInt(y + ((highinput / totalValues) * HCanvas * -1));
                        low = parseInt(y + ((lowinput / totalValues) * HCanvas * -1));
                        close = parseInt(y + ((closeinput / totalValues) * HCanvas * -1));

                        //gradient
                        var GradX = parseInt(plotx) - (width / 2);//plotx;// - Areashape;
                        var GradY = open;//liney - Areashape;
                        var GradH = close - open;
                        var GradDX = GradX// - (GradH * 0.5);
                        var GradDY = GradY// - (GradH * 0.5);
                        if (OD.filltype == "gradient") {
                            var gtypeout = OD.gradienttype || "linear a";
                            gtypeout = gtypeout.toLowerCase();
                            var grad = [];
                            for (var k = 0; k < ObjectData[ic - 1].fillcolor.length; k++) {
                                grad.push({
                                    color: OD.fillcolor[k].color
                                    , stop: OD.fillcolor[k].stop
                                });
                            }
                            var Areashape = width * height;
                            switch (gtypeout) {
                                case "linear a": candlefill = ctx.GradientLinear(0, GradY, width, GradH, grad, 0, true, false); break
                                case "linear b": candlefill = ctx.GradientLinear(0, GradY, width, GradH, grad, 0, false, false); break
                                case "linear c": candlefill = ctx.GradientLinear(GradX, 0, width, GradH, grad, 0, true, true); break
                                case "linear d": candlefill = ctx.GradientLinear(GradX, 0, width, GradH, grad, 0, false, true); break
                                case "linear e": candlefill = ctx.GradientLinear(GradDX, GradDY, width, GradH, grad, 0, false, true, true); break
                                case "linear f": candlefill = ctx.GradientLinear(GradDX, GradDY, width, GradH, grad, 0, true, true, true); break
                                case "linear g": candlefill = ctx.GradientLinear(GradDX, GradDY, width, GradH, grad, 0, false, false, true); break
                                case "linear h": candlefill = ctx.GradientLinear(GradDX, GradDY, width, GradH, grad, 0, true, false, true); break
                                    //case "radial": candlefill = ctx.GradientCircle(open, close, width / 5, open, close - 1, width, grad); break
                            }
                        }
                        else if (OD.filltype == "color") {
                            if (OD.style == "2d") {
                                candlefill = datacolor;
                            }
                            else if (OD.style == "3d") {
                                var shine = [];
                                shine.push({ color: datacolor, stop: 0 });
                                shine.push({ color: 'white', stop: 0.25 });
                                shine.push({ color: datacolor, stop: 0.5 });
                                //candlefill = GradientH(open, width, close, shine, ctx, false);
                                candlefill = ctx.GradientLinear(GradX, 0, width, GradH, shine, 0, false, true);
                            }
                        }

                        candlewidth = OD.strokewidth;
                        candlestroke = OD.strokecolor || datacolor;

                        if (data.length > 50) break;
                        if (openinput < closeinput && OD.marker == "candlestick") candlefill = "white";
                        //else candlefill = OD.fillcolor;
                        ctx.globalAlpha = percentanimation;
                        switch (OD.marker) {
                            case "candlestick":
                                ctx.candlestick(plotx, open, high, low, close, width, candlefill, candlestroke, candlewidth, shadow); break
                            case "OHLC":
                                ctx.OHLCsign(plotx, open, high, low, close, width, candlefill, 2, shadow); break
                        }
                    }
                    for (j = 0; j < OHLC.length; j++) {
                        duration.metric = duration.metric || false;

                        for (i = 0; i < data.length; i++) {
                            var datacolor = data[i].fillcolor;
                            if (data[i].fillcolor == undefined || ic > 1) datacolor = OD.fillcolor;
                            var subdata = data[i][Object.keys(data[i])[ic]];//data[i].value[ic - 1];
                            valuex = -1 * parseFloat(subdata[Object.keys(subdata)[j]]);
                            var x;
                            x = Xorigin + 5 + (w * i * ObjectData.length);
                            y = YaddB;
                            var width;
                            width = ((w * 0.9 * ObjectData.length) / 2);//w * 0.9;
                            height = parseInt((valuex / totalValues) * HCanvas);

                            if (valuex > 0) y += 1;

                            plotx = x + width;

                            //gradient
                            if (OD.filltype == "gradient") {
                                gtypeout = OD.gradienttype || "linear a";
                                var grad = [];
                                var elementgrad = [];
                                for (var k = 0; k < ObjectData[ic - 1].fillcolor.length; k++) {
                                    grad.push({
                                        color: OD.fillcolor[k].color
                                        , stop: OD.fillcolor[k].stop
                                    });
                                    elementgrad.push(OD.fillcolor[k].color);
                                }
                                elementfill = elementgrad;
                            }
                            else if (OD.filltype == "color") {
                                elementfill = datacolor;
                            }

                            if (data.length > 50) break;
                            //else candlefill = OD.fillcolor;
                            elementlabel = LabelOutput(option, i, true, chart);

                            elementwidth = width;
                            elementheight = width * (data.length / 2);
                        }
                    }
                }
            }
            if (type != "bubble" && type != "OHLC"){
                ctx.canvaslabel(option, chart, precision, click);
                ctx.labelHFS(option, chart);
                ctx.legend(option, chart);
            }

            //Hover Element
            if (type == "barline" || type == "scatter") {
                if (type == "scatter") {
                    BarLine(option, chart, "scatter", YaddB, percentanimation);
                }
                else {
                    //Bar
                    BarLine(option, chart, "bar", YaddB, percentanimation);

                    //Line
                    BarLine(option, chart, "line", YaddB, percentanimation);
                }
            }
            else if (type == "bubble") {
                Bubble(option, chart, YaddB);
            }
            else if (type == "OHLC") {
                OHLC(option, chart, YaddB);
            }
            var xaddW = 0;
            for (ic = 1; ic <= ObjectData.length; ic++) {
                var OD = ObjectData[ic - 1];
                OD.fillcolor = OD.fillcolor || "black";
                OD.strokecolor = OD.strokecolor || "black";
                OD.filltype = OD.filltype || "color";
                OD.style = OD.style || "2d";
                OD.group = OD.group || { ID: 1, text: "Group 1" };
                if (OD.group.ID == undefined || OD.group.ID < 1) OD.group.ID = 1;
                OD.charttype = OD.charttype || "bar";
                if (enable3d) OD.charttype = "bar";
                //bars
                var elementX, elementY, elementwidth;
                for (i = 0; i < data.length; i++) {

                    //color
                    var elementfill, elementgradient;
                    var datacolor;
                    datacolor = data[i].fillcolor || OD.fillcolor;

                    //X, Y, Width, Height
                    //x = Xorigin + (w * i * (ObjectData.length)); //parseInt(BarX(option, i, w, Xorigin, gtotalresultmax) + xaddW);

                    y = vmovey//YaddB;

                    //width = BarLength(option, w);
                    //if (totalline >= 1) width *= ((totalline / totalbar) + totalline);

                    //if (!percentstack)
                    height = HCanvas //parseInt((valuex / totalValues) * HCanvas) * 1;

                    var pstacktotal = PercentTotal(option, i);
                    //var pstack = Percent((valuex / totalValues), pstacktotal);

                    //For Stacked Bar
                    //if (stacked && !percentstack) {
                    //    var gs = gtotalmax * gtotalresultmax;
                    //    width *= totalbar;
                    //    width /= gtotalresultmax;
                    //    height /= gtotalmax;

                    //    x += (width * (OD.group.ID - 1));
                    //    for (var g = 1; g < ic; g++) {
                    //        valuexAdd = Stack(option, valuex, ic, i, g, 1, gtotalresult, totalValues, HCanvas, false, true);
                    //        y += (valuexAdd / gs);
                    //    }
                    //}

                    //For Percentage Stack
                    //if (percentstack) {
                    //    //height = (pstack * HCanvas) * 1;
                    //    width *= totalbar;
                    //    for (var g = 1; g < ic; g++) {
                    //        valuexAddpercent = PStack(option, i, g, valuex, 1, gtotalresult, totalValues, HCanvas, false, true);
                    //        y += (valuexAddpercent / ObjectData.length);
                    //    }
                    //}

                    //if (valuex <= 0) y;
                    //if (valuex > 0) y += 1;

                    //gradient

                    if (OD.filltype == "gradient") {
                        var grad = [];
                        var elementgrad = [];
                        for (var j = 0; j < OD.fillcolor.length; j++) {
                            grad.push({
                                color: OD.fillcolor[j].color
                                , stop: OD.fillcolor[j].stop
                            });
                            elementgrad.push(OD.fillcolor[j].color);
                        }
                        elementfill = elementgrad;
                    }
                    else if (OD.filltype == "color") {
                        elementfill = datacolor;
                    }
                    //console.log(elementfill)
                    elementlabel = LabelOutput(option, i, true, chart);

                    if (gtotalresultmax > 1) elementgroup = " (" + OD.group.text + ")";
                    else elementgroup = "";

                    var xtest = (widthtotal + 8) / data.length;

                    elementY = y;
                    elementheight = height;

                    var areasizearray = [];
                    for (var j = 0; j < ObjectData.length; j++) {
                        areasizearray.push(ObjectData[j].areasize || 1);
                    }
                    var maxareasize = MaxArray(areasizearray) * 2;

                    if (type == "scatter") {

                        elementX = (xnumbase) + (xtest * i);
                        elementwidth = xtest;
                    }
                    else if (type == "bubble") {
                        var circleradius = round(conh * 0.092);
                        elementX = xnumbase + ((xtest) * i); //(xnumbase + circleradius) + (xtest * i);
                        elementwidth = xtest; //circleradius * 2;
                    }
                    else if (type == "OHLC") {
                        elementX = xnumbase + ((xtest) * i);
                        elementwidth = (xtest);
                    }
                    else {
                        if (totalbar >= 1) {
                            elementX = xnumbase + (xtest * i);
                            elementwidth = (xtest);
                        }
                        else {
                            if (i == 1) {
                                elementX = xnumbase + (xtest - (maxareasize / 2));
                            }
                            else {
                                elementX = xnumbase + (NaNCheck(widthtotal / (data.length - 1)) * i);
                            }
                            elementwidth = maxareasize;
                        }
                    }

                    var valuelist = [];
                    var ODlist = [];
                    var percentlist = [];
                    var filltypelist = [];
                    var filllist = [];
                    var strokelist = [];
                    var gradtypelist = [];
                    var grouplist = [];
                    var patternlist = [];
                    var openlist = [],
                        highlist = [],
                        lowlist = [],
                        closelist = [];
                    var averagelist = [];
                    var strokeWarray = [];
                    var percentarray, filllistresult;
                    //var shapelist = [];
                    for (var j = 1; j <= ObjectData.length; j++) {
                        var ODE = ObjectData[j - 1];
                        ODE.area = ODE.area || false;

                        var bubblelabel = option.bubblelabel || "";
                        var Esubdata = data[i][Object.keys(data[i])[j]];
                        if (type == "bubble") {
                            var valuearray = NaNCheck(Esubdata[Object.keys(Esubdata)[0]]);
                            var averagearray = NaNCheck(Esubdata[Object.keys(Esubdata)[1]]);
                            if (averagearray < 0) averagearray = 0;
                        }
                        else if (type == "OHLC") {
                            var OLArray = Esubdata.open;//NaNCheck(Esubdata[Object.keys(Esubdata)[0]]);
                            var HLArray = Esubdata.high;//NaNCheck(Esubdata[Object.keys(Esubdata)[1]]);
                            var LLArray = Esubdata.low;//NaNCheck(Esubdata[Object.keys(Esubdata)[2]]);
                            var CLArray = Esubdata.close;//NaNCheck(Esubdata[Object.keys(Esubdata)[3]]);

                            openlist.push(OLArray);
                            highlist.push(HLArray);
                            lowlist.push(LLArray);
                            closelist.push(CLArray);
                            averagearray = 0;
                        }
                        else {
                            if (!reversedata)
                                valuearray = DataInput(data, i, j);
                            else
                                valuearray = -1 * DataInput(data, i, j);

                            averagearray = 0;
                        }

                        if (percentstack) percentarray = " (" + round(Percent(parseInt(valuearray), pstacktotal)) + "%)";
                        else percentarray = "";

                        var shapeout;
                        if (ODE.area) {
                            if (!reversedata)
                                valuearray = DataInput(data, i, j);
                            else
                                valuearray = (-1 * (DataInput(data, i, j)));

                            if (ODE.areafilltype == "color") {
                                var datacolorlist;
                                datacolorlist = data[i].fillcolor || ODE.areafill;
                                filllistresult = datacolorlist;
                            }
                            else if (ODE.areafilltype == "gradient") {
                                ODE.gradienttype = ODE.gradienttype || "linear a";
                                var elementgrad = [];
                                for (var k = 0; k < ODE.areafill.length; k++) {
                                    elementgrad.push({ color: ODE.areafill[k].color, stop: ODE.areafill[k].stop });
                                }
                                filllistresult = elementgrad;
                                gradtypelist.push(ODE.gradienttype);
                            }

                            //shapelist.push(shapeout);

                            patternlist.push("square");
                            filllist.push(filllistresult);
                            strokelist.push(rgba(0, 0, 0, 0));
                            strokeWarray.push(ODE.linewidth);
                            percentlist.push(percentarray);
                            filltypelist.push(ODE.areafilltype);
                            valuelist.push(valuearray);
                            if (ObjectData.length > 1) ODlist.push(ODE[Object.keys(ODE)[0]]);
                            else ODlist.push(elementlabel);
                        }
                        else {
                            //ODE.gradienttype = ODE.gradienttype.toString().toLowerCase() || "linear a"
                            if (type == "OHLC"
                                && OLArray < CLArray) {
                                ODE.filltype == "color";
                            }

                            if (ODE.filltype == "color") {
                                var datacolorlist;
                                /*if (data[i].fillcolor == undefined) datacolorlist = ODE.fillcolor;
                                else datacolorlist = data[i].fillcolor;*/
                                if (type == "bubble") {

                                }
                                else {

                                }
                                datacolorlist = data[i].fillcolor || ODE.fillcolor;
                                filllistresult = datacolorlist;
                            }
                            else if (ODE.filltype == "gradient") {
                                //ODE.gradienttype = ODE.gradienttype || "linear a";
                                var elementgrad = [];
                                for (var k = 0; k < ODE.fillcolor.length; k++) {
                                    elementgrad.push({
                                        color: ODE.fillcolor[k].color
                                        , stop: ODE.fillcolor[k].stop
                                    });
                                }
                                filllistresult = elementgrad;
                                gradtypelist.push(ODE.gradienttype.toString().toLowerCase());
                                //console.log(gradtypelist)
                            }
                            if (type == "scatter"
                                || type == "bubble") {
                                shapeout = data[i].marker || ODE.marker;
                            }
                            else if (type == "OHLC") {
                                shapeout = "square";
                            }
                            else {
                                if (ODE.charttype == "bar") {
                                    shapeout = "square";
                                }
                                else {
                                    shapeout = data[i].marker || ODE.marker;
                                }
                            }
                            var strokelistresult = ODE.strokecolor || "black";
                            //if (type == "OHLC"
                            //    && OLArray < CLArray) {
                            //    ODE.filltype = "color";
                            //    filllistresult = "white";
                            //}

                            patternlist.push(shapeout);
                            filllist.push(filllistresult);
                            strokelist.push(strokelistresult);
                            percentlist.push(percentarray);
                            filltypelist.push(ODE.filltype);
                            valuelist.push(valuearray);
                            averagelist.push(averagearray);
                            strokeWarray.push(data[i].strokewidth || ODE.strokewidth);
                            if (ObjectData.length > 1) ODlist.push(ODE[Object.keys(ODE)[0]]);
                            else ODlist.push(elementlabel);

                            if (gtotalresultmax > 1) grouplist.push(ODE.group.text);
                            else grouplist.push("");
                        }
                    }
                    /*if (percentanimation == 1
                        && i == 2
                        && ic == 1) console.log(element);*/
                    element = {
                        x: elementX
                        , y: elementY
                        , width: elementwidth
                        , height: elementheight
                        //, text: elementtext
                        , label: elementlabel
                        , prefix: format.prefix
                        , suffix: format.suffix
                        //, filltype: OD.filltype
                        , ODlist: ODlist
                        , openlist: openlist
                        , highlist: highlist
                        , lowlist: lowlist
                        , closelist: closelist
                        , valuearray: valuelist
                        , averagelist: averagelist
                        , textaverage: bubblelabel
                        , percentlist: percentlist
                        , filltypelist: filltypelist
                        , filllist: filllist
                        , strokelist: strokelist
                        , gradtypelist: gradtypelist
                        , grouplist: grouplist
                        , pattern: patternlist
                        , linewidth: strokeWarray
                    };

                    if (percentanimation == 1) elementlist.push(element);
                }
            } //end ObjectData loop
            ctx.restore();
            if (type == "bubble" || type == "OHLC"){
                ctx.canvaslabel(option, chart, precision, click);
                ctx.labelHFS(option, chart);
                ctx.legend(option, chart);
            }
            //end else
            hoverout(option, elementlist, percentanimation, chart)

        } //end function animateChart
    }

    //draw hover
    //if ((option.iscreated == false || option.iscreated == undefined) /*&& percentanimation == 1*/) {
    //    option.iscreated = true;
    //    if (option.hover) mouseevent(ctx, option, elementlist, chart);
    //}
    function hoverout(option, elementlist, percentanimation, chart) {
        if ((option.iscreated == false || option.iscreated == undefined) && percentanimation == 1) {
            option.iscreated = true;
            if (option.hover) mouseevent(ctx, option, elementlist, chart);
        }
    }
}
//end chart

P8.TrendChart = function (canvasID) {
    var size = {
        width: 200
        , height: 200
    }

    var data = 0;
    var total = 100;

    var background = rgba(0, 0, 0, 0);

    var input = {
        low: {
            fillcolor: "red"
            , filltype: "color"
        }
        , mid: {
            fillcolor: "yellow"
            , filltype: "color"
        }
        , high: {
            fillcolor: "green"
            , filltype: "color"
        }
    }

    var marker = {
        fillcolor: "black"
        , strokecolor: "white"
        //, filltype: "color"
        , linewidth: 1
    };

    var label = {
        text: "Test Label"
        , color: "Black"
        , fontFamily: "Arial"
        , fontSize: 12
        , fontWeight: "Bold"
        , fontStyle: "Normal"
        , display: true
    }

    var percentfont = {
        color: "Black"
        , fontFamily: "Arial"
        , fontSize: 12
        , fontWeight: "Bold"
        , fontStyle: "Normal"
        , display: true
    }

    var option = {
        canvasID: canvasID
        , background: background
        , size: size
        , data: data
        , total: total
        , marker: marker
        , input: input
        , label: label
        , percentfont: percentfont
    }

    this.option = option;
}

P8.TrendChart.prototype.SetOption = function (option) {
    this.option = option;
};
P8.TrendChart.prototype.SetSize = function (size) {
    this.option.size = size;
};
P8.TrendChart.prototype.SetBackground = function (background) {
    this.option.background = background;
};
P8.TrendChart.prototype.SetMarker = function (marker) {
    this.option.marker = marker;
};
P8.TrendChart.prototype.SetInput = function (marker) {
    this.option.input = input;
};
P8.TrendChart.prototype.SetData = function (data) {
    this.option.data = data;
};
P8.TrendChart.prototype.SetPercentFont = function (percentfont) {
    this.option.percentfont = percentfont;
};
P8.TrendChart.prototype.SetTotal = function (total) {
    this.option.total = total;
};
P8.TrendChart.prototype.SetLabel = function (label) {
    this.option.label = label;
};
P8.TrendChart.prototype.Render = function () {
    CreateTrendChart(this.option);
};


function CreateTrendChart(option) {
    var canvasIDcon = option.canvasID,
        iscanvas = option.iscanvas,
        canvasID = (iscanvas) ? option.cID : canvasIDcon + "_canvas";
    var conw = option.size.width;//660 default number
    var conh = option.size.height;//400 default number
    var background = option.background;

    var elementcanvas = ElementID(canvasID);

    if (elementcanvas == undefined) {
        var element = ElementID(canvasIDcon);

        var para = document.createElement("div");
        para.id = canvasIDcon;
        element.appendChild(para);

        var parab = document.createElement("canvas");
        parab.id = canvasID;
        parab.width = conw;
        parab.height = conh;
        element.appendChild(parab);
    }

    var data = option.data;
    var total = option.total;
    var label = option.label;
    var percentfont = option.percentfont;

    var ctx = Canvas(canvasID);

    var dataresult = data + total;
    var fillresult;
    var input = option.input;
    var marker = option.marker;

    marker.filltype = marker.filltype || "color";

    label.display = label.display || false;
    percentfont.display = percentfont.display || false;

    var output, percenttext;
    var percentresult = Percent(data, total).toFixed(2) + "%";

    if (dataresult < total) {
        output = input.low;
        percenttext = percentresult;
    }
    else if (dataresult == total) {
        output = input.mid;
        percenttext = "±" + percentresult;
    }
    else if (dataresult > total) {
        output = input.high;
        percenttext = "+" + percentresult;
    }

    output.filltype = output.filltype || "color";
    percentfont.text = percenttext;

    var top, bottom;

    var canvastop, canvasbottom;
    if (label.display)
        canvastop = ctx.wrapTextHeight(label.text, 10, conw, TextFontHeight(ctx, label), false);
    else
        canvastop = 10;

    if (percentfont.display)
        canvasbottom = ctx.wrapTextHeight(percentfont.text, 10, conw, TextFontHeight(ctx, percentfont), false);
    else
        canvasbottom = 10;
    top = canvastop;
    bottom = canvasbottom; //320

    var centerX = conw * 0.5;
    var centerY = conh * 0.5;
    var area = parseInt((centerY) - (top + bottom));

    var markerX = centerX;
    var markerY = centerY;

    if (output.filltype == "color")
        fillresult = output.fillcolor;
    else if (output.filltype == "gradient")
        fillresult = ctx.GradientMarker(output.fillcolor, output.gradienttype, markerX, markerY, area);
    ctx.circle(markerX, markerY, area + (area * 0.05), (area * 0.05), rgba(0, 0, 0, 0), fillresult, nullshadow);
    ctx.circle(markerX, markerY, area, 0, fillresult, rgba(0, 0, 0, 0), nullshadow);

    var direction, markerfill;
    markerfill = marker.fillcolor;
    
    if (dataresult < total || dataresult > total) {
        if (dataresult < total) {
            direction = "down";
        }
        else if (dataresult > total) {
            direction = "up";
        }
        ctx.drawArrowB(markerX, markerY, 0, direction, area * 0.5, marker.linewidth, markerfill, marker.strokecolor, canvasIDcon, nullshadow);
    }
    else if (dataresult == total)
        ctx.rectangle(markerX - (area * 0.75), markerY - (area * 0.175), area * 1.5, area * 0.5, 0, marker.linewidth, markerfill, marker.strokecolor, [0], nullshadow);
    if (label.display) ctx.TextWrap(label.text, centerX, 10, 0, 0, label.color, null, "center", "hanging", label, conw, 10, false, false);
    if (percentfont.display) ctx.TextWrap(percentfont.text, centerX, conh - 10, 0, 0, percentfont.color, null, "center", "alphabetic", percentfont, conw, 10, false, false);

}


//arc
function Arc(x, y, r, start, end, width, strokecolor, ctx) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.arc(x, y, r, start, end, false);
    ctx.strokeStyle = strokecolor;
    ctx.stroke();
}

//convert

function convert(value) {
    var zero = /.0/g;
    var T = (value / 1E12).toFixed(1) + "T";
    if (T.match(zero)) T = parseInt(value / 1E12) + "T";
    var B = (value / 1E9).toFixed(1) + "B";
    if (B.match(zero)) B = parseInt(value / 1E9) + "B";
    var M = (value / 1E6).toFixed(1) + "M";
    if (M.match(zero)) M = parseInt(value / 1E6) + "M";
    var k = (value / 1E3).toFixed(1) + "k";
    if (k.match(zero)) k = parseInt(value / 1E3) + "k";
    var v = (value).toFixed(1);
    if (v.match(zero)) v = parseInt(value);
    return value = (value >= 1E12) ? T
        : (value >= 1E9) ? B
        : (value >= 1E6) ? M
        : (value >= 1E3) ? k
        : v; //if (value < 1E3)
}

function defaultgaugeinput(canvasID, gauge){

    var size = {
        width: 400
        , height: 400
    }

    //Header Option
    var optionH = {
        text: "Sample Header"
        , color: "Black"
        , fontFamily: "Arial"
        , fontSize: 12
        , fontWeight: "Bold"
        , fontStyle: "Normal"
        , display: false
    };

    //Sub Header Option
    var optionSH = {
        text: "Sample Sub Header"
        , color: "Black"
        , fontFamily: "Arial"
        , fontSize: 12
        , fontWeight: "Normal"
        , fontStyle: "Italic"
        , display: false
    };

    //Footer Option
    var optionF = {
        text: "Sample Footer"
        , color: "Black"
        , fontFamily: "Arial"
        , fontSize: 12
        , fontWeight: "Bold"
        , fontStyle: "Normal"
        , display: false
    };

    var NumLabelFont = {
        color: "black"
        , fontFamily: "Gill Sans MT"
        , fontSize: 12
        , fontWeight: "Bold"
        , fontStyle: "Normal"
        , display: true
    };

    var InputFont = {
        color1: "white"
        , color2: "black"
        , color3: "black"
        , fontFamily: "Arial"
        , fontSize: 16
        , fontWeight: "Bold"
        , fontStyle: "Normal"
        , display: true
    };

    var percentdisplay, ratedisplay;
    var prefix;

    var count = 10;

    var itotal, numinput;

    if (gauge == "arc" || gauge == "circle") {
        itotal = 120;
        numinput = 120;
        percentdisplay = true, ratedisplay = true;
        prefix = "Php.";
    }
    else {
        itotal = 100;
        numinput = 100;
        percentdisplay = false, ratedisplay = false;
        prefix = "";
    }

    var PercentageFont = {
        color1: "white"
        , color2: "black"
        , color3: "black"
        , fontFamily: "Arial"
        , fontSize: 14
        , fontWeight: "Bold"
        , fontStyle: "Normal"
        , display: percentdisplay
    };

    var RateFont = {
        color1: "white"
        , color2: "black"
        , color3: "black"
        , fontFamily: "Arial"
        , fontSize: 12
        , fontWeight: "Bold"
        , fontStyle: "Normal"
        , display: ratedisplay
    };

    var gradientarc = {
        color1: "red"
        , color2: "yellow"
        , color3: "green"
    };

    var gradborder = [];
    gradborder.push({ color: "silver", stop: 0 });
    gradborder.push({ color: "white", stop: 0.5 });
    gradborder.push({ color: "silver", stop: 1 });

    var stroke = {
        filltype: "gradient"//"color"
        , fill: gradborder//"gray"
        , gradienttype: "linear a"
    }

    var innercolor = {
        filltype: "color"
        , fill: "white"
    }

    var needledlebase = {
        fill: "white"
        , stroke: "black"
        , filltype: "color"
    }

    var needle = {
        fill: "gray"
        , stroke: "black"
        , filltype: "color"
    }

    var fill = {
        border: stroke
        , innercolor: innercolor
        , needle: needle
        , needlebase: needledlebase
    };

    var hash = {
        small: 2
        , large: 4
        , extralarge: 5
        , innerarc: 5
        , fill: "black"
    };

    var rate = {
        a: "BAD",
        b: "AVERAGE",
        c: "GOOD"
    };

    var arcwidth = 50;

    var background = "rgba(0,0,0,0)";

    var border = {
        style: "solid"
        , fill: "black"
        , width: 0
    }

    var filldata = {
        fill: "green"
        , filltype: "color"
    }

    var emptydata = {
        fill: null
        , filltype: "color"
    }

    var percentlow = 15;
    var percentmid = 50;

    var radius = 0

    var animation = true;

    var kmflag = false;

    option = {
        canvasID: canvasID
        , header: optionH
        , subheader: optionSH
        , footer: optionF
        , xcount: count
        , itotal: itotal
        , numinput: numinput
        , percentlow: percentlow
        , percentmid: percentmid
        , prefix: prefix
        , NLFont: NumLabelFont
        , IFont: InputFont
        , PFont: PercentageFont
        , RFont: RateFont
        , gradientarc: gradientarc
        , animation: animation
        , fill: fill
        , filldata: filldata
        , emptydata: emptydata
        , background: background
        , border: border
        , arcwidth: arcwidth
        , rate: rate
        , hash: hash
        , radius: radius
        , size: size
        , kmflag: kmflag
    };
    return option
}

P8.Gauge = function (canvasID) {
    this.option = defaultgaugeinput(canvasID, "gauge");
};
P8.Gauge.prototype.SetOption = function (option) {
    this.option = option;
};
P8.Gauge.prototype.SetCount = function (xcount) {
    this.option.xcount = xcount;
};
P8.Gauge.prototype.SetHeader = function (header) {
    this.option.header = header;
};
P8.Gauge.prototype.SetSubHeader = function (subheader) {
    this.option.subheader = subheader;
};
P8.Gauge.prototype.SetFooter = function (footer) {
    this.option.footer = footer;
};
P8.Gauge.prototype.SetInitialTotal = function (itotal) {
    this.option.itotal = itotal;
};
P8.Gauge.prototype.SetNumInput = function (numinput) {
    this.option.numinput = numinput;
};
P8.Gauge.prototype.SetPercentLow = function (percentlow) {
    this.option.percentlow = percentlow;
};
P8.Gauge.prototype.SetPercentMid = function (percentmid) {
    this.option.percentmid = percentmid;
};
P8.Gauge.prototype.SetPrefix = function (prefix) {
    this.option.prefix = prefix;
};
P8.Gauge.prototype.SetNumLabelFont = function (NLFont) {
    this.option.NLFont = NLFont;
};
P8.Gauge.prototype.SetInputFont = function (IFont) {
    this.option.IFont = IFont;
};
P8.Gauge.prototype.SetPercentageFont = function (PFont) {
    this.option.PFont = PFont;
};
P8.Gauge.prototype.SetRateFont = function (RFont) {
    this.option.RFont = RFont;
};
P8.Gauge.prototype.SetRate = function (rate) {
    this.option.rate = rate;
};
P8.Gauge.prototype.SetAnimate = function (animation) {
    this.option.animation = animation;
};
P8.Gauge.prototype.SetGradientColor = function (gradientarc) {
    this.option.gradientarc = gradientarc;
};
P8.Gauge.prototype.SetFill = function (fill) {
    this.option.fill = fill;
};
P8.Gauge.prototype.SetHash = function (hash) {
    this.option.hash = hash;
};
P8.Gauge.prototype.SetBackground = function (background) {
    this.option.background = background;
};
P8.Gauge.prototype.SetBorder = function (border) {
    this.option.border = border;
};
P8.Gauge.prototype.SetSize = function (size) {
    this.option.size = size;
};
P8.Gauge.prototype.SetRadius = function (radius) {
    this.option.radius = radius;
};
P8.Gauge.prototype.Render = function () {
    Gauge(this.option, "gauge");
};

P8.ArcGauge = function (canvasID) {
    this.option = defaultgaugeinput(canvasID, "arc");
};
P8.ArcGauge.prototype.SetOption = function (option) {
    this.option = option;
};
P8.ArcGauge.prototype.SetCount = function (xcount) {
    this.option.xcount = xcount;
};
P8.ArcGauge.prototype.SetHeader = function (header) {
    this.option.header = header;
};
P8.ArcGauge.prototype.SetSubHeader = function (subheader) {
    this.option.subheader = subheader;
};
P8.ArcGauge.prototype.SetFooter = function (footer) {
    this.option.footer = footer;
};
P8.ArcGauge.prototype.SetInitialTotal = function (itotal) {
    this.option.itotal = itotal;
};
P8.ArcGauge.prototype.SetNumInput = function (numinput) {
    this.option.numinput = numinput;
};
P8.ArcGauge.prototype.SetPercentLow = function (percentlow) {
    this.option.percentlow = percentlow;
};
P8.ArcGauge.prototype.SetPercentMid = function (percentmid) {
    this.option.percentmid = percentmid;
};
P8.ArcGauge.prototype.SetPrefix = function (prefix) {
    this.option.prefix = prefix;
};
P8.ArcGauge.prototype.SetNumLabelFont = function (NLFont) {
    this.option.NLFont = NLFont;
};
P8.ArcGauge.prototype.SetInputFont = function (IFont) {
    this.option.IFont = IFont;
};
P8.ArcGauge.prototype.SetPercentageFont = function (PFont) {
    this.option.PFont = PFont;
};
P8.ArcGauge.prototype.SetRateFont = function (RFont) {
    this.option.RFont = RFont;
};
P8.ArcGauge.prototype.SetRate = function (rate) {
    this.option.rate = rate;
};
P8.ArcGauge.prototype.SetAnimate = function (animation) {
    this.option.animation = animation;
};
P8.ArcGauge.prototype.SetGradientColor = function (gradientarc) {
    this.option.gradientarc = gradientarc;
};
P8.ArcGauge.prototype.SetFill = function (fill) {
    this.option.fill = fill;
};
P8.ArcGauge.prototype.SetFillData = function (filldata) {
    this.option.filldata = filldata;
};
P8.ArcGauge.prototype.SetEmptyData = function (emptydata) {
    this.option.emptydata = emptydata;
};
P8.ArcGauge.prototype.SetArcWidth = function (arcwidth) {
    this.option.arcwidth = arcwidth;
};
P8.ArcGauge.prototype.SetBackground = function (background) {
    this.option.background = background;
};
P8.ArcGauge.prototype.SetBorder = function (border) {
    this.option.border = border;
};
P8.ArcGauge.prototype.SetSize = function (size) {
    this.option.size = size;
};
P8.ArcGauge.prototype.SetRadius = function (radius) {
    this.option.radius = radius;
};
P8.ArcGauge.prototype.SetKMFlag = function (kmflag) {
    this.option.kmflag = kmflag;
};
P8.ArcGauge.prototype.Render = function () {
    Gauge(this.option, "arc");
};

P8.CircularGauge = function (canvasID) {
    this.option = defaultgaugeinput(canvasID, "circle");
    //this.option = option;
};
P8.CircularGauge.prototype.SetOption = function (option) {
    this.option = option;
};
P8.CircularGauge.prototype.SetCount = function (xcount) {
    this.option.xcount = xcount;
};
P8.CircularGauge.prototype.SetHeader = function (header) {
    this.option.header = header;
};
P8.CircularGauge.prototype.SetSubHeader = function (subheader) {
    this.option.subheader = subheader;
};
P8.CircularGauge.prototype.SetFooter = function (footer) {
    this.option.footer = footer;
};
P8.CircularGauge.prototype.SetInitialTotal = function (itotal) {
    this.option.itotal = itotal;
};
P8.CircularGauge.prototype.SetNumInput = function (numinput) {
    this.option.numinput = numinput;
};
P8.CircularGauge.prototype.SetPercentLow = function (percentlow) {
    this.option.percentlow = percentlow;
};
P8.CircularGauge.prototype.SetPercentMid = function (percentmid) {
    this.option.percentmid = percentmid;
};
P8.CircularGauge.prototype.SetPrefix = function (prefix) {
    this.option.prefix = prefix;
};
P8.CircularGauge.prototype.SetNumLabelFont = function (NLFont) {
    this.option.NLFont = NLFont;
};
P8.CircularGauge.prototype.SetInputFont = function (IFont) {
    this.option.IFont = IFont;
};
P8.CircularGauge.prototype.SetPercentageFont = function (PFont) {
    this.option.PFont = PFont;
};
P8.CircularGauge.prototype.SetRateFont = function (RFont) {
    this.option.RFont = RFont;
};
P8.CircularGauge.prototype.SetRate = function (rate) {
    this.option.rate = rate;
};
P8.CircularGauge.prototype.SetAnimate = function (animation) {
    this.option.animation = animation;
};
P8.CircularGauge.prototype.SetGradientColor = function (gradientarc) {
    this.option.gradientarc = gradientarc;
};
P8.CircularGauge.prototype.SetFill = function (fill) {
    this.option.fill = fill;
};
P8.CircularGauge.prototype.SetFillData = function (filldata) {
    this.option.filldata = filldata;
};
P8.CircularGauge.prototype.SetEmptyData = function (emptydata) {
    this.option.emptydata = emptydata;
};
P8.CircularGauge.prototype.SetArcWidth = function (arcwidth) {
    this.option.arcwidth = arcwidth;
};
P8.CircularGauge.prototype.SetBackground = function (background) {
    this.option.background = background;
};
P8.CircularGauge.prototype.SetBorder = function (border) {
    this.option.border = border;
};
P8.CircularGauge.prototype.SetSize = function (size) {
    this.option.size = size;
};
P8.CircularGauge.prototype.SetRadius = function (radius) {
    this.option.radius = radius;
};
P8.CircularGauge.prototype.SetKMFlag = function (kmflag) {
    this.option.kmflag = kmflag;
};
P8.CircularGauge.prototype.Render = function () {
    Gauge(this.option, "circle");
};

//start of canvas
function Gauge(option, type) {
    var canvasIDcon = option.canvasID,
        iscanvas = option.iscanvas,
        canvasID = (iscanvas) ? option.cID : canvasIDcon + "_canvas";
    var elementcanvas = ElementID(canvasID);

    if (elementcanvas == undefined) {
        Para(option);
    }

    var itotal = option.itotal,
        xcount = option.xcount || 10,
        numinput = option.numinput,
        percentlow = option.percentlow,
        percentmid = option.percentmid,
        prefix = option.prefix,
        subNL = option.NLFont,
        subP = option.PFont,
        subR = option.RFont,
        subI = option.IFont,
        subfill = option.fill,
        subhash = option.hash,
        radius = option.radius,
        rate = option.rate,
        animation = option.animation || false,
        filldata = option.filldata,
        emptydata = option.emptydata,
        arcwidth = option.arcwidth,
        kmflag = option.kmflag || false;

    //colors
    var needlecolor = subfill.needle;

    var ctx = Canvas(canvasID);
    var conw = option.size.width; //400 default number
    var conh = option.size.height; //400 default number
    var optionH = option.header;
    var optionSH = option.subheader;
    var optionF = option.footer;

    var Hadd = (optionH.display) ? ctx.wrapTextHeight(optionH[Object.keys(optionH)[0]], 14, conw, ctx.FontHeight(optionH.fontSize, optionH.fontweight, optionH.fontFamily, optionH.fontStyle), false) : 7,
        SHadd = (optionSH.display) ? ctx.wrapTextHeight(optionSH[Object.keys(optionSH)[0]], Hadd, conw, ctx.FontHeight(optionSH.fontSize, optionSH.fontweight, optionSH.fontFamily, optionSH.fontStyle), false) : 7;

    var centerX = conw / 2;
    var centerY = conh / 2;
    var center = centerX + centerY;
    var fontBase = center;

    var total = itotal || 100;
    var measurement = 0.5 / (xcount * 10);
    var numresult = parseFloat(numinput / (total * measurement));
    var xmax = numresult;
    var counter = 0;
    var needle = 0;
    var numlabel = total / xcount; // total / count;

    var largeHCount, xlargeSpliceA, xlargeSpliceB, largeSpliceA, largeSpliceB, labelCount, smallSpliceA, smallSpliceB, labelNsplice;
    labelCount = round(xcount + (xcount * 0.35));
    var needleCount = (round(xcount + (xcount * 0.35)) * 10) * 2;
    var labelMeasure = labelCount * 10;
    var needlepoint, labelpoint, startarc, endarc;

    var Rout;
    if (conw >= conh)
        Rout = conh;
    else
        Rout = conw;
    var mainradius = (Rout - 25) - (Hadd + SHadd);

    var start, end;

    if (xcount == 10) {
        start = 141;
    }
    else if (xcount == 12) {
        start = 135;
    }
    end = (180 - start) + 360;

    var outerRadius = parseInt(mainradius * 0.47); //188 default

    var xlargeRadius = parseInt(outerRadius * 0.77),
        largeHRadius = parseInt(outerRadius * 0.71),
        smallHRadius = largeHRadius,
        labelRadius = Math.ceil(outerRadius * 0.65) - (radius / 2); 

    if (percentlow < 0) percentlow = 0;
    if (percentlow > percentmid) percentlow = percentmid;
    if (percentmid > 100) percentmid = 100;

    var suboptgarc = option.gradientarc;

    var arcradius;
    if (conh >= conw) {
        arcradius = conw
    }
    else {
        arcradius = conh
    }
    var linewidth = arcwidth//mid.r / 1.5;
    var mid = {};
    mid.x = conw / 2;
    mid.r = parseInt((arcradius) * 0.4);

    switch (type) {
        case "arc":
            mid.y = conh * 0.75;
            break
        default:
            mid.y = conh * 0.5;
            break
    }

    function canvasbackground() {
        //arc background
        ctx.clear(conw, conh);
        var Bfill;
        var backgroundfill = subfill.innercolor;
        var backgroundarea = (mainradius * 0.95) / 2;
        if (backgroundfill.filltype == undefined) backgroundfill.filltype = "color";
        if (backgroundfill.fill == undefined) backgroundfill.fill = 'white';
        if (backgroundfill.filltype == "color") {
            Bfill = backgroundfill.fill;
        }
        else if (backgroundfill.filltype == "gradient") {
            Bfill = ctx.GradientCheck(backgroundfill, centerX, centerY, backgroundarea);
        }

        ctx.circle(centerX, centerY, backgroundarea, 1, Bfill, "rgba(0,0,0,0)", nullshadow);
    }
    //border
    function border() {
        ctx.save();
        var BSFill;
        var borderfill = subfill.border;
        var borderarea = (mainradius * 0.94) / 2;
        if (borderfill.filltype == undefined) borderfill.filltype = "color";
        if (borderfill == undefined) bordercolor = "black";
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        if (borderfill.filltype == "color") {
            BSFill = borderfill.fill;
        }
        else if (borderfill.filltype == "gradient") {
            BSFill = ctx.GradientCheck(borderfill, centerX, centerY, borderarea);
        }
        Arc(centerX, centerY, borderarea, 0, PI * 2, (mainradius * 0.075), BSFill, ctx);
        ctx.restore();
    }

    function hashline(count, start, j, srad, erad, type, fill) {
        var startLine = toRadians(start);
        var endLine = toRadians(start);
        for (var i = 0; i <= (count * j) ; i++) {

            var valueline = 1 / ((count + 4) * j);
            var circum = valueline * PI * 2;
            if (i > 0) startLine = endLine;
            endLine += circum;

            offsetXlineS = cos(startLine) * srad;
            offsetYlineS = sin(startLine) * srad;
            offsetXlineE = cos(startLine) * erad;
            offsetYlineE = sin(startLine) * erad;
            ctx.Line(
                centerX + offsetXlineS
                , centerY + offsetYlineS
                , centerX + offsetXlineE
                , centerY + offsetYlineE
                , type, fill, nullshadow);
        }
    }

    function canvasdrawing() {
        //Meter
        //var m = radius - 130;
        var resultarc;
        var colorarcR = parseInt(mainradius * 0.39);
        var colorarcW = parseInt(mainradius * 0.05)//(radius + parseInt(mainradius * 0.19));// + m; //24

        resultarc = end - start;

        var percentarcA = ((percentlow / 100) * resultarc) + start;
        var percentarcB = ((percentmid / 100) * resultarc) + start;

        if (percentarcA < start) percentarcA = start;
        if (percentarcA > percentarcB) percentarcA = percentarcB;
        if (percentarcB > end) percentarcB = end;

        var degreeA = percentarcA;
        var degreeB = percentarcB;

        //arcs
        var arcarray = [];
        arcarray.push({ start: toRadians(start), end: toRadians(degreeA), color: suboptgarc.color1 });
        arcarray.push({ start: toRadians(degreeA), end: toRadians(degreeB), color: suboptgarc.color2 });
        arcarray.push({ start: toRadians(degreeB), end: toRadians(end), color: suboptgarc.color3 });

        for (var i = 0; i < arcarray.length; i++) {
            Arc(centerX, centerY, colorarcR, arcarray[i].start, arcarray[i].end, colorarcW, arcarray[i].color, ctx);
        }

        //small hashes
        hashline(xcount, start, 4, smallHRadius, outerRadius * 0.78, subhash.small, subhash.fill);

        //large hashes
        hashline(xcount, start, 2, largeHRadius, outerRadius * 0.92, subhash.large, subhash.fill);

        //extra large hashes
        //hashline(xcount, start, 2, xlargeRadius, outerRadius * 0.98, subhash.large, subhash.fill);

        //inner arc
        Arc(centerX, centerY, (mainradius * 0.935) / 2, start, end, 1, subhash.fill, ctx);

        //arc border
        Arc(centerX, centerY, (mainradius * 0.86) / 2, 0, PI * 2, mainradius * 0.003, "black", ctx);
    }

    function measurelabel() {
        //number font
        switch (type) {
            case "arc":
                startL = toRadians(180);
                endL = toRadians(180);
                for (i = 0; i <= 1; i++) {

                    var valueline = 1 / 2;
                    var circum = valueline * PI * 2;
                    if (i > 0) startL = endL;
                    endL += circum;

                    offsetXline = cos(startL) * mid.r;
                    offsetYline = sin(startL) * mid.r;
                    if (subNL.display) ctx.Text(convert(total * i), mid.x + offsetXline, (conh * 0.75) + offsetYline, 0, subNL.color, null, 0, "center", "hanging", subNL);
                }
                break
            case "gauge":
                startL = toRadians(start);
                endL = toRadians(start);
                for (i = 0; i <= xcount; i++) {

                    var valueline = 1 / (xcount + 4);
                    var circum = valueline * PI * 2;
                    if (i > 0) startL = endL;
                    endL += circum;

                    offsetXline = cos(startL) * labelRadius;
                    offsetYline = sin(startL) * labelRadius;
                    if (subNL.display) ctx.Text(convert(numlabel * i), centerX + offsetXline, centerY + offsetYline, 0, subNL.color, null, 0, "center", "middle", subNL);
                }
                //for (i = 0; i < labelOut.length; i++) {
                //    if (subNL.display) ctx.Text(convert(numlabel * i), (labelN[i].x), (labelN[i].y) - (conh * 0.012), 0, subNL.color, "center", "hanging", subNL);
                //}
                break
        }
    }

    function ArrowDraw(ctx, startX, startY, endX, endY, area, fill, stroke, linewidth, rotate/*, Xshadow, Yshadow, blurshadow, colorshadow*/) {
        //area *= 5;
        ctx.save();
        ////ctx.shadowset(Xshadow, Yshadow, blurshadow, colorshadow);
        var controlPoints = [0, area];

        var dx = endX - startX;
        var dy = endY - startY;
        var len = Math.sqrt((dx * dx) + (dy * dy));
        var sinY = dy / len;
        var cosX = dx / len;
        var a = [];
        a.push(-area, 0);
        for (var i = 0; i < controlPoints.length; i += 2) {
            var ax = controlPoints[i];
            var ay = controlPoints[i + 1];
            a.push(ax < 0 ? len + ax : ax, ay);
        }
        a.push(len, 0);
        for (var i = controlPoints.length; i > 0; i -= 2) {
            var bx = controlPoints[i - 2];
            var by = controlPoints[i - 1];
            a.push(bx < 0 ? len + bx : bx, -by);
        }
        a.push(-area, 0);

        var b = [];
        b.push(area, 0);
        for (var i = 0; i < controlPoints.length; i += 2) {
            var ax = controlPoints[i];
            var ay = controlPoints[i + 1];
            b.push(ax < 0 ? len + ax : ax, ay);
        }
        b.push(len, 0);

        var c = [];
        c.push(area, 0);
        c.push(len, 0);
        for (var i = controlPoints.length; i > 0; i -= 2) {
            var bx = controlPoints[i - 2];
            var by = controlPoints[i - 1];
            c.push(bx < 0 ? len + bx : bx, -by);
        }

        var needlearrayfill = [];
        var needlearrayline = [];
        var needlearrayfillA = [];
        var needlearrayfillB = [];
        var cx, cy;
        for (var i = 0; i < a.length; i += 2) {
            cx = a[i] * cosX - a[i + 1] * sinY + startX;
            cy = a[i] * sinY + a[i + 1] * cosX + startY;
            needlearrayfill.push({ x: cx, y: cy });
            needlearrayline.push({ x: cx, y: cy });
        }

        for (var i = 0; i < b.length; i += 2) {
            needlearrayfillA.push({
                x: b[i] * cosX - b[i + 1] * sinY + startX
                , y: b[i] * sinY + b[i + 1] * cosX + startY
            });
            needlearrayfillB.push({
                x: c[i] * cosX - c[i + 1] * sinY + startX
                , y: c[i] * sinY + c[i + 1] * cosX + startY
            });
        }

        //fill needle
        ctx.polygon(needlearrayfill, fill, stroke, 0, [0], nullshadow, true);

        //light shade
        ctx.polygon(needlearrayfillA, rgba(255, 255, 255, 0.5), stroke, 0, [0], nullshadow, true);

        //dark shade
        ctx.polygon(needlearrayfillB, rgba(0, 0, 0, 0.5), stroke, 0, [0], nullshadow, true);

        //stroke
        ctx.polygon(needlearrayline, rgba(0, 0, 0, 0), stroke, linewidth, [0], nullshadow, true);
        
        ctx.restore();
    }

    function Needle(input, total, needlecolor) {
        ctx.save();
        if (input > total)
            input = total;
        else if (input <= 0)
            input = 0;

        var area = outerRadius * 0.7;
        var needlestart = start;
        var needleend = end - 1;
        var measure = (needlestart + ((needleend - needlestart) * (input / total)));
        var point = toRadians(needlestart);
        var offsetXline = cos(toRadians(measure)) * area;
        var offsetYline = sin(toRadians(measure)) * area;
        var needleX = centerX + offsetXline;
        var needleY = centerY + offsetYline;

        var NBFill;
        var NCFill;
        var needlearea = conh * 0.02;
        var needlebase = subfill.needlebase;

        if (needlecolor.filltype == "color") {
            NCFill = needlecolor.fill;
        }
        else if (needlecolor.filltype == "gradient") {
            NCFill = ctx.GradientCheck(needlecolor, needleX, needleY, needlearea);
        }

        if (needlebase.filltype == "color") {
            NBFill = needlebase.fill;
        }
        else if (needlebase.filltype == "gradient") {
            NBFill = ctx.GradientCheck(needlebase, centerX, centerY, needlearea);
        }

        //ctx.Line(centerX, centerY, needleX, needleY, 5, NCFill, nullshadow, [0])
        // Needle
        ArrowDraw(ctx, centerX, centerY, needleX, needleY, needlearea, NCFill, needlecolor.stroke, 1, toRadians(measure));
        // Needle Base
        //ctx.circle(centerX, centerY, needlearea, 1, NBFill, needlebase.stroke, nullshadow);
        ctx.restore();
    }

    var Gaugeanimate;
    var percent = 0;
    var percentanimation;

    function animateNeedle() {
        var PFontHeight, IFontHeight, RFontHeight;
        PFontHeight = (subP.display) ? parseInt(ctx.FontHeight(subP)) + 4 : 0;// * 1.6;
        IFontHeight = (subI.display) ? parseInt(ctx.FontHeight(subI)) + 4 : 0;// * 1.6;
        RFontHeight = (subR.display) ? parseInt(ctx.FontHeight(subR)) + 5 : 0;// * 1.6;

        var canvasAnimate;
        /*if (percent == 100 || !animation) {
            var a = ElementID(canvasID);
            cancelAnimFrame(canvasAnimate);
            a.setAttribute("p8animate", false);
            a.setAttribute("p8draw", true);
            percentanimation = 1;
        }
        else {
            if (percent < 100) {
                canvasAnimate = requestAnimFrame(animateChart);
            }
            percentanimation = percent / 100;
            percent++
        }*/
        if (percent == 100 || !animation) {
            /*if (xmax >= counter) {
                var needle, result;
                if (counter < xmax) Gaugeanimate = requestAnimFrame(animateNeedle);
                needle = counter;
                counter+=1;
            }
            else {
                cancelAnimFrame(Gaugeanimate);
            }*/
            cancelAnimFrame(animateNeedle);
            percentanimation = 1;
        }
        else {
            if (percent < 100) {
                canvasAnimate = requestAnimFrame(animateNeedle, 1000 / 60);
            }
            percentanimation = percent / 100;
            percent++
            //needle = xmax;
        }

        var output = NaNCheck(numinput) * percentanimation;
        var percentage = round(Percent(output, total));
        //var resulttext = xcurrency + convert(result);

        var labelout;
        if (kmflag
            && (type == "arc" || type == "circle"))
            labelout = convert(output);
        else
            labelout = localestring(output, 2);

        var resulttext = prefix + labelout;

        function ColorArray(json) {
            var array = [];
            array.push(json.color1);
            array.push(json.color2);
            array.push(json.color3);
            return array
        }

        var rateoutput = [];
        rateoutput.push(rate.a);
        rateoutput.push(rate.b);
        rateoutput.push(rate.c);

        var ratelabelfill, percentagecolor, inputcolor, ratecolor, rateresult;
        if (percentage < percentlow) {
            ratelabelfill = ColorArray(suboptgarc)[0];//suboptgarc.color1;
            percentagecolor = ColorArray(subP)[0];//subP.color1;
            inputcolor = ColorArray(subI)[0];//subI.color1;
            ratecolor = ColorArray(subR)[0];//subR.color1;
            rateresult = rateoutput[0];//rate.a;//rating[0];
        }
        else if (percentage < percentmid) {
            ratelabelfill = ColorArray(suboptgarc)[1];//suboptgarc.color1;
            percentagecolor = ColorArray(subP)[1];//subP.color1;
            inputcolor = ColorArray(subI)[1];//subI.color1;
            ratecolor = ColorArray(subR)[1];//subR.color1;
            rateresult = rateoutput[1];//rate.a;//rating[0];
        }
        else if (percentage >= percentmid) {
            ratelabelfill = ColorArray(suboptgarc)[2];//suboptgarc.color1;
            percentagecolor = ColorArray(subP)[2];//subP.color1;
            inputcolor = ColorArray(subI)[2];//subI.color1;
            ratecolor = ColorArray(subR)[2];//subR.color1;
            rateresult = rateoutput[2];//rate.a;//rating[0];
        }
        var percentresult = (subP.display) ? ctx.FontWidth(percentage, subP) : 0;

        var resulttextwidth = (subI.display) ? ctx.FontWidth(resulttext, subI) : 0;

        var rateresultwidth = (subR.display) ? ctx.FontWidth(rateresult, subR) : 0;

        var rectheight = PFontHeight + IFontHeight + RFontHeight;
        var rectlength = mainradius * 0.4;
        var rect = {
            x: (conw * 0.50) - (rectlength * 0.5)//- (Math.max(percentresult, resulttextwidth, rateresultwidth) * 0.55)
            , y: parseInt(((Rout - 25) - (12)) * 0.8)
            , width: rectlength
            , height: rectheight
        }
        var textY, pcolorout, icolorout, rcolorout;
        switch (type) {
            case "arc":
                var fillout;
                textY = parseInt(rect.y * 0.8);
                switch (filldata.filltype) {
                    case "gradient":
                        fillout = ctx.GradientCheck(filldata, centerX, centerY, mid.r);
                        break
                    default:
                        fillout = filldata.fill || "green";
                        break
                }
                var empty = emptydata.fill || rgba(0, 0, 0, 0);

                var arcmeasure = output / total;
                if (output > total) arcmeasure = 1;
                var start = 180;
                var end = 360;
                var measure = (start + ((end - start) * arcmeasure));
                ctx.clear(conw, conh);
                Arc(mid.x, mid.y, mid.r, toRadians(start), toRadians(measure), linewidth, fillout, ctx);
                Arc(mid.x, mid.y, mid.r, toRadians(measure), toRadians(end), linewidth, empty, ctx);
                pcolorout = subP.color;
                icolorout = subI.color;
                rcolorout = subR.color;
                displayout()
                measurelabel();
                break
            case "circle":
                var fillout;
                var textadd = PFontHeight * 0.5;
                if (subI.display) textadd += (IFontHeight * 0.5);
                if (subR.display) textadd += (RFontHeight * 0.5);

                textY = (parseInt(mid.y) - textadd);
                switch (filldata.filltype) {
                    case "gradient":
                        fillout = ctx.GradientCheck(filldata, centerX, centerY, mid.r);
                        break
                    default:
                        fillout = filldata.fill || "green";
                        break
                }
                var empty = emptydata.fill || rgba(0, 0, 0, 0);

                var arcmeasure = output / total;
                if (output > total) arcmeasure = 1;
                var start = 270;
                var end = (360 + start);
                var measure = (start + ((end - start) * arcmeasure));
                ctx.clear(conw, conh);
                Arc(mid.x, mid.y, mid.r, toRadians(start), toRadians(measure), linewidth, fillout, ctx);
                Arc(mid.x, mid.y, mid.r, toRadians(measure), toRadians(end), linewidth, empty, ctx);
                pcolorout = subP.color;
                icolorout = subI.color;
                rcolorout = subR.color;
                displayout()
                break
            case "gauge":
                pcolorout = percentagecolor;
                icolorout = inputcolor;
                rcolorout = ratecolor;
                textY = parseInt(rect.y * 1.01);
                canvasbackground();
                ctx.save();
                ctx.clip();
                canvasdrawing();
                Arc(centerX, centerY, 0, 0, PI * 2, conh * 0.003, "black", ctx);
                if (rect.height > 0) ctx.roundedrectangle(rect.x, rect.y - 4, rect.width, rect.height, 20, 0, 1, ratelabelfill, subNL.color, [0], nullshadow);
                displayout();
                ctx.restore();
                measurelabel();
                Needle(output, total, needlecolor);
                border();
                Arc(centerX, centerY, parseInt((mainradius) / 2) + 2, 0, PI * 2, conh * 0.003, "black", ctx);
                ctx.labelHFS(option, type);
                break
        }

        function displayout() {
            //Percentage
            if (subP.display) ctx.Text(percentage + "%", centerX, textY, 0, pcolorout, null, 0, "center", "hanging", subP);
            //Input Result
            if (subI.display) ctx.Text(resulttext, centerX, textY + PFontHeight, 0, icolorout, null, 0, "center", "hanging", subI);
            //Rate
            if (subR.display) ctx.Text(rateresult, centerX, textY + PFontHeight + IFontHeight, 0, rcolorout, null, 0, "center", "hanging", subR);
        }
    }
    requestAnimFrame(animateNeedle, 1000 / 60);
} // end of canvas