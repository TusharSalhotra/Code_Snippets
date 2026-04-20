import styled from "styled-components";
import Colors from "styles/Colors";

export const FileInputWrapper = styled.div`
  position: relative;
  width: 300px;
  height: 140px;
  border: 2px dashed ${Colors.Grey};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f8ff;
  &:hover {
    opacity: 0.6;
  }
`;
export const FileInputLabel = styled.div`
  text-align: center;
  color: #ccc;
  font-weight: 600;
  padding: 10px;
  height: 180px;
  .anticon {
    font-size: 160px;
  }
`;

export const DragDropImg = styled.div`
  width: 100px;
`;

export const FilesPreviewWrapper = styled.div`
  margin-top: 30px;
`;

export const FilesPreviewTitle = styled.div`
  margin-bottom: 20px;
`;

export const FileInput = styled.input`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

export const FileItem = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 10px;
  background-color: #f5f8ff;
  padding: 15px;
  border-radius: 20px;
  width: 330px;
`;

export const FileItemImage = styled.img`
  position: relative;
  display: flex;
  background-color: #f5f8ff;
`;
export const FileItemInfo = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 10px;
  background-color: #f5f8ff;
  padding: 15px;
  border-radius: 20px;
`;

export const DeleteIcon = styled.span`
  background-color: #fff;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: -5px;
  top: 8px;
  transform: translateY(-50%);
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 14px;
  cursor: pointer;

  &:hover {
    box-shadow: #00588b40 0px 0px 6px inset;
  }
  .ant-image-mask {
    display: none;
  }
`;
