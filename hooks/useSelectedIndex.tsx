import { useEffect } from "react";

export function useSelectedIndex(
  commandsLength: number,
  selectedIndex: number,
  setSelectedIndex: (index: number) => void
) {
  useEffect(() => {
    if (selectedIndex >= commandsLength) setSelectedIndex(0);
  }, [commandsLength, selectedIndex, setSelectedIndex]);
}
