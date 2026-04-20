import { CloudUploadOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

// import uploadImg from "../../../assets/cloud-upload-regular-240.png";
import {
  DeleteIcon,
  FileInput,
  FileInputLabel,
  FileInputWrapper,
  FileItem,
  FileItemImage,
  FileItemInfo,
  FilesPreviewTitle,
  FilesPreviewWrapper,
} from "./DropFileInputStyles";
import { ImageConfig } from "./ImageConfig";

interface DropFileInputProps {
  accept?: string;
  imageShow?: string;
  onChange?: (files: File[]) => void;
  multipleMaxCount?: number;
  multipleMaxSize?: number;
  multiple?: boolean;
  onFileChange: (files: File[]) => void;
}

const DropFileInput = ({
  multipleMaxCount = 1,
  multiple = false,
  multipleMaxSize = 5,
  imageShow,
  accept = "image/png" || "image/jpeg",

  ...props
}: DropFileInputProps) => {
  const wrapperRef = useRef<HTMLDivElement | any>(null);

  const [fileList, setFileList] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<any>([]);

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e: React.FormEvent<HTMLInputElement>) => {
    if (fileList?.length === multipleMaxCount - 1) {
      const target = e.target as HTMLInputElement;
      const files = target.files as FileList;
      const newFile = files[0];
      if (newFile.type === accept) {
        const isImgSize = newFile.size / 1024 / 1024 < multipleMaxSize;
        if (isImgSize && newFile) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage((data: any) => [...data, reader.result]);
            imageShow(reader.result);
          };
          reader.readAsDataURL(newFile);
          const updatedList: File[] = [...fileList, newFile];
          setFileList(updatedList);
          props.onFileChange(updatedList);
        } else {
          toast.error(`Image must smaller than ${multipleMaxSize}MB`);
        }
      } else {
        toast.error("You can only upload JPG/PNG file!");
      }
    }
  };

  const fileRemove = (file: File) => {
    const updatedList: File[] = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    props.onFileChange(updatedList);
  };

  return (
    <>
      <FileInputWrapper
        ref={wrapperRef}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <FileInputLabel>
          {/* <img src={uploadImg} alt="" /> */}
          <CloudUploadOutlined />
          <p>Drag & Drop your files here</p>
        </FileInputLabel>
        <FileInput type="file" value="" onChange={onFileDrop} />
      </FileInputWrapper>
      {multiple && fileList.length > 0 ? (
        <FilesPreviewWrapper>
          <FilesPreviewTitle>Ready to upload</FilesPreviewTitle>
          {previewImage.map((item: any, index: number) => {
            return (
              <FileItem key={index}>
                <FileItemImage src={item || ImageConfig.default} alt="" />
                <FileItemInfo>
                  <p>{item.name}</p>
                  <p>{item.size}B</p>
                </FileItemInfo>
                <DeleteIcon onClick={() => fileRemove(item)}>x</DeleteIcon>
              </FileItem>
            );
          })}
        </FilesPreviewWrapper>
      ) : null}
    </>
  );
};

export default DropFileInput;
