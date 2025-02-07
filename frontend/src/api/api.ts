/* tslint:disable */
/* eslint-disable */
/**
 * FastAPI
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { Configuration } from "./configuration";
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from "axios";
import globalAxios from "axios";
// Some imports not used depending on template conditions
// @ts-ignore
import {
  DUMMY_BASE_URL,
  assertParamExists,
  setApiKeyToObject,
  setBasicAuthToObject,
  setBearerAuthToObject,
  setOAuthToObject,
  setSearchParams,
  serializeDataIfNeeded,
  toPathString,
  createRequestFunction,
} from "./common";
import type { RequestArgs } from "./base";
// @ts-ignore
import {
  BASE_PATH,
  COLLECTION_FORMATS,
  BaseAPI,
  RequiredError,
  operationServerMap,
} from "./base";

/**
 *
 * @export
 * @interface HTTPValidationError
 */
export interface HTTPValidationError {
  /**
   *
   * @type {Array<ValidationError>}
   * @memberof HTTPValidationError
   */
  detail?: Array<ValidationError>;
}
/**
 *
 * @export
 * @interface ValidationError
 */
export interface ValidationError {
  /**
   *
   * @type {Array<ValidationErrorLocInner>}
   * @memberof ValidationError
   */
  loc: Array<ValidationErrorLocInner>;
  /**
   *
   * @type {string}
   * @memberof ValidationError
   */
  msg: string;
  /**
   *
   * @type {string}
   * @memberof ValidationError
   */
  type: string;
}
/**
 *
 * @export
 * @interface ValidationErrorLocInner
 */
export interface ValidationErrorLocInner {}

/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (
  configuration?: Configuration
) {
  return {
    /**
     *
     * @summary Upload File
     * @param {File} file
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    uploadFileUploadPost: async (
      file: File,
      options: RawAxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'file' is not null or undefined
      assertParamExists("uploadFileUploadPost", "file", file);
      const localVarPath = `/upload`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = {
        method: "POST",
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;
      const localVarFormParams = new ((configuration &&
        configuration.formDataCtor) ||
        FormData)();

      if (file !== undefined) {
        localVarFormParams.append("file", file as any);
      }

      localVarHeaderParameter["Content-Type"] = "multipart/form-data";

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };
      localVarRequestOptions.data = localVarFormParams;

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = DefaultApiAxiosParamCreator(configuration);
  return {
    /**
     *
     * @summary Upload File
     * @param {File} file
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async uploadFileUploadPost(
      file: File,
      options?: RawAxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>
    > {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.uploadFileUploadPost(file, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath =
        operationServerMap["DefaultApi.uploadFileUploadPost"]?.[
          localVarOperationServerIndex
        ]?.url;
      return (axios, basePath) =>
        createRequestFunction(
          localVarAxiosArgs,
          globalAxios,
          BASE_PATH,
          configuration
        )(axios, localVarOperationServerBasePath || basePath);
    },
  };
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = DefaultApiFp(configuration);
  return {
    /**
     *
     * @summary Upload File
     * @param {File} file
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    uploadFileUploadPost(
      file: File,
      options?: RawAxiosRequestConfig
    ): AxiosPromise<any> {
      return localVarFp
        .uploadFileUploadPost(file, options)
        .then((request) => request(axios, basePath));
    },
  };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
  /**
   *
   * @summary Upload File
   * @param {File} file
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  public uploadFileUploadPost(file: File, options?: RawAxiosRequestConfig) {
    return DefaultApiFp(this.configuration)
      .uploadFileUploadPost(file, options)
      .then((request) => request(this.axios, this.basePath));
  }
}
