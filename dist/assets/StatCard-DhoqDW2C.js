import{j as e}from"./query-vendor-C1Ijw2rG.js";import{C as m,d as l}from"./card-WxgdVbOw.js";import{S as t}from"./skeleton-ClI_VD66.js";import{c,R as n}from"./index-C3yP_5Ta.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=c("ArrowDownRight",[["path",{d:"m7 7 10 10",key:"1fmybs"}],["path",{d:"M17 7v10H7",key:"6fjiku"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=c("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);function v({title:o,value:d,icon:x,description:a,trend:s,loading:h,className:r}){if(h)return e.jsx(m,{className:r,children:e.jsxs(l,{className:"p-6",children:[e.jsx(t,{className:"h-4 w-24"}),e.jsx(t,{className:"mt-3 h-8 w-32"}),e.jsx(t,{className:"mt-3 h-3 w-20"})]})});const i=((s==null?void 0:s.value)??0)>=0;return e.jsx(m,{className:n("overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",r),children:e.jsxs(l,{className:"p-6",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("p",{className:"text-sm font-medium text-muted-foreground",children:o}),e.jsx("div",{className:"flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary",children:e.jsx(x,{className:"h-5 w-5"})})]}),e.jsx("div",{className:"mt-3 text-2xl font-bold tracking-tight",children:d}),e.jsxs("div",{className:"mt-1 flex items-center gap-2 text-xs",children:[s&&e.jsxs("span",{className:n("inline-flex items-center gap-0.5 font-medium",i?"text-emerald-600 dark:text-emerald-400":"text-red-600 dark:text-red-400"),children:[i?e.jsx(p,{className:"h-3 w-3"}):e.jsx(j,{className:"h-3 w-3"}),Math.abs(s.value),"%"]}),a&&e.jsx("span",{className:"text-muted-foreground",children:a})]})]})})}export{v as S};
