import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum Genders {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}



type MatchMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMatchMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Match {
  readonly id: string;
  readonly users?: (UserMatch | null)[];
  readonly User1?: User;
  readonly User2?: User;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Match, MatchMetaData>);
  static copyOf(source: Match, mutator: (draft: MutableModel<Match, MatchMetaData>) => MutableModel<Match, MatchMetaData> | void): Match;
}

export declare class UserMatch {
  readonly id: string;
  readonly user: User;
  readonly match: Match;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<UserMatch, UserMatchMetaData>);
  static copyOf(source: UserMatch, mutator: (draft: MutableModel<UserMatch, UserMatchMetaData>) => MutableModel<UserMatch, UserMatchMetaData> | void): UserMatch;
}

export declare class User {
  readonly id: string;
  readonly name: string;
  readonly image: string;
  readonly bio: string;
  readonly gender: Genders | keyof typeof Genders;
  readonly lookingFor?: Genders | keyof typeof Genders;
  readonly UserMatches?: (UserMatch | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}