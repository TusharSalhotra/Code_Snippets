import fileDefault from "../../../assets/file-blank-solid-240.png";
import fileCSS from "../../../assets/file-css-solid-240.png";
import filePdf from "../../../assets/file-pdf-solid-240.png";
import filePng from "../../../assets/file-png-solid-240.png";

interface IImageConfig {
  default: string;
  pdf: string;
  png: string;
  css: string;
}

export const ImageConfig: IImageConfig = {
  default: fileDefault,
  pdf: filePdf,
  png: filePng,
  css: fileCSS,
};
