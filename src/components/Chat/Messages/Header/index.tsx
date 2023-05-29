import { useSocket } from "../../../../contexts/socketContext";
import { ObjectDynamicValueAttributes } from "../../../../ts/interfaces/global_interfaces";
import {
  HeaderStyled,
  ContentStyled,
  AvatarStyled,
  NameStyled,
  StatusStyled,
} from "./styles";
const Header = ({}): JSX.Element => {
  const isOnline = useSocket().isOnline;
  const { id, name, avatar } = useSocket()
    .userContactInfo as ObjectDynamicValueAttributes;

  return (
    <HeaderStyled>
      <AvatarStyled src={avatar} width={40} height={40} />
      <ContentStyled>
        <NameStyled>
          {name || "Họ và tên tối đa 1 dòng tối đa 1 dòng"}
        </NameStyled>
        <StatusStyled>{isOnline ? "online" : "offline"}</StatusStyled>
      </ContentStyled>
    </HeaderStyled>
  );
};

export default Header;
