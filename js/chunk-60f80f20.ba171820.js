(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-60f80f20","chunk-74992c29"],{"5c4f":function(e,t,o){e.exports={"v-text":"index-module_v-text_1ksvY",group:"index-module_group_2xX1U",picture:"index-module_picture_3tyuJ","rect-shape":"index-module_rect-shape_3vSgf","v-button":"index-module_v-button_GJ8ZW"}},7683:function(e,t,o){"use strict";o.r(t);var n=o("5530"),u=o("7a23"),r=(o("159b"),o("b64b"),o("d81d"),o("e31b")),p=o("5c4f"),c=o.n(p);t["default"]=Object(u["defineComponent"])({name:"custom-group",props:{propValue:{type:Array,default:function(){return[]}},element:{type:Object}},setup:function(e){var t,o=function(e){return 100*e+"%"},p=null===(t=e.element)||void 0===t?void 0:t.style;e.propValue.forEach((function(e){if(!Object.keys(e.groupStyle).length){var t=Object(n["a"])({},e.style);e.groupStyle=Object(r["c"])(t),e.groupStyle.left=o((t.left-p.left)/p.width),e.groupStyle.top=o((t.top-p.top)/p.height),e.groupStyle.width=o(t.width/p.width),e.groupStyle.height=o(t.height/p.height)}}));var l=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return Object(u["h"])(Object(u["resolveComponent"])(e.is),e,t)};return function(){return Object(u["createVNode"])("div",{class:[c.a.group]},[Object(u["createVNode"])("div",null,[e.propValue.map((function(e){return Object(u["createVNode"])(l,{class:"component",is:e.component,style:e.groupStyle,propValue:e.propValue,id:"component"+e.id,element:e},null)}))])])}}})}}]);