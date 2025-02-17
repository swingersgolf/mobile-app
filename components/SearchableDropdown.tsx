import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Control, Controller } from "react-hook-form";
import { colors } from "@/constants/Colors";

interface DropdownItem {
  label: string;
  value: string;
}

interface SearchableDropdownProps {
  name: string;
  control: Control<unknown>;
  items: DropdownItem[];
  rules?: object;
  error?: string;
  placeholder?: string;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  name,
  control,
  items,
  rules,
  error,
  placeholder = "Search...",
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = search
    ? items.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase()),
      )
    : items;

  return (
    <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
      <View>
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, value } }) => (
            <>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setIsOpen(true)}
              >
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={search}
                    onFocus={() => setIsOpen(true)}
                    onChangeText={(text) => {
                      setSearch(text);
                      setIsOpen(true);
                    }}
                  />
                </View>
              </TouchableOpacity>
              {isOpen && (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: 200,
                    overflow: "scroll",
                    backgroundColor: colors.neutral.dark,
                    borderRadius: 10,
                    marginTop: 5,
                  }}
                >
                  <FlatList
                    data={filteredItems}
                    keyExtractor={(item) => item.value}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                    contentContainerStyle={{ flex: 1 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={{
                          padding: 10,
                        }}
                        onPress={() => {
                          onChange(item.value);
                          setSearch(item.label);
                          setIsOpen(false);
                        }}
                      >
                        <Text style={styles.itemText}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </>
          )}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  dropdown: {},
  item: {},
  itemText: {
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
});

export default SearchableDropdown;
