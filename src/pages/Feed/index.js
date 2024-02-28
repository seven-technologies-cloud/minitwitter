import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AddPost } from "../../components/AddPost";
import { FeedFilter } from "../../components/FeedFilter";
import { PostsList } from "../../components/PostsList";
import { UserInfoModal } from "../../components/UserInfoModal";
import { validRoutes } from "../../constants/valid-routes";

import {
  AddPostContainer,
  FeedContainer,
  FeedHeaderContainer,
  FeedTitle,
  PostsListContainer,
} from "./styles";

export function FeedPage() {
  const [isUserInfoModalOpen, setUserInfoModalOpen] = useState(false);
  const [filterMode, setFilterMode] = useState(validRoutes.FILTER_ALL);

  const [selectedUserIdToShowOnModal, setSelectedUserIdToShowOnModal] =
    useState(false);

  const history = useHistory();

  const validateRoutesOnLoadPage = useCallback(() => {
    const currentPath = history.location.pathname;

    const isValidRoute =
      currentPath === `/${validRoutes.FILTER_ALL}` ||
      currentPath === `/${validRoutes.FILTER_FOLLOWING}`;

    if (!isValidRoute) {
      setFilterMode(validRoutes.FILTER_ALL);
      history.push(`/${validRoutes.FILTER_ALL}`);
    }

    if (currentPath.indexOf(validRoutes.FILTER_FOLLOWING) > -1) {
      setFilterMode(validRoutes.FILTER_FOLLOWING);
    }
  }, [history]);

  useEffect(() => {
    validateRoutesOnLoadPage();
  }, [validateRoutesOnLoadPage]);

  function handleOnChangeFitlerMode(filterMode) {
    setFilterMode(filterMode);
  }

  function handleOnClickToCloseUserInfoModal() {
    setUserInfoModalOpen(!setUserInfoModalOpen);

    setFilterMode(validRoutes.FILTER_ALL);
    history.push(`/${validRoutes.FILTER_ALL}`);
  }

  function handleOnProfileClick(selectedUserId) {
    setSelectedUserIdToShowOnModal(selectedUserId);
    setUserInfoModalOpen(true);

    setFilterMode(validRoutes.FILTER_ALL);
    history.push(`/${validRoutes.USER_INFO}`);
  }

  return (
    <FeedContainer>
      <AddPostContainer>
        <AddPost />
      </AddPostContainer>

      <FeedHeaderContainer>
        <FeedTitle>
          your <span>feed</span>.
        </FeedTitle>

        <FeedFilter selectedMode={handleOnChangeFitlerMode} />
      </FeedHeaderContainer>

      <PostsListContainer>
        <PostsList
          filterMode={filterMode}
          onProfileClick={handleOnProfileClick}
        />
      </PostsListContainer>

      {isUserInfoModalOpen && (
        <UserInfoModal
          userId={selectedUserIdToShowOnModal}
          onCloseModal={handleOnClickToCloseUserInfoModal}
        />
      )}
    </FeedContainer>
  );
}
