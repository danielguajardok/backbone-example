﻿function Dividendo(d,c,e){var a=12,f;var b=c;e=e*a;if(b>1){b=b/100}b=Math.pow(1+b,1/a)-1;f=(b/(1-Math.pow(1+b,-e)));return format(d*f,2)}function format(b,a){str=b.toString();point=str.indexOf(".");if(point>0){str=str.substring(0,Number(point)+Number(a)+1)}return(Number(str))}function formatN(b,a){var c,d;c=b.toString();if((point=c.indexOf("."))>0){c=c+"00000000000000";c=c.substring(0,Number(point)+Number(a)+((a>0)?1:0));if(a>0){c=c.substring(0,c.length-1-a)+","+c.substr(c.length-a)}}d=3+a+((a>0)?1:0);while(c.length>d){c=c.substring(0,c.length-d)+"."+c.substr(c.length-d);d=d+4}return(c)};