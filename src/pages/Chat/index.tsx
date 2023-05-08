import SocketsProvider from "../../contexts/socketContext";

import RoomsContainer from "../../components/Chat/Rooms";
import MessagesContainer from "../../components/Chat/Messages";

const Chat = ({}): JSX.Element => {
  return (
    <SocketsProvider>
      <div style={{ display: "flex" }}>
        <RoomsContainer />
        <MessagesContainer />
      </div>
    </SocketsProvider>
  );
};

export default Chat;
