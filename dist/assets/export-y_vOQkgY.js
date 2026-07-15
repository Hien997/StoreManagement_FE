import{c as l}from"./index-C3yP_5Ta.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=l("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);function i(e,a,o){const t=new Blob([a],{type:o}),c=URL.createObjectURL(t),n=document.createElement("a");n.href=c,n.download=e,n.click(),URL.revokeObjectURL(c)}function p(e,a){if(!e.length)return;const o=Object.keys(e[0]),t=[o.join(",")];for(const c of e)t.push(o.map(n=>{const r=c[n],s=r==null?"":String(r);return/[",\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s}).join(","));i(a,t.join(`
`),"text/csv;charset=utf-8")}export{u as D,p as e};
