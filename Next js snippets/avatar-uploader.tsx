"use client";

import {useDropzone} from "react-dropzone";
import {MouseEvent, useMemo} from "react";
import {Button} from "@/components/ui/button";
import {Icon} from "@/lib/app-icons";
import {Avatar, AvatarFallback, AvatarImage} from "../ui";

type FileUploaderProp = {
  image: File | string;
  setImage: (file: File | null) => void;
  disabled?: boolean;
};

export function ProfileUploader({image, setImage, disabled}: FileUploaderProp) {
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop: async (acceptedFiles: File[]) => {
      setImage(acceptedFiles[0]);
    },
    multiple: false,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
  });

  const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setImage(null);
  };

  const imgUrl = useMemo(
    () => (image ? (typeof image === "string" ? image : URL.createObjectURL(image)) : ""),
    [image],
  );

  return (
    <>
      <div className="flex gap-2 items-start justify-start w-fit ">
        <input disabled={disabled} {...getInputProps()} className="cursor-pointer" />
        <Avatar
          className="relative w-32 h-32 shadow-lg rounded-full overflow-hidden"
          {...getRootProps()}
        >
          <AvatarImage alt="Profile picture" className="object-cover" src={imgUrl} />
          <AvatarFallback>PP</AvatarFallback>
        </Avatar>

        {imgUrl && (
          <Button
            className="text-gray-500"
            size={"icon"}
            variant="secondary"
            onClick={handleRemove}
          >
            <Icon.X className="h-5 w-5" size="sm" />
          </Button>
        )}
      </div>
    </>
  );
}
