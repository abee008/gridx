//>>built
define("dojox/charting/scaler/linear",["dojo/_base/lang","./common"],function(n,o){function l(b,d){for(var b=b.toLowerCase(),a=d.length-1;0<=a;--a)if(b===d[a])return!0;return!1}var r=n.getObject("dojox.charting.scaler.linear",!0),m=o.getNumericLabel,k=function(b,d,a,c,e,g,f){a=n.delegate(a);if(!c){if("major"==a.fixUpper)a.fixUpper="minor";if("major"==a.fixLower)a.fixLower="minor"}if(!e){if("minor"==a.fixUpper)a.fixUpper="micro";if("minor"==a.fixLower)a.fixLower="micro"}if(!g){if("micro"==a.fixUpper)a.fixUpper=
"none";if("micro"==a.fixLower)a.fixLower="none"}var i=l(a.fixLower,["major"])?Math.floor(a.min/c)*c:l(a.fixLower,["minor"])?Math.floor(a.min/e)*e:l(a.fixLower,["micro"])?Math.floor(a.min/g)*g:a.min,j=l(a.fixUpper,["major"])?Math.ceil(a.max/c)*c:l(a.fixUpper,["minor"])?Math.ceil(a.max/e)*e:l(a.fixUpper,["micro"])?Math.ceil(a.max/g)*g:a.max;a.useMin&&(b=i);a.useMax&&(d=j);var h=!c||a.useMin&&l(a.fixLower,["major"])?b:Math.ceil(b/c)*c,k=!e||a.useMin&&l(a.fixLower,["major","minor"])?b:Math.ceil(b/e)*
e,p=!g||a.useMin&&l(a.fixLower,["major","minor","micro"])?b:Math.ceil(b/g)*g,m=!c?0:(a.useMax&&l(a.fixUpper,["major"])?Math.round((d-h)/c):Math.floor((d-h)/c))+1,o=!e?0:(a.useMax&&l(a.fixUpper,["major","minor"])?Math.round((d-k)/e):Math.floor((d-k)/e))+1,a=!g?0:(a.useMax&&l(a.fixUpper,["major","minor","micro"])?Math.round((d-p)/g):Math.floor((d-p)/g))+1,s=e?Math.round(c/e):0,t=g?Math.round(e/g):0,u=c?Math.floor(Math.log(c)/Math.LN10):0,v=e?Math.floor(Math.log(e)/Math.LN10):0,q=f/(d-b);isFinite(q)||
(q=1);return{bounds:{lower:i,upper:j,from:b,to:d,scale:q,span:f},major:{tick:c,start:h,count:m,prec:u},minor:{tick:e,start:k,count:o,prec:v},micro:{tick:g,start:p,count:a,prec:0},minorPerMajor:s,microPerMinor:t,scaler:r}};return n.mixin(r,{buildScaler:function(b,d,a,c,e,g){var f={fixUpper:"none",fixLower:"none",natural:!1};if(c){if("fixUpper"in c)f.fixUpper=""+c.fixUpper;if("fixLower"in c)f.fixLower=""+c.fixLower;if("natural"in c)f.natural=Boolean(c.natural)}g=!g||3>g?3:g;if("min"in c)b=c.min;if("max"in
c)d=c.max;c.includeZero&&(0<b&&(b=0),0>d&&(d=0));f.min=b;f.useMin=!0;f.max=d;f.useMax=!0;if("from"in c)b=c.from,f.useMin=!1;if("to"in c)d=c.to,f.useMax=!1;if(d<=b)return k(b,d,f,0,0,0,a);e||(e=d-b);var e=Math.floor(Math.log(e)/Math.LN10),e=c&&"majorTickStep"in c?c.majorTickStep:Math.pow(10,e),i=0,j=0,h;if(c&&"minorTickStep"in c)i=c.minorTickStep;else{do{i=e/10;if(!f.natural||0.9<i)if(h=k(b,d,f,e,i,0,a),h.bounds.scale*h.minor.tick>g)break;i=e/5;if(!f.natural||0.9<i)if(h=k(b,d,f,e,i,0,a),h.bounds.scale*
h.minor.tick>g)break;i=e/2;if(!f.natural||0.9<i)if(h=k(b,d,f,e,i,0,a),h.bounds.scale*h.minor.tick>g)break;return k(b,d,f,e,0,0,a)}while(0)}if(c&&"microTickStep"in c)j=c.microTickStep,h=k(b,d,f,e,i,j,a);else{do{j=i/10;if(!f.natural||0.9<j)if(h=k(b,d,f,e,i,j,a),3<h.bounds.scale*h.micro.tick)break;j=i/5;if(!f.natural||0.9<j)if(h=k(b,d,f,e,i,j,a),3<h.bounds.scale*h.micro.tick)break;j=i/2;if(!f.natural||0.9<j)if(h=k(b,d,f,e,i,j,a),3<h.bounds.scale*h.micro.tick)break;j=0}while(0)}return j?h:k(b,d,f,e,i,
0,a)},buildTicks:function(b,d){var a,c,e,g=b.major.start,f=b.minor.start,i=b.micro.start;if(d.microTicks&&b.micro.tick)a=b.micro.tick,c=i;else if(d.minorTicks&&b.minor.tick)a=b.minor.tick,c=f;else if(b.major.tick)a=b.major.tick,c=g;else return null;var j=1/b.bounds.scale;if(b.bounds.to<=b.bounds.from||isNaN(j)||!isFinite(j)||0>=a||isNaN(a)||!isFinite(a))return null;for(var h=[],k=[],l=[];c<=b.bounds.to+j;){if(Math.abs(g-c)<a/2){e={value:g};if(d.majorLabels)e.label=m(g,b.major.prec,d);h.push(e);g+=
b.major.tick;f+=b.minor.tick}else if(Math.abs(f-c)<a/2){if(d.minorTicks){e={value:f};if(d.minorLabels&&b.minMinorStep<=b.minor.tick*b.bounds.scale)e.label=m(f,b.minor.prec,d);k.push(e)}f+=b.minor.tick}else d.microTicks&&l.push({value:i});i+=b.micro.tick;c+=a}return{major:h,minor:k,micro:l}},getTransformerFromModel:function(b){var d=b.bounds.from,a=b.bounds.scale;return function(b){return(b-d)*a}},getTransformerFromPlot:function(b){var d=b.bounds.from,a=b.bounds.scale;return function(b){return b/a+
d}}})});