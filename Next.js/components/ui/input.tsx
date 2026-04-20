import { cn } from "@/utils"
import { DetailedHTMLProps, InputHTMLAttributes } from "react"
import { UseFormRegister } from "react-hook-form"

type InputProps = {
  error?: string
  containerStyles?: string
  name: string
  register: UseFormRegister<any>
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
export function Input(props: InputProps) {
  const { error, containerStyles, name, register, ...other } = props
  const styles = cn(
    "bg-input placeholder-white text-white rounded-lg h-2xl px-4 outline-none border border-transparent active:border-input",
    error ? "border-error text-error placeholder-error" : "",
    props.className
  )
  return (
    <div className={cn("flex flex-col", containerStyles)}>
      <input {...other} className={styles} {...register(name)} />
      <p className="ml-1.5 text-2xs text-error">{error}</p>
    </div>
  )
}
