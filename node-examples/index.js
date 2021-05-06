const rectangle = require('./rectangle');
var rect = require('./rectangle');

function solveRect(l,b)
{
    console.log("Solving for rectange with L: " + l + " and B: " + b);
    rect(l,b, (err, rectangle) => {
        if (err) {
            console.log("ERROR: ", err.message);
        }
        else{
            console.log("the area of the rectangle of dimentions L: " +
            l + " and B: " + b + " is " + rectangle.area());
            console.log("the perimeter of the rectangle of dimentions L: " +
            l + " and B: " + b + " is " + rectangle.perimeter());
        }
    });
    console.log("This statement is after the call to rect()")
}

solveRect(2,4);
solveRect(3,5);
solveRect(0,5);
solveRect(-3,5);