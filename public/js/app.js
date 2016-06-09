function config(a,b,c){a.state("home",{url:"/home",views:{main:{templateUrl:"/templates/home.ejs",controller:"MainCtrl",resolve:{postPromise:["posts",function(a){return a.getAll()}]}}}}),a.state("posts",{url:"/posts/{id}",views:{main:{templateUrl:"templates/posts.ejs",controller:"PostsCtrl",resolve:{post:["$stateParams","posts",function(a,b){return b.get(a.id)}]}}}}),a.state("login",{url:"/login",views:{main:{templateUrl:"templates/login.ejs",controller:"AuthCtrl",onEnter:["$state","auth",function(a,b){b.isLoggedIn()&&a.go("home")}]}}}),a.state("register",{url:"/register",views:{main:{templateUrl:"templates/register.ejs",controller:"AuthCtrl",onEnter:["$state","auth",function(a,b){b.isLoggedIn()&&a.go("home")}]}}}),a.state("profile",{url:"/users/{uid}",views:{main:{templateUrl:"templates/profile.ejs",controller:"ProfCtrl",onEnter:["$state","auth",function(a,b){b.isLoggedIn()||a.go("home")}]}}}),a.state("chronodata",{url:"/chronology",views:{main:{templateUrl:"pages/chronology.ejs",controller:"ChronoCtrl",resolve:{chronodataPromise:["chronodatas",function(a){return a.getAll()}]}}}}),a.state("behaviour",{url:"/behaviour",views:{main:{templateUrl:"pages/graph.ejs",controller:"GraphNodeCtrl"}}}),b.otherwise("home")}function config(a,b,c){a.state("home",{url:"/home",views:{main:{templateUrl:"/templates/home.ejs",controller:"MainCtrl",resolve:{postPromise:["posts",function(a){return a.getAll()}]}}}}),a.state("posts",{url:"/posts/{id}",views:{main:{templateUrl:"templates/posts.ejs",controller:"PostsCtrl",resolve:{post:["$stateParams","posts",function(a,b){return b.get(a.id)}]}}}}),a.state("login",{url:"/login",views:{main:{templateUrl:"templates/login.ejs",controller:"AuthCtrl",onEnter:["$state","auth",function(a,b){b.isLoggedIn()&&a.go("home")}]}}}),a.state("register",{url:"/register",views:{main:{templateUrl:"templates/register.ejs",controller:"AuthCtrl",onEnter:["$state","auth",function(a,b){b.isLoggedIn()&&a.go("home")}]}}}),a.state("profile",{url:"/users/{uid}",views:{main:{templateUrl:"templates/profile.ejs",controller:"ProfCtrl",onEnter:["$state","auth",function(a,b){b.isLoggedIn()||a.go("home")}]}}}),a.state("chronodata",{url:"/chronology",views:{main:{templateUrl:"pages/chronology.ejs",controller:"ChronoCtrl",resolve:{chronodataPromise:["chronodatas",function(a){return a.getAll()}]}}}}),a.state("behaviour",{url:"/behaviour",views:{main:{templateUrl:"pages/graph.ejs",controller:"GraphNodeCtrl"}}}),b.otherwise("home")}function auth(a,b){var c={},d="webapp-token";return c.saveToken=function(a){b.localStorage[d]=a},c.getToken=function(){return b.localStorage[d]},c.isLoggedIn=function(){var a=c.getToken();if(a){var d=JSON.parse(b.atob(a.split(".")[1]));return d.exp>Date.now()/1e3}return!1},c.currentUser=function(){if(c.isLoggedIn()){var a=c.getToken(),d=JSON.parse(b.atob(a.split(".")[1]));return d.username}},c.register=function(b){return a.post("/register",b).success(function(a){c.saveToken(a.token)})},c.logIn=function(b){return a.post("/login",b).success(function(a){c.saveToken(a.token)})},c.logOut=function(){b.localStorage.removeItem(d)},c}function AuthCtrl(a,b,c){a.user={},a.register=function(){c.register(a.user).error(function(b){a.error=b}).then(function(){b.go("home")})},a.logIn=function(){c.logIn(a.user).error(function(b){a.error=b}).then(function(){b.go("home")})}}function ChronoCtrl(a,b){a.chronodatas=b.chronodatas;for(var c={title:{text:{headline:"test headline",text:"test text"}},events:[]},d={x:[],y:[],type:"bar"},e=a.chronodatas,f={},g=0;g<e.length;g++){var h=(e[g],new Date(e[g].BreachDate));if(f[h.getFullYear()]?f[h.getFullYear()]+=e[g].Count:f[h.getFullYear()]=e[g].Count,!(e[g].Count<5e6)){var i={media:{},text:{},start_date:{}},j=e[g].Title;j=j.toLowerCase().replace(/ /g,""),j=j.toLowerCase().replace(".com",""),i.media.url="//logo.clearbit.com/"+j+".com?size=150",i.text.headline=e[g].Title,i.text.text=e[g].Description,i.start_date.year=h.getFullYear(),i.start_date.month=h.getMonth()+1,i.start_date.day=h.getDate(),c.events.push(i)}}for(var k in f)d.x.push(k),d.y.push(f[k]);window.timeline=new TL.Timeline("chrono-timeline",c);var l=[d],m={title:"Yearly summary",hovermode:"closest"};Plotly.newPlot("chrono-display-1",l,m,{displayModeBar:!1})}function GraphBarCtrl(a,b,c){a.user={},a.availableUsers=[];var d="/allusers";a.funcAsync=function(e){function f(a){var b=new Date(a);return b.getFullYear()+"-"+("0"+(b.getMonth()+1)).slice(-2)+"-"+("0"+b.getDate()).slice(-2)}function g(a){var b=[],c=[],d=[],e=[],g=[],h=[],i=[],j=[],k=[],l=[],m=[],n=[],o=[],p=[],q=[],r=[],s=[],t=[],u=[],v=[],w=[],x=[];fdelete_y=[],fdelete_text=[];for(var y=0;y<a.length;y++){var z=f(a[y].date);switch(a[y].activity){case"Logon":b.push(z),c.push("Logon/Logoff"),d.push("User "+a[y].user_id+" <br>on "+a[y].pc+" <br>@ "+z);break;case"Logoff":e.push(z),g.push("Logon/Logoff"),h.push("User "+a[y].user_id+" <br>on "+a[y].pc+" <br>@ "+z);break;case"Connect":i.push(z),j.push("Device Access"),k.push("User "+a[y].user_id+" <br>on "+a[y].pc+" <br>"+a[y].file_tree+" <br>@ "+z);break;case"Disconnect":l.push(z),m.push("Device Access"),n.push("User "+a[y].user_id+" <br>on "+a[y].pc+" <br>"+a[y].file_tree+" <br>@ "+z);break;case"File Open":o.push(z),p.push("File Access"),q.push("User "+a[y].user_id+" <br>on "+a[y].pc+" <br>File: "+a[y].filename);break;case"File Write":r.push(z),s.push("File Access"),t.push("User "+a[y].user_id+" <br>on "+a[y].pc+" <br>File: "+a[y].filename);break;case"File Copy":u.push(z),v.push("File Access"),w.push("User "+a[y].user_id+" <br>on "+a[y].pc+" <br>File: "+a[y].filename);break;case"File Delete":x.push(z),fdelete_y.push("File Access"),fdelete_text.push("User "+a[y].user_id+" <br>on "+a[y].pc+" <br>File: "+a[y].filename)}}var A={x:b,y:c,name:"Logon",mode:"markers",marker:{color:"rgb(0, 255, 0)"},text:d,hoverinfo:"text+name",type:"bar"},B={x:e,y:g,name:"Logoff",mode:"markers",marker:{color:"rgb(255, 0, 0)"},text:h,hoverinfo:"text+name",type:"bar"},C={x:i,y:j,name:"Connect",mode:"markers",text:k,hoverinfo:"text+name",type:"bar"},D={x:l,y:m,name:"Disconnect",mode:"markers",text:n,hoverinfo:"text+name",type:"bar"},E={x:o,y:p,name:"File Open",mode:"markers",text:q,hoverinfo:"text+name",type:"bar"},F={x:r,y:s,name:"File Write",mode:"markers",text:t,hoverinfo:"text+name",type:"bar"},G={x:u,y:v,name:"File Copy",mode:"markers",text:w,hoverinfo:"text+name",type:"bar"},H={x:x,y:fdelete_y,name:"File Delete",mode:"markers",text:fdelete_text,hoverinfo:"text+name",type:"bar"},I={title:"Activity chart",hovermode:"closest",barmode:"stack",xaxis:{rangeslider:{}},yaxis:{fixedrange:!0}},J=[A,B,C,D,E,F,G,H];Plotly.newPlot("logon",J,I,{displayModeBar:!1})}b.get(d).then(function(b){a.availableUsers=b.data,console.log(b)},function(){console.log("Error")}),a.reloadGraph=function(){for(var d=["/userdata/logon/"+a.user.selected,"/userdata/device/"+a.user.selected,"/userdata/file/"+a.user.selected],e=[],f=0;f<d.length;f++)e.push(b.get(d[f]));var h=[];c.all(e).then(function(a){h=h.concat(a[0].data,a[1].data,a[2].data),g(h)},function(a){console.log("Errors")})}}}function GraphCtrl(a,b,c){function d(a){var b=new Date(a);return b.getFullYear()+"-"+("0"+(b.getMonth()+1)).slice(-2)+"-"+("0"+b.getDate()).slice(-2)+" "+b.getHours()+":"+b.getMinutes()+":"+b.getSeconds()}function e(a){var b=[],c=[],e=[],f=[],g=[],h=[],i=[],j=[],k=[],l=[],m=[],n=[],o=[],p=[],q=[],r=[],s=[],t=[],u=[],v=[],w=[],x=[];fdelete_y=[],fdelete_text=[];for(var y=0;y<a.length;y++){var z=d(a[y].date);switch(a[y].activity){case"Logon":b.push(z),c.push("Logon/Logoff"),e.push("User "+a[y].user_id+" <br>on "+a[y].pc+" <br>@ "+z);break;case"Logoff":f.push(z),g.push("Logon/Logoff"),h.push("User "+a[y].user_id+" <br>on "+a[y].pc+" <br>@ "+z);break;case"Connect":i.push(z),j.push("Device Access"),k.push("User "+a[y].user_id+" <br>on "+a[y].pc+" <br>"+a[y].file_tree+" <br>@ "+z);break;case"Disconnect":l.push(z),m.push("Device Access"),n.push("User "+a[y].user_id+" <br>on "+a[y].pc+" <br>"+a[y].file_tree+" <br>@ "+z);break;case"File Open":o.push(z),p.push("File Access"),q.push("User "+a[y].user_id+" <br>on "+a[y].pc+" <br>File: "+a[y].filename);break;case"File Write":r.push(z),s.push("File Access"),t.push("User "+a[y].user_id+" <br>on "+a[y].pc+" <br>File: "+a[y].filename);break;case"File Copy":u.push(z),v.push("File Access"),w.push("User "+a[y].user_id+" <br>on "+a[y].pc+" <br>File: "+a[y].filename);break;case"File Delete":x.push(z),fdelete_y.push("File Access"),fdelete_text.push("User "+a[y].user_id+" <br>on "+a[y].pc+" <br>File: "+a[y].filename)}}var A={x:b,y:c,name:"Logon",mode:"markers",marker:{color:"rgb(0, 255, 0)"},text:e,hoverinfo:"text+name",type:"scatter"},B={x:f,y:g,name:"Logoff",mode:"markers",marker:{color:"rgb(255, 0, 0)"},text:h,hoverinfo:"text+name",type:"scatter"},C={x:i,y:j,name:"Connect",mode:"markers",text:k,hoverinfo:"text+name",type:"scatter"},D={x:l,y:m,name:"Disconnect",mode:"markers",text:n,hoverinfo:"text+name",type:"scatter"},E={x:o,y:p,name:"File Open",mode:"markers",text:q,hoverinfo:"text+name",type:"scatter"},F={x:r,y:s,name:"File Write",mode:"markers",text:t,hoverinfo:"text+name",type:"scatter"},G={x:u,y:v,name:"File Copy",mode:"markers",text:w,hoverinfo:"text+name",type:"scatter"},H={x:x,y:fdelete_y,name:"File Delete",mode:"markers",text:fdelete_text,hoverinfo:"text+name",type:"scatter"},I={title:"Activity chart",hovermode:"closest"},J=[A,B,C,D,E,F,G,H];Plotly.newPlot("logon",J,I,{displayModeBar:!1})}a.user={},a.availableUsers=[];var f="/allusers";a.funcAsync=function(c){b.get(f).then(function(b){a.availableUsers=b.data,console.log(b)},function(){console.log("Error")})},a.reloadGraph=function(){for(var d=["/userdata/logon/"+a.user.selected,"/userdata/device/"+a.user.selected,"/userdata/file/"+a.user.selected],f=[],g=0;g<d.length;g++)f.push(b.get(d[g]));var h=[];c.all(f).then(function(a){h=h.concat(a[0].data,a[1].data,a[2].data),e(h)},function(a){console.log("Errors")})}}function GraphNodeCtrl(a,b){function c(a){d3.select(a).selectAll("*").remove()}function d(b,c){var d=h+b+g;d3.json(d,function(b,d){var f=new Date(d.startDate),g=new Date(d.endDate),h=new Date(d.endDate);h.setDate(h.getDate()-7),c===i?(a.leftGraphMinDate=f,a.leftGraphDateFrom=h,a.leftGraphMaxDate=g,a.leftGraphDateTo=g,a.$apply(function(){a.leftGraphDisplay=!1}),e(a.dept.selected,c)):(a.rightGraphMinDate=f,a.rightGraphDateFrom=h,a.rightGraphMaxDate=g,a.rightGraphDateTo=g,a.$apply(function(){a.rightGraphDisplay=!1}),e(a.compareDept.selected,c))})}function e(b,d){var e;e=d===i?h+b+"/"+a.leftGraphDateFrom+"/"+a.leftGraphDateTo:h+b+"/"+a.rightGraphDateFrom+"/"+a.rightGraphDateTo,d3.json(e,function(b,e){function f(){q.attr("d",function(a){var b=a.target.x-a.source.x,c=a.target.y-a.source.y,d=Math.sqrt(b*b+c*c);return"M"+a.source.x+","+a.source.y+"A"+d+","+d+" 0 0,1 "+a.target.x+","+a.target.y}),r.attr("transform",function(a){return"translate("+a.x+","+a.y+")"})}function g(){p.attr("transform","translate("+d3.event.translate+") scale("+d3.event.scale+")"),p.selectAll(".legend").attr("transform",function(a,b){return"translate(0,"+20*b+d3.event.translate+") scale("+20*b+d3.event.scale+")"})}console.log(e);var h={},i=0,j="";null===e[0]&&void 0===e[0]||(j=e[0].td),e.forEach(function(a){a.target=h[a.target]||(h[a.target]={name:"",group:a.td})}),e.forEach(function(a){a.source=h[a.source]||(h[a.source]={name:"",group:a.sd}),i=Math.max(i,a.value)}),c(d);var k=d3.select(d).style("width").split("px").shift(),l=.8*k,m=d3.scale.category20(),n=d3.layout.force().nodes(d3.values(h)).links(e).size([k,l]).linkDistance(function(a){return i-a.value}).charge(-300).on("tick",f).start(),o=d3.behavior.zoom().scaleExtent([.1,10]).scale(1).on("zoom",g),p=d3.select(d).append("svg").attr("width",k).attr("height",l).attr("pointer-events","all").append("svg:g").call(o).append("svg:g");p.append("svg:rect").attr("width",k).attr("height",l).attr("fill","none"),p.append("svg:defs").selectAll("marker").data(["end"]).enter().append("svg:marker").attr("id",String).attr("viewBox","0 -5 10 10").attr("refX",15).attr("refY",-1.5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto").append("svg:path").attr("d","M0,-5L10,0L0,5");var q=p.append("svg:g").selectAll("path").data(n.links()).enter().append("svg:path").attr("class","link").attr("marker-end","url(#end)"),r=p.selectAll(".node").data(n.nodes()).enter().append("g").attr("class","node").style("fill",function(a){return m(a.group)}).call(n.drag);r.append("circle").attr("r",function(a){return 10});var s=p.selectAll(".legend").data(m.domain()).enter().append("g").attr("class","legend").attr("transform",function(a,b){return"translate(0,"+20*b+")"});s.append("rect").attr("x",k-18).attr("width",18).attr("height",18).style("fill",m),s.append("text").attr("x",k-24).attr("y",9).attr("dy",".35em").style("text-anchor","end").text(function(b){var c=a.availableDept[b-1]||"External";return c})})}a.dept={},a.compareDept={},a.availableDept=[],a.leftGraphDisplay=!0,a.rightGraphDisplay=!0;var f="/alldept",g="/getdate",h="/emaildata/",i="#nodeGraph",j="#compareNodeGraph";a.funcAsync=function(c){b.get(f).then(function(b){a.availableDept=b.data,console.log(b)},function(){console.log("Error")})},a.reloadGraph=function(){d(a.dept.selected,i)},a.reloadCompareGraph=function(){d(a.compareDept.selected,j)},a.filterLeftGraphByDate=function(){a.leftGraphDateFrom>a.leftGraphDateTo||e(a.dept.selected,i)},a.filterRightGraphByDate=function(){a.rightGraphDateFrom>a.rightGraphDateTo||e(a.compareDept.selected,j)}}function MainCtrl(a,b,c){a.posts=b.posts,a.isLoggedIn=c.isLoggedIn,a.addPost=function(){a.title&&""!==a.title&&(b.create({title:a.title,link:a.link}),a.title="",a.link="")},a.incrementUpvotes=function(a){b.upvote(a)}}function NavCtrl(a,b,c){a.isLoggedIn=c.isLoggedIn,a.currentUser=c.currentUser,a.logOut=c.logOut}function PostsCtrl(a,b,c,d){a.post=c,a.isLoggedIn=d.isLoggedIn,a.addComment=function(){""!==a.body&&(b.addComment(c._id,{body:a.body,author:"user"}).success(function(b){a.post.comments.push(b)}),a.body="")},a.incrementUpvotes=function(a){b.upvoteComment(c,a)}}function ProfCtrl(a,b,c){a.updateProfile=function(){""!==a.firstName&&(user.firstName=a.firstName),""!==a.lastName&&(user.lastName=a.lastName),""!==a.email&&(user.email=a.email),""!==a.description&&(user.description=a.description)}}function chronodatas(a,b){var c={chronodatas:[]};return c.getAll=function(){return a.get("/chronodatas").success(function(a){angular.copy(a,c.chronodatas)})},c}function posts(a,b){var c={posts:[]};return c.getAll=function(){return a.get("/posts").success(function(a){angular.copy(a,c.posts)})},c.create=function(d){return a.post("/posts",d,{headers:{Authorization:"Bearer "+b.getToken()}}).success(function(a){c.posts.push(a)})},c.upvote=function(c){return a.put("/posts/"+c._id+"/upvote",null,{headers:{Authorization:"Bearer "+b.getToken()}}).success(function(a){c.upvotes+=1})},c.get=function(b){return a.get("/posts/"+b).then(function(a){return a.data})},c.addComment=function(c,d){return a.post("/posts/"+c+"/comments",d,{headers:{Authorization:"Bearer "+b.getToken()}})},c.upvoteComment=function(c,d){return a.put("/posts/"+c._id+"/comments/"+d._id+"/upvote",null,{headers:{Authorization:"Bearer "+b.getToken()}}).success(function(a){d.upvotes+=1})},c}var app=angular.module("webapps",["ui.router","ui.select","ngSanitize","fullPage.js","ngMaterial"]);config.$inject=["$stateProvider","$urlRouterProvider","$locationProvider"],angular.module("webapps").config(config);var app=angular.module("webapps",["ui.router","ui.select","ngSanitize","fullPage.js","ngMaterial"]);config.$inject=["$stateProvider","$urlRouterProvider","$locationProvider"],angular.module("webapps").config(config),auth.$inject=["$http","$window"],angular.module("webapps").factory("auth",auth),AuthCtrl.$inject=["$scope","$state","auth"],angular.module("webapps").controller("AuthCtrl",AuthCtrl),ChronoCtrl.$inject=["$scope","chronodatas"],angular.module("webapps").controller("ChronoCtrl",ChronoCtrl),GraphBarCtrl.$inject=["$scope","$http","$q"],angular.module("webapps").controller("GraphBarCtrl",GraphBarCtrl),GraphCtrl.$inject=["$scope","$http","$q"],angular.module("webapps").controller("GraphCtrl",GraphCtrl),GraphNodeCtrl.$inject=["$scope","$http"],angular.module("webapps").controller("GraphNodeCtrl",GraphNodeCtrl),MainCtrl.$inject=["$scope","posts","auth"],angular.module("webapps").controller("MainCtrl",MainCtrl),NavCtrl.$inject=["$scope","$state","auth"],angular.module("webapps").controller("NavCtrl",NavCtrl),PostsCtrl.$inject=["$scope","posts","post","auth"],angular.module("webapps").controller("PostsCtrl",PostsCtrl),ProfCtrl.$inject=["$scope","$state","auth"],angular.module("webapps").controller("ProfCtrl",ProfCtrl),chronodatas.$inject=["$http","auth"],angular.module("webapps").factory("chronodatas",chronodatas),posts.$inject=["$http","auth"],angular.module("webapps").factory("posts",posts);