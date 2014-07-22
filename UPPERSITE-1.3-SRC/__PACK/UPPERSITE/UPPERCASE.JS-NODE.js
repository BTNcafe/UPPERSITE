global.NODE_CONFIG=NODE_CONFIG={},global.CPU_CLUSTERING=CPU_CLUSTERING=METHOD(function(o){"use strict";var e=require("cluster");return{run:function(t){RUN(e.isMaster?function(){var o=function(){var o=e.fork();o.on("message",function(t){EACH(e.workers,function(e){e!==o&&e.send(t)})})};REPEAT(require("os").cpus().length,function(){o()}),e.on("exit",function(e,t,n){console.log("[UPPERCASE.JS-CPU_CLUSTERING] WORKER #"+e.id+" (PID:"+e.process.pid+") died. ("+(void 0!==n?n:t)+"). restarting..."),o()})}:function(){var n,E=e.worker.id,i=e.worker.process.pid,r={},a=function(o,e){var t=r[o];void 0!==t&&EACH(t,function(o){o(e)})};process.on("message",function(o){void 0!==o&&a(o.methodName,o.data)}),n=function(o,e){var t=r[o];void 0===t&&(t=r[o]=[]),t.push(e)},n("__SHARED_STORE_SAVE",SHARED_STORE.save),n("__SHARED_STORE_REMOVE",SHARED_STORE.remove),n("__CPU_SHARED_STORE_SAVE",CPU_SHARED_STORE.save),n("__CPU_SHARED_STORE_REMOVE",CPU_SHARED_STORE.remove),t({id:E,pid:i},o.on=n,function(o){delete r[o]},o.broadcast=function(o){process.send(o)}),console.log("[32m[UPPERCASE.JS-CPU_CLUSTERING] RUNNING WORKER... (ID:"+E+", PID:"+i+")[0m")})}}}),global.CPU_SHARED_STORE=CPU_SHARED_STORE=CLASS(function(o){"use strict";var e,t,n,E={},i={};return o.save=e=function(o,e){var t=o.fullKey,n=o.value,r=o.removeAfterSeconds,a=o.isWaitRemove;E[t]=n,a===!0&&void 0!==i[t]&&(i[t].remove(),delete i[t]),void 0!==r&&(i[t]=DELAY(r,e))},o.get=t=function(o){return E[o]},o.remove=n=function(o){delete E[o],void 0!==i[o]&&(i[o].remove(),delete i[o])},{init:function(e,t,n){var E,i,r,a;E=function(o){return n+"."+o},t.save=i=function(e){var t=e.key,n=E(t),i=e.value,r=e.removeAfterSeconds;o.save({fullKey:n,value:i,removeAfterSeconds:r},function(){a(t)}),void 0!==CPU_CLUSTERING.broadcast&&CPU_CLUSTERING.broadcast({methodName:"__CPU_SHARED_STORE_SAVE",data:{fullKey:n,value:i,isWaitRemove:void 0!==r}})},t.get=r=function(e){return o.get(E(e))},t.remove=a=function(e){var t=E(e);o.remove(t),void 0!==CPU_CLUSTERING.broadcast&&CPU_CLUSTERING.broadcast({methodName:"__CPU_SHARED_STORE_REMOVE",data:t})}}}}),global.SERVER_CLUSTERING=SERVER_CLUSTERING=METHOD(function(o){"use strict";return{run:function(e,t){var n,E,i,r=require("os"),a=e.hosts,R=e.port,u=r.networkInterfaces(),S=[],d={},c={};EACH(u,function(o){return EACH(o,function(o){var e=o.address;return"IPv4"===o.family&&o.internal===!1&&(S.push(e),CHECK_IS_EXISTS({data:a,value:e})===!0)?(n=e,!1):void 0})}),void 0===n?console.log("[UPPERCASE.JS-SERVER_CLUSTERING] NOT EXISTS MY HOST. (CLUSTER SERVER HOSTS:",a,", THIS SERVER HOSTS:",S):(E=function(o){CONNECT_TO_SOCKET_SERVER({host:o,port:R},function(e,t){console.log("[UPPERCASE.JS-SERVER_CLUSTERING] CONNECTED CLUSTERING SERVER. (HOST:"+o+")"),t({methodName:"__BOOTED",data:{host:n}}),c[o]=function(o){var e=o.methodName,n=o.data;t({methodName:"SERVER_CLUSTERING."+e,data:n})},e("__DISCONNECTED",function(){delete c[o]})})},EACH(a,function(o){o!==n&&E(o)}),SOCKET_SERVER(R,function(o,e){e("__BOOTED",function(o){var e=o.host;void 0===c[e]&&E(e)}),EACH(d,function(o,t){EACH(o,function(o){e("SERVER_CLUSTERING."+t,o)})})}),i=function(o,e){var t=d[o];void 0===t&&(t=d[o]=[]),t.push(e)},i("__SHARED_STORE_SAVE",function(o){SHARED_STORE.save(o),void 0!==CPU_CLUSTERING.broadcast&&CPU_CLUSTERING.broadcast({methodName:"__SHARED_STORE_SAVE",data:o})}),i("__SHARED_STORE_REMOVE",function(o){SHARED_STORE.remove(o),void 0!==CPU_CLUSTERING.broadcast&&CPU_CLUSTERING.broadcast({methodName:"__SHARED_STORE_REMOVE",data:o})}),t(n,o.on=i,function(o){delete d[o]},o.broadcast=function(o){EACH(c,function(e){e(o)})}),console.log("[36m[UPPERCASE.JS-SERVER_CLUSTERING] RUNNING CLUSTERING SERVER... (THIS SERVER HOST:"+n+", PORT:"+R+")[0m"))}}}),global.SHARED_STORE=SHARED_STORE=CLASS(function(o){"use strict";var e,t,n,E={},i={};return o.save=e=function(o,e){var t=o.fullKey,n=o.value,r=o.removeAfterSeconds,a=o.isWaitRemove;E[t]=n,a===!0&&void 0!==i[t]&&(i[t].remove(),delete i[t]),void 0!==r&&(i[t]=DELAY(r,e))},o.get=t=function(o){return E[o]},o.remove=n=function(o){delete E[o],void 0!==i[o]&&(i[o].remove(),delete i[o])},{init:function(e,t,n){var E,i,r,a;E=function(o){return n+"."+o},t.save=i=function(e){var t=e.key,n=E(t),i=e.value,r=e.removeAfterSeconds;o.save({fullKey:n,value:i,removeAfterSeconds:r},function(){a(t)}),void 0!==CPU_CLUSTERING.broadcast&&CPU_CLUSTERING.broadcast({methodName:"__SHARED_STORE_SAVE",data:{fullKey:n,value:i,isWaitRemove:void 0!==r}}),void 0!==SERVER_CLUSTERING.broadcast&&SERVER_CLUSTERING.broadcast({methodName:"__SHARED_STORE_SAVE",data:{fullKey:n,value:i,isWaitRemove:void 0!==r}})},t.get=r=function(e){return o.get(E(e))},t.remove=a=function(e){var t=E(e);o.remove(t),void 0!==CPU_CLUSTERING.broadcast&&CPU_CLUSTERING.broadcast({methodName:"__SHARED_STORE_REMOVE",data:t}),void 0!==SERVER_CLUSTERING.broadcast&&SERVER_CLUSTERING.broadcast({methodName:"__SHARED_STORE_REMOVE",data:t})}}}}),global.CONNECT_TO_SOCKET_SERVER=CONNECT_TO_SOCKET_SERVER=METHOD({run:function(o,e){"use strict";var t,n,E,i,r,a,R,u,S,d=o.host,c=o.port,_=require("net"),s={},v="";CHECK_IS_DATA(e)!==!0?t=e:(t=e.success,n=e.error),S=function(o,e){var t=s[o];void 0!==t&&EACH(t,function(t){t(e,function(e){void 0!==u&&u({methodName:"__CALLBACK_"+o,data:e})})})},E=_.connect({host:d,port:c},function(){i=!0,t(a=function(o,e){var t=s[o];void 0===t&&(t=s[o]=[]),t.push(e)},R=function(o,e){var t=s[o];void 0!==t&&(void 0!==e?REMOVE({data:t,value:e}):delete s[o])},u=function(o,e){var t=o.methodName;E.write(STRINGIFY(o)+"\n"),void 0!==e&&a("__CALLBACK_"+t,function(o){e(o),R("__CALLBACK_"+t)})},function(){r=!0,E.end()})}),E.on("data",function(o){var e,t,n;for(v+=o.toString();-1!==(t=v.indexOf("\n"));)e=v.substring(0,t),n=PARSE_STR(e),void 0!==n&&S(n.methodName,n.data),v=v.substring(t+1)}),E.on("close",function(){r!==!0&&S("__DISCONNECTED")}),E.on("error",function(o){i!==!0?(console.log("[UPPERCASE.JS-CONNECT_TO_SOCKET_SERVER] CONNECT TO SOCKET SERVER FAILED:",o),void 0!==n&&n(o)):S("__ERROR",o)})}}),global.SHA1=SHA1=METHOD({run:function(o){"use strict";var e=o.key,t=o.password,n=require("crypto");return n.createHmac("sha1",e).update(t).digest("hex")}}),global.DELETE=DELETE=METHOD({run:function(o,e){"use strict";REQUEST(COMBINE_DATA({origin:o,extend:{method:"DELETE"}}),e)}}),global.GET=GET=METHOD({run:function(o,e){"use strict";REQUEST(COMBINE_DATA({origin:o,extend:{method:"GET"}}),e)}}),global.POST=POST=METHOD({run:function(o,e){"use strict";REQUEST(COMBINE_DATA({origin:o,extend:{method:"POST"}}),e)}}),global.PUT=PUT=METHOD({run:function(o,e){"use strict";REQUEST(COMBINE_DATA({origin:o,extend:{method:"PUT"}}),e)}}),global.REQUEST=REQUEST=METHOD({run:function(o,e){"use strict";var t,n,E,i=require("http"),r=void 0===o.host?"localhost":o.host,a=void 0===o.port?80:o.port,R=o.method,u=o.uri,S=void 0!==o.data?"data="+encodeURIComponent(STRINGIFY(o.data)):o.paramStr;CHECK_IS_DATA(e)!==!0?t=e:(t=e.success,n=e.error),S=(void 0===S?"":S+"&")+Date.now(),R=R.toUpperCase(),"GET"===R?E=i.get({hostname:r,port:a,path:"/"+u+"?"+S},function(o){o.setEncoding("utf-8"),o.on("data",function(o){t(o)})}):(E=i.request({hostname:r,port:a,path:"/"+u,method:R},function(o){o.setEncoding("utf-8"),o.on("data",function(o){t(o)})}),E.write(S),E.end()),E.on("error",function(e){console.log("[UPPERCASE.JS-NODE] REQUEST FAILED:",o,e),void 0!==n&&n(e)})}}),global.SOCKET_SERVER=SOCKET_SERVER=METHOD({run:function(o,e){"use strict";var t=require("net"),n=t.createServer(function(o){var t,n,E,i,r={},a="",R=function(o,e){var t=r[o];void 0!==t&&EACH(t,function(t){t(e,function(e){i({methodName:"__CALLBACK_"+o,data:e})})})};o.on("data",function(o){var e,t,n;for(a+=o.toString();-1!==(t=a.indexOf("\n"));)e=a.substring(0,t),n=PARSE_STR(e),void 0!==n&&R(n.methodName,n.data),a=a.substring(t+1)}),o.on("close",function(){t!==!0&&R("__DISCONNECTED"),r=void 0}),o.on("error",function(o){R("__ERROR",o)}),e({ip:o.remoteAddress},n=function(o,e){var t=r[o];void 0===t&&(t=r[o]=[]),t.push(e)},E=function(o,e){var t=r[o];void 0!==t&&(void 0!==e?REMOVE({data:t,value:e}):delete r[o])},i=function(e,t){var i=e.methodName;o.write(STRINGIFY(e)+"\n"),void 0!==t&&n("__CALLBACK_"+i,function(o){t(o),E("__CALLBACK_"+i)})},function(){t=!0,o.end()})});n.listen(o),console.log("[UPPERCASE.JS-SOCKET_SERVER] RUNNING SOCKET SERVER... (PORT:"+o+")")}}),global.WEB_SERVER=WEB_SERVER=METHOD({run:function(o,e){"use strict";var t=require("http"),n=require("querystring");t.createServer(function(o,t){var E,i=o.headers,r=o.url,a=o.method.toUpperCase(),R=i["X-Forwarded-For"],u=[];void 0===R&&(R=o.connection.remoteAddress),-1!=r.indexOf("?")&&(E=r.substring(r.indexOf("?")+1),r=r.substring(0,r.indexOf("?"))),r=r.substring(1),NEXT([function(e){"GET"===a?e():(o.on("data",function(o){void 0===E&&(E=""),E+=o}),o.on("end",function(){e()}))},function(){return function(){e({headers:i,uri:r,method:a,params:n.parse(E),ip:R,cookies:PARSE_COOKIE_STR(i.cookie),nativeReq:o},function(o){var e=void 0===o||void 0===o.statusCode?200:o.statusCode,n=void 0===o||void 0===o.headers?{}:o.headers,E=void 0===o?void 0:o.contentType,i=void 0===o?void 0:o.content,r=void 0===o||void 0===o.encoding?"utf-8":r,a=void 0===o?void 0:o.cacheTime;void 0!==E&&(n["Content-Type"]=E),void 0!==a&&(n.ETag=a,n["Last-Modified"]=new Date(a).toUTCString()),t.writeHead(e,n),t.end(i)},function(o){u.push(o)})}}]),o.on("close",function(){EACH(u,function(o){o()})})}).listen(o),console.log("[UPPERCASE.JS-WEB_SERVER] RUNNING WEB SERVER... (PORT:"+o+")")}}),global.PARSE_COOKIE_STR=PARSE_COOKIE_STR=METHOD({run:function(o){"use strict";var e,t={};return void 0!==o&&(e=o.split(";"),EACH(e,function(o){var e=o.split("=");t[e[0].trim()]=decodeURIComponent(e[1])})),t}}),global.CREATE_COOKIE_STR_ARRAY=CREATE_COOKIE_STR_ARRAY=METHOD({run:function(o){"use strict";var e=[];return EACH(o,function(o,t){e.push(t+"="+encodeURIComponent(o))}),e}});