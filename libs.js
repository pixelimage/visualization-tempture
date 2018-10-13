
var serial_=function(){var t=function(t){this.args=t,this.currentNo=0,this.playingFlg=!1,this.isPause=!1},i=t.prototype;return i.start=function(){this.playingFlg||(this.playingFlg=!0,this.execute_core())},i.execute_core=function(){if(this.playingFlg)if(this.currentNo<this.args.length){var t=this.args[this.currentNo];if("number"!=typeof t)t(),this.execute_next();else{var i=this;setTimeout(function(){i.execute_next()},1e3*t)}}else this.funish()},i.execute_next=function(){this.isPause||this.playingFlg&&(this.currentNo++,this.execute_core())},i.funish=function(){this.playingFlg=!1,this.init()},i.pause=function(){this.isPause=!0},i.restart=function(){this.isPause=!1,this.execute_next()},i.jump=function(t){this.currentNo=t-1},i.init=function(){this.playingFlg=!1,this.currentNo=0},i.remove=function(){this.currentNo=0,this.playingFlg=!1},t}();

var getQuery = function() {
	var a = window.location.search.substr(1).split('&');
  if (a == "") return {};
  var b = {};
  for (var i = 0; i < a.length; ++i)
  {
      var p=a[i].split('=', 2);
      if (p.length == 1)
          b[p[0]] = "";
      else
          b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
  }
  return b;
};

