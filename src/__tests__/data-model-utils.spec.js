import {getGroupValueAndOffset} from '../grid/grid-model-utils';

describe('getGroupValueAndOffset', () => {

  test('given a single col group (collapsed), returns correct value',() => {
      const [value, offset] = getGroupValueAndOffset([{key: 11}], [0,0,-1,,,,,,,,,'test11']);
      expect(value).toEqual('test11');
      expect(offset).toEqual(0);
  });

  test('given a single col group (expanded), returns correct value',() => {
      const [value, offset] = getGroupValueAndOffset([{key: 11}], [0,0,1,,,,,,,,,'test11']);
      expect(value).toEqual('test11');
      expect(offset).toEqual(0);
  });

  test('given a dual col group, and a top level group row, returns correct value',() => {
      const [value, offset] = getGroupValueAndOffset(
        [{key: 11}, {key: 12}],
        [0,0,2,,,,,,,,,'test11']);
      expect(value).toEqual('test11');
      expect(offset).toEqual(0);
  });

  test('given a dual col group, and a second level group row, returns correct value',() => {
      const [value, offset] = getGroupValueAndOffset(
        [{key: 11}, {key: 12}],
        [0,0,1,,,,,,,,,'test11', 'test12']);
      expect(value).toEqual('test12');
      expect(offset).toEqual(1);
  })

  test('given a triple col group, and a top level group row, returns correct value',() => {
      const [value, offset] = getGroupValueAndOffset(
        [{key: 11}, {key: 12}, {key: 13}],
        [0,0,3,,,,,,,,,'test11', 'test11', 'test13']);
      expect(value).toEqual('test11');
      expect(offset).toEqual(0);
  })
  test('given a triple col group, and a second level group row, returns correct value',() => {
      const [value, offset] = getGroupValueAndOffset(
        [{key: 11}, {key: 12}, {key: 13}],
        [0,0,2,,,,,,,,,'test11', 'test12', 'test13']);
      expect(value).toEqual('test12');
      expect(offset).toEqual(1);
  })
  test('given a triple col group, and a third level group row, returns correct value',() => {
      const [value, offset] = getGroupValueAndOffset(
        [{key: 11}, {key: 12}, {key: 13}],
        [0,0,1,,,,,,,,,'test11', 'test12', 'test13']);
      expect(value).toEqual('test13');
      expect(offset).toEqual(2);
  })

})
