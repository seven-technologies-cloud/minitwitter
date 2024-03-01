import Modal from "react-modal";
import { useUserInfo } from "../../hooks/useUserInfo";
import { dateFormatter } from "../../utils/date";
import { AddPost } from "../AddPost";
import { Button } from "../Button";
// import { PostsList } from "../PostsList";
import { Divider } from "../PostsList/styles";
import {
  AddPostContainer,
  ButtonContainer,
  CloseButton,
  // UserFeedTitle,
  UsernameTitle,
  UserPropertiesContainer,
  UserPropertyItemWrapper,
} from "./styles";
import { api } from "../../api/axios";
import { toast } from "react-toastify";

export function UserInfoModal({ onCloseModal, userId }) {
  const {
    userFollows,
    postsAmount,
    selectedUser,
    loggedInUser,
    userFollowers,
    // followOrUnfollowUser,
    isLoggedInUserFollowing,
  } = useUserInfo({
    userToGetInfoId: userId,
  });

  const unfollow = async()=>{
    const data = {
      user_id: loggedInUser?.id_user,
      follows_user_id: selectedUser?.id_user
    }
    try {
      const res = api.delete(`userfollowsuser`, {data:data})
      console.log(res)
      toast.success("Unfollowed successfully")
    } catch (error) {
      console.log(error)
    }
  }
  const follow = async()=>{
    const data = {
      user_id: loggedInUser?.id_user,
      follows_user_id: selectedUser?.id_user
    }
    try {
      const res = api.post(`userfollowsuser`, data)
      console.log(res)
      toast.success("Followed successfully")
    } catch (error) {
      console.log(error)
    }
  }

  const isFallow = (isLoggedInUserFollowing?? []).some(fallow => fallow?.user_id === loggedInUser.id_user)

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
          <p>{dateFormatter(selectedUser?.date_joined)}</p>
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

      {userId !== loggedInUser?.id_user && (
        <ButtonContainer>
          <Button
            onClick={isFallow ? unfollow : follow}
            text={isFallow ? "Unfollow" : "Follow"}
          />
        </ButtonContainer>
      )}

      <Divider />

      <AddPostContainer>
        <AddPost />
      </AddPostContainer>

      <Divider />

      {/* <UserFeedTitle>
        {selectedUser?.name?.toLowerCase()} <span>posts</span>.
      </UserFeedTitle>

      <Divider />

      <PostsList userIdToFilterPosts={userId} /> */}
    </Modal>
  );
}
