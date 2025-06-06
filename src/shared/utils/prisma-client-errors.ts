import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

class BaseError extends PrismaClientKnownRequestError {
	constructor(error: PrismaClientKnownRequestError) {
		super(error.message, {
			code: error.code,
			clientVersion: error.clientVersion,
			meta: error.meta,
			batchRequestIdx: error.batchRequestIdx,
		});
	}
}

export class PrismaAuthenticationFailedError extends BaseError {
	code = "P1000";
}

export class PrismaDatabaseUnreachableError extends BaseError {
	code = "P1001";
}

export class PrismaDatabaseTimeoutError extends BaseError {
	code = "P1002";
}

export class PrismaDatabaseDoesNotExistError extends BaseError {
	code = "P1003";
}

export class PrismaOperationTimeoutError extends BaseError {
	code = "P1008";
}

export class PrismaDatabaseAlreadyExistsError extends BaseError {
	code = "P1009";
}

export class PrismaUserAccessDeniedError extends BaseError {
	code = "P1010";
}

export class PrismaTlsConnectionError extends BaseError {
	code = "P1011";
}

export class PrismaSchemaValidationError extends BaseError {
	code = "P1012";
}

export class PrismaInvalidDatabaseStringError extends BaseError {
	code = "P1013";
}

export class PrismaUnderlyingModelError extends BaseError {
	code = "P1014";
}

export class PrismaUnsupportedDatabaseVersionError extends BaseError {
	code = "P1015";
}

export class PrismaIncorrectParametersError extends BaseError {
	code = "P1016";
}

export class PrismaServerClosedConnectionError extends BaseError {
	code = "P1017";
}

export class PrismaValueTooLongError extends BaseError {
	code = "P2000";
}

export class PrismaRecordDoesNotExistError extends BaseError {
	code = "P2001";
}

export class PrismaUniqueConstraintError extends BaseError {
	code = "P2002";
}

export class PrismaForeignKeyConstraintError extends BaseError {
	code = "P2003";
}

export class PrismaDatabaseConstraintError extends BaseError {
	code = "P2004";
}

export class PrismaInvalidFieldValueError extends BaseError {
	code = "P2005";
}

export class PrismaInvalidValueError extends BaseError {
	code = "P2006";
}

export class PrismaDataValidationError extends BaseError {
	code = "P2007";
}

export class PrismaQueryParsingError extends BaseError {
	code = "P2008";
}

export class PrismaQueryValidationError extends BaseError {
	code = "P2009";
}

export class PrismaRawQueryFailedError extends BaseError {
	code = "P2010";
}

export class PrismaNullConstraintViolationError extends BaseError {
	code = "P2011";
}

export class PrismaMissingRequiredValueError extends BaseError {
	code = "P2012";
}

export class PrismaMissingRequiredArgumentError extends BaseError {
	code = "P2013";
}

export class PrismaRelationViolationError extends BaseError {
	code = "P2014";
}

export class PrismaRelatedRecordNotFoundError extends BaseError {
	code = "P2015";
}

export class PrismaQueryInterpretationError extends BaseError {
	code = "P2016";
}

export class PrismaRecordsNotConnectedError extends BaseError {
	code = "P2017";
}

export class PrismaConnectedRecordsNotFoundError extends BaseError {
	code = "P2018";
}

export class PrismaInputError extends BaseError {
	code = "P2019";
}

export class PrismaValueOutOfRangeError extends BaseError {
	code = "P2020";
}

export class PrismaTableDoesNotExistError extends BaseError {
	code = "P2021";
}

export class PrismaColumnDoesNotExistError extends BaseError {
	code = "P2022";
}

export class PrismaInconsistentColumnDataError extends BaseError {
	code = "P2023";
}

export class PrismaConnectionPoolTimeoutError extends BaseError {
	code = "P2024";
}

export class PrismaOperationFailedError extends BaseError {
	code = "P2025";
}

export class PrismaUnsupportedFeatureError extends BaseError {
	code = "P2026";
}

export class PrismaDatabaseQueryExecutionErrors extends BaseError {
	code = "P2027";
}

export class PrismaTransactionApiError extends BaseError {
	code = "P2028";
}

export class PrismaFulltextIndexNotFoundError extends BaseError {
	code = "P2030";
}

export class PrismaMongoDbReplicaSetError extends BaseError {
	code = "P2031";
}

export class PrismaNumberOutOfRangeError extends BaseError {
	code = "P2033";
}

export class PrismaTransactionConflictError extends BaseError {
	code = "P2034";
}

export class PrismaDatabaseCreationFailedError extends BaseError {
	code = "P3000";
}

export class PrismaMigrationDestructiveChangesError extends BaseError {
	code = "P3001";
}

export class PrismaMigrationRollbackError extends BaseError {
	code = "P3002";
}

export class PrismaMigrationFormatChangedError extends BaseError {
	code = "P3003";
}

export class PrismaSystemDatabaseAlterationError extends BaseError {
	code = "P3004";
}

export class PrismaNonEmptySchemaError extends BaseError {
	code = "P3005";
}

export class PrismaFailedMigrationError extends BaseError {
	code = "P3006";
}

export class PrismaPreviewFeaturesBlockedError extends BaseError {
	code = "P3007";
}

export class PrismaMigrationAlreadyAppliedError extends BaseError {
	code = "P3008";
}

export class PrismaFailedMigrationsError extends BaseError {
	code = "P3009";
}

export class PrismaMigrationNameTooLongError extends BaseError {
	code = "P3010";
}

export class PrismaMigrationNotFoundForRollbackError extends BaseError {
	code = "P3011";
}

export class PrismaMigrationNotInFailedStateError extends BaseError {
	code = "P3012";
}

export class PrismaProviderArraysNotSupportedError extends BaseError {
	code = "P3013";
}

export class PrismaShadowDatabaseCreationError extends BaseError {
	code = "P3014";
}

export class PrismaMigrationFileNotFoundError extends BaseError {
	code = "P3015";
}

export class PrismaDatabaseResetFallbackFailedError extends BaseError {
	code = "P3016";
}

export class PrismaMigrationNotFoundError extends BaseError {
	code = "P3017";
}

export class PrismaMigrationFailedToApplyError extends BaseError {
	code = "P3018";
}

export class PrismaProviderMismatchError extends BaseError {
	code = "P3019";
}

export class PrismaShadowDatabaseDisabledError extends BaseError {
	code = "P3020";
}

export class PrismaNoForeignKeysError extends BaseError {
	code = "P3021";
}

export class PrismaNoDirectDdlError extends BaseError {
	code = "P3022";
}

export class PrismaIntrospectionFailedError extends BaseError {
	code = "P4000";
}

export class PrismaEmptyIntrospectedDatabaseError extends BaseError {
	code = "P4001";
}

export class PrismaInconsistentIntrospectedSchemaError extends BaseError {
	code = "P4002";
}

export class PrismaDataProxyRequestError extends BaseError {
	code = "P5000";
}

export class PrismaDataProxyRetryRequestError extends BaseError {
	code = "P5001";
}

export class PrismaDataProxyInvalidDatasourceError extends BaseError {
	code = "P5002";
}

export class PrismaDataProxyResourceNotFoundError extends BaseError {
	code = "P5003";
}

export class PrismaDataProxyFeatureNotImplementedError extends BaseError {
	code = "P5004";
}

export class PrismaDataProxySchemaUploadError extends BaseError {
	code = "P5005";
}

export class PrismaDataProxyUnknownServerError extends BaseError {
	code = "P5006";
}

export class PrismaDataProxyUnauthorizedError extends BaseError {
	code = "P5007";
}

export class PrismaDataProxyUsageExceededError extends BaseError {
	code = "P5008";
}

export class PrismaDataProxyRequestTimeoutError extends BaseError {
	code = "P5009";
}

export class PrismaDataProxyFetchError extends BaseError {
	code = "P5010";
}

export class PrismaDataProxyInvalidRequestParametersError extends BaseError {
	code = "P5011";
}

export class PrismaDataProxyUnsupportedEngineVersionError extends BaseError {
	code = "P5012";
}

export class PrismaDataProxyEngineStartupError extends BaseError {
	code = "P5013";
}

export class PrismaDataProxyUnknownEngineStartupError extends BaseError {
	code = "P5014";
}

export class PrismaDataProxyInteractiveTransactionError extends BaseError {
	code = "P5015";
}

const errorCodeToClass = {
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P1000: PrismaAuthenticationFailedError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P1001: PrismaDatabaseUnreachableError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P1002: PrismaDatabaseTimeoutError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P1003: PrismaDatabaseDoesNotExistError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P1008: PrismaOperationTimeoutError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P1009: PrismaDatabaseAlreadyExistsError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P1010: PrismaUserAccessDeniedError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P1011: PrismaTlsConnectionError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P1012: PrismaSchemaValidationError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P1013: PrismaInvalidDatabaseStringError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P1014: PrismaUnderlyingModelError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P1015: PrismaUnsupportedDatabaseVersionError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P1016: PrismaIncorrectParametersError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P1017: PrismaServerClosedConnectionError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2000: PrismaValueTooLongError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2001: PrismaRecordDoesNotExistError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2002: PrismaUniqueConstraintError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2003: PrismaForeignKeyConstraintError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2004: PrismaDatabaseConstraintError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2005: PrismaInvalidFieldValueError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2006: PrismaInvalidValueError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2007: PrismaDataValidationError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2008: PrismaQueryParsingError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2009: PrismaQueryValidationError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2010: PrismaRawQueryFailedError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2011: PrismaNullConstraintViolationError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2012: PrismaMissingRequiredValueError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2013: PrismaMissingRequiredArgumentError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2014: PrismaRelationViolationError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2015: PrismaRelatedRecordNotFoundError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2016: PrismaQueryInterpretationError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2017: PrismaRecordsNotConnectedError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2018: PrismaConnectedRecordsNotFoundError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2019: PrismaInputError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2020: PrismaValueOutOfRangeError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2021: PrismaTableDoesNotExistError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2022: PrismaColumnDoesNotExistError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2023: PrismaInconsistentColumnDataError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2024: PrismaConnectionPoolTimeoutError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2025: PrismaOperationFailedError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2026: PrismaUnsupportedFeatureError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2027: PrismaDatabaseQueryExecutionErrors,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2028: PrismaTransactionApiError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2030: PrismaFulltextIndexNotFoundError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2031: PrismaMongoDbReplicaSetError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2033: PrismaNumberOutOfRangeError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P2034: PrismaTransactionConflictError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3000: PrismaDatabaseCreationFailedError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3001: PrismaMigrationDestructiveChangesError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3002: PrismaMigrationRollbackError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3003: PrismaMigrationFormatChangedError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3004: PrismaSystemDatabaseAlterationError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3005: PrismaNonEmptySchemaError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3006: PrismaFailedMigrationError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3007: PrismaPreviewFeaturesBlockedError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3008: PrismaMigrationAlreadyAppliedError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3009: PrismaFailedMigrationsError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3010: PrismaMigrationNameTooLongError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3011: PrismaMigrationNotFoundForRollbackError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3012: PrismaMigrationNotInFailedStateError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3013: PrismaProviderArraysNotSupportedError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3014: PrismaShadowDatabaseCreationError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3015: PrismaMigrationFileNotFoundError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3016: PrismaDatabaseResetFallbackFailedError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3017: PrismaMigrationNotFoundError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3018: PrismaMigrationFailedToApplyError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3019: PrismaProviderMismatchError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3020: PrismaShadowDatabaseDisabledError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3021: PrismaNoForeignKeysError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P3022: PrismaNoDirectDdlError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P4000: PrismaIntrospectionFailedError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P4001: PrismaEmptyIntrospectedDatabaseError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P4002: PrismaInconsistentIntrospectedSchemaError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P5000: PrismaDataProxyRequestError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P5001: PrismaDataProxyRetryRequestError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P5002: PrismaDataProxyInvalidDatasourceError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P5003: PrismaDataProxyResourceNotFoundError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P5004: PrismaDataProxyFeatureNotImplementedError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P5005: PrismaDataProxySchemaUploadError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P5006: PrismaDataProxyUnknownServerError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P5007: PrismaDataProxyUnauthorizedError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P5008: PrismaDataProxyUsageExceededError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P5009: PrismaDataProxyRequestTimeoutError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P5010: PrismaDataProxyFetchError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P5011: PrismaDataProxyInvalidRequestParametersError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P5012: PrismaDataProxyUnsupportedEngineVersionError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P5013: PrismaDataProxyEngineStartupError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P5014: PrismaDataProxyUnknownEngineStartupError,
	// biome-ignore lint/style/useNamingConvention: Prisma error codes are uppercase
	P5015: PrismaDataProxyInteractiveTransactionError,
} as const;

export function parsePrismaError(error: unknown) {
	if (!(error instanceof PrismaClientKnownRequestError)) {
		return null;
	}
	const code = error.code as keyof typeof errorCodeToClass;
	const ErrorClass = errorCodeToClass[code];
	if (!ErrorClass) {
		return null;
	}
	return new ErrorClass(error);
}
