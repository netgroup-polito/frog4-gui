/**
 * Created by giacomo on 29/04/16.
 */
String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

Array.prototype.containsByProp = function (propName, value) {
    for (var i = this.length - 1; i > -1; i--) {
        var propObj = this[i];
        if (propObj[propName] === value) {
            return true;
        }
    }
    return false;
};

/**
 * Be carefull using this metod
 */
function clone(obj) {
    var copy;
    if (obj == null || typeof obj != "object")
        return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr))
                copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");

};
