import { Box, Textarea, Input, Button } from "@alleshq/reactants";
import { Image, Link, X } from "react-feather";
import { useState, createRef } from "react";
import axios from "axios";
import Router from "next/router";
import { Gluejar } from "@charliewilco/gluejar";
import { useUser } from "../utils/userContext";
import config from "../config";

export default function PostField(props) {
  const user = useUser();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlInput, setUrlInput] = useState(false);
  const [url, setUrl] = useState("");
  const [imageUpload, setImage] = useState();
  const [pastedImages, setPastedImages] = useState(0);
  const imageInput = createRef();

  // Form Submit
  const submit = () => {
    setLoading(true);
    axios
      .post(
        "/api/posts",
        {
          content: value.trim(),
          image: imageUpload,
          url: !url
            ? null
            : url.startsWith("https://")
            ? url
            : url.startsWith("http://")
            ? url.replace("http://", "https://")
            : `https://${url}`,
          parent: props.parent,
        },
        {
          headers: {
            Authorization: user.sessionToken,
          },
        }
      )
      .then((res) => Router.push("/p/[id]", `/p/${res.data.id}`))
      .catch(() => setLoading(false));
  };

  // Image Upload
  const handleImageUpload = (f) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(f);
  };

  return (
    <Box>
      <Gluejar
        onPaste={({ images }) => {
          setPastedImages(images.length);
          if (images.length > pastedImages && !imageUpload) {
            const blobUrl = images[images.length - 1];
            axios
              .get(blobUrl, {
                responseType: "blob",
              })
              .then((res) => handleImageUpload(res.data))
              .catch(() => {});
          }
        }}
        onError={() => {}}
      >
        {() => (
          <>
            <Textarea
              placeholder={props.placeholder}
              className="text-base border-none pb-0"
              rows={4}
              onChange={(e) => setValue(e.target.value)}
              style={{
                background: "transparent",
              }}
            />

            {imageUpload && (
              <div className="p-5 pb-0 relative">
                <img
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600"
                  src={imageUpload}
                  onError={() => setImage()}
                />
                <Box
                  className="absolute top-8 right-8 cursor-pointer transition duration-100 hover:opacity-75 rounded-full p-2 text-gray-600 dark:text-gray-300"
                  onClick={() => setImage()}
                >
                  <X />
                </Box>
              </div>
            )}

            <input
              ref={imageInput}
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files[0])}
            />

            {urlInput && (
              <div className="m-5 mb-0">
                <Input
                  label="Link"
                  placeholder="https://abaer.dev"
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            )}

            <Box.Footer className="flex justify-between mt-5">
              <div className="flex">
                <Button
                  color="transparent"
                  style={{ padding: "0 5px" }}
                  size="lg"
                  onClick={() => imageInput.current.click()}
                >
                  <Image size={20} strokeWidth={1.75} />
                </Button>

                <Button
                  color="transparent"
                  style={{ padding: "0 5px" }}
                  size="lg"
                  onClick={() => setUrlInput(true)}
                >
                  <Link size={20} strokeWidth={1.75} />
                </Button>
              </div>

              <div className="flex space-x-3">
                {value.length > config.maxPostLength - 100 && (
                  <span
                    className={`my-auto block ${
                      value.length >= config.maxPostLength ? "text-danger" : ""
                    }`}
                  >
                    {config.maxPostLength - value.length}
                  </span>
                )}
                <Button
                  disabled={!value.trim() || value.length > config.maxPostLength}
                  loading={loading}
                  size="sm"
                  onClick={submit}
                >
                  {props.parent ? "Reply" : "Post"}
                </Button>
              </div>
            </Box.Footer>
          </>
        )}
      </Gluejar>
    </Box>
  );
}
