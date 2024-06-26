export type OptionType = {
  id: string;
  displayName: string;
};

export interface RadioGroupProps {
  title: string;
  options: OptionType[];
  sharedSelectedItem: SharedValue<string>;
  sharedLoading: SharedValue<boolean>;
  onSave: () => void;
}

export interface RadioItemProps {
  item: OptionType;
  sharedSelectedItem: SharedValue<string>;
  sharedLoading: SharedValue<boolean>;
  onSave: () => void;
}
