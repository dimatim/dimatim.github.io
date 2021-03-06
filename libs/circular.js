/**
 * Created by Dima on 07-Feb-16.
 */

var stopArray = [];

function stopSpinner(canvasId) {
    stopArray.push(canvasId);
}

function startSpinner(data) {
    stopArray = [];
    if (data['canvas'] == null || data['colors'] == null)
        return;
    data['adjustPosition'] = 0;
    if (data['radianIncrement'] == null)
        data['radianIncrement'] = Math.PI / 180;
    if (data['duration'] == null)
        data['duration'] = 2000;
    if (data['fadeOutDuration'] == null)
        data['fadeOutDuration'] = 50;
    if (data['spacing'] == null)
        data['spacing'] = 0;
    if (data['repeat'] == null)
        data['repeat'] = 1;
    if (data['lineWidth'] == null)
        data['lineWidth'] = 5;
    if (data['maxRadius'] == null)
        data['maxRadius'] = 50;
    if (data['minRadians'] == null)
        data['minRadians'] = Math.PI / 3;
    if (data['maxRadians'] == null)
        data['maxRadians'] = 3 / 2 * Math.PI;
    if (data['maxRadiansBackup'] == null)
        data['maxRadiansBackup'] = data['maxRadians'];
    data.maxRadius = Math.min.apply(Math, [(data.canvas.width() - data.lineWidth) / 2, (data.canvas.height() - data.lineWidth) / 2, data.maxRadius]);

    data.maxRadians = data.maxRadiansBackup;
    animate(data);
}

function animate(data) {
    var reverse = data.reverse;
    var dir = reverse ? -1 : 1;
    $({progress: reverse ? 1 : 0}).animate({progress: reverse ? 0 : 1}, {
        duration: data.duration,
        easing: "linear",
        step: function (now) {
            data.adjustPosition += data.radianIncrement * dir; // speed
            data.adjustPosition %= 2 * Math.PI;
            create(now, data);
        },
        complete: function () {
            if ($.inArray(data.canvas.attr('id'), stopArray) > -1) {
                stopArray.splice(stopArray.indexOf(data.canvas.attr('id')), 1);
                endSpin(data);
            } else {
                data.adjustPosition += data.maxRadians * dir;
                data.adjustPosition %= 2 * Math.PI;
                animate(data);
            }
        }
    });
}

function endSpin(data) {
    var reverse = data.reverse;
    var dir = reverse ? -1 : 1;
    if (!data.reverse) {
        data.adjustPosition += data.maxRadians * dir;
        data.adjustPosition %= 2 * Math.PI;
    }
    data.maxRadians = 2 * Math.PI;
    $({progress: reverse ? 1 : 0}).animate({progress: .5}, {
        duration: data.fadeOutDuration,
        easing: "linear",
        step: function (now) {
            data.adjustPosition += data.radianIncrement * dir; // speed
            data.adjustPosition %= 2 * Math.PI;
            var context = data.canvas[0].getContext('2d');
            context.globalAlpha = 1 - (data.reverse ? Math.abs(now - 1) : now) * 2;
            create(now, data);
        }
    });
}

function create(now, data) {
    var context = data.canvas[0].getContext('2d');
    context.clearRect(0, 0, data.canvas.width(), data.canvas.height());
    var maxNumIterations = Math.ceil(Math.min((data.maxRadius - 2) / (data.lineWidth + data.spacing), data.repeat * data.colors.length));
    for (var i = 0; i < maxNumIterations; ++i) {
        drawCircle(data, i, now);
    }
}

function drawCircle(data, iteration, fraction) {
    var context = data.canvas[0].getContext('2d');
    var size = [data.canvas.width() / 2, data.canvas.height() / 2];
    var index = iteration % data.colors.length;
    var radius = data.maxRadius - iteration * (data.lineWidth + data.spacing);
    var color = data.colors[index].color;
    var offset = data.colors[index].offset;
    context.beginPath();
    context.lineWidth = data.lineWidth;
    context.strokeStyle = color;
    var reverse = fraction > .5;
    var start = offset + data.adjustPosition + (reverse ? (fraction - .5) * 2 * data.maxRadians : 0);
    var end = data.minRadians + offset + data.adjustPosition + (reverse ? data.maxRadians : fraction * 2 * data.maxRadians);
    context.arc(size[0], size[1], radius, start, end);
    context.stroke();
}

/*function drawCircleEnd(data, iteration, fraction) {
 var fillFraction = data.reverse ? Math.abs(fraction - 1) : fraction;
 var context = data.canvas[0].getContext('2d');
 var size = [data.canvas.width() / 2, data.canvas.height() / 2];
 var index = iteration % data.colors.length;
 var radius = iteration == 0 ? Math.max(data.maxRadius / 2, (data.maxRadius - data.maxRadius * fillFraction * 2)) : (data.maxRadius - iteration * (data.lineWidth + data.spacing));
 var color = data.colors[index].color;
 var offset = data.colors[index].offset;
 context.beginPath();
 context.lineWidth = iteration == 0 ? Math.min(data.maxRadius, (data.lineWidth + (data.maxRadius - data.lineWidth) * fillFraction * 4)) : data.lineWidth;
 context.strokeStyle = color;
 var reverse = fraction > .5;
 var start = offset + data.adjustPosition + (reverse ? (fraction - .5) * 2 * data.maxRadians : 0);
 var end = data.minRadians + offset + data.adjustPosition + (reverse ? data.maxRadians : fraction * 2 * data.maxRadians);
 context.arc(size[0], size[1], radius, start, end);
 context.stroke();
 }*/