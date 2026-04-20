"use server";
import {revalidatePath, revalidateTag} from "next/cache";
import {RedirectType, redirect} from "next/navigation";
import apiHelper, {api_endpoints, common_response, sendResponse} from "@/lib/api-helper";
import {AppRoutes} from "@/lib/app-routes";
import {logger} from "@/lib/logger";
import {CookieHelper} from "@/lib/storage.helper";
import {IInventory} from "@/types/inventory";

/**
 * Server action is used to delete a particular inventory item
 * @param inventory string
 * @returns ApiResponse
 */
export async function deleteInventory(inventory: string) {
  const authCookies = CookieHelper.getAuthCookies();
  if (!authCookies) return sendResponse(common_response.unauthorized);

  const token = authCookies?.authToken;
  const enpoint = api_endpoints.inventory.delete_inventory(inventory);

  logger("DELETE INVENTORY REQUEST PAYLOAD", enpoint);
  const response = await apiHelper.deleteRequest(enpoint, {}, token);

  // Error handling
  const error = await apiHelper.handleResponse(response);
  if (error) return sendResponse(error);

  // Response Prep
  const res = await response.json();
  logger("🎊 DELETE sucessfully", {res});
  revalidatePath(AppRoutes.INVENTORY);

  return sendResponse(res);
}

type UpdatePayload = Omit<IInventory, "departmentName" | "storeName" | "categoryName">;
/**
 * Server action is used to update an inventory item
 * @param inventory IInventory
 * @returns Redirect to Inventory page
 */
export async function updateInventory(inventory: UpdatePayload) {
  // Chech Authentication
  const {id, itemNum, itemName, cost, price, in_Stock, dept_Id, store_ID} = inventory;
  const authCookies = CookieHelper.getAuthCookies();
  if (!authCookies) return sendResponse(common_response.unauthorized);

  // Fetch from server
  const token = authCookies.authToken;
  const enpoint = api_endpoints.inventory.update_inventory;
  const request = {
    id: id,
    itemNum: itemNum.trim(),
    itemName: itemName.trim(),
    cost: cost,
    price: price,
    in_Stock: in_Stock,
  };

  logger("🎊 iNVENTORY UPDATE REQUEST", {request: request});
  const response = await apiHelper.put(enpoint, request, {}, token);

  // Error handling
  const error = await apiHelper.handleResponse(response);
  if (error) return sendResponse(error);
  const res = await response.json();
  logger("🎊 INVENTORY UPDATED", {res});
  revalidatePath(AppRoutes.ROLE);

  return redirect(
    `${AppRoutes.INVENTORY}?storeId=${store_ID}&deptId=${dept_Id}`,
    RedirectType.replace,
  );
}

type CreatePayload = Omit<IInventory, "departmentName" | "storeName" | "categoryName" | "id">;
/**
 * Server action is used to create a new inventory item
 * @param inventory IInventory
 * @returns Redirect to Inventory page
 */
export async function createInventory(inventory: CreatePayload) {
  // Chech Authentication
  const {itemNum, itemName, cost, price, in_Stock, dept_Id, store_ID} = inventory;
  const authCookies = CookieHelper.getAuthCookies();
  if (!authCookies) return sendResponse(common_response.unauthorized);

  // Fetch from server
  const token = authCookies.authToken;
  const enpoint = api_endpoints.inventory.create_inventory;
  const request = {
    itemNum: itemNum.trim(),
    itemName: itemName.trim(),
    cost: cost,
    price: price,
    in_Stock: in_Stock,
    dept_ID: dept_Id,
    store_ID: store_ID,
  };

  logger("INVENTORY CREATE REQUEST", {request});
  const response = await apiHelper.post(enpoint, request, {}, token);

  // Error handling
  const error = await apiHelper.handleResponse(response);
  if (error) return sendResponse(error);
  const res = await response.json();
  logger("🎊 INVENTORY CREATED", {res});
  revalidatePath(AppRoutes.INVENTORY);

  return redirect(
    `${AppRoutes.INVENTORY}?storeId=${store_ID}&deptId=${dept_Id}`,
    RedirectType.replace,
  );
}

/**
 * Server action is used to update pricing of inventory in a department
 * @param price string
 * @returns ApiResponse
 */
export async function updatePrice(
  price: number,
  storeId: string,
  deptId: string,
  inventories: string[],
) {
  // Chech Authentication
  const authCookies = CookieHelper.getAuthCookies();
  if (!authCookies) return sendResponse(common_response.unauthorized);

  // Fetch from server
  const token = authCookies.authToken;
  const enpoint = api_endpoints.inventory.update_inventory_price;
  const request = {
    percentage: price,
    storeId,
    deptId,
    inventoryIds: inventories,
  };

  logger("INVENTORY UPDATE PRICE REQUEST", {request});
  const response = await apiHelper.put(enpoint, request, {}, token);

  // Error handling
  const error = await apiHelper.handleResponse(response);
  if (error) return sendResponse(error);

  // Response Prep
  const res = await response.json();
  logger("🎊 CATEGORY UPDATE SUCCESS", {res});
  revalidateTag(AppRoutes.INVENTORY);

  return sendResponse(res);
}