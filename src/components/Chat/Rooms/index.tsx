import React from "react";
import axios from "axios";
import { useDebounce, useLocalStorage } from "../../../hooks";
import { useSocket } from "../../../contexts/socketContext";
import fetchAPI from "../../../utils/fetch";
import { sortStringArray } from "../../../common";

const handleAddToChat = (
  socket: any,
  user: any,
  setUserContactInfo: Function,
  setConversations: Function,
  setUserList: Function,
  currentUserID: string
) => {
  /* ==========================
  ? Set user contact profile
  =========================== */
  const { id, name, status } = user;
  setUserContactInfo({ id, name, status });
  /* ==========================
  ? Get conversation
  =========================== */
  (async () => {
    const memberIDList: Array<string> = [user.id, currentUserID];
    // ? Member ID list will be sorted in server
    const { data, status } = await fetchAPI.get(
      "/get-conversation-by-id-list",
      { params: { memberIDList: memberIDList.join("$") } }
    );

    switch (status) {
      case 201: {
        const currentConversation = { ...data.data };
        setConversations(currentConversation);
        break;
      }
      case 204: {
        setConversations(new Object());
        break;
      }
    }
    console.log(`User ${currentUserID} has join`);
    /* ==========================
    ? Add room 
    =========================== */
    const roomID: string = sortStringArray([currentUserID, user.id]).join("");
    socket.emit("JOIN_ROOM", roomID);
  })();
  /* ==========================
  ? Reset search user list
  =========================== */
  const resetUserList: Array<any> = new Array();
  setUserList(resetUserList);
};

export default function Rooms({}): JSX.Element {
  const { socket } = useSocket();
  const setUserContactInfo2 = useSocket().setUserContactInfo as Function;
  const setConversations2 = useSocket().setConversations as Function;
  const [searchKeyWord, setSearchKeyWord] = React.useState<string>("");
  const [userList, setUserList] = React.useState<Array<any>>([]);
  const [currentUserID, _] = useLocalStorage("id", "");
  const searchKeyWordDebounce = useDebounce(searchKeyWord, 500);
  React.useEffect(() => {
    (async () => {
      if (searchKeyWordDebounce !== "") {
        const { data, status } = await axios.get(
          `http://localhost:4000/search/${searchKeyWord}`
        );

        if (status === 200) {
          const resultUserList = [...data.data];
          setUserList(resultUserList);
        }
      }
    })();
  }, [searchKeyWordDebounce]);

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="search user"
          onChange={(e) => {
            setSearchKeyWord(e.target.value);
          }}
        />
        <ul>
          {userList.map((user: any, index: number) => {
            return (
              <li key={`${user.name}${index}`}>
                <button
                  onClick={() =>
                    handleAddToChat(
                      socket,
                      user,
                      setUserContactInfo2,
                      setConversations2,
                      setUserList,
                      currentUserID
                    )
                  }
                >
                  {user.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <span>Contact list</span>
        {/* 
        // TODO: HANDLE RENDER CONTACT LIST
        */}
      </div>
    </div>
  );
}
