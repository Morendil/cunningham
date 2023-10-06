import React, { forwardRef, PropsWithChildren, ReactNode } from "react";
import { SelectMulti } from ":/components/Forms/Select/multi";
import { SelectMono } from ":/components/Forms/Select/mono";
import { FieldProps } from ":/components/Forms/Field";

export * from ":/components/Forms/Select/mono";
export * from ":/components/Forms/Select/multi";

export type OptionWithRender = {
  disabled?: boolean;
  value: string;
  label: string;
  render: () => ReactNode;
};

export type Option =
  | {
      disabled?: boolean;
      value?: string;
      label: string;
      render?: undefined;
    }
  | OptionWithRender;

export interface SelectHandle {
  blur: () => void;
}

export type SelectProps = PropsWithChildren &
  FieldProps & {
    label: string;
    hideLabel?: boolean;
    options: Option[];
    searchable?: boolean;
    name?: string;
    defaultValue?: string | number | string[];
    value?: string | number | string[];
    onChange?: (event: {
      target: { value: string | number | undefined | string[] };
    }) => void;
    onBlur?: (event: {
      target: { value: string | number | undefined | string[] };
    }) => void;
    disabled?: boolean;
    clearable?: boolean;
    multi?: boolean;
    showLabelWhenSelected?: boolean;
  };
export const Select = forwardRef<SelectHandle, SelectProps>((props, ref) => {
  if (props.defaultValue && props.value) {
    throw new Error(
      "You cannot use both defaultValue and value props on Select component",
    );
  }

  return props.multi ? (
    <SelectMulti {...props} ref={ref} />
  ) : (
    <SelectMono {...props} ref={ref} />
  );
});
