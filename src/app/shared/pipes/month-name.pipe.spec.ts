import { MonthNamePipe } from './month-name.pipe';

/**
 * UNIT TEST — MonthNamePipe
 *
 * A pipe is just a class with a transform() method.
 * It has NO Angular dependencies (no HttpClient, no services),
 * so we do NOT need TestBed at all — we just create an instance with `new`.
 *
 * This is the SIMPLEST kind of Angular unit test.
 *
 * TEST STRUCTURE (Jasmine):
 * ─────────────────────────
 * describe('Name of thing being tested', () => {   ← groups related tests
 *   beforeEach(() => { ... })                       ← runs before EACH it() block
 *   it('should do something', () => { ... })        ← one test case
 *   expect(actual).toBe(expected)                   ← assertion
 * })
 */
describe('MonthNamePipe', () => {

  // We declare the pipe variable here so all it() blocks can use it
  let pipe: MonthNamePipe;

  // beforeEach runs before every single it() block
  // Here we create a fresh instance of the pipe before each test
  beforeEach(() => {
    pipe = new MonthNamePipe();
  });

  // ─── Basic creation test ───────────────────────────────────────────────────
  it('should create an instance', () => {
    // toBeTruthy() passes if the value is anything other than null/undefined/false/0/''
    expect(pipe).toBeTruthy();
  });

  // ─── Valid month numbers ───────────────────────────────────────────────────
  it('should return "January" for month number 1', () => {
    // toBe() checks strict equality (===)
    expect(pipe.transform(1)).toBe('January');
  });

  it('should return "December" for month number 12', () => {
    expect(pipe.transform(12)).toBe('December');
  });

  it('should return "June" for month number 6', () => {
    expect(pipe.transform(6)).toBe('June');
  });

  // ─── Edge cases ───────────────────────────────────────────────────────────
  it('should return empty string for month number 0 (invalid)', () => {
    // months array is 0-indexed internally: months[0-1] = months[-1] = undefined → ''
    expect(pipe.transform(0)).toBe('');
  });

  it('should return empty string for month number 13 (out of range)', () => {
    expect(pipe.transform(13)).toBe('');
  });

  // ─── All months test (using a loop) ───────────────────────────────────────
  it('should return correct name for all 12 months', () => {
    const expected = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];

    expected.forEach((monthName, index) => {
      // index is 0-based, but our pipe takes 1-based month numbers
      expect(pipe.transform(index + 1)).toBe(monthName);
    });
  });

});
