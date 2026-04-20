import {notFound} from "next/navigation";
import {getRoleById} from "@/data/roles";
import {getAppConfig, getCurrentUser} from "@/actions/auth";
import {permissionValidator} from "@/lib/auth-helper";
import {PermissionIds} from "@/lib/app-navigation";
import {BackButton, FormLayout} from "@/components/common";
import {RoleForm} from "../_components";

export default async function CreateRoles({searchParams}: {searchParams: {roleId?: string}}) {
  // Logged In User
  const {data: user, status, message} = await getCurrentUser();
  if (!user || status !== 200) throw new Error(message);

  // App Config
  const {data: config, status: configStatus, message: configMessage} = await getAppConfig();
  if (!config || configStatus !== 200) throw new Error(configMessage);

  // Permissions
  const {isCreateAllowed} = permissionValidator(user, PermissionIds.Role);
  if (!isCreateAllowed) return notFound();

  // Role Object (If duplicating a role)
  const roleToCopy = searchParams.roleId ? await getRoleById(searchParams.roleId) : undefined;

  return (
    <div className="h-full flex flex-col items-start gap-1">
      <BackButton label="Back to roles list" />
      <FormLayout>
        <div className="space-y-1 mb-6">
          <h2 className="text-xl font-semibold">
            {roleToCopy ? `Duplicate ${roleToCopy.data?.title} Role` : "Create New Role"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {roleToCopy ? " Duplicate " : " Create "} role and assign permissions to them
            accordingly
          </p>
        </div>

        <RoleForm copyRole={roleToCopy?.data} currentUser={user} permissions={config.permissions} />
      </FormLayout>
    </div>
  );
}