import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <Box
      // bg={useColorModeValue("gray.50", "gray.900")}
      bg={useColorModeValue("#27ae60", "#013220")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Container
        as={Stack}
        maxW="1300px"
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Text>© 2023 Bite And Diet</Text>
        <Stack direction={"row"} spacing={6}>
          <chakra.button
            bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
            rounded={"full"}
            w={8}
            h={8}
            cursor={"pointer"}
            as={"a"}
            href={"https://github.com/shashiyadav366"}
            display={"inline-flex"}
            alignItems={"center"}
            justifyContent={"center"}
            transition={"background 0.3s ease"}
            _hover={{
              bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
            }}
          >
            <FaGithub />
          </chakra.button>
        </Stack>
      </Container>
    </Box>
  );
}
