Object.create =
  Object.create ||
  function (obj) {
    function F() {}
    F.prototype = obj;
    return new F();
  };

function validateCtor(Ctor) {
  if (typeof Ctor !== 'function') {
    throw new Error('Ctor must be a function');
  }
}

function setMethods(target, ...methods) {
  methods.forEach(function (method) {
    if (typeof method === 'function' && method.name) {
      if (typeof target === 'object') {
        target[method.name] = method;
      } else if (typeof target === 'function') {
        target.prototype[method.name] = method;
      }
    }
  });
}

// 原形链继承
// 返回子类构造函数
function extendsByPrototypeChaining(
  SuperType,
  superArgs = [],
  Ctor = function () {},
  ...methods
) {
  validateCtor(Ctor);
  Ctor.prototype = new SuperType(...superArgs);
  setMethods(Ctor, ...methods);
  return Ctor;
}

// 借用构造函数
// 返回子类构造函数
function extendsByConstructorStealing(
  SuperType,
  superArgs = [],
  Ctor = function () {},
  ...methods
) {
  validateCtor(Ctor);
  const _Ctor = Ctor;
  Ctor = function (...subArgs) {
    SuperType.apply(this, superArgs.concat(subArgs));
    _Ctor.call(this, ...subArgs);
  };
  setMethods(Ctor, ...methods);
  return Ctor;
}

// 组合继承
// 返回子类构造函数
function extendsByCombinationInheritance(
  SuperType,
  superArgs = [],
  Ctor = function () {},
  ...methods
) {
  validateCtor(Ctor);
  const _Ctor = Ctor;
  Ctor = function (...subArgs) {
    SuperType.apply(this, superArgs.concat(subArgs));
    _Ctor.call(this, ...subArgs);
  };
  Ctor.prototype = new SuperType();
  setMethods(Ctor, ...methods);
  return Ctor;
}

// 原型式继承
// 直接返回子类实例
function extendsByPrototypalInheritance(patternObj, props = {}, ...methods) {
  const instance = Object.create(patternObj);
  Object.keys(props).forEach(function (key) {
    instance[key] = props[key];
  });
  setMethods(instance, ...methods);
  return instance;
}

// 寄生式继承
// 直接返回子类实例
function extendsByParasiticInheritance(
  patternObj,
  enhancer,
  props = {},
  ...methods
) {
  function create() {
    const clone = Object.create(patternObj);
    typeof enhancer === 'function' && enhancer(clone);
    return clone;
  }
  const instance = create();
  Object.keys(props).forEach(function (key) {
    instance[key] = props[key];
  });
  setMethods(instance, ...methods);
  return instance;
}

// 寄生组合式继承
// 返回子类构造函数
function extendsByParasiticCombinationInheritance(
  SuperType,
  superArgs = [],
  Ctor = function () {},
  ...methods
) {
  validateCtor(Ctor);
  const _Ctor = Ctor;
  Ctor = function (...subArgs) {
    SuperType.apply(this, superArgs.concat(subArgs));
    _Ctor.call(this, ...subArgs);
  };

  // inherit super prototype only
  const prototype = Object.create(SuperType.prototype);
  prototype.constructor = Ctor;
  Ctor.prototype = prototype;

  setMethods(Ctor, ...methods);
  return Ctor;
}
