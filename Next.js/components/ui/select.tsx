import { cn } from "@/utils"
import { DetailedHTMLProps, SelectHTMLAttributes } from "react"
import { UseFormRegister } from "react-hook-form"

type SelectProps = {
  error?: string
  containerStyles?: string
  options: { label: string | React.ReactNode; value: string }[]
  name: string
  register?: UseFormRegister<any>
} & DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>
export function Select(props: SelectProps) {
  const { error, options, containerStyles, name, register, ...other } = props
  const styles = cn(
    "min-w-[12rem] bg-input text-white rounded-lg h-2xl px-4 outline-none border border-transparent active:border-input",
    error ? "border-error text-error" : "",
    props.className
  )
  return (
    <div className={cn("flex flex-col", containerStyles)}>
      <select className={styles} {...other} {...register?.(name)}>
        {options.map((opt) => {
          return (
            <option
              disabled={opt.value.length === 0}
              key={opt.value}
              value={opt.value}
              className="text-white"
            >
              {opt.label}
            </option>
          )
        })}
      </select>
      <p className="ml-1.5 text-2xs text-error">{error}</p>
    </div>
  )
}
