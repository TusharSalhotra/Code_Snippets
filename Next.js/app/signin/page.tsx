"use client"

import { Button, Checkbox, Input } from "@/components/ui"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { postRequest } from "@/utils/api-client"
import { appConstants, setCookie } from "@/utils"
import { AuthRequest, AuthResponse } from "@/types/user"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

enum Fields {
  EMAIL = "email",
  PASSWORD = "password",
  REMEMBER = "rememberMe",
}
// Form Type
type LoginForm = {
  [Fields.EMAIL]: string
  [Fields.PASSWORD]: string
  [Fields.REMEMBER]?: boolean
}

// Form Schema
const signInSchema = Yup.object().shape({
  [Fields.EMAIL]: Yup.string()
    .email()
    .required("Email is required")
    .min(2, "Title must be at least 2 characters long")
    .max(100, "Title must be at most 100 characters long"),
  [Fields.PASSWORD]: Yup.string()
    .required("Title is required")
    .min(2, "Title must be at least 2 characters long")
    .max(100, "Title must be at most 100 characters long"),
  [Fields.REMEMBER]: Yup.bool(),
})

export default function SignIn() {
  const content = useTranslations("signIn")
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control: { _formState },
  } = useForm<LoginForm>({
    resolver: yupResolver(signInSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await postRequest<AuthResponse, AuthRequest>("users/login", {
        email: data[Fields.EMAIL],
        password: data[Fields.PASSWORD],
      })

      if (res.data.token) {
        setCookie(appConstants.AUTH_COOKIE, res.data.token)
        router.replace("/")
      }
    } catch (e: any) {
      console.log("ERROR MESSAGE", e)
      toast.error(e.response.data.message)
    }
  }
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-8 self-center md:w-[20rem]">
      <h1 className="text-center text-h1 font-semibold text-white">
        {content("title")}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-6"
      >
        <Input
          placeholder={content("email")}
          error={errors?.[Fields.EMAIL]?.message}
          containerStyles="w-full"
          name={Fields.EMAIL}
          register={register}
          disabled={_formState.isSubmitting}
        />
        <Input
          placeholder={content("password")}
          type="password"
          error={errors?.[Fields.PASSWORD]?.message}
          name={Fields.PASSWORD}
          register={register}
          disabled={_formState.isSubmitting}
        />

        <div className="flex items-center justify-center gap-x-2 text-white">
          <Checkbox
            label={content("remember")}
            register={register}
            name={Fields.REMEMBER}
            disabled={_formState.isSubmitting}
          />
        </div>

        <Button type="submit" disabled={_formState.isSubmitting}>
          {_formState.isSubmitting ? content("loading") : content("login")}
        </Button>
      </form>
    </div>
  )
}
