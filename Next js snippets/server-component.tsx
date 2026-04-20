import {MODULE_CONSTANTS} from "@/lib/app-constants";
import {getCurrentUser} from "@/actions/auth";
import {permissionValidator} from "@/lib/auth-helper";
import {PermissionIds} from "@/lib/app-navigation";
import {InventoryFilterProps} from "@/types/inventory";
import {PercentageAdjuster} from "@/components/ui";
import {
  EffectiveDateHandler,
  InventoryFilter,
  InventoryHeader,
  InventoryList,
  PriceAdjustmentMessage,
  SaveAdjustment,
} from "./_components";

type PageProps = {
  searchParams: InventoryFilterProps;
};
export default async function Page({searchParams}: PageProps) {
  const invemtoryConstants = MODULE_CONSTANTS.INVENTORY;
  const {dept, search, store} = invemtoryConstants.list.filters;

  // Get Active user
  const {data: user, message} = await getCurrentUser();
  if (!user) throw new Error(message);

  const showStoreSelector = user.user.isSuperUser || !user.role.outlet || user.stores?.length > 1;

  // Permissions
  const {isCreateAllowed, isDeleteAllowed, isEditAllowed} = permissionValidator(
    user,
    PermissionIds.Inventory,
  );

  return (
    <div className="bg-card p-4 flex md:p-4 flex-col h-full overflow-hidden">
      <InventoryHeader {...invemtoryConstants} isCreateAllowed={isCreateAllowed} />
      <InventoryFilter
        dept={dept}
        search={search}
        store={{...store, isActive: showStoreSelector}}
      />

      <div className="mt-2 flex flex-col flex-1 overflow-auto">
        <div className="mb-6 bg-primary-light">
          <div className="p-3 flex items-center gap-1 mb-1">
            <PercentageAdjuster
              dept={searchParams.deptId}
              disable={!isEditAllowed}
              store={searchParams.storeId}
            />

            <EffectiveDateHandler
              disabled={!isEditAllowed || !searchParams.deptId || !searchParams.storeId}
            />
            <SaveAdjustment
              department={searchParams.deptId}
              disable={!isEditAllowed}
              store={searchParams.storeId}
            />
          </div>
          <PriceAdjustmentMessage />
        </div>
        <InventoryList
          filters={searchParams}
          isDeleteAllowed={isDeleteAllowed}
          isEditAllowed={isEditAllowed}
        />
      </div>
    </div>
  );
}