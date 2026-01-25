import { useState, useEffect } from "react";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Collector,
  CreateCollectorRequest,
  UpdateCollectorRequest,
} from "@/types/collector";

interface CollectorFormProps {
  mode: "create" | "edit";
  initialData?: Collector;
  onSubmit: (data: CreateCollectorRequest | UpdateCollectorRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CollectorForm = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: CollectorFormProps) => {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    password: "",
    status: initialData?.status === "ACTIVE" ? "ACTIVE" : "INACTIVE",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        password: "",
        status:
          initialData.status === "ACTIVE" || initialData.status === "IDLE"
            ? "ACTIVE"
            : "INACTIVE",
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length > 255) {
      newErrors.fullName = "Full name must not exceed 255 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Email must be valid";
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (formData.phone.length > 50) {
      newErrors.phone = "Phone must not exceed 50 characters";
    }

    if (mode === "create" && !formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { name: string; value: string }
  ) => {
    const name = "name" in e ? e.name : e.target.name;
    const value = "value" in e ? e.value : e.target.value;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      password: true,
    });

    if (!validate()) {
      return;
    }

    if (mode === "create") {
      await onSubmit({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
    } else {
      const updateData: UpdateCollectorRequest = {};
      if (formData.fullName !== initialData?.fullName) {
        updateData.fullName = formData.fullName;
      }
      if (formData.email !== initialData?.email) {
        updateData.email = formData.email;
      }
      if (formData.phone !== initialData?.phone) {
        updateData.phone = formData.phone;
      }
      if (formData.status !== initialData?.status) {
        updateData.status = formData.status as "ACTIVE" | "INACTIVE";
      }
      if (formData.password) {
        // Note: Backend doesn't support password update in UpdateCollectorRequest
        // This would need to be a separate endpoint
      }
      await onSubmit(updateData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field orientation="vertical">
        <FieldLabel>
          <Label>Full Name</Label>
        </FieldLabel>
        <FieldContent>
          <Input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={() => handleBlur("fullName")}
            placeholder="Enter full name"
            aria-invalid={touched.fullName && !!errors.fullName}
          />
          <FieldError>{touched.fullName && errors.fullName}</FieldError>
        </FieldContent>
      </Field>

      <Field orientation="vertical">
        <FieldLabel>
          <Label>Email</Label>
        </FieldLabel>
        <FieldContent>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur("email")}
            placeholder="Enter email address"
            aria-invalid={touched.email && !!errors.email}
          />
          <FieldError>{touched.email && errors.email}</FieldError>
        </FieldContent>
      </Field>

      <Field orientation="vertical">
        <FieldLabel>
          <Label>Phone</Label>
        </FieldLabel>
        <FieldContent>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={() => handleBlur("phone")}
            placeholder="Enter phone number"
            aria-invalid={touched.phone && !!errors.phone}
          />
          <FieldError>{touched.phone && errors.phone}</FieldError>
        </FieldContent>
      </Field>

      {(mode === "create" || formData.password) && (
        <Field orientation="vertical">
          <FieldLabel>
            <Label>
              Password {mode === "edit" && "(leave blank to keep current)"}
            </Label>
          </FieldLabel>
          <FieldContent>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
              placeholder="Enter password"
              aria-invalid={touched.password && !!errors.password}
            />
            <FieldError>{touched.password && errors.password}</FieldError>
          </FieldContent>
        </Field>
      )}

      {mode === "edit" && (
        <Field orientation="vertical">
          <FieldLabel>
            <Label>Status</Label>
          </FieldLabel>
          <FieldContent>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                handleChange({ name: "status", value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : mode === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
};
