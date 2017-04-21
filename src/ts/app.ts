import * as jquery from 'jquery';
// import { Power2, TimelineMax, TweenMax } from 'gsap';
// import { anime } from 'animejs';
// <reference path="modules/lodash/index.d.ts" />

declare var require: any;
declare var string: string;
declare var number: number;

import { TimelineMax } from 'gsap';

// tslint:disable-next-line:no-namespace
declare global {
  // tslint:disable-next-line:interface-name
  interface Array<T> {
    includes<T>(elem: any): any;

    // tslint:disable-next-line:member-ordering
    count<T>(): any;
  }
}

import { Headers } from './headers';

// tslint:disable-next-line:no-var-requires
const anime = require('animejs');

interface IPerson {
  name: string;
  age: number;
}

class Person {
  constructor(public person: IPerson) {
     // tslint:disable-next-line:no-console
    console.log(`${person.name}`);
  }

  public getAge(): Number {
    // tslint:disable-next-line:no-console
    return this.person.age;
  }

  // tslint:disable-next-line:member-ordering
  // tslint:disable-next-line:member-access
  // tslint:disable-next-line:member-ordering
  static family(): String {
    return 'James Ugwudike';
  }
}

export { Person };

// console.log('This is a hack');

// console.log('This is another hack');

// console.log('This is a way to say goodbye to my old friends');

// console.log('This is absolutely lovely');

// console.log('This looks really great');

// console.log('And very fast as well');

// console.log('Hmmn very fast I must confess');

// console.log('I just wish gulp was this fast, sincerely');

// console.log('This is really great my friends');

// console.log('What do you think friends?');

// console.log('How is this going? It looks great so far');

// console.log('Lovely build guys. This is great, just confess');

// const a: number = 3;
// const bcded = 30;

// console.log('What has love got to do with this?');

// console.log('This seems to go smoothly. What do you guys think?');

// console.log('This is crazy');

// console.log('How do you see this?');

// window.onload = () => {
//   const playhead = new TimelineMax();

//   // tslint:disable-next-line:max-line-length
//   playhead.staggerFromTo('*', 1, { autoAlpha: 0, x: -200, force3D: true }, { autoAlpha: 1, x: 0 }, 0.3);
// };
