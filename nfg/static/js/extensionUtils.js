/**
 * Created by giacomo on 29/04/16.
 */
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

Array.prototype.containsByProp = function(propName, value){
      for (var i = this.length - 1; i > -1; i--) {
        var propObj = this[i];
          if(propObj[propName] === value) {
            return true;
        }
      }
    return false;
} ;