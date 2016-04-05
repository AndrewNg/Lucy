// bug when it returns zero
function organizeArray(phrase) {
	phrase = phrase.toLowerCase();
	var words = phrase.split(" ");
	var linkarray = [];
	var textarray = [];

	for (var i = 0; i < words.length; i++) {
		var templink = [];
		var temptext = [];
		$('a').each(function() {
			if ($(this).text().toLowerCase().indexOf(words[i]) != -1) {
				templink.push($(this).attr("href"));
				temptext.push($(this).text());
			}
		})
		linkarray.push(templink);
		textarray.push(temptext);
	}

	for (var i = 0; i < linkarray.length; i++) {
		if (linkarray[i].length == 0) {
			linkarray.splice(i, 1);
			textarray.splice(i, 1);
		}
	}

	var shortestlink = linkarray.reduce(function(p,c) {return p.length>c.length?c:p;},{length:Infinity});
	var shortesttext = textarray.reduce(function(p,c) {return p.length>c.length?c:p;},{length:Infinity});

	var twoArrays = [shortesttext, shortestlink];

  console.log(twoArrays);

  var simArray = []
  for (var i = 0; i < shortesttext.length; i++) {
    simArray.push(findSimilarity(shortesttext[i], phrase));
  }

  console.log(simArray);

  var index = simArray.indexOf(Math.max.apply(Math, simArray));

  console.log(index);

  console.log(shortestlink[index]);

  window.location.href = shortestlink[index];

  return shortestlink[index];
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
/* find number of duplicates and number of common substrings
	two phrases: Tesla is the best car, 200,000 Tesla cars ready
  */
  function findSimilarity(phrase1, phrase2) {
   var sim = 0.0;
   phrase1 = phrase1.toLowerCase();
   phrase2 = phrase2.toLowerCase();
   var words1 = phrase1.split(" ");
   var words2 = phrase2.split(" ");
   var intersection = intersect(words1, words2);
   sim += intersection.length;
   Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
  };
  var diff1 = words1.diff(intersection);
  var diff2 = words2.diff(intersection);
  sim += findSubstringCommonality(diff1, diff2);
  return sim;
}

function findSubstringCommonality(stringarray1, stringarray2) {
	var substringSim = 0.0;
	for (var i = 0; i < stringarray1.length; i++) {
		for (var j = 0; j < stringarray2.length; j++) {
			var maxlength = Math.max(stringarray1[i].length, stringarray2[j].length);
			var longestComSub = parseFloat(longestCommonSubstring(stringarray1[i], stringarray2[j]));
			if (longestComSub >= 3)
				substringSim += longestComSub/maxlength;
		}
	}
	return substringSim;
}
function intersect(a, b) {
  var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
      if (b.indexOf(e) !== -1) return true;
    });
  }
  function intersect_safe(a, b)
  {
    var ai=0, bi=0;
    var result   = [];

    while( ai < a.length && bi < b.length )
    {
     if      (a[ai] < b[bi] ){ ai++; }
     else if (a[ai] > b[bi] ){ bi++; }
     else /* they're equal */
     {
       result.push(a[ai]);
       ai++;
       bi++;
     }
   }

   return result;
 }
function getWebsite (phrase) {
  if (phrase.indexOf(".com") != -1 || phrase.indexOf(".edu") != -1 || phrase.indexOf(".org") != -1 )
    return [phrase, true];

  var topdefault = ["google.com", "facebook.com", "youtube.com", "yahoo.com",
  "baidu.com", "live.com", "amazon.com", "qq.com", "twitter.com",
  "blogspot.com", "msn.com", "ebay.com", "wordpress.com",
  "vk.com", "microsoft.com", "tumblr.com", "pinterest.com",
  "babylon.com", "fc2.com", "paypal.com", "ask.com", "imdb.com",
  "soso.com", "sohu.com", "adobe.com", "go.com", "instagram.com",
  "flickr.com", "livedoor.com", "stackoverflow.com",
  "cnn.com", "imgur.com", "alibaba.com", "netflix.com", "huffingtonpost.com",
  "espn.go.com", "weather.com", "bankofamerica.com", "nytimes.com" ];
  var words = phrase.toLowerCase().split(" ");
  var action = [phrase.toLowerCase(), false];
  for (var i = 0; i < words.length; i++) {
    for (var j = 0; j < topdefault.length; j++) {
      if (topdefault[j].indexOf(words[i]) != -1) {
        action[0] = topdefault[j];
        action[1] = true;
        return action;
      }
    }
  }
  return action;
}

function openWebsite(phrase) {
  console.log(phrase);
  var urlArray = getWebsite(phrase);
  console.log(urlArray);
  if (urlArray[1]) {
    console.log("navigating to site");
    var site = "http://" + urlArray[0];
    window.location.href = site;
  }
  else {
    console.log("searching in google");
    window.location.href = "http://google.com/search?q=" + phrase;
  }
}