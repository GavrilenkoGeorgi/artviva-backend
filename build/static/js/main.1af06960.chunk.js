(this["webpackJsonpbloglist-frontend"]=this["webpackJsonpbloglist-frontend"]||[]).push([[0],{68:function(e,t,a){e.exports=a(97)},96:function(e,t,a){},97:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(25),s=a.n(c),l=a(6),u=a(18),o=a(22),i=a(103),m=Object(l.b)((function(e){return{notification:e.notification}}))((function(e){var t=e.notification;return r.a.createElement(r.a.Fragment,null,t&&r.a.createElement(i.a,{className:"my-3",variant:"success"},t))})),f=function(e,t){return function(a){a({type:"SET_NOTIFICATION",data:e}),setTimeout((function(){a({type:"SET_NOTIFICATION",data:null})}),1e3*t)}},d=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"SET_NOTIFICATION":return e=t.data;case"RESET":return t.data;default:return e}},p=a(5),E=a.n(p),b=a(99),g={setNotification:f},v=Object(l.b)((function(e){return{user:e.user}}),g)((function(e){var t=e.setNotification;return r.a.createElement(r.a.Fragment,null,r.a.createElement(b.a,{onClick:function(e){return E.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:e.preventDefault();try{window.localStorage.removeItem("loggedUserJSON"),document.location.href="/",t("Successfully logged out.",3)}catch(n){t(n.message,3)}case 2:case"end":return a.stop()}}))},type:"button","data-cy":"logoutBtn",variant:"outline-secondary",className:"mx-3"},"Logout"))})),y=a(102),h=a(104),O={setNotification:f},N=Object(l.b)((function(e){return{user:e.user}}),O)((function(e){var t=e.user;return r.a.createElement("header",null,r.a.createElement(y.a,{collapseOnSelect:!0,expand:"lg",bg:"light"},r.a.createElement(y.a.Brand,{href:"/"},"Blog app"),r.a.createElement(y.a.Toggle,{"aria-controls":"responsive-navbar-nav"}),r.a.createElement(y.a.Collapse,{id:"responsive-navbar-nav"},r.a.createElement(h.a,{className:"ml-auto pl-2 d-flex align-items-left"},r.a.createElement(u.b,{to:"/users",className:"d-flex align-items-center"},r.a.createElement(h.a.Link,{href:"#",as:"span"},"Users")),r.a.createElement(u.b,{to:"/blogs",className:"d-flex align-items-center"},r.a.createElement(h.a.Link,{href:"#",as:"span"},"Blogs")),r.a.createElement(h.a.Link,{className:"d-flex justify-content-end",href:"#",as:"span"},t?r.a.createElement(r.a.Fragment,null,r.a.createElement("em",{className:"d-flex align-items-center"},t.username," logged in"),r.a.createElement(v,null)):r.a.createElement(u.b,{to:"/login"},"login"))))))})),w=a(7),x=a(38),j=function(e){var t=Object(n.useState)(""),a=Object(x.a)(t,2),r=a[0],c=a[1];return{type:e,value:r,onChange:function(e){c(e.target.value)},reset:function(){c("")}}},S=a(67),L=a(66),I=a(14),T=a.n(I),B="/api/blogs",C=null,k=function(){var e;return E.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,E.a.awrap(T.a.get(B));case 2:return e=t.sent,t.abrupt("return",e.data);case 4:case"end":return t.stop()}}))},F=function(e){C="bearer ".concat(e)},_=function(e){var t,a;return E.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return t={headers:{Authorization:C}},n.next=3,E.a.awrap(T.a.post(B,e,t));case 3:return a=n.sent,n.abrupt("return",a.data);case 5:case"end":return n.stop()}}))},U=function(e){var t,a;return E.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return t={headers:{Authorization:C}},a=T.a.delete("".concat(B,"/").concat(e),t),n.abrupt("return",a.then((function(e){return e.data})));case 3:case"end":return n.stop()}}))},D=function(e,t){var a,n;return E.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:return a={headers:{Authorization:C}},r.next=3,E.a.awrap(T.a.post("".concat(B,"/").concat(e,"/comments"),t,a));case 3:return n=r.sent,r.abrupt("return",n.data);case 5:case"end":return r.stop()}}))},R=function(e){var t,a;return E.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return t={headers:{Authorization:C}},a=T.a.put("".concat(B,"/").concat(e.id),e,t),n.abrupt("return",a.then((function(e){return e.data})));case 3:case"end":return n.stop()}}))},G=function(){return function(e){var t;return E.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,E.a.awrap(k());case 2:t=a.sent,e({type:"INIT_BLOGS",data:t});case 4:case"end":return a.stop()}}))}},A=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"CREATE_BLOG":return[].concat(Object(L.a)(e),[t.data]);case"DELETE_BLOG":return e.filter((function(e){return e.id!==t.data}));case"INIT_BLOGS":return t.data;case"COMMENT":var a=t.data.blog,n=e.find((function(e){return e.id===a})),r=Object(S.a)({},n,{comments:n.comments.concat(t.data)});return e.map((function(e){return e.id!==a?e:r}));case"ADD_LIKE":var c=t.data;return c.likes++,e.map((function(e){return e.id!==t.data.id?e:c}));default:return e}},J=a(100),z=a(101),M={createBlog:function(e){return function(t){var a;return E.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,E.a.awrap(_(e));case 2:a=n.sent,t({type:"CREATE_BLOG",data:a});case 4:case"end":return n.stop()}}))}},setNotification:f},q=Object(l.b)((function(e){return{user:e.user}}),M)((function(e){var t=j("text"),a=t.reset,c=Object(w.a)(t,["reset"]),s=j("text"),l=s.reset,u=Object(w.a)(s,["reset"]),o=j("text"),i=o.reset,m=Object(w.a)(o,["reset"]);Object(n.useEffect)((function(){F(e.user.token)}),[e.user]);return r.a.createElement(J.a,null,r.a.createElement("h2",null,"Blog add form"),r.a.createElement(z.a,{"data-cy":"addBlogForm",onSubmit:function(t){t.preventDefault();var n={title:c.value,author:u.value,url:m.value,likes:0};e.createBlog(n).then((function(){e.setNotification("Blog added",5)})).catch((function(t){var a=JSON.parse(t.request.responseText);e.setNotification(a.error,5)})),a(""),l(""),i("")}},r.a.createElement(z.a.Group,null,r.a.createElement(z.a.Label,null,"Title"),r.a.createElement(z.a.Control,Object.assign({"data-cy":"newTitle"},c)),r.a.createElement(z.a.Label,null,"Author"),r.a.createElement(z.a.Control,Object.assign({"data-cy":"newAuthor"},u)),r.a.createElement(z.a.Label,null,"Url"),r.a.createElement(z.a.Control,Object.assign({"data-cy":"newUrl"},m)),r.a.createElement(b.a,{className:"my-3","data-cy":"createBlogBtn",type:"submit",variant:"primary"},"create"))))})),K=function(e){var t;return E.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,E.a.awrap(T.a.post("/api/login",e));case 2:return t=a.sent,a.abrupt("return",t.data);case 4:case"end":return a.stop()}}))},P=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"LOGIN":case"SET_USER_FROM_LS":return t.user;default:return e}},Y={login:function(e){var t=e.email,a=e.password;return function(e){var n;return E.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,E.a.awrap(K({email:t,password:a}));case 2:n=r.sent,e({type:"LOGIN",user:n});case 4:case"end":return r.stop()}}))}},setNotification:f},H=Object(l.b)((function(e){return{user:e.user}}),Y)((function(e){var t=j("email"),a=t.reset,n=Object(w.a)(t,["reset"]),c=j("password"),s=c.reset,l=Object(w.a)(c,["reset"]);return r.a.createElement(r.a.Fragment,null,r.a.createElement("h4",null,"Login into application"),r.a.createElement(z.a,{"data-cy":"loginForm",onSubmit:function(t){var r;return E.a.async((function(c){for(;;)switch(c.prev=c.next){case 0:t.preventDefault(),r={email:n.value,password:l.value},e.login(r).then((function(){e.setNotification("Logged in successfully",5)})).catch((function(e){console.log("Error",e)})),a(""),s("");case 5:case"end":return c.stop()}}))}},r.a.createElement(z.a.Group,null,r.a.createElement(z.a.Label,null,"email"),r.a.createElement(z.a.Control,Object.assign({name:"email","data-cy":"emailInput"},n)),r.a.createElement(z.a.Label,null,"password"),r.a.createElement(z.a.Control,Object.assign({name:"password","data-cy":"passwordInput"},l)),r.a.createElement(b.a,{className:"my-3",type:"submit",variant:"primary","data-cy":"loginBtn"},"login"))))})),V=function(){var e;return E.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,E.a.awrap(T.a.get("/api/users"));case 2:return e=t.sent,t.abrupt("return",e.data);case 4:case"end":return t.stop()}}))},W=function(e){var t;return E.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,E.a.awrap(T.a.post("/api/users",e));case 2:return t=a.sent,a.abrupt("return",t.data);case 4:case"end":return a.stop()}}))},Q={setNotification:f},X=Object(l.b)((function(e){return{user:e.user}}),Q)((function(e){var t=j("text"),a=t.reset,n=Object(w.a)(t,["reset"]),c=j("email"),s=c.reset,l=Object(w.a)(c,["reset"]),u=j("password"),o=u.reset,i=Object(w.a)(u,["reset"]);return r.a.createElement(r.a.Fragment,null,r.a.createElement("h4",null,"New user sign up"),r.a.createElement(z.a,{"data-cy":"signUpForm",onSubmit:function(t){var r;return E.a.async((function(c){for(;;)switch(c.prev=c.next){case 0:t.preventDefault(),r={email:l.value,username:n.value,password:i.value},W(r).then((function(){e.setNotification("Signup successful",5),a(""),s(""),o(""),document.location.href="/"})).catch((function(t){var a=JSON.parse(t.request.responseText);e.setNotification(a.error,5)}));case 3:case"end":return c.stop()}}))}},r.a.createElement(z.a.Group,null,r.a.createElement(z.a.Label,null,"email"),r.a.createElement(z.a.Control,Object.assign({name:"email","data-cy":"inputRegEmail"},l)),r.a.createElement(z.a.Label,null,"username"),r.a.createElement(z.a.Control,Object.assign({name:"name","data-cy":"inputUserName"},n)),r.a.createElement(z.a.Label,null,"password"),r.a.createElement(z.a.Control,Object.assign({name:"password","data-cy":"inputRegPass"},i)),r.a.createElement(b.a,{className:"my-3",variant:"primary",type:"submit","data-cy":"signupBtn"},"sign up"))))})),Z=r.a.forwardRef((function(e,t){var a=Object(n.useState)(!1),c=Object(x.a)(a,2),s=c[0],l=c[1],u={display:s?"none":""},o={display:s?"":"none"},i=function(){l(!s)};return Object(n.useImperativeHandle)(t,(function(){return{toggleVisibility:i}})),r.a.createElement("div",null,r.a.createElement("div",{style:u,className:"text-center"},r.a.createElement(b.a,{className:"my-3",variant:"primary",onClick:i,"data-cy":e.dataCy},e.buttonLabel)),r.a.createElement("div",{style:o},e.children,r.a.createElement("div",{className:"text-center"},r.a.createElement(b.a,{onClick:i,type:"submit",variant:"secondary","data-cy":"toggleBtn"},"close"))))})),$=function(){return r.a.createElement("footer",{className:"footer"},r.a.createElement("div",{className:"container"},r.a.createElement("span",{className:"text-muted"},"Place sticky footer content here.")))},ee=a(105),te={addLike:function(e){return function(t){var a;return E.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,E.a.awrap(R(e));case 2:a=n.sent,t({type:"ADD_LIKE",data:a});case 4:case"end":return n.stop()}}))}},deleteBlog:function(e){return function(t){return E.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,E.a.awrap(U(e));case 2:t({type:"DELETE_BLOG",data:e});case 3:case"end":return a.stop()}}))}},setNotification:f},ae=Object(l.b)((function(e){return{user:e.user}}),te)((function(e){var t=e.blog,a=Object(w.a)(e,["blog"]);Object(n.useEffect)((function(){F(a.user.token)}),[a.user]);return r.a.createElement(ee.a,null,r.a.createElement(ee.a.Body,null,r.a.createElement(ee.a.Title,null,r.a.createElement(u.b,{to:"/blogs/".concat(t.id)},t.title)),r.a.createElement(ee.a.Subtitle,null,t.author),r.a.createElement(ee.a.Text,null,"added by ",t.author),t.url,r.a.createElement("br",null),t.likes," likes",r.a.createElement(b.a,{className:"ml-2",type:"button",variant:"primary",onClick:function(){return a.addLike(t)}},"like"),a.user.id===t.user.id&&r.a.createElement(b.a,{className:"ml-2",type:"button",variant:"outline-secondary",onClick:function(){return e=t.id,void(window.confirm("Do you really want to delete blog with id of: ".concat(e,"?"))&&a.deleteBlog(e).catch((function(e){var t=JSON.parse(e.request.responseText);a.setNotification(t.error,5)})).finally(a.setNotification("Blog successfully deleted",5)));var e}},"delete")))})),ne={initializeBlogs:G},re=Object(l.b)((function(e){return{blogs:e.blogs}}),ne)((function(e){var t=e.blogs,a=Object(w.a)(e,["blogs"]);return Object(n.useEffect)((function(){a.initializeBlogs()}),[]),r.a.createElement(r.a.Fragment,null,r.a.createElement("h2",null,"Blogs"),t.map((function(e){return r.a.createElement(ae,{key:e.id,blog:e})})))})),ce={comment:function(e){var t=e.blogId,a=Object(w.a)(e,["blogId"]);return function(e){var n;return E.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,E.a.awrap(D(t,a));case 2:n=r.sent,e({type:"COMMENT",data:n});case 4:case"end":return r.stop()}}))}},setNotification:f},se=Object(l.b)((function(e){return{user:e.user}}),ce)((function(e){var t=j("text"),a=t.reset,n=Object(w.a)(t,["reset"]);return r.a.createElement(z.a,{"data-cy":"commentForm",onSubmit:function(t){var r;return E.a.async((function(c){for(;;)switch(c.prev=c.next){case 0:t.preventDefault(),r={blogId:e.blogId,content:n.value},e.comment(r).then((function(){return e.setNotification("Comment added",5)})).catch((function(t){var a=JSON.parse(t.request.responseText);e.setNotification(a.error,5)})),a("");case 4:case"end":return c.stop()}}))}},r.a.createElement(z.a.Group,null,r.a.createElement(z.a.Label,{className:"my-3"},"Your comment"),r.a.createElement(z.a.Control,Object.assign({"data-cy":"commentInput"},n)),r.a.createElement(b.a,{className:"my-3",variant:"primary",type:"submit"},"Comment")))})),le={initializeBlogs:G},ue=Object(l.b)((function(e,t){return{blogs:e.blogs,blog:(a=t.blogId,n=e.blogs,n.find((function(e){return e.id===a})))};var a,n}),le)((function(e){var t=e.blog,a=Object(w.a)(e,["blog"]);return t?r.a.createElement(r.a.Fragment,null,r.a.createElement("h2",null,t.title),r.a.createElement("strong",null,r.a.createElement("em",{className:"text-muted"},t.author)),r.a.createElement("div",null,r.a.createElement(se,{blogId:t.id}),r.a.createElement("h3",null,"Comments"),r.a.createElement("ul",null,t.comments.map((function(e){return r.a.createElement("li",{key:e.id},e.content)}))))):(a.initializeBlogs(),r.a.createElement("em",{className:"text-muted"},"just a sec.."))})),oe=function(e){var t=e.userData;return r.a.createElement("div",null,r.a.createElement("span",null,r.a.createElement(u.b,{to:"/users/".concat(t.id)},t.username),"\xa0"),r.a.createElement("span",null,t.blogs.length))},ie=function(){return function(e){var t;return E.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,E.a.awrap(V());case 2:t=a.sent,e({type:"GET_USERS_LIST",data:t});case 4:case"end":return a.stop()}}))}},me=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"GET_USERS_LIST":case"GET_USER_BY_ID":return t.data;default:return e}},fe=a(106),de={getUsersList:ie},pe=Object(l.b)((function(e){return{users:e.users}}),de)((function(e){return Object(n.useEffect)((function(){e.getUsersList()}),[]),e.users?r.a.createElement(r.a.Fragment,null,r.a.createElement("h3",null,"Users"),r.a.createElement(fe.a,{variant:"flush"},e.users.map((function(e){return r.a.createElement(fe.a.Item,{key:e.id},r.a.createElement(oe,{key:e.id,userData:e}))})))):r.a.createElement("h4",null,"just a sec..")})),Ee={getUsersList:ie},be=Object(l.b)((function(e){return{users:e.users,user:e.user}}),Ee)((function(e){var t,a=e.userId,n=e.user,c=Object(w.a)(e,["userId","user"]);if(c.users){var s=(t=a,c.users.find((function(e){return e.id===t}))).blogs;return console.log(c.user),r.a.createElement(r.a.Fragment,null,r.a.createElement("h3",null,"User info"),r.a.createElement("div",{className:"py-4"},r.a.createElement("em",null,r.a.createElement("strong",null,n.username)),r.a.createElement("br",null),r.a.createElement("span",{className:"text-muted"},n.email),r.a.createElement("br",null),r.a.createElement("span",{className:"text-muted"},n.id)),r.a.createElement(fe.a,null,s.map((function(e){return r.a.createElement(fe.a.Item,{key:e.id},r.a.createElement("h4",{className:"mb-0 d-inline"},e.title),r.a.createElement("em",null," ",e.author),r.a.createElement("span",{className:"text-muted"}," ",e.url))}))))}return c.getUsersList(),r.a.createElement("h4",null,"just a sec..")})),ge=(a(96),{setUserFromLocalStorage:function(e){return function(t){return E.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:t({type:"SET_USER_FROM_LS",user:e});case 1:case"end":return a.stop()}}))}}}),ve=Object(l.b)((function(e){return{user:e.user}}),ge)((function(e){var t=r.a.createRef(),a=r.a.createRef();return Object(n.useEffect)((function(){if(e.user)window.localStorage.setItem("loggedUserJSON",JSON.stringify(e.user));else{var t=window.localStorage.getItem("loggedUserJSON");if(t){var a=JSON.parse(t);e.setUserFromLocalStorage(a)}else console.log("No user.")}}),[e,e.user,e.setUserFromLocalStorage]),r.a.createElement(r.a.Fragment,null,r.a.createElement(u.a,null,r.a.createElement(N,null),r.a.createElement(J.a,{role:"main","data-cy":"mainContainer"},r.a.createElement(m,null),e.user?r.a.createElement(r.a.Fragment,null,r.a.createElement(o.a,{path:"/login",render:function(){return r.a.createElement(H,null)}}),r.a.createElement(o.a,{exact:!0,path:"/",render:function(){return r.a.createElement(Z,{buttonLabel:"new blog",dataCy:"addBlogFormToggle",ref:t},r.a.createElement(q,null))}}),r.a.createElement(o.a,{exact:!0,path:"/users",render:function(){return r.a.createElement(pe,null)}}),r.a.createElement(o.a,{exact:!0,path:"/users/:id",render:function(e){var t=e.match;return r.a.createElement(be,{userId:t.params.id})}}),r.a.createElement(o.a,{exact:!0,path:"/blogs",render:function(){return r.a.createElement(re,null)}}),r.a.createElement(o.a,{exact:!0,path:"/blogs/:id",render:function(e){var t=e.match;return r.a.createElement(ue,{blogId:t.params.id})}})):r.a.createElement(r.a.Fragment,null,r.a.createElement(H,null),r.a.createElement(Z,{buttonLabel:"sign up",dataCy:"signUp",ref:a},r.a.createElement(X,null)))),r.a.createElement($,null)))})),ye=a(24),he=a(64),Oe=a(65),Ne=Object(ye.combineReducers)({user:P,users:me,blogs:A,notification:d}),we=Object(ye.createStore)(Ne,Object(Oe.composeWithDevTools)(Object(ye.applyMiddleware)(he.a))),xe=function(){s.a.render(r.a.createElement(l.a,{store:we},r.a.createElement(ve,null)),document.getElementById("root"))};xe(),we.subscribe(xe)}},[[68,1,2]]]);
//# sourceMappingURL=main.1af06960.chunk.js.map