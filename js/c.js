// js/es6-module.js
import c from 'c';
class People{
  constructor(name){
    this.name = name;
  }
  say(){
    console.log(`hi ${this.name} !`);
  }
}
c.say();
module.exports = new People;