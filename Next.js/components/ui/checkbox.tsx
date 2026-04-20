import { cn } from "@/utils"
import { DetailedHTMLProps, InputHTMLAttributes, useId } from "react"
import { UseFormRegister } from "react-hook-form"

type CheckboxProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label?: string
  name: string
  register: UseFormRegister<any>
}
export function Checkbox(props: CheckboxProps) {
  const { name, register, ...other } = props
  const uniqueId = useId()
  const styles = cn(
    props.className,
    "bg-input text-white rounded-lg h-5 w-5 outline-none border-none"
  )
  return (
    <>
      <input
        {...other}
        id={props.id ?? uniqueId}
        type="checkbox"
        className={styles}
        {...register(name)}
      />
      {props.label && (
        <label htmlFor={props.id ?? uniqueId} className="text-xs font-normal">
          {props.label}
        </label>
      )}
    </>
  )
}
