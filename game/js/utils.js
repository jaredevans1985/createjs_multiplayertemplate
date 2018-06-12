// Give us a random number between a minimum and maximum
// TODO: Put this in a utils file or something
function rand(min, max) {
	return (Math.floor(Math.random() * (max*1000 - min*1000 + 1)) + min*1000)/1000;
}

// Give us a random RGBA color between a min and max RGBA color
function randColor (min, max) {
	return new RGBA(
		rand(min.r, max.r),
		rand(min.g, max.g),
		rand(min.b, max.b),
		rand(min.a, max.a)
	);
}

// Lerp between two colors
function lerpColor(colorA, colorB, value)
{
	// Interpolate between all of the values
	var r = lerp(colorA.r, colorB.r, value);
	var g = lerp(colorA.g, colorB.g, value);
	var b = lerp(colorA.b, colorB.b, value);
	var a = lerp(colorA.a, colorB.a, value);

	// Return our new color
	return new RGBA(r, g, b, a);
}

function lerp(valA, valB, value)
{
	// Clamp the value
	value = value > 1 ? 1 : value;
	value = value < 0 ? 0 : value;
	return valA * (1 - value) + valB * value;
}

// Return a color defined in RGBA format
function RGBA (r,g,b,a) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
	this.str = function() {
		return "rgba("+Math.round(this.r)+","+Math.round(this.g)+","+Math.round(this.b)+","+Math.round(this.a)+")";
	};
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var date = getCookie("firstdate");
    if (date != "") {
        console.log("You first logged in on " + date);
    } else {
		var d = new Date();
        date = d.toUTCString();
        if (date != "" && date != null) {
            setCookie("firstdate", date, 365);
        }
    }
}