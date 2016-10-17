    String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
    Array.prototype.isEmpty = function(){if(this.length===0) {return true;}else{return false;}};
    Boolean.prototype.toggle = function (x) {return !x;};
    Object.prototype.isset = function(x) {return ((typeof x) != 'undefined');};

/*
* embolden a {term} within a {string}
* @param string String
* @param term String
*/
function emboldenTerm(input, term) {return input.replace(new RegExp('(^|\)(' + term + ')(\|$)','ig'), '$1<strong>$2</strong>$3');}

/*
* Trims down {date} to a year
* @param date String
*/
function dateToYear(y){return y.substring(0,4);}

/*
* Shortens a {string} down to {amount} of characters
* capping it with ellipses
* @param string String
* @param amount Int
*/
function shortenString(string, amount){if (string.length>amount&& string.charAt(amount-1) != "?"){string= string.substring(0, amount);string+="...";}return x}

/*
* checks if {x} is an int
*@param x Int
*/
function isInt(x) {return !isNaN(x) && parseInt(Number(x)) == x &&!isNaN(parseInt(x, 10));}

/*
* Regex to remove html tags from string {x}
* @param x String
*/
function removeTags(x){return x.replace(/<(?:.|\n)*?>/gm, '');}

/*
* Escapes square brackets from string {x}
* can be used in query situations etc
* @param x String
*/
function escapeSquare(x){x = x.replace(new RegExp('\\['), '\\[');x = x.replace(new RegExp('\\]'), '\\]');return x;}

/*
* Rnd function for the selection of header image
*/
function rnd(){
    //TODO Adjust for each BG
    var x = Math.floor((Math.random() * 10) + 1);
    while(x>3){
        x=Math.floor((Math.random() * 10) + 1);
    }
    return x;
}

/*
*Simple array empty check
*/
function isEmpty(array){
    if(array.length===0) {return true;}else{return false;}
    //if(this.length===0) {return true;}else{return false;}
}

/*
* Simple contains function checks {string} for {term}
* @param string String
* @param term String
*/
function contains(string, term){
    console.log(string);
if (string.indexOf(term) != -1) return true;
else return false;
}

/*
* JS isset equivalent checks if defined.
* @param variable Type
*/
function isset(x){
    return ((typeof x) != 'undefined');
}



exports.emboldenTerm = emboldenTerm;
exports.shortenString = shortenString;
exports.isInt = isInt;
exports.removeTags =  removeTags;
exports.escapeSquare =  escapeSquare;
exports.rnd = rnd;
exports.contains = contains;
exports.isset = isset;
exports.isEmpty = isEmpty;
// exports.Array =  Array.isEmpty;
// exports.String = String;
// exports.Boolean = Boolean;
// exports.Function.isset = isset;