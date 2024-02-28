import Modal from "react-modal";
import { useUserInfo } from "../../hooks/useUserInfo";
import { dateFormatter } from "../../utils/date";
import { AddPost } from "../AddPost";
import { Button } from "../Button";
import { PostsList } from "../PostsList";
import { Divider } from "../PostsList/styles";
import {
  AddPostContainer,
  ButtonContainer,
  CloseButton,
  UserFeedTitle,
  UsernameTitle,
  UserPropertiesContainer,
  UserPropertyItemWrapper,
} from "./styles";

export function UserInfoModal({ onCloseModal, userId }) {
  const {
    userFollows,
    postsAmount,
    selectedUser,
    loggedInUser,
    userFollowers,
    followOrUnfollowUser,
    isLoggedInUserFollowing,
  } = useUserInfo({
    userToGetInfoId: userId,
  });

  return (
    <Modal
      isOpen={true}
      className="react-modal-content"
      overlayClassName="react-modal-overlay"
    >
      <CloseButton onClick={onCloseModal} />

      <UsernameTitle>
        <span>@</span>
        {selectedUser?.username}
      </UsernameTitle>

      <Divider />

      <UserPropertiesContainer>
        <UserPropertyItemWrapper>
          <h4>Member since:</h4>
          <p>{dateFormatter(selectedUser?.createdAt)}</p>
        </UserPropertyItemWrapper>

        <UserPropertyItemWrapper>
          <h4>Followers</h4>
          <p>{userFollowers}</p>
        </UserPropertyItemWrapper>

        <UserPropertyItemWrapper>
          <h4>Following</h4>
          <p>{userFollows}</p>
        </UserPropertyItemWrapper>

        <UserPropertyItemWrapper>
          <h4>Posts</h4>
          <p>{postsAmount}</p>
        </UserPropertyItemWrapper>
      </UserPropertiesContainer>

      <Divider />

      {userId !== loggedInUser.id && (
        <ButtonContainer>
          <Button
            onClick={followOrUnfollowUser}
            text={isLoggedInUserFollowing ? "Unfollow" : "Follow"}
          />
        </ButtonContainer>
      )}

      <Divider />

      <AddPostContainer>
        <AddPost />
      </AddPostContainer>

      <Divider />

      <UserFeedTitle>
        {selectedUser?.name?.toLowerCase()} <span>posts</span>.
      </UserFeedTitle>

      <Divider />

      <PostsList userIdToFilterPosts={userId} />
    </Modal>
  );
}
