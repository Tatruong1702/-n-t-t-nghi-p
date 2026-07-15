import{c as a,R as e,L as c,m as r}from"./index-BeMVMGfS.js";import{A as n}from"./activity-DXwu3YxP.js";/**
 * @license lucide-react v0.478.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],m=a("ShieldCheck",i);/**
 * @license lucide-react v0.478.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]],p=a("Sparkles",d);/**
 * @license lucide-react v0.478.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]],x=a("TrendingUp",h);/**
 * @license lucide-react v0.478.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],u=a("Zap",y),g={"Bóng đá":n,Pickleball:x,"Cầu lông":m,Tennis:p,"Bóng rổ":u};function N({sports:l}){return e.createElement("section",{className:"mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"},e.createElement("div",{className:"mb-10"},e.createElement("p",{className:"text-sm uppercase tracking-[0.3em] text-emerald-600"},"Loại hình thể thao"),e.createElement("h2",{className:"mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl"},"Tìm sân theo môn")),e.createElement("div",{className:"grid gap-6 sm:grid-cols-2 xl:grid-cols-5"},l.map((t,s)=>{const o=g[t.name]||n;return e.createElement(c,{key:t.name,to:`/?sport_type=${t.name}`},e.createElement(r.div,{key:t.name,initial:{opacity:0,y:24},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.25},transition:{duration:.5,delay:s*.08},className:"group overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_56px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-2xl"},e.createElement("div",{className:"flex h-48 items-end justify-center overflow-hidden bg-slate-950/5"},e.createElement("img",{src:t.image,alt:t.name,className:"h-full w-full object-cover transition duration-700 group-hover:scale-105"})),e.createElement("div",{className:"space-y-4 p-6 text-slate-950"},e.createElement("div",{className:"inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500"},e.createElement(o,{size:22})),e.createElement("div",null,e.createElement("h3",{className:"text-xl font-semibold"},t.name),e.createElement("p",{className:"mt-2 text-sm text-slate-500"},t.count," sân hiện có")))))})))}export{N as default};
