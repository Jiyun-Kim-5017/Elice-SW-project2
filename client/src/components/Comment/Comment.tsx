import React, { useEffect, useState } from "react";
import { useUpdateCommentMutation } from "../../slice/commentApi";
import { showModal } from "../../slice/modal";
import { useAppDispatch } from "../../store/hooks";
import { dateFormat } from "../../util/dateFormatting";
import { Button } from "../CommentList/CommentListStyle";
import UserProfile from "../UserProfile/UserProfile";
import type { CommentType } from "./../../type/comment";
import {
  ButtonContainer,
  Container,
  Content,
  Date,
  ProfileContainer,
  UpdateInput,
} from "./CommentStyle";

interface CommentProps {
  comment: CommentType;
  setDeleteCommentId: React.Dispatch<React.SetStateAction<string>>;
}

const Comment: React.FC<CommentProps> = ({ comment, setDeleteCommentId }) => {
  const [isClickUpdate, setIsClickUpdate] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState("");
  const [isAuthor, setIsAuthor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [
    onUpdateComment,
    { isError: isErrorUpdateComment, isSuccess: isSuccessUpdateComment },
  ] = useUpdateCommentMutation();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isErrorUpdateComment) {
      alert("댓글 수정에 실패했습니다.");
      setIsClickUpdate(false);
    }
    if (isSuccessUpdateComment) {
      setIsClickUpdate(true);
      window.location.reload();
    }
  }, [isErrorUpdateComment, isSuccessUpdateComment]);

  useEffect(() => {
    setIsAuthor(sessionStorage.getItem("email") === comment.author.email);
  }, [comment.author.email]);

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem("roleToken") === "admin");
  }, []);

  const onClickUpdate = () => setIsClickUpdate(true);

  const onClickCancle = () => setIsClickUpdate(false);

  const onClickDelete = () => {
    dispatch(
      showModal({
        title: "댓글 삭제",
        content: "이 댓글을 삭제하시겠습니까?",
        rightButton: "삭제",
      }),
    );
    setDeleteCommentId(comment.commentId);
  };

  const onClickUpdateCompleted = () => {
    onUpdateComment({
      commentId: comment.commentId,
      content: commentInput,
    });
  };

  const getButtonsForUserType = () => {
    if (isAuthor) {
      return isClickUpdate ? (
        <>
          <Button onClick={onClickUpdateCompleted}>수정 완료</Button>
          <Button onClick={onClickCancle}>취소</Button>
        </>
      ) : (
        <>
          <Button onClick={onClickUpdate}>수정</Button>
          <Button onClick={onClickDelete}>삭제</Button>
        </>
      );
    } else if (!isAuthor && isAdmin) {
      return <Button onClick={onClickDelete}>삭제</Button>;
    } else if (!isAuthor && !isAdmin) {
      return;
    }
  };

  return (
    <Container key={comment.commentId}>
      <ProfileContainer>
        <UserProfile user={comment.author} />
        <Date>({dateFormat(comment.createdAt)})</Date>
      </ProfileContainer>
      {isClickUpdate ? (
        <UpdateInput
          defaultValue={comment.content}
          onChange={(e) => setCommentInput(e.target.value)}
        />
      ) : (
        <Content>{comment.content}</Content>
      )}
      <ButtonContainer>{getButtonsForUserType()}</ButtonContainer>
    </Container>
  );
};

export default Comment;
