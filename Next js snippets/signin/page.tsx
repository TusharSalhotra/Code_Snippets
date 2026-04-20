import Link from "next/link";
import {CardWrapper} from "@/components/common";
import {MODULE_CONSTANTS} from "@/lib/app-constants";
import {Button} from "@/components/ui";
import {AppRoutes} from "@/lib/app-routes";
import {LoginForm} from "../_components";

export default function Page() {
  const {signIn} = MODULE_CONSTANTS.AUTH;

  return (
    <>
      <CardWrapper
        className="flex flex-col gap-4 min-w-full md:min-w-[28rem] shadow-none border-none bg-transparent"
        description={
          <span className="text-muted-foreground text-sm">{signIn.form.description}</span>
        }
        header={<h2 className="text-3xl font-bold">{signIn.form.title}</h2>}
      >
        <LoginForm />
      </CardWrapper>

      <div className="absolute bottom-4 flex justify-between items-baseline">
        <h5 className="flex-1 text-xs font-medium">Enroll in SHA Program </h5>
        <Button asChild className="text-xs text-primary" variant={"link"}>
          <Link href={AppRoutes.ACH}>Fill ACH Form</Link>
        </Button>
      </div>
    </>
  );
}
