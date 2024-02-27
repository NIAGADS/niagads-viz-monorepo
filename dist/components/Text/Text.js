import e,{useState as t}from"react";import{isObject as r,isJSON as l}from"./utils.js";import{LinkList as a,Link as n}from"./Link.js";const i=({value:t})=>{const l=r(t)?t:JSON.parse(t),i=(e=>{if(Array.isArray(e)){if("url"in e[0])return"link_list";throw new Error(`ERROR: Invalid JSON passed to FormattedJSON (a TextRenderer) - unknown array type: ${JSON.stringify(e)}`)}if(!("value"in e))throw new Error(`ERROR: Invalid JSON passed to FormattedJSON (a TextRenderer) - missing 'value': ${JSON.stringify(e)}`);if("url"in e)return"link";if("tooltip"in e)return"tooltip";if("text"in e)return"legacy_plain_text";throw new Error(`ERROR: Invalid JSON passed to FormattedJSON (a TextRenderer) - unknown JSON Renderer type: ${JSON.stringify(e)}`)})(l);switch(i){case"tooltip":return e.createElement(c,{value:l});case"link":return e.createElement(n,{value:l});case"link_list":return e.createElement(a,{value:l});default:return e.createElement(o,{value:t.value})}},o=({value:t,maxLength:r=100})=>l(t)?e.createElement(i,{value:t}):t.toString().length>r?e.createElement(s,{value:t,maxLength:r}):t,s=({value:r,maxLength:a=100})=>{const[n,i]=t(!1),o=()=>{i(!n)};return l(r)&&"tooltip"in r?e.createElement(c,{value:{value:r.slice(0,a-3)+"...",tooltip:r.tooltip}}):n?e.createElement("div",null,r," ",e.createElement("a",{onClick:o},"Show less")):e.createElement("div",null,`${r.slice(0,a-3)}...`," ",e.createElement("a",{onClick:o},"Show more"))},u=({value:t,className:r,color:l})=>e.createElement("span",{style:{color:`${l}`},className:r||void 0},t),c=({value:t,color:r})=>e.createElement("div",{title:t.tooltip,"arial-label":t.tooltip},e.createElement("span",{className:"underline decoration-dashed decoration-blue-500"},t.value));export{c as AnnotatedText,s as Clob,u as ColoredText,o as DefaultText,i as FormattedJSON};
//# sourceMappingURL=Text.js.map
