// jshint esversion: 6

import { expect } from 'chai';
import { Person } from '../app';

const myPerson = new Person({
  age: 27,
  name: 'Victory James',
});

describe('Major Person', () => {
  describe('Age', () => {
    it('should return 27 for the age', () => {
      expect(myPerson.getAge()).to.equal(27);
    });
  });

  describe('Major Family', () => {
    it('should return James Ugwudike for the name', () => {
      expect(Person.family()).to.equal('James Ugwudike');
    });
  });
});
