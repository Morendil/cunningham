import React from "react";
import { useMultipleSelection, useSelect } from "downshift";
import {
  getMultiOptionsFilter,
  SelectMultiAux,
  SubProps,
} from ":/components/Forms/Select/multi-common";
import { optionToString } from ":/components/Forms/Select/mono-common";

export const SelectMultiSimple = (props: SubProps) => {
  const options = React.useMemo(
    () => props.options.filter(getMultiOptionsFilter(props.selectedItems, "")),
    [props.selectedItems]
  );

  const useMultipleSelectionReturn = useMultipleSelection({
    selectedItems: props.selectedItems,
    onStateChange({ selectedItems: newSelectedItems, type }) {
      switch (type) {
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
        case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
          props.onSelectedItemsChange(newSelectedItems ?? []);
          break;
        default:
          break;
      }
    },
  });

  const downshiftReturn = useSelect({
    items: options,
    itemToString: optionToString,
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
        case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
        case useSelect.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep the menu open after selection.
            highlightedIndex: 0, // with the first option highlighted.
          };
      }
      return changes;
    },
    onStateChange: ({ type, selectedItem: newSelectedItem }) => {
      switch (type) {
        case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
        case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
        case useSelect.stateChangeTypes.ItemClick:
        case useSelect.stateChangeTypes.ToggleButtonBlur:
          if (newSelectedItem) {
            props.onSelectedItemsChange([
              ...props.selectedItems,
              newSelectedItem,
            ]);
          }
          break;
        default:
          break;
      }
    },
  });

  return (
    <SelectMultiAux
      {...props}
      options={options}
      labelAsPlaceholder={props.selectedItems.length === 0}
      selectedItems={props.selectedItems}
      downshiftReturn={{
        ...downshiftReturn,
        wrapperProps: {
          onClick: () => {
            if (!props.disabled) {
              downshiftReturn.toggleMenu();
            }
          },
        },
        toggleButtonProps: downshiftReturn.getToggleButtonProps({
          ...useMultipleSelectionReturn.getDropdownProps({
            preventKeyAction: downshiftReturn.isOpen,
          }),
          disabled: props.disabled,
          onClick: (e) => {
            // As the wrapper also has an onClick handler, we need to stop the event propagation here on it will toggle
            // twice the menu opening which will ... do nothing :).
            e.stopPropagation();
          },
        }),
      }}
      useMultipleSelectionReturn={useMultipleSelectionReturn}
    />
  );
};