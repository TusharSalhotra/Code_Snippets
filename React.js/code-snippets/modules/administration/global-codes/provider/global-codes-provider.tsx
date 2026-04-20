import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { codeFormSchema, CodeFormSchema } from "../schema";
import { Code, CodeCategory } from "../schema/types";
import { globalCodesService } from "../services/codes-service";
import { useCodesCategories } from "../hooks/codes-hook";

interface GlobalCodesContextProps {
  codes: Code[];
  isLoading: boolean;
  form: ReturnType<typeof useForm<CodeFormSchema>>;
  selectedCode: Code | null;
  onEdit: (_code: Code) => void;
  onCancel: () => void;
  onDelete: (_code: Code) => void;
  onFormSubmit: () => void;
  addCode: (_newCode: Omit<Code, "id">) => Promise<void>;
  updateCode: (_id: string, _updates: Partial<Code>) => Promise<void>;
  deleteCode: (_id: string) => Promise<void>;
}

export const GlobalCodesContext = createContext<
  GlobalCodesContextProps | undefined
>(undefined);

export const GlobalCodesProvider = ({ children }: React.PropsWithChildren) => {
  const categories = useCodesCategories();
  const [selectedCode, setselectedCode] = useState<Code | null>(null);
  const [codes, setCodes] = useState<Code[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Form
  const form = useForm<CodeFormSchema>({
    resolver: zodResolver(codeFormSchema),
    defaultValues: {
      category: null,
      code: "",
      description: "",
      tomrexName: "",
      active: true,
    },
  });
  const category = form.watch("category");

  // For selected code or new code
  useEffect(() => {
    if (selectedCode) {
      form.reset(selectedCode);
    } else {
      form.reset({
        category: categories[0] ?? null,
        code: "",
        description: "",
        tomrexName: "",
        active: true,
      });
    }
  }, [selectedCode, form]);

  // For category selection
  useEffect(() => {
    if (categories && categories.length > 0 && !category) {
      form.setValue("category", categories[0]);
    }
  }, [categories, form, category]);

  // Get codes when category changes
  useEffect(() => {
    if (category && category.categoryId && !selectedCode) {
      const isSameCategory = codes.some(
        (code) => code.category?.categoryId === category.categoryId,
      );

      const getCodes = async (category: CodeCategory) => {
        setIsLoading(true);
        try {
          const codes = await globalCodesService.getAll(category);
          setCodes(codes);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      !isSameCategory && getCodes(category);
    }
  }, [category]);

  // Form Handlers
  const onEdit = (code: Code) => {
    setselectedCode(code);
  };

  const onCancel = () => {
    setselectedCode(null);
    form.reset();
  };

  const onDelete = (code: Code) => {
    if (window.confirm("Are you sure you want to delete this code?")) {
      setselectedCode(null);
      deleteCode(code.id);
    }
  };

  const onFormSubmit = form.handleSubmit((data) => {
    if (selectedCode) {
      updateCode(selectedCode.id, data as Partial<Code>);
    } else {
      addCode(data as Omit<Code, "id">);
    }
  });

  // API Handlers
  const addCode = useCallback(
    async (newCode: Omit<Code, "id">) => {
      form.control._disableForm(true);
      try {
        const createdCode = await globalCodesService.create(newCode);
        form.reset({
          active: false,
          category: null,
          code: "",
          description: "",
          tomrexName: "",
        });
        setCodes((prev) => [...prev, createdCode]);
      } catch (error) {
        console.error(error);
      } finally {
        form.control._disableForm(false);
      }
    },
    [form],
  );

  const updateCode = useCallback(
    async (id: string, updates: Partial<Code>) => {
      form.control._disableForm(true);
      try {
        const res = await globalCodesService.update(id, updates);
        form.reset({
          active: false,
          category: null,
          code: "",
          description: "",
          tomrexName: "",
        });
        setCodes((prev) =>
          prev.map((code) => (code.id === id ? { ...code, ...res } : code)),
        );
      } catch (error) {
        console.error(error);
      } finally {
        form.control._disableForm(false);
      }
    },
    [form],
  );

  const deleteCode = useCallback(async (id: string) => {
    try {
      await globalCodesService.delete(id);
      setCodes((prev) => prev.filter((code) => code.id !== id));
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <GlobalCodesContext
      value={{
        codes,
        isLoading,
        form,
        selectedCode,
        onEdit,
        onCancel,
        onDelete,
        onFormSubmit,
        addCode,
        updateCode,
        deleteCode,
      }}
    >
      {children}
    </GlobalCodesContext>
  );
};

export const useGlobalCodes = () => {
  const context = useContext(GlobalCodesContext);
  if (context === undefined) {
    throw new Error("useGlobalCodes must be used within a GlobalCodesProvider");
  }
  return context;
};
