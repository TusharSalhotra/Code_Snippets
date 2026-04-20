import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
export const HTTP_METHODS = {
  GET: "get",
  POST: "post",
  FORMDATA: "form-data",
  PUT: "put",
  PATCH: "patch",
};

type props = {
  method?: String;
  path: String;
  config?: any;
};

const useRequestApi = ({ method = "get", path, config }: props) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);

  const makeRequest = async ({
    variables,
    params,
    onCompleted,
    onError,
  }: any) => {
    try {
      const ctrl = new AbortController();
      setController(ctrl);
      setLoading(true);

      if (params) {
        const queryString = new URLSearchParams(params).toString();
        path = `${path}?${queryString}`;
      }

      let res;
      if (method.toLowerCase() === "post") {
        // request with body

        res = await axiosInstance[method.toLowerCase()](
          path,
          { ...variables },
          {
            ...config,
            signal: ctrl.signal,
          }
        );
      } else {
        res = await axiosInstance[method.toLowerCase()](path, {
          ...config,
          signal: ctrl.signal,
        });
      }

      setResponse(res.data);
      if (onCompleted && typeof onCompleted === "function") {
        onCompleted(res.data.data);
      }
    } catch (err: any) {
      setError(err.response.message);
      if (onError && typeof onError === "function") {
        onError();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // useEffect cleanup function
    return () => controller && (controller.abort() as any);
  }, [controller]);

  return [makeRequest, { response, error, loading }] as any;
};

export default useRequestApi;

// const Sample = () => {

//   const [getAnimes,{ response, error, loading }] = useRequestApi({
//     path:URLS.GET_ANIMES,
//     }
//   );

//   return;

//   <button onClick={()=>getAnimes()}>Hello</button>;
// };
