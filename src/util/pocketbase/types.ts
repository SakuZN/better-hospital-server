/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	ActivityLog = "activity_log",
	ApiKey = "api_key",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export enum ActivityLogMethodOptions {
	"GET" = "GET",
	"POST" = "POST",
	"PUT" = "PUT",
	"DELETE" = "DELETE",
}

export enum ActivityLogEnvironmentOptions {
	"local" = "local",
	"stage" = "stage",
	"prod" = "prod",
}

export enum ActivityLogResponseOptions {
	"OK" = "OK",
	"ERROR" = "ERROR",
}
export type ActivityLogRecord<Tbody = unknown, Traw_response = unknown, Troute_params = unknown> = {
	body?: null | Tbody
	created?: IsoDateString
	domain?: string
	environment?: ActivityLogEnvironmentOptions
	error_message?: string
	id: string
	ip_address?: string
	method?: ActivityLogMethodOptions
	query_params?: string
	raw_response?: null | Traw_response
	response?: ActivityLogResponseOptions
	response_size?: string
	response_time?: string
	route?: string
	route_params?: null | Troute_params
	stack_trace?: string
	status_code?: number
	updated?: IsoDateString
	user_agent?: string
}

export enum ApiKeyAccessLevelOptions {
	"public" = "public",
	"private" = "private",
}
export type ApiKeyRecord = {
	access_level?: ApiKeyAccessLevelOptions
	active?: boolean
	created?: IsoDateString
	id: string
	key: string
	updated?: IsoDateString
}

export type UsersRecord = {
	avatar?: string
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type ActivityLogResponse<Tbody = unknown, Traw_response = unknown, Troute_params = unknown, Texpand = unknown> = Required<ActivityLogRecord<Tbody, Traw_response, Troute_params>> & BaseSystemFields<Texpand>
export type ApiKeyResponse<Texpand = unknown> = Required<ApiKeyRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	activity_log: ActivityLogRecord
	api_key: ApiKeyRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	activity_log: ActivityLogResponse
	api_key: ApiKeyResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'activity_log'): RecordService<ActivityLogResponse>
	collection(idOrName: 'api_key'): RecordService<ApiKeyResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
