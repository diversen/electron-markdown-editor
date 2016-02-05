/*!    @license MIT */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.mdtable = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var isInt = function(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
};

var create = function (rows, columns) {

    if (!isInt(rows) || !isInt(columns) || rows === 0 || columns === 0) {
        return '';
    }

    var c_columns = 0;
    var str = '';
    for (var x = columns +1; x > 0; x--) {
        
        if (c_columns !== 1) {
            str+=generateRow(rows, c_columns);
            if (columns === 1) {
                //return str;
                break;
            } 
        } else {
            str+=generateEmptyRow(rows);
            
        }
        c_columns++;
        
    } 
    return str;
};

var generateEmptyRow = function (rows) {

    var str = '';
    for (var x = rows; x > 0; x--) {
        str+= '|' + '---'; 
        
    }
    return str + '|' + "\n";
};

var generateRow = function (row_number, col_number) {
    
    var c_rows = 0;
    var str = '';
    for (var x = row_number; x > 0; x--) {
        str+= '|' + col_number + ':' + c_rows++ ; 
        
    }
    return str + '|' + "\n";
};

module.exports = {
  create: create
};

},{}]},{},[1])(1)
});