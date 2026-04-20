import axios, { AxiosResponse } from "axios"

export const instance = axios.create({
  baseURL: "/api",
})

instance.interceptors.request.use((config) => {
  return config
})

export async function getRequest<Response>(
  url: string
): Promise<AxiosResponse<Response>> {
  return await instance.get(url)
}

export async function postRequest<Response, Request>(
  url: string,
  body: Request,
  headers?: any
): Promise<AxiosResponse<Response>> {
  return await instance.post<any, AxiosResponse<Response>, Request>(url, body, {
    headers,
  })
}

export async function updateRequest<Response, Request>(
  url: string,
  data: Request,
  headers?: any
) {
  return await instance.put<any, Response, Request>(url, data, {
    headers,
  })
}
