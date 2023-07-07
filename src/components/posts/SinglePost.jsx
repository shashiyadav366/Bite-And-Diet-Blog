import React, { useState } from "react";
import {
  Box,
  Heading,
  Link,
  Image,
  Text,
  Avatar,
  Flex,
  IconButton,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../../hooks/auths";
import { formatDistanceToNow } from "date-fns";
import {
  AiTwotoneHeart,
  AiOutlineHeart,
  AiFillDelete,
  AiFillEdit,
  AiOutlineSave,
} from "react-icons/ai";
import { useDeletePost, useToggleLike, useEditPost } from "../../hooks/posts";
import { Link as routerLink } from "react-router-dom";
import { useUser } from "../../hooks/user";

const SinglePost = ({ post }) => {
  const { user, isLoading: authLoading } = useAuth();
  const { id, likes, uid } = post;
  const isLiked = likes.includes(user?.id);
  const { toggleLike, isLoading } = useToggleLike({
    id,
    isLiked,
    uid: user?.id,
  });
  const { deletePost, isLoading: deleteLoading } = useDeletePost(id);
  const { user: users, isLoading: userLoading } = useUser(uid);
  const { editPost, isLoading: editLoading } = useEditPost();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedDesc, setEditedDesc] = useState(post.desc);

  const toast = useToast();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editedTitle || !editedDesc) {
      toast({
        title: "Title and Description cannot be empty",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const updatedPost = {
      id: post.id,
      title: editedTitle,
      desc: editedDesc,
    };

    editPost(updatedPost);
    setIsEditing(false);
  };

  return (
    <>
      <Box w="100%" key={post.id}>
        <Box borderRadius="lg" overflow="hidden">
          <Link textDecoration="none" _hover={{ textDecoration: "none" }}>
            <Image
              transform="scale(1.0)"
              src={post.imageUrl}
              alt="some text"
              width="100%"
              objectFit="cover"
              height={"400px"}
              transition="0.3s ease-in-out"
              _hover={{
                transform: "scale(1.05)",
              }}
            />
          </Link>
        </Box>
        {isEditing ? (
          <>
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              size="lg"
              marginBottom="2"
            />
            <Textarea
              value={editedDesc}
              onChange={(e) => setEditedDesc(e.target.value)}
              size="lg"
              resize="none"
              marginBottom="2"
            />
            <IconButton
              colorScheme="red"
              size="lg"
              icon={<AiOutlineSave />}
              isRound
              onClick={handleSave}
              isLoading={editLoading}
              variant="ghost"
            />
          </>
        ) : (
          <>
            <Heading fontSize="xl" marginTop="2">
              {post.title}
            </Heading>
            <Text as="p" fontSize="md" marginTop="2">
              {post.desc.substring(0, 150)}...
              <Link
                textDecoration="none"
                _hover={{ textDecoration: "none" }}
                as={routerLink}
                to={`/posts/${post?.id}`}
                color={"red"}
              >
                Read More
              </Link>
            </Text>
            <Box mt={"10px"}>
              <Flex align={"center"}>
                <Avatar name={users?.username} size={"sm"} />
                <Text casing={"capitalize"}>
                  <span style={{ paddingLeft: "10px" }}>
                    {formatDistanceToNow(post.date)} ago
                  </span>
                </Text>
                <IconButton
                  colorScheme="red"
                  onClick={toggleLike}
                  isLoading={authLoading || isLoading}
                  size="md"
                  icon={isLiked ? <AiTwotoneHeart /> : <AiOutlineHeart />}
                  isRound
                  variant="ghost"
                />
                <Text> {likes.length}</Text>
                {!authLoading && user?.id === uid && (
                  <>
                    <IconButton
                      colorScheme="red"
                      size="lg"
                      icon={<AiFillDelete />}
                      isRound
                      onClick={deletePost}
                      isLoading={deleteLoading}
                      variant="ghost"
                    />
                    <IconButton
                      colorScheme="red"
                      size="lg"
                      icon={<AiFillEdit />}
                      isRound
                      onClick={handleEdit}
                      variant="ghost"
                    />
                  </>
                )}
              </Flex>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default SinglePost;
