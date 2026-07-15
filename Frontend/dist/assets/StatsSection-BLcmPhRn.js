import{c as a,R as e,b as o,A as c,m as i}from"./index-W7T72a4a.js";/**
 * @license lucide-react v0.478.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"M21.54 15H17a2 2 0 0 0-2 2v4.54",key:"1djwo0"}],["path",{d:"M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",key:"1tzkfa"}],["path",{d:"M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05",key:"14pb5j"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],d=a("Earth",m);/**
 * @license lucide-react v0.478.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]],x=a("Users",p),y={"Sân bóng":c,"Sân con":o,"Tỉnh thành":d,"Đánh giá":x};function u({stats:s=[],loading:n}){return n?e.createElement("section",{className:"mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"},e.createElement("div",{className:"text-center text-slate-500"},"Đang tải số liệu...")):e.createElement("section",{className:"mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"},e.createElement("div",{className:"grid gap-4 md:grid-cols-4"},s.map((t,l)=>{const r=y[t.label]||c;return e.createElement(i.article,{key:t.label,initial:{opacity:0,y:24},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.25},transition:{duration:.5,delay:l*.1},className:"rounded-[28px] border border-slate-200/20 bg-white/80 p-6 shadow-[0_32px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl"},e.createElement("div",{className:"flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950/10 text-slate-950"},e.createElement(r,{size:24})),e.createElement("p",{className:"mt-6 text-3xl font-semibold text-slate-950"},t.value),e.createElement("p",{className:"mt-2 text-sm text-slate-500"},t.label))})))}export{u as default};
