// let sum = (a, b = 0) => a + b;

[1, 2, 3].includes(1)

class A {
  
}

var p = new Proxy({a: 1}, {
  get: function(target, prop, receiver) {
    console.log('get', prop);
    return target[prop];
  },
  set: function(target, prop, value, receiver) {
    console.log('set', prop, value);
    target[prop] = value;
    return true;
  }
})

p.a = 2