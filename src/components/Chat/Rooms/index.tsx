import { useState, useEffect, useRef, useCallback } from "react";
import { Grid } from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import SearchIcon from "@mui/icons-material/Search";
import LoadingIcon from "../../helpers/LoadingIcon";
import ContactList from "./ContactList";
import {
  HeaderStyled,
  ContentStyled,
  messageIconStyle,
  searchIconStyle,
  InputStyled,
  InputWrapperStyled,
} from "./styles";
import { useDebounce } from "../../../hooks";

import { API_RESPONSE_STATUS } from "../../../ts/enums/api_enums";
import UnibertyAPIServices from "../../../services/uniberty";
import { ObjectDynamicValueAttributes } from "../../../ts/interfaces/global_interfaces";
import DropDown from "./DropDown";

export default function Rooms({}): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchKeyWord, setSearchKeyWord] = useState<string>("");
  const [userSearchList, setUserSearchList] = useState<Array<any>>([]);
  const searchKeyWordDebounce = useDebounce(searchKeyWord, 500);

  const handleAddToChat = useCallback(
    async (
      currentUserProfile2: ObjectDynamicValueAttributes,
      userContactInfo2: ObjectDynamicValueAttributes,
      setUserContactInfo2: Function
    ) => {
      // * ========================================
      // ? Set user contact profile
      // * ========================================
      setUserContactInfo2({ ...userContactInfo2 });
      // * ========================================
      // ? Get conversation
      // * ========================================
      // * ========================================
      // ? Get contact list
      // * ========================================

      await UnibertyAPIServices.getContactList(
        currentUserProfile2.id,
        currentUserProfile2.type
      );

      // switch (status) {
      //   case API_RESPONSE_STATUS.SUCCESS: {
      //     // * ========================================
      //     // ? Handle Request Success
      //     // * ========================================

      //     switch (message) {
      //       case STATUS_MESSAGE.SUCCESS: {
      //         // * ========================================
      //         // ? User has been chatted before
      //         // * ========================================
      //         break;
      //       }
      //       case STATUS_MESSAGE.NO_CONTENT: {
      //         // * ========================================
      //         // ? User hasn't been chatted before
      //         // * ========================================
      //         break;
      //       }
      //     }
      //     break;
      //   }
      //   case API_RESPONSE_STATUS.FAIL: {
      //     // * ========================================
      //     // ! Handle Request Fail
      //     // * ========================================
      //     break;
      //   }
      // }
      // * ========================================
      //  ? Add room
      // * ========================================

      // * ========================================
      // ? Reset search user list
      // * ========================================
      if (inputRef.current != null) inputRef.current.value = "";
      setUserSearchList(new Array());
    },
    []
  );

  useEffect(() => {
    (async () => {
      if (searchKeyWordDebounce !== "") {
        setIsLoading(true);
        const searchResult: ObjectDynamicValueAttributes =
          (await UnibertyAPIServices.searchUserByName(
            searchKeyWordDebounce
          )) as ObjectDynamicValueAttributes;

        switch (searchResult.status) {
          case API_RESPONSE_STATUS.SUCCESS: {
            // * ============================================================
            // * Handle Case Search Success
            // * ============================================================
            setUserSearchList([...searchResult.data]);
            setIsLoading(false);
            break;
          }
          case API_RESPONSE_STATUS.FAIL: {
            // * ============================================================
            // ! Handle Case Search Fail
            // * ============================================================
            break;
          }
        }
      }
    })();
  }, [searchKeyWordDebounce]);

  return (
    <Grid
      item
      xs={3}
      sx={{ padding: "24px 32px 16px", borderRight: "1px solid #ebecf0" }}
    >
      <HeaderStyled>
        <ForumIcon sx={messageIconStyle} />
        <ContentStyled>Tin nhắn</ContentStyled>
      </HeaderStyled>
      <InputWrapperStyled>
        {isLoading ? <LoadingIcon /> : <SearchIcon sx={searchIconStyle} />}
        <InputStyled
          type="text"
          ref={inputRef}
          placeholder="Nhập tên cá nhân hoặc trường..."
          onChange={(e: any) => {
            setSearchKeyWord(e.target.value);
          }}
        />
        {userSearchList.length > 0 && (
          <DropDown
            userList={userSearchList}
            handleAddToChat={handleAddToChat}
          />
        )}
      </InputWrapperStyled>
      <ContactList handleAddToChat={handleAddToChat} />
    </Grid>
  );
}
