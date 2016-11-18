// js/es6-module.js
class People{
  constructor(name){
    this.name = name;
  }
  say(){
    console.log(`hi ${this.name} !`);
  }
}
module.exports = new People;