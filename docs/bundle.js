(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
function shuffle(array) {
    var counter = array.length;
    var temp = 0;
    var index = 0;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
}
exports.shuffle = shuffle;
function classifyTwoGaussData(numSamples, noise) {
    var points = [];
    var varianceScale = d3.scale.linear().domain([0, .5]).range([0.5, 4]);
    var variance = varianceScale(noise);
    function genGauss(cx, cy, label) {
        for (var i = 0; i < numSamples / 2; i++) {
            var x = normalRandom(cx, variance);
            var y = normalRandom(cy, variance);
            points.push({ x: x, y: y, label: label });
        }
    }
    genGauss(2, 2, 1);
    genGauss(-2, -2, -1);
    return points;
}
exports.classifyTwoGaussData = classifyTwoGaussData;
function regressPlane(numSamples, noise) {
    var radius = 6;
    var labelScale = d3.scale.linear()
        .domain([-10, 10])
        .range([-1, 1]);
    var getLabel = function (x, y) { return labelScale(x + y); };
    var points = [];
    for (var i = 0; i < numSamples; i++) {
        var x = randUniform(-radius, radius);
        var y = randUniform(-radius, radius);
        var noiseX = randUniform(-radius, radius) * noise;
        var noiseY = randUniform(-radius, radius) * noise;
        var label = getLabel(x + noiseX, y + noiseY);
        points.push({ x: x, y: y, label: label });
    }
    return points;
}
exports.regressPlane = regressPlane;
function regressGaussian(numSamples, noise) {
    var points = [];
    var labelScale = d3.scale.linear()
        .domain([0, 2])
        .range([1, 0])
        .clamp(true);
    var gaussians = [
        [-4, 2.5, 1],
        [0, 2.5, -1],
        [4, 2.5, 1],
        [-4, -2.5, -1],
        [0, -2.5, 1],
        [4, -2.5, -1]
    ];
    function getLabel(x, y) {
        var label = 0;
        gaussians.forEach(function (_a) {
            var cx = _a[0], cy = _a[1], sign = _a[2];
            var newLabel = sign * labelScale(dist({ x: x, y: y }, { x: cx, y: cy }));
            if (Math.abs(newLabel) > Math.abs(label)) {
                label = newLabel;
            }
        });
        return label;
    }
    var radius = 6;
    for (var i = 0; i < numSamples; i++) {
        var x = randUniform(-radius, radius);
        var y = randUniform(-radius, radius);
        var noiseX = randUniform(-radius, radius) * noise;
        var noiseY = randUniform(-radius, radius) * noise;
        var label = getLabel(x + noiseX, y + noiseY);
        points.push({ x: x, y: y, label: label });
    }
    ;
    return points;
}
exports.regressGaussian = regressGaussian;
function classifySpiralData(numSamples, noise) {
    var points = [];
    var n = numSamples / 2;
    function genSpiral(deltaT, label) {
        for (var i = 0; i < n; i++) {
            var r = i / n * 5;
            var t = 1.75 * i / n * 2 * Math.PI + deltaT;
            var x = r * Math.sin(t) + randUniform(-1, 1) * noise;
            var y = r * Math.cos(t) + randUniform(-1, 1) * noise;
            points.push({ x: x, y: y, label: label });
        }
    }
    genSpiral(0, 1);
    genSpiral(Math.PI, -1);
    return points;
}
exports.classifySpiralData = classifySpiralData;
function classifyCircleData(numSamples, noise) {
    var points = [];
    var radius = 5;
    function getCircleLabel(p, center) {
        return (dist(p, center) < (radius * 0.5)) ? 1 : -1;
    }
    for (var i = 0; i < numSamples / 2; i++) {
        var r = randUniform(0, radius * 0.5);
        var angle = randUniform(0, 2 * Math.PI);
        var x = r * Math.sin(angle);
        var y = r * Math.cos(angle);
        var noiseX = randUniform(-radius, radius) * noise;
        var noiseY = randUniform(-radius, radius) * noise;
        var label = getCircleLabel({ x: x + noiseX, y: y + noiseY }, { x: 0, y: 0 });
        points.push({ x: x, y: y, label: label });
    }
    for (var i = 0; i < numSamples / 2; i++) {
        var r = randUniform(radius * 0.7, radius);
        var angle = randUniform(0, 2 * Math.PI);
        var x = r * Math.sin(angle);
        var y = r * Math.cos(angle);
        var noiseX = randUniform(-radius, radius) * noise;
        var noiseY = randUniform(-radius, radius) * noise;
        var label = getCircleLabel({ x: x + noiseX, y: y + noiseY }, { x: 0, y: 0 });
        points.push({ x: x, y: y, label: label });
    }
    return points;
}
exports.classifyCircleData = classifyCircleData;
function classifyXORData(numSamples, noise) {
    function getXORLabel(p) { return p.x * p.y >= 0 ? 1 : -1; }
    var points = [];
    for (var i = 0; i < numSamples; i++) {
        var x = randUniform(-5, 5);
        var padding = 0.3;
        x += x > 0 ? padding : -padding;
        var y = randUniform(-5, 5);
        y += y > 0 ? padding : -padding;
        var noiseX = randUniform(-5, 5) * noise;
        var noiseY = randUniform(-5, 5) * noise;
        var label = getXORLabel({ x: x + noiseX, y: y + noiseY });
        points.push({ x: x, y: y, label: label });
    }
    return points;
}
exports.classifyXORData = classifyXORData;
function randUniform(a, b) {
    return Math.random() * (b - a) + a;
}
function normalRandom(mean, variance) {
    if (mean === void 0) { mean = 0; }
    if (variance === void 0) { variance = 1; }
    var v1, v2, s;
    do {
        v1 = 2 * Math.random() - 1;
        v2 = 2 * Math.random() - 1;
        s = v1 * v1 + v2 * v2;
    } while (s > 1);
    var result = Math.sqrt(-2 * Math.log(s) / s) * v1;
    return mean + Math.sqrt(variance) * result;
}
function dist(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}
},{}],2:[function(require,module,exports){
"use strict";
var NUM_SHADES = 30;
var HeatMap = (function () {
    function HeatMap(width, numSamples, xDomain, yDomain, container, userSettings) {
        this.settings = {
            showAxes: false,
            noSvg: false
        };
        this.numSamples = numSamples;
        var height = width;
        var padding = userSettings.showAxes ? 20 : 0;
        if (userSettings != null) {
            for (var prop in userSettings) {
                this.settings[prop] = userSettings[prop];
            }
        }
        this.xScale = d3.scale.linear()
            .domain(xDomain)
            .range([0, width - 2 * padding]);
        this.yScale = d3.scale.linear()
            .domain(yDomain)
            .range([height - 2 * padding, 0]);
        var tmpScale = d3.scale.linear()
            .domain([0, .5, 1])
            .range(["#f59322", "#e8eaeb", "#0877bd"])
            .clamp(true);
        var colors = d3.range(0, 1 + 1E-9, 1 / NUM_SHADES).map(function (a) {
            return tmpScale(a);
        });
        this.color = d3.scale.quantize()
            .domain([-1, 1])
            .range(colors);
        container = container.append("div")
            .style({
            width: width + "px",
            height: height + "px",
            position: "relative",
            top: "-" + padding + "px",
            left: "-" + padding + "px"
        });
        this.canvas = container.append("canvas")
            .attr("width", numSamples)
            .attr("height", numSamples)
            .style("width", (width - 2 * padding) + "px")
            .style("height", (height - 2 * padding) + "px")
            .style("position", "absolute")
            .style("top", padding + "px")
            .style("left", padding + "px");
        if (!this.settings.noSvg) {
            this.svg = container.append("svg").attr({
                "width": width,
                "height": height
            }).style({
                "position": "absolute",
                "left": "0",
                "top": "0"
            }).append("g")
                .attr("transform", "translate(" + padding + "," + padding + ")");
            this.svg.append("g").attr("class", "train");
            this.svg.append("g").attr("class", "validation");
            this.svg.append("g").attr("class", "test");
        }
        if (this.settings.showAxes) {
            var xAxis = d3.svg.axis()
                .scale(this.xScale)
                .orient("bottom");
            var yAxis = d3.svg.axis()
                .scale(this.yScale)
                .orient("right");
            this.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (height - 2 * padding) + ")")
                .call(xAxis);
            this.svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + (width - 2 * padding) + ",0)")
                .call(yAxis);
        }
    }
    HeatMap.prototype.updateTrainPoints = function (points) {
        if (this.settings.noSvg) {
            throw Error("Can't add points since noSvg=true");
        }
        this.updateCircles(this.svg.select("g.train"), points);
    };
    HeatMap.prototype.updateValidationPoints = function (points) {
        if (this.settings.noSvg) {
            throw Error("Can't add points since noSvg=true");
        }
        this.updateCircles(this.svg.select("g.validation"), points);
    };
    HeatMap.prototype.updateTestPoints = function (points) {
        if (this.settings.noSvg) {
            throw Error("Can't add points since noSvg=true");
        }
        this.updateCircles(this.svg.select("g.test"), points);
    };
    HeatMap.prototype.updateBackground = function (data, discretize) {
        var dx = data[0].length;
        var dy = data.length;
        if (dx !== this.numSamples || dy !== this.numSamples) {
            throw new Error("The provided data matrix must be of size " +
                "numSamples X numSamples");
        }
        var context = this.canvas.node().getContext("2d");
        var image = context.createImageData(dx, dy);
        for (var y = 0, p = -1; y < dy; ++y) {
            for (var x = 0; x < dx; ++x) {
                var value = data[x][y];
                if (discretize) {
                    value = (value >= 0 ? 1 : -1);
                }
                var c = d3.rgb(this.color(value));
                image.data[++p] = c.r;
                image.data[++p] = c.g;
                image.data[++p] = c.b;
                image.data[++p] = 160;
            }
        }
        context.putImageData(image, 0, 0);
    };
    HeatMap.prototype.updateCircles = function (container, points) {
        var _this = this;
        var xDomain = this.xScale.domain();
        var yDomain = this.yScale.domain();
        points = points.filter(function (p) {
            return p.x >= xDomain[0] && p.x <= xDomain[1]
                && p.y >= yDomain[0] && p.y <= yDomain[1];
        });
        var selection = container.selectAll("circle").data(points);
        selection.enter().append("circle").attr("r", 3);
        selection
            .attr({
            cx: function (d) { return _this.xScale(d.x); },
            cy: function (d) { return _this.yScale(d.y); }
        })
            .style("fill", function (d) { return _this.color(d.label); });
        selection.exit().remove();
    };
    return HeatMap;
}());
exports.HeatMap = HeatMap;
function reduceMatrix(matrix, factor) {
    if (matrix.length !== matrix[0].length) {
        throw new Error("The provided matrix must be a square matrix");
    }
    if (matrix.length % factor !== 0) {
        throw new Error("The width/height of the matrix must be divisible by " +
            "the reduction factor");
    }
    var result = new Array(matrix.length / factor);
    for (var i = 0; i < matrix.length; i += factor) {
        result[i / factor] = new Array(matrix.length / factor);
        for (var j = 0; j < matrix.length; j += factor) {
            var avg = 0;
            for (var k = 0; k < factor; k++) {
                for (var l = 0; l < factor; l++) {
                    avg += matrix[i + k][j + l];
                }
            }
            avg /= (factor * factor);
            result[i / factor][j / factor] = avg;
        }
    }
    return result;
}
exports.reduceMatrix = reduceMatrix;
},{}],3:[function(require,module,exports){
"use strict";
var AppendingLineChart = (function () {
    function AppendingLineChart(container, lineColors) {
        this.data = [];
        this.minY = Number.MAX_VALUE;
        this.maxY = Number.MIN_VALUE;
        this.lineColors = lineColors;
        this.numLines = lineColors.length;
        var node = container.node();
        var totalWidth = node.offsetWidth;
        var totalHeight = node.offsetHeight;
        var margin = { top: 2, right: 0, bottom: 2, left: 2 };
        var width = totalWidth - margin.left - margin.right;
        var height = totalHeight - margin.top - margin.bottom;
        this.xScale = d3.scale.linear()
            .domain([0, 0])
            .range([0, width]);
        this.yScale = d3.scale.linear()
            .domain([0, 0])
            .range([height, 0]);
        this.svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        this.paths = new Array(this.numLines);
        for (var i = 0; i < this.numLines; i++) {
            this.paths[i] = this.svg.append("path")
                .attr("class", "line")
                .style({
                "fill": "none",
                "stroke": lineColors[i],
                "stroke-width": "1.5px"
            });
        }
    }
    AppendingLineChart.prototype.reset = function () {
        this.data = [];
        this.redraw();
        this.minY = Number.MAX_VALUE;
        this.maxY = Number.MIN_VALUE;
    };
    AppendingLineChart.prototype.addDataPoint = function (dataPoint) {
        var _this = this;
        if (dataPoint.length !== this.numLines) {
            throw Error("Length of dataPoint must equal number of lines");
        }
        dataPoint.forEach(function (y) {
            _this.minY = Math.min(_this.minY, y);
            _this.maxY = Math.max(_this.maxY, y);
        });
        this.data.push({ x: this.data.length + 1, y: dataPoint });
        this.redraw();
    };
    AppendingLineChart.prototype.redraw = function () {
        var _this = this;
        this.xScale.domain([1, this.data.length]);
        this.yScale.domain([this.minY, this.maxY]);
        var getPathMap = function (lineIndex) {
            return d3.svg.line()
                .x(function (d) { return _this.xScale(d.x); })
                .y(function (d) { return _this.yScale(d.y[lineIndex]); });
        };
        for (var i = 0; i < this.numLines; i++) {
            this.paths[i].datum(this.data).attr("d", getPathMap(i));
        }
    };
    return AppendingLineChart;
}());
exports.AppendingLineChart = AppendingLineChart;
},{}],4:[function(require,module,exports){
"use strict";
var Node = (function () {
    function Node(id, activation, initOrigin) {
        this.inputLinks = [];
        this.bias = 0.0;
        this.outputs = [];
        this.outputDer = 0;
        this.inputDer = 0;
        this.accInputDer = 0;
        this.numAccumulatedDers = 0;
        this.id = id;
        this.activation = activation;
        if (initOrigin) {
            this.bias = 0.1;
        }
    }
    Node.prototype.updateOutput = function () {
        this.totalInput = this.bias;
        for (var j = 0; j < this.inputLinks.length; j++) {
            var link = this.inputLinks[j];
            this.totalInput += link.weight * link.source.output;
        }
        this.output = this.activation.output(this.totalInput);
        return this.output;
    };
    return Node;
}());
exports.Node = Node;
var Errors = (function () {
    function Errors() {
    }
    return Errors;
}());
Errors.SQUARE = {
    error: function (output, target) {
        return 0.5 * Math.pow(output - target, 2);
    },
    der: function (output, target) { return output - target; }
};
exports.Errors = Errors;
Math.tanh = Math.tanh || function (x) {
    if (x === Infinity) {
        return 1;
    }
    else if (x === -Infinity) {
        return -1;
    }
    else {
        var e2x = Math.exp(2 * x);
        return (e2x - 1) / (e2x + 1);
    }
};
var Activations = (function () {
    function Activations() {
    }
    return Activations;
}());
Activations.TANH = {
    output: function (x) { return Math.tanh(x); },
    der: function (x) {
        var output = Activations.TANH.output(x);
        return 1 - output * output;
    }
};
Activations.RELU = {
    output: function (x) { return Math.max(0, x); },
    der: function (x) { return x <= 0 ? 0 : 1; }
};
Activations.SIGMOID = {
    output: function (x) { return 1 / (1 + Math.exp(-x)); },
    der: function (x) {
        var output = Activations.SIGMOID.output(x);
        return output * (1 - output);
    }
};
Activations.LINEAR = {
    output: function (x) { return x; },
    der: function (x) { return 1; }
};
exports.Activations = Activations;
var RegularizationFunction = (function () {
    function RegularizationFunction() {
    }
    return RegularizationFunction;
}());
RegularizationFunction.L1 = {
    output: function (w) { return Math.abs(w); },
    der: function (w) { return w < 0 ? -1 : (w > 0 ? 1 : 0); }
};
RegularizationFunction.L2 = {
    output: function (w) { return 0.5 * w * w; },
    der: function (w) { return w; }
};
exports.RegularizationFunction = RegularizationFunction;
function glorotUniform(fan_in, fan_out) {
    var scale = 1.0 / Math.max(1.0, (fan_in + fan_out) / 2.0);
    var limit = Math.sqrt(3.0 * scale);
    return Math.random() * (limit * 2) - limit;
}
var Link = (function () {
    function Link(source, dest, regularization, initOrigin) {
        this.weight = 0;
        this.isDead = false;
        this.errorDer = 0;
        this.accErrorDer = 0;
        this.numAccumulatedDers = 0;
        this.id = source.id + "-" + dest.id;
        this.source = source;
        this.dest = dest;
        this.regularization = regularization;
        if (initOrigin) {
            this.weight = Math.random() - 0.5;
        }
        else {
            this.weight = glorotUniform(source.outputs.length, dest.outputs.length);
        }
    }
    return Link;
}());
exports.Link = Link;
function buildNetwork(networkShape, activation, outputActivation, regularization, inputIds, initOrigin) {
    var numLayers = networkShape.length;
    var id = 1;
    var network = [];
    for (var layerIdx = 0; layerIdx < numLayers; layerIdx++) {
        var isOutputLayer = layerIdx === numLayers - 1;
        var isInputLayer = layerIdx === 0;
        var currentLayer = [];
        network.push(currentLayer);
        var numNodes = networkShape[layerIdx];
        for (var i = 0; i < numNodes; i++) {
            var nodeId = id.toString();
            if (isInputLayer) {
                nodeId = inputIds[i];
            }
            else {
                id++;
            }
            var node = new Node(nodeId, isOutputLayer ? outputActivation : activation, initOrigin);
            currentLayer.push(node);
            if (layerIdx >= 1) {
                for (var j = 0; j < network[layerIdx - 1].length; j++) {
                    var prevNode = network[layerIdx - 1][j];
                    var link = new Link(prevNode, node, regularization, initOrigin);
                    prevNode.outputs.push(link);
                    node.inputLinks.push(link);
                }
            }
        }
    }
    return network;
}
exports.buildNetwork = buildNetwork;
function forwardProp(network, inputs) {
    var inputLayer = network[0];
    if (inputs.length !== inputLayer.length) {
        throw new Error("The number of inputs must match the number of nodes in" +
            " the input layer");
    }
    for (var i = 0; i < inputLayer.length; i++) {
        var node = inputLayer[i];
        node.output = inputs[i];
    }
    for (var layerIdx = 1; layerIdx < network.length; layerIdx++) {
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            node.updateOutput();
        }
    }
    return network[network.length - 1][0].output;
}
exports.forwardProp = forwardProp;
function backProp(network, target, errorFunc) {
    var outputNode = network[network.length - 1][0];
    outputNode.outputDer = errorFunc.der(outputNode.output, target);
    for (var layerIdx = network.length - 1; layerIdx >= 1; layerIdx--) {
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            node.inputDer = node.outputDer * node.activation.der(node.totalInput);
            node.accInputDer += node.inputDer;
            node.numAccumulatedDers++;
        }
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            for (var j = 0; j < node.inputLinks.length; j++) {
                var link = node.inputLinks[j];
                if (link.isDead) {
                    continue;
                }
                link.errorDer = node.inputDer * link.source.output;
                link.accErrorDer += link.errorDer;
                link.numAccumulatedDers++;
            }
        }
        if (layerIdx === 1) {
            continue;
        }
        var prevLayer = network[layerIdx - 1];
        for (var i = 0; i < prevLayer.length; i++) {
            var node = prevLayer[i];
            node.outputDer = 0;
            for (var j = 0; j < node.outputs.length; j++) {
                var output = node.outputs[j];
                node.outputDer += output.weight * output.dest.inputDer;
            }
        }
    }
}
exports.backProp = backProp;
function updateWeights(network, learningRate, regularizationRate) {
    for (var layerIdx = 1; layerIdx < network.length; layerIdx++) {
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            if (node.numAccumulatedDers > 0) {
                node.bias -= learningRate * node.accInputDer / node.numAccumulatedDers;
                node.accInputDer = 0;
                node.numAccumulatedDers = 0;
            }
            for (var j = 0; j < node.inputLinks.length; j++) {
                var link = node.inputLinks[j];
                if (link.isDead) {
                    continue;
                }
                var regulDer = link.regularization ?
                    link.regularization.der(link.weight) : 0;
                if (link.numAccumulatedDers > 0) {
                    link.weight = link.weight -
                        (learningRate / link.numAccumulatedDers) * link.accErrorDer;
                    var newLinkWeight = link.weight -
                        (learningRate * regularizationRate) * regulDer;
                    if (link.regularization === RegularizationFunction.L1 &&
                        link.weight * newLinkWeight < 0) {
                        link.weight = 0;
                        link.isDead = true;
                    }
                    else {
                        link.weight = newLinkWeight;
                    }
                    link.accErrorDer = 0;
                    link.numAccumulatedDers = 0;
                }
            }
        }
    }
}
exports.updateWeights = updateWeights;
function forEachNode(network, ignoreInputs, accessor) {
    for (var layerIdx = ignoreInputs ? 1 : 0; layerIdx < network.length; layerIdx++) {
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            accessor(node);
        }
    }
}
exports.forEachNode = forEachNode;
function getOutputNode(network) {
    return network[network.length - 1][0];
}
exports.getOutputNode = getOutputNode;
},{}],5:[function(require,module,exports){
"use strict";
var nn = require("./nn");
var heatmap_1 = require("./heatmap");
var state_1 = require("./state");
var dataset_1 = require("./dataset");
var linechart_1 = require("./linechart");
var mainWidth;
d3.select(".more button").on("click", function () {
    var position = 800;
    d3.transition()
        .duration(1000)
        .tween("scroll", scrollTween(position));
});
function scrollTween(offset) {
    return function () {
        var i = d3.interpolateNumber(window.pageYOffset ||
            document.documentElement.scrollTop, offset);
        return function (t) { scrollTo(0, i(t)); };
    };
}
var RECT_SIZE = 30;
var BIAS_SIZE = 5;
var NUM_SAMPLES_CLASSIFY = 500;
var NUM_SAMPLES_REGRESS = 1200;
var DENSITY = 100;
var HoverType;
(function (HoverType) {
    HoverType[HoverType["BIAS"] = 0] = "BIAS";
    HoverType[HoverType["WEIGHT"] = 1] = "WEIGHT";
})(HoverType || (HoverType = {}));
var INPUTS = {
    "x": { f: function (x, y) { return x; }, label: "X_1" },
    "y": { f: function (x, y) { return y; }, label: "X_2" },
    "xSquared": { f: function (x, y) { return x * x; }, label: "X_1^2" },
    "ySquared": { f: function (x, y) { return y * y; }, label: "X_2^2" },
    "xTimesY": { f: function (x, y) { return x * y; }, label: "X_1X_2" },
    "sinX": { f: function (x, y) { return Math.sin(x); }, label: "sin(X_1)" },
    "sinY": { f: function (x, y) { return Math.sin(y); }, label: "sin(X_2)" }
};
var HIDABLE_CONTROLS = [
    ["☑ 訓練データ表示", "showTrainData"],
    ["☑ 精度検証データ表示", "showValidationData"],
    ["☑ テストデータ表示", "showTestData"],
    ["☑ 出力の離散化", "discretize"],
    ["テスト ボタン", "testButton"],
    ["再生 ボタン", "playButton"],
    ["ステップ ボタン", "stepButton"],
    ["リセット ボタン", "resetButton"],
    ["学習率", "learningRate"],
    ["活性化関数", "activation"],
    ["正則化", "regularization"],
    ["正則化率", "regularizationRate"],
    ["問題種別", "problem"],
    ["データセットの選択", "dataset"],
    ["訓練データの割合", "percTrainData"],
    ["ノイズ レベル", "noise"],
    ["バッチ サイズ", "batchSize"],
    ["隠れ層 ⊕⊖ ボタン", "numHiddenLayers"]
];
var Player = (function () {
    function Player() {
        this.timerIndex = 0;
        this.isPlaying = false;
        this.callback = null;
    }
    Player.prototype.playOrPause = function () {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.pause();
        }
        else {
            this.isPlaying = true;
            if (iter === 0) {
                simulationStarted();
            }
            this.play();
        }
    };
    Player.prototype.onPlayPause = function (callback) {
        this.callback = callback;
    };
    Player.prototype.play = function () {
        this.pause();
        this.isPlaying = true;
        if (this.callback) {
            this.callback(this.isPlaying);
        }
        this.start(this.timerIndex);
    };
    Player.prototype.pause = function () {
        this.timerIndex++;
        this.isPlaying = false;
        if (this.callback) {
            this.callback(this.isPlaying);
        }
    };
    Player.prototype.start = function (localTimerIndex) {
        var _this = this;
        d3.timer(function () {
            if (localTimerIndex < _this.timerIndex) {
                return true;
            }
            oneStep();
            return false;
        }, 0);
    };
    return Player;
}());
var state = state_1.State.deserializeState();
state.getHiddenProps().forEach(function (prop) {
    if (prop in INPUTS) {
        delete INPUTS[prop];
    }
});
var boundary = {};
var selectedNodeId = null;
var xDomain = [-6, 6];
var heatMap = new heatmap_1.HeatMap(300, DENSITY, xDomain, xDomain, d3.select("#heatmap"), { showAxes: true });
var linkWidthScale = d3.scale.linear()
    .domain([0, 5])
    .range([1, 10])
    .clamp(true);
var colorScale = d3.scale.linear()
    .domain([-1, 0, 1])
    .range(["#f59322", "#e8eaeb", "#0877bd"])
    .clamp(true);
var iter = 0;
var trainData = [];
var validationData = [];
var testData = [];
var network = null;
var lossTrain = 0;
var lossValidation = 0;
var accTrain = 0;
var accValidation = 0;
var player = new Player();
var lineChart = new linechart_1.AppendingLineChart(d3.select("#linechart"), ["#777", "black"]);
function makeGUI() {
    d3.select("#reset-button").on("click", function () {
        reset();
        userHasInteracted();
        d3.select("#play-pause-button");
    });
    d3.select("#play-pause-button").on("click", function () {
        userHasInteracted();
        player.playOrPause();
    });
    player.onPlayPause(function (isPlaying) {
        d3.select("#play-pause-button").classed("playing", isPlaying);
    });
    d3.select("#next-step-button").on("click", function () {
        player.pause();
        userHasInteracted();
        if (iter === 0) {
            simulationStarted();
        }
        oneStep();
    });
    d3.select("#data-regen-button").on("click", function () {
        generateData();
        parametersChanged = true;
    });
    var dataThumbnails = d3.selectAll("canvas[data-dataset]");
    dataThumbnails.on("click", function () {
        var newDataset = state_1.datasets[this.dataset.dataset];
        if (newDataset === state.dataset) {
            return;
        }
        state.dataset = newDataset;
        dataThumbnails.classed("selected", false);
        d3.select(this).classed("selected", true);
        generateData();
        parametersChanged = true;
        reset();
    });
    var datasetKey = state_1.getKeyFromValue(state_1.datasets, state.dataset);
    d3.select("canvas[data-dataset=" + datasetKey + "]")
        .classed("selected", true);
    var regDataThumbnails = d3.selectAll("canvas[data-regDataset]");
    regDataThumbnails.on("click", function () {
        var newDataset = state_1.regDatasets[this.dataset.regdataset];
        if (newDataset === state.regDataset) {
            return;
        }
        state.regDataset = newDataset;
        regDataThumbnails.classed("selected", false);
        d3.select(this).classed("selected", true);
        generateData();
        parametersChanged = true;
        reset();
    });
    var regDatasetKey = state_1.getKeyFromValue(state_1.regDatasets, state.regDataset);
    d3.select("canvas[data-regDataset=" + regDatasetKey + "]")
        .classed("selected", true);
    d3.select("#add-layers").on("click", function () {
        if (state.numHiddenLayers >= 6) {
            return;
        }
        state.networkShape[state.numHiddenLayers] = 2;
        state.numHiddenLayers++;
        parametersChanged = true;
        reset();
    });
    d3.select("#remove-layers").on("click", function () {
        if (state.numHiddenLayers <= 0) {
            return;
        }
        state.numHiddenLayers--;
        state.networkShape.splice(state.numHiddenLayers);
        parametersChanged = true;
        reset();
    });
    var showTrainData = d3.select("#show-train-data").on("change", function () {
        state.showTrainData = this.checked;
        state.serialize();
        userHasInteracted();
        heatMap.updateTrainPoints(state.showTrainData ? trainData : []);
    });
    showTrainData.property("checked", state.showTrainData);
    var showValidationData = d3.select("#show-validation-data").on("change", function () {
        state.showValidationData = this.checked;
        state.serialize();
        userHasInteracted();
        heatMap.updateValidationPoints(state.showValidationData ? validationData : []);
    });
    showValidationData.property("checked", state.showValidationData);
    var showTestData = d3.select("#show-test-data").on("change", function () {
        state.showTestData = this.checked;
        state.serialize();
        userHasInteracted();
        heatMap.updateTestPoints(state.showTestData ? testData : []);
    });
    showTestData.property("checked", state.showTestData);
    var discretize = d3.select("#discretize").on("change", function () {
        state.discretize = this.checked;
        state.serialize();
        userHasInteracted();
        updateUI();
    });
    discretize.property("checked", state.discretize);
    var percTrain = d3.select("#percTrainData").on("input", function () {
        state.percTrainData = this.value;
        d3.select("label[for='percTrainData'] .value").text(this.value);
        generateData();
        parametersChanged = true;
        reset();
    });
    percTrain.property("value", state.percTrainData);
    d3.select("label[for='percTrainData'] .value").text(state.percTrainData);
    var noise = d3.select("#noise").on("input", function () {
        state.noise = this.value;
        d3.select("label[for='noise'] .value").text(this.value);
        generateData();
        parametersChanged = true;
        reset();
    });
    var currentMax = parseInt(noise.property("max"));
    if (state.noise > currentMax) {
        if (state.noise <= 80) {
            noise.property("max", state.noise);
        }
        else {
            state.noise = 50;
        }
    }
    else if (state.noise < 0) {
        state.noise = 0;
    }
    noise.property("value", state.noise);
    d3.select("label[for='noise'] .value").text(state.noise);
    var batchSize = d3.select("#batchSize").on("input", function () {
        state.batchSize = this.value;
        d3.select("label[for='batchSize'] .value").text(this.value);
        parametersChanged = true;
        reset();
    });
    batchSize.property("value", state.batchSize);
    d3.select("label[for='batchSize'] .value").text(state.batchSize);
    var activationDropdown = d3.select("#activations").on("change", function () {
        state.activation = state_1.activations[this.value];
        parametersChanged = true;
        reset();
    });
    activationDropdown.property("value", state_1.getKeyFromValue(state_1.activations, state.activation));
    var learningRate = d3.select("#learningRate").on("change", function () {
        state.learningRate = +this.value;
        state.serialize();
        userHasInteracted();
        parametersChanged = true;
    });
    learningRate.property("value", state.learningRate);
    var regularDropdown = d3.select("#regularizations").on("change", function () {
        state.regularization = state_1.regularizations[this.value];
        parametersChanged = true;
        reset();
    });
    regularDropdown.property("value", state_1.getKeyFromValue(state_1.regularizations, state.regularization));
    var regularRate = d3.select("#regularRate").on("change", function () {
        state.regularizationRate = +this.value;
        parametersChanged = true;
        reset();
    });
    regularRate.property("value", state.regularizationRate);
    var problem = d3.select("#problem").on("change", function () {
        state.problem = state_1.problems[this.value];
        generateData();
        drawDatasetThumbnails();
        showAccuracy();
        parametersChanged = true;
        reset();
    });
    problem.property("value", state_1.getKeyFromValue(state_1.problems, state.problem));
    var x = d3.scale.linear().domain([-1, 1]).range([0, 144]);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickValues([-1, 0, 1])
        .tickFormat(d3.format("d"));
    d3.select("#colormap g.core").append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,10)")
        .call(xAxis);
    window.addEventListener("resize", function () {
        var newWidth = document.querySelector("#main-part")
            .getBoundingClientRect().width;
        if (newWidth !== mainWidth) {
            mainWidth = newWidth;
            drawNetwork(network);
            updateUI(true);
        }
    });
    if (state.hideText) {
        d3.select("#article-text").style("display", "none");
        d3.select("div.more").style("display", "none");
        d3.select("header").style("display", "none");
    }
}
function updateBiasesUI(network) {
    nn.forEachNode(network, true, function (node) {
        d3.select("rect#bias-" + node.id).style("fill", colorScale(node.bias));
    });
}
function updateWeightsUI(network, container) {
    for (var layerIdx = 1; layerIdx < network.length; layerIdx++) {
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            for (var j = 0; j < node.inputLinks.length; j++) {
                var link = node.inputLinks[j];
                container.select("#link" + link.source.id + "-" + link.dest.id)
                    .style({
                    "stroke-dashoffset": -iter / 3,
                    "stroke-width": linkWidthScale(Math.abs(link.weight)),
                    "stroke": colorScale(link.weight)
                })
                    .datum(link);
            }
        }
    }
}
function drawNode(cx, cy, nodeId, isInput, container, node) {
    var x = cx - RECT_SIZE / 2;
    var y = cy - RECT_SIZE / 2;
    var nodeGroup = container.append("g")
        .attr({
        "class": "node",
        "id": "node" + nodeId,
        "transform": "translate(" + x + "," + y + ")"
    });
    nodeGroup.append("rect")
        .attr({
        x: 0,
        y: 0,
        width: RECT_SIZE,
        height: RECT_SIZE
    });
    var activeOrNotClass = state[nodeId] ? "active" : "inactive";
    if (isInput) {
        var label = INPUTS[nodeId].label != null ?
            INPUTS[nodeId].label : nodeId;
        var text = nodeGroup.append("text").attr({
            "class": "main-label",
            x: -10,
            y: RECT_SIZE / 2, "text-anchor": "end"
        });
        if (/[_^]/.test(label)) {
            var myRe = /(.*?)([_^])(.)/g;
            var myArray = void 0;
            var lastIndex = void 0;
            while ((myArray = myRe.exec(label)) != null) {
                lastIndex = myRe.lastIndex;
                var prefix = myArray[1];
                var sep = myArray[2];
                var suffix = myArray[3];
                if (prefix) {
                    text.append("tspan").text(prefix);
                }
                text.append("tspan")
                    .attr("baseline-shift", sep === "_" ? "sub" : "super")
                    .style("font-size", "9px")
                    .text(suffix);
            }
            if (label.substring(lastIndex)) {
                text.append("tspan").text(label.substring(lastIndex));
            }
        }
        else {
            text.append("tspan").text(label);
        }
        nodeGroup.classed(activeOrNotClass, true);
    }
    if (!isInput) {
        nodeGroup.append("rect")
            .attr({
            id: "bias-" + nodeId,
            x: -BIAS_SIZE - 2,
            y: RECT_SIZE - BIAS_SIZE + 3,
            width: BIAS_SIZE,
            height: BIAS_SIZE
        }).on("mouseenter", function () {
            updateHoverCard(HoverType.BIAS, node, d3.mouse(container.node()));
        }).on("mouseleave", function () {
            updateHoverCard(null);
        });
    }
    var div = d3.select("#network").insert("div", ":first-child")
        .attr({
        "id": "canvas-" + nodeId,
        "class": "canvas"
    })
        .style({
        position: "absolute",
        left: x + 3 + "px",
        top: y + 3 + "px"
    })
        .on("mouseenter", function () {
        selectedNodeId = nodeId;
        div.classed("hovered", true);
        nodeGroup.classed("hovered", true);
        updateDecisionBoundary(network, false);
        heatMap.updateBackground(boundary[nodeId], state.discretize);
    })
        .on("mouseleave", function () {
        selectedNodeId = null;
        div.classed("hovered", false);
        nodeGroup.classed("hovered", false);
        updateDecisionBoundary(network, false);
        heatMap.updateBackground(boundary[nn.getOutputNode(network).id], state.discretize);
    });
    if (isInput) {
        div.on("click", function () {
            state[nodeId] = !state[nodeId];
            parametersChanged = true;
            reset();
        });
        div.style("cursor", "pointer");
    }
    if (isInput) {
        div.classed(activeOrNotClass, true);
    }
    var nodeHeatMap = new heatmap_1.HeatMap(RECT_SIZE, DENSITY / 10, xDomain, xDomain, div, { noSvg: true });
    div.datum({ heatmap: nodeHeatMap, id: nodeId });
}
function drawNetwork(network) {
    var svg = d3.select("#svg");
    svg.select("g.core").remove();
    d3.select("#network").selectAll("div.canvas").remove();
    d3.select("#network").selectAll("div.plus-minus-neurons").remove();
    var padding = 3;
    var co = d3.select(".column.output").node();
    var cf = d3.select(".column.features").node();
    var width = co.offsetLeft - cf.offsetLeft;
    svg.attr("width", width);
    var node2coord = {};
    var container = svg.append("g")
        .classed("core", true)
        .attr("transform", "translate(" + padding + "," + padding + ")");
    var numLayers = network.length;
    var featureWidth = 118;
    var layerScale = d3.scale.ordinal()
        .domain(d3.range(1, numLayers - 1))
        .rangePoints([featureWidth, width - RECT_SIZE], 0.7);
    var nodeIndexScale = function (nodeIndex) { return nodeIndex * (RECT_SIZE + 25); };
    var calloutThumb = d3.select(".callout.thumbnail").style("display", "none");
    var calloutWeights = d3.select(".callout.weights").style("display", "none");
    var idWithCallout = null;
    var targetIdWithCallout = null;
    var cx = RECT_SIZE / 2 + 50;
    var nodeIds = Object.keys(INPUTS);
    var maxY = nodeIndexScale(nodeIds.length);
    nodeIds.forEach(function (nodeId, i) {
        var cy = nodeIndexScale(i) + RECT_SIZE / 2;
        node2coord[nodeId] = { cx: cx, cy: cy };
        drawNode(cx, cy, nodeId, true, container);
    });
    for (var layerIdx = 1; layerIdx < numLayers - 1; layerIdx++) {
        var numNodes = network[layerIdx].length;
        var cx_1 = layerScale(layerIdx) + RECT_SIZE / 2;
        maxY = Math.max(maxY, nodeIndexScale(numNodes));
        addPlusMinusControl(layerScale(layerIdx), layerIdx);
        for (var i = 0; i < numNodes; i++) {
            var node_1 = network[layerIdx][i];
            var cy_1 = nodeIndexScale(i) + RECT_SIZE / 2;
            node2coord[node_1.id] = { cx: cx_1, cy: cy_1 };
            drawNode(cx_1, cy_1, node_1.id, false, container, node_1);
            var numNodes_1 = network[layerIdx].length;
            var nextNumNodes = network[layerIdx + 1].length;
            if (idWithCallout == null &&
                i === numNodes_1 - 1 &&
                nextNumNodes <= numNodes_1) {
                calloutThumb.style({
                    display: null,
                    top: 20 + 3 + cy_1 + "px",
                    left: cx_1 + "px"
                });
                idWithCallout = node_1.id;
            }
            for (var j = 0; j < node_1.inputLinks.length; j++) {
                var link = node_1.inputLinks[j];
                var path = drawLink(link, node2coord, network, container, j === 0, j, node_1.inputLinks.length).node();
                var prevLayer = network[layerIdx - 1];
                var lastNodePrevLayer = prevLayer[prevLayer.length - 1];
                if (targetIdWithCallout == null &&
                    i === numNodes_1 - 1 &&
                    link.source.id === lastNodePrevLayer.id &&
                    (link.source.id !== idWithCallout || numLayers <= 5) &&
                    link.dest.id !== idWithCallout &&
                    prevLayer.length >= numNodes_1) {
                    var midPoint = path.getPointAtLength(path.getTotalLength() * 0.7);
                    calloutWeights.style({
                        display: null,
                        top: midPoint.y + 5 + "px",
                        left: midPoint.x + 3 + "px"
                    });
                    targetIdWithCallout = link.dest.id;
                }
            }
        }
    }
    cx = width + RECT_SIZE / 2;
    var node = network[numLayers - 1][0];
    var cy = nodeIndexScale(0) + RECT_SIZE / 2;
    node2coord[node.id] = { cx: cx, cy: cy };
    for (var i = 0; i < node.inputLinks.length; i++) {
        var link = node.inputLinks[i];
        drawLink(link, node2coord, network, container, i === 0, i, node.inputLinks.length);
    }
    svg.attr("height", maxY);
    var height = Math.max(getRelativeHeight(calloutThumb), getRelativeHeight(calloutWeights), getRelativeHeight(d3.select("#network")));
    d3.select(".column.features").style("height", height + "px");
}
function getRelativeHeight(selection) {
    var node = selection.node();
    return node.offsetHeight + node.offsetTop;
}
function addPlusMinusControl(x, layerIdx) {
    var div = d3.select("#network").append("div")
        .classed("plus-minus-neurons", true)
        .style("left", x - 10 + "px");
    var i = layerIdx - 1;
    var firstRow = div.append("div").attr("class", "ui-numNodes" + layerIdx);
    firstRow.append("button")
        .attr("class", "mdl-button mdl-js-button mdl-button--icon")
        .on("click", function () {
        var numNeurons = state.networkShape[i];
        if (numNeurons >= 8) {
            return;
        }
        state.networkShape[i]++;
        parametersChanged = true;
        reset();
    })
        .append("i")
        .attr("class", "material-icons")
        .text("add");
    firstRow.append("button")
        .attr("class", "mdl-button mdl-js-button mdl-button--icon")
        .on("click", function () {
        var numNeurons = state.networkShape[i];
        if (numNeurons <= 1) {
            return;
        }
        state.networkShape[i]--;
        parametersChanged = true;
        reset();
    })
        .append("i")
        .attr("class", "material-icons")
        .text("remove");
    var suffix = state.networkShape[i] > 1 ? "s" : "";
    div.append("div").text(state.networkShape[i] + " neuron" + suffix);
}
function updateHoverCard(type, nodeOrLink, coordinates) {
    var hovercard = d3.select("#hovercard");
    if (type == null) {
        hovercard.style("display", "none");
        d3.select("#svg").on("click", null);
        return;
    }
    d3.select("#svg").on("click", function () {
        hovercard.select(".value").style("display", "none");
        var input = hovercard.select("input");
        input.style("display", null);
        input.on("input", function () {
            if (this.value != null && this.value !== "") {
                if (type === HoverType.WEIGHT) {
                    nodeOrLink.weight = +this.value;
                }
                else {
                    nodeOrLink.bias = +this.value;
                }
                updateUI();
            }
        });
        input.on("keypress", function () {
            if (d3.event.keyCode === 13) {
                updateHoverCard(type, nodeOrLink, coordinates);
            }
        });
        input.node().focus();
    });
    var value = (type === HoverType.WEIGHT) ?
        nodeOrLink.weight :
        nodeOrLink.bias;
    var name = (type === HoverType.WEIGHT) ? "重み" : "バイアス";
    hovercard.style({
        "left": coordinates[0] + 20 + "px",
        "top": coordinates[1] + "px",
        "display": "block"
    });
    hovercard.select(".type").text(name);
    hovercard.select(".value")
        .style("display", null)
        .text(value.toPrecision(2));
    hovercard.select("input")
        .property("value", value.toPrecision(2))
        .style("display", "none");
}
function drawLink(input, node2coord, network, container, isFirst, index, length) {
    var line = container.insert("path", ":first-child");
    var source = node2coord[input.source.id];
    var dest = node2coord[input.dest.id];
    var datum = {
        source: {
            y: source.cx + RECT_SIZE / 2 + 2,
            x: source.cy
        },
        target: {
            y: dest.cx - RECT_SIZE / 2,
            x: dest.cy + ((index - (length - 1) / 2) / length) * 12
        }
    };
    var diagonal = d3.svg.diagonal().projection(function (d) { return [d.y, d.x]; });
    line.attr({
        "marker-start": "url(#markerArrow)",
        "class": "link",
        id: "link" + input.source.id + "-" + input.dest.id,
        d: diagonal(datum, 0)
    });
    container.append("path")
        .attr("d", diagonal(datum, 0))
        .attr("class", "link-hover")
        .on("mouseenter", function () {
        updateHoverCard(HoverType.WEIGHT, input, d3.mouse(this));
    }).on("mouseleave", function () {
        updateHoverCard(null);
    });
    return line;
}
function updateDecisionBoundary(network, firstTime) {
    if (firstTime) {
        boundary = {};
        nn.forEachNode(network, true, function (node) {
            boundary[node.id] = new Array(DENSITY);
        });
        for (var nodeId in INPUTS) {
            boundary[nodeId] = new Array(DENSITY);
        }
    }
    var xScale = d3.scale.linear().domain([0, DENSITY - 1]).range(xDomain);
    var yScale = d3.scale.linear().domain([DENSITY - 1, 0]).range(xDomain);
    var i = 0, j = 0;
    for (i = 0; i < DENSITY; i++) {
        if (firstTime) {
            nn.forEachNode(network, true, function (node) {
                boundary[node.id][i] = new Array(DENSITY);
            });
            for (var nodeId in INPUTS) {
                boundary[nodeId][i] = new Array(DENSITY);
            }
        }
        for (j = 0; j < DENSITY; j++) {
            var x = xScale(i);
            var y = yScale(j);
            var input = constructInput(x, y);
            nn.forwardProp(network, input);
            nn.forEachNode(network, true, function (node) {
                boundary[node.id][i][j] = node.output;
            });
            if (firstTime) {
                for (var nodeId in INPUTS) {
                    boundary[nodeId][i][j] = INPUTS[nodeId].f(x, y);
                }
            }
        }
    }
}
function getLoss(network, dataPoints) {
    var loss = 0;
    for (var i = 0; i < dataPoints.length; i++) {
        var dataPoint = dataPoints[i];
        var input = constructInput(dataPoint.x, dataPoint.y);
        var output = nn.forwardProp(network, input);
        loss += nn.Errors.SQUARE.error(output, dataPoint.label);
    }
    return loss / dataPoints.length;
}
function getAccuracy(network, dataPoints) {
    var accsum = 0;
    for (var i = 0; i < dataPoints.length; i++) {
        var dataPoint = dataPoints[i];
        var input = constructInput(dataPoint.x, dataPoint.y);
        var output = nn.forwardProp(network, input);
        output = (output >= 0 ? 1 : -1);
        accsum += (output == dataPoint.label ? 1 : 0);
    }
    return accsum / dataPoints.length;
}
function showAccuracy() {
    var controls = d3.select("#acc-stats");
    if (controls.size() === 1) {
        switch (state.problem) {
            case state_1.Problem.CLASSIFICATION:
                controls.style("display", "block");
                break;
            case state_1.Problem.REGRESSION:
                controls.style("display", "none");
                break;
        }
    }
}
function updateUI(firstStep) {
    if (firstStep === void 0) { firstStep = false; }
    updateWeightsUI(network, d3.select("g.core"));
    updateBiasesUI(network);
    updateDecisionBoundary(network, firstStep);
    var selectedId = selectedNodeId != null ?
        selectedNodeId : nn.getOutputNode(network).id;
    heatMap.updateBackground(boundary[selectedId], state.discretize);
    d3.select("#network").selectAll("div.canvas")
        .each(function (data) {
        data.heatmap.updateBackground(heatmap_1.reduceMatrix(boundary[data.id], 10), state.discretize);
    });
    function zeroPad(n) {
        var pad = "000000";
        return (pad + n).slice(-pad.length);
    }
    function addCommas(s) {
        return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function humanReadable(n) {
        return n.toFixed(3);
    }
    d3.select("#loss-train").text(humanReadable(lossTrain));
    d3.select("#loss-validation").text(humanReadable(lossValidation));
    d3.select("#acc-train").text(humanReadable(accTrain));
    d3.select("#acc-validation").text(humanReadable(accValidation));
    d3.select("#iter-number").text(addCommas(zeroPad(iter)));
    lineChart.addDataPoint([lossTrain, lossValidation]);
}
function constructInputIds() {
    var result = [];
    for (var inputName in INPUTS) {
        if (state[inputName]) {
            result.push(inputName);
        }
    }
    return result;
}
function constructInput(x, y) {
    var input = [];
    for (var inputName in INPUTS) {
        if (state[inputName]) {
            input.push(INPUTS[inputName].f(x, y));
        }
    }
    return input;
}
function oneStep() {
    iter++;
    trainData.forEach(function (point, i) {
        var input = constructInput(point.x, point.y);
        nn.forwardProp(network, input);
        nn.backProp(network, point.label, nn.Errors.SQUARE);
        if ((i + 1) % state.batchSize === 0) {
            nn.updateWeights(network, state.learningRate, state.regularizationRate);
        }
    });
    lossTrain = getLoss(network, trainData);
    lossValidation = getLoss(network, validationData);
    if (state.problem === state_1.Problem.CLASSIFICATION) {
        accTrain = getAccuracy(network, trainData);
        accValidation = getAccuracy(network, validationData);
    }
    updateUI();
}
function getOutputWeights(network) {
    var weights = [];
    for (var layerIdx = 0; layerIdx < network.length - 1; layerIdx++) {
        var currentLayer = network[layerIdx];
        for (var i = 0; i < currentLayer.length; i++) {
            var node = currentLayer[i];
            for (var j = 0; j < node.outputs.length; j++) {
                var output = node.outputs[j];
                weights.push(output.weight);
            }
        }
    }
    return weights;
}
exports.getOutputWeights = getOutputWeights;
function reset(onStartup) {
    if (onStartup === void 0) { onStartup = false; }
    lineChart.reset();
    state.serialize();
    if (!onStartup) {
        userHasInteracted();
    }
    player.pause();
    d3.select("#layers-label").text("隠れ層");
    d3.select("#num-layers").text(state.numHiddenLayers);
    iter = 0;
    var numInputs = constructInput(0, 0).length;
    var shape = [numInputs].concat(state.networkShape).concat([1]);
    var outputActivation = (state.problem === state_1.Problem.REGRESSION) ?
        nn.Activations.LINEAR : nn.Activations.TANH;
    network = nn.buildNetwork(shape, state.activation, outputActivation, state.regularization, constructInputIds(), state.initOrigin);
    lossTrain = getLoss(network, trainData);
    lossValidation = getLoss(network, validationData);
    if (state.problem === state_1.Problem.CLASSIFICATION) {
        accTrain = getAccuracy(network, trainData);
        accValidation = getAccuracy(network, validationData);
    }
    drawNetwork(network);
    updateUI(true);
}
;
function initTutorial() {
    if (state.tutorial == null || state.tutorial === '' || state.hideText) {
        return;
    }
    d3.selectAll("article div.l--body").remove();
    var tutorial = d3.select("article").append("div")
        .attr("class", "l--body");
    d3.html("tutorials/" + state.tutorial + ".html", function (err, htmlFragment) {
        if (err) {
            throw err;
        }
        tutorial.node().appendChild(htmlFragment);
        var title = tutorial.select("title");
        if (title.size()) {
            d3.select("header h1").style({
                "margin-top": "20px",
                "margin-bottom": "20px"
            })
                .text(title.text());
            document.title = title.text();
        }
    });
}
function drawDatasetThumbnails() {
    function renderThumbnail(canvas, dataGenerator) {
        var w = 100;
        var h = 100;
        canvas.setAttribute("width", w);
        canvas.setAttribute("height", h);
        var context = canvas.getContext("2d");
        var data = dataGenerator(200, 0);
        data.forEach(function (d) {
            context.fillStyle = colorScale(d.label);
            context.fillRect(w * (d.x + 6) / 12, h - h * (d.y + 6) / 12 - 4, 4, 4);
        });
        d3.select(canvas.parentNode).style("display", null);
    }
    d3.selectAll(".dataset").style("display", "none");
    if (state.problem === state_1.Problem.CLASSIFICATION) {
        for (var dataset in state_1.datasets) {
            var canvas = document.querySelector("canvas[data-dataset=" + dataset + "]");
            var dataGenerator = state_1.datasets[dataset];
            renderThumbnail(canvas, dataGenerator);
        }
    }
    if (state.problem === state_1.Problem.REGRESSION) {
        for (var regDataset in state_1.regDatasets) {
            var canvas = document.querySelector("canvas[data-regDataset=" + regDataset + "]");
            var dataGenerator = state_1.regDatasets[regDataset];
            renderThumbnail(canvas, dataGenerator);
        }
    }
}
function hideControls() {
    var hiddenProps = state.getHiddenProps();
    hiddenProps.forEach(function (prop) {
        var controls = d3.selectAll(".ui-" + prop);
        if (controls.size() === 0) {
            console.warn("0 html elements found with class .ui-" + prop);
        }
        controls.style("display", "none");
    });
    var hideControls = d3.select(".hide-controls");
    HIDABLE_CONTROLS.forEach(function (_a) {
        var text = _a[0], id = _a[1];
        var label = hideControls.append("label")
            .attr("class", "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect");
        var input = label.append("input")
            .attr({
            type: "checkbox",
            "class": "mdl-checkbox__input"
        });
        if (hiddenProps.indexOf(id) === -1) {
            input.attr("checked", "true");
        }
        input.on("change", function () {
            state.setHideProperty(id, !this.checked);
            state.serialize();
            userHasInteracted();
            d3.select(".hide-controls-link")
                .attr("href", window.location.href);
        });
        label.append("span")
            .attr("class", "mdl-checkbox__label label")
            .text(text);
    });
    d3.select(".hide-controls-link")
        .attr("href", window.location.href);
}
function generateData(firstTime) {
    if (firstTime === void 0) { firstTime = false; }
    if (!firstTime) {
        state.seed = Math.random().toFixed(5);
        state.serialize();
        userHasInteracted();
    }
    Math.seedrandom(state.seed);
    var numSamples = (state.problem === state_1.Problem.REGRESSION) ?
        NUM_SAMPLES_REGRESS : NUM_SAMPLES_CLASSIFY;
    var generator = state.problem === state_1.Problem.CLASSIFICATION ?
        state.dataset : state.regDataset;
    var data = generator(numSamples, state.noise / 100);
    dataset_1.shuffle(data);
    var splitIndex = Math.floor(data.length * state.percTrainData / 100);
    trainData = data.slice(0, splitIndex);
    validationData = data.slice(splitIndex);
    heatMap.updateTrainPoints(state.showTrainData ? trainData : []);
    heatMap.updateValidationPoints(state.showValidationData ? validationData : []);
}
var firstInteraction = true;
var parametersChanged = false;
function userHasInteracted() {
    if (!firstInteraction) {
        return;
    }
    firstInteraction = false;
    var page = 'index';
    if (state.tutorial != null && state.tutorial !== '') {
        page = "/v/tutorials/" + state.tutorial;
    }
    ga('set', 'page', page);
    ga('send', 'pageview', { 'sessionControl': 'start' });
}
function simulationStarted() {
    ga('send', {
        hitType: 'event',
        eventCategory: 'Starting Simulation',
        eventAction: parametersChanged ? 'changed' : 'unchanged',
        eventLabel: state.tutorial == null ? '' : state.tutorial
    });
    parametersChanged = false;
}
drawDatasetThumbnails();
showAccuracy();
initTutorial();
makeGUI();
generateData(true);
reset(true);
hideControls();
},{"./dataset":1,"./heatmap":2,"./linechart":3,"./nn":4,"./state":6}],6:[function(require,module,exports){
"use strict";
var nn = require("./nn");
var dataset = require("./dataset");
var HIDE_STATE_SUFFIX = "_hide";
exports.activations = {
    "relu": nn.Activations.RELU,
    "tanh": nn.Activations.TANH,
    "sigmoid": nn.Activations.SIGMOID,
    "linear": nn.Activations.LINEAR
};
exports.regularizations = {
    "none": null,
    "L1": nn.RegularizationFunction.L1,
    "L2": nn.RegularizationFunction.L2
};
exports.datasets = {
    "circle": dataset.classifyCircleData,
    "xor": dataset.classifyXORData,
    "gauss": dataset.classifyTwoGaussData,
    "spiral": dataset.classifySpiralData
};
exports.regDatasets = {
    "reg-plane": dataset.regressPlane,
    "reg-gauss": dataset.regressGaussian
};
function getKeyFromValue(obj, value) {
    for (var key in obj) {
        if (obj[key] === value) {
            return key;
        }
    }
    return undefined;
}
exports.getKeyFromValue = getKeyFromValue;
function endsWith(s, suffix) {
    return s.substr(-suffix.length) === suffix;
}
function getHideProps(obj) {
    var result = [];
    for (var prop in obj) {
        if (endsWith(prop, HIDE_STATE_SUFFIX)) {
            result.push(prop);
        }
    }
    return result;
}
var Type;
(function (Type) {
    Type[Type["STRING"] = 0] = "STRING";
    Type[Type["NUMBER"] = 1] = "NUMBER";
    Type[Type["ARRAY_NUMBER"] = 2] = "ARRAY_NUMBER";
    Type[Type["ARRAY_STRING"] = 3] = "ARRAY_STRING";
    Type[Type["BOOLEAN"] = 4] = "BOOLEAN";
    Type[Type["OBJECT"] = 5] = "OBJECT";
})(Type = exports.Type || (exports.Type = {}));
var Problem;
(function (Problem) {
    Problem[Problem["CLASSIFICATION"] = 0] = "CLASSIFICATION";
    Problem[Problem["REGRESSION"] = 1] = "REGRESSION";
})(Problem = exports.Problem || (exports.Problem = {}));
exports.problems = {
    "classification": Problem.CLASSIFICATION,
    "regression": Problem.REGRESSION
};
;
var State = (function () {
    function State() {
        this.learningRate = 0.03;
        this.regularizationRate = 0;
        this.showTrainData = true;
        this.showValidationData = false;
        this.showTestData = false;
        this.noise = 0;
        this.batchSize = 10;
        this.discretize = false;
        this.tutorial = null;
        this.percTrainData = 50;
        this.activation = nn.Activations.TANH;
        this.regularization = null;
        this.problem = Problem.CLASSIFICATION;
        this.initOrigin = false;
        this.hideText = false;
        this.testButton = false;
        this.numHiddenLayers = 1;
        this.hiddenLayerControls = [];
        this.networkShape = [4, 2];
        this.x = true;
        this.y = true;
        this.xTimesY = false;
        this.xSquared = false;
        this.ySquared = false;
        this.sinX = false;
        this.sinY = false;
        this.dataset = dataset.classifyCircleData;
        this.regDataset = dataset.regressPlane;
    }
    State.deserializeState = function () {
        var map = {};
        for (var _i = 0, _a = window.location.hash.slice(1).split("&"); _i < _a.length; _i++) {
            var keyvalue = _a[_i];
            var _b = keyvalue.split("="), name_1 = _b[0], value = _b[1];
            map[name_1] = value;
        }
        var state = new State();
        function hasKey(name) {
            return name in map && map[name] != null && map[name].trim() !== "";
        }
        function parseArray(value) {
            return value.trim() === "" ? [] : value.split(",");
        }
        State.PROPS.forEach(function (_a) {
            var name = _a.name, type = _a.type, keyMap = _a.keyMap;
            switch (type) {
                case Type.OBJECT:
                    if (keyMap == null) {
                        throw Error("A key-value map must be provided for state " +
                            "variables of type Object");
                    }
                    if (hasKey(name) && map[name] in keyMap) {
                        state[name] = keyMap[map[name]];
                    }
                    break;
                case Type.NUMBER:
                    if (hasKey(name)) {
                        state[name] = +map[name];
                    }
                    break;
                case Type.STRING:
                    if (hasKey(name)) {
                        state[name] = map[name];
                    }
                    break;
                case Type.BOOLEAN:
                    if (hasKey(name)) {
                        state[name] = (map[name] === "false" ? false : true);
                    }
                    break;
                case Type.ARRAY_NUMBER:
                    if (name in map) {
                        state[name] = parseArray(map[name]).map(Number);
                    }
                    break;
                case Type.ARRAY_STRING:
                    if (name in map) {
                        state[name] = parseArray(map[name]);
                    }
                    break;
                default:
                    throw Error("Encountered an unknown type for a state variable");
            }
        });
        getHideProps(map).forEach(function (prop) {
            state[prop] = (map[prop] === "true") ? true : false;
        });
        state.numHiddenLayers = state.networkShape.length;
        if (state.seed == null) {
            state.seed = Math.random().toFixed(5);
        }
        Math.seedrandom(state.seed);
        return state;
    };
    State.prototype.serialize = function () {
        var _this = this;
        var props = [];
        State.PROPS.forEach(function (_a) {
            var name = _a.name, type = _a.type, keyMap = _a.keyMap;
            var value = _this[name];
            if (value == null) {
                return;
            }
            if (type === Type.OBJECT) {
                value = getKeyFromValue(keyMap, value);
            }
            else if (type === Type.ARRAY_NUMBER ||
                type === Type.ARRAY_STRING) {
                value = value.join(",");
            }
            props.push(name + "=" + value);
        });
        getHideProps(this).forEach(function (prop) {
            props.push(prop + "=" + _this[prop]);
        });
        window.location.hash = props.join("&");
    };
    State.prototype.getHiddenProps = function () {
        var result = [];
        for (var prop in this) {
            if (endsWith(prop, HIDE_STATE_SUFFIX) && String(this[prop]) === "true") {
                result.push(prop.replace(HIDE_STATE_SUFFIX, ""));
            }
        }
        return result;
    };
    State.prototype.setHideProperty = function (name, hidden) {
        this[name + HIDE_STATE_SUFFIX] = hidden;
    };
    return State;
}());
State.PROPS = [
    { name: "activation", type: Type.OBJECT, keyMap: exports.activations },
    { name: "regularization", type: Type.OBJECT, keyMap: exports.regularizations },
    { name: "batchSize", type: Type.NUMBER },
    { name: "dataset", type: Type.OBJECT, keyMap: exports.datasets },
    { name: "regDataset", type: Type.OBJECT, keyMap: exports.regDatasets },
    { name: "learningRate", type: Type.NUMBER },
    { name: "regularizationRate", type: Type.NUMBER },
    { name: "noise", type: Type.NUMBER },
    { name: "networkShape", type: Type.ARRAY_NUMBER },
    { name: "seed", type: Type.STRING },
    { name: "showTrainData", type: Type.BOOLEAN },
    { name: "showValidationData", type: Type.BOOLEAN },
    { name: "showTestData", type: Type.BOOLEAN },
    { name: "discretize", type: Type.BOOLEAN },
    { name: "percTrainData", type: Type.NUMBER },
    { name: "x", type: Type.BOOLEAN },
    { name: "y", type: Type.BOOLEAN },
    { name: "xTimesY", type: Type.BOOLEAN },
    { name: "xSquared", type: Type.BOOLEAN },
    { name: "ySquared", type: Type.BOOLEAN },
    { name: "sinX", type: Type.BOOLEAN },
    { name: "sinY", type: Type.BOOLEAN },
    { name: "testButton", type: Type.BOOLEAN },
    { name: "tutorial", type: Type.STRING },
    { name: "problem", type: Type.OBJECT, keyMap: exports.problems },
    { name: "initOrigin", type: Type.BOOLEAN },
    { name: "hideText", type: Type.BOOLEAN }
];
exports.State = State;
},{"./dataset":1,"./nn":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZGF0YXNldC50cyIsInNyYy9oZWF0bWFwLnRzIiwic3JjL2xpbmVjaGFydC50cyIsInNyYy9ubi50cyIsInNyYy9wbGF5Z3JvdW5kLnRzIiwic3JjL3N0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ2lDQSxpQkFBd0IsS0FBWTtJQUNsQyxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQzNCLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNiLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztJQUVkLE9BQU8sT0FBTyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBRW5CLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsQ0FBQztRQUU1QyxPQUFPLEVBQUUsQ0FBQztRQUVWLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLENBQUM7QUFDSCxDQUFDO0FBZkQsMEJBZUM7QUFJRCw4QkFBcUMsVUFBa0IsRUFBRSxLQUFhO0lBRXBFLElBQUksTUFBTSxHQUFnQixFQUFFLENBQUM7SUFFN0IsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RSxJQUFJLFFBQVEsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFcEMsa0JBQWtCLEVBQVUsRUFBRSxFQUFVLEVBQUUs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SUFBSSxDQUFDLE9BQU8sRUFBQztJQUN4QyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUM7Q0FDdkMsQ0FBQztBQTlCUyxzQkFBSyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXHJcblxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG5cclxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuLyoqXHJcbiAqIEEgdHdvIGRpbWVuc2lvbmFsIGV4YW1wbGU6IHggYW5kIHkgY29vcmRpbmF0ZXMgd2l0aCB0aGUgbGFiZWwuXHJcbiAqL1xyXG5leHBvcnQgdHlwZSBFeGFtcGxlMkQgPSB7XHJcbiAgeDogbnVtYmVyLFxyXG4gIHk6IG51bWJlcixcclxuICBsYWJlbDogbnVtYmVyXHJcbn07XHJcblxyXG50eXBlIFBvaW50ID0ge1xyXG4gIHg6IG51bWJlcixcclxuICB5OiBudW1iZXJcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTaHVmZmxlcyB0aGUgYXJyYXkgdXNpbmcgRmlzaGVyLVlhdGVzIGFsZ29yaXRobS4gVXNlcyB0aGUgc2VlZHJhbmRvbVxyXG4gKiBsaWJyYXJ5IGFzIHRoZSByYW5kb20gZ2VuZXJhdG9yLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNodWZmbGUoYXJyYXk6IGFueVtdKTogdm9pZCB7XHJcbiAgbGV0IGNvdW50ZXIgPSBhcnJheS5sZW5ndGg7XHJcbiAgbGV0IHRlbXAgPSAwO1xyXG4gIGxldCBpbmRleCA9IDA7XHJcbiAgLy8gV2hpbGUgdGhlcmUgYXJlIGVsZW1lbnRzIGluIHRoZSBhcnJheVxyXG4gIHdoaWxlIChjb3VudGVyID4gMCkge1xyXG4gICAgLy8gUGljayBhIHJhbmRvbSBpbmRleFxyXG4gICAgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb3VudGVyKTtcclxuICAgIC8vIERlY3JlYXNlIGNvdW50ZXIgYnkgMVxyXG4gICAgY291bnRlci0tO1xyXG4gICAgLy8gQW5kIHN3YXAgdGhlIGxhc3QgZWxlbWVudCB3aXRoIGl0XHJcbiAgICB0ZW1wID0gYXJyYXlbY291bnRlcl07XHJcbiAgICBhcnJheVtjb3VudGVyXSA9IGFycmF5W2luZGV4XTtcclxuICAgIGFycmF5W2luZGV4XSA9IHRlbXA7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBEYXRhR2VuZXJhdG9yID0gKG51bVNhbXBsZXM6IG51bWJlciwgbm9pc2U6IG51bWJlcikgPT4gRXhhbXBsZTJEW107XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NpZnlUd29HYXVzc0RhdGEobnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTpcclxuICAgIEV4YW1wbGUyRFtdIHtcclxuICBsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xyXG5cclxuICBsZXQgdmFyaWFuY2VTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgLjVdKS5yYW5nZShbMC41LCA0XSk7XHJcbiAgbGV0IHZhcmlhbmNlID0gdmFyaWFuY2VTY2FsZShub2lzZSk7XHJcblxyXG4gIGZ1bmN0aW9uIGdlbkdhdXNzKGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIGxhYmVsOiBudW1iZXIpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU2FtcGxlcyAvIDI7IGkrKykge1xyXG4gICAgICBsZXQgeCA9IG5vcm1hbFJhbmRvbShjeCwgdmFyaWFuY2UpO1xyXG4gICAgICBsZXQgeSA9IG5vcm1hbFJhbmRvbShjeSwgdmFyaWFuY2UpO1xyXG4gICAgICBwb2ludHMucHVzaCh7eCwgeSwgbGFiZWx9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdlbkdhdXNzKDIsIDIsIDEpOyAvLyBHYXVzc2lhbiB3aXRoIHBvc2l0aXZlIGV4YW1wbGVzLlxyXG4gIGdlbkdhdXNzKC0yLCAtMiwgLTEpOyAvLyBHYXVzc2lhbiB3aXRoIG5lZ2F0aXZlIGV4YW1wbGVzLlxyXG4gIHJldHVybiBwb2ludHM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWdyZXNzUGxhbmUobnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTpcclxuICBFeGFtcGxlMkRbXSB7XHJcbiAgbGV0IHJhZGl1cyA9IDY7XHJcbiAgbGV0IGxhYmVsU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxyXG4gICAgLmRvbWFpbihbLTEwLCAxMF0pXHJcbiAgICAucmFuZ2UoWy0xLCAxXSk7XHJcbiAgbGV0IGdldExhYmVsID0gKHgsIHkpID0+IGxhYmVsU2NhbGUoeCArIHkpO1xyXG5cclxuICBsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU2FtcGxlczsgaSsrKSB7XHJcbiAgICBsZXQgeCA9IHJhbmRVbmlmb3JtKC1yYWRpdXMsIHJhZGl1cyk7XHJcbiAgICBsZXQgeSA9IHJhbmRVbmlmb3JtKC1yYWRpdXMsIHJhZGl1cyk7XHJcbiAgICBsZXQgbm9pc2VYID0gcmFuZFVuaWZvcm0oLXJhZGl1cywgcmFkaXVzKSAqIG5vaXNlO1xyXG4gICAgbGV0IG5vaXNlWSA9IHJhbmRVbmlmb3JtKC1yYWRpdXMsIHJhZGl1cykgKiBub2lzZTtcclxuICAgIGxldCBsYWJlbCA9IGdldExhYmVsKHggKyBub2lzZVgsIHkgKyBub2lzZVkpO1xyXG4gICAgcG9pbnRzLnB1c2goe3gsIHksIGxhYmVsfSk7XHJcbiAgfVxyXG4gIHJldHVybiBwb2ludHM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWdyZXNzR2F1c3NpYW4obnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTpcclxuICBFeGFtcGxlMkRbXSB7XHJcbiAgbGV0IHBvaW50czogRXhhbXBsZTJEW10gPSBbXTtcclxuXHJcbiAgbGV0IGxhYmVsU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxyXG4gICAgLmRvbWFpbihbMCwgMl0pXHJcbiAgICAucmFuZ2UoWzEsIDBdKVxyXG4gICAgLmNsYW1wKHRydWUpO1xyXG5cclxuICBsZXQgZ2F1c3NpYW5zID0gW1xyXG4gICAgWy00LCAyLjUsIDFdLFxyXG4gICAgWzAsIDIuNSwgLTFdLFxyXG4gICAgWzQsIDIuNSwgMV0sXHJcbiAgICBbLTQsIC0yLjUsIC0xXSxcclxuICAgIFswLCAtMi41LCAxXSxcclxuICAgIFs0LCAtMi41LCAtMV1cclxuICBdO1xyXG5cclxuICBmdW5jdGlvbiBnZXRMYWJlbCh4LCB5KSB7XHJcbiAgICAvLyBDaG9vc2UgdGhlIG9uZSB0aGF0IGlzIG1heGltdW0gaW4gYWJzIHZhbHVlLlxyXG4gICAgbGV0IGxhYmVsID0gMDtcclxuICAgIGdhdXNzaWFucy5mb3JFYWNoKChbY3gsIGN5LCBzaWduXSkgPT4ge1xyXG4gICAgICBsZXQgbmV3TGFiZWwgPSBzaWduICogbGFiZWxTY2FsZShkaXN0KHt4LCB5fSwge3g6IGN4LCB5OiBjeX0pKTtcclxuICAgICAgaWYgKE1hdGguYWJzKG5ld0xhYmVsKSA+IE1hdGguYWJzKGxhYmVsKSkge1xyXG4gICAgICAgIGxhYmVsID0gbmV3TGFiZWw7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGxhYmVsO1xyXG4gIH1cclxuICBsZXQgcmFkaXVzID0gNjtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXM7IGkrKykge1xyXG4gICAgbGV0IHggPSByYW5kVW5pZm9ybSgtcmFkaXVzLCByYWRpdXMpO1xyXG4gICAgbGV0IHkgPSByYW5kVW5pZm9ybSgtcmFkaXVzLCByYWRpdXMpO1xyXG4gICAgbGV0IG5vaXNlWCA9IHJhbmRVbmlmb3JtKC1yYWRpdXMsIHJhZGl1cykgKiBub2lzZTtcclxuICAgIGxldCBub2lzZVkgPSByYW5kVW5pZm9ybSgtcmFkaXVzLCByYWRpdXMpICogbm9pc2U7XHJcbiAgICBsZXQgbGFiZWwgPSBnZXRMYWJlbCh4ICsgbm9pc2VYLCB5ICsgbm9pc2VZKTtcclxuICAgIHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xyXG4gIH07XHJcbiAgcmV0dXJuIHBvaW50cztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzaWZ5U3BpcmFsRGF0YShudW1TYW1wbGVzOiBudW1iZXIsIG5vaXNlOiBudW1iZXIpOlxyXG4gICAgRXhhbXBsZTJEW10ge1xyXG4gIGxldCBwb2ludHM6IEV4YW1wbGUyRFtdID0gW107XHJcbiAgbGV0IG4gPSBudW1TYW1wbGVzIC8gMjtcclxuXHJcbiAgZnVuY3Rpb24gZ2VuU3BpcmFsKGRlbHRhVDogbnVtYmVyLCBsYWJlbDogbnVtYmVyKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgICBsZXQgciA9IGkgLyBuICogNTtcclxuICAgICAgbGV0IHQgPSAxLjc1ICogaSAvIG4gKiAyICogTWF0aC5QSSArIGRlbHRhVDtcclxuICAgICAgbGV0IHggPSByICogTWF0aC5zaW4odCkgKyByYW5kVW5pZm9ybSgtMSwgMSkgKiBub2lzZTtcclxuICAgICAgbGV0IHkgPSByICogTWF0aC5jb3ModCkgKyByYW5kVW5pZm9ybSgtMSwgMSkgKiBub2lzZTtcclxuICAgICAgcG9pbnRzLnB1c2goe3gsIHksIGxhYmVsfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZW5TcGlyYWwoMCwgMSk7IC8vIFBvc2l0aXZlIGV4YW1wbGVzLlxyXG4gIGdlblNwaXJhbChNYXRoLlBJLCAtMSk7IC8vIE5lZ2F0aXZlIGV4YW1wbGVzLlxyXG4gIHJldHVybiBwb2ludHM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGFzc2lmeUNpcmNsZURhdGEobnVtU2FtcGxlczogbnVtYmVyLCBub2lzZTogbnVtYmVyKTpcclxuICAgIEV4YW1wbGUyRFtdIHtcclxuICBsZXQgcG9pbnRzOiBFeGFtcGxlMkRbXSA9IFtdO1xyXG4gIGxldCByYWRpdXMgPSA1O1xyXG4gIGZ1bmN0aW9uIGdldENpcmNsZUxhYmVsKHA6IFBvaW50LCBjZW50ZXI6IFBvaW50KSB7XHJcbiAgICByZXR1cm4gKGRpc3QocCwgY2VudGVyKSA8IChyYWRpdXMgKiAwLjUpKSA/IDEgOiAtMTtcclxuICB9XHJcblxyXG4gIC8vIEdlbmVyYXRlIHBvc2l0aXZlIHBvaW50cyBpbnNpZGUgdGhlIGNpcmNsZS5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXMgLyAyOyBpKyspIHtcclxuICAgIGxldCByID0gcmFuZFVuaWZvcm0oMCwgcmFkaXVzICogMC41KTtcclxuICAgIGxldCBhbmdsZSA9IHJhbmRVbmlmb3JtKDAsIDIgKiBNYXRoLlBJKTtcclxuICAgIGxldCB4ID0gciAqIE1hdGguc2luKGFuZ2xlKTtcclxuICAgIGxldCB5ID0gciAqIE1hdGguY29zKGFuZ2xlKTtcclxuICAgIGxldCBub2lzZVggPSByYW5kVW5pZm9ybSgtcmFkaXVzLCByYWRpdXMpICogbm9pc2U7XHJcbiAgICBsZXQgbm9pc2VZID0gcmFuZFVuaWZvcm0oLXJhZGl1cywgcmFkaXVzKSAqIG5vaXNlO1xyXG4gICAgbGV0IGxhYmVsID0gZ2V0Q2lyY2xlTGFiZWwoe3g6IHggKyBub2lzZVgsIHk6IHkgKyBub2lzZVl9LCB7eDogMCwgeTogMH0pO1xyXG4gICAgcG9pbnRzLnB1c2goe3gsIHksIGxhYmVsfSk7XHJcbiAgfVxyXG5cclxuICAvLyBHZW5lcmF0ZSBuZWdhdGl2ZSBwb2ludHMgb3V0c2lkZSB0aGUgY2lyY2xlLlxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU2FtcGxlcyAvIDI7IGkrKykge1xyXG4gICAgbGV0IHIgPSByYW5kVW5pZm9ybShyYWRpdXMgKiAwLjcsIHJhZGl1cyk7XHJcbiAgICBsZXQgYW5nbGUgPSByYW5kVW5pZm9ybSgwLCAyICogTWF0aC5QSSk7XHJcbiAgICBsZXQgeCA9IHIgKiBNYXRoLnNpbihhbmdsZSk7XHJcbiAgICBsZXQgeSA9IHIgKiBNYXRoLmNvcyhhbmdsZSk7XHJcbiAgICBsZXQgbm9pc2VYID0gcmFuZFVuaWZvcm0oLXJhZGl1cywgcmFkaXVzKSAqIG5vaXNlO1xyXG4gICAgbGV0IG5vaXNlWSA9IHJhbmRVbmlmb3JtKC1yYWRpdXMsIHJhZGl1cykgKiBub2lzZTtcclxuICAgIGxldCBsYWJlbCA9IGdldENpcmNsZUxhYmVsKHt4OiB4ICsgbm9pc2VYLCB5OiB5ICsgbm9pc2VZfSwge3g6IDAsIHk6IDB9KTtcclxuICAgIHBvaW50cy5wdXNoKHt4LCB5LCBsYWJlbH0pO1xyXG4gIH1cclxuICByZXR1cm4gcG9pbnRzO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NpZnlYT1JEYXRhKG51bVNhbXBsZXM6IG51bWJlciwgbm9pc2U6IG51bWJlcik6XHJcbiAgICBFeGFtcGxlMkRbXSB7XHJcbiAgZnVuY3Rpb24gZ2V0WE9STGFiZWwocDogUG9pbnQpIHsgcmV0dXJuIHAueCAqIHAueSA+PSAwID8gMSA6IC0xOyB9XHJcblxyXG4gIGxldCBwb2ludHM6IEV4YW1wbGUyRFtdID0gW107XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1TYW1wbGVzOyBpKyspIHtcclxuICAgIGxldCB4ID0gcmFuZFVuaWZvcm0oLTUsIDUpO1xyXG4gICAgbGV0IHBhZGRpbmcgPSAwLjM7XHJcbiAgICB4ICs9IHggPiAwID8gcGFkZGluZyA6IC1wYWRkaW5nOyAgLy8gUGFkZGluZy5cclxuICAgIGxldCB5ID0gcmFuZFVuaWZvcm0oLTUsIDUpO1xyXG4gICAgeSArPSB5ID4gMCA/IHBhZGRpbmcgOiAtcGFkZGluZztcclxuICAgIGxldCBub2lzZVggPSByYW5kVW5pZm9ybSgtNSwgNSkgKiBub2lzZTtcclxuICAgIGxldCBub2lzZVkgPSByYW5kVW5pZm9ybSgtNSwgNSkgKiBub2lzZTtcclxuICAgIGxldCBsYWJlbCA9IGdldFhPUkxhYmVsKHt4OiB4ICsgbm9pc2VYLCB5OiB5ICsgbm9pc2VZfSk7XHJcbiAgICBwb2ludHMucHVzaCh7eCwgeSwgbGFiZWx9KTtcclxuICB9XHJcbiAgcmV0dXJuIHBvaW50cztcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYSBzYW1wbGUgZnJvbSBhIHVuaWZvcm0gW2EsIGJdIGRpc3RyaWJ1dGlvbi5cclxuICogVXNlcyB0aGUgc2VlZHJhbmRvbSBsaWJyYXJ5IGFzIHRoZSByYW5kb20gZ2VuZXJhdG9yLlxyXG4gKi9cclxuZnVuY3Rpb24gcmFuZFVuaWZvcm0oYTogbnVtYmVyLCBiOiBudW1iZXIpIHtcclxuICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIChiIC0gYSkgKyBhO1xyXG59XHJcblxyXG4vKipcclxuICogU2FtcGxlcyBmcm9tIGEgbm9ybWFsIGRpc3RyaWJ1dGlvbi4gVXNlcyB0aGUgc2VlZHJhbmRvbSBsaWJyYXJ5IGFzIHRoZVxyXG4gKiByYW5kb20gZ2VuZXJhdG9yLlxyXG4gKlxyXG4gKiBAcGFyYW0gbWVhbiBUaGUgbWVhbi4gRGVmYXVsdCBpcyAwLlxyXG4gKiBAcGFyYW0gdmFyaWFuY2UgVGhlIHZhcmlhbmNlLiBEZWZhdWx0IGlzIDEuXHJcbiAqL1xyXG5mdW5jdGlvbiBub3JtYWxSYW5kb20obWVhbiA9IDAsIHZhcmlhbmNlID0gMSk6IG51bWJlciB7XHJcbiAgbGV0IHYxOiBudW1iZXIsIHYyOiBudW1iZXIsIHM6IG51bWJlcjtcclxuICBkbyB7XHJcbiAgICB2MSA9IDIgKiBNYXRoLnJhbmRvbSgpIC0gMTtcclxuICAgIHYyID0gMiAqIE1hdGgucmFuZG9tKCkgLSAxO1xyXG4gICAgcyA9IHYxICogdjEgKyB2MiAqIHYyO1xyXG4gIH0gd2hpbGUgKHMgPiAxKTtcclxuXHJcbiAgbGV0IHJlc3VsdCA9IE1hdGguc3FydCgtMiAqIE1hdGgubG9nKHMpIC8gcykgKiB2MTtcclxuICByZXR1cm4gbWVhbiArIE1hdGguc3FydCh2YXJpYW5jZSkgKiByZXN1bHQ7XHJcbn1cclxuXHJcbi8qKiBSZXR1cm5zIHRoZSBldWNsZWRpYW4gZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzIGluIHNwYWNlLiAqL1xyXG5mdW5jdGlvbiBkaXN0KGE6IFBvaW50LCBiOiBQb2ludCk6IG51bWJlciB7XHJcbiAgbGV0IGR4ID0gYS54IC0gYi54O1xyXG4gIGxldCBkeSA9IGEueSAtIGIueTtcclxuICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxufVxyXG4iLCIvKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxyXG5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuXHJcbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbmltcG9ydCB7RXhhbXBsZTJEfSBmcm9tIFwiLi9kYXRhc2V0XCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEhlYXRNYXBTZXR0aW5ncyB7XHJcbiAgW2tleTogc3RyaW5nXTogYW55O1xyXG4gIHNob3dBeGVzPzogYm9vbGVhbjtcclxuICBub1N2Zz86IGJvb2xlYW47XHJcbn1cclxuXHJcbi8qKiBOdW1iZXIgb2YgZGlmZmVyZW50IHNoYWRlcyAoY29sb3JzKSB3aGVuIGRyYXdpbmcgYSBncmFkaWVudCBoZWF0bWFwICovXHJcbmNvbnN0IE5VTV9TSEFERVMgPSAzMDtcclxuXHJcbi8qKlxyXG4gKiBEcmF3cyBhIGhlYXRtYXAgdXNpbmcgY2FudmFzLiBVc2VkIGZvciBzaG93aW5nIHRoZSBsZWFybmVkIGRlY2lzaW9uXHJcbiAqIGJvdW5kYXJ5IG9mIHRoZSBjbGFzc2lmaWNhdGlvbiBhbGdvcml0aG0uIENhbiBhbHNvIGRyYXcgZGF0YSBwb2ludHNcclxuICogdXNpbmcgYW4gc3ZnIG92ZXJsYXllZCBvbiB0b3Agb2YgdGhlIGNhbnZhcyBoZWF0bWFwLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEhlYXRNYXAge1xyXG4gIHByaXZhdGUgc2V0dGluZ3M6IEhlYXRNYXBTZXR0aW5ncyA9IHtcclxuICAgIHNob3dBeGVzOiBmYWxzZSxcclxuICAgIG5vU3ZnOiBmYWxzZVxyXG4gIH07XHJcbiAgcHJpdmF0ZSB4U2NhbGU6IGQzLnNjYWxlLkxpbmVhcjxudW1iZXIsIG51bWJlcj47XHJcbiAgcHJpdmF0ZSB5U2NhbGU6IGQzLnNjYWxlLkxpbmVhcjxudW1iZXIsIG51bWJlcj47XHJcbiAgcHJpdmF0ZSBudW1TYW1wbGVzOiBudW1iZXI7XHJcbiAgcHJpdmF0ZSBjb2xvcjogZDMuc2NhbGUuUXVhbnRpemU8c3RyaW5nPjtcclxuICBwcml2YXRlIGNhbnZhczogZDMuU2VsZWN0aW9uPGFueT47XHJcbiAgcHJpdmF0ZSBzdmc6IGQzLlNlbGVjdGlvbjxhbnk+O1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgICAgd2lkdGg6IG51bWJlciwgbnVtU2FtcGxlczogbnVtYmVyLCB4RG9tYWluOiBbbnVtYmVyLCBudW1iZXJdLFxyXG4gICAgICB5RG9tYWluOiBbbnVtYmVyLCBudW1iZXJdLCBjb250YWluZXI6IGQzLlNlbGVjdGlvbjxhbnk+LFxyXG4gICAgICB1c2VyU2V0dGluZ3M/OiBIZWF0TWFwU2V0dGluZ3MpIHtcclxuICAgIHRoaXMubnVtU2FtcGxlcyA9IG51bVNhbXBsZXM7XHJcbiAgICBsZXQgaGVpZ2h0ID0gd2lkdGg7XHJcbiAgICBsZXQgcGFkZGluZyA9IHVzZXJTZXR0aW5ncy5zaG93QXhlcyA/IDIwIDogMDtcclxuXHJcbiAgICBpZiAodXNlclNldHRpbmdzICE9IG51bGwpIHtcclxuICAgICAgLy8gb3ZlcndyaXRlIHRoZSBkZWZhdWx0cyB3aXRoIHRoZSB1c2VyLXNwZWNpZmllZCBzZXR0aW5ncy5cclxuICAgICAgZm9yIChsZXQgcHJvcCBpbiB1c2VyU2V0dGluZ3MpIHtcclxuICAgICAgICB0aGlzLnNldHRpbmdzW3Byb3BdID0gdXNlclNldHRpbmdzW3Byb3BdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy54U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxyXG4gICAgICAuZG9tYWluKHhEb21haW4pXHJcbiAgICAgIC5yYW5nZShbMCwgd2lkdGggLSAyICogcGFkZGluZ10pO1xyXG5cclxuICAgIHRoaXMueVNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcclxuICAgICAgLmRvbWFpbih5RG9tYWluKVxyXG4gICAgICAucmFuZ2UoW2hlaWdodCAtIDIgKiBwYWRkaW5nLCAwXSk7XHJcblxyXG4gICAgLy8gR2V0IGEgcmFuZ2Ugb2YgY29sb3JzLlxyXG4gICAgbGV0IHRtcFNjYWxlID0gZDMuc2NhbGUubGluZWFyPHN0cmluZywgc3RyaW5nPigpXHJcbiAgICAgICAgLmRvbWFpbihbMCwgLjUsIDFdKVxyXG4gICAgICAgIC5yYW5nZShbXCIjZjU5MzIyXCIsIFwiI2U4ZWFlYlwiLCBcIiMwODc3YmRcIl0pXHJcbiAgICAgICAgLmNsYW1wKHRydWUpO1xyXG4gICAgLy8gRHVlIHRvIG51bWVyaWNhbCBlcnJvciwgd2UgbmVlZCB0byBzcGVjaWZ5XHJcbiAgICAvLyBkMy5yYW5nZSgwLCBlbmQgKyBzbWFsbF9lcHNpbG9uLCBzdGVwKVxyXG4gICAgLy8gaW4gb3JkZXIgdG8gZ3VhcmFudGVlIHRoYXQgd2Ugd2lsbCBoYXZlIGVuZC9zdGVwIGVudHJpZXMgd2l0aFxyXG4gICAgLy8gdGhlIGxhc3QgZWxlbWVudCBiZWluZyBlcXVhbCB0byBlbmQuXHJcbiAgICBsZXQgY29sb3JzID0gZDMucmFuZ2UoMCwgMSArIDFFLTksIDEgLyBOVU1fU0hBREVTKS5tYXAoYSA9PiB7XHJcbiAgICAgIHJldHVybiB0bXBTY2FsZShhKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5jb2xvciA9IGQzLnNjYWxlLnF1YW50aXplPHN0cmluZz4oKVxyXG4gICAgICAgICAgICAgICAgICAgICAuZG9tYWluKFstMSwgMV0pXHJcbiAgICAgICAgICAgICAgICAgICAgIC5yYW5nZShjb2xvcnMpO1xyXG5cclxuICAgIGNvbnRhaW5lciA9IGNvbnRhaW5lci5hcHBlbmQoXCJkaXZcIilcclxuICAgICAgLnN0eWxlKHtcclxuICAgICAgICB3aWR0aDogYCR7d2lkdGh9cHhgLFxyXG4gICAgICAgIGhlaWdodDogYCR7aGVpZ2h0fXB4YCxcclxuICAgICAgICBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLFxyXG4gICAgICAgIHRvcDogYC0ke3BhZGRpbmd9cHhgLFxyXG4gICAgICAgIGxlZnQ6IGAtJHtwYWRkaW5nfXB4YFxyXG4gICAgICB9KTtcclxuICAgIHRoaXMuY2FudmFzID0gY29udGFpbmVyLmFwcGVuZChcImNhbnZhc1wiKVxyXG4gICAgICAuYXR0cihcIndpZHRoXCIsIG51bVNhbXBsZXMpXHJcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIG51bVNhbXBsZXMpXHJcbiAgICAgIC5zdHlsZShcIndpZHRoXCIsICh3aWR0aCAtIDIgKiBwYWRkaW5nKSArIFwicHhcIilcclxuICAgICAgLnN0eWxlKFwiaGVpZ2h0XCIsIChoZWlnaHQgLSAyICogcGFkZGluZykgKyBcInB4XCIpXHJcbiAgICAgIC5zdHlsZShcInBvc2l0aW9uXCIsIFwiYWJzb2x1dGVcIilcclxuICAgICAgLnN0eWxlKFwidG9wXCIsIGAke3BhZGRpbmd9cHhgKVxyXG4gICAgICAuc3R5bGUoXCJsZWZ0XCIsIGAke3BhZGRpbmd9cHhgKTtcclxuXHJcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3Mubm9TdmcpIHtcclxuICAgICAgdGhpcy5zdmcgPSBjb250YWluZXIuYXBwZW5kKFwic3ZnXCIpLmF0dHIoe1xyXG4gICAgICAgICAgXCJ3aWR0aFwiOiB3aWR0aCxcclxuICAgICAgICAgIFwiaGVpZ2h0XCI6IGhlaWdodFxyXG4gICAgICB9KS5zdHlsZSh7XHJcbiAgICAgICAgLy8gT3ZlcmxheSB0aGUgc3ZnIG9uIHRvcCBvZiB0aGUgY2FudmFzLlxyXG4gICAgICAgIFwicG9zaXRpb25cIjogXCJhYnNvbHV0ZVwiLFxyXG4gICAgICAgIFwibGVmdFwiOiBcIjBcIixcclxuICAgICAgICBcInRvcFwiOiBcIjBcIlxyXG4gICAgICB9KS5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgke3BhZGRpbmd9LCR7cGFkZGluZ30pYCk7XHJcblxyXG4gICAgICB0aGlzLnN2Zy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLCBcInRyYWluXCIpO1xyXG4gICAgICB0aGlzLnN2Zy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLCBcInZhbGlkYXRpb25cIik7XHJcbiAgICAgIHRoaXMuc3ZnLmFwcGVuZChcImdcIikuYXR0cihcImNsYXNzXCIsIFwidGVzdFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5zaG93QXhlcykge1xyXG4gICAgICBsZXQgeEF4aXMgPSBkMy5zdmcuYXhpcygpXHJcbiAgICAgICAgLnNjYWxlKHRoaXMueFNjYWxlKVxyXG4gICAgICAgIC5vcmllbnQoXCJib3R0b21cIik7XHJcblxyXG4gICAgICBsZXQgeUF4aXMgPSBkMy5zdmcuYXhpcygpXHJcbiAgICAgICAgLnNjYWxlKHRoaXMueVNjYWxlKVxyXG4gICAgICAgIC5vcmllbnQoXCJyaWdodFwiKTtcclxuXHJcbiAgICAgIHRoaXMuc3ZnLmFwcGVuZChcImdcIilcclxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwieCBheGlzXCIpXHJcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgwLCR7aGVpZ2h0IC0gMiAqIHBhZGRpbmd9KWApXHJcbiAgICAgICAgLmNhbGwoeEF4aXMpO1xyXG5cclxuICAgICAgdGhpcy5zdmcuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ5IGF4aXNcIilcclxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICh3aWR0aCAtIDIgKiBwYWRkaW5nKSArIFwiLDApXCIpXHJcbiAgICAgICAgLmNhbGwoeUF4aXMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlVHJhaW5Qb2ludHMocG9pbnRzOiBFeGFtcGxlMkRbXSk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuc2V0dGluZ3Mubm9TdmcpIHtcclxuICAgICAgdGhyb3cgRXJyb3IoXCJDYW4ndCBhZGQgcG9pbnRzIHNpbmNlIG5vU3ZnPXRydWVcIik7XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZUNpcmNsZXModGhpcy5zdmcuc2VsZWN0KFwiZy50cmFpblwiKSwgcG9pbnRzKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVZhbGlkYXRpb25Qb2ludHMocG9pbnRzOiBFeGFtcGxlMkRbXSk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuc2V0dGluZ3Mubm9TdmcpIHtcclxuICAgICAgdGhyb3cgRXJyb3IoXCJDYW4ndCBhZGQgcG9pbnRzIHNpbmNlIG5vU3ZnPXRydWVcIik7XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZUNpcmNsZXModGhpcy5zdmcuc2VsZWN0KFwiZy52YWxpZGF0aW9uXCIpLCBwb2ludHMpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlVGVzdFBvaW50cyhwb2ludHM6IEV4YW1wbGUyRFtdKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5ub1N2Zykge1xyXG4gICAgICB0aHJvdyBFcnJvcihcIkNhbid0IGFkZCBwb2ludHMgc2luY2Ugbm9Tdmc9dHJ1ZVwiKTtcclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlQ2lyY2xlcyh0aGlzLnN2Zy5zZWxlY3QoXCJnLnRlc3RcIiksIHBvaW50cyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgdXBkYXRlQmFja2dyb3VuZChkYXRhOiBudW1iZXJbXVtdLCBkaXNjcmV0aXplOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICBsZXQgZHggPSBkYXRhWzBdLmxlbmd0aDtcclxuICAgIGxldCBkeSA9IGRhdGEubGVuZ3RoO1xyXG5cclxuICAgIGlmIChkeCAhPT0gdGhpcy5udW1TYW1wbGVzIHx8IGR5ICE9PSB0aGlzLm51bVNhbXBsZXMpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgXCJUaGUgcHJvdmlkZWQgZGF0YSBtYXRyaXggbXVzdCBiZSBvZiBzaXplIFwiICtcclxuICAgICAgICAgIFwibnVtU2FtcGxlcyBYIG51bVNhbXBsZXNcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ29tcHV0ZSB0aGUgcGl4ZWwgY29sb3JzOyBzY2FsZWQgYnkgQ1NTLlxyXG4gICAgbGV0IGNvbnRleHQgPSAodGhpcy5jYW52YXMubm9kZSgpIGFzIEhUTUxDYW52YXNFbGVtZW50KS5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICBsZXQgaW1hZ2UgPSBjb250ZXh0LmNyZWF0ZUltYWdlRGF0YShkeCwgZHkpO1xyXG5cclxuICAgIGZvciAobGV0IHkgPSAwLCBwID0gLTE7IHkgPCBkeTsgKyt5KSB7XHJcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgZHg7ICsreCkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IGRhdGFbeF1beV07XHJcbiAgICAgICAgaWYgKGRpc2NyZXRpemUpIHtcclxuICAgICAgICAgIHZhbHVlID0gKHZhbHVlID49IDAgPyAxIDogLTEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgYyA9IGQzLnJnYih0aGlzLmNvbG9yKHZhbHVlKSk7XHJcbiAgICAgICAgaW1hZ2UuZGF0YVsrK3BdID0gYy5yO1xyXG4gICAgICAgIGltYWdlLmRhdGFbKytwXSA9IGMuZztcclxuICAgICAgICBpbWFnZS5kYXRhWysrcF0gPSBjLmI7XHJcbiAgICAgICAgaW1hZ2UuZGF0YVsrK3BdID0gMTYwO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb250ZXh0LnB1dEltYWdlRGF0YShpbWFnZSwgMCwgMCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZUNpcmNsZXMoY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55PiwgcG9pbnRzOiBFeGFtcGxlMkRbXSkge1xyXG4gICAgLy8gS2VlcCBvbmx5IHBvaW50cyB0aGF0IGFyZSBpbnNpZGUgdGhlIGJvdW5kcy5cclxuICAgIGxldCB4RG9tYWluID0gdGhpcy54U2NhbGUuZG9tYWluKCk7XHJcbiAgICBsZXQgeURvbWFpbiA9IHRoaXMueVNjYWxlLmRvbWFpbigpO1xyXG4gICAgcG9pbnRzID0gcG9pbnRzLmZpbHRlcihwID0+IHtcclxuICAgICAgcmV0dXJuIHAueCA+PSB4RG9tYWluWzBdICYmIHAueCA8PSB4RG9tYWluWzFdXHJcbiAgICAgICAgJiYgcC55ID49IHlEb21haW5bMF0gJiYgcC55IDw9IHlEb21haW5bMV07XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBBdHRhY2ggZGF0YSB0byBpbml0aWFsbHkgZW1wdHkgc2VsZWN0aW9uLlxyXG4gICAgbGV0IHNlbGVjdGlvbiA9IGNvbnRhaW5lci5zZWxlY3RBbGwoXCJjaXJjbGVcIikuZGF0YShwb2ludHMpO1xyXG5cclxuICAgIC8vIEluc2VydCBlbGVtZW50cyB0byBtYXRjaCBsZW5ndGggb2YgcG9pbnRzIGFycmF5LlxyXG4gICAgc2VsZWN0aW9uLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpLmF0dHIoXCJyXCIsIDMpO1xyXG5cclxuICAgIC8vIFVwZGF0ZSBwb2ludHMgdG8gYmUgaW4gdGhlIGNvcnJlY3QgcG9zaXRpb24uXHJcbiAgICBzZWxlY3Rpb25cclxuICAgICAgLmF0dHIoe1xyXG4gICAgICAgIGN4OiAoZDogRXhhbXBsZTJEKSA9PiB0aGlzLnhTY2FsZShkLngpLFxyXG4gICAgICAgIGN5OiAoZDogRXhhbXBsZTJEKSA9PiB0aGlzLnlTY2FsZShkLnkpLFxyXG4gICAgICB9KVxyXG4gICAgICAuc3R5bGUoXCJmaWxsXCIsIGQgPT4gdGhpcy5jb2xvcihkLmxhYmVsKSk7XHJcblxyXG4gICAgLy8gUmVtb3ZlIHBvaW50cyBpZiB0aGUgbGVuZ3RoIGhhcyBnb25lIGRvd24uXHJcbiAgICBzZWxlY3Rpb24uZXhpdCgpLnJlbW92ZSgpO1xyXG4gIH1cclxufSAgLy8gQ2xvc2UgY2xhc3MgSGVhdE1hcC5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VNYXRyaXgobWF0cml4OiBudW1iZXJbXVtdLCBmYWN0b3I6IG51bWJlcik6IG51bWJlcltdW10ge1xyXG4gIGlmIChtYXRyaXgubGVuZ3RoICE9PSBtYXRyaXhbMF0ubGVuZ3RoKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcHJvdmlkZWQgbWF0cml4IG11c3QgYmUgYSBzcXVhcmUgbWF0cml4XCIpO1xyXG4gIH1cclxuICBpZiAobWF0cml4Lmxlbmd0aCAlIGZhY3RvciAhPT0gMCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHdpZHRoL2hlaWdodCBvZiB0aGUgbWF0cml4IG11c3QgYmUgZGl2aXNpYmxlIGJ5IFwiICtcclxuICAgICAgICBcInRoZSByZWR1Y3Rpb24gZmFjdG9yXCIpO1xyXG4gIH1cclxuICBsZXQgcmVzdWx0OiBudW1iZXJbXVtdID0gbmV3IEFycmF5KG1hdHJpeC5sZW5ndGggLyBmYWN0b3IpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0cml4Lmxlbmd0aDsgaSArPSBmYWN0b3IpIHtcclxuICAgIHJlc3VsdFtpIC8gZmFjdG9yXSA9IG5ldyBBcnJheShtYXRyaXgubGVuZ3RoIC8gZmFjdG9yKTtcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWF0cml4Lmxlbmd0aDsgaiArPSBmYWN0b3IpIHtcclxuICAgICAgbGV0IGF2ZyA9IDA7XHJcbiAgICAgIC8vIFN1bSBhbGwgdGhlIHZhbHVlcyBpbiB0aGUgbmVpZ2hib3Job29kLlxyXG4gICAgICBmb3IgKGxldCBrID0gMDsgayA8IGZhY3RvcjsgaysrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgbCA9IDA7IGwgPCBmYWN0b3I7IGwrKykge1xyXG4gICAgICAgICAgYXZnICs9IG1hdHJpeFtpICsga11baiArIGxdO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBhdmcgLz0gKGZhY3RvciAqIGZhY3Rvcik7XHJcbiAgICAgIHJlc3VsdFtpIC8gZmFjdG9yXVtqIC8gZmFjdG9yXSA9IGF2ZztcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG4iLCIvKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxyXG5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuXHJcbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxudHlwZSBEYXRhUG9pbnQgPSB7XHJcbiAgeDogbnVtYmVyO1xyXG4gIHk6IG51bWJlcltdO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEEgbXVsdGktc2VyaWVzIGxpbmUgY2hhcnQgdGhhdCBhbGxvd3MgeW91IHRvIGFwcGVuZCBuZXcgZGF0YSBwb2ludHNcclxuICogYXMgZGF0YSBiZWNvbWVzIGF2YWlsYWJsZS5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBBcHBlbmRpbmdMaW5lQ2hhcnQge1xyXG4gIHByaXZhdGUgbnVtTGluZXM6IG51bWJlcjtcclxuICBwcml2YXRlIGRhdGE6IERhdGFQb2ludFtdID0gW107XHJcbiAgcHJpdmF0ZSBzdmc6IGQzLlNlbGVjdGlvbjxhbnk+O1xyXG4gIHByaXZhdGUgeFNjYWxlOiBkMy5zY2FsZS5MaW5lYXI8bnVtYmVyLCBudW1iZXI+O1xyXG4gIHByaXZhdGUgeVNjYWxlOiBkMy5zY2FsZS5MaW5lYXI8bnVtYmVyLCBudW1iZXI+O1xyXG4gIHByaXZhdGUgcGF0aHM6IEFycmF5PGQzLlNlbGVjdGlvbjxhbnk+PjtcclxuICBwcml2YXRlIGxpbmVDb2xvcnM6IHN0cmluZ1tdO1xyXG5cclxuICBwcml2YXRlIG1pblkgPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG4gIHByaXZhdGUgbWF4WSA9IE51bWJlci5NSU5fVkFMVUU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPGFueT4sIGxpbmVDb2xvcnM6IHN0cmluZ1tdKSB7XHJcbiAgICB0aGlzLmxpbmVDb2xvcnMgPSBsaW5lQ29sb3JzO1xyXG4gICAgdGhpcy5udW1MaW5lcyA9IGxpbmVDb2xvcnMubGVuZ3RoO1xyXG4gICAgbGV0IG5vZGUgPSBjb250YWluZXIubm9kZSgpIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgbGV0IHRvdGFsV2lkdGggPSBub2RlLm9mZnNldFdpZHRoO1xyXG4gICAgbGV0IHRvdGFsSGVpZ2h0ID0gbm9kZS5vZmZzZXRIZWlnaHQ7XHJcbiAgICBsZXQgbWFyZ2luID0ge3RvcDogMiwgcmlnaHQ6IDAsIGJvdHRvbTogMiwgbGVmdDogMn07XHJcbiAgICBsZXQgd2lkdGggPSB0b3RhbFdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XHJcbiAgICBsZXQgaGVpZ2h0ID0gdG90YWxIZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcclxuXHJcbiAgICB0aGlzLnhTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXHJcbiAgICAgIC5kb21haW4oWzAsIDBdKVxyXG4gICAgICAucmFuZ2UoWzAsIHdpZHRoXSk7XHJcblxyXG4gICAgdGhpcy55U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxyXG4gICAgICAuZG9tYWluKFswLCAwXSlcclxuICAgICAgLnJhbmdlKFtoZWlnaHQsIDBdKTtcclxuXHJcbiAgICB0aGlzLnN2ZyA9IGNvbnRhaW5lci5hcHBlbmQoXCJzdmdcIilcclxuICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0KVxyXG4gICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbSlcclxuICAgICAgLmFwcGVuZChcImdcIilcclxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7bWFyZ2luLmxlZnR9LCR7bWFyZ2luLnRvcH0pYCk7XHJcblxyXG4gICAgdGhpcy5wYXRocyA9IG5ldyBBcnJheSh0aGlzLm51bUxpbmVzKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1MaW5lczsgaSsrKSB7XHJcbiAgICAgIHRoaXMucGF0aHNbaV0gPSB0aGlzLnN2Zy5hcHBlbmQoXCJwYXRoXCIpXHJcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImxpbmVcIilcclxuICAgICAgICAuc3R5bGUoe1xyXG4gICAgICAgICAgXCJmaWxsXCI6IFwibm9uZVwiLFxyXG4gICAgICAgICAgXCJzdHJva2VcIjogbGluZUNvbG9yc1tpXSxcclxuICAgICAgICAgIFwic3Ryb2tlLXdpZHRoXCI6IFwiMS41cHhcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLmRhdGEgPSBbXTtcclxuICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICB0aGlzLm1pblkgPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG4gICAgdGhpcy5tYXhZID0gTnVtYmVyLk1JTl9WQUxVRTtcclxuICB9XHJcblxyXG4gIGFkZERhdGFQb2ludChkYXRhUG9pbnQ6IG51bWJlcltdKSB7XHJcbiAgICBpZiAoZGF0YVBvaW50Lmxlbmd0aCAhPT0gdGhpcy5udW1MaW5lcykge1xyXG4gICAgICB0aHJvdyBFcnJvcihcIkxlbmd0aCBvZiBkYXRhUG9pbnQgbXVzdCBlcXVhbCBudW1iZXIgb2YgbGluZXNcIik7XHJcbiAgICB9XHJcbiAgICBkYXRhUG9pbnQuZm9yRWFjaCh5ID0+IHtcclxuICAgICAgdGhpcy5taW5ZID0gTWF0aC5taW4odGhpcy5taW5ZLCB5KTtcclxuICAgICAgdGhpcy5tYXhZID0gTWF0aC5tYXgodGhpcy5tYXhZLCB5KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZGF0YS5wdXNoKHt4OiB0aGlzLmRhdGEubGVuZ3RoICsgMSwgeTogZGF0YVBvaW50fSk7XHJcbiAgICB0aGlzLnJlZHJhdygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWRyYXcoKSB7XHJcbiAgICAvLyBBZGp1c3QgdGhlIHggYW5kIHkgZG9tYWluLlxyXG4gICAgdGhpcy54U2NhbGUuZG9tYWluKFsxLCB0aGlzLmRhdGEubGVuZ3RoXSk7XHJcbiAgICB0aGlzLnlTY2FsZS5kb21haW4oW3RoaXMubWluWSwgdGhpcy5tYXhZXSk7XHJcbiAgICAvLyBBZGp1c3QgYWxsIHRoZSA8cGF0aD4gZWxlbWVudHMgKGxpbmVzKS5cclxuICAgIGxldCBnZXRQYXRoTWFwID0gKGxpbmVJbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgIHJldHVybiBkMy5zdmcubGluZTxEYXRhUG9pbnQ+KClcclxuICAgICAgLngoZCA9PiB0aGlzLnhTY2FsZShkLngpKVxyXG4gICAgICAueShkID0+IHRoaXMueVNjYWxlKGQueVtsaW5lSW5kZXhdKSk7XHJcbiAgICB9O1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm51bUxpbmVzOyBpKyspIHtcclxuICAgICAgdGhpcy5wYXRoc1tpXS5kYXR1bSh0aGlzLmRhdGEpLmF0dHIoXCJkXCIsIGdldFBhdGhNYXAoaSkpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCIvKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxyXG5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuXHJcbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbi8qKlxyXG4gKiBBIG5vZGUgaW4gYSBuZXVyYWwgbmV0d29yay4gRWFjaCBub2RlIGhhcyBhIHN0YXRlXHJcbiAqICh0b3RhbCBpbnB1dCwgb3V0cHV0LCBhbmQgdGhlaXIgcmVzcGVjdGl2ZWx5IGRlcml2YXRpdmVzKSB3aGljaCBjaGFuZ2VzXHJcbiAqIGFmdGVyIGV2ZXJ5IGZvcndhcmQgYW5kIGJhY2sgcHJvcGFnYXRpb24gcnVuLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE5vZGUge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgLyoqIExpc3Qgb2YgaW5wdXQgbGlua3MuICovXHJcbiAgaW5wdXRMaW5rczogTGlua1tdID0gW107XHJcbiAgYmlhcyA9IDAuMDtcclxuICAvKiogTGlzdCBvZiBvdXRwdXQgbGlua3MuICovXHJcbiAgb3V0cHV0czogTGlua1tdID0gW107XHJcbiAgdG90YWxJbnB1dDogbnVtYmVyO1xyXG4gIG91dHB1dDogbnVtYmVyO1xyXG4gIC8qKiBFcnJvciBkZXJpdmF0aXZlIHdpdGggcmVzcGVjdCB0byB0aGlzIG5vZGUncyBvdXRwdXQuICovXHJcbiAgb3V0cHV0RGVyID0gMDtcclxuICAvKiogRXJyb3IgZGVyaXZhdGl2ZSB3aXRoIHJlc3BlY3QgdG8gdGhpcyBub2RlJ3MgdG90YWwgaW5wdXQuICovXHJcbiAgaW5wdXREZXIgPSAwO1xyXG4gIC8qKlxyXG4gICAqIEFjY3VtdWxhdGVkIGVycm9yIGRlcml2YXRpdmUgd2l0aCByZXNwZWN0IHRvIHRoaXMgbm9kZSdzIHRvdGFsIGlucHV0IHNpbmNlXHJcbiAgICogdGhlIGxhc3QgdXBkYXRlLiBUaGlzIGRlcml2YXRpdmUgZXF1YWxzIGRFL2RiIHdoZXJlIGIgaXMgdGhlIG5vZGUnc1xyXG4gICAqIGJpYXMgdGVybS5cclxuICAgKi9cclxuICBhY2NJbnB1dERlciA9IDA7XHJcbiAgLyoqXHJcbiAgICogTnVtYmVyIG9mIGFjY3VtdWxhdGVkIGVyci4gZGVyaXZhdGl2ZXMgd2l0aCByZXNwZWN0IHRvIHRoZSB0b3RhbCBpbnB1dFxyXG4gICAqIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZS5cclxuICAgKi9cclxuICBudW1BY2N1bXVsYXRlZERlcnMgPSAwO1xyXG4gIC8qKiBBY3RpdmF0aW9uIGZ1bmN0aW9uIHRoYXQgdGFrZXMgdG90YWwgaW5wdXQgYW5kIHJldHVybnMgbm9kZSdzIG91dHB1dCAqL1xyXG4gIGFjdGl2YXRpb246IEFjdGl2YXRpb25GdW5jdGlvbjtcclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIG5ldyBub2RlIHdpdGggdGhlIHByb3ZpZGVkIGlkIGFuZCBhY3RpdmF0aW9uIGZ1bmN0aW9uLlxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGFjdGl2YXRpb246IEFjdGl2YXRpb25GdW5jdGlvbiwgaW5pdE9yaWdpbj86IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuaWQgPSBpZDtcclxuICAgIHRoaXMuYWN0aXZhdGlvbiA9IGFjdGl2YXRpb247XHJcbiAgICBpZiAoaW5pdE9yaWdpbikge1xyXG4gICAgICB0aGlzLmJpYXMgPSAwLjE7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiogUmVjb21wdXRlcyB0aGUgbm9kZSdzIG91dHB1dCBhbmQgcmV0dXJucyBpdC4gKi9cclxuICB1cGRhdGVPdXRwdXQoKTogbnVtYmVyIHtcclxuICAgIC8vIFN0b3JlcyB0b3RhbCBpbnB1dCBpbnRvIHRoZSBub2RlLlxyXG4gICAgdGhpcy50b3RhbElucHV0ID0gdGhpcy5iaWFzO1xyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmlucHV0TGlua3MubGVuZ3RoOyBqKyspIHtcclxuICAgICAgbGV0IGxpbmsgPSB0aGlzLmlucHV0TGlua3Nbal07XHJcbiAgICAgIHRoaXMudG90YWxJbnB1dCArPSBsaW5rLndlaWdodCAqIGxpbmsuc291cmNlLm91dHB1dDtcclxuICAgIH1cclxuICAgIHRoaXMub3V0cHV0ID0gdGhpcy5hY3RpdmF0aW9uLm91dHB1dCh0aGlzLnRvdGFsSW5wdXQpO1xyXG4gICAgcmV0dXJuIHRoaXMub3V0cHV0O1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFuIGVycm9yIGZ1bmN0aW9uIGFuZCBpdHMgZGVyaXZhdGl2ZS5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JGdW5jdGlvbiB7XHJcbiAgZXJyb3I6IChvdXRwdXQ6IG51bWJlciwgdGFyZ2V0OiBudW1iZXIpID0+IG51bWJlcjtcclxuICBkZXI6IChvdXRwdXQ6IG51bWJlciwgdGFyZ2V0OiBudW1iZXIpID0+IG51bWJlcjtcclxufVxyXG5cclxuLyoqIEEgbm9kZSdzIGFjdGl2YXRpb24gZnVuY3Rpb24gYW5kIGl0cyBkZXJpdmF0aXZlLiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIEFjdGl2YXRpb25GdW5jdGlvbiB7XHJcbiAgb3V0cHV0OiAoaW5wdXQ6IG51bWJlcikgPT4gbnVtYmVyO1xyXG4gIGRlcjogKGlucHV0OiBudW1iZXIpID0+IG51bWJlcjtcclxufVxyXG5cclxuLyoqIEZ1bmN0aW9uIHRoYXQgY29tcHV0ZXMgYSBwZW5hbHR5IGNvc3QgZm9yIGEgZ2l2ZW4gd2VpZ2h0IGluIHRoZSBuZXR3b3JrLiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIFJlZ3VsYXJpemF0aW9uRnVuY3Rpb24ge1xyXG4gIG91dHB1dDogKHdlaWdodDogbnVtYmVyKSA9PiBudW1iZXI7XHJcbiAgZGVyOiAod2VpZ2h0OiBudW1iZXIpID0+IG51bWJlcjtcclxufVxyXG5cclxuLyoqIEJ1aWx0LWluIGVycm9yIGZ1bmN0aW9ucyAqL1xyXG5leHBvcnQgY2xhc3MgRXJyb3JzIHtcclxuICBwdWJsaWMgc3RhdGljIFNRVUFSRTogRXJyb3JGdW5jdGlvbiA9IHtcclxuICAgIGVycm9yOiAob3V0cHV0OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKSA9PlxyXG4gICAgICAgICAgICAgICAwLjUgKiBNYXRoLnBvdyhvdXRwdXQgLSB0YXJnZXQsIDIpLFxyXG4gICAgZGVyOiAob3V0cHV0OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKSA9PiBvdXRwdXQgLSB0YXJnZXRcclxuICB9O1xyXG59XHJcblxyXG4vKiogUG9seWZpbGwgZm9yIFRBTkggKi9cclxuKE1hdGggYXMgYW55KS50YW5oID0gKE1hdGggYXMgYW55KS50YW5oIHx8IGZ1bmN0aW9uKHgpIHtcclxuICBpZiAoeCA9PT0gSW5maW5pdHkpIHtcclxuICAgIHJldHVybiAxO1xyXG4gIH0gZWxzZSBpZiAoeCA9PT0gLUluZmluaXR5KSB7XHJcbiAgICByZXR1cm4gLTE7XHJcbiAgfSBlbHNlIHtcclxuICAgIGxldCBlMnggPSBNYXRoLmV4cCgyICogeCk7XHJcbiAgICByZXR1cm4gKGUyeCAtIDEpIC8gKGUyeCArIDEpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKiBCdWlsdC1pbiBhY3RpdmF0aW9uIGZ1bmN0aW9ucyAqL1xyXG5leHBvcnQgY2xhc3MgQWN0aXZhdGlvbnMge1xyXG4gIHB1YmxpYyBzdGF0aWMgVEFOSDogQWN0aXZhdGlvbkZ1bmN0aW9uID0ge1xyXG4gICAgb3V0cHV0OiB4ID0+IChNYXRoIGFzIGFueSkudGFuaCh4KSxcclxuICAgIGRlcjogeCA9PiB7XHJcbiAgICAgIGxldCBvdXRwdXQgPSBBY3RpdmF0aW9ucy5UQU5ILm91dHB1dCh4KTtcclxuICAgICAgcmV0dXJuIDEgLSBvdXRwdXQgKiBvdXRwdXQ7XHJcbiAgICB9XHJcbiAgfTtcclxuICBwdWJsaWMgc3RhdGljIFJFTFU6IEFjdGl2YXRpb25GdW5jdGlvbiA9IHtcclxuICAgIG91dHB1dDogeCA9PiBNYXRoLm1heCgwLCB4KSxcclxuICAgIGRlcjogeCA9PiB4IDw9IDAgPyAwIDogMVxyXG4gIH07XHJcbiAgcHVibGljIHN0YXRpYyBTSUdNT0lEOiBBY3RpdmF0aW9uRnVuY3Rpb24gPSB7XHJcbiAgICBvdXRwdXQ6IHggPT4gMSAvICgxICsgTWF0aC5leHAoLXgpKSxcclxuICAgIGRlcjogeCA9PiB7XHJcbiAgICAgIGxldCBvdXRwdXQgPSBBY3RpdmF0aW9ucy5TSUdNT0lELm91dHB1dCh4KTtcclxuICAgICAgcmV0dXJuIG91dHB1dCAqICgxIC0gb3V0cHV0KTtcclxuICAgIH1cclxuICB9O1xyXG4gIHB1YmxpYyBzdGF0aWMgTElORUFSOiBBY3RpdmF0aW9uRnVuY3Rpb24gPSB7XHJcbiAgICBvdXRwdXQ6IHggPT4geCxcclxuICAgIGRlcjogeCA9PiAxXHJcbiAgfTtcclxufVxyXG5cclxuLyoqIEJ1aWxkLWluIHJlZ3VsYXJpemF0aW9uIGZ1bmN0aW9ucyAqL1xyXG5leHBvcnQgY2xhc3MgUmVndWxhcml6YXRpb25GdW5jdGlvbiB7XHJcbiAgcHVibGljIHN0YXRpYyBMMTogUmVndWxhcml6YXRpb25GdW5jdGlvbiA9IHtcclxuICAgIG91dHB1dDogdyA9PiBNYXRoLmFicyh3KSxcclxuICAgIGRlcjogdyA9PiB3IDwgMCA/IC0xIDogKHcgPiAwID8gMSA6IDApXHJcbiAgfTtcclxuICBwdWJsaWMgc3RhdGljIEwyOiBSZWd1bGFyaXphdGlvbkZ1bmN0aW9uID0ge1xyXG4gICAgb3V0cHV0OiB3ID0+IDAuNSAqIHcgKiB3LFxyXG4gICAgZGVyOiB3ID0+IHdcclxuICB9O1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIEdsb3JvdCB1bmlmb3JtIGluaXRpYWxpemVyLCBhbHNvIGNhbGxlZCBYYXZpZXIgdW5pZm9ybSBpbml0aWFsaXplci5cclxuICogXHJcbiAqIEl0IGRyYXdzIHNhbXBsZXMgZnJvbSBhIHVuaWZvcm0gZGlzdHJpYnV0aW9uIHdpdGhpbiBbLWxpbWl0LCBsaW1pdF0uXHJcbiAqIFxyXG4gKiBAcGFyYW0gZmFuX2luIFRoZSBudW1iZXIgb2YgaW5wdXQgdW5pdHMgaW4gdGhlIGN1cnJlbnQgbGluay5cclxuICogQHBhcmFtIGZhbl9vdXQgVGhlIG51bWJlciBvZiBvdXRwdXQgdW5pdHMgaW4gdGhlIGN1cnJlbnQgbGluay5cclxuICogQHJldHVybiBBbiBpbml0aWFsaXplci5cclxuICovXHJcbmZ1bmN0aW9uIGdsb3JvdFVuaWZvcm0oZmFuX2luOiBudW1iZXIsIGZhbl9vdXQ6IG51bWJlcik6IG51bWJlciB7XHJcbiAgdmFyIHNjYWxlID0gMS4wIC8gTWF0aC5tYXgoMS4wLCAoZmFuX2luICsgZmFuX291dCkgLyAyLjApO1xyXG4gIHZhciBsaW1pdCA9IE1hdGguc3FydCgzLjAgKiBzY2FsZSk7IC8vIGVxdWFscyB0byBgc3FydCg2IC8gKGZhbl9pbiArIGZhbl9vdXQpKWBcclxuICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIChsaW1pdCAqIDIpIC0gbGltaXQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIGxpbmsgaW4gYSBuZXVyYWwgbmV0d29yay4gRWFjaCBsaW5rIGhhcyBhIHdlaWdodCBhbmQgYSBzb3VyY2UgYW5kXHJcbiAqIGRlc3RpbmF0aW9uIG5vZGUuIEFsc28gaXQgaGFzIGFuIGludGVybmFsIHN0YXRlIChlcnJvciBkZXJpdmF0aXZlXHJcbiAqIHdpdGggcmVzcGVjdCB0byBhIHBhcnRpY3VsYXIgaW5wdXQpIHdoaWNoIGdldHMgdXBkYXRlZCBhZnRlclxyXG4gKiBhIHJ1biBvZiBiYWNrIHByb3BhZ2F0aW9uLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIExpbmsge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgc291cmNlOiBOb2RlO1xyXG4gIGRlc3Q6IE5vZGU7XHJcbiAgd2VpZ2h0ID0gMDtcclxuICBpc0RlYWQgPSBmYWxzZTtcclxuICAvKiogRXJyb3IgZGVyaXZhdGl2ZSB3aXRoIHJlc3BlY3QgdG8gdGhpcyB3ZWlnaHQuICovXHJcbiAgZXJyb3JEZXIgPSAwO1xyXG4gIC8qKiBBY2N1bXVsYXRlZCBlcnJvciBkZXJpdmF0aXZlIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZS4gKi9cclxuICBhY2NFcnJvckRlciA9IDA7XHJcbiAgLyoqIE51bWJlciBvZiBhY2N1bXVsYXRlZCBkZXJpdmF0aXZlcyBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuICovXHJcbiAgbnVtQWNjdW11bGF0ZWREZXJzID0gMDtcclxuICByZWd1bGFyaXphdGlvbjogUmVndWxhcml6YXRpb25GdW5jdGlvbjtcclxuXHJcbiAgLyoqXHJcbiAgICogQ29uc3RydWN0cyBhIGxpbmsgaW4gdGhlIG5ldXJhbCBuZXR3b3JrIGluaXRpYWxpemVkIHdpdGggcmFuZG9tIHdlaWdodC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBzb3VyY2UgVGhlIHNvdXJjZSBub2RlLlxyXG4gICAqIEBwYXJhbSBkZXN0IFRoZSBkZXN0aW5hdGlvbiBub2RlLlxyXG4gICAqIEBwYXJhbSByZWd1bGFyaXphdGlvbiBUaGUgcmVndWxhcml6YXRpb24gZnVuY3Rpb24gdGhhdCBjb21wdXRlcyB0aGVcclxuICAgKiAgICAgcGVuYWx0eSBmb3IgdGhpcyB3ZWlnaHQuIElmIG51bGwsIHRoZXJlIHdpbGwgYmUgbm8gcmVndWxhcml6YXRpb24uXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Ioc291cmNlOiBOb2RlLCBkZXN0OiBOb2RlLFxyXG4gICAgICByZWd1bGFyaXphdGlvbjogUmVndWxhcml6YXRpb25GdW5jdGlvbiwgaW5pdE9yaWdpbj86IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuaWQgPSBzb3VyY2UuaWQgKyBcIi1cIiArIGRlc3QuaWQ7XHJcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcclxuICAgIHRoaXMuZGVzdCA9IGRlc3Q7XHJcbiAgICB0aGlzLnJlZ3VsYXJpemF0aW9uID0gcmVndWxhcml6YXRpb247XHJcbiAgICBpZiAoaW5pdE9yaWdpbikge1xyXG4gICAgICB0aGlzLndlaWdodCA9IE1hdGgucmFuZG9tKCkgLSAwLjU7IC8vIC0wLjXvvZ4wLjVcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMud2VpZ2h0ID0gZ2xvcm90VW5pZm9ybShzb3VyY2Uub3V0cHV0cy5sZW5ndGgsIGRlc3Qub3V0cHV0cy5sZW5ndGgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEJ1aWxkcyBhIG5ldXJhbCBuZXR3b3JrLlxyXG4gKlxyXG4gKiBAcGFyYW0gbmV0d29ya1NoYXBlIFRoZSBzaGFwZSBvZiB0aGUgbmV0d29yay4gRS5nLiBbMSwgMiwgMywgMV0gbWVhbnNcclxuICogICB0aGUgbmV0d29yayB3aWxsIGhhdmUgb25lIGlucHV0IG5vZGUsIDIgbm9kZXMgaW4gZmlyc3QgaGlkZGVuIGxheWVyLFxyXG4gKiAgIDMgbm9kZXMgaW4gc2Vjb25kIGhpZGRlbiBsYXllciBhbmQgMSBvdXRwdXQgbm9kZS5cclxuICogQHBhcmFtIGFjdGl2YXRpb24gVGhlIGFjdGl2YXRpb24gZnVuY3Rpb24gb2YgZXZlcnkgaGlkZGVuIG5vZGUuXHJcbiAqIEBwYXJhbSBvdXRwdXRBY3RpdmF0aW9uIFRoZSBhY3RpdmF0aW9uIGZ1bmN0aW9uIGZvciB0aGUgb3V0cHV0IG5vZGVzLlxyXG4gKiBAcGFyYW0gcmVndWxhcml6YXRpb24gVGhlIHJlZ3VsYXJpemF0aW9uIGZ1bmN0aW9uIHRoYXQgY29tcHV0ZXMgYSBwZW5hbHR5XHJcbiAqICAgICBmb3IgYSBnaXZlbiB3ZWlnaHQgKHBhcmFtZXRlcikgaW4gdGhlIG5ldHdvcmsuIElmIG51bGwsIHRoZXJlIHdpbGwgYmVcclxuICogICAgIG5vIHJlZ3VsYXJpemF0aW9uLlxyXG4gKiBAcGFyYW0gaW5wdXRJZHMgTGlzdCBvZiBpZHMgZm9yIHRoZSBpbnB1dCBub2Rlcy5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBidWlsZE5ldHdvcmsoXHJcbiAgICBuZXR3b3JrU2hhcGU6IG51bWJlcltdLCBhY3RpdmF0aW9uOiBBY3RpdmF0aW9uRnVuY3Rpb24sXHJcbiAgICBvdXRwdXRBY3RpdmF0aW9uOiBBY3RpdmF0aW9uRnVuY3Rpb24sXHJcbiAgICByZWd1bGFyaXphdGlvbjogUmVndWxhcml6YXRpb25GdW5jdGlvbixcclxuICAgIGlucHV0SWRzOiBzdHJpbmdbXSwgaW5pdE9yaWdpbj86IGJvb2xlYW4pOiBOb2RlW11bXSB7XHJcbiAgbGV0IG51bUxheWVycyA9IG5ldHdvcmtTaGFwZS5sZW5ndGg7XHJcbiAgbGV0IGlkID0gMTtcclxuICAvKiogTGlzdCBvZiBsYXllcnMsIHdpdGggZWFjaCBsYXllciBiZWluZyBhIGxpc3Qgb2Ygbm9kZXMuICovXHJcbiAgbGV0IG5ldHdvcms6IE5vZGVbXVtdID0gW107XHJcbiAgZm9yIChsZXQgbGF5ZXJJZHggPSAwOyBsYXllcklkeCA8IG51bUxheWVyczsgbGF5ZXJJZHgrKykge1xyXG4gICAgbGV0IGlzT3V0cHV0TGF5ZXIgPSBsYXllcklkeCA9PT0gbnVtTGF5ZXJzIC0gMTtcclxuICAgIGxldCBpc0lucHV0TGF5ZXIgPSBsYXllcklkeCA9PT0gMDtcclxuICAgIGxldCBjdXJyZW50TGF5ZXI6IE5vZGVbXSA9IFtdO1xyXG4gICAgbmV0d29yay5wdXNoKGN1cnJlbnRMYXllcik7XHJcbiAgICBsZXQgbnVtTm9kZXMgPSBuZXR3b3JrU2hhcGVbbGF5ZXJJZHhdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1Ob2RlczsgaSsrKSB7XHJcbiAgICAgIGxldCBub2RlSWQgPSBpZC50b1N0cmluZygpO1xyXG4gICAgICBpZiAoaXNJbnB1dExheWVyKSB7XHJcbiAgICAgICAgbm9kZUlkID0gaW5wdXRJZHNbaV07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWQrKztcclxuICAgICAgfVxyXG4gICAgICBsZXQgbm9kZSA9IG5ldyBOb2RlKG5vZGVJZCxcclxuICAgICAgICAgIGlzT3V0cHV0TGF5ZXIgPyBvdXRwdXRBY3RpdmF0aW9uIDogYWN0aXZhdGlvbiwgaW5pdE9yaWdpbik7XHJcbiAgICAgIGN1cnJlbnRMYXllci5wdXNoKG5vZGUpO1xyXG4gICAgICBpZiAobGF5ZXJJZHggPj0gMSkge1xyXG4gICAgICAgIC8vIEFkZCBsaW5rcyBmcm9tIG5vZGVzIGluIHRoZSBwcmV2aW91cyBsYXllciB0byB0aGlzIG5vZGUuXHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuZXR3b3JrW2xheWVySWR4IC0gMV0ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgIGxldCBwcmV2Tm9kZSA9IG5ldHdvcmtbbGF5ZXJJZHggLSAxXVtqXTtcclxuICAgICAgICAgIGxldCBsaW5rID0gbmV3IExpbmsocHJldk5vZGUsIG5vZGUsIHJlZ3VsYXJpemF0aW9uLCBpbml0T3JpZ2luKTtcclxuICAgICAgICAgIHByZXZOb2RlLm91dHB1dHMucHVzaChsaW5rKTtcclxuICAgICAgICAgIG5vZGUuaW5wdXRMaW5rcy5wdXNoKGxpbmspO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbmV0d29yaztcclxufVxyXG5cclxuLyoqXHJcbiAqIFJ1bnMgYSBmb3J3YXJkIHByb3BhZ2F0aW9uIG9mIHRoZSBwcm92aWRlZCBpbnB1dCB0aHJvdWdoIHRoZSBwcm92aWRlZFxyXG4gKiBuZXR3b3JrLiBUaGlzIG1ldGhvZCBtb2RpZmllcyB0aGUgaW50ZXJuYWwgc3RhdGUgb2YgdGhlIG5ldHdvcmsgLSB0aGVcclxuICogdG90YWwgaW5wdXQgYW5kIG91dHB1dCBvZiBlYWNoIG5vZGUgaW4gdGhlIG5ldHdvcmsuXHJcbiAqXHJcbiAqIEBwYXJhbSBuZXR3b3JrIFRoZSBuZXVyYWwgbmV0d29yay5cclxuICogQHBhcmFtIGlucHV0cyBUaGUgaW5wdXQgYXJyYXkuIEl0cyBsZW5ndGggc2hvdWxkIG1hdGNoIHRoZSBudW1iZXIgb2YgaW5wdXRcclxuICogICAgIG5vZGVzIGluIHRoZSBuZXR3b3JrLlxyXG4gKiBAcmV0dXJuIFRoZSBmaW5hbCBvdXRwdXQgb2YgdGhlIG5ldHdvcmsuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZFByb3AobmV0d29yazogTm9kZVtdW10sIGlucHV0czogbnVtYmVyW10pOiBudW1iZXIge1xyXG4gIGxldCBpbnB1dExheWVyID0gbmV0d29ya1swXTtcclxuICBpZiAoaW5wdXRzLmxlbmd0aCAhPT0gaW5wdXRMYXllci5sZW5ndGgpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBudW1iZXIgb2YgaW5wdXRzIG11c3QgbWF0Y2ggdGhlIG51bWJlciBvZiBub2RlcyBpblwiICtcclxuICAgICAgICBcIiB0aGUgaW5wdXQgbGF5ZXJcIik7XHJcbiAgfVxyXG4gIC8vIFVwZGF0ZSB0aGUgaW5wdXQgbGF5ZXIuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dExheWVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgbm9kZSA9IGlucHV0TGF5ZXJbaV07XHJcbiAgICBub2RlLm91dHB1dCA9IGlucHV0c1tpXTtcclxuICB9XHJcbiAgZm9yIChsZXQgbGF5ZXJJZHggPSAxOyBsYXllcklkeCA8IG5ldHdvcmsubGVuZ3RoOyBsYXllcklkeCsrKSB7XHJcbiAgICBsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XHJcbiAgICAvLyBVcGRhdGUgYWxsIHRoZSBub2RlcyBpbiB0aGlzIGxheWVyLlxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XHJcbiAgICAgIG5vZGUudXBkYXRlT3V0cHV0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBuZXR3b3JrW25ldHdvcmsubGVuZ3RoIC0gMV1bMF0ub3V0cHV0O1xyXG59XHJcblxyXG4vKipcclxuICogUnVucyBhIGJhY2t3YXJkIHByb3BhZ2F0aW9uIHVzaW5nIHRoZSBwcm92aWRlZCB0YXJnZXQgYW5kIHRoZVxyXG4gKiBjb21wdXRlZCBvdXRwdXQgb2YgdGhlIHByZXZpb3VzIGNhbGwgdG8gZm9yd2FyZCBwcm9wYWdhdGlvbi5cclxuICogVGhpcyBtZXRob2QgbW9kaWZpZXMgdGhlIGludGVybmFsIHN0YXRlIG9mIHRoZSBuZXR3b3JrIC0gdGhlIGVycm9yXHJcbiAqIGRlcml2YXRpdmVzIHdpdGggcmVzcGVjdCB0byBlYWNoIG5vZGUsIGFuZCBlYWNoIHdlaWdodFxyXG4gKiBpbiB0aGUgbmV0d29yay5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBiYWNrUHJvcChuZXR3b3JrOiBOb2RlW11bXSwgdGFyZ2V0OiBudW1iZXIsXHJcbiAgICBlcnJvckZ1bmM6IEVycm9yRnVuY3Rpb24pOiB2b2lkIHtcclxuICAvLyBUaGUgb3V0cHV0IG5vZGUgaXMgYSBzcGVjaWFsIGNhc2UuIFdlIHVzZSB0aGUgdXNlci1kZWZpbmVkIGVycm9yXHJcbiAgLy8gZnVuY3Rpb24gZm9yIHRoZSBkZXJpdmF0aXZlLlxyXG4gIGxldCBvdXRwdXROb2RlID0gbmV0d29ya1tuZXR3b3JrLmxlbmd0aCAtIDFdWzBdO1xyXG4gIG91dHB1dE5vZGUub3V0cHV0RGVyID0gZXJyb3JGdW5jLmRlcihvdXRwdXROb2RlLm91dHB1dCwgdGFyZ2V0KTtcclxuXHJcbiAgLy8gR28gdGhyb3VnaCB0aGUgbGF5ZXJzIGJhY2t3YXJkcy5cclxuICBmb3IgKGxldCBsYXllcklkeCA9IG5ldHdvcmsubGVuZ3RoIC0gMTsgbGF5ZXJJZHggPj0gMTsgbGF5ZXJJZHgtLSkge1xyXG4gICAgbGV0IGN1cnJlbnRMYXllciA9IG5ldHdvcmtbbGF5ZXJJZHhdO1xyXG4gICAgLy8gQ29tcHV0ZSB0aGUgZXJyb3IgZGVyaXZhdGl2ZSBvZiBlYWNoIG5vZGUgd2l0aCByZXNwZWN0IHRvOlxyXG4gICAgLy8gMSkgaXRzIHRvdGFsIGlucHV0XHJcbiAgICAvLyAyKSBlYWNoIG9mIGl0cyBpbnB1dCB3ZWlnaHRzLlxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XHJcbiAgICAgIG5vZGUuaW5wdXREZXIgPSBub2RlLm91dHB1dERlciAqIG5vZGUuYWN0aXZhdGlvbi5kZXIobm9kZS50b3RhbElucHV0KTtcclxuICAgICAgbm9kZS5hY2NJbnB1dERlciArPSBub2RlLmlucHV0RGVyO1xyXG4gICAgICBub2RlLm51bUFjY3VtdWxhdGVkRGVycysrO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEVycm9yIGRlcml2YXRpdmUgd2l0aCByZXNwZWN0IHRvIGVhY2ggd2VpZ2h0IGNvbWluZyBpbnRvIHRoZSBub2RlLlxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50TGF5ZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbGV0IG5vZGUgPSBjdXJyZW50TGF5ZXJbaV07XHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5pbnB1dExpbmtzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgbGV0IGxpbmsgPSBub2RlLmlucHV0TGlua3Nbal07XHJcbiAgICAgICAgaWYgKGxpbmsuaXNEZWFkKSB7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGluay5lcnJvckRlciA9IG5vZGUuaW5wdXREZXIgKiBsaW5rLnNvdXJjZS5vdXRwdXQ7XHJcbiAgICAgICAgbGluay5hY2NFcnJvckRlciArPSBsaW5rLmVycm9yRGVyO1xyXG4gICAgICAgIGxpbmsubnVtQWNjdW11bGF0ZWREZXJzKys7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChsYXllcklkeCA9PT0gMSkge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuICAgIGxldCBwcmV2TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4IC0gMV07XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZXZMYXllci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgbm9kZSA9IHByZXZMYXllcltpXTtcclxuICAgICAgLy8gQ29tcHV0ZSB0aGUgZXJyb3IgZGVyaXZhdGl2ZSB3aXRoIHJlc3BlY3QgdG8gZWFjaCBub2RlJ3Mgb3V0cHV0LlxyXG4gICAgICBub2RlLm91dHB1dERlciA9IDA7XHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5vdXRwdXRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgbGV0IG91dHB1dCA9IG5vZGUub3V0cHV0c1tqXTtcclxuICAgICAgICBub2RlLm91dHB1dERlciArPSBvdXRwdXQud2VpZ2h0ICogb3V0cHV0LmRlc3QuaW5wdXREZXI7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGVzIHRoZSB3ZWlnaHRzIG9mIHRoZSBuZXR3b3JrIHVzaW5nIHRoZSBwcmV2aW91c2x5IGFjY3VtdWxhdGVkIGVycm9yXHJcbiAqIGRlcml2YXRpdmVzLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVdlaWdodHMobmV0d29yazogTm9kZVtdW10sIGxlYXJuaW5nUmF0ZTogbnVtYmVyLFxyXG4gICAgcmVndWxhcml6YXRpb25SYXRlOiBudW1iZXIpIHtcclxuICBmb3IgKGxldCBsYXllcklkeCA9IDE7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGg7IGxheWVySWR4KyspIHtcclxuICAgIGxldCBjdXJyZW50TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4XTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xyXG4gICAgICAvLyBVcGRhdGUgdGhlIG5vZGUncyBiaWFzLlxyXG4gICAgICBpZiAobm9kZS5udW1BY2N1bXVsYXRlZERlcnMgPiAwKSB7XHJcbiAgICAgICAgbm9kZS5iaWFzIC09IGxlYXJuaW5nUmF0ZSAqIG5vZGUuYWNjSW5wdXREZXIgLyBub2RlLm51bUFjY3VtdWxhdGVkRGVycztcclxuICAgICAgICBub2RlLmFjY0lucHV0RGVyID0gMDtcclxuICAgICAgICBub2RlLm51bUFjY3VtdWxhdGVkRGVycyA9IDA7XHJcbiAgICAgIH1cclxuICAgICAgLy8gVXBkYXRlIHRoZSB3ZWlnaHRzIGNvbWluZyBpbnRvIHRoaXMgbm9kZS5cclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBub2RlLmlucHV0TGlua3MubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICBsZXQgbGluayA9IG5vZGUuaW5wdXRMaW5rc1tqXTtcclxuICAgICAgICBpZiAobGluay5pc0RlYWQpIHtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcmVndWxEZXIgPSBsaW5rLnJlZ3VsYXJpemF0aW9uID9cclxuICAgICAgICAgICAgbGluay5yZWd1bGFyaXphdGlvbi5kZXIobGluay53ZWlnaHQpIDogMDtcclxuICAgICAgICBpZiAobGluay5udW1BY2N1bXVsYXRlZERlcnMgPiAwKSB7XHJcbiAgICAgICAgICAvLyBVcGRhdGUgdGhlIHdlaWdodCBiYXNlZCBvbiBkRS9kdy5cclxuICAgICAgICAgIGxpbmsud2VpZ2h0ID0gbGluay53ZWlnaHQgLVxyXG4gICAgICAgICAgICAgIChsZWFybmluZ1JhdGUgLyBsaW5rLm51bUFjY3VtdWxhdGVkRGVycykgKiBsaW5rLmFjY0Vycm9yRGVyO1xyXG4gICAgICAgICAgLy8gRnVydGhlciB1cGRhdGUgdGhlIHdlaWdodCBiYXNlZCBvbiByZWd1bGFyaXphdGlvbi5cclxuICAgICAgICAgIGxldCBuZXdMaW5rV2VpZ2h0ID0gbGluay53ZWlnaHQgLVxyXG4gICAgICAgICAgICAgIChsZWFybmluZ1JhdGUgKiByZWd1bGFyaXphdGlvblJhdGUpICogcmVndWxEZXI7XHJcbiAgICAgICAgICBpZiAobGluay5yZWd1bGFyaXphdGlvbiA9PT0gUmVndWxhcml6YXRpb25GdW5jdGlvbi5MMSAmJlxyXG4gICAgICAgICAgICAgIGxpbmsud2VpZ2h0ICogbmV3TGlua1dlaWdodCA8IDApIHtcclxuICAgICAgICAgICAgLy8gVGhlIHdlaWdodCBjcm9zc2VkIDAgZHVlIHRvIHRoZSByZWd1bGFyaXphdGlvbiB0ZXJtLiBTZXQgaXQgdG8gMC5cclxuICAgICAgICAgICAgbGluay53ZWlnaHQgPSAwO1xyXG4gICAgICAgICAgICBsaW5rLmlzRGVhZCA9IHRydWU7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsaW5rLndlaWdodCA9IG5ld0xpbmtXZWlnaHQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBsaW5rLmFjY0Vycm9yRGVyID0gMDtcclxuICAgICAgICAgIGxpbmsubnVtQWNjdW11bGF0ZWREZXJzID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKiBJdGVyYXRlcyBvdmVyIGV2ZXJ5IG5vZGUgaW4gdGhlIG5ldHdvcmsvICovXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JFYWNoTm9kZShuZXR3b3JrOiBOb2RlW11bXSwgaWdub3JlSW5wdXRzOiBib29sZWFuLFxyXG4gICAgYWNjZXNzb3I6IChub2RlOiBOb2RlKSA9PiBhbnkpIHtcclxuICBmb3IgKGxldCBsYXllcklkeCA9IGlnbm9yZUlucHV0cyA/IDEgOiAwO1xyXG4gICAgICBsYXllcklkeCA8IG5ldHdvcmsubGVuZ3RoO1xyXG4gICAgICBsYXllcklkeCsrKSB7XHJcbiAgICBsZXQgY3VycmVudExheWVyID0gbmV0d29ya1tsYXllcklkeF07XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRMYXllci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcclxuICAgICAgYWNjZXNzb3Iobm9kZSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKiogUmV0dXJucyB0aGUgb3V0cHV0IG5vZGUgaW4gdGhlIG5ldHdvcmsuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRPdXRwdXROb2RlKG5ldHdvcms6IE5vZGVbXVtdKSB7XHJcbiAgcmV0dXJuIG5ldHdvcmtbbmV0d29yay5sZW5ndGggLSAxXVswXTtcclxufVxyXG4iLCIvKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxyXG5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuXHJcbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbmltcG9ydCAqIGFzIG5uIGZyb20gXCIuL25uXCI7XHJcbmltcG9ydCB7SGVhdE1hcCwgcmVkdWNlTWF0cml4fSBmcm9tIFwiLi9oZWF0bWFwXCI7XHJcbmltcG9ydCB7XHJcbiAgU3RhdGUsXHJcbiAgZGF0YXNldHMsXHJcbiAgcmVnRGF0YXNldHMsXHJcbiAgYWN0aXZhdGlvbnMsXHJcbiAgcHJvYmxlbXMsXHJcbiAgcmVndWxhcml6YXRpb25zLFxyXG4gIGdldEtleUZyb21WYWx1ZSxcclxuICBQcm9ibGVtXHJcbn0gZnJvbSBcIi4vc3RhdGVcIjtcclxuaW1wb3J0IHtFeGFtcGxlMkQsIHNodWZmbGV9IGZyb20gXCIuL2RhdGFzZXRcIjtcclxuaW1wb3J0IHtBcHBlbmRpbmdMaW5lQ2hhcnR9IGZyb20gXCIuL2xpbmVjaGFydFwiO1xyXG5cclxubGV0IG1haW5XaWR0aDtcclxuXHJcbi8vIE1vcmUgc2Nyb2xsaW5nXHJcbmQzLnNlbGVjdChcIi5tb3JlIGJ1dHRvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gIGxldCBwb3NpdGlvbiA9IDgwMDtcclxuICBkMy50cmFuc2l0aW9uKClcclxuICAgIC5kdXJhdGlvbigxMDAwKVxyXG4gICAgLnR3ZWVuKFwic2Nyb2xsXCIsIHNjcm9sbFR3ZWVuKHBvc2l0aW9uKSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gc2Nyb2xsVHdlZW4ob2Zmc2V0KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGkgPSBkMy5pbnRlcnBvbGF0ZU51bWJlcih3aW5kb3cucGFnZVlPZmZzZXQgfHxcclxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wLCBvZmZzZXQpO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHsgc2Nyb2xsVG8oMCwgaSh0KSk7IH07XHJcbiAgfTtcclxufVxyXG5cclxuY29uc3QgUkVDVF9TSVpFID0gMzA7XHJcbmNvbnN0IEJJQVNfU0laRSA9IDU7XHJcbmNvbnN0IE5VTV9TQU1QTEVTX0NMQVNTSUZZID0gNTAwO1xyXG5jb25zdCBOVU1fU0FNUExFU19SRUdSRVNTID0gMTIwMDtcclxuY29uc3QgREVOU0lUWSA9IDEwMDtcclxuXHJcbmVudW0gSG92ZXJUeXBlIHtcclxuICBCSUFTLCBXRUlHSFRcclxufVxyXG5cclxuaW50ZXJmYWNlIElucHV0RmVhdHVyZSB7XHJcbiAgZjogKHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiBudW1iZXI7XHJcbiAgbGFiZWw/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmxldCBJTlBVVFM6IHtbbmFtZTogc3RyaW5nXTogSW5wdXRGZWF0dXJlfSA9IHtcclxuICBcInhcIjoge2Y6ICh4LCB5KSA9PiB4LCBsYWJlbDogXCJYXzFcIn0sXHJcbiAgXCJ5XCI6IHtmOiAoeCwgeSkgPT4geSwgbGFiZWw6IFwiWF8yXCJ9LFxyXG4gIFwieFNxdWFyZWRcIjoge2Y6ICh4LCB5KSA9PiB4ICogeCwgbGFiZWw6IFwiWF8xXjJcIn0sXHJcbiAgXCJ5U3F1YXJlZFwiOiB7ZjogKHgsIHkpID0+IHkgKiB5LCAgbGFiZWw6IFwiWF8yXjJcIn0sXHJcbiAgXCJ4VGltZXNZXCI6IHtmOiAoeCwgeSkgPT4geCAqIHksIGxhYmVsOiBcIlhfMVhfMlwifSxcclxuICBcInNpblhcIjoge2Y6ICh4LCB5KSA9PiBNYXRoLnNpbih4KSwgbGFiZWw6IFwic2luKFhfMSlcIn0sXHJcbiAgXCJzaW5ZXCI6IHtmOiAoeCwgeSkgPT4gTWF0aC5zaW4oeSksIGxhYmVsOiBcInNpbihYXzIpXCJ9LFxyXG59O1xyXG5cclxubGV0IEhJREFCTEVfQ09OVFJPTFMgPSBbXHJcbiAgW1wi4piRIOiok+e3tOODh+ODvOOCv+ihqOekulwiLCBcInNob3dUcmFpbkRhdGFcIl0sXHJcbiAgW1wi4piRIOeyvuW6puaknOiovOODh+ODvOOCv+ihqOekulwiLCBcInNob3dWYWxpZGF0aW9uRGF0YVwiXSxcclxuICBbXCLimJEg44OG44K544OI44OH44O844K/6KGo56S6XCIsIFwic2hvd1Rlc3REYXRhXCJdLFxyXG4gIFtcIuKYkSDlh7rlipvjga7pm6LmlaPljJZcIiwgXCJkaXNjcmV0aXplXCJdLFxyXG4gIFtcIuODhuOCueODiCDjg5zjgr/jg7NcIiwgXCJ0ZXN0QnV0dG9uXCJdLFxyXG4gIFtcIuWGjeeUnyDjg5zjgr/jg7NcIiwgXCJwbGF5QnV0dG9uXCJdLFxyXG4gIFtcIuOCueODhuODg+ODlyDjg5zjgr/jg7NcIiwgXCJzdGVwQnV0dG9uXCJdLFxyXG4gIFtcIuODquOCu+ODg+ODiCDjg5zjgr/jg7NcIiwgXCJyZXNldEJ1dHRvblwiXSxcclxuICBbXCLlrabnv5LnjodcIiwgXCJsZWFybmluZ1JhdGVcIl0sXHJcbiAgW1wi5rS75oCn5YyW6Zai5pWwXCIsIFwiYWN0aXZhdGlvblwiXSxcclxuICBbXCLmraPliYfljJZcIiwgXCJyZWd1bGFyaXphdGlvblwiXSxcclxuICBbXCLmraPliYfljJbnjodcIiwgXCJyZWd1bGFyaXphdGlvblJhdGVcIl0sXHJcbiAgW1wi5ZWP6aGM56iu5YilXCIsIFwicHJvYmxlbVwiXSxcclxuICBbXCLjg4fjg7zjgr/jgrvjg4Pjg4jjga7pgbjmip5cIiwgXCJkYXRhc2V0XCJdLFxyXG4gIFtcIuiok+e3tOODh+ODvOOCv+OBruWJsuWQiFwiLCBcInBlcmNUcmFpbkRhdGFcIl0sXHJcbiAgW1wi44OO44Kk44K6IOODrOODmeODq1wiLCBcIm5vaXNlXCJdLFxyXG4gIFtcIuODkOODg+ODgSDjgrXjgqTjgrpcIiwgXCJiYXRjaFNpemVcIl0sXHJcbiAgW1wi6Zqg44KM5bGkIOKKleKKliDjg5zjgr/jg7NcIiwgXCJudW1IaWRkZW5MYXllcnNcIl1cclxuXTtcclxuXHJcbmNsYXNzIFBsYXllciB7XHJcbiAgcHJpdmF0ZSB0aW1lckluZGV4ID0gMDtcclxuICBwcml2YXRlIGlzUGxheWluZyA9IGZhbHNlO1xyXG4gIHByaXZhdGUgY2FsbGJhY2s6IChpc1BsYXlpbmc6IGJvb2xlYW4pID0+IHZvaWQgPSBudWxsO1xyXG5cclxuICAvKiogUGxheXMvcGF1c2VzIHRoZSBwbGF5ZXIuICovXHJcbiAgcGxheU9yUGF1c2UoKSB7XHJcbiAgICBpZiAodGhpcy5pc1BsYXlpbmcpIHtcclxuICAgICAgdGhpcy5pc1BsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgdGhpcy5wYXVzZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5pc1BsYXlpbmcgPSB0cnVlO1xyXG4gICAgICBpZiAoaXRlciA9PT0gMCkge1xyXG4gICAgICAgIHNpbXVsYXRpb25TdGFydGVkKCk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5wbGF5KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvblBsYXlQYXVzZShjYWxsYmFjazogKGlzUGxheWluZzogYm9vbGVhbikgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gIH1cclxuXHJcbiAgcGxheSgpIHtcclxuICAgIHRoaXMucGF1c2UoKTtcclxuICAgIHRoaXMuaXNQbGF5aW5nID0gdHJ1ZTtcclxuICAgIGlmICh0aGlzLmNhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuY2FsbGJhY2sodGhpcy5pc1BsYXlpbmcpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zdGFydCh0aGlzLnRpbWVySW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgcGF1c2UoKSB7XHJcbiAgICB0aGlzLnRpbWVySW5kZXgrKztcclxuICAgIHRoaXMuaXNQbGF5aW5nID0gZmFsc2U7XHJcbiAgICBpZiAodGhpcy5jYWxsYmFjaykge1xyXG4gICAgICB0aGlzLmNhbGxiYWNrKHRoaXMuaXNQbGF5aW5nKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RhcnQobG9jYWxUaW1lckluZGV4OiBudW1iZXIpIHtcclxuICAgIGQzLnRpbWVyKCgpID0+IHtcclxuICAgICAgaWYgKGxvY2FsVGltZXJJbmRleCA8IHRoaXMudGltZXJJbmRleCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlOyAgLy8gRG9uZS5cclxuICAgICAgfVxyXG4gICAgICBvbmVTdGVwKCk7XHJcbiAgICAgIHJldHVybiBmYWxzZTsgIC8vIE5vdCBkb25lLlxyXG4gICAgfSwgMCk7XHJcbiAgfVxyXG59XHJcblxyXG5sZXQgc3RhdGUgPSBTdGF0ZS5kZXNlcmlhbGl6ZVN0YXRlKCk7XHJcblxyXG4vLyBGaWx0ZXIgb3V0IGlucHV0cyB0aGF0IGFyZSBoaWRkZW4uXHJcbnN0YXRlLmdldEhpZGRlblByb3BzKCkuZm9yRWFjaChwcm9wID0+IHtcclxuICBpZiAocHJvcCBpbiBJTlBVVFMpIHtcclxuICAgIGRlbGV0ZSBJTlBVVFNbcHJvcF07XHJcbiAgfVxyXG59KTtcclxuXHJcbmxldCBib3VuZGFyeToge1tpZDogc3RyaW5nXTogbnVtYmVyW11bXX0gPSB7fTtcclxubGV0IHNlbGVjdGVkTm9kZUlkOiBzdHJpbmcgPSBudWxsO1xyXG4vLyBQbG90IHRoZSBoZWF0bWFwLlxyXG5sZXQgeERvbWFpbjogW251bWJlciwgbnVtYmVyXSA9IFstNiwgNl07XHJcbmxldCBoZWF0TWFwID1cclxuICAgIG5ldyBIZWF0TWFwKDMwMCwgREVOU0lUWSwgeERvbWFpbiwgeERvbWFpbiwgZDMuc2VsZWN0KFwiI2hlYXRtYXBcIiksXHJcbiAgICAgICAge3Nob3dBeGVzOiB0cnVlfSk7XHJcbmxldCBsaW5rV2lkdGhTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXHJcbiAgLmRvbWFpbihbMCwgNV0pXHJcbiAgLnJhbmdlKFsxLCAxMF0pXHJcbiAgLmNsYW1wKHRydWUpO1xyXG5sZXQgY29sb3JTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcjxzdHJpbmc+KClcclxuICAgICAgICAgICAgICAgICAgICAgLmRvbWFpbihbLTEsIDAsIDFdKVxyXG4gICAgICAgICAgICAgICAgICAgICAucmFuZ2UoW1wiI2Y1OTMyMlwiLCBcIiNlOGVhZWJcIiwgXCIjMDg3N2JkXCJdKVxyXG4gICAgICAgICAgICAgICAgICAgICAuY2xhbXAodHJ1ZSk7XHJcbmxldCBpdGVyID0gMDtcclxubGV0IHRyYWluRGF0YTogRXhhbXBsZTJEW10gPSBbXTtcclxubGV0IHZhbGlkYXRpb25EYXRhOiBFeGFtcGxlMkRbXSA9IFtdO1xyXG5sZXQgdGVzdERhdGE6IEV4YW1wbGUyRFtdID0gW107XHJcbmxldCBuZXR3b3JrOiBubi5Ob2RlW11bXSA9IG51bGw7XHJcbmxldCBsb3NzVHJhaW4gPSAwO1xyXG5sZXQgbG9zc1ZhbGlkYXRpb24gPSAwO1xyXG5sZXQgYWNjVHJhaW4gPSAwO1xyXG5sZXQgYWNjVmFsaWRhdGlvbiA9IDA7XHJcbmxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKCk7XHJcbmxldCBsaW5lQ2hhcnQgPSBuZXcgQXBwZW5kaW5nTGluZUNoYXJ0KGQzLnNlbGVjdChcIiNsaW5lY2hhcnRcIiksXHJcbiAgICBbXCIjNzc3XCIsIFwiYmxhY2tcIl0pO1xyXG5cclxuZnVuY3Rpb24gbWFrZUdVSSgpIHtcclxuICBkMy5zZWxlY3QoXCIjcmVzZXQtYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgcmVzZXQoKTtcclxuICAgIHVzZXJIYXNJbnRlcmFjdGVkKCk7XHJcbiAgICBkMy5zZWxlY3QoXCIjcGxheS1wYXVzZS1idXR0b25cIik7XHJcbiAgfSk7XHJcblxyXG4gIGQzLnNlbGVjdChcIiNwbGF5LXBhdXNlLWJ1dHRvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIENoYW5nZSB0aGUgYnV0dG9uJ3MgY29udGVudC5cclxuICAgIHVzZXJIYXNJbnRlcmFjdGVkKCk7XHJcbiAgICBwbGF5ZXIucGxheU9yUGF1c2UoKTtcclxuICB9KTtcclxuXHJcbiAgcGxheWVyLm9uUGxheVBhdXNlKGlzUGxheWluZyA9PiB7XHJcbiAgICBkMy5zZWxlY3QoXCIjcGxheS1wYXVzZS1idXR0b25cIikuY2xhc3NlZChcInBsYXlpbmdcIiwgaXNQbGF5aW5nKTtcclxuICB9KTtcclxuXHJcbiAgZDMuc2VsZWN0KFwiI25leHQtc3RlcC1idXR0b25cIikub24oXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICBwbGF5ZXIucGF1c2UoKTtcclxuICAgIHVzZXJIYXNJbnRlcmFjdGVkKCk7XHJcbiAgICBpZiAoaXRlciA9PT0gMCkge1xyXG4gICAgICBzaW11bGF0aW9uU3RhcnRlZCgpO1xyXG4gICAgfVxyXG4gICAgb25lU3RlcCgpO1xyXG4gIH0pO1xyXG5cclxuICBkMy5zZWxlY3QoXCIjZGF0YS1yZWdlbi1idXR0b25cIikub24oXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICBnZW5lcmF0ZURhdGEoKTtcclxuICAgIHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcclxuICB9KTtcclxuXHJcbiAgbGV0IGRhdGFUaHVtYm5haWxzID0gZDMuc2VsZWN0QWxsKFwiY2FudmFzW2RhdGEtZGF0YXNldF1cIik7XHJcbiAgZGF0YVRodW1ibmFpbHMub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBuZXdEYXRhc2V0ID0gZGF0YXNldHNbdGhpcy5kYXRhc2V0LmRhdGFzZXRdO1xyXG4gICAgaWYgKG5ld0RhdGFzZXQgPT09IHN0YXRlLmRhdGFzZXQpIHtcclxuICAgICAgcmV0dXJuOyAvLyBOby1vcC5cclxuICAgIH1cclxuICAgIHN0YXRlLmRhdGFzZXQgPSAgbmV3RGF0YXNldDtcclxuICAgIGRhdGFUaHVtYm5haWxzLmNsYXNzZWQoXCJzZWxlY3RlZFwiLCBmYWxzZSk7XHJcbiAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZChcInNlbGVjdGVkXCIsIHRydWUpO1xyXG4gICAgZ2VuZXJhdGVEYXRhKCk7XHJcbiAgICBwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XHJcbiAgICByZXNldCgpO1xyXG4gIH0pO1xyXG5cclxuICBsZXQgZGF0YXNldEtleSA9IGdldEtleUZyb21WYWx1ZShkYXRhc2V0cywgc3RhdGUuZGF0YXNldCk7XHJcbiAgLy8gU2VsZWN0IHRoZSBkYXRhc2V0IGFjY29yZGluZyB0byB0aGUgY3VycmVudCBzdGF0ZS5cclxuICBkMy5zZWxlY3QoYGNhbnZhc1tkYXRhLWRhdGFzZXQ9JHtkYXRhc2V0S2V5fV1gKVxyXG4gICAgLmNsYXNzZWQoXCJzZWxlY3RlZFwiLCB0cnVlKTtcclxuXHJcbiAgbGV0IHJlZ0RhdGFUaHVtYm5haWxzID0gZDMuc2VsZWN0QWxsKFwiY2FudmFzW2RhdGEtcmVnRGF0YXNldF1cIik7XHJcbiAgcmVnRGF0YVRodW1ibmFpbHMub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBuZXdEYXRhc2V0ID0gcmVnRGF0YXNldHNbdGhpcy5kYXRhc2V0LnJlZ2RhdGFzZXRdO1xyXG4gICAgaWYgKG5ld0RhdGFzZXQgPT09IHN0YXRlLnJlZ0RhdGFzZXQpIHtcclxuICAgICAgcmV0dXJuOyAvLyBOby1vcC5cclxuICAgIH1cclxuICAgIHN0YXRlLnJlZ0RhdGFzZXQgPSAgbmV3RGF0YXNldDtcclxuICAgIHJlZ0RhdGFUaHVtYm5haWxzLmNsYXNzZWQoXCJzZWxlY3RlZFwiLCBmYWxzZSk7XHJcbiAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZChcInNlbGVjdGVkXCIsIHRydWUpO1xyXG4gICAgZ2VuZXJhdGVEYXRhKCk7XHJcbiAgICBwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XHJcbiAgICByZXNldCgpO1xyXG4gIH0pO1xyXG5cclxuICBsZXQgcmVnRGF0YXNldEtleSA9IGdldEtleUZyb21WYWx1ZShyZWdEYXRhc2V0cywgc3RhdGUucmVnRGF0YXNldCk7XHJcbiAgLy8gU2VsZWN0IHRoZSBkYXRhc2V0IGFjY29yZGluZyB0byB0aGUgY3VycmVudCBzdGF0ZS5cclxuICBkMy5zZWxlY3QoYGNhbnZhc1tkYXRhLXJlZ0RhdGFzZXQ9JHtyZWdEYXRhc2V0S2V5fV1gKVxyXG4gICAgLmNsYXNzZWQoXCJzZWxlY3RlZFwiLCB0cnVlKTtcclxuXHJcbiAgZDMuc2VsZWN0KFwiI2FkZC1sYXllcnNcIikub24oXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICBpZiAoc3RhdGUubnVtSGlkZGVuTGF5ZXJzID49IDYpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgc3RhdGUubmV0d29ya1NoYXBlW3N0YXRlLm51bUhpZGRlbkxheWVyc10gPSAyO1xyXG4gICAgc3RhdGUubnVtSGlkZGVuTGF5ZXJzKys7XHJcbiAgICBwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XHJcbiAgICByZXNldCgpO1xyXG4gIH0pO1xyXG5cclxuICBkMy5zZWxlY3QoXCIjcmVtb3ZlLWxheWVyc1wiKS5vbihcImNsaWNrXCIsICgpID0+IHtcclxuICAgIGlmIChzdGF0ZS5udW1IaWRkZW5MYXllcnMgPD0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBzdGF0ZS5udW1IaWRkZW5MYXllcnMtLTtcclxuICAgIHN0YXRlLm5ldHdvcmtTaGFwZS5zcGxpY2Uoc3RhdGUubnVtSGlkZGVuTGF5ZXJzKTtcclxuICAgIHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcclxuICAgIHJlc2V0KCk7XHJcbiAgfSk7XHJcblxyXG4gIGxldCBzaG93VHJhaW5EYXRhID0gZDMuc2VsZWN0KFwiI3Nob3ctdHJhaW4tZGF0YVwiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcclxuICAgIHN0YXRlLnNob3dUcmFpbkRhdGEgPSB0aGlzLmNoZWNrZWQ7XHJcbiAgICBzdGF0ZS5zZXJpYWxpemUoKTtcclxuICAgIHVzZXJIYXNJbnRlcmFjdGVkKCk7XHJcbiAgICBoZWF0TWFwLnVwZGF0ZVRyYWluUG9pbnRzKHN0YXRlLnNob3dUcmFpbkRhdGEgPyB0cmFpbkRhdGEgOiBbXSk7XHJcbiAgfSk7XHJcbiAgLy8gQ2hlY2svdW5jaGVjayB0aGUgY2hlY2tib3ggYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHN0YXRlLlxyXG4gIHNob3dUcmFpbkRhdGEucHJvcGVydHkoXCJjaGVja2VkXCIsIHN0YXRlLnNob3dUcmFpbkRhdGEpO1xyXG5cclxuICBsZXQgc2hvd1ZhbGlkYXRpb25EYXRhID0gZDMuc2VsZWN0KFwiI3Nob3ctdmFsaWRhdGlvbi1kYXRhXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgc3RhdGUuc2hvd1ZhbGlkYXRpb25EYXRhID0gdGhpcy5jaGVja2VkO1xyXG4gICAgc3RhdGUuc2VyaWFsaXplKCk7XHJcbiAgICB1c2VySGFzSW50ZXJhY3RlZCgpO1xyXG4gICAgaGVhdE1hcC51cGRhdGVWYWxpZGF0aW9uUG9pbnRzKHN0YXRlLnNob3dWYWxpZGF0aW9uRGF0YSA/IHZhbGlkYXRpb25EYXRhIDogW10pO1xyXG4gIH0pO1xyXG4gIC8vIENoZWNrL3VuY2hlY2sgdGhlIGNoZWNrYm94IGFjY29yZGluZyB0byB0aGUgY3VycmVudCBzdGF0ZS5cclxuICBzaG93VmFsaWRhdGlvbkRhdGEucHJvcGVydHkoXCJjaGVja2VkXCIsIHN0YXRlLnNob3dWYWxpZGF0aW9uRGF0YSk7XHJcblxyXG4gIGxldCBzaG93VGVzdERhdGEgPSBkMy5zZWxlY3QoXCIjc2hvdy10ZXN0LWRhdGFcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBzdGF0ZS5zaG93VGVzdERhdGEgPSB0aGlzLmNoZWNrZWQ7XHJcbiAgICBzdGF0ZS5zZXJpYWxpemUoKTtcclxuICAgIHVzZXJIYXNJbnRlcmFjdGVkKCk7XHJcbiAgICBoZWF0TWFwLnVwZGF0ZVRlc3RQb2ludHMoc3RhdGUuc2hvd1Rlc3REYXRhID8gdGVzdERhdGEgOiBbXSk7XHJcbiAgfSk7XHJcbiAgLy8gQ2hlY2svdW5jaGVjayB0aGUgY2hlY2tib3ggYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHN0YXRlLlxyXG4gIHNob3dUZXN0RGF0YS5wcm9wZXJ0eShcImNoZWNrZWRcIiwgc3RhdGUuc2hvd1Rlc3REYXRhKTtcclxuXHJcbiAgbGV0IGRpc2NyZXRpemUgPSBkMy5zZWxlY3QoXCIjZGlzY3JldGl6ZVwiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcclxuICAgIHN0YXRlLmRpc2NyZXRpemUgPSB0aGlzLmNoZWNrZWQ7XHJcbiAgICBzdGF0ZS5zZXJpYWxpemUoKTtcclxuICAgIHVzZXJIYXNJbnRlcmFjdGVkKCk7XHJcbiAgICB1cGRhdGVVSSgpO1xyXG4gIH0pO1xyXG4gIC8vIENoZWNrL3VuY2hlY2sgdGhlIGNoZWNib3ggYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHN0YXRlLlxyXG4gIGRpc2NyZXRpemUucHJvcGVydHkoXCJjaGVja2VkXCIsIHN0YXRlLmRpc2NyZXRpemUpO1xyXG5cclxuICBsZXQgcGVyY1RyYWluID0gZDMuc2VsZWN0KFwiI3BlcmNUcmFpbkRhdGFcIikub24oXCJpbnB1dFwiLCBmdW5jdGlvbigpIHtcclxuICAgIHN0YXRlLnBlcmNUcmFpbkRhdGEgPSB0aGlzLnZhbHVlO1xyXG4gICAgZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdwZXJjVHJhaW5EYXRhJ10gLnZhbHVlXCIpLnRleHQodGhpcy52YWx1ZSk7XHJcbiAgICBnZW5lcmF0ZURhdGEoKTtcclxuICAgIHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcclxuICAgIHJlc2V0KCk7XHJcbiAgfSk7XHJcbiAgcGVyY1RyYWluLnByb3BlcnR5KFwidmFsdWVcIiwgc3RhdGUucGVyY1RyYWluRGF0YSk7XHJcbiAgZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdwZXJjVHJhaW5EYXRhJ10gLnZhbHVlXCIpLnRleHQoc3RhdGUucGVyY1RyYWluRGF0YSk7XHJcblxyXG4gIGxldCBub2lzZSA9IGQzLnNlbGVjdChcIiNub2lzZVwiKS5vbihcImlucHV0XCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgc3RhdGUubm9pc2UgPSB0aGlzLnZhbHVlO1xyXG4gICAgZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdub2lzZSddIC52YWx1ZVwiKS50ZXh0KHRoaXMudmFsdWUpO1xyXG4gICAgZ2VuZXJhdGVEYXRhKCk7XHJcbiAgICBwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XHJcbiAgICByZXNldCgpO1xyXG4gIH0pO1xyXG4gIGxldCBjdXJyZW50TWF4ID0gcGFyc2VJbnQobm9pc2UucHJvcGVydHkoXCJtYXhcIikpO1xyXG4gIGlmIChzdGF0ZS5ub2lzZSA+IGN1cnJlbnRNYXgpIHtcclxuICAgIGlmIChzdGF0ZS5ub2lzZSA8PSA4MCkge1xyXG4gICAgICBub2lzZS5wcm9wZXJ0eShcIm1heFwiLCBzdGF0ZS5ub2lzZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdGF0ZS5ub2lzZSA9IDUwO1xyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoc3RhdGUubm9pc2UgPCAwKSB7XHJcbiAgICBzdGF0ZS5ub2lzZSA9IDA7XHJcbiAgfVxyXG4gIG5vaXNlLnByb3BlcnR5KFwidmFsdWVcIiwgc3RhdGUubm9pc2UpO1xyXG4gIGQzLnNlbGVjdChcImxhYmVsW2Zvcj0nbm9pc2UnXSAudmFsdWVcIikudGV4dChzdGF0ZS5ub2lzZSk7XHJcblxyXG4gIGxldCBiYXRjaFNpemUgPSBkMy5zZWxlY3QoXCIjYmF0Y2hTaXplXCIpLm9uKFwiaW5wdXRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBzdGF0ZS5iYXRjaFNpemUgPSB0aGlzLnZhbHVlO1xyXG4gICAgZDMuc2VsZWN0KFwibGFiZWxbZm9yPSdiYXRjaFNpemUnXSAudmFsdWVcIikudGV4dCh0aGlzLnZhbHVlKTtcclxuICAgIHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcclxuICAgIHJlc2V0KCk7XHJcbiAgfSk7XHJcbiAgYmF0Y2hTaXplLnByb3BlcnR5KFwidmFsdWVcIiwgc3RhdGUuYmF0Y2hTaXplKTtcclxuICBkMy5zZWxlY3QoXCJsYWJlbFtmb3I9J2JhdGNoU2l6ZSddIC52YWx1ZVwiKS50ZXh0KHN0YXRlLmJhdGNoU2l6ZSk7XHJcblxyXG4gIGxldCBhY3RpdmF0aW9uRHJvcGRvd24gPSBkMy5zZWxlY3QoXCIjYWN0aXZhdGlvbnNcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBzdGF0ZS5hY3RpdmF0aW9uID0gYWN0aXZhdGlvbnNbdGhpcy52YWx1ZV07XHJcbiAgICBwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XHJcbiAgICByZXNldCgpO1xyXG4gIH0pO1xyXG4gIGFjdGl2YXRpb25Ecm9wZG93bi5wcm9wZXJ0eShcInZhbHVlXCIsXHJcbiAgICAgIGdldEtleUZyb21WYWx1ZShhY3RpdmF0aW9ucywgc3RhdGUuYWN0aXZhdGlvbikpO1xyXG5cclxuICBsZXQgbGVhcm5pbmdSYXRlID0gZDMuc2VsZWN0KFwiI2xlYXJuaW5nUmF0ZVwiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcclxuICAgIHN0YXRlLmxlYXJuaW5nUmF0ZSA9ICt0aGlzLnZhbHVlO1xyXG4gICAgc3RhdGUuc2VyaWFsaXplKCk7XHJcbiAgICB1c2VySGFzSW50ZXJhY3RlZCgpO1xyXG4gICAgcGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xyXG4gIH0pO1xyXG4gIGxlYXJuaW5nUmF0ZS5wcm9wZXJ0eShcInZhbHVlXCIsIHN0YXRlLmxlYXJuaW5nUmF0ZSk7XHJcblxyXG4gIGxldCByZWd1bGFyRHJvcGRvd24gPSBkMy5zZWxlY3QoXCIjcmVndWxhcml6YXRpb25zXCIpLm9uKFwiY2hhbmdlXCIsXHJcbiAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgc3RhdGUucmVndWxhcml6YXRpb24gPSByZWd1bGFyaXphdGlvbnNbdGhpcy52YWx1ZV07XHJcbiAgICBwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XHJcbiAgICByZXNldCgpO1xyXG4gIH0pO1xyXG4gIHJlZ3VsYXJEcm9wZG93bi5wcm9wZXJ0eShcInZhbHVlXCIsXHJcbiAgICAgIGdldEtleUZyb21WYWx1ZShyZWd1bGFyaXphdGlvbnMsIHN0YXRlLnJlZ3VsYXJpemF0aW9uKSk7XHJcblxyXG4gIGxldCByZWd1bGFyUmF0ZSA9IGQzLnNlbGVjdChcIiNyZWd1bGFyUmF0ZVwiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcclxuICAgIHN0YXRlLnJlZ3VsYXJpemF0aW9uUmF0ZSA9ICt0aGlzLnZhbHVlO1xyXG4gICAgcGFyYW1ldGVyc0NoYW5nZWQgPSB0cnVlO1xyXG4gICAgcmVzZXQoKTtcclxuICB9KTtcclxuICByZWd1bGFyUmF0ZS5wcm9wZXJ0eShcInZhbHVlXCIsIHN0YXRlLnJlZ3VsYXJpemF0aW9uUmF0ZSk7XHJcblxyXG4gIGxldCBwcm9ibGVtID0gZDMuc2VsZWN0KFwiI3Byb2JsZW1cIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBzdGF0ZS5wcm9ibGVtID0gcHJvYmxlbXNbdGhpcy52YWx1ZV07XHJcbiAgICBnZW5lcmF0ZURhdGEoKTtcclxuICAgIGRyYXdEYXRhc2V0VGh1bWJuYWlscygpO1xyXG4gICAgc2hvd0FjY3VyYWN5KCk7XHJcbiAgICBwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XHJcbiAgICByZXNldCgpO1xyXG4gIH0pO1xyXG4gIHByb2JsZW0ucHJvcGVydHkoXCJ2YWx1ZVwiLCBnZXRLZXlGcm9tVmFsdWUocHJvYmxlbXMsIHN0YXRlLnByb2JsZW0pKTtcclxuXHJcbiAgLy8gQWRkIHNjYWxlIHRvIHRoZSBncmFkaWVudCBjb2xvciBtYXAuXHJcbiAgbGV0IHggPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWy0xLCAxXSkucmFuZ2UoWzAsIDE0NF0pO1xyXG4gIGxldCB4QXhpcyA9IGQzLnN2Zy5heGlzKClcclxuICAgIC5zY2FsZSh4KVxyXG4gICAgLm9yaWVudChcImJvdHRvbVwiKVxyXG4gICAgLnRpY2tWYWx1ZXMoWy0xLCAwLCAxXSlcclxuICAgIC50aWNrRm9ybWF0KGQzLmZvcm1hdChcImRcIikpO1xyXG4gIGQzLnNlbGVjdChcIiNjb2xvcm1hcCBnLmNvcmVcIikuYXBwZW5kKFwiZ1wiKVxyXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBcInggYXhpc1wiKVxyXG4gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCwxMClcIilcclxuICAgIC5jYWxsKHhBeGlzKTtcclxuXHJcbiAgLy8gTGlzdGVuIGZvciBjc3MtcmVzcG9uc2l2ZSBjaGFuZ2VzIGFuZCByZWRyYXcgdGhlIHN2ZyBuZXR3b3JrLlxyXG5cclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiB7XHJcbiAgICBsZXQgbmV3V2lkdGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW4tcGFydFwiKVxyXG4gICAgICAgIC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcclxuICAgIGlmIChuZXdXaWR0aCAhPT0gbWFpbldpZHRoKSB7XHJcbiAgICAgIG1haW5XaWR0aCA9IG5ld1dpZHRoO1xyXG4gICAgICBkcmF3TmV0d29yayhuZXR3b3JrKTtcclxuICAgICAgdXBkYXRlVUkodHJ1ZSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8vIEhpZGUgdGhlIHRleHQgYmVsb3cgdGhlIHZpc3VhbGl6YXRpb24gZGVwZW5kaW5nIG9uIHRoZSBVUkwuXHJcbiAgaWYgKHN0YXRlLmhpZGVUZXh0KSB7XHJcbiAgICBkMy5zZWxlY3QoXCIjYXJ0aWNsZS10ZXh0XCIpLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XHJcbiAgICBkMy5zZWxlY3QoXCJkaXYubW9yZVwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xyXG4gICAgZDMuc2VsZWN0KFwiaGVhZGVyXCIpLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVCaWFzZXNVSShuZXR3b3JrOiBubi5Ob2RlW11bXSkge1xyXG4gIG5uLmZvckVhY2hOb2RlKG5ldHdvcmssIHRydWUsIG5vZGUgPT4ge1xyXG4gICAgZDMuc2VsZWN0KGByZWN0I2JpYXMtJHtub2RlLmlkfWApLnN0eWxlKFwiZmlsbFwiLCBjb2xvclNjYWxlKG5vZGUuYmlhcykpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVXZWlnaHRzVUkobmV0d29yazogbm4uTm9kZVtdW10sIGNvbnRhaW5lcjogZDMuU2VsZWN0aW9uPGFueT4pIHtcclxuICBmb3IgKGxldCBsYXllcklkeCA9IDE7IGxheWVySWR4IDwgbmV0d29yay5sZW5ndGg7IGxheWVySWR4KyspIHtcclxuICAgIGxldCBjdXJyZW50TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4XTtcclxuICAgIC8vIFVwZGF0ZSBhbGwgdGhlIG5vZGVzIGluIHRoaXMgbGF5ZXIuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRMYXllci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgbm9kZSA9IGN1cnJlbnRMYXllcltpXTtcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBub2RlLmlucHV0TGlua3MubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICBsZXQgbGluayA9IG5vZGUuaW5wdXRMaW5rc1tqXTtcclxuICAgICAgICBjb250YWluZXIuc2VsZWN0KGAjbGluayR7bGluay5zb3VyY2UuaWR9LSR7bGluay5kZXN0LmlkfWApXHJcbiAgICAgICAgICAgIC5zdHlsZSh7XHJcbiAgICAgICAgICAgICAgXCJzdHJva2UtZGFzaG9mZnNldFwiOiAtaXRlciAvIDMsXHJcbiAgICAgICAgICAgICAgXCJzdHJva2Utd2lkdGhcIjogbGlua1dpZHRoU2NhbGUoTWF0aC5hYnMobGluay53ZWlnaHQpKSxcclxuICAgICAgICAgICAgICBcInN0cm9rZVwiOiBjb2xvclNjYWxlKGxpbmsud2VpZ2h0KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZGF0dW0obGluayk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdOb2RlKGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIG5vZGVJZDogc3RyaW5nLCBpc0lucHV0OiBib29sZWFuLFxyXG4gICAgY29udGFpbmVyOiBkMy5TZWxlY3Rpb248YW55Piwgbm9kZT86IG5uLk5vZGUpIHtcclxuICBsZXQgeCA9IGN4IC0gUkVDVF9TSVpFIC8gMjtcclxuICBsZXQgeSA9IGN5IC0gUkVDVF9TSVpFIC8gMjtcclxuXHJcbiAgbGV0IG5vZGVHcm91cCA9IGNvbnRhaW5lci5hcHBlbmQoXCJnXCIpXHJcbiAgICAuYXR0cih7XHJcbiAgICAgIFwiY2xhc3NcIjogXCJub2RlXCIsXHJcbiAgICAgIFwiaWRcIjogYG5vZGUke25vZGVJZH1gLFxyXG4gICAgICBcInRyYW5zZm9ybVwiOiBgdHJhbnNsYXRlKCR7eH0sJHt5fSlgXHJcbiAgICB9KTtcclxuXHJcbiAgLy8gRHJhdyB0aGUgbWFpbiByZWN0YW5nbGUuXHJcbiAgbm9kZUdyb3VwLmFwcGVuZChcInJlY3RcIilcclxuICAgIC5hdHRyKHtcclxuICAgICAgeDogMCxcclxuICAgICAgeTogMCxcclxuICAgICAgd2lkdGg6IFJFQ1RfU0laRSxcclxuICAgICAgaGVpZ2h0OiBSRUNUX1NJWkUsXHJcbiAgICB9KTtcclxuICBsZXQgYWN0aXZlT3JOb3RDbGFzcyA9IHN0YXRlW25vZGVJZF0gPyBcImFjdGl2ZVwiIDogXCJpbmFjdGl2ZVwiO1xyXG4gIGlmIChpc0lucHV0KSB7XHJcbiAgICBsZXQgbGFiZWwgPSBJTlBVVFNbbm9kZUlkXS5sYWJlbCAhPSBudWxsID9cclxuICAgICAgICBJTlBVVFNbbm9kZUlkXS5sYWJlbCA6IG5vZGVJZDtcclxuICAgIC8vIERyYXcgdGhlIGlucHV0IGxhYmVsLlxyXG4gICAgbGV0IHRleHQgPSBub2RlR3JvdXAuYXBwZW5kKFwidGV4dFwiKS5hdHRyKHtcclxuICAgICAgY2xhc3M6IFwibWFpbi1sYWJlbFwiLFxyXG4gICAgICB4OiAtMTAsXHJcbiAgICAgIHk6IFJFQ1RfU0laRSAvIDIsIFwidGV4dC1hbmNob3JcIjogXCJlbmRcIlxyXG4gICAgfSk7XHJcbiAgICBpZiAoL1tfXl0vLnRlc3QobGFiZWwpKSB7XHJcbiAgICAgIGxldCBteVJlID0gLyguKj8pKFtfXl0pKC4pL2c7XHJcbiAgICAgIGxldCBteUFycmF5O1xyXG4gICAgICBsZXQgbGFzdEluZGV4O1xyXG4gICAgICB3aGlsZSAoKG15QXJyYXkgPSBteVJlLmV4ZWMobGFiZWwpKSAhPSBudWxsKSB7XHJcbiAgICAgICAgbGFzdEluZGV4ID0gbXlSZS5sYXN0SW5kZXg7XHJcbiAgICAgICAgbGV0IHByZWZpeCA9IG15QXJyYXlbMV07XHJcbiAgICAgICAgbGV0IHNlcCA9IG15QXJyYXlbMl07XHJcbiAgICAgICAgbGV0IHN1ZmZpeCA9IG15QXJyYXlbM107XHJcbiAgICAgICAgaWYgKHByZWZpeCkge1xyXG4gICAgICAgICAgdGV4dC5hcHBlbmQoXCJ0c3BhblwiKS50ZXh0KHByZWZpeCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRleHQuYXBwZW5kKFwidHNwYW5cIilcclxuICAgICAgICAuYXR0cihcImJhc2VsaW5lLXNoaWZ0XCIsIHNlcCA9PT0gXCJfXCIgPyBcInN1YlwiIDogXCJzdXBlclwiKVxyXG4gICAgICAgIC5zdHlsZShcImZvbnQtc2l6ZVwiLCBcIjlweFwiKVxyXG4gICAgICAgIC50ZXh0KHN1ZmZpeCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGxhYmVsLnN1YnN0cmluZyhsYXN0SW5kZXgpKSB7XHJcbiAgICAgICAgdGV4dC5hcHBlbmQoXCJ0c3BhblwiKS50ZXh0KGxhYmVsLnN1YnN0cmluZyhsYXN0SW5kZXgpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGV4dC5hcHBlbmQoXCJ0c3BhblwiKS50ZXh0KGxhYmVsKTtcclxuICAgIH1cclxuICAgIG5vZGVHcm91cC5jbGFzc2VkKGFjdGl2ZU9yTm90Q2xhc3MsIHRydWUpO1xyXG4gIH1cclxuICBpZiAoIWlzSW5wdXQpIHtcclxuICAgIC8vIERyYXcgdGhlIG5vZGUncyBiaWFzLlxyXG4gICAgbm9kZUdyb3VwLmFwcGVuZChcInJlY3RcIilcclxuICAgICAgLmF0dHIoe1xyXG4gICAgICAgIGlkOiBgYmlhcy0ke25vZGVJZH1gLFxyXG4gICAgICAgIHg6IC1CSUFTX1NJWkUgLSAyLFxyXG4gICAgICAgIHk6IFJFQ1RfU0laRSAtIEJJQVNfU0laRSArIDMsXHJcbiAgICAgICAgd2lkdGg6IEJJQVNfU0laRSxcclxuICAgICAgICBoZWlnaHQ6IEJJQVNfU0laRSxcclxuICAgICAgfSkub24oXCJtb3VzZWVudGVyXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHVwZGF0ZUhvdmVyQ2FyZChIb3ZlclR5cGUuQklBUywgbm9kZSwgZDMubW91c2UoY29udGFpbmVyLm5vZGUoKSkpO1xyXG4gICAgICB9KS5vbihcIm1vdXNlbGVhdmVcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdXBkYXRlSG92ZXJDYXJkKG51bGwpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIERyYXcgdGhlIG5vZGUncyBjYW52YXMuXHJcbiAgbGV0IGRpdiA9IGQzLnNlbGVjdChcIiNuZXR3b3JrXCIpLmluc2VydChcImRpdlwiLCBcIjpmaXJzdC1jaGlsZFwiKVxyXG4gICAgLmF0dHIoe1xyXG4gICAgICBcImlkXCI6IGBjYW52YXMtJHtub2RlSWR9YCxcclxuICAgICAgXCJjbGFzc1wiOiBcImNhbnZhc1wiXHJcbiAgICB9KVxyXG4gICAgLnN0eWxlKHtcclxuICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcclxuICAgICAgbGVmdDogYCR7eCArIDN9cHhgLFxyXG4gICAgICB0b3A6IGAke3kgKyAzfXB4YFxyXG4gICAgfSlcclxuICAgIC5vbihcIm1vdXNlZW50ZXJcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHNlbGVjdGVkTm9kZUlkID0gbm9kZUlkO1xyXG4gICAgICBkaXYuY2xhc3NlZChcImhvdmVyZWRcIiwgdHJ1ZSk7XHJcbiAgICAgIG5vZGVHcm91cC5jbGFzc2VkKFwiaG92ZXJlZFwiLCB0cnVlKTtcclxuICAgICAgdXBkYXRlRGVjaXNpb25Cb3VuZGFyeShuZXR3b3JrLCBmYWxzZSk7XHJcbiAgICAgIGhlYXRNYXAudXBkYXRlQmFja2dyb3VuZChib3VuZGFyeVtub2RlSWRdLCBzdGF0ZS5kaXNjcmV0aXplKTtcclxuICAgIH0pXHJcbiAgICAub24oXCJtb3VzZWxlYXZlXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBzZWxlY3RlZE5vZGVJZCA9IG51bGw7XHJcbiAgICAgIGRpdi5jbGFzc2VkKFwiaG92ZXJlZFwiLCBmYWxzZSk7XHJcbiAgICAgIG5vZGVHcm91cC5jbGFzc2VkKFwiaG92ZXJlZFwiLCBmYWxzZSk7XHJcbiAgICAgIHVwZGF0ZURlY2lzaW9uQm91bmRhcnkobmV0d29yaywgZmFsc2UpO1xyXG4gICAgICBoZWF0TWFwLnVwZGF0ZUJhY2tncm91bmQoYm91bmRhcnlbbm4uZ2V0T3V0cHV0Tm9kZShuZXR3b3JrKS5pZF0sXHJcbiAgICAgICAgICBzdGF0ZS5kaXNjcmV0aXplKTtcclxuICAgIH0pO1xyXG4gIGlmIChpc0lucHV0KSB7XHJcbiAgICBkaXYub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgc3RhdGVbbm9kZUlkXSA9ICFzdGF0ZVtub2RlSWRdO1xyXG4gICAgICBwYXJhbWV0ZXJzQ2hhbmdlZCA9IHRydWU7XHJcbiAgICAgIHJlc2V0KCk7XHJcbiAgICB9KTtcclxuICAgIGRpdi5zdHlsZShcImN1cnNvclwiLCBcInBvaW50ZXJcIik7XHJcbiAgfVxyXG4gIGlmIChpc0lucHV0KSB7XHJcbiAgICBkaXYuY2xhc3NlZChhY3RpdmVPck5vdENsYXNzLCB0cnVlKTtcclxuICB9XHJcbiAgbGV0IG5vZGVIZWF0TWFwID0gbmV3IEhlYXRNYXAoUkVDVF9TSVpFLCBERU5TSVRZIC8gMTAsIHhEb21haW4sXHJcbiAgICAgIHhEb21haW4sIGRpdiwge25vU3ZnOiB0cnVlfSk7XHJcbiAgZGl2LmRhdHVtKHtoZWF0bWFwOiBub2RlSGVhdE1hcCwgaWQ6IG5vZGVJZH0pO1xyXG5cclxufVxyXG5cclxuLy8gRHJhdyBuZXR3b3JrXHJcbmZ1bmN0aW9uIGRyYXdOZXR3b3JrKG5ldHdvcms6IG5uLk5vZGVbXVtdKTogdm9pZCB7XHJcbiAgbGV0IHN2ZyA9IGQzLnNlbGVjdChcIiNzdmdcIik7XHJcbiAgLy8gUmVtb3ZlIGFsbCBzdmcgZWxlbWVudHMuXHJcbiAgc3ZnLnNlbGVjdChcImcuY29yZVwiKS5yZW1vdmUoKTtcclxuICAvLyBSZW1vdmUgYWxsIGRpdiBlbGVtZW50cy5cclxuICBkMy5zZWxlY3QoXCIjbmV0d29ya1wiKS5zZWxlY3RBbGwoXCJkaXYuY2FudmFzXCIpLnJlbW92ZSgpO1xyXG4gIGQzLnNlbGVjdChcIiNuZXR3b3JrXCIpLnNlbGVjdEFsbChcImRpdi5wbHVzLW1pbnVzLW5ldXJvbnNcIikucmVtb3ZlKCk7XHJcblxyXG4gIC8vIEdldCB0aGUgd2lkdGggb2YgdGhlIHN2ZyBjb250YWluZXIuXHJcbiAgbGV0IHBhZGRpbmcgPSAzO1xyXG4gIGxldCBjbyA9IGQzLnNlbGVjdChcIi5jb2x1bW4ub3V0cHV0XCIpLm5vZGUoKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICBsZXQgY2YgPSBkMy5zZWxlY3QoXCIuY29sdW1uLmZlYXR1cmVzXCIpLm5vZGUoKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICBsZXQgd2lkdGggPSBjby5vZmZzZXRMZWZ0IC0gY2Yub2Zmc2V0TGVmdDtcclxuICBzdmcuYXR0cihcIndpZHRoXCIsIHdpZHRoKTtcclxuXHJcbiAgLy8gTWFwIG9mIGFsbCBub2RlIGNvb3JkaW5hdGVzLlxyXG4gIGxldCBub2RlMmNvb3JkOiB7W2lkOiBzdHJpbmddOiB7Y3g6IG51bWJlciwgY3k6IG51bWJlcn19ID0ge307XHJcbiAgbGV0IGNvbnRhaW5lciA9IHN2Zy5hcHBlbmQoXCJnXCIpXHJcbiAgICAuY2xhc3NlZChcImNvcmVcIiwgdHJ1ZSlcclxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHtwYWRkaW5nfSwke3BhZGRpbmd9KWApO1xyXG4gIC8vIERyYXcgdGhlIG5ldHdvcmsgbGF5ZXIgYnkgbGF5ZXIuXHJcbiAgbGV0IG51bUxheWVycyA9IG5ldHdvcmsubGVuZ3RoO1xyXG4gIGxldCBmZWF0dXJlV2lkdGggPSAxMTg7XHJcbiAgbGV0IGxheWVyU2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsPG51bWJlciwgbnVtYmVyPigpXHJcbiAgICAgIC5kb21haW4oZDMucmFuZ2UoMSwgbnVtTGF5ZXJzIC0gMSkpXHJcbiAgICAgIC5yYW5nZVBvaW50cyhbZmVhdHVyZVdpZHRoLCB3aWR0aCAtIFJFQ1RfU0laRV0sIDAuNyk7XHJcbiAgbGV0IG5vZGVJbmRleFNjYWxlID0gKG5vZGVJbmRleDogbnVtYmVyKSA9PiBub2RlSW5kZXggKiAoUkVDVF9TSVpFICsgMjUpO1xyXG5cclxuXHJcbiAgbGV0IGNhbGxvdXRUaHVtYiA9IGQzLnNlbGVjdChcIi5jYWxsb3V0LnRodW1ibmFpbFwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xyXG4gIGxldCBjYWxsb3V0V2VpZ2h0cyA9IGQzLnNlbGVjdChcIi5jYWxsb3V0LndlaWdodHNcIikuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcclxuICBsZXQgaWRXaXRoQ2FsbG91dCA9IG51bGw7XHJcbiAgbGV0IHRhcmdldElkV2l0aENhbGxvdXQgPSBudWxsO1xyXG5cclxuICAvLyBEcmF3IHRoZSBpbnB1dCBsYXllciBzZXBhcmF0ZWx5LlxyXG4gIGxldCBjeCA9IFJFQ1RfU0laRSAvIDIgKyA1MDtcclxuICBsZXQgbm9kZUlkcyA9IE9iamVjdC5rZXlzKElOUFVUUyk7XHJcbiAgbGV0IG1heFkgPSBub2RlSW5kZXhTY2FsZShub2RlSWRzLmxlbmd0aCk7XHJcbiAgbm9kZUlkcy5mb3JFYWNoKChub2RlSWQsIGkpID0+IHtcclxuICAgIGxldCBjeSA9IG5vZGVJbmRleFNjYWxlKGkpICsgUkVDVF9TSVpFIC8gMjtcclxuICAgIG5vZGUyY29vcmRbbm9kZUlkXSA9IHtjeCwgY3l9O1xyXG4gICAgZHJhd05vZGUoY3gsIGN5LCBub2RlSWQsIHRydWUsIGNvbnRhaW5lcik7XHJcbiAgfSk7XHJcblxyXG4gIC8vIERyYXcgdGhlIGludGVybWVkaWF0ZSBsYXllcnMuXHJcbiAgZm9yIChsZXQgbGF5ZXJJZHggPSAxOyBsYXllcklkeCA8IG51bUxheWVycyAtIDE7IGxheWVySWR4KyspIHtcclxuICAgIGxldCBudW1Ob2RlcyA9IG5ldHdvcmtbbGF5ZXJJZHhdLmxlbmd0aDtcclxuICAgIGxldCBjeCA9IGxheWVyU2NhbGUobGF5ZXJJZHgpICsgUkVDVF9TSVpFIC8gMjtcclxuICAgIG1heFkgPSBNYXRoLm1heChtYXhZLCBub2RlSW5kZXhTY2FsZShudW1Ob2RlcykpO1xyXG4gICAgYWRkUGx1c01pbnVzQ29udHJvbChsYXllclNjYWxlKGxheWVySWR4KSwgbGF5ZXJJZHgpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1Ob2RlczsgaSsrKSB7XHJcbiAgICAgIGxldCBub2RlID0gbmV0d29ya1tsYXllcklkeF1baV07XHJcbiAgICAgIGxldCBjeSA9IG5vZGVJbmRleFNjYWxlKGkpICsgUkVDVF9TSVpFIC8gMjtcclxuICAgICAgbm9kZTJjb29yZFtub2RlLmlkXSA9IHtjeCwgY3l9O1xyXG4gICAgICBkcmF3Tm9kZShjeCwgY3ksIG5vZGUuaWQsIGZhbHNlLCBjb250YWluZXIsIG5vZGUpO1xyXG5cclxuICAgICAgLy8gU2hvdyBjYWxsb3V0IHRvIHRodW1ibmFpbHMuXHJcbiAgICAgIGxldCBudW1Ob2RlcyA9IG5ldHdvcmtbbGF5ZXJJZHhdLmxlbmd0aDtcclxuICAgICAgbGV0IG5leHROdW1Ob2RlcyA9IG5ldHdvcmtbbGF5ZXJJZHggKyAxXS5sZW5ndGg7XHJcbiAgICAgIGlmIChpZFdpdGhDYWxsb3V0ID09IG51bGwgJiZcclxuICAgICAgICAgIGkgPT09IG51bU5vZGVzIC0gMSAmJlxyXG4gICAgICAgICAgbmV4dE51bU5vZGVzIDw9IG51bU5vZGVzKSB7XHJcbiAgICAgICAgY2FsbG91dFRodW1iLnN0eWxlKHtcclxuICAgICAgICAgIGRpc3BsYXk6IG51bGwsXHJcbiAgICAgICAgICB0b3A6IGAkezIwICsgMyArIGN5fXB4YCxcclxuICAgICAgICAgIGxlZnQ6IGAke2N4fXB4YFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlkV2l0aENhbGxvdXQgPSBub2RlLmlkO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBEcmF3IGxpbmtzLlxyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUuaW5wdXRMaW5rcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIGxldCBsaW5rID0gbm9kZS5pbnB1dExpbmtzW2pdO1xyXG4gICAgICAgIGxldCBwYXRoOiBTVkdQYXRoRWxlbWVudCA9IGRyYXdMaW5rKGxpbmssIG5vZGUyY29vcmQsIG5ldHdvcmssXHJcbiAgICAgICAgICAgIGNvbnRhaW5lciwgaiA9PT0gMCwgaiwgbm9kZS5pbnB1dExpbmtzLmxlbmd0aCkubm9kZSgpIGFzIGFueTtcclxuICAgICAgICAvLyBTaG93IGNhbGxvdXQgdG8gd2VpZ2h0cy5cclxuICAgICAgICBsZXQgcHJldkxheWVyID0gbmV0d29ya1tsYXllcklkeCAtIDFdO1xyXG4gICAgICAgIGxldCBsYXN0Tm9kZVByZXZMYXllciA9IHByZXZMYXllcltwcmV2TGF5ZXIubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgaWYgKHRhcmdldElkV2l0aENhbGxvdXQgPT0gbnVsbCAmJlxyXG4gICAgICAgICAgICBpID09PSBudW1Ob2RlcyAtIDEgJiZcclxuICAgICAgICAgICAgbGluay5zb3VyY2UuaWQgPT09IGxhc3ROb2RlUHJldkxheWVyLmlkICYmXHJcbiAgICAgICAgICAgIChsaW5rLnNvdXJjZS5pZCAhPT0gaWRXaXRoQ2FsbG91dCB8fCBudW1MYXllcnMgPD0gNSkgJiZcclxuICAgICAgICAgICAgbGluay5kZXN0LmlkICE9PSBpZFdpdGhDYWxsb3V0ICYmXHJcbiAgICAgICAgICAgIHByZXZMYXllci5sZW5ndGggPj0gbnVtTm9kZXMpIHtcclxuICAgICAgICAgIGxldCBtaWRQb2ludCA9IHBhdGguZ2V0UG9pbnRBdExlbmd0aChwYXRoLmdldFRvdGFsTGVuZ3RoKCkgKiAwLjcpO1xyXG4gICAgICAgICAgY2FsbG91dFdlaWdodHMuc3R5bGUoe1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBudWxsLFxyXG4gICAgICAgICAgICB0b3A6IGAke21pZFBvaW50LnkgKyA1fXB4YCxcclxuICAgICAgICAgICAgbGVmdDogYCR7bWlkUG9pbnQueCArIDN9cHhgXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHRhcmdldElkV2l0aENhbGxvdXQgPSBsaW5rLmRlc3QuaWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBEcmF3IHRoZSBvdXRwdXQgbm9kZSBzZXBhcmF0ZWx5LlxyXG4gIGN4ID0gd2lkdGggKyBSRUNUX1NJWkUgLyAyO1xyXG4gIGxldCBub2RlID0gbmV0d29ya1tudW1MYXllcnMgLSAxXVswXTtcclxuICBsZXQgY3kgPSBub2RlSW5kZXhTY2FsZSgwKSArIFJFQ1RfU0laRSAvIDI7XHJcbiAgbm9kZTJjb29yZFtub2RlLmlkXSA9IHtjeCwgY3l9O1xyXG4gIC8vIERyYXcgbGlua3MuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmlucHV0TGlua3MubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBsaW5rID0gbm9kZS5pbnB1dExpbmtzW2ldO1xyXG4gICAgZHJhd0xpbmsobGluaywgbm9kZTJjb29yZCwgbmV0d29yaywgY29udGFpbmVyLCBpID09PSAwLCBpLFxyXG4gICAgICAgIG5vZGUuaW5wdXRMaW5rcy5sZW5ndGgpO1xyXG4gIH1cclxuICAvLyBBZGp1c3QgdGhlIGhlaWdodCBvZiB0aGUgc3ZnLlxyXG4gIHN2Zy5hdHRyKFwiaGVpZ2h0XCIsIG1heFkpO1xyXG5cclxuICAvLyBBZGp1c3QgdGhlIGhlaWdodCBvZiB0aGUgZmVhdHVyZXMgY29sdW1uLlxyXG4gIGxldCBoZWlnaHQgPSBNYXRoLm1heChcclxuICAgIGdldFJlbGF0aXZlSGVpZ2h0KGNhbGxvdXRUaHVtYiksXHJcbiAgICBnZXRSZWxhdGl2ZUhlaWdodChjYWxsb3V0V2VpZ2h0cyksXHJcbiAgICBnZXRSZWxhdGl2ZUhlaWdodChkMy5zZWxlY3QoXCIjbmV0d29ya1wiKSlcclxuICApO1xyXG4gIGQzLnNlbGVjdChcIi5jb2x1bW4uZmVhdHVyZXNcIikuc3R5bGUoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgXCJweFwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UmVsYXRpdmVIZWlnaHQoc2VsZWN0aW9uOiBkMy5TZWxlY3Rpb248YW55Pikge1xyXG4gIGxldCBub2RlID0gc2VsZWN0aW9uLm5vZGUoKSBhcyBIVE1MQW5jaG9yRWxlbWVudDtcclxuICByZXR1cm4gbm9kZS5vZmZzZXRIZWlnaHQgKyBub2RlLm9mZnNldFRvcDtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkUGx1c01pbnVzQ29udHJvbCh4OiBudW1iZXIsIGxheWVySWR4OiBudW1iZXIpIHtcclxuICBsZXQgZGl2ID0gZDMuc2VsZWN0KFwiI25ldHdvcmtcIikuYXBwZW5kKFwiZGl2XCIpXHJcbiAgICAuY2xhc3NlZChcInBsdXMtbWludXMtbmV1cm9uc1wiLCB0cnVlKVxyXG4gICAgLnN0eWxlKFwibGVmdFwiLCBgJHt4IC0gMTB9cHhgKTtcclxuXHJcbiAgbGV0IGkgPSBsYXllcklkeCAtIDE7XHJcbiAgbGV0IGZpcnN0Um93ID0gZGl2LmFwcGVuZChcImRpdlwiKS5hdHRyKFwiY2xhc3NcIiwgYHVpLW51bU5vZGVzJHtsYXllcklkeH1gKTtcclxuICBmaXJzdFJvdy5hcHBlbmQoXCJidXR0b25cIilcclxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1kbC1idXR0b24gbWRsLWpzLWJ1dHRvbiBtZGwtYnV0dG9uLS1pY29uXCIpXHJcbiAgICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICBsZXQgbnVtTmV1cm9ucyA9IHN0YXRlLm5ldHdvcmtTaGFwZVtpXTtcclxuICAgICAgICBpZiAobnVtTmV1cm9ucyA+PSA4KSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0YXRlLm5ldHdvcmtTaGFwZVtpXSsrO1xyXG4gICAgICAgIHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICByZXNldCgpO1xyXG4gICAgICB9KVxyXG4gICAgLmFwcGVuZChcImlcIilcclxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1hdGVyaWFsLWljb25zXCIpXHJcbiAgICAgIC50ZXh0KFwiYWRkXCIpO1xyXG5cclxuICBmaXJzdFJvdy5hcHBlbmQoXCJidXR0b25cIilcclxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1kbC1idXR0b24gbWRsLWpzLWJ1dHRvbiBtZGwtYnV0dG9uLS1pY29uXCIpXHJcbiAgICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICBsZXQgbnVtTmV1cm9ucyA9IHN0YXRlLm5ldHdvcmtTaGFwZVtpXTtcclxuICAgICAgICBpZiAobnVtTmV1cm9ucyA8PSAxKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0YXRlLm5ldHdvcmtTaGFwZVtpXS0tO1xyXG4gICAgICAgIHBhcmFtZXRlcnNDaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICByZXNldCgpO1xyXG4gICAgICB9KVxyXG4gICAgLmFwcGVuZChcImlcIilcclxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm1hdGVyaWFsLWljb25zXCIpXHJcbiAgICAgIC50ZXh0KFwicmVtb3ZlXCIpO1xyXG5cclxuICBsZXQgc3VmZml4ID0gc3RhdGUubmV0d29ya1NoYXBlW2ldID4gMSA/IFwic1wiIDogXCJcIjtcclxuICBkaXYuYXBwZW5kKFwiZGl2XCIpLnRleHQoXHJcbiAgICBzdGF0ZS5uZXR3b3JrU2hhcGVbaV0gKyBcIiBuZXVyb25cIiArIHN1ZmZpeFxyXG4gICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUhvdmVyQ2FyZCh0eXBlOiBIb3ZlclR5cGUsIG5vZGVPckxpbms/OiBubi5Ob2RlIHwgbm4uTGluayxcclxuICAgIGNvb3JkaW5hdGVzPzogW251bWJlciwgbnVtYmVyXSkge1xyXG4gIGxldCBob3ZlcmNhcmQgPSBkMy5zZWxlY3QoXCIjaG92ZXJjYXJkXCIpO1xyXG4gIGlmICh0eXBlID09IG51bGwpIHtcclxuICAgIGhvdmVyY2FyZC5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xyXG4gICAgZDMuc2VsZWN0KFwiI3N2Z1wiKS5vbihcImNsaWNrXCIsIG51bGwpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBkMy5zZWxlY3QoXCIjc3ZnXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgaG92ZXJjYXJkLnNlbGVjdChcIi52YWx1ZVwiKS5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xyXG4gICAgbGV0IGlucHV0ID0gaG92ZXJjYXJkLnNlbGVjdChcImlucHV0XCIpO1xyXG4gICAgaW5wdXQuc3R5bGUoXCJkaXNwbGF5XCIsIG51bGwpO1xyXG4gICAgaW5wdXQub24oXCJpbnB1dFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKHRoaXMudmFsdWUgIT0gbnVsbCAmJiB0aGlzLnZhbHVlICE9PSBcIlwiKSB7XHJcbiAgICAgICAgaWYgKHR5cGUgPT09IEhvdmVyVHlwZS5XRUlHSFQpIHtcclxuICAgICAgICAgIChub2RlT3JMaW5rIGFzIG5uLkxpbmspLndlaWdodCA9ICt0aGlzLnZhbHVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAobm9kZU9yTGluayBhcyBubi5Ob2RlKS5iaWFzID0gK3RoaXMudmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHVwZGF0ZVVJKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgaW5wdXQub24oXCJrZXlwcmVzc1wiLCAoKSA9PiB7XHJcbiAgICAgIGlmICgoZDMuZXZlbnQgYXMgYW55KS5rZXlDb2RlID09PSAxMykge1xyXG4gICAgICAgIHVwZGF0ZUhvdmVyQ2FyZCh0eXBlLCBub2RlT3JMaW5rLCBjb29yZGluYXRlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgKGlucHV0Lm5vZGUoKSBhcyBIVE1MSW5wdXRFbGVtZW50KS5mb2N1cygpO1xyXG4gIH0pO1xyXG4gIGxldCB2YWx1ZSA9ICh0eXBlID09PSBIb3ZlclR5cGUuV0VJR0hUKSA/XHJcbiAgICAobm9kZU9yTGluayBhcyBubi5MaW5rKS53ZWlnaHQgOlxyXG4gICAgKG5vZGVPckxpbmsgYXMgbm4uTm9kZSkuYmlhcztcclxuICBsZXQgbmFtZSA9ICh0eXBlID09PSBIb3ZlclR5cGUuV0VJR0hUKSA/IFwi6YeN44G/XCIgOiBcIuODkOOCpOOCouOCuVwiO1xyXG4gIGhvdmVyY2FyZC5zdHlsZSh7XHJcbiAgICBcImxlZnRcIjogYCR7Y29vcmRpbmF0ZXNbMF0gKyAyMH1weGAsXHJcbiAgICBcInRvcFwiOiBgJHtjb29yZGluYXRlc1sxXX1weGAsXHJcbiAgICBcImRpc3BsYXlcIjogXCJibG9ja1wiXHJcbiAgfSk7XHJcbiAgaG92ZXJjYXJkLnNlbGVjdChcIi50eXBlXCIpLnRleHQobmFtZSk7XHJcbiAgaG92ZXJjYXJkLnNlbGVjdChcIi52YWx1ZVwiKVxyXG4gICAgLnN0eWxlKFwiZGlzcGxheVwiLCBudWxsKVxyXG4gICAgLnRleHQodmFsdWUudG9QcmVjaXNpb24oMikpO1xyXG4gIGhvdmVyY2FyZC5zZWxlY3QoXCJpbnB1dFwiKVxyXG4gICAgLnByb3BlcnR5KFwidmFsdWVcIiwgdmFsdWUudG9QcmVjaXNpb24oMikpXHJcbiAgICAuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd0xpbmsoXHJcbiAgICBpbnB1dDogbm4uTGluaywgbm9kZTJjb29yZDoge1tpZDogc3RyaW5nXToge2N4OiBudW1iZXIsIGN5OiBudW1iZXJ9fSxcclxuICAgIG5ldHdvcms6IG5uLk5vZGVbXVtdLCBjb250YWluZXI6IGQzLlNlbGVjdGlvbjxhbnk+LFxyXG4gICAgaXNGaXJzdDogYm9vbGVhbiwgaW5kZXg6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpIHtcclxuICBsZXQgbGluZSA9IGNvbnRhaW5lci5pbnNlcnQoXCJwYXRoXCIsIFwiOmZpcnN0LWNoaWxkXCIpO1xyXG4gIGxldCBzb3VyY2UgPSBub2RlMmNvb3JkW2lucHV0LnNvdXJjZS5pZF07XHJcbiAgbGV0IGRlc3QgPSBub2RlMmNvb3JkW2lucHV0LmRlc3QuaWRdO1xyXG4gIGxldCBkYXR1bSA9IHtcclxuICAgIHNvdXJjZToge1xyXG4gICAgICB5OiBzb3VyY2UuY3ggKyBSRUNUX1NJWkUgLyAyICsgMixcclxuICAgICAgeDogc291cmNlLmN5XHJcbiAgICB9LFxyXG4gICAgdGFyZ2V0OiB7XHJcbiAgICAgIHk6IGRlc3QuY3ggLSBSRUNUX1NJWkUgLyAyLFxyXG4gICAgICB4OiBkZXN0LmN5ICsgKChpbmRleCAtIChsZW5ndGggLSAxKSAvIDIpIC8gbGVuZ3RoKSAqIDEyXHJcbiAgICB9XHJcbiAgfTtcclxuICBsZXQgZGlhZ29uYWwgPSBkMy5zdmcuZGlhZ29uYWwoKS5wcm9qZWN0aW9uKGQgPT4gW2QueSwgZC54XSk7XHJcbiAgbGluZS5hdHRyKHtcclxuICAgIFwibWFya2VyLXN0YXJ0XCI6IFwidXJsKCNtYXJrZXJBcnJvdylcIixcclxuICAgIGNsYXNzOiBcImxpbmtcIixcclxuICAgIGlkOiBcImxpbmtcIiArIGlucHV0LnNvdXJjZS5pZCArIFwiLVwiICsgaW5wdXQuZGVzdC5pZCxcclxuICAgIGQ6IGRpYWdvbmFsKGRhdHVtLCAwKVxyXG4gIH0pO1xyXG5cclxuICAvLyBBZGQgYW4gaW52aXNpYmxlIHRoaWNrIGxpbmsgdGhhdCB3aWxsIGJlIHVzZWQgZm9yXHJcbiAgLy8gc2hvd2luZyB0aGUgd2VpZ2h0IHZhbHVlIG9uIGhvdmVyLlxyXG4gIGNvbnRhaW5lci5hcHBlbmQoXCJwYXRoXCIpXHJcbiAgICAuYXR0cihcImRcIiwgZGlhZ29uYWwoZGF0dW0sIDApKVxyXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBcImxpbmstaG92ZXJcIilcclxuICAgIC5vbihcIm1vdXNlZW50ZXJcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHVwZGF0ZUhvdmVyQ2FyZChIb3ZlclR5cGUuV0VJR0hULCBpbnB1dCwgZDMubW91c2UodGhpcykpO1xyXG4gICAgfSkub24oXCJtb3VzZWxlYXZlXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICB1cGRhdGVIb3ZlckNhcmQobnVsbCk7XHJcbiAgICB9KTtcclxuICByZXR1cm4gbGluZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdpdmVuIGEgbmV1cmFsIG5ldHdvcmssIGl0IGFza3MgdGhlIG5ldHdvcmsgZm9yIHRoZSBvdXRwdXQgKHByZWRpY3Rpb24pXHJcbiAqIG9mIGV2ZXJ5IG5vZGUgaW4gdGhlIG5ldHdvcmsgdXNpbmcgaW5wdXRzIHNhbXBsZWQgb24gYSBzcXVhcmUgZ3JpZC5cclxuICogSXQgcmV0dXJucyBhIG1hcCB3aGVyZSBlYWNoIGtleSBpcyB0aGUgbm9kZSBJRCBhbmQgdGhlIHZhbHVlIGlzIGEgc3F1YXJlXHJcbiAqIG1hdHJpeCBvZiB0aGUgb3V0cHV0cyBvZiB0aGUgbmV0d29yayBmb3IgZWFjaCBpbnB1dCBpbiB0aGUgZ3JpZCByZXNwZWN0aXZlbHkuXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGVEZWNpc2lvbkJvdW5kYXJ5KG5ldHdvcms6IG5uLk5vZGVbXVtdLCBmaXJzdFRpbWU6IGJvb2xlYW4pIHtcclxuICBpZiAoZmlyc3RUaW1lKSB7XHJcbiAgICBib3VuZGFyeSA9IHt9O1xyXG4gICAgbm4uZm9yRWFjaE5vZGUobmV0d29yaywgdHJ1ZSwgbm9kZSA9PiB7XHJcbiAgICAgIGJvdW5kYXJ5W25vZGUuaWRdID0gbmV3IEFycmF5KERFTlNJVFkpO1xyXG4gICAgfSk7XHJcbiAgICAvLyBHbyB0aHJvdWdoIGFsbCBwcmVkZWZpbmVkIGlucHV0cy5cclxuICAgIGZvciAobGV0IG5vZGVJZCBpbiBJTlBVVFMpIHtcclxuICAgICAgYm91bmRhcnlbbm9kZUlkXSA9IG5ldyBBcnJheShERU5TSVRZKTtcclxuICAgIH1cclxuICB9XHJcbiAgbGV0IHhTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgREVOU0lUWSAtIDFdKS5yYW5nZSh4RG9tYWluKTtcclxuICBsZXQgeVNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFtERU5TSVRZIC0gMSwgMF0pLnJhbmdlKHhEb21haW4pO1xyXG5cclxuICBsZXQgaSA9IDAsIGogPSAwO1xyXG4gIGZvciAoaSA9IDA7IGkgPCBERU5TSVRZOyBpKyspIHtcclxuICAgIGlmIChmaXJzdFRpbWUpIHtcclxuICAgICAgbm4uZm9yRWFjaE5vZGUobmV0d29yaywgdHJ1ZSwgbm9kZSA9PiB7XHJcbiAgICAgICAgYm91bmRhcnlbbm9kZS5pZF1baV0gPSBuZXcgQXJyYXkoREVOU0lUWSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBHbyB0aHJvdWdoIGFsbCBwcmVkZWZpbmVkIGlucHV0cy5cclxuICAgICAgZm9yIChsZXQgbm9kZUlkIGluIElOUFVUUykge1xyXG4gICAgICAgIGJvdW5kYXJ5W25vZGVJZF1baV0gPSBuZXcgQXJyYXkoREVOU0lUWSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAoaiA9IDA7IGogPCBERU5TSVRZOyBqKyspIHtcclxuICAgICAgLy8gMSBmb3IgcG9pbnRzIGluc2lkZSB0aGUgY2lyY2xlLCBhbmQgMCBmb3IgcG9pbnRzIG91dHNpZGUgdGhlIGNpcmNsZS5cclxuICAgICAgbGV0IHggPSB4U2NhbGUoaSk7XHJcbiAgICAgIGxldCB5ID0geVNjYWxlKGopO1xyXG4gICAgICBsZXQgaW5wdXQgPSBjb25zdHJ1Y3RJbnB1dCh4LCB5KTtcclxuICAgICAgbm4uZm9yd2FyZFByb3AobmV0d29yaywgaW5wdXQpO1xyXG4gICAgICBubi5mb3JFYWNoTm9kZShuZXR3b3JrLCB0cnVlLCBub2RlID0+IHtcclxuICAgICAgICBib3VuZGFyeVtub2RlLmlkXVtpXVtqXSA9IG5vZGUub3V0cHV0O1xyXG4gICAgICB9KTtcclxuICAgICAgaWYgKGZpcnN0VGltZSkge1xyXG4gICAgICAgIC8vIEdvIHRocm91Z2ggYWxsIHByZWRlZmluZWQgaW5wdXRzLlxyXG4gICAgICAgIGZvciAobGV0IG5vZGVJZCBpbiBJTlBVVFMpIHtcclxuICAgICAgICAgIGJvdW5kYXJ5W25vZGVJZF1baV1bal0gPSBJTlBVVFNbbm9kZUlkXS5mKHgsIHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TG9zcyhuZXR3b3JrOiBubi5Ob2RlW11bXSwgZGF0YVBvaW50czogRXhhbXBsZTJEW10pOiBudW1iZXIge1xyXG4gIGxldCBsb3NzID0gMDtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFQb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBkYXRhUG9pbnQgPSBkYXRhUG9pbnRzW2ldO1xyXG4gICAgbGV0IGlucHV0ID0gY29uc3RydWN0SW5wdXQoZGF0YVBvaW50LngsIGRhdGFQb2ludC55KTtcclxuICAgIGxldCBvdXRwdXQgPSBubi5mb3J3YXJkUHJvcChuZXR3b3JrLCBpbnB1dCk7XHJcbiAgICBsb3NzICs9IG5uLkVycm9ycy5TUVVBUkUuZXJyb3Iob3V0cHV0LCBkYXRhUG9pbnQubGFiZWwpO1xyXG4gIH1cclxuICByZXR1cm4gbG9zcyAvIGRhdGFQb2ludHMubGVuZ3RoO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBY2N1cmFjeShuZXR3b3JrOiBubi5Ob2RlW11bXSwgZGF0YVBvaW50czogRXhhbXBsZTJEW10pOiBudW1iZXIge1xyXG4gIGxldCBhY2NzdW0gPSAwO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YVBvaW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IGRhdGFQb2ludCA9IGRhdGFQb2ludHNbaV07XHJcbiAgICBsZXQgaW5wdXQgPSBjb25zdHJ1Y3RJbnB1dChkYXRhUG9pbnQueCwgZGF0YVBvaW50LnkpO1xyXG4gICAgbGV0IG91dHB1dCA9IG5uLmZvcndhcmRQcm9wKG5ldHdvcmssIGlucHV0KTtcclxuICAgIG91dHB1dCA9IChvdXRwdXQgPj0gMCA/IDEgOiAtMSk7XHJcbiAgICBhY2NzdW0gKz0gKG91dHB1dCA9PSBkYXRhUG9pbnQubGFiZWwgPyAxIDogMCk7XHJcbiAgfVxyXG4gIHJldHVybiBhY2NzdW0gLyBkYXRhUG9pbnRzLmxlbmd0aDtcclxufVxyXG5cclxuZnVuY3Rpb24gc2hvd0FjY3VyYWN5KCkge1xyXG4gIGxldCBjb250cm9scyA9IGQzLnNlbGVjdChgI2FjYy1zdGF0c2ApO1xyXG4gIGlmIChjb250cm9scy5zaXplKCkgPT09IDEpIHtcclxuICAgIHN3aXRjaCAoc3RhdGUucHJvYmxlbSkge1xyXG4gICAgICBjYXNlIFByb2JsZW0uQ0xBU1NJRklDQVRJT046XHJcbiAgICAgICAgY29udHJvbHMuc3R5bGUoXCJkaXNwbGF5XCIsIFwiYmxvY2tcIik7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgUHJvYmxlbS5SRUdSRVNTSU9OOlxyXG4gICAgICAgIGNvbnRyb2xzLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVVJKGZpcnN0U3RlcCA9IGZhbHNlKSB7XHJcbiAgLy8gVXBkYXRlIHRoZSBsaW5rcyB2aXN1YWxseS5cclxuICB1cGRhdGVXZWlnaHRzVUkobmV0d29yaywgZDMuc2VsZWN0KFwiZy5jb3JlXCIpKTtcclxuICAvLyBVcGRhdGUgdGhlIGJpYXMgdmFsdWVzIHZpc3VhbGx5LlxyXG4gIHVwZGF0ZUJpYXNlc1VJKG5ldHdvcmspO1xyXG4gIC8vIEdldCB0aGUgZGVjaXNpb24gYm91bmRhcnkgb2YgdGhlIG5ldHdvcmsuXHJcbiAgdXBkYXRlRGVjaXNpb25Cb3VuZGFyeShuZXR3b3JrLCBmaXJzdFN0ZXApO1xyXG4gIGxldCBzZWxlY3RlZElkID0gc2VsZWN0ZWROb2RlSWQgIT0gbnVsbCA/XHJcbiAgICAgIHNlbGVjdGVkTm9kZUlkIDogbm4uZ2V0T3V0cHV0Tm9kZShuZXR3b3JrKS5pZDtcclxuICBoZWF0TWFwLnVwZGF0ZUJhY2tncm91bmQoYm91bmRhcnlbc2VsZWN0ZWRJZF0sIHN0YXRlLmRpc2NyZXRpemUpO1xyXG5cclxuICAvLyBVcGRhdGUgYWxsIGRlY2lzaW9uIGJvdW5kYXJpZXMuXHJcbiAgZDMuc2VsZWN0KFwiI25ldHdvcmtcIikuc2VsZWN0QWxsKFwiZGl2LmNhbnZhc1wiKVxyXG4gICAgICAuZWFjaChmdW5jdGlvbihkYXRhOiB7aGVhdG1hcDogSGVhdE1hcCwgaWQ6IHN0cmluZ30pIHtcclxuICAgIGRhdGEuaGVhdG1hcC51cGRhdGVCYWNrZ3JvdW5kKHJlZHVjZU1hdHJpeChib3VuZGFyeVtkYXRhLmlkXSwgMTApLFxyXG4gICAgICAgIHN0YXRlLmRpc2NyZXRpemUpO1xyXG4gIH0pO1xyXG5cclxuICBmdW5jdGlvbiB6ZXJvUGFkKG46IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICBsZXQgcGFkID0gXCIwMDAwMDBcIjtcclxuICAgIHJldHVybiAocGFkICsgbikuc2xpY2UoLXBhZC5sZW5ndGgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkQ29tbWFzKHM6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gcy5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBcIixcIik7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBodW1hblJlYWRhYmxlKG46IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gbi50b0ZpeGVkKDMpO1xyXG4gIH1cclxuXHJcbiAgLy8gVXBkYXRlIGxvc3MgYW5kIGl0ZXJhdGlvbiBudW1iZXIuXHJcbiAgZDMuc2VsZWN0KFwiI2xvc3MtdHJhaW5cIikudGV4dChodW1hblJlYWRhYmxlKGxvc3NUcmFpbikpO1xyXG4gIGQzLnNlbGVjdChcIiNsb3NzLXZhbGlkYXRpb25cIikudGV4dChodW1hblJlYWRhYmxlKGxvc3NWYWxpZGF0aW9uKSk7XHJcbiAgZDMuc2VsZWN0KFwiI2FjYy10cmFpblwiKS50ZXh0KGh1bWFuUmVhZGFibGUoYWNjVHJhaW4pKTtcclxuICBkMy5zZWxlY3QoXCIjYWNjLXZhbGlkYXRpb25cIikudGV4dChodW1hblJlYWRhYmxlKGFjY1ZhbGlkYXRpb24pKTtcclxuICBkMy5zZWxlY3QoXCIjaXRlci1udW1iZXJcIikudGV4dChhZGRDb21tYXMoemVyb1BhZChpdGVyKSkpO1xyXG4gIGxpbmVDaGFydC5hZGREYXRhUG9pbnQoW2xvc3NUcmFpbiwgbG9zc1ZhbGlkYXRpb25dKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY29uc3RydWN0SW5wdXRJZHMoKTogc3RyaW5nW10ge1xyXG4gIGxldCByZXN1bHQ6IHN0cmluZ1tdID0gW107XHJcbiAgZm9yIChsZXQgaW5wdXROYW1lIGluIElOUFVUUykge1xyXG4gICAgaWYgKHN0YXRlW2lucHV0TmFtZV0pIHtcclxuICAgICAgcmVzdWx0LnB1c2goaW5wdXROYW1lKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZnVuY3Rpb24gY29uc3RydWN0SW5wdXQoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBudW1iZXJbXSB7XHJcbiAgbGV0IGlucHV0OiBudW1iZXJbXSA9IFtdO1xyXG4gIGZvciAobGV0IGlucHV0TmFtZSBpbiBJTlBVVFMpIHtcclxuICAgIGlmIChzdGF0ZVtpbnB1dE5hbWVdKSB7XHJcbiAgICAgIGlucHV0LnB1c2goSU5QVVRTW2lucHV0TmFtZV0uZih4LCB5KSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBpbnB1dDtcclxufVxyXG5cclxuZnVuY3Rpb24gb25lU3RlcCgpOiB2b2lkIHtcclxuICBpdGVyKys7XHJcbiAgdHJhaW5EYXRhLmZvckVhY2goKHBvaW50LCBpKSA9PiB7XHJcbiAgICBsZXQgaW5wdXQgPSBjb25zdHJ1Y3RJbnB1dChwb2ludC54LCBwb2ludC55KTtcclxuICAgIG5uLmZvcndhcmRQcm9wKG5ldHdvcmssIGlucHV0KTtcclxuICAgIG5uLmJhY2tQcm9wKG5ldHdvcmssIHBvaW50LmxhYmVsLCBubi5FcnJvcnMuU1FVQVJFKTtcclxuICAgIGlmICgoaSArIDEpICUgc3RhdGUuYmF0Y2hTaXplID09PSAwKSB7XHJcbiAgICAgIG5uLnVwZGF0ZVdlaWdodHMobmV0d29yaywgc3RhdGUubGVhcm5pbmdSYXRlLCBzdGF0ZS5yZWd1bGFyaXphdGlvblJhdGUpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIC8vIENvbXB1dGUgdGhlIGxvc3MuXHJcbiAgbG9zc1RyYWluID0gZ2V0TG9zcyhuZXR3b3JrLCB0cmFpbkRhdGEpO1xyXG4gIGxvc3NWYWxpZGF0aW9uID0gZ2V0TG9zcyhuZXR3b3JrLCB2YWxpZGF0aW9uRGF0YSk7XHJcbiAgaWYgKHN0YXRlLnByb2JsZW0gPT09IFByb2JsZW0uQ0xBU1NJRklDQVRJT04pIHtcclxuICAgIGFjY1RyYWluID0gZ2V0QWNjdXJhY3kobmV0d29yaywgdHJhaW5EYXRhKTtcclxuICAgIGFjY1ZhbGlkYXRpb24gPSBnZXRBY2N1cmFjeShuZXR3b3JrLCB2YWxpZGF0aW9uRGF0YSk7XHJcbiAgfVxyXG4gIHVwZGF0ZVVJKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRPdXRwdXRXZWlnaHRzKG5ldHdvcms6IG5uLk5vZGVbXVtdKTogbnVtYmVyW10ge1xyXG4gIGxldCB3ZWlnaHRzOiBudW1iZXJbXSA9IFtdO1xyXG4gIGZvciAobGV0IGxheWVySWR4ID0gMDsgbGF5ZXJJZHggPCBuZXR3b3JrLmxlbmd0aCAtIDE7IGxheWVySWR4KyspIHtcclxuICAgIGxldCBjdXJyZW50TGF5ZXIgPSBuZXR3b3JrW2xheWVySWR4XTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudExheWVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBub2RlID0gY3VycmVudExheWVyW2ldO1xyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUub3V0cHV0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIGxldCBvdXRwdXQgPSBub2RlLm91dHB1dHNbal07XHJcbiAgICAgICAgd2VpZ2h0cy5wdXNoKG91dHB1dC53ZWlnaHQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB3ZWlnaHRzO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXNldChvblN0YXJ0dXA9ZmFsc2UpIHtcclxuICBsaW5lQ2hhcnQucmVzZXQoKTtcclxuICBzdGF0ZS5zZXJpYWxpemUoKTtcclxuICBpZiAoIW9uU3RhcnR1cCkge1xyXG4gICAgdXNlckhhc0ludGVyYWN0ZWQoKTtcclxuICB9XHJcbiAgcGxheWVyLnBhdXNlKCk7XHJcblxyXG4gIC8vbGV0IHN1ZmZpeCA9IHN0YXRlLm51bUhpZGRlbkxheWVycyAhPT0gMSA/IFwic1wiIDogXCJcIjtcclxuICAvL2QzLnNlbGVjdChcIiNsYXllcnMtbGFiZWxcIikudGV4dChcIumaoOOCjOWxpFwiICsgc3VmZml4KTtcclxuICBkMy5zZWxlY3QoXCIjbGF5ZXJzLWxhYmVsXCIpLnRleHQoXCLpmqDjgozlsaRcIik7XHJcbiAgZDMuc2VsZWN0KFwiI251bS1sYXllcnNcIikudGV4dChzdGF0ZS5udW1IaWRkZW5MYXllcnMpO1xyXG5cclxuICAvLyBNYWtlIGEgc2ltcGxlIG5ldHdvcmsuXHJcbiAgaXRlciA9IDA7XHJcbiAgbGV0IG51bUlucHV0cyA9IGNvbnN0cnVjdElucHV0KDAgLCAwKS5sZW5ndGg7XHJcbiAgbGV0IHNoYXBlID0gW251bUlucHV0c10uY29uY2F0KHN0YXRlLm5ldHdvcmtTaGFwZSkuY29uY2F0KFsxXSk7XHJcbiAgbGV0IG91dHB1dEFjdGl2YXRpb24gPSAoc3RhdGUucHJvYmxlbSA9PT0gUHJvYmxlbS5SRUdSRVNTSU9OKSA/XHJcbiAgICAgIG5uLkFjdGl2YXRpb25zLkxJTkVBUiA6IG5uLkFjdGl2YXRpb25zLlRBTkg7XHJcbiAgbmV0d29yayA9IG5uLmJ1aWxkTmV0d29yayhzaGFwZSwgc3RhdGUuYWN0aXZhdGlvbiwgb3V0cHV0QWN0aXZhdGlvbixcclxuICAgICAgc3RhdGUucmVndWxhcml6YXRpb24sIGNvbnN0cnVjdElucHV0SWRzKCksIHN0YXRlLmluaXRPcmlnaW4pO1xyXG4gIGxvc3NUcmFpbiA9IGdldExvc3MobmV0d29yaywgdHJhaW5EYXRhKTtcclxuICBsb3NzVmFsaWRhdGlvbiA9IGdldExvc3MobmV0d29yaywgdmFsaWRhdGlvbkRhdGEpO1xyXG4gIGlmIChzdGF0ZS5wcm9ibGVtID09PSBQcm9ibGVtLkNMQVNTSUZJQ0FUSU9OKSB7XHJcbiAgICBhY2NUcmFpbiA9IGdldEFjY3VyYWN5KG5ldHdvcmssIHRyYWluRGF0YSk7XHJcbiAgICBhY2NWYWxpZGF0aW9uID0gZ2V0QWNjdXJhY3kobmV0d29yaywgdmFsaWRhdGlvbkRhdGEpO1xyXG4gIH1cclxuICBkcmF3TmV0d29yayhuZXR3b3JrKTtcclxuICB1cGRhdGVVSSh0cnVlKTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIGluaXRUdXRvcmlhbCgpIHtcclxuICBpZiAoc3RhdGUudHV0b3JpYWwgPT0gbnVsbCB8fCBzdGF0ZS50dXRvcmlhbCA9PT0gJycgfHwgc3RhdGUuaGlkZVRleHQpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgLy8gUmVtb3ZlIGFsbCBvdGhlciB0ZXh0LlxyXG4gIGQzLnNlbGVjdEFsbChcImFydGljbGUgZGl2LmwtLWJvZHlcIikucmVtb3ZlKCk7XHJcbiAgbGV0IHR1dG9yaWFsID0gZDMuc2VsZWN0KFwiYXJ0aWNsZVwiKS5hcHBlbmQoXCJkaXZcIilcclxuICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsLS1ib2R5XCIpO1xyXG4gIC8vIEluc2VydCB0dXRvcmlhbCB0ZXh0LlxyXG4gIGQzLmh0bWwoYHR1dG9yaWFscy8ke3N0YXRlLnR1dG9yaWFsfS5odG1sYCwgKGVyciwgaHRtbEZyYWdtZW50KSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7XHJcbiAgICAgIHRocm93IGVycjtcclxuICAgIH1cclxuICAgIHR1dG9yaWFsLm5vZGUoKS5hcHBlbmRDaGlsZChodG1sRnJhZ21lbnQpO1xyXG4gICAgLy8gSWYgdGhlIHR1dG9yaWFsIGhhcyBhIDx0aXRsZT4gdGFnLCBzZXQgdGhlIHBhZ2UgdGl0bGUgdG8gdGhhdC5cclxuICAgIGxldCB0aXRsZSA9IHR1dG9yaWFsLnNlbGVjdChcInRpdGxlXCIpO1xyXG4gICAgaWYgKHRpdGxlLnNpemUoKSkge1xyXG4gICAgICBkMy5zZWxlY3QoXCJoZWFkZXIgaDFcIikuc3R5bGUoe1xyXG4gICAgICAgIFwibWFyZ2luLXRvcFwiOiBcIjIwcHhcIixcclxuICAgICAgICBcIm1hcmdpbi1ib3R0b21cIjogXCIyMHB4XCIsXHJcbiAgICAgIH0pXHJcbiAgICAgIC50ZXh0KHRpdGxlLnRleHQoKSk7XHJcbiAgICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGUudGV4dCgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3RGF0YXNldFRodW1ibmFpbHMoKSB7XHJcbiAgZnVuY3Rpb24gcmVuZGVyVGh1bWJuYWlsKGNhbnZhcywgZGF0YUdlbmVyYXRvcikge1xyXG4gICAgbGV0IHcgPSAxMDA7XHJcbiAgICBsZXQgaCA9IDEwMDtcclxuICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCB3KTtcclxuICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgaCk7XHJcbiAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICBsZXQgZGF0YSA9IGRhdGFHZW5lcmF0b3IoMjAwLCAwKTtcclxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihkKSB7XHJcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3JTY2FsZShkLmxhYmVsKTtcclxuICAgICAgY29udGV4dC5maWxsUmVjdCh3ICogKGQueCArIDYpIC8gMTIsIGggLSBoICogKGQueSArIDYpIC8gMTIgLSA0LCA0LCA0KTtcclxuICAgIH0pO1xyXG4gICAgZDMuc2VsZWN0KGNhbnZhcy5wYXJlbnROb2RlKS5zdHlsZShcImRpc3BsYXlcIiwgbnVsbCk7XHJcbiAgfVxyXG4gIGQzLnNlbGVjdEFsbChcIi5kYXRhc2V0XCIpLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XHJcblxyXG4gIGlmIChzdGF0ZS5wcm9ibGVtID09PSBQcm9ibGVtLkNMQVNTSUZJQ0FUSU9OKSB7XHJcbiAgICBmb3IgKGxldCBkYXRhc2V0IGluIGRhdGFzZXRzKSB7XHJcbiAgICAgIGxldCBjYW52YXM6IGFueSA9XHJcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBjYW52YXNbZGF0YS1kYXRhc2V0PSR7ZGF0YXNldH1dYCk7XHJcbiAgICAgIGxldCBkYXRhR2VuZXJhdG9yID0gZGF0YXNldHNbZGF0YXNldF07XHJcbiAgICAgIHJlbmRlclRodW1ibmFpbChjYW52YXMsIGRhdGFHZW5lcmF0b3IpO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAoc3RhdGUucHJvYmxlbSA9PT0gUHJvYmxlbS5SRUdSRVNTSU9OKSB7XHJcbiAgICBmb3IgKGxldCByZWdEYXRhc2V0IGluIHJlZ0RhdGFzZXRzKSB7XHJcbiAgICAgIGxldCBjYW52YXM6IGFueSA9XHJcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBjYW52YXNbZGF0YS1yZWdEYXRhc2V0PSR7cmVnRGF0YXNldH1dYCk7XHJcbiAgICAgIGxldCBkYXRhR2VuZXJhdG9yID0gcmVnRGF0YXNldHNbcmVnRGF0YXNldF07XHJcbiAgICAgIHJlbmRlclRodW1ibmFpbChjYW52YXMsIGRhdGFHZW5lcmF0b3IpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGlkZUNvbnRyb2xzKCkge1xyXG4gIC8vIFNldCBkaXNwbGF5Om5vbmUgdG8gYWxsIHRoZSBVSSBlbGVtZW50cyB0aGF0IGFyZSBoaWRkZW4uXHJcbiAgbGV0IGhpZGRlblByb3BzID0gc3RhdGUuZ2V0SGlkZGVuUHJvcHMoKTtcclxuICBoaWRkZW5Qcm9wcy5mb3JFYWNoKHByb3AgPT4ge1xyXG4gICAgbGV0IGNvbnRyb2xzID0gZDMuc2VsZWN0QWxsKGAudWktJHtwcm9wfWApO1xyXG4gICAgaWYgKGNvbnRyb2xzLnNpemUoKSA9PT0gMCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oYDAgaHRtbCBlbGVtZW50cyBmb3VuZCB3aXRoIGNsYXNzIC51aS0ke3Byb3B9YCk7XHJcbiAgICB9XHJcbiAgICBjb250cm9scy5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBBbHNvIGFkZCBjaGVja2JveCBmb3IgZWFjaCBoaWRhYmxlIGNvbnRyb2wgaW4gdGhlIFwidXNlIGl0IGluIGNsYXNzcm9tXCJcclxuICAvLyBzZWN0aW9uLlxyXG4gIGxldCBoaWRlQ29udHJvbHMgPSBkMy5zZWxlY3QoXCIuaGlkZS1jb250cm9sc1wiKTtcclxuICBISURBQkxFX0NPTlRST0xTLmZvckVhY2goKFt0ZXh0LCBpZF0pID0+IHtcclxuICAgIGxldCBsYWJlbCA9IGhpZGVDb250cm9scy5hcHBlbmQoXCJsYWJlbFwiKVxyXG4gICAgICAuYXR0cihcImNsYXNzXCIsIFwibWRsLWNoZWNrYm94IG1kbC1qcy1jaGVja2JveCBtZGwtanMtcmlwcGxlLWVmZmVjdFwiKTtcclxuICAgIGxldCBpbnB1dCA9IGxhYmVsLmFwcGVuZChcImlucHV0XCIpXHJcbiAgICAgIC5hdHRyKHtcclxuICAgICAgICB0eXBlOiBcImNoZWNrYm94XCIsXHJcbiAgICAgICAgY2xhc3M6IFwibWRsLWNoZWNrYm94X19pbnB1dFwiLFxyXG4gICAgICB9KTtcclxuICAgIGlmIChoaWRkZW5Qcm9wcy5pbmRleE9mKGlkKSA9PT0gLTEpIHtcclxuICAgICAgaW5wdXQuYXR0cihcImNoZWNrZWRcIiwgXCJ0cnVlXCIpO1xyXG4gICAgfVxyXG4gICAgaW5wdXQub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHN0YXRlLnNldEhpZGVQcm9wZXJ0eShpZCwgIXRoaXMuY2hlY2tlZCk7XHJcbiAgICAgIHN0YXRlLnNlcmlhbGl6ZSgpO1xyXG4gICAgICB1c2VySGFzSW50ZXJhY3RlZCgpO1xyXG4gICAgICBkMy5zZWxlY3QoXCIuaGlkZS1jb250cm9scy1saW5rXCIpXHJcbiAgICAgICAgLmF0dHIoXCJocmVmXCIsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAgIH0pO1xyXG4gICAgbGFiZWwuYXBwZW5kKFwic3BhblwiKVxyXG4gICAgICAuYXR0cihcImNsYXNzXCIsIFwibWRsLWNoZWNrYm94X19sYWJlbCBsYWJlbFwiKVxyXG4gICAgICAudGV4dCh0ZXh0KTtcclxuICB9KTtcclxuICBkMy5zZWxlY3QoXCIuaGlkZS1jb250cm9scy1saW5rXCIpXHJcbiAgICAuYXR0cihcImhyZWZcIiwgd2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZURhdGEoZmlyc3RUaW1lID0gZmFsc2UpIHtcclxuICBpZiAoIWZpcnN0VGltZSkge1xyXG4gICAgLy8gQ2hhbmdlIHRoZSBzZWVkLlxyXG4gICAgc3RhdGUuc2VlZCA9IE1hdGgucmFuZG9tKCkudG9GaXhlZCg1KTtcclxuICAgIHN0YXRlLnNlcmlhbGl6ZSgpO1xyXG4gICAgdXNlckhhc0ludGVyYWN0ZWQoKTtcclxuICB9XHJcbiAgTWF0aC5zZWVkcmFuZG9tKHN0YXRlLnNlZWQpO1xyXG4gIGxldCBudW1TYW1wbGVzID0gKHN0YXRlLnByb2JsZW0gPT09IFByb2JsZW0uUkVHUkVTU0lPTikgP1xyXG4gICAgICBOVU1fU0FNUExFU19SRUdSRVNTIDogTlVNX1NBTVBMRVNfQ0xBU1NJRlk7XHJcbiAgbGV0IGdlbmVyYXRvciA9IHN0YXRlLnByb2JsZW0gPT09IFByb2JsZW0uQ0xBU1NJRklDQVRJT04gP1xyXG4gICAgICBzdGF0ZS5kYXRhc2V0IDogc3RhdGUucmVnRGF0YXNldDtcclxuICBsZXQgZGF0YSA9IGdlbmVyYXRvcihudW1TYW1wbGVzLCBzdGF0ZS5ub2lzZSAvIDEwMCk7XHJcbiAgLy8gU2h1ZmZsZSB0aGUgZGF0YSBpbi1wbGFjZS5cclxuICBzaHVmZmxlKGRhdGEpO1xyXG4gIC8vIFNwbGl0IGludG8gdHJhaW4gYW5kIHRlc3QgZGF0YS5cclxuICBsZXQgc3BsaXRJbmRleCA9IE1hdGguZmxvb3IoZGF0YS5sZW5ndGggKiBzdGF0ZS5wZXJjVHJhaW5EYXRhIC8gMTAwKTtcclxuICB0cmFpbkRhdGEgPSBkYXRhLnNsaWNlKDAsIHNwbGl0SW5kZXgpO1xyXG4gIHZhbGlkYXRpb25EYXRhID0gZGF0YS5zbGljZShzcGxpdEluZGV4KTtcclxuICBoZWF0TWFwLnVwZGF0ZVRyYWluUG9pbnRzKHN0YXRlLnNob3dUcmFpbkRhdGEgPyB0cmFpbkRhdGEgOiBbXSk7XHJcbiAgaGVhdE1hcC51cGRhdGVWYWxpZGF0aW9uUG9pbnRzKHN0YXRlLnNob3dWYWxpZGF0aW9uRGF0YSA/IHZhbGlkYXRpb25EYXRhIDogW10pO1xyXG59XHJcblxyXG5sZXQgZmlyc3RJbnRlcmFjdGlvbiA9IHRydWU7XHJcbmxldCBwYXJhbWV0ZXJzQ2hhbmdlZCA9IGZhbHNlO1xyXG5cclxuZnVuY3Rpb24gdXNlckhhc0ludGVyYWN0ZWQoKSB7XHJcbiAgaWYgKCFmaXJzdEludGVyYWN0aW9uKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIGZpcnN0SW50ZXJhY3Rpb24gPSBmYWxzZTtcclxuICBsZXQgcGFnZSA9ICdpbmRleCc7XHJcbiAgaWYgKHN0YXRlLnR1dG9yaWFsICE9IG51bGwgJiYgc3RhdGUudHV0b3JpYWwgIT09ICcnKSB7XHJcbiAgICBwYWdlID0gYC92L3R1dG9yaWFscy8ke3N0YXRlLnR1dG9yaWFsfWA7XHJcbiAgfVxyXG4gIGdhKCdzZXQnLCAncGFnZScsIHBhZ2UpO1xyXG4gIGdhKCdzZW5kJywgJ3BhZ2V2aWV3JywgeydzZXNzaW9uQ29udHJvbCc6ICdzdGFydCd9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2ltdWxhdGlvblN0YXJ0ZWQoKSB7XHJcbiAgZ2EoJ3NlbmQnLCB7XHJcbiAgICBoaXRUeXBlOiAnZXZlbnQnLFxyXG4gICAgZXZlbnRDYXRlZ29yeTogJ1N0YXJ0aW5nIFNpbXVsYXRpb24nLFxyXG4gICAgZXZlbnRBY3Rpb246IHBhcmFtZXRlcnNDaGFuZ2VkID8gJ2NoYW5nZWQnIDogJ3VuY2hhbmdlZCcsXHJcbiAgICBldmVudExhYmVsOiBzdGF0ZS50dXRvcmlhbCA9PSBudWxsID8gJycgOiBzdGF0ZS50dXRvcmlhbFxyXG4gIH0pO1xyXG4gIHBhcmFtZXRlcnNDaGFuZ2VkID0gZmFsc2U7XHJcbn1cclxuXHJcbmRyYXdEYXRhc2V0VGh1bWJuYWlscygpO1xyXG5zaG93QWNjdXJhY3koKTtcclxuaW5pdFR1dG9yaWFsKCk7XHJcbm1ha2VHVUkoKTtcclxuZ2VuZXJhdGVEYXRhKHRydWUpO1xyXG5yZXNldCh0cnVlKTtcclxuaGlkZUNvbnRyb2xzKCk7XHJcbiIsIi8qIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXHJcblxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG5cclxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuaW1wb3J0ICogYXMgbm4gZnJvbSBcIi4vbm5cIjtcclxuaW1wb3J0ICogYXMgZGF0YXNldCBmcm9tIFwiLi9kYXRhc2V0XCI7XHJcblxyXG4vKiogU3VmZml4IGFkZGVkIHRvIHRoZSBzdGF0ZSB3aGVuIHN0b3JpbmcgaWYgYSBjb250cm9sIGlzIGhpZGRlbiBvciBub3QuICovXHJcbmNvbnN0IEhJREVfU1RBVEVfU1VGRklYID0gXCJfaGlkZVwiO1xyXG5cclxuLyoqIEEgbWFwIGJldHdlZW4gbmFtZXMgYW5kIGFjdGl2YXRpb24gZnVuY3Rpb25zLiAqL1xyXG5leHBvcnQgbGV0IGFjdGl2YXRpb25zOiB7W2tleTogc3RyaW5nXTogbm4uQWN0aXZhdGlvbkZ1bmN0aW9ufSA9IHtcclxuICBcInJlbHVcIjogbm4uQWN0aXZhdGlvbnMuUkVMVSxcclxuICBcInRhbmhcIjogbm4uQWN0aXZhdGlvbnMuVEFOSCxcclxuICBcInNpZ21vaWRcIjogbm4uQWN0aXZhdGlvbnMuU0lHTU9JRCxcclxuICBcImxpbmVhclwiOiBubi5BY3RpdmF0aW9ucy5MSU5FQVJcclxufTtcclxuXHJcbi8qKiBBIG1hcCBiZXR3ZWVuIG5hbWVzIGFuZCByZWd1bGFyaXphdGlvbiBmdW5jdGlvbnMuICovXHJcbmV4cG9ydCBsZXQgcmVndWxhcml6YXRpb25zOiB7W2tleTogc3RyaW5nXTogbm4uUmVndWxhcml6YXRpb25GdW5jdGlvbn0gPSB7XHJcbiAgXCJub25lXCI6IG51bGwsXHJcbiAgXCJMMVwiOiBubi5SZWd1bGFyaXphdGlvbkZ1bmN0aW9uLkwxLFxyXG4gIFwiTDJcIjogbm4uUmVndWxhcml6YXRpb25GdW5jdGlvbi5MMlxyXG59O1xyXG5cclxuLyoqIEEgbWFwIGJldHdlZW4gZGF0YXNldCBuYW1lcyBhbmQgZnVuY3Rpb25zIHRoYXQgZ2VuZXJhdGUgY2xhc3NpZmljYXRpb24gZGF0YS4gKi9cclxuZXhwb3J0IGxldCBkYXRhc2V0czoge1trZXk6IHN0cmluZ106IGRhdGFzZXQuRGF0YUdlbmVyYXRvcn0gPSB7XHJcbiAgXCJjaXJjbGVcIjogZGF0YXNldC5jbGFzc2lmeUNpcmNsZURhdGEsXHJcbiAgXCJ4b3JcIjogZGF0YXNldC5jbGFzc2lmeVhPUkRhdGEsXHJcbiAgXCJnYXVzc1wiOiBkYXRhc2V0LmNsYXNzaWZ5VHdvR2F1c3NEYXRhLFxyXG4gIFwic3BpcmFsXCI6IGRhdGFzZXQuY2xhc3NpZnlTcGlyYWxEYXRhLFxyXG59O1xyXG5cclxuLyoqIEEgbWFwIGJldHdlZW4gZGF0YXNldCBuYW1lcyBhbmQgZnVuY3Rpb25zIHRoYXQgZ2VuZXJhdGUgcmVncmVzc2lvbiBkYXRhLiAqL1xyXG5leHBvcnQgbGV0IHJlZ0RhdGFzZXRzOiB7W2tleTogc3RyaW5nXTogZGF0YXNldC5EYXRhR2VuZXJhdG9yfSA9IHtcclxuICBcInJlZy1wbGFuZVwiOiBkYXRhc2V0LnJlZ3Jlc3NQbGFuZSxcclxuICBcInJlZy1nYXVzc1wiOiBkYXRhc2V0LnJlZ3Jlc3NHYXVzc2lhblxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEtleUZyb21WYWx1ZShvYmo6IGFueSwgdmFsdWU6IGFueSk6IHN0cmluZyB7XHJcbiAgZm9yIChsZXQga2V5IGluIG9iaikge1xyXG4gICAgaWYgKG9ialtrZXldID09PSB2YWx1ZSkge1xyXG4gICAgICByZXR1cm4ga2V5O1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdW5kZWZpbmVkO1xyXG59XHJcblxyXG5mdW5jdGlvbiBlbmRzV2l0aChzOiBzdHJpbmcsIHN1ZmZpeDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIHMuc3Vic3RyKC1zdWZmaXgubGVuZ3RoKSA9PT0gc3VmZml4O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRIaWRlUHJvcHMob2JqOiBhbnkpOiBzdHJpbmdbXSB7XHJcbiAgbGV0IHJlc3VsdDogc3RyaW5nW10gPSBbXTtcclxuICBmb3IgKGxldCBwcm9wIGluIG9iaikge1xyXG4gICAgaWYgKGVuZHNXaXRoKHByb3AsIEhJREVfU1RBVEVfU1VGRklYKSkge1xyXG4gICAgICByZXN1bHQucHVzaChwcm9wKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRoZSBkYXRhIHR5cGUgb2YgYSBzdGF0ZSB2YXJpYWJsZS4gVXNlZCBmb3IgZGV0ZXJtaW5pbmcgdGhlXHJcbiAqIChkZSlzZXJpYWxpemF0aW9uIG1ldGhvZC5cclxuICovXHJcbmV4cG9ydCBlbnVtIFR5cGUge1xyXG4gIFNUUklORyxcclxuICBOVU1CRVIsXHJcbiAgQVJSQVlfTlVNQkVSLFxyXG4gIEFSUkFZX1NUUklORyxcclxuICBCT09MRUFOLFxyXG4gIE9CSkVDVFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBQcm9ibGVtIHtcclxuICBDTEFTU0lGSUNBVElPTixcclxuICBSRUdSRVNTSU9OXHJcbn1cclxuXHJcbmV4cG9ydCBsZXQgcHJvYmxlbXMgPSB7XHJcbiAgXCJjbGFzc2lmaWNhdGlvblwiOiBQcm9ibGVtLkNMQVNTSUZJQ0FUSU9OLFxyXG4gIFwicmVncmVzc2lvblwiOiBQcm9ibGVtLlJFR1JFU1NJT05cclxufTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUHJvcGVydHkge1xyXG4gIG5hbWU6IHN0cmluZztcclxuICB0eXBlOiBUeXBlO1xyXG4gIGtleU1hcD86IHtba2V5OiBzdHJpbmddOiBhbnl9O1xyXG59O1xyXG5cclxuLy8gQWRkIHRoZSBHVUkgc3RhdGUuXHJcbmV4cG9ydCBjbGFzcyBTdGF0ZSB7XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIFBST1BTOiBQcm9wZXJ0eVtdID0gW1xyXG4gICAge25hbWU6IFwiYWN0aXZhdGlvblwiLCB0eXBlOiBUeXBlLk9CSkVDVCwga2V5TWFwOiBhY3RpdmF0aW9uc30sXHJcbiAgICB7bmFtZTogXCJyZWd1bGFyaXphdGlvblwiLCB0eXBlOiBUeXBlLk9CSkVDVCwga2V5TWFwOiByZWd1bGFyaXphdGlvbnN9LFxyXG4gICAge25hbWU6IFwiYmF0Y2hTaXplXCIsIHR5cGU6IFR5cGUuTlVNQkVSfSxcclxuICAgIHtuYW1lOiBcImRhdGFzZXRcIiwgdHlwZTogVHlwZS5PQkpFQ1QsIGtleU1hcDogZGF0YXNldHN9LFxyXG4gICAge25hbWU6IFwicmVnRGF0YXNldFwiLCB0eXBlOiBUeXBlLk9CSkVDVCwga2V5TWFwOiByZWdEYXRhc2V0c30sXHJcbiAgICB7bmFtZTogXCJsZWFybmluZ1JhdGVcIiwgdHlwZTogVHlwZS5OVU1CRVJ9LFxyXG4gICAge25hbWU6IFwicmVndWxhcml6YXRpb25SYXRlXCIsIHR5cGU6IFR5cGUuTlVNQkVSfSxcclxuICAgIHtuYW1lOiBcIm5vaXNlXCIsIHR5cGU6IFR5cGUuTlVNQkVSfSxcclxuICAgIHtuYW1lOiBcIm5ldHdvcmtTaGFwZVwiLCB0eXBlOiBUeXBlLkFSUkFZX05VTUJFUn0sXHJcbiAgICB7bmFtZTogXCJzZWVkXCIsIHR5cGU6IFR5cGUuU1RSSU5HfSxcclxuICAgIHtuYW1lOiBcInNob3dUcmFpbkRhdGFcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcclxuICAgIHtuYW1lOiBcInNob3dWYWxpZGF0aW9uRGF0YVwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxyXG4gICAge25hbWU6IFwic2hvd1Rlc3REYXRhXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXHJcbiAgICB7bmFtZTogXCJkaXNjcmV0aXplXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXHJcbiAgICB7bmFtZTogXCJwZXJjVHJhaW5EYXRhXCIsIHR5cGU6IFR5cGUuTlVNQkVSfSxcclxuICAgIHtuYW1lOiBcInhcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcclxuICAgIHtuYW1lOiBcInlcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcclxuICAgIHtuYW1lOiBcInhUaW1lc1lcIiwgdHlwZTogVHlwZS5CT09MRUFOfSxcclxuICAgIHtuYW1lOiBcInhTcXVhcmVkXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXHJcbiAgICB7bmFtZTogXCJ5U3F1YXJlZFwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxyXG4gICAge25hbWU6IFwic2luWFwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxyXG4gICAge25hbWU6IFwic2luWVwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxyXG4gICAge25hbWU6IFwidGVzdEJ1dHRvblwiLCB0eXBlOiBUeXBlLkJPT0xFQU59LFxyXG4gICAge25hbWU6IFwidHV0b3JpYWxcIiwgdHlwZTogVHlwZS5TVFJJTkd9LFxyXG4gICAge25hbWU6IFwicHJvYmxlbVwiLCB0eXBlOiBUeXBlLk9CSkVDVCwga2V5TWFwOiBwcm9ibGVtc30sXHJcbiAgICB7bmFtZTogXCJpbml0T3JpZ2luXCIsIHR5cGU6IFR5cGUuQk9PTEVBTn0sXHJcbiAgICB7bmFtZTogXCJoaWRlVGV4dFwiLCB0eXBlOiBUeXBlLkJPT0xFQU59XHJcbiAgXTtcclxuXHJcbiAgW2tleTogc3RyaW5nXTogYW55O1xyXG4gIGxlYXJuaW5nUmF0ZSA9IDAuMDM7XHJcbiAgcmVndWxhcml6YXRpb25SYXRlID0gMDtcclxuICBzaG93VHJhaW5EYXRhID0gdHJ1ZTtcclxuICBzaG93VmFsaWRhdGlvbkRhdGEgPSBmYWxzZTtcclxuICBzaG93VGVzdERhdGEgPSBmYWxzZTtcclxuICBub2lzZSA9IDA7XHJcbiAgYmF0Y2hTaXplID0gMTA7XHJcbiAgZGlzY3JldGl6ZSA9IGZhbHNlO1xyXG4gIHR1dG9yaWFsOiBzdHJpbmcgPSBudWxsO1xyXG4gIHBlcmNUcmFpbkRhdGEgPSA1MDtcclxuICBhY3RpdmF0aW9uID0gbm4uQWN0aXZhdGlvbnMuVEFOSDtcclxuICByZWd1bGFyaXphdGlvbjogbm4uUmVndWxhcml6YXRpb25GdW5jdGlvbiA9IG51bGw7XHJcbiAgcHJvYmxlbSA9IFByb2JsZW0uQ0xBU1NJRklDQVRJT047XHJcbiAgaW5pdE9yaWdpbiA9IGZhbHNlO1xyXG4gIGhpZGVUZXh0ID0gZmFsc2U7XHJcbiAgdGVzdEJ1dHRvbiA9IGZhbHNlO1xyXG4gIG51bUhpZGRlbkxheWVycyA9IDE7XHJcbiAgaGlkZGVuTGF5ZXJDb250cm9sczogYW55W10gPSBbXTtcclxuICBuZXR3b3JrU2hhcGU6IG51bWJlcltdID0gWzQsIDJdO1xyXG4gIHggPSB0cnVlO1xyXG4gIHkgPSB0cnVlO1xyXG4gIHhUaW1lc1kgPSBmYWxzZTtcclxuICB4U3F1YXJlZCA9IGZhbHNlO1xyXG4gIHlTcXVhcmVkID0gZmFsc2U7XHJcbiAgc2luWCA9IGZhbHNlO1xyXG4gIHNpblkgPSBmYWxzZTtcclxuICBkYXRhc2V0OiBkYXRhc2V0LkRhdGFHZW5lcmF0b3IgPSBkYXRhc2V0LmNsYXNzaWZ5Q2lyY2xlRGF0YTtcclxuICByZWdEYXRhc2V0OiBkYXRhc2V0LkRhdGFHZW5lcmF0b3IgPSBkYXRhc2V0LnJlZ3Jlc3NQbGFuZTtcclxuICBzZWVkOiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIERlc2VyaWFsaXplcyB0aGUgc3RhdGUgZnJvbSB0aGUgdXJsIGhhc2guXHJcbiAgICovXHJcbiAgc3RhdGljIGRlc2VyaWFsaXplU3RhdGUoKTogU3RhdGUge1xyXG4gICAgbGV0IG1hcDoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcclxuICAgIGZvciAobGV0IGtleXZhbHVlIG9mIHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNsaWNlKDEpLnNwbGl0KFwiJlwiKSkge1xyXG4gICAgICBsZXQgW25hbWUsIHZhbHVlXSA9IGtleXZhbHVlLnNwbGl0KFwiPVwiKTtcclxuICAgICAgbWFwW25hbWVdID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBsZXQgc3RhdGUgPSBuZXcgU3RhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBoYXNLZXkobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiBuYW1lIGluIG1hcCAmJiBtYXBbbmFtZV0gIT0gbnVsbCAmJiBtYXBbbmFtZV0udHJpbSgpICE9PSBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHBhcnNlQXJyYXkodmFsdWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcclxuICAgICAgcmV0dXJuIHZhbHVlLnRyaW0oKSA9PT0gXCJcIiA/IFtdIDogdmFsdWUuc3BsaXQoXCIsXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIERlc2VyaWFsaXplIHJlZ3VsYXIgcHJvcGVydGllcy5cclxuICAgIFN0YXRlLlBST1BTLmZvckVhY2goKHtuYW1lLCB0eXBlLCBrZXlNYXB9KSA9PiB7XHJcbiAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgIGNhc2UgVHlwZS5PQkpFQ1Q6XHJcbiAgICAgICAgICBpZiAoa2V5TWFwID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJBIGtleS12YWx1ZSBtYXAgbXVzdCBiZSBwcm92aWRlZCBmb3Igc3RhdGUgXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJ2YXJpYWJsZXMgb2YgdHlwZSBPYmplY3RcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaGFzS2V5KG5hbWUpICYmIG1hcFtuYW1lXSBpbiBrZXlNYXApIHtcclxuICAgICAgICAgICAgc3RhdGVbbmFtZV0gPSBrZXlNYXBbbWFwW25hbWVdXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgVHlwZS5OVU1CRVI6XHJcbiAgICAgICAgICBpZiAoaGFzS2V5KG5hbWUpKSB7XHJcbiAgICAgICAgICAgIC8vIFRoZSArIG9wZXJhdG9yIGlzIGZvciBjb252ZXJ0aW5nIGEgc3RyaW5nIHRvIGEgbnVtYmVyLlxyXG4gICAgICAgICAgICBzdGF0ZVtuYW1lXSA9ICttYXBbbmFtZV07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFR5cGUuU1RSSU5HOlxyXG4gICAgICAgICAgaWYgKGhhc0tleShuYW1lKSkge1xyXG4gICAgICAgICAgICBzdGF0ZVtuYW1lXSA9IG1hcFtuYW1lXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgVHlwZS5CT09MRUFOOlxyXG4gICAgICAgICAgaWYgKGhhc0tleShuYW1lKSkge1xyXG4gICAgICAgICAgICBzdGF0ZVtuYW1lXSA9IChtYXBbbmFtZV0gPT09IFwiZmFsc2VcIiA/IGZhbHNlIDogdHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFR5cGUuQVJSQVlfTlVNQkVSOlxyXG4gICAgICAgICAgaWYgKG5hbWUgaW4gbWFwKSB7XHJcbiAgICAgICAgICAgIHN0YXRlW25hbWVdID0gcGFyc2VBcnJheShtYXBbbmFtZV0pLm1hcChOdW1iZXIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBUeXBlLkFSUkFZX1NUUklORzpcclxuICAgICAgICAgIGlmIChuYW1lIGluIG1hcCkge1xyXG4gICAgICAgICAgICBzdGF0ZVtuYW1lXSA9IHBhcnNlQXJyYXkobWFwW25hbWVdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICB0aHJvdyBFcnJvcihcIkVuY291bnRlcmVkIGFuIHVua25vd24gdHlwZSBmb3IgYSBzdGF0ZSB2YXJpYWJsZVwiKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gRGVzZXJpYWxpemUgc3RhdGUgcHJvcGVydGllcyB0aGF0IGNvcnJlc3BvbmQgdG8gaGlkaW5nIFVJIGNvbnRyb2xzLlxyXG4gICAgZ2V0SGlkZVByb3BzKG1hcCkuZm9yRWFjaChwcm9wID0+IHtcclxuICAgICAgc3RhdGVbcHJvcF0gPSAobWFwW3Byb3BdID09PSBcInRydWVcIikgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9KTtcclxuICAgIHN0YXRlLm51bUhpZGRlbkxheWVycyA9IHN0YXRlLm5ldHdvcmtTaGFwZS5sZW5ndGg7XHJcbiAgICBpZiAoc3RhdGUuc2VlZCA9PSBudWxsKSB7XHJcbiAgICAgIHN0YXRlLnNlZWQgPSBNYXRoLnJhbmRvbSgpLnRvRml4ZWQoNSk7XHJcbiAgICB9XHJcbiAgICBNYXRoLnNlZWRyYW5kb20oc3RhdGUuc2VlZCk7XHJcbiAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXJpYWxpemVzIHRoZSBzdGF0ZSBpbnRvIHRoZSB1cmwgaGFzaC5cclxuICAgKi9cclxuICBzZXJpYWxpemUoKSB7XHJcbiAgICAvLyBTZXJpYWxpemUgcmVndWxhciBwcm9wZXJ0aWVzLlxyXG4gICAgbGV0IHByb3BzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgU3RhdGUuUFJPUFMuZm9yRWFjaCgoe25hbWUsIHR5cGUsIGtleU1hcH0pID0+IHtcclxuICAgICAgbGV0IHZhbHVlID0gdGhpc1tuYW1lXTtcclxuICAgICAgLy8gRG9uJ3Qgc2VyaWFsaXplIG1pc3NpbmcgdmFsdWVzLlxyXG4gICAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodHlwZSA9PT0gVHlwZS5PQkpFQ1QpIHtcclxuICAgICAgICB2YWx1ZSA9IGdldEtleUZyb21WYWx1ZShrZXlNYXAsIHZhbHVlKTtcclxuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBUeXBlLkFSUkFZX05VTUJFUiB8fFxyXG4gICAgICAgICAgdHlwZSA9PT0gVHlwZS5BUlJBWV9TVFJJTkcpIHtcclxuICAgICAgICB2YWx1ZSA9IHZhbHVlLmpvaW4oXCIsXCIpO1xyXG4gICAgICB9XHJcbiAgICAgIHByb3BzLnB1c2goYCR7bmFtZX09JHt2YWx1ZX1gKTtcclxuICAgIH0pO1xyXG4gICAgLy8gU2VyaWFsaXplIHByb3BlcnRpZXMgdGhhdCBjb3JyZXNwb25kIHRvIGhpZGluZyBVSSBjb250cm9scy5cclxuICAgIGdldEhpZGVQcm9wcyh0aGlzKS5mb3JFYWNoKHByb3AgPT4ge1xyXG4gICAgICBwcm9wcy5wdXNoKGAke3Byb3B9PSR7dGhpc1twcm9wXX1gKTtcclxuICAgIH0pO1xyXG4gICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBwcm9wcy5qb2luKFwiJlwiKTtcclxuICB9XHJcblxyXG4gIC8qKiBSZXR1cm5zIGFsbCB0aGUgaGlkZGVuIHByb3BlcnRpZXMuICovXHJcbiAgZ2V0SGlkZGVuUHJvcHMoKTogc3RyaW5nW10ge1xyXG4gICAgbGV0IHJlc3VsdDogc3RyaW5nW10gPSBbXTtcclxuICAgIGZvciAobGV0IHByb3AgaW4gdGhpcykge1xyXG4gICAgICBpZiAoZW5kc1dpdGgocHJvcCwgSElERV9TVEFURV9TVUZGSVgpICYmIFN0cmluZyh0aGlzW3Byb3BdKSA9PT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICByZXN1bHQucHVzaChwcm9wLnJlcGxhY2UoSElERV9TVEFURV9TVUZGSVgsIFwiXCIpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHNldEhpZGVQcm9wZXJ0eShuYW1lOiBzdHJpbmcsIGhpZGRlbjogYm9vbGVhbikge1xyXG4gICAgdGhpc1tuYW1lICsgSElERV9TVEFURV9TVUZGSVhdID0gaGlkZGVuO1xyXG4gIH1cclxufVxyXG4iXX0=
