import axios from "axios";
import moment from "moment";
import { useState } from "react";
import styled from "styled-components";
import { movePage } from "../common/api/page";
import { getToken } from "../common/auth";
import CommentList from "./CommentList";
import CommentWrite from "./CommentWrite";
import PostBtn from "./PostBtn";

function Post({
  postId,
  title,
  body,
  nickname,
  liked,
  commented,
  likeCount,
  last,
  createdAt,
}: any) {
  const [comments, setComments] = useState<any[]>([]);
  const [like, setLike] = useState(liked | 0);
  const [comment, setComment] = useState(commented | 0);
  const [likeCountState, setLikeCount] = useState<number>(likeCount);
  const [isComment, setIsComment] = useState(false);
  const [isAddComment, setIsAddComment] = useState(false);
  const [text, setText] = useState("");
  const created = moment(createdAt).fromNow();
  let signIn = getToken().token ? true : false;

  const clickLike = async () => {
    if (!signIn) {
      movePage("/signin");
      return;
    }
    const urlLike = like ? 0 : 1;
    setLike((old: any) => (old ? 0 : 1));
    const token = getToken().token;
    if (urlLike) {
      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/community/like/${urlLike}?postId=${postId}`,
        undefined,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data) {
        setLikeCount((old) => old + 1);
      }
      console.log(data);
    } else {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/community/like/${urlLike}?postId=${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data) {
        setLikeCount((old) => old - 1);
      }
      console.log(data);
    }
  };

  const clickComment = async () => {
    setComment((old: any) => (old ? 0 : 1));
    // movePage(`/community/free?post=${postId}`);
    setIsComment((old) => !old);
    if (!isComment) {
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/community/all/comment?postId=${postId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken().token}`,
          },
        }
      );
      console.log(data);
      if (data) {
        setComments(data);
      }
    }
  };

  const clickAddComment = async () => {
    if (!signIn) {
      movePage("/signin");
      return;
    }
    setIsAddComment((old) => !old);
  };

  const postAddComment = async () => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/community/all/comment?postId=${postId}`,
      {
        text: text,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken().token}`,
        },
      }
    );
    console.log(data);
    if (data) {
      clickAddComment();
      setComments((old) => [data, ...old]);
    }
  };
  return (
    <>
      <section
        className="flex flex-col shadow-sm h-auto p-4 mb-2 bg-white "
        ref={last}
      >
        <section className="flex font-bold text-sm text-gray-400 justify-between items-center">
          <p>{title}</p>
          <p
            className="pt-1 pb-1 pl-2 pr-2 text-white rounded"
            style={{
              backgroundColor: "#333D4B",
            }}
          >
            자유
          </p>
        </section>
        <section
          className="flex flex-start font-semibold text-lg h-28"
          style={{
            color: "#333d4b",
          }}
        >
          <p>{body}</p>
        </section>
        <section className="flex justify-between items-center flex text-sm text-gray-400 font-bold">
          <section className="flex flex-1">
            {/* icon is freepik */}
            <section onClick={clickLike} className="cursor-pointer mr-6">
              <PostBtn
                text={likeCountState | 0}
                img={`../icon_like_${like}.png`}
              />
            </section>
            <section onClick={clickComment} className="cursor-pointer">
              <PostBtn text={"댓글"} img={`../icon_comment_${comment}.png`} />
            </section>
          </section>
          <section className="flex flex-row items-center justify-between w-32 text-xs">
            <p>{created}</p>
            <p>{nickname}</p>
          </section>
        </section>
        {isComment && (
          <>
            <section className="flex flex-col">
              <section className="flex items-center justify-between h-10 border-t border-b mt-4 mb-4">
                <section className="flex flex-row cursor-pointer items-center ">
                  <div className="rounded-full w-2 h-2 bg-green-400 mr-1 "></div>
                  <p className="font-semibold text-sm">최신순</p>
                </section>
                <button
                  className="font-semibold text-sm text-gray-400"
                  onClick={clickAddComment}
                >
                  댓글쓰기
                </button>
              </section>
            </section>
            <ul>
              {isAddComment && (
                <CommentWrite
                  setText={setText}
                  postAddComment={postAddComment}
                />
              )}
              {comments.length > 0
                ? comments.map((el) => <CommentList key={el.id} comment={el} />)
                : "댓글이 없습니다"}
            </ul>
          </>
        )}
      </section>
    </>
  );
}

export default Post;