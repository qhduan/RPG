(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
"use strict";

_dereq_(189);

_dereq_(2);

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"189":189,"2":2}],2:[function(_dereq_,module,exports){
module.exports = _dereq_(190);
},{"190":190}],3:[function(_dereq_,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],4:[function(_dereq_,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = _dereq_(84)('unscopables')
  , ArrayProto  = Array.prototype;
if(ArrayProto[UNSCOPABLES] == undefined)_dereq_(32)(ArrayProto, UNSCOPABLES, {});
module.exports = function(key){
  ArrayProto[UNSCOPABLES][key] = true;
};
},{"32":32,"84":84}],5:[function(_dereq_,module,exports){
var isObject = _dereq_(39);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"39":39}],6:[function(_dereq_,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = _dereq_(81)
  , toIndex  = _dereq_(77)
  , toLength = _dereq_(80);

module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){
  var O     = toObject(this)
    , len   = toLength(O.length)
    , to    = toIndex(target, len)
    , from  = toIndex(start, len)
    , $$    = arguments
    , end   = $$.length > 2 ? $$[2] : undefined
    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)
    , inc   = 1;
  if(from < to && to < from + count){
    inc  = -1;
    from += count - 1;
    to   += count - 1;
  }
  while(count-- > 0){
    if(from in O)O[to] = O[from];
    else delete O[to];
    to   += inc;
    from += inc;
  } return O;
};
},{"77":77,"80":80,"81":81}],7:[function(_dereq_,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = _dereq_(81)
  , toIndex  = _dereq_(77)
  , toLength = _dereq_(80);
module.exports = [].fill || function fill(value /*, start = 0, end = @length */){
  var O      = toObject(this, true)
    , length = toLength(O.length)
    , $$     = arguments
    , $$len  = $$.length
    , index  = toIndex($$len > 1 ? $$[1] : undefined, length)
    , end    = $$len > 2 ? $$[2] : undefined
    , endPos = end === undefined ? length : toIndex(end, length);
  while(endPos > index)O[index++] = value;
  return O;
};
},{"77":77,"80":80,"81":81}],8:[function(_dereq_,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = _dereq_(79)
  , toLength  = _dereq_(80)
  , toIndex   = _dereq_(77);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index;
    } return !IS_INCLUDES && -1;
  };
};
},{"77":77,"79":79,"80":80}],9:[function(_dereq_,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = _dereq_(18)
  , IObject  = _dereq_(35)
  , toObject = _dereq_(81)
  , toLength = _dereq_(80)
  , asc      = _dereq_(10);
module.exports = function(TYPE){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? asc($this, length) : IS_FILTER ? asc($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"10":10,"18":18,"35":35,"80":80,"81":81}],10:[function(_dereq_,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var isObject = _dereq_(39)
  , isArray  = _dereq_(37)
  , SPECIES  = _dereq_(84)('species');
module.exports = function(original, length){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return new (C === undefined ? Array : C)(length);
};
},{"37":37,"39":39,"84":84}],11:[function(_dereq_,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = _dereq_(12)
  , TAG = _dereq_(84)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"12":12,"84":84}],12:[function(_dereq_,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],13:[function(_dereq_,module,exports){
'use strict';
var $            = _dereq_(47)
  , hide         = _dereq_(32)
  , mix          = _dereq_(54)
  , ctx          = _dereq_(18)
  , strictNew    = _dereq_(70)
  , defined      = _dereq_(20)
  , forOf        = _dereq_(28)
  , $iterDefine  = _dereq_(43)
  , step         = _dereq_(45)
  , ID           = _dereq_(83)('id')
  , $has         = _dereq_(31)
  , isObject     = _dereq_(39)
  , setSpecies   = _dereq_(66)
  , DESCRIPTORS  = _dereq_(21)
  , isExtensible = Object.isExtensible || isObject
  , SIZE         = DESCRIPTORS ? '_s' : 'size'
  , id           = 0;

var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!$has(it, ID)){
    // can't set id to frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, ID, ++id);
  // return object id with prefix
  } return 'O' + it[ID];
};

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = $.create(null); // index
      that._f = undefined;      // first entry
      that._l = undefined;      // last entry
      that[SIZE] = 0;           // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    mix(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)$.setDesc(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
},{"18":18,"20":20,"21":21,"28":28,"31":31,"32":32,"39":39,"43":43,"45":45,"47":47,"54":54,"66":66,"70":70,"83":83}],14:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var forOf   = _dereq_(28)
  , classof = _dereq_(11);
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    var arr = [];
    forOf(this, false, arr.push, arr);
    return arr;
  };
};
},{"11":11,"28":28}],15:[function(_dereq_,module,exports){
'use strict';
var hide         = _dereq_(32)
  , mix          = _dereq_(54)
  , anObject     = _dereq_(5)
  , strictNew    = _dereq_(70)
  , forOf        = _dereq_(28)
  , method       = _dereq_(9)
  , WEAK         = _dereq_(83)('weak')
  , isObject     = _dereq_(39)
  , $has         = _dereq_(31)
  , isExtensible = Object.isExtensible || isObject
  , find         = method(5)
  , findIndex    = method(6)
  , id           = 0;

// fallback for frozen keys
var frozenStore = function(that){
  return that._l || (that._l = new FrozenStore);
};
var FrozenStore = function(){
  this.a = [];
};
var findFrozen = function(store, key){
  return find(store.a, function(it){
    return it[0] === key;
  });
};
FrozenStore.prototype = {
  get: function(key){
    var entry = findFrozen(this, key);
    if(entry)return entry[1];
  },
  has: function(key){
    return !!findFrozen(this, key);
  },
  set: function(key, value){
    var entry = findFrozen(this, key);
    if(entry)entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function(key){
    var index = findIndex(this.a, function(it){
      return it[0] === key;
    });
    if(~index)this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = id++;      // collection id
      that._l = undefined; // leak store for frozen objects
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    mix(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return frozenStore(this)['delete'](key);
        return $has(key, WEAK) && $has(key[WEAK], this._i) && delete key[WEAK][this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return frozenStore(this).has(key);
        return $has(key, WEAK) && $has(key[WEAK], this._i);
      }
    });
    return C;
  },
  def: function(that, key, value){
    if(!isExtensible(anObject(key))){
      frozenStore(that).set(key, value);
    } else {
      $has(key, WEAK) || hide(key, WEAK, {});
      key[WEAK][that._i] = value;
    } return that;
  },
  frozenStore: frozenStore,
  WEAK: WEAK
};
},{"28":28,"31":31,"32":32,"39":39,"5":5,"54":54,"70":70,"83":83,"9":9}],16:[function(_dereq_,module,exports){
'use strict';
var global         = _dereq_(30)
  , $def           = _dereq_(19)
  , $redef         = _dereq_(62)
  , mix            = _dereq_(54)
  , forOf          = _dereq_(28)
  , strictNew      = _dereq_(70)
  , isObject       = _dereq_(39)
  , fails          = _dereq_(25)
  , $iterDetect    = _dereq_(44)
  , setToStringTag = _dereq_(67);

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  var fixMethod = function(KEY){
    var fn = proto[KEY];
    $redef(proto, KEY,
      KEY == 'delete' ? function(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a){
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    mix(C.prototype, methods);
  } else {
    var instance             = new C
      // early implementations not supports chaining
      , HASNT_CHAINING       = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
      // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
      , THROWS_ON_PRIMITIVES = fails(function(){ instance.has(1); })
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      , ACCEPT_ITERABLES     = $iterDetect(function(iter){ new C(iter); }) // eslint-disable-line no-new
      // for early implementations -0 and +0 not the same
      , BUGGY_ZERO;
    if(!ACCEPT_ITERABLES){ 
      C = wrapper(function(target, iterable){
        strictNew(target, C, NAME);
        var that = new Base;
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    IS_WEAK || instance.forEach(function(val, key){
      BUGGY_ZERO = 1 / key === -Infinity;
    });
    if(THROWS_ON_PRIMITIVES || BUGGY_ZERO){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if(BUGGY_ZERO || HASNT_CHAINING)fixMethod(ADDER);
    // weak collections should not contains .clear method
    if(IS_WEAK && proto.clear)delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $def($def.G + $def.W + $def.F * (C != Base), O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"19":19,"25":25,"28":28,"30":30,"39":39,"44":44,"54":54,"62":62,"67":67,"70":70}],17:[function(_dereq_,module,exports){
var core = module.exports = {version: '1.2.5'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],18:[function(_dereq_,module,exports){
// optional / simple context binding
var aFunction = _dereq_(3);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"3":3}],19:[function(_dereq_,module,exports){
var global     = _dereq_(30)
  , core       = _dereq_(17)
  , hide       = _dereq_(32)
  , $redef     = _dereq_(62)
  , PROTOTYPE  = 'prototype';
var ctx = function(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
};
var $def = function(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , isProto  = type & $def.P
    , target   = isGlobal ? global : type & $def.S
        ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    if(type & $def.B && own)exp = ctx(out, global);
    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target && !own)$redef(target, key, out);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
global.core = core;
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
module.exports = $def;
},{"17":17,"30":30,"32":32,"62":62}],20:[function(_dereq_,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],21:[function(_dereq_,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !_dereq_(25)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"25":25}],22:[function(_dereq_,module,exports){
var isObject = _dereq_(39)
  , document = _dereq_(30).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"30":30,"39":39}],23:[function(_dereq_,module,exports){
// all enumerable object keys, includes symbols
var $ = _dereq_(47);
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getSymbols = $.getSymbols;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = $.isEnum
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
  }
  return keys;
};
},{"47":47}],24:[function(_dereq_,module,exports){
var MATCH = _dereq_(84)('match');
module.exports = function(KEY){
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch(e){
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch(f){ /* empty */ }
  } return true;
};
},{"84":84}],25:[function(_dereq_,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],26:[function(_dereq_,module,exports){
'use strict';
var hide    = _dereq_(32)
  , redef   = _dereq_(62)
  , fails   = _dereq_(25)
  , defined = _dereq_(20)
  , wks     = _dereq_(84);
module.exports = function(KEY, length, exec){
  var SYMBOL   = wks(KEY)
    , original = ''[KEY];
  if(fails(function(){
    var O = {};
    O[SYMBOL] = function(){ return 7; };
    return ''[KEY](O) != 7;
  })){
    redef(String.prototype, KEY, exec(defined, SYMBOL, original));
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function(string, arg){ return original.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function(string){ return original.call(string, this); }
    );
  }
};
},{"20":20,"25":25,"32":32,"62":62,"84":84}],27:[function(_dereq_,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = _dereq_(5);
module.exports = function(){
  var that   = anObject(this)
    , result = '';
  if(that.global)     result += 'g';
  if(that.ignoreCase) result += 'i';
  if(that.multiline)  result += 'm';
  if(that.unicode)    result += 'u';
  if(that.sticky)     result += 'y';
  return result;
};
},{"5":5}],28:[function(_dereq_,module,exports){
var ctx         = _dereq_(18)
  , call        = _dereq_(41)
  , isArrayIter = _dereq_(36)
  , anObject    = _dereq_(5)
  , toLength    = _dereq_(80)
  , getIterFn   = _dereq_(85);
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"18":18,"36":36,"41":41,"5":5,"80":80,"85":85}],29:[function(_dereq_,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toString  = {}.toString
  , toIObject = _dereq_(79)
  , getNames  = _dereq_(47).getNames;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames(toIObject(it));
};
},{"47":47,"79":79}],30:[function(_dereq_,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],31:[function(_dereq_,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],32:[function(_dereq_,module,exports){
var $          = _dereq_(47)
  , createDesc = _dereq_(61);
module.exports = _dereq_(21) ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"21":21,"47":47,"61":61}],33:[function(_dereq_,module,exports){
module.exports = _dereq_(30).document && document.documentElement;
},{"30":30}],34:[function(_dereq_,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],35:[function(_dereq_,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _dereq_(12);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"12":12}],36:[function(_dereq_,module,exports){
// check on default Array iterator
var Iterators  = _dereq_(46)
  , ITERATOR   = _dereq_(84)('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return (Iterators.Array || ArrayProto[ITERATOR]) === it;
};
},{"46":46,"84":84}],37:[function(_dereq_,module,exports){
// 7.2.2 IsArray(argument)
var cof = _dereq_(12);
module.exports = Array.isArray || function(arg){
  return cof(arg) == 'Array';
};
},{"12":12}],38:[function(_dereq_,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = _dereq_(39)
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};
},{"39":39}],39:[function(_dereq_,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],40:[function(_dereq_,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = _dereq_(39)
  , cof      = _dereq_(12)
  , MATCH    = _dereq_(84)('match');
module.exports = function(it){
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};
},{"12":12,"39":39,"84":84}],41:[function(_dereq_,module,exports){
// call something on iterator step with safe closing on error
var anObject = _dereq_(5);
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"5":5}],42:[function(_dereq_,module,exports){
'use strict';
var $              = _dereq_(47)
  , descriptor     = _dereq_(61)
  , setToStringTag = _dereq_(67)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_dereq_(32)(IteratorPrototype, _dereq_(84)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"32":32,"47":47,"61":61,"67":67,"84":84}],43:[function(_dereq_,module,exports){
'use strict';
var LIBRARY         = _dereq_(49)
  , $def            = _dereq_(19)
  , $redef          = _dereq_(62)
  , hide            = _dereq_(32)
  , has             = _dereq_(31)
  , SYMBOL_ITERATOR = _dereq_(84)('iterator')
  , Iterators       = _dereq_(46)
  , $iterCreate     = _dereq_(42)
  , setToStringTag  = _dereq_(67)
  , getProto        = _dereq_(47).getProto
  , BUGGY           = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR     = '@@iterator'
  , KEYS            = 'keys'
  , VALUES          = 'values';
var returnThis = function(){ return this; };
module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG      = NAME + ' Iterator'
    , proto    = Base.prototype
    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , _default = _native || getMethod(DEFAULT)
    , methods, key;
  // Fix native
  if(_native){
    var IteratorPrototype = getProto(_default.call(new Base));
    // Set @@toStringTag to native iterators
    setToStringTag(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, SYMBOL_ITERATOR, returnThis);
  }
  // Define iterator
  if((!LIBRARY || FORCE) && (BUGGY || !(SYMBOL_ITERATOR in proto))){
    hide(proto, SYMBOL_ITERATOR, _default);
  }
  // Plug for library
  Iterators[NAME] = _default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEFAULT == VALUES ? _default : getMethod(VALUES),
      keys:    IS_SET            ? _default : getMethod(KEYS),
      entries: DEFAULT != VALUES ? _default : getMethod('entries')
    };
    if(FORCE)for(key in methods){
      if(!(key in proto))$redef(proto, key, methods[key]);
    } else $def($def.P + $def.F * BUGGY, NAME, methods);
  }
  return methods;
};
},{"19":19,"31":31,"32":32,"42":42,"46":46,"47":47,"49":49,"62":62,"67":67,"84":84}],44:[function(_dereq_,module,exports){
var ITERATOR     = _dereq_(84)('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"84":84}],45:[function(_dereq_,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],46:[function(_dereq_,module,exports){
module.exports = {};
},{}],47:[function(_dereq_,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],48:[function(_dereq_,module,exports){
var $         = _dereq_(47)
  , toIObject = _dereq_(79);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"47":47,"79":79}],49:[function(_dereq_,module,exports){
module.exports = false;
},{}],50:[function(_dereq_,module,exports){
// 20.2.2.14 Math.expm1(x)
module.exports = Math.expm1 || function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
};
},{}],51:[function(_dereq_,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x){
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};
},{}],52:[function(_dereq_,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};
},{}],53:[function(_dereq_,module,exports){
var global    = _dereq_(30)
  , macrotask = _dereq_(76).set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , isNode    = _dereq_(12)(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    if(domain)domain.enter();
    head.fn.call(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
  } last = undefined;
  if(parent)parent.enter();
};

// Node.js
if(isNode){
  notify = function(){
    process.nextTick(flush);
  };
// browsers with MutationObserver
} else if(Observer){
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
  };
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
} else {
  notify = function(){
    // strange IE + webpack dev server bug - use .call(global)
    macrotask.call(global, flush);
  };
}

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};
},{"12":12,"30":30,"76":76}],54:[function(_dereq_,module,exports){
var $redef = _dereq_(62);
module.exports = function(target, src){
  for(var key in src)$redef(target, key, src[key]);
  return target;
};
},{"62":62}],55:[function(_dereq_,module,exports){
// 19.1.2.1 Object.assign(target, source, ...)
var $        = _dereq_(47)
  , toObject = _dereq_(81)
  , IObject  = _dereq_(35);

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = _dereq_(25)(function(){
  var a = Object.assign
    , A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , $$    = arguments
    , $$len = $$.length
    , index = 1
    , getKeys    = $.getKeys
    , getSymbols = $.getSymbols
    , isEnum     = $.isEnum;
  while($$len > index){
    var S      = IObject($$[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  }
  return T;
} : Object.assign;
},{"25":25,"35":35,"47":47,"81":81}],56:[function(_dereq_,module,exports){
// most Object methods by ES6 should accept primitives
var $def  = _dereq_(19)
  , core  = _dereq_(17)
  , fails = _dereq_(25);
module.exports = function(KEY, exec){
  var $def = _dereq_(19)
    , fn   = (core.Object || {})[KEY] || Object[KEY]
    , exp  = {};
  exp[KEY] = exec(fn);
  $def($def.S + $def.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"17":17,"19":19,"25":25}],57:[function(_dereq_,module,exports){
var $         = _dereq_(47)
  , toIObject = _dereq_(79)
  , isEnum    = $.isEnum;
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = $.getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)if(isEnum.call(O, key = keys[i++])){
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};
},{"47":47,"79":79}],58:[function(_dereq_,module,exports){
// all object keys, includes non-enumerable and symbols
var $        = _dereq_(47)
  , anObject = _dereq_(5)
  , Reflect  = _dereq_(30).Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
  var keys       = $.getNames(anObject(it))
    , getSymbols = $.getSymbols;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};
},{"30":30,"47":47,"5":5}],59:[function(_dereq_,module,exports){
'use strict';
var path      = _dereq_(60)
  , invoke    = _dereq_(34)
  , aFunction = _dereq_(3);
module.exports = function(/* ...pargs */){
  var fn     = aFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that  = this
      , $$    = arguments
      , $$len = $$.length
      , j = 0, k = 0, args;
    if(!holder && !$$len)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = $$[k++];
    while($$len > k)args.push($$[k++]);
    return invoke(fn, args, that);
  };
};
},{"3":3,"34":34,"60":60}],60:[function(_dereq_,module,exports){
module.exports = _dereq_(30);
},{"30":30}],61:[function(_dereq_,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],62:[function(_dereq_,module,exports){
// add fake Function#toString
// for correct work wrapped methods / constructors with methods like LoDash isNative
var global    = _dereq_(30)
  , hide      = _dereq_(32)
  , SRC       = _dereq_(83)('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

_dereq_(17).inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  if(typeof val == 'function'){
    val.hasOwnProperty(SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    val.hasOwnProperty('name') || hide(val, 'name', key);
  }
  if(O === global){
    O[key] = val;
  } else {
    if(!safe)delete O[key];
    hide(O, key, val);
  }
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
},{"17":17,"30":30,"32":32,"83":83}],63:[function(_dereq_,module,exports){
module.exports = function(regExp, replace){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(it).replace(regExp, replacer);
  };
};
},{}],64:[function(_dereq_,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],65:[function(_dereq_,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = _dereq_(47).getDesc
  , isObject = _dereq_(39)
  , anObject = _dereq_(5);
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = _dereq_(18)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"18":18,"39":39,"47":47,"5":5}],66:[function(_dereq_,module,exports){
'use strict';
var global      = _dereq_(30)
  , $           = _dereq_(47)
  , DESCRIPTORS = _dereq_(21)
  , SPECIES     = _dereq_(84)('species');

module.exports = function(KEY){
  var C = global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"21":21,"30":30,"47":47,"84":84}],67:[function(_dereq_,module,exports){
var def = _dereq_(47).setDesc
  , has = _dereq_(31)
  , TAG = _dereq_(84)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"31":31,"47":47,"84":84}],68:[function(_dereq_,module,exports){
var global = _dereq_(30)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"30":30}],69:[function(_dereq_,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = _dereq_(5)
  , aFunction = _dereq_(3)
  , SPECIES   = _dereq_(84)('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"3":3,"5":5,"84":84}],70:[function(_dereq_,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],71:[function(_dereq_,module,exports){
var toInteger = _dereq_(78)
  , defined   = _dereq_(20);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l
      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"20":20,"78":78}],72:[function(_dereq_,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = _dereq_(40)
  , defined  = _dereq_(20);

module.exports = function(that, searchString, NAME){
  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};
},{"20":20,"40":40}],73:[function(_dereq_,module,exports){
// https://github.com/ljharb/proposal-string-pad-left-right
var toLength = _dereq_(80)
  , repeat   = _dereq_(74)
  , defined  = _dereq_(20);

module.exports = function(that, maxLength, fillString, left){
  var S            = String(defined(that))
    , stringLength = S.length
    , fillStr      = fillString === undefined ? ' ' : String(fillString)
    , intMaxLength = toLength(maxLength);
  if(intMaxLength <= stringLength)return S;
  if(fillStr == '')fillStr = ' ';
  var fillLen = intMaxLength - stringLength
    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};
},{"20":20,"74":74,"80":80}],74:[function(_dereq_,module,exports){
'use strict';
var toInteger = _dereq_(78)
  , defined   = _dereq_(20);

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};
},{"20":20,"78":78}],75:[function(_dereq_,module,exports){
var $def    = _dereq_(19)
  , defined = _dereq_(20)
  , fails   = _dereq_(25)
  , spaces  = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
      '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF'
  , space   = '[' + spaces + ']'
  , non     = '\u200b\u0085'
  , ltrim   = RegExp('^' + space + space + '*')
  , rtrim   = RegExp(space + space + '*$');

var $export = function(KEY, exec){
  var exp  = {};
  exp[KEY] = exec(trim);
  $def($def.P + $def.F * fails(function(){
    return !!spaces[KEY]() || non[KEY]() != non;
  }), 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = $export.trim = function(string, TYPE){
  string = String(defined(string));
  if(TYPE & 1)string = string.replace(ltrim, '');
  if(TYPE & 2)string = string.replace(rtrim, '');
  return string;
};

module.exports = $export;
},{"19":19,"20":20,"25":25}],76:[function(_dereq_,module,exports){
'use strict';
var ctx                = _dereq_(18)
  , invoke             = _dereq_(34)
  , html               = _dereq_(33)
  , cel                = _dereq_(22)
  , global             = _dereq_(30)
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listner = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(_dereq_(12)(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"12":12,"18":18,"22":22,"30":30,"33":33,"34":34}],77:[function(_dereq_,module,exports){
var toInteger = _dereq_(78)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"78":78}],78:[function(_dereq_,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],79:[function(_dereq_,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = _dereq_(35)
  , defined = _dereq_(20);
module.exports = function(it){
  return IObject(defined(it));
};
},{"20":20,"35":35}],80:[function(_dereq_,module,exports){
// 7.1.15 ToLength
var toInteger = _dereq_(78)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"78":78}],81:[function(_dereq_,module,exports){
// 7.1.13 ToObject(argument)
var defined = _dereq_(20);
module.exports = function(it){
  return Object(defined(it));
};
},{"20":20}],82:[function(_dereq_,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = _dereq_(39);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"39":39}],83:[function(_dereq_,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],84:[function(_dereq_,module,exports){
var store  = _dereq_(68)('wks')
  , uid    = _dereq_(83)
  , Symbol = _dereq_(30).Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
};
},{"30":30,"68":68,"83":83}],85:[function(_dereq_,module,exports){
var classof   = _dereq_(11)
  , ITERATOR  = _dereq_(84)('iterator')
  , Iterators = _dereq_(46);
module.exports = _dereq_(17).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"11":11,"17":17,"46":46,"84":84}],86:[function(_dereq_,module,exports){
'use strict';
var $                = _dereq_(47)
  , DESCRIPTORS      = _dereq_(21)
  , createDesc       = _dereq_(61)
  , html             = _dereq_(33)
  , cel              = _dereq_(22)
  , has              = _dereq_(31)
  , cof              = _dereq_(12)
  , $def             = _dereq_(19)
  , invoke           = _dereq_(34)
  , arrayMethod      = _dereq_(9)
  , IE_PROTO         = _dereq_(83)('__proto__')
  , isObject         = _dereq_(39)
  , anObject         = _dereq_(5)
  , aFunction        = _dereq_(3)
  , toObject         = _dereq_(81)
  , toIObject        = _dereq_(79)
  , toInteger        = _dereq_(78)
  , toIndex          = _dereq_(77)
  , toLength         = _dereq_(80)
  , IObject          = _dereq_(35)
  , fails            = _dereq_(25)
  , ObjectProto      = Object.prototype
  , A                = []
  , _slice           = A.slice
  , _join            = A.join
  , defineProperty   = $.setDesc
  , getOwnDescriptor = $.getDesc
  , defineProperties = $.setDescs
  , $indexOf         = _dereq_(8)(false)
  , factories        = {}
  , IE8_DOM_DEFINE;

if(!DESCRIPTORS){
  IE8_DOM_DEFINE = !fails(function(){
    return defineProperty(cel('div'), 'a', {get: function(){ return 7; }}).a != 7;
  });
  $.setDesc = function(O, P, Attributes){
    if(IE8_DOM_DEFINE)try {
      return defineProperty(O, P, Attributes);
    } catch(e){ /* empty */ }
    if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
    if('value' in Attributes)anObject(O)[P] = Attributes.value;
    return O;
  };
  $.getDesc = function(O, P){
    if(IE8_DOM_DEFINE)try {
      return getOwnDescriptor(O, P);
    } catch(e){ /* empty */ }
    if(has(O, P))return createDesc(!ObjectProto.propertyIsEnumerable.call(O, P), O[P]);
  };
  $.setDescs = defineProperties = function(O, Properties){
    anObject(O);
    var keys   = $.getKeys(Properties)
      , length = keys.length
      , i = 0
      , P;
    while(length > i)$.setDesc(O, P = keys[i++], Properties[P]);
    return O;
  };
}
$def($def.S + $def.F * !DESCRIPTORS, 'Object', {
  // 19.1.2.6 / 15.2.3.3 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $.getDesc,
  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
  defineProperty: $.setDesc,
  // 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
  defineProperties: defineProperties
});

  // IE 8- don't enum bug keys
var keys1 = ('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,' +
            'toLocaleString,toString,valueOf').split(',')
  // Additional keys for getOwnPropertyNames
  , keys2 = keys1.concat('length', 'prototype')
  , keysLen1 = keys1.length;

// Create object with `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = cel('iframe')
    , i      = keysLen1
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict.prototype[keys1[i]];
  return createDict();
};
var createGetKeys = function(names, length){
  return function(object){
    var O      = toIObject(object)
      , i      = 0
      , result = []
      , key;
    for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while(length > i)if(has(O, key = names[i++])){
      ~$indexOf(result, key) || result.push(key);
    }
    return result;
  };
};
var Empty = function(){};
$def($def.S, 'Object', {
  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
  getPrototypeOf: $.getProto = $.getProto || function(O){
    O = toObject(O);
    if(has(O, IE_PROTO))return O[IE_PROTO];
    if(typeof O.constructor == 'function' && O instanceof O.constructor){
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  },
  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $.getNames = $.getNames || createGetKeys(keys2, keys2.length, true),
  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  create: $.create = $.create || function(O, /*?*/Properties){
    var result;
    if(O !== null){
      Empty.prototype = anObject(O);
      result = new Empty();
      Empty.prototype = null;
      // add "__proto__" for Object.getPrototypeOf shim
      result[IE_PROTO] = O;
    } else result = createDict();
    return Properties === undefined ? result : defineProperties(result, Properties);
  },
  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
  keys: $.getKeys = $.getKeys || createGetKeys(keys1, keysLen1, false)
});

var construct = function(F, len, args){
  if(!(len in factories)){
    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  }
  return factories[len](F, args);
};

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
$def($def.P, 'Function', {
  bind: function bind(that /*, args... */){
    var fn       = aFunction(this)
      , partArgs = _slice.call(arguments, 1);
    var bound = function(/* args... */){
      var args = partArgs.concat(_slice.call(arguments));
      return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
    };
    if(isObject(fn.prototype))bound.prototype = fn.prototype;
    return bound;
  }
});

// fallback for not array-like ES3 strings and DOM objects
var buggySlice = fails(function(){
  if(html)_slice.call(html);
});

$def($def.P + $def.F * buggySlice, 'Array', {
  slice: function(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return _slice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});
$def($def.P + $def.F * (IObject != Object), 'Array', {
  join: function(){
    return _join.apply(IObject(this), arguments);
  }
});

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
$def($def.S, 'Array', {isArray: _dereq_(37)});

var createArrayReduce = function(isRight){
  return function(callbackfn, memo){
    aFunction(callbackfn);
    var O      = IObject(this)
      , length = toLength(O.length)
      , index  = isRight ? length - 1 : 0
      , i      = isRight ? -1 : 1;
    if(arguments.length < 2)for(;;){
      if(index in O){
        memo = O[index];
        index += i;
        break;
      }
      index += i;
      if(isRight ? index < 0 : length <= index){
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for(;isRight ? index >= 0 : length > index; index += i)if(index in O){
      memo = callbackfn(memo, O[index], index, this);
    }
    return memo;
  };
};
var methodize = function($fn){
  return function(arg1/*, arg2 = undefined */){
    return $fn(this, arg1, arguments[1]);
  };
};
$def($def.P, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: $.each = $.each || methodize(arrayMethod(0)),
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: methodize(arrayMethod(1)),
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: methodize(arrayMethod(2)),
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: methodize(arrayMethod(3)),
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: methodize(arrayMethod(4)),
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: createArrayReduce(false),
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: createArrayReduce(true),
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: methodize($indexOf),
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function(el, fromIndex /* = @[*-1] */){
    var O      = toIObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, toInteger(fromIndex));
    if(index < 0)index = toLength(length + index);
    for(;index >= 0; index--)if(index in O)if(O[index] === el)return index;
    return -1;
  }
});

// 20.3.3.1 / 15.9.4.4 Date.now()
$def($def.S, 'Date', {now: function(){ return +new Date; }});

var lz = function(num){
  return num > 9 ? num : '0' + num;
};

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
// PhantomJS and old webkit had a broken Date implementation.
var date       = new Date(-5e13 - 1)
  , brokenDate = !(date.toISOString && date.toISOString() == '0385-07-25T07:06:39.999Z'
      && fails(function(){ new Date(NaN).toISOString(); }));
$def($def.P + $def.F * brokenDate, 'Date', {
  toISOString: function toISOString(){
    if(!isFinite(this))throw RangeError('Invalid time value');
    var d = this
      , y = d.getUTCFullYear()
      , m = d.getUTCMilliseconds()
      , s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
      '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
      'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
      ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }
});
},{"12":12,"19":19,"21":21,"22":22,"25":25,"3":3,"31":31,"33":33,"34":34,"35":35,"37":37,"39":39,"47":47,"5":5,"61":61,"77":77,"78":78,"79":79,"8":8,"80":80,"81":81,"83":83,"9":9}],87:[function(_dereq_,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var $def = _dereq_(19);

$def($def.P, 'Array', {copyWithin: _dereq_(6)});

_dereq_(4)('copyWithin');
},{"19":19,"4":4,"6":6}],88:[function(_dereq_,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $def = _dereq_(19);

$def($def.P, 'Array', {fill: _dereq_(7)});

_dereq_(4)('fill');
},{"19":19,"4":4,"7":7}],89:[function(_dereq_,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var KEY    = 'findIndex'
  , $def   = _dereq_(19)
  , forced = true
  , $find  = _dereq_(9)(6);
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$def($def.P + $def.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
_dereq_(4)(KEY);
},{"19":19,"4":4,"9":9}],90:[function(_dereq_,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var KEY    = 'find'
  , $def   = _dereq_(19)
  , forced = true
  , $find  = _dereq_(9)(5);
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$def($def.P + $def.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
_dereq_(4)(KEY);
},{"19":19,"4":4,"9":9}],91:[function(_dereq_,module,exports){
'use strict';
var ctx         = _dereq_(18)
  , $def        = _dereq_(19)
  , toObject    = _dereq_(81)
  , call        = _dereq_(41)
  , isArrayIter = _dereq_(36)
  , toLength    = _dereq_(80)
  , getIterFn   = _dereq_(85);
$def($def.S + $def.F * !_dereq_(44)(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , $$      = arguments
      , $$len   = $$.length
      , mapfn   = $$len > 1 ? $$[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        result[index] = mapping ? mapfn(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});

},{"18":18,"19":19,"36":36,"41":41,"44":44,"80":80,"81":81,"85":85}],92:[function(_dereq_,module,exports){
'use strict';
var addToUnscopables = _dereq_(4)
  , step             = _dereq_(45)
  , Iterators        = _dereq_(46)
  , toIObject        = _dereq_(79);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = _dereq_(43)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"4":4,"43":43,"45":45,"46":46,"79":79}],93:[function(_dereq_,module,exports){
'use strict';
var $def = _dereq_(19);

// WebKit Array.of isn't generic
$def($def.S + $def.F * _dereq_(25)(function(){
  function F(){}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , $$     = arguments
      , $$len  = $$.length
      , result = new (typeof this == 'function' ? this : Array)($$len);
    while($$len > index)result[index] = $$[index++];
    result.length = $$len;
    return result;
  }
});
},{"19":19,"25":25}],94:[function(_dereq_,module,exports){
_dereq_(66)('Array');
},{"66":66}],95:[function(_dereq_,module,exports){
'use strict';
var $             = _dereq_(47)
  , isObject      = _dereq_(39)
  , HAS_INSTANCE  = _dereq_(84)('hasInstance')
  , FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))$.setDesc(FunctionProto, HAS_INSTANCE, {value: function(O){
  if(typeof this != 'function' || !isObject(O))return false;
  if(!isObject(this.prototype))return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while(O = $.getProto(O))if(this.prototype === O)return true;
  return false;
}});
},{"39":39,"47":47,"84":84}],96:[function(_dereq_,module,exports){
var setDesc    = _dereq_(47).setDesc
  , createDesc = _dereq_(61)
  , has        = _dereq_(31)
  , FProto     = Function.prototype
  , nameRE     = /^\s*function ([^ (]*)/
  , NAME       = 'name';
// 19.2.4.2 name
NAME in FProto || _dereq_(21) && setDesc(FProto, NAME, {
  configurable: true,
  get: function(){
    var match = ('' + this).match(nameRE)
      , name  = match ? match[1] : '';
    has(this, NAME) || setDesc(this, NAME, createDesc(5, name));
    return name;
  }
});
},{"21":21,"31":31,"47":47,"61":61}],97:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_(13);

// 23.1 Map Objects
_dereq_(16)('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"13":13,"16":16}],98:[function(_dereq_,module,exports){
// 20.2.2.3 Math.acosh(x)
var $def   = _dereq_(19)
  , log1p  = _dereq_(51)
  , sqrt   = Math.sqrt
  , $acosh = Math.acosh;

// V8 bug https://code.google.com/p/v8/issues/detail?id=3509
$def($def.S + $def.F * !($acosh && Math.floor($acosh(Number.MAX_VALUE)) == 710), 'Math', {
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});
},{"19":19,"51":51}],99:[function(_dereq_,module,exports){
// 20.2.2.5 Math.asinh(x)
var $def = _dereq_(19);

function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

$def($def.S, 'Math', {asinh: asinh});
},{"19":19}],100:[function(_dereq_,module,exports){
// 20.2.2.7 Math.atanh(x)
var $def = _dereq_(19);

$def($def.S, 'Math', {
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});
},{"19":19}],101:[function(_dereq_,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $def = _dereq_(19)
  , sign = _dereq_(52);

$def($def.S, 'Math', {
  cbrt: function cbrt(x){
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});
},{"19":19,"52":52}],102:[function(_dereq_,module,exports){
// 20.2.2.11 Math.clz32(x)
var $def = _dereq_(19);

$def($def.S, 'Math', {
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});
},{"19":19}],103:[function(_dereq_,module,exports){
// 20.2.2.12 Math.cosh(x)
var $def = _dereq_(19)
  , exp  = Math.exp;

$def($def.S, 'Math', {
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  }
});
},{"19":19}],104:[function(_dereq_,module,exports){
// 20.2.2.14 Math.expm1(x)
var $def = _dereq_(19);

$def($def.S, 'Math', {expm1: _dereq_(50)});
},{"19":19,"50":50}],105:[function(_dereq_,module,exports){
// 20.2.2.16 Math.fround(x)
var $def  = _dereq_(19)
  , sign  = _dereq_(52)
  , pow   = Math.pow
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);

var roundTiesToEven = function(n){
  return n + 1 / EPSILON - 1 / EPSILON;
};


$def($def.S, 'Math', {
  fround: function fround(x){
    var $abs  = Math.abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  }
});
},{"19":19,"52":52}],106:[function(_dereq_,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $def = _dereq_(19)
  , abs  = Math.abs;

$def($def.S, 'Math', {
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum   = 0
      , i     = 0
      , $$    = arguments
      , $$len = $$.length
      , larg  = 0
      , arg, div;
    while(i < $$len){
      arg = abs($$[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});
},{"19":19}],107:[function(_dereq_,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $def  = _dereq_(19)
  , $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$def($def.S + $def.F * _dereq_(25)(function(){
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y){
    var UINT16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UINT16 & xn
      , yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});
},{"19":19,"25":25}],108:[function(_dereq_,module,exports){
// 20.2.2.21 Math.log10(x)
var $def = _dereq_(19);

$def($def.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});
},{"19":19}],109:[function(_dereq_,module,exports){
// 20.2.2.20 Math.log1p(x)
var $def = _dereq_(19);

$def($def.S, 'Math', {log1p: _dereq_(51)});
},{"19":19,"51":51}],110:[function(_dereq_,module,exports){
// 20.2.2.22 Math.log2(x)
var $def = _dereq_(19);

$def($def.S, 'Math', {
  log2: function log2(x){
    return Math.log(x) / Math.LN2;
  }
});
},{"19":19}],111:[function(_dereq_,module,exports){
// 20.2.2.28 Math.sign(x)
var $def = _dereq_(19);

$def($def.S, 'Math', {sign: _dereq_(52)});
},{"19":19,"52":52}],112:[function(_dereq_,module,exports){
// 20.2.2.30 Math.sinh(x)
var $def  = _dereq_(19)
  , expm1 = _dereq_(50)
  , exp   = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$def($def.S + $def.F * _dereq_(25)(function(){
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x){
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});
},{"19":19,"25":25,"50":50}],113:[function(_dereq_,module,exports){
// 20.2.2.33 Math.tanh(x)
var $def  = _dereq_(19)
  , expm1 = _dereq_(50)
  , exp   = Math.exp;

$def($def.S, 'Math', {
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});
},{"19":19,"50":50}],114:[function(_dereq_,module,exports){
// 20.2.2.34 Math.trunc(x)
var $def = _dereq_(19);

$def($def.S, 'Math', {
  trunc: function trunc(it){
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});
},{"19":19}],115:[function(_dereq_,module,exports){
'use strict';
var $           = _dereq_(47)
  , global      = _dereq_(30)
  , has         = _dereq_(31)
  , cof         = _dereq_(12)
  , toPrimitive = _dereq_(82)
  , fails       = _dereq_(25)
  , $trim       = _dereq_(75).trim
  , NUMBER      = 'Number'
  , $Number     = global[NUMBER]
  , Base        = $Number
  , proto       = $Number.prototype
  // Opera ~12 has broken Object#toString
  , BROKEN_COF  = cof($.create(proto)) == NUMBER
  , TRIM        = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function(argument){
  var it = toPrimitive(argument, false);
  if(typeof it == 'string' && it.length > 2){
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0)
      , third, radix, maxCode;
    if(first === 43 || first === 45){
      third = it.charCodeAt(2);
      if(third === 88 || third === 120)return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if(first === 48){
      switch(it.charCodeAt(1)){
        case 66 : case 98  : radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79 : case 111 : radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default : return +it;
      }
      for(var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++){
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if(code < 48 || code > maxCode)return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if(!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')){
  $Number = function Number(value){
    var it = arguments.length < 1 ? 0 : value
      , that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function(){ proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? new Base(toNumber(it)) : toNumber(it);
  };
  $.each.call(_dereq_(21) ? $.getNames(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), function(key){
    if(has(Base, key) && !has($Number, key)){
      $.setDesc($Number, key, $.getDesc(Base, key));
    }
  });
  $Number.prototype = proto;
  proto.constructor = $Number;
  _dereq_(62)(global, NUMBER, $Number);
}
},{"12":12,"21":21,"25":25,"30":30,"31":31,"47":47,"62":62,"75":75,"82":82}],116:[function(_dereq_,module,exports){
// 20.1.2.1 Number.EPSILON
var $def = _dereq_(19);

$def($def.S, 'Number', {EPSILON: Math.pow(2, -52)});
},{"19":19}],117:[function(_dereq_,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $def      = _dereq_(19)
  , _isFinite = _dereq_(30).isFinite;

$def($def.S, 'Number', {
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  }
});
},{"19":19,"30":30}],118:[function(_dereq_,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $def = _dereq_(19);

$def($def.S, 'Number', {isInteger: _dereq_(38)});
},{"19":19,"38":38}],119:[function(_dereq_,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $def = _dereq_(19);

$def($def.S, 'Number', {
  isNaN: function isNaN(number){
    return number != number;
  }
});
},{"19":19}],120:[function(_dereq_,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $def      = _dereq_(19)
  , isInteger = _dereq_(38)
  , abs       = Math.abs;

$def($def.S, 'Number', {
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});
},{"19":19,"38":38}],121:[function(_dereq_,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $def = _dereq_(19);

$def($def.S, 'Number', {MAX_SAFE_INTEGER: 0x1fffffffffffff});
},{"19":19}],122:[function(_dereq_,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $def = _dereq_(19);

$def($def.S, 'Number', {MIN_SAFE_INTEGER: -0x1fffffffffffff});
},{"19":19}],123:[function(_dereq_,module,exports){
// 20.1.2.12 Number.parseFloat(string)
var $def = _dereq_(19);

$def($def.S, 'Number', {parseFloat: parseFloat});
},{"19":19}],124:[function(_dereq_,module,exports){
// 20.1.2.13 Number.parseInt(string, radix)
var $def = _dereq_(19);

$def($def.S, 'Number', {parseInt: parseInt});
},{"19":19}],125:[function(_dereq_,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $def = _dereq_(19);

$def($def.S + $def.F, 'Object', {assign: _dereq_(55)});
},{"19":19,"55":55}],126:[function(_dereq_,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = _dereq_(39);

_dereq_(56)('freeze', function($freeze){
  return function freeze(it){
    return $freeze && isObject(it) ? $freeze(it) : it;
  };
});
},{"39":39,"56":56}],127:[function(_dereq_,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = _dereq_(79);

_dereq_(56)('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"56":56,"79":79}],128:[function(_dereq_,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
_dereq_(56)('getOwnPropertyNames', function(){
  return _dereq_(29).get;
});
},{"29":29,"56":56}],129:[function(_dereq_,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = _dereq_(81);

_dereq_(56)('getPrototypeOf', function($getPrototypeOf){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
},{"56":56,"81":81}],130:[function(_dereq_,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = _dereq_(39);

_dereq_(56)('isExtensible', function($isExtensible){
  return function isExtensible(it){
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});
},{"39":39,"56":56}],131:[function(_dereq_,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = _dereq_(39);

_dereq_(56)('isFrozen', function($isFrozen){
  return function isFrozen(it){
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});
},{"39":39,"56":56}],132:[function(_dereq_,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = _dereq_(39);

_dereq_(56)('isSealed', function($isSealed){
  return function isSealed(it){
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});
},{"39":39,"56":56}],133:[function(_dereq_,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $def = _dereq_(19);
$def($def.S, 'Object', {is: _dereq_(64)});
},{"19":19,"64":64}],134:[function(_dereq_,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = _dereq_(81);

_dereq_(56)('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"56":56,"81":81}],135:[function(_dereq_,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = _dereq_(39);

_dereq_(56)('preventExtensions', function($preventExtensions){
  return function preventExtensions(it){
    return $preventExtensions && isObject(it) ? $preventExtensions(it) : it;
  };
});
},{"39":39,"56":56}],136:[function(_dereq_,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = _dereq_(39);

_dereq_(56)('seal', function($seal){
  return function seal(it){
    return $seal && isObject(it) ? $seal(it) : it;
  };
});
},{"39":39,"56":56}],137:[function(_dereq_,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = _dereq_(19);
$def($def.S, 'Object', {setPrototypeOf: _dereq_(65).set});
},{"19":19,"65":65}],138:[function(_dereq_,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = _dereq_(11)
  , test    = {};
test[_dereq_(84)('toStringTag')] = 'z';
if(test + '' != '[object z]'){
  _dereq_(62)(Object.prototype, 'toString', function toString(){
    return '[object ' + classof(this) + ']';
  }, true);
}
},{"11":11,"62":62,"84":84}],139:[function(_dereq_,module,exports){
'use strict';
var $          = _dereq_(47)
  , LIBRARY    = _dereq_(49)
  , global     = _dereq_(30)
  , ctx        = _dereq_(18)
  , classof    = _dereq_(11)
  , $def       = _dereq_(19)
  , isObject   = _dereq_(39)
  , anObject   = _dereq_(5)
  , aFunction  = _dereq_(3)
  , strictNew  = _dereq_(70)
  , forOf      = _dereq_(28)
  , setProto   = _dereq_(65).set
  , same       = _dereq_(64)
  , SPECIES    = _dereq_(84)('species')
  , speciesConstructor = _dereq_(69)
  , RECORD     = _dereq_(83)('record')
  , asap       = _dereq_(53)
  , PROMISE    = 'Promise'
  , process    = global.process
  , isNode     = classof(process) == 'process'
  , P          = global[PROMISE]
  , Wrapper;

var testResolve = function(sub){
  var test = new P(function(){});
  if(sub)test.constructor = Object;
  return P.resolve(test) === test;
};

var useNative = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = P && P.resolve && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && _dereq_(21)){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
var isPromise = function(it){
  return isObject(it) && (useNative ? classof(it) == 'Promise' : RECORD in it);
};
var sameConstructor = function(a, b){
  // library wrapper special case
  if(LIBRARY && a === P && b === Wrapper)return true;
  return same(a, b);
};
var getConstructor = function(C){
  var S = anObject(C)[SPECIES];
  return S != undefined ? S : C;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function(record, isReject){
  if(record.n)return;
  record.n = true;
  var chain = record.c;
  asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    var run = function(react){
      var cb = ok ? react.ok : react.fail
        , ret, then;
      try {
        if(cb){
          if(!ok)record.h = true;
          ret = cb === true ? value : cb(value);
          if(ret === react.P){
            react.rej(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(ret)){
            then.call(ret, react.res, react.rej);
          } else react.res(ret);
        } else react.rej(value);
      } catch(err){
        react.rej(err);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
    record.n = false;
    if(isReject)setTimeout(function(){
      var promise = record.p
        , handler, console;
      if(isUnhandled(promise)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      } record.a = undefined;
    }, 1);
  });
};
var isUnhandled = function(promise){
  var record = promise[RECORD]
    , chain  = record.a || record.c
    , i      = 0
    , react;
  if(record.h)return false;
  while(chain.length > i){
    react = chain[i++];
    if(react.fail || !isUnhandled(react.P))return false;
  } return true;
};
var $reject = function(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  notify(record, true);
};
var $resolve = function(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(then = isThenable(value)){
      asap(function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record, false);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
};

// constructor polyfill
if(!useNative){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    aFunction(executor);
    var record = {
      p: strictNew(this, P, PROMISE),         // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false,                               // <- handled rejection
      n: false                                // <- notify
    };
    this[RECORD] = record;
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  _dereq_(54)(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var react = {
        ok:   typeof onFulfilled == 'function' ? onFulfilled : true,
        fail: typeof onRejected == 'function'  ? onRejected  : false
      };
      var promise = react.P = new (speciesConstructor(this, P))(function(res, rej){
        react.res = res;
        react.rej = rej;
      });
      aFunction(react.res);
      aFunction(react.rej);
      var record = this[RECORD];
      record.c.push(react);
      if(record.a)record.a.push(react);
      if(record.s)notify(record, false);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

// export
$def($def.G + $def.W + $def.F * !useNative, {Promise: P});
_dereq_(67)(P, PROMISE);
_dereq_(66)(PROMISE);
Wrapper = _dereq_(17)[PROMISE];

// statics
$def($def.S + $def.F * !useNative, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    return new this(function(res, rej){ rej(r); });
  }
});
$def($def.S + $def.F * (!useNative || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    return isPromise(x) && sameConstructor(x.constructor, this)
      ? x : new this(function(res){ res(x); });
  }
});
$def($def.S + $def.F * !(useNative && _dereq_(44)(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C      = getConstructor(this)
      , values = [];
    return new C(function(res, rej){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        C.resolve(promise).then(function(value){
          results[index] = value;
          --remaining || res(results);
        }, rej);
      });
      else res(results);
    });
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C = getConstructor(this);
    return new C(function(res, rej){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(res, rej);
      });
    });
  }
});
},{"11":11,"17":17,"18":18,"19":19,"21":21,"28":28,"3":3,"30":30,"39":39,"44":44,"47":47,"49":49,"5":5,"53":53,"54":54,"64":64,"65":65,"66":66,"67":67,"69":69,"70":70,"83":83,"84":84}],140:[function(_dereq_,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $def   = _dereq_(19)
  , _apply = Function.apply;

$def($def.S, 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList){
    return _apply.call(target, thisArgument, argumentsList);
  }
});
},{"19":19}],141:[function(_dereq_,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $         = _dereq_(47)
  , $def      = _dereq_(19)
  , aFunction = _dereq_(3)
  , anObject  = _dereq_(5)
  , isObject  = _dereq_(39)
  , bind      = Function.bind || _dereq_(17).Function.prototype.bind;

// MS Edge supports only 2 arguments
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
$def($def.S + $def.F * _dereq_(25)(function(){
  function F(){}
  return !(Reflect.construct(function(){}, [], F) instanceof F);
}), 'Reflect', {
  construct: function construct(Target, args /*, newTarget*/){
    aFunction(Target);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if(Target == newTarget){
      // w/o altered newTarget, optimization for 0-4 arguments
      if(args != undefined)switch(anObject(args).length){
        case 0: return new Target;
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args));
    }
    // with altered newTarget, not support built-in constructors
    var proto    = newTarget.prototype
      , instance = $.create(isObject(proto) ? proto : Object.prototype)
      , result   = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});
},{"17":17,"19":19,"25":25,"3":3,"39":39,"47":47,"5":5}],142:[function(_dereq_,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var $        = _dereq_(47)
  , $def     = _dereq_(19)
  , anObject = _dereq_(5);

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$def($def.S + $def.F * _dereq_(25)(function(){
  Reflect.defineProperty($.setDesc({}, 1, {value: 1}), 1, {value: 2});
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes){
    anObject(target);
    try {
      $.setDesc(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"19":19,"25":25,"47":47,"5":5}],143:[function(_dereq_,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $def     = _dereq_(19)
  , getDesc  = _dereq_(47).getDesc
  , anObject = _dereq_(5);

$def($def.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = getDesc(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});
},{"19":19,"47":47,"5":5}],144:[function(_dereq_,module,exports){
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $def     = _dereq_(19)
  , anObject = _dereq_(5);
var Enumerate = function(iterated){
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = []       // keys
    , key;
  for(key in iterated)keys.push(key);
};
_dereq_(42)(Enumerate, 'Object', function(){
  var that = this
    , keys = that._k
    , key;
  do {
    if(that._i >= keys.length)return {value: undefined, done: true};
  } while(!((key = keys[that._i++]) in that._t));
  return {value: key, done: false};
});

$def($def.S, 'Reflect', {
  enumerate: function enumerate(target){
    return new Enumerate(target);
  }
});
},{"19":19,"42":42,"5":5}],145:[function(_dereq_,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var $        = _dereq_(47)
  , $def     = _dereq_(19)
  , anObject = _dereq_(5);

$def($def.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return $.getDesc(anObject(target), propertyKey);
  }
});
},{"19":19,"47":47,"5":5}],146:[function(_dereq_,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $def     = _dereq_(19)
  , getProto = _dereq_(47).getProto
  , anObject = _dereq_(5);

$def($def.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(anObject(target));
  }
});
},{"19":19,"47":47,"5":5}],147:[function(_dereq_,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var $        = _dereq_(47)
  , has      = _dereq_(31)
  , $def     = _dereq_(19)
  , isObject = _dereq_(39)
  , anObject = _dereq_(5);

function get(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc, proto;
  if(anObject(target) === receiver)return target[propertyKey];
  if(desc = $.getDesc(target, propertyKey))return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if(isObject(proto = $.getProto(target)))return get(proto, propertyKey, receiver);
}

$def($def.S, 'Reflect', {get: get});
},{"19":19,"31":31,"39":39,"47":47,"5":5}],148:[function(_dereq_,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $def = _dereq_(19);

$def($def.S, 'Reflect', {
  has: function has(target, propertyKey){
    return propertyKey in target;
  }
});
},{"19":19}],149:[function(_dereq_,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $def          = _dereq_(19)
  , anObject      = _dereq_(5)
  , $isExtensible = Object.isExtensible;

$def($def.S, 'Reflect', {
  isExtensible: function isExtensible(target){
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});
},{"19":19,"5":5}],150:[function(_dereq_,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $def = _dereq_(19);

$def($def.S, 'Reflect', {ownKeys: _dereq_(58)});
},{"19":19,"58":58}],151:[function(_dereq_,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $def               = _dereq_(19)
  , anObject           = _dereq_(5)
  , $preventExtensions = Object.preventExtensions;

$def($def.S, 'Reflect', {
  preventExtensions: function preventExtensions(target){
    anObject(target);
    try {
      if($preventExtensions)$preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"19":19,"5":5}],152:[function(_dereq_,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $def     = _dereq_(19)
  , setProto = _dereq_(65);

if(setProto)$def($def.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto){
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"19":19,"65":65}],153:[function(_dereq_,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var $          = _dereq_(47)
  , has        = _dereq_(31)
  , $def       = _dereq_(19)
  , createDesc = _dereq_(61)
  , anObject   = _dereq_(5)
  , isObject   = _dereq_(39);

function set(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = $.getDesc(anObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = $.getProto(target))){
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if(has(ownDesc, 'value')){
    if(ownDesc.writable === false || !isObject(receiver))return false;
    existingDescriptor = $.getDesc(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    $.setDesc(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$def($def.S, 'Reflect', {set: set});
},{"19":19,"31":31,"39":39,"47":47,"5":5,"61":61}],154:[function(_dereq_,module,exports){
var $        = _dereq_(47)
  , global   = _dereq_(30)
  , isRegExp = _dereq_(40)
  , $flags   = _dereq_(27)
  , $RegExp  = global.RegExp
  , Base     = $RegExp
  , proto    = $RegExp.prototype
  , re1      = /a/g
  , re2      = /a/g
  // "new" creates a new object, old webkit buggy here
  , CORRECT_NEW = new $RegExp(re1) !== re1;

if(_dereq_(21) && (!CORRECT_NEW || _dereq_(25)(function(){
  re2[_dereq_(84)('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))){
  $RegExp = function RegExp(p, f){
    var piRE = isRegExp(p)
      , fiU  = f === undefined;
    return !(this instanceof $RegExp) && piRE && p.constructor === $RegExp && fiU ? p
      : CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f);
  };
  $.each.call($.getNames(Base), function(key){
    key in $RegExp || $.setDesc($RegExp, key, {
      configurable: true,
      get: function(){ return Base[key]; },
      set: function(it){ Base[key] = it; }
    });
  });
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  _dereq_(62)(global, 'RegExp', $RegExp);
}

_dereq_(66)('RegExp');
},{"21":21,"25":25,"27":27,"30":30,"40":40,"47":47,"62":62,"66":66,"84":84}],155:[function(_dereq_,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
var $ = _dereq_(47);
if(_dereq_(21) && /./g.flags != 'g')$.setDesc(RegExp.prototype, 'flags', {
  configurable: true,
  get: _dereq_(27)
});
},{"21":21,"27":27,"47":47}],156:[function(_dereq_,module,exports){
// @@match logic
_dereq_(26)('match', 1, function(defined, MATCH){
  // 21.1.3.11 String.prototype.match(regexp)
  return function match(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  };
});
},{"26":26}],157:[function(_dereq_,module,exports){
// @@replace logic
_dereq_(26)('replace', 2, function(defined, REPLACE, $replace){
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return function replace(searchValue, replaceValue){
    'use strict';
    var O  = defined(this)
      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  };
});
},{"26":26}],158:[function(_dereq_,module,exports){
// @@search logic
_dereq_(26)('search', 1, function(defined, SEARCH){
  // 21.1.3.15 String.prototype.search(regexp)
  return function search(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  };
});
},{"26":26}],159:[function(_dereq_,module,exports){
// @@split logic
_dereq_(26)('split', 2, function(defined, SPLIT, $split){
  // 21.1.3.17 String.prototype.split(separator, limit)
  return function split(separator, limit){
    'use strict';
    var O  = defined(this)
      , fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined
      ? fn.call(separator, O, limit)
      : $split.call(String(O), separator, limit);
  };
});
},{"26":26}],160:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_(13);

// 23.2 Set Objects
_dereq_(16)('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"13":13,"16":16}],161:[function(_dereq_,module,exports){
'use strict';
var $def = _dereq_(19)
  , $at  = _dereq_(71)(false);
$def($def.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});
},{"19":19,"71":71}],162:[function(_dereq_,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $def      = _dereq_(19)
  , toLength  = _dereq_(80)
  , context   = _dereq_(72)
  , ENDS_WITH = 'endsWith'
  , $endsWith = ''[ENDS_WITH];

$def($def.P + $def.F * _dereq_(24)(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    var that = context(this, searchString, ENDS_WITH)
      , $$   = arguments
      , endPosition = $$.length > 1 ? $$[1] : undefined
      , len    = toLength(that.length)
      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)
      , search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});
},{"19":19,"24":24,"72":72,"80":80}],163:[function(_dereq_,module,exports){
var $def    = _dereq_(19)
  , toIndex = _dereq_(77)
  , fromCharCode = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$def($def.S + $def.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res   = []
      , $$    = arguments
      , $$len = $$.length
      , i     = 0
      , code;
    while($$len > i){
      code = +$$[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});
},{"19":19,"77":77}],164:[function(_dereq_,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $def     = _dereq_(19)
  , context  = _dereq_(72)
  , INCLUDES = 'includes';

$def($def.P + $def.F * _dereq_(24)(INCLUDES), 'String', {
  includes: function includes(searchString /*, position = 0 */){
    return !!~context(this, searchString, INCLUDES).indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});
},{"19":19,"24":24,"72":72}],165:[function(_dereq_,module,exports){
'use strict';
var $at  = _dereq_(71)(true);

// 21.1.3.27 String.prototype[@@iterator]()
_dereq_(43)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"43":43,"71":71}],166:[function(_dereq_,module,exports){
var $def      = _dereq_(19)
  , toIObject = _dereq_(79)
  , toLength  = _dereq_(80);

$def($def.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl   = toIObject(callSite.raw)
      , len   = toLength(tpl.length)
      , $$    = arguments
      , $$len = $$.length
      , res   = []
      , i     = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < $$len)res.push(String($$[i]));
    } return res.join('');
  }
});
},{"19":19,"79":79,"80":80}],167:[function(_dereq_,module,exports){
var $def = _dereq_(19);

$def($def.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: _dereq_(74)
});
},{"19":19,"74":74}],168:[function(_dereq_,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $def        = _dereq_(19)
  , toLength    = _dereq_(80)
  , context     = _dereq_(72)
  , STARTS_WITH = 'startsWith'
  , $startsWith = ''[STARTS_WITH];

$def($def.P + $def.F * _dereq_(24)(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /*, position = 0 */){
    var that   = context(this, searchString, STARTS_WITH)
      , $$     = arguments
      , index  = toLength(Math.min($$.length > 1 ? $$[1] : undefined, that.length))
      , search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});
},{"19":19,"24":24,"72":72,"80":80}],169:[function(_dereq_,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()
_dereq_(75)('trim', function($trim){
  return function trim(){
    return $trim(this, 3);
  };
});
},{"75":75}],170:[function(_dereq_,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $              = _dereq_(47)
  , global         = _dereq_(30)
  , has            = _dereq_(31)
  , DESCRIPTORS    = _dereq_(21)
  , $def           = _dereq_(19)
  , $redef         = _dereq_(62)
  , $fails         = _dereq_(25)
  , shared         = _dereq_(68)
  , setToStringTag = _dereq_(67)
  , uid            = _dereq_(83)
  , wks            = _dereq_(84)
  , keyOf          = _dereq_(48)
  , $names         = _dereq_(29)
  , enumKeys       = _dereq_(23)
  , isArray        = _dereq_(37)
  , anObject       = _dereq_(5)
  , toIObject      = _dereq_(79)
  , createDesc     = _dereq_(61)
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(setDesc({}, 'a', {
    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = getDesc(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  setDesc(it, key, D);
  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
} : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var isSymbol = function(it){
  return typeof it == 'symbol';
};

var $defineProperty = function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toIObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};
var $stringify = function stringify(it){
  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
  var args = [it]
    , i    = 1
    , $$   = arguments
    , replacer, $replacer;
  while($$.length > i)args.push($$[i++]);
  replacer = args[1];
  if(typeof replacer == 'function')$replacer = replacer;
  if($replacer || !isArray(replacer))replacer = function(key, value){
    if($replacer)value = $replacer.call(this, key, value);
    if(!isSymbol(value))return value;
  };
  args[1] = replacer;
  return _stringify.apply($JSON, args);
};
var buggyJSON = $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
});

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
  };
  $redef($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  isSymbol = function(it){
    return it instanceof $Symbol;
  };

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(DESCRIPTORS && !_dereq_(49)){
    $redef(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
  'species,split,toPrimitive,toStringTag,unscopables'
).split(','), function(it){
  var sym = wks(it);
  symbolStatics[it] = useNative ? sym : wrap(sym);
});

setter = true;

$def($def.G + $def.W, {Symbol: $Symbol});

$def($def.S, 'Symbol', symbolStatics);

$def($def.S + $def.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $def($def.S + $def.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"19":19,"21":21,"23":23,"25":25,"29":29,"30":30,"31":31,"37":37,"47":47,"48":48,"49":49,"5":5,"61":61,"62":62,"67":67,"68":68,"79":79,"83":83,"84":84}],171:[function(_dereq_,module,exports){
'use strict';
var $            = _dereq_(47)
  , redef        = _dereq_(62)
  , weak         = _dereq_(15)
  , isObject     = _dereq_(39)
  , has          = _dereq_(31)
  , frozenStore  = weak.frozenStore
  , WEAK         = weak.WEAK
  , isExtensible = Object.isExtensible || isObject
  , tmp          = {};

// 23.3 WeakMap Objects
var $WeakMap = _dereq_(16)('WeakMap', function(get){
  return function WeakMap(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      if(!isExtensible(key))return frozenStore(this).get(key);
      if(has(key, WEAK))return key[WEAK][this._i];
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
}, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  $.each.call(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    redef(proto, key, function(a, b){
      // store frozen objects on leaky map
      if(isObject(a) && !isExtensible(a)){
        var result = frozenStore(this)[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
},{"15":15,"16":16,"31":31,"39":39,"47":47,"62":62}],172:[function(_dereq_,module,exports){
'use strict';
var weak = _dereq_(15);

// 23.4 WeakSet Objects
_dereq_(16)('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"15":15,"16":16}],173:[function(_dereq_,module,exports){
'use strict';
var $def      = _dereq_(19)
  , $includes = _dereq_(8)(true);
$def($def.P, 'Array', {
  // https://github.com/domenic/Array.prototype.includes
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});
_dereq_(4)('includes');
},{"19":19,"4":4,"8":8}],174:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = _dereq_(19);

$def($def.P, 'Map', {toJSON: _dereq_(14)('Map')});
},{"14":14,"19":19}],175:[function(_dereq_,module,exports){
// http://goo.gl/XkBrjD
var $def     = _dereq_(19)
  , $entries = _dereq_(57)(true);

$def($def.S, 'Object', {
  entries: function entries(it){
    return $entries(it);
  }
});
},{"19":19,"57":57}],176:[function(_dereq_,module,exports){
// https://gist.github.com/WebReflection/9353781
var $          = _dereq_(47)
  , $def       = _dereq_(19)
  , ownKeys    = _dereq_(58)
  , toIObject  = _dereq_(79)
  , createDesc = _dereq_(61);

$def($def.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O       = toIObject(object)
      , setDesc = $.setDesc
      , getDesc = $.getDesc
      , keys    = ownKeys(O)
      , result  = {}
      , i       = 0
      , key, D;
    while(keys.length > i){
      D = getDesc(O, key = keys[i++]);
      if(key in result)setDesc(result, key, createDesc(0, D));
      else result[key] = D;
    } return result;
  }
});
},{"19":19,"47":47,"58":58,"61":61,"79":79}],177:[function(_dereq_,module,exports){
// http://goo.gl/XkBrjD
var $def    = _dereq_(19)
  , $values = _dereq_(57)(false);

$def($def.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});
},{"19":19,"57":57}],178:[function(_dereq_,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $def = _dereq_(19)
  , $re  = _dereq_(63)(/[\\^$*+?.()|[\]{}]/g, '\\$&');
$def($def.S, 'RegExp', {escape: function escape(it){ return $re(it); }});

},{"19":19,"63":63}],179:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = _dereq_(19);

$def($def.P, 'Set', {toJSON: _dereq_(14)('Set')});
},{"14":14,"19":19}],180:[function(_dereq_,module,exports){
// https://github.com/mathiasbynens/String.prototype.at
'use strict';
var $def = _dereq_(19)
  , $at  = _dereq_(71)(true);
$def($def.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});
},{"19":19,"71":71}],181:[function(_dereq_,module,exports){
'use strict';
var $def = _dereq_(19)
  , $pad = _dereq_(73);
$def($def.P, 'String', {
  padLeft: function padLeft(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});
},{"19":19,"73":73}],182:[function(_dereq_,module,exports){
'use strict';
var $def = _dereq_(19)
  , $pad = _dereq_(73);
$def($def.P, 'String', {
  padRight: function padRight(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});
},{"19":19,"73":73}],183:[function(_dereq_,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
_dereq_(75)('trimLeft', function($trim){
  return function trimLeft(){
    return $trim(this, 1);
  };
});
},{"75":75}],184:[function(_dereq_,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
_dereq_(75)('trimRight', function($trim){
  return function trimRight(){
    return $trim(this, 2);
  };
});
},{"75":75}],185:[function(_dereq_,module,exports){
// JavaScript 1.6 / Strawman array statics shim
var $       = _dereq_(47)
  , $def    = _dereq_(19)
  , $ctx    = _dereq_(18)
  , $Array  = _dereq_(17).Array || Array
  , statics = {};
var setStatics = function(keys, length){
  $.each.call(keys.split(','), function(key){
    if(length == undefined && key in $Array)statics[key] = $Array[key];
    else if(key in [])statics[key] = $ctx(Function.call, [][key], length);
  });
};
setStatics('pop,reverse,shift,keys,values,entries', 1);
setStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
setStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
           'reduce,reduceRight,copyWithin,fill');
$def($def.S, 'Array', statics);
},{"17":17,"18":18,"19":19,"47":47}],186:[function(_dereq_,module,exports){
_dereq_(92);
var global      = _dereq_(30)
  , hide        = _dereq_(32)
  , Iterators   = _dereq_(46)
  , ITERATOR    = _dereq_(84)('iterator')
  , NL          = global.NodeList
  , HTC         = global.HTMLCollection
  , NLProto     = NL && NL.prototype
  , HTCProto    = HTC && HTC.prototype
  , ArrayValues = Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
if(NL && !(ITERATOR in NLProto))hide(NLProto, ITERATOR, ArrayValues);
if(HTC && !(ITERATOR in HTCProto))hide(HTCProto, ITERATOR, ArrayValues);
},{"30":30,"32":32,"46":46,"84":84,"92":92}],187:[function(_dereq_,module,exports){
var $def  = _dereq_(19)
  , $task = _dereq_(76);
$def($def.G + $def.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"19":19,"76":76}],188:[function(_dereq_,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global     = _dereq_(30)
  , $def       = _dereq_(19)
  , invoke     = _dereq_(34)
  , partial    = _dereq_(59)
  , navigator  = global.navigator
  , MSIE       = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      typeof fn == 'function' ? fn : Function(fn)
    ), time);
  } : set;
};
$def($def.G + $def.B + $def.F * MSIE, {
  setTimeout:  wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});
},{"19":19,"30":30,"34":34,"59":59}],189:[function(_dereq_,module,exports){
_dereq_(86);
_dereq_(170);
_dereq_(125);
_dereq_(133);
_dereq_(137);
_dereq_(138);
_dereq_(126);
_dereq_(136);
_dereq_(135);
_dereq_(131);
_dereq_(132);
_dereq_(130);
_dereq_(127);
_dereq_(129);
_dereq_(134);
_dereq_(128);
_dereq_(96);
_dereq_(95);
_dereq_(115);
_dereq_(116);
_dereq_(117);
_dereq_(118);
_dereq_(119);
_dereq_(120);
_dereq_(121);
_dereq_(122);
_dereq_(123);
_dereq_(124);
_dereq_(98);
_dereq_(99);
_dereq_(100);
_dereq_(101);
_dereq_(102);
_dereq_(103);
_dereq_(104);
_dereq_(105);
_dereq_(106);
_dereq_(107);
_dereq_(108);
_dereq_(109);
_dereq_(110);
_dereq_(111);
_dereq_(112);
_dereq_(113);
_dereq_(114);
_dereq_(163);
_dereq_(166);
_dereq_(169);
_dereq_(165);
_dereq_(161);
_dereq_(162);
_dereq_(164);
_dereq_(167);
_dereq_(168);
_dereq_(91);
_dereq_(93);
_dereq_(92);
_dereq_(94);
_dereq_(87);
_dereq_(88);
_dereq_(90);
_dereq_(89);
_dereq_(154);
_dereq_(155);
_dereq_(156);
_dereq_(157);
_dereq_(158);
_dereq_(159);
_dereq_(139);
_dereq_(97);
_dereq_(160);
_dereq_(171);
_dereq_(172);
_dereq_(140);
_dereq_(141);
_dereq_(142);
_dereq_(143);
_dereq_(144);
_dereq_(147);
_dereq_(145);
_dereq_(146);
_dereq_(148);
_dereq_(149);
_dereq_(150);
_dereq_(151);
_dereq_(153);
_dereq_(152);
_dereq_(173);
_dereq_(180);
_dereq_(181);
_dereq_(182);
_dereq_(183);
_dereq_(184);
_dereq_(178);
_dereq_(176);
_dereq_(177);
_dereq_(175);
_dereq_(174);
_dereq_(179);
_dereq_(185);
_dereq_(188);
_dereq_(187);
_dereq_(186);
module.exports = _dereq_(17);
},{"100":100,"101":101,"102":102,"103":103,"104":104,"105":105,"106":106,"107":107,"108":108,"109":109,"110":110,"111":111,"112":112,"113":113,"114":114,"115":115,"116":116,"117":117,"118":118,"119":119,"120":120,"121":121,"122":122,"123":123,"124":124,"125":125,"126":126,"127":127,"128":128,"129":129,"130":130,"131":131,"132":132,"133":133,"134":134,"135":135,"136":136,"137":137,"138":138,"139":139,"140":140,"141":141,"142":142,"143":143,"144":144,"145":145,"146":146,"147":147,"148":148,"149":149,"150":150,"151":151,"152":152,"153":153,"154":154,"155":155,"156":156,"157":157,"158":158,"159":159,"160":160,"161":161,"162":162,"163":163,"164":164,"165":165,"166":166,"167":167,"168":168,"169":169,"17":17,"170":170,"171":171,"172":172,"173":173,"174":174,"175":175,"176":176,"177":177,"178":178,"179":179,"180":180,"181":181,"182":182,"183":183,"184":184,"185":185,"186":186,"187":187,"188":188,"86":86,"87":87,"88":88,"89":89,"90":90,"91":91,"92":92,"93":93,"94":94,"95":95,"96":96,"97":97,"98":98,"99":99}],190:[function(_dereq_,module,exports){
(function (global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol =
    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = Object.create((outerFn || Generator).prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function(arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    // This invoke function is written in a style that assumes some
    // calling function (or Promise) will handle exceptions.
    function invoke(method, arg) {
      var result = generator[method](arg);
      var value = result.value;
      return value instanceof AwaitArgument
        ? Promise.resolve(value.arg).then(invokeNext, invokeThrow)
        : Promise.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration. If the Promise is rejected, however, the
            // result for this iteration will be rejected with the same
            // reason. Note that rejections of yielded Promises are not
            // thrown back into the generator function, as is the case
            // when an awaited Promise is rejected. This difference in
            // behavior between yield and await is important, because it
            // allows the consumer to decide what to do with the yielded
            // rejection (swallow it and continue, manually .throw it back
            // into the generator, abandon iteration, whatever). With
            // await, by contrast, there is no opportunity to examine the
            // rejection reason outside the generator function, so the
            // only option is to throw it from the await expression, and
            // let the generator function handle the exception.
            result.value = unwrapped;
            return result;
          });
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var invokeNext = invoke.bind(generator, "next");
    var invokeThrow = invoke.bind(generator, "throw");
    var invokeReturn = invoke.bind(generator, "return");
    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return invoke(method, arg);
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : new Promise(function (resolve) {
          resolve(callInvokeWithMethodAndArg());
        });
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          context._sent = arg;

          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            context.sent = undefined;
          }
        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

2D Game Sprite Library, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

/**
 * @fileoverview Define the Sprite in window, declare the Sprite.Base
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var SpriteCore = (function () {
    function SpriteCore() {
      _classCallCheck(this, SpriteCore);
    }

    _createClass(SpriteCore, [{
      key: "assign",
      value: function assign(name, object) {
        Object.defineProperty(this, name, {
          enumerable: false,
          configurable: false,
          writable: false,
          value: object
        });
        return this;
      }
    }]);

    return SpriteCore;
  })();

  ;

  var Sprite = window.Sprite = new SpriteCore();

  /**
   * Function Sprite.Namespace, return an unique Private-Properties function
   * for javascript private properties need, for es6
   */
  Sprite.assign("Namespace", function () {
    /**
     * Using closure variable store private properties
     * and different file have different "privateProperties"
     */
    var privates = new WeakMap();
    return function (object) {
      if (privates.has(object) == false) {
        privates.set(object, {});
      }
      return privates.get(object);
    };
  });

  /**
   * @param {number} N The min number
   * @param {number} M The max number
   * @return {number} A random integer N <= return < M, aka. [N, M)
   */
  Sprite.assign("rand", function (N, M) {
    var r = M - N;
    r *= Math.random();
    return N + Math.floor(r);
  });

  /**
   * @param {Object} object The object we require copy
   * @return {Object} A deep copy of object
   */
  Sprite.assign("copy", function (object) {
    return JSON.parse(JSON.stringify(object));
  });

  Sprite.assign("each", function (obj, functional) {
    if (obj.forEach) {
      obj.forEach(functional);
    } else {
      for (var key in obj) {
        functional(obj[key], key, obj);
      }
    }
  });

  Sprite.assign("uuid", function () {
    // generate a UUID
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/x|y/g, function (c) {
      var r = Math.floor(Math.random() * 16);
      if (c == "x") {
        return r.toString(16);
      } else {
        return (r & 0x03 | 0x08).toString(16);
      }
    });
  });

  Sprite.assign("btoa", function (str) {
    // convert str to base64
    return window.btoa(unescape(encodeURIComponent(str)));
  });

  Sprite.assign("atob", function (str) {
    // convert base64 str to original
    return decodeURIComponent(escape(window.atob(str)));
  });
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

2D Game Sprite Library, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

/**
 * @fileoverview Class Sprite.Display
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Class Sprite.Canvas, an renderer using canvas.getContext("2d")
   * @class
   */
  Sprite.assign("Canvas", (function () {
    _createClass(SpriteCanvas, null, [{
      key: "support",

      /**
       * @static
       * @return {boolean} The browser whether or not support HTML5 canvas
       */
      value: function support() {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        if (context) {
          return true;
        }
        return false;
      }

      /**
       * Construct a renderer width certain width and height
       * @constructor
       */

    }]);

    function SpriteCanvas(width, height) {
      _classCallCheck(this, SpriteCanvas);

      var privates = internal(this);
      var canvas = document.createElement("canvas");
      canvas.width = width || 640;
      canvas.height = height || 480;
      var context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Sprite.Canvas canvas is not supported");
      }

      console.log("Sprite.Canvas 2d inited");

      /**
       * Color after clear canvas
       */
      privates.color = "#000000";
      /**
       * The canvas object
       */
      privates.canvas = canvas;
      /**
       * Context of canvas
       */
      privates.context = context;
      /**
       * Global alpha
       */
      privates.alpha = 1;
      /**
       * Save some filter paramters, eg. brightness/contrast
       */
      privates.filter = new Map();
      this.filter("brightness", 0);
      this.filter("contrast", 0);
    }

    /**
     * @param {string} name The name of filter you want get or set
     * @param {number} value Number or undefined, if undefined ,return current value
     */

    _createClass(SpriteCanvas, [{
      key: "filter",
      value: function filter(name, value) {
        var privates = internal(this);
        if (Number.isFinite(value)) {
          if (name == "brightness") {
            value += 1;
          }
          if (name == "contrast") {
            value += 1;
          }
          if (privates.filter.get(name) != value) {
            (function () {
              privates.filter.set(name, value);
              var filter = [];
              privates.filter.forEach(function (value, key, object) {
                filter.push(key + "(" + value + ")");
              });
              filter = filter.join(" ");
              privates.canvas.style.filter = filter;
              privates.canvas.style.webkitFilter = filter;
            })();
          }
        } else {
          return privates.filter.get(name);
        }
      }
      /**
       * Draw an image on the canvas
       * arguments same as canvas.getContext("2d")
       */

    }, {
      key: "drawImage",
      value: function drawImage() {
        var privates = internal(this);
        privates.context.globalAlpha = this.alpha;
        privates.context.drawImage.apply(privates.context, arguments);
      }
    }, {
      key: "release",
      value: function release() {}
      // nothing

      /**
       * Remove everything on canvas but a single color
       */

    }, {
      key: "clear",
      value: function clear() {
        var privates = internal(this);
        privates.context.fillStyle = privates.color;
        privates.context.fillRect(0, 0, this.width, this.height);
      }

      /**
       * @return {string} The color, eg "#00ff00"
       */

    }, {
      key: "color",
      get: function get() {
        return internal(this).color;
      }
      /**
       * @param {string} value The new color, eg "#00ff00"
       */
      ,
      set: function set(value) {
        if (value.match(/^#([\da-fA-F][\da-fA-F])([\da-fA-F][\da-fA-F])([\da-fA-F][\da-fA-F])$/)) {
          internal(this).color = value;
        } else {
          console.error(value, this);
          throw new Error("Sprite.Canvas invalid color value");
        }
      }

      /**
       * @return {number} The alpha, 0 to 1
       */

    }, {
      key: "alpha",
      get: function get() {
        return internal(this).alpha;
      }
      /**
       * @param {number} value The new alpha number
       */
      ,
      set: function set(value) {
        if (Number.isFinite(value) && value >= 0 && value <= 1) {
          internal(this).alpha = value;
        } else {
          console.error(value, this);
          throw new Error("Sprite.Canvas got invalid alpha number");
        }
      }

      /**
       * @return {number} Width of canvas
       */

    }, {
      key: "width",
      get: function get() {
        return internal(this).canvas.width;
      }
      /**
       * @param {number} value New width
       */
      ,
      set: function set(value) {
        if (Number.isFinite(value) && value > 0 && value < 10000) {
          internal(this).canvas.width = value;
        } else {
          console.error(value, this);
          throw new Error("Sprite.Canvas got invalid width number");
        }
      }

      /**
       * @return {number} Height of canvas
       */

    }, {
      key: "height",
      get: function get() {
        return internal(this).canvas.height;
      }
      /**
       * @param {number} value New height
       */
      ,
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value) && value > 0 && value < 10000) {
          if (value != privates.canvas.height) {
            privates.canvas.height = value;
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Canvas got invalid height number");
        }
      }
      /**
       * @return {Object} Canvas
       */

    }, {
      key: "canvas",
      get: function get() {
        return internal(this).canvas;
      },
      set: function set(value) {
        throw new Error("Sprite.Canvas.canvas cannot write");
      }
    }]);

    return SpriteCanvas;
  })());
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

2D Game Sprite Library, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

/**
 * @fileoverview Define the Sprite.Webgl, a renderer, other choice from Sprite.Canvas
 * @author mail@qhduan.com (QH Duan)
 */
(function () {
  "use strict";

  var internal = Sprite.Namespace();

  function isPOT(value) {
    return value > 0 && (value - 1 & value) === 0;
  }

  /**
    Use mediump precision in WebGL when possible
    Highp in fragment shaders is an optional part of the OpenGL ES 2.0 spec,
    so not all hardware supports it
    lowp mediump highp
    https://developers.google.com/web/updates/2011/12/Use-mediump-precision-in-WebGL-when-possible?hl=en
     brightness and contrast's formular from https://github.com/evanw/glfx.js
  */
  var vertexShaderSrc = "\n  precision mediump float;\n  attribute vec2 a_texCoord;\n  varying vec2 v_texCoord;\n\n  attribute vec2 aVertex;\n  uniform vec2 resolution;\n\n  uniform vec4 position;\n\n  void main(void) {\n     vec2 a = aVertex * (position.zw / resolution) + (position.xy / resolution);\n     vec2 b = a * 2.0 - 1.0;\n\n     gl_Position = vec4(b * vec2(1.0, -1.0), 0.0, 1.0);\n     v_texCoord = a_texCoord;\n  }";

  var fragmentShaderSrc = "\n  precision mediump float;\n\n  uniform vec4 crop;\n  uniform float brightness;\n  uniform float alpha;\n  uniform float contrast;\n\n  uniform sampler2D image;\n\n  // the texCoords passed in from the vertex shader.\n  varying vec2 v_texCoord;\n\n  void main(void) {\n\n    vec2 t = v_texCoord;\n    t.x *= crop.z;\n    t.y *= crop.w;\n    t += crop.xy;\n\n     vec4 color = texture2D(image, t).rgba;\n\n     if (contrast != 0.0) {\n       if (contrast > 0.0) {\n         color.xyz = (color.xyz - 0.5) / (1.0 - contrast) + 0.5;\n       } else {\n         color.xyz = (color.xyz - 0.5) * (1.0 + contrast) + 0.5;\n       }\n     }\n\n     if (brightness != 0.0) {\n       color.xyz += brightness;\n     }\n\n     if (alpha != 1.0) {\n       color.a *=  alpha;\n     }\n\n     gl_FragColor = color;\n  }";

  /**
   * Renderer using webgl
   * @class
   */
  Sprite.assign("Webgl", (function () {
    _createClass(SpriteWebgl, null, [{
      key: "support",

      /**
       * @static
       * @return {boolean} The browser whether or not support WebGL
       */
      value: function support() {
        var canvas = document.createElement("canvas");
        var gl = canvas.getContext("webgl");
        if (!gl) {
          canvas.getContext("experimental-webgl");
        }
        if (!gl) {
          return false;
        }
        return true;
      }

      /**
       * Construct a renderer width certain width and height
       * @constructor
       */

    }]);

    function SpriteWebgl(width, height) {
      _classCallCheck(this, SpriteWebgl);

      var privates = internal(this);

      var canvas = document.createElement("canvas");
      canvas.width = width || 640;
      canvas.height = height || 480;

      var options = {
        antialias: false,
        preserveDrawingBuffer: true
      };

      var gl = canvas.getContext("webgl", options);
      if (!gl) {
        gl = canvas.getContext("experimental-webgl", options);
      }
      privates.gl = gl;

      if (!gl) {
        throw new Error("Sprite.Webgl webgl is not supported");
      }

      privates.color = [0, 0, 0];
      privates.filter = new Map();
      privates.textureCache = new Map();
      privates.canvas = canvas;
      privates.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

      gl.viewport(0, 0, canvas.width, canvas.height);

      var vertShaderObj = gl.createShader(gl.VERTEX_SHADER);
      var fragShaderObj = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(vertShaderObj, vertexShaderSrc);
      gl.shaderSource(fragShaderObj, fragmentShaderSrc);
      gl.compileShader(vertShaderObj);
      gl.compileShader(fragShaderObj);

      var program = gl.createProgram();
      gl.attachShader(program, vertShaderObj);
      gl.attachShader(program, fragShaderObj);

      gl.linkProgram(program);
      gl.useProgram(program);

      gl.cullFace(gl.BACK);
      gl.frontFace(gl.CW);
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      privates.cropLoc = gl.getUniformLocation(program, "crop");
      privates.brightnessLoc = gl.getUniformLocation(program, "brightness");
      privates.contrastLoc = gl.getUniformLocation(program, "contrast");
      privates.alphaLoc = gl.getUniformLocation(program, "alpha");
      privates.resolutionLoc = gl.getUniformLocation(program, "resolution");
      gl.uniform2f(privates.resolutionLoc, canvas.width, canvas.height);

      privates.positionLoc = gl.getUniformLocation(program, "position");

      privates.tLoc = gl.getAttribLocation(program, "a_texCoord");
      gl.enableVertexAttribArray(privates.tLoc);
      privates.texCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, privates.texCoordBuffer);
      gl.vertexAttribPointer(privates.tLoc, 2, gl.FLOAT, false, 0, 0);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]), gl.STATIC_DRAW);

      privates.vLoc = gl.getAttribLocation(program, "aVertex");
      gl.enableVertexAttribArray(privates.vLoc);
      privates.vertexBuff = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, privates.vertexBuff);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(privates.vLoc);
      gl.vertexAttribPointer(privates.vLoc, 2, gl.FLOAT, false, 0, 0);

      privates.currentTexture = null;

      // setting, don't move
      this.filter("brightness", 0);
      this.filter("contrast", 0);
      this.alpha = 1;

      console.log("Sprite.Webgl inited, max texture size: %d", gl.getParameter(gl.MAX_TEXTURE_SIZE));
    }

    _createClass(SpriteWebgl, [{
      key: "drawImage9",
      value: function drawImage9(image, sx, sy, sw, sh, dx, dy, dw, dh) {
        var privates = internal(this);
        var gl = privates.gl;

        var texture = this.createTexture(gl, image);
        if (privates.currentTexture != texture) {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          privates.currentTexture = texture;
        }

        gl.uniform4f(privates.cropLoc, sx / image.width, sy / image.height, sw / image.width, sh / image.height);
        gl.uniform4f(privates.positionLoc, dx, dy, dw, dh);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      }
    }, {
      key: "release",
      value: function release() {
        var privates = internal(this);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = privates.textureCache.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var texture = _step.value;

            privates.gl.deleteTexture(texture);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        privates.textureCache = new Map();
      }
    }, {
      key: "createTexture",
      value: function createTexture(gl, image) {
        var privates = internal(this);
        if (privates.textureCache.has(image)) {
          return privates.textureCache.get(image);
        } else {
          gl.activeTexture(gl.TEXTURE0);
          var texture = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

          // test width&height is power of 2, eg. 256, 512, 1024
          // may speed up
          if (isPOT(image.width) && isPOT(image.height)) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.generateMipmap(gl.TEXTURE_2D);
          } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          }

          gl.bindTexture(gl.TEXTURE_2D, null);
          privates.textureCache.set(image, texture);
          return texture;
        }
      }
    }, {
      key: "drawImage",
      value: function drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh) {
        if (arguments.length == 9) {
          // all right
        } else if (arguments.length == 5) {
            // drawImage (image, dx, dy, dw, dh);
            dx = sx;
            dy = sy;
            dw = sw;
            dh = sh;
            sx = 0;
            sy = 0;
            sw = image.width;
            sh = image.height;
          } else if (arguments.length == 3) {
            // drawImage (image, dx, dy);
            dx = sx;
            dy = sy;
            dw = image.width;
            dh = image.height;
            sx = 0;
            sy = 0;
            sw = image.width;
            sh = image.height;
          } else {
            console.error(arguments, this);
            throw new Error("Sprite.Webgl.drawImage invalid arguments");
          }

        /*
        if (dx > this.width || dy > this.height) {
          return;
        }
         if ((dx + dw) < 0 || (dy + dh) < 0) {
          return;
        }
         if (
          !Number.isInteger(image.width) ||
          !Number.isInteger(image.height) ||
          image.width <= 0 ||
          image.height <= 0 ||
          image.width > privates.maxTextureSize ||
          image.height > privates.maxTextureSize
        ) {
          console.error(image, privates, this);
          throw new Error("Sprite.Webgl.drawImage invalid image");
        }
        */

        this.drawImage9(image, sx, sy, sw, sh, dx, dy, dw, dh);
      }
    }, {
      key: "filter",

      /**
       * @param {string} name The name of filter you want get or set
       * @param {number} value Number or undefined, if undefined ,return current value
       */
      value: function filter(name, value) {
        var privates = internal(this);
        var gl = privates.gl;
        if (Number.isFinite(value)) {
          privates.filter.set(name, value);
          gl.uniform1f(privates.brightnessLoc, privates.filter.get("brightness"));
          gl.uniform1f(privates.contrastLoc, privates.filter.get("contrast"));
        } else {
          return privates.get(name);
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        var privates = internal(this);
        var gl = privates.gl;
        var color = privates.color;
        gl.clearColor(color[0], color[1], color[2], 1); // black
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    }, {
      key: "alpha",
      get: function get() {
        var privates = internal(this);
        return privates.alpha;
      },
      set: function set(value) {
        var privates = internal(this);
        var gl = privates.gl;
        if (Number.isFinite(value) && !isNaN(value) && value >= 0 && value <= 1) {
          if (value != privates.alpha) {
            privates.alpha = value;
            gl.uniform1f(privates.alphaLoc, privates.alpha);
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Webgl got invalid alpha number");
        }
      }

      /**
       * @return {string} The color, eg "#00ff00"
       */

    }, {
      key: "color",
      get: function get() {
        var privates = internal(this);
        var color = privates.color;
        var r = color[0].toString(16);
        var g = color[1].toString(16);
        var b = color[2].toString(16);
        if (r.length < 2) r = "0" + r;
        if (g.length < 2) g = "0" + g;
        if (b.length < 2) b = "0" + b;
        return "#" + r + g + b;
      }
      /**
       * @param {string} value The new color, eg "#00ff00"
       */
      ,
      set: function set(value) {
        var privates = internal(this);
        var m = value.match(/^#([\da-fA-F][\da-fA-F])([\da-fA-F][\da-fA-F])([\da-fA-F][\da-fA-F])$/);
        if (m) {
          var r = m[1];
          var g = m[2];
          var b = m[3];
          privates.color[0] = parseInt(r, 16);
          privates.color[1] = parseInt(g, 16);
          privates.color[2] = parseInt(b, 16);
        } else {
          console.error(value, this);
          throw new Error("Sprite.Webgl.color invalid color format");
        }
      }
    }, {
      key: "width",
      get: function get() {
        var privates = internal(this);
        return privates.canvas.width;
      },
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value) && !isNaN(value) && value > 0 && value <= 4096) {
          if (value != privates.canvas.width) {
            privates.canvas.width = value;
            privates.gl.viewport(0, 0, privates.canvas.width, privates.canvas.height);
            privates.gl.uniform2f(privates.resolutionLoc, privates.canvas.width, privates.canvas.height);
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Webgl got invalid width number");
        }
      }
    }, {
      key: "height",
      get: function get() {
        var privates = internal(this);
        return privates.canvas.height;
      },
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value) && !isNaN(value) && value > 0 && value <= 4096) {
          if (value != privates.canvas.height) {
            privates.canvas.height = value;
            privates.gl.viewport(0, 0, privates.canvas.width, privates.canvas.height);
            privates.gl.uniform2f(resolutionLoc, privates.canvas.width, privates.canvas.height);
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Webgl got invalid height number");
        }
      }
    }, {
      key: "canvas",
      get: function get() {
        return internal(this).canvas;
      },
      set: function set(value) {
        console.error(value, this);
        throw new Error("Sprite.Webgl.canvas cannot write");
      }
    }]);

    return SpriteWebgl;
  })());
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

2D Game Sprite Library, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

/**
 * @fileoverview Class Sprite.Event
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Class Sprite.Event, hold all events emit, bubble
   * @class
   */
  Sprite.assign("Event", (function () {
    /**
     * construct Sprite.Event
     * @constructor
     */

    function SpriteEvent() {
      _classCallCheck(this, SpriteEvent);

      var privates = internal(this);
      /**
       * Contain all event and its' listeners
       @type {Object}
       @private
       */
      privates.listeners = new Map();
      /**
       * Contain an event is once or not
       * @type {Object}
       * @private
       */
      privates.once = new Map();
      /**
       * Parent of this object
       * @type {Object}
       */
      privates.parent = null;
    }
    /**
     * @return {Object} parent we hold, an object or null
     */

    _createClass(SpriteEvent, [{
      key: "on",

      /**
       * Register an event
       * @param {string} event The event type, eg. "click"
       * @param {function} listener The function when event fired
       */
      value: function on(event, listener) {
        var privates = internal(this);
        // If event is an once event, when some client register this event after event fired, we just return it
        if (privates.once.has(event)) {
          listener({
            type: event,
            target: this,
            data: privates.once.get(event)
          });
          return null;
        } else {
          if (privates.listeners.has(event) == false) {
            privates.listeners.set(event, new Map());
          }

          var id = Sprite.uuid();
          privates.listeners.get(event).set(id, listener);
          return id;
        }
      }
      /**
       * Remove an event Register
       * @param {string} event The event type you want to remove. eg. "click"
       * @param {string} id The id of event, the id is what returned by "on" function
       */

    }, {
      key: "off",
      value: function off(event, id) {
        var privates = internal(this);
        if (privates.listeners.has(event) && privates.listeners.get(event).has(id)) {
          privates.listeners.get(event).delete(id);
          if (privates.listeners.get(event).size <= 0) {
            privates.listeners.delete(event);
          }
          return true;
        }
        return false;
      }
      /**
       * Fire an event from children
       * @param {string} event Event type
       * @param {Object} target Event target
       * @param {Object} data Data
       */

    }, {
      key: "emitBubble",
      value: function emitBubble(event, target, data) {
        var privates = internal(this);
        var bubble = true;

        if (privates.listeners.has(event)) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = privates.listeners.get(event).values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var listener = _step.value;

              if (listener({ type: event, target: target, data: data }) === false) {
                // If client return just "false", stop propagation
                bubble = false;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }

        if (privates.parent && bubble == true) {
          privates.parent.emitBubble(event, target, data);
        }
      }
      /**
       * Fire an event
       * @param {string} event The event type you want to fire
       * @param {boolean} once Whether or not the event is once, if true, the event fire should only once, like "complete"
       * @param {Object} data The data to listener, undefined or null is OK
       */

    }, {
      key: "emit",
      value: function emit(event, once, data) {
        var privates = internal(this);
        if (once) {
          if (typeof data != "undefined") {
            privates.once.set(event, data);
          } else {
            privates.once.set(event, null);
          }
        }

        // wheter or not bubble the event, default true
        var bubble = true;

        if (privates.listeners.has(event)) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = privates.listeners.get(event).values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var listener = _step2.value;

              if (listener({ type: event, target: this, data: data }) === false) {
                // If client return just "false", stop propagation
                bubble = false;
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }

        if (privates.parent && bubble == true) {
          privates.parent.emitBubble(event, this, data);
        }
      }
    }, {
      key: "parent",
      get: function get() {
        var privates = internal(this);
        return privates.parent;
      }
      /**
       * Set parent of object
       * @param {Object} value New parent value, or null
       */
      ,
      set: function set(value) {
        var privates = internal(this);
        privates.parent = value;
      }
    }]);

    return SpriteEvent;
  })());
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

2D Game Sprite Library, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

/*

Sprite.Tween.get(Game.hero)
.promise(function () {
  return new Promise(function (resolve) {
    Game.hero.goto(Game.hero.x, Game.hero.y + 5,"walk").then(resolve);
  })
})
.wait(2000)
.promise(function () {
  return new Promise(function (resolve) {
    Game.hero.goto(Game.hero.x + 5, Game.hero.y, "walk").then(resolve);
  })
})
.to({alpha: 0}, 500)
.wait(500)
.to({alpha: 1}, 500)
.call(function () {
  Game.popup(Game.hero.sprite, "hello", 0, -50);
})
.wait(2000)
.call(function () {
  console.log("ok");
});


*/

/**
 * @fileoverview Sprite.Tween
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  Sprite.assign("Tween", (function (_Sprite$Event) {
    _inherits(SpriteTween, _Sprite$Event);

    _createClass(SpriteTween, null, [{
      key: "get",
      value: function get(object) {
        return new Sprite.Tween(object);
      }
    }]);

    function SpriteTween(object) {
      _classCallCheck(this, SpriteTween);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpriteTween).call(this));

      var privates = internal(_this);
      privates.object = object;
      privates.callback = null;
      privates.action = [];
      privates.doing = false;
      return _this;
    }

    _createClass(SpriteTween, [{
      key: "nextAction",
      value: function nextAction() {
        var privates = internal(this);
        if (privates.doing == false && privates.action.length > 0) {
          var action = privates.action[0];
          privates.action.splice(0, 1);
          switch (action.type) {
            case "to":
              this.toAction(action.attributes, action.time);
              break;
            case "wait":
              this.waitAction(action.time);
              break;
            case "call":
              this.callAction(action.callback);
              break;
            case "promise":
              this.promiseAction(action.callback);
              break;
            default:
              console.error(action);
              throw new Error("Sprite.Tween got invalid action");
          }
        }
      }
    }, {
      key: "toAction",
      value: function toAction(attributes, time) {
        var _this2 = this;

        var privates = internal(this);
        privates.doing = true;

        var splice = Math.min(100, time);
        var t = time / splice;
        var step = {};

        for (var key in attributes) {
          if (Number.isFinite(attributes[key])) {
            step[key] = attributes[key] - privates.object[key];
            step[key] /= splice;
          }
        }

        var count = 0;
        var inter = setInterval(function () {
          count++;
          if (count >= splice) {
            for (var key in attributes) {
              privates.object[key] = attributes[key];
            }
            clearInterval(inter);
            privates.doing = false;
            _this2.nextAction();
          } else {
            for (var key in step) {
              privates.object[key] += step[key];
            }
          }
        }, t);
      }
    }, {
      key: "to",
      value: function to(attributes, time) {
        internal(this).action.push({
          type: "to",
          attributes: attributes,
          time: time
        });
        this.nextAction();
        return this;
      }
    }, {
      key: "promiseAction",
      value: function promiseAction(callback) {
        var _this3 = this;

        this.doing = true;
        callback().then(function () {
          _this3.doing = false;
          _this3.nextAction();
        });
      }
    }, {
      key: "promise",
      value: function promise(callback) {
        internal(this).action.push({
          type: "promise",
          callback: callback
        });
        this.nextAction();
        return this;
      }
    }, {
      key: "callAction",
      value: function callAction(callback) {
        this.doing = true;
        callback();
        this.doing = false;
        this.nextAction();
      }
    }, {
      key: "call",
      value: function call(callback) {
        internal(this).action.push({
          type: "call",
          callback: callback
        });
        this.nextAction();
        return this;
      }
    }, {
      key: "waitAction",
      value: function waitAction(time) {
        var _this4 = this;

        var privates = internal(this);
        privates.doing = true;
        setTimeout(function () {
          privates.doing = false;
          _this4.nextAction();
        }, time);
      }
    }, {
      key: "wait",
      value: function wait(time) {
        internal(this).action.push({
          type: "wait",
          time: time
        });
        this.nextAction();
        return this;
      }
    }]);

    return SpriteTween;
  })(Sprite.Event));
})();

"use strict";

/*

2D Game Sprite Library, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

/**
 * @fileoverview Sprite.Loader, fetch resource
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Cache all url and element
   */
  var Cache = new Map();
  /**
   * When some url in Downloading, the url is downloading,
   * and other thread want it have to wait
   */
  var Downloading = new Map();

  function Fetch(url, callback) {
    var timeout = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

    var type = null;
    if (url.match(/js$/)) {
      type = "js";
    } else if (url.match(/jpg$|jpeg$|png$|bmp$|gif$/i)) {
      type = "image";
    } else if (url.match(/wav$|mp3$|ogg$/i)) {
      type = "audio";
    } else if (url.match(/json$/i)) {
      type = "json";
    } else {
      console.error(url);
      throw new Error("Fetch got an invalid url");
    }

    // finished
    var Finish = function Finish(obj) {
      Cache.set(url, obj);

      if (type == "json") {
        obj = Sprite.copy(obj);
      }

      if (callback) {
        callback(obj);
      }
      if (Downloading.has(url)) {
        var callbacks = Downloading.get(url);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = callbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _callback = _step.value;

            if (_callback) {
              _callback(obj);
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        Downloading.delete(url);
      }
    };

    if (Cache.has(url)) {
      Finish(Cache.get(url));
      return;
    }

    if (!timeout) {
      if (Downloading.has(url)) {
        Downloading.get(url).push(callback);
        return;
      }

      Downloading.set(url, []);
    }

    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.timeout = 10000; // 10 seconds

    // looks like req.responseType=blob has some async problem, so I use arraybuffer
    switch (type) {
      case "js":
        req.responseType = "text";
        break;
      case "image":
        req.responseType = "arraybuffer";
        break;
      case "audio":
        req.responseType = "arraybuffer";
        break;
      case "json":
        req.responseType = "json";
        break;
      default:
        console.error(type, url);
        throw new Error("Fetch something wrong");
    }

    if (typeof callback != "function") callback = function () {};

    req.ontimeout = function () {
      if (timeout >= 2) {
        console.error(url);
        alert("资源" + url + "超时没有加载成功！");
        throw new Error("Sprite.Loader.Fetch timeout 3 times");
      } else {
        console.error("Sprite.Loader.Fetch timeout try again, ", timeout + 1, " ", url);
        setTimeout(function () {
          Fetch(url, callback, timeout + 1);
        }, 50);
      }
    };

    var done = false;
    req.onreadystatechange = function () {
      if (req.readyState == 4 && !done) {
        done = true;
        if (req.response) {
          if (type == "js") {
            var fun = null;
            try {
              fun = new Function(req.response);
            } catch (e) {
              console.error(req.response, url);
              throw e;
            }
            Finish(fun);
          } else if (type == "image") {
            (function () {
              var arraybuffer = req.response;
              var image = new Image();
              image.onload = function () {
                // window.URL.revokeObjectURL(image.src);
                image.onload = null;
                Finish(image);
              };
              image.src = window.URL.createObjectURL(new window.Blob([arraybuffer]));
            })();
          } else if (type == "audio") {
            (function () {
              var arraybuffer = req.response;
              var audio = new Audio();
              audio.oncanplay = function () {
                // 如果reoke掉audio，那么audio.load()方法则不能用了
                // window.URL.revokeObjectURL(audio.src);
                audio.oncanplay = null;
                Finish(audio);
              };
              audio.src = window.URL.createObjectURL(new window.Blob([arraybuffer]));
            })();
          } else if (type == "json") {
            var json = req.response;
            if (!json) {
              console.error(url);
              throw new Error("Sprite.Loader invalid json");
            }
            Finish(json);
          }
        } else {
          console.error("url: ", url);
          console.error("response: ", req.response, " readyState: ", req.readyState, " status: ", req.status, " statusText: ", req.statusText);
          if (timeout >= 2) {
            console.error(url);
            alert("资源" + url + "错误没有加载成功！");
            throw new Error("Sprite.Loader.Fetch error 3 times");
          } else {
            console.error("Sprite.Loader.Fetch error try again, ", timeout + 1, " ", url);
            setTimeout(function () {
              Fetch(url, callback, timeout + 1);
            }, 50);
          }
        }
      }
    };
    req.send();
  }

  Sprite.assign("load", function () {
    var args = Array.prototype.slice.call(arguments);
    return new Promise(function (resolve, reject) {
      var urls = [];

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = args[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var element = _step2.value;

          if (typeof element == "string") {
            urls.push(element);
          } else if (element instanceof Array) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = element[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var url = _step3.value;

                urls.push(url);
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          } else {
            console.error(element, args);
            throw new Error("Sprite.load got invalid argument");
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var done = 0;
      var ret = [];
      ret.length = urls.length;

      var Done = function Done() {
        done++;

        if (done >= ret.length) {
          resolve(ret);
        }
      };

      urls.forEach(function (element, index) {
        Fetch(element, function (result) {
          ret[index] = result;
          Done();
        });
      });
    });
  });
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

2D Game Sprite Library, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

/**
 * @fileoverview Sprite.Ticker
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var tickerCount = 0;

  var SpriteTicker = (function (_Sprite$Event) {
    _inherits(SpriteTicker, _Sprite$Event);

    function SpriteTicker() {
      _classCallCheck(this, SpriteTicker);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpriteTicker).call(this));

      _this.tick();
      return _this;
    }

    _createClass(SpriteTicker, [{
      key: "tick",
      value: function tick() {
        var _this2 = this;

        tickerCount++;
        this.emit("tick", false, tickerCount);
        window.requestAnimationFrame(function () {
          _this2.tick();
        });
      }
    }, {
      key: "after",
      value: function after(times, callback) {
        var _this3 = this;

        var count = 0;
        var id = this.on("tick", function () {
          count++;
          if (count >= times) {
            _this3.off("tick", id);
            if (callback) {
              callback();
            }
          }
        });
        return id;
      }
    }, {
      key: "clearAfter",
      value: function clearAfter(id) {
        this.off("tick", id);
      }
    }, {
      key: "whiles",
      value: function whiles(times, callback) {
        var _this4 = this;

        var count = 0;
        var id = this.on("tick", function () {
          count++;
          if (count >= times) {
            if (callback) {
              callback(true);
            }
            _this4.off("tick", id);
          } else {
            if (callback) {
              callback(false);
            }
          }
        });
        return id;
      }
    }, {
      key: "clearWhiles",
      value: function clearWhiles(id) {
        this.off("tick", id);
      }
    }]);

    return SpriteTicker;
  })(Sprite.Event);

  ;

  Sprite.assign("Ticker", new SpriteTicker());
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
2D Game Sprite Library, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * @fileoverview Class Sprite.Display
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  var hitCanvas = document.createElement("canvas");
  hitCanvas.width = 1;
  hitCanvas.height = 1;
  var hitContext = hitCanvas.getContext("2d");
  hitContext.clearRect(0, 0, 1, 1);
  var hitData = hitContext.getImageData(0, 0, 1, 1).data;

  /**
   * Class Sprite.Display, base class for all other classes
   * @class
   * @extends Sprite.Event
   */
  Sprite.assign("Display", (function (_Sprite$Event) {
    _inherits(SpriteDisplay, _Sprite$Event);

    /**
     * construct Sprite.Display
     * @constructor
     */

    function SpriteDisplay() {
      _classCallCheck(this, SpriteDisplay);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpriteDisplay).call(this));

      var privates = internal(_this);
      /**
       * x position of object
       @type {number}
       */
      privates.x = 0;
      /**
       * y position of object
       @type {number}
       */
      privates.y = 0;
      /**
       * object's center x
       @type {number}
       */
      privates.centerX = 0;
      /**
       * object's center y
       @type {number}
       */
      privates.centerY = 0;
      /**
       * object's alpha, from 0 to 1, when alpha is 0, object is invisible
       @type {number}
       */
      privates.alpha = 1;
      /**
       * object's visibility
       @type {boolean}
       */
      privates.visible = true;

      privates.width = 0;
      privates.height = 0;
      return _this;
    }

    _createClass(SpriteDisplay, [{
      key: "draw",

      /**
       * Interface, sub-class should overload this method
       * @param {Object} renderer
       */
      value: function draw(renderer) {
        console.error("sub-class should override this function");
        throw new Error("Invalid call Sprite.Display.draw");
      }
      /**
       * Check if the x,y hit this object or not
       * @param {number} x the x position of screen (may 0 to 640) for test
       * @param {number} y the y position of screen (may 0 to 480) for test
       */

    }, {
      key: "hitTest",
      value: function hitTest(x, y) {
        hitContext.clearRect(0, 0, 1, 1);
        hitContext.save();
        hitContext.translate(-x, -y);
        this.draw(hitContext);
        hitContext.restore();
        var newData = hitContext.getImageData(0, 0, 1, 1).data;

        if (hitData[0] != newData[0] || hitData[1] != newData[1] || hitData[2] != newData[2]) {
          return true;
        }
        return false;
      }
    }, {
      key: "drawPosition",
      value: function drawPosition() {

        var centerX = this.centerX;
        var centerY = this.centerY;
        var x = this.x;
        var y = this.y;
        var alpha = this.alpha;

        var parent = this.parent;
        while (parent) {
          centerX += parent.centerX;
          centerY += parent.centerY;
          x += parent.x;
          y += parent.y;
          alpha *= parent.alpha;
          if (alpha <= 0.001) {
            return null;
          }
          if (parent.visible == false) {
            return null;
          }
          parent = parent.parent;
        }

        return {
          x: x - centerX,
          y: y - centerY,
          alpha: alpha
        };
      }
      /**
       * Draw an image to renderer
       * x, y-----------------------------------------
       * -                                           -
       * -    sx.sy------------                      -
       * -    -               -                      -
       * -    ---swidth,sheight                      -
       * -                                           -
       * ---------------------------------------------image.width, image.height
       * Crop image with sx, sy, swidth and sheight, draw it on renderer
       * x, y will be calculated by this.x, this.y, this.centerX, this.centerY and some parents' attributes
       * @param {Object} renderer A object who has drawImage method, eg. Sprite.Webgl
       * @param {Object} image
       * @param {number} sx
       * @param {number} sy
       * @param {number} swidth
       * @param {number} sheight
       */

    }, {
      key: "drawImage",
      value: function drawImage(renderer, image, sx, sy, swidth, sheight) {
        if (this.visible != true || this.alpha < 0.01) {
          return;
        }

        var d = this.drawPosition();
        if (!d) {
          return;
        }
        renderer.alpha = d.alpha;

        try {
          renderer.drawImage(image, sx, sy, swidth, sheight, d.x, d.y, swidth, sheight);
        } catch (e) {
          console.error(image, sx, sy, swidth, sheight, d.x, d.y, swidth, sheight);
          throw e;
        }
      }
    }, {
      key: "width",
      get: function get() {
        return internal(this).width;
      },
      set: function set(value) {
        internal(this).width = value;
      }
    }, {
      key: "height",
      get: function get() {
        return internal(this).height;
      },
      set: function set(value) {
        internal(this).height = value;
      }

      /**
       * @return {number} return x position
       */

    }, {
      key: "x",
      get: function get() {
        return internal(this).x;
      }
      /**
       * @param {number} value new x position
       */
      ,
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value)) {
          if (value != privates.x) {
            privates.x = Math.floor(value);
            this.emit("change");
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Display.set x : invalid argument");
        }
      }
      /**
       * @return {number} return y position
       */

    }, {
      key: "y",
      get: function get() {
        return internal(this).y;
      }
      /**
       * @param {number} value new y position
       */
      ,
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value)) {
          if (value != privates.y) {
            privates.y = Math.floor(value);
            this.emit("change");
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Display.set y : invalid argument");
        }
      }
      /**
       * @return {number} return center x
       */

    }, {
      key: "centerX",
      get: function get() {
        return internal(this).centerX;
      }
      /**
       * @param {number} value new center x
       */
      ,
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value)) {
          if (value != privates.centerX) {
            privates.centerX = Math.floor(value);
            this.emit("change");
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Display.set centerX : invalid argument");
        }
      }
      /**
       * @return {number} return center y
       */

    }, {
      key: "centerY",
      get: function get() {
        return internal(this).centerY;
      }
      /**
       * @param {number} value new center y
       */
      ,
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value)) {
          if (value != privates.centerY) {
            privates.centerY = Math.floor(value);
            this.emit("change");
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Display.set centerY : invalid argument");
        }
      }
      /**
       * @return {number} return alpha
       */

    }, {
      key: "alpha",
      get: function get() {
        var privates = internal(this);
        return privates.alpha;
      }
      /**
       * @param {number} value new alpha
       */
      ,
      set: function set(value) {
        var privates = internal(this);
        if (Number.isFinite(value) && (value >= 0 || value <= 1)) {
          if (value != privates.alpha) {
            privates.alpha = value;
            this.emit("change");
          }
        } else {
          console.error(value, this);
          throw new Error("Sprite.Display.set alpha : invalid argument");
        }
      }
      /**
       * @return {boolean} return alpha
       */

    }, {
      key: "visible",
      get: function get() {
        var privates = internal(this);
        return privates.visible;
      }
      /**
       * @param {boolean} value new visible
       */
      ,
      set: function set(value) {
        var privates = internal(this);
        if (value != privates.visible) {
          privates.visible = value;
          this.emit("change");
        }
      }
    }]);

    return SpriteDisplay;
  })(Sprite.Event));
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

2D Game Sprite Library, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

/**
 * @fileoverview Class Sprite.Container, it's a general container
 * Contain Sprite.Sheet, Sprite.Bitmap, Sprite.Shape, Sprite.Text, Sprite.Frame or Sprite.Container
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Contain everything which inherit from Sprite.Display
   * @class
   */
  Sprite.assign("Container", (function (_Sprite$Display) {
    _inherits(SpriteContainer, _Sprite$Display);

    /**
     * Construct Sprite.Container
     * @constructor
     */

    function SpriteContainer() {
      _classCallCheck(this, SpriteContainer);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpriteContainer).call(this));

      var privates = internal(_this);
      /**
       * Contain all children element
       * @private
       */
      privates.children = [];
      /**
       * Cached canvas
       */
      privates.cacheCanvas = null;
      return _this;
    }

    /**
     * @return {Array} Children array
     */

    _createClass(SpriteContainer, [{
      key: "clearCache",

      /**
       * Remove canvas cache
       */
      value: function clearCache() {
        internal(this).cacheCanvas = null;
      }

      /**
       * Prerender all children as cache
       * generate a just size cache
       */

    }, {
      key: "cache",
      value: function cache(width, height) {
        var privates = internal(this);
        if (privates.cacheCanvas) {
          this.clearCache();
        }
        var p = this.parent;
        this.parent = null;

        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext("2d");
        this.draw(context);
        privates.cacheCanvas = canvas;

        this.parent = p;
      }
    }, {
      key: "hitTest",

      /**
       * Hit test
       */
      value: function hitTest(x, y) {
        var privates = internal(this);
        if (this.cacheCanvas) {
          return _get(Object.getPrototypeOf(SpriteContainer.prototype), "hitTest", this).call(this, x, y);
        } else {
          var hitted = [];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var child = _step.value;

              var ret = child.hitTest(x, y);
              if (ret instanceof Array) {
                hitted = hitted.concat(ret);
              } else if (ret === true) {
                hitted.push(child);
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return hitted;
        }
      }

      /**
       * Draw all children in this container on context
       * @param {Object} renderer Sprite.Webgl/Sprite.Canvas/Context
       */

    }, {
      key: "draw",
      value: function draw(renderer) {
        var privates = internal(this);
        if (this.alpha < 0.01 || this.visible != true) {
          return;
        }

        if (this.cacheCanvas) {
          var x = this.x;
          var y = this.y;
          this.x += privates.cacheX;
          this.y += privates.cacheY;
          this.drawImage(renderer, this.cacheCanvas, 0, 0, this.cacheCanvas.width, this.cacheCanvas.height);
          this.x = x;
          this.y = y;
        } else {
          if (this.children.length > 0) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = this.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var child = _step2.value;

                if (child.visible == true && child.alpha >= 0.01) {
                  child.draw(renderer);
                }
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
          }
        }
      }

      /**
      */

    }, {
      key: "hasChild",
      value: function hasChild(element) {
        if (this.children.indexOf(element) != -1) {
          return true;
        }
        return false;
      }

      /**
       * Append one or more children into container
       * eg. c.appendChild(childA) c.appendChild(childA, childB)
       * @param one or more children
       */

    }, {
      key: "appendChild",
      value: function appendChild() {
        var args = Array.prototype.slice.call(arguments);

        if (args.length <= 0) {
          throw new Error("Sprite.Container.appendChild got an invalid arguments");
        }

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = args[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var element = _step3.value;

            if (element instanceof Sprite.Display == false) {
              console.error(element);
              throw new Error("Sprite.Container.appendChild only accept Sprite.Display or it's sub-class");
            }
            element.parent = this;
            this.children.push(element);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        this.emit("addedChildren");
      }

      /**
       * Append one or more children into container at certain position
       * eg. c.appendChildAt(0, childA) c.appendChildAt(0, childA, childB)
       * @param one or more children
       */

    }, {
      key: "appendChildAt",
      value: function appendChildAt() {
        var args = Array.prototype.slice.call(arguments);

        if (args.length <= 1) {
          console.log(arguments, this);
          throw new TypeError("Sprite.Container.appendChildAt has an invalid arguments");
        }

        var index = args[0];
        for (var i = 1, len = args.length; i < len; i++) {
          if (args[i] instanceof Sprite.Display == false) {
            console.error(args[i]);
            throw new Error("Sprite.Container.appendChildAt only can accept Sprite.Display or it's sub-class");
          }
          args[i].parent = this;
          this.children.splice(index, 0, args[i]);
        }

        this.emit("addedChildren");
      }

      /**
       * Remove one child from a container
       * eg. c.removeChild(childA)
       * @param {Object} element The child you want to remove
       * @return {boolean} If found and removed element, return true, otherwise, false
       */

    }, {
      key: "removeChild",
      value: function removeChild(element) {
        var index = this.children.indexOf(element);
        if (index != -1) {
          // found it
          this.children[index].parent = null;
          this.children.splice(index, 1);
          this.emit("removedChildren");
          return true;
        } else {
          // not found, element not a child
          return false;
        }
      }

      /**
       * remove all children of container
       */

    }, {
      key: "clear",
      value: function clear() {
        var privates = internal(this);
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = privates.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var child = _step4.value;

            child.parent = null;
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        privates.children = [];
        this.clearCache();
        this.emit("removedChildren");
      }
    }, {
      key: "children",
      get: function get() {
        return internal(this).children;
      },
      set: function set(value) {
        throw new Error("Sprite.Container.children readonly");
      }

      /**
       * @return {Object} Cached canvas
       */

    }, {
      key: "cacheCanvas",
      get: function get() {
        return internal(this).cacheCanvas;
      },
      set: function set(value) {
        throw new Error("Sprite.Container.cacheCanvas readonly");
      }
    }, {
      key: "cacheX",
      get: function get() {
        return internal(this).cacheX;
      },
      set: function set(value) {
        throw new Error("Sprite.Container.cacheX readonly");
      }
    }, {
      key: "cacheY",
      get: function get() {
        return internal(this).cacheY;
      },
      set: function set(value) {
        throw new Error("Sprite.Container.cacheY readonly");
      }
    }]);

    return SpriteContainer;
  })(Sprite.Display));
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

2D Game Sprite Library, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

/**
 * @fileoverview Class Sprite.Stage
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Main Stage, display object
   * @class
   * @extends Sprite.Container
   */
  Sprite.assign("Stage", (function (_Sprite$Container) {
    _inherits(SpriteStage, _Sprite$Container);

    /** @function Sprite.Stage.constructor
     * consturct a Sprite.Stage with width and height
     * @constructor
     * @param width, the width of stage you need
     * @param height, the height of stage you need
     */

    function SpriteStage(width, height) {
      _classCallCheck(this, SpriteStage);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpriteStage).call(this));

      var privates = internal(_this);

      if (!privates.renderer && Sprite.Webgl.support()) {
        privates.renderer = new Sprite.Webgl(width, height);
        privates.rendererType = "webgl";
      }

      // canvas 2d first
      if (!privates.renderer && Sprite.Canvas.support()) {
        privates.renderer = new Sprite.Canvas(width, height);
        privates.rendererType = "canvas";
      }

      if (!privates.renderer) {
        throw new Error("Sprite.Stage all renderer not support");
      }

      /**
      * color when stage is empty
      */
      privates.color = "#000000";
      return _this;
    }

    _createClass(SpriteStage, [{
      key: "releaseRenderer",
      value: function releaseRenderer() {
        internal(this).renderer.release();
      }
    }, {
      key: "filter",
      value: function filter(name, value) {
        return internal(this).renderer.filter(name, value);
      }
    }, {
      key: "findHit",
      value: function findHit(event) {
        var hitted = this.hitTest(this.mouseX, this.mouseY);
        hitted.reverse();
        if (hitted.length) return hitted;
        return null;
      }
    }, {
      key: "clear",

      /// @function Sprite.Stage.clear
      /// clear the stage
      value: function clear() {
        internal(this).renderer.clear();
      }
    }, {
      key: "update",
      value: function update() {
        this.emit("beforeDraw");
        this.draw(this.renderer);
        this.emit("afterDraw");
      }
    }, {
      key: "draw",
      value: function draw(renderer) {
        /** this.children, never privates.children, because children are super's */
        if (this.children.length <= 0) {
          return false;
        }

        this.clear();

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var child = _step.value;

            child.draw(renderer);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }, {
      key: "renderer",
      get: function get() {
        return internal(this).renderer;
      },
      set: function set(value) {
        throw new Error("Sprite.Stage renderer readonly");
      }
    }, {
      key: "rendererType",
      get: function get() {
        return internal(this).rendererType;
      },
      set: function set(value) {
        throw new Error("Sprite.Stage.rendererType readonly");
      }
    }, {
      key: "width",
      get: function get() {
        return internal(this).renderer.width;
      },
      set: function set(value) {
        internal(this).renderer.width = value;
      }
    }, {
      key: "height",
      get: function get() {
        return internal(this).renderer.height;
      },
      set: function set(value) {
        internal(this).renderer.height = value;
      }
    }, {
      key: "color",
      get: function get() {
        return internal(this).renderer.color;
      },
      set: function set(value) {
        internal(this).renderer.color = value;
      }
    }, {
      key: "canvas",
      get: function get() {
        return this.renderer.canvas;
      },
      set: function set(value) {
        throw new Error("Sprite.Stage.canvas readonly");
      }
    }]);

    return SpriteStage;
  })(Sprite.Container));
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

2D Game Sprite Library, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

/**
 * @fileoverview Define the Sprite.Text to show text in game
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  var textCanvas = document.createElement("canvas");
  textCanvas.width = 1;
  textCanvas.height = 1;
  var textContext = textCanvas.getContext("2d");

  /**
   * Class Sprite.Text, contain text
   * @class
   * @extends Sprite.Display
   */
  Sprite.assign("Text", (function (_Sprite$Display) {
    _inherits(SpriteText, _Sprite$Display);

    /**
     * construct Sprite.Text
     * @constructor
     */

    function SpriteText(config) {
      _classCallCheck(this, SpriteText);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpriteText).call(this));

      var privates = internal(_this);
      privates.text = config.text || "Invalid Text";
      privates.maxWidth = config.maxWidth || 1000;
      privates.color = config.color || "black";
      privates.fontSize = config.fontSize || 14;
      privates.fontFamily = config.fontFamily || "Ariel";
      privates.image = null;
      _this.generate();
      return _this;
    }

    _createClass(SpriteText, [{
      key: "clone",
      value: function clone() {
        var privates = internal(this);
        var text = new Text({
          text: privates.text,
          maxWidth: privates.maxWidth,
          color: privates.color,
          fontSize: privates.fontSize,
          fontFamily: privates.fontFamily
        });
        text.x = this.x;
        text.y = this.y;
        text.centerX = this.centerX;
        text.centerY = this.centerY;
        text.alpha = this.alpha;
        text.visible = this.visible;
        return text;
      }
    }, {
      key: "generate",
      value: function generate() {
        var privates = internal(this);
        textContext.font = this.fontSize + "px " + privates.fontFamily;
        // "龍" is the max-width & max-height Chinese word I think
        var lineHeight = Math.ceil(textContext.measureText("龍").width * 1.2);
        this.width = 0;

        // find the real-maximum-width of multiline text, base user's maxWidth
        var lines = [];
        var lineText = "";
        for (var i = 0, len = this.text.length; i < len; i++) {
          if (textContext.measureText(lineText + this.text[i]).width > this.maxWidth) {
            lines.push(lineText);
            lineText = this.text[i];
          } else {
            lineText += this.text[i];
          }
          if (textContext.measureText(lineText).width > this.width) this.width = Math.ceil(textContext.measureText(lineText).width);
        }

        if (lineText.length) {
          lines.push(lineText);
        }

        this.height = lines.length * lineHeight;

        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        var context = canvas.getContext("2d");
        context.font = this.fontSize + "px " + this.fontFamily;
        context.fillStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "top";
        // draw each line
        lines.forEach(function (element, index) {
          context.fillText(element, canvas.width / 2, index * lineHeight);
        });

        privates.image = null;
        privates.image = canvas;
      }
    }, {
      key: "draw",
      value: function draw(context) {
        var privates = internal(this);
        var image = privates.image;
        if (image && image.width > 0 && image.height > 0) {
          this.drawImage(context, image, 0, 0, image.width, image.height);
        }
      }
    }, {
      key: "text",
      get: function get() {
        var privates = internal(this);
        return privates.text;
      },
      set: function set(value) {
        var privates = internal(this);
        if (value != this.text) {
          privates.text = value;
          this.generate();
        }
      }
    }, {
      key: "color",
      get: function get() {
        var privates = internal(this);
        return privates.color;
      },
      set: function set(value) {
        var privates = internal(this);
        if (value != this.color) {
          privates.color = value;
          this.generate();
        }
      }
    }, {
      key: "fontSize",
      get: function get() {
        var privates = internal(this);
        return privates.fontSize;
      },
      set: function set(value) {
        var privates = internal(this);
        if (value != this.fontSize) {
          privates.fontSize = value;
          this.generate();
        }
      }
    }, {
      key: "fontFamily",
      get: function get() {
        return internal(this).fontFamily;
      },
      set: function set(value) {
        var privates = internal(this);
        if (value != privates.fontFamily) {
          privates.fontFamily = value;
          this.generate();
        }
      }
    }]);

    return SpriteText;
  })(Sprite.Display));
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

2D Game Sprite Library, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

/**
 * @fileoverview Class Sprite.Frame
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Class Sprite.Frame, a frame of Sprite.Sheet
   * @class
   */
  Sprite.assign("Frame", (function (_Sprite$Display) {
    _inherits(SpriteFrame, _Sprite$Display);

    function SpriteFrame(image, sx, sy, width, height) {
      _classCallCheck(this, SpriteFrame);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpriteFrame).call(this));

      var privates = internal(_this);
      privates.image = image;
      privates.sx = sx;
      privates.sy = sy;
      _this.width = width;
      _this.height = height;
      return _this;
    }
    /**
     * @return {Image} Return the image this Sprite.Frame hold
     */

    _createClass(SpriteFrame, [{
      key: "print",
      value: function print() {
        console.log(internal(this));
      }

      /**
       * @return {Object} Clone this Sprite.Frame
       */

    }, {
      key: "clone",
      value: function clone() {
        var frame = new Sprite.Frame(this.image, this.sx, this.sy, this.width, this.height);
        frame.x = this.x;
        frame.y = this.y;
        frame.parent = this.parent;
        return frame;
      }

      /**
       * @param {Object} renderer
       */

    }, {
      key: "draw",
      value: function draw(renderer) {
        this.drawImage(renderer, this.image, this.sx, this.sy, this.width, this.height);
      }
    }, {
      key: "image",
      get: function get() {
        var privates = internal(this);
        return privates.image;
      },
      set: function set(value) {
        throw new Error("Sprite.Frame.image readonly");
      }

      /**
       * @return {number} Return sx
       */

    }, {
      key: "sx",
      get: function get() {
        var privates = internal(this);
        return privates.sx;
      },
      set: function set(value) {
        throw new Error("Sprite.Frame.sx readonly");
      }

      /**
       * @return {number} Return sy
       */

    }, {
      key: "sy",
      get: function get() {
        var privates = internal(this);
        return privates.sy;
      },
      set: function set(value) {
        throw new Error("Sprite.Frame.sy readonly");
      }
    }]);

    return SpriteFrame;
  })(Sprite.Display));
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*import "js/Sprite/SpriteDisplay";

2D Game Sprite Library, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

/**
 * @fileoverview Class Sprite.Sheet, maybe the most importent class
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Class Sprite.Sheet, contain sprite's sheet and it's animation
   * @class
   * @extends Sprite.Display
   */
  Sprite.assign("Sheet", (function (_Sprite$Display) {
    _inherits(SpriteSheet, _Sprite$Display);

    /**
     * construct Sprite.Sheet
     * @param config
     * @constructor
     */

    function SpriteSheet(config) {
      _classCallCheck(this, SpriteSheet);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpriteSheet).call(this));

      var privates = internal(_this);

      if (!config.images || !config.images.length || !Number.isFinite(config.width) || config.width <= 0 || config.width > 4096 || !Number.isFinite(config.height) || config.height <= 0 || config.height > 4096) {
        console.error(config);
        throw new Error("Sprite.Sheet.constructor get invalid arguments");
      }

      /**
       * Contain one or more images
       @type {Array}
       @private
       */
      privates.images = config.images;
      /**
       * Width of each frame
       @type {number}
       @private
       */
      privates.tilewidth = config.width;
      _this.width = config.width;
      /**
       * Height of each frame
       @type {number}
       @private
       */
      privates.tileheight = config.height;
      _this.height = config.height;
      /**
       * Animations of this sprite sheet, eg. { "walkdown": [0, 2, "", 40], "walkup", [3, 5, "", 40] }
       @type {Object}
       @private
       */
      privates.animations = config.animations || {};
      /**
       * Current animation's name, eg. "walkdown", "attackright"
       @type {string}
       @private
       */
      privates.currentAnimation = null;
      /**
       * Current frame number, eg. 0, 1, 2, 3
       @type {number}
       @private
       */
      privates.currentFrame = 0;
      /**
       * If animationTimer is not null, it points an animation is running
       * it will be null or an handler from setInterval
       @type {Object}
       @private
       */
      privates.animationTimer = null;

      /**
       * The number of frames we have
       @type {number}
       @private
       */
      privates.frameCount = 0;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = privates.images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var image = _step.value;

          if (!(image instanceof Image) && !(image.getContext && image.getContext("2d"))) {
            console.error(image, privates, _this);
            throw new Error("Sprite.Sheet got invalid image, not Image or Canvas");
          }

          if (image.width <= 0 || !Number.isFinite(image.width) || image.height <= 0 || !Number.isFinite(image.height)) {
            console.error(image, privates, _this);
            throw new Error("Sprite.Sheet got invalid image, invalid width or height");
          }

          var col = Math.floor(image.width / privates.tilewidth);
          var row = Math.floor(image.height / privates.tileheight);
          privates.frameCount += col * row;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return _this;
    }
    /**
     * Clone Sprite.Sheet object itself
     * @return {Object} Return an copy of this
     */

    _createClass(SpriteSheet, [{
      key: "clone",
      value: function clone() {
        var privates = internal(this);
        var sheet = new Sprite.Sheet({
          images: privates.images,
          width: privates.tilewidth,
          height: privates.tileheight,
          animations: privates.animations
        });
        sheet.x = this.x;
        sheet.y = this.y;
        sheet.centerX = this.centerX;
        sheet.centerY = this.centerY;
        sheet.play(this.currentFrame);
        sheet.alpha = this.alpha;
        sheet.visible = this.visible;
        return sheet;
      }
      /**
       * @return {boolean} Return false if an animation is running
       */

    }, {
      key: "play",

      /**
       * Play a frame or an animation
       * @param {Object} choice frame number of animation name, eg. 0 for frame or "walkdown" for animation
       */
      value: function play(choice) {
        var _this2 = this;

        var privates = internal(this);
        if (privates.animationTimer) {
          clearInterval(privates.animationTimer);
          privates.animationTimer = null;
        }

        if (Number.isInteger(choice)) {
          // Argument points a frame
          privates.currentFrame = choice;
          this.emit("change");
        } else if (typeof choice == "string") {
          var _ret = (function () {
            // Argument points an animation name
            var animation = privates.animations[choice];

            if (!animation) {
              // if animation is not exist
              console.error(animation, privates.animations, choice);
              throw new Error("Sprite.Sheet.play invalid animation");
            }

            // if animation is single frame number
            if (Number.isFinite(animation)) {
              privates.currentAnimation = choice;
              return {
                v: _this2.play(animation)
              };
            }

            // start frame number
            var begin = null;
            // finish frame number
            var end = null;
            // what action after animation finished
            var next = null;
            // the space between each frame, ms
            var time = null;

            if (animation instanceof Array) {
              // if animation format is like [begin, end, next, time]
              begin = animation[0];
              end = animation[1];
              next = animation[2];
              time = animation[3];
            } else if (animation.frames && animation.frames instanceof Array) {
              // if animation format is like { frames: [begin, end], next: "next", speed: "time" }
              begin = animation.frames[0];
              end = animation.frames[animation.frames.length - 1];
              next = animation.next;
              time = animation.speed;
            }

            if ( // Data ensure
            !Number.isFinite(begin) || begin < 0 || begin >= privates.frameCount || !Number.isFinite(end) || end < 0 || end >= privates.frameCount || !Number.isFinite(time) || time <= 0) {
              console.error(begin, end, time, _this2);
              throw new Error("Sprite.Sheet.play Invalid animation data");
            }

            // Play first frame in animation
            privates.currentAnimation = choice;
            privates.currentFrame = begin;
            _this2.emit("change");

            // Play other frame in animation
            privates.animationTimer = setInterval(function () {
              privates.currentFrame++;

              if (privates.currentFrame > end) {
                clearInterval(privates.animationTimer);
                privates.animationTimer = null;

                if (next && next.length && privates.animations[next]) {
                  _this2.play(next);
                } else {
                  privates.currentFrame--;
                }
                _this2.emit("animationend");
              }

              _this2.emit("change");
            }, time);
          })();

          if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
        } else {
          console.error(choice, internal(this).animations, this);
          throw new Error("Sprite.Sheet.play has an invalid argument");
        }
      }

      /**
       * Get a certain frame
       * @param {number} index The index of frame
       * @return {Object} An Sprite.Frame object
       */

    }, {
      key: "getFrame",
      value: function getFrame(index) {
        var privates = internal(this);
        if (!Number.isInteger(index)) {
          index = privates.currentFrame;
        }

        if (index < 0 || index >= privates.frameCount) {
          console.error(index, privates, this);
          throw new Error("Sprite.Sheet.getFrame index out of range");
        }

        var frame = null;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = privates.images[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var image = _step2.value;

            var col = Math.floor(image.width / privates.tilewidth);
            var row = Math.floor(image.height / privates.tileheight);
            if (index < col * row) {
              // which row
              var j = Math.floor(index / col);
              // which column
              var i = index - col * j;
              frame = new Sprite.Frame(image, i * privates.tilewidth, // x
              j * privates.tileheight, // y
              privates.tilewidth, privates.tileheight);
              frame.parent = this;
              break;
            }
            index -= col * row;
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        if (!frame) {
          console.error(index, privates, this);
          throw new Error("Sprite.Sheet.getFrame unknown error");
        }

        return frame;
      }

      /**
       * Draw this sheet on certain renderer
       * @param {Object} renderer A renderer engine, eg. Sprite.Webgl
       */

    }, {
      key: "draw",
      value: function draw(renderer) {
        if (this.visible == false || this.alpha <= 0.01) {
          return;
        }

        var privates = internal(this);
        var frame = this.getFrame(this.currentFrame);

        if (!frame || !frame.image) {
          console.error(frame, this.currentFrame, this);
          throw new Error("Sprite.Sheet.draw invalid frame");
        }

        frame.draw(renderer);
      }
    }, {
      key: "paused",
      get: function get() {
        var privates = internal(this);
        if (privates.animationTimer) {
          return false;
        }
        return true;
      },
      set: function set(value) {
        throw new Error("Sprite.Sheet.paused readonly");
      }

      /**
       * @return {number} Return current frame number
       */

    }, {
      key: "currentFrame",
      get: function get() {
        var privates = internal(this);
        return privates.currentFrame;
      },
      set: function set(value) {
        throw new Error("Sprite.Sheet.currentFrame readonly");
      }

      /**
       * @return {string} Return
       */

    }, {
      key: "currentAnimation",
      get: function get() {
        var privates = internal(this);
        return privates.currentAnimation;
      },
      set: function set(value) {
        throw new Error("Sprite.Sheet.currentAnimation readonly");
      }
    }]);

    return SpriteSheet;
  })(Sprite.Display));
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

2D Game Sprite Library, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

/**
 * @fileoverview Class Sprite.Input
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var keyTable = {
    "tab": 9,
    "enter": 13,
    "shift": 16,
    "esc": 27,
    "space": 32,
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40,
    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57,
    "A": 65, // A
    "B": 66,
    "C": 67,
    "D": 68,
    "E": 69,
    "F": 70,
    "G": 71,
    "H": 72,
    "I": 73,
    "J": 74,
    "K": 75,
    "L": 76,
    "M": 77,
    "N": 78,
    "O": 79,
    "P": 80,
    "Q": 81,
    "R": 82,
    "S": 83,
    "T": 84,
    "U": 85,
    "V": 86,
    "W": 87,
    "X": 88,
    "Y": 89,
    "Z": 90, // Z
    "a": 97, // a
    "b": 98,
    "c": 99,
    "d": 100,
    "e": 101,
    "f": 102,
    "g": 103,
    "h": 104,
    "i": 105,
    "j": 106,
    "k": 107,
    "l": 108,
    "m": 109,
    "n": 110,
    "o": 111,
    "p": 112,
    "q": 113,
    "r": 114,
    "s": 115,
    "t": 116,
    "u": 117,
    "v": 118,
    "w": 119,
    "x": 120,
    "y": 121,
    "z": 122 // z
  };

  var pressed = new Map();

  window.addEventListener("keydown", function (event) {
    event = event || window.event;
    var keyCode = event.keyCode;
    pressed.set(keyCode, true);
  });

  window.addEventListener("keyup", function (event) {
    event = event || window.event;
    var keyCode = event.keyCode;
    if (pressed.has(keyCode)) {
      pressed.delete(keyCode);
    }
  });

  /**
   * Sprite.Input, only has static methods
   * @class
   */
  Sprite.assign("Input", (function () {
    function SpriteInput() {
      _classCallCheck(this, SpriteInput);
    }

    _createClass(SpriteInput, null, [{
      key: "isPressed",

      /**
       * @param {string} key Key-string ('A', 'a') or key-number (65, 97)
       * @return {boolean} If the key is pressing, return true, otherwise, false
       */
      value: function isPressed(key) {
        if (Number.isFinite(key)) {
          if (pressed.has(key)) {
            return true;
          }
          return false;
        } else if (typeof key == "string") {
          key = keyTable[key];
          if (pressed.has(key)) {
            return true;
          }
          return false;
        } else {
          console.error(key);
          throw new Error("Sprite.Input.isPressed got invalid argument");
        }
      }

      /**
       * @param {Array} keys Keys to monitor, eg. ["A", "B", "C", "a", "b", "c"]
       * @param {function} callback When key in keys is pressed, callback
       */

    }, {
      key: "whenPress",
      value: function whenPress(keys, callback) {
        if (callback) {
          window.addEventListener("keypress", function (event) {
            event = event || window.event;
            var keyCode = event.keyCode;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;

                var code = keyTable[key];
                if (code && code == keyCode) {
                  callback(key);
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          });
        } else {
          console.error(callback);
          throw new Error("Sprite.Input.whenPress got invalid arguments");
        }
      }

      /**
       * @param {Array} keys Keys to monitor, eg. ["A", "B", "C", "a", "b", "c"]
       * @param {function} callback When key in keys is pressed, callback
       */

    }, {
      key: "whenDown",
      value: function whenDown(keys, callback) {
        if (callback) {
          window.addEventListener("keydown", function (event) {
            event = event || window.event;
            var keyCode = event.keyCode;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var key = _step2.value;

                var code = keyTable[key];
                if (code && code == keyCode) {
                  callback(key);
                }
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
          });
        } else {
          console.error(callback);
          throw new Error("Sprite.Input.whenDown got invalid arguments");
        }
      }

      /**
       * @param {Array} keys Keys to monitor, eg. ["A", "B", "C", "a", "b", "c"]
       * @param {function} callback When key in keys is pressed, callback
       */

    }, {
      key: "whenUp",
      value: function whenUp(keys, callback) {
        if (callback) {
          window.addEventListener("keyup", function (event) {
            event = event || window.event;
            var keyCode = event.keyCode;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var key = _step3.value;

                var code = keyTable[key];
                if (code && code == keyCode) {
                  callback(key);
                }
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          });
        } else {
          console.error(callback);
          throw new Error("Sprite.Input.whenUp got invalid arguments");
        }
      }
    }]);

    return SpriteInput;
  })());
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

2D Game Sprite Library, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

/**
 * @fileoverview Create a shape
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
   * Class Sprite.Shape
   * @class
   * @extends Sprite.Display
   */
  Sprite.assign("Shape", (function (_Sprite$Display) {
    _inherits(SpriteShape, _Sprite$Display);

    /**
     * construct Sprite.Shape
     * @constructor
     */

    function SpriteShape() {
      _classCallCheck(this, SpriteShape);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpriteShape).call(this));

      var privates = internal(_this);
      privates.children = [];
      _this.width = 0;
      _this.height = 0;
      privates.image = null;
      return _this;
    }

    _createClass(SpriteShape, [{
      key: "clone",
      value: function clone() {
        var privates = internal(this);
        var shape = new Sprite.Shape();
        internal(shape).children = privates.children.slice();
        internal(shape).image = privates.image;
        shape.width = this.width;
        shape.height = this.height;
        shape.x = this.x;
        shape.y = this.y;
        shape.centerX = this.centerX;
        shape.centerY = this.centerY;
        return shape;
      }
    }, {
      key: "clear",
      value: function clear() {
        var privates = internal(this);
        privates.children = [];
        this.width = 0;
        this.height = 0;
        this.generate();
        return this;
      }
    }, {
      key: "makeConfig",
      value: function makeConfig(defaultConfig, userConfig) {
        if (userConfig) {
          for (var key in userConfig) {
            defaultConfig[key] = userConfig[key];
          }
        }
        var ret = [];
        for (var key in defaultConfig) {
          ret.push(key + "=\"" + defaultConfig[key] + "\"");
        }
        return ret.join(" ");
      }
    }, {
      key: "rect",
      value: function rect(userConfig) {
        var privates = internal(this);
        var config = {
          "x": 0,
          "y": 0,
          "width": 10,
          "height": 10,
          "stroke": "black",
          "stroke-width": 1,
          "fill": "white",
          "fill-opacity": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        privates.children.push("<rect " + this.makeConfig(config, userConfig) + " />");

        if (config.x + config.width > this.width) {
          this.width = config.x + config.width;
        }
        if (config.y + config.height > this.height) {
          this.height = config.y + config.height;
        }
        this.generate();
      }
    }, {
      key: "circle",
      value: function circle(userConfig) {
        var privates = internal(this);
        var config = {
          "cx": 10,
          "cy": 10,
          "r": 10,
          "stroke": "black",
          "stroke-width": 1,
          "fill": "white",
          "fill-opacity": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        privates.children.push("<circle " + this.makeConfig(config, userConfig) + " />");

        if (config.cx + config.r > this.width) {
          this.width = config.cx + config.r;
        }
        if (config.cy + config.r > this.height) {
          this.height = config.cy + config.r;
        }
        this.generate();
      }
    }, {
      key: "ellipse",
      value: function ellipse(userConfig) {
        var privates = internal(this);
        var config = {
          "cx": 10,
          "cy": 10,
          "rx": 5,
          "ry": 10,
          "stroke": "black",
          "stroke-width": 1,
          "fill": "white",
          "fill-opacity": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        privates.children.push("<ellipse " + this.makeConfig(config, userConfig) + " />");

        if (config.cx + config.rx > this.width) {
          this.width = config.cx + config.rx;
        }
        if (config.cy + config.ry > this.height) {
          this.height = config.cy + config.ry;
        }
        this.generate();
      }
    }, {
      key: "line",
      value: function line(userConfig) {
        var privates = internal(this);
        var config = {
          "x1": 10,
          "y1": 10,
          "x2": 20,
          "y2": 20,
          "stroke": "black",
          "stroke-width": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        privates.children.push("<line " + this.makeConfig(config, userConfig) + " />");

        if (Math.max(config.x1, config.x2) > this.width) {
          this.width = Math.max(config.x1, config.x2);
        }
        if (Math.max(config.y1, config.y2) > this.height) {
          this.height = Math.max(config.y1, config.y2);
        }
        this.generate();
      }
    }, {
      key: "polyline",
      value: function polyline(userConfig) {
        var privates = internal(this);
        var config = {
          "points": "20, 20, 30, 20, 30, 30, 20, 30",
          "stroke": "black",
          "stroke-width": 1,
          "fill": "white",
          "fill-opacity": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        privates.children.push("<polyline " + this.makeConfig(config, userConfig) + " />");

        var max = -1;
        config.points.split(/, /).forEach(function (element) {
          var number = parseInt(element);
          if (!isNaN(number) && number > max) {
            max = number;
          }
        });

        if (max != -1 && max > this.width) {
          this.width = max;
        }
        if (max != -1 && max > this.height) {
          this.height = max;
        }
        this.generate();
      }
    }, {
      key: "polygon",
      value: function polygon(userConfig) {
        var privates = internal(this);
        var config = {
          "points": "20,20 30,20 30,30 20,30",
          "stroke": "black",
          "stroke-width": 1,
          "fill": "white",
          "fill-opacity": 1,
          "stroke-opacity": 1,
          "opacity": 1
        };

        privates.children.push("<polyline " + this.makeConfig(config, userConfig) + " />");

        var width = -1;
        var height = -1;
        // split points by comma or space
        config.points.split(/,| /).forEach(function (element, index) {
          var number = parseInt(element);
          if (index % 2 == 0) {
            // even
            if (number > width) width = number;
          } else {
            // odds
            if (number > height) height = number;
          }
        });

        if (width > 0 && width > this.width) this.width = width;
        if (height > 0 && height > this.height) this.height = height;
        this.generate();
      }
    }, {
      key: "generate",
      value: function generate() {
        var _this2 = this;

        var privates = internal(this);
        var svg = "<?xml version=\"1.0\"?>\n<svg width=\"" + this.width + "\" height=\"" + this.height + "\" " + ("style=\"width: " + this.width + "px; height: " + this.height + "px;\" ") + "xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">\n";

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = privates.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var child = _step.value;

            svg += "  " + child + "\n";
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        svg += "</svg>";

        var blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
        var url = window.URL.createObjectURL(blob);
        var image = new Image();
        image.src = url;

        var Done = function Done() {
          privates.image = image;
          window.URL.revokeObjectURL(url);
          _this2.emit("change");
        };

        if (image.complete) {
          Done();
        } else {
          image.onload = Done;
        }
      }
    }, {
      key: "draw",
      value: function draw(renderer) {
        var privates = internal(this);
        var image = privates.image;
        if (image instanceof Image && image.width > 0 && image.height > 0) {
          this.drawImage(renderer, image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
        }
      }
    }]);

    return SpriteShape;
  })(Sprite.Display));
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

2D Game Sprite Library, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

/**
 * @fileoverview Define Sprite.Bitmap
 * @author mail@qhduan.com (QH Duan)
 */

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  Sprite.assign("Bitmap", (function (_Sprite$Display) {
    _inherits(SpriteBitmap, _Sprite$Display);

    /**
     * Sprite.Bitmap's constructor
     * @constructor
     */

    function SpriteBitmap(image) {
      _classCallCheck(this, SpriteBitmap);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpriteBitmap).call(this));

      if (!(image instanceof Image) && !(image.getContext && image.getContext("2d"))) {
        console.error(image, _this);
        throw new Error("Sprite.Bitmap got invalid image, not Image or Canvas");
      }

      if (image.width <= 0 || !Number.isFinite(image.width) || image.height <= 0 || !Number.isFinite(image.height)) {
        console.error(image);
        throw new Error("Sprite.Bitmap got invalid image, invalid width or height");
      }

      internal(_this).image = image;
      return _this;
    }

    _createClass(SpriteBitmap, [{
      key: "clone",
      value: function clone() {
        var bitmap = new Sprite.Bitmap(internal(this).image);
        bitmap.x = this.x;
        bitmap.y = this.y;
        bitmap.centerX = this.centerX;
        bitmap.centerY = this.centerY;
        bitmap.alpha = this.alpha;
        bitmap.visible = this.visible;
        return bitmap;
      }

      /**
       * @return {Image} Return Sprite.Bitmap's image
       */

    }, {
      key: "draw",

      /**
       * @param {Object} renderer Draw image on the renderer
       */
      value: function draw(renderer) {
        if (this.alpha <= 0.01 || this.visible != true) {
          return;
        }
        var image = internal(this).image;
        this.drawImage(renderer, image, 0, 0, image.width, image.height);
      }
    }, {
      key: "image",
      get: function get() {
        return internal(this).image;
      },
      set: function set(value) {
        console.error(this);
        throw new Error("Sprite.Bitmap.image readonly");
      }

      /**
       * @return {number} Return Sprite.Bitmap's width
       */

    }, {
      key: "width",
      get: function get() {
        return internal(this).image.width;
      },
      set: function set(value) {
        console.error(this);
        throw new Error("Sprite.Bitmap.width readonly");
      }

      /**
       * @return {number} Return Sprite.Bitmap's height
       */

    }, {
      key: "height",
      get: function get() {
        return internal(this).image.height;
      },
      set: function set(value) {
        console.error(this);
        throw new Error("Sprite.Bitmap.height readonly");
      }
    }]);

    return SpriteBitmap;
  })(Sprite.Display));
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  // root级别api入口

  var GameCore = (function () {
    function GameCore() {
      _classCallCheck(this, GameCore);

      var privates = internal(this);
      privates.items = {};
      privates.skills = {};
      privates.sounds = {};
      privates.layers = {};
      privates.windows = {};
      privates.config = { // 保存所有设置（默认设置）
        width: 800, // 渲染窗口的原始大小
        height: 450,
        scale: true, // 如果不拉伸，那么无论浏览器窗口多大，都是原始大小；拉伸则按比例填满窗口
        fps: 35 };
      // 锁定fps到指定数值，如果设置为<=0，则不限制
      privates.paused = true;
      privates.stage = null;
    }

    _createClass(GameCore, [{
      key: "addBag",
      value: function addBag(x, y) {
        return new Promise(function (resolve, reject) {
          // 寻找已经存在的bag
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Game.area.bags[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var bag = _step.value;

              if (bag.hitTest(x, y)) {
                return resolve(bag);
              }
            }
            // 如果没有已经存在的bag合适，新建一个
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          Game.Item.load("bag").then(function (bag) {
            bag.x = x;
            bag.y = y;
            bag.inner = {};
            bag.draw();
            Game.area.bags.add(bag);
            resolve(bag);
          });
        });
      }
    }, {
      key: "assign",
      value: function assign(name, object) {
        Object.defineProperty(this, name, {
          enumerable: false,
          configurable: false,
          writable: false,
          value: object
        });
        return this;
      }

      /** 设置游戏暂停标志为false，启动游戏主循环，接受输入 */

    }, {
      key: "start",
      value: function start() {
        internal(this).paused = false;
      }

      /** 暂停游戏 */

    }, {
      key: "pause",
      value: function pause() {
        internal(this).paused = true;
      }
    }, {
      key: "clearStage",

      /** 清理舞台，即删除舞台上所有元素 */
      value: function clearStage() {
        if (Game.area) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = Game.area.actors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var actor = _step2.value;

              actor.erase();
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = Game.area.bags[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var bag = _step3.value;

              bag.erase();
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
        this.layers.mapLayer.clear();
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = this.stage.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var layer = _step4.value;

            layer.clear();
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        this.stage.releaseRenderer();
      }

      /** 游戏初始化 */

    }, {
      key: "init",
      value: function init() {
        var privates = internal(this);
        // 舞台
        privates.stage = new Sprite.Stage(privates.config.width, privates.config.height);
        // 建立一个可以自动伸缩的窗口，并将舞台加入其中
        privates.windows.stage = Game.Window.create("stage").appendChild(privates.stage.canvas).show();

        // 地图层
        privates.layers.mapLayer = new Sprite.Container();
        privates.layers.mapLayer.name = "mapLayer";
        // 物品层
        privates.layers.itemLayer = new Sprite.Container();
        privates.layers.itemLayer.name = "itemLayer";
        // 人物层，包括玩家
        privates.layers.actorLayer = new Sprite.Container();
        privates.layers.actorLayer.name = "actorLayer";
        // 信息层
        privates.layers.infoLayer = new Sprite.Container();
        privates.layers.infoLayer.name = "inforLayer";
        // 技能效果层
        privates.layers.skillLayer = new Sprite.Container();
        privates.layers.skillLayer.name = "skillLayer";
        // 对话层
        privates.layers.dialogueLayer = new Sprite.Container();
        privates.layers.dialogueLayer.name = "dialogueLayer";

        privates.stage.appendChild(privates.layers.mapLayer, privates.layers.itemLayer, privates.layers.actorLayer, privates.layers.infoLayer, privates.layers.skillLayer, privates.layers.dialogueLayer);

        // 调整人物层顺序，也就是上方的人物会被下方的人物遮盖，例如
        /**
         * AA BB
         * AA BB
         * 这样人物A和B都不干涉，但是A的位置如果在B的上面，并且紧挨着就变成了
         * AA
         * BB
         * BB
         * 这样人物A的下半身就被人物B遮盖，这就是进行排序，否则如果变成
         * AA
         * AA
         * BB
         * 这样就是B的上半身被人物A遮盖，这就很奇怪
         */
        privates.stage.on("beforeDraw", function () {
          if (Game.hero) {
            Game.layers.actorLayer.children.sort(function (a, b) {
              if (a.y < b.y) return -1;
              if (a.y > b.y) return 1;
              return 0;
            });
          }
        });

        /*
        setInterval(() => {
          if (Game.paused == false) {
            Game.stage.update();
          }
        }, 0);
        */
        Sprite.Ticker.on("tick", function () {
          if (Game.paused == false) {
            Game.stage.update();
          }
        });

        /*
        let updateNext = false;
        Game.stage.on("change", function () {
          updateNext = true;
        });
        Sprite.Ticker.on("tick", function () {
         if (Game.paused == false && updateNext) {
           Game.stage.update();
           updateNext = false;
         }
        });
        */

        var fpsElement = document.createElement("div");
        fpsElement.style.position = "absolute";
        fpsElement.style.left = "0";
        fpsElement.style.top = "0";
        fpsElement.style.color = "white";
        fpsElement.style.zIndex = 999999;
        document.body.appendChild(fpsElement);

        var fps = 0;
        var start = new Date().getTime();
        privates.stage.on("afterDraw", function () {
          fps++;
        });
        setInterval(function () {
          var now = new Date().getTime();
          var f = fps / ((now - start) / 1000);
          fps = 0;
          start = now;
          fpsElement.textContent = f.toFixed(1);
        }, 1000);

        console.log("RPG Game 0.1.1 Flying!");
      }
    }, {
      key: "paused",
      get: function get() {
        return internal(this).paused;
      },
      set: function set(value) {
        throw new Error("Game.paused readonly, use Game.pause() instead");
      }
    }, {
      key: "windows",
      get: function get() {
        return internal(this).windows;
      },
      set: function set(value) {
        throw new Error("Game.windows readonly");
      }
    }, {
      key: "config",
      get: function get() {
        return internal(this).config;
      },
      set: function set(value) {
        throw new Error("Game.config readonly");
      }
    }, {
      key: "items",
      get: function get() {
        return internal(this).items;
      },
      set: function set(value) {
        throw new Error("Game.items readonly");
      }
    }, {
      key: "skills",
      get: function get() {
        return internal(this).skills;
      },
      set: function set(value) {
        throw new Error("Game.skills readonly");
      }
    }, {
      key: "sounds",
      get: function get() {
        return internal(this).sounds;
      },
      set: function set(value) {
        throw new Error("Game.sounds readonly");
      }
    }, {
      key: "layers",
      get: function get() {
        return internal(this).layers;
      },
      set: function set(value) {
        throw new Error("Game.layers readonly");
      }
    }, {
      key: "stage",
      get: function get() {
        return internal(this).stage;
      },
      set: function set(value) {
        throw new Error("Game.stage readonly");
      }
    }]);

    return GameCore;
  })();

  ;

  var Game = window.Game = new GameCore();

  // under node-webkit
  if (window.require) {
    Game.config.scale = true;
  }

  function GameBootstrap() {
    if (document.readyState == "complete") {
      Game.init();
      Game.Input.init();
      Game.windows.main.show();
      return true;
    }
    return false;
  }

  if (GameBootstrap() == false) {
    document.addEventListener("readystatechange", function () {
      GameBootstrap();
    });
  }
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var internal = Sprite.Namespace();
  /** 全部窗口 */
  var windows = new Set();
  /**窗口z-index，不断递增 */
  var zIndex = 227;

  var windowContainer = document.createElement("div");
  windowContainer.style.width = Game.config.width + "px";
  windowContainer.style.height = Game.config.height + "px";
  windowContainer.style.position = "fixed";
  document.body.appendChild(windowContainer);

  Game.assign("Window", (function (_Sprite$Event) {
    _inherits(GameWindow, _Sprite$Event);

    _createClass(GameWindow, null, [{
      key: "create",

      /**
       *
       */
      value: function create(id) {
        var win = new Game.Window(id);
        return win;
      }

      /**
       * @constructor
       */

    }]);

    function GameWindow(id) {
      _classCallCheck(this, GameWindow);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GameWindow).call(this));

      var privates = internal(_this);
      privates.id = id;
      privates.css = document.createElement("style");
      privates.html = document.createElement("div");
      privates.index = -1;

      // 随机一个字符串作为dom的id
      privates.html.id = "GW" + Math.random().toString(16).substr(2);
      privates.html.classList.add(id);
      privates.html.classList.add("game-window");
      privates.html.style.display = "none";

      windowContainer.appendChild(privates.html);
      document.head.appendChild(privates.css);

      privates.html.addEventListener("mousedown", function (event) {
        var x = event.clientX;
        var y = event.clientY;

        var left = null;
        var top = null;
        var scale = null;

        if (windowContainer.style.left) {
          var t = windowContainer.style.left.match(/(\d+)px/);
          if (t) {
            left = parseInt(t[1]);
          }
        }

        if (windowContainer.style.top) {
          var t = windowContainer.style.top.match(/(\d+)px/);
          if (t) {
            top = parseInt(t[1]);
          }
        }

        if (windowContainer.style.transform) {
          var t = windowContainer.style.transform.match(/scale\(([\d\.]+), ([\d\.]+)\)/);
          if (t) {
            scale = parseFloat(t[1]);
          } else {
            scale = 1.0;
          }
        } else {
          scale = 1.0;
        }

        if (Number.isFinite(left) && Number.isFinite(top) && Number.isFinite(scale)) {
          x -= left;
          y -= top;
          x /= scale;
          y /= scale;
          _this.emit("mousedown", false, {
            x: x,
            y: y
          });
        }
      });

      windows.add(_this);
      return _this;
    }

    _createClass(GameWindow, [{
      key: "destroy",
      value: function destroy() {
        var privates = internal(this);
        if (this.showing) {
          this.hide();
        }
        if (privates.html) {
          privates.html.parentNode.removeChild(privates.html);
          privates.html = null;
        }
        if (privates.css) {
          document.head.removeChild(privates.css);
          privates.css = null;
        }
        if (windows.has(this)) {
          windows.delete(this);
        }
      }
    }, {
      key: "whenPress",
      value: function whenPress(keys, callback) {
        var _this2 = this;

        Sprite.Input.whenPress(keys, function (key) {
          if (_this2.atop) {
            callback(key);
          }
        });
        return this;
      }
    }, {
      key: "whenUp",
      value: function whenUp(keys, callback) {
        var _this3 = this;

        Sprite.Input.whenUp(keys, function (key) {
          if (_this3.atop) {
            callback(key);
          }
        });
        return this;
      }
    }, {
      key: "whenDown",
      value: function whenDown(keys, callback) {
        var _this4 = this;

        Sprite.Input.whenDown(keys, function (key) {
          if (_this4.atop) {
            callback(key);
          }
        });
        return this;
      }
    }, {
      key: "assign",
      value: function assign(name, object) {
        Object.defineProperty(this, name, {
          enumerable: false,
          configurable: false,
          writable: false,
          value: object
        });

        return this;
      }
    }, {
      key: "show",
      value: function show() {
        var privates = internal(this);
        GameWindowResize();
        if (this.showing == false && privates.html) {
          this.emit("beforeShow");

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = windows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var win = _step.value;

              if (win.atop) {
                win.emit("deactive");
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          privates.index = zIndex;
          privates.html.style.zIndex = privates.index;
          privates.html.style.display = "block";
          zIndex++;
          this.emit("afterShow");
          this.emit("active");
        }
        return this;
      }
    }, {
      key: "hide",
      value: function hide() {
        var privates = internal(this);
        if (privates.html) {
          this.emit("beforeHide");

          privates.index = -1;
          this.emit("afterHide");
          this.emit("deactive");

          if (privates && privates.html) {
            privates.html.style.zIndex = privates.index;
            privates.html.style.display = "none";
          }

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = windows[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var win = _step2.value;

              if (win.atop) {
                win.emit("active");
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
        return this;
      }
    }, {
      key: "querySelector",
      value: function querySelector(selector) {
        var privates = internal(this);
        return document.querySelector("#" + privates.html.id + " " + selector);
      }
    }, {
      key: "querySelectorAll",
      value: function querySelectorAll(selector) {
        var privates = internal(this);
        return document.querySelectorAll("#" + privates.html.id + " " + selector);
      }
    }, {
      key: "appendChild",
      value: function appendChild(domElement) {
        internal(this).html.appendChild(domElement);
        return this;
      }
    }, {
      key: "removeChild",
      value: function removeChild(domElement) {
        internal(this).html.removeChild(domElement);
        return this;
      }
    }, {
      key: "index",
      get: function get() {
        var privates = internal(this);
        return privates.index;
      },
      set: function set(value) {
        console.error(this);
        throw new Error("Game.Window.index readonly");
      }
    }, {
      key: "showing",
      get: function get() {
        var privates = internal(this);
        if (privates.html && privates.html.style.display != "none") {
          return true;
        }
        return false;
      },
      set: function set(value) {
        throw new Error("Game.Window.showing readonly");
      }
    }, {
      key: "atop",
      get: function get() {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = windows[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var win = _step3.value;

            if (win.showing && win.index > this.index) {
              return false;
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        return true;
      },
      set: function set(value) {
        throw new Error("Game.Window.atop readonly");
      }
    }, {
      key: "html",
      get: function get() {
        return internal(this).html.innerHTML;
      },
      set: function set(value) {
        internal(this).html.innerHTML = value;
      }
    }, {
      key: "css",
      get: function get() {
        return internal(this).css.innerHTML;
      },
      set: function set(value) {
        internal(this).css.innerHTML = value;
      }
    }]);

    return GameWindow;
  })(Sprite.Event));

  // 当窗口大小改变时改变游戏窗口大小
  function GameWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var scale = 1;
    var leftMargin = 0;
    var topMargin = 0;
    var mobile = false;

    if (Game.config.scale == false) {
      // 不拉伸游戏窗口，按原始大小计算窗口居中
      leftMargin = Math.floor((width - Game.config.width) / 2);
      topMargin = Math.floor((height - Game.config.height) / 2);
    } else {
      // 拉伸游戏窗口，首先计算游戏原始大小比例
      var ratio = Game.config.width / Game.config.height;
      // width first
      var w = width;
      var h = w / ratio;
      // then height
      if (h > height) {
        h = height;
        w = h * ratio;
      }

      w = Math.floor(w);
      h = Math.floor(h);
      leftMargin = Math.floor((width - w) / 2);
      topMargin = Math.floor((height - h) / 2);

      scale = Math.min(w / Game.config.width, h / Game.config.height);
    }

    var style = windowContainer.style;
    style.left = leftMargin + "px";
    style.top = topMargin + "px";
    style.transformOrigin = "left top 0";
    style.webkitTransformOrigin = "left top 0";
    style.transform = "scale(" + scale + ", " + scale + ") translateZ(0)";
    style.webkitTransform = "scale(" + scale + ", " + scale + ") translateZ(0)";
    style.filter = "none";
    style.webkitFilter = "blur(0px)";
  }

  GameWindowResize();
  window.addEventListener("resize", function () {
    GameWindowResize();
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var win = Game.windows.archive = Game.Window.create("archiveWindow");

  win.html = "\n    <div class=\"window-box\">\n      <div id=\"archiveWindowItemBar\">\n        <button id=\"archiveWindowClose\" class=\"brownButton\">关闭</button>\n        <button id=\"archiveWindowSave\" class=\"brownButton\">保存</button>\n      </div>\n      <div id=\"archiveWindowTable\"></div>\n    </div>\n  ";

  win.css = "\n    #archiveWindowTable {\n      width: 100%;\n      overflow-y: auto;\n      height: 320px;\n    }\n\n    .archiveWindowItem {\n      border: 1px solid gray;\n      border-radius: 10px;\n      margin: 10px 10px;\n    }\n\n    .archiveWindowItem > button {\n      width: 100px;\n      height: 40px;\n      border-radius: 5px;\n    }\n\n    #archiveWindowItemBar button {\n      width: 100px;\n      height: 30px;\n      font-size: 16px;\n      display: block;\n      margin-bottom: 5px;\n    }\n\n    #archiveWindowClose {\n      float: right;\n    }\n  ";

  var archiveWindowSave = win.querySelector("button#archiveWindowSave");
  var archiveWindowClose = win.querySelector("button#archiveWindowClose");
  var archiveWindowTable = win.querySelector("#archiveWindowTable");

  archiveWindowSave.addEventListener("click", function () {
    var canvas = document.createElement("canvas");
    canvas.width = 80;
    canvas.height = 45;
    var context = canvas.getContext("2d");
    context.drawImage(Game.stage.canvas, 0, 0, Game.stage.canvas.width, Game.stage.canvas.height, 0, 0, 80, 45);

    Game.Archive.save({
      hero: Game.hero.data,
      screenshot: canvas.toDataURL("image/jpeg")
    });

    win.open();
  });

  archiveWindowClose.addEventListener("click", function () {
    win.hide();
    if (!Game.windows.interface.showing) {
      Game.windows.main.show();
    }
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      archiveWindowClose.click();
    }, 20);
  });

  win.assign("open", function () {

    if (Game.windows.interface.showing && Game.hero) {
      archiveWindowSave.style.visibility = "visible";
    } else {
      archiveWindowSave.style.visibility = "hidden";
    }

    var table = "";
    var list = Game.Archive.list();
    list.forEach(function (element) {
      var line = "<div class=\"archiveWindowItem\">\n";
      var archive = Game.Archive.get("SAVE_" + element);
      line += "  <button data-type=\"remove\" data-id=\"SAVE_" + element + "\" class=\"brownButton\" style=\"float: right;\">删除</button>\n";
      line += "  <button data-type=\"load\" data-id=\"SAVE_" + element + "\" class=\"brownButton\" style=\"float: right;\">读取</button>\n";
      line += "  <img alt=\"\" src=\"" + (archive.screenshot || "") + "\" width=\"80\" height=\"45\" style=\"display: inline-block; margin: 5px;\">\n";
      line += "  <label style=\"font-size: 20px; margin: 10px;\">" + archive.name + "</label>\n";
      line += "  <label style=\"margin: 10px;\">" + archive.date + "</label>\n";
      line += "</div>\n";
      table += line;
    });

    archiveWindowTable.innerHTML = table;
    Game.windows.archive.show();
  });

  archiveWindowTable.addEventListener("click", function (event) {
    var type = event.target.getAttribute("data-type");
    var id = event.target.getAttribute("data-id");
    if (type && id) {
      if (type == "remove") {
        Game.Archive.remove(id);
        win.open();
      } else if (type == "load") {
        Game.Archive.load(id);
        win.hide();
      }
    }
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var win = Game.windows.buy = Game.Window.create("buyWindow");

  win.html = "\n  <div class=\"window-box\">\n    <div id=\"buyWindowItemBar\">\n\n      <button id=\"buyWindowClose\" class=\"brownButton\">关闭</button>\n      <button id=\"buyWindowSell\" class=\"brownButton\">卖出</button>\n\n      <button id=\"buyWindowAll\" class=\"brownButton\">全部</button>\n      <button id=\"buyWindowWeapon\" class=\"brownButton\">武器</button>\n      <button id=\"buyWindowArmor\" class=\"brownButton\">护甲</button>\n      <button id=\"buyWindowPotion\" class=\"brownButton\">药水</button>\n      <button id=\"buyWindowMaterial\" class=\"brownButton\">材料</button>\n      <button id=\"buyWindowBook\" class=\"brownButton\">书籍</button>\n      <button id=\"buyWindowMisc\" class=\"brownButton\">其他</button>\n    </div>\n\n    <span id=\"buyWindowGold\"></span>\n\n    <div style=\"overflow: auto; height: 300px;\">\n      <table border=\"0\">\n        <thead>\n          <tr>\n            <td style=\"width: 40px;\"></td>\n            <td style=\"width: 120px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td></td>\n            <td style=\"width: 60px;\"></td>\n          </tr>\n        </thead>\n        <tbody id=\"buyWindowTable\"></tbody>\n      </table>\n    </div>\n  </div>\n  ";

  win.css = "\n\n    #buyWindowTable tr:nth-child(odd) {\n      background-color: rgba(192, 192, 192, 0.6);\n    }\n\n    #buyWindowItemBar > button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      margin-left: 5px;\n      margin-right: 5px;\n      margin-top: 0px;\n      margin-bottom: 5px;\n    }\n\n    #buyWindowClose {\n      float: right;\n    }\n\n    #buyWindowStatus {\n      float: right;\n    }\n\n    .buyWindow table {\n      width: 100%;\n    }\n\n    .buyWindow table button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n    }\n\n    #buyWindowGold {\n      position: absolute;\n      right: 100px;\n      bottom: 30px;\n      font-size: 20px;\n      color: black;\n    }\n  ";

  var buyWindowClose = win.querySelector("button#buyWindowClose");
  var buyWindowSell = win.querySelector("button#buyWindowSell");

  var buyWindowAll = win.querySelector("button#buyWindowAll");
  var buyWindowWeapon = win.querySelector("button#buyWindowWeapon");
  var buyWindowArmor = win.querySelector("button#buyWindowArmor");
  var buyWindowPotion = win.querySelector("button#buyWindowPotion");
  var buyWindowMaterial = win.querySelector("button#buyWindowMaterial");
  var buyWindowBook = win.querySelector("button#buyWindowBook");
  var buyWindowMisc = win.querySelector("button#buyWindowMisc");

  var buyWindowGold = win.querySelector("span#buyWindowGold");
  var buyWindowTable = win.querySelector("#buyWindowTable");

  var lastItems = null;
  var lastFilter = null;
  var lastSelect = -1;

  buyWindowClose.addEventListener("click", function () {
    win.hide();
  });

  buyWindowSell.addEventListener("click", function () {
    win.hide();
    Game.windows.sell.open(lastItems);
  });

  win.whenUp(["tab"], function () {
    setTimeout(function () {
      win.hide();
      Game.windows.sell.open(lastItems);
    }, 20);
  });

  buyWindowAll.addEventListener("click", function (event) {
    win.open(lastItems, null);
  });

  buyWindowWeapon.addEventListener("click", function (event) {
    win.open(lastItems, "sword|spear|bow");
  });

  buyWindowArmor.addEventListener("click", function (event) {
    win.open(lastItems, "head|body|feet");
  });

  buyWindowPotion.addEventListener("click", function (event) {
    win.open(lastItems, "potion");
  });

  buyWindowMaterial.addEventListener("click", function (event) {
    win.open(lastItems, "material");
  });

  buyWindowBook.addEventListener("click", function (event) {
    win.open(lastItems, "book|scroll|letter");
  });

  buyWindowMisc.addEventListener("click", function (event) {
    win.open(lastItems, "misc");
  });

  win.assign("open", function (items, filter, select) {

    if (typeof select == "undefined") {
      select = -1;
    }

    lastItems = items;
    lastFilter = filter;
    lastSelect = select;

    buyWindowGold.textContent = Game.hero.data.gold + "G";

    var defaultColor = "white";
    var activeColor = "yellow";

    buyWindowAll.style.color = defaultColor;
    buyWindowWeapon.style.color = defaultColor;
    buyWindowArmor.style.color = defaultColor;
    buyWindowPotion.style.color = defaultColor;
    buyWindowMaterial.style.color = defaultColor;
    buyWindowBook.style.color = defaultColor;
    buyWindowMisc.style.color = defaultColor;

    if (filter == null) {
      buyWindowAll.style.color = activeColor;
    } else if (filter.match(/sword/)) {
      buyWindowWeapon.style.color = activeColor;
    } else if (filter.match(/head/)) {
      buyWindowArmor.style.color = activeColor;
    } else if (filter.match(/potion/)) {
      buyWindowPotion.style.color = activeColor;
    } else if (filter.match(/material/)) {
      buyWindowMaterial.style.color = activeColor;
    } else if (filter.match(/book/)) {
      buyWindowBook.style.color = activeColor;
    } else if (filter.match(/misc/)) {
      buyWindowMisc.style.color = activeColor;
    }

    var index = 0;
    var table = "";
    Sprite.each(items, function (itemCount, itemId) {
      var item = Game.items[itemId];

      if (filter && filter.indexOf(item.data.type) == -1) return;

      var line = "";

      if (select == index) {
        line += "<tr style=\"background-color: green;\">\n";
      } else {
        line += "<tr>\n";
      }

      if (item.icon) {
        line += "  <td style=\"text-align: center;\"><img alt=\"\" src=\"" + item.icon.src + "\"></td>\n";
      } else {
        line += "  <td> </td>\n";
      }
      line += "  <td>" + item.data.name + "</td>\n";
      line += "  <td style=\"text-align: center;\">" + Math.ceil(item.data.value * 1.2) + "G</td>\n";
      line += "  <td style=\"text-align: center;\">" + itemCount + "</td>\n";
      line += "  <td>" + item.data.description + "</td>\n";

      if (Math.ceil(item.data.value * 1.2) > Game.hero.data.gold || items[itemId] <= 0) {
        line += "  <td><button disabled style=\"Opacity: 0.5;\" class=\"brownButton\">买入</button></td>\n";
      } else {
        line += "  <td><button data-id=\"" + itemId + "\" class=\"brownButton\">买入</button></td>\n";
      }

      line += "</tr>\n";
      table += line;
      index++;
    });

    buyWindowTable.innerHTML = table;
    win.show();
  });

  win.whenUp(["enter"], function () {
    var buttons = buyWindowTable.querySelectorAll("button");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    var count = buyWindowTable.querySelectorAll("button").length;
    if (count <= 0) return;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(lastItems, lastFilter, 0);
      } else if (key == "up") {
        win.open(lastItems, lastFilter, count - 1);
      }
    } else {
      if (key == "down") {
        var select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(lastItems, lastFilter, select);
      } else if (key == "up") {
        var select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(lastItems, lastFilter, select);
      }
    }
  });

  win.whenUp(["esc"], function () {
    setTimeout(function () {
      win.hide();
    }, 20);
  });

  win.whenUp(["left", "right"], function (key) {
    if (key == "right") {
      var filter = lastFilter;
      if (filter == null) {
        filter = "sword|spear|bow";
      } else if (filter.match(/sword/)) {
        filter = "head|body|feet";
      } else if (filter.match(/head/)) {
        filter = "potion";
      } else if (filter.match(/potion/)) {
        filter = "material";
      } else if (filter.match(/material/)) {
        filter = "book|scroll|letter";
      } else if (filter.match(/book/)) {
        filter = "misc";
      } else if (filter.match(/misc/)) {
        filter = null;
      }
      win.open(lastItems, filter);
    } else if (key == "left") {
      var filter = lastFilter;
      if (filter == null) {
        filter = "misc";
      } else if (filter.match(/sword/)) {
        filter = null;
      } else if (filter.match(/head/)) {
        filter = "sword|spear|bow";
      } else if (filter.match(/potion/)) {
        filter = "head|body|feet";
      } else if (filter.match(/material/)) {
        filter = "potion";
      } else if (filter.match(/book/)) {
        filter = "material";
      } else if (filter.match(/misc/)) {
        filter = "book|scroll|letter";
      }
      win.open(lastItems, filter);
    }
  });

  buyWindowTable.addEventListener("click", function (event) {
    var itemId = event.target.getAttribute("data-id");
    if (itemId && lastItems.hasOwnProperty(itemId)) {
      var item = Game.items[itemId];

      Game.hero.data.gold -= Math.ceil(item.data.value * 1.2);
      if (Game.hero.data.items[itemId]) {
        Game.hero.data.items[itemId]++;
      } else {
        Game.hero.data.items[itemId] = 1;
      }

      lastItems[itemId]--;

      if (lastItems[itemId] == 0) {
        delete lastItems[itemId];
      }

      win.open(lastItems, lastFilter);
    }
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var choiceHTML = "\n    <div class=\"window-box\">\n      <button id=\"choiceWindowNo\" class=\"brownButton\">取消</button>\n      <div style=\"width: 100%; height: 100%;\">\n        <div style=\"height: 370px; overflow-y: auto; text-align: center;\">\n          <table id=\"choiceWindowTable\" style=\"width: 100%; height: 370px;\">\n            <tbody>\n              <tr>\n                <td id=\"choiceWindowButtonContainer\">\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n      </div>\n    </div>\n  ";

  var choiceCSS = "\n    .choiceWindow {\n      text-align: center;\n    }\n\n    .choiceWindow div {\n      text-align: center;\n    }\n\n    button#choiceWindowNo {\n      position: absolute;\n      right: 100px;\n      top: 50px;\n      width: 100px;\n      height: 60px;\n      font-size: 30px;\n    }\n\n    #choiceWindowTable button {\n      margin: 5px auto;\n      min-width: 300px;\n      min-height: 60px;\n      font-size: 30px;\n      display: block;\n    }\n  ";

  Game.choice = function (options) {
    return new Promise(function (resolve, reject) {
      var win = Game.Window.create("choiceWindow");
      win.html = choiceHTML;
      win.css = choiceCSS;
      win.show();

      var choiceWindowButtonContainer = win.querySelector("#choiceWindowButtonContainer");
      var choiceWindowNo = win.querySelector("#choiceWindowNo");
      var buttonArray = [];

      Sprite.each(options, function (value, key) {
        var button = document.createElement("button");
        button.textContent = buttonArray.length + 1 + ". " + key;
        button.classList.add("brownButton");

        choiceWindowButtonContainer.appendChild(button);
        buttonArray.push(button);

        button.addEventListener("click", function () {
          win.hide();
          win.destroy();
          resolve(value);
        });
      });

      choiceWindowNo.addEventListener("click", function () {
        win.hide();
        win.destroy();
        resolve(null);
      });

      win.whenUp(["esc"], function () {
        setTimeout(function () {
          choiceWindowNo.click();
        }, 20);
      });

      win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8", "9"], function (key) {
        // match 1 to 9
        var num = parseInt(key) - 1; // get 0 to 8
        var element = buttonArray[num];
        if (element) {
          element.click();
        }
      });
    });
  };
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  var confirmHTML = "\n  <div class=\"window-box\">\n    <div style=\"width: 100%; height: 100%;\">\n      <table>\n        <tr><td><span id=\"confirmWindowMessage\"></span></td></tr>\n        <tr><td>\n          <button id=\"confirmWindowYes\" class=\"brownButton\">确定</button>\n          <button id=\"confirmWindowNo\" class=\"brownButton\">取消</button>\n        </td></tr>\n      </table>\n    </div>\n  </div>\n  ";

  var confirmCSS = "\n    .confirmWindow {\n      text-align: center;\n    }\n\n    .confirmWindow table {\n      width: 100%;\n      height: 100%;\n    }\n\n    .confirmWindow span {\n      font-size: 16px;\n    }\n\n    .confirmWindow button {\n      width: 100px;\n      height: 60px;\n      font-size: 16px;\n      margin: 20px;\n    }\n\n    #confirmWindowMessage {\n      color: black;\n      font-size: 20px;\n    }\n  ";

  Game.assign("confirm", function (message) {

    return new Promise(function (resolve, reject) {

      var win = Game.Window.create("confirmWindow");
      win.html = confirmHTML;
      win.css = confirmCSS;
      win.show();

      var confirmWindowMessage = win.querySelector("#confirmWindowMessage");
      var confirmWindowYes = win.querySelector("#confirmWindowYes");
      var confirmWindowNo = win.querySelector("#confirmWindowNo");

      if (typeof message == "string") {
        confirmWindowMessage.textContent = message;
      } else if (message.message) {
        confirmWindowMessage.textContent = message.message;
        if (message.yes) {
          confirmWindowYes.textContent = message.yes;
        }
        if (message.no) {
          confirmWindowNo.textContent = message.no;
        }
      } else {
        throw new Error("Game.confirm got invalid arguments");
      }

      win.whenUp(["esc"], function () {
        setTimeout(function () {
          confirmWindowNo.click();
        }, 20);
      });

      win.whenUp(["y", "Y"], function () {
        confirmWindowYes.click();
      });

      win.whenUp(["n", "N"], function () {
        confirmWindowNo.click();
      });

      confirmWindowYes.addEventListener("click", function () {
        win.destroy();
        resolve();
      });

      confirmWindowNo.addEventListener("click", function () {
        win.destroy();
        reject();
      });
    });
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var win = Game.windows.dialogue = Game.Window.create("dialogueWindow");

  win.html = "\n    <div class=\"window-box\">\n      <div style=\"width: 100%; height: 100%;\">\n        <span id=\"dialogueWindowSpeaker\"></span>\n        <table><tbody><tr><td>\n          <div id=\"dialogueWindowContent\"></div>\n        </td></tr></tbody></table>\n        <button id=\"dialogueWindowNext\" style=\"display: block;\" class=\"brownButton\">继续</button>\n        <button id=\"dialogueWindowClose\" style=\"display: none;\" class=\"brownButton\">结束</button>\n      </div>\n    </div>\n  ";

  win.css = "\n    .dialogueWindow table, dialogueWindow.tbody, dialogueWindow tr, dialogueWindow td {\n      margin: 0;\n      padding: 0;\n      width: 100%;\n      height: 100%;\n      text-align: center;\n    }\n\n    #dialogueWindowSpeaker {\n      position: absolute;\n      left: 50px;\n      top: 50px;\n      font-size: 30px;\n      font-weight: bold;\n    }\n\n    .dialogueWindow button {\n      width: 120px;\n      height: 60px;\n      font-size: 16px;\n      position: absolute;\n    }\n\n    #dialogueWindowNext {\n      bottom: 50px;\n      right: 100px;\n    }\n\n    #dialogueWindowClose {\n      bottom: 50px;\n      right: 100px;\n    }\n\n    #dialogueWindowContent {\n      margin-left: 50px;\n      margin-right: 50px;\n      max-width: 600px;\n      font-size: 24px;\n      text-align: center;\n    }\n  ";

  var dialogueWindowSpeaker = win.querySelector("#dialogueWindowSpeaker");

  var dialogueContent = [];
  var dialogueIndex = 0;
  var dialogueWindowNext = document.getElementById("dialogueWindowNext");
  var dialogueWindowClose = document.getElementById("dialogueWindowClose");
  var dialogueWindowContent = document.getElementById("dialogueWindowContent");

  dialogueWindowNext.addEventListener("click", function () {
    DialogueNext();
  });

  dialogueWindowClose.addEventListener("click", function () {
    setTimeout(function () {
      Game.windows.dialogue.hide();
      dialogueContent = [];
      dialogueIndex = 0;
    }, 20);
  });

  Game.dialogue = function (content, name) {
    dialogueWindowNext.style.display = "block";
    dialogueWindowClose.style.display = "none";
    if (name && name.length) {
      dialogueWindowSpeaker.textContent = name + "：";
    } else {
      dialogueWindowSpeaker.textContent = "";
    }
    dialogueContent = content;
    dialogueIndex = 0;
    DialogueNext();
    Game.windows.dialogue.show();
  };

  function DialogueNext() {
    dialogueWindowContent.textContent = dialogueContent[dialogueIndex];
    dialogueIndex++;
    if (dialogueIndex >= dialogueContent.length) {
      dialogueWindowNext.style.display = "none";
      dialogueWindowClose.style.display = "block";
    }
  };

  win.whenUp(["enter", "space", "esc"], function () {
    if (Game.windows.dialogue.showing) {
      if (dialogueWindowNext.style.display != "none") {
        dialogueWindowNext.click();
      } else if (dialogueWindowClose.style.display != "none") {
        dialogueWindowClose.click();
      }
    }
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var win = Game.windows.interface = Game.Window.create("interfaceWindow");

  win.html = "\n    <div id=\"interfaceWindowBar\"></div>\n\n    <div style=\"position: absolute; bottom: 10px; left: 20px; width: 100px; height: 60px;\">\n      <div style=\"width: 100px; height: 20px; margin: 5px 0; border: 1px solid gray; background-color: white;\">\n        <div id=\"interfaceWindowHP\" style=\"width: 100%; height: 100%; background-color: green;\"></div>\n      </div>\n      <div style=\"width: 100px; height: 20px; margin: 5px 0; border: 1px solid gray; background-color: white;\">\n        <div id=\"interfaceWindowSP\" style=\"width: 100%; height: 100%; background-color: blue;\"></div>\n      </div>\n    </div>\n\n    <span id=\"interfaceWindowDatetime\"></span>\n    <span id=\"interfaceWindowMap\"></span>\n\n    <button id=\"interfaceWindowUse\" class=\"interfaceWindowButton\"></button>\n    <button id=\"interfaceWindowMenu\" class=\"interfaceWindowButton\"></button>\n  ";

  win.css = "\n\n    #interfaceWindowBar {\n      text-align: center;\n      position: absolute;\n      bottom: 10px;\n      width: 100%;\n      height: 60px;\n    }\n\n    .interfaceWindow {\n      /** 让interface窗口的主要窗口，不接受事件 */\n      pointer-events: none;\n    }\n\n    button.interfaceWindowButton {\n      margin-left: 3px;\n      margin-right: 3px;\n      width: 60px;\n      height: 60px;\n      border: 4px solid gray;\n      border-radius: 10px;\n      background-color: rgba(100, 100, 100, 0.5);\n      display: inline-block;\n      /** 让interface窗口的按钮，接受事件 */\n      pointer-events: auto;\n      background-repeat: no-repeat;\n      background-size: cover;\n    }\n\n    button.interfaceWindowButton:hover {\n      opacity: 0.5;\n    }\n\n    button.interfaceWindowButton > img {\n      width: 100%;\n      height: 100%;\n    }\n\n    #interfaceWindowMap {\n      position: absolute;\n      top: 35px;\n      left: 5px;\n      background-color: rgba(100, 100, 100, 0.7);\n      padding: 2px;\n    }\n\n    #interfaceWindowDatetime {\n      position: absolute;\n      top: 10px;\n      left: 5px;\n      background-color: rgba(100, 100, 100, 0.7);\n      padding: 2px;\n    }\n\n    button#interfaceWindowUse {\n      position: absolute;\n      top: 5px;\n      right: 85px;\n      visibility: hidden;\n      background-image: url(\"image/hint.png\");\n    }\n\n    button#interfaceWindowMenu {\n      position: absolute;\n      top: 5px;\n      right: 5px;\n      background-image: url(\"image/setting.png\");\n    }\n\n    interfaceWindowButton:disabled {\n      cursor: default;\n      pointer-events: none;\n      background-color: gray;\n      opacity: 0.5;\n    }\n\n    .interfaceWindowButtonText {\n      position: absolute;\n      background-color: white;\n      margin-left: -26px;\n      margin-top: 12px;\n    }\n  ";

  // 使用按钮
  var interfaceWindowUse = win.querySelector("button#interfaceWindowUse");
  // 技能栏按钮组
  var interfaceWindowBar = win.querySelector("div#interfaceWindowBar");
  // 地图信息
  var interfaceWindowMap = win.querySelector("#interfaceWindowMap");
  // 选项菜单
  var interfaceWindowMenu = win.querySelector("button#interfaceWindowMenu");
  // 玩家的hp
  var interfaceWindowHP = win.querySelector("#interfaceWindowHP");
  // 玩家的sp
  var interfaceWindowSP = win.querySelector("#interfaceWindowSP");

  win.assign("hideUse", function () {
    interfaceWindowUse.style.visibility = "hidden";
  });

  win.assign("showUse", function () {
    interfaceWindowUse.style.visibility = "visible";
  });

  win.on("active", function () {
    Game.start();
  });

  win.on("deactive", function () {
    Game.pause();
  });

  win.whenUp(["esc"], function (key) {
    if (Game.windows.interface.atop) {
      setTimeout(function () {
        interfaceWindowMenu.click();
      }, 20);
    }
  });

  function InitInterfaceBar() {
    var buttonCount = 8;
    var buttonHTML = "";
    for (var i = 0; i < buttonCount; i++) {
      var line = "";
      line += "<button data-index=\"" + i + "\" class=\"interfaceWindowButton\">";
      line += "<label data-index=\"" + i + "\" class=\"interfaceWindowButtonText\"></label>";
      line += "</button>\n";
      buttonHTML += line;
    }
    interfaceWindowBar.innerHTML = buttonHTML;
  }

  setInterval(function () {
    if (Game.hero && Game.paused == false) {
      Game.hero.data.time++;
      Game.windows.interface.datetime();
    }
  }, 1000);

  InitInterfaceBar();
  var buttons = win.querySelectorAll(".interfaceWindowButton");
  var buttonTexts = win.querySelectorAll(".interfaceWindowButtonText");

  interfaceWindowBar.addEventListener("click", function (event) {
    var index = event.target.getAttribute("data-index");
    if (index) {
      var element = Game.hero.data.bar[index];
      if (element) {
        if (element.type == "skill") {
          var cooldown = Game.hero.fire(element.id);
          if (cooldown) {
            event.target.disabled = true;
            setTimeout(function () {
              event.target.disabled = false;
            }, cooldown);
          }
        } else if (element.type == "item") {
          var itemId = element.id;
          var item = Game.items[itemId];
          item.heroUse();
          Game.windows.interface.refresh();
        }
      }
    }
  });

  win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8"], function (key) {
    var num = parseInt(key);
    if (Number.isInteger(num) && num >= 0 && num < buttons.length) {
      buttons[num - 1].click();
    }
  });

  win.whenUp(["e", "E", "space", "enter"], function (key) {
    if (Game.windows.interface.showing) {
      if (Game.hintObject && Game.hintObject.heroUse) {
        Game.hintObject.heroUse();
      }
    }
  });

  interfaceWindowUse.addEventListener("click", function (event) {
    if (Game.hintObject && Game.hintObject.heroUse) {
      Game.hintObject.heroUse();
    }
  });

  win.assign("status", function () {
    if (Game.hero) {
      var hp = Game.hero.data.hp / Game.hero.data.$hp;
      var sp = Game.hero.data.sp / Game.hero.data.$sp;
      interfaceWindowHP.style.width = hp * 100 + "%";
      interfaceWindowSP.style.width = sp * 100 + "%";
      if (hp >= 0.5) {
        interfaceWindowHP.style.backgroundColor = "green";
      } else if (hp >= 0.25) {
        interfaceWindowHP.style.backgroundColor = "yellow";
      } else {
        interfaceWindowHP.style.backgroundColor = "red";
      }
    }
  });

  win.assign("datetime", function () {
    if (Game.hero && Game.hero.data && Number.isInteger(Game.hero.data.time)) {
      var YEARMIN = 60 * 24 * 30 * 12;
      var MONTHMIN = 60 * 24 * 30;
      var DAYMIN = 60 * 24;
      var HOURMIN = 60;
      var datetime = win.querySelector("#interfaceWindowDatetime");
      var time = Game.hero.data.time;
      var year = Math.floor(time / YEARMIN);
      time = time % YEARMIN;
      var month = Math.floor(time / MONTHMIN);
      time = time % MONTHMIN;
      var day = Math.floor(time / DAYMIN);
      time = time % DAYMIN;
      var hour = Math.floor(time / HOURMIN);
      time = time % HOURMIN;
      var minute = time;
      year++;
      month++;
      day++;
      hour = hour.toString();
      while (hour.length < 2) {
        hour = "0" + hour;
      }minute = minute.toString();
      while (minute.length < 2) {
        minute = "0" + minute;
      }datetime.textContent = month + "月" + day + "日 " + hour + ":" + minute;

      var type = Game.area.map.data.type;

      if (type == "indoor") {
        // do nothing
        Game.stage.filter("brightness", 0.0);
      } else if (type == "outdoor") {
        // 室外
        if (hour >= 20 || hour < 4) {
          // 20:00 to 4:00
          Game.stage.filter("brightness", -0.15);
        } else if (hour >= 4 && hour < 6) {
          Game.stage.filter("brightness", -0.1);
        } else if (hour >= 6 && hour < 8) {
          Game.stage.filter("brightness", -0.05);
        } else if (hour >= 8 && hour < 10) {
          Game.stage.filter("brightness", 0.0);
        } else if (hour >= 10 && hour < 12) {
          Game.stage.filter("brightness", 0.05);
        } else if (hour >= 12 && hour < 14) {
          Game.stage.filter("brightness", 0.0);
        } else if (hour >= 14 && hour < 16) {
          Game.stage.filter("brightness", 0.0);
        } else if (hour >= 16 && hour < 18) {
          Game.stage.filter("brightness", -0.05);
        } else if (hour >= 18 && hour < 20) {
          Game.stage.filter("brightness", -0.1);
        }
      } else if (type == "cave") {
        // caves are dark
        Game.stage.filter("brightness", -0.15);
      }
    }
  });

  win.assign("refresh", function () {
    for (var i = 0; i < 8; i++) {
      var element = Game.hero.data.bar[i];
      var button = buttons[i];
      var text = buttonTexts[i];
      button.disabled = false;
      text.disabled = false;

      if (element) {
        var id = element.id;
        var type = element.type;
        if (type == "skill") {
          var skill = Game.skills[id];
          button.style.backgroundImage = "url(\"" + skill.icon.src + "\")";
          text.textContent = skill.data.cost;
        } else if (type == "item") {
          var item = Game.items[id];
          button.style.backgroundImage = "url(\"" + item.icon.src + "\")";
          if (Game.hero.data.items[id]) {
            text.textContent = Game.hero.data.items[id];
          } else {
            text.textContent = "0";
            button.disabled = true;
            text.disabled = true;
          }
        }
      } else {
        // empty bar element
        text.textContent = "";
        button.style.backgroundImage = "";
      }
    }

    interfaceWindowMap.textContent = Game.area.map.data.name;
  });

  interfaceWindowMenu.addEventListener("click", function (event) {
    Game.windows.sysmenu.show();
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var win = Game.windows.inventory = Game.Window.create("inventoryWindow");

  win.html = "\n    <div class=\"window-box\">\n      <div id=\"inventoryWindowItemBar\">\n\n        <button id=\"inventoryWindowClose\" class=\"brownButton\">关闭</button>\n        <button id=\"inventoryWindowStatus\" class=\"brownButton\">状态</button>\n\n        <button id=\"inventoryWindowAll\" class=\"brownButton\">全部</button>\n        <button id=\"inventoryWindowWeapon\" class=\"brownButton\">武器</button>\n        <button id=\"inventoryWindowArmor\" class=\"brownButton\">护甲</button>\n        <button id=\"inventoryWindowPotion\" class=\"brownButton\">药水</button>\n        <button id=\"inventoryWindowMaterial\" class=\"brownButton\">材料</button>\n        <button id=\"inventoryWindowBook\" class=\"brownButton\">书籍</button>\n        <button id=\"inventoryWindowMisc\" class=\"brownButton\">其他</button>\n      </div>\n\n      <span id=\"inventoryWindowGold\"></span>\n\n      <div style=\"overflow: auto; height: 310px;\">\n        <table border=\"0\">\n          <thead>\n            <tr>\n              <td style=\"width: 40px; text-align: center;\"></td>\n              <td style=\"width: 120px;\"></td>\n              <td style=\"width: 30px;\"></td>\n              <td style=\"width: 30px;\"></td>\n              <td></td>\n              <td style=\"width: 60px;\"></td>\n            </tr>\n          </thead>\n          <tbody id=\"inventoryWindowTable\"></tbody>\n        </table>\n      </div>\n    </div>\n  ";

  win.css = "\n\n    #inventoryWindowItemBar {\n      height: 50px;\n    }\n\n    #inventoryWindowItemBar > button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      margin-left: 5px;\n      margin-right: 5px;\n      margin-top: 0px;\n      margin-bottom: 5px;\n    }\n\n    #inventoryWindowClose {\n      float: right;\n    }\n\n    #inventoryWindowStatus {\n      float: right;\n    }\n\n    .inventoryWindow table {\n      width: 100%;\n    }\n\n    .inventoryWindow table button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n    }\n\n    #inventoryWindowTable tr:nth-child(odd) {\n      background-color: rgba(192, 192, 192, 0.6);\n    }\n\n    #inventoryWindowGold {\n      position: absolute;\n      right: 100px;\n      bottom: 10px;\n      font-size: 20px;\n      color: black;\n      font-weight: bold;\n    }\n  ";

  var inventoryWindowClose = win.querySelector("button#inventoryWindowClose");
  var inventoryWindowStatus = win.querySelector("button#inventoryWindowStatus");

  var inventoryWindowAll = win.querySelector("button#inventoryWindowAll");
  var inventoryWindowWeapon = win.querySelector("button#inventoryWindowWeapon");
  var inventoryWindowArmor = win.querySelector("button#inventoryWindowArmor");
  var inventoryWindowPotion = win.querySelector("button#inventoryWindowPotion");
  var inventoryWindowMaterial = win.querySelector("button#inventoryWindowMaterial");
  var inventoryWindowBook = win.querySelector("button#inventoryWindowBook");
  var inventoryWindowMisc = win.querySelector("button#inventoryWindowMisc");

  var inventoryWindowGold = win.querySelector("span#inventoryWindowGold");
  var inventoryWindowTable = win.querySelector("#inventoryWindowTable");

  inventoryWindowClose.addEventListener("click", function (event) {
    win.hide();
  });

  inventoryWindowStatus.addEventListener("click", function (event) {
    win.hide();
    Game.windows.status.open();
  });

  win.whenUp(["tab"], function () {
    setTimeout(function () {
      win.hide();
      Game.windows.status.open();
    }, 20);
  });

  inventoryWindowAll.addEventListener("click", function (event) {
    win.open();
  });

  inventoryWindowWeapon.addEventListener("click", function (event) {
    win.open("sword|spear|bow");
  });

  inventoryWindowArmor.addEventListener("click", function (event) {
    win.open("head|body|feet");
  });

  inventoryWindowPotion.addEventListener("click", function (event) {
    win.open("potion");
  });

  inventoryWindowMaterial.addEventListener("click", function (event) {
    win.open("material");
  });

  inventoryWindowBook.addEventListener("click", function (event) {
    win.open("book|scroll|letter");
  });

  inventoryWindowMisc.addEventListener("click", function (event) {
    win.open("misc");
  });

  var lastFilter = null;
  var lastSelect = -1;

  win.assign("open", function (filter, select) {

    if (typeof select == "undefined") {
      select = -1;
    }

    lastFilter = filter;
    lastSelect = select;

    var defaultColor = "white";
    var activeColor = "yellow";

    inventoryWindowAll.style.color = defaultColor;
    inventoryWindowWeapon.style.color = defaultColor;
    inventoryWindowArmor.style.color = defaultColor;
    inventoryWindowPotion.style.color = defaultColor;
    inventoryWindowMaterial.style.color = defaultColor;
    inventoryWindowBook.style.color = defaultColor;
    inventoryWindowMisc.style.color = defaultColor;

    if (filter == null) {
      inventoryWindowAll.style.color = activeColor;
    } else if (filter.match(/sword/)) {
      inventoryWindowWeapon.style.color = activeColor;
    } else if (filter.match(/head/)) {
      inventoryWindowArmor.style.color = activeColor;
    } else if (filter.match(/potion/)) {
      inventoryWindowPotion.style.color = activeColor;
    } else if (filter.match(/material/)) {
      inventoryWindowMaterial.style.color = activeColor;
    } else if (filter.match(/book/)) {
      inventoryWindowBook.style.color = activeColor;
    } else if (filter.match(/misc/)) {
      inventoryWindowMisc.style.color = activeColor;
    }

    inventoryWindowGold.textContent = Game.hero.data.gold + "G";

    var table = "";
    var index = 0;
    var ids = Object.keys(Game.hero.data.items);
    ids.sort();
    ids.forEach(function (itemId) {
      var itemCount = Game.hero.data.items[itemId];
      var item = Game.items[itemId];
      var equipment = null;

      Sprite.each(Game.hero.data.equipment, function (element, key) {
        if (element == item.id) equipment = key;
      });

      if (filter && filter.indexOf(item.data.type) == -1) return;

      var line = "";

      if (select == index) {
        line += "<tr style=\"background-color: green;\">\n";
      } else {
        line += "<tr>\n";
      }

      if (item.icon) {
        line += "  <td style=\"text-align: center;\"><img alt=\"\" src=\"" + item.icon.src + "\"></td>\n";
      } else {
        line += "  <td> </td>\n";
      }
      line += "  <td>" + (equipment ? "*" : "") + item.data.name + "</td>\n";
      line += "  <td style=\"text-align: center;\">" + item.data.value + "G</td>\n";
      line += "  <td style=\"text-align: center;\">" + itemCount + "</td>\n";
      line += "  <td>" + item.data.description + "</td>\n";
      line += "  <td><button data-id=\"" + itemId + "\" class=\"brownButton\">操作</button></td>\n";
      line += "</tr>\n";
      table += line;
      index++;
    });

    inventoryWindowTable.innerHTML = table;
    win.show();
  });

  win.whenUp(["enter"], function () {
    var buttons = inventoryWindowTable.querySelectorAll("button");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    var count = inventoryWindowTable.querySelectorAll("button").length;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(lastFilter, 0);
      } else if (key == "up") {
        win.open(lastFilter, count - 1);
      }
    } else {
      if (key == "down") {
        var select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(lastFilter, select);
      } else if (key == "up") {
        var select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(lastFilter, select);
      }
    }
  });

  inventoryWindowTable.addEventListener("click", function (event) {
    var itemId = event.target.getAttribute("data-id");
    if (itemId && Game.hero.data.items.hasOwnProperty(itemId)) {
      (function () {
        var item = Game.items[itemId];
        var itemCount = Game.hero.data.items[itemId];
        var equipment = null;

        Sprite.each(Game.hero.data.equipment, function (element, key) {
          if (element == item.id) equipment = key;
        });

        var options = {};
        if (item.data.type.match(/potion/)) {
          options["使用"] = "use";
          options["快捷键"] = "shortcut";
        } else if (item.data.type.match(/sword|spear|bow|head|body|feet|neck|ring/)) {
          if (equipment) options["卸下"] = "takeoff";else options["装备"] = "puton";
        } else if (item.data.type.match(/book/)) {
          options["阅读"] = "read";
        }

        options["丢弃"] = "drop";

        Game.choice(options).then(function (choice) {
          switch (choice) {
            case "puton":
              var type = item.data.type;
              if (type.match(/sword|spear|bow/)) {
                type = "weapon";
              }
              Game.hero.data.equipment[type] = item.id;
              return win.open(lastFilter);
              break;
            case "takeoff":
              if (item.data.type.match(/sword|spear|bow/)) Game.hero.data.equipment.weapon = null;else Game.hero.data.equipment[item.data.type] = null;
              return win.open(lastFilter);
              break;
            case "use":
              if (item.heroUse) {
                item.heroUse();
              }
              break;
            case "read":
              if (item.heroUse) {
                item.heroUse();
              }
              break;
            case "drop":
              if (equipment) {
                Game.hero.data.equipment[equipment] = null;
              }

              Game.addBag(Game.hero.x, Game.hero.y).then(function (bag) {
                if (bag.inner.hasOwnProperty(itemId)) {
                  bag.inner[itemId] += itemCount;
                } else {
                  bag.inner[itemId] = itemCount;
                }
              });

              delete Game.hero.data.items[itemId];

              Game.hero.data.bar.forEach(function (element, index, array) {
                if (element && element.id == itemId) {
                  array[index] = null;
                }
              });

              Game.windows.interface.refresh();
              return win.open(lastFilter);
              break;
            case "shortcut":
              Game.choice({
                1: 0,
                2: 1,
                3: 2,
                4: 3,
                5: 4,
                6: 5,
                7: 6,
                8: 7
              }, function (choice) {
                if (Number.isFinite(choice) && choice >= 0) {
                  Game.hero.data.bar[choice] = {
                    id: item.id,
                    type: "item"
                  };
                  Game.windows.interface.refresh();
                }
              });
              break;
          }
        });
      })();
    }
  });

  win.whenUp(["esc"], function () {
    setTimeout(function () {
      win.hide();
    }, 20);
  });

  win.whenUp(["left", "right"], function (key) {
    if (key == "right") {
      var filter = lastFilter;
      if (filter == null) {
        filter = "sword|spear|bow";
      } else if (filter.match(/sword/)) {
        filter = "head|body|feet";
      } else if (filter.match(/head/)) {
        filter = "potion";
      } else if (filter.match(/potion/)) {
        filter = "material";
      } else if (filter.match(/material/)) {
        filter = "book|scroll|letter";
      } else if (filter.match(/book/)) {
        filter = "misc";
      } else if (filter.match(/misc/)) {
        filter = null;
      }
      win.open(filter, -1);
    } else if (key == "left") {
      var filter = lastFilter;
      if (filter == null) {
        filter = "misc";
      } else if (filter.match(/sword/)) {
        filter = null;
      } else if (filter.match(/head/)) {
        filter = "sword|spear|bow";
      } else if (filter.match(/potion/)) {
        filter = "head|body|feet";
      } else if (filter.match(/material/)) {
        filter = "potion";
      } else if (filter.match(/book/)) {
        filter = "material";
      } else if (filter.match(/misc/)) {
        filter = "book|scroll|letter";
      }
      win.open(filter, -1);
    }
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var loadingIconSrc = "data:image/svg+xml;base64," + window.btoa("\n  <svg id=\"loadingIcon\" width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\">\n    <circle cx=\"50\" cy=\"50\" r=\"50\" fill=\"#808080\" />\n    <path d=\"M50,50 h-40 a40,40 0 1,0 40,-40 z\" fill=\"white\" />\n    <path d=\"M49,49 h-30 a30,30 0 1,0 30,-30 z\" fill=\"#808080\" />\n  </svg>");

  var win = Game.windows.loading = Game.Window.create("loadingWindow");

  win.html = "\n    <div id=\"loadingWindowBox\">\n      <img id=\"loadingWindowLoadingIcon\" src=\"" + loadingIconSrc + "\" alt=\"loading\">\n      <br>\n      <label>请稍等...<small id=\"loadingWindowProgress\"></small></label>\n      <br>\n      <h5 id=\"loadingWindowText\"></h5>\n    </div>\n  ";

  win.css = "\n    .loadingWindow {\n      text-align: center;\n    }\n\n    #loadingWindowLoadingIcon {\n      width: 50px;\n      height: 50px;\n      margin-top: 15px;\n      margin-bottom: 10px;\n      animation: loadingAnimation 1s linear infinite;\n    }\n\n    @keyframes loadingAnimation\n    {\n      0%   { transform: rotate(0deg); }\n      100% { transform: rotate(360deg); }\n    }\n\n    #loadingWindowBox {\n      width: 500px;\n      height: 300px;\n      border-radius: 25px;\n      position: fixed;\n      top: 75px;\n      left: 150px;\n      background-color: gray;\n    }\n\n    .loadingWindow label {\n      color: white;\n      font-size: 48px;\n    }\n\n    #loadingWindowText {\n      color: white;\n    }\n  ";

  var loadingWindowProgress = win.querySelector("#loadingWindowProgress");
  var loadingWindowText = win.querySelector("#loadingWindowText");

  // 提示信息
  var text = ["打开游戏菜单之后，游戏是暂停的，你可以在这时思考下战斗策略", "记得出门带着矿工锄和采药铲，或许能从其中赚点小钱", "职业、信仰、技能，都可以任意改变，但是必须付出代价", "你的信仰决定了神对你的祝福，还有某些人或者组织对你的看法", "信仰是可以改变的，不过艾利韦斯的居民并不喜欢总是改变自己信仰的人", "艾利韦斯信仰自由，没有信仰也是一种信仰，但是你享受不到任何神的祝福"];

  win.assign("begin", function () {
    loadingWindowProgress.innerHTML = "";
    // 随机一个提示
    loadingWindowText.textContent = text[Math.floor(Math.random() * text.length)];
    win.show();
  });

  win.assign("update", function (value) {
    loadingWindowProgress.innerHTML = value;
  });

  win.assign("end", function () {
    win.hide();
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var win = Game.windows.main = Game.Window.create("mainWindow");

  win.html = "\n    <div id=\"mainWindowBox\">\n      <h1>Elliorwis</h1>\n      <h4>艾利韦斯</h4>\n      <br>\n      <button id=\"mainWindowContinue\" class=\"brownButton\">继续旅程</button>\n      <br>\n      <button id=\"mainWindowNew\" class=\"brownButton\">新的旅程</button>\n      <br>\n      <button id=\"mainWindowLoad\" class=\"brownButton\">读取进度</button>\n      <br>\n      <button id=\"mainWindowFullscreen\" class=\"brownButton\">全屏</button>\n    </div>\n  ";

  win.css = "\n    #mainWindowBox {\n      text-align: center;\n      height: 412px;\n      background-color: rgba(240, 217, 194, 0.85);\n      border: 20px solid rgba(134, 93, 52, 0.85);\n    }\n\n    #mainWindowFullscreen {\n      position: absolute;\n      left: 640px;\n      top: 30px;\n    }\n\n    .mainWindow h1 {\n      font-size: 60px;\n      margin-bottom: 0;\n    }\n\n    .mainWindow h4 {\n      margin-bottom: 0;\n    }\n\n    .mainWindow button {\n      width: 120px;\n      height: 60px;\n      margin-top: 10px;\n    }\n  ";

  var mainWindowContinue = win.querySelector("#mainWindowContinue");
  var mainWindowNew = win.querySelector("#mainWindowNew");
  var mainWindowLoad = win.querySelector("#mainWindowLoad");
  var mainWindowFullscreen = win.querySelector("#mainWindowFullscreen");

  mainWindowFullscreen.addEventListener("click", function (event) {
    Game.windows.setting.toggle();
  });

  win.on("beforeShow", function () {
    if (!Game.Archive.last()) {
      mainWindowContinue.style.visibility = "hidden";
    } else {
      mainWindowContinue.style.visibility = "visible";
    }
  });

  mainWindowContinue.addEventListener("click", function (event) {
    win.hide();
    setTimeout(function () {
      Game.Archive.load();
    }, 20);
  });

  mainWindowNew.addEventListener("click", function (event) {
    win.hide();
    Game.register.reg();
  });

  mainWindowLoad.addEventListener("click", function (event) {
    win.hide();
    Game.windows.archive.open();
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var win = Game.windows.map = Game.Window.create("mapWindow");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"mapWindowClose\" class=\"brownButton\">关闭</button>\n      <table><tbody><tr><td>\n        <div id=\"mapWindowMap\"></div>\n      </td></tr></tbody></table>\n    </div>\n  ";

  win.css = "\n    .mapWindow table, .mapWindow tbody, .mapWindow tr, .mapWindow td {\n      width: 100%;\n      height: 100%;\n      magrin: 0;\n      padding: 0;\n    }\n\n    .mapWindow {\n      text-align: center;\n    }\n\n    #mapWindowClose {\n      position: absolute;\n      right: 50px;\n      top: 50px;\n      width: 120px;\n      height: 60px;\n      font-size: 16px;\n    }\n\n    #mapWindowMap img, #mapWindowMap canvas {\n      max-width: 700px;\n      max-height: 320px;\n    }\n  ";

  var mapWindowClose = win.querySelector("#mapWindowClose");
  var mapWindowMap = win.querySelector("#mapWindowMap");

  mapWindowClose.addEventListener("click", function (event) {
    Game.windows.map.hide();
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      mapWindowClose.click();
    }, 20);
  });

  win.on("beforeShow", function (event) {
    if (Game.stage && Game.area && Game.area.map) {
      var stage = {
        x: Game.stage.x,
        y: Game.stage.y,
        centerX: Game.stage.centerX,
        centerY: Game.stage.centerY
      };
      Game.stage.x = 0;
      Game.stage.y = 0;
      Game.stage.centerX = 0;
      Game.stage.centerY = 0;
      var canvas = document.createElement("canvas");
      canvas.width = Game.area.map.width;
      canvas.height = Game.area.map.height;
      var context = canvas.getContext("2d");
      Game.stage.draw(context);
      var minimap = document.createElement("canvas");
      minimap.width = Math.floor(canvas.width / 8);
      minimap.height = Math.floor(canvas.height / 8);
      var minimapContext = minimap.getContext("2d");
      minimapContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, minimap.width, minimap.height);
      context = null;
      canvas = null;
      mapWindowMap.innerHTML = "";
      mapWindowMap.appendChild(minimap);
      Game.stage.x = stage.x;
      Game.stage.y = stage.y;
      Game.stage.centerX = stage.centerX;
      Game.stage.centerY = stage.centerY;
    }
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var win = Game.windows.over = Game.Window.create("overWindow");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"overWindowClose\" class=\"brownButton\">返回主菜单</button>\n      <table><tbody><tr><td>\n        <div>\n          <h1 id=\"overWindowMessage\"></h1>\n          <h2 id=\"overWindowReason\"></h2>\n        </div>\n      </td></tr></tbody></table>\n    </div>\n  ";

  win.css = "\n    .overWindow table, .overWindow tbody, .overWindow tr, .overWindow td {\n      width: 100%;\n      height: 100%;\n      magrin: 0;\n      padding: 0;\n    }\n\n    .overWindow {\n      text-align: center;\n    }\n\n    #overWindowClose {\n      position: absolute;\n      right: 50px;\n      top: 50px;\n      width: 120px;\n      height: 60px;\n      font-size: 16px;\n    }\n\n    #overWindowMap img, #overWindowMap canvas {\n      max-width: 700px;\n      max-height: 320px;\n    }\n  ";

  var overWindowMessage = win.querySelector("#overWindowMessage");
  var overWindowReason = win.querySelector("#overWindowReason");

  var deadText = ["不幸的事情终于发生了……即便你的内心曾对神灵祈祷", "不幸的事情终于发生了……你就知道自己今天不应该穿白色的袜子", "不幸的事情终于发生了……明明还没有体验过天伦之乐", "不幸的事情终于发生了……你的墓碑上写着：“下次不能随便踢小动物”", "不幸的事情终于发生了……你感觉自己的身体变轻了…轻了…轻了…", "不幸的事情终于发生了……你摸了摸自己的脖子，似乎找不到脑袋了，于是你一赌气", "不幸的事情终于发生了……你的墓碑上写着：“下次再也不把治疗药水借给别人了”", "不幸的事情终于发生了……曾经有一瓶治疗药水摆在你面前，而你没有珍惜", "不幸的事情终于发生了……你回想起曾经在广阔的原野上尽情的奔跑", "不幸的事情终于发生了……不过好消息是你再也不用减肥了", "不幸的事情终于发生了……下次在冒险前一定要吃饱饭"];

  win.assign("open", function (reason) {
    if (reason) {
      overWindowReason.textContent = reason;
    } else {
      overWindowReason.innerHTML = "";
    }
    overWindowMessage.textContent = deadText[Math.floor(Math.random() * deadText.length)];
    Game.windows.stage.hide();
    Game.windows.interface.hide();
    win.show();
  });

  overWindowClose.addEventListener("click", function (event) {
    Game.clearStage();
    win.hide();
    Game.windows.main.show();
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var win = Game.windows.pickup = Game.Window.create("pickupWindow");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"pickupWindowClose\" class=\"brownButton\">关闭</button>\n      <button id=\"pickupWindowAll\" class=\"brownButton\">A 全部</button>\n      <table border=\"0\">\n        <thead>\n          <tr>\n            <td style=\"width: 40px;\"></td>\n            <td style=\"width: 120px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td></td>\n            <td style=\"width: 60px;\"></td>\n          </tr>\n        </thead>\n        <tbody id=\"pickupWindowTable\"></tbody>\n      </table>\n    </div>\n  ";

  win.css = "\n\n    #pickupWindowTable tr:nth-child(odd) {\n      background-color: rgba(192, 192, 192, 0.6);\n    }\n\n    .pickupWindow table {\n      width: 100%;\n    }\n\n    .pickupWindow button {\n      width: 60px;\n      height: 40px;\n      font-size: 16;\n    }\n\n    #pickupWindowClose {\n\n    }\n\n    #pickupWindowAll {\n\n    }\n  ";

  var pickupWindowClose = win.querySelector("button#pickupWindowClose");
  var pickupWindowAll = win.querySelector("button#pickupWindowAll");
  var pickupWindowTable = win.querySelector("#pickupWindowTable");

  var currentItemObj = null;
  var lastSelect = -1;

  pickupWindowClose.addEventListener("click", function (event) {
    Game.windows.pickup.hide();
  });

  pickupWindowAll.addEventListener("click", function (event) {
    var itemObj = currentItemObj;
    if (itemObj && itemObj.inner && Object.keys(itemObj.inner).length > 0) {
      Sprite.each(itemObj.inner, function (itemCount, itemId, inner) {
        if (itemId == "gold") {
          Game.hero.data.gold += itemCount;
        } else {
          if (Game.hero.data.items[itemId]) {
            Game.hero.data.items[itemId] += itemCount;
          } else {
            Game.hero.data.items[itemId] = itemCount;
          }
        }
        delete inner[itemId];
      });
      Game.windows.pickup.open(itemObj);
    }
  });

  win.whenUp(["a", "A"], function (key) {
    pickupWindowAll.click();
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      win.hide();
    }, 20);
  });

  win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8", "9"], function (key) {
    var buttons = pickupWindowTable.querySelectorAll("button");
    for (var i = 0, len = buttons.length; i < len; i++) {
      var buttonIndex = buttons[i].getAttribute("data-index");
      if (buttonIndex) {
        if (buttonIndex == key) {
          buttons[i].click();
        }
      }
    }
  });

  win.assign("open", function (itemObj, select) {
    if (typeof select == "undefined") {
      select = -1;
    }

    lastSelect = select;

    if (!itemObj.inner || Object.keys(itemObj.inner).length <= 0) {

      if (Game.area.bags.has(itemObj)) {
        itemObj.erase();
        Game.area.bags.delete(itemObj);
      }

      if (Game.area.items.has(itemObj)) {
        itemObj.erase();
        Game.area.items.delete(itemObj);
      }

      Game.windows.pickup.hide();
      return;
    }

    currentItemObj = itemObj;

    var index = 1;
    var table = "";
    Sprite.each(itemObj.inner, function (itemCount, itemId, inner) {
      var item = Game.items[itemId];

      var line = "";

      if (select == index - 1) {
        line += "<tr style=\"background-color: green;\">\n";
      } else {
        line += "<tr>\n";
      }

      if (item.icon) {
        line += "  <td style=\"text-align: center;\"><img alt=\"\" src=\"" + item.icon.src + "\"></td>\n";
      } else {
        line += "  <td> </td>\n";
      }
      line += "  <td>" + item.data.name + "</td>\n";
      line += "  <td style=\"text-align: center;\">" + item.data.value + "G</td>\n";
      line += "  <td style=\"text-align: center;\">" + itemCount + "</td>\n";
      line += "  <td>" + item.data.description + "</td>\n";
      line += "  <td><button data-id=\"" + itemId + "\" data-index=\"" + index + "\" class=\"brownButton\">" + (index <= 9 ? index : "") + " 拿取</button></td>\n";

      line += "</tr>\n";
      table += line;
      index++;
    });

    pickupWindowTable.innerHTML = table;
    Game.windows.pickup.show();
  });

  win.whenUp(["enter"], function () {
    var buttons = pickupWindowTable.querySelectorAll("button");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    var count = pickupWindowTable.querySelectorAll("button").length;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(currentItemObj, 0);
      } else if (key == "up") {
        win.open(currentItemObj, count - 1);
      }
    } else {
      if (key == "down") {
        var select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(currentItemObj, select);
      } else if (key == "up") {
        var select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(currentItemObj, select);
      }
    }
  });

  pickupWindowTable.addEventListener("click", function (event) {
    var itemId = event.target.getAttribute("data-id");
    if (itemId && currentItemObj.inner && currentItemObj.inner.hasOwnProperty(itemId)) {
      var itemCount = currentItemObj.inner[itemId];
      if (itemId == "gold") {
        Game.hero.data.gold += itemCount;
      } else {
        if (Game.hero.data.items.hasOwnProperty(itemId)) {
          Game.hero.data.items[itemId] += itemCount;
        } else {
          Game.hero.data.items[itemId] = itemCount;
        }
      }
      delete currentItemObj.inner[itemId];
      win.open(currentItemObj);
    }
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var win = Game.windows.quest = Game.Window.create("questWindow");

  win.html = "\n    <div class=\"window-box\">\n      <div id=\"questWindowItemBar\">\n        <button id=\"questWindowClose\" class=\"brownButton\">关闭</button>\n        <button id=\"questWindowCurrent\" class=\"brownButton\">当前任务</button>\n        <button id=\"questWindowPast\" class=\"brownButton\">已完成</button>\n      </div>\n      <div id=\"questWindowTable\"></div>\n    </div>\n  ";

  win.css = "\n    #questWindowTable {\n      width: 100%;\n      overflow-y: auto;\n      height: 320px;\n    }\n\n    .questWindowItem {\n      border: 1px solid gray;\n      border-radius: 10px;\n      margin: 10px 10px;\n    }\n\n    .questWindowItem > button {\n      width: 100px;\n      height: 40px;\n      border-radius: 5px;\n    }\n\n    #questWindowItemBar button {\n      width: 100px;\n      height: 30px;\n      font-size: 16px;\n      margin-bottom: 5px;\n    }\n\n    #questWindowClose {\n      float: right;\n    }\n  ";

  var questWindowClose = win.querySelector("#questWindowClose");
  var questWindowCurrent = win.querySelector("#questWindowCurrent");
  var questWindowPast = win.querySelector("#questWindowPast");
  var questWindowTable = win.querySelector("#questWindowTable");

  questWindowClose.addEventListener("click", function () {
    win.hide();
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      questWindowClose.click();
    }, 20);
  });

  questWindowCurrent.addEventListener("click", function () {
    win.hide();
    win.current();
  });

  questWindowPast.addEventListener("click", function () {
    win.hide();
    win.past();
  });

  win.assign("current", function () {

    questWindowCurrent.disabled = true;
    questWindowPast.disabled = false;

    var table = "";
    var list = Game.hero.data.currentQuest;
    list.forEach(function (quest) {

      var complete = Game.Quest.isComplete(quest);

      var line = "<div class=\"questWindowItem\">\n";
      line += "  <label style=\"font-size: 20px; margin: 10px;\">" + quest.name + (complete ? "[已完成]" : "[未完成]") + "</label>\n";
      line += "  <div style=\"margin: 10px;\">简介：" + quest.description + "</div>\n";

      if (quest.reward) {
        line += "  <div style=\"margin: 10px;\">任务奖励：";
        if (quest.reward.gold) {
          line += "<label style=\"margin-right: 20px;\">金币：" + quest.reward.gold + "</label>";
        }
        if (quest.reward.exp) {
          line += "<label style=\"margin-right: 20px;\">经验：" + quest.reward.exp + "</label>";
        }
        line += "  </div>";
      }

      if (quest.target && quest.target.kill == "kill") {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = quest.target.kill[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var k = _step.value;

            line += "<div style=\"margin: 10px;\">" + k.name + "：" + k.current + " / " + t.need + "</div>";
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      line += "  <label style=\"margin: 10px;\">给予人：" + quest.fromMap + " 的 " + quest.fromName + "</label>\n";
      line += "  <label style=\"margin: 10px;\">交付人：" + quest.toMap + " 的 " + quest.toName + "</label>\n";
      line += "</div>\n";
      table += line;
    });

    if (table.length <= 0) {
      table = "<div><label>没有正在进行的任务</label></div>";
    }

    questWindowTable.innerHTML = table;
    win.show();
  });

  win.assign("past", function () {

    questWindowCurrent.disabled = false;
    questWindowPast.disabled = true;

    var table = "";
    var list = Game.hero.data.completeQuest;
    list.forEach(function (quest) {

      var line = "<div class=\"questWindowItem\">\n";
      line += "  <label style=\"font-size: 20px; margin: 10px;\">" + quest.name + "[已完成]</label>\n";
      line += "  <div style=\"margin: 10px;\">简介：" + quest.description + "</div>\n";

      if (quest.reward) {
        line += "  <div style=\"margin: 10px;\">任务奖励：";
        if (quest.reward.gold) {
          line += "<label style=\"margin-right: 20px;\">金币：" + quest.reward.gold + "</label>";
        }
        if (quest.reward.exp) {
          line += "<label style=\"margin-right: 20px;\">经验：" + quest.reward.exp + "</label>";
        }
        line += "  </div>";
      }

      if (quest.target && quest.target.type == "kill") {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = quest.target.kill[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var k = _step2.value;

            line += "<div style=\"margin: 10px;\">" + k.name + "：" + k.current + " / " + t.need + "</div>";
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      line += "  <label style=\"margin: 10px;\">给予人：" + quest.fromMap + " 的 " + quest.fromName + "</label>\n";
      line += "  <label style=\"margin: 10px;\">交付人：" + quest.toMap + " 的 " + quest.toName + "</label>\n";
      line += "</div>\n";
      table += line;
    });

    if (table.length <= 0) {
      table = "<div><label>没有已完成任务</label></div>";
    }

    questWindowTable.innerHTML = table;
    win.show();
  });

  questWindowTable.addEventListener("click", function (event) {
    var id = event.target.getAttribute("data-id");
    if (id) {
      if (type == "remove") {
        Game.Archive.remove(id);
        win.open();
      } else if (type == "load") {
        Game.Archive.load(id);
        win.hide();
      }
    }
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var win = Game.windows.register = Game.Window.create("registerWindow");

  win.html = "\n    <div id=\"registerWindowContainer\">\n\n      <div id=\"registerWindowDisplaySelect\">\n\n        <div>\n          <label>\n          性别\n          </label>\n          <select data-type=\"sex\">\n            <option value=\"male\">男性</option>\n            <option value=\"female\">女性</option>\n          </select>\n        </div>\n\n        <div>\n          <label>\n          皮肤\n          </label>\n          <select data-type=\"body\">\n            <option value=\"light\">粉白</option>\n            <option value=\"dark\">深色</option>\n            <option value=\"dark2\">更深</option>\n            <option value=\"tanned\">黄白</option>\n            <option value=\"tanned2\">黄灰</option>\n          </select>\n        </div>\n\n        <div>\n          <label>\n          眼睛\n          </label>\n          <select data-type=\"eyes\">\n            <option value=\"blue\">蓝色</option>\n            <option value=\"brown\">棕色</option>\n            <option value=\"gray\">灰色</option>\n            <option value=\"green\">绿色</option>\n            <option value=\"orange\">橙色</option>\n            <option value=\"purple\">紫色</option>\n            <option value=\"red\">红色</option>\n            <option value=\"yellow\">黄色</option>\n          </select>\n        </div>\n\n        <div id=\"customMaleHair\">\n          <label>\n          头发\n          </label>\n          <select data-type=\"malehair\">\n            <option value=\"\">无</option>\n            <option value=\"bedhead\">Bedhead</option>\n            <option value=\"long\">Long</option>\n            <option value=\"longhawk\">Longhawk</option>\n            <option value=\"messy1\">messy1</option>\n            <option value=\"messy2\">messy2</option>\n            <option value=\"mohawk\">Mohawk</option>\n            <option value=\"page\">Page</option>\n            <option value=\"parted\">Parted</option>\n            <option value=\"plain\">Plain</option>\n            <option value=\"shorthawk\">Shorthawk</option>\n          </select>\n        </div>\n\n        <div id=\"customFemaleHair\" style=\"display: none;\">\n          <label>\n          头发\n          </label>\n          <select data-type=\"femalehair\">\n            <option value=\"\">无</option>\n            <option value=\"bangs\">bangs</option>\n            <option value=\"bangslong\">bangslong</option>\n            <option value=\"bangslong2\">bangslong2</option>\n            <option value=\"bunches\">bunches</option>\n            <option value=\"loose\">loose</option>\n            <option value=\"pixie\">pixie</option>\n            <option value=\"ponytail\">ponytail</option>\n            <option value=\"ponytail2\">ponytail2</option>\n            <option value=\"princess\">princess</option>\n            <option value=\"shoulderl\">shoulderl</option>\n            <option value=\"shoulderr\">shoulderr</option>\n            <option value=\"swoop\">swoop</option>\n            <option value=\"unkempt\">unkempt</option>\n          </select>\n        </div>\n\n        <div>\n          <label>\n          发色\n          </label>\n          <select data-type=\"haircolor\">\n            <option value=\"black\">Black</option>\n            <option value=\"blonde\">Blonde</option>\n            <option value=\"blonde2\">blonde2</option>\n            <option value=\"blue\">blue</option>\n            <option value=\"blue2\">blue2</option>\n            <option value=\"brown\">brown</option>\n            <option value=\"brown2\">brown2</option>\n            <option value=\"brunette\">brunette</option>\n            <option value=\"brunette2\">brunette2</option>\n            <option value=\"dark-blonde\">dark-blonde</option>\n            <option value=\"gold\">gold</option>\n            <option value=\"gray\">gray</option>\n            <option value=\"gray2\">gray2</option>\n            <option value=\"green\">green</option>\n            <option value=\"green2\">green2</option>\n            <option value=\"light-blonde\">light-blonde</option>\n            <option value=\"light-blonde2\">light-blonde2</option>\n            <option value=\"pink\">pink</option>\n            <option value=\"pink2\">pink2</option>\n            <option value=\"purple\">purple</option>\n            <option value=\"raven\">raven</option>\n            <option value=\"raven2\">raven2</option>\n            <option value=\"redhead\">redhead</option>\n            <option value=\"redhead2\">redhead2</option>\n            <option value=\"ruby-red\">ruby-red</option>\n            <option value=\"white\">white</option>\n            <option value=\"white-blonde\">white-blonde</option>\n            <option value=\"white-blonde2\">white-blonde2</option>\n            <option value=\"white.centerYan\">white.centerYan</option>\n          </select>\n        </div>\n\n        <div>\n          <label>\n          帽子\n          </label>\n          <select data-type=\"head\">\n            <option value=\"\">无</option>\n            <option value=\"chainhat\">chainhat</option>\n            <option value=\"chain_hood\">chain_hood</option>\n            <option value=\"cloth_hood\">cloth_hood</option>\n            <option value=\"leather_cap\">leather_cap</option>\n            <option value=\"red\">red</option>\n          </select>\n        </div>\n\n        <div>\n          <label>\n          上衣\n          </label>\n          <select data-type=\"shirts\">\n            <option value=\"\">无</option>\n            <option value=\"brown\">brown</option>\n            <option value=\"maroon\">maroon</option>\n            <option value=\"teal\">teal</option>\n            <option value=\"white\">white</option>\n          </select>\n        </div>\n\n        <div>\n          <label>\n          裤子\n          </label>\n          <select data-type=\"pants\">\n            <option value=\"\">无</option>\n            <option value=\"magenta\">magenta</option>\n            <option value=\"red\">red</option>\n            <option value=\"teal\">teal</option>\n            <option value=\"white\">white</option>\n          </select>\n        </div>\n\n        <div>\n          <label>\n          鞋子\n          </label>\n          <select  data-type=\"shoes\">\n            <option value=\"\">无</option>\n            <option value=\"black\">black</option>\n            <option value=\"brown\">brown</option>\n            <option value=\"maroon\">maroon</option>\n          </select>\n        </div>\n\n        <div>\n          <label>\n          头盔\n          </label>\n          <select data-type=\"armorhelms\">\n            <option value=\"\">无</option>\n            <option value=\"golden\">黄金</option>\n            <option value=\"metal\">白银</option>\n          </select>\n        </div>\n\n        <div>\n          <label>\n          胸甲\n          </label>\n          <select data-type=\"armorchest\">\n            <option value=\"\">无</option>\n            <option value=\"golden\">黄金</option>\n            <option value=\"metal\">白银</option>\n          </select>\n        </div>\n\n        <div>\n          <label>\n          臂甲\n          </label>\n          <select data-type=\"armorarm\">\n            <option value=\"\">无</option>\n            <option value=\"golden\">黄金</option>\n            <option value=\"metal\">白银</option>\n          </select>\n        </div>\n\n        <div>\n          <label>\n          腿甲\n          </label>\n          <select data-type=\"armorlegs\">\n            <option value=\"\">无</option>\n            <option value=\"golden\">黄金</option>\n            <option value=\"metal\">白银</option>\n          </select>\n        </div>\n\n        <div>\n          <label>\n          足甲\n          </label>\n          <select data-type=\"armorfeet\">\n            <option value=\"\">无</option>\n            <option value=\"golden\">黄金</option>\n            <option value=\"metal\">白银</option>\n          </select>\n        </div>\n\n      </div><!--registerWindowDisplaySelect-->\n\n      <hr>\n\n      <div id=\"registerWindowPersonal\">\n\n        <div>\n          <label>\n          信仰\n          </label>\n          <select id=\"registerWindowBeliefChoice\" data-type=\"belief\">\n            <option value=\"None\">无信仰</option>\n            <option value=\"Elen\">艾琳 - 知识女神</option>\n            <option value=\"Enlon\">恩朗 - 死亡主宰</option>\n            <option value=\"Minare\">密娜 - 丰收女神</option>\n            <option value=\"Achiel\">阿切奥 - 保护之神</option>\n            <option value=\"Racha\">拉克 - 魔法女神</option>\n            <option value=\"Aestor\">阿斯托 - 盗贼之神</option>\n            <option value=\"Hielach\">赫拉克 - 财富之神</option>\n            <option value=\"Alik\">阿丽克 - 治愈女神</option>\n            <option value=\"Amarien\">阿玛恩 - 力量之神</option>\n          </select>\n          <div id=\"registerWindowBelief\"></div>\n        </div>\n\n        <div>\n          <label>\n          职业\n          </label>\n          <select id=\"registerWindowClassChoice\" data-type=\"class\">\n            <option value=\"warrior\">战士</option>\n            <option value=\"archer\">弓箭手</option>\n            <option value=\"wizard\">魔法师</option>\n            <option value=\"priest\">牧师</option>\n            <option value=\"bard\">吟游诗人</option>\n            <option value=\"thief\">盗贼</option>\n            <option value=\"business\">商人</option>\n          </select>\n          <div id=\"registerWindowClass\"></div>\n        </div>\n\n        <div style=\"padding-top: 20px;\">\n          <input id=\"registerHeroName\" placeholder=\"名字\" type=\"text\">\n        </div>\n\n      </div><!--registerWindowPersonal-->\n\n      <div style=\"padding-bottom: 20px; padding-top: 10px;\">\n        <button id=\"registerWindowSubmit\" class=\"brownButton\">完成</button>\n        <button id=\"registerWindowBack\" class=\"brownButton\">返回</button>\n      </div>\n\n    </div>\n\n    <div id=\"registerWindowDisplay\">\n      <label id=\"loading\">正在载入预览</label>\n      <br>\n      <canvas width=\"64\" height=\"250\"></canvas>\n    </div>\n  ";

  win.css = "\n\n    #registerWindowDisplay {\n      position: fixed;\n      height: 250px;\n      width: 64px;\n      left: 80px;\n      top: 25px;\n      transform: scale(1.4);\n      -webkit-transform: scale(1.4);\n      transform-origin: left top 0;\n      -webkit-transform-origin: left top 0;\n    }\n\n    #registerWindowContainer {\n       overflow-x: hidden;\n       overflow-y: scroll;\n       left: 200px;\n       top: 20px;\n       width: 620px;\n       height: 410px;\n       position: fixed;\n    }\n\n    #registerWindowBelief, #registerWindowClass {\n      text-align: center;\n      width: 100%;\n    }\n\n    #registerWindowSubmit, #registerWindowBack {\n      width: 100px;\n      height: 60px;\n    }\n\n    .registerWindow {\n      text-align: center;\n      height: 412px;\n      background-color: rgba(240, 217, 194, 0.85);\n      border: 20px solid rgba(134, 93, 52, 0.85);\n    }\n\n    .registerWindow hr {\n      width: 90%;\n    }\n\n    .registerWindow input {\n      width: 240px;\n      height: 40px;\n      -webkit-border-radius: 5px;\n      -moz-border-radius: 5px;\n      border-radius: 5px;\n      text-align: center;\n      font-size: 16px;\n      background-color: #d5ab63;\n      margin: 10px;\n    }\n\n    .registerWindow label {\n      font-size: 20px;\n      color: white;\n    }\n\n    .registerWindow select {\n      -webkit-appearance: none;\n      -moz-appearance: none;\n      appearance: none;\n      width: 200px;\n      height: 40px;\n      -webkit-border-radius: 5px;\n      -moz-border-radius: 5px;\n      border-radius: 5px;\n      text-align: center;\n      font-size: 16px;\n      background-color: #d5ab63;\n      margin: 10px;\n    }\n  ";

  var registerWindowSubmit = win.querySelector("#registerWindowSubmit");
  var registerWindowBack = win.querySelector("#registerWindowBack");

  registerWindowSubmit.addEventListener("click", function () {
    Game.register.submit();
  });

  registerWindowBack.addEventListener("click", function () {
    win.hide();
    Game.windows.main.show();
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var win = Game.windows.sell = Game.Window.create("sellWindow");

  win.html = "\n  <div class=\"window-box\">\n    <div id=\"sellWindowItemBar\">\n\n      <button id=\"sellWindowClose\" class=\"brownButton\">关闭</button>\n      <button id=\"sellWindowBuy\" class=\"brownButton\">买入</button>\n\n      <button id=\"sellWindowAll\" class=\"brownButton\">全部</button>\n      <button id=\"sellWindowWeapon\" class=\"brownButton\">武器</button>\n      <button id=\"sellWindowArmor\" class=\"brownButton\">护甲</button>\n      <button id=\"sellWindowPotion\" class=\"brownButton\">药水</button>\n      <button id=\"sellWindowMaterial\" class=\"brownButton\">材料</button>\n      <button id=\"sellWindowBook\" class=\"brownButton\">书籍</button>\n      <button id=\"sellWindowMisc\" class=\"brownButton\">其他</button>\n    </div>\n\n    <span id=\"sellWindowGold\"></span>\n\n    <div style=\"overflow: auto; height: 300px;\">\n      <table border=\"0\">\n        <thead>\n          <tr>\n            <td style=\"width: 40px;\"></td>\n            <td style=\"width: 120px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td></td>\n            <td style=\"width: 60px;\"></td>\n          </tr>\n        </thead>\n        <tbody id=\"sellWindowTable\"></tbody>\n      </table>\n    </div>\n  </div>\n  ";

  win.css = "\n\n    #sellWindowTable tr:nth-child(odd) {\n      background-color: rgba(192, 192, 192, 0.6);\n    }\n\n    #sellWindowItemBar > button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      margin-left: 5px;\n      margin-right: 5px;\n      margin-top: 0px;\n      margin-bottom: 5px;\n    }\n\n    #sellWindowClose {\n      float: right;\n    }\n\n    #sellWindowStatus {\n      float: right;\n    }\n\n    .sellWindow table {\n      width: 100%;\n    }\n\n    .sellWindow table button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n    }\n\n    #sellWindowGold {\n      position: absolute;\n      right: 100px;\n      bottom: 30px;\n      font-size: 20px;\n      color: black;\n    }\n  ";

  var sellWindowClose = win.querySelector("button#sellWindowClose");
  var sellWindowBuy = win.querySelector("button#sellWindowBuy");

  var sellWindowAll = win.querySelector("button#sellWindowAll");
  var sellWindowWeapon = win.querySelector("button#sellWindowWeapon");
  var sellWindowArmor = win.querySelector("button#sellWindowArmor");
  var sellWindowPotion = win.querySelector("button#sellWindowPotion");
  var sellWindowMaterial = win.querySelector("button#sellWindowMaterial");
  var sellWindowBook = win.querySelector("button#sellWindowBook");
  var sellWindowMisc = win.querySelector("button#sellWindowMisc");

  var sellWindowGold = win.querySelector("span#sellWindowGold");
  var sellWindowTable = win.querySelector("#sellWindowTable");

  var lastItems = null;
  var lastFilter = null;
  var lastSelect = -1;

  sellWindowClose.addEventListener("click", function () {
    win.hide();
  });

  sellWindowBuy.addEventListener("click", function () {
    win.hide();
    Game.windows.buy.open(lastItems);
  });

  win.whenUp(["tab"], function () {
    setTimeout(function () {
      win.hide();
      Game.windows.buy.open(lastItems);
    }, 20);
  });

  sellWindowAll.addEventListener("click", function (event) {
    win.open(lastItems, null);
  });

  sellWindowWeapon.addEventListener("click", function (event) {
    win.open(lastItems, "sword|spear|bow");
  });

  sellWindowArmor.addEventListener("click", function (event) {
    win.open(lastItems, "head|body|feet");
  });

  sellWindowPotion.addEventListener("click", function (event) {
    win.open(lastItems, "potion");
  });

  sellWindowMaterial.addEventListener("click", function (event) {
    win.open(lastItems, "material");
  });

  sellWindowBook.addEventListener("click", function (event) {
    win.open(lastItems, "book|scroll|letter");
  });

  sellWindowMisc.addEventListener("click", function (event) {
    win.open(lastItems, "misc");
  });

  win.assign("open", function (items, filter, select) {

    if (typeof select == "undefined") {
      select = -1;
    }

    lastItems = items;
    lastFilter = filter;
    lastSelect = select;

    sellWindowGold.textContent = Game.hero.data.gold + "G";

    var defaultColor = "white";
    var activeColor = "yellow";

    sellWindowAll.style.color = defaultColor;
    sellWindowWeapon.style.color = defaultColor;
    sellWindowArmor.style.color = defaultColor;
    sellWindowPotion.style.color = defaultColor;
    sellWindowMaterial.style.color = defaultColor;
    sellWindowBook.style.color = defaultColor;
    sellWindowMisc.style.color = defaultColor;

    if (filter == null) {
      sellWindowAll.style.color = activeColor;
    } else if (filter.match(/sword/)) {
      sellWindowWeapon.style.color = activeColor;
    } else if (filter.match(/head/)) {
      sellWindowArmor.style.color = activeColor;
    } else if (filter.match(/potion/)) {
      sellWindowPotion.style.color = activeColor;
    } else if (filter.match(/material/)) {
      sellWindowMaterial.style.color = activeColor;
    } else if (filter.match(/book/)) {
      sellWindowBook.style.color = activeColor;
    } else if (filter.match(/misc/)) {
      sellWindowMisc.style.color = activeColor;
    }

    var index = 0;
    var table = "";
    Sprite.each(Game.hero.data.items, function (itemCount, itemId) {
      var item = Game.items[itemId];

      if (filter && filter.indexOf(item.data.type) == -1) return;

      var line = "";

      if (select == index) {
        line += "<tr style=\"background-color: green;\">\n";
      } else {
        line += "<tr>\n";
      }

      if (item.icon) {
        line += "  <td style=\"text-align: center;\"><img alt=\"\" src=\"" + item.icon.src + "\"></td>\n";
      } else {
        line += "  <td> </td>\n";
      }
      line += "  <td>" + item.data.name + "</td>\n";
      line += "  <td style=\"text-align: center;\">" + Math.ceil(item.data.value * 0.8) + "G</td>\n";
      line += "  <td style=\"text-align: center;\">" + itemCount + "</td>\n";
      line += "  <td>" + item.data.description + "</td>\n";
      line += "  <td><button data-id=\"" + itemId + "\" class=\"brownButton\">卖出</button></td>\n";

      line += "</tr>\n";
      table += line;
      index++;
    });

    sellWindowTable.innerHTML = table;
    win.show();
  });

  win.whenUp(["enter"], function () {
    var buttons = sellWindowTable.querySelectorAll("button");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    var count = sellWindowTable.querySelectorAll("button").length;
    if (count <= 0) return;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(lastItems, lastFilter, 0);
      } else if (key == "up") {
        win.open(lastItems, lastFilter, count - 1);
      }
    } else {
      if (key == "down") {
        var select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(lastItems, lastFilter, select);
      } else if (key == "up") {
        var select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(lastItems, lastFilter, select);
      }
    }
  });

  win.whenUp(["esc"], function () {
    setTimeout(function () {
      win.hide();
    }, 20);
  });

  win.whenUp(["left", "right"], function (key) {
    if (key == "right") {
      var filter = lastFilter;
      if (filter == null) {
        filter = "sword";
      } else if (filter.match(/sword/)) {
        filter = "head";
      } else if (filter.match(/head/)) {
        filter = "potion";
      } else if (filter.match(/potion/)) {
        filter = "material";
      } else if (filter.match(/material/)) {
        filter = "book";
      } else if (filter.match(/book/)) {
        filter = "misc";
      } else if (filter.match(/misc/)) {
        filter = null;
      }
      win.open(lastItems, filter);
    } else if (key == "left") {
      var filter = lastFilter;
      if (filter == null) {
        filter = "misc";
      } else if (filter.match(/sword/)) {
        filter = null;
      } else if (filter.match(/head/)) {
        filter = "sword";
      } else if (filter.match(/potion/)) {
        filter = "head";
      } else if (filter.match(/material/)) {
        filter = "potion";
      } else if (filter.match(/book/)) {
        filter = "material";
      } else if (filter.match(/misc/)) {
        filter = "book";
      }
      win.open(lastItems, filter);
    }
  });

  sellWindowTable.addEventListener("click", function (event) {
    var itemId = event.target.getAttribute("data-id");
    if (itemId && Game.hero.data.items.hasOwnProperty(itemId)) {
      var item = Game.items[itemId];
      var itemCount = Game.hero.data.items[itemId];

      if (lastItems.hasOwnProperty(itemId)) {
        lastItems[itemId]++;
      } else {
        lastItems[itemId] = 1;
      }

      if (itemCount == 1) {
        Game.hero.data.bar.forEach(function (element, index, array) {
          if (element && element.id == itemId) {
            array[index] = null;
          }
        });
        Sprite.each(Game.hero.data.equipment, function (element, key) {
          if (element == itemId) {
            Game.hero.data.equipment[key] = null;
          }
        });
        delete Game.hero.data.items[itemId];
      } else {
        Game.hero.data.items[itemId]--;
      }

      Game.hero.data.gold += Math.ceil(item.data.value * 0.8);
      Game.windows.interface.refresh();
      win.open(lastItems, lastFilter);
    }
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var win = Game.windows.setting = Game.Window.create("settingWindow");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"settingWindowClose\" class=\"brownButton\">关闭</button>\n\n      <div id=\"settingWindowRendererType\"></div>\n\n      <div id=\"settingWindowBox\">\n        <button id=\"settingWindowFullscreen\" class=\"brownButton\">全屏</button>\n        <button id=\"settingWindowScale\" class=\"brownButton\">缩放</button>\n        <button id=\"settingWindowShortcut\" class=\"brownButton\">清除快捷栏</button>\n        <button id=\"settingWindowShortcutAll\" class=\"brownButton\">清除全部快捷栏</button>\n      </div>\n    </div>\n  ";

  win.css = "\n    #settingWindowBox {\n      width: 100%;\n      height: 360px;\n    }\n\n    #settingWindowBox button {\n      width: 120px;\n      height: 60px;\n      font-size: 16px;\n      display: block;\n    }\n\n    #settingWindowClose {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      float: right;\n    }\n  ";

  var settingWindowShortcut = win.querySelector("#settingWindowShortcut");
  var settingWindowShortcutAll = win.querySelector("#settingWindowShortcutAll");

  var settingWindowClose = win.querySelector("#settingWindowClose");
  var settingWindowScale = win.querySelector("#settingWindowScale");

  var settingWindowFullscreen = win.querySelector("#settingWindowFullscreen");
  var settingWindowRendererType = win.querySelector("#settingWindowRendererType");

  settingWindowShortcut.addEventListener("click", function (event) {
    Game.choice({ 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7 }).then(function (choice) {
      if (Number.isFinite(choice)) {
        Game.hero.data.bar[choice] = null;
        Game.windows.interface.refresh();
      }
    });
  });

  settingWindowShortcutAll.addEventListener("click", function (event) {
    Game.confirm("确定要删除所有快捷栏图表吗？").then(function () {
      for (var i = 0; i < 8; i++) {
        Game.hero.data.bar[i] = null;
      }
      Game.windows.interface.refresh();
    }).catch(function () {
      // no
    });
  });

  win.on("beforeShow", function () {
    settingWindowRendererType.textContent = Game.stage.rendererType;
  });

  settingWindowClose.addEventListener("click", function (event) {
    win.hide();
  });

  settingWindowScale.addEventListener("click", function (event) {
    Game.config.scale = !Game.config.scale;
    win.show();
  });

  win.whenUp(["esc"], function (key) {
    settingWindowClose.click();
  });

  win.assign("toggle", function () {
    if (!document.fullscreenElement && // alternative standard method
    !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  });

  settingWindowFullscreen.addEventListener("click", function (event) {
    win.toggle();
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var win = Game.windows.skill = Game.Window.create("skillWindow");

  win.html = "\n    <div class=\"window-box\">\n      <div id=\"skillWindowItemBar\">\n        <button id=\"skillWindowClose\" class=\"brownButton\">关闭</button>\n      </div>\n      <table border=\"0\">\n        <thead>\n          <tr>\n            <th style=\"width: 40px;\"></th>\n            <th style=\"width: 120px;\"></th>\n            <th></td>\n            <th style=\"width: 60px;\"></th>\n          </tr>\n        </thead>\n        <tbody id=\"skillWindowTable\"></tbody>\n      </table>\n    </div>\n  ";

  win.css = "\n    .skillWindow table {\n      width: 100%;\n    }\n\n    .skillWindow tr:nth-child(odd) {\n      background-color: rgba(192, 192, 192, 0.6);\n    }\n\n    .skillWindow table img {\n      width: 100%;\n      height: 100%;\n    }\n\n    .skillWindow button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n    }\n\n    #skillWindowItemBar button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      margin-left: 5px;\n      margin-right: 5px;\n      margin-top: 0px;\n      margin-bottom: 5px;\n    }\n\n    #skillWindowClose {\n      float: right;\n    }\n  ";

  var skillWindowClose = win.querySelector("button#skillWindowClose");
  var skillWindowTable = win.querySelector("#skillWindowTable");

  var lastSelect = -1;

  skillWindowClose.addEventListener("click", function (event) {
    win.hide();
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      win.hide();
    }, 20);
  });

  win.assign("open", function (select) {

    if (typeof select == "undefined") {
      select = -1;
    }

    lastSelect = select;

    var index = 0;
    var table = "";
    Game.hero.data.skills.forEach(function (skillId) {
      var skill = Game.skills[skillId];

      var line = "";

      if (select == index) {
        line += "<tr style=\"background-color: green;\">\n";
      } else {
        line += "<tr>\n";
      }

      line += "  <td><img alt=\"\" src=\"" + skill.icon.src + "\"></td>\n";
      line += "  <td>" + skill.data.name + "</td>\n";
      line += "  <td>" + skill.data.description + "</td>\n";
      line += "  <td><button data-id=\"" + skillId + "\" class=\"brownButton skillWindowManage\">管理</button></td>\n";
      line += "</tr>\n";
      table += line;
      index++;
    });

    skillWindowTable.innerHTML = table;
    Game.windows.skill.show();
  });

  win.whenUp(["enter"], function () {
    var buttons = win.querySelectorAll(".skillWindowManage");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    var count = win.querySelectorAll(".skillWindowManage").length;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(0);
      } else if (key == "up") {
        win.open(count - 1);
      }
    } else {
      if (key == "down") {
        var select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(select);
      } else if (key == "up") {
        var select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(select);
      }
    }
  });

  skillWindowTable.addEventListener("click", function (event) {
    var skillId = event.target.getAttribute("data-id");
    var index = Game.hero.data.skills.indexOf(skillId);
    if (skillId && Game.skills.hasOwnProperty(skillId) && index != -1) {
      (function () {

        var skill = Game.skills[skillId];

        var options = {};

        options["快捷栏"] = "shortcut";
        options["遗忘"] = "remove";
        if (skill.data.next) {
          options["升级"] = "levelup";
        }

        Game.choice(options).then(function (choice) {
          switch (choice) {
            case "shortcut":
              Game.choice({
                1: 0,
                2: 1,
                3: 2,
                4: 3,
                5: 4,
                6: 5,
                7: 6,
                8: 7
              }).then(function (choice) {
                if (Number.isFinite(choice) && choice >= 0) {
                  Game.hero.data.bar[choice] = {
                    id: skillId,
                    type: "skill"
                  };
                  Game.windows.interface.refresh();
                }
              });
              break;
            case "levelup":
              if (skill.data.next) {
                var cannot = [];
                if (Game.hero.data.gold < skill.data.next.gold) {
                  cannot.push("金币不足，需要金币" + skill.data.next.gold + "，当前您有金币" + Game.hero.data.gold);
                }
                if (Game.hero.data.exp < skill.data.next.exp) {
                  cannot.push("经验不足，需要经验" + skill.data.next.exp + "，当前您有经验" + Game.hero.data.exp);
                }
                if (cannot.length) {
                  Game.dialogue(cannot);
                  return;
                }
                Game.confirm("确定要升级这个技能吗？共需要金币" + skill.data.next.gold + "，经验" + skill.data.next.exp).then(function () {
                  var nextId = skill.data.next.id;
                  Game.hero.data.skills.splice(index, 1);
                  Game.hero.data.skills.push(nextId);
                  Game.hero.data.gold -= skill.data.next.gold;
                  Game.hero.data.exp -= skill.data.next.exp;
                  Game.windows.loading.begin();
                  Game.Skill.load(nextId).then(function (skillObj) {
                    Game.windows.loading.end();
                    win.open();
                  });
                }).catch(function () {
                  // no
                });
              }
              break;
            case "remove":
              Game.confirm("真的要遗忘 " + skill.data.name + " 技能吗？").then(function () {
                Game.hero.data.bar.forEach(function (element, index, array) {
                  if (element && element.id == skillId) {
                    array[index] = null;
                  }
                });
                Game.hero.data.skills.splice(index, 1);
                Game.windows.interface.refresh();
                win.open();
              }).catch(function () {
                // no
              });
              break;
          }
        });
      })();
    }
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var win = Game.windows.status = Game.Window.create("statusWindow");

  win.html = "\n    <div class=\"window-box\">\n      <div id=\"statusWindowItemBar\">\n        <button id=\"statusWindowClose\" class=\"brownButton\">关闭</button>\n        <button id=\"statusWindowInventory\" class=\"brownButton\">物品</button>\n        <label id=\"heroName\"></label>\n      </div>\n      <table border=\"0\">\n        <tr>\n          <td id=\"statusWindowTable\">\n            <label id=\"heroHP\"></label>\n            <label id=\"heroSP\"></label>\n            <label id=\"heroLevel\"></label>\n            <label id=\"heroEXP\"></label>\n            <label id=\"heroSTR\"></label>\n            <label id=\"heroDEX\"></label>\n            <label id=\"heroCON\"></label>\n            <label id=\"heroINT\"></label>\n            <label id=\"heroCHA\"></label>\n            <label id=\"heroATK\"></label>\n            <label id=\"heroDEF\"></label>\n            <label id=\"heroMATK\"></label>\n            <label id=\"heroMDEF\"></label>\n          </td>\n          <td style=\"width: 50%;\">\n            <table id=\"statusWindowEquipmentTable\" border=\"0\">\n              <tbody>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">头部</td>\n                  <td id=\"equipment-head\"></td>\n                  <td style=\"width: 60px;\"><button id=\"equipmentButton-head\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">身体</td>\n                  <td id=\"equipment-body\"></td>\n                  <td><button id=\"equipmentButton-body\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">足部</td>\n                  <td id=\"equipment-feet\"></td>\n                  <td><button id=\"equipmentButton-feet\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">武器</td>\n                  <td id=\"equipment-weapon\"></td>\n                  <td><button id=\"equipmentButton-weapon\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">项链</td>\n                  <td id=\"equipment-neck\"></td>\n                  <td><button id=\"equipmentButton-neck\" class=\"brownButton\">卸下</button></td>\n                </tr>\n                <tr>\n                  <td class=\"statusWindowEquipmentText\">戒指</td>\n                  <td id=\"equipment-ring\"></td>\n                  <td><button id=\"equipmentButton-ring\" class=\"brownButton\">卸下</button></td>\n                </tr>\n              </tbody>\n            </table>\n          </td>\n        </tr>\n      </table>\n    </div>\n  ";

  win.css = "\n\n    #statusWindowEquipmentTable tr:nth-child(odd) {\n      background-color: rgba(192, 192, 192, 0.6);\n    }\n\n    #heroName {\n      font-size: 24px;\n      margin-left: 240px;\n    }\n\n    #statusWindowTable {\n      width: 50%;\n    }\n\n    #statusWindowTable label {\n      font-size: 18px;\n      margin-left: 80px;\n    }\n\n    #statusWindowEquipmentTable button {\n      width: 60px;\n      height: 40px;\n    }\n\n    .statusWindowEquipmentText {\n      width: 60px;\n      font-size: 20px;\n      text-align: center;\n    }\n\n    .statusWindow label {\n      display: block;\n    }\n\n    #statusWindowItemBar button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      margin-left: 5px;\n      margin-right: 5px;\n      margin-top: 0px;\n      margin-bottom: 5px;\n      text-align: center;\n    }\n\n    #statusWindowClose {\n      float: right;\n    }\n\n    #statusWindowInventory {\n      float: right;\n    }\n\n    .statusWindow table {\n      width: 100%;\n      height: 320px;\n    }\n  ";

  var statusWindowEquipment = {
    head: win.querySelector("#equipment-head"),
    body: win.querySelector("#equipment-body"),
    feet: win.querySelector("#equipment-feet"),
    weapon: win.querySelector("#equipment-weapon"),
    neck: win.querySelector("#equipment-neck"),
    ring: win.querySelector("#equipment-ring")
  };

  var statusWindowEquipmentButton = {
    head: win.querySelector("#equipmentButton-head"),
    body: win.querySelector("#equipmentButton-body"),
    feet: win.querySelector("#equipmentButton-feet"),
    weapon: win.querySelector("#equipmentButton-weapon"),
    neck: win.querySelector("#equipmentButton-neck"),
    ring: win.querySelector("#equipmentButton-ring")
  };

  var lastSelect = -1;

  Sprite.each(statusWindowEquipmentButton, function (button, key) {
    button.addEventListener("click", function () {
      if (Game.hero.data.equipment[key]) {
        Game.hero.data.equipment[key] = null;
      } else {
        if (key == "weapon") {
          Game.windows.inventory.open("sword|spear|bow");
        } else {
          Game.windows.inventory.open("head|body|feet");
        }
      }
      win.update();
    });
  });

  var heroName = win.querySelector("#heroName");
  var heroHP = win.querySelector("#heroHP");
  var heroSP = win.querySelector("#heroSP");
  var heroLevel = win.querySelector("#heroLevel");
  var heroEXP = win.querySelector("#heroEXP");
  var heroSTR = win.querySelector("#heroSTR");
  var heroDEX = win.querySelector("#heroDEX");
  var heroCON = win.querySelector("#heroCON");
  var heroINT = win.querySelector("#heroINT");
  var heroCHA = win.querySelector("#heroCHA");
  var heroATK = win.querySelector("#heroATK");
  var heroDEF = win.querySelector("#heroDEF");
  var heroMATK = win.querySelector("#heroMATK");
  var heroMDEF = win.querySelector("#heroMDEF");

  var statusWindowClose = win.querySelector("button#statusWindowClose");
  var statusWindowInventory = win.querySelector("button#statusWindowInventory");
  var statusWindowEquipmentTable = win.querySelector("#statusWindowEquipmentTable");

  statusWindowClose.addEventListener("click", function (event) {
    win.hide();
  });

  statusWindowInventory.addEventListener("click", function (event) {
    win.hide();
    Game.windows.inventory.open();
  });

  win.whenUp(["tab"], function () {
    setTimeout(function () {
      win.hide();
      Game.windows.inventory.open();
    }, 20);
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      win.hide();
    }, 20);
  });

  win.assign("update", function (select) {

    if (typeof select == "undefined") {
      select = -1;
    }

    lastSelect = select;

    heroName.textContent = "名字：" + Game.hero.data.name;
    heroHP.textContent = "生命力：" + Game.hero.data.hp + "/" + Game.hero.data.$hp;
    heroSP.textContent = "精神力：" + Game.hero.data.sp + "/" + Game.hero.data.$sp;
    heroLevel.textContent = "等级：" + Game.hero.data.level;
    heroEXP.textContent = "经验：" + Game.hero.data.exp;
    heroSTR.textContent = "力量：" + Game.hero.data.str;
    heroDEX.textContent = "敏捷：" + Game.hero.data.dex;
    heroCON.textContent = "耐力：" + Game.hero.data.con;
    heroINT.textContent = "智力：" + Game.hero.data.int;
    heroCHA.textContent = "魅力：" + Game.hero.data.cha;
    heroATK.textContent = "攻击：" + Game.hero.data.atk;
    heroDEF.textContent = "防御：" + Game.hero.data.def;
    heroMATK.textContent = "魔法攻击：" + Game.hero.data.matk;
    heroMDEF.textContent = "魔法防御：" + Game.hero.data.mdef;

    var lines = statusWindowEquipmentTable.querySelectorAll("tr");
    for (var i = 0, len = lines.length; i < len; i++) {
      if (select == i) {
        lines[i].style.backgroundColor = "green";
      } else {
        lines[i].style.backgroundColor = "";
      }
    }

    Sprite.each(Game.hero.data.equipment, function (element, key) {
      var button = statusWindowEquipmentButton[key];

      if (element) {
        var line = "";
        line += "<img alt=\"\" src=\"" + Game.items[element].icon.src + "\">";
        line += "<span>" + Game.items[element].data.name + "</span>";
        statusWindowEquipment[key].innerHTML = line;
        button.textContent = "卸下";
      } else {
        statusWindowEquipment[key].innerHTML = "";
        button.textContent = "装备";
      }
    });
  });

  win.whenUp(["enter"], function () {
    var buttons = statusWindowEquipmentTable.querySelectorAll("button");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    var count = statusWindowEquipmentTable.querySelectorAll("button").length;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(0);
      } else if (key == "up") {
        win.open(count - 1);
      }
    } else {
      if (key == "down") {
        var select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(select);
      } else if (key == "up") {
        var select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(select);
      }
    }
  });

  win.assign("open", function (select) {
    win.update(select);
    win.show();
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var win = Game.windows.sysmenu = Game.Window.create("sysmenuWindow");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"sysmenuWindowClose\" class=\"brownButton\">关闭窗口</button>\n\n      <table><tbody><tr><td>\n        <button id=\"sysmenuWindowInventory\" class=\"brownButton\">1、背包物品</button>\n        <button id=\"sysmenuWindowStatus\" class=\"brownButton\">2、状态装备</button>\n        <br>\n        <button id=\"sysmenuWindowSkill\" class=\"brownButton\">3、查看技能</button>\n        <button id=\"sysmenuWindowQuest\" class=\"brownButton\">4、任务列表</button>\n        <br>\n        <button id=\"sysmenuWindowMap\" class=\"brownButton\">5、迷你地图</button>\n        <button id=\"sysmenuWindowSetting\" class=\"brownButton\">6、游戏设置</button>\n        <br>\n        <button id=\"sysmenuWindowArchive\" class=\"brownButton\">7、存档管理</button>\n        <button id=\"sysmenuWindowExit\" class=\"brownButton\">8、退出游戏</button>\n        <br>\n      </td></tr></tbody></table>\n    </div>\n  ";

  win.css = "\n    .sysmenuWindow {\n      text-align: center;\n    }\n\n    .sysmenuWindow table, .sysmenuWindow tbody, .sysmenuWindow tr, .sysmenuWindow td {\n      width: 100%;\n      height: 100%;\n      margin: 0;\n      padding: 0;\n    }\n\n    .sysmenuWindow button {\n      width: 200px;\n      height: 60px;\n      margin: 2px;\n      font-size: 16px;\n    }\n\n    button#sysmenuWindowClose {\n      position: absolute;\n      right: 50px;\n      top: 50px;\n      width: 120px;\n      height: 60px;\n      font-size: 16px;\n    }\n  ";

  var sysmenuWindowInventory = win.querySelector("button#sysmenuWindowInventory");
  var sysmenuWindowStatus = win.querySelector("button#sysmenuWindowStatus");

  var sysmenuWindowSkill = win.querySelector("button#sysmenuWindowSkill");
  var sysmenuWindowQuest = win.querySelector("button#sysmenuWindowQuest");

  var sysmenuWindowMap = win.querySelector("button#sysmenuWindowMap");
  var sysmenuWindowSetting = win.querySelector("button#sysmenuWindowSetting");

  var sysmenuWindowArchive = win.querySelector("button#sysmenuWindowArchive");
  var sysmenuWindowExit = win.querySelector("button#sysmenuWindowExit");

  var sysmenuWindowClose = win.querySelector("button#sysmenuWindowClose");

  win.whenUp(["esc"], function (key) {
    sysmenuWindowClose.click();
  });

  win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8"], function (key) {
    switch (key) {
      case "1":
        sysmenuWindowInventory.click();
        break;
      case "2":
        sysmenuWindowStatus.click();
        break;
      case "3":
        sysmenuWindowSkill.click();
        break;
      case "4":
        sysmenuWindowQuest.click();
        break;
      case "5":
        sysmenuWindowMap.click();
        break;
      case "6":
        sysmenuWindowSetting.click();
        break;
      case "7":
        sysmenuWindowArchive.click();
        break;
      case "8":
        sysmenuWindowExit.click();
        break;
    }
  });

  sysmenuWindowInventory.addEventListener("click", function (event) {
    win.hide();
    Game.windows.inventory.open();
  });

  sysmenuWindowStatus.addEventListener("click", function (event) {
    win.hide();
    Game.windows.status.open();
  });

  sysmenuWindowSkill.addEventListener("click", function (event) {
    win.hide();
    Game.windows.skill.open();
  });

  sysmenuWindowQuest.addEventListener("click", function (event) {
    win.hide();
    Game.windows.quest.current();
  });

  sysmenuWindowMap.addEventListener("click", function (event) {
    win.hide();
    Game.windows.map.show();
  });

  sysmenuWindowSetting.addEventListener("click", function (event) {
    win.hide();
    Game.windows.setting.show();
  });

  sysmenuWindowArchive.addEventListener("click", function (event) {
    win.hide();
    Game.windows.archive.open();
  });

  sysmenuWindowExit.addEventListener("click", function (event) {
    Game.clearStage();
    Game.windows.interface.hide();
    Game.windows.stage.hide();
    win.hide();
    Game.windows.main.show();
  });

  sysmenuWindowClose.addEventListener("click", function (event) {
    win.hide();
  });
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict"

  /**
   * 自动寻路算法 A*
   */
  ;
  Game.assign("Astar", (function () {
    function GameAstar() {
      _classCallCheck(this, GameAstar);
    }

    _createClass(GameAstar, null, [{
      key: "getPath",

      /**
       * @param {function} collisionFunction 测试是否阻挡
       * @param {Object} start 起始位置 eg. {x: 0, y: 0}
       * @param {Object} end
       */
      value: function getPath(start, end) {
        return new Promise(function (resolve, reject) {
          var blocked = {};
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Game.area.actors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var actor = _step.value;

              if (actor.x != start.x || actor.y != start.y) {
                blocked[actor.x * 10000 + actor.y] = true;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          var result = path(function (x, y) {
            // 判断函数，判断是否阻挡
            if (x < 0 || x >= Game.area.map.col) {
              return true; // 有阻挡，返回true
            }
            if (y < 0 || y >= Game.area.map.row) {
              return true; // 有阻挡，返回true
            }
            var key = x * 10000 + y;
            if (Game.area.map.blockedMap[key]) {
              return true; // 有阻挡，返回true
            }
            if (blocked[key]) {
              return true; // 有阻挡，返回true
            }
            return false; // 没有阻挡
          }, start, end);

          resolve(result);
        });
      }
    }]);

    return GameAstar;
  })());

  /*
  * reference from http://eloquentjavascript.net/1st_edition/appendix2.html
  */

  var BinaryHeap = (function () {
    function BinaryHeap(scoreFunction) {
      _classCallCheck(this, BinaryHeap);

      this.content = [];
      this.scoreFunction = scoreFunction;
      this.scores = new Map();
    }

    _createClass(BinaryHeap, [{
      key: "push",
      value: function push(element) {
        this.scores.set(element, this.scoreFunction(element));
        this.content.push(element);
        this.bubbleUp(this.content.length - 1);
      }
    }, {
      key: "pop",
      value: function pop() {
        var r = this.content[0];
        var e = this.content.pop();
        if (this.content.length > 0) {
          this.content[0] = e;
          this.sinkDown(0);
        }
        return r;
      }
    }, {
      key: "delete",
      value: function _delete(node) {
        for (var i = 0, len = this.content.length; i < len; i++) {
          if (this.content[i] == node) {
            this.scores.delete(this.content[i]);
            var e = this.content.pop();
            if (i == len - 1) {
              break;
            }
            this.content[i] = e;
            this.bubbleUp(i);
            this.sinkDown(i);
            break;
          }
        }
      }
    }, {
      key: "bubbleUp",
      value: function bubbleUp(n) {
        var element = this.content[n];
        var score = this.scores.get(element);
        while (n > 0) {
          var parentN = Math.floor((n + 1) / 2) - 1;
          var parent = this.content[parentN];
          if (score >= this.scores.get(parent)) break;
          this.content[parentN] = element;
          this.content[n] = parent;
          n = parentN;
        }
      }
    }, {
      key: "sinkDown",
      value: function sinkDown(n) {
        var len = this.content.length;
        var element = this.content[n];
        var score = this.scores.get(element);

        while (true) {
          var child2N = (n + 1) * 2;
          var child1N = child2N - 1;
          var swap = null;
          var child1score = undefined,
              child2score = undefined;

          if (child1N < len) {
            var child1 = this.content[child1N];
            child1score = this.scores.get(child1);
            if (child1score < score) {
              swap = child1N;
            }
          }

          if (child2N < len) {
            var child2 = this.content[child2N];
            child2score = this.scores.get(child2);
            if (child2score < (swap == null ? score : child1score)) {
              swap = child2N;
            }
          }

          if (swap == null) {
            break;
          }

          this.content[n] = this.content[swap];
          this.content[swap] = element;
          n = swap;
        }
      }
    }, {
      key: "size",
      get: function get() {
        return this.content.length;
      },
      set: function set(value) {
        throw new Error("BinaryHeap.size readonly");
      }
    }]);

    return BinaryHeap;
  })();

  ; // BinaryHeap

  // 计算点结构a和b之间的曼哈顿距离，即不带斜走的直线距离
  function manhattan(ax, ay, bx, by) {
    return Math.abs(ax - bx) + Math.abs(ay - by);
  }

  // 通过坐标x，y，当前最好的节点best和一个附加值（直线10，斜线14），返回一个新节点
  function make(x, y, end, best, addition) {
    var t = {
      key: x * 10000 + y,
      x: x,
      y: y,
      g: best.g + addition,
      h: manhattan(x, y, end.x, end.y),
      front: []
    };
    t.f = t.g + t.h;
    var len = best.front.length;
    t.front.length = len;
    for (var i = 0; i < len; i++) {
      t.front[i] = best.front[i];
    }
    t.front.push(best.x);
    t.front.push(best.y);
    return t;
  }

  function path(collisionFunction, start, end) {

    // 开启列表和关闭列表
    var open = new BinaryHeap(function (element) {
      return element.f;
    });
    var openIndex = new Set();
    var closeIndex = new Set();

    //构建起始节点
    var startElement = {
      key: start.x * 10000 + start.y,
      x: start.x,
      y: start.y,
      f: 0,
      g: 0,
      h: manhattan(start.x, start.y, end.x, end.y),
      front: []
    };
    openIndex.add(startElement.key);
    open.push(startElement);

    var push2open = function push2open(x, y, end, best) {
      if (!collisionFunction(x, y)) {
        // 验证up
        var key = x * 10000 + y;
        if (!openIndex.has(key) && !closeIndex.has(key)) {
          openIndex.add(key);
          open.push(make(x, y, end, best, 10));
        }
      }
    };

    while (open.size) {
      // F值最小的节点，就是堆顶
      var best = open.pop();
      // 从开启列表中删除，加入关闭列表
      open.delete(best);
      openIndex.delete(best.key);
      closeIndex.add(best.key);

      // 如果这个最好的节点就是结尾节点，则返回
      if (best.x == end.x && best.y == end.y) {
        var result = [];
        for (var i = 0, len = best.front.length; i < len; i += 2) {
          result.push({
            x: best.front[i],
            y: best.front[i + 1]
          });
        }
        result.push({
          x: end.x,
          y: end.y
        });
        return result;
      }

      // 记录上下左右四方向的可能值
      push2open(best.x, best.y - 1, end, best);
      push2open(best.x, best.y + 1, end, best);
      push2open(best.x - 1, best.y, end, best);
      push2open(best.x + 1, best.y, end, best);
    } // while

    return null;
  }
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  Game.assign("AI", (function () {
    function GameAI() {
      _classCallCheck(this, GameAI);
    }

    _createClass(GameAI, null, [{
      key: "attach",
      value: function attach(hero) {}
    }]);

    return GameAI;
  })());
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  function boxCollide(spriteA, spriteB, rectA, rectB) {
    var A = {
      x: spriteA.x - rectA.centerX,
      y: spriteA.y - rectA.centerY,
      w: rectA.width,
      h: rectA.height,
      sx: rectA.x,
      sy: rectA.y,
      sw: rectA.width,
      sh: rectA.height,
      image: rectA.image
    };

    var B = {
      x: spriteB.x - rectB.centerX,
      y: spriteB.y - rectB.centerY,
      w: rectB.width,
      h: rectB.height,
      sx: rectB.x,
      sy: rectB.y,
      sw: rectB.width,
      sh: rectB.height,
      image: rectB.image
    };

    var bigX = Math.max(A.x + A.w, B.x + B.w);
    var smallX = Math.min(A.x, B.x);
    var bigY = Math.max(A.y + A.h, B.y + B.h);
    var smallY = Math.min(A.y, B.y);

    var width = bigX - smallX;
    var height = bigY - smallY;

    if (width < A.w + B.w && height < A.h + B.h) {
      return {
        A: A,
        B: B
      };
    }
    return false;
  }

  var collideCavansCache = new Map();

  function pixelCollide(A, B) {
    // 对图像进行某种意义上的移动，例如把上面的图的A和B都平移到左上角，也就是AA的左上角变为0,0坐标

    var now = new Date().getTime();

    // WWWHHH
    var key = A.w * 1000 + A.h;
    var canvas = undefined;
    var context = undefined;
    if (collideCavansCache.has(key)) {
      canvas = collideCavansCache.get(key).canvas;
      context = collideCavansCache.get(key).context;
    } else {
      canvas = document.createElement("canvas");
      canvas.width = A.w;
      canvas.height = A.h;
      context = canvas.getContext("2d");
      collideCavansCache.set(key, {
        canvas: canvas,
        context: context
      });
    }
    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw spriteA
    context.globalCompositeOperation = "source-over";
    context.drawImage(A.image, A.sx, A.sy, A.sw, A.sh, 0, 0, A.w, A.h);

    // draw spriteB
    // 在source-in模式下，图像如果相交则显示，不相交则透明，所以判断如果有非透明就是相交
    context.globalCompositeOperation = "source-in";
    context.drawImage(B.image, B.sx, B.sy, B.sw, B.sh, B.x - A.x, B.y - A.y, B.w, B.h);

    var pixel = context.getImageData(0, 0, A.w, A.h).data;

    var collision = false;

    for (var i = 3, len = pixel.length; i < len; i += 3) {
      if (pixel[i] != 0) {
        collision = true;
      }
    }

    return collision;
  }

  // 角色碰撞检测，先简单的矩形检测，如有碰撞可能则进行像素级检测
  Game.assign("actorCollision", function (actorSprite, blockSprite) {
    // 角色只检测frame 0，因为角色老变动，避免卡住，只检测第一个frame
    var actorRect = actorSprite.getFrame(0);
    // 阻挡的块则检测当前frame
    var blockRect = blockSprite.getFrame();
    var data = boxCollide(actorSprite, blockSprite, actorRect, blockRect);
    if (data) {
      // 计算一个delta，即只碰撞角色的下半部分
      // deltaY偏移0.85，大概意思是只检测角色最下方15%的地方
      var deltaY = Math.floor(actorRect.height * 0.85);
      data.A.y += deltaY;
      data.A.sy += deltaY;
      data.A.h -= deltaY;
      data.A.sh -= deltaY;

      return pixelCollide(data.A, data.B);
    }
    return false;
  });

  // 技能碰撞检测
  Game.assign("skillCollision", function (skillSprite, actorSprite) {
    var skillRect = skillSprite.getFrame();
    var actorRect = actorSprite.getFrame();

    var data = boxCollide(skillSprite, actorSprite, skillRect, actorRect);
    if (data) {
      // 和角色碰撞检测对比，技能碰撞检测无delta
      return pixelCollide(data.A, data.B);
    }
    return false;
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var popupCache = new Map();

  Game.assign("popup", function (obj, text) {
    var adjustX = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
    var adjustY = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

    if (popupCache.has(obj)) {
      var popup = popupCache.get(obj);
      Game.layers.dialogueLayer.removeChild(popup.container);
      clearInterval(popup.timer);
      popupCache.delete(obj);
    }

    var dialogueText = new Sprite.Text({
      text: text,
      maxWidth: 200
    });

    var w = dialogueText.width;
    var h = dialogueText.height;
    var middle = Math.round((w + 10) / 2);

    var dialogueBox = new Sprite.Shape();

    dialogueBox.polygon({
      points: "0,0 " + (w + 10) + ",0 " + (w + 10) + "," + (h + 10) + " " + (middle + 5) + "," + (h + 10) + " " + middle + "," + (h + 15) + " " + (middle - 5) + "," + (h + 10) + " 0," + (h + 10) + " 0,0",
      fill: "white"
    });

    var dialogueContainer = new Sprite.Container();
    dialogueContainer.appendChild(dialogueBox, dialogueText);
    dialogueText.x = 5;
    dialogueText.y = 5;
    dialogueContainer.x = obj.x + adjustX;
    dialogueContainer.y = obj.y + adjustY;
    dialogueContainer.centerX = middle;
    dialogueContainer.centerY = h + 15;

    Game.layers.dialogueLayer.appendChild(dialogueContainer);

    if (obj instanceof Sprite.Event) {
      obj.on("change", function () {
        dialogueContainer.x = obj.x + adjustX;
        dialogueContainer.y = obj.y + adjustY;
      });
    }

    var timer = setTimeout(function () {
      if (popupCache.has(obj)) {
        var popup = popupCache.get(obj);
        Game.layers.dialogueLayer.removeChild(popup.container);
        popupCache.delete(obj);
      }
    }, 3000);

    popupCache.set(obj, {
      container: dialogueContainer,
      timer: timer
    });
  });
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict"

  // 游戏无论什么时候都需要预加载的内容
  ;
  function Preload() {
    return new Promise(function (resolve, reject) {
      var promises = new Set();

      var preloadSoundEffects = {
        hurt: "sound/effect/hurt.ogg" // 伤害效果音
      };

      for (var key in preloadSoundEffects) {
        promises.add((function (key, url) {
          return new Promise(function (resolve, reject) {
            if (Game.sounds && Game.sounds[key]) {
              resolve();
            } else {
              Sprite.load(url).then(function (data) {
                Game.sounds[key] = data[0];
                resolve();
              });
            }
          });
        })(key, preloadSoundEffects[key]));
      }

      var preloadItems = ["bag", // 掉落物品用的小包
      "gold" // 金币图标
      ];

      preloadItems.forEach(function (id) {
        promises.add(new Promise(function (resolve, reject) {
          if (Game.items && Game.items[id]) {
            resolve();
          } else {
            Game.Item.load(id).then(function (itemObj) {
              resolve();
            });
          }
        }));
      });

      Promise.all(promises).then(function () {
        resolve();
      });
    });
  }

  // 加载区域，把括地图，角色，物品
  Game.assign("loadArea", function (id) {
    return new Promise(function (resolve, reject) {

      Game.Map.load(id).then(function (mapObj) {

        var area = {
          actors: new Set(), // 角色
          bags: new Set(), // 掉落小包
          items: new Set(), // 其他物品（有碰撞）
          touch: [], // touch或onto会触发的地点/物品
          onto: [], // onto会触发的地点/物品
          map: mapObj
        };

        var promises = new Set();

        promises.add(Preload());

        if (mapObj.data.actors) {
          mapObj.data.actors.forEach(function (element) {
            promises.add(new Promise(function (resolve, reject) {
              Game.Actor.load(element.id).then(function (actorObj) {

                for (var key in element) {
                  actorObj.data[key] = element[key];
                }

                area.actors.add(actorObj);
                actorObj.draw();
                resolve();
              });
            }));
          });
        }

        if (mapObj.spawnMonster && mapObj.spawnMonster.list && mapObj.spawnMonster.count) {
          var _loop = function _loop(monsterId) {
            promises.add(new Promise(function (resolve, reject) {
              Game.Actor.load(monsterId).then(function () {
                resolve();
              });
            }));
          };

          for (var monsterId in mapObj.spawnMonster.list) {
            _loop(monsterId);
          }
        }

        if (mapObj.spawnItem && mapObj.spawnItem.list && mapObj.spawnItem.count) {
          var _loop2 = function _loop2(itemId) {
            promises.add(new Promise(function (resolve, reject) {
              Game.Item.load(itemId).then(function () {
                resolve();
              });
            }));
          };

          for (var itemId in mapObj.spawnItem.list) {
            _loop2(itemId);
          }
        }

        if (mapObj.data.onto) {
          mapObj.data.onto.forEach(function (element) {
            area.onto.push(element);
          });
        }

        if (mapObj.data.touch) {
          mapObj.data.touch.forEach(function (element) {
            area.touch.push(element);
          });
        }

        Promise.all(promises).then(function () {
          resolve(area);
        });
      }); //map
    });
  });
})();

"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  Game.assign("Map", (function (_Sprite$Event) {
    _inherits(GameMap, _Sprite$Event);

    _createClass(GameMap, [{
      key: "hitTest",
      value: function hitTest(x, y) {
        if (internal(this).blockedMap[x * 10000 + y]) {
          return true;
        }
        return false;
      }
    }, {
      key: "hitWater",
      value: function hitWater(x, y) {
        if (internal(this).waterMap[x * 10000 + y]) {
          return true;
        }
        return false;
      }
    }, {
      key: "blockedMap",
      get: function get() {
        return internal(this).blockedMap;
      },
      set: function set(value) {
        throw new Error("Game.Map.blockedMap readonly");
      }
    }], [{
      key: "load",
      value: function load(id) {
        return new Promise(function (resolve, reject) {
          Sprite.load("map/" + id + ".json", "map/" + id + ".js").then(function (data) {
            var _data = _slicedToArray(data, 2);

            var mapData = _data[0];
            var mapInfo = _data[1];

            mapInfo = mapInfo(); // map/id.js文件会返回一个函数
            mapData.id = id;

            for (var key in mapInfo) {
              if (mapData.hasOwnProperty(key)) {
                console.log(key, mapData[key], mapInfo[key], mapInfo, mapData);
                throw new Error("Game.loadArea invalid data");
              }
              mapData[key] = mapInfo[key];
            }

            var mapObj = new Game.Map(mapData);
            mapObj.on("complete", function () {
              resolve(mapObj);
            });
          });
        });
      }
    }]);

    function GameMap(mapData) {
      _classCallCheck(this, GameMap);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GameMap).call(this));

      var privates = internal(_this);
      privates.data = mapData;

      var images = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = privates.data.tilesets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var element = _step.value;

          images.push("map/" + element.image);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      ;

      Sprite.load(images).then(function (data) {

        // 释放空间
        privates.data.tilesets = null;

        privates.sheet = new Sprite.Sheet({
          images: data,
          width: privates.data.tilewidth,
          height: privates.data.tileheight
        });

        // 水地图，用来进行hitWater测试
        privates.waterMap = {};
        // 计算阻挡地图，如果为object则有阻挡，undefined则无阻挡
        privates.blockedMap = {};

        // 保存这个地图的所有地图块
        // 这个空间在draw后会释放
        privates.layers = [];

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = privates.data.layers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var layerData = _step2.value;

            var layerObj = null;
            if (layerData.name != "block") {
              layerObj = new Sprite.Container();
              layerObj.name = layerData.name;
              privates.layers.push(layerObj);
            }

            var width = _this.col;
            var height = _this.row;
            for (var y = 0; y < height; y++) {
              for (var x = 0; x < width; x++) {
                var position = x + y * width;
                var key = x * 10000 + y;
                var picture = layerData.data[position] - 1;

                if (picture >= 0) {
                  if (layerData.name == "block") {
                    privates.blockedMap[key] = true;
                  } else {
                    var frame = privates.sheet.getFrame(picture);
                    frame.x = x * privates.data.tilewidth;
                    frame.y = y * privates.data.tileheight;
                    layerObj.appendChild(frame);
                    if (layerData.name == "water") {
                      privates.waterMap[key] = true;
                    }
                  }
                }
              }
            }
          }

          // 发送完成事件，第二个参数代表此事件是一次性事件，即不会再次complete
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        _this.emit("complete", true);
      });

      return _this;
    }

    _createClass(GameMap, [{
      key: "tile",

      // 返回某个坐标点所在的地格
      value: function tile(x, y) {
        if (Number.isFinite(x) && Number.isFinite(y)) {
          return {
            x: Math.floor(x / this.data.tilewidth),
            y: Math.floor(y / this.data.tileheight)
          };
        } else {
          console.error(x, y, this.data);
          throw new Error("Game.Map.tile got invalid arguments");
        }
      }

      // 绘制图片，会改变Game.currentArea

    }, {
      key: "draw",
      value: function draw() {
        var _this2 = this;

        var privates = internal(this);
        Game.layers.mapLayer.clear();

        privates.layers.forEach(function (element, index) {
          var layerData = privates.data.layers[index];

          if (Number.isFinite(layerData.opacity)) {
            element.alpha = layerData.opacity;
          }

          Game.layers.mapLayer.appendChild(element);
        });

        // 释放冗余空间
        privates.layers = null;
        privates.data.layers = null;

        // 给其他地图缓冲层
        Game.layers.mapLayer.cache(this.width, this.height);
        var map = new Sprite.Bitmap(Game.layers.mapLayer.cacheCanvas);
        Game.layers.mapLayer.clear();
        Game.layers.mapLayer.appendChild(map);

        var minimap = document.createElement("canvas");
        minimap.width = this.col * 8; // 原地图的四倍
        minimap.height = this.row * 8;
        var minimapContext = minimap.getContext("2d");
        minimapContext.drawImage(map.image, 0, 0, map.width, map.height, 0, 0, minimap.width, minimap.height);

        privates.minimap = minimap;

        if (privates.data.bgm) {
          // set loop = -1, 无限循环
          //let bgm = createjs.Sound.play(this.data.bgm, undefined, undefined, undefined, -1);
          //bgm.setVolume(0.2);
        }

        var block = {};

        // 预设人物占位
        if (privates.data.actors) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = privates.data.actors[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var actor = _step3.value;

              block[actor.x * 10000 + actor.y] = true;
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }

        // 生成怪物
        if (privates.data.spawnMonster && privates.data.spawnMonster.list && privates.data.spawnMonster.count) {
          for (var i = 0, len = privates.data.spawnMonster.count; i < len; i++) {
            var monsterId = null;
            var prob = 0;
            var r = Math.random();
            for (var key in privates.data.spawnMonster.list) {
              prob += privates.data.spawnMonster.list[key];
              if (r < prob) {
                monsterId = key;
                break;
              }
            }
            if (!monsterId) {
              monsterId = Object.keys(privates.data.spawnMonster.list)[0];
            }
            Game.Actor.load(monsterId).then(function (actorObj) {
              var x = undefined,
                  y = undefined;
              while (true) {
                x = Sprite.rand(0, _this2.col);
                y = Sprite.rand(0, _this2.row);
                if (!_this2.hitTest(x, y) && !block[x * 10000 + y]) {
                  break;
                }
              }
              block[x * 10000 + y] = true;
              actorObj.x = x;
              actorObj.y = y;
              Game.area.actors.add(actorObj);
              actorObj.draw();
            });
          }
        }

        if (privates.data.spawnItem && privates.data.spawnItem.list && privates.data.spawnItem.count) {
          var _loop = function _loop(i, len) {
            var itemId = null;
            var prob = 0;
            var r = Math.random();
            for (var key in privates.data.spawnItem.list) {
              prob += privates.data.spawnItem.list[key];
              if (r < prob) {
                itemId = key;
                break;
              }
            }
            if (!itemId) {
              itemId = Object.keys(privates.data.spawnItem.list)[0];
            }
            Game.Item.load(itemId).then(function (itemObj) {
              var x = undefined,
                  y = undefined;
              while (true) {
                x = Sprite.rand(0, _this2.col);
                y = Sprite.rand(0, _this2.row);
                if (!_this2.hitTest(x, y) && !block[x * 10000 + y]) {
                  break;
                }
              }
              block[x * 10000 + y] = true;
              itemObj.x = x;
              itemObj.y = y;
              itemObj.inner = {};
              itemObj.inner[itemId] = 1;
              Game.area.items.add(itemObj);
              itemObj.draw();
            });
          };

          for (var i = 0, len = privates.data.spawnItem.count; i < len; i++) {
            _loop(i, len);
          }
        }
      }
    }, {
      key: "data",
      get: function get() {
        return internal(this).data;
      },
      set: function set(value) {
        throw new Error("Game.Map.data readonly");
      }
    }, {
      key: "id",
      get: function get() {
        return internal(this).id;
      },
      set: function set(value) {
        throw new Error("Game.Map.id readonly");
      }
    }, {
      key: "width",
      get: function get() {
        return this.data.width * this.data.tilewidth;
      },
      set: function set(value) {
        throw new Error("Game.Map.width readonly");
      }
    }, {
      key: "height",
      get: function get() {
        return this.data.height * this.data.tileheight;
      },
      set: function set(value) {
        throw new Error("Game.Map.height readonly");
      }
    }, {
      key: "col",
      get: function get() {
        // width / tilewidth
        return this.data.width;
      },
      set: function set(value) {
        throw new Error("Game.Map.col readonly");
      }
    }, {
      key: "row",
      get: function get() {
        // height / tileheight
        return this.data.height;
      },
      set: function set(value) {
        throw new Error("Game.Map.row readonly");
      }
    }, {
      key: "minimap",
      get: function get() {
        return internal(this).minimap;
      },
      set: function set(value) {
        throw new Error("Game.Map.minimap readonly");
      }
    }]);

    return GameMap;
  })(Sprite.Event));
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  Game.assign("Quest", (function () {
    function GameQuest() {
      _classCallCheck(this, GameQuest);
    }

    _createClass(GameQuest, null, [{
      key: "load",
      value: function load(id) {
        return new Promise(function (resolve, reject) {
          Sprite.load("quest/" + id + ".js").then(function (data) {
            var questData = data[0]();
            questData.id = id;
            resolve(questData);
          });
        });
      }
    }, {
      key: "isComplete",
      value: function isComplete(quest) {
        if (quest.target) {
          if (quest.target.kill) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = quest.target.kill[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var k = _step.value;

                if (k.current < k.need) {
                  return false;
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          }
        }

        return true;
      }
    }]);

    return GameQuest;
  })());
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  Game.assign("Item", (function (_Sprite$Event) {
    _inherits(GameItem, _Sprite$Event);

    _createClass(GameItem, null, [{
      key: "load",
      value: function load(id) {
        return new Promise(function (resolve, reject) {
          Sprite.load("item/" + id + ".js").then(function (data) {
            var itemData = data[0]();
            itemData.id = id;
            var itemObj = new Game.Item(itemData);
            Game.items[id] = itemObj;
            itemObj.on("complete", function () {
              resolve(itemObj);
            });
          });
        });
      }
    }]);

    function GameItem(itemData) {
      _classCallCheck(this, GameItem);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GameItem).call(this));

      var privates = internal(_this);

      privates.data = itemData;
      privates.inner = null;

      if (!_this.data.x || !_this.data.y) {
        _this.data.x = 0;
        _this.data.y = 0;
      }

      if (_this.data.image) {
        Sprite.load("item/" + _this.data.image).then(function (data) {
          var image = data[0];
          privates.icon = image;

          privates.bitmap = new Sprite.Bitmap(image);
          privates.bitmap.x = _this.data.x * 32 + 16;
          privates.bitmap.y = _this.data.y * 32 + 16;
          privates.bitmap.name = _this.id;

          if (Number.isInteger(_this.data.centerX) && Number.isInteger(_this.data.centerY)) {
            privates.bitmap.centerX = _this.data.centerX;
            privates.bitmap.centerY = _this.data.centerY;
          } else {
            console.log(_this.data);
            throw new Error("Game.Item invalid centerX/centerY");
          }

          // 发送完成事件，第二个参数代表一次性事件
          _this.emit("complete", true);
        });
      } else {
        _this.emit("complete", true);
      }
      return _this;
    }

    _createClass(GameItem, [{
      key: "hitTest",
      value: function hitTest(x, y) {
        if (this.data.hitArea && this.data.hitArea instanceof Array) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this.data.hitArea[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var p = _step.value;

              if (x == this.x + p[0] && y == this.y + p[1]) {
                return true;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return false;
        } else {
          console.error(this.data);
          throw new Error("Game.Actor.hitTest invalid data");
        }
      }
    }, {
      key: "heroUse",
      value: function heroUse() {
        if (this.inner) {
          if (this.data.pickupCondition) {
            if (this.data.pickupCondition()) {
              Game.windows.pickup.open(this);
            } else {
              // 不符合条件
            }
          } else {
              Game.windows.pickup.open(this);
            }
        }

        if (typeof this.data.use == "function") {
          this.data.use();
        }

        if (this.data.type == "potion") {
          for (var attribute in this.data.potion) {
            var effect = this.data.potion[attribute];
            if (attribute == "hp") {
              (function () {
                Game.hero.data.hp = Math.min(Game.hero.data.hp + effect, Game.hero.data.$hp);
                var text = new Sprite.Text({
                  text: "hp+" + effect,
                  color: "black",
                  fontSize: 20
                });
                text.centerX = Math.floor(text.width / 2);
                text.centerY = Math.floor(text.height);
                text.x = Game.hero.sprite.x;
                text.y = Game.hero.sprite.y;
                Game.layers.actorLayer.appendChild(text);
                Sprite.Ticker.whiles(100, function (last) {
                  text.y -= 3;
                  if (last) {
                    Game.layers.actorLayer.removeChild(text);
                  }
                });
              })();
            }
          }
          Game.hero.data.items[this.id]--;
          if (Game.hero.data.items[this.id] <= 0) {
            delete Game.hero.data.items[this.id];
          }
        } // potion
      }
    }, {
      key: "erase",
      value: function erase(layer) {
        Game.layers.itemLayer.removeChild(internal(this).bitmap);
      }
    }, {
      key: "draw",
      value: function draw() {
        Game.layers.itemLayer.appendChild(internal(this).bitmap);
      }
    }, {
      key: "id",
      get: function get() {
        return internal(this).data.id;
      },
      set: function set(value) {
        throw new Error("Game.Item.id readonly");
      }
    }, {
      key: "icon",
      get: function get() {
        if (internal(this).bitmap) {
          return internal(this).bitmap.image;
        }
        return null;
      },
      set: function set(value) {
        throw new Error("Game.Item.icon readonly");
      }
    }, {
      key: "data",
      get: function get() {
        return internal(this).data;
      },
      set: function set(value) {
        console.error(this);
        throw new Error("Game.Item.data readonly");
      }
    }, {
      key: "inner",
      get: function get() {
        return internal(this).inner;
      },
      set: function set(value) {
        internal(this).inner = value;
      }
    }, {
      key: "x",
      get: function get() {
        return internal(this).data.x;
      },
      set: function set(value) {
        var privates = internal(this);
        privates.data.x = value;
        privates.bitmap.x = value * 32 + 16;
      }
    }, {
      key: "y",
      get: function get() {
        return internal(this).data.y;
      },
      set: function set(value) {
        var privates = internal(this);
        privates.data.y = value;
        privates.bitmap.y = value * 32 + 16;
      }
    }, {
      key: "visible",
      get: function get() {
        return internal(this).bitmap.visible;
      },
      set: function set(value) {
        internal(this).bitmap.visible = value;
      }
    }, {
      key: "alpha",
      get: function get() {
        return internal(this).bitmap.alpha;
      },
      set: function set(value) {
        if (Number.isFinite(value) && value >= 0 && value <= 1) {
          internal(this).bitmap.alpha = value;
        } else {
          console.error(value, this);
          throw new Error("Game.Item.alpha got invalid value");
        }
      }
    }, {
      key: "position",
      get: function get() {
        return {
          x: this.x,
          y: this.y
        };
      },
      set: function set(value) {
        console.error(this.data);
        throw new Error("Game.Item.position readonly");
      }
    }]);

    return GameItem;
  })(Sprite.Event));
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  Game.assign("Skill", (function (_Sprite$Event) {
    _inherits(GameSkill, _Sprite$Event);

    _createClass(GameSkill, null, [{
      key: "load",
      value: function load(id) {
        return new Promise(function (resolve, reject) {
          Sprite.load("skill/" + id + ".js").then(function (data) {
            var skillData = data[0]();
            var skillObj = new Game.Skill(skillData);
            Game.skills[id] = skillObj;
            skillObj.on("complete", function () {
              resolve(skillObj);
            });
          });
        });
      }
    }]);

    function GameSkill(skillData) {
      _classCallCheck(this, GameSkill);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GameSkill).call(this));

      var privates = internal(_this);
      privates.data = skillData;

      Sprite.load("skill/" + _this.data.image, "skill/" + _this.data.icon, "skill/" + _this.data.sound).then(function (data) {
        var image = data[0];
        privates.icon = data[1];
        privates.sound = data[2];

        var sheet = new Sprite.Sheet({
          images: [image],
          width: _this.data.tilewidth,
          height: _this.data.tileheight,
          animations: _this.data.animations
        });

        sheet.centerX = Math.floor(_this.data.tilewidth / 2);
        sheet.centerY = Math.floor(_this.data.tileheight / 2);

        if (_this.data.alpha) {
          sheet.alpha = _this.data.alpha;
        }

        privates.sprite = sheet;

        // 发送完成事件，第二个参数代表一次性事件
        _this.emit("complete", true);
      });
      return _this;
    }

    _createClass(GameSkill, [{
      key: "fire",
      value: function fire(attacker, direction, callback) {
        var _this2 = this;

        var privates = internal(this);

        if (privates.sound) {
          privates.sound.load();
          privates.sound.play();
        }

        var animation = "attack" + direction;
        var weaponAnimation = this.data.animations[animation];
        var sprite = privates.sprite.clone();

        // 矫正武器效果位置
        sprite.x = attacker.facePosition.x * 32 + 16;
        sprite.y = attacker.facePosition.y * 32 + 16;

        // 矫正武器效果中心
        if (Number.isFinite(weaponAnimation.centerX) && Number.isFinite(weaponAnimation.centerY)) {
          sprite.centerX = weaponAnimation.centerX;
          sprite.centerY = weaponAnimation.centerY;
        } else {
          console.error(weaponAnimation, this.data);
          throw new Error("Game.Skill.fire invalid centerX/centerY");
        }

        // 如果是远距离攻击（this.data.distance > 0），那么distance是它已经走过的距离
        var distance = 0;
        // 被命中的actor列表
        var hitted = [];
        var CheckHit = function CheckHit() {
          // 技能所在当前方格
          var l1 = Game.area.map.tile(sprite.x, sprite.y);
          // 碰撞检测
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Game.area.actors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var actor = _step.value;

              if (actor != attacker && hitted.length <= 0) {
                if (actor.hitTest(l1.x, l1.y)) {
                  hitted.push(actor);
                }
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        };

        var listener = Sprite.Ticker.on("tick", function () {

          if (_this2.data.distance > 0) {
            // 飞行速度是4
            distance += 4;
          }

          switch (animation) {
            case "attackdown":
              sprite.y += distance;
              break;
            case "attackleft":
              sprite.x -= distance;
              break;
            case "attackright":
              sprite.x += distance;
              break;
            case "attackup":
              sprite.y -= distance;
              break;
          }

          CheckHit();

          // 测试碰撞到墙
          var grid = Game.area.map.tile(sprite.x, sprite.y);
          if (Game.area.map.hitTest(grid.x, grid.y)) {
            Finish();
          }

          // 如果击中了一个敌人（单体伤害）
          if (hitted.length > 0) {
            Finish();
          }

          // 如果是远程攻击，并且攻击距离已经到了
          if (_this2.data.distance > 0 && distance >= _this2.data.distance) {
            Finish();
          }
        });

        // 攻击结束时运行Stop函数
        var Finish = function Finish() {
          Sprite.Ticker.off("tick", listener);

          if (hitted.length > 0 && _this2.data.animations["hitted"]) {
            var actor = hitted[0];
            sprite.x = actor.sprite.x;
            sprite.y = actor.sprite.y;
            sprite.play("hitted");
            if (sprite.paused == true) {
              Game.layers.skillLayer.removeChild(sprite);
            } else {
              sprite.on("animationend", function () {
                Game.layers.skillLayer.removeChild(sprite);
              });
            }
          } else {
            // 如果动画已经播完，则停止
            if (sprite.paused == true) {
              Game.layers.skillLayer.removeChild(sprite);
            } else {
              sprite.on("animationend", function () {
                Game.layers.skillLayer.removeChild(sprite);
              });
            }
          }

          if (callback) {
            callback(hitted);
          }
        };

        Game.layers.skillLayer.appendChild(sprite);
        sprite.play(animation);

        if (this.data.animations[animation].actor && attacker.data.animations[this.data.animations[animation].actor]) {
          attacker.play(this.data.animations[animation].actor, 3);
        } else {
          attacker.play("face" + direction, 0);
          attacker.play("attack" + direction, 3);
        }
      }
    }, {
      key: "id",
      get: function get() {
        return internal(this).data.id;
      },
      set: function set(value) {
        throw new Error("Game.Skill.id readonly");
      }
    }, {
      key: "icon",
      get: function get() {
        return internal(this).icon;
      },
      set: function set(value) {
        throw new Error("Game.Skill.icon readonly");
      }
    }, {
      key: "data",
      get: function get() {
        return internal(this).data;
      },
      set: function set(value) {
        console.error(this);
        throw new Error("Game.Skill.data readonly");
      }
    }, {
      key: "power",
      get: function get() {
        if (Number.isFinite(this.data.power)) {
          // 固定伤害
          return this.data.power;
        } else if (typeof this.data.power == "string") {
          // 骰子伤害，例如1d5就是投一个五面骰子，数值在1到5之间
          var m = this.data.power.match(/(\d+)d(\d+)/);
          if (!m) {
            console.error(this.data.power, this.data);
            throw new Error("Sprite.Skill got invalid power data");
          }
          var times = parseInt(m[1]);
          var dice = parseInt(m[2]);
          var sum = 0;
          for (var i = 0; i < times; i++) {
            sum += Sprite.rand(0, dice) + 1;
          }
          return sum;
        } else {
          console.error(this.data.power, this.data);
          throw new Error("Game.Skill.power invalid power");
        }
      },
      set: function set(value) {
        throw new Error("Game.Skill.power readonly");
      }
    }, {
      key: "type",
      get: function get() {
        return this.data.type;
      },
      set: function set(value) {
        throw new Error("Game.Skill.type readonly");
      }
    }]);

    return GameSkill;
  })(Sprite.Event));
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /*
    角色类，包括涉及到hero和npc
    属性：
      this.sprite 精灵
  */
  Game.assign("Actor", (function (_Sprite$Event) {
    _inherits(Actor, _Sprite$Event);

    _createClass(Actor, null, [{
      key: "load",
      value: function load(id) {
        return new Promise(function (resolve, reject) {
          Sprite.load("actor/" + id + ".js").then(function (data) {
            var actorData = data[0]();
            actorData.id = id;

            var actorObj = null;
            if (actorData.type == "npc") {
              actorObj = new Game.ActorNPC(actorData);
            } else if (actorData.type == "monster") {
              actorObj = new Game.ActorMonster(actorData);
            } else if (actorData.type == "ally") {
              actorObj = new Game.ActorAlly(actorData);
            } else if (actorData.type == "pet") {
              actorObj = new Game.ActorPet(actorData);
            } else {
              console.error(actorData.type, actorData);
              throw new Error("Game.Actor.load invalid actor type");
            }
            actorObj.on("complete", function () {
              resolve(actorObj);
            });
          });
        });
      }
    }]);

    function Actor(actorData) {
      _classCallCheck(this, Actor);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Actor).call(this));

      var privates = internal(_this);

      privates.data = actorData;

      _this.makeInfoBox();

      if (_this.data.image instanceof Array) {
        _this.init(_this.data.image);
      } else if (typeof _this.data.image == "string") {
        Sprite.load("actor/" + _this.data.image).then(function (data) {
          // data is Array
          _this.init(data);
        });
      } else {
        console.error(_this.id, _this.data, _this.data.image, _this);
        throw new Error("Invalid Actor Image");
      }
      return _this;
    }

    _createClass(Actor, [{
      key: "init",
      value: function init(images) {
        var _this2 = this;

        var privates = internal(this);
        var data = privates.data;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var image = _step.value;

            if (!(image instanceof Image) && !(image.getContext && image.getContext("2d"))) {
              console.error(image, images, this);
              throw new Error("Game.Actor got invalid image, not Image or Canvas");
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        ;

        var sprite = new Sprite.Sheet({
          images: images, // images is Array
          width: data.tilewidth,
          height: data.tileheight,
          animations: data.animations
        });

        if (Number.isInteger(data.centerX) && Number.isInteger(data.centerY)) {
          sprite.centerX = data.centerX;
          sprite.centerY = data.centerY;
        } else {
          console.log(data);
          throw new Error("Game.Actor invalid centerX/centerY");
        }

        sprite.play("facedown");
        privates.sprite = sprite;

        sprite.on("change", function () {
          privates.infoBox.x = sprite.x;
          privates.infoBox.y = sprite.y - sprite.centerY - 20;
        });

        var completeCount = -1;
        var Complete = function Complete() {
          completeCount++;
          if (completeCount >= 0) {
            _this2.calculate();
            _this2.refreshBar();
            _this2.emit("complete", true);
          }
        };

        // 加载NPC可能有的任务
        if (data.quest) {
          privates.quest = [];
          privates.quest.length = data.quest.length;
          data.quest.forEach(function (questId, index) {
            completeCount--;

            Game.Quest.load(questId).then(function (questData) {
              privates.quest.push(questData);
              Complete();
            });
          });
        }

        // 加载人物技能
        if (data.skills) {
          data.skills.forEach(function (skillId) {
            completeCount--;
            Game.Skill.load(skillId).then(function () {
              Complete();
            });
          });
        }

        // 加载人物装备（暂时只有玩家）
        if (data.equipment) {
          for (var key in data.equipment) {
            var itemId = data.equipment[key];
            if (itemId) {
              completeCount--;
              Game.Item.load(itemId).then(function () {
                Complete();
              });
            }
          }
        }

        // 加载人物物品
        if (data.items) {
          for (var itemId in data.items) {
            completeCount--;
            Game.Item.load(itemId).then(function () {
              Complete();
            });
          }
        }

        Complete();
      }
    }, {
      key: "popup",
      value: function popup(text) {
        Game.popup(this.sprite, text, 0, -50);
      }
    }, {
      key: "makeInfoBox",
      value: function makeInfoBox() {
        var privates = internal(this);
        // 名字
        var text = new Sprite.Text({
          text: privates.data.name,
          maxWidth: 200,
          color: "white",
          fontSize: 12
        });
        text.centerY = Math.floor(text.height / 2);
        text.centerX = Math.floor(text.width / 2);
        text.x = 0;
        text.y = 0;

        // 一个上面四个精神条、血条的聚合，统一管理放入这个Container
        privates.infoBox = new Sprite.Container();

        if (privates.data.type != "hero") {
          // 血条外面的黑框
          var hpbarBox = new Sprite.Shape();
          hpbarBox.centerX = 15;
          hpbarBox.centerY = 2;
          hpbarBox.x = 0;
          hpbarBox.y = 9;

          // 魔法条外面的黑框
          var mpbarBox = new Sprite.Shape();
          mpbarBox.centerX = 15;
          mpbarBox.centerY = 2;
          mpbarBox.x = 0;
          mpbarBox.y = 12;

          hpbarBox.rect({
            x: 0,
            y: 0,
            width: 30,
            height: 3,
            "fill-opacity": 0
          });

          mpbarBox.rect({
            x: 0,
            y: 0,
            width: 30,
            height: 3,
            "fill-opacity": 0
          });

          // 生命条
          privates.hpbar = new Sprite.Shape();
          privates.hpbar.centerX = 15;
          privates.hpbar.centerY = 2;
          privates.hpbar.x = 0;
          privates.hpbar.y = 9;

          // 精力条
          privates.mpbar = new Sprite.Shape();
          privates.mpbar.centerX = 15;
          privates.mpbar.centerY = 2;
          privates.mpbar.x = 0;
          privates.mpbar.y = 12;

          privates.infoBox.appendChild(text, hpbarBox, mpbarBox, privates.hpbar, privates.mpbar);
        }
      }
    }, {
      key: "calculate",
      value: function calculate() {
        var data = internal(this).data;
        if (data.$str && data.$dex && data.$con && data.$int && data.$cha) {

          data.str = data.$str;
          data.dex = data.$dex;
          data.con = data.$con;
          data.int = data.$int;
          data.cha = data.$cha;

          // 然后可以针对一级属性计算buff

          // 计算完一级属性的buff之后，开始计算二级属性

          data.$hp = data.con * 5;
          data.$sp = data.int * 5;

          data.atk = Math.floor(data.str * 0.25);
          data.matk = Math.floor(data.int * 0.25);
          data.def = 0;
          data.mdef = 0;
          data.critical = data.dex * 0.005;
          data.dodge = data.dex * 0.005;

          // 然后可以对二级属性计算buff

          // 对二级属性计算完buff之后，可以计算会变动的值
          // 例如.$hp是buff之后的生命值上限，.hp是当前生命值
          data.hp = data.$hp;
          data.sp = data.$sp;

          if (data.buff && data.nerf) {
            data.buff.forEach(function (element) {});
            data.nerf.forEach(function (element) {});
          }
        }
      }
    }, {
      key: "refreshBar",
      value: function refreshBar() {
        var privates = internal(this);

        if (privates.hpbar && privates.mpbar) {
          var hpcolor = "green";
          if (this.data.hp / this.data.$hp < 0.25) hpcolor = "red";else if (this.data.hp / this.data.$hp < 0.5) hpcolor = "yellow";

          privates.hpbar.clear().rect({
            x: 1,
            y: 1,
            width: Math.floor(this.data.hp / this.data.$hp * 28),
            height: 2,
            fill: hpcolor,
            "stroke-width": 0
          });

          privates.mpbar.clear().rect({
            x: 1,
            y: 1,
            width: Math.floor(this.data.sp / this.data.$sp * 28),
            height: 2,
            fill: "blue",
            "stroke-width": 0
          });
        }
      }
    }, {
      key: "distance",
      value: function distance() {
        var x = null,
            y = null;
        if (arguments.length == 2 && Number.isFinite(arguments[0]) && Number.isFinite(arguments[1])) {
          x = arguments[0];
          y = arguments[1];
        } else if (arguments.length == 1 && Number.isFinite(arguments[0].x) && Number.isFinite(arguments[0].y)) {
          x = arguments[0].x;
          y = arguments[0].y;
        } else {
          console.error(arguments);
          throw new Error("Game.Actor.distance Invalid arguments");
        }
        var d = 0;
        d += Math.pow(this.x - x, 2);
        d += Math.pow(this.y - y, 2);
        d = Math.sqrt(d);
        return d;
      }
    }, {
      key: "decreaseHP",
      value: function decreaseHP(power) {
        this.data.hp -= power;
        this.refreshBar();
      }
    }, {
      key: "decreaseSP",
      value: function decreaseSP(sp) {
        this.data.sp -= sp;
        this.refreshBar();
      }
    }, {
      key: "dead",
      value: function dead(attacker) {
        var _this3 = this;

        if (this.data.hp <= 0) {
          if (this.data.type == "hero") {
            Game.windows.over.open("你被" + attacker.data.name + "打死了");
          } else {
            (function () {

              _this3.erase();
              Game.area.actors.delete(_this3);

              var items = _this3.data.items || { gold: 1 };

              Game.addBag(_this3.x, _this3.y).then(function (bag) {
                for (var itemId in items) {
                  if (bag.inner.hasOwnProperty(itemId)) {
                    bag.inner[itemId] += items[itemId];
                  } else {
                    bag.inner[itemId] = items[itemId];
                  }
                }
              });

              attacker.emit("kill", false, _this3);
            })();
          }
        }
      }

      /** 闪一闪人物，例如被击中时的效果 */

    }, {
      key: "flash",
      value: function flash() {
        var _this4 = this;

        this.sprite.alpha = 0.5;
        Sprite.Ticker.after(10, function () {
          _this4.sprite.alpha = 1;
        });
      }

      /** 受到attacker的skill技能的伤害 */

    }, {
      key: "damage",
      value: function damage(attacker, skill) {

        this.emit("damaged");

        var power = skill.power;
        var type = skill.type;

        var color = "white";
        if (this.data.type == "hero") {
          color = "red";
        }

        if (type == "normal") {
          power += attacker.data.atk;
          power -= this.data.def;
          power = Math.max(0, power);
        } else {
          // type == magic
          power += attacker.data.matk;
          power - this.data.mdef;
          power = Math.max(0, power);
        }

        var text = null;
        var state = null;

        if (Math.random() < this.data.dodge) {
          // 闪避了
          state = "dodge";
          text = new Sprite.Text({
            text: "miss",
            color: color,
            fontSize: 16
          });
        } else if (Math.random() < attacker.data.critical) {
          // 重击了
          state = "critical";
          power *= 2;
          text = new Sprite.Text({
            text: "-" + power,
            color: color,
            fontSize: 32
          });
          this.flash();
          this.decreaseHP(power);
        } else {
          // 普通击中
          state = "hit";
          text = new Sprite.Text({
            text: "-" + power,
            color: color,
            fontSize: 16
          });
          this.flash();
          this.decreaseHP(power);
        }

        if (state != "dodge" && this != Game.hero) {
          if (Game.sounds.hurt) {
            Game.sounds.hurt.load();
            Game.sounds.hurt.volume = 0.2;
            Game.sounds.hurt.play();
          }
        }

        text.centerX = Math.floor(text.width / 2);
        text.centerY = Math.floor(text.height);
        text.x = this.sprite.x;
        text.y = this.sprite.y;

        text.x += Sprite.rand(-10, 10);

        Game.layers.actorLayer.appendChild(text);

        var speed = Sprite.rand(1, 3);

        Sprite.Ticker.whiles(100, function (last) {
          text.y -= speed;
          if (last) {
            Game.layers.actorLayer.removeChild(text);
          }
        });

        // 测试是否死亡
        this.dead(attacker);
      }

      /** 播放一个动画 */

    }, {
      key: "play",
      value: function play(animation, priority) {
        // 新动画默认优先级为0
        if (!Number.isFinite(priority)) {
          priority = 0;
        }

        // 无动画或者停止状态，现有优先级为-1（最低级）
        if (typeof this.animationPriority == "undefined" || this.sprite.paused == true) {
          this.animationPriority = -1;
        }

        if (this.data.animations.hasOwnProperty(animation) && priority >= this.animationPriority && animation != this.sprite.currentAnimation) {
          this.animationPriority = priority;
          this.sprite.play(animation);
        }
      }

      /** 停止 */

    }, {
      key: "stop",
      value: function stop() {
        if (!this.sprite.currentAnimation) return;

        if (this.sprite.paused && !this.sprite.currentAnimation.match(/face/) || this.sprite.currentAnimation.match(/walk|run/)) {
          switch (this.direction) {
            case "up":
              this.sprite.play("faceup");
              break;
            case "down":
              this.sprite.play("facedown");
              break;
            case "left":
              this.sprite.play("faceleft");
              break;
            case "right":
              this.sprite.play("faceright");
              break;
          }
        }
      }

      /** 向指定direction方向释放一个技能 */

    }, {
      key: "fire",
      value: function fire(id, direction) {
        var _this5 = this;

        // 同一时间只能施展一个skill
        if (this.attacking) return 0;

        var skill = Game.skills[id];
        if (!skill) return 0;

        // 只有当这个skill的cooldown结
        var now = new Date().getTime();
        if (Number.isFinite(this.lastAttack) && Number.isFinite(this.lastAttackCooldown) && now - this.lastAttack < this.lastAttackCooldown) {
          return 0;
        }

        if (skill.data.cost > this.data.sp) {
          return 0;
        }

        if (!direction) {
          direction = this.direction;
        }

        if ( // 玩家使用技能是可能有条件的，例如剑技能需要装备剑
        this.type == "hero" && skill.data.condition && skill.data.condition() == false) {
          return 0;
        }

        this.lastAttack = now;
        this.lastAttackCooldown = skill.data.cooldown;
        this.attacking = true;

        if (this.going) {
          this.going = false;
        }

        Game.Input.clearDest();

        this.data.sp -= skill.data.cost;
        this.refreshBar();

        skill.fire(this, direction, function (hitted) {
          _this5.attacking = false;
          if (hitted.length > 0) {
            hitted[0].damage(_this5, skill);
          }
          _this5.emit("change");
        });

        return skill.data.cooldown;
      }

      /** 行走到指定地点 */

    }, {
      key: "goto",
      value: function goto(x, y, state) {
        var _this6 = this;

        return new Promise(function (resolve, reject) {

          if (_this6.going) {
            _this6.goingNext = function () {
              _this6.goto(x, y, state).then(resolve);
            };
            return false;
          }

          var destBlocked = _this6.checkCollision(x, y);

          if (destBlocked) {
            if (_this6.x == x) {
              if (_this6.y - y == -1) {
                _this6.stop();
                _this6.face("down");
                resolve();
                return false;
              } else if (_this6.y - y == 1) {
                _this6.stop();
                _this6.face("up");
                resolve();
                return false;
              }
            } else if (_this6.y == y) {
              if (_this6.x - x == -1) {
                _this6.stop();
                _this6.face("right");
                resolve();
                return false;
              } else if (_this6.x - x == 1) {
                _this6.stop();
                _this6.face("left");
                resolve();
                return false;
              }
            }
          }

          var positionChoice = [];
          // 上下左右
          if (_this6.checkCollision(x, y - 1) == false) {
            positionChoice.push({ x: x, y: y - 1, after: "down" });
          }
          if (_this6.checkCollision(x, y + 1) == false) {
            positionChoice.push({ x: x, y: y + 1, after: "up" });
          }
          if (_this6.checkCollision(x - 1, y) == false) {
            positionChoice.push({ x: x - 1, y: y, after: "right" });
          }
          if (_this6.checkCollision(x + 1, y) == false) {
            positionChoice.push({ x: x + 1, y: y, after: "left" });
          }

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = positionChoice[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var element = _step2.value;
              // 计算地址距离
              element.distance = _this6.distance(element.x, element.y);
            }

            // 按照地址的距离从近到远排序（从小到大）
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          positionChoice.sort(function (a, b) {
            return a.distance - b.distance;
          });

          // 如果真正的目的地有可能走，插入到第一位，写在这里是因为目的地并不一定是distance最小的
          if (_this6.checkCollision(x, y) == false) {
            positionChoice.splice(0, 0, { x: x, y: y });
          }

          var index = 0;
          var otherChoice = false;

          var TestPosition = function TestPosition() {
            if (index < positionChoice.length) {
              (function () {
                var dest = positionChoice[index]; // 保存第一个选项
                index++;
                Game.Astar.getPath({ x: _this6.x, y: _this6.y }, dest).then(function (result) {
                  _this6.gettingPath = false;
                  if (_this6.goingNext) {
                    var c = _this6.goingNext;
                    _this6.goingNext = null;
                    _this6.going = false;
                    if (_this6 == Game.hero) {
                      Game.Input.clearDest();
                    }
                    c();
                    return;
                  }
                  if (_this6.going) {
                    return;
                  }
                  if (result) {
                    if (_this6 == Game.hero) {
                      Game.Input.setDest(dest.x, dest.y);
                    } else {
                      // not hero
                      if (result.length > 30) {
                        // too far
                        return;
                      }
                    }
                    _this6.gotoPath(result, state, dest.after).then(resolve);
                    return;
                  } else {
                    return TestPosition();
                  }
                });
              })();
            } else {
              if (otherChoice == false) {
                otherChoice = true;
                var otherPositionChoice = [];
                // 四个角
                if (_this6.checkCollision(x - 1, y - 1) == false) {
                  otherPositionChoice.push({ x: x - 1, y: y - 1, after: "right" });
                }
                if (_this6.checkCollision(x + 1, y - 1) == false) {
                  otherPositionChoice.push({ x: x + 1, y: y - 1, after: "left" });
                }
                if (_this6.checkCollision(x - 1, y + 1) == false) {
                  otherPositionChoice.push({ x: x - 1, y: y + 1, after: "right" });
                }
                if (_this6.checkCollision(x + 1, y + 1) == false) {
                  otherPositionChoice.push({ x: x + 1, y: y + 1, after: "left" });
                }
                // 四个远方向
                if (_this6.checkCollision(x, y - 2) == false) {
                  otherPositionChoice.push({ x: x, y: y - 2, after: "down" });
                }
                if (_this6.checkCollision(x, y + 2) == false) {
                  otherPositionChoice.push({ x: x, y: y + 2, after: "up" });
                }
                if (_this6.checkCollision(x - 2, y) == false) {
                  otherPositionChoice.push({ x: x - 2, y: y, after: "right" });
                }
                if (_this6.checkCollision(x + 2, y) == false) {
                  otherPositionChoice.push({ x: x + 2, y: y, after: "left" });
                }

                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                  for (var _iterator3 = otherPositionChoice[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var element = _step3.value;
                    // 计算地址距离
                    element.distance = _this6.distance(element.x, element.y);
                  }

                  // 按照地址的距离从近到远排序（从小到大）
                } catch (err) {
                  _didIteratorError3 = true;
                  _iteratorError3 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                      _iterator3.return();
                    }
                  } finally {
                    if (_didIteratorError3) {
                      throw _iteratorError3;
                    }
                  }
                }

                otherPositionChoice.sort(function (a, b) {
                  return a.distance - b.distance;
                });

                if (otherPositionChoice.length) {
                  index = 0;
                  positionChoice = otherPositionChoice;
                  TestPosition();
                }
              }
            } // 再次尝试离地点最近的地点
          };

          return TestPosition();
        });
      }

      /**
       * 按照指定的path和state行走
       * 行走结束后如果after有定义，则面向after的方向
       */

    }, {
      key: "gotoPath",
      value: function gotoPath(path, state, after) {
        var _this7 = this;

        return new Promise(function (resolve, reject) {
          _this7.going = true;
          var index = 1;
          var Walk = function Walk() {
            if (Game.paused) {
              _this7.stop();
              _this7.going = false;
              if (_this7 == Game.hero) {
                Game.Input.clearDest();
              }
              return;
            }
            if (_this7.goingNext) {
              var c = _this7.goingNext;
              _this7.goingNext = null;
              _this7.going = false;
              if (_this7 == Game.hero) {
                Game.Input.clearDest();
              }
              c();
              return;
            }

            if (index < path.length) {
              var current = { x: _this7.x, y: _this7.y };
              var dest = path[index];
              var direction = null;
              if (dest.x == current.x) {
                if (dest.y > current.y) {
                  direction = "down";
                } else if (dest.y < current.y) {
                  direction = "up";
                }
              } else if (dest.y == current.y) {
                if (dest.x > current.x) {
                  direction = "right";
                } else if (dest.x < current.x) {
                  direction = "left";
                }
              }

              if (direction) {
                var currentDirection = _this7.direction;
                if (direction != currentDirection) {
                  _this7.stop();
                  _this7.face(direction);
                }
                _this7.go(state, direction).then(function () {
                  Walk();
                });
                index++;
              }
            } else {
              // 正常结束
              if (after) {
                _this7.stop();
                _this7.face(after);
              }
              if (_this7 == Game.hero) {
                Game.Input.clearDest();
              }
              _this7.going = false;
              resolve();
            }
          };
          Walk();
        });
      }

      /**
       * 让人物面向某个direction
       */

    }, {
      key: "face",
      value: function face(direction) {
        var animation = "face" + direction;
        if (this.animation != animation) {
          this.sprite.play(animation);
          this.emit("change");
        }
      }

      /**
       * 参数t中记录了某个方格的方位xy，测试这个方格是否和玩家有冲突
       * 返回true为有碰撞，返回false为无碰撞
       */

    }, {
      key: "checkCollision",
      value: function checkCollision(x, y) {
        // 地图边缘碰撞
        if (x < 0 || y < 0 || x >= Game.area.map.data.width || y >= Game.area.map.data.height) {
          return true;
        }
        // 地图碰撞
        if (Game.area.map.hitTest(x, y)) {
          return true;
        }

        // 角色碰撞
        if (Game.area.actors) {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = Game.area.actors[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var actor = _step4.value;

              if (actor != this && actor.hitTest(x, y)) {
                return true;
              }
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }

        // 地图上的物品碰撞
        if (Game.area.items) {
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = Game.area.items[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var item = _step5.value;

              if (item.hitTest(x, y)) {
                return true;
              }
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }
        }

        return false;
      }
    }, {
      key: "hitTest",

      /**
       * 测试人物碰撞
       */
      value: function hitTest(x, y) {
        if (this.data.hitArea && this.data.hitArea instanceof Array) {
          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = this.data.hitArea[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var p = _step6.value;

              if (x == this.x + p[0] && y == this.y + p[1]) {
                return true;
              }
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6.return) {
                _iterator6.return();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }

          return false;
        } else {
          console.error(this.data);
          throw new Error("Game.Actor.hitTest invalid data");
        }
      }

      /**
       * 用state的姿态（walk，run）向direction方向走
       * 如果人物现在不是direction方向的，优先转头
       */

    }, {
      key: "go",
      value: function go(state, direction) {
        var _this8 = this;

        return new Promise(function (resolve, reject) {
          if (Game.paused) {
            return;
          }

          // 如果正在战斗动画，则不走
          if (_this8.sprite.paused == false && _this8.sprite.currentAnimation.match(/skillcast|thrust|slash|shoot/)) {
            return;
          }

          if (_this8.walking) {
            return;
          }

          if (_this8.attacking) {
            return;
          }

          if (_this8.direction != direction) {
            _this8.walking = true;
            _this8.stop();
            _this8.face(direction);
            // wait 4 ticks
            Sprite.Ticker.after(4, function () {
              _this8.walking = false;
            });
            return;
          }

          var newPosition = _this8.facePosition;

          if (_this8.checkCollision(newPosition.x, newPosition.y) == false) {
            (function () {
              // 没碰撞，开始行走
              _this8.walking = true;

              // 把角色位置设置为新位置，为了占领这个位置，这样其他角色就会碰撞
              // 但是不能用this.x = newX这样设置，因为this.x的设置会同时设置this.sprite.x
              var oldX = _this8.data.x;
              var oldY = _this8.data.y;
              _this8.data.x = newPosition.x;
              _this8.data.y = newPosition.y;

              // walk
              // 这些数组和必须是32，为了保证一次go行走32个像素
              var speed = [3, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2]; // 和是32
              if (state == "run") {
                // speed = [6,7,6,7,6]; // 和是32
                speed = [4, 4, 4, 4, 4, 4, 4, 4]; // 和是32
              }

              var whilesId = Sprite.Ticker.whiles(speed.length, function (last) {
                if (Game.paused) {
                  _this8.data.x = oldX;
                  _this8.data.y = oldY;
                  _this8.walking = false;
                  _this8.emit("change");
                  Sprite.Ticker.clearWhiles(whilesId);
                  resolve();
                  return;
                }
                if (last) {
                  _this8.x = newPosition.x;
                  _this8.y = newPosition.y;
                  _this8.walking = false;
                  _this8.emit("change");
                  resolve();
                } else {
                  switch (direction) {
                    case "up":
                      _this8.sprite.y -= speed.pop();
                      break;
                    case "down":
                      _this8.sprite.y += speed.pop();
                      break;
                    case "left":
                      _this8.sprite.x -= speed.pop();
                      break;
                    case "right":
                      _this8.sprite.x += speed.pop();
                      break;
                  }
                }
              });

              // 播放行走动画
              _this8.play(state + direction, 1);
            })();
          }
        });
      }

      /** 在Game.actorLayer上删除人物 */

    }, {
      key: "erase",
      value: function erase() {
        var privates = internal(this);
        Game.layers.actorLayer.removeChild(this.sprite);
        Game.layers.infoLayer.removeChild(privates.infoBox);
      }

      /** 在Game.actorLayer上显示人物 */

    }, {
      key: "draw",
      value: function draw() {
        var privates = internal(this);
        if (Number.isInteger(this.x) && Number.isInteger(this.y)) {
          this.x = this.data.x;
          this.y = this.data.y;

          internal(this).infoBox.x = this.sprite.x;
          internal(this).infoBox.y = this.sprite.y - this.sprite.centerY - 20;

          Game.layers.actorLayer.appendChild(this.sprite);
          Game.layers.infoLayer.appendChild(privates.infoBox);
        } else {
          console.error(this.data.x, this.data.y, this.data);
          throw new Error("Game.Actor.draw invalid data.x/data.y");
        }
      }

      /** 镜头移动到中心为这个人物 */

    }, {
      key: "focus",
      value: function focus() {
        var privates = internal(this);
        privates.infoBox.x = this.sprite.x;
        privates.infoBox.y = this.sprite.y - this.sprite.centerY - 20;

        Game.stage.centerX = Math.round(this.sprite.x - Game.config.width / 2);
        Game.stage.centerY = Math.round(this.sprite.y - Game.config.height / 2);
      }
    }, {
      key: "data",
      get: function get() {
        var privates = internal(this);
        return privates.data;
      },
      set: function set(value) {
        throw new Error("Game.Actor.data readonly");
      }
    }, {
      key: "id",
      get: function get() {
        return internal(this).data.id;
      },
      set: function set(value) {
        throw new Error("Game.Actor.id readonly");
      }
    }, {
      key: "type",
      get: function get() {
        return internal(this).data.type;
      },
      set: function set(value) {
        throw new Error("Game.Actor.type readonly");
      }
    }, {
      key: "sprite",
      get: function get() {
        var privates = internal(this);
        return privates.sprite;
      },
      set: function set(value) {
        throw new Error("Game.Actor.sprite readonly");
      }
    }, {
      key: "quest",
      get: function get() {
        var privates = internal(this);
        if (privates.quest) {
          return privates.quest;
        } else {
          return null;
        }
      },
      set: function set(value) {
        throw new Error("Game.Actor.quests readonly");
      }
    }, {
      key: "x",
      get: function get() {
        return this.data.x;
      },
      set: function set(value) {
        if (Number.isFinite(value) && Number.isInteger(value)) {
          this.data.x = value;
          this.sprite.x = value * 32 + 16;
        } else {
          console.error(value, internal(this), this);
          throw new Error("Game.Actor got invalid x, x has to be a number and integer");
        }
      }
    }, {
      key: "y",
      get: function get() {
        return this.data.y;
      },
      set: function set(value) {
        if (Number.isFinite(value) && Number.isInteger(value)) {
          this.data.y = value;
          this.sprite.y = value * 32 + 16;
        } else {
          console.error(value, internal(this), this);
          throw new Error("Game.Actor got invalid y, y has to be a number and integer");
        }
      }
    }, {
      key: "visible",
      get: function get() {
        return this.sprite.visible;
      },
      set: function set(value) {
        this.sprite.visible = value;
        internal(this).infoBox.visible = value;
      }
    }, {
      key: "alpha",
      get: function get() {
        return this.sprite.alpha;
      },
      set: function set(value) {
        if (Number.isFinite(value) && value >= 0 && value <= 1) {
          this.sprite.alpha = value;
          internal(this).infoBox.alpha = value;
        } else {
          console.error(value, this);
          throw new Error("Game.Actor.alpha got invalid value");
        }
      }
    }, {
      key: "position",
      get: function get() {
        return {
          x: this.x,
          y: this.y
        };
      },
      set: function set(value) {
        throw new Error("Game.Actor.position readonly");
      }
    }, {
      key: "direction",
      get: function get() {
        return this.sprite.currentAnimation.match(/up|left|down|right/)[0];
      },
      set: function set(value) {
        throw new Error("Game.Actor.direction readonly");
      }
    }, {
      key: "facePosition",
      get: function get() {
        var p = this.position;
        switch (this.direction) {
          case "up":
            p.y -= 1;
            break;
          case "down":
            p.y += 1;
            break;
          case "left":
            p.x -= 1;
            break;
          case "right":
            p.x += 1;
            break;
        }
        return p;
      },
      set: function set(value) {
        throw new Error("Game.Actor.facePosition readonly");
      }
    }]);

    return Actor;
  })(Sprite.Event)); // Game.Actor
})();

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
    英雄类
    属性：
      this.sprite 精灵
  */
  Game.assign("ActorAlly", (function (_Game$Actor) {
    _inherits(GameActorAlly, _Game$Actor);

    function GameActorAlly(actorData) {
      _classCallCheck(this, GameActorAlly);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(GameActorAlly).call(this, actorData));
    }

    return GameActorAlly;
  })(Game.Actor));
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
    英雄类
    属性：
      this.sprite 精灵
  */
  Game.assign("ActorHero", (function (_Game$Actor) {
    _inherits(GameActorHero, _Game$Actor);

    function GameActorHero(actorData) {
      _classCallCheck(this, GameActorHero);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GameActorHero).call(this, actorData));

      var privates = internal(_this);
      privates.ai = null;
      privates.beAttacking = new Set();

      _this.on("kill", function (event) {
        var actor = event.data;

        if (_this.beAttacking.has(actor)) {
          _this.beAttacking.delete(actor);
        }

        if (actor.data.exp) {
          _this.data.exp += actor.data.exp;
        } else {
          _this.data.exp += 1;
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _this.data.currentQuest[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var quest = _step.value;

            if (quest.target && quest.target.kill) {
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = quest.target.kill[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var k = _step2.value;

                  if (actor.id == k.id && k.current < k.need) {
                    k.current++;
                  }
                }
              } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                  }
                } finally {
                  if (_didIteratorError2) {
                    throw _iteratorError2;
                  }
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      });

      _this.on("change", function () {
        _this.whenOnto();
        _this.whenTouch();
      });

      setInterval(function () {
        if (!Game.paused) {
          _this.whenOnto();
          _this.whenTouch();
        }
      }, 500);
      return _this;
    }

    _createClass(GameActorHero, [{
      key: "hasItem",
      value: function hasItem(id, count) {
        if (Number.isFinite(count) == false || count <= 0) {
          count = 1;
        }
        for (var key in this.data.items) {
          if (key == id) {
            if (this.data.items[key] >= count) {
              return true;
            } else {
              return false;
            }
          }
        }
        return false;
      }
    }, {
      key: "hasQuest",
      value: function hasQuest(id) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.data.currentQuest[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var quest = _step3.value;

            if (id == quest.id) {
              return true;
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = this.data.completeQuest[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var quest = _step4.value;

            if (id == quest.id) {
              return true;
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        return false;
      }
    }, {
      key: "damage",
      value: function damage(attacker, skill) {
        var _this2 = this;

        _get(Object.getPrototypeOf(GameActorHero.prototype), "damage", this).call(this, attacker, skill);

        // 如果英雄受到了伤害
        var touchActor = [];
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = Game.area.actors[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var actor = _step5.value;

            // 找到所有邻接英雄的怪物
            if (actor != this && actor.data.type == "monster" && actor.distance(this) == 1) {
              touchActor.push(actor);
            }
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        if (touchActor.length) {
          (function () {
            var faceAttacker = false;
            var facePosition = _this2.facePosition;
            touchActor.forEach(function (actor) {
              if (actor.hitTest(facePosition.x, facePosition.y)) {
                faceAttacker = true;
              }
            });
            // 如果英雄现在没面对任何一个邻接的怪物，面向它
            if (faceAttacker == false) {
              _this2.goto(touchActor[0].x, touchActor[0].y);
            }
          })();
        }
      }
    }, {
      key: "erase",
      value: function erase() {
        var privates = internal(this);
        _get(Object.getPrototypeOf(GameActorHero.prototype), "erase", this).call(this);

        if (privates.ai) {
          Sprite.Ticker.off("tick", privates.ai);
          privates.ai = null;
        }
      }
    }, {
      key: "refreshBar",
      value: function refreshBar() {
        _get(Object.getPrototypeOf(GameActorHero.prototype), "refreshBar", this).call(this);
        Game.windows.interface.status(this.data.hp / this.data.$hp, // 生命百分比
        this.data.sp / this.data.$sp // 精神力百分比
        );
      }
    }, {
      key: "draw",
      value: function draw() {
        var _this3 = this;

        var privates = internal(this);
        _get(Object.getPrototypeOf(GameActorHero.prototype), "draw", this).call(this);

        privates.ai = Sprite.Ticker.on("tick", function (event) {

          var tickCount = event.data;

          // 每秒16个tick
          if (tickCount % 16 == 0) {
            var barChanged = false;

            if (_this3.data.hp < _this3.data.$hp && _this3.beAttacking.size <= 0) {
              _this3.data.hp++;
              barChanged = true;
            }

            if (_this3.data.sp < _this3.data.$sp) {
              _this3.data.sp++;
              barChanged = true;
            }

            if (barChanged) {
              _this3.refreshBar();
              if (Game.windows.status.atop) {
                Game.windows.status.update();
              }
            }
          }
        });
      }
    }, {
      key: "gotoArea",
      value: function gotoArea(dest, x, y) {
        var privates = internal(this);
        privates.beAttacking = new Set();
        Game.pause();
        Game.windows.interface.hide();
        Game.windows.stage.hide();
        Game.windows.loading.begin();
        Game.windows.loading.update("20%");

        setTimeout(function () {

          Game.clearStage();
          Game.windows.loading.update("50%");

          setTimeout(function () {

            Game.loadArea(dest).then(function (area) {

              Game.area = area;
              Game.windows.loading.update("80%");

              setTimeout(function () {

                Game.hero.data.area = dest;
                Game.hero.draw();
                Game.hero.x = x;
                Game.hero.y = y;
                area.actors.add(Game.hero);

                area.map.draw();
                Game.windows.loading.update("100%");

                setTimeout(function () {

                  Game.hero.x = x;
                  Game.hero.y = y;
                  Game.hero.data.time += 60; // 加一小时
                  Game.windows.loading.end();
                  Game.windows.interface.datetime();
                  Game.windows.interface.refresh();
                  Game.start();

                  setTimeout(function () {

                    Game.stage.update();
                    Game.windows.stage.show();
                    Game.windows.interface.show();
                  }, 5);
                }, 5);
              }, 5);
            }); // loadArea
          }, 5);
        }, 5);
      }

      // 当玩家站到某个点的时候执行的命令

    }, {
      key: "whenOnto",
      value: function whenOnto() {
        if (!Game.area) return;
        if (!Game.area.onto) return;

        var heroPosition = Game.hero.position;
        var onto = null;

        var FindUnderHero = function FindUnderHero(element) {
          if (onto != null || element == Game.hero) {
            return;
          }
          if (element.hitTest && element.hitTest(heroPosition.x, heroPosition.y)) {
            onto = element;
            return;
          } else if (element.points) {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
              for (var _iterator6 = element.points[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var p = _step6.value;

                if (p.x == heroPosition.x && p.y == heroPosition.y) {
                  onto = element;
                  return;
                }
              }
            } catch (err) {
              _didIteratorError6 = true;
              _iteratorError6 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                  _iterator6.return();
                }
              } finally {
                if (_didIteratorError6) {
                  throw _iteratorError6;
                }
              }
            }
          } else if (Number.isFinite(element.x) && Number.isFinite(element.y) && element.x == heroPosition.x && element.y == heroPosition.y) {
            onto = element;
            return;
          }
        };
        // 找最近可“事件”人物 Game.area.actors
        Sprite.each(Game.area.onto, FindUnderHero);
        if (onto) {
          if (onto.execute) {
            onto.execute();
          }
        } // touch
      }

      // 当玩家站到或者接触到某个点时执行的命令

    }, {
      key: "whenTouch",
      value: function whenTouch() {
        if (!Game.area) return;
        if (!Game.area.touch) return;

        var heroPosition = Game.hero.position;
        var heroFace = Game.hero.facePosition;
        var touch = null;

        var FindUnderHero = function FindUnderHero(element) {
          if (touch != null || element == Game.hero) {
            return;
          }
          if (element.heroUse) {
            if (element.hitTest && element.hitTest(heroPosition.x, heroPosition.y)) {
              touch = element;
              return;
            } else if (element.points) {
              var _iteratorNormalCompletion7 = true;
              var _didIteratorError7 = false;
              var _iteratorError7 = undefined;

              try {
                for (var _iterator7 = element.points[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                  var p = _step7.value;

                  if (p.x == heroPosition.x && p.y == heroPosition.y) {
                    touch = element;
                    return;
                  }
                }
              } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion7 && _iterator7.return) {
                    _iterator7.return();
                  }
                } finally {
                  if (_didIteratorError7) {
                    throw _iteratorError7;
                  }
                }
              }
            } else if (Number.isFinite(element.x) && Number.isFinite(element.y) && element.x == heroPosition.x && element.y == heroPosition.y) {
              touch = element;
              return;
            }
          }
        };

        var FindFaceHero = function FindFaceHero(element) {
          if (touch != null || element == Game.hero) {
            return;
          }
          if (element.heroUse) {
            if (element.hitTest && element.hitTest(heroFace.x, heroFace.y)) {
              touch = element;
            } else if (element.points) {
              var _iteratorNormalCompletion8 = true;
              var _didIteratorError8 = false;
              var _iteratorError8 = undefined;

              try {
                for (var _iterator8 = element.points[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                  var p = _step8.value;

                  if (p.x == heroFace.x && p.y == heroFace.y) {
                    touch = element;
                    return;
                  }
                }
              } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion8 && _iterator8.return) {
                    _iterator8.return();
                  }
                } finally {
                  if (_didIteratorError8) {
                    throw _iteratorError8;
                  }
                }
              }
            } else if (Number.isFinite(element.x) && Number.isFinite(element.y) && element.x == heroFace.x && element.y == heroFace.y) {
              touch = element;
              return;
            }
          }
        };

        // 用FindUnderHero函数寻找到玩家当前格子的地点

        // 找最近可“事件”人物 Game.area.actors
        Sprite.each(Game.area.actors, FindUnderHero);
        // 找最近尸体 Game.area.bags
        Sprite.each(Game.area.bags, FindUnderHero);
        // 找最近物品 Game.area.items
        Sprite.each(Game.area.items, FindUnderHero);
        // 其他物品（由地图文件定义）
        Game.area.touch.forEach(FindUnderHero);

        // 用FindFaceHero寻找面对着玩家的格子地点

        // 找最近可“事件”人物 Game.area.actors
        Sprite.each(Game.area.actors, FindFaceHero);
        // 找最近尸体 Game.area.bags
        Sprite.each(Game.area.bags, FindFaceHero);
        // 找最近尸体 Game.area.items
        Sprite.each(Game.area.items, FindFaceHero);
        // 其他物品（由地图文件定义）
        Game.area.touch.forEach(FindFaceHero);
        // 水源
        if (!touch && Game.area.map.hitWater(heroFace.x, heroFace.y)) {
          touch = {
            type: "water",
            heroUse: function heroUse() {
              Game.choice({
                "喝水": "drink",
                "钓鱼": "fish"
              }).then(function (choice) {
                switch (choice) {
                  case "drink":
                    Game.hero.popup("drink");
                    break;
                  case "fish":
                    Game.hero.popup("fish");
                    break;
                }
              });
            }
          };
        }

        if (!touch) {
          Game.hintObject = null;
          Game.windows.interface.hideUse();
        } else {
          Game.hintObject = touch;
          Game.windows.interface.showUse();
        }
      }
    }, {
      key: "beAttacking",
      get: function get() {
        return internal(this).beAttacking;
      },
      set: function set(value) {
        throw new Error("Game.hero.beAttacking readonly");
      }
    }]);

    return GameActorHero;
  })(Game.Actor));
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
    英雄类
    属性：
      this.sprite 精灵
  */
  Game.assign("ActorMonster", (function (_Game$Actor) {
    _inherits(GameActorMonster, _Game$Actor);

    function GameActorMonster(actorData) {
      _classCallCheck(this, GameActorMonster);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GameActorMonster).call(this, actorData));

      var privates = internal(_this);
      privates.ai = null;
      privates.attacking = false;
      return _this;
    }

    _createClass(GameActorMonster, [{
      key: "damage",
      value: function damage(attacker, skill) {
        _get(Object.getPrototypeOf(GameActorMonster.prototype), "damage", this).call(this, attacker, skill);
        var privates = internal(this);

        if (privates.attacking == false) {
          this.goto(attacker.x, attacker.y, "walk");
        }
      }
    }, {
      key: "erase",
      value: function erase() {
        var privates = internal(this);
        _get(Object.getPrototypeOf(GameActorMonster.prototype), "erase", this).call(this);

        if (privates.ai) {
          Sprite.Ticker.off("tick", privates.ai);
          privates.ai = null;
        }
      }
    }, {
      key: "draw",
      value: function draw() {
        var _this2 = this;

        var privates = internal(this);
        _get(Object.getPrototypeOf(GameActorMonster.prototype), "draw", this).call(this);

        var dodo = Sprite.rand(30, 60);

        privates.ai = Sprite.Ticker.on("tick", function (event) {

          if (Game.paused) return;

          var tickCount = event.data;

          if (tickCount % 20 == 0) {
            var barChanged = false;

            if (_this2.data.hp < _this2.data.$hp && privates.attacking == false) {
              _this2.data.hp++;
              barChanged = true;
            }

            if (_this2.data.sp < _this2.data.$sp) {
              _this2.data.sp++;
              barChanged = true;
            }

            if (barChanged) {
              _this2.refreshBar();
            }
          }

          if (privates.attacking) {
            if (tickCount % dodo == 0) {
              if (Game.hero && _this2.facePosition.x == Game.hero.x && _this2.facePosition.y == Game.hero.y) {
                if (_this2.y == Game.hero.y) {
                  // left or right
                  if (_this2.x < Game.hero.x) {
                    // left
                    _this2.fire(_this2.data.skills[0], "right");
                  } else {
                    // right
                    _this2.fire(_this2.data.skills[0], "left");
                  }
                } else {
                  // up or down
                  if (_this2.y < Game.hero.y) {
                    // up
                    _this2.fire(_this2.data.skills[0], "down");
                  } else {
                    // down
                    _this2.fire(_this2.data.skills[0], "up");
                  }
                }
              }
            } else if (Game.hero && Game.hero.distance(_this2) < 12) {
              _this2.goto(Game.hero.x, Game.hero.y, "walk");
            } else {
              privates.attacking = false;
              if (Game.hero.beAttacking.has(_this2)) {
                Game.hero.beAttacking.delete(_this2);
              }
            }
          } else {
            if (tickCount % dodo == 0) {
              if (Game.hero && Game.hero.distance(_this2) < 8) {
                _this2.goto(Game.hero.x, Game.hero.y, "walk");
                privates.attacking = true;
                Game.hero.beAttacking.add(_this2);
              } else if (_this2.data.mode == "patrol") {
                if (Math.random() > 0.3) {
                  _this2.stop();
                  return;
                }
                var directions = ["down", "left", "right", "up"];
                _this2.go("walk", directions[Math.floor(Math.random() * directions.length)]).then(function () {
                  _this2.stop();
                });
              }
            }
          } // not attacking
        });
      }
    }]);

    return GameActorMonster;
  })(Game.Actor));
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
    英雄类
    属性：
      this.sprite 精灵
  */
  Game.assign("ActorNPC", (function (_Game$Actor) {
    _inherits(GameActorNPC, _Game$Actor);

    function GameActorNPC(actorData) {
      _classCallCheck(this, GameActorNPC);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(GameActorNPC).call(this, actorData));
    }

    _createClass(GameActorNPC, [{
      key: "heroUse",
      value: function heroUse() {
        var _this2 = this;

        var data = this.data;

        var options = {};

        // npc对话，例如“闲谈”
        var contact = {};
        if (data.contact) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = data.contact[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var talk = _step.value;

              var result = true;
              // talk.condition 是对话条件，如果存在，它是一个函数
              if (typeof talk.condition == "function") {
                try {
                  result = talk.condition();
                } catch (e) {
                  console.error(this.id, this.data);
                  console.error(talk.condition);
                  console.error(talk.condition.toString());
                  throw e;
                }
              }
              if (result) {
                options[talk.name] = talk.name;
                contact[talk.name] = talk;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }

        // 玩家接受任务
        var quest = null;
        if (this.quest) {
          quest = this.quest.filter(function (quest) {
            if (Game.hero.hasQuest(quest.id)) {
              return false;
            }
            return true;
          });
          if (quest && quest.length) {
            options["任务"] = "quest";
          }
        }

        // 玩家完成任务
        var completeQuest = null;
        if (Game.hero.data.currentQuest.length) {
          completeQuest = [];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = Game.hero.data.currentQuest[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _quest = _step2.value;

              console.log(Game.Quest.isComplete(_quest), _quest.to, this.id);
              if (_quest.to == this.id && Game.Quest.isComplete(_quest)) {
                completeQuest.push(_quest);
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          if (completeQuest.length > 0) {
            options["完成任务"] = "completeQuest";
          }
        }

        // NPC有的交易
        if (data.trade && data.items) {
          options["交易"] = "trade";
        }

        // 没有选项
        if (Object.keys(options).length <= 0) {
          return;
        }

        /*
          下面的代码中频繁调用了this.heroUse()
          是为了保证NPC对话框不会关闭，或者说玩家在执行完某个选项之后依然存在
          但是又不能简单的不关闭对话框，因为选项会有变化，所以要经常重新打开
        */
        Game.choice(options).then(function (choice) {
          switch (choice) {
            case "trade":
              // 玩家交易的选择，默认是买
              _this2.heroUse();
              Game.windows.buy.open(data.items);
              break;
            case "quest":
              // 玩家接受任务的选择
              var questOption = {};
              quest.forEach(function (quest, index) {
                questOption[quest.name] = index;
              });
              Game.choice(questOption).then(function (choice) {
                if (Number.isInteger(choice)) {
                  (function () {
                    var q = quest[choice];
                    Game.confirm({
                      message: q.before,
                      yes: "接受任务",
                      no: "拒绝"
                    }).then(function () {
                      Game.hero.data.currentQuest.push(q);
                      _this2.heroUse();
                    }).catch(function () {
                      _this2.heroUse();
                    });
                  })();
                } else {
                  _this2.heroUse();
                }
              });
              break;
            case "completeQuest":
              // 玩家完成了某个任务的选择
              var completeQuestOption = {};
              completeQuest.forEach(function (quest, index) {
                completeQuestOption[quest.name] = index;
              });
              Game.choice(completeQuestOption).then(function (choice) {
                if (Number.isInteger(choice)) {
                  var _quest2 = completeQuest[choice];

                  Game.hero.data.currentQuest.splice(Game.hero.data.currentQuest.indexOf(_quest2), 1);
                  Game.hero.data.completeQuest.push(_quest2);

                  _this2.heroUse();
                  Game.dialogue([_quest2.finish], data.name);
                  if (_quest2.reward) {
                    if (_quest2.reward.gold) {
                      Game.hero.data.gold += _quest2.reward.gold;
                    }
                    if (_quest2.reward.exp) {
                      Game.hero.data.exp += _quest2.reward.exp;
                    }
                  }
                };
              });
              break;
            default:
              // 其他选择都没选的情况下，就是对话选择，例如“闲谈”
              if (contact[choice]) {
                _this2.heroUse();
                Game.dialogue(contact[choice].content, data.name);
              }
          }
        });
      }
    }]);

    return GameActorNPC;
  })(Game.Actor));
})();

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  var internal = Sprite.Namespace();

  /**
    英雄类
    属性：
      this.sprite 精灵
  */
  Game.assign("ActorPet", (function (_Game$Actor) {
    _inherits(GameActorPet, _Game$Actor);

    function GameActorPet(actorData) {
      _classCallCheck(this, GameActorPet);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(GameActorPet).call(this, actorData));
    }

    return GameActorPet;
  })(Game.Actor));
})();

"use strict";

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict"

  // 合并图片
  // 把images中的所有图片按顺序draw到一个canvas上面，然后用canvas.toDataURL返回一张叠好的图片
  ;
  function CombineHeroImage(images, width, height) {
    return new Promise(function (resolve, reject) {
      var canvas = document.createElement("canvas");
      canvas.height = height;
      canvas.width = width;
      var context = canvas.getContext("2d");
      context.clearRect(0, 0, width, height);

      var length = images.length - 1; // 最后一张图是武器
      for (var i = 0; i < length; i++) {
        var img = images[i];
        context.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
      }

      var withoutWeapon = null;
      var withWeapon = null;

      var promises = new Set();

      withoutWeapon = new Image();
      withoutWeapon.src = canvas.toDataURL("image/png");

      promises.add(new Promise(function (resolve, reject) {
        if (withoutWeapon.complete) {
          resolve();
        } else {
          withoutWeapon.onload = function () {
            resolve();
          };
        }
      }));

      context.drawImage(images[length], 0, 0, images[length].width, images[length].height, 0, 0, width, height);

      withWeapon = new Image();
      withWeapon.src = canvas.toDataURL("image/png");

      promises.add(new Promise(function (resolve, reject) {
        if (withWeapon.complete) {
          resolve();
        } else {
          withWeapon.onload = function () {
            resolve();
          };
        }
      }));

      // Promise es6
      Promise.all(promises).then(function () {
        resolve([withoutWeapon, withWeapon]);
      });
    });
  }

  function Check(str) {
    if (typeof str == "string" && str.length > 0) return true;
    return false;
  }

  // 把多张图片合成一张，并返回
  Game.assign("drawHero", function (heroCustom) {
    return new Promise(function (resolve, reject) {
      var BASE = "hero";
      var imageUrls = [];

      if (Check(heroCustom.sex) && Check(heroCustom.body)) {
        // 必须按顺序
        // 身体
        imageUrls.push(BASE + "/body/" + heroCustom.sex + "/" + heroCustom.body + ".png");
        // 眼睛
        if (Check(heroCustom.eyes)) imageUrls.push(BASE + "/body/" + heroCustom.sex + "/eyes/" + heroCustom.eyes + ".png");
        // 衣服
        if (Check(heroCustom.shirts)) imageUrls.push(BASE + "/shirts/" + heroCustom.sex + "/" + heroCustom.shirts + ".png");
        if (Check(heroCustom.pants)) imageUrls.push(BASE + "/pants/" + heroCustom.sex + "/" + heroCustom.pants + ".png");
        if (Check(heroCustom.shoes))
          // 盔甲
          imageUrls.push(BASE + "/shoes/" + heroCustom.sex + "/" + heroCustom.shoes + ".png");
        if (Check(heroCustom.armorchest)) imageUrls.push(BASE + "/armor/chest/" + heroCustom.sex + "/" + heroCustom.armorchest + ".png");
        if (Check(heroCustom.armorarm)) imageUrls.push(BASE + "/armor/arm/" + heroCustom.sex + "/" + heroCustom.armorarm + ".png");
        if (Check(heroCustom.armorlegs)) imageUrls.push(BASE + "/armor/legs/" + heroCustom.sex + "/" + heroCustom.armorlegs + ".png");
        if (Check(heroCustom.armorfeet)) imageUrls.push(BASE + "/armor/feet/" + heroCustom.sex + "/" + heroCustom.armorfeet + ".png");
        // 头发
        if (Check(heroCustom.hair) && Check(heroCustom.haircolor)) imageUrls.push(BASE + "/hair/" + heroCustom.sex + "/" + heroCustom.hair + "/" + heroCustom.haircolor + ".png");
        // 头
        if (Check(heroCustom.head)) imageUrls.push(BASE + "/head/" + heroCustom.sex + "/" + heroCustom.head + ".png");
        // 头盔
        if (Check(heroCustom.armorhelms)) imageUrls.push(BASE + "/armor/helms/" + heroCustom.sex + "/" + heroCustom.armorhelms + ".png");
        // 武器（包括所有武器）
        imageUrls.push(BASE + "/weapons/" + heroCustom.sex + "/weapons.png");
      }

      Sprite.load(imageUrls).then(function (data) {
        CombineHeroImage(data, heroCustom.width, heroCustom.height).then(function (data) {
          resolve(data);
        });
      });
    });
  });
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  function CheckHeroAction() {
    if (Game.paused) return;

    var state = "run";
    if (Sprite.Input.isPressed("shift")) {
      state = "walk";
    }

    if (Sprite.Input.isPressed("left")) {
      Game.hero.go(state, "left").then(CheckHeroAction);
    } else if (Sprite.Input.isPressed("up")) {
      Game.hero.go(state, "up").then(CheckHeroAction);
    } else if (Sprite.Input.isPressed("right")) {
      Game.hero.go(state, "right").then(CheckHeroAction);
    } else if (Sprite.Input.isPressed("down")) {
      Game.hero.go(state, "down").then(CheckHeroAction);
    }
  }

  var destIcon = null;

  Game.assign("Input", (function () {
    function GameInput() {
      _classCallCheck(this, GameInput);
    }

    _createClass(GameInput, null, [{
      key: "clearDest",
      value: function clearDest() {
        destIcon.visible = false;
      }
    }, {
      key: "setDest",
      value: function setDest(x, y) {
        destIcon.x = x * 32 + 16;
        destIcon.y = y * 32 + 16;
        destIcon.visible = true;
      }
    }, {
      key: "init",
      value: function init() {

        destIcon = new Sprite.Shape();
        destIcon.circle({
          cx: 5,
          cy: 5,
          r: 5,
          stroke: "red",
          fill: "green"
        });
        destIcon.visible = false;
        destIcon.centerX = 5;
        destIcon.centerY = 5;

        Game.windows.stage.on("mousedown", function (event) {
          var data = event.data;

          data.x += Game.stage.centerX;
          data.y += Game.stage.centerY;

          data.x = Math.floor(data.x / 32);
          data.y = Math.floor(data.y / 32);

          if (!Game.layers.infoLayer.hasChild(destIcon)) {
            Game.layers.infoLayer.appendChild(destIcon);
          }

          if (Game.hero.x != data.x || Game.hero.y != data.y) {
            Game.hero.goto(data.x, data.y, "run").then(function () {
              destIcon.visible = false;
              if (Game.hintObject && Game.hintObject.heroUse) {
                Game.hintObject.heroUse();
              }
            });
            /*
            if (destPosition) {
              destIcon.x = data.x * 32 + 16;
              destIcon.y = data.y * 32 + 16;
              destIcon.visible = true;
            }
            */
          }
        });

        Sprite.Ticker.on("tick", function () {

          if (Game.paused) return;
          if (!Game.hero) return;
          if (!Game.area) return;
          if (!Game.area.map) return;

          CheckHeroAction();
          if (!Game.hero.walking) {
            Game.hero.stop();
          }

          Game.hero.focus();
        });
      }
    }]);

    return GameInput;
  })());

  Game.assign("initInput", function () {

    /*
      let mousePressed = false;
       Game.stage.on("stagemousedown", function (event) {
        mousePressed = true;
      });
       Game.stage.on("stagemouseup", function (event) {
        mousePressed = false;
      });
       Game.stage.on("mouseleave", function (event) { // mouse leave canvas
        mousePressed = false;
      });
      */
  }); // Game.oninit
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict"

  // 英雄组件数据
  ;
  var heroCustom = {
    sex: "male",
    body: "light",
    eyes: "blue",
    hair: "",
    haircolor: "black",

    head: "",
    shirts: "",
    pants: "",
    shoes: "",

    armorchest: "",
    armorarm: "",
    armorlegs: "",
    armorhelms: "",
    armorfeet: ""
  };

  // 13x21
  heroCustom.width = 64 * 13; // 832;
  heroCustom.height = 64 * 21; // 1344;
  heroCustom.width *= 0.8125;
  heroCustom.height *= 0.9375;
  heroCustom.tilewidth = heroCustom.width / 13; // 52
  heroCustom.tileheight = heroCustom.height / 21; // 60

  // defined at bottom
  var HeroDefault = null;

  Array.from(document.querySelectorAll(".registerWindow #registerWindowDisplaySelect select")).forEach(function (element) {
    element.addEventListener("change", function () {
      ApplyHeroDisplay();
    });
  });

  Array.from(document.querySelectorAll(".registerWindow #registerWindowPersonal select")).forEach(function (element) {
    element.addEventListener("change", function () {
      ApplyHeroPersonal();
    });
  });

  function ApplyHeroDisplay() {
    Array.from(document.querySelectorAll(".registerWindow #registerWindowDisplaySelect select")).forEach(function (element) {
      var type = element.getAttribute("data-type");
      var value = element.value;
      if (type == "malehair" || type == "femalehair") {
        if (heroCustom.sex == "male" && type == "malehair") {
          heroCustom.hair = value;
        } else if (heroCustom.sex == "female" && type == "femalehair") {
          heroCustom.hair = value;
        }
      } else if (heroCustom.hasOwnProperty(type)) {
        heroCustom[type] = value;
      }
    });
    if (heroCustom.sex == "male") {
      document.getElementById("customMaleHair").style.display = "block";
      document.getElementById("customFemaleHair").style.display = "none";
    } else {
      document.getElementById("customMaleHair").style.display = "none";
      document.getElementById("customFemaleHair").style.display = "block";
    }
    DisplayHero();
  };

  var beliefText = {
    None: "信仰决定了神对你的祝福，当然没有信仰也是一种信仰，但你将无法享受神的祝福",
    Elen: "艾琳 - 知识女神",
    Enlon: "恩朗 - 死亡主宰",
    Minare: "密娜 - 丰收女神",
    Achiel: "阿切奥 - 保护之神",
    Racha: "拉克 - 魔法女神",
    Aestor: "阿斯托 - 盗贼之神",
    Hielach: "赫拉克 - 财富之神",
    Alik: "阿丽克 - 治愈女神",
    Amarien: "阿玛恩 - 力量之神"
  };

  var classText = {
    warrior: "战士是艾利韦斯最常见的冒险职业，擅长使用剑和枪",
    archer: "弓箭手擅长远程攻击，一般使用弓箭作为武器",
    wizard: "魔法师擅长使用魔法进行远程攻击",
    priest: "牧师擅长治疗，也会使用神术",
    bard: "吟游诗人的表演可以鼓舞士气或者削弱敌人的士气",
    thief: "盗贼总是躲藏在阴影中",
    business: "商人擅长交易和说服，帮助你更快的获得资金"
  };

  var registerWindowBelief = document.querySelector("#registerWindowBelief");
  var registerWindowClass = document.querySelector("#registerWindowClass");

  function ApplyHeroPersonal() {

    Array.from(document.querySelectorAll(".registerWindow #registerWindowPersonal select")).forEach(function (element) {
      var value = element.value;
      var type = element.getAttribute("data-type");
      HeroDefault[type] = value;
    });

    registerWindowBelief.textContent = beliefText[HeroDefault.belief];
    registerWindowClass.textContent = classText[HeroDefault.class];
  };

  function DisplayHero() {

    var canvas = document.querySelector(".registerWindow canvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    document.getElementById("loading").innerHTML = "Loading";
    Game.drawHero(heroCustom).then(function (images) {
      var img = images[0];
      context.drawImage(img, 0, 0, img.width, img.height);
      document.getElementById("loading").innerHTML = "";
    });
  }

  Game.assign("register", (function () {
    function GameRegister() {
      _classCallCheck(this, GameRegister);
    }

    _createClass(GameRegister, null, [{
      key: "reg",

      // 注册模块
      value: function reg() {
        Array.from(document.querySelectorAll(".registerWindow select")).forEach(function (element) {
          element.selectedIndex = 0;
        });
        ApplyHeroDisplay();
        ApplyHeroPersonal();
        document.getElementById("registerHeroName").value = "";
        Game.windows.register.show();
      }
    }, {
      key: "submit",
      value: function submit() {
        var name = document.getElementById("registerHeroName").value;

        if (name.trim().length <= 0) {
          alert("Invalid Name");
          return;
        }

        HeroDefault.id = "hero_" + name;
        HeroDefault.name = name;
        HeroDefault.custom = heroCustom;
        HeroDefault.tilewidth = heroCustom.tilewidth;
        HeroDefault.tileheight = heroCustom.tileheight;

        // 保存一个存档
        Game.Archive.save({
          hero: HeroDefault
        });

        Game.windows.register.hide();

        // 空调用，代表读取最新一个存档（last），即刚刚新建的存档
        Game.Archive.load();
      }
    }]);

    return GameRegister;
  })());

  // 含有$开头的代表是基础值
  // 不含$的同名属性是计算后值，即经过各种加成，buff，nerf之后的值
  HeroDefault = {
    "level": 1, // 等级
    "exp": 0, // 经验值
    "type": "hero", // 标识这个actor的类别是hero，其他类别如npc，monster

    "belief": "None",
    "class": "warrior", // 职业，不同职业有不同加成

    // 233年2月27日 09时30分
    "time": 233 * (60 * 24 * 30 * 12) + 1 * (60 * 24 * 30) + 26 * (60 * 24) + 9 * 60 + 30,

    // 最基本的属性，其他属性都由此延伸
    "$str": 10, // strength 力量： 物理攻击力
    "$dex": 10, // dexterity 敏捷： 闪避，暴击
    "$con": 10, // constitution 耐力： 生命值
    "$int": 10, // intelligence 智力： 精神力，魔法攻击
    "$cha": 10, // charisma 魅力： 队友能力

    // 下面为0的值将由上面的基本属性计算出来

    "str": 0,
    "dex": 0,
    "int": 0,
    "con": 0,
    "cha": 0,

    "$hp": 0, // 生命力
    "$sp": 0, // 精神力

    "critical": 0, // 暴击率
    "dodge": 0, // 闪避

    "hp": 0,
    "sp": 0,

    "$atk": 0, // 攻击
    "$def": 0, // 防御
    "$matk": 0, // 魔法攻击
    "$mdef": 0, // 魔法防御

    "atk": 0,
    "def": 0,
    "matk": 0,
    "mdef": 0,

    "buff": [], // 有益状态
    "nerf": [], // 有害状态

    "currentQuest": [/* 当前任务 */],
    "completeQuest": [/* 完成了的任务 */],

    // 初始位置
    "area": "fystone", // 地图id
    "x": 18,
    "y": 15,

    "centerX": 26,
    "centerY": 55,
    "hitArea": [[0, 0]],

    // 能力
    "skills": ["fist.l1", "sword.l1", // 剑攻击Level1
    "spear.l1", // 枪攻击Level1
    "bow.l1", // 弓攻击Level1
    "fire.l1"],

    // 火球术Level1
    // 技能快捷方式列表
    "bar": [{
      "id": "sword.l1",
      "type": "skill"
    }, {
      "id": "bow.l1",
      "type": "skill"
    }, null, null, null, null, null, {
      "id": "potion.healWeak",
      "type": "item"
    }],

    // 技能，例如生活技能，说服技能，交易技能
    //skills: {
    //  _trade: 0, // 交易，交易时的价格
    //  _negotiate: 0, // 交涉，具体剧情，招揽同伴时的费用
    //  _lock: 0, // 开锁
    //  _knowledge: 0, // 知识，具体剧情，鉴定物品
    //  _treatment: 0, // 医疗，在使用医疗物品时的效果
    //  _animal: 0, // 动物战斗加成，动物驯养
    //},

    "equipment": {
      "head": null,
      "body": "cloth.normal",
      "feet": "shoes.normal",
      "weapon": "sword.iron",
      "neck": null,
      "ring": null
    },

    "items": {
      "sword.iron": 1,
      "spear.iron": 1,
      "bow.wood": 1,
      "cloth.normal": 1,
      "shoes.normal": 1,
      "potion.healWeak": 5,
      "book.gameAdventure": 1,
      "book.elliorwisHistory": 1
    },

    "gold": 0,

    "animations": {

      "spellcastup": [0, 6, "", 40],
      "spellcastleft": [13, 19, "", 40],
      "spellcastdown": [26, 32, "", 40],
      "spellcastright": [39, 45, "", 40],

      "walkup": [104, 112, "walkup", 70],
      "walkleft": [117, 125, "walkleft", 70],
      "walkdown": [130, 138, "walkdown", 70],
      "walkright": [143, 151, "walkright", 70],

      "meleeup": [156, 161, "", 40],
      "meleeleft": [169, 174, "", 40],
      "meleedown": [182, 187, "", 40],
      "meleeright": [195, 200, "", 40],

      // 273+是一张图的总数，hero一共两张图，第一张图没武器，第二张图有武器，所以以下动作在第二张图

      "thrustup": [273 + 52, 273 + 59, "", 40],
      "thrustleft": [273 + 65, 273 + 72, "", 40],
      "thrustdown": [273 + 78, 273 + 85, "", 40],
      "thrustright": [273 + 91, 273 + 98, "", 40],

      "runup": [273 + 105, 273 + 112, "runup", 30],
      "runleft": [273 + 118, 273 + 125, "runleft", 30],
      "rundown": [273 + 131, 273 + 138, "rundown", 30],
      "runright": [273 + 144, 273 + 151, "runright", 30],

      "slashup": [273 + 156, 273 + 161, "", 40],
      "slashleft": [273 + 169, 273 + 174, "", 40],
      "slashdown": [273 + 182, 273 + 187, "", 40],
      "slashright": [273 + 195, 273 + 200, "", 40],

      "shootup": [273 + 208, 273 + 220, "", 40],
      "shootleft": [273 + 221, 273 + 233, "", 40],
      "shootdown": [273 + 234, 273 + 246, "", 40],
      "shootright": [273 + 247, 273 + 259, "", 40],

      "hurt": [260, 265, "", 60],

      "dead": 265,

      "faceup": 104,
      "faceleft": 117,
      "facedown": 130,
      "faceright": 143
    }
  };
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

A-RPG Game, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

(function () {
  "use strict";

  Game.assign("Archive", (function () {
    function GameArchive() {
      _classCallCheck(this, GameArchive);
    }

    _createClass(GameArchive, null, [{
      key: "remove",
      value: function remove(id) {
        if (window.localStorage.getItem(id)) {
          window.localStorage.removeItem(id);
        }
      }

      // 返回所有存档，Object格式

    }, {
      key: "list",
      value: function list() {
        var keys = [];
        for (var key in window.localStorage) {
          if (key.match(/^SAVE_(\d+)$/)) {
            keys.push(parseInt(key.match(/^SAVE_(\d+)$/)[1]));
          }
        }
        keys.sort();
        keys.reverse();
        return keys;
      }

      // 返回最新存档，Object格式

    }, {
      key: "last",
      value: function last() {
        var list = Game.Archive.list();
        if (list.length > 0) {
          var _last = list[0];
          return JSON.parse(window.localStorage.getItem("SAVE_" + _last));
        } else {
          return null;
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        for (var key in window.localStorage) {
          if (key.match(/^SAVE_(\d+)$/)) {
            window.localStorage.removeItem(key);
          }
        }
      }
    }, {
      key: "save",
      value: function save(data) {
        var now = new Date();
        var id = now.getTime();

        data.id = id;
        data.name = data.hero.name;
        data.date = now.toLocaleString();

        window.localStorage.setItem("SAVE_" + id, JSON.stringify(data));
      }
    }, {
      key: "get",
      value: function get(id) {
        if (id && window.localStorage.getItem(id)) {
          return JSON.parse(window.localStorage.getItem(id));
        }
        return null;
      }
    }, {
      key: "load",
      value: function load(id) {
        var data = Game.Archive.get(id);
        if (!data) {
          data = Game.Archive.last();
        }

        if (data) {

          if (Game.windows.interface.showing) {
            Game.windows.interface.hide();
          }
          Game.windows.main.hide();

          Game.windows.loading.begin();

          setTimeout(function () {
            var heroData = data.hero;

            Game.drawHero(heroData.custom).then(function (heroImage) {
              heroData.image = heroImage;
              Game.hero = new Game.ActorHero(heroData);

              Game.hero.on("complete", function () {

                Game.hero.gotoArea(heroData.area, heroData.x, heroData.y);
              });
            });
          }, 20);
        } else {
          console.error("id:", id);
          throw new Error("Invalid id, Game.Archive.load");
        }
      }
    }]);

    return GameArchive;
  })());
})();
