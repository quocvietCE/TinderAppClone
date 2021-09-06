// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Genders = {
  "MALE": "MALE",
  "FEMALE": "FEMALE",
  "OTHER": "OTHER"
};

const { Match, UserMatch, User } = initSchema(schema);

export {
  Match,
  UserMatch,
  User,
  Genders
};