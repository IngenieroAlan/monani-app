import { StyleSheet } from "react-native";
import { colors } from "../utils/colors";
const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
export const cattleDetails = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cardsContainer: {
    padding: 10,
    gap: 20,
  },
  card: {
    backgroundColor: "#FFF",
    paddingTop: 4,
  },
  actionMenu: {
    flexDirection: "row",
    alignContent: "center",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 16,
  },
});

export default mainStyles;
