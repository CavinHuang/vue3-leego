(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b64650fe"],{"631c":function(e,t,n){e.exports={switch:"index-module_switch_upg6x","switch-on":"index-module_switch-on_13pQz"}},8255:function(e,t,n){"use strict";n.r(t);var a=n("ade3"),i=n("7a23"),o=(n("ac1f"),n("1276"),n("631c")),u=n.n(o);t["default"]=Object(i["defineComponent"])({name:"customer-switch",props:{modelValue:{type:[Boolean],default:!0},text:{type:String,default:""}},emits:["change"],setup:function(e,t){var n=t.emit,o=Object(i["computed"])((function(){return e.text?e.text.split("|"):[]})),c=Object(i["ref"])(!0),l=Object(i["computed"])({get:function(){return c.value!==e.modelValue?c.value:e.modelValue},set:function(e){c.value=e,n("change",e)}});function s(){l.value=!l.value}return function(){var t;return Object(i["createVNode"])("div",null,[Object(i["createVNode"])("span",{class:(t={},Object(a["a"])(t,u.a["switch-on"],l.value),Object(a["a"])(t,u.a.switch,!0),t),"data-value":e.modelValue,onClick:function(){return s()},style:"position:relative"},[l.value&&o.value.length>0?Object(i["createVNode"])("div",{style:"width:100%;height:100%;position:absolute;padding:0 5px;line-height:20px;color:#FFF;user-select:none"},[o.value[0]]):"",!l.value&&o.value.length>0?Object(i["createVNode"])("div",{style:"width:100%;height:100%;position:absolute;padding:0 5px;right:2px;line-height:22px;color:#7A7A7A;text-align:right;user-select:none"},[o.value[1]]):""])])}}})}}]);