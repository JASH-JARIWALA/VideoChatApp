(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{101:function(e,t){},117:function(e,t){},119:function(e,t){},152:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(11),l=a.n(c),o=(a(70),a(6)),i=a(56),u=(a(71),a(57)),s=a.n(u),m=a(28),d=a.n(m),f=a(59),g=a(163),v=a(165),E=a(164),b=a(162),p=a(64),j=a(17),k=a(157),y=a(158),O=a(159),h=a(160),C=a(161),S=a(58),T=a.n(S);function w(){var e=Object(i.a)(["\n  display: flex;\n  width: 100%;\n"]);return w=function(){return e},e}var N=new Audio("./skype_remix_2.mp3");N.loop=!0;var D=function(){return r.a.createElement(T.a,{type:"TailSpin",color:"#00BFFF"})},L=f.a.div(w());var M=function(){var e=Object(n.useRef)(null),t=Object(n.useState)(""),a=Object(o.a)(t,2),c=a[0],l=a[1],i=Object(n.useState)({}),u=Object(o.a)(i,2),m=u[0],f=u[1],S=Object(n.useState)(),T=Object(o.a)(S,2),w=T[0],M=T[1],x=Object(n.useState)(!1),z=Object(o.a)(x,2),A=z[0],B=z[1],R=Object(n.useState)(""),U=Object(o.a)(R,2),V=U[0],F=U[1],I=Object(n.useState)(),P=Object(o.a)(I,2),W=P[0],J=P[1],_=Object(n.useState)(!1),G=Object(o.a)(_,2),H=G[0],Y=G[1],$=Object(n.useState)(!1),q=Object(o.a)($,2),K=q[0],Q=q[1],X=Object(n.useState)(!1),Z=Object(o.a)(X,2),ee=Z[0],te=Z[1],ae=Object(n.useState)(""),ne=Object(o.a)(ae,2),re=ne[0],ce=ne[1],le=Object(n.useRef)(),oe=Object(n.useRef)(),ie=Object(n.useRef)(),ue=Object(n.useState)(!0),se=Object(o.a)(ue,2),me=se[0],de=se[1],fe=Object(n.useState)(!0),ge=Object(o.a)(fe,2),ve=ge[0],Ee=ge[1],be=Object(n.useState)("user"),pe=Object(o.a)(be,2),je=pe[0],ke=pe[1];Object(n.useEffect)((function(){ie.current=s.a.connect(""),navigator.mediaDevices.getUserMedia({video:{facingMode:je},audio:!0}).then((function(e){M(e),le.current&&(le.current.srcObject=e)})).catch((function(e){j.b.error("Provide Permission")})),ie.current.on("yourID",(function(e){l(e)})),ie.current.on("allUsers",(function(e){console.log(e),f(e)})),ie.current.on("receiveCall",(function(e){console.log("Reciving"),B(!0),F(e.from.name),ce(e.from.id),J(e.signal)})),ie.current.on("changeNameStatus",(function(e){e.status||j.b.error("name already taken!")}))}),[]);var ye,Oe,he,Ce,Se,Te=function(e){Q(!0),setTimeout((function(){Q(!1)}),e)},we=r.a.createElement(g.a,{onSubmit:function(e){e.preventDefault();var t=e.target.name.value,a=!1;Object.keys(m).forEach((function(e){e!==c&&t===m[e]&&(a=!0)})),a?j.b.error("name already taken!"):ie.current.emit("changeName",{name:t})}},r.a.createElement(g.a.Group,{controlId:"name"},r.a.createElement(g.a.Label,null,"Change Display name"),r.a.createElement(g.a.Control,{type:"text",placeholder:"Enter name"})),r.a.createElement(v.a,{variant:"primary",type:"submit",size:"sm"},r.a.createElement("small",null,"Change Name")));w&&(ye=r.a.createElement("video",{className:"userVideo",playsInline:!0,muted:!0,ref:le,autoPlay:!0}),"professor"===m[c]&&(Oe=Object.keys(m).map((function(t){return t===c?null:r.a.createElement(v.a,{variant:"primary",onClick:function(){return a=t,e.current=new d.a({initiator:!0,trickle:!1,stream:w}),console.log("Call user"),e.current.on("signal",(function(e){ie.current.emit("callUser",{userToCall:a,signalData:e,from:c})})),e.current.on("stream",(function(e){oe.current&&(oe.current.srcObject=e)})),ie.current.on("callAccepted",(function(t){Y(!0),ce(a),e.current.signal(t),te(!0),console.log("accepted")})),e.current.on("error",(function(e){console.log(e),"Call ended"!==e&&alert("Connection error or client closed webpage!"),ce(""),Y(!1),te(!1),ie.current.removeListener("callAccepted"),ie.current.removeListener("videoStatusChange"),ie.current.removeListener("audioStatusChange")})),ie.current.on("callEnded",(function(){e.current.destroy("Call ended")})),void ie.current.on("error",(function(t){e.current.destroy(t.message)}));var a},disabled:ee,style:{margin:5}},"Call ",m[t])})))),H&&(he=r.a.createElement("video",{className:"partnerVideo",playsInline:!0,ref:oe,autoPlay:!0}),Ce=r.a.createElement("div",{className:"endCallButton"},r.a.createElement(v.a,{variant:"danger",onClick:function(){ie.current.emit("endCall",{id:re})}},"End Call")));var Ne,De,Le=me?"success":"danger",Me=ve?"success":"danger",xe=me?r.a.createElement(k.a,{size:20}):r.a.createElement(y.a,{size:20}),ze=ve?r.a.createElement(O.a,{size:20}):r.a.createElement(h.a,{size:20});return Se=r.a.createElement(L,{className:"justify-content-md-center"},r.a.createElement(v.a,{variant:Le,onClick:function(){Te(400);var t=w.getVideoTracks()[0];"ended"===t.readyState?navigator.mediaDevices.getUserMedia({video:{facingMode:je}}).then((function(a){var n=a.getVideoTracks()[0];w.removeTrack(t),w.addTrack(n),de(!0),H&&e.current.replaceTrack(t,n,w)})):"live"===t.readyState&&(t.stop(),de(!1),H&&e.current.replaceTrack(t,t,w))},style:{margin:5}}," ",xe," "),r.a.createElement(v.a,{variant:Me,onClick:function(){Te(400);var t=w.getAudioTracks()[0];"ended"===t.readyState?navigator.mediaDevices.getUserMedia({audio:!0}).then((function(a){var n=a.getAudioTracks()[0];w.removeTrack(t),w.addTrack(n),Ee(!0),H&&e.current.replaceTrack(t,n,w)})):"live"===t.readyState&&(t.stop(),Ee(!1),H&&e.current.replaceTrack(t,t,w))},style:{margin:5}}," ",ze," "),me&&r.a.createElement(v.a,{onClick:function(){Te(1700);var t="user"===je?"environment":"user",a=w.getVideoTracks()[0];a.stop(),navigator.mediaDevices.getUserMedia({video:{facingMode:je}}).then((function(t){var n=t.getVideoTracks()[0];w.removeTrack(a),w.addTrack(n),de(!0),H&&e.current.replaceTrack(a,n,w)})),ke(t)},style:{margin:5}}," ",r.a.createElement(C.a,null)," ")),"professor"!==m[c]&&Object.keys(m).forEach((function(e){e!==c&&"professor"===m[e]&&(Ne="Professor online")})),A&&m[re]?(N.play(),De=r.a.createElement("div",{className:"incommingCall"},r.a.createElement(E.a,{className:"text-center",style:{background:"black",color:"white"}},r.a.createElement(E.a.Header,null,r.a.createElement("h2",null,V," is calling you")),r.a.createElement(E.a.Body,null,r.a.createElement(E.a.Title,null),r.a.createElement(b.a,null,r.a.createElement(L,null,r.a.createElement(p.a,null,r.a.createElement(v.a,{size:"lg",variant:"danger",onClick:function(){}},"Reject")),r.a.createElement(p.a,null,r.a.createElement(v.a,{size:"lg",variant:"success",onClick:function(){N.pause(),N.currentTime=0,Y(!0),B(!1),te(!0),e.current=new d.a({initiator:!1,trickle:!1,stream:w}),e.current.on("signal",(function(e){ie.current.emit("acceptCall",{signal:e,to:re})})),e.current.on("stream",(function(e){oe.current.srcObject=e})),e.current.signal(W),e.current.on("error",(function(e){console.log(e),"Call ended"!==e&&alert("Connection error or client closed webpage!"),Y(!1),F(""),ce(""),J(),te(!1),ie.current.removeListener("videoStatusChange"),ie.current.removeListener("audioStatusChange")})),ie.current.on("callEnded",(function(){e.current.destroy("Call ended")}))}},"Accept"))))),r.a.createElement(E.a.Footer,{className:"text-muted"})))):(N.pause(),N.currentTime=0),r.a.createElement(r.a.Fragment,null,De,he,r.a.createElement("div",{className:"userElements"},ye,Se),r.a.createElement("div",{className:"userElementsLoadingBox",hidden:!K},r.a.createElement("div",{className:"userElementsLoading"},r.a.createElement(D,null))),Ce,r.a.createElement(b.a,{style:{color:"white"},fluid:!0},r.a.createElement(L,null,Oe),r.a.createElement(L,null,r.a.createElement(p.a,null,r.a.createElement("h4",null,"You: ",m[c]),we,r.a.createElement(L,{style:{color:"green",fontWeight:"bold"}},Ne))),r.a.createElement(j.a,{autoClose:2e3})))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(150),a(151);l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(M,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},65:function(e,t,a){e.exports=a(152)},70:function(e,t,a){},71:function(e,t,a){}},[[65,1,2]]]);
//# sourceMappingURL=main.94bee7e8.chunk.js.map