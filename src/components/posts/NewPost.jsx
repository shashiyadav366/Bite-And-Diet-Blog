import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  Textarea,
  useColorModeValue,
  FormHelperText,
  useToast,
} from "@chakra-ui/react";

import { useState } from "react";
import { storage } from "../../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { useAddPost } from "../../hooks/posts";
import { useAuth } from "../../hooks/auths";

export default function SimpleCard({ onModalClose }) {
  const { addPost, isLoading } = useAddPost();
  const { user, authLoading } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const toast = useToast();

  // State to store uploaded file
  const [file, setFile] = useState("");
  const [imgUrl, setimgUrl] = useState("");
  // progress
  const [percent, setPercent] = useState(0);
  // Handle file upload event and update state
  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  const handleAddPost = async (data) => {
    if (!file) {
      alert("Please upload an image first!");
      return; // Stop execution if no file is uploaded
    }

    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Show loading toast
    const toastId = toast({
      title: "Uploading Post",
      description: "Please wait while your post is being uploaded...",
      status: "info",
      duration: null,
      isClosable: false,
    });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(percent);
      },
      (err) => {
        console.log(err);
        // Hide loading toast on error
        toast.update(toastId, {
          status: "error",
          title: "Error",
          description: "An error occurred while uploading the post.",
          isClosable: true,
          duration: 5000,
        });
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setimgUrl(url);
          addPost({
            uid: user.id,
            title: data.title,
            desc: data.desc,
            imageUrl: url, // Use the url from the state variable
          });
          reset();
          onModalClose();
          // Hide loading toast and show success toast
          toast.update(toastId, {
            status: "success",
            title: "Post Uploaded",
            description: "Your post has been successfully uploaded.",
            isClosable: true,
            duration: 5000,
          });
        } catch (error) {
          console.log(error);
          // Hide loading toast and show error toast
          toast.update(toastId, {
            status: "error",
            title: "Error",
            description: "An error occurred while uploading the post.",
            isClosable: true,
            duration: 5000,
          });
        }
      }
    );
  };

  return (
    <Flex minH={"40vh"} align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"90%"} minW={"90%"} py={12}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Add new post</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack>
            <form onSubmit={handleSubmit(handleAddPost)}>
              <FormControl id="title">
                <FormLabel>Blog Title</FormLabel>
                <Input
                  type="text"
                  {...register("title", { required: true, maxLength: 120 })}
                />
                <FormHelperText>
                  Eg: The Art of Effective Communication
                </FormHelperText>
              </FormControl>
              <FormControl id="image"  py={4}>
                <FormLabel>Choose Image</FormLabel>

                <FormHelperText>
                  <div>
                    <input
                      type="file"
                      {...register("imageUrl", { required: true })}
                      onChange={handleChange}
                      accept="image/*"
                    />

                    {/* <p>{percent} "% done"</p> */}
                  </div>
                </FormHelperText>
              </FormControl>
              <FormControl id="desc">
                <FormLabel> Description</FormLabel>
                <Textarea
                  placeholder='I know writing can be tough, Just type "blah blah blah" to test things out!'
                  as={TextareaAutosize}
                  minRows={5}
                  resize={"none"}
                  {...register("desc", { required: true })}
                />
              </FormControl>
              <Stack spacing={10}>
                <Button
                  mt={"10px"}
                  bg={"#27ae60"}
                  color={"white"}
                  _hover={{
                    bg: "#27ae60",
                  }}
                  type="submit"
                  isLoading={isLoading}
                  loadingText={"Loading..."}
                >
                  Hit the Big Green Button! POST
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
