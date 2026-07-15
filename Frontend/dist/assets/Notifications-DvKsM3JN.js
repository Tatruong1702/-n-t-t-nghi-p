import{c as a,r as s,R as e}from"./index-CsAABeW3.js";import{C as r}from"./circle-check-Y0HgHVC9.js";/**
 * @license lucide-react v0.478.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M22 8c0-2.3-.8-4.3-2-6",key:"5bb3ad"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}],["path",{d:"M4 2C2.8 3.7 2 5.7 2 8",key:"tap9e0"}]],o=a("BellRing",n);/**
 * @license lucide-react v0.478.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],d=a("CircleAlert",m);/**
 * @license lucide-react v0.478.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],p=a("CircleX",i),g=s.memo(function({notifications:c}){return e.createElement("div",{className:"rounded-[24px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.15)] backdrop-blur-xl"},e.createElement("div",{className:"flex items-center gap-3"},e.createElement("div",{className:"rounded-2xl bg-slate-900 p-2 text-white"},e.createElement(o,{size:18})),e.createElement("div",null,e.createElement("p",{className:"text-sm font-medium text-emerald-600"},"Thông báo"),e.createElement("h3",{className:"text-xl font-semibold text-slate-900"},"Hoạt động gần đây"))),e.createElement("div",{className:"mt-6 space-y-3"},c.map(t=>{const l=t.type==="canceled"?p:t.type==="success"?r:d;return e.createElement("div",{key:t.id,className:"flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3"},e.createElement("div",{className:`rounded-xl p-2 ${t.type==="canceled"?"bg-rose-50 text-rose-600":t.type==="success"?"bg-emerald-50 text-emerald-600":"bg-amber-50 text-amber-600"}`},e.createElement(l,{size:16})),e.createElement("div",{className:"flex-1"},e.createElement("p",{className:"text-sm font-semibold text-slate-900"},t.title),e.createElement("p",{className:"text-sm text-slate-500"},t.message)))})))});export{g as default};
