// Original Code Developer: Danielle P. Dignadice
// Modified By: John Nicole Pilar (for Mobile Canvas use)

// Date Modification Created : June 20 2018
// Date Modified : September 02, 2021 / 08:30 AM  - before: 09-01-2021
// Version: P8-Charts Library 1.0.138

var nullshadow = {};
nullshadow.x = 0;
nullshadow.y = 0;
nullshadow.blur = 0;
nullshadow.color = 'Black';

var PI = Math.PI,
  cos = Math.cos,
  sin = Math.sin,
  abs = Math.abs,
  pow = Math.pow,
  round = Math.round;

var requestAnimFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (f, millisecond) {
    return setTimeout(f, millisecond);
  };
var cancelAnimFrame =
  window.cancelAnimationFrame ||
  window.webkitCancelRequestAnimationFrame ||
  window.mozCancelRequestAnimationFrame ||
  window.oCancelRequestAnimationFrame ||
  window.msCancelRequestAnimationFrame ||
  function (requestID) {
    return clearTimeout(requestID);
  }; //fall back

//-----------------------------------------------------------------------------//
//--------------------------CHART CREATION FUNCTIONS---------------------------//
//-----------------------------------------------------------------------------//

//GAUGE CHARTS
export function Gauge(ctx, option, type) {
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
  var conw = option.size.width; //400 default number
  var conh = option.size.height; //400 default number
  var optionH = option.header;
  var optionSH = option.subheader;
  var optionF = option.footer;

  var Hadd = optionH.display ? wrapTextHeight(ctx, optionH[Object.keys(optionH)[0]], 14, conw, FontHeight(ctx, optionH.fontSize, optionH.fontweight, optionH.fontFamily, optionH.fontStyle), false) : 7,
    SHadd = optionSH.display
      ? wrapTextHeight(ctx, optionSH[Object.keys(optionSH)[0]], Hadd, conw, FontHeight(ctx, optionSH.fontSize, optionSH.fontweight, optionSH.fontFamily, optionSH.fontStyle), false)
      : 7;

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
  labelCount = round(xcount + xcount * 0.35);
  var needleCount = round(xcount + xcount * 0.35) * 10 * 2;
  var labelMeasure = labelCount * 10;
  var needlepoint, labelpoint, startarc, endarc;

  var Rout;
  if (conw >= conh) Rout = conh;
  else Rout = conw;
  var mainradius = Rout - 25 - (Hadd + SHadd);

  var start, end;

  if (xcount == 10) {
    start = 141;
  } else if (xcount == 12) {
    start = 135;
  }
  end = 180 - start + 360;

  var outerRadius = parseInt(mainradius * 0.47); //188 default

  var xlargeRadius = parseInt(outerRadius * 0.77),
    largeHRadius = parseInt(outerRadius * 0.71),
    smallHRadius = largeHRadius,
    labelRadius = Math.ceil(outerRadius * 0.65) - radius / 2;

  if (percentlow < 0) percentlow = 0;
  if (percentlow > percentmid) percentlow = percentmid;
  if (percentmid > 100) percentmid = 100;

  var suboptgarc = option.gradientarc;

  var arcradius;
  if (conh >= conw) {
    arcradius = conw;
  } else {
    arcradius = conh;
  }
  var linewidth = arcwidth; //mid.r / 1.5;
  var mid = {};
  mid.x = conw / 2;
  mid.r = parseInt(arcradius * 0.4);

  switch (type) {
    case 'arc':
      mid.y = conh * 0.75;
      break;
    default:
      mid.y = conh * 0.5;
      break;
  }

  function canvasbackground() {
    //arc background
    ctx.clear(conw, conh);
    var Bfill;
    var backgroundfill = subfill.innercolor;
    var backgroundarea = (mainradius * 0.95) / 2;
    if (backgroundfill.filltype == undefined) backgroundfill.filltype = 'color';
    if (backgroundfill.fill == undefined) backgroundfill.fill = 'white';
    if (backgroundfill.filltype == 'color') {
      Bfill = backgroundfill.fill;
    } else if (backgroundfill.filltype == 'gradient') {
      Bfill = GradientCheck(ctx, backgroundfill, centerX, centerY, backgroundarea);
    }

    circle(ctx, centerX, centerY, backgroundarea, 1, Bfill, 'rgba(0,0,0,0)', nullshadow);
  }
  //border
  function border() {
    ctx.save();
    var BSFill;
    var borderfill = subfill.border;
    var borderarea = (mainradius * 0.94) / 2;
    if (borderfill.filltype == undefined) borderfill.filltype = 'color';
    if (borderfill == undefined) bordercolor = 'black';
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    if (borderfill.filltype == 'color') {
      BSFill = borderfill.fill;
    } else if (borderfill.filltype == 'gradient') {
      BSFill = GradientCheck(ctx, borderfill, centerX, centerY, borderarea);
    }
    Arc(centerX, centerY, borderarea, 0, PI * 2, mainradius * 0.075, BSFill, ctx);
    ctx.restore();
  }

  function hashline(count, start, j, srad, erad, type, fill) {
    var startLine = toRadians(start);
    var endLine = toRadians(start);
    for (var i = 0; i <= count * j; i++) {
      var valueline = 1 / ((count + 4) * j);
      var circum = valueline * PI * 2;
      if (i > 0) startLine = endLine;
      endLine += circum;

      offsetXlineS = cos(startLine) * srad;
      offsetYlineS = sin(startLine) * srad;
      offsetXlineE = cos(startLine) * erad;
      offsetYlineE = sin(startLine) * erad;
      Line(ctx, centerX + offsetXlineS, centerY + offsetYlineS, centerX + offsetXlineE, centerY + offsetYlineE, type, fill, nullshadow);
    }
  }

  function canvasdrawing() {
    //Meter
    //var m = radius - 130;
    var resultarc;
    var colorarcR = parseInt(mainradius * 0.39);
    var colorarcW = parseInt(mainradius * 0.05); //(radius + parseInt(mainradius * 0.19));// + m; //24

    resultarc = end - start;

    var percentarcA = (percentlow / 100) * resultarc + start;
    var percentarcB = (percentmid / 100) * resultarc + start;

    if (percentarcA < start) percentarcA = start;
    if (percentarcA > percentarcB) percentarcA = percentarcB;
    if (percentarcB > end) percentarcB = end;

    var degreeA = percentarcA;
    var degreeB = percentarcB;

    //arcs
    var arcarray = [];
    arcarray.push({start: toRadians(start), end: toRadians(degreeA), color: suboptgarc.color1});
    arcarray.push({start: toRadians(degreeA), end: toRadians(degreeB), color: suboptgarc.color2});
    arcarray.push({start: toRadians(degreeB), end: toRadians(end), color: suboptgarc.color3});

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
    Arc(centerX, centerY, (mainradius * 0.86) / 2, 0, PI * 2, mainradius * 0.003, 'black', ctx);
  }

  function measurelabel() {
    //number font
    switch (type) {
      case 'arc':
        startL = toRadians(180);
        endL = toRadians(180);
        for (i = 0; i <= 1; i++) {
          var valueline = 1 / 2;
          var circum = valueline * PI * 2;
          if (i > 0) startL = endL;
          endL += circum;

          offsetXline = cos(startL) * mid.r;
          offsetYline = sin(startL) * mid.r;
          if (subNL.display) Text(ctx, convert(total * i), mid.x + offsetXline, conh * 0.75 + offsetYline, 0, subNL.color, null, 0, 'center', 'hanging', subNL);
        }
        break;
      case 'gauge':
        startL = toRadians(start);
        endL = toRadians(start);
        for (i = 0; i <= xcount; i++) {
          var valueline = 1 / (xcount + 4);
          var circum = valueline * PI * 2;
          if (i > 0) startL = endL;
          endL += circum;

          offsetXline = cos(startL) * labelRadius;
          offsetYline = sin(startL) * labelRadius;
          if (subNL.display) Text(ctx, convert(numlabel * i), centerX + offsetXline, centerY + offsetYline, 0, subNL.color, null, 0, 'center', 'middle', subNL);
        }
        //for (i = 0; i < labelOut.length; i++) {
        //    if (subNL.display) ctx.Text(convert(numlabel * i), (labelN[i].x), (labelN[i].y) - (conh * 0.012), 0, subNL.color, "center", "hanging", subNL);
        //}
        break;
    }
  }

  function ArrowDraw(ctx, startX, startY, endX, endY, area, fill, stroke, linewidth, rotate /*, Xshadow, Yshadow, blurshadow, colorshadow*/) {
    //area *= 5;
    ctx.save();
    ////ctx.shadowset(Xshadow, Yshadow, blurshadow, colorshadow);
    var controlPoints = [0, area];

    var dx = endX - startX;
    var dy = endY - startY;
    var len = Math.sqrt(dx * dx + dy * dy);
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
      needlearrayfill.push({x: cx, y: cy});
      needlearrayline.push({x: cx, y: cy});
    }

    for (var i = 0; i < b.length; i += 2) {
      needlearrayfillA.push({
        x: b[i] * cosX - b[i + 1] * sinY + startX,
        y: b[i] * sinY + b[i + 1] * cosX + startY,
      });
      needlearrayfillB.push({
        x: c[i] * cosX - c[i + 1] * sinY + startX,
        y: c[i] * sinY + c[i + 1] * cosX + startY,
      });
    }

    //fill needle
    polygon(ctx, needlearrayfill, fill, stroke, 0, [0], nullshadow, true);

    //light shade
    polygon(ctx, needlearrayfillA, rgba(255, 255, 255, 0.5), stroke, 0, [0], nullshadow, true);

    //dark shade
    polygon(ctx, needlearrayfillB, rgba(0, 0, 0, 0.5), stroke, 0, [0], nullshadow, true);

    //stroke
    polygon(ctx, needlearrayline, rgba(0, 0, 0, 0), stroke, linewidth, [0], nullshadow, true);

    ctx.restore();
  }

  function Needle(input, total, needlecolor) {
    ctx.save();
    if (input > total) input = total;
    else if (input <= 0) input = 0;

    var area = outerRadius * 0.7;
    var needlestart = start;
    var needleend = end - 1;
    var measure = needlestart + (needleend - needlestart) * (input / total);
    var point = toRadians(needlestart);
    var offsetXline = cos(toRadians(measure)) * area;
    var offsetYline = sin(toRadians(measure)) * area;
    var needleX = centerX + offsetXline;
    var needleY = centerY + offsetYline;

    var NBFill;
    var NCFill;
    var needlearea = conh * 0.02;
    var needlebase = subfill.needlebase;

    if (needlecolor.filltype == 'color') {
      NCFill = needlecolor.fill;
    } else if (needlecolor.filltype == 'gradient') {
      NCFill = GradientCheck(ctx, needlecolor, needleX, needleY, needlearea);
    }

    if (needlebase.filltype == 'color') {
      NBFill = needlebase.fill;
    } else if (needlebase.filltype == 'gradient') {
      NBFill = GradientCheck(ctx, needlebase, centerX, centerY, needlearea);
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
    PFontHeight = subP.display ? parseInt(FontHeight(ctx, subP)) + 4 : 0; // * 1.6;
    IFontHeight = subI.display ? parseInt(FontHeight(ctx, subI)) + 4 : 0; // * 1.6;
    RFontHeight = subR.display ? parseInt(FontHeight(ctx, subR)) + 5 : 0; // * 1.6;

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
    } else {
      if (percent < 100) {
        canvasAnimate = requestAnimFrame(animateNeedle, 1000 / 60);
      }
      percentanimation = percent / 100;
      percent++;
      //needle = xmax;
    }

    var output = NaNCheck(numinput) * percentanimation;
    var percentage = round(Percent(output, total));
    //var resulttext = xcurrency + convert(result);

    var labelout;
    if (kmflag && (type == 'arc' || type == 'circle')) labelout = convert(output);
    else labelout = localestring(output, 2);

    var resulttext = prefix + labelout;

    function ColorArray(json) {
      var array = [];
      array.push(json.color1);
      array.push(json.color2);
      array.push(json.color3);
      return array;
    }

    var rateoutput = [];
    rateoutput.push(rate.a);
    rateoutput.push(rate.b);
    rateoutput.push(rate.c);

    var ratelabelfill, percentagecolor, inputcolor, ratecolor, rateresult;
    if (percentage < percentlow) {
      ratelabelfill = ColorArray(suboptgarc)[0]; //suboptgarc.color1;
      percentagecolor = ColorArray(subP)[0]; //subP.color1;
      inputcolor = ColorArray(subI)[0]; //subI.color1;
      ratecolor = ColorArray(subR)[0]; //subR.color1;
      rateresult = rateoutput[0]; //rate.a;//rating[0];
    } else if (percentage < percentmid) {
      ratelabelfill = ColorArray(suboptgarc)[1]; //suboptgarc.color1;
      percentagecolor = ColorArray(subP)[1]; //subP.color1;
      inputcolor = ColorArray(subI)[1]; //subI.color1;
      ratecolor = ColorArray(subR)[1]; //subR.color1;
      rateresult = rateoutput[1]; //rate.a;//rating[0];
    } else if (percentage >= percentmid) {
      ratelabelfill = ColorArray(suboptgarc)[2]; //suboptgarc.color1;
      percentagecolor = ColorArray(subP)[2]; //subP.color1;
      inputcolor = ColorArray(subI)[2]; //subI.color1;
      ratecolor = ColorArray(subR)[2]; //subR.color1;
      rateresult = rateoutput[2]; //rate.a;//rating[0];
    }
    var percentresult = subP.display ? FontWidth(ctx, percentage, subP) : 0;

    var resulttextwidth = subI.display ? FontWidth(ctx, resulttext, subI) : 0;

    var rateresultwidth = subR.display ? FontWidth(ctx, rateresult, subR) : 0;

    var rectheight = PFontHeight + IFontHeight + RFontHeight;
    var rectlength = mainradius * 0.4;
    var rect = {
      x: conw * 0.5 - rectlength * 0.5, //- (Math.max(percentresult, resulttextwidth, rateresultwidth) * 0.55)
      y: parseInt((Rout - 25 - 12) * 0.8),
      width: rectlength,
      height: rectheight,
    };
    var textY, pcolorout, icolorout, rcolorout;
    switch (type) {
      case 'arc':
        var fillout;
        textY = parseInt(rect.y * 0.8);
        switch (filldata.filltype) {
          case 'gradient':
            fillout = GradientCheck(ctx, filldata, centerX, centerY, mid.r);
            break;
          default:
            fillout = filldata.fill || 'green';
            break;
        }
        var empty = emptydata.fill || rgba(0, 0, 0, 0);

        var arcmeasure = output / total;
        if (output > total) arcmeasure = 1;
        var start = 180;
        var end = 360;
        var measure = start + (end - start) * arcmeasure;
        ctx.clear(conw, conh);
        Arc(mid.x, mid.y, mid.r, toRadians(start), toRadians(measure), linewidth, fillout, ctx);
        Arc(mid.x, mid.y, mid.r, toRadians(measure), toRadians(end), linewidth, empty, ctx);
        pcolorout = subP.color;
        icolorout = subI.color;
        rcolorout = subR.color;
        displayout();
        measurelabel();
        break;
      case 'circle':
        var fillout;
        var textadd = PFontHeight * 0.5;
        if (subI.display) textadd += IFontHeight * 0.5;
        if (subR.display) textadd += RFontHeight * 0.5;

        textY = parseInt(mid.y) - textadd;
        switch (filldata.filltype) {
          case 'gradient':
            fillout = GradientCheck(ctx, filldata, centerX, centerY, mid.r);
            break;
          default:
            fillout = filldata.fill || 'green';
            break;
        }
        var empty = emptydata.fill || rgba(0, 0, 0, 0);

        var arcmeasure = output / total;
        if (output > total) arcmeasure = 1;
        var start = 270;
        var end = 360 + start;
        var measure = start + (end - start) * arcmeasure;
        ctx.clear(conw, conh);
        Arc(mid.x, mid.y, mid.r, toRadians(start), toRadians(measure), linewidth, fillout, ctx);
        Arc(mid.x, mid.y, mid.r, toRadians(measure), toRadians(end), linewidth, empty, ctx);
        pcolorout = subP.color;
        icolorout = subI.color;
        rcolorout = subR.color;
        displayout();
        break;
      case 'gauge':
        pcolorout = percentagecolor;
        icolorout = inputcolor;
        rcolorout = ratecolor;
        textY = parseInt(rect.y * 1.01);
        canvasbackground();
        ctx.save();
        ctx.clip();
        canvasdrawing();
        Arc(centerX, centerY, 0, 0, PI * 2, conh * 0.003, 'black', ctx);
        if (rect.height > 0) roundedrectangle(ctx, rect.x, rect.y - 4, rect.width, rect.height, 20, 0, 1, ratelabelfill, subNL.color, [0], nullshadow);
        displayout();
        ctx.restore();
        measurelabel();
        Needle(output, total, needlecolor);
        border();
        Arc(centerX, centerY, parseInt(mainradius / 2) + 2, 0, PI * 2, conh * 0.003, 'black', ctx);
        ctx.labelHFS(option, type);
        break;
    }

    function displayout() {
      //Percentage
      if (subP.display) Text(ctx, percentage + '%', centerX, textY, 0, pcolorout, null, 0, 'center', 'hanging', subP);
      //Input Result
      if (subI.display) Text(ctx, resulttext, centerX, textY + PFontHeight, 0, icolorout, null, 0, 'center', 'hanging', subI);
      //Rate
      if (subR.display) Text(ctx, rateresult, centerX, textY + PFontHeight + IFontHeight, 0, rcolorout, null, 0, 'center', 'hanging', subR);
    }
  }
  requestAnimFrame(animateNeedle, 1000 / 60);
}

//MIXED CHARTS
export function CreateChart(ctx, option, type, click) {
  var canvasIDcon = option.canvasID,
    iscanvas = option.iscanvas,
    canvasID = iscanvas ? option.cID : canvasIDcon + '_canvas',
    //canvasID = option.cID || option.canvasID + "_canvas",
    chart = type;

  var elementlist = [];

  option.intervaldata = option.intervaldata || 1;

  var data = dataarrayoutput(option); //option.data;
  var legendfont = option.legendfont;
  var legendposition = option.legendposition || 'none';
  var millisecond = option.millisecond || 1000 / 60;
  var customXY = option.customXY || false;
  var conw, conh;

  var animation, customX, customY;
  if (customXY) {
    animation = false;
    customX = option.x;
    customY = option.y;
  } else {
    customX = 0;
    customY = 0;
    animation = option.animation || false;
  }
  (conw = option.size.width), //660 default number
    (conh = option.size.height); //400 default number
  var percentanimation;
  //Horizontal Bar
  if (type == 'horizontalbar') {
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
    var gtotalresult = removeDuplicate(GArray).toString().split(',').map(Number);
    var gtotalresultmax = MaxArray(gtotalresult);

    //multiple vertical lines
    var vline;
    var yline = data.length;

    var Hpercent;
    if (enable3d) {
      if (stacked) Hpercent = barpercentmeasure(ctx, option, chart, false) * gtotalmax;
      else Hpercent = barpercentmeasure(ctx, option, chart, false);
    } else Hpercent = 0;

    var hmovex = BaseLabelH(option, 'left', chart) + 1, //parseInt(xlabelbase + 1);
      hline = BaseLabelH(option, 'right', chart); //- Hpercent

    //checking max and min
    var XaddB;

    var maxY = MaxMin(option, chart, true),
      minY = MaxMin(option, chart, false);

    var valueuptotal = ValueTotal(option, chart, 'up'),
      valuedowntotal = ValueTotal(option, chart, 'down');

    //get perline width

    lineheight = TBPosition(ctx, option, chart, 'top');
    hposition = TBPosition(ctx, option, chart, 'bottom');

    //graph and labels
    var YCanvas = hposition; //conh - 55

    var heighttotal = YCanvas - lineheight;
    var heightC = heighttotal;
    heightC /= ObjectData.length;
    heightC /= data.length;
    h = heightC;
    if (data.length == 1) h /= 2;

    var WCanvas = hline - hmovex; //- (h * 0.2);

    var Yorigin = hposition;
    var addH = 1;

    var varCompute = ComputeCheck(option, hline, maxY, minY, 'y');
    var varP = VarPcount(option, hline, maxY, minY, 'y');
    var lineDrawCount = LineCount(option, hline, maxY, minY, 'y');
    var intervalV = WCanvas / (lineDrawCount - 1);

    for (var i = 0; i < lineDrawCount; i++) {
      if (valueuptotal >= valuedowntotal) {
        cx = parseInt(i * intervalV) + hmovex;

        if (varP == 0) {
          cxline = cx - Hpercent;
        }
      } else if (valueuptotal < valuedowntotal) {
        cx = parseInt((lineDrawCount - 1 - i) * intervalV) + hmovex;
        if (varP == 0) {
          cxline = cx + Hpercent * 0.05;
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
        // var a = ElementID(canvasID);
        // a.setAttribute('p8animate', false);
        // a.setAttribute('p8draw', true);
        percentanimation = 1;
      } else {
        if (percent < 100) {
          barHAnimate = requestAnimFrame(animateHBar, millisecond);
        }
        percentanimation = percent / 100;
        percent++;
      } //end else
      //ctx.clear(conw, conh);
      gridlinesdraw(ctx, option, precision, chart);
      var YaddH = 0;
      ctx.save();
      for (var ic = 1; ic <= ObjectData.length; ic++) {
        var OD = ObjectData[ic - 1];
        ODlabel = OD[Object.keys(OD)[0]] || '';
        OD.fillcolor = OD.fillcolor || 'black';
        OD.filltype = OD.filltype || 'color';
        OD.style = OD.style || '2d';
        OD.group = OD.group || {ID: 1, text: 'Group 1'};
        if (OD.group.ID == undefined || OD.group.ID < 1) OD.group.ID = 1;
        OD.group.text = OD.group.text || 'Group ' + OD.group.ID;
        for (var i = 0; i < data.length; i++) {
          if (percentstack) {
            if (!reverse) rev = i;
            else rev = data.length - 1 - i;
          } else {
            if (reverse) rev = i;
            else rev = data.length - 1 - i;
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
              case 'cone':
              case 'pyramid':
                var percent3dstack;
                if (stacked) {
                  valuey = stack3d(option, rev, ic, datainput, chart, gtotalresult);
                  var percentout;
                  if (valuey >= 0) percentout = 100;
                  else percentout = -100;
                  percent3dstack = Percent(valuey, stacktotal(option, rev, ic, datainput, chart, gtotalresult)); //(valuey / stacktotal(option, rev, ic, datainput, chart, gtotalresult)) * 100;
                } else {
                  valuey = datainput;
                  percent3dstack = 100;
                }

                //if (valueout >= 0) scaleX = 1;
                //else scaleX = -1;
                break;
              default:
                valuey = datainput;
                break;
            }
          } else valuey = datainput;
          //valuey = datainput;

          var x = XaddB; //XaddB
          var y = BarY(option, rev, h, Yorigin) + YaddH;
          var width;
          var height;

          if (valuedowntotal > valueuptotal) {
            if (valuedowntotal == data.length) {
              x;
            } else {
              if (valueout < 0) x; //+= Hpercent;
            }
          } else {
            if (valueuptotal == data.length) {
              x;
            } else {
              if (valueout > 0) x; //-= Hpercent;
            }
          }

          height = BarLength(option, h);

          var pstacktotal = PercentTotal(option, i);
          var pstack = Percent(valuey / totalValues, pstacktotal);

          if (!percentstack) width = parseInt((valuey / totalValues) * WCanvas) * percentanimation;

          //For Stacked Bar
          if (stacked && !percentstack) {
            var gs = gtotalmax * gtotalresultmax;
            width /= gtotalmax;
            height *= ObjectData.length;
            height /= gtotalresultmax;
            y += height * (OD.group.ID - 1);
            for (var g = 1; g < ic; g++) {
              valueyAdd = Stack(option, valuey, ic, rev, g, percentanimation, gtotalresult, totalValues, WCanvas, true, true);
              //if (enable3d)
              x += valueyAdd / gs; //- WidthAstack;
            }
          }

          //For Percentage Stack
          if (percentstack) {
            height *= ObjectData.length;
            width = pstack * WCanvas * percentanimation;
            for (var g = 1; g < ic; g++) {
              var valueyAddpercent = PStack(option, rev, g, valuey, percentanimation, gtotalresult, totalValues, WCanvas, true, false);
              x += valueyAddpercent / ObjectData.length;
            }
          }

          if (valuedowntotal > valueuptotal) {
            if (valuedowntotal == data.length) {
              width;
            } else {
              width; //+= Hpercent;
            }
          } else {
            if (valueuptotal == data.length) {
              width;
            } else {
              width; //-= Hpercent;
            }
          }

          if (enable3d) {
            switch (pattern3d) {
              case 'cone':
                width; //-= (h * 0.2)
                break;
              default:
                width;
                break;
            }
          } else width;

          if (valuey >= 0) x += 1;
          if (valuey < 0) x;

          //gradient
          //var shine = [];
          //shine.push({ color: datacolor, stop: 0 });
          //shine.push({ color: 'white', stop: 0.25 });
          //shine.push({ color: datacolor, stop: 0.5 });

          var shine = [];
          shine.push({color: rgba(0, 0, 0, 0), stop: 0});
          shine.push({color: rgba(255, 255, 255, 0.7), stop: 0.25});
          shine.push({color: rgba(255, 255, 255, 0.7), stop: 0.35});
          shine.push({color: rgba(0, 0, 0, 0), stop: 0.8});

          if (OD.filltype == 'gradient') {
            var gtypeout = OD.gradienttype || 'linear a';
            gtypeout = gtypeout.toString().toLowerCase();
            var grad = [];
            var elementgrad = [];
            for (var j = 0; j < OD.fillcolor.length; j++) {
              grad.push({color: OD.fillcolor[j].color, stop: OD.fillcolor[j].stop});
              elementgrad.push(OD.fillcolor[j].color);
            }
            switch (gtypeout) {
              case 'linear a':
                barfill = GradientLinear(ctx, 0, y, width, height, grad, 0, true, false);
                break;
              case 'linear b':
                barfill = GradientLinear(ctx, 0, y, width, height, grad, 0, false, false);
                break;
              case 'linear c':
                barfill = GradientLinear(ctx, x, 0, width, height, grad, 0, true, true);
                break;
              case 'linear d':
                barfill = GradientLinear(ctx, x, 0, width, height, grad, 0, false, true);
                break;
              case 'linear e':
                if (valuey >= 0) barfill = GradientLinear(ctx, x, y, width, height, grad, 0, false, true, true);
                else barfill = GradientLinear(ctx, x, y, width, height, grad, 0, false, false, true);
                break;
              case 'linear f':
                if (valuey >= 0) barfill = GradientLinear(ctx, x, y, width, height, grad, 0, true, true, true);
                else barfill = GradientLinear(ctx, x, y, width, height, grad, 0, true, false, true);
                break;
              case 'linear g':
                if (valuey >= 0) barfill = GradientLinear(ctx, x, y, width, height, grad, 0, false, false, true);
                else barfill = GradientLinear(ctx, x, y, width, height, grad, 0, false, true, true);
                break;
              case 'linear h':
                if (valuey >= 0) barfill = GradientLinear(ctx, x, y, width, height, grad, 0, true, false, true);
                else barfill = GradientLinear(ctx, x, y, width, height, grad, 0, true, true, true);
                break;
              //case "radial":  barfill = ctx.GradientCircle(x + width, y, (width * height) / 5, x + width, y , (width * height), grad )
            }
            elementfill = elementgrad;
          } else if (OD.filltype == 'color') {
            //if (OD.style == "2d")
            //    barfill = datacolor;
            //else if (OD.style == "3d")
            //    barfill = GradientLinear(ctx, 0, y, width, height, shine, 0, false, false);
            barfill = datacolor;
            elementfill = datacolor;
            var shinefill = GradientLinear(ctx, 0, y, width, height, shine, 0, false, false);
          }
          OD.strokewidth = OD.strokewidth || 0;
          barwidth = OD.strokewidth;
          if (percentstack || stacked) barwidth = 0;
          barstroke = OD.strokecolor || 'black';

          var group3D = group3dstack(option, rev);
          if (OD.bevel) bevelbar(ctx, valuey, x + 0.5, y - 0.5, width, height + 1.5, barwidth, barfill, barstroke, chart, shadow);
          else {
            var stretch = true;

            if (enable3d) {
              var Glength = gtotalresult.length;
              switch (pattern3d) {
                case 'cylinder':
                  cylinder(x, y, width, height, 20, true, false, 1, barfill, barstroke, barwidth, [0], shadow, chart, option, ic, rev, group3D[ic - 1], Gout, Glength);
                  break;
                case 'cone':
                  ctx.cone(
                    x,
                    y,
                    width,
                    height,
                    10,
                    0,
                    stretch,
                    percent3dstack,
                    0,
                    height,
                    true,
                    true,
                    1,
                    OD.filltype,
                    OD.gradienttype,
                    barfill,
                    barstroke,
                    barwidth,
                    [0],
                    shadow,
                    Gout[ic - 1],
                    option,
                    rev,
                    ic,
                  );
                  break;
                case 'pyramid':
                  ctx.pyramid(
                    x,
                    y,
                    width,
                    height,
                    20,
                    0,
                    true,
                    stretch,
                    percent3dstack,
                    0,
                    height,
                    true,
                    1,
                    OD.filltype,
                    OD.gradienttype,
                    barfill,
                    barstroke,
                    barwidth,
                    [0],
                    shadow,
                    chart,
                    option,
                    group3D[ic - 1],
                    ic,
                    rev,
                    Gout,
                    Glength,
                  );
                  break;
                default:
                  ctx.Bar3D(x, y, width, height, 20, 0, barfill, '', 0, [0], shadow, false, 1, option, group3D[ic - 1], ic, rev, chart, Gout, Glength);
                  break;
              }
            } else {
              ctx.drawhbar(x, y, width, height, barwidth, barfill, barstroke, shadow);
              if (OD.style == '3d') ctx.drawhbar(x, y, width, height, barwidth, shinefill, barstroke, nullshadow);
            }
          }
        }
        if (!stacked && !percentstack) YaddH += height;
      }
      Line(ctx, parseInt(XaddBline) + 0.5, parseInt(lineheight) + 0.5, parseInt(XaddBline) + 0.5, parseInt(hposition) + 1.5, gridline.width, gridline.color, nullshadow);
      var YaddHtxt = 0;
      for (var ic = 1; ic <= ObjectData.length; ic++) {
        var OD = ObjectData[ic - 1];
        ODlabel = OD[Object.keys(OD)[0]] || '';
        OD.group = OD.group || {ID: 1, text: 'Group 1'};
        if (OD.group.ID == undefined || OD.group.ID < 1) OD.group.ID = 1;
        OD.group.text = OD.group.text || 'Group ' + OD.group.ID;
        OD.prefix = OD.prefix || '';
        OD.suffix = OD.suffix || '';
        for (var i = 0; i < data.length; i++) {
          if (percentstack) {
            if (!reverse) rev = i;
            else rev = data.length - 1 - i;
          } else {
            if (reverse) rev = i;
            else rev = data.length - 1 - i;
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
          var pstack = Percent(valuey / totalValues, pstacktotal);

          if (!percentstack) width = parseInt((valuey / totalValues) * WCanvas) * percentanimation;
          //For Stacked Bar
          if (stacked && !percentstack) {
            var gs = gtotalmax * gtotalresultmax;
            width /= gtotalmax;
            height *= ObjectData.length;
            height /= gtotalresultmax;
            y += height * (OD.group.ID - 1);
            for (var g = 1; g < ic; g++) {
              valueyAdd = Stack(option, valuey, ic, rev, g, percentanimation, gtotalresult, totalValues, WCanvas, true, true);
              x += valueyAdd / gs;
            }
          }
          //For Percentage Stack
          if (percentstack) {
            height *= ObjectData.length;
            width = pstack * WCanvas * percentanimation;
            for (var g = 1; g < ic; g++) {
              var valueyAddpercent = PStack(option, rev, g, valuey, percentanimation, gtotalresult, totalValues, WCanvas, true, false);
              x += valueyAddpercent / ObjectData.length;
            }
          }

          if (valuey >= 0) x += 1;
          if (valuey < 0) x;

          if (!reversedata) elementvalue = datainput;
          else elementvalue = datainput * -1;

          data[i].text = data[i].text || '';

          if (plotlabel.custom) plotlabeldisplay = data[i].text;
          else plotlabeldisplay = parseInt(elementvalue * percentanimation);
          //plotlabeldisplay = parseInt(elementvalue * percentanimation);
          if (datainput <= 0) plotlabelx = x - width;
          else plotlabelx = x + width;

          if (datainput > 0) plotlabelalign = 'center';
          else plotlabelalign = 'center';

          if (click || plotlabel.display) ctx.Text(plotlabeldisplay, plotlabelx, y + height / 2, 0, plotlabel.color, null, 0, plotlabelalign, 'middle', plotlabel);
          ctx.restore();
        }
        if (!stacked && !percentstack) YaddHtxt += height;
      }
      ctx.restore();
      var YaddE = 0;
      for (var ic = 1; ic <= ObjectData.length; ic++) {
        var OD = ObjectData[ic - 1];
        ODlabel = OD[Object.keys(OD)[0]] || '';
        OD.fillcolor = OD.fillcolor || 'black';
        OD.filltype = OD.filltype || 'color';
        OD.style = OD.style || '2d';
        OD.group = OD.group || {ID: 1, text: 'Group 1'};
        if (OD.group.ID == undefined || OD.group.ID < 1) OD.group.ID = 1;
        OD.group.text = OD.group.text || 'Group ' + OD.group.ID;
        for (var i = 0; i < data.length; i++) {
          if (reverse) rev = i;
          else rev = data.length - 1 - i;
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
          var pstack = Percent(valuey / totalValues, pstacktotal);
          height = YCanvas; //BarLength(option, h);
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
            elemrev = data.length - 1 - i;
          } else {
            elemrev = i;
          }

          if (percentstack) {
            elementlabel = LabelOutput(option, elemrev, true, chart);
          } else {
            elementlabel = LabelOutput(option, elemrev, true, chart);
          }

          //var elementtext, elementgroup;

          //if (gtotalresultmax > 1) elementgroup = " (" + OD.group.text + ")";
          //else elementgroup = "";

          //if (stacked) elementtext = ODlabel + elementgroup;
          //else elementtext = ODlabel;

          if (percentstack) elementpercent = ' (' + round(pstack) + '%)' + '<br>';
          else elementpercent = '';

          elementvalue = valuey + '<br>';

          var ytest = (heighttotal + 8) / data.length;

          elementY = lineheight + ytest * rev;
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

            if (percentstack) percentarray = ' (' + round(Percent(round(valuearray), pstacktotal)) + '%)';
            else percentarray = '';

            if (ODE.filltype == 'color') {
              var datacolorlist;
              if (data[elemrev].fillcolor == undefined || j > 1) datacolorlist = ODE.fillcolor;
              else datacolorlist = data[elemrev].fillcolor;
              filllistresult = datacolorlist;
            } else if (ODE.filltype == 'gradient') {
              ODE.gradienttype = ODE.gradienttype || 'linear a';
              var elementgrad = [];
              for (var k = 0; k < ODE.fillcolor.length; k++) {
                elementgrad.push({
                  color: ODE.fillcolor[k].color,
                  stop: ODE.fillcolor[k].stop,
                });
              }
              filllistresult = elementgrad;
              gradtypelist.push(ODE.gradienttype);
            }
            var strokelistresult = ODE.strokecolor || 'black';

            strokelist.push(strokelistresult);
            filllist.push(filllistresult);
            percentlist.push(percentarray);
            filltypelist.push(ODE.filltype);
            valuelist.push(valuearray);
            strokeWarray.push(ODE.strokewidth);
            if (ObjectData.length > 1) ODlist.push(ODE[Object.keys(ODE)[0]]);
            else ODlist.push(elementlabel);

            if (gtotalresultmax > 1) grouplist.push(ODE.group.text);
            else grouplist.push('');

            patternlist.push('square');
          }

          element = {
            x: elementX,
            y: elementY,
            width: elementwidth,
            height: elementheight,
            //, text: elementtext
            label: elementlabel,
            prefix: format.prefix,
            suffix: format.suffix,
            //, filltype: OD.filltype
            valuearray: valuelist,
            ODlist: ODlist,
            percentlist: percentlist,
            filltypelist: filltypelist,
            filllist: filllist,
            gradtypelist: gradtypelist,
            grouplist: grouplist,
            pattern: patternlist,
            strokelist: strokelist,
            linewidth: strokeWarray,
          };
          if (percentanimation == 1) elementlist.push(element);
        }
        if (!stacked && !percentstack) YaddE += height;
      }
      ctx.canvaslabel(option, chart, precision, click);
      ctx.labelHFS(option, chart);
      ctx.legend(option, chart);
      hoverout(option, elementlist, percentanimation, chart);
    }
  }
  //Pie, Doughnut
  else if (type == 'pie' || type == 'doughnut' || type == 'cone' || type == 'pyramid' || type == 'cylinder') {
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
      datalabelfont = option.datalabelfont;
    ascending = option.ascending;

    optionH.display = optionH.display || false;
    optionSH.display = optionSH.display || false;
    optionF.display = optionF.display || false;

    if (sort) {
      data.sort(function (a, b) {
        return NaNCheck(a.value) - NaNCheck(b.value);
      });
    }

    if (!ascending) {
      data.reverse();
    }

    shadow.enabled = shadow.enabled || false;

    var top, bottom, left, right;
    var Htop, SHtop;

    if (optionH.display) Htop = ctx.wrapTextHeight(optionH.text, 5, conw, TextFontHeight(ctx, optionH), false);
    else Htop = 5;

    if (optionSH.display) SHtop = ctx.wrapTextHeight(optionSH.text, Htop, conw, TextFontHeight(ctx, optionSH), false);
    else SHtop = 0;
    var canvastop = Htop + SHtop * 0.5;
    var canvasbottom;
    if (optionF.display) canvasbottom = ctx.wrapTextHeight(optionF.text, 10, conw, TextFontHeight(ctx, optionF), false);
    else canvasbottom = 10;

    var legendfontheight;

    var labellegendnum = legendarraynum(ctx, option, chart);

    if (legendfont.display) {
      legendfontheight = TextFontHeight(ctx, legendfont) * MaxArray(labellegendnum);
    } else {
      legendfontheight = 0;
    }

    var radius;
    if (conh < conw) {
      radius = conh;
    } else {
      radius = conw;
    }

    var moveX, moveY;
    switch (legendposition) {
      case 'top':
        top = canvastop + legendfontheight; //40
        bottom = canvasbottom; //320
        moveX = conw * 0.5;
        moveY = conh * 0.5 + legendfontheight;
        break;
      case 'bottom':
        top = canvastop;
        bottom = canvasbottom + legendfontheight; //320
        moveX = conw * 0.5;
        moveY = conh * 0.5 - legendfontheight;
        break;
      case 'left':
        top = canvastop;
        bottom = canvasbottom; //320
        if (conh < conw) moveX = conw * 0.5;
        else moveX = conw * 0.5;

        moveY = conh * 0.5;
        break;
      case 'right':
        top = canvastop;
        bottom = canvasbottom; //320
        if (conh < conw) moveX = conw * 0.5;
        else moveX = conw * 0.5;

        moveY = conh * 0.5;
        break;
      default:
        top = canvastop;
        bottom = canvasbottom; //320
        moveX = conw * 0.5;
        moveY = conh * 0.5;
    }
    var xmeasure, radiusmeasure;

    var mid = {
      x: moveX,
      y: moveY,
      r: parseInt(radius * 0.5 - (top + bottom)),
    };

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
        a.setAttribute('p8animate', false);
        a.setAttribute('p8draw', true);
        percentanimation = 1;
      } else {
        if (percent < 100) {
          pieAnimate = requestAnimFrame(animatePie, millisecond);
        }
        percentanimation = percent / 100;
        percent++;
      } //end else

      clear(ctx, option.size.width, option.size.height);
      var offset = 0,
        offsetX,
        offsetY;
      var endRadians = toRadians(degrees - 180) + toRadians(360) * percentanimation;
      switch (type) {
        case 'pie':
          ctx.save();
          ctx.beginPath();
          ctx.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
          ctx.moveTo(mid.x, mid.y);
          ctx.arc(mid.x, mid.y, mid.r + lineoption.width / 2, toRadians(degrees - 180), endRadians, false);
          ctx.fillStyle = lineoption.color;
          if (shadow.enabled) ctx.fill();
          ctx.restore();
          ctx.save();
          ctx.clip();
          //Pie Chart
          for (var i = 0; i < data.length; i++) {
            var CD = data[i];
            CD.filltype = CD.filltype || 'color';
            CD.gradienttype = CD.gradienttype || 'linear a';

            var datavalue = NaNCheck(CD.value);

            var value = NaNCheck(abs(datavalue / total));
            var circum = value * toRadians(360);
            if (i > 0) start = end;
            end += circum;
            var median = (end + start) / 2;

            offsetX = cos(median) * offset;
            offsetY = sin(median) * offset;

            offsetXlabel = cos(end) * (mid.r * 0.5);
            offsetYlabel = sin(end) * (mid.r * 0.5);

            ctx.save();
            var piefill, elementfill;
            if (CD.filltype == 'color') {
              var gradientfill = [];
              gradientfill.push({color: 'white'});
              gradientfill.push({color: CD.fill});
              gradientfill.push({color: 'white'});
              //piefill = CD.fill;
              piefill = GradientLinear(ctx, 0, conh * 0.025, conw, conh, gradientfill, 0, false, false);
              elementfill = CD.fill;
            } else if (CD.filltype == 'gradient') {
              var gtypeout = CD.gradienttype;
              switch (gtypeout) {
                case 'linear a':
                  piefill = GradientLinear(ctx, 0, conh * 0.025, conw, conh, CD.fill, 0, false, false);
                  break;
                case 'linear b':
                  piefill = GradientLinear(ctx, 0, conh * 0.025, conw, conh, CD.fill, 0, true, false);
                  break;
                case 'linear c':
                  piefill = GradientLinear(ctx, conw * 0.05, 0, conw, conh, CD.fill, 0, true, true);
                  break;
                case 'linear d':
                  piefill = GradientLinear(ctx, conw * 0.05, 0, conw, conh, CD.fill, 0, false, true);
                  break;
                case 'linear e':
                  piefill = GradientLinear(ctx, mid.x, mid.y, conw, conh, CD.fill, 0, false, true, true);
                  break;
                case 'linear f':
                  piefill = GradientLinear(ctx, mid.x, mid.y, conw, conh, CD.fill, 0, true, true, true);
                  break;
                case 'linear g':
                  piefill = GradientLinear(ctx, mid.x, mid.y, conw, conh, CD.fill, 0, false, false, true);
                  break;
                case 'linear h':
                  piefill = GradientLinear(ctx, mid.x, mid.y, conw, conh, CD.fill, 0, true, false, true);
                  break;
                case 'radial':
                  piefill = ctx.GradientCircle(mid.x, mid.y, mid.r / 5, mid.x, mid.y, mid.r, CD.fill);
                  break;
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
            ctx.lineJoin = 'round';
            // Arc Parameters: x, y, radius, startingAngle (radians), endingAngle (radians), antiClockwise (boolean)
            ctx.arc(mid.x + offsetX, mid.y + offsetY, mid.r, start, end, false);
            //ctx.lineTo(mid.x + offsetX, mid.y + offsetY);
            ctx.fill();
            ctx.closePath();
            if (lineoption.width > 0) ctx.stroke();

            ctx.restore();
            var anglelist = [];
            for (var j = 0; j < data.length; j++) {
              anglelist.push({angle: abs(data[i].value / total) * start});
            }
            var namelist = [];
            var colorlist = [];
            var valuelist = [];
            var filltypelist = [];
            var gradtypelist = [];
            for (var k = 0; k < data.length; k++) {
              var CDE = data[k];
              if (CDE.filltype == 'color') {
                var datacolorlist = CDE.fill;
                filllistresult = datacolorlist;
              } else if (CDE.filltype == 'gradient') {
                CDE.gradienttype = CDE.gradienttype || 'linear a';
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
              x: mid.x,
              y: mid.y,
              radius: mid.r,
              start: start,
              end: end,
              name: CD.name,
              value: datavalue,
              fill: elementfill,
              filltype: CD.filltype,
              gradienttype: CD.gradienttype,
              i: i,
            };
          }
          var startlabel = -PI / 2,
            endlabel = -PI / 2;
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
            if (percentanimation == 1 && datalabelfont.display && total > 0 && datavalue > 0)
              ctx.Text(datavalue, mid.x + offsetXlabel, mid.y + offsetYlabel, 0, datalabelfont.color, null, 0, 'center', 'middle', datalabelfont);
          }
          if (percentanimation == 1) {
            //console.log(elementlist);
            //console.log(degrees);
            //console.log(degrees - 180)
          }
          break;
        case 'doughnut':
          ctx.save();
          ctx.beginPath();
          ctx.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
          ctx.arc(mid.x, mid.y, mid.r / 1.3, toRadians(degrees - 180), endRadians, false);
          ctx.lineWidth = mid.r / 2.19;
          ctx.stroke();
          ctx.restore();
          ctx.save();
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
            CD.filltype = CD.filltype || 'color';
            CD.gradienttype = CD.gradienttype || 'linear a';

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
            if (CD.filltype == 'color') {
              doughnutfill = CD.fill;
            } else if (CD.filltype == 'gradient') {
              //GradientLinear(x, y, width, height, input, ctx, reverse, invert, diag)
              var gtypeout = CD.gradienttype.toString().toLowerCase();
              switch (gtypeout) {
                case 'linear a':
                  doughnutfill = GradientLinear(ctx, 0, conh * 0.025, conw, conh, CD.fill, 0, false, false);
                  break;
                case 'linear b':
                  doughnutfill = GradientLinear(ctx, 0, conh * 0.025, conw, conh, CD.fill, 0, true, false);
                  break;
                case 'linear c':
                  doughnutfill = GradientLinear(ctx, conw * 0.05, 0, conw, conh, CD.fill, 0, true, true);
                  break;
                case 'linear d':
                  doughnutfill = GradientLinear(ctx, conw * 0.05, 0, conw, conh, CD.fill, 0, false, true);
                  break;
                case 'linear e':
                  doughnutfill = GradientLinear(ctx, mid.x, mid.y, conw, conh, CD.fill, 0, false, true, true);
                  break;
                case 'linear f':
                  doughnutfill = GradientLinear(ctx, mid.x, mid.y, conw, conh, CD.fill, 0, true, true, true);
                  break;
                case 'linear g':
                  doughnutfill = GradientLinear(ctx, mid.x, mid.y, conw, conh, CD.fill, 0, false, false, true);
                  break;
                case 'linear h':
                  doughnutfill = GradientLinear(ctx, mid.x, mid.y, conw, conh, CD.fill, 0, true, false, true);
                  break;
                case 'radial':
                  doughnutfill = ctx.GradientCircle(mid.x, mid.y, mid.r / 2, mid.x, mid.y, mid.r, CD.fill);
                  break;
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
              anglelist.push({angle: abs(CD.value / total) * start});
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
          var startlabel = -PI / 2,
            endlabel = -PI / 2;
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
            if (percentanimation == 1 && datalabelfont.display && total > 0 && datavalue > 0)
              ctx.Text(datavalue, mid.x + offsetXlabel, mid.y + offsetYlabel, 0, datalabelfont.color, null, 0, 'center', 'middle', datalabelfont);
          }
          var filllistresult;
          var namelist = [];
          var colorlist = [];
          var valuelist = [];
          var filltypelist = [];
          var gradtypelist = [];
          for (var k = 0; k < data.length; k++) {
            var CDE = data[k];
            if (CDE.filltype == 'color') {
              var datacolorlist = CDE.fill;
              filllistresult = datacolorlist;
            } else if (CDE.filltype == 'gradient') {
              CDE.gradienttype = CDE.gradienttype || 'linear a';
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
          break;
        default:
          var x, y, width, height;
          var radout = radius * 0.9;
          var length;
          var area = 10;
          switch (type) {
            case 'cylinder':
              area += 30;
              var areameasure = 0.25;
              var areapercent = area / 100;
              HeightA = radout * areapercent;
              var areaarc = HeightA * areameasure;
              var cmeasure = radout - areaarc * 2;
              x = mid.x - cmeasure * 0.5;
              y = top + areaarc * 1.5;
              length = radout - areaarc * 2;
              width = length;
              break;
            default:
              x = mid.x - radout * 0.5;
              y = top + 5;
              length = radout;
              width = radout;
              break;
          }

          var datatotal = total;
          var elemtotal = total;
          var elemheight, iheight, dataheight;
          for (i = 0; i < data.length; i++) {
            var rev = data.length - 1 - i;
            var CD = data[rev];
            var percentage = datatotal / total;
            CD.filltype = CD.filltype || 'color';
            CD.gradienttype = CD.gradienttype || 'linear a';

            var datavalue = NaNCheck(CD.value);
            iheight = length - (top + bottom);
            height = iheight * percentage;
            elemtotal -= datavalue;
            dataheight = iheight * (datavalue / total);
            //if (percentanimation == 1) console.log("Element Height: " + elemheight);
            //if (percentanimation == 1) console.log("Height: " + height);
            //if (percentanimation == 1) console.log("Data Height: " + dataheight);
            var shapefill;

            if (type == 'cone') {
              shapefill = CD.fill;
            } else {
              if (CD.filltype == 'color') {
                shapefill = CD.fill;
              } else if (CD.filltype == 'gradient') {
                var conewidthA, conewidthB;
                var areaA = area / 100,
                  areaB = 1 - areaA;
                if (height > width) {
                  conewidthA = 0;
                  conewidthB = width;
                } else {
                  conewidthA = width * 0.5 - height * 0.5;
                  conewidthB = width * 0.5 + height * 0.5;
                }
                HeightA = HeightFix(width, height, areaA, true);
                HeightB = HeightFix(width, height, areaA, false);

                var gradientx = x - width * 0.75 - conewidthA;
                var gradientwidth = conewidthB; //conelength;
                var gtypeout = CD.gradienttype.toString().toLowerCase();

                switch (gtypeout) {
                  case 'linear a':
                    shapefill = GradientLinear(ctx, 0, y - height * 0.5, gradientwidth, HeightB, CD.fill, 0, false, false);
                    break;
                  case 'linear b':
                    shapefill = GradientLinear(ctx, 0, y - height * 0.5, gradientwidth, HeightB, CD.fill, 0, true, false);
                    break;
                  case 'linear c':
                    shapefill = GradientLinear(ctx, gradientx, 0, gradientwidth, HeightB, CD.fill, 0, true, true);
                    break;
                  case 'linear d':
                    shapefill = GradientLinear(ctx, gradientx, 0, gradientwidth, HeightB, CD.fill, 0, false, true);
                    break;
                  case 'linear e':
                    shapefill = GradientLinear(ctx, gradientx, y, gradientwidth, HeightB, CD.fill, 0, false, true, true);
                    break;
                  case 'linear f':
                    shapefill = GradientLinear(ctx, gradientx, y, gradientwidth, HeightB, CD.fill, 0, true, true, true);
                    break;
                  case 'linear g':
                    shapefill = GradientLinear(ctx, gradientx, y, gradientwidth, HeightB, CD.fill, 0, false, false, true);
                    break;
                  case 'linear h':
                    shapefill = GradientLinear(ctx, gradientx, y, gradientwidth, HeightB, CD.fill, 0, true, false, true);
                    break;
                  case 'radial':
                    shapefill = ctx.GradientCircle(x - conewidthB * 0.5, y, height / 5, x - conewidthB * 0.5, y, height, CD.fill);
                    break;
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
            shadowout = nullshadow; //shadow;

            var percentdraw = 100;
            var percentheight = iheight;

            var totalinitial = 0;
            for (j = 0; j < rev; j++) {
              totalinitial += NaNCheck(data[j].value);
            }

            var totalpercent = Percent(totalinitial, total);

            var stretch = false;
            switch (type) {
              case 'cone':
                ctx.cone(
                  x,
                  y,
                  width,
                  height,
                  area,
                  0,
                  stretch,
                  percentdraw,
                  totalpercent,
                  percentheight,
                  false,
                  false,
                  1,
                  CD.filltype,
                  CD.gradienttype,
                  CD.fill,
                  lineoption.color,
                  lineoption.width,
                  [0],
                  shadowout,
                  1,
                );
                break;
              case 'pyramid':
                ctx.pyramid(
                  x,
                  y,
                  width,
                  height,
                  area,
                  0,
                  false,
                  stretch,
                  percentdraw,
                  totalpercent,
                  percentheight,
                  false,
                  1,
                  CD.filltype,
                  CD.gradienttype,
                  shapefill,
                  lineoption.color,
                  lineoption.width,
                  [0],
                  shadowout,
                  type,
                  false,
                );
                break;
              case 'cylinder':
                ctx.cylinder(x, y, width, height, area, false, true, 1, shapefill, lineoption.color, lineoption.width, [0], shadowout, type);
                break;
            }
            //(x, y, width, height, area, rotate, filltype, gradienttype, fill, stroke, linewidth, dash, shadow)
            ctx.restore();
            datatotal -= datavalue;
          }
          var datatotal = total;
          var elemtotal = total;
          if (type == 'cylinder') {
            HeightA = radout * areapercent;
            var areaarc = HeightA * areameasure;
            var cmeasure = radout + areaarc * 2;
            y = top + areaarc * 2;
          }
          for (i = 0; i < data.length; i++) {
            //var rev = (data.length - 1) - i;
            var ic = i - 1;
            var CD = data[i];
            var CDdeduct;
            if (ic < 0) CDdeduct = 0;
            else CDdeduct = data[ic].value;

            var percentage = datatotal / total;
            CD.filltype = CD.filltype || 'color';
            CD.gradienttype = CD.gradienttype.toString().toLowerCase() || 'linear a';

            var datavalue = NaNCheck(CD.value);
            iheight = length - (top + bottom);
            height = iheight * (datavalue / total); //* percentage;
            //if (percentanimation == 1) console.log(height)

            //if (percentanimation == 1) console.log(y)
            elemtotal -= datavalue;
            //dataheight = iheight * (datavalue / total);
            //elemheight = (iheight * (elemtotal / total)) + (dataheight * 0.5);

            if (type == 'cone') {
            } else {
              if (CD.filltype == 'color') {
              } else if (CD.filltype == 'gradient') {
                var conewidthA, conewidthB;
                var areaA = area / 100,
                  areaB = 1 - areaA;
                if (height > width) {
                  conewidthA = 0;
                  conewidthB = width;
                } else {
                  conewidthA = width * 0.5 - height * 0.5;
                  conewidthB = width * 0.5 + height * 0.5;
                }
                HeightA = HeightFix(width, height, areaA, true);
                HeightB = HeightFix(width, height, areaA, false);

                var gradientx = x - width * 0.75 - conewidthA;
                var gradientwidth = conewidthB; //conelength;
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
              x: x,
              y: y,
              width: width,
              height: height,
              //, dataheight: elemheight
              value: CD.value,
              name: CD.name,
              fill: CD.fill,
              filltype: CD.filltype,
              gradienttype: CD.gradienttype,
              area: area,
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
            };
            if (percentanimation == 1) elementlist.push(element);
            y += height;
          }
          break;
      }
      ctx.restore();

      //Pie Chart
      var startline = -PI / 2;
      var endline = -PI / 2;
      if (click && (type == 'pie' || type == 'doughnut')) {
        for (var i = 0; i < data.length; i++) {
          var CD = data[i];
          var datavalue = NaNCheck(CD.value);
          var measureline;
          switch (type) {
            case 'pie':
              measureline = mid.r * 0.5;
              break;
            case 'doughnut':
              measureline = mid.r * 0.75;
              break;
          }
          var valueline = NaNCheck(abs(datavalue / total));
          var circum = valueline * PI * 2;
          if (i > 0) startline = endline;
          endline += circum;
          var median = (endline + startline) / 2;

          offsetXline = cos(median) * measureline;
          offsetYline = sin(median) * measureline;
          var ydisplay = conh / (data.length * 2) + (conh / data.length) * i;
          ctx.save();
          ctx.beginPath();
          ctx.strokeStyle = 'black';
          ctx.lineWidth = plotlabel.linewidth;
          ctx.moveTo(mid.x + offsetXline, mid.y + offsetYline);
          ctx.lineTo(conw * 0.8, ydisplay);
          ctx.lineJoin = 'round';
          // Arc Parameters: x, y, radius, startingAngle (radians), endingAngle (radians), antiClockwise (boolean)
          //ctx.arc(mid.x + offsetX, mid.y + offsetY, mid.r, start, end, false);
          ctx.stroke();
          ctx.Text(CD.name + ': ' + datavalue, conw * 0.8 + 2, ydisplay, 0, 'black', null, 0, 'align-left', 'middle', plotlabel);
          ctx.restore();
        }
      }

      ctx.labelHFS(option, type);
      //legend();
      ctx.legend(option, type);

      hoverout(option, elementlist, percentanimation, chart);
    } // end animatePie
  } else if (type == 'radar') {
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

    var vA = TBPosition(ctx, option, chart, 'top'), //+ Vpercent3d;
      vB = TBPosition(ctx, option, chart, 'bottom');

    var legendfontheight;
    var labellegendnum = legendarraynum(ctx, option, chart);

    if (legendfont.display) {
      legendfontheight = TextFontHeight(ctx, legendfont) * MaxArray(labellegendnum);
    } else {
      legendfontheight = 0;
    }

    var moveX, moveY;
    switch (legendposition) {
      case 'top':
        moveX = conw * 0.5;
        moveY = conh * 0.5 + legendfontheight;
        break;
      case 'bottom':
        moveX = conw * 0.5;
        moveY = conh * 0.5 - legendfontheight;
        break;
      case 'left':
        if (conh < conw) moveX = conw * 0.5;
        else moveX = conw * 0.5;
        moveY = conh * 0.5;
        break;
      case 'right':
        if (conh < conw) moveX = conw * 0.5;
        else moveX = conw * 0.5;
        moveY = conh * 0.5;
        break;
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
    if (conh < conw) radius = conh;
    else radius = conw;

    var mid = {
      x: moveX,
      y: moveY,
      r: parseInt(radius * 0.5 - (vA + vB)), //* 0.35
    };

    var area = conh * 0.45 - (vA + vB);
    var areaplus = conh * 0.5 - area;

    //Animation
    var radarAnimate;
    animatecanvas(option, canvasID, animateRadar, animation, percent);

    function animateRadar() {
      //ctx = copy_ctx without element bar/line
      var a = ElementID(canvasID);
      if (percent == 100 || !animation) {
        cancelAnimFrame(radarAnimate);
        a.setAttribute('p8animate', false);
        a.setAttribute('p8draw', true);
        percentanimation = 1;
      } else {
        if (percent < 100) {
          radarAnimate = requestAnimFrame(animateRadar, millisecond);
        }
        percentanimation = percent / 100;
        percent++;
      } //end else
      clear(ctx, conw, conh);
      //varCompute
      var varCompute = ComputeCheck(option, area, max, min, 'x'),
        lineDrawCount = LineCount(option, area, max, min, 'x'),
        interval = area / (lineDrawCount - 1),
        varP = VarPcount(option, area, max, min, 'x');

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
          OD.fillcolor = OD.fillcolor || 'black';
          OD.strokecolor = OD.strokecolor || 'black';
          OD.filltype = OD.filltype || 'color';
          OD.style = OD.style || '2d';
          OD.area = OD.area || false;
          OD.dash = OD.dash || [];
          OD.areafilltype = OD.areafilltype || 'color';
          var start = -PI / 2;
          var end = -PI / 2;
          var CD, CDmid, CDmidend, CDOut;
          for (var i = 0; i < data.length; i++) {
            CD = DataInput(data, i, ic);
            if (CD < 0) CD = 0;

            if (i == data.length - 1) {
              CDOut = DataInput(data, 0, ic);
            } else {
              CDOut = DataInput(data, i + 1, ic);
            }
            if (CDOut < 0) CDOut = 0;

            if (stacked && ic > 1) {
              CDmid = 0;
              CDmidend = 0;
              for (var g = 1; g < ic; g++) {
                CD += DataInput(data, i, g);

                if (i == data.length - 1) {
                  CDOut += DataInput(data, 0, g);
                } else {
                  CDOut += DataInput(data, i + 1, g);
                }

                CDmid += DataInput(data, i, g);
                if (i == data.length - 1) {
                  CDmidend += DataInput(data, 0, g);
                } else {
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

            var xstart = conw / 2 + offsetX,
              ystart = conh / 2 + offsetY,
              xmid = conw / 2 + offsetXmid,
              ymid = conh / 2 + offsetYmid,
              xmidend = conw / 2 + offsetXmidend,
              ymidend = conh / 2 + offsetYmidend,
              xend = conw / 2 + offsetXEnd,
              yend = conh / 2 + offsetYEnd;

            //start of line drawing
            switch (output) {
              case 'area':
                if (OD.area) {
                  var areafill;
                  if (OD.areafilltype == 'color') {
                    areafill = OD.areafill;
                  } else if (OD.areafilltype == 'gradient') {
                    var gtypeout = OD.areagradienttype.toString().toLowerCase();
                    switch (gtypeout) {
                      case 'linear a':
                        areafill = GradientLinear(ctx, 0, conh * 0.025, conw, conh, OD.areafill, 0, false, false);
                        break;
                      case 'linear b':
                        areafill = GradientLinear(ctx, 0, conh * 0.025, conw, conh, OD.areafill, 0, true, false);
                        break;
                      case 'linear c':
                        areafill = GradientLinear(ctx, conw * 0.05, 0, conw, conh, OD.areafill, 0, true, true);
                        break;
                      case 'linear d':
                        areafill = GradientLinear(ctx, conw * 0.05, 0, conw, conh, OD.areafill, 0, false, true);
                        break;
                      case 'linear e':
                        areafill = GradientLinear(ctx, conw / 2, conh / 2, conw, conh, OD.areafill, 0, false, true, true);
                        break;
                      case 'linear f':
                        areafill = GradientLinear(ctx, conw / 2, conh / 2, conw, conh, OD.areafill, 0, true, true, true);
                        break;
                      case 'linear g':
                        areafill = GradientLinear(ctx, conw / 2, conh / 2, conw, conh, OD.areafill, 0, false, false, true);
                        break;
                      case 'linear h':
                        areafill = GradientLinear(ctx, conw / 2, conh / 2, conw, conh, OD.areafill, 0, true, false, true);
                        break;
                      case 'radial':
                        areafill = ctx.GradientCircle(conw / 2, conh / 2, area / 5, conw / 2, conh / 2, area, OD.areafill);
                        break;
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
                    } else if (i > 0 && i < data.length - 1) {
                      ctx.lineTo(xstart, ystart);
                      ctx.lineTo(xend, yend);
                    } else if (i == data.length - 1) {
                      ctx.lineTo(xstart, ystart);
                      ctx.lineTo(xend, yend);
                      if (OD.area) ctx.fill();
                      ctx.closePath();
                    }
                  } else {
                    ctx.beginPath();
                    ctx.moveTo(xmid, ymid);
                    ctx.lineTo(xstart, ystart);
                    ctx.lineTo(xend, yend);
                    ctx.lineTo(xmidend, ymidend);
                    if (OD.area) ctx.fill();
                    ctx.closePath();
                  }
                } else {
                  if (i == 0) {
                    ctx.beginPath();
                    ctx.moveTo(xstart, ystart);
                    ctx.lineTo(xend, yend);
                  } else if (i > 0 && i < data.length - 1) {
                    ctx.lineTo(xstart, ystart);
                    ctx.lineTo(xend, yend);
                  } else if (i == data.length - 1) {
                    ctx.lineTo(xstart, ystart);
                    ctx.lineTo(xend, yend);
                    if (OD.area) ctx.fill();
                    ctx.closePath();
                  }
                }
                ctx.restore();

                break;
              case 'line':
                ctx.save();
                //ctx.setLineDash(OD.dash);
                //ctx.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
                ctx.beginPath();
                ctx.strokeStyle = OD.linecolor;
                ctx.lineWidth = OD.linewidth;
                ctx.setLineDash(OD.dash);
                ctx.moveTo(conw / 2 + offsetX, conh / 2 + offsetY);
                ctx.lineTo(conw / 2 + offsetXEnd, conh / 2 + offsetYEnd);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
                break;
              case 'marker':
                var plotmarker = OD.marker || 'o';
                var datacolor = data[i].fillcolor || OD.fillcolor;
                var Areashape = OD.areasize;
                //gradient
                if (OD.filltype == 'gradient') {
                  OD.gradienttype = OD.gradienttype || 'linear a';
                  markerfill = ctx.GradientMarker(OD.fillcolor, OD.gradienttype, plotx, grady, Areashape);
                } else if (OD.filltype == 'color') {
                  markerfill = datacolor;
                }

                markerwidth = OD.strokewidth || 0;
                markerstroke = OD.strokecolor || datacolor;

                var plotmarker = data[i].marker || OD.marker;
                if (!reversedata) {
                  valueout = CD;
                } else {
                  valueout = CD;
                }

                var scaleY = 1;

                ctx.Markers(plotmarker, conw / 2 + offsetX, conh / 2 + offsetY, Areashape, markerwidth, markerfill, markerstroke, scaleY, canvasIDcon, shadow);
                //ctx.Text(CD.name + ": " + datavalue, (conw / 2) + offsetX, (conh / 2) + offsetY, 0, "black", "align-left", "middle", plotlabel);
                break;
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
            };
            if (percentanimation == 1) elementlist.push(element);
          }
        }
      }
      gridlinesdraw(ctx, option, precision, chart);
      ctx.canvaslabel(option, chart, precision, click);
      var RadarArray = [];
      RadarArray.push('area');
      RadarArray.push('line');
      RadarArray.push('marker');
      for (var k = 0; k < RadarArray.length; k++) {
        RadarPoint(option, RadarArray[k]);
      }
      ctx.labelHFS(option, chart);
      ctx.legend(option, chart);
      hoverout(option, elementlist, percentanimation, chart);
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

    var totalbar = TotalBarLine(option, 'bar');
    var totalline = TotalBarLine(option, 'line');

    //var maxbarline = Math.max(totalbar, totalline);

    var GArray = GroupArray(ObjectData);
    var gtotalmax = MaxArray(GroupArrayTotal(GArray));

    var gtotalresult = removeDuplicate(GArray).toString().split(',').map(Number);
    var gtotalresultmax = MaxArray(gtotalresult);

    //plot label
    labelfont.align = labelfont.align || 'center';
    labelfont.position = labelfont.position || 'bottom';

    //checking max and min
    var maxX = MaxMin(option, chart, true),
      minX = MaxMin(option, chart, false);

    var valueuptotal = ValueTotal(option, chart, 'up'),
      valuedowntotal = ValueTotal(option, chart, 'down');

    //vertical line position

    var hB = ctx.BaseNum(option, 'right', precision, chart);

    var labeladdtop, labeladdbottom;
    switch (labelfont.position) {
      case 'top':
        labeladdbottom = 0;
        if (rotatelabel) {
          labeladdtop = 0;
        } else {
          labeladdtop = lmeasureout(ctx, option, precision, chart, 0);
        }
        break;
      case 'bottom':
        labeladdtop = 0;
        if (rotatelabel) {
          labeladdbottom = 0;
        } else {
          labeladdbottom = lmeasureout(ctx, option, precision, chart, 0);
        }
        break;
    }
    var vA = TBPosition(ctx, option, chart, 'top') - labeladdtop,
      vB = TBPosition(ctx, option, chart, 'bottom') - labeladdbottom;

    var area = 80 / data.length / Object.length;
    var areaA = area / 100,
      areaB = 1 - areaA,
      WidthA = WidthFix(hB, vB, areaA, true),
      WidthB = WidthFix(hB, vB, areaA, false),
      HeightA = HeightFix(hB, vB, areaA, true),
      HeightB = HeightFix(hB, vB, areaA, false);

    /*var percent3d;
        if (enable3d)
            percent3d = HeightA;
        else
            percent3d = 0;*/

    var Hpercent3d, Vpercent3d;
    if (enable3d) {
      Hpercent3d = 0; //WidthA;
      Vpercent3d = 0; //HeightA;
      measureright.display = false;
    } else {
      Hpercent3d = 0;
      Vpercent3d = 0;
    }

    var Vpercent;
    if (enable3d) {
      if (stacked) Vpercent = barpercentmeasure(ctx, option, chart, false) * gtotalmax;
      else Vpercent = barpercentmeasure(ctx, option, chart, false);
    } else Vpercent = 0;
    //top
    var vmovey = vA + Vpercent;
    //bottom
    var vposition = vB;
    var HCanvas = vposition - vmovey; //+ Vpercent3d;
    //varCompute
    var varCompute = ComputeCheck(option, vposition, maxX, minX, 'x');
    var lineDrawCount = LineCount(option, vposition, maxX, minX, 'x');
    var intervalH = HCanvas / (lineDrawCount - 1);
    var varP = VarPcount(option, vposition, maxX, minX, 'x');
    for (var i = 0; i < lineDrawCount; i++) {
      if (valueuptotal >= valuedowntotal) {
        cy = parseInt(i * intervalH) + vmovey;
      } else if (valueuptotal < valuedowntotal) {
        cy = parseInt((lineDrawCount - 1 - i) * intervalH) + vmovey;
      }

      if (varP == 0) var YaddB = cy;

      varP -= varCompute;
    }

    var totalValues = varCompute * (lineDrawCount - 1);

    var xnumbase = ctx.BaseNum(option, 'left', precision, chart);
    var numbaseB = hB; //- Hpercent3d;

    var Xorigin = xnumbase + 5; //+ Hpercent3d;;
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
    var p8draw = a.getAttribute('p8draw', true);
    var barlineAnimate;

    if (p8draw != 'true' && p8draw == undefined) {
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
        a.setAttribute('p8animate', false);
        a.setAttribute('p8draw', true);
        percentanimation = 1;
      } else {
        if (percent < 100) {
          canvasAnimate = requestAnimFrame(animateChart, millisecond);
        }
        percent++;
        percentanimation = percent / 100;
      }
      if (animation) clear(ctx, option.size.width, option.size.height);
      gridlinesdraw(ctx, option, precision, chart);

      ctx.save();
      var x, y, width, height, plotx, liney, plotlabeldisplay, plotlabelx, plotlabely, plotlabelbaseline;
      var elementtext, elementgroup, elementvalue;

      function Bubble(option, chart, YaddB) {
        var data = dataarrayoutput(option),
          ObjectData = option.ObjectData,
          bubblelabel = option.bubblelabel || '',
          plotlabel = option.plotlabel;

        var maxbubblearea = 0;
        for (ic = 1; ic <= ObjectData.length; ic++) {
          for (i = 0; i < data.length; i++) {
            var subdata = data[i][Object.keys(data[i])[ic]];
            valuearea = NaNCheck(subdata.area) || NaNCheck(subdata[Object.keys(subdata)[1]]);
            maxbubblearea = valuearea > maxbubblearea ? valuearea : maxbubblearea;
          }
        }
        var xaddW = 0; //addW;
        for (ic = 1; ic <= ObjectData.length; ic++) {
          var OD = ObjectData[ic - 1];
          ODlabel = OD[Object.keys(OD)[0]] || '';
          OD.fillcolor = OD.fillcolor || 'black';
          OD.filltype = OD.filltype || 'color';
          OD.style = OD.style || '2d';
          OD.marker = OD.marker || 'o';
          OD.heat = OD.heat || false;
          OD.showlabel = OD.showlabel || false;
          for (i = 0; i < data.length; i++) {
            var bubblewidth, bubblefill, bubblestroke;
            var subdata = data[i][Object.keys(data[i])[ic]];

            //var datainput = DataInput(data, i, ic);
            var datainput = DataInput(data, i, ic) || NaNCheck(subdata[Object.keys(subdata)[0]]);
            if (datainput > maxset) datainput = maxset;

            valuex = -1 * datainput;

            var x = Xorigin + w * i * ObjectData.length;
            var y = YaddB;
            var width = (w * ObjectData.length) / 2;
            var height = parseInt((valuex / totalValues) * HCanvas);

            if (valuex > 0) y += 1;

            var plotx = parseInt(x + width);
            var liney = parseFloat(y + height) - 1;

            var valuearea = NaNCheck(subdata.area) || NaNCheck(subdata[Object.keys(subdata)[1]]);
            if (valuearea < 0) valuearea = 0;

            var circleradius = round(conh * 0.12);

            var circlewidth = circleradius * (valuearea / maxbubblearea) * percentanimation;

            var datacolor;

            //heat
            if (OD.heat) {
              var htotal = OD.fillcolor.length;
              var heatmeasure = parseInt(maxbubblearea / htotal);

              for (var k = 0; k < htotal; k++) {
                if (k == htotal - 1) {
                  if (circlewidth >= 0 + heatmeasure * k) {
                    datacolor = OD.fillcolor[k].color;
                  }
                } else {
                  if (circlewidth >= 0 + heatmeasure * k && circlewidth < heatmeasure + heatmeasure * k) {
                    datacolor = OD.fillcolor[k].color;
                  }
                }
              }
            } else {
              datacolor = data[i].fillcolor || OD.fillcolor;
            }

            //stroke
            bubblewidth = OD.strokewidth;
            bubblestroke = OD.strokecolor || datacolor;

            //fill
            var elementfill;
            var shine = [];
            shine.push({color: rgba(255, 255, 255, 0.5), stop: 0});
            shine.push({color: datacolor, stop: 0.7});
            if (OD.filltype == 'color') {
              if (OD.style == '3d') bubblefill = ctx.GradientCircle(plotx, liney, circlewidth / 5, plotx, liney - 1, circlewidth, shine);
              else bubblefill = datacolor;
              elementfill = datacolor;
            } else if (OD.filltype == 'gradient') {
              //gradient
              OD.gradienttype = OD.gradienttype || 'radial';
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

              if (ODE.filltype == 'color') {
                var datacolorlist;
                var elementcolor = datacolor;
                if (elementcolor == undefined || j > 1) datacolorlist = ODE.fillcolor;
                else datacolorlist = elementcolor;
                filllistresult = datacolorlist;
              } else if (ODE.filltype == 'gradient') {
                ODE.gradienttype = ODE.gradienttype || 'linear a';
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
            elementX = xnumbase + xtest * i; //x;
            elementwidth = xtest; //width;

            if (valuex < 0) {
              elementY = y + height;
              elementheight = HCanvas; //height * -1;
            } else {
              elementY = y;
              elementheight = HCanvas; //height;
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

            x = Xorigin + w * i * ObjectData.length;
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
            if (click && percentanimation == 1) ctx.Text(arearesult, plotx, liney, 0, plotlabel.color, null, 0, 'center', 'middle', plotlabel);
          }
        }
      }

      function BarLine(option, chart, output, YaddB, percentanimation) {
        var data = dataarrayoutput(option);
        var ObjectData = option.ObjectData;
        var totalbar = TotalBarLine(option, 'bar');
        var totalline = TotalBarLine(option, 'line');
        var plotlabel = option.plotlabel;
        var pattern3d = option.pattern3d;
        plotlabel.custom = plotlabel.custom || false;

        //var dataconsole = [];
        var xaddW = 0; //addW;
        for (ic = 1; ic <= ObjectData.length; ic++) {
          var revic = ObjectData - (ic - 1);
          var OD = ObjectData[ic - 1];
          OD.fillcolor = OD.fillcolor || 'black';
          OD.strokecolor = OD.strokecolor || 'black';
          OD.filltype = OD.filltype || 'color';
          OD.style = OD.style || '2d';
          OD.group = OD.group || {ID: 1, text: 'Group 1'};
          if (OD.group.ID == undefined || OD.group.ID < 1 || OD.group.ID == null) OD.group.ID = 1;
          OD.showlabel = OD.showlabel || false;
          OD.bevel = OD.bevel || false;
          OD.charttype = OD.charttype || 'bar';
          if (enable3d) OD.charttype = 'bar';

          switch (output) {
            case 'bar':
              //bars
              if (OD.charttype == 'bar') {
                for (i = 0; i < data.length; i++) {
                  ctx.save();
                  var valueout, valuex, valuetype;
                  var datainput = DataInput(data, i, ic);
                  if (datainput > maxset) datainput = maxset;

                  if (!reversedata) {
                    valueout = datainput;
                    if (enable3d) {
                      switch (pattern3d) {
                        case 'cylinder':
                          valuex = datainput;
                          break;
                        case 'cone':
                        case 'pyramid':
                          var garray = groupout(option, gtotalresult, false);
                          var percent3dstack;
                          if (stacked) {
                            valuex = stack3d(option, i, ic, datainput, chart, gtotalresult) * -1;
                            percent3dstack = Percent(valuex, stacktotal(option, i, ic, datainput, chart, gtotalresult)) * -1;
                          } else {
                            valuex = datainput * -1;
                            percent3dstack = 100;
                          }

                          break;
                        default:
                          valuex = datainput * -1;
                          break;
                      }
                    } else valuex = datainput;
                  } else {
                    valueout = datainput * -1;
                    valuex = datainput * -1;
                  }

                  valuex = valuex || 0;
                  //color
                  var barfill, elementfill, elementgradient;
                  var datacolor = data[i].fillcolor || OD.fillcolor;

                  var shine = [];
                  shine.push({color: rgba(0, 0, 0, 0), stop: 0});
                  shine.push({color: rgba(255, 255, 255, 0.7), stop: 0.25});
                  shine.push({color: rgba(255, 255, 255, 0.7), stop: 0.35});
                  shine.push({color: rgba(0, 0, 0, 0), stop: 0.8});

                  //stroke
                  OD.strokewidth = OD.strokewidth || 0;

                  barwidth = OD.strokewidth;
                  if (percentstack || stacked || valuex == 0) barwidth = 0;
                  barstroke = OD.strokecolor;

                  //X, Y, Width, Height
                  x = parseFloat(BarX(option, i, w, Xorigin, gtotalresultmax)) + xaddW;

                  y = YaddB;

                  width = BarLength(option, w);
                  if (totalline >= 1) width *= totalline / totalbar + totalline;
                  var group3D = group3dstack(option, i);
                  var scaleX = 1;
                  var scaleY;
                  if (valueout > 0) {
                    if (enable3d) {
                      switch (pattern3d) {
                        case 'cylinder':
                          scaleY = -1;
                          break;
                        default:
                          scaleY = 1;
                      }
                    } else scaleY = -1;
                  } else {
                    if (enable3d) {
                      switch (pattern3d) {
                        case 'cylinder':
                          scaleY = 1;
                          break;
                        case 'cone':
                        case 'pyramid':
                          if (stacked) scaleY = 1;
                          else scaleY = -1;
                          break;
                        default:
                          scaleY = -1;
                      }
                    } else scaleY = 1;
                    valuex *= -1;
                  }

                  var pstacktotal = PercentTotal(option, i);
                  var pstack = Percent(valuex / totalValues, pstacktotal);

                  //For Stacked Bar
                  if (stacked && !percentstack) {
                    var gs = gtotalmax * gtotalresultmax;
                    width *= totalbar;
                    width /= gtotalresultmax;

                    x += width * (OD.group.ID - 1);
                    for (var g = 1; g < ic; g++) {
                      valuexAdd = Stack(option, valuex, ic, i, g, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                      y += valuexAdd / gs;
                    }
                  }

                  //For Percentage Stack
                  if (percentstack) {
                    width *= totalbar;
                    for (var g = 1; g < ic; g++) {
                      valuexAddpercent = PStack(option, i, g, valuex, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                      y += valuexAddpercent / ObjectData.length;
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
                        case 'cone':
                          height /= gtotalmax;
                          break;
                        default:
                          height /= gtotalmax;
                          break;
                      }
                    } else {
                      height /= gtotalmax;
                    }
                  }

                  //For Percentage Stack
                  if (percentstack) {
                    height = pstack * HCanvas * percentanimation;
                  }

                  //gradient
                  if (OD.filltype == 'gradient') {
                    var gtypeout = OD.gradienttype || 'linear a';
                    gtypeout = gtypeout.toLowerCase();
                    var grad = [];
                    for (var j = 0; j < OD.fillcolor.length; j++) {
                      grad.push({
                        color: OD.fillcolor[j].color,
                        stop: OD.fillcolor[j].stop,
                      });
                    }
                    switch (gtypeout) {
                      case 'linear a':
                        barfill = GradientLinear(ctx, 0, y, width, height, grad, 0, false, false);
                        break;
                      case 'linear b':
                        barfill = GradientLinear(ctx, 0, y, width, height, grad, 0, true, false);
                        break;
                      case 'linear c':
                        barfill = GradientLinear(ctx, x, 0, width, height, grad, 0, true, true);
                        break;
                      case 'linear d':
                        barfill = GradientLinear(ctx, x, 0, width, height, grad, 0, false, true);
                        break;
                      case 'linear e':
                        if (valuex < 0) barfill = GradientLinear(ctx, x, y, width, height, grad, 0, false, false, true);
                        else barfill = GradientLinear(ctx, x, y, width, height, grad, 0, true, true, true);
                        break;
                      case 'linear f':
                        if (valuex < 0) barfill = GradientLinear(ctx, x, y, width, height, grad, 0, true, false, true);
                        else barfill = GradientLinear(ctx, x, y, width, height, grad, 0, false, true, true);
                        break;
                      case 'linear g':
                        if (valuex < 0) barfill = GradientLinear(ctx, x, y, width, height, grad, 0, false, true, true);
                        else barfill = GradientLinear(ctx, x, y, width, height, grad, 0, true, false, true);
                        break;
                      case 'linear h':
                        if (valuex < 0) barfill = GradientLinear(ctx, x, y, width, height, grad, 0, true, true, true);
                        else barfill = GradientLinear(ctx, x, y, width, height, grad, 0, false, false, true);
                        break;
                    }
                  } else if (OD.filltype == 'color') {
                    //if (OD.style == "2d") {
                    //    barfill = datacolor;
                    //}
                    //else if (OD.style == "3d") {
                    //    barfill = GradientLinear(ctx, x, 0, width, height, shine, 0, false, true);
                    //}
                    barfill = datacolor;
                    shinefill = GradientLinear(ctx, x, 0, width, height, shine, 0, false, true);
                  }
                  if (OD.bevel) ctx.bevelbar(valueout, x, y, width, height, barwidth, barfill, barstroke, chart, shadow);
                  else {
                    if (enable3d) {
                      var stretch = true;
                      var bar = true;

                      switch (pattern3d) {
                        case 'cylinder':
                          ctx.cylinder(x, y, width, height, 20, bar, true, scaleY, barfill, barstroke, barwidth, [0], shadow, chart, option, ic, i, 1, Gout, null);
                          break;
                        case 'cone':
                          ctx.cone(
                            x,
                            y,
                            width,
                            height,
                            10,
                            0,
                            stretch,
                            percent3dstack,
                            0,
                            height,
                            bar,
                            false,
                            scaleY,
                            OD.filltype,
                            OD.gradienttype,
                            barfill,
                            barstroke,
                            barwidth,
                            [0],
                            shadow,
                            Gout[ic - 1],
                            option,
                            ic,
                            i,
                          );
                          break;
                        case 'pyramid':
                          ctx.pyramid(
                            x,
                            y,
                            width,
                            height,
                            20,
                            0,
                            bar,
                            stretch,
                            percent3dstack,
                            0,
                            height,
                            false,
                            scaleY,
                            OD.filltype,
                            OD.gradienttype,
                            barfill,
                            barstroke,
                            barwidth,
                            [0],
                            shadow,
                            chart,
                            option,
                            1,
                            ic,
                            i,
                            Gout,
                          );
                          break;
                        default: //"bar"
                          ctx.Bar3D(x, y, width, height, 20, 0, barfill, '', 0, [0], shadow, true, scaleY, option, group3D[ic - 1], ic, i, chart, Gout, null);
                          break;
                      }
                    } else {
                      ctx.drawbar(x, y, width, height, barwidth, barfill, barstroke, shadow);
                      if (OD.style == '3d') ctx.drawbar(x, y, width, height, barwidth, shinefill, barstroke, nullshadow);
                    }
                  }

                  if (!reversedata) elementvalue = valuex;
                  else elementvalue = valuex * -1;

                  data[i].text = data[i].text || '';

                  if (plotlabel.custom) plotlabeldisplay = data[i].text;
                  else plotlabeldisplay = parseInt(elementvalue * percentanimation);

                  plotlabely = y + height;

                  if (valuex <= 0) plotlabelbaseline = 'alphabetic';
                  else plotlabelbaseline = 'hanging';

                  //if ((click
                  //    || plotlabel.display)
                  //    && percentanimation == 1) ctx.Text(plotlabeldisplay, x + (width / 2), plotlabely, 0, plotlabel.color, null, 0, "center", plotlabelbaseline, plotlabel);
                  ctx.restore();
                  //dataconsole.push(valuex)
                }
                if (!stacked && !percentstack) xaddW += width;
              }
              break;
            case 'line':
              //lines and plots
              if (OD.charttype == 'line') {
                ctx.save();
                var linestroke;
                OD.areafill == OD.areafill || rgba(0, 0, 0, 0);
                OD.area = OD.area || false;
                OD.dash = OD.dash || [];
                OD.areafilltype = OD.areafilltype || 'color';
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
                    } else {
                      valueout = datainput * -1;
                      valuex = datainput * -1;
                    }
                    //var x, width;
                    if (totalbar >= 1) x = Xorigin + w * i * ObjectData.length;
                    else x = LineX(option, i, widthtotal, Xorigin);

                    if (totalbar >= 1) width = (w * ObjectData.length) / 2;
                    else width = 1;

                    y = YaddB;

                    var scaleX = 1;

                    if (valueout > 0) {
                      var scaleY = 1;
                      valuex *= -1;
                    } else {
                      var scaleY = 1;
                      valuex *= -1;
                    }

                    var pstacktotal = PercentTotal(option, i);
                    var pstack = Percent(valuex / totalValues, pstacktotal);

                    //For Stacked Line
                    if (stacked && !percentstack) {
                      for (var g = 1; g < ic; g++) {
                        valuexAdd = Stack(option, valuex, ic, i, g, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                        y += valuexAdd / gs;
                      }
                    }
                    //For Percentage Stack
                    if (percentstack) {
                      for (var g = 1; g < ic; g++) {
                        valuexAddpercent = PStack(option, i, g, valuex, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                        y += valuexAddpercent / ObjectData.length;
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
                      height = pstack * HCanvas * percentanimation;
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
                    curvearea.push({x: Xshape, y: Yshape});
                    //ctx.restore();
                  }

                  //y = YaddB;
                  //if (totalbar >= 1) x = Xorigin + (w * i * (ObjectData.length));
                  //else x = LineX(option, i, widthtotal, Xorigin);

                  var startpoint = {x: Xorigin + w * 0 * ObjectData.length, y: YaddB},
                    endpoint = {x: Xorigin + w * (data.length - 1) * ObjectData.length, y: YaddB};

                  drawCurveArea(OD, ctx, curvearea, YaddB, curvetension, false, curvesegments);
                } else {
                  for (i = 0; i < data.length; i++) {
                    ctx.save();
                    var datainput = DataInput(data, i, ic);
                    if (datainput > maxset) datainput = maxset;
                    //if (percentanimation == 1) console.log(datainput)
                    if (!reversedata) {
                      valueout = datainput;
                      valuex = datainput;
                    } else {
                      valueout = datainput * -1;
                      valuex = datainput * -1;
                    }
                    //var x, width;
                    if (totalbar >= 1) x = Xorigin + w * i * ObjectData.length;
                    else x = LineX(option, i, widthtotal, Xorigin);

                    if (totalbar >= 1) width = (w * ObjectData.length) / 2;
                    else width = 1;

                    y = YaddB;

                    var scaleX = 1;

                    if (valueout > 0) {
                      var scaleY = -1;
                    } else {
                      var scaleY = 1;
                      valuex *= -1;
                    }

                    var pstacktotal = PercentTotal(option, i);
                    var pstack = Percent(valuex / totalValues, pstacktotal);

                    //For Stacked Line
                    if (stacked && !percentstack) {
                      for (var g = 1; g < ic; g++) {
                        valuexAdd = Stack(option, valuex, ic, i, g, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                        y += valuexAdd / gs;
                      }
                    }
                    //For Percentage Stack
                    if (percentstack) {
                      for (var g = 1; g < ic; g++) {
                        valuexAddpercent = PStack(option, i, g, valuex, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                        y += valuexAddpercent / ObjectData.length;
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
                      height = pstack * HCanvas * percentanimation;
                    }

                    plotx = parseInt(x + width);
                    liney = parseFloat(y + height);
                    //if (valuex > 0) liney;
                    //if (valuex <= 0) liney += 1;

                    //gradient
                    if (OD.areafilltype == 'gradient') {
                      var gtypeout = OD.areagradienttype || 'linear a';
                      gtypeout = gtypeout.toLowerCase();

                      /*for (k = 0; k < data.length; k++) {
                                                var areavalue = (data[k][Object.keys(data[k])[ic]]);
                                            }*/

                      var areaheight, ygradient;
                      var areafillup = AreaFillTotal(option, 'up'),
                        areafilldown = AreaFillTotal(option, 'down');
                      if (areafillup == 1) {
                        areaheight = HCanvas * percentanimation;
                        ygradient = y;
                      } else if (areafilldown == 1) {
                        areaheight = HCanvas * percentanimation;
                        ygradient = y;
                      } else if (areafillup != data.length && areafilldown != data.length) {
                        areaheight = HCanvas * percentanimation;
                        ygradient = vposition;
                      }
                      var grad = [];
                      for (var j = 0; j < OD.areafill.length; j++) {
                        grad.push({
                          color: OD.areafill[j].color,
                          stop: OD.areafill[j].stop,
                        });
                      }
                      switch (gtypeout) {
                        case 'linear a':
                          areafill = GradientLinear(ctx, 0, ygradient, conw, areaheight, grad, 0, false, false);
                          break;
                        case 'linear b':
                          areafill = GradientLinear(ctx, 0, ygradient, conw, areaheight, grad, 0, true, false);
                          break;
                        case 'linear c':
                          areafill = GradientLinear(ctx, xnumbase, 0, conw, areaheight, grad, 0, true, true);
                          break;
                        case 'linear d':
                          areafill = GradientLinear(ctx, xnumbase, 0, conw, areaheight, grad, 0, false, true);
                          break;
                        /*case "linear e":
                                                        if (valuex < 0) areafill = GradientLinear(ctx, 0, 0, conw, areaheight, grad, 0, false, false, true);
                                                        else areafill = GradientLinear(ctx, 0, 0, conw, areaheight, grad, 0, true, true, true);
                                                        break
                                                    case "linear f":
                                                        if (valuex < 0) areafill = GradientLinear(ctx, 0, 0, conw, areaheight, grad, 0, true, false, true);
                                                        else areafill = GradientLinear(ctx, 0, 0, conw, areaheight, grad, 0, false, true, true);
                                                        break
                                                    case "linear g":
                                                        if (valuex < 0) areafill = GradientLinear(ctx, 0, 0, conw, areaheight, grad, 0, true, false, true);
                                                        else areafill = GradientLinear(ctx, 0, 0, conw, areaheight, grad, 0, false, true, true);
                                                        break
                                                    case "linear h":
                                                        if (valuex < 0) areafill = GradientLinear(ctx, 0, 0, conw, areaheight, grad, 0, false, false, true);
                                                        else areafill = GradientLinear(ctx, 0, 0, conw, areaheight, grad, 0, true, true, true);
                                                        break*/
                      }
                    } else if (OD.areafilltype == 'color') {
                      areafill = OD.areafill;
                    }
                    //start of area drawing
                    function arealine() {
                      ctx.save();
                      ctx.setLineDash(OD.dash);
                      ctx.shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
                      ctx.fillStyle = areafill;
                      var curveadd;
                      if (valuex > 0) curveadd = 10;
                      else curveadd = -10;
                      if (i >= 1) {
                        ctx.save();
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
                    } else {
                      valueout = datainput * -1;
                      valuex = datainput * -1;
                    }
                    //var x, width;
                    if (totalbar >= 1) x = Xorigin + w * i * ObjectData.length;
                    else x = LineX(option, i, widthtotal, Xorigin);

                    if (totalbar >= 1) width = (w * ObjectData.length) / 2;
                    else width = 1;

                    y = YaddB;

                    var scaleX = 1;

                    if (valueout > 0) {
                      var scaleY = 1;
                      valuex *= -1;
                    } else {
                      var scaleY = 1;
                      valuex *= -1;
                    }

                    var pstacktotal = PercentTotal(option, i);
                    var pstack = Percent(valuex / totalValues, pstacktotal);

                    //For Stacked Line
                    if (stacked && !percentstack) {
                      for (var g = 1; g < ic; g++) {
                        valuexAdd = Stack(option, valuex, ic, i, g, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                        y += valuexAdd / gs;
                      }
                    }
                    //For Percentage Stack
                    if (percentstack) {
                      for (var g = 1; g < ic; g++) {
                        valuexAddpercent = PStack(option, i, g, valuex, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                        y += valuexAddpercent / ObjectData.length;
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
                      height = pstack * HCanvas * percentanimation;
                    }

                    plotx = parseFloat(x + width);
                    liney = parseFloat(y + height);
                    //if (valuex > 0) liney;

                    //if (valuex <= 0) liney;
                    //if (valuex > 0) liney += 1;

                    //for markers
                    var Xshape = plotx;
                    var Yshape = liney;
                    curvearray.push({x: Xshape, y: Yshape});
                  }

                  drawCurve(OD, ctx, curvearray, curvetension, false, curvesegments);
                  //if (percentanimation == 1) console.log(getCurvePoints(curvearray, 0.5, false, 16));
                } else {
                  for (i = 0; i < data.length; i++) {
                    ctx.save();
                    var datainput = DataInput(data, i, ic);
                    if (datainput > maxset) datainput = maxset;

                    if (!reversedata) {
                      valueout = datainput;
                      valuex = datainput;
                    } else {
                      valueout = datainput * -1;
                      valuex = datainput * -1;
                    }

                    //var x, width;
                    if (totalbar >= 1) x = Xorigin + w * i * ObjectData.length;
                    else x = LineX(option, i, widthtotal, Xorigin);

                    if (totalbar >= 1) width = (w * ObjectData.length) / 2;
                    else width = 1;

                    y = YaddB;

                    var scaleX = 1;

                    if (valueout > 0) {
                      var scaleY = -1;
                    } else {
                      var scaleY = 1;
                      valuex *= -1;
                    }

                    var pstacktotal = PercentTotal(option, i);
                    var pstack = Percent(valuex / totalValues, pstacktotal);

                    //For Stacked Line
                    if (stacked && !percentstack) {
                      var gs = gtotalmax * gtotalresultmax;

                      for (var g = 1; g < ic; g++) {
                        valuexAdd = Stack(option, valuex, ic, i, g, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                        y += valuexAdd / gs;
                      }
                    }

                    //For Percentage Stack
                    if (percentstack) {
                      for (var g = 1; g < ic; g++) {
                        valuexAddpercent = PStack(option, i, g, valuex, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                        y += valuexAddpercent / ObjectData.length;
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
                      height = pstack * HCanvas * percentanimation;
                    }

                    plotx = parseInt(x + width);
                    liney = parseFloat(y + height);

                    ctx.lineWidth = OD.linewidth;

                    linestroke = OD.linecolor;

                    if (OD.linecolor == undefined) {
                      if (!OD.area) {
                        if (OD.filltype == 'gradient') linestroke = OD.fillcolor[OD.fillcolor.length - 1].color;
                        else if (OD.filltype == 'color') linestroke = OD.fillcolor;
                      } else linestroke = rgba(0, 0, 0, 0);
                    }

                    if (OD.filltype == 'gradient') {
                      OD.gradienttype = OD.gradienttype || 'linear a';
                      var elementgrad = [];
                      for (var j = 0; j < OD.fillcolor.length; j++) {
                        elementgrad.push(OD.fillcolor[j].color);
                      }
                      elementfill = elementgrad;
                    } else if (OD.filltype == 'color') {
                      var datacolor = data[i].fillcolor || OD.fillcolor;
                      /*if (data[i].fillcolor == undefined) datacolor = OD.fillcolor;
                                            else datacolor = data[i].fillcolor;*/
                      elementfill = datacolor;
                    }

                    //line dash
                    OD.dash = OD.dash || [];

                    //cap and join
                    OD.cap = OD.cap || 'round';
                    OD.join = OD.join || 'round';

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
                plots(ctx, OD, ic, chart, YaddB, Xorigin);
                ctx.restore();
              } //end data loop
              break;
            case 'scatter':
              plots(ctx, OD, ic, chart, YaddB, Xorigin);
              break;
          }
        } //end ObjectData loop

        if (totalline == 0) {
          Line(ctx, xnumbase + 5, parseInt(YaddB) + 0.5, XCanvas - Vpercent, parseInt(YaddB) + 0.5, gridline.width, gridline.color, nullshadow);
          if (ic == ObjectData.length + 1) Line(ctx, XCanvas - Vpercent, parseInt(YaddB) + 0.5, XCanvas, parseInt(YaddB - Vpercent) + 0.5, gridline.width, gridline.color, nullshadow);
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
            } else {
              valueout = datainput * -1;
              valuex = datainput * -1;
            }

            //var x, width;
            if (totalbar >= 1 || chart == 'scatter') x = Xorigin + w * i * ObjectData.length;
            else x = LineX(option, i, widthtotal, Xorigin);

            if (totalbar >= 1 || chart == 'scatter') width = (w * ObjectData.length) / 2;
            else width = 1;

            y = YaddB;

            var scaleX = 1;

            if (valueout > 0) {
              var scaleY = -1;
            } else {
              var scaleY = 1;
              valuex *= -1;
            }

            var pstacktotal = PercentTotal(option, i);
            var pstack = Percent(valuex / totalValues, pstacktotal);

            //For Stacked Plot
            if (stacked && !percentstack) {
              gs = gtotalmax * gtotalresultmax;
              for (var g = 1; g < ic; g++) {
                valuexAdd = Stack(option, valuex, ic, i, g, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                y += valuexAdd / gs;
              }
            }
            //For Percentage Stack
            if (percentstack) {
              for (var g = 1; g < ic; g++) {
                valuexAddpercent = PStack(option, i, g, valuex, percentanimation, gtotalresult, totalValues, HCanvas, false, false, scaleY);
                y += valuexAddpercent / ObjectData.length;
              }
            }

            ctx.scale(scaleX, scaleY);
            x /= scaleX;
            y /= scaleY;

            if (!percentstack) height = (valuex / totalValues) * HCanvas * percentanimation;

            //For Stacked Plot
            if (stacked && !percentstack) {
              height /= gtotalmax;
            }
            //For Percentage Stack
            if (percentstack) {
              height = pstack * HCanvas * percentanimation;
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
            if (OD.filltype == 'gradient') {
              OD.gradienttype = OD.gradienttype || 'linear a';
              markerfill = ctx.GradientMarker(OD.fillcolor, OD.gradienttype, plotx, grady, Areashape);
            } else if (OD.filltype == 'color') {
              markerfill = datacolor;
            }

            markerwidth = OD.strokewidth || 0;
            markerstroke = OD.strokecolor || datacolor;

            var plotmarker = data[i].marker || OD.marker;
            //if (data[i].marker == undefined) plotmarker = OD.marker;

            if (chart == 'scatter') {
              ctx.Markers(plotmarker, Xshape, Yshape, Areashape, markerwidth, markerfill, markerstroke, scaleY, canvasIDcon, shadow);
            } else {
              if (data.length > 50) break;

              if (!OD.area) ctx.Markers(plotmarker, Xshape, Yshape, Areashape, markerwidth, markerfill, markerstroke, scaleY, canvasIDcon, shadow);
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
              if (OD.filltype == 'gradient') linestroke = OD.fillcolor[OD.fillcolor.length - 1].color;
              else if (OD.filltype == 'color') linestroke = OD.fillcolor;
            } else linestroke = rgba(0, 0, 0, 0);
          }

          //line dash
          OD.dash = OD.dash || [];

          //cap and join
          OD.cap = OD.cap || 'round';
          OD.join = OD.join || 'round';

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
          tension = typeof tension != 'undefined' ? tension : 0.5;
          isClosed = isClosed ? isClosed : false;
          numOfSegments = numOfSegments ? numOfSegments : 16;

          var inputpts = [];
          for (i = 0; i < pts.length; i++) {
            inputpts.push(pts[i].x);
            inputpts.push(pts[i].y);
          }

          var _pts = [],
            res = [], // clone array
            x,
            y, // our x,y coords
            t1x,
            t2x,
            t1y,
            t2y, // tension vectors
            c1,
            c2,
            c3,
            c4, // cardinal points
            st,
            t,
            i; // steps based on num. of segments

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
          } else {
            _pts.unshift(inputpts[1]); //copy 1. point and insert at beginning
            _pts.unshift(inputpts[0]);
            _pts.push(inputpts[inputpts.length - 2]); //copy last point and append
            _pts.push(inputpts[inputpts.length - 1]);
          }

          // ok, lets start..

          // 1. loop goes through point array
          // 2. loop goes through each segment between the 2 pts + 1e point before and after
          for (i = 2; i < _pts.length - 4; i += 2) {
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
        var xaddWtxt = 0; //addW;
        for (ic = 1; ic <= ObjectData.length; ic++) {
          var OD = ObjectData[ic - 1];
          OD.showlabel = OD.showlabel || false;
          OD.prefix = OD.prefix || '';
          OD.suffix = OD.suffix || '';
          if (OD.charttype == 'bar') {
            for (i = 0; i < data.length; i++) {
              ctx.save();
              var datainput = DataInput(data, i, ic);
              if (datainput > maxset) datainput = maxset;
              var valueout, valuex;
              if (!reversedata) {
                valueout = datainput;
                valuex = datainput;
              } else {
                valueout = datainput * -1;
                valuex = datainput * -1;
              }

              valuex = valuex || 0;

              //X, Y, Width, Height
              x = parseFloat(BarX(option, i, w, Xorigin, gtotalresultmax) + xaddWtxt);

              y = YaddB;

              width = BarLength(option, w);
              if (totalline >= 1) width *= totalline / totalbar + totalline;

              var scaleX = 1;
              var stackscale;
              if (valueout > 0) {
                var scaleY = 1;
                stackscale = -1;
              } else {
                var scaleY = 1;
                valuex *= -1;
                stackscale = 1;
              }

              var pstacktotal = PercentTotal(option, i);
              var pstack = Percent(valuex / totalValues, pstacktotal);

              //For Stacked Bar
              if (stacked && !percentstack) {
                var gs = gtotalmax * gtotalresultmax;
                width *= totalbar;
                width /= gtotalresultmax;

                x += width * (OD.group.ID - 1);
                for (var g = 1; g < ic; g++) {
                  valuexAdd = Stack(option, valuex, ic, i, g, percentanimation, gtotalresult, totalValues, HCanvas, false, false, stackscale); //* -1;
                  y += valuexAdd / gs;
                }
              }

              //For Percentage Stack
              if (percentstack) {
                width *= totalbar;
                for (var g = 1; g < ic; g++) {
                  valuexAddpercent = PStack(option, i, g, valuex, percentanimation, gtotalresult, totalValues, HCanvas, false, false, stackscale); //* -1;
                  y += valuexAddpercent / ObjectData.length;
                }
              }
              if (width < 1) width = 1;

              ctx.scale(scaleX, scaleY);
              x /= scaleX;
              y /= scaleY;

              if (valueout > 0) y;
              if (valueout <= 0) y;

              if (!percentstack) height = parseFloat((valuex / totalValues) * HCanvas); //* -1;

              //For Stacked Bar
              if (stacked && !percentstack) {
                height /= gtotalmax;
              }

              //For Percentage Stack
              if (percentstack) {
                height = pstack * HCanvas;
              }

              //console.log(datainput)
              if (!reversedata) elementvalue = datainput;
              else elementvalue = datainput * -1;

              var valuerev;
              if (convert) valuerev = convertnum(elementvalue).toString();
              else valuerev = elementvalue.toString();

              //if (percentstack) elementvalue = Num(option, chart, valuerev, "x", false, false, precision);
              //else elementvalue = Num(option, chart, valuerev, "x", false, convert, precision);

              data[i].text = data[i].text || '';

              if (plotlabel.custom) plotlabeldisplay = data[i].text;
              else plotlabeldisplay = OD.prefix + valuerev + OD.suffix;
              if (datainput <= 0) plotlabely = y + height;
              else plotlabely = y - height;

              if (datainput > 0) plotlabelbaseline = 'alphabetic';
              else plotlabelbaseline = 'hanging';

              var plotlabeloutput = plotlabeldisplay.toString();

              var plotfill = plotlabel.fill || rgba(0, 0, 0, 0);
              if ((click || plotlabel.display) && percentanimation == 1) {
                ctx.rectangle(
                  x + width * 0.5 - (ctx.FontWidth(plotlabeloutput, plotlabel) + 5) * 0.5,
                  plotlabely - TextFontHeight(ctx, plotlabel) + 5,
                  ctx.FontWidth(plotlabeloutput, plotlabel) + 5,
                  TextFontHeight(ctx, plotlabel) + 5,
                  0,
                  0,
                  plotfill,
                  'black',
                  [0],
                  nullshadow,
                );
                ctx.Text(plotlabeloutput, x + width * 0.5, plotlabely, 0, plotlabel.color, null, 0, 'center', plotlabelbaseline, plotlabel);
              }
              ctx.restore();
            }
            //ctx.Line((xnumbase + 5), round(YaddB) + 0.5, XCanvas, round(YaddB) + 0.5, gridline.width, gridline.color);
            if (!stacked && !percentstack) xaddWtxt += width;
          } else if (OD.charttype == 'line') {
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
              } else {
                valueout = datainput * -1;
                valuex = datainput * -1;
              }

              //var x, width;
              if (totalbar >= 1) x = Xorigin + w * i * ObjectData.length;
              else x = LineX(option, i, widthtotal, Xorigin);

              if (totalbar >= 1) width = (w * ObjectData.length) / 2;
              else width = 1;

              y = YaddB - (OD.areasize + 2);

              var scaleX = 1;
              var stackscale;
              if (valueout > 0) {
                var scaleY = 1;
                stackscale = -1;
              } else {
                var scaleY = 1;
                valuex *= -1;
                stackscale = 1;
              }

              var pstacktotal = PercentTotal(option, i);
              var pstack = Percent(valuex / totalValues, pstacktotal);

              //For Stacked Plot
              if (stacked && !percentstack) {
                gs = gtotalmax * gtotalresultmax;
                for (var g = 1; g < ic; g++) {
                  valuexAdd = Stack(option, valuex, ic, i, g, percentanimation, gtotalresult, totalValues, HCanvas, false, false, stackscale);
                  y += valuexAdd / gs;
                }
              }
              //For Percentage Stack
              if (percentstack) {
                for (var g = 1; g < ic; g++) {
                  valuexAddpercent = PStack(option, i, g, valuex, percentanimation, gtotalresult, totalValues, HCanvas, false, false, stackscale);
                  y += valuexAddpercent / ObjectData.length;
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
                height = pstack * HCanvas;
              }

              if (!reversedata) elementvalue = datainput;
              else elementvalue = datainput * -1;

              var valuerev;
              if (convert) valuerev = convertnum(elementvalue).toString();
              else valuerev = elementvalue.toString();

              data[i].text = data[i].text || '';

              if (plotlabel.custom) plotlabeldisplay = data[i].text;
              else plotlabeldisplay = OD.prefix + valuerev + OD.suffix;

              var plotlabeloutput = plotlabeldisplay.toString();

              if (datainput <= 0) plotlabely = y + height - OD.areasize;
              else plotlabely = y - height - OD.areasize;

              //if (datainput > 0) plotlabelbaseline = "middle";
              //else plotlabelbaseline = "middle";
              plotlabelbaseline = 'alphabetic';
              var plotfill = plotlabel.fill || rgba(0, 0, 0, 0);
              if ((click || plotlabel.display) && percentanimation == 1) {
                ctx.rectangle(
                  x + width - (ctx.FontWidth(plotlabeloutput, plotlabel) + 5) * 0.5,
                  parseInt(plotlabely - TextFontHeight(ctx, plotlabel)) + 1,
                  ctx.FontWidth(plotlabeloutput, plotlabel) + 5,
                  TextFontHeight(ctx, plotlabel) + 2,
                  0,
                  0,
                  plotfill,
                  'black',
                  [0],
                  nullshadow,
                );
                ctx.Text(plotlabeloutput, x + width, plotlabely, 0, plotlabel.color, null, 0, 'center', plotlabelbaseline, plotlabel);
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
          ODlabel = OD[Object.keys(OD)[0]] || '';
          OD.fillcolor = OD.fillcolor || 'black';
          OD.filltype = OD.filltype || 'color';
          OD.style = OD.style || '2d';
          for (i = 0; i < data.length; i++) {
            var datacolor = data[i].fillcolor;
            if (data[i].fillcolor == undefined || ic > 1) datacolor = OD.fillcolor;
            if (OD.strokewidth == undefined || OD.strokewidth < 0) OD.strokewidth = 1;
            var subdata = data[i][Object.keys(data[i])[ic]];
            //var OHLCarray = [subdata.open, subdata.high, subdata.low, subdata.close];
            var x;
            x = Xorigin + 5 + w * i * ObjectData.length;
            y = YaddB;
            var width;
            width = (w * 0.9 * ObjectData.length) / 2; //w * 0.9;
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
            open = parseInt(y + (openinput / totalValues) * HCanvas * -1);
            high = parseInt(y + (highinput / totalValues) * HCanvas * -1);
            low = parseInt(y + (lowinput / totalValues) * HCanvas * -1);
            close = parseInt(y + (closeinput / totalValues) * HCanvas * -1);

            //gradient
            var GradX = parseInt(plotx) - width / 2; //plotx;// - Areashape;
            var GradY = open; //liney - Areashape;
            var GradH = close - open;
            var GradDX = GradX; // - (GradH * 0.5);
            var GradDY = GradY; // - (GradH * 0.5);
            if (OD.filltype == 'gradient') {
              var gtypeout = OD.gradienttype || 'linear a';
              gtypeout = gtypeout.toLowerCase();
              var grad = [];
              for (var k = 0; k < ObjectData[ic - 1].fillcolor.length; k++) {
                grad.push({
                  color: OD.fillcolor[k].color,
                  stop: OD.fillcolor[k].stop,
                });
              }
              var Areashape = width * height;
              switch (gtypeout) {
                case 'linear a':
                  candlefill = GradientLinear(ctx, 0, GradY, width, GradH, grad, 0, true, false);
                  break;
                case 'linear b':
                  candlefill = GradientLinear(ctx, 0, GradY, width, GradH, grad, 0, false, false);
                  break;
                case 'linear c':
                  candlefill = GradientLinear(ctx, GradX, 0, width, GradH, grad, 0, true, true);
                  break;
                case 'linear d':
                  candlefill = GradientLinear(ctx, GradX, 0, width, GradH, grad, 0, false, true);
                  break;
                case 'linear e':
                  candlefill = GradientLinear(ctx, GradDX, GradDY, width, GradH, grad, 0, false, true, true);
                  break;
                case 'linear f':
                  candlefill = GradientLinear(ctx, GradDX, GradDY, width, GradH, grad, 0, true, true, true);
                  break;
                case 'linear g':
                  candlefill = GradientLinear(ctx, GradDX, GradDY, width, GradH, grad, 0, false, false, true);
                  break;
                case 'linear h':
                  candlefill = GradientLinear(ctx, GradDX, GradDY, width, GradH, grad, 0, true, false, true);
                  break;
                //case "radial": candlefill = ctx.GradientCircle(open, close, width / 5, open, close - 1, width, grad); break
              }
            } else if (OD.filltype == 'color') {
              if (OD.style == '2d') {
                candlefill = datacolor;
              } else if (OD.style == '3d') {
                var shine = [];
                shine.push({color: datacolor, stop: 0});
                shine.push({color: 'white', stop: 0.25});
                shine.push({color: datacolor, stop: 0.5});
                //candlefill = GradientH(open, width, close, shine, ctx, false);
                candlefill = GradientLinear(ctx, GradX, 0, width, GradH, shine, 0, false, true);
              }
            }

            candlewidth = OD.strokewidth;
            candlestroke = OD.strokecolor || datacolor;

            if (data.length > 50) break;
            if (openinput < closeinput && OD.marker == 'candlestick') candlefill = 'white';
            //else candlefill = OD.fillcolor;
            ctx.globalAlpha = percentanimation;
            switch (OD.marker) {
              case 'candlestick':
                ctx.candlestick(plotx, open, high, low, close, width, candlefill, candlestroke, candlewidth, shadow);
                break;
              case 'OHLC':
                ctx.OHLCsign(plotx, open, high, low, close, width, candlefill, 2, shadow);
                break;
            }
          }
          for (j = 0; j < OHLC.length; j++) {
            duration.metric = duration.metric || false;

            for (i = 0; i < data.length; i++) {
              var datacolor = data[i].fillcolor;
              if (data[i].fillcolor == undefined || ic > 1) datacolor = OD.fillcolor;
              var subdata = data[i][Object.keys(data[i])[ic]]; //data[i].value[ic - 1];
              valuex = -1 * parseFloat(subdata[Object.keys(subdata)[j]]);
              var x;
              x = Xorigin + 5 + w * i * ObjectData.length;
              y = YaddB;
              var width;
              width = (w * 0.9 * ObjectData.length) / 2; //w * 0.9;
              height = parseInt((valuex / totalValues) * HCanvas);

              if (valuex > 0) y += 1;

              plotx = x + width;

              //gradient
              if (OD.filltype == 'gradient') {
                gtypeout = OD.gradienttype || 'linear a';
                var grad = [];
                var elementgrad = [];
                for (var k = 0; k < ObjectData[ic - 1].fillcolor.length; k++) {
                  grad.push({
                    color: OD.fillcolor[k].color,
                    stop: OD.fillcolor[k].stop,
                  });
                  elementgrad.push(OD.fillcolor[k].color);
                }
                elementfill = elementgrad;
              } else if (OD.filltype == 'color') {
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
      if (type != 'bubble' && type != 'OHLC') {
        ctx.canvaslabel(option, chart, precision, click);
        ctx.labelHFS(option, chart);
        ctx.legend(option, chart);
      }

      //Hover Element
      if (type == 'barline' || type == 'scatter') {
        if (type == 'scatter') {
          BarLine(option, chart, 'scatter', YaddB, percentanimation);
        } else {
          //Bar
          BarLine(option, chart, 'bar', YaddB, percentanimation);

          //Line
          BarLine(option, chart, 'line', YaddB, percentanimation);
        }
      } else if (type == 'bubble') {
        Bubble(option, chart, YaddB);
      } else if (type == 'OHLC') {
        OHLC(option, chart, YaddB);
      }
      var xaddW = 0;
      for (ic = 1; ic <= ObjectData.length; ic++) {
        var OD = ObjectData[ic - 1];
        OD.fillcolor = OD.fillcolor || 'black';
        OD.strokecolor = OD.strokecolor || 'black';
        OD.filltype = OD.filltype || 'color';
        OD.style = OD.style || '2d';
        OD.group = OD.group || {ID: 1, text: 'Group 1'};
        if (OD.group.ID == undefined || OD.group.ID < 1) OD.group.ID = 1;
        OD.charttype = OD.charttype || 'bar';
        if (enable3d) OD.charttype = 'bar';
        //bars
        var elementX, elementY, elementwidth;
        for (i = 0; i < data.length; i++) {
          //color
          var elementfill, elementgradient;
          var datacolor;
          datacolor = data[i].fillcolor || OD.fillcolor;

          //X, Y, Width, Height
          //x = Xorigin + (w * i * (ObjectData.length)); //parseInt(BarX(option, i, w, Xorigin, gtotalresultmax) + xaddW);

          y = vmovey; //YaddB;

          //width = BarLength(option, w);
          //if (totalline >= 1) width *= ((totalline / totalbar) + totalline);

          //if (!percentstack)
          height = HCanvas; //parseInt((valuex / totalValues) * HCanvas) * 1;

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

          if (OD.filltype == 'gradient') {
            var grad = [];
            var elementgrad = [];
            for (var j = 0; j < OD.fillcolor.length; j++) {
              grad.push({
                color: OD.fillcolor[j].color,
                stop: OD.fillcolor[j].stop,
              });
              elementgrad.push(OD.fillcolor[j].color);
            }
            elementfill = elementgrad;
          } else if (OD.filltype == 'color') {
            elementfill = datacolor;
          }
          //console.log(elementfill)
          elementlabel = LabelOutput(option, i, true, chart);

          if (gtotalresultmax > 1) elementgroup = ' (' + OD.group.text + ')';
          else elementgroup = '';

          var xtest = (widthtotal + 8) / data.length;

          elementY = y;
          elementheight = height;

          var areasizearray = [];
          for (var j = 0; j < ObjectData.length; j++) {
            areasizearray.push(ObjectData[j].areasize || 1);
          }
          var maxareasize = MaxArray(areasizearray) * 2;

          if (type == 'scatter') {
            elementX = xnumbase + xtest * i;
            elementwidth = xtest;
          } else if (type == 'bubble') {
            var circleradius = round(conh * 0.092);
            elementX = xnumbase + xtest * i; //(xnumbase + circleradius) + (xtest * i);
            elementwidth = xtest; //circleradius * 2;
          } else if (type == 'OHLC') {
            elementX = xnumbase + xtest * i;
            elementwidth = xtest;
          } else {
            if (totalbar >= 1) {
              elementX = xnumbase + xtest * i;
              elementwidth = xtest;
            } else {
              if (i == 1) {
                elementX = xnumbase + (xtest - maxareasize / 2);
              } else {
                elementX = xnumbase + NaNCheck(widthtotal / (data.length - 1)) * i;
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

            var bubblelabel = option.bubblelabel || '';
            var Esubdata = data[i][Object.keys(data[i])[j]];
            if (type == 'bubble') {
              var valuearray = NaNCheck(Esubdata[Object.keys(Esubdata)[0]]);
              var averagearray = NaNCheck(Esubdata[Object.keys(Esubdata)[1]]);
              if (averagearray < 0) averagearray = 0;
            } else if (type == 'OHLC') {
              var OLArray = Esubdata.open; //NaNCheck(Esubdata[Object.keys(Esubdata)[0]]);
              var HLArray = Esubdata.high; //NaNCheck(Esubdata[Object.keys(Esubdata)[1]]);
              var LLArray = Esubdata.low; //NaNCheck(Esubdata[Object.keys(Esubdata)[2]]);
              var CLArray = Esubdata.close; //NaNCheck(Esubdata[Object.keys(Esubdata)[3]]);

              openlist.push(OLArray);
              highlist.push(HLArray);
              lowlist.push(LLArray);
              closelist.push(CLArray);
              averagearray = 0;
            } else {
              if (!reversedata) valuearray = DataInput(data, i, j);
              else valuearray = -1 * DataInput(data, i, j);

              averagearray = 0;
            }

            if (percentstack) percentarray = ' (' + round(Percent(parseInt(valuearray), pstacktotal)) + '%)';
            else percentarray = '';

            var shapeout;
            if (ODE.area) {
              if (!reversedata) valuearray = DataInput(data, i, j);
              else valuearray = -1 * DataInput(data, i, j);

              if (ODE.areafilltype == 'color') {
                var datacolorlist;
                datacolorlist = data[i].fillcolor || ODE.areafill;
                filllistresult = datacolorlist;
              } else if (ODE.areafilltype == 'gradient') {
                ODE.gradienttype = ODE.gradienttype || 'linear a';
                var elementgrad = [];
                for (var k = 0; k < ODE.areafill.length; k++) {
                  elementgrad.push({color: ODE.areafill[k].color, stop: ODE.areafill[k].stop});
                }
                filllistresult = elementgrad;
                gradtypelist.push(ODE.gradienttype);
              }

              //shapelist.push(shapeout);

              patternlist.push('square');
              filllist.push(filllistresult);
              strokelist.push(rgba(0, 0, 0, 0));
              strokeWarray.push(ODE.linewidth);
              percentlist.push(percentarray);
              filltypelist.push(ODE.areafilltype);
              valuelist.push(valuearray);
              if (ObjectData.length > 1) ODlist.push(ODE[Object.keys(ODE)[0]]);
              else ODlist.push(elementlabel);
            } else {
              //ODE.gradienttype = ODE.gradienttype.toString().toLowerCase() || "linear a"
              if (type == 'OHLC' && OLArray < CLArray) {
                ODE.filltype == 'color';
              }

              if (ODE.filltype == 'color') {
                var datacolorlist;
                /*if (data[i].fillcolor == undefined) datacolorlist = ODE.fillcolor;
                                else datacolorlist = data[i].fillcolor;*/
                if (type == 'bubble') {
                } else {
                }
                datacolorlist = data[i].fillcolor || ODE.fillcolor;
                filllistresult = datacolorlist;
              } else if (ODE.filltype == 'gradient') {
                //ODE.gradienttype = ODE.gradienttype || "linear a";
                var elementgrad = [];
                for (var k = 0; k < ODE.fillcolor.length; k++) {
                  elementgrad.push({
                    color: ODE.fillcolor[k].color,
                    stop: ODE.fillcolor[k].stop,
                  });
                }
                filllistresult = elementgrad;
                gradtypelist.push(ODE.gradienttype.toString().toLowerCase());
                //console.log(gradtypelist)
              }
              if (type == 'scatter' || type == 'bubble') {
                shapeout = data[i].marker || ODE.marker;
              } else if (type == 'OHLC') {
                shapeout = 'square';
              } else {
                if (ODE.charttype == 'bar') {
                  shapeout = 'square';
                } else {
                  shapeout = data[i].marker || ODE.marker;
                }
              }
              var strokelistresult = ODE.strokecolor || 'black';
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
              else grouplist.push('');
            }
          }
          /*if (percentanimation == 1
                        && i == 2
                        && ic == 1) console.log(element);*/
          element = {
            x: elementX,
            y: elementY,
            width: elementwidth,
            height: elementheight,
            //, text: elementtext
            label: elementlabel,
            prefix: format.prefix,
            suffix: format.suffix,
            //, filltype: OD.filltype
            ODlist: ODlist,
            openlist: openlist,
            highlist: highlist,
            lowlist: lowlist,
            closelist: closelist,
            valuearray: valuelist,
            averagelist: averagelist,
            textaverage: bubblelabel,
            percentlist: percentlist,
            filltypelist: filltypelist,
            filllist: filllist,
            strokelist: strokelist,
            gradtypelist: gradtypelist,
            grouplist: grouplist,
            pattern: patternlist,
            linewidth: strokeWarray,
          };

          if (percentanimation == 1) elementlist.push(element);
        }
      } //end ObjectData loop
      ctx.restore();
      if (type == 'bubble' || type == 'OHLC') {
        ctx.canvaslabel(option, chart, precision, click);
        ctx.labelHFS(option, chart);
        ctx.legend(option, chart);
      }
      //end else
      hoverout(option, elementlist, percentanimation, chart);
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

//TREND CHART
export function CreateTrendChart(ctx, option) {
  var canvasIDcon = option.canvasID;
  var conw = option.size.width; //660 default number
  var conh = option.size.height; //400 default number

  var data = option.data;
  var total = option.total;
  var label = option.label;
  var percentfont = option.percentfont;

  var dataresult = data + total;
  var fillresult;
  var input = option.input;
  var marker = option.marker;

  marker.filltype = marker.filltype || 'color';

  label.display = label.display || false;
  percentfont.display = percentfont.display || false;

  var output, percenttext;
  var percentresult = Percent(data, total).toFixed(2) + '%';

  if (dataresult < total) {
    output = input.low;
    percenttext = percentresult;
  } else if (dataresult == total) {
    output = input.mid;
    percenttext = '�' + percentresult;
  } else if (dataresult > total) {
    output = input.high;
    percenttext = '+' + percentresult;
  }

  output.filltype = output.filltype || 'color';
  percentfont.text = percenttext;

  var top, bottom;

  var canvastop, canvasbottom;
  if (label.display) canvastop = wrapTextHeight(ctx, label.text, 10, conw, TextFontHeight(ctx, label), false);
  else canvastop = 10;

  if (percentfont.display) canvasbottom = wrapTextHeight(ctx, percentfont.text, 10, conw, TextFontHeight(ctx, percentfont), false);
  else canvasbottom = 10;
  top = canvastop;
  bottom = canvasbottom; //320

  var centerX = conw * 0.5;
  var centerY = conh * 0.5;
  var area = parseInt(centerY - (top + bottom));

  var markerX = centerX;
  var markerY = centerY;

  if (output.filltype == 'color') fillresult = output.fillcolor;
  else if (output.filltype == 'gradient') fillresult = GradientMarker(ctx, output.fillcolor, output.gradienttype, markerX, markerY, area);
  circle(ctx, markerX, markerY, area + area * 0.05, area * 0.05, rgba(0, 0, 0, 0), fillresult, nullshadow);
  circle(ctx, markerX, markerY, area, 0, fillresult, rgba(0, 0, 0, 0), nullshadow);

  var direction, markerfill;
  markerfill = marker.fillcolor;

  if (dataresult < total || dataresult > total) {
    if (dataresult < total) {
      direction = 'down';
    } else if (dataresult > total) {
      direction = 'up';
    }
    drawArrowB(ctx, markerX, markerY, 0, direction, area * 0.5, marker.linewidth, markerfill, marker.strokecolor, canvasIDcon, nullshadow);
  } else if (dataresult == total) rectangle(markerX - area * 0.75, markerY - area * 0.175, area * 1.5, area * 0.5, 0, marker.linewidth, markerfill, marker.strokecolor, [0], nullshadow);
  if (label.display) TextWrap(ctx, label.text, centerX, 10, 0, 0, label.color, null, 'center', 'hanging', label, conw, 10, false, false);
  if (percentfont.display) TextWrap(ctx, percentfont.text, centerX, conh - 10, 0, 0, percentfont.color, null, 'center', 'alphabetic', percentfont, conw, 10, false, false);
}

//-----------------------------------------------------------------------------//
//---------------------------GENERAL CHART FUNCTIONS---------------------------//
//-----------------------------------------------------------------------------//

function dataarrayoutput(option) {
  var intervaldata = option.intervaldata || 1,
    data = option.data;

  var dataarray = [];
  for (var i = 0; i < data.length; i += intervaldata) {
    dataarray.push(data[i]);
  }
  return dataarray;
}

function TextFontHeight(ctx, font) {
  return FontHeight(ctx, font);
}

function FontHeight(ctx, font) {
  FontFormat(ctx, font);
  return parseInt(ctx.font.match(/\d+/), 10);
}

function FontFormat(ctx, font) {
  font.fontWeight = font.fontWeight || 'normal';
  font.fontStyle = font.fontStyle || 'normal';
  ctx.font = font.fontStyle + ' ' + font.fontWeight + ' ' + (font.fontSize | 0) + 'px ' + font.fontFamily;
}

function wrapTextHeight(ctx, text, y, maxWidth, lineHeight, letter) {
  letter = letter || false;
  //manage carriage return
  text = text.replace(/(\r\n|\n\r|\r|\n)/g, '\n');
  //manage tabulation
  text = text.replace(/(\t)/g, '    '); // I use 4 spaces for tabulation, but you can use anything you want
  //array of lines
  var sections = text.split('\n');

  for (s = 0, len = sections.length; s < len; s++) {
    var words = letter ? sections[s].split('') : sections[s].split(' ');
    var line = '';

    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    y += lineHeight;
  }
  return parseInt(y /*+ lineHeight*/);
}

function GradientMarker(ctx, array, gradienttype, xa, ya, Areamarker) {
  var GradX = xa - Areamarker;
  var GradY = ya - Areamarker;
  var GradDX = xa - Areamarker * 0.5;
  var GradDY = ya - Areamarker * 0.5;
  var gtypeout = gradienttype.toString().toLowerCase();

  var fill;
  switch (gtypeout) {
    case 'linear a':
      fill = GradientLinear(ctx, 0, GradY, Areamarker, Areamarker * 2, array, 0, true, false);
      break;
    case 'linear b':
      fill = GradientLinear(ctx, 0, GradY, Areamarker, Areamarker * 2, array, 0, false, false);
      break;
    case 'linear c':
      fill = GradientLinear(ctx, GradX, 0, Areamarker * 2, Areamarker, array, 0, true, true);
      break;
    case 'linear d':
      fill = GradientLinear(ctx, GradX, 0, Areamarker * 2, Areamarker, array, 0, false, true);
      break;
    case 'linear e':
      fill = GradientLinear(ctx, GradDX, ya, Areamarker * 1.5, Areamarker * 1.5, array, 0, false, true, true);
      break;
    case 'linear f':
      fill = GradientLinear(ctx, GradDX, ya, Areamarker * 1.5, Areamarker * 1.5, array, 0, true, true, true);
      break;
    case 'linear g':
      fill = GradientLinear(ctx, GradDX, GradDY, Areamarker * 1.5, Areamarker * 1.5, array, 0, false, false, true);
      break;
    case 'linear h':
      fill = GradientLinear(ctx, GradDX, GradDY, Areamarker * 1.5, Areamarker * 1.5, array, 0, true, false, true);
      break;
    case 'radial':
      fill = GradientCircle(ctx, xa, ya, Areamarker / 5, xa, ya, Areamarker, array);
      break;
  }
  return fill;
}

function GradientLinear(ctx, x, y, width, height, input, rotate, reverse, invert, diag) {
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
    xa = x + width / 2 - xdx;
    ya = y + height / 2 - xdy;
    xb = x + width / 2 + xdx;
    yb = y + height / 2 + xdy;
    if (reverse) grd = ctx.gradient(xb, yb, xa, ya);
    else grd = ctx.gradient(xa, ya, xb, yb);
  }
  //horizontal and vertical
  else {
    if (reverse) {
      (xa = x + width), (xb = x); //left
      (ya = y + height), (yb = y); //up
    } else {
      (xa = x), (xb = x + width); //right
      (ya = y), (yb = y + height); //down
    }
    if (invert) grd = ctx.gradient(xa, height / 2, xb, height / 2); //horizontal
    else grd = ctx.gradient(width / 2, ya, width / 2, yb); //vertical
  }
  for (i = 0; i < input.length; i++) gradinputstop(grd, input, i);
  return grd;
}

function GradientCircle(ctx, xA, yA, rA, xB, yB, rB, input) {
  var grd = ctx.createRadialGradient(xA, yA, rA, xB, yB, rB);
  for (i = 0; i < input.length; i++) gradinputstop(grd, input, i);
  return grd;
}

function gradinputstop(grd, input, i) {
  var g = input[i].stop || NaNCheck(i / (input.length - 1));
  grd.addColorStop(g, input[i].color);
}

function circle(ctx, x, y, r, width, fill, stroke, shadow) {
  ctx.lineWidth = width;
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.save();
  shadowset(ctx, shadow.x, shadow.y, shadow.blur, shadow.color);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, PI * 2, false);
  if (width > 0) ctx.stroke();
  ctx.fill();
  ctx.restore();
  if (width > 0) ctx.stroke();
  ctx.closePath();
}

function shadowset(ctx, setx, sety, blur, color) {
  setx = setx || 0;
  sety = sety || 0;
  blur = blur || 0;
  color = color || '#000000';
  ctx.shadowOffsetX = setx;
  ctx.shadowOffsetY = sety;
  ctx.shadowBlur = blur;
  ctx.shadowColor = color;
}

function rgba(r, g, b, a) {
  r = r > 255 ? 255 : r < 0 ? 0 : r;
  g = g > 255 ? 255 : g < 0 ? 0 : g;
  b = b > 255 ? 255 : b < 0 ? 0 : b;
  a = a > 1 ? 1 : a < 0 ? 0 : a;
  return 'rgba(' + r + ',' + g + ', ' + b + ', ' + a + ')';
}

function Percent(x, total) {
  return (x / total) * 100;
}

function angleresult(angle) {
  var out = parseInt(angle / 360);
  if (angle < -360 || angle > 360) {
    angle -= 360 * out;
    return angle;
  } else return angle;
}

function toRadians(angle) {
  return angle * (PI / 180);
}

function drawArrowB(ctx, x, y, r, direction, area, linewidth, fill, stroke, ID, shadow) {
  area *= 1.5;
  r = r || 0;

  var Drotate;
  // var xarrow = -arrow.width / 2,
  //   yarrow = -arrow.height / 2;
  // xarrow -= 2.5;
  switch (direction) {
    case 'right':
      Drotate = 0;
      break;
    case 'down':
      Drotate = 90;
      break;
    case 'left':
      Drotate = 180;
      break;
    case 'up':
      Drotate = 270;
      break;
  }
  var rotate = toRadians(r + Drotate);
  ctx.save();
  //ctx.translate(x, y);
  makeArrow(ctx, area * 2.25, area * 0.6, area * 0.9, area * 1.25, fill, stroke, linewidth, ID, rotate, x, y);
  //ctx.rotate(rotate);
  //ctx.drawImage(arrow, xarrow, yarrow);
  shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
  ctx.restore();
}

function makeArrow(ctx, length, lineHeight, arrowLength, arrowHeight, fillcolor, strokecolor, linewidth, ID, rotate, transX, transY) {
  var lineTop = (arrowHeight - lineHeight) / 2;
  var arrowLeft = length - arrowLength;

  // var c = document.createElement(ID);
  // var ctx = c.getContext('2d');
  ctx.width = parseInt(length);
  ctx.height = parseInt(arrowHeight);

  ctx.fillStyle = fillcolor;
  ctx.strokeStyle = strokecolor;
  ctx.lineWidth = linewidth;
  ctx.translate(transX, transY);
  ctx.rotate(rotate);
  ctx.beginPath();
  ctx.moveTo(4 + linewidth, lineTop);
  ctx.lineTo(arrowLeft, lineTop);
  ctx.lineTo(arrowLeft, 4 + linewidth);
  ctx.lineTo(parseInt(length) - linewidth, arrowHeight / 2);
  ctx.lineTo(arrowLeft, arrowHeight - (4 + linewidth));
  ctx.lineTo(arrowLeft, lineTop + lineHeight);
  ctx.lineTo(4 + linewidth, lineTop + lineHeight);
  ctx.closePath();
  ctx.fill();
  if (linewidth > 0) ctx.stroke();
  //return canvas;
}

function rectangle(ctx, x, y, width, height, rotate, linewidth, fill, stroke, dash, shadow) {
  fill = fill || 'black';
  stroke = stroke || 'black';
  linewidth = linewidth || 0;
  shadow = shadow || nullshadow;
  var xadd = width / 2;
  var yadd = height / 2;
  var xa = x + xadd;
  var ya = y + yadd;
  var xb = 0 - xadd;
  var yb = 0 - yadd;
  dash = dash || [0];
  rotate = rotate || 0;
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.save();
  shadowset(shadow.x, shadow.y, shadow.blur, shadow.color);
  ctx.translate(xa, ya);
  ctx.rotate(toRadians(angleresult(rotate)));
  ctx.beginPath();
  ctx.rect(xb, yb, width, height);
  if (linewidth > 0) ctx.stroke();
  ctx.fill();
  ctx.restore();
  ctx.lineWidth = linewidth;
  ctx.setLineDash(dash);
  ctx.closePath();
  if (linewidth > 0) ctx.stroke();
}

function TextWrap(ctx, text, x, y, rotate, textwidth, fill, stroke, align, baseline, font, maxWidth, lineHeight, letter) {
  letter = letter || false;
  ctx.save();
  FontFormat(ctx, font);
  wrapText(ctx, text, parseInt(x), parseInt(y), rotate, textwidth, fill, stroke, align, baseline, maxWidth, lineHeight, font, letter);
  ctx.restore();
}

function wrapText(ctx, text, x, y, rotate, textwidth, fill, stroke, align, baseline, maxWidth, lineHeight, font, letter) {
  letter = letter || false;
  stroke = stroke || 'black';
  textwidth = textwidth || 0;
  ctx.save();
  var yAdd = parseInt(y);
  var yLine = parseInt(y);
  var line = '';
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.translate(parseInt(x), y);
  ctx.rotate(toRadians(angleresult(rotate)));
  var sections;
  if (typeof text == 'string') {
    //manage carriage return
    text = text.replace(/(\r\n|\n\r|\r|\n)/g, '\n');
    //manage tabulation
    text = text.replace(/(\t)/g, '    '); // I use 4 spaces for tabulation, but you can use anything you want

    //array of lines
    sections = text.split('\n');
  } else if (typeof text == 'number') {
    var sections = [''];
  }

  for (s = 0, len = sections.length; s < len; s++) {
    var words = letter ? sections[s].split('') : sections[s].split(' ');
    var line = '';

    //var words = text.toString().split(' ');
    for (var n = 0; n < words.length; n++) {
      var testLine = letter ? line + words[n] + '' : line + words[n] + ' ';
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, 0, yAdd - y);
        if (textwidth > 0) ctx.strokeText(line, 0, yAdd - y);
        TextLine(ctx, line, 0, yLine - y, fill, font, align, baseline);
        line = words[n] + ' ';
        yAdd += lineHeight;
        yLine += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 0, yAdd - y);
    if (textwidth > 0) ctx.strokeText(line, 0, yAdd - y);
    TextLine(ctx, line, 0, yLine - y, fill, font, align, baseline);
    yAdd += lineHeight;
    yLine += lineHeight;
  }
  ctx.restore();
}

function TextLine(ctx, text, x, y, fill, font, align, baseline) {
  var textWidth = ctx.measureText(text).width;

  var startX = 0,
    startY,
    startYS,
    startYO;
  var fontheight = FontHeight(ctx, font);

  if (baseline == 'alphabetic') {
    startY = parseInt(y + parseInt(font.fontSize) / 15); //15
    startYS = parseInt(y - parseInt(font.fontSize) / 3);
  } else if (baseline == 'middle') {
    startY = parseInt(y + parseInt(font.fontSize) / 3); //3
    startYS = parseInt(y - parseInt(font.fontSize) / 10);
  } else if (baseline == 'hanging') {
    // if (isEdge || isIE) {
    //   startY = parseInt(y + parseInt(font.fontSize) / 1); //1.3
    //   startYS = parseInt(y + parseInt(font.fontSize) / 1.5);
    // } else {
    startY = parseInt(y + parseInt(font.fontSize) / 1.3); //1.3
    startYS = parseInt(y + parseInt(font.fontSize) / 2.5);
    //}
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

  if (align == 'center') {
    startX = parseInt(x - textWidth / 2);
    endX = parseInt(x + textWidth / 2);
  } else if (align == 'right') {
    startX = parseInt(x - textWidth);
    endX = parseInt(x);
  } else {
    startX = parseInt(x);
    endX = parseInt(x + textWidth);
  }

  if (font.underline) Line(ctx, startX, startY + 0.5, endX, endY + 0.5, underlineHeight, fill, nullshadow);
  if (font.strikethrough) Line(ctx, startX, startYS + 0.5, endX, endYS + 0.5, underlineHeight, fill, nullshadow);
  if (font.overline) Line(ctx, startX, startYO + 0.5, endX, endYO + 0.5, underlineHeight, fill, nullshadow);
}

function Line(ctx, xa, ya, xb, yb, width, color, shadow, dash, cap, join) {
  shadow = shadow || nullshadow;
  cap = cap || 'butt';
  join = join || 'miter';
  dash = dash || [0];

  var dasharray = [];
  for (var d = 0; d < dash.length; d++) {
    dasharray.push(dash[d] * width);
  }

  var dashout = dasharray || [0];

  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  shadowset(ctx, shadow.x, shadow.y, shadow.blur, shadow.color);
  ctx.setLineDash(dashout);
  ctx.lineCap = cap;
  ctx.lineJoin = join;
  ctx.moveTo(xa, ya);
  ctx.lineTo(xb, yb);
  ctx.closePath();
  if (width > 0) ctx.stroke();
  ctx.restore();
}

function GroupArray(OD) {
  var grouparray = [];
  for (ic = 0; ic < OD.length; ic++) {
    var O = OD[ic].group;
    if (O == undefined) O = {ID: 1};
    if (O.ID == undefined || O.ID < 1) O.ID = 1;
    grouparray.push(O.ID);
  }
  grouparray.sort();
  return grouparray;
}

function MaxArray(array) {
  var max = 0;
  for (var i = 0; i < array.length; i++) {
    max = array[i] > max ? array[i] : max;
  }
  return max;
}

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
  return garraytotal;
}

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
    gtotalresult = removeDuplicate(GArray).toString().split(',').map(Number),
    gtotalresultmax = MaxArray(gtotalresult);

  //plot label
  labelfont.align = labelfont.align || 'center';
  labelfont.position = labelfont.position || 'bottom';

  var area = 20;

  //checking max and min
  var max = MaxMin(option, chart, true),
    min = MaxMin(option, chart, false);

  var valueuptotal = ValueTotal(option, chart, 'up'),
    valuedowntotal = ValueTotal(option, chart, 'down');

  var vA = TBPosition(ctx, option, chart, 'top'),
    vB = TBPosition(ctx, option, chart, 'bottom');
  var width, height;
  if (chart == 'horizontalbar') {
    //checking max and min
    var XaddB;

    var hA = BaseLabelH(option, 'left', chart) + 1, //parseInt(xlabelbase + 1);
      hB = BaseLabelH(option, 'right', chart);

    var WCanvas = hB - hA;

    //get perline width

    var YCanvas = vB; //conh - 55
    //var Yorigin = vB;

    var varCompute = ComputeCheck(option, hB, max, min, 'y');
    var lineDrawCount = LineCount(option, hB, max, min, 'y');
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
      HeightB = HeightFix(width, height, areaA, false, true, vertical);

    if (vertical) {
      return height * areaA; //HeightA
    } else {
      return height * areaA;
    }

    //return 20;
  } else {
    var hB = ctx.BaseNum(option, 'right', precision, chart);

    /*if (enable3d) {
            measureright.display = false;
        }*/
    var HCanvas = vB - vA; //+ Vpercent3d;
    //varCompute
    var varCompute = ComputeCheck(option, vB, max, min, 'x');
    var lineDrawCount = LineCount(option, vB, max, min, 'x');
    var intervalH = HCanvas / (lineDrawCount - 1);
    //var varP = VarPcount(option, vB, max, min, "x");

    var totalValues = varCompute * (lineDrawCount - 1);

    var xnumbase = ctx.BaseNum(option, 'left', precision, chart);
    var numbaseB = hB; //- Hpercent3d;

    var Xorigin = xnumbase + 5; //+ Hpercent3d;
    var XCanvas = numbaseB - 5;

    //graph and label
    var addW = 0;

    var widthtotal = XCanvas - Xorigin;
    var widthC = widthtotal;
    widthC /= ObjectData.length;
    widthC /= data.length;
    w = widthC;
    if (data.length == 1) w /= 2;

    var totalbar = TotalBarLine(option, 'bar');
    var totalline = TotalBarLine(option, 'line');

    var width = BarLength(option, w);
    if (totalline >= 1) width *= totalline / totalbar + totalline;

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
      HeightB = HeightFix(width, height, areaA, false, true, vertical);

    if (vertical) {
      return height * areaA; //HeightA
    } else {
      return width * areaA; //WidthA
    }
  }
}

function BaseLabelH(ctx, option, leftright, chart) {
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
    (customX = option.x), (customY = option.y);
  } else {
    (customX = 0), (customY = 0);
  }
  (conw = option.size.width), (conh = option.size.height);

  var canvasleft, canvasright;
  if (optionLL.display) {
    canvasleft = parseInt(wrapTextHeight(optionLL.text, TextFontHeight(ctx, optionLL) + 5, conh, TextFontHeight(ctx, optionLL), false));
  } else {
    canvasleft = 12;
  }

  if (optionLR.display) {
    canvasright = parseInt(conw - wrapTextHeight(optionLR.text, TextFontHeight(ctx, optionLR) + 5, conh, TextFontHeight(ctx, optionLR), false));
  } else {
    canvasright = conw - 8;
  }

  if (chart == 'piedoughnut' || chart == 'pie' || chart == 'doughnut' || chart == 'cone' || chart == 'pyramid' || chart == 'cylinder') {
    Data = data;
  } else {
    Data = DataOutput(option);
  }

  var conwlegend;
  switch (legendposition) {
    case 'left':
    case 'right':
      conwlegend = conw * 0.2;
      break;
    default:
      conwlegend = conw;
      break;
  }

  var wraparray = [];
  for (j = 0; j < Data.length; j++) {
    if (chart == 'piedoughnut' || chart == 'pie' || chart == 'doughnut' || chart == 'cone' || chart == 'pyramid' || chart == 'cylinder') {
      labelcheck = Data[j][Object.keys(Data[j])[0]].toString();
    } else {
      if (Data == data) {
        labelcheck = LabelOutput(option, j, false, chart).toString();
      } else labelcheck = ObjectData[j][Object.keys(ObjectData[j])[0]].toString();
    }
    wraparray.push(wrapTextArray(labelcheck, 0, conwlegend, 0, true) - 1);
  }

  var wraptextarray = [];
  for (k = 0; k < Data.length; k++) {
    wraptextarray.push(parseInt(wrapTextWidth(ctx, labelcheck, conwlegend, legendfont, true)));
  }
  var legendarray = MaxArray(wraptextarray) + 35;

  var hA, hB;
  switch (legendposition) {
    case 'left':
      hA = parseInt(MaxArrayLabel(ctx, option, chart) + canvasleft + legendarray);
      hB = canvasright;
      break;
    case 'right':
      hA = parseInt(MaxArrayLabel(ctx, option, chart) + canvasleft);
      hB = canvasright - legendarray;
      break;
    default:
      hA = parseInt(MaxArrayLabel(ctx, option, chart) + canvasleft);
      hB = canvasright;
  }

  switch (leftright) {
    case 'left':
      return hA + customX;
      break;
    case 'right':
      return hB + customX;
      break;
  }
}

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

  (valueuptotal = ValueTotal(option, chart, 'up')), (valuedowntotal = ValueTotal(option, chart, 'down'));
  var value;

  for (var ic = 1; ic <= ObjectData.length; ic++) {
    for (var i = 0; i < data.length; i++) {
      var subdata = data[i][Object.keys(data[i])[ic]];
      if (typeof subdata == 'number') {
        if (!reversedata) {
          if (chart == 'horizontalbar') {
            if (valueuptotal >= valuedowntotal) {
              value = DataInput(data, i, ic) * -1;
            } else if (valueuptotal < valuedowntotal) {
              value = DataInput(data, i, ic);
            }
          } else {
            if (valueuptotal >= valuedowntotal) {
              value = DataInput(data, i, ic);
            } else if (valueuptotal < valuedowntotal) {
              value = DataInput(data, i, ic) * -1;
            }
          }
        } else {
          if (chart == 'horizontalbar') {
            if (valueuptotal >= valuedowntotal) {
              value = DataInput(data, i, ic);
            } else if (valueuptotal < valuedowntotal) {
              value = DataInput(data, i, ic) * -1;
            }
          } else {
            if (valueuptotal >= valuedowntotal) {
              value = DataInput(data, i, ic) * -1;
            } else if (valueuptotal < valuedowntotal) {
              value = DataInput(data, i, ic);
            }
          }
        }
      } else if (typeof subdata == 'object') {
        if (chart == 'OHLC') {
          var OHLCarray = [subdata.open, subdata.high, subdata.low, subdata.close];
          for (var j = 0; j < OHLCarray.length; j++) {
            var datavalue = OHLCarray[j]; // NaNCheck(subdata[Object.keys(subdata)[j]]);

            if (valueuptotal >= valuedowntotal) {
              value = datavalue;
            } else if (valueuptotal < valuedowntotal) {
              value = datavalue * -1;
            }
            max = value > max ? value : max;
            min = value < min ? value : min;
          }
        } else {
          //var subdata = data[i][Object.keys(data[i])[ic]];
          datavalue = DataInput(data, i, ic) || NaNCheck(subdata[Object.keys(subdata)[0]]);
          if (!reversedata) {
            if (chart == 'horizontalbar') {
              if (valueuptotal >= valuedowntotal) {
                value = datavalue * -1;
              } else if (valueuptotal < valuedowntotal) {
                value = datavalue;
              }
            } else {
              if (valueuptotal >= valuedowntotal) {
                value = datavalue;
              } else if (valueuptotal < valuedowntotal) {
                value = datavalue * -1;
              }
            }
          } else {
            if (chart == 'horizontalbar') {
              if (valueuptotal >= valuedowntotal) {
                value = datavalue;
              } else if (valueuptotal < valuedowntotal) {
                value = datavalue * -1;
              }
            } else {
              if (valueuptotal >= valuedowntotal) {
                value = datavalue * -1;
              } else if (valueuptotal < valuedowntotal) {
                value = datavalue;
              }
            }
          }
        }
      }

      var valueout;
      if (chart == 'radar') {
        if (value < 0) valueout = 0;
        else valueout = value;
      } else {
        valueout = value;
      }

      if (chart != 'OHLC') {
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
          max = pstack > max ? 100 : max;
          min = pstack < min ? -100 : min;
        } else {
          max = valueout > max ? valueout : max;
          min = valueout < min ? valueout : min;
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
    minset = minset || min;
  } else {
    maxset = maxset || max;
    minset = minset || min;
  }

  if (output) return maxset;
  else return min;
}

function ValueTotal(option, chart, updown) {
  var data = dataarrayoutput(option);
  var ObjectData = option.ObjectData;
  var reversedata = option.reversedata || false;
  var valuearrayup = [];
  var vuptotal = 0;
  var valuearraydown = [];
  var vdowntotal = 0;

  if (chart == 'OHLC') {
    for (var ic = 1; ic <= ObjectData.length; ic++) {
      for (i = 0; i < data.length; i++) {
        var subdata = data[i][Object.keys(data[i])[ic]];
        var OHLCarray = [subdata.open, subdata.high, subdata.low, subdata.close];
        for (var j = 1; j <= OHLCarray.length; j++) {
          var datavalue = /*OHLCarray[j];*/ NaNCheck(subdata[Object.keys(subdata)[j]]);

          if (!reversedata) {
            valuex = datavalue;
          } else {
            valuex = datavalue * -1;
          }

          if (valuex >= 0) {
            valuearrayup.push(1);
            valuearraydown.push(0);
          } else {
            valuearrayup.push(0);
            valuearraydown.push(1);
          }
        }
      }
    }
  } else {
    for (var ic = 1; ic <= ObjectData.length; ic++) {
      for (var i = 0; i < data.length; i++) {
        if (chart == 'horizontalbar') {
          if (!reversedata) {
            valuex = DataInput(data, i, ic) * -1;
          } else {
            valuex = DataInput(data, i, ic);
          }
        } else {
          if (!reversedata) {
            valuex = DataInput(data, i, ic);
          } else {
            valuex = DataInput(data, i, ic) * -1;
          }
        }

        if (valuex >= 0) {
          valuearrayup.push(1);
          valuearraydown.push(0);
        } else {
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
    case 'up':
      return vuptotal;
      break;
    case 'down':
      return vdowntotal;
      break;
  }
}

function TBPosition(ctx, option, chart, TB) {
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
    (customX = option.x), (customY = option.y);
  } else {
    (customX = 0), (customY = 0);
  }
  (conw = option.size.width) /*+ customX*/, (conh = option.size.height) /*+ customY*/;

  if (chart != 'barline' && chart != 'horizontalbar') enable3d = false;

  var top, bottom, labeladd, rotateadd;
  var canvastop = TopBottom(option, 'top', chart);
  var canvasbottom = TopBottom(option, 'bottom', chart);
  var plotlabeladd;
  var labellegendarray = LLarray(option, chart, ctx);
  var labellegendarraygroup = MaxArrayNum(labellegendarray, conw);

  var legendfontheight = (FontHeight(ctx, legendfont) + 15) * (MaxArray(labellegendarraygroup) + 1);
  if (
    /*chart == "horizontalbar"
        ||*/ chart == 'pie' ||
    chart == 'doughnut' ||
    chart == 'radar' ||
    chart == 'cone' ||
    chart == 'cylinder' ||
    chart == 'pyramid'
  ) {
    switch (legendposition) {
      case 'top':
        top = canvastop + legendfontheight; //40
        bottom = canvasbottom; //320
        break;
      case 'bottom':
        top = canvastop;
        bottom = canvasbottom + legendfontheight; //320
        break;
      default:
        top = canvastop;
        bottom = canvasbottom; //320
    }
    plotlabeladd = 0;

    if (TB == 'top') {
      return parseInt(top);
    } else if (TB == 'bottom') return parseInt(bottom);
  } else {
    //plot label
    var plotlabelcheck = 0;
    for (i = 0; i < ObjectData.length; i++) {
      var OD = ObjectData[i];
      OD.showlabel = OD.showlabel || false;
      if (OD.showlabel) plotlabelcheck += 1;
      else plotlabelcheck += 0;
    }
    if (plotlabelcheck > 0) plotlabeladd = wrapTextHeight(ctx, '|', 0, conw, FontHeight(ctx, plotlabel), false);
    else plotlabeladd = 0;

    (duration = option.duration), (format = option.format);

    duration.interval = NaNCheck(duration.interval) || 1;
    if (duration.interval < 1) duration.interval = 1;
    var intervalx = parseInt(duration.interval);

    labeladd = 0; //this.FontHeight(labelfont) * 0.5;
    if (rotatelabel) {
      rotateadd = labeladd + LabelRotate(ctx, option, canvasbottom, chart) * -1;
    } else {
      rotateadd = 0;
    }

    switch (legendposition) {
      case 'top':
        top = canvastop + legendfontheight; //40
        bottom = canvasbottom; //320
        break;
      case 'bottom':
        top = canvastop;
        bottom = canvasbottom - legendfontheight; //320
        break;
      default:
        top = canvastop;
        bottom = canvasbottom; //320
    }

    switch (labelfont.position) {
      case 'top':
        top += rotateadd;
        bottom;
        break;
      case 'bottom':
        top;
        bottom -= rotateadd;
        break;
      default:
        top;
        bottom;
        break;
    }
    if (TB == 'top') {
      if (chart == 'barline') return parseInt(top) + plotlabeladd;
      else return parseInt(top);
    } else if (TB == 'bottom') return parseInt(bottom) - 10;
  }
}

//Grid and Height Computation
function ComputeCheck(option, length, max, min, xy) {
  var percentstack = option.percentstack;
  var minheightLine;
  if (xy == 'x') {
    if (percentstack) minheightLine = 30;
    else minheightLine = 60; //50
  } else if (xy == 'y') {
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
    } else if (pow(10, i) * 2 >= computed) {
      /*else if (pow(10, i) * 1.5 >= computed) {
            return pow(10, i) * 1.5;
            break;
        }*/
      return pow(10, i) * 2;
      break;
    } else if (pow(10, i) * 3 >= computed) {
      return pow(10, i) * 3;
      break;
    } else if (pow(10, i) * 5 >= computed) {
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

function groupout(option, gtotalresult, concat) {
  concat = concat || true;
  var ObjectData = option.ObjectData;

  var ODgrouparray = [];
  for (var j = 1; j <= gtotalresult.length; j++) {
    var ODcurrentgroup = [];
    var gcount = 0;
    for (var k = 0; k < ObjectData.length; k++) {
      var OD = ObjectData[k];
      OD.group = OD.group || {ID: 1, text: 'Group 1'};
      if (OD.group.ID == undefined || OD.group.ID < 1) OD.group.ID = 1;
      //if (ObjectData[k].group.ID == undefined) ObjectData[k].group.ID = 1;
      if (OD.group.ID == j) {
        gcount += 1;
        ODcurrentgroup.push(gcount);
      }
    }
    ODgrouparray.push(ODcurrentgroup);
  }

  if (concat) return flatten(ODgrouparray);
  else return ODgrouparray;
}

function animatecanvas(option, ID, canvas, anim, percent) {
  var millisecond = option.millisecond;
  var a = ElementID(ID);
  var p8draw = a.getAttribute('p8draw', true);
  anim = anim || false;
  if (anim) {
    if (p8draw != 'true' && p8draw == undefined) {
      requestAnimFrame(canvas, 1);
    } else {
      canvas();
    }
  } else {
    canvas();
  }
}

function gridlinesdraw(ctx, option, precision, chart, click) {
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
    (customX = option.x), (customY = option.y);
  } else {
    animation = option.animation || false;
    (customX = 0), (customY = 0);
  }
  (conw = option.size.width), (conh = option.size.height);

  var GArray = GroupArray(ObjectData);
  var gtotalmax = MaxArray(GroupArrayTotal(GArray));

  var gtotalresult = removeDuplicate(GArray).toString().split(',').map(Number);
  var gtotalresultmax = MaxArray(gtotalresult);

  intervalx = NaNCheck(duration.interval) || 1;
  if (intervalx < 1) intervalx = 1;

  var max = MaxMin(option, chart, true),
    min = MaxMin(option, chart, false);

  var valueuptotal = ValueTotal(option, chart, 'up'),
    valuedowntotal = ValueTotal(option, chart, 'down');

  ctx.save();
  if (animation) clear(ctx, option.size.width, option.size.height);

  var color = gridline.color,
    horizontalcolor = gridline.horizontalcolor,
    internalwidth = gridline.internalwidth,
    width = gridline.width;

  horizontalcolor = horizontalcolor || color;
  internalwidth = internalwidth || width;

  var percent3d, BarPercentWidth, BarPercentHeight;
  if (enable3d) {
    if (stacked) {
      BarPercentWidth = barpercentmeasure(ctx, option, chart, false) * gtotalmax;
      BarPercentHeight = barpercentmeasure(ctx, option, chart, false) * gtotalmax;
    } else {
      BarPercentWidth = barpercentmeasure(ctx, option, chart, false);
      BarPercentHeight = barpercentmeasure(ctx, option, chart, false);
    }
  } else {
    BarPercentWidth = 0;
    BarPercentHeight = 0;
  }

  var hA, hB, vA, vB;
  if (chart == 'horizontalbar') {
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

    hA = BaseLabelH(ctx, option, 'left', chart) + 1;
    hB = BaseLabelH(ctx, option, 'right', chart); //- BarPercentWidth;

    vA = TBPosition(ctx, option, chart, 'top');
    vB = TBPosition(ctx, option, chart, 'bottom');

    //varCompute
    var varCompute = ComputeCheck(option, hB, max, min, 'y'),
      varP = VarPcount(option, hB, max, min, 'y'),
      lineDrawCount = LineCount(option, hB, max, min, 'y');

    var YCanvas = vB; //conh - 55
    var ynumbase = YCanvas + TextFontHeight(ctx, measurefont);

    //var Yorigin = vB;

    //measurement

    //varCompute
    var intervalV = (hB - hA) / (lineDrawCount - 1);
    var percent;
    if (enable3d) percent = BarPercentWidth;
    else percent = 0;

    for (var i = 0; i < lineDrawCount; i++) {
      var gridpoints = [];
      if (valueuptotal >= valuedowntotal) {
        cx = parseInt(i * intervalV) + hA;

        if (enable3d) {
          if (varP == 0) {
            if (valuedowntotal == data.length) {
              gridpoints.push({x: cx + 0.5 - percent, y: vA - 1});
              gridpoints.push({x: cx + 0.5 - percent, y: YCanvas + 2});
              gridpoints.push({x: cx + 0.5, y: YCanvas + 2 - percent});
              gridpoints.push({x: cx + 0.5, y: vA - 1});
            } else {
              gridpoints.push({x: cx + 0.5, y: vA - 1});
              gridpoints.push({x: cx + 0.5, y: YCanvas + 2 - percent});
              gridpoints.push({x: cx + 0.5 - percent, y: YCanvas + 2});
              //gridpoints.push({ x: cx + 0.5 - percent, y: vA - 1 });
            }
          } else if (varP > 0) {
            if (valueuptotal > 0) {
              gridpoints.push({x: cx + 0.5 + percent, y: vA - 1});
              gridpoints.push({x: cx + 0.5 + percent, y: YCanvas + 2 - percent});
              gridpoints.push({x: cx + 0.5, y: YCanvas + 2});
            } else {
              //Line(ctx, cx + 0.5, vA - 1, cx + 0.5, (YCanvas + 2), internalwidth, color);
            }

            if (i == 0) {
              Line(ctx, cx + 0.5, vA - 1, cx + 0.5, YCanvas + 2, internalwidth, color, nullshadow);
            }
          } else {
            gridpoints.push({x: cx + 0.5 - percent, y: YCanvas + 2});
            gridpoints.push({x: cx + 0.5, y: YCanvas + 2 - percent});
            gridpoints.push({x: cx + 0.5, y: vA - 1});
          }
          polygon(ctx, gridpoints, rgba(0, 0, 0, 0), gridline.internalcolor, internalwidth, [0], nullshadow, false);
        } else {
          Line(ctx, cx + 0.5, vA - 1, cx + 0.5, YCanvas + 2, internalwidth, color);
        }
      } else if (valueuptotal < valuedowntotal) {
        cx = parseInt((lineDrawCount - 1 - i) * intervalV) + hA;

        if (enable3d) {
          if (varP == 0) {
            //gridpoints.push({ x: cx + 0.5, y: vA - 1 });
            gridpoints.push({x: cx + 0.5, y: YCanvas + 2});
            gridpoints.push({x: cx + 0.5 + percent, y: YCanvas + 2 - percent});
            gridpoints.push({x: cx + 0.5 + percent, y: vA - 1});
          } else if (varP < 0) {
            gridpoints.push({x: cx + 0.5, y: YCanvas + 2});
            gridpoints.push({x: cx + 0.5 + percent, y: YCanvas + 2 - percent});
            gridpoints.push({x: cx + 0.5 + percent, y: vA - 1});
          } else {
            gridpoints.push({x: cx + 0.5 - percent, y: YCanvas + 2});
            gridpoints.push({x: cx + 0.5, y: YCanvas + 2 - percent});
            gridpoints.push({x: cx + 0.5, y: vA - 1});
          }
          polygon(ctx, gridpoints, rgba(0, 0, 0, 0), color, internalwidth, [0], nullshadow, false);
        } else {
          Line(ctx, cx + 0.5, vA - 1, cx + 0.5, YCanvas + 2, internalwidth, color);
        }
      }

      varP -= varCompute;
    }

    if (valuedowntotal > valueuptotal) {
      Line(ctx, cx + 0.5, vA - 1, cx + 0.5, YCanvas + 2, gridline.internalwidth, gridline.internalcolor);
    }

    //horizontal line
    Line(ctx, hA + 0.5, round(vB) + 1.5, hB + 1 - percent, round(vB) + 1.5, width, color);
  } else if (chart == 'radar') {
    var measurefont = option.measurefont;
    (vA = TBPosition(ctx, option, chart, 'top')), //+ Vpercent3d;
      (vB = TBPosition(ctx, option, chart, 'bottom'));

    var area = conh * 0.45 - (vA + vB);
    var areaplus = conh * 0.5 - area;
    var varCompute = ComputeCheck(option, area, max, min, 'x');
    var lineDrawCount = LineCount(option, area, max, min, 'x');
    var interval = area / (lineDrawCount - 1);
    var varP = VarPcount(option, area, max, min, 'x');

    var carea;
    for (var i = 0; i < lineDrawCount; i++) {
      carea = parseInt(i * interval);

      var startline = -PI / 2;
      var endline = -PI / 2;
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
        Line(ctx, conw / 2 + offsetXline, conh / 2 + offsetYline, conw / 2 + offsetXlineEnd, conh / 2 + offsetYlineEnd, gridline.width / 2, gridline.color);
        //ctx.circle((conw / 2), (conh / 2), carea, gridline.width / 4, "rgba(0,0,0,0)", gridline.color, nullshadow);
      }

      varP -= varCompute;
    }
    var totalValues = varCompute * (lineDrawCount - 1);
    var total = MaxArray(data);

    var startline = -PI / 2;
    var endline = -PI / 2;
    for (var i = 0; i < data.length; i++) {
      var text = data[i][Object.keys(data[i])[0]];
      var valueline = 1 / data.length;
      var circum = valueline * PI * 2;
      if (i > 0) startline = endline;
      endline += circum;

      offsetXline = cos(startline) * area;
      offsetYline = sin(startline) * area;
      Line(ctx, conw / 2, conh / 2, conw / 2 + offsetXline, conh / 2 + offsetYline, gridline.width, gridline.color);
    }
  } else {
    var labeladdtop, labeladdbottom;

    switch (labelfont.position) {
      case 'top':
        labeladdbottom = 0;
        if (rotatelabel) {
          labeladdtop = 0;
        } else {
          labeladdtop = lmeasureout(ctx, option, precision, chart, 0);
        }
        break;
      case 'bottom':
        labeladdtop = 0;
        if (rotatelabel) {
          labeladdbottom = 0;
        } else {
          labeladdbottom = lmeasureout(ctx, option, precision, chart, 0);
        }
        break;
    }

    hA = BaseNum(ctx, option, 'left', precision, chart) + 6;
    hB = BaseNum(ctx, option, 'right', precision, chart) - 6;
    vA = TBPosition(ctx, option, chart, 'top') + BarPercentHeight - labeladdtop;
    vB = TBPosition(ctx, option, chart, 'bottom') - labeladdbottom;
    //
    //multiple horizontal lines

    //varCompute
    var varCompute = ComputeCheck(option, vB, max, min, 'x');
    var varP = VarPcount(option, vB, max, min, 'x');
    var lineDrawCount = LineCount(option, vB, max, min, 'x');
    var intervalH = (vB - vA) / (lineDrawCount - 1);

    for (var i = 0; i < lineDrawCount; i++) {
      var gridpoints = [];
      if (valueuptotal >= valuedowntotal) {
        cy = parseInt(i * intervalH) + vA;
      } else if (valueuptotal < valuedowntotal) {
        cy = parseInt((lineDrawCount - 1 - i) * intervalH) + vA;
      }

      var text = '';

      if (varP == minset) text = 0;

      varP -= varCompute;

      if (enable3d) {
        ctx.save();
        if (valueuptotal >= valuedowntotal) {
          if (i == lineDrawCount - 1 && varP != 0) {
            gridpoints.push({x: hA, y: cy + 0.5});
            gridpoints.push({x: hA + BarPercentWidth, y: cy - BarPercentHeight + 0.5});
            gridpoints.push({x: hB, y: cy - BarPercentHeight + 0.5});
            gridpoints.push({x: hB - BarPercentWidth, y: cy + 0.5});
            gridpoints.push({x: hA, y: cy + 0.5});
          } else {
            gridpoints.push({x: hA, y: cy + 0.5});
            gridpoints.push({x: hA + BarPercentWidth, y: cy - BarPercentHeight + 0.5});
            gridpoints.push({x: hB, y: cy - BarPercentHeight + 0.5});
          }
        } else if (valueuptotal < valuedowntotal) {
          if (i == 0) {
            gridpoints.push({x: hA, y: cy + 0.5});
            gridpoints.push({x: hA + BarPercentWidth, y: cy - BarPercentHeight + 0.5});
            gridpoints.push({x: hB, y: cy - BarPercentHeight + 0.5});
            gridpoints.push({x: hB - BarPercentWidth, y: cy + 0.5});
            gridpoints.push({x: hA, y: cy + 0.5});
          } else {
            gridpoints.push({x: hA, y: cy + 0.5});
            gridpoints.push({x: hA + BarPercentWidth, y: cy - BarPercentHeight + 0.5});
            gridpoints.push({x: hB, y: cy - BarPercentHeight + 0.5});
          }
        }
        polygon(ctx, gridpoints, rgba(0, 0, 0, 0), horizontalcolor, internalwidth, [0], nullshadow, false);
      } else {
        if (text == 0) Line(ctx, hA, cy + 0.5, hB + 1, cy + 0.5, width, color);
        else Line(ctx, hA, cy + 0.5, hB + 1, cy + 0.5, internalwidth, horizontalcolor);
      }
    }

    //vertical line drawing left
    Line(ctx, round(hA) - 0.5, vA, round(hA) - 0.5, vB, width, color);

    //vertical line drawing right
    if (!enable3d) Line(ctx, round(hB) + 1.5, vA, round(hB) + 1.5, vB + 1, width, color);
    ctx.restore();

    Xorigin = hA;
    var widthtotal = hB - Xorigin;
    var widthCperline = widthtotal;
    widthCperline /= data.length;

    gridline.internal = gridline.internal || false;

    for (i = 1; i < data.length; i++) {
      var addx = hA;
      //var linemeasure = intervalx * i;
      //if (linemeasure >= data.length) break;
      var xh = round(addx + widthCperline * i) + 0.5;
      var Vcolor;
      if (i < 1 && i == data.length - 1) Vcolor = gridline.color;
      else Vcolor = gridline.verticalcolor;
      if (gridline.internal) {
        if (chart == 'barline') Line(ctx, xh, vA, xh, vB, gridline.width, Vcolor);
      }
    }
  }
} //end of canvas drawing

function DataInput(d, i, j) {
  var dataset = d[i][Object.keys(d[i])[j]];
  var datainput;
  if (typeof dataset == 'object' && dataset != null) {
    datainput = NaNCheck(dataset.value);
  } else {
    //number, string, or boolean
    datainput = NaNCheck(dataset);
  }
  return datainput;
}

function stack3d(option, i, ic, datainput, chart) {
  var d = option.data,
    OD = option.ObjectData,
    p = 0;

  var csadd = [];
  for (var j = OD.length; j >= ic; j--) {
    if (OD[j - 1].group.ID == OD[ic - 1].group.ID) {
      var datavalue = DataInput(d, i, j);
      if (datainput >= 0) {
        if (datavalue >= 0) {
          csadd.push(datavalue);
        } else {
          csadd.push(0);
        }
      } else {
        if (datavalue >= 0) {
          csadd.push(0);
        } else {
          csadd.push(datavalue);
        }
      }
    } else {
      csadd.push(0);
    }
  }

  for (var j = 0; j < csadd.length; j++) {
    switch (chart) {
      case 'horizontalbar':
        p += csadd[j];
        break;
      default:
        p += abs(csadd[j]);
        break;
    }
  }
  return p;
}

function stacktotal(option, i, ic, datainput, chart) {
  var d = option.data,
    OD = option.ObjectData;
  var p = 0;

  var csadd = [];

  for (var j = 0; j < OD.length; j++) {
    var ODgroup = OD[j].group || {ID: 1, text: 'Group 1'};
    if (ODgroup.ID == undefined || ODgroup.ID < 1) ODgroup.ID = 1;
    if (ODgroup.ID == OD[ic - 1].group.ID) {
      var jout = j + 1; //((OD.length) - j);
      var datavalue = DataInput(d, i, jout);
      if (datainput >= 0) {
        if (datavalue >= 0) {
          csadd.push(datavalue);
        } else {
          csadd.push(0);
        }
      } else {
        if (datavalue >= 0) {
          csadd.push(0);
        } else {
          csadd.push(datavalue);
        }
      }
    } else {
      csadd.push(0);
    }
  }

  for (var j = 0; j < csadd.length; j++) {
    p += abs(csadd[j]);
  }
  return p;
}

function BarLength(option, length) {
  var ObjectData = option.ObjectData;
  var barpercent = option.barpercent;
  var pattern3d = option.pattern3d;
  if (pattern3d == 'cone') {
    if (barpercent > 80) {
      barpercent = 80;
    }
  } else {
    if (barpercent > 100) {
      barpercent = 100;
    }
  }
  if (barpercent < 0) barpercent = 0;
  return parseFloat(length * (barpercent / 100)) + parseFloat(1 / ObjectData.length);
}

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
  return p;
}

function Stack(option, value, ic, i, g, animP, garray, totalV, vlength, invert, element, scale) {
  scale = (scale || -1) * -1;
  element = element || false;
  var d = option.data,
    ObjectData = option.ObjectData,
    OD = ObjectData[ic - 1],
    datavalue = DataInput(d, i, g),
    v = (datavalue / totalV) * vlength;

  if (scale > 0) value *= 1;
  else value *= -1;

  if (!invert) v *= -1;
  if (v == undefined) v = 0;
  v *= animP;
  v *= garray.length;
  if (ObjectData[g - 1].group.ID != OD.group.ID) v = 0;
  if (invert) {
    if (value >= 0) {
      if (element) {
        if (v < 0) v = 0;
      } else {
        if (v > 0) v = 0;
      }
    } else {
      if (element) {
        if (v > 0) v = 0;
      } else {
        if (v <= 0) v = 0;
      }
    }
  } else {
    if (value <= 0) {
      if (element) {
        if (v > 0) v = 0;
      } else {
        if (v <= 0) v = 0;
      }
    } else {
      if (element) {
        if (v <= 0) v = 0;
      } else if (v > 0) v = 0;
    }
  }
  return v;
}

var NaNCheck = function (x) {
  if (isNaN(parseFloat(x))) return 0;
  else return parseFloat(x);
};

function PStack(option, i, g, value, percentanimation, gtotalresult, totalValues, vlength, invert, element, scale) {
  scale = (scale || -1) * -1;
  element = element || false;
  var data = option.data;
  var ObjectData = option.ObjectData;
  var datavalue = NaNCheck(data[i][Object.keys(data[i])[g]]);
  var pstacktotal = PercentTotal(option, i);

  if (scale > 0) var pstack = Percent(value / totalValues, pstacktotal);
  else var pstack = Percent(value / totalValues, pstacktotal) * -1;

  v = Percent(datavalue / totalValues, pstacktotal) * vlength;
  if (!invert) v *= -1;
  v *= ObjectData.length;
  v *= percentanimation;
  v *= gtotalresult.length;
  if (invert) {
    if (pstack <= 0) {
      if (element) {
        if (v < 0) v = 0;
      } else {
        if (v > 0) v = 0;
      }
    } else {
      if (element) {
        if (v >= 0) v = 0;
      } else {
        if (v <= 0) v = 0;
      }
    }
  } else {
    if (pstack <= 0) {
      if (element) {
        if (v > 0) v = 0;
      } else {
        if (v < 0) v = 0;
      }
    } else {
      if (element) {
        if (v <= 0) v = 0;
      } else {
        if (v > 0) v = 0;
      }
    }
  }
  return v;
}

function bevelbar(ctx, value, x, y, width, height, linewidth, fill, stroke, chart, shadow) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.fillRect(parseInt(x) - 0.5, parseInt(y) - 0.5, parseInt(width) + 1, parseInt(height) + 1);
  ctx.restore();
  var area = 0.5 / 2,
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
      (WidthC = width * areaC), (WidthD = width * areaD);
    } else {
      if (abs(width) <= abs(height)) {
        (WidthC = width * areaC), (WidthD = width * areaD);
      } else {
        (WidthC = height * areaC * -1), (WidthD = width * areaD + WidthHeight * areaC);
      }
    }
  } else if (height < width) {
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
    (WidthC = height * areaC), (WidthD = width * areaD + WidthUp * areaC);
  }

  if (height > width) {
    if (width >= 0) {
      (HeightC = width * areaC), (HeightD = height * areaD + HeightUp * areaC);
    } else {
      if (abs(width) <= abs(height)) {
        HeightC = abs(width) * areaC;
        HeightD = height * areaD + (height + width) * areaC;
      } else {
        HeightC = height * areaC;
        HeightD = height * areaD;
      }
    }
  } else if (height <= width) {
    (HeightC = height * areaC), (HeightD = height * areaD);
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
    c.lineJoin = 'bevel';
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
    c.lineJoin = 'bevel';
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
    c.lineJoin = 'bevel';
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
    c.lineJoin = 'bevel';
    c.setLineDash(dash);
    if (linewidth > 0) c.stroke();
    c.closePath();
    c.restore();
  }

  if (chart == 'barline') {
    var leftshade = 'rgba(255,255,255,0.50)',
      rightshade = 'rgba(0,0,0,0.25)';

    if (value > 0) {
      var bottomshade = 'rgba(255,255,255,0.50)',
        topshade = 'rgba(0,0,0,0.25)';
    } else {
      var topshade = 'rgba(255,255,255,0.25)',
        bottomshade = 'rgba(0,0,0,0.50)';
    }
  } else {
    var topshade = 'rgba(255,255,255,0.25)',
      bottomshade = 'rgba(0,0,0,0.50)';

    if (value > 0) {
      (leftshade = 'rgba(255,255,255,0.50)'), (rightshade = 'rgba(0,0,0,0.25)');
    } else {
      (leftshade = 'rgba(0,0,0,0.25)'), (rightshade = 'rgba(255,255,255,0.50)');
    }
  }

  topbevel(ctx, topshade, stroke, 0, dash);
  leftbevel(ctx, leftshade, stroke, 0, dash);
  rightbevel(ctx, rightshade, stroke, 0, dash);
  bottombevel(ctx, bottomshade, stroke, 0, dash);

  if (chart == 'barline') drawbar(x, y, width, height, linewidth, rgba(0, 0, 0, 0), stroke, shadow);
  else if (chart == 'horizontalbar') drawhbar(x, y, width, height, linewidth, rgba(0, 0, 0, 0), stroke, shadow);
}

function drawbar(ctx, x, y, width, height, linewidth, fill, stroke, shadow) {
  var add;
  width += x;
  height += y;
  if (linewidth > 0) add = 0.5;
  else add = 0;
  add += parseInt(linewidth / 2);
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.save();
  shadowset(ctx, shadow.x, shadow.y, shadow.blur, shadow.color);
  ctx.beginPath();
  ctx.moveTo(x + add, y);
  ctx.lineTo(x + add, height - add);
  ctx.lineTo(width - add, height - add);
  ctx.lineTo(width - add, y);
  ctx.fill();
  ctx.restore();
  ctx.lineWidth = linewidth;
  if (linewidth > 0) ctx.stroke();
}

function wrapTextArray(text, y, maxWidth, lineHeight, letter) {
  letter = letter || false;
  //manage carriage return
  text = text.replace(/(\r\n|\n\r|\r|\n)/g, '\n');
  //manage tabulation
  text = text.replace(/(\t)/g, '    '); // I use 4 spaces for tabulation, but you can use anything you want
  //array of lines
  var sections = text.split('\n');

  var wordnum = 0;
  for (s = 0, len = sections.length; s < len; s++) {
    var words = letter ? sections[s].split('') : sections[s].split(' ');
    var line = '';

    //var words = text.split(' ');
    //var line = '';

    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        line = words[n] + ' ';
        wordnum += 1;
      } else {
        line = testLine;
      }
    }
    wordnum += 1;
  }
  return wordnum;
}

function wrapTextWidth(ctx, text, maxWidth, font, letter) {
  letter = letter || false;
  var line = '';
  var sections;
  if (typeof text == 'string') {
    //manage carriage return
    text = text.replace(/(\r\n|\n\r|\r|\n)/g, '\n');
    //manage tabulation
    text = text.replace(/(\t)/g, '    '); // I use 4 spaces for tabulation, but you can use anything you want
    //array of lines
    var sections = text.split('\n');
  } else if (typeof text == 'number') {
    var sections = [''];
  }

  var textarray = [];
  for (s = 0, len = sections.length; s < len; s++) {
    var words = letter ? sections[s].split('') : sections[s].split(' ');
    var line = '';

    var space = letter ? '' : ' ';
    var textadd = 0;
    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + space;
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        textadd += FontWidth(ctx, line, font);
        line = words[n] + ' ';
        textarray.push(textadd);
      } else {
        line = testLine;
      }
    }
    textarray.push(FontWidth(ctx, line, font));
  }
  return MaxArray(textarray);
}

function FontWidth(ctx, text, font) {
  FontFormat(ctx, font);
  return ctx.measureText(text).width;
}

function MaxArrayLabel(ctx, option, chart) {
  data = option.data;
  labelfont = option.labelfont;
  FontFormat(ctx, labelfont);
  var arrayname = [];
  for (var i = 0; i < data.length; i++) {
    labelwidth = LabelOutput(option, i, false, chart, true);
    arrayname.push(ctx.measureText(labelwidth).width);
  }
  var maxarray = MaxArray(arrayname);
  if (data.length < 1e6) {
    return Math.ceil(maxarray);
  } else return labelfont.fontSize;
}

function TopBottom(option, TB, chart) {
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
    (customX = option.x), (customY = option.y);
  } else {
    (customX = 0), (customY = 0);
  }
  (conw = option.size.width), (conh = option.size.height);

  H.display = H.display || false;
  SH.display = SH.display || false;
  F.display = F.display || false;

  if (chart != 'piedoughnut' && chart != 'pie' && chart != 'doughnut' && chart != 'cone' && chart != 'pyramid' && chart != 'cylinder' && chart != 'radar') {
    var L = option.labelleft,
      R = option.labelright;
    L.display = L.display || false;
    R.display = R.display || false;

    if (L.display) LHeight = wrapTextHeight(ctx, L.text, 0, conh, TextFontHeight(ctx, L), false);
    else LHeight = 4;

    if (R.display) RHeight = wrapTextHeight(ctx, R.text, 0, conh, TextFontHeight(ctx, R), false);
    else RHeight = 4;
    var Wdeduct = LHeight + RHeight;
  }

  var top, bottom, topadd, subtopadd, bottomadd, labeladd, numadd, numaddleft, numaddright;

  switch (chart) {
    case 'horizontalbar':
      var measurefont = option.measurefont;

      if (H.display) {
        topadd = wrapTextHeight(ctx, H.text, 5, conw - Wdeduct, TextFontHeight(ctx, H), false);
      } else {
        topadd = 5;
      }

      if (SH.display) {
        subtopadd = wrapTextHeight(ctx, SH.text, 5, conw - Wdeduct, TextFontHeight(ctx, SH), false);
      } else {
        subtopadd = 5;
      }

      if (F.display) {
        bottomadd = wrapTextHeight(ctx, F.text, 10, conw - Wdeduct, TextFontHeight(ctx, F), false);
      } else {
        bottomadd = 5;
      }

      //top = parseInt(topadd + subtopadd);
      //bottom = parseInt(conh - (bottomadd));

      labeladd = TextFontHeight(ctx, measurefont) + 2;
      break;
    case 'pie':
    case 'doughnut':
    case 'radar':
    case 'cone':
    case 'cylinder':
    case 'pyramid':
      if (H.display) topadd = wrapTextHeight(ctx, H.text, 10, conw, TextFontHeight(ctx, H), false);
      else topadd = 10;

      if (SH.display) subtopadd = wrapTextHeight(ctx, SH.text, 10, conw, TextFontHeight(ctx, SH), false);
      else subtopadd = 10;
      if (F.display) bottomadd = wrapTextHeight(ctx, F.text, 10, conw, TextFontHeight(ctx, F), false);
      else bottomadd = 10;

      labeladd = 0;
      break;
    default:
      if (H.display) topadd = wrapTextHeight(ctx, H.text, 25, conw - Wdeduct, TextFontHeight(ctx, H), false);
      else topadd = 25;
      if (SH.display) subtopadd = wrapTextHeight(ctx, SH.text, 0, conw - Wdeduct, TextFontHeight(ctx, SH), false);
      else subtopadd = 0;
      if (F.display) bottomadd = wrapTextHeight(ctx, F.text, 25, conw - Wdeduct, TextFontHeight(ctx, F), false);
      else bottomadd = 20;

      labeladd = 0;
  }

  if (chart == 'radar') {
    top = parseInt((topadd + subtopadd * 0.6) * 0.5);
    bottom = parseInt(bottomadd);
  } else if (chart == 'pie' || chart == 'doughnut' || chart == 'cone' || chart == 'cylinder' || chart == 'pyramid') {
    //top = parseInt(topadd + subtopadd /*+ numadd*/);
    //bottom = parseInt(conh - (bottomadd + labeladd/*+ numadd*/));
  } else {
    top = parseInt(topadd + subtopadd /*+ numadd*/);
    bottom = parseInt(conh - (bottomadd + labeladd) /*+ numadd*/);
  }
  if (TB == 'top') return top + customY;
  else if (TB == 'bottom') return bottom + customY;
}

function LabelRotate(ctx, option, length, chart) {
  var data = dataarrayoutput(option),
    labelfont = option.labelfont,
    rotatelabel = labelfont.rotatelabel || false,
    duration = option.duration;
  duration.interval = NaNCheck(duration.interval) || 1;
  if (duration.interval < 1) duration.interval = 1;
  var intervalx = parseInt(duration.interval);
  var result,
    labelxarray = [];
  for (var j = 0; j < data.length; j++) {
    var internalout = j * intervalx;
    if (internalout >= data.length) break;
    var labelout;
    if (chart == 'bubble') labelout = convertnum(internalout);
    else labelout = LabelOutput(option, internalout, false, chart);
    labelxarray.push(FontWidth(ctx, labelout, labelfont) + (labelfont.fontSize + 5));
  }
  var maxarray = MaxArray(labelxarray);
  var labelxmeasure = parseFloat(maxarray);
  var datameasure = parseFloat((length * intervalx) / data.length);
  if (labelxmeasure > datameasure) {
    result = datameasure - labelxmeasure;
    if (result < -90) result = -90;
  } else {
    result = 0;
  }
  return result;
}

function clear(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}

function polygon(ctx, p, fill, stroke, linewidth, dash, shadow, close) {
  close = close || false;
  shadow = shadow || nullshadow;
  fill = fill || rgba(0, 0, 0, 0);
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  for (var i = 0; i < p.length; i++) {
    if (i == 0) ctx.moveTo(p[0].x, p[0].y);
    else ctx.lineTo(p[i].x, p[i].y);
  }

  shadowset(ctx, shadow.x, shadow.y, shadow.blur, shadow.color);
  ctx.fill();
  ctx.lineWidth = linewidth;
  ctx.setLineDash(dash);
  ctx.lineJoin = 'bevel';
  if (linewidth > 0) ctx.stroke();
  if (close) ctx.closePath();
  ctx.restore();
}

function lmeasureout(ctx, option, precision, chart, i) {
  i = i || 0;
  var data = dataarrayoutput(option),
    duration = option.duration,
    labelfont = option.labelfont;

  duration.interval = NaNCheck(duration.interval) || 1;
  if (duration.interval < 1) duration.interval = 1;
  var intervalx = parseInt(duration.interval);

  hA = BaseNum(ctx, option, 'left', precision, chart);
  hB = BaseNum(ctx, option, 'right', precision, chart);

  var Wcanvas = (hB - hA) / data.length;
  var wmeasure = Wcanvas * intervalx;

  var namearray = [];
  for (var j = 0; j < data.length; j++) {
    var labelmeasure;
    labelmeasure = LabelOutput(option, j, false, chart);
    namearray.push(FontWidth(ctx, labelmeasure, labelfont) / intervalx);
  }
  var maxarrayname = MaxArray(namearray);
  var lmeasure = intervalx * i;

  if (maxarrayname > wmeasure) {
    if (isEven(lmeasure)) return FontHeight(ctx, labelfont) + 2;
    else return 0;
  } else {
    return 0;
  }
}

function BaseNum(ctx, option, leftright, precision, chart) {
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
    (customX = option.x), (customY = option.y);
  } else {
    (customX = 0), (customY = 0);
  }
  (conw = option.size.width), (conh = option.size.height);

  percentstack = percentstack || false;
  precision = NaNCheck(precision);

  if (chart == 'piedoughnut' || chart == 'pie' || chart == 'doughnut' || chart == 'cone' || chart == 'pyramid' || chart == 'cylinder') {
    Data = data;
  } else {
    Data = DataOutput(option);
  }

  var conwlegend;
  switch (legendposition) {
    case 'left':
    case 'right':
      conwlegend = conw * 0.2;
      break;
    default:
      conwlegend = conw;
      break;
  }

  var wraptextarray = [];
  var labelcheck = [];
  for (j = 0; j < Data.length; j++) {
    if (chart == 'piedoughnut' || chart == 'pie' || chart == 'doughnut' || chart == 'cone' || chart == 'pyramid' || chart == 'cylinder') {
      labelcheck.push(Data[j][Object.keys(Data[j])[0]].toString());
    } else {
      if (Data == data) {
        labelcheck.push(LabelOutput(option, j, false, chart, true).toString());
      } else labelcheck.push(ObjectData[j][Object.keys(ObjectData[j])[0]].toString());
    }
  }

  for (k = 0; k < Data.length; k++) {
    wraptextarray.push(parseInt(wrapTextWidth(ctx, labelcheck[k], conwlegend, legendfont, true)));
  }

  //Legend Array
  var legendresult = DataOutput(option);
  var legendarray = MaxArray(wraptextarray) + 35; //20 + this.MaxArrayText(option, chart);//
  //var legendarray = 20 + this.MaxArrayText(option, chart);//
  var measureleftlength = MeasureLabelLength(ctx, option, measureleft, chart, precision);
  var measurerightlength;
  if (!enable3d) measurerightlength = MeasureLabelLength(ctx, option, measureright, chart, precision);
  else measurerightlength = 0;

  var LLtextheight = LabelMeasureHeight(ctx, optionLL, conh);
  var LRtextheight = LabelMeasureHeight(ctx, optionLR, conh);
  var canvasleft = parseInt(LLtextheight + measureleftlength);
  var canvasright = parseInt(conw - (LRtextheight + measurerightlength));
  switch (legendposition) {
    case 'left':
      baseA = canvasleft + legendarray;
      baseB = canvasright; //default
      break;
    case 'right':
      baseA = canvasleft;
      baseB = canvasright - legendarray;
      break;
    default:
      baseA = canvasleft;
      baseB = canvasright; //default
  }
  if (leftright == 'left') return baseA + customX;
  else if (leftright == 'right') return baseB + customX;
}

function MeasureLabelLength(ctx, option, font, chart, precision) {
  if (font.display) {
    if (font.textdirection == 'left') return FontHeight(ctx, font);
    else if (font.textdirection == 'right') return FontHeight(ctx, font);
    else return MeasureArray(ctx, option, font, chart, precision) + 10;
  } else {
    return 10;
  }
}

function MeasureArray(ctx, option, font, chart, precision) {
  var numA, numB;
  var format = option.format,
    convert = option.kmflag,
    minset = option.min || 0;
  format.prefix = format.prefix || '';
  format.suffix = format.suffix || '';
  var percentstack = option.percentstack;

  //top
  var vmovey = TBPosition(ctx, option, chart, 'top');
  //bottom
  var vposition = TBPosition(tx, option, chart, 'bottom');
  var HCanvas = vposition - vmovey;
  var max = MaxMin(option, chart, true),
    min = MaxMin(option, chart, false);

  var valueuptotal = ValueTotal(option, chart, 'up'),
    valuedowntotal = ValueTotal(option, chart, 'down');

  var array = [];
  FontFormat(ctx, font);

  var varCompute = ComputeCheck(option, vposition, max, min, 'x');
  var varP = VarPcount(option, vposition, max, min, 'x');
  var lineDrawCount = LineCount(option, vposition, max, min, 'x');
  var intervalH = HCanvas / (lineDrawCount - 1);

  //varCompute
  for (var i = 0; i < lineDrawCount; i++) {
    if (valueuptotal >= valuedowntotal) {
      cy = parseInt(i * intervalH) + vmovey;
    } else if (valueuptotal < valuedowntotal) {
      cy = parseInt((lineDrawCount - 1 - i) * intervalH) + vmovey;
    }

    var text = '';

    if (varP > minset) text = varP;
    else if (varP == minset) text = minset;
    else {
      text = varP;
    }

    if (percentstack) num = Num(option, chart, text, 'x', false, false, precision);
    else num = Num(option, chart, text, 'x', false, convert, precision);

    varP -= varCompute;

    array.push(ctx.measureText(num).width);
  }

  var maxarray = MaxArray(array);
  return maxarray;
}

function LabelMeasureHeight(ctx, font, h) {
  if (font.display) return wrapTextHeight(ctx, font.text, 10, h, FontHeight(ctx, font), false);
  else return 10;
}

function BarY(option, i, h, Yorigin) {
  var intervaldata = option.intervaldata || 1,
    data = dataarrayoutput(option),
    ObjectData = option.ObjectData,
    barpercent = option.barpercent;
  var Yoriginplus;
  if (data.length == 1) Yoriginplus = Yorigin + h / 2;
  else Yoriginplus = Yorigin;
  var percentminus = BarPercentMinus(option, h, barpercent);
  return Yoriginplus - (parseFloat(h * (i + 1) * ObjectData.length) - percentminus * ObjectData.length + 1);
}

function group3dstack(option, i) {
  var ObjectData = option.ObjectData;
  var OD3D = [],
    D3D;
  for (var j = 1; j <= ObjectData.length; j++) {
    D3D = DataInput(data, i, j);
    OD3D.push(D3D);
  }
  var ODadd = [],
    ODsub = [];
  for (var j = 0; j < ObjectData.length; j++) {
    if (OD3D[j] >= 0) {
      ODadd.push(1);
      ODsub.push(0);
    } else {
      ODadd.push(0);
      ODsub.push(1);
    }
  }

  var result = [],
    group3dadd = 0,
    groud3dsub = 0;
  for (var j = 0; j < ObjectData.length; j++) {
    var data3dout = OD3D[j];
    if (data3dout >= 0) {
      group3dadd += ODadd[j];
      result.push(group3dadd);
    } else {
      groud3dsub -= ODsub[j];
      result.push(groud3dsub);
    }
  }
  return result;
}

function GradientCheck(ctx, array, centerX, centerY, area) {
  var GradX = centerX - area;
  var GradY = centerY - area;
  var GradDX = centerX - area * 0.5;
  var GradDY = centerY - area * 0.5;
  var gtypeout = array.gradienttype || 'linear a';
  gtypeout = gtypeout.toLowerCase();
  //console.log(gtypeout)
  switch (gtypeout) {
    case 'linear a':
      fill = GradientLinear(ctx, 0, GradY, area, area * 2, array.fill, true, false);
      break;
    case 'linear b':
      fill = GradientLinear(ctx, 0, GradY, area, area * 2, array.fill, false, false);
      break;
    case 'linear c':
      fill = GradientLinear(ctx, GradX, 0, area * 2, area, array.fill, true, true);
      break;
    case 'linear d':
      fill = GradientLinear(ctx, GradX, 0, area * 2, area, array.fill, false, true);
      break;
    case 'linear e':
      fill = GradientLinear(ctx, GradDX, GradY, area * 2.5, area * 2.5, array.fill, false, true, true);
      break;
    case 'linear f':
      fill = GradientLinear(ctx, GradDX, GradY, area * 2.5, area * 2.5, array.fill, true, true, true);
      break;
    case 'linear g':
      fill = GradientLinear(ctx, GradDX, GradDY, area * 2.5, area * 2.5, array.fill, false, false, true);
      break;
    case 'linear h':
      fill = GradientLinear(ctx, GradDX, GradDY, area * 2.5, area * 2.5, array.fill, true, false, true);
      break;
    case 'radial':
      fill = GradientCircle(ctx, centerX, centerY, area / 5, centerX, centerY, area, array.fill);
      break;
  }
  return fill;
}

function Arc(x, y, r, start, end, width, strokecolor, ctx) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.arc(x, y, r, start, end, false);
  ctx.strokeStyle = strokecolor;
  ctx.stroke();
}

function Text(ctx, text, x, y, rotate, fill, stroke, strokewidth, align, baseline, font) {
  ctx.save();
  FontFormat(ctx, font);
  TextLine(ctx, text, parseInt(x), parseInt(y), fill, font, align, baseline);
  TextDisplay(ctx, text, parseInt(x), parseInt(y), rotate, fill, stroke, strokewidth, align, baseline);
  ctx.restore();
}

function TextDisplay(ctx, text, x, y, rotate, fill, stroke, strokewidth, align, baseline) {
  stroke = stroke || 'black';
  strokewidth = strokewidth || 0;
  ctx.save();
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.translate(parseInt(x), parseInt(y));
  ctx.rotate(toRadians(angleresult(rotate)));
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(text, 0, 0);
  if (strokewidth > 0) ctx.strokeText(text, 0, 0);
  ctx.restore();
}

function roundedrectangle(ctx, x, y, width, height, area, rotate, linewidth, fill, stroke, dash, shadow) {
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
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.save();
  shadowset(ctx, shadow.x, shadow.y, shadow.blur, shadow.color);
  ctx.translate(xa, ya);
  ctx.rotate(toRadians(angleresult(rotate)));
  ctx.beginPath();
  ctx.moveTo(xb + WidthC, yb);
  ctx.lineTo(xb + WidthD, yb);
  ctx.quadraticCurveTo(xe, yb, xe, yb + HeightC);
  ctx.lineTo(xe, yb + HeightD);
  ctx.quadraticCurveTo(xe, ye, xb + WidthD, ye);
  ctx.lineTo(xb + WidthC, ye);
  ctx.quadraticCurveTo(xb, ye, xb, yb + HeightD);
  ctx.lineTo(xb, yb + HeightC);
  ctx.quadraticCurveTo(xb, yb, xb + WidthC, yb);
  if (linewidth > 0) ctx.stroke();
  ctx.fill();
  ctx.restore();
  ctx.lineWidth = linewidth;
  ctx.setLineDash(dash);
  ctx.closePath();
  if (linewidth > 0) ctx.stroke();
}

function cylinder (ctx, x, y, width, height, area, bar, vertical, scale, fill, stroke, linewidth, dash, shadow, chart, option, ic, i, group, Garray) {
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
