import e,{useState as t}from"react";import{isObject as r,isJSON as a}from"./utils.js";import{LinkList as l,Link as n}from"./Link.js";const o=({value:t})=>{const a=r(t)?t:JSON.parse(t),o=(e=>{if(Array.isArray(e)){if("url"in e[0])return"link_list";throw new Error(`ERROR: Invalid JSON passed to FormattedJSON (a TextRenderer) - unknown array type: ${JSON.stringify(e)}`)}if(!("value"in e))throw new Error(`ERROR: Invalid JSON passed to FormattedJSON (a TextRenderer) - missing 'value': ${JSON.stringify(e)}`);if("url"in e)return"link";if("tooltip"in e)return"tooltip";if("text"in e)return"legacy_plain_text";throw new Error(`ERROR: Invalid JSON passed to FormattedJSON (a TextRenderer) - unknown JSON Renderer type: ${JSON.stringify(e)}`)})(a);switch(o){case"tooltip":return e.createElement(u,{value:a});case"link":return e.createElement(n,{value:a});case"link_list":return e.createElement(l,{value:a});default:return e.createElement(i,{value:t.value})}},i=({value:t,maxLength:r=100})=>a(t)?e.createElement(o,{value:t}):t.toString().length>r?e.createElement(s,{value:t,maxLength:r}):t,s=({value:r,maxLength:l=100})=>{const[n,o]=t(!1),i=()=>{o(!n)};return a(r)&&"tooltip"in r?e.createElement(u,{value:{value:r.slice(0,l-3)+"...",tooltip:r.tooltip}}):n?e.createElement("div",null,r," ",e.createElement("a",{className:"cursor-pointer decoration-dashed",onClick:i},"Show less")):e.createElement("div",null,`${r.slice(0,l-3)}...`," ",e.createElement("a",{className:"cursor-pointer decoration-dashed",onClick:i},"Show more"))},c=({value:t,className:r,color:a})=>e.createElement("span",{style:{color:`${a}`},className:r||void 0},t),u=({value:t,color:r})=>e.createElement("div",{title:t.tooltip,"arial-label":t.tooltip},e.createElement("span",{className:"underline decoration-dashed decoration-blue-500 underline-offset-4"},t.value));export{u as AnnotatedText,s as Clob,c as ColoredText,i as DefaultText,o as FormattedJSON};
//# sourceMappingURL=Text.js.map
