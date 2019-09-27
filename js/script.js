function createWheel(position) {

    var handleThickness = 8;
    var numSpokes = 6;

    var felloeWheel = new Path.Circle({
        center: position,
        radius: 50,
        strokeColor: 'saddleBrown',
        strokeWidth: 2
    });

    var excludeCircle = new Path.Circle({
        center: position,
        radius: 35
    });

    var barrel = new Path.Circle({
        center: position,
        radius: 12.5,
        strokeColor: 'saddleBrown',
        strokeWidth: 2,
        fillColor: 'peru'
    });

    var wheel = felloeWheel.exclude(excludeCircle);
    wheel.fillColor = 'peru';
    wheel = wheel.unite(barrel);

    excludeCircle.remove();
    barrel.remove();

    var spokeTemplate = new Path.Rectangle({
        from: [position.x - handleThickness/2, position.y], 
        to: [position.x + handleThickness/2, position.y - 65],
        pivot: position,
        fillColor: 'saddleBrown'
    });

    var handleTemplate = new Path.Ellipse({
        center: [position.x, position.y - 70],
        radius: [handleThickness/1.5, 15],
        pivot: position,
        fillColor: 'saddleBrown'
    })

    var spoke = new Symbol(spokeTemplate);
    var handle = new Symbol(handleTemplate);

    for (var i=0; i<numSpokes; i++) {
        wheel = new Group(spoke.place(position).rotate((360/numSpokes)*i, position), handle.place(position).rotate((360/numSpokes)*i, position), wheel);
    }
    
    wheel.applyMatrix = false;
    wheel.pivot = position;

    return wheel;
}

var prevSway = 1;
var rotAcceleration = 0;

function sway() {
    if (!selected) {
        rotAcceleration = Math.random() * 0.002 * prevSway + (prevSway * 0.005);
        prevSway *= -1;
        setTimeout(function(){rotAcceleration *= -1}, 2000);
    }
}

var swayFunction = setInterval(sway, 4000);

var wheel = createWheel(view.center);
var clickAngle, ogWheelAngle, prevAngleDiff = 0, rotVelocity = 0, userRotVelocity = 0; selected = false;
var wheelFriction = 0.1;

function onMouseDown(e) {
    var delta = (e.point - view.center);
    clickAngle = delta.angle;
    ogWheelAngle = wheel.rotation;
    userRotVelocity = 0;
    selected = true;

    clearInterval(swayFunction);
    rotAcceleration = 0;
    rotVelocity = 0;
}

function onMouseUp(e) {
    selected = false;

    swayFunction = setInterval(sway, 4000);
}

function onFrame(e) {
    if (!selected) {

        rotVelocity += rotAcceleration;

        if (userRotVelocity < 0) {
            userRotVelocity += wheelFriction;
        }
        else if (userRotVelocity > 0) {
            userRotVelocity -= wheelFriction;
        }
        
        if (Math.abs(userRotVelocity) < wheelFriction) userRotVelocity = 0;

        wheel.rotate(userRotVelocity + rotVelocity);


    }
}

function onMouseDrag(e) {
    var delta = (e.point - view.center);
    var angleDiff = delta.angle - clickAngle;
    userRotVelocity = angleDiff - prevAngleDiff;
    wheel.rotation = ogWheelAngle + angleDiff;
    prevAngleDiff = angleDiff;
}