import {KeySet} from "../servers/vuu/keyset";

describe("KeySet", () => {


  it ("is initially empty", () => {
    const keySet = new KeySet();
    expect(keySet.keys.size).toEqual(0)
  })


  describe('reset', () => {
    it('initialises an empty keyset', () => {
      const keySet = new KeySet();
      keySet.reset(0,10)
      expect(keySet.keys.size).toEqual(10);
      expect([...keySet.keys.keys()]).toEqual([0,1,2,3,4,5,6,7,8,9]);
      expect([...keySet.keys.values()]).toEqual([0,1,2,3,4,5,6,7,8,9]);
    });

    it('re-initialises a keyset, extending size', () => {
      const keySet = new KeySet();
      keySet.reset(0,10)
      keySet.reset(0,11)
      expect(keySet.keys.size).toEqual(11);
      expect([...keySet.keys.keys()]).toEqual([0,1,2,3,4,5,6,7,8,9,10]);
      expect([...keySet.keys.values()]).toEqual([0,1,2,3,4,5,6,7,8,9,10]);
    });

    it('re-initialises a keyset, reducing size', () => {
      const keySet = new KeySet();
      keySet.reset(0,10)
      keySet.reset(0,9)
      expect(keySet.keys.size).toEqual(9);
      expect([...keySet.keys.keys()]).toEqual([0,1,2,3,4,5,6,7,8]);
      expect([...keySet.keys.values()]).toEqual([0,1,2,3,4,5,6,7,8]);
      expect(keySet.free).toEqual([9])
    });

    it('re-initialises a keyset, forwards, with overlap', () => {
      const keySet = new KeySet();
      keySet.reset(0,10)
      keySet.reset(2,12)
      expect(keySet.keys.size).toEqual(10);
      expect([...keySet.keys.keys()]).toEqual([2,3,4,5,6,7,8,9,10,11]);
      expect([...keySet.keys.values()]).toEqual([2,3,4,5,6,7,8,9,1,0]);
    });

    it('re-initialises a keyset, forwards, no overlap', () => {
      const keySet = new KeySet();
      keySet.reset(0,10)
      keySet.reset(10,20)
      expect(keySet.keys.size).toEqual(10);
      expect([...keySet.keys.keys()]).toEqual([10,11,12,13,14,15,16,17,18,19]);
      expect([...keySet.keys.values()]).toEqual([9,8,7,6,5,4,3,2,1,0]);
    });

    it('re-initialises a keyset, backwards, with overlap', () => {
      const keySet = new KeySet();
      keySet.reset(10,20)
      keySet.reset(8,18);
      expect(keySet.keys.size).toEqual(10);
      expect([...keySet.keys.keys()]).toEqual([10,11,12,13,14,15,16,17,8,9]);
      expect([...keySet.keys.values()]).toEqual([0,1,2,3,4,5,6,7,9,8]);
    });

    it('re-initialises a keyset, backwards, no overlap', () => {
      const keySet = new KeySet();
      keySet.reset(10,20)
      keySet.reset(0,10)
      expect(keySet.keys.size).toEqual(10);
      expect([...keySet.keys.keys()]).toEqual([0,1,2,3,4,5,6,7,8,9]);
      expect([...keySet.keys.values()]).toEqual([9,8,7,6,5,4,3,2,1,0]);
    });




  })


})
