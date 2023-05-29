import { useSocket } from "../../../../contexts/socketContext";
import { ObjectDynamicValueAttributes } from "../../../../ts/interfaces/global_interfaces";
import {
  UserListStyled,
  UserItemStyled,
  UserListWrapperStyled,
  UserAvatarImgStyled,
  ButtonStyled,
  SpanStyled,
} from "./styles";

interface PropsAttributes {
  userList: Array<ObjectDynamicValueAttributes>;
  handleAddToChat: Function;
}

const DropDown = ({
  userList,
  handleAddToChat,
}: PropsAttributes): JSX.Element => {
  const _currentUserProfile: React.Dispatch<
    React.SetStateAction<ObjectDynamicValueAttributes>
  > = useSocket().currentUserProfile as React.Dispatch<
    React.SetStateAction<ObjectDynamicValueAttributes>
  >;
  const _setUserContactInfo: React.Dispatch<
    React.SetStateAction<ObjectDynamicValueAttributes>
  > = useSocket().setUserContactInfo as React.Dispatch<
    React.SetStateAction<ObjectDynamicValueAttributes>
  >;

  return (
    <UserListWrapperStyled>
      <UserListStyled>
        {userList.map((user: ObjectDynamicValueAttributes) => {
          const { id, name, type, avatar } = user;
          return (
            <UserItemStyled key={`${name}${id}${type}`}>
              <ButtonStyled
                onClick={() => {
                  handleAddToChat(
                    _currentUserProfile,
                    user,
                    _setUserContactInfo
                  );
                }}
              >
                <UserAvatarImgStyled src={avatar} alt={`${name}`} />
                <SpanStyled>{name}</SpanStyled>
              </ButtonStyled>
            </UserItemStyled>
          );
        })}
      </UserListStyled>
    </UserListWrapperStyled>
  );
};

export default DropDown;
