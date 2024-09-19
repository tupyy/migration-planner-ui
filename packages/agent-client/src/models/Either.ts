export type Either<GoodType, BadType> = [GoodType, null] | [null, BadType];
