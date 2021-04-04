import {getFullRange} from "../servers/vuu/range-utils";

describe("getFullRange", () => {

  it("returns same range if no buffer", () => {
    expect(getFullRange({lo:0, hi:10})).toEqual({from:0, to:10})
    expect(getFullRange({lo:10, hi:20})).toEqual({from:10, to:20})
  })

  it("adds bufferSize to range, at beginning", () => {
    expect(getFullRange({lo:0, hi:10},10)).toEqual({from:0, to:20})
    expect(getFullRange({lo:0, hi:35},100)).toEqual({from:0, to:135})
  })

  it("uses full buffer, when space limited at start", () => {
    expect(getFullRange({lo:10, hi:30},100)).toEqual({from:0, to:120})
    expect(getFullRange({lo:45, hi:65},100)).toEqual({from: 0, to:120})
  })

  it("divides buffer evenly when space allows", () => {
    expect(getFullRange({lo:60, hi:80},100)).toEqual({from:10, to:130})
    expect(getFullRange({lo:100, hi:135},100)).toEqual({from: 50, to:185})
  })

  it("caps upper range using rowCount", () => {
    expect(getFullRange({lo:60, hi:80},100, 200)).toEqual({from:10, to:130})
    expect(getFullRange({lo:100, hi:135},100, 200)).toEqual({from: 50, to:185})
    expect(getFullRange({lo:150, hi:185},100, 200)).toEqual({from: 65, to:200})
  })



})
