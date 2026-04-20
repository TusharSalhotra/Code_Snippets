"use client";

import {useDropzone} from "react-dropzone";
import {MouseEvent} from "react";
import {Button} from "@/components/ui/button";
import {Icon} from "@/lib/app-icons";
import {compressImage} from "@/lib/utils";
import {Avatar, AvatarFallback} from "../ui";

type FileUploaderProp = {
  file: File | null;
  setFile: (file: File | null) => void;
  fileType?: "image" | "file";
  disabled?: boolean;
};

export function FileUploader({file, setFile, fileType, disabled}: FileUploaderProp) {
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop: async (acceptedFiles: File[]) => {
      const uploadedFile = acceptedFiles[0];

      if (fileType === "image") {
        try {
          const compressedFile = await compressImage(uploadedFile);
          setFile(compressedFile);
        } catch (error) {
          console.error("Error compressing image:", error);
          setFile(uploadedFile);
        }
      } else {
        setFile(uploadedFile);
      }
    },
    multiple: false,
    accept:
      fileType !== "image"
        ? {
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
          }
        : {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
          },
  });

  const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setFile(null);
  };

  return (
    <>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
          isDragActive ? "border-primary" : "border-gray-300"
        }`}
      >
        <input disabled={disabled} {...getInputProps()} />
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Avatar>
                <AvatarFallback className="bg-white">
                  <Icon.UploadDone className="text-green-500 text-lg" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
            </div>
            <Button size="icon" variant="ghost" onClick={handleRemove}>
              <Icon.X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div>
            <Icon.Upload className="w-10 h-10 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-600">
              Drag & drop a file here, or click to select a file
            </p>
            <p className="text-xs text-gray-400 mt-2">Supported file types: JPEG, PNG</p>
            <p className="text-xs text-gray-400">Max File Size: 5 Mb</p>
          </div>
        )}
      </div>
    </>
  );
}
