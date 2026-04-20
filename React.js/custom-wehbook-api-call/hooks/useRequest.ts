import { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { convertToFormData } from "../../utils/formdata";
import axiosInstance from "../axios";
import { useTranslation } from "react-i18next";
export enum HTTP_METHODS {
  GET = "get",
  POST = "post",
  FORMDATA = "form-data",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

interface IUseRequest {
  method?: HTTP_METHODS;
  path: string;
  config?: AxiosRequestConfig;
  isFormData?: boolean;
  errorToast?: boolean;
  successToast?: boolean;
}

interface IRequest {
  variables?: object;
  params?: object;
  id?: any;
  questionId?: any;
  onCompleted?: (res: { data: any }) => void;
  onError?: (error: Error) => void;
}

const useRequest = ({
  method = HTTP_METHODS.POST,
  path,
  config = {},
  isFormData = false,
  errorToast = false,
  successToast = false,
}: IUseRequest) => {
  const { t } = useTranslation();
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);

  const makeRequest = async ({
    variables,
    params,
    id,
    questionId,
    onCompleted,
    onError,
  }: IRequest): Promise<void> => {
    try {
      const ctrl = new AbortController();
      setController(ctrl);
      setLoading(true);
      if (id) {
        path = `${path}/${id}`;
      }
      if (questionId) {
        path = `${path}/${questionId}`;
      }
      if (params) {
        const queryString = new URLSearchParams(params as any).toString();
        path = `${path}?${queryString}`;
      }

      let res;
      if (method === HTTP_METHODS.GET) {
        res = await axiosInstance[method](path, {
          ...config,
          signal: ctrl.signal,
        });
      } else {
        // request with body
        if (isFormData && variables) {
          const formData = convertToFormData({ ...variables });
          res = await axiosInstance[method](path, formData, {
            ...config,
            "Content-Type": "multipart/form-data",
            signal: ctrl.signal,
          });
        } else {
          res = await axiosInstance[method](
            path,
            { ...variables },
            {
              ...config,
              signal: ctrl.signal,
            },
          );
        }
      }

      if (successToast) {
        toast.success(t(res?.data?.message));
      }
      setResponse(res.data);
      if (onCompleted && typeof onCompleted === "function") {
        onCompleted(res?.data?.data);
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        toast.error("Unauthorised");
        window.localStorage.clear();
        window.location.replace("/");
        return err;
      }
      if (errorToast && err?.response?.data?.message) {
        toast.error(t(err?.response?.data?.message));
      }

      setError(err?.message);
      if (onError && typeof onError === "function") {
        onError(err?.response?.data?.error?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearEffect: any = () => {
    // useEffect cleanup function
    return () => controller && controller.abort();
  };

  useEffect(clearEffect, [controller]);

  return [makeRequest, { response, error, loading } as any];
};

export default useRequest;

// const Sample = () => {

//   const [postUserData,{ response, error, loading }] = useMutate({
//     path:COMMON_URL.CREATE_USER,
//     onCompleted :() => {},
//     onError: () => {}
//     }
//   );

//   return;

//   <button onClick={()=>postUserData({variables:userData})}>Hello</button>;
// };
