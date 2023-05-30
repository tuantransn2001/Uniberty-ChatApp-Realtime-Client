import { ObjectDynamicValueAttributes } from "../../ts/interfaces/global_interfaces";
import { handleCatchError } from "../../utils/error/errorHandler";
import HttpException from "../../utils/error/errorCatcher";
import RestFullAPIRequest from "../../utils/fetch";
import {
  API_STUFF,
  API_RESPONSE_STATUS,
  STATUS_CODE,
  STATUS_MESSAGE,
} from "../../ts/enums/api_enums";

interface IDListAttributes {
  [type: string]: any;
}

const CHAT_BASE_URL: string = `${API_STUFF.chat_baseURL}/ws`;
class UnibertyAPIServices {
  public static async login(
    url: string,
    postData: ObjectDynamicValueAttributes
  ) {
    try {
      const loginResponse: ObjectDynamicValueAttributes = new Object();
      await (
        await RestFullAPIRequest.createInstance(API_STUFF.uniberty_baseURL)
      )
        .post(url, postData)
        .then(async (response: ObjectDynamicValueAttributes) => {
          // ? Handle get & return user information
          const { access_token, token_type, refresh_token } = response.data;
          Object.assign(loginResponse, {
            status: API_RESPONSE_STATUS.SUCCESS,
            access_token,
            token_type,
            refresh_token,
          });
        })
        .catch((err) => {
          const { message }: HttpException = err as HttpException;
          Object.assign(loginResponse, {
            status: API_RESPONSE_STATUS.FAIL,
            message,
          });
        });

      return loginResponse;
    } catch (err) {
      const customErr: HttpException = err as HttpException;
      handleCatchError(customErr);
    }
  }
  public static async getUserInfoByAccessToken(access_token: string) {
    try {
      const userInfoRes: ObjectDynamicValueAttributes = new Object();
      await (
        await RestFullAPIRequest.createInstance(API_STUFF.uniberty_baseURL)
      )
        .get("api/admin/me", {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((response: ObjectDynamicValueAttributes) => {
          const {
            id,
            name,
            first_name,
            last_name,
            email,
            phone,
            username,
            is_admin,
            is_active,
            created_at,
            updated_at,
          } = response.data;

          Object.assign(userInfoRes, {
            status: API_RESPONSE_STATUS.SUCCESS,
            data: {
              id,
              name,
              first_name,
              last_name,
              email,
              phone,
              username,
              is_admin,
              is_active,
              created_at,
              updated_at,
            },
          });
        })
        .catch((err) => {
          const customErr: HttpException = err as HttpException;
          Object.assign(userInfoRes, {
            status: API_RESPONSE_STATUS.FAIL,
            message: customErr.message,
          });
        });

      return userInfoRes;
    } catch (err) {
      const customErr: HttpException = err as HttpException;
      handleCatchError(customErr);
    }
  }
  public static async searchUserByName(inputName: string) {
    try {
      const searchResult: ObjectDynamicValueAttributes = {};
      await (
        await RestFullAPIRequest.createInstance(API_STUFF.uniberty_baseURL)
      )
        .get(
          `/api/admin/search-user-by-name?name=${inputName}&page=1&per_page=20`,
          { headers: { Authorization: `Bearer ${API_STUFF.token}` } }
        )
        .then((response: ObjectDynamicValueAttributes) => {
          Object.assign(searchResult, {
            status: API_RESPONSE_STATUS.SUCCESS,
            data: response.data.data,
          });
        })
        .catch((err: HttpException) => {
          Object.assign(searchResult, {
            status: API_RESPONSE_STATUS.FAIL,
            message: err.message,
          });
        });

      return searchResult;
    } catch (err) {
      const customErr: HttpException = err as HttpException;
      handleCatchError(customErr);
    }
  }
  public static async getConversation(
    members: Array<ObjectDynamicValueAttributes>
  ) {
    try {
      const getConversationResult: ObjectDynamicValueAttributes = {};

      await (
        await RestFullAPIRequest.createInstance(CHAT_BASE_URL)
      )
        .post(`conversation/get-by-members`, {
          members,
        })
        .then((response) => {
          switch (response.status) {
            case STATUS_CODE.STATUS_CODE_200: {
              Object.assign(getConversationResult, {
                status: STATUS_CODE.STATUS_CODE_200,
                message: STATUS_MESSAGE.SUCCESS,
                data: response.data.data,
              });
              break;
            }
            case STATUS_CODE.STATUS_CODE_404: {
              Object.assign(getConversationResult, {
                status: STATUS_CODE.STATUS_CODE_404,
                message: STATUS_MESSAGE.NOT_FOUND,
              });
              break;
            }
          }
        })
        .catch((err) => {
          const { message }: HttpException = err as HttpException;
          Object.assign(getConversationResult, {
            status: STATUS_CODE.STATUS_CODE_404,
            message,
          });
        });

      return getConversationResult;
    } catch (err) {
      const customErr: HttpException = err as HttpException;
      handleCatchError(customErr);
    }
  }
  public static async getContactList(id: string, type: string) {
    try {
      const contactListResult: ObjectDynamicValueAttributes = {};

      await (
        await RestFullAPIRequest.createInstance(CHAT_BASE_URL)
      )
        .get(`/conversation/contact`, {
          params: { id, type },
        })
        .then((response: ObjectDynamicValueAttributes) => {
          switch (response.status) {
            case STATUS_CODE.STATUS_CODE_200: {
              Object.assign(contactListResult, {
                status: STATUS_MESSAGE.SUCCESS,
                data: response.data.data,
              });
              break;
            }
          }
        })
        .catch((err: HttpException) => {
          Object.assign(contactListResult, {
            status: API_RESPONSE_STATUS.FAIL,
            message: err.message,
          });
        });

      return contactListResult;
    } catch (err) {
      const customErr: HttpException = err as HttpException;
      handleCatchError(customErr);
    }
  }
  public static async searchListUser(ids: IDListAttributes) {
    try {
      const searchListUserResult: ObjectDynamicValueAttributes = {};
      await (
        await RestFullAPIRequest.createInstance(API_STUFF.uniberty_baseURL)
      )
        .post(`/api/admin/search-list-user`, ids, {
          headers: { Authorization: `Bearer ${API_STUFF.token}` },
        })
        .then((response: ObjectDynamicValueAttributes) => {
          Object.assign(searchListUserResult, {
            status: API_RESPONSE_STATUS.SUCCESS,
            data: response.data,
          });
        });

      return searchListUserResult;
    } catch (err) {
      const customErr: HttpException = err as HttpException;
      handleCatchError(customErr);
    }
  }
}

export default UnibertyAPIServices;
