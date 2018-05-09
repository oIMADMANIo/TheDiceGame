var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            //console.log(descriptor);
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Particle = function () {
    function Particle(svg, coordinates, friction) {
        _classCallCheck(this, Particle);

        this.svg = svg;
        this.steps = $(window).height() / 2;
        this.item = null;
        this.friction = friction;
        this.coordinates = coordinates;
        this.position = this.coordinates.y;
        this.dimensions = this.render();
        this.rotation = Math.random() > 0.5 ? "-" : "+";
        this.scale = 0.5 + Math.random();
        this.siner = 200 * Math.random();
    }

    _createClass(Particle, [{
        key: "destroy",
        value: function destroy() {
            this.item.remove();
        }
  }, {
        key: "move",
        value: function move() {
            this.position = this.position - this.friction;
            var top = this.position;
            var left = this.coordinates.x + Math.sin(this.position * Math.PI / this.steps) * this.siner;
            this.item.css({
                transform: "translateX(" + left + "px) translateY(" + top + "px) scale(" + this.scale + ") rotate(" + this.rotation + (this.position + this.dimensions.height) + "deg)"
            });
            if (this.position < -this.dimensions.height) {
                this.destroy();
                return false;
            } else {
                return true;
            }
        }
  }, {
        key: "render",
        value: function render() {
            this.item = $(this.svg, {
                css: {
                    transform: "translateX(" + this.coordinates.x + "px) translateY(" + this.coordinates.y + "px)"
                }
            });
            $("body").append(this.item);
            return {
                width: this.item.width(15),
                height: this.item.height()
            };
        }
  }]);
    return Particle;
}();
// all svg objects on the screen
var star = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 93.42 88.85"><defs><style>.cls-1{fill:rgba(255, 220, 109, 0.25);}</style></defs><title>Element 1</title><g id="Ebene_2" data-name="Ebene 2"><g id="Ebene_1-2" data-name="Ebene 1"><polygon class="cls-1" points="46.71 0 61.15 29.25 93.42 33.94 70.07 56.7 75.58 88.85 46.71 73.67 17.84 88.85 23.36 56.7 0 33.94 32.28 29.25 46.71 0"/></g></g></svg>';

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
// contains all SVG
var data = [star];

var isPaused = false;

// paused and reactiveate the animation by window-activity
window.onblur = function () {
    isPaused = true;
}.bind(this);
window.onfocus = function () {
    isPaused = false;
}.bind(this);

var particles = [];
// create new objects and define their position in 102,103 and speed in 104
setInterval(function () {
    if (!isPaused) {
        particles.push(new Particle(data[randomInt(0, data.length - 1)], {
            "x": Math.random() * $(window).width(), // random X position
            "y": $(window).height() // spawn in the bottom
        }, 0.3 + Math.random() * 1.25));
    }
},800); // how often new elements spawn 

function update() {
    particles = particles.filter(function (p) {
        return p.move();
    });
    requestAnimationFrame(update.bind(this));
}
update();