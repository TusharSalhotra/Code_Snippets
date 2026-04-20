import { AppNavbar } from "@/components"

export default function WithNavLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="container mx-auto flex flex-1 flex-col pb-20 pt-10">
      <AppNavbar />
      {children}
    </div>
  )
}
