"use client";

// MultiSelect compound component for choosing multiple values from a
// searchable dropdown. There's no Radix primitive for multi-select, so
// unlike this repo's other Radix-backed components, selection state is
// tracked here via context (controlled via `values`/`onValuesChange`, with
// an uncontrolled fallback) rather than delegated to an underlying primitive.
import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@utils/cn";
import { Button } from "@components/primitives/button/button";
import { Badge } from "@components/primitives/badge/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@components/primitives/popover/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@components/primitives/command/command";
import {
  multiSelectTriggerVariants,
  multiSelectPlaceholderVariants,
  multiSelectSingleValueVariants,
  multiSelectValueVariants,
  multiSelectBadgeVariants,
  multiSelectItemIndicatorVariants,
} from "@components/primitives/multi-select/multi-select.variants";
import type {
  MultiSelectContextValue,
  MultiSelectProps,
  MultiSelectTriggerProps,
  MultiSelectValueProps,
  MultiSelectContentProps,
  MultiSelectItemProps,
  MultiSelectGroupProps,
  MultiSelectSeparatorProps,
} from "@components/primitives/multi-select/multi-select.types";

const MultiSelectContext: React.Context<MultiSelectContextValue | null> =
  React.createContext<MultiSelectContextValue | null>(null);

function useMultiSelectContext(): MultiSelectContextValue {
  const context: MultiSelectContextValue | null =
    React.useContext(MultiSelectContext);
  if (!context) {
    throw new Error("useMultiSelectContext must be used within a MultiSelect.");
  }
  return context;
}

// Debounces a callback; used so overflow isn't re-measured on every resize tick.
function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: unknown, ...args: Parameters<T>): void {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Root: owns the open/selected state and shares both via context.
function MultiSelect({
  children,
  values,
  defaultValues,
  onValuesChange,
  single = false,
}: MultiSelectProps): React.JSX.Element {
  const [open, setOpen]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ] = React.useState<boolean>(false);
  const [internalValues, setInternalValues]: [
    Set<string>,
    React.Dispatch<React.SetStateAction<Set<string>>>,
  ] = React.useState<Set<string>>(new Set<string>(values ?? defaultValues));
  const selectedValues: Set<string> = React.useMemo<Set<string>>(
    () => (values ? new Set<string>(values) : internalValues),
    [values, internalValues],
  );
  const [items, setItems]: [
    Map<string, React.ReactNode>,
    React.Dispatch<React.SetStateAction<Map<string, React.ReactNode>>>,
  ] = React.useState<Map<string, React.ReactNode>>(
    new Map<string, React.ReactNode>(),
  );

  const toggleValue: (value: string) => void = React.useCallback(
    (value: string): void => {
      const getNewSet: (prev: Set<string>) => Set<string> = (
        prev: Set<string>,
      ): Set<string> => {
        if (single) {
          return prev.has(value) ? new Set<string>() : new Set<string>([value]);
        }
        const newSet: Set<string> = new Set<string>(prev);
        if (newSet.has(value)) {
          newSet.delete(value);
        } else {
          newSet.add(value);
        }
        return newSet;
      };
      setInternalValues(getNewSet);
      onValuesChange?.([...getNewSet(selectedValues)]);
      if (single) setOpen(false);
    },
    [single, selectedValues, onValuesChange],
  );

  const onItemAdded: (value: string, label: React.ReactNode) => void =
    React.useCallback((value: string, label: React.ReactNode): void => {
      setItems((prev: Map<string, React.ReactNode>) => {
        if (prev.get(value) === label) return prev;
        return new Map<string, React.ReactNode>(prev).set(value, label);
      });
    }, []);

  const contextValue: MultiSelectContextValue =
    React.useMemo<MultiSelectContextValue>(
      () => ({
        open,
        setOpen,
        selectedValues,
        single,
        toggleValue,
        items,
        onItemAdded,
      }),
      [open, selectedValues, single, toggleValue, items, onItemAdded],
    );

  return (
    <MultiSelectContext.Provider value={contextValue}>
      <Popover open={open} onOpenChange={setOpen} modal>
        {children}
      </Popover>
    </MultiSelectContext.Provider>
  );
}

// Trigger button that opens the dropdown.
const MultiSelectTrigger: React.ForwardRefExoticComponent<
  MultiSelectTriggerProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement, MultiSelectTriggerProps>(
  ({ className, children, ...props }: MultiSelectTriggerProps, ref) => {
    const { open }: MultiSelectContextValue = useMultiSelectContext();

    return (
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          {...props}
          variant={props.variant ?? "outline"}
          role={props.role ?? "combobox"}
          aria-expanded={props["aria-expanded"] ?? open}
          data-slot="multi-select-trigger"
          className={cn(multiSelectTriggerVariants(), className)}
        >
          {children}
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
    );
  },
);
MultiSelectTrigger.displayName = "MultiSelectTrigger";

// Renders the placeholder or the row of selected-value chips. Not forwardRef
// (unlike this repo's other sub-parts): its DOM node is only needed internally
// to measure overflow, so there's no external ref to merge with.
function MultiSelectValue({
  placeholder,
  clickToRemove = true,
  className,
  overflowBehavior = "wrap-when-open",
  ...props
}: MultiSelectValueProps): React.JSX.Element {
  const {
    selectedValues,
    toggleValue,
    items,
    open,
    single,
  }: MultiSelectContextValue = useMultiSelectContext();
  const [overflowAmount, setOverflowAmount]: [
    number,
    React.Dispatch<React.SetStateAction<number>>,
  ] = React.useState<number>(0);
  const valueRef: React.RefObject<HTMLDivElement | null> =
    React.useRef<HTMLDivElement | null>(null);
  const overflowRef: React.RefObject<HTMLDivElement | null> =
    React.useRef<HTMLDivElement | null>(null);

  const shouldWrap: boolean =
    overflowBehavior === "wrap" ||
    (overflowBehavior === "wrap-when-open" && open);

  const checkOverflow: () => void = React.useCallback((): void => {
    const containerElement: HTMLDivElement | null = valueRef.current;
    if (containerElement === null) return;

    const overflowElement: HTMLDivElement | null = overflowRef.current;
    const overflowItems: NodeListOf<HTMLElement> =
      containerElement.querySelectorAll<HTMLElement>("[data-selected-item]");

    if (overflowElement !== null) overflowElement.style.display = "none";
    overflowItems.forEach((child: HTMLElement): void => {
      child.style.removeProperty("display");
    });

    let amount: number = 0;
    for (let i: number = overflowItems.length - 1; i >= 0; i--) {
      const child: HTMLElement = overflowItems[i];
      if (containerElement.scrollWidth <= containerElement.clientWidth) {
        break;
      }
      amount = overflowItems.length - i;
      child.style.display = "none";
      overflowElement?.style.removeProperty("display");
    }
    setOverflowAmount(amount);
  }, []);

  const handleResize: (node: HTMLDivElement | null) => void = React.useCallback(
    (node: HTMLDivElement | null): void => {
      valueRef.current = node;
      if (node === null) return;

      const mutationObserver: MutationObserver = new MutationObserver(
        checkOverflow,
      );
      const resizeObserver: ResizeObserver = new ResizeObserver(
        debounce(checkOverflow, 100),
      );

      mutationObserver.observe(node, {
        childList: true,
        attributes: true,
        attributeFilter: ["class", "style"],
      });
      resizeObserver.observe(node);
    },
    [checkOverflow],
  );

  if (selectedValues.size === 0 && placeholder) {
    return (
      <span
        data-slot="multi-select-placeholder"
        className={cn(multiSelectPlaceholderVariants())}
      >
        {placeholder}
      </span>
    );
  }

  if (single && selectedValues.size > 0) {
    const firstValue: string | undefined = [...selectedValues][0];
    return (
      <span
        data-slot="multi-select-single-value"
        className={cn(multiSelectSingleValueVariants())}
      >
        {firstValue !== undefined ? items.get(firstValue) : null}
      </span>
    );
  }

  return (
    <div
      {...props}
      ref={handleResize}
      data-slot="multi-select-value"
      className={cn(
        multiSelectValueVariants(),
        shouldWrap && "h-full flex-wrap",
        className,
      )}
    >
      {[...selectedValues]
        .filter((value: string): boolean => items.has(value))
        .map((value: string) => (
          <Badge
            key={value}
            variant="outline"
            data-selected-item
            className={cn(multiSelectBadgeVariants())}
            onClick={
              clickToRemove
                ? (event: React.MouseEvent<HTMLDivElement>): void => {
                    event.stopPropagation();
                    toggleValue(value);
                  }
                : undefined
            }
          >
            {items.get(value)}
            {clickToRemove && (
              <X className="size-2 text-[var(--cuix-colors-muted-foreground)]" />
            )}
          </Badge>
        ))}
      <Badge
        variant="outline"
        ref={overflowRef}
        style={{
          display: overflowAmount > 0 && !shouldWrap ? "block" : "none",
        }}
      >
        +{overflowAmount}
      </Badge>
    </div>
  );
}

// Dropdown panel; wraps Command, optionally with a search input. A hidden
// duplicate of `children` is always mounted so MultiSelectItem's effects
// (which register labels into the shared `items` map) run even while the
// popover itself is closed — otherwise closed-state chip labels would be blank.
function MultiSelectContent({
  search = true,
  children,
  ...props
}: MultiSelectContentProps): React.JSX.Element {
  const canSearch: boolean = typeof search === "object" ? true : search;
  const noSearchFocusRef: React.RefObject<HTMLButtonElement | null> =
    React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (!canSearch) {
      noSearchFocusRef.current?.focus();
    }
  }, [canSearch]);

  return (
    <>
      <div style={{ display: "none" }}>
        <Command>
          <CommandList>{children}</CommandList>
        </Command>
      </div>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command {...props}>
          {canSearch ? (
            <CommandInput
              placeholder={
                typeof search === "object" ? search.placeholder : undefined
              }
            />
          ) : (
            <button ref={noSearchFocusRef} className="sr-only" />
          )}
          <CommandList>
            {canSearch && (
              <CommandEmpty>
                {typeof search === "object" ? search.emptyMessage : undefined}
              </CommandEmpty>
            )}
            {children}
          </CommandList>
        </Command>
      </PopoverContent>
    </>
  );
}

// Selectable option row.
function MultiSelectItem({
  value,
  children,
  badgeLabel,
  onSelect,
  ...props
}: MultiSelectItemProps): React.JSX.Element {
  const { toggleValue, selectedValues, onItemAdded }: MultiSelectContextValue =
    useMultiSelectContext();
  const isSelected: boolean = selectedValues.has(value);

  React.useEffect(() => {
    onItemAdded(value, badgeLabel ?? children);
  }, [value, children, onItemAdded, badgeLabel]);

  return (
    <CommandItem
      {...props}
      value={value}
      onSelect={(currentValue: string): void => {
        toggleValue(value);
        onSelect?.(currentValue);
      }}
    >
      <Check
        className={cn(
          multiSelectItemIndicatorVariants(),
          isSelected ? "opacity-100" : "opacity-0",
        )}
      />
      {children}
    </CommandItem>
  );
}

// Groups a labeled section of options.
function MultiSelectGroup(props: MultiSelectGroupProps): React.JSX.Element {
  return <CommandGroup {...props} />;
}

// Thin divider between groups of options.
function MultiSelectSeparator(
  props: MultiSelectSeparatorProps,
): React.JSX.Element {
  return <CommandSeparator {...props} />;
}

export {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectGroup,
  MultiSelectSeparator,
};
