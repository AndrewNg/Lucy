

function organizeArray(phrase) {	
	var words = phrase.split(" ");
	var linkarray = [];
	var textarray = [];

	for (var i = 0; i < words.length; i++) {
		var templink = [];
		var temptext = [];
		$('a').each(function() {
			if ($(this).text().indexOf(words[i]) != -1) {
				templink.push($(this).attr("href"));
				temptext.push($(this).text());
			}
		})	
		linkarray.push(templink);
		textarray.push(temptext);
	}
	var shortestlink = linkarray.reduce(function(p,c) {return p.length>c.length?c:p;},{length:Infinity});
	var shortesttext = textarray.reduce(function(p,c) {return p.length>c.length?c:p;},{length:Infinity});

	var twoArrays = [shortesttext, shortestlink];

	console.log(twoArrays);

	return twoArrays;
}
function longestCommonSubstring(string1, string2){
	// init max value
	var longestCommonSubstring = 0;
	// init 2D array with 0
	var table = [],
            len1 = string1.length,
            len2 = string2.length,
            row, col;
	for(row = 0; row <= len1; row++){
		table[row] = [];
		for(col = 0; col <= len2; col++){
			table[row][col] = 0;
		}
	}
	// fill table
        var i, j;
	for(i = 0; i < len1; i++){
		for(j = 0; j < len2; j++){
			if(string1[i] === string2[j]){
				if(table[i][j] === 0){
					table[i+1][j+1] = 1;
				} else {
					table[i+1][j+1] = table[i][j] + 1;
				}
				if(table[i+1][j+1] > longestCommonSubstring){
					longestCommonSubstring = table[i+1][j+1];
				}
			} else {
				table[i+1][j+1] = 0;
			}
		}
	}
	return longestCommonSubstring;
}

function findSimilarity(phrase1, phrase2) {

}