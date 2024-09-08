export type StatusCode = number;
export type Either<GoodType, BadType> = [GoodType, null] | [null, BadType];
