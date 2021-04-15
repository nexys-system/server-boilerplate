import * as U from './utils';
import { languages } from './mockdata';

test('langIdToOptionSet', () => {
  const langId = 3;
  const r = U.langIdToOptionSet(langId, languages);
  const e = {id: 3, name: 'de'}
  expect(r).toEqual(e);
})